import { MONTHLY_SUPPORT_PER_MEMBER } from "@/lib/domain";
import type { MembershipStatus } from "@/lib/domain";

/**
 * 월 지원금 = 활동 회원 수 × 50,000원.
 *
 * "활동 회원" = 현재 status 가 ACTIVE 인 회원.
 * (INACTIVE / REVIEW_NEEDED / LEFT 는 제외)
 */

/** ACTIVE 회원 수를 셉니다. */
export function countActiveMembers(
  members: ReadonlyArray<{ status: MembershipStatus }>,
): number {
  return members.filter((m) => m.status === "ACTIVE").length;
}

/** 활동 회원 수로부터 월 지원금을 계산합니다. */
export function calcMonthlyGrant(activeMemberCount: number): number {
  if (!Number.isInteger(activeMemberCount) || activeMemberCount < 0) {
    throw new Error(
      `calcMonthlyGrant: activeMemberCount must be a non-negative integer, got ${activeMemberCount}`,
    );
  }
  return activeMemberCount * MONTHLY_SUPPORT_PER_MEMBER;
}

/** 회원 목록으로부터 곧바로 월 지원금을 계산합니다. */
export function calcMonthlyGrantFromMembers(
  members: ReadonlyArray<{ status: MembershipStatus }>,
): number {
  return calcMonthlyGrant(countActiveMembers(members));
}

/** 여러 월 지원금의 합계(반기 총 지원금 등). */
export function sumGrants(grants: ReadonlyArray<{ amount: number }>): number {
  return grants.reduce((total, g) => total + g.amount, 0);
}
