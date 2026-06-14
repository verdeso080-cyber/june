"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentContext } from "@/lib/auth/session";
import { assertCanOperate } from "@/lib/auth/roles";
import { recordAudit } from "@/lib/audit";
import { notify } from "@/lib/slack/client";

/** 활동 이야기 보고서 생성 기록 후 인쇄 페이지로 이동 (회장 이상). */
export async function createActivityReport(formData: FormData) {
  const { club, role, membership } = await getCurrentContext();
  if (!club) throw new Error("동호회가 없습니다.");
  assertCanOperate(role);

  const activityId = String(formData.get("activityId") ?? "");
  const activity = await prisma.activity.findUnique({
    where: { id: activityId },
  });
  if (!activity || activity.clubId !== club.id) {
    throw new Error("활동을 찾을 수 없습니다.");
  }

  await prisma.report.create({
    data: {
      clubId: club.id,
      type: "ACTIVITY_STORY",
      title: `활동 보고서: ${activity.title}`,
      format: "PDF",
      generatedById: membership?.userId ?? null,
    },
  });
  await recordAudit({
    clubId: club.id,
    actorUserId: membership?.userId ?? null,
    action: "REPORT_GENERATE",
    entityType: "Report",
    entityId: activityId,
    summary: `활동 보고서 생성: ${activity.title}`,
  });

  await notify(club.id, {
    type: "REPORT_GENERATED",
    clubName: club.name,
    reportTitle: `활동 보고서: ${activity.title}`,
    format: "PDF",
  });

  redirect(`/reports/activity/${activityId}`);
}
