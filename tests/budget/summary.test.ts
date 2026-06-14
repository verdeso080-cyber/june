import { describe, expect, it } from "vitest";
import { calcBudgetSummary } from "@/lib/budget/summary";

const utc = (y: number, m: number, d: number) =>
  new Date(Date.UTC(y, m - 1, d));

const periodEnd = new Date(Date.UTC(2026, 5, 30, 23, 59, 59, 999)); // 6/30

describe("calcBudgetSummary", () => {
  it("잔여 = 총 지원금 - 총 사용액", () => {
    const s = calcBudgetSummary({
      half: "FIRST_HALF",
      grants: [{ amount: 1_000_000 }, { amount: 1_000_000 }],
      transactions: [{ amount: 300_000 }, { amount: 200_000 }],
      periodEnd,
      now: utc(2026, 6, 1),
    });
    expect(s.totalGranted).toBe(2_000_000);
    expect(s.totalUsed).toBe(500_000);
    expect(s.remaining).toBe(1_500_000);
  });

  it("잔여가 양수면 그 값이 소멸 예정 금액", () => {
    const s = calcBudgetSummary({
      half: "FIRST_HALF",
      grants: [{ amount: 1_000_000 }],
      transactions: [{ amount: 400_000 }],
      periodEnd,
      now: utc(2026, 6, 1),
    });
    expect(s.expiringAmount).toBe(600_000);
  });

  it("조정액(adjustments)을 반영한다", () => {
    const s = calcBudgetSummary({
      half: "FIRST_HALF",
      grants: [{ amount: 1_000_000 }],
      transactions: [{ amount: 400_000 }],
      periodEnd,
      now: utc(2026, 6, 1),
      adjustments: -100_000, // 환불 취소 등 차감 보정
    });
    expect(s.remaining).toBe(500_000);
  });

  it("반기 종료 전에는 expired=false, 남은 일수>0", () => {
    const s = calcBudgetSummary({
      half: "FIRST_HALF",
      grants: [{ amount: 1_000_000 }],
      transactions: [],
      periodEnd,
      now: utc(2026, 6, 20),
    });
    expect(s.expired).toBe(false);
    expect(s.daysUntilExpiration).toBeGreaterThan(0);
  });

  it("반기 종료가 지나면 expired=true, 남은 일수=0", () => {
    const s = calcBudgetSummary({
      half: "FIRST_HALF",
      grants: [{ amount: 1_000_000 }],
      transactions: [{ amount: 200_000 }],
      periodEnd,
      now: utc(2026, 7, 1),
    });
    expect(s.expired).toBe(true);
    expect(s.daysUntilExpiration).toBe(0);
    // 소멸 예정 금액은 여전히 남은 잔여(소멸 대상)
    expect(s.expiringAmount).toBe(800_000);
  });

  it("초과 사용 시 잔여는 음수, 소멸 예정은 0", () => {
    const s = calcBudgetSummary({
      half: "FIRST_HALF",
      grants: [{ amount: 1_000_000 }],
      transactions: [{ amount: 1_200_000 }],
      periodEnd,
      now: utc(2026, 6, 1),
    });
    expect(s.remaining).toBe(-200_000);
    expect(s.expiringAmount).toBe(0);
  });
});
