import { prisma } from "@/lib/db";
import { getHalfYearRange } from "@/lib/budget/period";
import { calcBudgetSummary } from "@/lib/budget/summary";
import type { HalfYear } from "@/lib/domain";

export interface BudgetReportRow {
  transactionDate: Date;
  holderName: string;
  cardLabel: string;
  amount: number;
  merchantName: string;
  category: string | null;
  activityTitle: string | null;
  hasReceipt: boolean;
}

export interface MonthlyBudgetReport {
  clubName: string;
  year: number;
  month: number;
  half: HalfYear;
  monthlyTotal: number;
  perUser: { holderName: string; total: number }[];
  rows: BudgetReportRow[];
  halfGranted: number;
  halfUsed: number;
  halfRemaining: number;
  expiringAmount: number;
}

/** 월간 예산 보고서 데이터 (Excel/CSV/미리보기 공용). */
export async function getMonthlyBudgetReport(
  clubId: string,
  year: number,
  month: number,
): Promise<MonthlyBudgetReport> {
  const club = await prisma.club.findUniqueOrThrow({ where: { id: clubId } });

  const monthStart = new Date(Date.UTC(year, month - 1, 1));
  const monthEnd = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));
  const range = getHalfYearRange(monthStart);

  const monthTx = await prisma.budgetTransaction.findMany({
    where: { clubId, transactionDate: { gte: monthStart, lte: monthEnd } },
    include: { card: true, activity: true, receipts: true },
    orderBy: { transactionDate: "asc" },
  });

  const period = await prisma.budgetPeriod.findUnique({
    where: { clubId_year_half: { clubId, year: range.year, half: range.half } },
  });
  const grants = period
    ? await prisma.budgetGrant.findMany({ where: { periodId: period.id } })
    : [];
  const halfTx = await prisma.budgetTransaction.findMany({
    where: { clubId, transactionDate: { gte: range.start, lte: range.end } },
    select: { amount: true },
  });

  const summary = calcBudgetSummary({
    half: range.half,
    grants: grants.map((g) => ({ amount: g.amount })),
    transactions: halfTx,
    periodEnd: range.end,
    now: new Date(),
  });

  const rows: BudgetReportRow[] = monthTx.map((t) => ({
    transactionDate: t.transactionDate,
    holderName: t.card?.holderName ?? "(미지정)",
    cardLabel: t.card?.label ?? "-",
    amount: t.amount,
    merchantName: t.merchantName,
    category: t.category,
    activityTitle: t.activity?.title ?? null,
    hasReceipt: t.receipts.length > 0,
  }));

  const byUser = new Map<string, number>();
  for (const r of rows) byUser.set(r.holderName, (byUser.get(r.holderName) ?? 0) + r.amount);

  return {
    clubName: club.name,
    year,
    month,
    half: range.half,
    monthlyTotal: rows.reduce((s, r) => s + r.amount, 0),
    perUser: [...byUser.entries()]
      .map(([holderName, total]) => ({ holderName, total }))
      .sort((a, b) => b.total - a.total),
    rows,
    halfGranted: summary.totalGranted,
    halfUsed: summary.totalUsed,
    halfRemaining: summary.remaining,
    expiringAmount: summary.expiringAmount,
  };
}
