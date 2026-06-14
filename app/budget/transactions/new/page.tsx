import { AppShell } from "@/components/AppShell";
import { getCurrentContext } from "@/lib/auth/session";
import { getFormOptions } from "@/lib/budget/queries";
import { canManageBudget } from "@/lib/auth/roles";
import { createTransaction } from "@/app/budget/actions";

export const dynamic = "force-dynamic";

export default async function NewTransactionPage() {
  const { club, role } = await getCurrentContext();
  if (!club) {
    return (
      <AppShell role={role}>
        <p className="text-gray-600">동호회 데이터가 없습니다.</p>
      </AppShell>
    );
  }

  if (!canManageBudget(role)) {
    return (
      <AppShell role={role} clubName={club.name}>
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
          권한이 없습니다. 예산 입력은 총무/회장/운영자만 가능합니다.
        </div>
      </AppShell>
    );
  }

  const { cards, activities } = await getFormOptions(club.id);

  return (
    <AppShell role={role} clubName={club.name}>
      <h1 className="mb-4 text-2xl font-bold">카드 사용 내역 추가</h1>

      <form
        action={createTransaction}
        className="max-w-xl space-y-4 rounded-xl border border-gray-200 bg-white p-6"
      >
        <Field label="카드">
          <select name="cardId" required className="input">
            {cards.length === 0 && <option value="">(등록된 카드 없음)</option>}
            {cards.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label} · {c.holderName}
              </option>
            ))}
          </select>
        </Field>

        <Field label="사용일">
          <input type="date" name="transactionDate" required className="input" />
        </Field>

        <Field label="금액 (원)">
          <input
            type="number"
            name="amount"
            min={1}
            step={1}
            required
            className="input"
            placeholder="예: 50000"
          />
        </Field>

        <Field label="가맹점명">
          <input type="text" name="merchantName" required className="input" />
        </Field>

        <Field label="카테고리">
          <input
            type="text"
            name="category"
            className="input"
            placeholder="예: 식비, 대관, 간식"
          />
        </Field>

        <Field label="연결 활동 (선택)">
          <select name="activityId" className="input">
            <option value="">연결 안 함</option>
            {activities.map((a) => (
              <option key={a.id} value={a.id}>
                {a.title}
              </option>
            ))}
          </select>
        </Field>

        <Field label="승인번호 (선택, 저장 시 마스킹됨)">
          <input type="text" name="approvalNo" className="input" />
        </Field>

        <Field label="메모 (선택)">
          <input type="text" name="memo" className="input" />
        </Field>

        <button
          type="submit"
          className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700"
        >
          저장
        </button>
      </form>
    </AppShell>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </span>
      {children}
    </label>
  );
}
