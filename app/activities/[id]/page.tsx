import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { requireContext } from "@/lib/auth/session";
import { getActivity, getLinkableTransactions } from "@/lib/activity/queries";
import { canOperate } from "@/lib/auth/roles";
import {
  countAttendees,
  countReportPhotos,
  sumTransactionAmounts,
} from "@/lib/activity/summary";
import { formatDate, formatKRW } from "@/lib/format";
import { setTransactionLink, setPhotoStatus, uploadPhoto } from "@/app/activities/actions";

export const dynamic = "force-dynamic";

const PHOTO_LABEL: Record<string, string> = {
  UPLOADED: "업로드",
  VISIBLE: "공개",
  SELECTED_FOR_REPORT: "보고서 포함",
  EXCLUDED: "제외",
  DELETE_REQUESTED: "삭제요청",
};

export default async function ActivityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { club, role } = await requireContext();
  const activity = await getActivity(id);

  if (!club || !activity || activity.clubId !== club.id) {
    return (
      <AppShell role={role}>
        <p className="text-gray-600">활동을 찾을 수 없습니다.</p>
      </AppShell>
    );
  }

  const operator = canOperate(role);
  const attendees = activity.meeting
    ? countAttendees(activity.meeting.attendances)
    : 0;
  const totalSpend = sumTransactionAmounts(activity.transactions);
  const linkable = operator
    ? await getLinkableTransactions(club.id, activity.id)
    : [];

  return (
    <AppShell role={role} clubName={club.name}>
      <Link href="/activities" className="text-sm text-indigo-600">
        ← 활동 목록
      </Link>
      <h1 className="mt-2 text-2xl font-bold">{activity.title}</h1>
      <p className="mt-1 text-gray-500">
        {formatDate(activity.activityDate)} · {activity.location ?? "장소 미정"} ·
        참석 <strong>{attendees}</strong>명 · 사용금액{" "}
        <strong>{formatKRW(totalSpend)}</strong>
      </p>
      {activity.content && (
        <p className="mt-3 whitespace-pre-line text-gray-700">
          {activity.content}
        </p>
      )}

      {/* 연결된 카드 사용 내역 */}
      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-4">
        <h2 className="mb-2 font-semibold">
          연결된 사용 내역 ({formatKRW(totalSpend)})
        </h2>
        {activity.transactions.length === 0 ? (
          <p className="text-sm text-gray-400">연결된 사용 내역이 없습니다.</p>
        ) : (
          <ul className="text-sm">
            {activity.transactions.map((t) => (
              <li
                key={t.id}
                className="flex items-center justify-between border-t border-gray-100 py-1.5 first:border-0"
              >
                <span>
                  {formatDate(t.transactionDate)} · {t.merchantName} ·{" "}
                  {t.card?.holderName}
                </span>
                <span className="flex items-center gap-2">
                  <strong>{formatKRW(t.amount)}</strong>
                  {operator && (
                    <form action={setTransactionLink}>
                      <input type="hidden" name="transactionId" value={t.id} />
                      <input type="hidden" name="activityId" value={activity.id} />
                      <input type="hidden" name="link" value="false" />
                      <button className="text-xs text-red-500 underline">
                        연결 해제
                      </button>
                    </form>
                  )}
                </span>
              </li>
            ))}
          </ul>
        )}

        {operator && (
          <details className="mt-3">
            <summary className="cursor-pointer text-sm text-indigo-600">
              사용 내역 연결하기
            </summary>
            <ul className="mt-2 text-sm">
              {linkable
                .filter((t) => t.activityId !== activity.id)
                .map((t) => (
                  <li
                    key={t.id}
                    className="flex items-center justify-between py-1"
                  >
                    <span>
                      {formatDate(t.transactionDate)} · {t.merchantName} ·{" "}
                      {formatKRW(t.amount)}
                    </span>
                    <form action={setTransactionLink}>
                      <input type="hidden" name="transactionId" value={t.id} />
                      <input
                        type="hidden"
                        name="activityId"
                        value={activity.id}
                      />
                      <input type="hidden" name="link" value="true" />
                      <button className="text-xs text-indigo-600 underline">
                        연결
                      </button>
                    </form>
                  </li>
                ))}
              {linkable.filter((t) => t.activityId !== activity.id).length ===
                0 && (
                <li className="py-1 text-gray-400">연결 가능한 내역이 없습니다.</li>
              )}
            </ul>
          </details>
        )}
      </section>

      {/* 사진 */}
      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-4">
        <h2 className="mb-2 font-semibold">
          사진 ({activity.photos.length}장 · 보고서 포함{" "}
          {countReportPhotos(activity.photos)}장)
        </h2>

        <form
          action={uploadPhoto}
          className="mb-4 flex items-center gap-2 text-sm"
        >
          <input type="hidden" name="activityId" value={activity.id} />
          <input
            type="file"
            name="file"
            accept="image/*"
            required
            className="text-sm"
          />
          <button className="rounded bg-gray-800 px-3 py-1.5 text-white">
            업로드
          </button>
        </form>

        {activity.photos.length === 0 ? (
          <p className="text-sm text-gray-400">업로드된 사진이 없습니다.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {activity.photos.map((p) => (
              <div
                key={p.id}
                className="overflow-hidden rounded-lg border border-gray-200"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.fileUrl}
                  alt="활동 사진"
                  className="h-32 w-full object-cover"
                />
                <div className="flex items-center justify-between p-2 text-xs">
                  <span
                    className={
                      p.status === "SELECTED_FOR_REPORT"
                        ? "text-emerald-600"
                        : "text-gray-500"
                    }
                  >
                    {PHOTO_LABEL[p.status] ?? p.status}
                  </span>
                  {operator && (
                    <span className="flex gap-1">
                      <StatusButton
                        photoId={p.id}
                        activityId={activity.id}
                        status="SELECTED_FOR_REPORT"
                        label="포함"
                      />
                      <StatusButton
                        photoId={p.id}
                        activityId={activity.id}
                        status="EXCLUDED"
                        label="제외"
                      />
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </AppShell>
  );
}

function StatusButton({
  photoId,
  activityId,
  status,
  label,
}: {
  photoId: string;
  activityId: string;
  status: string;
  label: string;
}) {
  return (
    <form action={setPhotoStatus}>
      <input type="hidden" name="photoId" value={photoId} />
      <input type="hidden" name="activityId" value={activityId} />
      <input type="hidden" name="status" value={status} />
      <button className="rounded border border-gray-300 px-1.5 py-0.5 hover:bg-gray-100">
        {label}
      </button>
    </form>
  );
}
