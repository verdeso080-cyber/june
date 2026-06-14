import { NextResponse, type NextRequest } from "next/server";
import ExcelJS from "exceljs";
import { prisma } from "@/lib/db";
import { getCurrentContext } from "@/lib/auth/session";
import { canManageBudget } from "@/lib/auth/roles";
import { recordAudit } from "@/lib/audit";
import { notify } from "@/lib/slack/client";
import { getMonthlyBudgetReport } from "@/lib/reports/budget";
import { buildBudgetCsv, budgetReportFilename } from "@/lib/reports/csv";
import { formatDate } from "@/lib/format";

export async function GET(req: NextRequest) {
  const { club, role, membership } = await getCurrentContext();
  if (!club) return new NextResponse("동호회가 없습니다.", { status: 404 });
  if (!canManageBudget(role)) {
    return new NextResponse("권한이 없습니다.", { status: 403 });
  }

  const sp = req.nextUrl.searchParams;
  const now = new Date();
  const year = Number(sp.get("year") ?? now.getUTCFullYear());
  const month = Number(sp.get("month") ?? now.getUTCMonth() + 1);
  const format = sp.get("format") === "csv" ? "csv" : "xlsx";

  if (!Number.isInteger(year) || month < 1 || month > 12) {
    return new NextResponse("연/월이 올바르지 않습니다.", { status: 400 });
  }

  const report = await getMonthlyBudgetReport(club.id, year, month);
  const filename = budgetReportFilename(report, format);

  await prisma.report.create({
    data: {
      clubId: club.id,
      type: "MONTHLY_BUDGET",
      title: `${report.year}년 ${report.month}월 예산 보고서`,
      year: report.year,
      month: report.month,
      half: report.half,
      format: format.toUpperCase(),
      generatedById: membership?.userId ?? null,
    },
  });
  await recordAudit({
    clubId: club.id,
    actorUserId: membership?.userId ?? null,
    action: "REPORT_GENERATE",
    entityType: "Report",
    summary: `월간 예산 보고서 (${format.toUpperCase()}) ${report.year}-${report.month}`,
  });
  await notify(club.id, {
    type: "REPORT_GENERATED",
    clubName: club.name,
    reportTitle: `${report.year}년 ${report.month}월 예산 보고서`,
    format: format.toUpperCase(),
  });

  const disposition = `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`;

  if (format === "csv") {
    return new NextResponse(buildBudgetCsv(report), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": disposition,
      },
    });
  }

  // xlsx
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("예산 보고서");
  ws.addRow([`${report.clubName} ${report.year}년 ${report.month}월 예산 보고서`]);
  ws.addRow([]);
  const header = ws.addRow([
    "사용일",
    "카드 사용자",
    "카드",
    "가맹점",
    "카테고리",
    "연결 활동",
    "영수증",
    "금액",
  ]);
  header.font = { bold: true };
  for (const r of report.rows) {
    ws.addRow([
      formatDate(r.transactionDate),
      r.holderName,
      r.cardLabel,
      r.merchantName,
      r.category ?? "",
      r.activityTitle ?? "(미연결)",
      r.hasReceipt ? "O" : "X",
      r.amount,
    ]);
  }
  ws.addRow([]);
  ws.addRow(["월간 총 사용금액", "", "", "", "", "", "", report.monthlyTotal]);
  ws.addRow([]);
  ws.addRow(["사용자별 사용금액"]).font = { bold: true };
  for (const u of report.perUser) ws.addRow([u.holderName, "", "", "", "", "", "", u.total]);
  ws.addRow([]);
  ws.addRow(["반기 누적 지원금", "", "", "", "", "", "", report.halfGranted]);
  ws.addRow(["반기 누적 사용금액", "", "", "", "", "", "", report.halfUsed]);
  ws.addRow(["반기 잔여 예산", "", "", "", "", "", "", report.halfRemaining]);
  ws.addRow(["소멸 예정 금액", "", "", "", "", "", "", report.expiringAmount]);

  ws.columns.forEach((c) => {
    c.width = 16;
  });

  const buf = await wb.xlsx.writeBuffer();
  return new NextResponse(buf, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": disposition,
    },
  });
}
