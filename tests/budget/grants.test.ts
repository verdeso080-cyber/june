import { describe, expect, it } from "vitest";
import {
  calcMonthlyGrant,
  calcMonthlyGrantFromMembers,
  countActiveMembers,
  sumGrants,
} from "@/lib/budget/grants";
import type { MembershipStatus } from "@/lib/domain";

const m = (status: MembershipStatus) => ({ status });

describe("countActiveMembers", () => {
  it("ACTIVE 회원만 센다", () => {
    const members = [
      m("ACTIVE"),
      m("ACTIVE"),
      m("INACTIVE"),
      m("REVIEW_NEEDED"),
      m("LEFT"),
      m("ACTIVE"),
    ];
    expect(countActiveMembers(members)).toBe(3);
  });
});

describe("calcMonthlyGrant", () => {
  it("활동 회원 20명이면 월 지원금은 1,000,000원", () => {
    expect(calcMonthlyGrant(20)).toBe(1_000_000);
  });

  it("0명이면 0원", () => {
    expect(calcMonthlyGrant(0)).toBe(0);
  });

  it("음수/소수는 오류", () => {
    expect(() => calcMonthlyGrant(-1)).toThrow();
    expect(() => calcMonthlyGrant(1.5)).toThrow();
  });
});

describe("calcMonthlyGrantFromMembers", () => {
  it("inactive/left 를 제외하고 계산한다", () => {
    const members = [
      m("ACTIVE"),
      m("ACTIVE"),
      m("LEFT"),
      m("INACTIVE"),
    ];
    // ACTIVE 2명 → 100,000원
    expect(calcMonthlyGrantFromMembers(members)).toBe(100_000);
  });
});

describe("sumGrants", () => {
  it("월 지원금 합계를 구한다 (2026 상반기 예시)", () => {
    const grants = [
      { amount: 1_000_000 }, // 1월 20명
      { amount: 1_100_000 }, // 2월 22명
      { amount: 1_050_000 }, // 3월 21명
      { amount: 1_050_000 }, // 4월 21명
      { amount: 1_150_000 }, // 5월 23명
      { amount: 1_200_000 }, // 6월 24명
    ];
    expect(sumGrants(grants)).toBe(6_550_000);
  });
});
