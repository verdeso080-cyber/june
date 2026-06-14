import { describe, expect, it } from "vitest";
import {
  countAttendees,
  countReportPhotos,
  sumTransactionAmounts,
} from "@/lib/activity/summary";

describe("sumTransactionAmounts", () => {
  it("연결된 거래 합계를 구한다", () => {
    expect(sumTransactionAmounts([{ amount: 180000 }, { amount: 74000 }])).toBe(
      254000,
    );
  });
  it("없으면 0", () => {
    expect(sumTransactionAmounts([])).toBe(0);
  });
});

describe("countAttendees", () => {
  it("체크인한 사람만 센다", () => {
    expect(
      countAttendees([
        { checkedInAt: new Date() },
        { checkedInAt: null },
        { checkedInAt: new Date() },
      ]),
    ).toBe(2);
  });
});

describe("countReportPhotos", () => {
  it("SELECTED_FOR_REPORT 만 센다", () => {
    expect(
      countReportPhotos([
        { status: "SELECTED_FOR_REPORT" },
        { status: "UPLOADED" },
        { status: "SELECTED_FOR_REPORT" },
        { status: "EXCLUDED" },
      ]),
    ).toBe(2);
  });
});
