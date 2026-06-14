"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getCurrentContext } from "@/lib/auth/session";
import { assertCanOperate } from "@/lib/auth/roles";
import { recordAudit } from "@/lib/audit";

/** 공지 작성 (회장 이상) */
export async function createAnnouncement(formData: FormData) {
  const { club, role, membership } = await getCurrentContext();
  if (!club) throw new Error("동호회가 없습니다.");
  assertCanOperate(role);

  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const pinned = String(formData.get("pinned") ?? "") === "on";
  if (!title || !body) throw new Error("제목과 내용을 입력하세요.");

  const a = await prisma.announcement.create({
    data: {
      clubId: club.id,
      title,
      body,
      pinned,
      createdById: membership?.userId ?? null,
    },
  });
  await recordAudit({
    clubId: club.id,
    actorUserId: membership?.userId ?? null,
    action: "ANNOUNCEMENT_CREATE",
    entityType: "Announcement",
    entityId: a.id,
    summary: `공지 작성: ${title}`,
  });

  revalidatePath("/announcements");
}

/** FAQ 작성 (회장 이상) */
export async function createFaq(formData: FormData) {
  const { club, role, membership } = await getCurrentContext();
  if (!club) throw new Error("동호회가 없습니다.");
  assertCanOperate(role);

  const question = String(formData.get("question") ?? "").trim();
  const answer = String(formData.get("answer") ?? "").trim();
  if (!question || !answer) throw new Error("질문과 답변을 입력하세요.");

  await prisma.faq.create({
    data: { clubId: club.id, question, answer },
  });
  await recordAudit({
    clubId: club.id,
    actorUserId: membership?.userId ?? null,
    action: "FAQ_CREATE",
    entityType: "Faq",
    summary: `FAQ 작성: ${question}`,
  });

  revalidatePath("/faq");
}
