import { prisma } from "@/lib/db";
import { countAttendees, sumTransactionAmounts } from "@/lib/activity/summary";

export async function getActivityReport(activityId: string) {
  const activity = await prisma.activity.findUnique({
    where: { id: activityId },
    include: {
      club: { select: { name: true } },
      transactions: { include: { card: true }, orderBy: { transactionDate: "asc" } },
      photos: true,
      meeting: { include: { attendances: { select: { checkedInAt: true } } } },
    },
  });
  if (!activity) return null;

  const attendees = activity.meeting
    ? countAttendees(activity.meeting.attendances)
    : 0;
  const totalSpend = sumTransactionAmounts(activity.transactions);
  // 보고서에는 "보고서 포함"으로 선택된 사진만
  const reportPhotos = activity.photos.filter(
    (p) => p.status === "SELECTED_FOR_REPORT",
  );

  return { activity, attendees, totalSpend, reportPhotos };
}
