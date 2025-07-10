"use client";

import { useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ThumbsUp,
  ThumbsDown,
  Plus,
  Share,
  Star,
  Check,
  Loader2,
} from "lucide-react";
import { Movie } from "../../../../../../utils/interface";
import { fetcher } from "../../../../../../utils/fetcher";
import VideoPlayer from "@/components/movie/video-player";
import { AnimatePresence, motion } from "framer-motion";
import Loading from "@/components/ui/loading";
import { useQueries } from "react-query";
import { useProfile } from "@/contexts/use-profile";
import { useUser } from "@/contexts/user-provider";
import { useMyListHandler } from "@/hooks/use-toggle-mylist";
import { BackButton } from "@/components/ui/back-button";
export default function WatchPage() {
  const router = useRouter();
  const params = useParams();
  const movieId = params.id as string;
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [myList, setMyList] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);
  const { user } = useUser();
  const { profile } = useProfile();
  const { handleToggleMyList, isLoading } = useMyListHandler({
    userId: user?.id,
    profileId: profile?.id,
    myList,
    setMyList,
  });
  const results = useQueries([
    {
      queryKey: ["similarMovies", movieId],
      queryFn: () =>
        fetcher.get(`/movies/${movieId}/similar`).then((res) => res.data),
      refetchOnWindowFocus: false,
      initialData: [],
      onSuccess: () => {
        setIsClient(true);
      },
    },
    {
      queryKey: ["Movies", movieId],
      queryFn: () => fetcher.get(`/movies/${movieId}`).then((res) => res.data),
      refetchOnWindowFocus: false,
      initialData: [],
      onSuccess: () => {
        setIsClient(true);
      },
    },
    {
      queryKey: ["my-lists", user?.id, profile?.id],
      queryFn: () =>
        fetcher
          .get(`/users/${user?.id}/profiles/${profile?.id}/my-lists`)
          .then((res) => res.data),
      enabled: !!user?.id && !!profile?.id,
      initialData: [],
      onSuccess: (data: Movie[]) => {
        setMyList(data?.map((item: any) => item.movie.id));
        setIsClient(true);
      },
    },
  ]);

  const similarMovies: Movie[] = results[0].data;
  const movie: Movie = results[1].data;
  const loading = results.some((result) => result.isLoading);

  if (!isClient || loading) {
    return <Loading />;
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Movie not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Back Button */}
      <div className="fixed top-6 left-6 z-40 mt-10">
        <BackButton />
      </div>

      {/* Video Player Section */}
      <div className="pt-40 px-6 pb-10 sm:pt-20">
        <div className="max-w-5xl mx-auto">
          <div
            ref={videoContainerRef}
            className="relative w-full bg-black rounded-lg overflow-hidden"
          >
            <VideoPlayer
              videoUrl={
                movie.videoUrl ||
                "https://streamable.com/e/lp5peq?quality=highest"
              }
              title={movie.title}
            />
          </div>
        </div>
      </div>

      {/* Movie Info Section */}
      <div className="px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{movie?.title}</h1>

            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <span className="text-lg">8.5</span>
              </div>
              <span className="bg-gray-800 px-2 py-1 rounded text-sm hidden sm:inline-block">
                {movie?.movieTypes?.map((type) => type.name).join(", ")}
              </span>
              <span className="text-gray-300">
                {new Date(movie?.releaseDate).getFullYear()}
              </span>
              <span className="text-gray-300">{movie?.duration}</span>
              <span className="border border-gray-500 px-2 py-1 rounded text-xs">
                HD
              </span>
            </div>

            <div className="flex space-x-2 sm:space-x-4 mb-6">
              <Button
                variant="outline"
                className="border-gray-400 text-black cursor-pointer hover:border-white"
                onClick={() => handleToggleMyList(movie)}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isLoading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    </motion.div>
                  ) : myList?.includes(movieId) ? (
                    <motion.div
                      key="check"
                      initial={{ opacity: 0, rotate: -180, scale: 0.3 }}
                      animate={{ opacity: 1, rotate: 0, scale: 1 }}
                      exit={{ opacity: 0, rotate: 180, scale: 0.3 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <Check className="w-5 h-5 mr-2" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="plus"
                      initial={{ opacity: 0, rotate: 180, scale: 0.3 }}
                      animate={{ opacity: 1, rotate: 0, scale: 1 }}
                      exit={{ opacity: 0, rotate: -180, scale: 0.3 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <Plus className="w-5 h-5 mr-2" />
                    </motion.div>
                  )}
                </AnimatePresence>
                <span className="hidden sm:inline"> My List</span>
              </Button>
              <Button
                variant="outline"
                className="border-gray-400 text-black cursor-pointer hover:border-white"
              >
                <ThumbsUp className="w-5 h-5 mr-2" />
                <span className="hidden sm:inline"> Like</span>
              </Button>
              <Button
                variant="outline"
                className="border-gray-400 text-black cursor-pointer hover:border-white"
              >
                <ThumbsDown className="w-5 h-5 mr-2" />
                <span className="hidden sm:inline"> Dislike</span>
              </Button>
              <Button
                variant="outline"
                className="border-gray-400 text-black cursor-pointer hover:border-white"
              >
                <Share className="w-5 h-5 mr-2" />
                <span className="hidden sm:inline">Share</span>
              </Button>
            </div>

            <p className="text-lg mb-6 text-gray-200 leading-relaxed">
              {movie?.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  <span className="text-gray-400 font-medium">Đạo diễn: </span>
                  <span className="text-white">
                    {movie?.directors
                      ?.map((director) => director.name)
                      .join(", ")}
                  </span>
                </div>
                <div className="mb-4">
                  <span className="text-gray-400 font-medium">Diễn viên: </span>
                  <span className="text-white">
                    {movie?.actors?.map((actor) => actor.name).join(", ")}
                  </span>
                </div>
                <div className="mb-4">
                  <span className="text-gray-400 font-medium">Thể loại: </span>
                  <span className="text-white">
                    {movie?.genres?.map((genre) => genre.name).join(", ")}
                  </span>
                </div>
              </div>
              <div>
                <div className="mb-4">
                  <span className="text-gray-400 font-medium">
                    Năm phát hành:{" "}
                  </span>
                  <span className="text-white">
                    {new Date(movie?.releaseDate).getFullYear()}
                  </span>
                </div>
                <div className="mb-4">
                  <span className="text-gray-400 font-medium">
                    Thời lượng:{" "}
                  </span>
                  <span className="text-white">{movie?.duration}</span>
                </div>
                <div className="mb-4">
                  <span className="text-gray-400 font-medium">Loại: </span>
                  <span className="text-white">
                    {movie?.movieTypes?.map((type) => type.name).join(", ")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Similar Movies Section */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Có thể bạn sẽ thích</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {similarMovies?.map((similarMovie) => (
                <div
                  key={similarMovie.id}
                  className="cursor-pointer group"
                  onClick={() => router.push(`/watch/${similarMovie.id}`)}
                >
                  <div className="relative overflow-hidden rounded-lg mb-3 transform group-hover:scale-105 transition-all duration-300">
                    <img
                      src={similarMovie.thumbnailUrl || "/placeholder.svg"}
                      alt={similarMovie.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <h3 className="font-semibold text-lg group-hover:text-gray-300 transition-colors">
                    {similarMovie.title}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {new Date(similarMovie.releaseDate).getFullYear()} •{" "}
                    {similarMovie.genres?.map((genre) => genre.name).join(", ")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
