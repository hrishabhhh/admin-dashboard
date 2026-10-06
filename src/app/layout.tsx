import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

import { AppShell } from "@/components/AppShell";

import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AdminHub",
  description: "Admin dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-slate-50 text-slate-900 antialiased`}
      >
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
