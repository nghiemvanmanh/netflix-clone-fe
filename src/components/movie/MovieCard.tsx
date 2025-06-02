// components/movie/movie-card.tsx
"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Play, Plus, Info, Check } from "lucide-react";
import { Movie, Profile, User } from "../../../utils/interface";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { fetcher } from "../../../utils/fetcher";
import parseJwt from "../../../utils/token";
import { notification } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useNotifications } from "@/contexts/use_notification-context";

interface MovieCardProps {
  movie: Movie;
  myList: string[] | null;
  setMyList: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function MovieCard({
  movie,
  myList,
  setMyList,
}: MovieCardProps) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const { notifyAddToMyList, notifyRemoveFromMyList } =
    useNotifications();

  useEffect(() => {
    const profileData = localStorage.getItem("selectedProfile");
    const parsedCookie = parseJwt(Cookies.get("accessToken") || "");
    const parsedProfile = profileData ? JSON.parse(profileData) : null;
    setProfile(parsedProfile);
    setUser(parsedCookie);
  }, []);

  const handleToggleMyList = async (movieId: string) => {
    const isInList = myList?.includes(movieId);
    try {
      if (isInList) {
        // TODO: Remove from My List API call
        await fetcher.delete(
          `/users/${user?.id}/profiles/${profile?.id}/my-lists/${movieId}`
        );
        notification.warning({
          message: "Đã xóa khỏi danh sách",
          description: "Phim đã được xóa khỏi danh sách của bạn.",
        });
        await notifyRemoveFromMyList(movie.id, movie.title, movie.thumbnailUrl);
        setMyList((myList || []).filter((id) => id !== movieId));
      } else {
        // TODO: Add to My List API call
        await fetcher.post(
          `/users/${user?.id}/profiles/${profile?.id}/my-lists`,
          {
            movieId,
          }
        );
        await notifyAddToMyList(movie.id, movie.title, movie.thumbnailUrl);
        notification.success({
          message: "Đã thêm vào danh sách",
          description: "Phim đã được thêm vào danh sách của bạn.",
        });
        setMyList([...(myList || []), movieId]);
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "Có lỗi xảy ra khi thêm vào danh sách";

      notification.error({
        message: "Lỗi",
        description: message,
      });
    }
  };

  const handlePlayMovie = (movieId: string) => {
    router.push(`/watch/${movieId}`);
  };

  const handleMoreInfo = (movieId: string) => {
    router.push(`/movies/${movieId}`);
  };
  return (
    <div className="flex-shrink-0 w-full sm:w-80 group transition-all duration-300">
      <div className="relative overflow-hidden rounded-lg transform group-hover:scale-110 transition-all duration-300 group-hover:z-10">
        <div
          className="relative w-full h-48 rounded-lg overflow-hidden cursor-pointer"
          onClick={() => handleMoreInfo(movie.id)}
        >
          <Image
            fill
            src={movie.thumbnailUrl || "/placeholder.svg"}
            alt={movie.title}
            className="object-cover rounded-lg"
            onClick={() => handleMoreInfo(movie.id)}
            priority={false}
          />
        </div>

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Button container with higher z-index */}
        <div
          className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10 cursor-pointer"
          onClick={() => handleMoreInfo(movie.id)}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                className="w-8 h-8 rounded-full border-gray-400 text-black hover:border-white p-0 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlayMovie(movie.id);
                }}
              >
                <Play className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="w-8 h-8 rounded-full border-gray-400 text-black hover:border-white p-0 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  handleMoreInfo(movie.id);
                }}
              >
                <Info className="w-4 h-4" />
              </Button>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="w-8 h-8 rounded-full border-gray-400 text-black hover:border-white p-0 cursor-pointer overflow-hidden"
              onClick={(e) => {
                e.stopPropagation();
                handleToggleMyList(movie.id);
              }}
            >
              <AnimatePresence mode="wait" initial={false}>
                {myList?.includes(movie.id) ? (
                  <motion.div
                    key="check"
                    initial={{ opacity: 0, rotate: -180, scale: 0.3 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: 180, scale: 0.3 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <Check className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="plus"
                    initial={{ opacity: 0, rotate: 180, scale: 0.3 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: -180, scale: 0.3 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <Plus className="w-4 h-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </div>
          {/* rest content */}
          <div className="text-xs text-gray-300">
            <div className="flex items-center space-x-2 mb-1">
              <span className="bg-gray-800 px-1 py-0.5 rounded text-xs">
                {movie.duration}
              </span>
              <span>{new Date(movie.releaseDate).getFullYear()}</span>
            </div>
            <div className="text-gray-400">
              {movie.genres?.map((genre) => genre.name).join(", ")}
            </div>
          </div>
        </div>
      </div>

      <div
        onClick={(e) => {
          e.stopPropagation();
          handleMoreInfo(movie.id);
        }}
        className="cursor-pointer group-hover:text-white transition-colors"
      >
        <h3 className="mt-4 font-semibold text-lg group-hover:text-gray-300 transition-colors">
          {movie.title}
        </h3>
        <p className="text-gray-400 text-sm">
          {new Date(movie.releaseDate).getFullYear()} •{" "}
          {movie.genres.map((genre) => genre.name).join(", ")}
        </p>
        <p className="text-gray-500 text-xs mt-1">{movie.duration}</p>
      </div>
    </div>
  );
}
