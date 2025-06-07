"use client";

import type React from "react";
import { use, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import Cookies from "js-cookie";
import { fetcher } from "../../../utils/fetcher";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetcher.post("/auth/login", {
        email,
        password,
      });

      Cookies.set("accessToken", response.data.accessToken);
      Cookies.set("refreshToken", response.data.refreshToken);
      router.push("/profiles");
    } catch (error: any) {
      setError(
        error.response?.data?.message || "Email hoặc mật khẩu không đúng"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black relative text-white font-sans overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-5 w-auto h-auto">
        <Image
          src="/netflix-background.jpg"
          alt="Netflix Background"
          fill
          style={{
            objectFit: "cover",
            objectPosition: "center",
          }}
          priority
        />
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-70 " />

      {/* Header Logo */}
      <div className="relative z-10 px-6 py-4">
        <div className="text-red-600 text-4xl font-extrabold tracking-wide">
          NETFLOP
        </div>
      </div>

      {/* Login Form */}
      <div className="relative z-10 flex justify-center items-center min-h-[calc(100vh-64px)] px-4">
        <div className="bg-black/80 bg-opacity-75 p-10 rounded-md w-full max-w-md">
          <h1 className="text-3xl font-bold mb-8">Đăng nhập</h1>

          {error && (
            <div className="bg-orange-500 text-white text-sm p-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="email"
              placeholder="Email hoặc số điện thoại"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-zinc-800 text-white placeholder-gray-400 border border-transparent focus:ring-2 focus:ring-red-600 focus:outline-none"
              required
            />
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-zinc-800 text-white placeholder-gray-400 border border-transparent pr-10 focus:ring-2 focus:ring-red-600 focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-700 transition-colors font-semibold py-3"
            >
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
              {isLoading && <Spin indicator={<LoadingOutlined spin />} />}
            </Button>
          </form>

          <div className="flex justify-between items-center mt-4 text-sm text-gray-400">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" /> Ghi nhớ tôi
            </label>
            <a href="#" className="hover:underline">
              Bạn cần trợ giúp?
            </a>
          </div>

          <div className="mt-8 text-sm text-gray-400">
            <span>Bạn mới sử dụng Netflix? </span>
            <a href="/register" className="text-white hover:underline">
              Đăng ký ngay
            </a>
          </div>

          <div className="mt-4 text-xs text-gray-500">
            Trang này được Google reCAPTCHA bảo vệ để đảm bảo bạn không phải là
            robot.{" "}
            <a href="#" className="text-blue-500 hover:underline">
              Tìm hiểu thêm.
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
