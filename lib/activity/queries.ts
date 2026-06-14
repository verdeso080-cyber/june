import { prisma } from "@/lib/db";

export function listActivities(clubId: string) {
  return prisma.activity.findMany({
    where: { clubId },
    include: {
      transactions: { select: { amount: true } },
      photos: { select: { status: true } },
      meeting: { include: { attendances: { select: { checkedInAt: true } } } },
    },
    orderBy: { activityDate: "desc" },
  });
}

export function getActivity(id: string) {
  return prisma.activity.findUnique({
    where: { id },
    include: {
      transactions: { include: { card: true }, orderBy: { transactionDate: "asc" } },
      photos: { orderBy: { createdAt: "asc" } },
      meeting: {
        include: { attendances: { select: { checkedInAt: true } } },
      },
    },
  });
}

/** 활동에 연결 가능한(또는 이미 연결된) 카드 사용 내역 + 미연결 내역. */
export function getLinkableTransactions(clubId: string, activityId: string) {
  return prisma.budgetTransaction.findMany({
    where: { clubId, OR: [{ activityId: null }, { activityId }] },
    include: { card: true },
    orderBy: { transactionDate: "desc" },
  });
}
