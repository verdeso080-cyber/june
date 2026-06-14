import "server-only";
import { prisma } from "@/lib/db";
import { buildSlackMessage, type SlackEvent, type SlackMessage } from "@/lib/slack/payload";

/**
 * Slack 발송 클라이언트 (서버 전용).
 *
 * - Webhook URL 은 환경변수 SLACK_WEBHOOK_URL 에서만 읽습니다.
 * - "server-only" 로 클라이언트 번들 포함을 방지합니다.
 */

export function readWebhookUrl(): string | null {
  const url = process.env.SLACK_WEBHOOK_URL;
  return url && url.trim() !== "" ? url.trim() : null;
}

export interface SendResult {
  ok: boolean;
  error?: string;
}

export async function sendSlack(
  clubId: string,
  message: SlackMessage,
): Promise<SendResult> {
  const url = readWebhookUrl();
  if (!url) {
    return {
      ok: false,
      error:
        "Slack Webhook URL 이 설정되지 않았습니다. 서버 환경변수 SLACK_WEBHOOK_URL 을 설정하세요.",
    };
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    });
    await recordStatus(clubId, res.ok);
    return res.ok
      ? { ok: true }
      : { ok: false, error: `Slack 응답 오류 (${res.status})` };
  } catch (e) {
    await recordStatus(clubId, false);
    return { ok: false, error: e instanceof Error ? e.message : "발송 실패" };
  }
}

async function recordStatus(clubId: string, ok: boolean) {
  const now = new Date();
  await prisma.slackIntegration.upsert({
    where: { clubId },
    create: {
      clubId,
      configured: true,
      lastSuccessAt: ok ? now : null,
      lastFailureAt: ok ? null : now,
    },
    update: ok ? { configured: true, lastSuccessAt: now } : { lastFailureAt: now },
  });
}

/** 이벤트 알림 (실패해도 본 작업을 막지 않음). */
export async function notify(clubId: string, event: SlackEvent): Promise<void> {
  if (!readWebhookUrl()) return; // 미설정이면 조용히 무시
  try {
    await sendSlack(clubId, buildSlackMessage(event));
  } catch {
    // 알림 실패는 본 작업에 영향 주지 않음
  }
}
