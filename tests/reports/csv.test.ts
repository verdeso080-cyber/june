import { describe, expect, it } from "vitest";
import { buildBudgetCsv, csvCell, budgetReportFilename } from "@/lib/reports/csv";
import type { MonthlyBudgetReport } from "@/lib/reports/budget";

const report: MonthlyBudgetReport = {
  clubName: "러닝 동호회",
  year: 2026,
  month: 6,
  half: "FIRST_HALF",
  monthlyTotal: 254000,
  perUser: [
    { holderName: "celia", total: 180000 },
    { holderName: "min", total: 74000 },
  ],
  rows: [
    {
      transactionDate: new Date(Date.UTC(2026, 5, 3)),
      holderName: "celia",
      cardLabel: "회장 카드",
      amount: 180000,
      merchantName: "OO식당",
      category: "식비",
      activityTitle: "6월 정기 모임",
      hasReceipt: true,
    },
    {
      transactionDate: new Date(Date.UTC(2026, 5, 14)),
      holderName: "min",
      cardLabel: "총무 카드",
      amount: 74000,
      merchantName: "OO마트, 본점",
      category: "간식",
      activityTitle: null,
      hasReceipt: false,
    },
  ],
  halfGranted: 6550000,
  halfUsed: 892000,
  halfRemaining: 5658000,
  expiringAmount: 5658000,
};

describe("csvCell", () => {
  it("콤마/따옴표가 있으면 감싼다", () => {
    expect(csvCell("OO마트, 본점")).toBe('"OO마트, 본점"');
    expect(csvCell('a"b')).toBe('"a""b"');
    expect(csvCell(1000)).toBe("1000");
  });
});

describe("buildBudgetCsv", () => {
  const csv = buildBudgetCsv(report);

  it("BOM 으로 시작한다", () => {
    expect(csv.charCodeAt(0)).toBe(0xfeff);
  });

  it("월간 총 사용금액이 행 합계와 일치한다", () => {
    expect(csv).toContain("월간 총 사용금액");
    expect(csv).toContain("254000");
  });

  it("미연결 거래는 (미연결)로 표기", () => {
    expect(csv).toContain("(미연결)");
  });

  it("반기 잔여/소멸 정보를 포함한다", () => {
    expect(csv).toContain("반기 잔여 예산");
    expect(csv).toContain("5658000");
  });
});

describe("budgetReportFilename", () => {
  it("연-월 기반 파일명을 만든다", () => {
    expect(budgetReportFilename(report, "xlsx")).toBe(
      "budget_러닝_동호회_2026-06.xlsx",
    );
  });
});
