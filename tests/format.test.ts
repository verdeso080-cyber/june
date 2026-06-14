import { describe, expect, it } from "vitest";
import { formatKRW } from "@/lib/format";

describe("formatKRW", () => {
  it("천 단위 구분 기호와 '원'을 붙인다", () => {
    expect(formatKRW(1050000)).toBe("1,050,000원");
  });

  it("0원도 올바르게 표기한다", () => {
    expect(formatKRW(0)).toBe("0원");
  });

  it("소수는 반올림한다", () => {
    expect(formatKRW(999.6)).toBe("1,000원");
  });

  it("유한하지 않은 값은 오류를 던진다", () => {
    expect(() => formatKRW(Number.NaN)).toThrow();
  });
});
