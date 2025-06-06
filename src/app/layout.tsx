import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PropsWithChildren } from "react";
import ReactQueryProvider from "@/contexts/react-query-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Netflop",
  description: "A Netflop built with Next.js",
};
export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="vi">
      <body className={`${inter.className} bg-black text-white`}>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
