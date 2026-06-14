import { AppShell } from "@/components/AppShell";
import { prisma } from "@/lib/db";
import { requireContext } from "@/lib/auth/session";
import { canOperate } from "@/lib/auth/roles";
import { formatDate } from "@/lib/format";
import { createActivity } from "@/app/activities/actions";

export const dynamic = "force-dynamic";

export default async function NewActivityPage() {
  const { club, role } = await requireContext();
  if (!club) {
    return (
      <AppShell role={role}>
        <p className="text-gray-600">동호회 데이터가 없습니다.</p>
      </AppShell>
    );
  }
  if (!canOperate(role)) {
    return (
      <AppShell role={role} clubName={club.name}>
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
          권한이 없습니다. 활동 작성은 회장/운영자만 가능합니다.
        </div>
      </AppShell>
    );
  }

  // 아직 활동에 연결되지 않은 모임만 선택지로 제공
  const meetings = await prisma.meeting.findMany({
    where: { clubId: club.id, activity: { is: null } },
    orderBy: { startsAt: "desc" },
  });

  return (
    <AppShell role={role} clubName={club.name}>
      <h1 className="mb-4 text-2xl font-bold">활동 이야기 작성</h1>
      <form
        action={createActivity}
        className="max-w-xl space-y-4 rounded-xl border border-gray-200 bg-white p-6"
      >
        <label className="block">
          <span className="mb-1 block text-sm font-medium">제목</span>
          <input name="title" required className="input" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">활동일</span>
          <input type="date" name="activityDate" required className="input" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">장소</span>
          <input name="location" className="input" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">연결 모임 (선택)</span>
          <select name="meetingId" className="input">
            <option value="">연결 안 함</option>
            {meetings.map((m) => (
              <option key={m.id} value={m.id}>
                {m.title} ({formatDate(m.startsAt)})
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">활동 내용</span>
          <textarea name="content" rows={5} className="input" />
        </label>
        <button
          type="submit"
          className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700"
        >
          저장
        </button>
      </form>
    </AppShell>
  );
}
