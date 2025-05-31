"use client";

import type React from "react";
import { useState } from "react";

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
}

export default function VideoPlayer({ videoUrl, title }: VideoPlayerProps) {
  const [showControls, setShowControls] = useState(true);

  return (
    <div
      className="relative w-full aspect-video bg-black"
      onMouseMove={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <iframe
        src={videoUrl}
        className="w-full h-full object-contain"
        allow="autoplay; fullscreen"
        allowFullScreen
        title={title}
      />
      <div
        className={`absolute top-4 left-4 z-10 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        <h1 className="text-white text-xl font-bold bg-black/50 px-3 py-1 rounded">
          {title}
        </h1>
      </div>
    </div>
  );
}
