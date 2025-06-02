import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "../../utils/auth-context";
import "./globals.css";
import { NotificationProvider } from "@/contexts/use_notification-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Netflix Clone",
  description: "A Netflix clone built with Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={`${inter.className} bg-black text-white`}>
        <AuthProvider>
          <NotificationProvider>
            {" "}
            {/* 👈 Thêm vào đây */}
            {children}
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
