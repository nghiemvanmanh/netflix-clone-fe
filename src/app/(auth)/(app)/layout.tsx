import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { PropsWithChildren } from "react";
import { NotificationProvider } from "@/contexts/use_notification-context";
import { ProfileProvider } from "@/contexts/use-profile";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/header";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Netflop",
  description: "A Netflop built with Next.js",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="vi">
      <body className={`${inter.className} bg-black text-white`}>
        <ProfileProvider>
          <NotificationProvider>
            {" "}
            {/* 👈 Thêm vào đây */}
            <Header /> {children} <Footer />
          </NotificationProvider>
        </ProfileProvider>
      </body>
    </html>
  );
}
