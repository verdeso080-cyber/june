/**
 * 민감정보 마스킹.
 *
 * - 카드번호 전체는 저장하지 않는다(끝 4자리만 표시용).
 * - 승인번호는 저장 시점부터 마스킹 형태로만 보관한다.
 */

/** 승인번호를 마스킹합니다. 끝 4자리만 남기고 나머지는 * 처리. */
export function maskApprovalNo(raw?: string | null): string | null {
  if (!raw) return null;
  const cleaned = raw.replace(/\s|-/g, "");
  if (cleaned.length === 0) return null;
  if (cleaned.length <= 4) return "*".repeat(cleaned.length);
  return "*".repeat(cleaned.length - 4) + cleaned.slice(-4);
}

/** 카드 끝 4자리 표시 (예: "•••• 1234"). 값이 없으면 빈 문자열. */
export function maskedCardLabel(last4?: string | null): string {
  if (!last4) return "";
  return `•••• ${last4}`;
}
