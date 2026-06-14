import { describe, expect, it } from "vitest";
import {
  defaultExpiry,
  generateCheckinToken,
  isCheckinValid,
} from "@/lib/attendance/session";

describe("generateCheckinToken", () => {
  it("48자리 hex 토큰을 만든다", () => {
    const t = generateCheckinToken();
    expect(t).toMatch(/^[0-9a-f]{48}$/);
  });

  it("매번 다른 토큰을 만든다", () => {
    const set = new Set(Array.from({ length: 100 }, () => generateCheckinToken()));
    expect(set.size).toBe(100);
  });
});

describe("isCheckinValid", () => {
  const now = new Date("2026-06-14T10:00:00Z");

  it("활성 + 미만료면 유효", () => {
    expect(
      isCheckinValid(
        { active: true, expiresAt: new Date("2026-06-14T11:00:00Z") },
        now,
      ),
    ).toBe(true);
  });

  it("만료되면 무효", () => {
    expect(
      isCheckinValid(
        { active: true, expiresAt: new Date("2026-06-14T09:59:00Z") },
        now,
      ),
    ).toBe(false);
  });

  it("비활성이면 무효", () => {
    expect(
      isCheckinValid(
        { active: false, expiresAt: new Date("2026-06-14T11:00:00Z") },
        now,
      ),
    ).toBe(false);
  });
});

describe("defaultExpiry", () => {
  it("기본 180분 뒤로 만료를 설정", () => {
    const from = new Date("2026-06-14T10:00:00Z");
    expect(defaultExpiry(from).toISOString()).toBe("2026-06-14T13:00:00.000Z");
  });
});
