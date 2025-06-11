"use client";

import { useState, useEffect, useRef } from "react";
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
  Loader2,
  User,
} from "lucide-react";
import { Movie } from "../../../../../../utils/interface";
import { fetcher } from "../../../../../../utils/fetcher";
import Header from "@/components/header/header";
import Image from "next/image";
import { notification } from "antd";
import { AnimatePresence, motion } from "framer-motion";
import { useNotifications } from "@/contexts/use_notification-context";
import { useUser } from "@/contexts/user-provider";
import { useProfile } from "@/contexts/use-profile";
import { typeNotification } from "../../../../../../utils/enum";
import { useQueries } from "@tanstack/react-query";
import { formatTime } from "@/constants/date";
import Loading from "@/components/ui/loading";
import { DeleteOutlined } from "@ant-design/icons";
import { useMyListHandler } from "@/hooks/use-toggle-mylist";
import { Comment } from "@/components/movie/Comment";
import { BackButton } from "@/components/ui/back-button";
export default function MovieDetailPage() {
  const router = useRouter();
  const params = useParams();
  const movieId = params.id as string;
  const [myList, setMyList] = useState<string[]>([]);
  const { user } = useUser();
  const { profile } = useProfile();

  const { handleToggleMyList, isLoading } = useMyListHandler({
    userId: user?.id,
    profileId: profile?.id,
    myList,
    setMyList,
  });
  const results = useQueries({
    queries: [
      {
        queryKey: ["similarMovies", movieId],
        queryFn: () =>
          fetcher.get(`/movies/${movieId}/similar`).then((res) => res.data),
        refetchOnWindowFocus: false,
      },
      {
        queryKey: ["Movies", movieId],
        queryFn: () =>
          fetcher.get(`/movies/${movieId}`).then((res) => res.data),
        refetchOnWindowFocus: false,
      },
      {
        queryKey: ["comments", movieId],
        queryFn: () => {
          return fetcher
            .get(`/reviews/movies/${movieId}`)
            .then((res) => res.data);
        },
        refetchOnWindowFocus: false,
      },
    ],
  });
  const similarMovies: Movie[] = results[0].data;
  const movie: Movie = results[1].data;
  const comments = results[2].data;
  const refetchComments = () => {
    results[2].refetch();
  };

  useEffect(() => {
    const fetchMyList = async () => {
      if (user?.id && profile?.id) {
        const response = await fetcher.get(
          `/users/${user.id}/profiles/${profile.id}/my-lists`
        );
        setMyList(response.data?.map((item: any) => item.movie.id));
      }
    };

    fetchMyList();
  }, [movieId]);

  const handlePlay = () => {
    router.push(`/watch/${movieId}`);
  };

  const handleAddComment = async (content: string) => {
    if (!content.trim()) {
      notification.warning({
        message: "Thông báo",
        description: "Nội dung bình luận không được để trống.",
      });
      return;
    }

    await fetcher.post(`/reviews/movies/${movieId}/profiles/${profile?.id}`, {
      content,
      name: profile?.name,
    });
    refetchComments();

    notification.success({
      message: "Bình luận đã được thêm",
      description: "Bình luận đã được thêm thành công.",
    });
  };
  const handleDeleteComment = async (commentId: string) => {
    try {
      await fetcher.delete(`reviews/movies/${commentId}`);
      refetchComments();

      notification.success({
        message: "Bình luận đã được xóa",
        description: "Bình luận đã được xóa thành công.",
      });
    } catch (error) {
      console.error("Error deleting comment:", error);
      notification.error({
        message: "Lỗi",
        description: "Có lỗi xảy ra khi xóa bình luận.",
      });
    }
  };

  if (!movie) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-black text-white">

      {/* Back Button */}
      <BackButton />

      {/* Hero Section */}
      <section className="relative h-full pt-32">
        <Image
          src={movie.thumbnailUrl || "/placeholder.svg"}
          alt="Movie thumbnail"
          fill
          className="absolute inset-0 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

        <div className="relative z-10 flex items-end h-full px-6 pb-32">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold mb-4 sm:text-6xl">
              {movie.title}
            </h1>

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
              <span className="inline-block bg-gradient-to-r from-gray-800 to-blue-600 px-3 py-1 rounded-full text-sm text-white shadow-sm">
                {movie.movieTypes.map((m) => m.name).join(", ")}
              </span>
            </div>
            <div className="flex items-center space-x-4 mb-6">
              <span className="inline-block bg-gradient-to-r from-red-600 to-gray-900 px-3 py-1 rounded-full text-sm text-white shadow-sm">
                {movie.genres.map((genre) => genre.name).join(", ")}
              </span>
            </div>

            <p className="text-lg mb-8 text-gray-200 leading-relaxed max-w-xs sm:max-w-xl">
              {movie.description}
            </p>

            <div className="sm:flex sm:flex-row space-y-4 mb-8  ">
              {/* Row 1: Play & My List */}
              <div className="flex space-x-4 mb-4 sm:mb-0">
                <Button
                  className="bg-white text-black cursor-pointer hover:bg-gray-200 px-8 py-3 text-lg font-semibold"
                  onClick={handlePlay}
                >
                  <Play className="w-6 h-6 mr-2" />
                  Play
                </Button>
                <Button
                  variant="outline"
                  disabled={isLoading}
                  className="border-gray-400 text-black cursor-pointer hover:border-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleMyList(movie);
                  }}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {isLoading ? (
                      <motion.div
                        key="loader"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Loader2 className="w-5 h-5 animate-spin" />
                      </motion.div>
                    ) : myList?.includes(movieId) ? (
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
              </div>

              {/* Row 2: ThumbsUp, ThumbsDown, Share */}
              <div className="flex space-x-4 ml-0 sm:ml-4">
                <Button
                  variant="outline"
                  className="border-gray-400 text-black cursor-pointer hover:border-white px-4 py-3"
                  onClick={() => {
                    notification.success({
                      message: "Cảm ơn bạn đã thích phim này!",
                      description: "Chúng tôi rất vui khi bạn thích nó.",
                    });
                  }}
                >
                  <ThumbsUp className="w-6 h-6" />
                </Button>
                <Button
                  variant="outline"
                  className="border-gray-400 text-black cursor-pointer hover:border-white px-4 py-3"
                  onClick={() => {
                    notification.warning({
                      message: "Xin lỗi bạn về sự không hài lòng này!",
                      description: "Chúng tôi sẽ cải thiện phim hơn nữa.",
                    });
                  }}
                >
                  <ThumbsDown className="w-6 h-6" />
                </Button>
                <Button
                  variant="outline"
                  className="border-gray-400 text-black cursor-pointer hover:border-white px-4 py-3"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${window.location.origin}/movies/${movieId}`
                    );
                    notification.success({
                      message: "Đã sao chép liên kết!",
                      description:
                        "Bạn có thể chia sẻ liên kết này với bạn bè.",
                    });
                  }}
                >
                  <Share className="w-6 h-6" />
                </Button>
              </div>
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
              <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-2xl p-8 mb-8 shadow-xl shadow-black/30 border border-gray-700">
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
              {/* Comments Section */}
              <Comment
                comments={comments}
                user={user}
                handleAddComment={handleAddComment}
                handleDeleteComment={handleDeleteComment}
              />
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
              <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-lg p-6 mb-8 shadow-xl shadow-black/30 border border-gray-700">
                <h3 className="text-xl font-bold mb-4">Bạn có thể thích</h3>

                {similarMovies?.length > 0 ? (
                  <div className="space-y-4">
                    {similarMovies.map((similarMovie) => (
                      <div
                        key={similarMovie.id}
                        className="flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0 cursor-pointer hover:bg-gray-800 p-2 rounded"
                        onClick={() =>
                          router.push(`/movies/${similarMovie.id}`)
                        }
                      >
                        <div className="w-full sm:w-60 h-36 relative">
                          <Image
                            fill
                            src={
                              similarMovie.thumbnailUrl || "/placeholder.svg"
                            }
                            alt={similarMovie.title}
                            className="object-cover rounded-lg"
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
                ) : (
                  <div className="text-gray-400 text-sm italic">
                    Không có phim tương tự...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
