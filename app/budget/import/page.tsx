import { AppShell } from "@/components/AppShell";
import { ImportClient } from "@/components/ImportClient";
import { requireContext } from "@/lib/auth/session";
import { canManageBudget } from "@/lib/auth/roles";

export const dynamic = "force-dynamic";

export default async function ImportPage() {
  const { club, role } = await requireContext();
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
          권한이 없습니다. CSV 업로드는 총무/회장/운영자만 가능합니다.
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell role={role} clubName={club.name}>
      <h1 className="mb-1 text-2xl font-bold">카드 사용 내역 CSV 업로드</h1>
      <p className="mb-4 text-sm text-gray-500">
        파일을 올리거나 내용을 붙여넣고 <strong>미리보기</strong> 후{" "}
        <strong>저장</strong>하세요. 같은 승인번호는 중복으로 자동 제외됩니다.
      </p>
      <ImportClient />
    </AppShell>
  );
}
