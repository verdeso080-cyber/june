import { AppShell } from "@/components/AppShell";
import { prisma } from "@/lib/db";
import { requireContext } from "@/lib/auth/session";
import { canOperate } from "@/lib/auth/roles";
import { createFaq } from "@/app/content/actions";

export const dynamic = "force-dynamic";

export default async function FaqPage() {
  const { club, role } = await requireContext();
  const operator = canOperate(role);

  const items = await prisma.faq.findMany({
    where: { clubId: club.id },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  return (
    <AppShell role={role} clubName={club.name}>
      <h1 className="mb-4 text-2xl font-bold">FAQ</h1>

      {operator && (
        <form
          action={createFaq}
          className="mb-6 space-y-3 rounded-xl border border-gray-200 bg-white p-4"
        >
          <input name="question" required placeholder="질문" className="input" />
          <textarea name="answer" required rows={3} placeholder="답변" className="input" />
          <button className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            FAQ 등록
          </button>
        </form>
      )}

      {items.length === 0 ? (
        <p className="text-gray-400">등록된 FAQ 가 없습니다.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((f) => (
            <li
              key={f.id}
              className="rounded-xl border border-gray-200 bg-white p-4"
            >
              <p className="font-semibold">Q. {f.question}</p>
              <p className="mt-1 whitespace-pre-line text-sm text-gray-700">
                A. {f.answer}
              </p>
            </li>
          ))}
        </ul>
      )}
    </AppShell>
  );
}
