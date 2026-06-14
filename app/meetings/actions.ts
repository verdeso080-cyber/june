"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentContext } from "@/lib/auth/session";
import { assertCanOperate } from "@/lib/auth/roles";
import { recordAudit } from "@/lib/audit";
import {
  defaultExpiry,
  generateCheckinToken,
  isCheckinValid,
} from "@/lib/attendance/session";

/** 모임 생성 (회장 이상) */
export async function createMeeting(formData: FormData) {
  const { club, role, membership } = await getCurrentContext();
  if (!club) throw new Error("동호회가 없습니다.");
  assertCanOperate(role);

  const title = String(formData.get("title") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim() || null;
  const description = String(formData.get("description") ?? "").trim() || null;
  const startsAtStr = String(formData.get("startsAt") ?? "");
  const endsAtStr = String(formData.get("endsAt") ?? "");

  if (!title) throw new Error("제목을 입력하세요.");
  const startsAt = new Date(startsAtStr);
  if (Number.isNaN(startsAt.getTime())) throw new Error("시작 시간을 확인하세요.");
  const endsAt = endsAtStr ? new Date(endsAtStr) : null;

  const meeting = await prisma.meeting.create({
    data: {
      clubId: club.id,
      title,
      location,
      description,
      startsAt,
      endsAt: endsAt && !Number.isNaN(endsAt.getTime()) ? endsAt : null,
      createdById: membership?.userId ?? null,
    },
  });

  await recordAudit({
    clubId: club.id,
    actorUserId: membership?.userId ?? null,
    action: "MEETING_CREATE",
    entityType: "Meeting",
    entityId: meeting.id,
    summary: `모임 생성: ${title}`,
  });

  revalidatePath("/meetings");
  redirect(`/meetings/${meeting.id}`);
}

/** 참여 응답 (회원) */
export async function respondAttendance(formData: FormData) {
  const { membership } = await getCurrentContext();
  if (!membership) throw new Error("멤버십이 없습니다.");
  const meetingId = String(formData.get("meetingId") ?? "");
  const response = String(formData.get("response") ?? "");
  if (!["GOING", "MAYBE", "NOT_GOING"].includes(response)) {
    throw new Error("응답 값이 올바르지 않습니다.");
  }

  await prisma.attendance.upsert({
    where: {
      meetingId_membershipId: { meetingId, membershipId: membership.id },
    },
    create: { meetingId, membershipId: membership.id, response },
    update: { response },
  });

  revalidatePath(`/meetings/${meetingId}`);
}

/** QR 체크인 세션 열기 (회장 이상) */
export async function openCheckinSession(formData: FormData) {
  const { club, role, membership } = await getCurrentContext();
  if (!club) throw new Error("동호회가 없습니다.");
  assertCanOperate(role);
  const meetingId = String(formData.get("meetingId") ?? "");

  // 기존 세션 비활성화 후 새로 발급
  await prisma.checkinSession.updateMany({
    where: { meetingId, active: true },
    data: { active: false },
  });
  const now = new Date();
  await prisma.checkinSession.create({
    data: {
      meetingId,
      token: generateCheckinToken(),
      expiresAt: defaultExpiry(now),
      active: true,
    },
  });

  await recordAudit({
    clubId: club.id,
    actorUserId: membership?.userId ?? null,
    action: "CHECKIN_OPEN",
    entityType: "Meeting",
    entityId: meetingId,
    summary: "QR 체크인 세션 발급",
  });

  revalidatePath(`/meetings/${meetingId}`);
}

/** QR 체크인 (회원) — 토큰 검증 + 중복 방지 */
export async function checkIn(formData: FormData) {
  const { membership } = await getCurrentContext();
  if (!membership) throw new Error("멤버십이 없습니다. 먼저 로그인하세요.");
  const token = String(formData.get("token") ?? "");
  const meetingId = String(formData.get("meetingId") ?? "");

  const session = await prisma.checkinSession.findUnique({ where: { token } });
  if (!session || session.meetingId !== meetingId) {
    throw new Error("유효하지 않은 체크인 링크입니다.");
  }
  if (!isCheckinValid(session, new Date())) {
    throw new Error("만료되었거나 종료된 체크인입니다.");
  }

  // 중복 체크인은 unique 제약 + upsert 로 1건만 유지
  await prisma.attendance.upsert({
    where: {
      meetingId_membershipId: { meetingId, membershipId: membership.id },
    },
    create: {
      meetingId,
      membershipId: membership.id,
      checkedInAt: new Date(),
      method: "QR",
    },
    update: { checkedInAt: new Date(), method: "QR" },
  });

  revalidatePath(`/meetings/${meetingId}`);
}

/** 운영자 수동 출석 보정 (회장 이상) */
export async function correctAttendance(formData: FormData) {
  const { role, membership } = await getCurrentContext();
  assertCanOperate(role);
  const meetingId = String(formData.get("meetingId") ?? "");
  const membershipId = String(formData.get("membershipId") ?? "");
  const present = String(formData.get("present") ?? "") === "true";

  await prisma.attendance.upsert({
    where: { meetingId_membershipId: { meetingId, membershipId } },
    create: {
      meetingId,
      membershipId,
      checkedInAt: present ? new Date() : null,
      method: "MANUAL",
    },
    update: {
      checkedInAt: present ? new Date() : null,
      method: "MANUAL",
    },
  });

  await recordAudit({
    actorUserId: membership?.userId ?? null,
    action: "ATTENDANCE_CORRECT",
    entityType: "Attendance",
    entityId: `${meetingId}:${membershipId}`,
    summary: present ? "수동 출석 처리" : "수동 결석 처리",
  });

  revalidatePath(`/meetings/${meetingId}`);
}
