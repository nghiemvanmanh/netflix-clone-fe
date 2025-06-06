"use client";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
export default function HomePage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center gap-2">
      <div className="animate-spin border-t-2 border-white rounded-full w-12 h-12"></div>
      <div className="text-white text-xl">
        Redirecting... <Spin indicator={<LoadingOutlined spin />} />
      </div>
    </div>
  );
}
