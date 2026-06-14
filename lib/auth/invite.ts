/**
 * 초대코드 검증 (순수 함수, 테스트 대상).
 * 외부인이 아무나 들어오지 못하도록 가입을 통제합니다.
 */

export interface InviteLike {
  active: boolean;
  expiresAt: Date | null;
  maxUses: number | null;
  usedCount: number;
}

export interface InviteCheck {
  ok: boolean;
  reason?: string;
}

export function validateInvite(
  invite: InviteLike | null,
  now: Date = new Date(),
): InviteCheck {
  if (!invite) return { ok: false, reason: "존재하지 않는 초대코드입니다." };
  if (!invite.active) return { ok: false, reason: "비활성화된 초대코드입니다." };
  if (invite.expiresAt && invite.expiresAt.getTime() < now.getTime()) {
    return { ok: false, reason: "만료된 초대코드입니다." };
  }
  if (invite.maxUses !== null && invite.usedCount >= invite.maxUses) {
    return { ok: false, reason: "사용 횟수를 초과한 초대코드입니다." };
  }
  return { ok: true };
}

/** 닉네임 정규화/검증. */
export function normalizeNickname(raw: string): string {
  return raw.trim();
}

export function isValidNickname(nickname: string): boolean {
  const n = normalizeNickname(nickname);
  return n.length >= 1 && n.length <= 20;
}
