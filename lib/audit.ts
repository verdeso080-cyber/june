import { prisma } from "@/lib/db";

/**
 * 감사 로그(Audit Log) 기록 헬퍼.
 *
 * CLAUDE.md 규칙에 따라 중요한 변경(역할/상태 변경, 스냅샷 생성/수정,
 * 지원금 재계산, 거래 CRUD, 보고서 생성, Slack 설정 변경 등)에 남깁니다.
 */

export interface AuditInput {
  clubId?: string | null;
  actorUserId?: string | null;
  action: string; // 예: TRANSACTION_CREATE, GRANT_RECALC, ROLE_CHANGE
  entityType: string; // 예: BudgetTransaction, Membership
  entityId?: string | null;
  summary?: string;
  /** 추가 정보(자유 형식). JSON 으로 직렬화되어 저장됩니다. */
  metadata?: Record<string, unknown>;
}

export async function recordAudit(input: AuditInput): Promise<void> {
  await prisma.auditLog.create({
    data: {
      clubId: input.clubId ?? null,
      actorUserId: input.actorUserId ?? null,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId ?? null,
      summary: input.summary ?? null,
      metadata: input.metadata ? JSON.stringify(input.metadata) : null,
    },
  });
}
