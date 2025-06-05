import { Spin } from "antd";
import React from "react";
import { LoadingOutlined } from "@ant-design/icons";

export default function Loading() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center gap-2">
      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      <div className="text-white text-xl">
        Loading...
      </div>
    </div>
  );
}
