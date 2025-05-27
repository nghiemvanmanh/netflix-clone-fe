/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Info, Volume2, VolumeX, Search, Bell } from "lucide-react";
import { useAuth } from "../../../utils/auth-context";
import Image from "next/image";
export default function HomePage() {
  const [isMuted, setIsMuted] = useState(true);
  const [showVideoInfo, setShowVideoInfo] = useState(false);
  const { logout, isAuthenticated } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const [isClient, setIsClient] = useState(false);
  // Sample movie data - replace with your actual data
  const featuredMovie = {
    title: "Stranger Things",
    description:
      "Khi một cậu bé biến mất, thị trấn nhỏ của anh ta phát hiện ra một bí ẩn liên quan đến các thí nghiệm bí mật, những lực lượng siêu nhiên đáng sợ và một cô bé kỳ lạ.",
    year: "2022",
    rating: "16+",
    duration: "3 Seasons",
    genres: ["Kinh dị", "Khoa học viễn tưởng", "Drama"],
  };

  // Tắt menu khi click ra ngoài
  useEffect(() => {
    setIsClient(true);
    setShowVideoInfo(true);

    const cleanupTimer = handleShowVideoInfo();

    const handleClickOutside = (event: any) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      cleanupTimer();
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleShowVideoInfo = () => {
    const timer = setTimeout(() => {
      setShowVideoInfo(false);
    }, 5000);
    return () => clearTimeout(timer);
  };
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-gradient-to-b from-black to-transparent">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-8">
            <div className="text-red-600 text-2xl font-bold">NETFLIX</div>
            <nav className="hidden md:flex space-x-6">
              <a href="#" className="hover:text-gray-300 transition-colors">
                Trang chủ
              </a>
              <a href="#" className="hover:text-gray-300 transition-colors">
                Phim T.Hình
              </a>
              <a href="#" className="hover:text-gray-300 transition-colors">
                Phim
              </a>
              <a href="#" className="hover:text-gray-300 transition-colors">
                Mới & Phổ biến
              </a>
              <a href="#" className="hover:text-gray-300 transition-colors">
                Danh sách của tôi
              </a>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <Search className="w-5 h-5 cursor-pointer hover:text-gray-300 transition-colors" />
            <Bell className="w-5 h-5 cursor-pointer hover:text-gray-300 transition-colors" />
            <div className="relative" ref={menuRef}>
              <Image
                src="/avatar.jpg" // Thay bằng URL ảnh đại diện của bạn
                alt="Avatar"
                className="w-8 h-8 rounded cursor-pointer"
                width={100}
                height={100}
                onClick={() => setMenuOpen(!menuOpen)}
              />
              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-black bg-opacity-90 rounded border border-gray-700 z-50">
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-800 transition-colors rounded"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="relative h-screen">
        {/* Background Video */}
        <div className="absolute inset-0">
          <video
            autoPlay
            muted={isMuted}
            loop
            className="w-full h-full object-cover"
            poster="/placeholder.svg?height=1080&width=1920"
          >
            <source src="/banner.mp4" type="video/mp4" />
          </video>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
        </div>

        {/* Video Controls */}
        <div className="absolute top-20 right-6 z-20">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-75 transition-all"
          >
            {isMuted ? (
              <VolumeX className="w-6 h-6" />
            ) : (
              <Volume2 className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Movie Info */}
        <div
          className={`absolute bottom-32 left-6 md:left-16 max-w-lg transition-opacity duration-1000 ${
            showVideoInfo ? "opacity-100" : "opacity-0"
          }`}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {featuredMovie.title}
          </h1>

          <div className="flex items-center space-x-4 mb-4 text-sm">
            <span className="text-green-500 font-semibold">98% Match</span>
            <span>{featuredMovie.year}</span>
            <span className="border border-gray-400 px-1">
              {featuredMovie.rating}
            </span>
            <span>{featuredMovie.duration}</span>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {featuredMovie.genres.map((genre, index) => (
              <span key={index} className="text-sm text-gray-300">
                {genre}
                {index < featuredMovie.genres.length - 1 && " • "}
              </span>
            ))}
          </div>

          <p className="text-lg mb-6 leading-relaxed">
            {featuredMovie.description}
          </p>

          <div className="flex space-x-4">
            <Button className="bg-white text-black hover:bg-gray-200 px-8 py-2 rounded-sm font-semibold transition-colors cursor-pointer">
              <Play className="w-5 h-5 mr-2 fill-current" />
              Phát
            </Button>
            <Button
              variant="outline"
              className="bg-gray-600 bg-opacity-70 border-gray-600 text-white hover:bg-gray-500 px-8 py-2 rounded-sm font-semibold transition-colors cursor-pointer"
            >
              <Info className="w-5 h-5 mr-2" />
              Thông tin khác
            </Button>
          </div>
        </div>

        {/* Show/Hide Info Button */}
        <button
          onClick={() => setShowVideoInfo(!showVideoInfo)}
          className="absolute bottom-6 right-6 bg-black bg-opacity-50 text-white px-4 py-2 rounded hover:bg-opacity-75 transition-all cursor-pointer"
        >
          {showVideoInfo ? "Ẩn thông tin" : "Hiện thông tin"}
        </button>
      </div>

      {/* Content Rows */}
      <div className="relative z-10 -mt-32 pb-20">
        <div className="px-6 md:px-16">
          {/* Trending Now */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Xu hướng hiện tại</h2>
            <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="flex-shrink-0 w-48 h-28 bg-gray-800 rounded cursor-pointer hover:scale-105 transition-transform duration-300"
                >
                  {/* <img
                    src={`/placeholder.svg?height=112&width=192&text=Movie ${item}`}
                    alt={`Movie ${item}`}
                    className="w-full h-full object-cover rounded"
                  /> */}
                </div>
              ))}
            </div>
          </div>

          {/* Popular on Netflix */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              Phổ biến trên Netflix
            </h2>
            <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="flex-shrink-0 w-48 h-28 bg-gray-800 rounded cursor-pointer hover:scale-105 transition-transform duration-300"
                >
                  {/* <img
                    src={`/placeholder.svg?height=112&width=192&text=Popular ${item}`}
                    alt={`Popular ${item}`}
                    className="w-full h-full object-cover rounded"
                  /> */}
                </div>
              ))}
            </div>
          </div>

          {/* My List */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Danh sách của tôi</h2>
            <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="flex-shrink-0 w-48 h-28 bg-gray-800 rounded cursor-pointer hover:scale-105 transition-transform duration-300"
                >
                  {/* <img
                    src={`/placeholder.svg?height=112&width=192&text=My List ${item}`}
                    alt={`My List ${item}`}
                    className="w-full h-full object-cover rounded"
                  /> */}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
