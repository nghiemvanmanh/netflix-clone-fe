"use client";
import React, { useState, useRef, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { notification, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import Loading from "@/components/ui/loading";
import { fetcher } from "../../../utils/fetcher";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Verification step
  const [isVerificationStep, setIsVerificationStep] = useState(false);
  const [verificationCode, setVerificationCode] = useState(Array(6).fill(""));
  const [verificationError, setVerificationError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const router = useRouter();

  const sendVerificationCode = async () => {
    setIsLoading(true);
    setError("");
    setVerificationError("");
    try {
      await fetcher.post("/users/send-code", { email });
      notification.success({
        message: "Mã xác nhận đã được gửi",
        description: "Vui lòng kiểm tra email của bạn để lấy mã xác nhận.",
      });
      setIsVerificationStep(true);
      setVerificationCode(Array(6).fill(""));
    } catch (err: any) {
      console.error("Send code error:", err);
      setError(
        err.response?.data?.message ||
          "Gửi mã xác nhận thất bại, vui lòng thử lại."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationCodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    // Move to next input if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      // Move to previous input on backspace if current input is empty
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .slice(0, 6)
      .replace(/\D/g, "");
    const newCode = [...verificationCode];

    for (let i = 0; i < pastedData.length; i++) {
      if (i < 6) newCode[i] = pastedData[i];
    }

    setVerificationCode(newCode);
    if (pastedData.length > 0) {
      const lastIndex = Math.min(pastedData.length - 1, 5);
      inputRefs.current[lastIndex]?.focus();
    }
  };

  const verifyCode = async () => {
    const code = verificationCode.join("");
    console.log({ verificationCode });
    if (code.length < 6) {
      setVerificationError("Vui lòng nhập đủ 6 chữ số mã xác nhận");
      return;
    }
    setIsLoading(true);
    setVerificationError("");
    try {
      await fetcher.post("/users", {
        email,
        phoneNumber,
        password,
        verificationCode: code,
      });

      notification.success({
        message: "Đăng ký thành công",
        description: "Bạn đã đăng ký tài khoản thành công",
      });

      router.push("/login");
    } catch (err: any) {
      console.error("Verify code error:", err);
      setVerificationError(
        err.response?.data?.message ||
          "Mã xác nhận không hợp lệ hoặc đã hết hạn."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Mật khẩu và xác nhận mật khẩu không khớp");
      return;
    }
    sendVerificationCode();
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-black relative text-white font-sans overflow-hidden">
      <div className="absolute inset-0 z-10">
        <Image
          src="/netflix-background.jpg"
          alt="Netflix Background"
          fill
          style={{ objectFit: "cover", objectPosition: "center" }}
          priority
        />
      </div>
      <div className="absolute inset-0 bg-black bg-opacity-70" />
      <div className="relative z-10 px-6 py-4">
        <div className="text-red-600 text-4xl font-extrabold tracking-wide select-none">
          NETFLIX
        </div>
      </div>
      <div className="relative z-10 flex justify-center items-center min-h-[calc(100vh-64px)] px-4">
        <div className="bg-black/80 bg-opacity-75 p-6 sm:p-10 rounded-md w-full max-w-md">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">
            {isVerificationStep ? "Nhập mã xác nhận" : "Đăng ký"}
          </h1>

          {error && !isVerificationStep && (
            <div className="bg-orange-500 text-white text-sm p-3 rounded mb-4">
              {error}
            </div>
          )}
          {verificationError && isVerificationStep && (
            <div className="bg-orange-500 text-white text-sm p-3 rounded mb-4">
              {verificationError}
            </div>
          )}

          {!isVerificationStep ? (
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              <Input
                type="email"
                placeholder="Email đăng ký"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-zinc-800 text-white placeholder-gray-400 border border-transparent focus:ring-2 focus:ring-red-600 focus:outline-none w-full"
                required
              />
              <Input
                type="tel"
                placeholder="Số điện thoại"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="bg-zinc-800 text-white placeholder-gray-400 border border-transparent focus:ring-2 focus:ring-red-600 focus:outline-none w-full"
                required
              />
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-zinc-800 text-white placeholder-gray-400 border border-transparent pr-10 focus:ring-2 focus:ring-red-600 focus:outline-none w-full"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
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
                  className="bg-zinc-800 text-white placeholder-gray-400 border border-transparent pr-10 focus:ring-2 focus:ring-red-600 focus:outline-none w-full"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  aria-label={
                    showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-600 hover:bg-red-700 transition-colors font-semibold py-3 flex justify-center items-center gap-2"
              >
                {isLoading ? "Đang đăng ký..." : "Đăng ký"}
                {isLoading && <Spin indicator={<LoadingOutlined spin />} />}
              </Button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between gap-2" onPaste={handlePaste}>
                {verificationCode.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) =>
                      handleVerificationCodeChange(index, e.target.value)
                    }
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 sm:w-14 sm:h-14 text-center text-lg sm:text-xl bg-zinc-800 text-white rounded border border-gray-600 focus:ring-2 focus:ring-red-600 outline-none"
                    aria-label={`Mã xác nhận số ${index}`}
                  />
                ))}
              </div>

              <Button
                onClick={verifyCode}
                disabled={verificationCode.join("").length < 6 || isLoading}
                className="w-full bg-red-600 hover:bg-red-700 transition-colors font-semibold py-3 flex justify-center items-center gap-2"
              >
                {isLoading ? "Đang xác nhận..." : "Xác nhận"}
                {isLoading && <Spin indicator={<LoadingOutlined spin />} />}
              </Button>

              <Button
                onClick={sendVerificationCode}
                disabled={isLoading}
                className="w-full bg-gray-700 hover:bg-gray-800 transition-colors font-semibold py-3"
              >
                Gửi lại mã
              </Button>

              <Button
                onClick={() => {
                  setIsVerificationStep(false);
                  setVerificationCode(Array(6).fill(""));
                }}
                className="w-full bg-transparent border border-gray-500 hover:bg-gray-700 transition-colors text-white py-3"
              >
                Hủy
              </Button>
            </div>
          )}

          {!isVerificationStep && (
            <div className="mt-8 text-sm text-gray-400 text-center">
              <span>Đã có tài khoản? </span>
              <a href="/login" className="text-white hover:underline">
                Đăng nhập ngay
              </a>
            </div>
          )}

          <div className="mt-4 text-xs text-gray-500 text-center px-4 sm:px-0">
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
