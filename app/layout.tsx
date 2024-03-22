import Providers from "@/utils/react-query/Provider";
import { ColorSchemeScript } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import { Suspense } from "react";
import "react-datepicker/dist/react-datepicker.css";
import Shell from "./Shell";
import "./globals.css";

export const metadata = {
  title: "Fluence -  통번역 전문가 플랫폼",
  description: "통번역 전문가 플랫폼",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <Providers>
          <Suspense>
            <Shell>{children}</Shell>
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
