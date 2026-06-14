import { AppShell } from "@/components/AppShell";
import { TransactionTable } from "@/components/TransactionTable";
import { requireContext } from "@/lib/auth/session";
import { getDashboardData, listTransactions } from "@/lib/budget/queries";
import { formatKRW } from "@/lib/format";

export const dynamic = "force-dynamic";

const HALF_LABEL: Record<string, string> = {
  FIRST_HALF: "상반기 (1~6월)",
  SECOND_HALF: "하반기 (7~12월)",
};

export default async function BudgetPage() {
  const { club, role } = await requireContext();
  if (!club) {
    return (
      <AppShell role={role}>
        <p className="text-gray-600">동호회 데이터가 없습니다.</p>
      </AppShell>
    );
  }

  const now = new Date();
  const [d, rows] = await Promise.all([
    getDashboardData(club.id, now),
    listTransactions(club.id, now),
  ]);

  return (
    <AppShell role={role} clubName={club.name}>
      <h1 className="text-2xl font-bold">예산 내역 (전체 공개)</h1>
      <p className="mt-1 text-sm text-gray-500">
        {d.summary.half ? HALF_LABEL[d.summary.half] : ""} · 카드번호·승인번호 등
        민감정보는 마스킹되어 표시됩니다.
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Info label="총 지원금" value={formatKRW(d.summary.totalGranted)} />
        <Info label="사용 완료" value={formatKRW(d.summary.totalUsed)} />
        <Info label="잔여 예산" value={formatKRW(d.summary.remaining)} />
        <Info label="소멸 예정" value={formatKRW(d.summary.expiringAmount)} />
      </div>

      <h2 className="mt-8 mb-3 text-lg font-semibold">사용 내역</h2>
      <TransactionTable rows={rows} />
    </AppShell>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="mt-1 text-xl font-bold">{value}</div>
    </div>
  );
}
