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

/** 날짜를 "YYYY.MM.DD" 형태로 표기합니다 (UTC 기준). */
export function formatDate(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}.${m}.${d}`;
}
