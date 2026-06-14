"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { createSession } from "@/lib/auth/session";
import {
  isValidNickname,
  normalizeNickname,
  validateInvite,
} from "@/lib/auth/invite";
import { recordAudit } from "@/lib/audit";
import { destroySession } from "@/lib/auth/session";

/** 초대코드 + 닉네임으로 가입/로그인 */
export async function joinWithInvite(formData: FormData) {
  let dest = "/dashboard";

  try {
    const code = String(formData.get("code") ?? "").trim();
    const nickname = normalizeNickname(String(formData.get("nickname") ?? ""));

    if (!code) throw new Error("초대코드를 입력하세요.");
    if (!isValidNickname(nickname)) {
      throw new Error("닉네임은 1~20자로 입력하세요.");
    }

    const invite = await prisma.inviteCode.findUnique({ where: { code } });
    const check = validateInvite(invite, new Date());
    if (!check.ok || !invite) {
      throw new Error(check.reason ?? "초대코드 오류");
    }

    let membership = await prisma.membership.findFirst({
      where: { clubId: invite.clubId, nickname },
    });

    if (!membership) {
      const user = await prisma.user.create({ data: { name: nickname } });
      membership = await prisma.membership.create({
        data: {
          userId: user.id,
          clubId: invite.clubId,
          nickname,
          role: invite.role,
          status: "ACTIVE",
        },
      });
      await prisma.inviteCode.update({
        where: { id: invite.id },
        data: { usedCount: { increment: 1 } },
      });
      await recordAudit({
        clubId: invite.clubId,
        actorUserId: user.id,
        action: "MEMBER_JOIN",
        entityType: "Membership",
        entityId: membership.id,
        summary: `초대코드 가입: ${nickname} (${invite.role})`,
      });
    }

    await createSession(membership.id);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "알 수 없는 오류가 발생했습니다.";
    dest = `/login?error=${encodeURIComponent(msg)}`;
  }

  redirect(dest);
}

export async function logout() {
  await destroySession();
  redirect("/login");
}
