import { formatKRW } from "@/lib/format";

/**
 * Slack 메시지 생성 (순수 함수, 테스트 대상).
 * Incoming Webhook 은 { text } 형태를 받습니다.
 */

export type SlackEvent =
  | { type: "TEST"; clubName: string }
  | {
      type: "MEETING_CREATED";
      clubName: string;
      title: string;
      date: string;
      location?: string | null;
    }
  | {
      type: "REPORT_GENERATED";
      clubName: string;
      reportTitle: string;
      format: string;
    }
  | {
      type: "BUDGET_ALERT";
      clubName: string;
      remaining: number;
      expiring: number;
      daysLeft: number;
      missingReceipts: number;
      unlinked: number;
    };

export interface SlackMessage {
  text: string;
}

export function buildSlackMessage(e: SlackEvent): SlackMessage {
  switch (e.type) {
    case "TEST":
      return { text: `✅ [${e.clubName}] 모임 Slack 연동 테스트 메시지입니다.` };
    case "MEETING_CREATED":
      return {
        text: `📅 [${e.clubName}] 새 모임이 등록되었습니다.\n• ${e.title}\n• 일시: ${e.date}${
          e.location ? `\n• 장소: ${e.location}` : ""
        }\n참여 응답을 남겨주세요!`,
      };
    case "REPORT_GENERATED":
      return {
        text: `📄 [${e.clubName}] 보고서가 생성되었습니다. (${e.format})\n• ${e.reportTitle}`,
      };
    case "BUDGET_ALERT":
      return {
        text: [
          `💰 [${e.clubName}] 예산 현황 알림`,
          `• 잔여 예산: ${formatKRW(e.remaining)}`,
          `• 소멸 예정: ${formatKRW(e.expiring)} (${e.daysLeft}일 남음)`,
          `• 영수증 누락: ${e.missingReceipts}건`,
          `• 활동 연결 누락: ${e.unlinked}건`,
        ].join("\n"),
      };
  }
}
