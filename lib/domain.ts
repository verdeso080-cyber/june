/**
 * 도메인 공통 타입/상수
 *
 * SQLite 는 enum 을 지원하지 않으므로 DB 에는 String 으로 저장하고,
 * 코드에서는 아래의 유니온 타입과 상수로 안전하게 다룹니다.
 */

export const ROLES = ["OWNER", "PRESIDENT", "TREASURER", "MEMBER"] as const;
export type Role = (typeof ROLES)[number];

export const MEMBERSHIP_STATUSES = [
  "ACTIVE",
  "INACTIVE",
  "REVIEW_NEEDED",
  "LEFT",
] as const;
export type MembershipStatus = (typeof MEMBERSHIP_STATUSES)[number];

export const HALF_YEARS = ["FIRST_HALF", "SECOND_HALF"] as const;
export type HalfYear = (typeof HALF_YEARS)[number];

export const PHOTO_STATUSES = [
  "UPLOADED",
  "VISIBLE",
  "SELECTED_FOR_REPORT",
  "EXCLUDED",
  "DELETE_REQUESTED",
] as const;
export type PhotoStatus = (typeof PHOTO_STATUSES)[number];

export const ATTENDANCE_RESPONSES = ["GOING", "MAYBE", "NOT_GOING"] as const;
export type AttendanceResponse = (typeof ATTENDANCE_RESPONSES)[number];

export const REPORT_TYPES = ["MONTHLY_BUDGET", "ACTIVITY_STORY"] as const;
export type ReportType = (typeof REPORT_TYPES)[number];

/** 회원 1명당 월 지원금 (KRW) */
export const MONTHLY_SUPPORT_PER_MEMBER = 50_000;

/** 권한 우선순위: 숫자가 클수록 강한 권한 */
export const ROLE_RANK: Record<Role, number> = {
  MEMBER: 0,
  TREASURER: 1,
  PRESIDENT: 2,
  OWNER: 3,
};
