import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Prisma 쿼리 엔진(.so) 파일을 서버리스 함수 번들에 강제로 포함시킵니다.
  // (Vercel 에서 PrismaClientInitialization('Query Engine not found') 방지)
  outputFileTracingIncludes: {
    "/**": ["./node_modules/.prisma/client/**/*", "./node_modules/@prisma/client/**/*"],
  },
};

export default nextConfig;
