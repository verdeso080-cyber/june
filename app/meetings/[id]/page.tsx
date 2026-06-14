import Link from "next/link";
import QRCode from "qrcode";
import { AppShell } from "@/components/AppShell";
import { prisma } from "@/lib/db";
import { requireContext } from "@/lib/auth/session";
import { getMeeting } from "@/lib/attendance/queries";
import { canOperate, ROLE_LABELS } from "@/lib/auth/roles";
import { isCheckinValid } from "@/lib/attendance/session";
import { countAttendees } from "@/lib/activity/summary";
import { formatDate } from "@/lib/format";
import type { Role } from "@/lib/domain";
import {
  correctAttendance,
  openCheckinSession,
  respondAttendance,
} from "@/app/meetings/actions";

export const dynamic = "force-dynamic";

const RESP_LABEL: Record<string, string> = {
  GOING: "참여",
  MAYBE: "미정",
  NOT_GOING: "불참",
};

export default async function MeetingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { club, role } = await requireContext();
  const meeting = await getMeeting(id);

  if (!club || !meeting || meeting.clubId !== club.id) {
    return (
      <AppShell role={role}>
        <p className="text-gray-600">모임을 찾을 수 없습니다.</p>
      </AppShell>
    );
  }

  const operator = canOperate(role);
  const now = new Date();
  const activeSession = meeting.checkinSessions.find((s) =>
    isCheckinValid(s, now),
  );

  const members = await prisma.membership.findMany({
    where: { clubId: club.id, status: "ACTIVE" },
    orderBy: { role: "asc" },
  });
  const attendanceByMember = new Map(
    meeting.attendances.map((a) => [a.membershipId, a]),
  );

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  let qrDataUrl: string | null = null;
  let checkinUrl: string | null = null;
  if (activeSession) {
    checkinUrl = `${appUrl}/meetings/${meeting.id}/checkin?token=${activeSession.token}`;
    qrDataUrl = await QRCode.toDataURL(checkinUrl, { width: 220, margin: 1 });
  }

  return (
    <AppShell role={role} clubName={club.name}>
      <Link href="/meetings" className="text-sm text-indigo-600">
        ← 모임 목록
      </Link>
      <h1 className="mt-2 text-2xl font-bold">{meeting.title}</h1>
      <p className="mt-1 text-gray-500">
        {formatDate(meeting.startsAt)} · {meeting.location ?? "장소 미정"} · 출석{" "}
        <strong>{countAttendees(meeting.attendances)}</strong>명
      </p>
      {meeting.description && (
        <p className="mt-3 whitespace-pre-line text-gray-700">
          {meeting.description}
        </p>
      )}
      {meeting.activity && (
        <p className="mt-2 text-sm">
          연결 활동:{" "}
          <Link
            href={`/activities/${meeting.activity.id}`}
            className="text-indigo-600 underline"
          >
            {meeting.activity.title}
          </Link>
        </p>
      )}

      {/* 참여 응답 */}
      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-4">
        <h2 className="mb-2 font-semibold">내 참여 응답</h2>
        <div className="flex gap-2">
          {(["GOING", "MAYBE", "NOT_GOING"] as const).map((r) => (
            <form action={respondAttendance} key={r}>
              <input type="hidden" name="meetingId" value={meeting.id} />
              <input type="hidden" name="response" value={r} />
              <button
                type="submit"
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-100"
              >
                {RESP_LABEL[r]}
              </button>
            </form>
          ))}
        </div>
      </section>

      {/* QR 체크인 */}
      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-4">
        <h2 className="mb-2 font-semibold">QR 체크인</h2>
        {activeSession ? (
          <div className="flex flex-col items-start gap-2">
            {qrDataUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={qrDataUrl} alt="체크인 QR" width={220} height={220} />
            )}
            <p className="text-xs text-gray-500">
              만료: {activeSession.expiresAt.toISOString()}
            </p>
            <Link
              href={`/meetings/${meeting.id}/checkin?token=${activeSession.token}`}
              className="text-sm text-indigo-600 underline"
            >
              체크인 페이지 열기
            </Link>
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            활성화된 체크인이 없습니다.
            {!operator && " 운영자가 체크인을 열면 QR이 표시됩니다."}
          </p>
        )}
        {operator && (
          <form action={openCheckinSession} className="mt-3">
            <input type="hidden" name="meetingId" value={meeting.id} />
            <button
              type="submit"
              className="rounded-lg bg-gray-800 px-3 py-1.5 text-sm text-white"
            >
              {activeSession ? "QR 새로 발급" : "QR 체크인 열기"}
            </button>
          </form>
        )}
      </section>

      {/* 출석 명단 / 수동 보정 */}
      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-4">
        <h2 className="mb-3 font-semibold">출석 명단</h2>
        <table className="w-full text-sm">
          <thead className="text-left text-gray-500">
            <tr>
              <th className="py-1">회원</th>
              <th className="py-1">응답</th>
              <th className="py-1">출석</th>
              {operator && <th className="py-1">보정</th>}
            </tr>
          </thead>
          <tbody>
            {members.map((mem) => {
              const a = attendanceByMember.get(mem.id);
              const present = !!a?.checkedInAt;
              return (
                <tr key={mem.id} className="border-t border-gray-100">
                  <td className="py-1.5">
                    {mem.nickname}{" "}
                    <span className="text-xs text-gray-400">
                      {ROLE_LABELS[mem.role as Role]}
                    </span>
                  </td>
                  <td className="py-1.5">
                    {a?.response ? RESP_LABEL[a.response] : "-"}
                  </td>
                  <td className="py-1.5">
                    {present ? (
                      <span className="text-emerald-600">출석</span>
                    ) : (
                      <span className="text-gray-400">미출석</span>
                    )}
                  </td>
                  {operator && (
                    <td className="py-1.5">
                      <form action={correctAttendance}>
                        <input type="hidden" name="meetingId" value={meeting.id} />
                        <input type="hidden" name="membershipId" value={mem.id} />
                        <input
                          type="hidden"
                          name="present"
                          value={present ? "false" : "true"}
                        />
                        <button
                          type="submit"
                          className="rounded border border-gray-300 px-2 py-0.5 text-xs hover:bg-gray-100"
                        >
                          {present ? "결석 처리" : "출석 처리"}
                        </button>
                      </form>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </AppShell>
  );
}
