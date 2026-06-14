import { describe, expect, it } from "vitest";
import {
  daysUntil,
  getHalfYear,
  getHalfYearRange,
  isSameHalfYear,
} from "@/lib/budget/period";

const utc = (y: number, m: number, d: number) =>
  new Date(Date.UTC(y, m - 1, d));

describe("getHalfYear", () => {
  it("1~6월은 FIRST_HALF 다", () => {
    for (const month of [1, 2, 3, 4, 5, 6]) {
      expect(getHalfYear(utc(2026, month, 15))).toBe("FIRST_HALF");
    }
  });

  it("7~12월은 SECOND_HALF 다", () => {
    for (const month of [7, 8, 9, 10, 11, 12]) {
      expect(getHalfYear(utc(2026, month, 15))).toBe("SECOND_HALF");
    }
  });

  it("경계: 6/30 은 FIRST_HALF, 7/1 은 SECOND_HALF", () => {
    expect(getHalfYear(utc(2026, 6, 30))).toBe("FIRST_HALF");
    expect(getHalfYear(utc(2026, 7, 1))).toBe("SECOND_HALF");
  });
});

describe("getHalfYearRange", () => {
  it("상반기 범위는 1/1 ~ 6/30 이다", () => {
    const r = getHalfYearRange(utc(2026, 3, 15));
    expect(r.half).toBe("FIRST_HALF");
    expect(r.year).toBe(2026);
    expect(r.start.toISOString()).toBe("2026-01-01T00:00:00.000Z");
    expect(r.end.toISOString()).toBe("2026-06-30T23:59:59.999Z");
  });

  it("하반기 범위는 7/1 ~ 12/31 이다", () => {
    const r = getHalfYearRange(utc(2026, 9, 1));
    expect(r.half).toBe("SECOND_HALF");
    expect(r.start.toISOString()).toBe("2026-07-01T00:00:00.000Z");
    expect(r.end.toISOString()).toBe("2026-12-31T23:59:59.999Z");
  });
});

describe("isSameHalfYear", () => {
  it("같은 반기면 true", () => {
    expect(isSameHalfYear(utc(2026, 1, 5), utc(2026, 6, 20))).toBe(true);
  });
  it("다른 반기면 false", () => {
    expect(isSameHalfYear(utc(2026, 6, 30), utc(2026, 7, 1))).toBe(false);
  });
  it("다른 연도면 false", () => {
    expect(isSameHalfYear(utc(2025, 3, 1), utc(2026, 3, 1))).toBe(false);
  });
});

describe("daysUntil", () => {
  it("미래면 남은 일수를 올림으로 반환", () => {
    expect(daysUntil(utc(2026, 6, 1), utc(2026, 6, 30))).toBe(29);
  });
  it("이미 지났으면 0", () => {
    expect(daysUntil(utc(2026, 7, 1), utc(2026, 6, 30))).toBe(0);
  });
});
