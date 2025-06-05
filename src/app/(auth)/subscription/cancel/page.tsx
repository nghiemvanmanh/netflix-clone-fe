"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle, ArrowLeft } from "lucide-react";
import { useUser } from "@/contexts/user-provider";
import Loading from "@/components/ui/loading";

export default function SubscriptionCancelPage() {
  const router = useRouter();
  const { user } = useUser();
  const handleRetry = () => {
    router.push("/subscription");
  };

  const handleGoHome = () => {
    router.push("/login");
  };

  return (
    <>
      {!user ? (
        <Loading />
      ) : (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-gray-900 border-gray-800">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                  <XCircle className="w-10 h-10 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-white">
                Thanh toán bị hủy
              </CardTitle>
            </CardHeader>

            <CardContent className="text-center space-y-4">
              <p className="text-gray-300">
                Quá trình thanh toán đã bị hủy. Bạn chưa bị tính phí và có thể
                thử lại bất cứ lúc nào.
              </p>

              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-400">
                  Nếu bạn gặp vấn đề với thanh toán, vui lòng liên hệ với bộ
                  phận hỗ trợ khách hàng của chúng tôi.
                </p>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleRetry}
                  className="w-full bg-red-600 hover:bg-red-700 text-white cursor-pointer py-3 text-lg font-semibold"
                >
                  Thử lại thanh toán
                </Button>

                <Button
                  onClick={handleGoHome}
                  variant="outline"
                  className="w-full border-gray-600 text-black/80 hover:text-black cursor-pointer hover:border-white py-3"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Quay lại trang đăng nhập
                </Button>
              </div>

              <p className="text-xs text-gray-500">
                Cần hỗ trợ? Liên hệ với chúng tôi qua email:
                admin@netflix-clone.com
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
