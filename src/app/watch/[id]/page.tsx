"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  Plus,
  Share,
  Star,
  Check,
} from "lucide-react";
import { Genre, Movie, Profile, User } from "../../../../utils/interface";
import { fetcher } from "../../../../utils/fetcher";
import VideoPlayer from "@/components/movie/video-player";
import Header from "@/components/header/header";
import parseJwt from "../../../../utils/token";
import Cookies from "js-cookie";
import { notification } from "antd";
import { AnimatePresence, motion } from "framer-motion";
export default function WatchPage() {
  const router = useRouter();
  const params = useParams();
  const movieId = params.id as string;

  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [myList, setMyList] = useState<string[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const profileData = localStorage.getItem("selectedProfile");
    const parsedCookie = parseJwt(Cookies.get("accessToken") || "");
    const parsedProfile = profileData ? JSON.parse(profileData) : null;
    setUser(parsedCookie);
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
    fetchMovieDetails();
  }, [movieId, router]);
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
        setMyList((myList || []).filter((id) => id !== movieId));
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
        setMyList([...(myList || []), movieId]);
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "Có lỗi xảy ra khi thêm vào danh sách";

      notification.warning({
        message: "Thông báo",
        description: message,
      });
    }
  };
  const fetchMovieDetails = async () => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // TODO: Replace with real API call
      const response = await fetcher.get(`/movies/${movieId}`);
      const allMovies = await fetcher.get("/movies");
      setMovie(response.data);

      const similar = allMovies.data
        .filter(
          (m: Movie) =>
            m.id !== response.data?.id &&
            m.genres.some((genre: Genre) =>
              response.data?.genres.some((g: Genre) => g.id === genre.id)
            )
        )
        .slice(0, 6);

      console.log("Similar movies:", similar);
      setSimilarMovies(similar);
    } catch (error) {
      console.error("Error fetching movie details:", error);
      router.push("/home");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
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
      <Header />
      {/* Back Button */}
      <div className="fixed top-6 left-6 z-40 mt-10">
        <Button
          variant="ghost"
          className="bg-black/50 hover:bg-white/50 text-white rounded-full w-12 h-12 p-0 cursor-pointer"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-[25px] h-[30px] sm:w-6 sm:h-6" />
        </Button>
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
            <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>

            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <span className="text-lg">8.5</span>
              </div>
              <span className="bg-gray-800 px-2 py-1 rounded text-sm hidden sm:inline-block">
                {movie.movieTypes.map((type) => type.name).join(", ")}
              </span>
              <span className="text-gray-300">
                {new Date(movie.releaseDate).getFullYear()}
              </span>
              <span className="text-gray-300">{movie.duration}</span>
              <span className="border border-gray-500 px-2 py-1 rounded text-xs">
                HD
              </span>
            </div>

            <div className="flex space-x-2 sm:space-x-4 mb-6">
              <Button
                variant="outline"
                className="border-gray-400 text-black cursor-pointer hover:border-white"
                onClick={() => handleToggleMyList(movieId)}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {myList?.includes(movieId) ? (
                    <motion.div
                      key="check"
                      initial={{ opacity: 0, rotate: -180, scale: 0.3 }}
                      animate={{ opacity: 1, rotate: 0, scale: 1 }}
                      exit={{ opacity: 0, rotate: 180, scale: 0.3 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <Check className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="plus"
                      initial={{ opacity: 0, rotate: 180, scale: 0.3 }}
                      animate={{ opacity: 1, rotate: 0, scale: 1 }}
                      exit={{ opacity: 0, rotate: -180, scale: 0.3 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <Plus className="w-5 h-5" />
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
              {movie.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  <span className="text-gray-400 font-medium">Đạo diễn: </span>
                  <span className="text-white">
                    {movie.directors
                      .map((director) => director.name)
                      .join(", ")}
                  </span>
                </div>
                <div className="mb-4">
                  <span className="text-gray-400 font-medium">Diễn viên: </span>
                  <span className="text-white">
                    {movie.actors.map((actor) => actor.name).join(", ")}
                  </span>
                </div>
                <div className="mb-4">
                  <span className="text-gray-400 font-medium">Thể loại: </span>
                  <span className="text-white">
                    {movie.genres.map((genre) => genre.name).join(", ")}
                  </span>
                </div>
              </div>
              <div>
                <div className="mb-4">
                  <span className="text-gray-400 font-medium">
                    Năm phát hành:{" "}
                  </span>
                  <span className="text-white">
                    {new Date(movie.releaseDate).getFullYear()}
                  </span>
                </div>
                <div className="mb-4">
                  <span className="text-gray-400 font-medium">
                    Thời lượng:{" "}
                  </span>
                  <span className="text-white">{movie.duration}</span>
                </div>
                <div className="mb-4">
                  <span className="text-gray-400 font-medium">Loại: </span>
                  <span className="text-white">
                    {movie.movieTypes.map((type) => type.name).join(", ")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Similar Movies Section */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Có thể bạn sẽ thích</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {similarMovies.map((similarMovie) => (
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
                    {similarMovie.genres.map((genre) => genre.name).join(", ")}
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
