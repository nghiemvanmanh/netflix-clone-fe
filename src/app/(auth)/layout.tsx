import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { PropsWithChildren } from "react";
import { UserProvider } from "@/contexts/user-provider";
import { AuthProvider } from "@/contexts/auth-context";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Netflop",
  description: "A Netflop built with Next.js",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="vi">
      <body className={`${inter.className} bg-black text-white`}>
        <AuthProvider>
          <UserProvider>{children}</UserProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
