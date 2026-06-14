import Link from "next/link";
import { PrintButton } from "@/components/PrintButton";
import { getCurrentContext } from "@/lib/auth/session";
import { getActivityReport } from "@/lib/reports/activity";
import { canOperate } from "@/lib/auth/roles";
import { formatDate, formatKRW } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ActivityReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { club, role } = await getCurrentContext();
  const data = await getActivityReport(id);

  if (!club || !data || data.activity.clubId !== club.id) {
    return <p className="p-8 text-gray-600">활동 보고서를 찾을 수 없습니다.</p>;
  }
  if (!canOperate(role)) {
    return (
      <p className="p-8 text-red-600">
        권한이 없습니다. 활동 보고서는 회장/운영자만 볼 수 있습니다.
      </p>
    );
  }

  const { activity, attendees, totalSpend, reportPhotos } = data;

  return (
    <div className="mx-auto max-w-3xl px-8 py-10">
      <div className="no-print mb-6 flex items-center justify-between">
        <Link href="/reports" className="text-sm text-indigo-600">
          ← 보고서
        </Link>
        <PrintButton />
      </div>

      <header className="mb-6 border-b border-gray-300 pb-4">
        <p className="text-sm text-gray-500">{activity.club.name} 활동 보고서</p>
        <h1 className="text-3xl font-bold">{activity.title}</h1>
        <p className="mt-2 text-gray-600">
          {formatDate(activity.activityDate)} · {activity.location ?? "장소 미정"} ·
          참석 {attendees}명 · 사용금액 {formatKRW(totalSpend)}
        </p>
      </header>

      {activity.content && (
        <section className="mb-6">
          <h2 className="mb-2 text-lg font-semibold">활동 내용</h2>
          <p className="whitespace-pre-line leading-relaxed text-gray-800">
            {activity.content}
          </p>
        </section>
      )}

      <section className="mb-6">
        <h2 className="mb-2 text-lg font-semibold">사진</h2>
        {reportPhotos.length === 0 ? (
          <p className="text-sm text-gray-400">
            보고서에 포함하도록 선택된 사진이 없습니다. (활동 화면에서 “포함”을
            눌러 선택하세요.)
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {reportPhotos.map((p) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={p.id}
                src={p.fileUrl}
                alt="활동 사진"
                className="w-full rounded-lg border border-gray-200 object-cover"
              />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold">
          연결된 사용 내역 ({formatKRW(totalSpend)})
        </h2>
        {activity.transactions.length === 0 ? (
          <p className="text-sm text-gray-400">연결된 사용 내역이 없습니다.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-gray-300 text-left text-gray-500">
              <tr>
                <th className="py-1">사용일</th>
                <th className="py-1">가맹점</th>
                <th className="py-1">사용자</th>
                <th className="py-1 text-right">금액</th>
              </tr>
            </thead>
            <tbody>
              {activity.transactions.map((t) => (
                <tr key={t.id} className="border-b border-gray-100">
                  <td className="py-1.5">{formatDate(t.transactionDate)}</td>
                  <td className="py-1.5">{t.merchantName}</td>
                  <td className="py-1.5">{t.card?.holderName ?? "-"}</td>
                  <td className="py-1.5 text-right">{formatKRW(t.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
