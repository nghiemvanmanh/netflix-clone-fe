import React from "react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center gap-2">
      <div className="animate-spin border-t-2 border-white rounded-full w-6 h-6"></div>
      <div className="text-white text-xl">Đang tải trang...</div>
    </div>
  );
}
