import { formatDate, formatKRW } from "@/lib/format";

export interface TxRow {
  id: string;
  transactionDate: Date;
  amount: number;
  merchantName: string;
  category: string | null;
  approvalNoMasked: string | null;
  isPublic: boolean;
  card: { label: string; holderName: string } | null;
  activity: { title: string } | null;
  receipts: { id: string }[];
}

export function TransactionTable({ rows }: { rows: TxRow[] }) {
  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 text-center text-gray-400">
        사용 내역이 없습니다.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="w-full whitespace-nowrap text-sm">
        <thead className="bg-gray-50 text-left text-gray-500">
          <tr>
            <th className="px-3 py-2">사용일</th>
            <th className="px-3 py-2">카드 / 사용자</th>
            <th className="px-3 py-2 text-right">금액</th>
            <th className="px-3 py-2">가맹점</th>
            <th className="px-3 py-2">카테고리</th>
            <th className="px-3 py-2">연결 활동</th>
            <th className="px-3 py-2">승인번호</th>
            <th className="px-3 py-2 text-center">영수증</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((t) => (
            <tr key={t.id} className="border-t border-gray-100">
              <td className="px-3 py-2">{formatDate(t.transactionDate)}</td>
              <td className="px-3 py-2">
                {t.card?.label ?? "-"}
                <span className="text-gray-400"> · {t.card?.holderName}</span>
              </td>
              <td className="px-3 py-2 text-right font-medium">
                {formatKRW(t.amount)}
              </td>
              <td className="px-3 py-2">{t.merchantName}</td>
              <td className="px-3 py-2">{t.category ?? "-"}</td>
              <td className="px-3 py-2">
                {t.activity ? (
                  t.activity.title
                ) : (
                  <span className="text-amber-600">미연결</span>
                )}
              </td>
              <td className="px-3 py-2 font-mono text-gray-500">
                {t.approvalNoMasked ?? "-"}
              </td>
              <td className="px-3 py-2 text-center">
                {t.receipts.length > 0 ? (
                  <span className="text-emerald-600">O</span>
                ) : (
                  <span className="text-red-500">X</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
