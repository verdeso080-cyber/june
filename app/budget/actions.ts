"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentContext } from "@/lib/auth/session";
import { assertCanManageBudget } from "@/lib/auth/roles";
import { recordAudit } from "@/lib/audit";
import { maskApprovalNo } from "@/lib/budget/mask";
import { getHalfYearRange } from "@/lib/budget/period";
import {
  approvalKey,
  classifyRow,
  parseTransactionsCsv,
  softKey,
  type DupStatus,
  type ParsedTxRow,
} from "@/lib/budget/csv";

/** 거래 날짜가 속한 반기 예산함을 보장(없으면 생성)하고 id 반환. */
async function ensurePeriod(clubId: string, date: Date): Promise<string> {
  const range = getHalfYearRange(date);
  const period = await prisma.budgetPeriod.upsert({
    where: {
      clubId_year_half: { clubId, year: range.year, half: range.half },
    },
    create: {
      clubId,
      year: range.year,
      half: range.half,
      startDate: range.start,
      endDate: range.end,
    },
    update: {},
  });
  return period.id;
}

/** 수기 카드 사용 내역 추가 */
export async function createTransaction(formData: FormData) {
  const { club, role, membership } = await getCurrentContext();
  if (!club) throw new Error("동호회가 없습니다.");
  assertCanManageBudget(role);

  const cardId = String(formData.get("cardId") ?? "");
  const dateStr = String(formData.get("transactionDate") ?? "");
  const amount = Number(String(formData.get("amount") ?? "").replace(/,/g, ""));
  const merchantName = String(formData.get("merchantName") ?? "").trim();
  const category = (String(formData.get("category") ?? "").trim() || null) as
    | string
    | null;
  const activityIdRaw = String(formData.get("activityId") ?? "");
  const activityId = activityIdRaw ? activityIdRaw : null;
  const approvalNo = String(formData.get("approvalNo") ?? "").trim() || null;
  const memo = String(formData.get("memo") ?? "").trim() || null;

  const date = new Date(dateStr);
  if (!cardId) throw new Error("카드를 선택하세요.");
  if (Number.isNaN(date.getTime())) throw new Error("날짜를 확인하세요.");
  if (!merchantName) throw new Error("가맹점명을 입력하세요.");
  if (!Number.isInteger(amount) || amount <= 0) {
    throw new Error("금액은 0보다 큰 정수여야 합니다.");
  }

  const periodId = await ensurePeriod(club.id, date);

  const tx = await prisma.budgetTransaction.create({
    data: {
      clubId: club.id,
      cardId,
      periodId,
      activityId,
      enteredById: membership?.userId ?? null,
      transactionDate: date,
      amount,
      merchantName,
      category,
      approvalNoMasked: maskApprovalNo(approvalNo),
      memo,
    },
  });

  await recordAudit({
    clubId: club.id,
    actorUserId: membership?.userId ?? null,
    action: "TRANSACTION_CREATE",
    entityType: "BudgetTransaction",
    entityId: tx.id,
    summary: `${merchantName} ${amount}원 수기 입력`,
  });

  revalidatePath("/budget");
  revalidatePath("/budget/transactions");
  revalidatePath("/dashboard");
  redirect("/budget/transactions");
}

export interface PreviewRow extends ParsedTxRow {
  dup: DupStatus;
}

export interface PreviewResult {
  rows: PreviewRow[];
  errors: { lineNumber: number; message: string }[];
  counts: { total: number; toInsert: number; duplicate: number; suspect: number };
}

/** 기존 거래로부터 중복 판정용 키 집합을 만든다. */
async function loadExistingKeys(clubId: string) {
  const existing = await prisma.budgetTransaction.findMany({
    where: { clubId },
    include: { card: true },
  });
  const approvals = new Set<string>();
  const softs = new Set<string>();
  for (const t of existing) {
    if (t.approvalNoMasked) approvals.add(approvalKey(t.approvalNoMasked));
    softs.add(
      softKey({
        transactionDate: t.transactionDate.toISOString().slice(0, 10),
        amount: t.amount,
        merchantName: t.merchantName,
        cardHolderName: t.card?.holderName ?? "",
      }),
    );
  }
  return { approvals, softs };
}

/** CSV 미리보기: 파싱 + 중복 판정 (저장하지 않음) */
export async function previewImport(csvText: string): Promise<PreviewResult> {
  const { club, role } = await getCurrentContext();
  if (!club) throw new Error("동호회가 없습니다.");
  assertCanManageBudget(role);

  const { rows, errors } = parseTransactionsCsv(csvText);
  // 저장본은 이미 마스킹된 승인번호이므로, 업로드 행도 마스킹 후 비교한다.
  const { approvals, softs } = await loadExistingKeys(club.id);

  const previewRows: PreviewRow[] = rows.map((r) => {
    const masked = maskApprovalNo(r.approvalNo);
    const dup = classifyRow({ ...r, approvalNo: masked }, approvals, softs);
    return { ...r, dup };
  });

  const duplicate = previewRows.filter((r) => r.dup === "DUPLICATE").length;
  const suspect = previewRows.filter((r) => r.dup === "SUSPECT").length;

  return {
    rows: previewRows,
    errors,
    counts: {
      total: previewRows.length,
      toInsert: previewRows.length - duplicate,
      duplicate,
      suspect,
    },
  };
}

/** 카드 라벨/소유자로 카드를 찾고 없으면 생성. */
async function ensureCard(clubId: string, label: string, holderName: string) {
  const found = await prisma.corporateCard.findFirst({
    where: { clubId, label },
  });
  if (found) return found.id;
  const created = await prisma.corporateCard.create({
    data: { clubId, label, holderName },
  });
  return created.id;
}

/** CSV 확정 저장: 중복(DUPLICATE)은 건너뛰고 나머지를 저장. */
export async function confirmImport(csvText: string) {
  const { club, role, membership } = await getCurrentContext();
  if (!club) throw new Error("동호회가 없습니다.");
  assertCanManageBudget(role);

  const { rows } = parseTransactionsCsv(csvText);
  const { approvals, softs } = await loadExistingKeys(club.id);

  let inserted = 0;
  for (const r of rows) {
    const masked = maskApprovalNo(r.approvalNo);
    const dup = classifyRow({ ...r, approvalNo: masked }, approvals, softs);
    if (dup === "DUPLICATE") continue;

    const date = new Date(r.transactionDate);
    const cardId = await ensureCard(club.id, r.cardLabel, r.cardHolderName);
    const periodId = await ensurePeriod(club.id, date);

    await prisma.budgetTransaction.create({
      data: {
        clubId: club.id,
        cardId,
        periodId,
        enteredById: membership?.userId ?? null,
        transactionDate: date,
        amount: r.amount,
        merchantName: r.merchantName,
        category: r.category,
        approvalNoMasked: masked,
        memo: r.memo,
      },
    });
    inserted++;

    // 이번 배치 내 중복도 방지
    if (masked) approvals.add(approvalKey(masked));
    softs.add(softKey(r));
  }

  await recordAudit({
    clubId: club.id,
    actorUserId: membership?.userId ?? null,
    action: "TRANSACTION_IMPORT",
    entityType: "BudgetTransaction",
    summary: `CSV 업로드로 ${inserted}건 저장`,
    metadata: { inserted, total: rows.length },
  });

  revalidatePath("/budget");
  revalidatePath("/budget/transactions");
  revalidatePath("/dashboard");
  redirect("/budget/transactions");
}
