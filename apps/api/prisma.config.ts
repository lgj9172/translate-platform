import { config } from "dotenv";
import { defineConfig } from "prisma/config";

const env = process.env["NODE_ENV"] ?? "development";

if (env === "production") {
  // 프로덕션: .env.production 만 로드
  config({ path: ".env.production" });
} else {
  // 로컬/개발: .env.local 우선, 없으면 .env.development 폴백
  config({ path: ".env.local" });
  config({ path: ".env.development" });
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
