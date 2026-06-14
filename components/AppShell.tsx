import Link from "next/link";
import { setDevRole } from "@/app/dev/actions";
import { canManageBudget, ROLE_LABELS } from "@/lib/auth/roles";
import { ROLES } from "@/lib/domain";
import type { Role } from "@/lib/domain";

interface Props {
  role: Role;
  clubName?: string;
  children: React.ReactNode;
}

export function AppShell({ role, clubName, children }: Props) {
  const manage = canManageBudget(role);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-2 px-6 py-3">
          <Link href="/dashboard" className="text-lg font-bold">
            모임{clubName ? ` · ${clubName}` : ""}
          </Link>
          <nav className="flex items-center gap-4 text-sm text-gray-600">
            <Link href="/dashboard" className="hover:text-indigo-600">
              대시보드
            </Link>
            <Link href="/budget" className="hover:text-indigo-600">
              예산
            </Link>
            <Link href="/budget/transactions" className="hover:text-indigo-600">
              사용내역
            </Link>
            {manage && (
              <>
                <Link
                  href="/budget/transactions/new"
                  className="hover:text-indigo-600"
                >
                  내역 추가
                </Link>
                <Link href="/budget/import" className="hover:text-indigo-600">
                  CSV 업로드
                </Link>
              </>
            )}
          </nav>

          {/* 개발용 역할 전환기 */}
          <form
            action={setDevRole}
            className="ml-auto flex items-center gap-2 text-xs text-gray-500"
          >
            <span>개발용 역할:</span>
            <select
              name="role"
              defaultValue={role}
              className="rounded border border-gray-300 px-2 py-1"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {ROLE_LABELS[r]}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="rounded bg-gray-800 px-2 py-1 text-white"
            >
              전환
            </button>
          </form>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  );
}
