import { AppShell } from "@/components/AppShell";
import { prisma } from "@/lib/db";
import { getCurrentContext } from "@/lib/auth/session";
import { canManageBudget } from "@/lib/auth/roles";
import { readWebhookUrl } from "@/lib/slack/client";
import { sendBudgetAlert, sendTestMessage } from "@/app/settings/slack/actions";

export const dynamic = "force-dynamic";

function fmt(d: Date | null | undefined): string {
  return d ? d.toISOString().replace("T", " ").slice(0, 16) : "-";
}

export default async function SlackSettingsPage() {
  const { club, role } = await getCurrentContext();
  if (!club) {
    return (
      <AppShell role={role}>
        <p className="text-gray-600">동호회 데이터가 없습니다.</p>
      </AppShell>
    );
  }
  if (!canManageBudget(role)) {
    return (
      <AppShell role={role} clubName={club.name}>
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
          권한이 없습니다. Slack 설정은 총무/회장/운영자만 가능합니다.
        </div>
      </AppShell>
    );
  }

  const configured = readWebhookUrl() !== null;
  const integration = await prisma.slackIntegration.findUnique({
    where: { clubId: club.id },
  });

  return (
    <AppShell role={role} clubName={club.name}>
      <h1 className="mb-4 text-2xl font-bold">Slack 알림 설정</h1>

      <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Webhook 상태:</span>
          {configured ? (
            <span className="rounded bg-emerald-100 px-2 py-0.5 text-sm text-emerald-700">
              설정됨
            </span>
          ) : (
            <span className="rounded bg-amber-100 px-2 py-0.5 text-sm text-amber-700">
              미설정
            </span>
          )}
        </div>

        <p className="text-sm text-gray-500">
          Webhook URL 은 보안을 위해 화면에 표시하지 않으며, 서버 환경변수{" "}
          <code>SLACK_WEBHOOK_URL</code> 에서만 읽습니다. 설정하려면 서버의{" "}
          <code>.env.local</code> 또는 배포 환경변수에 값을 넣으세요.
        </p>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg bg-gray-50 p-3">
            <div className="text-gray-500">마지막 성공</div>
            <div className="font-medium">{fmt(integration?.lastSuccessAt)}</div>
          </div>
          <div className="rounded-lg bg-gray-50 p-3">
            <div className="text-gray-500">마지막 실패</div>
            <div className="font-medium">{fmt(integration?.lastFailureAt)}</div>
          </div>
        </div>

        {!configured && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            아직 Webhook URL 이 없어 발송 시 실패합니다. 먼저 환경변수를
            설정하세요.
          </div>
        )}

        <div className="flex gap-2">
          <form action={sendTestMessage}>
            <button className="rounded-lg bg-gray-800 px-3 py-2 text-sm text-white">
              테스트 메시지 보내기
            </button>
          </form>
          <form action={sendBudgetAlert}>
            <button className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-100">
              예산 현황 알림 보내기
            </button>
          </form>
        </div>
        <p className="text-xs text-gray-400">
          버튼을 누른 뒤 위의 “마지막 성공/실패” 시간으로 결과를 확인하세요.
        </p>
      </div>
    </AppShell>
  );
}
