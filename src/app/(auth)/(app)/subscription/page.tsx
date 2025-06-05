"use client";

import type React from "react";

import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Check, Star, Crown, Zap, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { loadStripe } from "@stripe/stripe-js";
import { fetcher } from "../../../../../utils/fetcher";
import Cookies from "js-cookie";
import Loading from "@/components/ui/loading";
import { motion } from "framer-motion";
import { useUser } from "@/contexts/user-provider";
import { SUBPLAN_OPTIONS } from "@/constants/common";
import Image from "next/image";
// Initialize Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: string;
  features: string[];
  popular?: boolean;
  icon: React.ReactNode;
  quality: string;
  devices: string;
  downloads: string;
  stripePriceId: string; // Add Stripe Price ID
}

export default function SubscriptionPage() {
  const [selectedPlan, setSelectedPlan] = useState<string>("standard");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user } = useUser();

  const router = useRouter();

  const { data: subscriptionPlans } = useQuery({
    queryKey: ["subscriptionPlans"],
    queryFn: () =>
      fetcher.get<SubscriptionPlan[]>("subscriptions").then((res) => res.data),
    initialData: () => [],
  });

  useEffect(() => {
    const plan =
      subscriptionPlans.find((plan) => plan.name === "standard") ||
      subscriptionPlans[0];

    if (plan) {
      setSelectedPlan(plan.id);
    }
  }, [subscriptionPlans]);

  // Hàm map icon string thành component icon thực tế
  function renderIcon(name: string) {
    switch (name) {
      case "basic":
        return <Star className="w-6 h-6" />;
      case "standard":
        return <Crown className="w-6 h-6" />;
      case "premium":
        return <Zap className="w-6 h-6" />;
      default:
        return null;
    }
  }

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleSubscribe = async () => {
    if (!selectedPlan || !user) return;
    setIsLoading(true);
    try {
      const plan = subscriptionPlans.find((p) => p.id === selectedPlan);
      if (!plan) return;

      // Create Stripe checkout session
      const response = await fetcher.post(
        "/subscriptions/create-checkout-session",
        {
          priceId: plan.stripePriceId,
          userId: user.id,
          planName: plan.name,
          planId: plan.id,
          amount: plan.price,
        }
      );

      const { sessionId } = await response.data;

      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) {
          console.error("Stripe redirect error:", error);
          throw new Error(error.message);
        }
      }
    } catch (error) {
      console.error("Subscription error:", error);
      alert("Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.");
      throw new Error(
        `Subscription error: ${error instanceof Error ? error.message : error}`
      );
    } finally {
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  if (!user) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="absolute inset-0 ">
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
      {/* Header */}
      <header className="p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-red-600 z-10">NETFLIX</h1>
          <Button
            variant="outline"
            className="border-gray-600 text-gray-800 hover:text-gray-900 hover:border-white cursor-pointer z-10"
            onClick={() => {
              Cookies.remove("user");
              Cookies.remove("accessToken");
              Cookies.remove("refreshToken");
              router.push("/login");
            }}
          >
            Đăng xuất
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12 z-10 relative">
        <div className="text-center mb-12 border-gray-700 bg-black/80 p-4 rounded-lg">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Chọn gói dịch vụ phù hợp với bạn
          </h1>
          <p className="text-xl text-gray-300 mb-2">
            Xem mọi thứ bạn muốn. Hủy bất cứ lúc nào.
          </p>
          <p className="text-gray-400">
            Sẵn sàng xem? Nhập email để tạo hoặc kích hoạt lại tư cách thành
            viên của bạn.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {subscriptionPlans.map((plan) => (
            <motion.div
              key={plan.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {" "}
              <Card
                key={plan.id}
                className={`relative cursor-pointer transition-all duration-300 text-white/40 ${
                  selectedPlan === plan.id
                    ? "bg-black border-2 border-red-600 scale-105 text-white/90"
                    : "bg-black/90 border-gray-700 hover:border-gray-900"
                }`}
                onClick={() => handlePlanSelect(plan.id)}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-red-600 text-white">
                    Phổ biến nhất
                  </Badge>
                )}

                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div
                      className={`p-3 rounded-full ${
                        selectedPlan === plan.id
                          ? "bg-red-600 text-white"
                          : "bg-white text-red-600"
                      }`}
                    >
                      {renderIcon(plan.name)}
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold">
                    {SUBPLAN_OPTIONS[plan.name]?.label}
                  </CardTitle>
                  <CardDescription
                    className={`text-lg ${
                      selectedPlan === plan.id
                        ? "text-red-100"
                        : "text-gray-400"
                    }`}
                  >
                    {formatPrice(plan.price)}/{plan.interval}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Key Features */}
                  <div className="grid grid-cols-1 gap-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-white">
                        Chất lượng video:
                      </span>
                      <span className="text-sm font-medium">
                        {plan.quality}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-white">Thiết bị xem:</span>
                      <span className="text-sm font-medium">
                        {plan.devices}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-white">Tải xuống:</span>
                      <span className="text-sm font-medium">
                        {plan.downloads}
                      </span>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Check
                          className={`w-4 h-4 ${
                            selectedPlan === plan.id
                              ? "text-green-500"
                              : "text-white/80"
                          }`}
                        />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Subscribe Button */}
        <div className="text-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Button
              onClick={handleSubscribe}
              disabled={isLoading || !selectedPlan}
              className="bg-white/80 hover:bg-white text-black cursor-pointer px-12 py-4 text-lg font-semibold rounded-md"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang xử lý...</span>
                </div>
              ) : (
                `Đăng ký gói ${
                  subscriptionPlans.find((p) => p.id === selectedPlan)?.name
                }`
              )}
            </Button>
          </motion.div>

          <p className="text-sm text-gray-500 mt-4">
            Bằng cách nhấp vào "Đăng ký", bạn đồng ý với Điều khoản sử dụng và
            Chính sách quyền riêng tư của chúng tôi.
          </p>
        </div>

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Không cam kết</h3>
            <p className="text-gray-400">
              Hủy trực tuyến bất cứ lúc nào. Không có phí hủy.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Xem mọi nơi</h3>
            <p className="text-gray-400">
              Xem trên TV, máy tính bảng, điện thoại và máy tính.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Nội dung độc quyền</h3>
            <p className="text-gray-400">
              Truy cập vào hàng nghìn bộ phim và chương trình TV.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
