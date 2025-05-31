import React, { useState } from "react";
import Image from "next/image";
import { Movie } from "../../../utils/interface";
import { Button } from "@/components/ui/button";
import { Info, Play } from "lucide-react";
import { useRouter } from "next/navigation";
import VideoPlayer from "./video-player";

interface FeaturedMovieProps {
  movie: Movie;
}

export function FeaturedMovie({ movie }: FeaturedMovieProps) {
  const router = useRouter();

  const handleMoreInfo = (movieId: number) => {
    router.push(`/movies/${movieId}`);
  };
  const handlePlayMovie = (movieId: number) => {
    router.push(`/watch/${movieId}`);
  };
  return (
    <section className="relative h-screen">
      <div className="absolute inset-0">
        <Image
          src={movie.thumbnailUrl || "/placeholder.svg"}
          alt={movie.title}
          layout="fill"
          objectFit="cover"
          priority
          quality={100}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

      <div className="relative z-10 flex items-center h-full px-6">
        <div className="max-w-lg">
          <h1 className="text-5xl font-bold mb-4">{movie.title}</h1>
          <p className="text-lg mb-6 text-gray-200">{movie.description}</p>
          <div className="flex items-center space-x-4 mb-6">
            <span className="bg-gray-800 px-2 py-1 rounded text-sm">
              {movie.duration}
            </span>
            <span className="text-gray-300">
              {new Date(movie.releaseDate).getFullYear()}
            </span>
            <span className="text-gray-300">
              {movie.genres.map((genre) => genre.name).join(", ")}
            </span>
          </div>
          <div className="flex space-x-4">
            <Button
              className="bg-white text-black hover:bg-gray-200 px-8 py-3 text-lg font-semibold cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handlePlayMovie(movie.id);
              }}
            >
              <Play className="w-5 h-5 mr-2" />
              Xem
            </Button>
            <Button
              variant="outline" // Sửa thành outlined theo lỗi bạn báo trước
              className="border-gray-400 text-black hover:border-white px-8 py-3 text-lg cursor-pointer"
              onClick={() => handleMoreInfo(movie.id)}
            >
              <Info className="w-5 h-5 mr-2" />
              Chi tiết
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
