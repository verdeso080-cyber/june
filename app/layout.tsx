import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "모임 — 사내 동호회 운영",
  description:
    "사내 동호회의 예산·법인카드·출결·활동 보고서를 한 흐름으로 관리하는 앱",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
