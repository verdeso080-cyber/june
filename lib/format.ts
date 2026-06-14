/**
 * 금액을 한국 원화 표기 문자열로 변환합니다.
 * 예) 1050000 -> "1,050,000원"
 */
export function formatKRW(amount: number): string {
  if (!Number.isFinite(amount)) {
    throw new Error("formatKRW: amount must be a finite number");
  }
  return `${Math.round(amount).toLocaleString("ko-KR")}원`;
}
