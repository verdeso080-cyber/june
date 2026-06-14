import { describe, expect, it } from "vitest";
import {
  isValidNickname,
  normalizeNickname,
  validateInvite,
} from "@/lib/auth/invite";

const now = new Date("2026-06-14T00:00:00Z");

describe("validateInvite", () => {
  it("없으면 실패", () => {
    expect(validateInvite(null, now).ok).toBe(false);
  });
  it("비활성이면 실패", () => {
    expect(
      validateInvite(
        { active: false, expiresAt: null, maxUses: null, usedCount: 0 },
        now,
      ).ok,
    ).toBe(false);
  });
  it("만료되면 실패", () => {
    expect(
      validateInvite(
        {
          active: true,
          expiresAt: new Date("2026-06-13T00:00:00Z"),
          maxUses: null,
          usedCount: 0,
        },
        now,
      ).ok,
    ).toBe(false);
  });
  it("사용 횟수 초과면 실패", () => {
    expect(
      validateInvite(
        { active: true, expiresAt: null, maxUses: 5, usedCount: 5 },
        now,
      ).ok,
    ).toBe(false);
  });
  it("유효하면 성공", () => {
    expect(
      validateInvite(
        { active: true, expiresAt: null, maxUses: null, usedCount: 0 },
        now,
      ).ok,
    ).toBe(true);
  });
});

describe("nickname", () => {
  it("공백을 제거한다", () => {
    expect(normalizeNickname("  hong ")).toBe("hong");
  });
  it("1~20자만 허용", () => {
    expect(isValidNickname("")).toBe(false);
    expect(isValidNickname("a")).toBe(true);
    expect(isValidNickname("a".repeat(21))).toBe(false);
  });
});
