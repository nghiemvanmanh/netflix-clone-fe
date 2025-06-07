"use client";

import { use, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, CheckCircle, Star } from "lucide-react";
import { fetcher } from "../../../../../utils/fetcher";
import Cookies from "js-cookie";
import { motion } from "framer-motion";
import Image from "next/image";
import { useUser } from "@/contexts/user-provider";
import Loading from "@/components/ui/loading";
import { useQuery } from "@tanstack/react-query";
export default function SubscriptionSuccessPage() {
  const { user } = useUser();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const router = useRouter();

  const {
    data: paymentData,
    isLoading: isLoading,
    error,
  } = useQuery({
    queryKey: ["verify-payment", sessionId],
    enabled: !!sessionId, // chỉ chạy khi có sessionId
    queryFn: () => {
      return fetcher
        .post(`/subscriptions/verify-payment?session_id=${sessionId}`)
        .then((res) => res.data);
    },
  });

  useEffect(() => {
    if (!isLoading) {
      if (paymentData?.success) {
        Cookies.set("accessToken", paymentData.accessToken);
      } else {
        router.push("/subscription/cancel");
      }
    }
    if (error) {
      // error is of type unknown, so we can type it here
      const err = error as Error;
      console.error("Lỗi xác minh thanh toán:", err);
      router.push("/subscription/cancel");
    }
  }, [paymentData, isLoading, error, router]);

  const handleContinue = () => {
    router.push("/profiles");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center gap-2">
        <div className="animate-spin border-t-2 border-white rounded-full w-6 h-6"></div>
        <div className="text-white text-xl ">Đang xác thực thanh toán...</div>
      </div>
    );
  }

  if (!paymentData?.success) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Thanh toán không thành công</div>
      </div>
    );
  }

  const planText =
    paymentData.planName === "basic"
      ? "Cơ bản"
      : paymentData.planName === "standard"
      ? "Tiêu chuẩn"
      : "Cao cấp";

  return (
    <>
      {!user ? (
        <Loading />
      ) : (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
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
          <Card className="w-full max-w-md bg-black/80 border-gray-700 z-20">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-white">
                Chúc mừng!
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-300">
                Bạn đã đăng ký Netflix thành công! Giờ đây bạn có thể truy cập
                vào toàn bộ thư viện nội dung của chúng tôi.
              </p>

              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span className="font-semibold text-white">
                    Gói đã chọn: {planText}
                  </span>
                </div>
                <p className="text-sm text-gray-400">Thanh toán thành công</p>
                <p className="text-xs text-gray-500 mt-1">
                  Mã giao dịch: {paymentData.paymentId}
                </p>
              </div>

              <div className="space-y-2 text-sm text-gray-400">
                {paymentData.planText.map((feature: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 w-full justify-center"
                  >
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-white">{feature}</span>
                  </div>
                ))}
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {" "}
                <Button
                  onClick={handleContinue}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-lg font-semibold cursor-pointer"
                >
                  Bắt đầu xem ngay
                </Button>
              </motion.div>

              <p className="text-xs text-gray-500">
                Email xác nhận đã được gửi đến địa chỉ email của bạn.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
