import { describe, expect, it } from "vitest";
import { maskApprovalNo, maskedCardLabel } from "@/lib/budget/mask";

describe("maskApprovalNo", () => {
  it("끝 4자리만 남기고 마스킹한다", () => {
    expect(maskApprovalNo("30012345")).toBe("****2345");
  });

  it("하이픈/공백을 제거하고 마스킹한다", () => {
    expect(maskApprovalNo("3001-2345")).toBe("****2345");
  });

  it("4자리 이하는 전부 마스킹", () => {
    expect(maskApprovalNo("12")).toBe("**");
  });

  it("빈 값은 null", () => {
    expect(maskApprovalNo("")).toBeNull();
    expect(maskApprovalNo(null)).toBeNull();
    expect(maskApprovalNo(undefined)).toBeNull();
  });
});

describe("maskedCardLabel", () => {
  it("끝 4자리를 점과 함께 표시", () => {
    expect(maskedCardLabel("1234")).toBe("•••• 1234");
  });
  it("값이 없으면 빈 문자열", () => {
    expect(maskedCardLabel(null)).toBe("");
  });
});
