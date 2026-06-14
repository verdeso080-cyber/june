/**
 * 카드 사용 내역 CSV 파싱 + 중복 탐지 (순수 함수, 테스트 대상).
 *
 * 표준 컬럼:
 *   transaction_date,card_holder_name,card_label,approval_no,merchant_name,amount,category,memo
 */

export interface ParsedTxRow {
  lineNumber: number;
  transactionDate: string; // YYYY-MM-DD
  cardHolderName: string;
  cardLabel: string;
  approvalNo: string | null;
  merchantName: string;
  amount: number;
  category: string | null;
  memo: string | null;
}

export interface CsvRowError {
  lineNumber: number;
  message: string;
}

export interface CsvParseResult {
  rows: ParsedTxRow[];
  errors: CsvRowError[];
}

export type DupStatus = "NEW" | "DUPLICATE" | "SUSPECT";

const REQUIRED_HEADERS = [
  "transaction_date",
  "card_holder_name",
  "card_label",
  "approval_no",
  "merchant_name",
  "amount",
  "category",
  "memo",
] as const;

/** 한 줄을 CSV 필드 배열로 분리 (따옴표로 감싼 콤마 처리). */
function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cur += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      out.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out.map((s) => s.trim());
}

function emptyToNull(v: string): string | null {
  return v === "" ? null : v;
}

export function parseTransactionsCsv(text: string): CsvParseResult {
  const rows: ParsedTxRow[] = [];
  const errors: CsvRowError[] = [];

  const lines = text
    .split(/\r?\n/)
    .map((l) => l)
    .filter((l, idx) => !(idx > 0 && l.trim() === "")); // 끝 빈 줄 무시

  if (lines.length === 0 || lines[0].trim() === "") {
    errors.push({ lineNumber: 1, message: "빈 파일입니다." });
    return { rows, errors };
  }

  const header = splitCsvLine(lines[0]).map((h) => h.toLowerCase());
  const missing = REQUIRED_HEADERS.filter((h) => !header.includes(h));
  if (missing.length > 0) {
    errors.push({
      lineNumber: 1,
      message: `헤더 누락: ${missing.join(", ")}`,
    });
    return { rows, errors };
  }

  const col = (name: string) => header.indexOf(name);

  for (let i = 1; i < lines.length; i++) {
    const raw = lines[i];
    if (raw.trim() === "") continue;
    const lineNumber = i + 1;
    const cells = splitCsvLine(raw);

    const dateStr = cells[col("transaction_date")] ?? "";
    const holder = cells[col("card_holder_name")] ?? "";
    const label = cells[col("card_label")] ?? "";
    const merchant = cells[col("merchant_name")] ?? "";
    const amountStr = (cells[col("amount")] ?? "").replace(/,/g, "");

    const rowErrors: string[] = [];

    const date = new Date(dateStr);
    if (!dateStr || Number.isNaN(date.getTime())) {
      rowErrors.push("날짜 형식 오류");
    }
    if (!holder) rowErrors.push("카드 사용자 누락");
    if (!label) rowErrors.push("카드 라벨 누락");
    if (!merchant) rowErrors.push("가맹점명 누락");

    const amount = Number(amountStr);
    if (!amountStr || Number.isNaN(amount) || !Number.isInteger(amount) || amount <= 0) {
      rowErrors.push("금액 오류(양의 정수여야 함)");
    }

    if (rowErrors.length > 0) {
      errors.push({ lineNumber, message: rowErrors.join(", ") });
      continue;
    }

    rows.push({
      lineNumber,
      transactionDate: dateStr,
      cardHolderName: holder,
      cardLabel: label,
      approvalNo: emptyToNull(cells[col("approval_no")] ?? ""),
      merchantName: merchant,
      amount,
      category: emptyToNull(cells[col("category")] ?? ""),
      memo: emptyToNull(cells[col("memo")] ?? ""),
    });
  }

  return { rows, errors };
}

/** 승인번호가 있을 때의 강한 중복 키. */
export function approvalKey(approvalNo: string): string {
  return approvalNo.replace(/\s|-/g, "");
}

/** 승인번호가 없을 때의 약한(의심) 중복 키. */
export function softKey(row: {
  transactionDate: string;
  amount: number;
  merchantName: string;
  cardHolderName: string;
}): string {
  return [
    row.transactionDate,
    String(row.amount),
    row.merchantName,
    row.cardHolderName,
  ].join("|");
}

/**
 * 한 행의 중복 여부를 분류.
 * - 승인번호가 기존에 있으면 DUPLICATE
 * - 승인번호 없고 약한 키가 기존에 있으면 SUSPECT
 * - 그 외 NEW
 */
export function classifyRow(
  row: ParsedTxRow,
  existingApprovalKeys: ReadonlySet<string>,
  existingSoftKeys: ReadonlySet<string>,
): DupStatus {
  if (row.approvalNo && existingApprovalKeys.has(approvalKey(row.approvalNo))) {
    return "DUPLICATE";
  }
  if (existingSoftKeys.has(softKey(row))) {
    return "SUSPECT";
  }
  return "NEW";
}
