"use server";

import { revalidatePath } from "next/cache";
import { getCurrentContext } from "@/lib/auth/session";
import { assertCanManageBudget } from "@/lib/auth/roles";
import { recordAudit } from "@/lib/audit";
import { sendSlack } from "@/lib/slack/client";
import { buildSlackMessage } from "@/lib/slack/payload";
import { getDashboardData } from "@/lib/budget/queries";

/** 테스트 메시지 발송 (총무 이상) */
export async function sendTestMessage() {
  const { club, role, membership } = await getCurrentContext();
  if (!club) throw new Error("동호회가 없습니다.");
  assertCanManageBudget(role);

  const result = await sendSlack(
    club.id,
    buildSlackMessage({ type: "TEST", clubName: club.name }),
  );
  await recordAudit({
    clubId: club.id,
    actorUserId: membership?.userId ?? null,
    action: "SLACK_TEST",
    entityType: "SlackIntegration",
    summary: result.ok ? "테스트 발송 성공" : `테스트 발송 실패: ${result.error}`,
  });

  revalidatePath("/settings/slack");
}

/** 현재 예산 현황 알림 발송 (총무 이상) */
export async function sendBudgetAlert() {
  const { club, role, membership } = await getCurrentContext();
  if (!club) throw new Error("동호회가 없습니다.");
  assertCanManageBudget(role);

  const d = await getDashboardData(club.id, new Date());
  const result = await sendSlack(
    club.id,
    buildSlackMessage({
      type: "BUDGET_ALERT",
      clubName: club.name,
      remaining: d.summary.remaining,
      expiring: d.summary.expiringAmount,
      daysLeft: d.summary.daysUntilExpiration,
      missingReceipts: d.missingReceiptCount,
      unlinked: d.unlinkedCount,
    }),
  );
  await recordAudit({
    clubId: club.id,
    actorUserId: membership?.userId ?? null,
    action: "SLACK_ALERT",
    entityType: "SlackIntegration",
    summary: result.ok ? "예산 알림 발송 성공" : `예산 알림 발송 실패: ${result.error}`,
  });

  revalidatePath("/settings/slack");
}
