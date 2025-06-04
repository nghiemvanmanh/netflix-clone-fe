import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { PropsWithChildren } from "react";
import ReactQueryProvider from "@/contexts/react-query-provider";
import { UserProvider } from "@/contexts/user-provider";
import { AuthProvider } from "../../../utils/auth-context";
import { NotificationProvider } from "@/contexts/use_notification-context";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Netflix Clone",
  description: "A Netflix clone built with Next.js",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="vi">
      <body className={`${inter.className} bg-black text-white`}>
        <UserProvider>
          <AuthProvider>
            <NotificationProvider>
              {" "}
              {/* 👈 Thêm vào đây */}
              {children}
            </NotificationProvider>
          </AuthProvider>
        </UserProvider>
      </body>
    </html>
  );
}
