import { describe, expect, it } from "vitest";
import { buildSlackMessage } from "@/lib/slack/payload";

describe("buildSlackMessage", () => {
  it("TEST 메시지에 동호회명이 들어간다", () => {
    const m = buildSlackMessage({ type: "TEST", clubName: "러닝 동호회" });
    expect(m.text).toContain("러닝 동호회");
    expect(m.text).toContain("테스트");
  });

  it("MEETING_CREATED 에 제목/일시/장소가 들어간다", () => {
    const m = buildSlackMessage({
      type: "MEETING_CREATED",
      clubName: "러닝 동호회",
      title: "정기 모임",
      date: "2026.06.20",
      location: "한강공원",
    });
    expect(m.text).toContain("정기 모임");
    expect(m.text).toContain("2026.06.20");
    expect(m.text).toContain("한강공원");
  });

  it("장소가 없으면 장소 줄이 생략된다", () => {
    const m = buildSlackMessage({
      type: "MEETING_CREATED",
      clubName: "c",
      title: "t",
      date: "d",
      location: null,
    });
    expect(m.text).not.toContain("장소:");
  });

  it("BUDGET_ALERT 에 금액과 누락 건수가 들어간다", () => {
    const m = buildSlackMessage({
      type: "BUDGET_ALERT",
      clubName: "러닝 동호회",
      remaining: 5658000,
      expiring: 5658000,
      daysLeft: 16,
      missingReceipts: 2,
      unlinked: 1,
    });
    expect(m.text).toContain("5,658,000원");
    expect(m.text).toContain("영수증 누락: 2건");
    expect(m.text).toContain("활동 연결 누락: 1건");
  });

  it("REPORT_GENERATED 에 형식이 들어간다", () => {
    const m = buildSlackMessage({
      type: "REPORT_GENERATED",
      clubName: "c",
      reportTitle: "6월 예산 보고서",
      format: "XLSX",
    });
    expect(m.text).toContain("XLSX");
    expect(m.text).toContain("6월 예산 보고서");
  });
});
