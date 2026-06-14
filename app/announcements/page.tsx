import { AppShell } from "@/components/AppShell";
import { prisma } from "@/lib/db";
import { requireContext } from "@/lib/auth/session";
import { canOperate } from "@/lib/auth/roles";
import { formatDate } from "@/lib/format";
import { createAnnouncement } from "@/app/content/actions";

export const dynamic = "force-dynamic";

export default async function AnnouncementsPage() {
  const { club, role } = await requireContext();
  const operator = canOperate(role);

  const items = await prisma.announcement.findMany({
    where: { clubId: club.id },
    orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
  });

  return (
    <AppShell role={role} clubName={club.name}>
      <h1 className="mb-4 text-2xl font-bold">공지</h1>

      {operator && (
        <form
          action={createAnnouncement}
          className="mb-6 space-y-3 rounded-xl border border-gray-200 bg-white p-4"
        >
          <input name="title" required placeholder="제목" className="input" />
          <textarea name="body" required rows={3} placeholder="내용" className="input" />
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" name="pinned" /> 상단 고정
          </label>
          <button className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            공지 등록
          </button>
        </form>
      )}

      {items.length === 0 ? (
        <p className="text-gray-400">등록된 공지가 없습니다.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((a) => (
            <li
              key={a.id}
              className="rounded-xl border border-gray-200 bg-white p-4"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold">
                  {a.pinned && <span className="mr-1 text-indigo-600">📌</span>}
                  {a.title}
                </span>
                <span className="text-xs text-gray-400">
                  {formatDate(a.createdAt)}
                </span>
              </div>
              <p className="mt-2 whitespace-pre-line text-sm text-gray-700">
                {a.body}
              </p>
            </li>
          ))}
        </ul>
      )}
    </AppShell>
  );
}
