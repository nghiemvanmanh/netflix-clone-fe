"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { fetcher } from "../../../utils/fetcher";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { notification } from "antd";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Mật khẩu và xác nhận mật khẩu không khớp");
      setIsLoading(false);
      return;
    }

    try {
      await fetcher.post("/users", {
        email,
        password,
        phoneNumber,
      });
      notification.success({
        message: "Đăng ký thành công",
        description: "Bạn đã đăng ký tài khoản thành công",
      });
      // Có thể tự động login hoặc chuyển sang login page
      router.push("/login");
    } catch (error: any) {
      console.error("Register error:", error);
      setError("Tài khoản đã tồn tại hoặc có lỗi xảy ra");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black relative text-white font-sans overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-10">
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
          NETFLIX
        </div>
      </div>

      {/* Register Form */}
      <div className="relative z-10 flex justify-center items-center min-h-[calc(100vh-64px)] px-4">
        <div className="bg-black bg-opacity-75 p-10 rounded-md w-full max-w-md">
          <h1 className="text-3xl font-bold mb-8">Đăng ký</h1>

          {error && (
            <div className="bg-orange-500 text-white text-sm p-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="email"
              placeholder="Email đăng ký"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-zinc-800 text-white placeholder-gray-400 border border-transparent focus:ring-2 focus:ring-red-600 focus:outline-none"
              required
            />

            <Input
              type="tel"
              placeholder="Số điện thoại"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
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

            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Xác nhận mật khẩu"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-zinc-800 text-white placeholder-gray-400 border border-transparent pr-10 focus:ring-2 focus:ring-red-600 focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-700 transition-colors font-semibold py-3"
            >
              {isLoading ? "Đang đăng ký..." : "Đăng ký"}
            </Button>
          </form>

          <div className="mt-8 text-sm text-gray-400">
            <span>Đã có tài khoản? </span>
            <a href="/login" className="text-white hover:underline">
              Đăng nhập ngay
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
