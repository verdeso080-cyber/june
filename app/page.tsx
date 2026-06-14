import { formatKRW } from "@/lib/format";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-8 px-6 py-16">
      <header className="flex flex-col gap-2">
        <span className="text-sm font-semibold tracking-wide text-indigo-600">
          사내 동호회 운영 앱
        </span>
        <h1 className="text-4xl font-bold">모임</h1>
        <p className="text-lg text-gray-600">
          동호회 예산·법인카드·QR 출결·활동 보고서를 한 곳에서 관리합니다.
        </p>
      </header>

      <section className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
        <h2 className="mb-4 text-lg font-semibold">개발 진행 상태</h2>
        <ul className="flex flex-col gap-2 text-gray-700">
          <li>✅ 1단계: 프로젝트 토대(Next.js · TypeScript · Tailwind · Prisma)</li>
          <li>⏳ 2단계: 데이터 모델 + 예산 엔진</li>
          <li>⏳ 3단계: 예산 대시보드 / 카드 사용 내역</li>
          <li>⏳ 4단계: QR 출결 / 활동 이야기</li>
          <li>⏳ 5단계: 보고서(Excel · PDF)</li>
          <li>⏳ 6단계: Slack 알림</li>
        </ul>
      </section>

      <footer className="text-sm text-gray-400">
        예시 금액 표기: {formatKRW(1050000)}
      </footer>
    </main>
  );
}
