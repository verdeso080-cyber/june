import type { MonthlyBudgetReport } from "@/lib/reports/budget";
import { formatDate } from "@/lib/format";

/** CSV 한 칸 escape (콤마/따옴표/줄바꿈 처리). */
export function csvCell(value: string | number | boolean | null): string {
  const s = value === null ? "" : String(value);
  if (/[",\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function row(cells: (string | number | boolean | null)[]): string {
  return cells.map(csvCell).join(",");
}

/**
 * 월간 예산 보고서 CSV 문자열 생성.
 * 엑셀에서 한글이 깨지지 않도록 맨 앞에 BOM 을 붙입니다.
 */
export function buildBudgetCsv(report: MonthlyBudgetReport): string {
  const lines: string[] = [];
  lines.push(row([`${report.clubName} ${report.year}년 ${report.month}월 예산 보고서`]));
  lines.push("");
  lines.push(
    row(["사용일", "카드 사용자", "카드", "가맹점", "카테고리", "연결 활동", "영수증", "금액"]),
  );
  for (const r of report.rows) {
    lines.push(
      row([
        formatDate(r.transactionDate),
        r.holderName,
        r.cardLabel,
        r.merchantName,
        r.category ?? "",
        r.activityTitle ?? "(미연결)",
        r.hasReceipt ? "O" : "X",
        r.amount,
      ]),
    );
  }
  lines.push("");
  lines.push(row(["월간 총 사용금액", "", "", "", "", "", "", report.monthlyTotal]));
  lines.push("");
  lines.push(row(["사용자별 사용금액"]));
  for (const u of report.perUser) lines.push(row([u.holderName, "", "", "", "", "", "", u.total]));
  lines.push("");
  lines.push(row(["반기 누적 지원금", "", "", "", "", "", "", report.halfGranted]));
  lines.push(row(["반기 누적 사용금액", "", "", "", "", "", "", report.halfUsed]));
  lines.push(row(["반기 잔여 예산", "", "", "", "", "", "", report.halfRemaining]));
  lines.push(row(["소멸 예정 금액", "", "", "", "", "", "", report.expiringAmount]));

  return "﻿" + lines.join("\r\n");
}

/** 보고서 파일명(한글 안전): 영문/숫자 위주. */
export function budgetReportFilename(
  report: MonthlyBudgetReport,
  ext: string,
): string {
  const code = report.clubName.replace(/[^\p{L}\p{N}]+/gu, "_").slice(0, 20);
  return `budget_${code}_${report.year}-${String(report.month).padStart(2, "0")}.${ext}`;
}
