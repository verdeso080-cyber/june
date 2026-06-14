import { prisma } from "@/lib/db";
import { getHalfYearRange } from "@/lib/budget/period";
import { calcBudgetSummary, type BudgetSummary } from "@/lib/budget/summary";

/**
 * 예산 대시보드/내역에 필요한 DB 조회 모음.
 */

export interface PerUserSpend {
  holderName: string;
  total: number;
}

export interface DashboardData {
  summary: BudgetSummary;
  activeMemberCount: number;
  monthUsed: number;
  missingReceiptCount: number;
  unlinkedCount: number;
  perUser: PerUserSpend[];
  periodStart: Date;
  periodEnd: Date;
}

/** 현재 반기 기준 대시보드 데이터를 계산합니다. */
export async function getDashboardData(
  clubId: string,
  now: Date = new Date(),
): Promise<DashboardData> {
  const range = getHalfYearRange(now);

  const period = await prisma.budgetPeriod.findUnique({
    where: { clubId_year_half: { clubId, year: range.year, half: range.half } },
  });

  const grants = period
    ? await prisma.budgetGrant.findMany({ where: { periodId: period.id } })
    : [];

  const transactions = await prisma.budgetTransaction.findMany({
    where: {
      clubId,
      transactionDate: { gte: range.start, lte: range.end },
    },
    include: { card: true, receipts: true },
  });

  const summary = calcBudgetSummary({
    half: range.half,
    grants: grants.map((g) => ({ amount: g.amount })),
    transactions: transactions.map((t) => ({ amount: t.amount })),
    periodEnd: range.end,
    now,
  });

  const activeMemberCount = await prisma.membership.count({
    where: { clubId, status: "ACTIVE" },
  });

  // 이번 달 사용액
  const monthStart = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1),
  );
  const monthUsed = transactions
    .filter((t) => t.transactionDate >= monthStart)
    .reduce((sum, t) => sum + t.amount, 0);

  const missingReceiptCount = transactions.filter(
    (t) => t.receipts.length === 0,
  ).length;
  const unlinkedCount = transactions.filter((t) => !t.activityId).length;

  // 사용자(카드 소유자)별 사용금액
  const byUser = new Map<string, number>();
  for (const t of transactions) {
    const name = t.card?.holderName ?? "(미지정)";
    byUser.set(name, (byUser.get(name) ?? 0) + t.amount);
  }
  const perUser: PerUserSpend[] = [...byUser.entries()]
    .map(([holderName, total]) => ({ holderName, total }))
    .sort((a, b) => b.total - a.total);

  return {
    summary,
    activeMemberCount,
    monthUsed,
    missingReceiptCount,
    unlinkedCount,
    perUser,
    periodStart: range.start,
    periodEnd: range.end,
  };
}

/** 현재 반기 카드 사용 내역 목록(최신순). */
export async function listTransactions(clubId: string, now: Date = new Date()) {
  const range = getHalfYearRange(now);
  return prisma.budgetTransaction.findMany({
    where: { clubId, transactionDate: { gte: range.start, lte: range.end } },
    include: { card: true, activity: true, receipts: true },
    orderBy: { transactionDate: "desc" },
  });
}

/** 입력 폼에 필요한 카드/활동 목록. */
export async function getFormOptions(clubId: string) {
  const [cards, activities] = await Promise.all([
    prisma.corporateCard.findMany({
      where: { clubId, active: true },
      orderBy: { label: "asc" },
    }),
    prisma.activity.findMany({
      where: { clubId },
      orderBy: { activityDate: "desc" },
    }),
  ]);
  return { cards, activities };
}
