"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentContext } from "@/lib/auth/session";
import { assertCanOperate } from "@/lib/auth/roles";
import { recordAudit } from "@/lib/audit";
import { saveUpload } from "@/lib/storage";

/** 활동 이야기 생성 (회장 이상) */
export async function createActivity(formData: FormData) {
  const { club, role, membership } = await getCurrentContext();
  if (!club) throw new Error("동호회가 없습니다.");
  assertCanOperate(role);

  const title = String(formData.get("title") ?? "").trim();
  const activityDateStr = String(formData.get("activityDate") ?? "");
  const location = String(formData.get("location") ?? "").trim() || null;
  const content = String(formData.get("content") ?? "").trim() || null;
  const meetingIdRaw = String(formData.get("meetingId") ?? "");
  const meetingId = meetingIdRaw ? meetingIdRaw : null;

  if (!title) throw new Error("제목을 입력하세요.");
  const activityDate = new Date(activityDateStr);
  if (Number.isNaN(activityDate.getTime())) throw new Error("활동일을 확인하세요.");

  const activity = await prisma.activity.create({
    data: {
      clubId: club.id,
      title,
      activityDate,
      location,
      content,
      meetingId,
      createdById: membership?.userId ?? null,
    },
  });

  await recordAudit({
    clubId: club.id,
    actorUserId: membership?.userId ?? null,
    action: "ACTIVITY_CREATE",
    entityType: "Activity",
    entityId: activity.id,
    summary: `활동 생성: ${title}`,
  });

  revalidatePath("/activities");
  redirect(`/activities/${activity.id}`);
}

/** 거래를 활동에 연결/해제 (회장 이상) */
export async function setTransactionLink(formData: FormData) {
  const { club, role } = await getCurrentContext();
  if (!club) throw new Error("동호회가 없습니다.");
  assertCanOperate(role);

  const transactionId = String(formData.get("transactionId") ?? "");
  const activityIdRaw = String(formData.get("activityId") ?? "");
  const link = String(formData.get("link") ?? "") === "true";
  const activityId = link ? activityIdRaw : null;

  await prisma.budgetTransaction.update({
    where: { id: transactionId },
    data: { activityId },
  });

  revalidatePath(`/activities/${activityIdRaw}`);
  revalidatePath("/dashboard");
}

/** 사진 업로드 (모든 회원) */
export async function uploadPhoto(formData: FormData) {
  const { membership } = await getCurrentContext();
  if (!membership) throw new Error("멤버십이 없습니다.");
  const activityId = String(formData.get("activityId") ?? "");
  const file = formData.get("file");
  if (!(file instanceof File)) throw new Error("사진 파일을 선택하세요.");

  const fileUrl = await saveUpload(file);
  await prisma.activityPhoto.create({
    data: {
      activityId,
      uploadedById: membership.userId,
      fileUrl,
      status: "VISIBLE",
    },
  });

  revalidatePath(`/activities/${activityId}`);
}

/** 사진 상태 변경.
 * - 보고서 포함/제외 등 운영 작업은 회장 이상만.
 * - 본인 사진 삭제 요청(DELETE_REQUESTED)은 업로더 본인 가능.
 */
export async function setPhotoStatus(formData: FormData) {
  const { role, membership } = await getCurrentContext();
  const photoId = String(formData.get("photoId") ?? "");
  const status = String(formData.get("status") ?? "");
  const activityId = String(formData.get("activityId") ?? "");

  const photo = await prisma.activityPhoto.findUnique({ where: { id: photoId } });
  if (!photo) throw new Error("사진을 찾을 수 없습니다.");

  const isOwner = membership?.userId && photo.uploadedById === membership.userId;
  const isOperator = role === "OWNER" || role === "PRESIDENT";

  if (status === "DELETE_REQUESTED") {
    if (!isOwner && !isOperator) {
      throw new Error("본인 사진만 삭제 요청할 수 있습니다.");
    }
  } else {
    // 보고서 포함 선택 등은 운영자만
    if (!isOperator) {
      throw new Error("권한이 없습니다. 사진 선택은 회장/운영자만 가능합니다.");
    }
  }

  await prisma.activityPhoto.update({
    where: { id: photoId },
    data: { status },
  });

  revalidatePath(`/activities/${activityId}`);
}
