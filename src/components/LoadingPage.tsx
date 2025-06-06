"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Suspense } from "@tanstack/react-query";

export default function LoadingPage() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timeout);
  }, [pathname]);

  if (!loading) return null;

  return (
    <Suspense fallback={<Loading />}>
      <div className="min-h-screen bg-black flex items-center justify-center gap-2">
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        <div className="text-white text-xl">Đang tải trang...</div>
      </div>
    </Suspense>
  );
}
