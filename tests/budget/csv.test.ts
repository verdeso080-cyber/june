import { describe, expect, it } from "vitest";
import {
  classifyRow,
  parseTransactionsCsv,
  softKey,
  type ParsedTxRow,
} from "@/lib/budget/csv";

const HEADER =
  "transaction_date,card_holder_name,card_label,approval_no,merchant_name,amount,category,memo";

describe("parseTransactionsCsv", () => {
  it("정상 행을 파싱한다", () => {
    const text = `${HEADER}
2026-06-03,min,총무 카드,30012345,OO식당,180000,식비,회식`;
    const res = parseTransactionsCsv(text);
    expect(res.errors).toHaveLength(0);
    expect(res.rows).toHaveLength(1);
    expect(res.rows[0].amount).toBe(180000);
    expect(res.rows[0].cardHolderName).toBe("min");
  });

  it("금액에 콤마가 있어도 처리한다", () => {
    const text = `${HEADER}
2026-06-03,min,총무 카드,,OO식당,"1,200,000",식비,`;
    const res = parseTransactionsCsv(text);
    expect(res.rows[0].amount).toBe(1200000);
    expect(res.rows[0].approvalNo).toBeNull();
  });

  it("잘못된 금액/날짜는 오류로 분류한다", () => {
    const text = `${HEADER}
bad-date,min,총무 카드,,OO식당,-5,식비,`;
    const res = parseTransactionsCsv(text);
    expect(res.rows).toHaveLength(0);
    expect(res.errors).toHaveLength(1);
  });

  it("헤더가 빠지면 오류", () => {
    const text = `transaction_date,amount
2026-06-03,1000`;
    const res = parseTransactionsCsv(text);
    expect(res.errors[0].message).toContain("헤더 누락");
  });
});

describe("classifyRow", () => {
  const base: ParsedTxRow = {
    lineNumber: 2,
    transactionDate: "2026-06-03",
    cardHolderName: "min",
    cardLabel: "총무 카드",
    approvalNo: "30012345",
    merchantName: "OO식당",
    amount: 180000,
    category: "식비",
    memo: null,
  };

  it("승인번호가 기존에 있으면 DUPLICATE", () => {
    const approvals = new Set(["30012345"]);
    expect(classifyRow(base, approvals, new Set())).toBe("DUPLICATE");
  });

  it("승인번호 없고 약한 키가 겹치면 SUSPECT", () => {
    const row = { ...base, approvalNo: null };
    const softs = new Set([softKey(row)]);
    expect(classifyRow(row, new Set(), softs)).toBe("SUSPECT");
  });

  it("겹치지 않으면 NEW", () => {
    expect(classifyRow(base, new Set(), new Set())).toBe("NEW");
  });
});
