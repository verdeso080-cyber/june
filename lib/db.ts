import { PrismaClient } from "@prisma/client";

/**
 * Prisma 클라이언트 싱글톤.
 * 개발 중 Next.js 핫 리로드로 클라이언트가 여러 개 생기는 것을 막습니다.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
