import type { HalfYear } from "@/lib/domain";

/**
 * 반기(half-year) 계산 유틸.
 *
 * 규칙:
 * - 1~6월 → FIRST_HALF
 * - 7~12월 → SECOND_HALF
 *
 * 날짜 계산은 UTC 기준의 달력 날짜로 처리합니다.
 * (호출하는 쪽에서 한국 시간(KST) 기준의 달력 날짜를 전달한다고 가정)
 */

export interface HalfYearRange {
  half: HalfYear;
  year: number;
  /** 반기 시작(포함): 1/1 또는 7/1 00:00:00.000 UTC */
  start: Date;
  /** 반기 종료(포함): 6/30 또는 12/31 23:59:59.999 UTC */
  end: Date;
}

/** 해당 날짜가 속한 반기를 반환 */
export function getHalfYear(date: Date): HalfYear {
  const month = date.getUTCMonth() + 1; // 1~12
  return month <= 6 ? "FIRST_HALF" : "SECOND_HALF";
}

/** 해당 날짜가 속한 반기의 연도/시작/종료를 반환 */
export function getHalfYearRange(date: Date): HalfYearRange {
  const year = date.getUTCFullYear();
  const half = getHalfYear(date);

  if (half === "FIRST_HALF") {
    return {
      half,
      year,
      start: new Date(Date.UTC(year, 0, 1, 0, 0, 0, 0)), // 1/1
      end: new Date(Date.UTC(year, 5, 30, 23, 59, 59, 999)), // 6/30
    };
  }

  return {
    half,
    year,
    start: new Date(Date.UTC(year, 6, 1, 0, 0, 0, 0)), // 7/1
    end: new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999)), // 12/31
  };
}

/** 두 날짜가 같은 반기에 속하는지 */
export function isSameHalfYear(a: Date, b: Date): boolean {
  return (
    a.getUTCFullYear() === b.getUTCFullYear() && getHalfYear(a) === getHalfYear(b)
  );
}

/**
 * 소멸일(반기 종료일)까지 남은 일수.
 * - 이미 지났으면 0 을 반환합니다.
 */
export function daysUntil(from: Date, deadline: Date): number {
  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  const diff = deadline.getTime() - from.getTime();
  if (diff <= 0) return 0;
  return Math.ceil(diff / MS_PER_DAY);
}
