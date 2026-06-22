import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

// Next.js 개발 모드의 HMR로 인한 커넥션 누수 방지를 위해 전역 싱글톤으로 캐싱
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("Missing required environment variable: DATABASE_URL");
  }
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
