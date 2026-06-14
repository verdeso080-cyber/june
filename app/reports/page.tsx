import { AppShell } from "@/components/AppShell";
import { requireContext } from "@/lib/auth/session";
import { canManageBudget, canOperate } from "@/lib/auth/roles";
import { listActivities } from "@/lib/activity/queries";
import { createActivityReport } from "@/app/reports/actions";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const { club, role } = await requireContext();
  if (!club) {
    return (
      <AppShell role={role}>
        <p className="text-gray-600">동호회 데이터가 없습니다.</p>
      </AppShell>
    );
  }

  const now = new Date();
  const curYear = now.getUTCFullYear();
  const curMonth = now.getUTCMonth() + 1;
  const activities = await listActivities(club.id);

  return (
    <AppShell role={role} clubName={club.name}>
      <h1 className="mb-6 text-2xl font-bold">보고서</h1>

      {/* 월간 예산 보고서 */}
      <section className="mb-8 rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="mb-1 text-lg font-semibold">월간 예산 보고서 (Excel · CSV)</h2>
        <p className="mb-3 text-sm text-gray-500">
          카드 사용자·금액·가맹점·연결 활동·월 합계·반기 잔여 예산이 포함됩니다.
        </p>
        {canManageBudget(role) ? (
          <form action="/reports/budget" method="GET" className="flex flex-wrap items-end gap-3">
            <label className="text-sm">
              <span className="mb-1 block text-gray-600">연도</span>
              <select name="year" defaultValue={curYear} className="input">
                {[curYear - 1, curYear].map((y) => (
                  <option key={y} value={y}>
                    {y}년
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-gray-600">월</span>
              <select name="month" defaultValue={curMonth} className="input">
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>
                    {m}월
                  </option>
                ))}
              </select>
            </label>
            <button
              type="submit"
              name="format"
              value="xlsx"
              className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700"
            >
              Excel 다운로드
            </button>
            <button
              type="submit"
              name="format"
              value="csv"
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-100"
            >
              CSV 다운로드
            </button>
          </form>
        ) : (
          <p className="text-sm text-amber-600">
            예산 보고서 생성은 총무/회장/운영자만 가능합니다.
          </p>
        )}
      </section>

      {/* 활동 이야기 보고서 */}
      <section className="rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="mb-1 text-lg font-semibold">활동이야기 보고서 (PDF 인쇄용)</h2>
        <p className="mb-3 text-sm text-gray-500">
          선택된 사진·참석자 수·연결 사용금액이 포함된 인쇄용 보고서를 만듭니다.
        </p>
        {!canOperate(role) ? (
          <p className="text-sm text-amber-600">
            활동 보고서 생성은 회장/운영자만 가능합니다.
          </p>
        ) : activities.length === 0 ? (
          <p className="text-sm text-gray-400">등록된 활동이 없습니다.</p>
        ) : (
          <ul className="divide-y divide-gray-100 text-sm">
            {activities.map((a) => (
              <li key={a.id} className="flex items-center justify-between py-2">
                <span>
                  {a.title}{" "}
                  <span className="text-gray-400">{formatDate(a.activityDate)}</span>
                </span>
                <form action={createActivityReport}>
                  <input type="hidden" name="activityId" value={a.id} />
                  <button className="rounded-lg bg-indigo-600 px-3 py-1.5 text-white hover:bg-indigo-700">
                    보고서 생성
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>
    </AppShell>
  );
}
