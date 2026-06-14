import type { HalfYear } from "@/lib/domain";
import { daysUntil } from "@/lib/budget/period";
import { sumGrants } from "@/lib/budget/grants";

/**
 * 반기 예산 요약 계산.
 *
 * 규칙:
 * - 반기 총 지원금 = 해당 반기의 월 지원금 합계.
 * - 반기 총 사용액 = 해당 반기 카드 사용 내역 합계.
 * - 잔여 예산 = 총 지원금 - 총 사용액 + 조정액(adjustments).
 * - 미사용 예산은 반기 안에서만 이월되고, 반기 종료 시점에 소멸한다.
 *   → 따라서 "소멸 예정 금액"은 (양수일 때의) 잔여 예산 전부.
 */

export interface BudgetSummaryInput {
  half: HalfYear;
  /** 해당 반기의 월 지원금 목록 */
  grants: ReadonlyArray<{ amount: number }>;
  /** 해당 반기의 카드 사용 내역 목록 */
  transactions: ReadonlyArray<{ amount: number }>;
  /** 반기 종료일(소멸 기준일) */
  periodEnd: Date;
  /** 기준 시각(보통 현재) */
  now: Date;
  /** 수동 조정액(환불/보정 등). 기본 0 */
  adjustments?: number;
}

export interface BudgetSummary {
  half: HalfYear;
  totalGranted: number;
  totalUsed: number;
  remaining: number;
  /** 반기 종료 시 소멸 예정 금액 (잔여가 양수일 때 그 값, 아니면 0) */
  expiringAmount: number;
  /** 소멸일까지 남은 일수 (지났으면 0) */
  daysUntilExpiration: number;
  /** 반기 종료가 지났는지 */
  expired: boolean;
}

export function calcBudgetSummary(input: BudgetSummaryInput): BudgetSummary {
  const { half, grants, transactions, periodEnd, now } = input;
  const adjustments = input.adjustments ?? 0;

  const totalGranted = sumGrants(grants);
  const totalUsed = transactions.reduce((sum, t) => sum + t.amount, 0);
  const remaining = totalGranted - totalUsed + adjustments;

  const expired = now.getTime() > periodEnd.getTime();
  const expiringAmount = remaining > 0 ? remaining : 0;

  return {
    half,
    totalGranted,
    totalUsed,
    remaining,
    expiringAmount,
    daysUntilExpiration: daysUntil(now, periodEnd),
    expired,
  };
}
