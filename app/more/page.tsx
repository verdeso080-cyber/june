import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { requireContext, devLoginEnabled } from "@/lib/auth/session";
import { canManageBudget, ROLE_LABELS } from "@/lib/auth/roles";
import { ROLES } from "@/lib/domain";
import { setDevRole } from "@/app/dev/actions";
import { logout } from "@/app/login/actions";

export const dynamic = "force-dynamic";

export default async function MorePage() {
  const { club, role, membership } = await requireContext();
  const dev = devLoginEnabled();

  const links = [
    { href: "/announcements", label: "공지", icon: "📢" },
    { href: "/faq", label: "FAQ", icon: "❓" },
    ...(canManageBudget(role)
      ? [{ href: "/settings/slack", label: "Slack 알림 설정", icon: "🔔" }]
      : []),
    { href: "/reports", label: "보고서", icon: "📄" },
  ];

  return (
    <AppShell role={role} clubName={club.name} title="더보기">
      <div className="card mb-4">
        <p className="text-lg font-bold">{membership.nickname}</p>
        <p className="text-sm" style={{ color: "var(--sub)" }}>
          {club.name} · {ROLE_LABELS[role]}
        </p>
      </div>

      <div className="card mb-4" style={{ padding: "8px 0" }}>
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="flex items-center gap-3 px-5 py-3.5"
          >
            <span className="text-xl">{l.icon}</span>
            <span className="font-medium">{l.label}</span>
            <span className="ml-auto" style={{ color: "var(--sub)" }}>
              ›
            </span>
          </Link>
        ))}
      </div>

      {dev && (
        <div className="card mb-4">
          <p className="mb-2 text-sm font-semibold" style={{ color: "var(--sub)" }}>
            개발용 역할 전환 (운영에서는 숨김)
          </p>
          <form action={setDevRole} className="flex gap-2">
            <select name="role" defaultValue={role} className="input">
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {ROLE_LABELS[r]}
                </option>
              ))}
            </select>
            <button className="btn btn-ghost" style={{ width: "auto", padding: "0 18px" }}>
              전환
            </button>
          </form>
        </div>
      )}

      <form action={logout}>
        <button className="btn btn-ghost" style={{ color: "var(--danger)" }}>
          로그아웃
        </button>
      </form>
    </AppShell>
  );
}
