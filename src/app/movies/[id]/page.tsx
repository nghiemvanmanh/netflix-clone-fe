"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Play,
  Plus,
  ThumbsUp,
  ThumbsDown,
  Share,
  ArrowLeft,
  Star,
  Check,
} from "lucide-react";
import { Genre, Movie, Profile, User } from "../../../../utils/interface";
import { fetcher } from "../../../../utils/fetcher";
import Header from "@/components/header/header";
import Image from "next/image";
import parseJwt from "../../../../utils/token";
import Cookies from "js-cookie";
import { notification } from "antd";
import { AnimatePresence, motion } from "framer-motion";
export default function MovieDetailPage() {
  const router = useRouter();
  const params = useParams();
  const movieId = params.id as number | string;

  const [movie, setMovie] = useState<Movie | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [myList, setMyList] = useState<number[]>([]);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const profileData = localStorage.getItem("selectedProfile");
    const parsedCookie = parseJwt(Cookies.get("accessToken") || "");
    const parsedProfile = profileData ? JSON.parse(profileData) : null;
    setProfile(parsedProfile);
    setUser(parsedCookie);
    const fetchMyList = async () => {
      if (parsedCookie?.id && parsedProfile?.id) {
        const response = await fetcher.get(
          `/users/${parsedCookie.id}/profiles/${parsedProfile.id}/my-lists`
        );
        setMyList(response.data?.map((item: any) => item.movie.id));
      }
    };

    const fetchMovieDetails = async () => {
      try {
        const response = await fetcher.get(`/movies/${movieId}`);
        console.log({ response });
        setMovie(response.data);
        const allMovies = await fetcher.get("/movies");
        const similarMovies = allMovies.data
          .filter(
            (m: Movie) =>
              m.id !== response.data?.id &&
              m.genres.some((genre: Genre) =>
                response.data?.genres.some((g: Genre) => g.id === genre.id)
              )
          )
          .slice(0, 6);
        setSimilarMovies(similarMovies);
      } catch (error) {
        console.error("Error fetching movie details:", error);
        router.push("/home");
      } finally {
        setLoading(false);
      }
    };

    fetchMyList();
    fetchMovieDetails();
  }, [movieId, router]);
  const handleToggleMyList = async (movieId: number) => {
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
  const handlePlay = () => {
    router.push(`/watch/${movieId}`);
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
          <ArrowLeft style={{ width: "25px", height: "30px" }} />
        </Button>
      </div>

      {/* Hero Section */}
      <section className="relative h-full pt-32">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${movie.thumbnailUrl || "/placeholder.svg"})`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

        <div className="relative z-10 flex items-end h-full px-6 pb-32">
          <div className="max-w-2xl">
            <h1 className="text-6xl font-bold mb-4">{movie.title}</h1>

            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <span className="text-lg">8.5</span>
              </div>
              <span className="text-gray-300">
                {new Date(movie.releaseDate).getFullYear()}
              </span>
              <span className="text-gray-300">{movie.duration}</span>
              <span className="border border-gray-500 px-2 py-1 rounded text-xs">
                4K Ultra HD, HDR, HD
              </span>
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <span className="bg-gray-800 px-3 py-1 rounded-full text-sm">
                {movie.movieTypes.map((m) => m.name).join(", ")}
              </span>
            </div>
            <div className="flex items-center space-x-4 mb-6">
              <span className="bg-red-600 px-3 py-1 rounded-full text-sm">
                {movie.genres.map((genre) => genre.name).join(", ")}
              </span>
            </div>

            <p className="text-lg mb-8 text-gray-200 leading-relaxed max-w-xl">
              {movie.description}
            </p>

            <div className="flex space-x-4 mb-8">
              <Button
                className="bg-white text-black cursor-pointer hover:bg-gray-200 px-8 py-3 text-lg font-semibold"
                onClick={handlePlay}
              >
                <Play className="w-6 h-6 mr-2" />
                Play
              </Button>
              <Button
                variant="outline"
                className="border-gray-400 text-black cursor-pointer hover:border-white"
                onClick={() => handleToggleMyList(+movieId)}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {myList?.includes(+movieId) ? (
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
                My list
              </Button>
              <Button
                variant="outline"
                className="border-gray-400 text-black cursor-pointer hover:border-white px-4 py-3"
              >
                <ThumbsUp className="w-6 h-6" />
              </Button>
              <Button
                variant="outline"
                className="border-gray-400 text-black cursor-pointer hover:border-white px-4 py-3"
              >
                <ThumbsDown className="w-6 h-6" />
              </Button>
              <Button
                variant="outline"
                className="border-gray-400 text-black cursor-pointer hover:border-white px-4 py-3"
              >
                <Share className="w-6 h-6" />
              </Button>
            </div>

            {/* <div className="flex flex-wrap gap-2">
              <span className="bg-red-600 px-3 py-1 rounded-full text-sm">
                Sci-Fi
              </span>
            </div> */}
          </div>
        </div>
      </section>

      {/* Details Section */}
      <section className="relative z-10 -mt-32 px-6 pb-20">
        <div className=" mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-gray-900 rounded-lg p-8 mb-8">
                <h2 className="text-2xl font-bold mb-6">{movie.title}</h2>

                <div className="space-y-4">
                  <div>
                    <span className="text-gray-400 font-medium">
                      Đạo diễn:{" "}
                    </span>
                    <span className="text-white">
                      {movie.directors
                        .map((director) => director.name)
                        .join(", ")}
                    </span>
                  </div>

                  <div>
                    <span className="text-gray-400 font-medium">
                      Diễn viên:{" "}
                    </span>
                    <span className="text-white">
                      {movie.actors.map((actor) => actor.name).join(", ")}
                    </span>
                  </div>

                  <div>
                    <span className="text-gray-400 font-medium">
                      Thể loại:{" "}
                    </span>
                    <span className="text-white">
                      {movie.genres.map((genre) => genre.name).join(", ")}
                    </span>
                  </div>
                  <div className="text-gray-400 font-medium">
                    <span className="text-gray-400">Subtitles:</span>
                    <span className="text-white ml-2">English, Vietnamese</span>
                  </div>
                  <div className="text-gray-400 font-medium">
                    <span className="text-gray-400">Audio:</span>
                    <span className="text-white ml-2">English, Vietnamese</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-medium">
                      Năm phát hành:{" "}
                    </span>
                    <span className="text-white">
                      {new Date(movie.releaseDate).getFullYear()}
                    </span>
                  </div>

                  <div>
                    <span className="text-gray-400 font-medium">
                      Thời gian:{" "}
                    </span>
                    <span className="text-white">{movie.duration}</span>
                  </div>

                  <div>
                    <span className="text-gray-400 font-medium">Loại: </span>
                    <span className="text-white">
                      {movie.movieTypes.map((m) => m.name).join(", ")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Episodes/Seasons (for TV shows)
              {movie.genres.includes("TV") && (
                <div className="bg-gray-900 rounded-lg p-8">
                  <h2 className="text-2xl font-bold mb-6">Episodes</h2>
                  <div className="space-y-4">
                    {[1, 2, 3].map((episode) => (
                      <div
                        key={episode}
                        className="flex items-center space-x-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 cursor-pointer"
                      >
                        <div className="text-2xl font-bold text-gray-400 w-8">
                          {episode}
                        </div>
                        <img
                          src={`/placeholder.svg?height=80&width=140&text=Ep${episode}`}
                          alt={`Episode ${episode}`}
                          className="w-36 h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">
                            Episode {episode}
                          </h3>
                          <p className="text-gray-400 text-sm">45m</p>
                          <p className="text-gray-300 text-sm mt-2">
                            Episode description goes here...
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          className="text-white hover:text-gray-300"
                        >
                          <Play className="w-5 h-5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )} */}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-gray-900 rounded-lg p-6 mb-8">
                <h3 className="text-xl font-bold mb-4">Bạn có thể thích</h3>
                <div className="space-y-4">
                  {similarMovies.map((similarMovie) => (
                    <div
                      key={similarMovie.id}
                      className="flex space-x-3 cursor-pointer hover:bg-gray-800 p-2 rounded "
                      onClick={() => router.push(`/movies/${similarMovie.id}`)}
                    >
                      <div className="w-60 h-36 relative">
                        <Image
                          fill
                          src={similarMovie.thumbnailUrl || "/placeholder.svg"}
                          alt={similarMovie.title}
                          className=" object-cover rounded-lg"
                        />
                      </div>

                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">
                          {similarMovie.title}
                        </h4>
                        <p className="text-gray-400 text-sm mb-2">
                          {new Date(similarMovie.releaseDate).getFullYear()}
                        </p>
                        <p className="text-gray-300 text-xs line-clamp-3">
                          {similarMovie.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
