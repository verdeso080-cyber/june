import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { prisma } from "@/lib/db";
import { requireContext } from "@/lib/auth/session";
import { getSessionByToken } from "@/lib/attendance/queries";
import { isCheckinValid } from "@/lib/attendance/session";
import { checkIn } from "@/app/meetings/actions";

export const dynamic = "force-dynamic";

export default async function CheckinPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { id } = await params;
  const { token } = await searchParams;
  const { role, membership } = await requireContext();

  const session = token ? await getSessionByToken(token) : null;
  const valid =
    !!session && session.meetingId === id && isCheckinValid(session, new Date());

  const already = membership
    ? await prisma.attendance.findUnique({
        where: {
          meetingId_membershipId: { meetingId: id, membershipId: membership.id },
        },
      })
    : null;

  return (
    <AppShell role={role}>
      <div className="mx-auto max-w-md text-center">
        <h1 className="text-2xl font-bold">QR 체크인</h1>
        {session?.meeting && (
          <p className="mt-1 text-gray-500">{session.meeting.title}</p>
        )}

        {!valid ? (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
            유효하지 않거나 만료된 체크인 링크입니다.
          </div>
        ) : already?.checkedInAt ? (
          <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-700">
            ✅ 이미 체크인되었습니다. ({membership?.nickname})
          </div>
        ) : (
          <form action={checkIn} className="mt-6">
            <input type="hidden" name="meetingId" value={id} />
            <input type="hidden" name="token" value={token} />
            <button
              type="submit"
              className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-lg font-semibold text-white hover:bg-indigo-700"
            >
              체크인하기 ({membership?.nickname})
            </button>
          </form>
        )}

        <Link
          href={`/meetings/${id}`}
          className="mt-4 inline-block text-sm text-indigo-600 underline"
        >
          모임 상세로
        </Link>
      </div>
    </AppShell>
  );
}
