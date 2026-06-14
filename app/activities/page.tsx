import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { requireContext } from "@/lib/auth/session";
import { listActivities } from "@/lib/activity/queries";
import { canOperate } from "@/lib/auth/roles";
import { countAttendees, sumTransactionAmounts } from "@/lib/activity/summary";
import { formatDate, formatKRW } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ActivitiesPage() {
  const { club, role } = await requireContext();
  if (!club) {
    return (
      <AppShell role={role}>
        <p className="text-gray-600">동호회 데이터가 없습니다.</p>
      </AppShell>
    );
  }

  const activities = await listActivities(club.id);

  return (
    <AppShell role={role} clubName={club.name}>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">활동 이야기</h1>
        {canOperate(role) && (
          <Link
            href="/activities/new"
            className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            + 활동 작성
          </Link>
        )}
      </div>

      {activities.length === 0 ? (
        <p className="text-gray-400">등록된 활동이 없습니다.</p>
      ) : (
        <ul className="space-y-3">
          {activities.map((a) => {
            const attendees = a.meeting
              ? countAttendees(a.meeting.attendances)
              : 0;
            return (
              <li key={a.id}>
                <Link
                  href={`/activities/${a.id}`}
                  className="block rounded-xl border border-gray-200 bg-white p-4 hover:border-indigo-300"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{a.title}</span>
                    <span className="text-sm text-gray-500">
                      {formatDate(a.activityDate)}
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-gray-500">
                    참석 {attendees}명 · 사용금액{" "}
                    {formatKRW(sumTransactionAmounts(a.transactions))} · 사진{" "}
                    {a.photos.length}장
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </AppShell>
  );
}
