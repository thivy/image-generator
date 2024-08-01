import { LoadingProvider } from "@/features/app-context";
import { InputForm } from "@/features/input-form";
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
      <body
        className={`${inter.className} container mx-auto max-w-4xl bg-slate-100 px-4`}
      >
        <LoadingProvider>
          <InputForm> {children}</InputForm>
        </LoadingProvider>
      </body>
    </html>
  );
}
