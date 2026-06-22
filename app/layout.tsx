import localFont from "next/font/local";
import { Suspense } from "react";
import { getUser } from "@/apis/user";
import type { User } from "@/types/entities";
import Providers from "@/utils/react-query/Provider";
import Shell from "./Shell";
import "./globals.css";

export const metadata = {
  title: "Fluence -  통번역 전문가 플랫폼",
  description: "통번역 전문가 플랫폼",
};

const spoqaHanSansNeo = localFont({
  src: [
    {
      path: "../public/fonts/spoqa-han-sans-neo/SpoqaHanSansNeo-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/spoqa-han-sans-neo/SpoqaHanSansNeo-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/spoqa-han-sans-neo/SpoqaHanSansNeo-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/spoqa-han-sans-neo/SpoqaHanSansNeo-Thin.woff2",
      weight: "100",
      style: "normal",
    },
  ],
  variable: "--font-spoqa-han-sans-neo",
  display: "swap",
  preload: true,
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let initialUser: User | null = null;
  try {
    initialUser = await getUser();
  } catch {
    // 비로그인 또는 세션 만료 시 클라이언트에서 재시도
  }

  return (
    <html lang="ko" className={spoqaHanSansNeo.variable}>
      <head></head>
      <body className={spoqaHanSansNeo.className}>
        <Providers>
          <Suspense>
            <Shell initialUser={initialUser}>{children}</Shell>
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
