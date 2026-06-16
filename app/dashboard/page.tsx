import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { prisma } from "@/lib/db";
import { requireContext } from "@/lib/auth/session";
import { canManageBudget, canOperate } from "@/lib/auth/roles";
import { getDashboardData } from "@/lib/budget/queries";
import { countAttendees } from "@/lib/activity/summary";
import { formatDate, formatKRW } from "@/lib/format";

export const dynamic = "force-dynamic";

interface QuickAction {
  label: string;
  icon: string;
  href: string;
}

export default async function HomePage() {
  const { club, role, membership } = await requireContext();
  const now = new Date();

  const meetings = await prisma.meeting.findMany({
    where: { clubId: club.id },
    include: { attendances: true },
    orderBy: { startsAt: "asc" },
  });
  const nextMeeting =
    meetings.find((m) => m.startsAt >= now) ?? meetings[meetings.length - 1] ?? null;
  const isUpcoming = nextMeeting ? nextMeeting.startsAt >= now : false;

  const operator = canOperate(role);
  const manager = canManageBudget(role);

  const budget = manager ? await getDashboardData(club.id, now) : null;
  const notice = await prisma.announcement.findFirst({
    where: { clubId: club.id },
    orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
  });

  const quickActions: QuickAction[] = operator
    ? [
        { label: "모임 만들기", icon: "➕", href: "/meetings/new" },
        { label: "QR 출석", icon: "✅", href: nextMeeting ? `/meetings/${nextMeeting.id}` : "/meetings" },
        { label: "활동 작성", icon: "📸", href: "/activities/new" },
        { label: "예산 보기", icon: "💰", href: "/budget" },
      ]
    : manager
      ? [
          { label: "카드내역 추가", icon: "💳", href: "/budget/transactions/new" },
          { label: "CSV 업로드", icon: "📄", href: "/budget/import" },
          { label: "예산 보기", icon: "💰", href: "/budget" },
          { label: "활동", icon: "📸", href: "/activities" },
        ]
      : [
          { label: "모임 보기", icon: "📅", href: "/meetings" },
          { label: "활동 사진", icon: "📸", href: "/activities" },
          { label: "공지", icon: "📢", href: "/announcements" },
          { label: "예산", icon: "💰", href: "/budget" },
        ];

  return (
    <AppShell role={role} clubName={club.name}>
      {/* 인사 */}
      <div className="mb-5 mt-1">
        <h1 className="text-2xl font-bold">
          {membership.nickname}님, 안녕하세요 👋
        </h1>
        <p className="mt-0.5 text-sm" style={{ color: "var(--sub)" }}>
          {club.name}
        </p>
      </div>

      {/* 다가오는 모임 */}
      <section className="mb-4">
        <p className="mb-2 text-sm font-semibold" style={{ color: "var(--sub)" }}>
          {isUpcoming ? "다가오는 모임" : "최근 모임"}
        </p>
        {nextMeeting ? (
          <div className="card">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold">{nextMeeting.title}</h2>
                <p className="mt-1 text-sm" style={{ color: "var(--sub)" }}>
                  {formatDate(nextMeeting.startsAt)} ·{" "}
                  {nextMeeting.location ?? "장소 미정"}
                </p>
              </div>
              <span
                className="rounded-full px-2.5 py-1 text-xs font-semibold"
                style={{ background: "#f2f4f6", color: "var(--text)" }}
              >
                출석 {countAttendees(nextMeeting.attendances)}
              </span>
            </div>
            <Link
              href={`/meetings/${nextMeeting.id}`}
              className="btn btn-primary mt-4"
            >
              {operator ? "출석 받기 / 관리" : "참여하기"}
            </Link>
          </div>
        ) : (
          <div className="card text-center">
            <p className="text-sm" style={{ color: "var(--sub)" }}>
              아직 등록된 모임이 없어요.
            </p>
            {operator && (
              <Link href="/meetings/new" className="btn btn-primary mt-3">
                첫 모임 만들기
              </Link>
            )}
          </div>
        )}
      </section>

      {/* 빠른 액션 */}
      <section className="mb-4">
        <p className="mb-2 text-sm font-semibold" style={{ color: "var(--sub)" }}>
          빠른 메뉴
        </p>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((a) => (
            <Link
              key={a.label}
              href={a.href}
              className="card flex items-center gap-3"
              style={{ padding: "16px" }}
            >
              <span className="text-2xl">{a.icon}</span>
              <span className="font-semibold">{a.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 예산 요약 (총무/운영자) */}
      {budget && (
        <section className="mb-4">
          <p className="mb-2 text-sm font-semibold" style={{ color: "var(--sub)" }}>
            예산 현황
          </p>
          <Link href="/budget" className="card block">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-sm" style={{ color: "var(--sub)" }}>
                  반기 잔여 예산
                </p>
                <p className="mt-0.5 text-2xl font-bold">
                  {formatKRW(budget.summary.remaining)}
                </p>
              </div>
              <div className="text-right text-sm" style={{ color: "var(--sub)" }}>
                <p>소멸 예정 {formatKRW(budget.summary.expiringAmount)}</p>
                <p>D-{budget.summary.daysUntilExpiration}</p>
              </div>
            </div>
            {(budget.missingReceiptCount > 0 || budget.unlinkedCount > 0) && (
              <div className="mt-3 flex gap-2 text-xs">
                {budget.missingReceiptCount > 0 && (
                  <span
                    className="rounded-full px-2 py-1"
                    style={{ background: "#fff0f0", color: "var(--danger)" }}
                  >
                    영수증 누락 {budget.missingReceiptCount}
                  </span>
                )}
                {budget.unlinkedCount > 0 && (
                  <span
                    className="rounded-full px-2 py-1"
                    style={{ background: "#fff7e6", color: "var(--warn)" }}
                  >
                    활동 미연결 {budget.unlinkedCount}
                  </span>
                )}
              </div>
            )}
          </Link>
        </section>
      )}

      {/* 최근 공지 */}
      {notice && (
        <section>
          <p className="mb-2 text-sm font-semibold" style={{ color: "var(--sub)" }}>
            공지
          </p>
          <Link href="/announcements" className="card block">
            <p className="font-semibold">
              {notice.pinned && "📌 "}
              {notice.title}
            </p>
            <p
              className="mt-1 line-clamp-2 text-sm"
              style={{ color: "var(--sub)" }}
            >
              {notice.body}
            </p>
          </Link>
        </section>
      )}
    </AppShell>
  );
}
