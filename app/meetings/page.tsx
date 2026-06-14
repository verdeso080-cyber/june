import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { requireContext } from "@/lib/auth/session";
import { listMeetings } from "@/lib/attendance/queries";
import { canOperate } from "@/lib/auth/roles";
import { countAttendees } from "@/lib/activity/summary";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function MeetingsPage() {
  const { club, role } = await requireContext();
  if (!club) {
    return (
      <AppShell role={role}>
        <p className="text-gray-600">동호회 데이터가 없습니다.</p>
      </AppShell>
    );
  }

  const meetings = await listMeetings(club.id);

  return (
    <AppShell role={role} clubName={club.name}>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">모임</h1>
        {canOperate(role) && (
          <Link
            href="/meetings/new"
            className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            + 모임 만들기
          </Link>
        )}
      </div>

      {meetings.length === 0 ? (
        <p className="text-gray-400">등록된 모임이 없습니다.</p>
      ) : (
        <ul className="space-y-3">
          {meetings.map((m) => (
            <li key={m.id}>
              <Link
                href={`/meetings/${m.id}`}
                className="block rounded-xl border border-gray-200 bg-white p-4 hover:border-indigo-300"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{m.title}</span>
                  <span className="text-sm text-gray-500">
                    {formatDate(m.startsAt)}
                  </span>
                </div>
                <div className="mt-1 text-sm text-gray-500">
                  {m.location ?? "장소 미정"} · 출석{" "}
                  {countAttendees(m.attendances)}명
                  {m.activity ? " · 활동 연결됨" : ""}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </AppShell>
  );
}
