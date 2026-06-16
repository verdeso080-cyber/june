import { BottomNav } from "@/components/BottomNav";
import { ROLE_LABELS } from "@/lib/auth/roles";
import type { Role } from "@/lib/domain";

interface Props {
  role: Role;
  clubName?: string;
  title?: string;
  children: React.ReactNode;
}

export function AppShell({ role, clubName, title, children }: Props) {
  return (
    <div className="app-shell">
      <header className="flex items-center justify-between px-5 pt-5 pb-1">
        <div>
          {title ? (
            <h1 className="text-xl font-bold">{title}</h1>
          ) : (
            <span className="text-lg font-bold">
              모임{clubName ? ` · ${clubName}` : ""}
            </span>
          )}
        </div>
        <span
          className="rounded-full px-2.5 py-1 text-xs font-semibold"
          style={{ background: "var(--primary-soft)", color: "var(--primary)" }}
        >
          {ROLE_LABELS[role]}
        </span>
      </header>

      <main className="app-body">{children}</main>

      <BottomNav />
    </div>
  );
}
