import Providers from "@/utils/react-query/Provider";
import { Suspense } from "react";
import localFont from "next/font/local";
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={spoqaHanSansNeo.variable}>
      <head></head>
      <body className={spoqaHanSansNeo.className}>
        <Providers>
          <Suspense>
            <Shell>{children}</Shell>
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
