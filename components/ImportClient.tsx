"use client";

import { useState, useTransition } from "react";
import {
  confirmImport,
  previewImport,
  type PreviewResult,
} from "@/app/budget/actions";

const SAMPLE = `transaction_date,card_holder_name,card_label,approval_no,merchant_name,amount,category,memo
2026-06-25,min,총무 카드,30099999,OO문구,15000,비품,사무용품
2026-06-26,celia,회장 카드,,OO서점,22000,도서,`;

const DUP_LABEL: Record<string, string> = {
  NEW: "신규",
  DUPLICATE: "중복",
  SUSPECT: "중복 의심",
};

export function ImportClient() {
  const [csv, setCsv] = useState("");
  const [preview, setPreview] = useState<PreviewResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    file.text().then((text) => setCsv(text));
  }

  function doPreview() {
    setError(null);
    startTransition(async () => {
      try {
        setPreview(await previewImport(csv));
      } catch (e) {
        setError(e instanceof Error ? e.message : "미리보기 실패");
      }
    });
  }

  function doConfirm() {
    setError(null);
    startTransition(async () => {
      try {
        await confirmImport(csv);
      } catch (e) {
        setError(e instanceof Error ? e.message : "저장 실패");
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <p className="mb-2 text-sm text-gray-600">
          표준 컬럼:{" "}
          <code className="text-xs">
            transaction_date, card_holder_name, card_label, approval_no,
            merchant_name, amount, category, memo
          </code>
        </p>
        <textarea
          value={csv}
          onChange={(e) => setCsv(e.target.value)}
          rows={8}
          placeholder={SAMPLE}
          className="w-full rounded border border-gray-300 p-2 font-mono text-xs"
        />
        <div className="mt-2 flex items-center gap-3">
          <input type="file" accept=".csv,text/csv" onChange={onFile} />
          <button
            type="button"
            onClick={() => setCsv(SAMPLE)}
            className="text-sm text-indigo-600 underline"
          >
            예시 채우기
          </button>
          <button
            type="button"
            onClick={doPreview}
            disabled={pending || csv.trim() === ""}
            className="ml-auto rounded-lg bg-gray-800 px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            미리보기
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {preview && (
        <div className="space-y-3">
          {preview.errors.length > 0 && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              <strong>형식 오류 {preview.errors.length}건</strong>
              <ul className="mt-1 list-inside list-disc">
                {preview.errors.map((er) => (
                  <li key={er.lineNumber}>
                    {er.lineNumber}번째 줄: {er.message}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="text-sm text-gray-600">
            전체 {preview.counts.total}건 · 저장 예정{" "}
            <strong>{preview.counts.toInsert}건</strong> · 중복{" "}
            {preview.counts.duplicate}건 · 의심 {preview.counts.suspect}건
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="w-full whitespace-nowrap text-sm">
              <thead className="bg-gray-50 text-left text-gray-500">
                <tr>
                  <th className="px-3 py-2">상태</th>
                  <th className="px-3 py-2">사용일</th>
                  <th className="px-3 py-2">사용자</th>
                  <th className="px-3 py-2">카드</th>
                  <th className="px-3 py-2 text-right">금액</th>
                  <th className="px-3 py-2">가맹점</th>
                </tr>
              </thead>
              <tbody>
                {preview.rows.map((r) => (
                  <tr key={r.lineNumber} className="border-t border-gray-100">
                    <td className="px-3 py-2">
                      <span
                        className={
                          r.dup === "DUPLICATE"
                            ? "text-red-600"
                            : r.dup === "SUSPECT"
                              ? "text-amber-600"
                              : "text-emerald-600"
                        }
                      >
                        {DUP_LABEL[r.dup]}
                      </span>
                    </td>
                    <td className="px-3 py-2">{r.transactionDate}</td>
                    <td className="px-3 py-2">{r.cardHolderName}</td>
                    <td className="px-3 py-2">{r.cardLabel}</td>
                    <td className="px-3 py-2 text-right">
                      {r.amount.toLocaleString("ko-KR")}원
                    </td>
                    <td className="px-3 py-2">{r.merchantName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            type="button"
            onClick={doConfirm}
            disabled={pending || preview.counts.toInsert === 0}
            className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white disabled:opacity-50"
          >
            {preview.counts.toInsert}건 저장 (중복 제외)
          </button>
        </div>
      )}
    </div>
  );
}
