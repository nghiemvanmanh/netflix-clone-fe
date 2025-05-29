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
interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const [myList, setMyList] = useState<number[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const parsedCookie = parseJwt(Cookies.get("accessToken") || "");
    setUser(parsedCookie);
    const selectedProfile = localStorage.getItem("selectedProfile");
    const parsedProfile = selectedProfile ? JSON.parse(selectedProfile) : null;
    setProfile(parsedProfile);
    const fetchMyList = async () => {
      if (parsedCookie?.id && parsedProfile?.id) {
        const response = await fetcher.get(
          `/users/${parsedCookie.id}/profiles/${parsedProfile.id}/my-lists`
        );
        setMyList(response.data?.map((item: any) => item.movie.id));
      }
    };

    fetchMyList();
  }, []);

  const handleToggleMyList = async (movieId: number) => {
    const isInList = myList.includes(movieId);
    console.log({ myList });
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
        setMyList(myList.filter((id) => id !== movieId));
      } else {
        // TODO: Add to My List API call
        await fetcher.post(
          `/users/${user?.id}/profiles/${profile?.id}/my-lists`,
          {
            movieId,
          }
        );
        notification.success({
          message: "Đã thêm vào danh sách",
          description: "Phim đã được thêm vào danh sách của bạn.",
        });
        setMyList([...myList, movieId]);
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
  return (
    <div className="flex-shrink-0 w-64 cursor-pointer group">
      <div className="relative overflow-hidden rounded-lg transform group-hover:scale-110 transition-all duration-300 group-hover:z-10">
        <Image
          width={256}
          height={256}
          src={movie.thumbnailUrl || "/placeholder.svg"}
          alt={movie.title}
          className="w-full h-36 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex items-center justify-between mb-2">
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                className="w-8 h-8 rounded-full border-gray-400 text-black hover:border-white p-0 cursor-pointer"
              >
                <Play className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="w-8 h-8 rounded-full border-gray-400 text-black hover:border-white p-0 cursor-pointer"
              >
                <Info className="w-4 h-4" />
              </Button>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="w-8 h-8 rounded-full border-gray-400 text-black hover:border-white p-0 cursor-pointer"
              onClick={() => handleToggleMyList(movie.id)}
            >
              {myList.includes(movie.id) ? (
                <Check className="w-4 h-4" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
            </Button>
          </div>
          <div className="text-xs text-gray-300">
            <div className="flex items-center space-x-2 mb-1">
              <span className="bg-gray-800 px-1 py-0.5 rounded text-xs">
                {movie.duration}
              </span>
              <span>{new Date(movie.releaseDate).getFullYear()}</span>
            </div>
            <div className="text-gray-400">
              {movie.genres.map((genre) => genre.name).join(", ")}
            </div>
          </div>
        </div>
      </div>
      <div>
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
