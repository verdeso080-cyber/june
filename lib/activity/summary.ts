/**
 * 활동 이야기 관련 순수 집계 로직.
 */

/** 연결된 카드 사용 내역 합계. */
export function sumTransactionAmounts(
  txs: ReadonlyArray<{ amount: number }>,
): number {
  return txs.reduce((sum, t) => sum + t.amount, 0);
}

/** 실제 체크인한 참석자 수(checkedInAt 이 있는 출석). */
export function countAttendees(
  attendances: ReadonlyArray<{ checkedInAt: Date | null }>,
): number {
  return attendances.filter((a) => a.checkedInAt !== null).length;
}

/** 보고서에 포함될 사진(상태 SELECTED_FOR_REPORT) 개수. */
export function countReportPhotos(
  photos: ReadonlyArray<{ status: string }>,
): number {
  return photos.filter((p) => p.status === "SELECTED_FOR_REPORT").length;
}
