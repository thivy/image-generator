import { AppRootLayout } from "@/features/root-layout";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Image Generator",
  description: "Image Generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta
        name="viewport"
        content="width=device-width, user-scalable=no, initial-scale=1, maximum-scale=1, minimal-ui"
      />
      <body
        className={`${inter.className} container mx-auto max-w-4xl bg-slate-100 px-4 h-dvh max-h-dvh flex`}
      >
        <AppRootLayout>{children}</AppRootLayout>
      </body>
    </html>
  );
}
