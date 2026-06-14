import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { requireContext } from "@/lib/auth/session";
import { getDashboardData } from "@/lib/budget/queries";
import { formatKRW } from "@/lib/format";

export const dynamic = "force-dynamic";

const HALF_LABEL: Record<string, string> = {
  FIRST_HALF: "상반기 (1~6월)",
  SECOND_HALF: "하반기 (7~12월)",
};

function Stat({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "warn" | "danger" | "good";
}) {
  const toneClass =
    tone === "danger"
      ? "text-red-600"
      : tone === "warn"
        ? "text-amber-600"
        : tone === "good"
          ? "text-emerald-600"
          : "text-gray-900";
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="text-sm text-gray-500">{label}</div>
      <div className={`mt-1 text-2xl font-bold ${toneClass}`}>{value}</div>
    </div>
  );
}

export default async function DashboardPage() {
  const { club, role } = await requireContext();

  if (!club) {
    return (
      <AppShell role={role}>
        <p className="text-gray-600">
          동호회 데이터가 없습니다. <code>npm run db:seed</code> 로 예시
          데이터를 넣어주세요.
        </p>
      </AppShell>
    );
  }

  const d = await getDashboardData(club.id, new Date());
  const s = d.summary;

  return (
    <AppShell role={role} clubName={club.name}>
      <div className="mb-6 flex items-baseline justify-between">
        <h1 className="text-2xl font-bold">예산 대시보드</h1>
        <span className="text-sm text-gray-500">
          {s.half ? HALF_LABEL[s.half] : ""} · 활동 회원 {d.activeMemberCount}명
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="총 지원금" value={formatKRW(s.totalGranted)} />
        <Stat label="사용 완료" value={formatKRW(s.totalUsed)} />
        <Stat
          label="잔여 예산"
          value={formatKRW(s.remaining)}
          tone={s.remaining < 0 ? "danger" : "good"}
        />
        <Stat
          label="소멸 예정"
          value={formatKRW(s.expiringAmount)}
          tone="warn"
        />
        <Stat label="이번 달 사용" value={formatKRW(d.monthUsed)} />
        <Stat
          label="소멸까지"
          value={`${s.daysUntilExpiration}일`}
          tone={s.daysUntilExpiration <= 30 ? "warn" : "default"}
        />
        <Stat
          label="영수증 누락"
          value={`${d.missingReceiptCount}건`}
          tone={d.missingReceiptCount > 0 ? "danger" : "good"}
        />
        <Stat
          label="활동 연결 누락"
          value={`${d.unlinkedCount}건`}
          tone={d.unlinkedCount > 0 ? "warn" : "good"}
        />
      </div>

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-semibold">사용자별 사용금액</h2>
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-500">
              <tr>
                <th className="px-4 py-2">카드 사용자</th>
                <th className="px-4 py-2 text-right">사용금액</th>
              </tr>
            </thead>
            <tbody>
              {d.perUser.length === 0 ? (
                <tr>
                  <td className="px-4 py-3 text-gray-400" colSpan={2}>
                    사용 내역이 없습니다.
                  </td>
                </tr>
              ) : (
                d.perUser.map((u) => (
                  <tr key={u.holderName} className="border-t border-gray-100">
                    <td className="px-4 py-2">{u.holderName}</td>
                    <td className="px-4 py-2 text-right font-medium">
                      {formatKRW(u.total)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-gray-500">
          상세 내역은{" "}
          <Link href="/budget/transactions" className="text-indigo-600 underline">
            사용내역
          </Link>{" "}
          에서 볼 수 있습니다.
        </p>
      </section>
    </AppShell>
  );
}
