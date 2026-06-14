import { redirect } from "next/navigation";
import { getCurrentContext, devLoginEnabled } from "@/lib/auth/session";
import { joinWithInvite } from "@/app/login/actions";
import { devLoginAs } from "@/app/dev/actions";
import { ROLES } from "@/lib/domain";
import { ROLE_LABELS } from "@/lib/auth/roles";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const ctx = await getCurrentContext();
  if (ctx.membership) redirect("/dashboard");

  const dev = devLoginEnabled();

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
      <h1 className="text-3xl font-bold">모임 로그인</h1>
      <p className="mt-1 text-gray-500">
        동호회 초대코드와 닉네임으로 입장합니다.
      </p>

      <form
        action={joinWithInvite}
        className="mt-6 space-y-4 rounded-xl border border-gray-200 bg-white p-6"
      >
        <label className="block">
          <span className="mb-1 block text-sm font-medium">초대코드</span>
          <input
            name="code"
            required
            className="input"
            placeholder="예: RUN-2026-INTERNAL"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">닉네임</span>
          <input name="nickname" required className="input" placeholder="예: 홍길동" />
        </label>
        <button
          type="submit"
          className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700"
        >
          입장하기
        </button>
      </form>

      {dev && (
        <div className="mt-6 rounded-xl border border-dashed border-gray-300 p-4">
          <p className="mb-2 text-xs text-gray-500">
            개발용 빠른 로그인 (production 에서는 표시되지 않습니다)
          </p>
          <div className="flex flex-wrap gap-2">
            {ROLES.map((r) => (
              <form action={devLoginAs} key={r}>
                <input type="hidden" name="role" value={r} />
                <button className="rounded border border-gray-300 px-2 py-1 text-sm hover:bg-gray-100">
                  {ROLE_LABELS[r]}로 로그인
                </button>
              </form>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
