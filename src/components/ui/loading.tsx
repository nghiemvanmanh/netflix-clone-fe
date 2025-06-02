import { Spin } from "antd";
import React from "react";
import { LoadingOutlined } from "@ant-design/icons";

export default function Loading() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white text-xl">
        Loading... <Spin indicator={<LoadingOutlined spin />} />
      </div>
    </div>
  );
}
