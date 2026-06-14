import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { TransactionTable } from "@/components/TransactionTable";
import { requireContext } from "@/lib/auth/session";
import { listTransactions } from "@/lib/budget/queries";
import { canManageBudget } from "@/lib/auth/roles";

export const dynamic = "force-dynamic";

export default async function TransactionsPage() {
  const { club, role } = await requireContext();
  if (!club) {
    return (
      <AppShell role={role}>
        <p className="text-gray-600">동호회 데이터가 없습니다.</p>
      </AppShell>
    );
  }

  const rows = await listTransactions(club.id, new Date());
  const manage = canManageBudget(role);

  return (
    <AppShell role={role} clubName={club.name}>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">카드 사용 내역</h1>
        {manage && (
          <div className="flex gap-2">
            <Link
              href="/budget/transactions/new"
              className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              + 내역 추가
            </Link>
            <Link
              href="/budget/import"
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-100"
            >
              CSV 업로드
            </Link>
          </div>
        )}
      </div>

      <TransactionTable rows={rows} />
    </AppShell>
  );
}
