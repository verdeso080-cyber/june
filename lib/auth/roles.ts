import type { Role } from "@/lib/domain";
import { ROLE_RANK } from "@/lib/domain";

/** 역할 한글 표시 */
export const ROLE_LABELS: Record<Role, string> = {
  OWNER: "운영자",
  PRESIDENT: "회장",
  TREASURER: "총무",
  MEMBER: "회원",
};

/** 예산(카드 사용 내역) 입력/수정 권한: 총무 이상 */
export function canManageBudget(role: Role): boolean {
  return ROLE_RANK[role] >= ROLE_RANK.TREASURER;
}

/** 활동 보고서용 사진 선택 등 운영 권한: 회장 이상 */
export function canOperate(role: Role): boolean {
  return ROLE_RANK[role] >= ROLE_RANK.PRESIDENT;
}

/** 권한이 없으면 오류를 던집니다(서버 측 강제용). */
export function assertCanManageBudget(role: Role): void {
  if (!canManageBudget(role)) {
    throw new Error("권한이 없습니다. 예산 입력은 총무/회장/운영자만 가능합니다.");
  }
}

/** 운영 권한(회장 이상)이 없으면 오류를 던집니다. */
export function assertCanOperate(role: Role): void {
  if (!canOperate(role)) {
    throw new Error("권한이 없습니다. 모임/활동 운영은 회장/운영자만 가능합니다.");
  }
}
