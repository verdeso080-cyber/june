import { randomBytes } from "node:crypto";

/**
 * QR 체크인 세션 관련 순수 로직.
 */

/** 예측 불가능한 체크인 토큰(48자리 hex). */
export function generateCheckinToken(): string {
  return randomBytes(24).toString("hex");
}

/** 기준 시각으로부터 만료 시각 계산(기본 180분). */
export function defaultExpiry(from: Date, minutes = 180): Date {
  return new Date(from.getTime() + minutes * 60_000);
}

/** 세션이 유효한지(활성 + 미만료). */
export function isCheckinValid(
  session: { active: boolean; expiresAt: Date },
  now: Date,
): boolean {
  return session.active && session.expiresAt.getTime() > now.getTime();
}
