"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/dashboard", label: "홈", icon: "🏠" },
  { href: "/meetings", label: "모임", icon: "📅" },
  { href: "/activities", label: "활동", icon: "📸" },
  { href: "/budget", label: "예산", icon: "💰" },
  { href: "/more", label: "더보기", icon: "☰" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="tabbar no-print">
      {TABS.map((t) => {
        const active =
          t.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(t.href);
        return (
          <Link key={t.href} href={t.href} data-active={active}>
            <span className="ico">{t.icon}</span>
            <span>{t.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
