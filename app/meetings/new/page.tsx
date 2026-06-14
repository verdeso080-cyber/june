import { AppShell } from "@/components/AppShell";
import { getCurrentContext } from "@/lib/auth/session";
import { canOperate } from "@/lib/auth/roles";
import { createMeeting } from "@/app/meetings/actions";

export const dynamic = "force-dynamic";

export default async function NewMeetingPage() {
  const { club, role } = await getCurrentContext();
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
          권한이 없습니다. 모임 생성은 회장/운영자만 가능합니다.
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell role={role} clubName={club.name}>
      <h1 className="mb-4 text-2xl font-bold">모임 만들기</h1>
      <form
        action={createMeeting}
        className="max-w-xl space-y-4 rounded-xl border border-gray-200 bg-white p-6"
      >
        <label className="block">
          <span className="mb-1 block text-sm font-medium">제목</span>
          <input name="title" required className="input" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">시작 시간</span>
          <input
            type="datetime-local"
            name="startsAt"
            required
            className="input"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">종료 시간 (선택)</span>
          <input type="datetime-local" name="endsAt" className="input" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">장소</span>
          <input name="location" className="input" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">설명</span>
          <textarea name="description" rows={3} className="input" />
        </label>
        <button
          type="submit"
          className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700"
        >
          만들기
        </button>
      </form>
    </AppShell>
  );
}
