"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Play, Plus, Info, Check, Loader2 } from "lucide-react";
import { Movie } from "../../../utils/interface";
import { useEffect, useState } from "react";
import { fetcher } from "../../../utils/fetcher";
import { notification } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useNotifications } from "@/contexts/use_notification-context";
import { useUser } from "@/contexts/user-provider";
import { useProfile } from "@/contexts/use-profile";
import { typeNotification } from "../../../utils/enum";

interface MovieCardProps {
  movie: Movie;
  myList: string[] | null;
  isMyList?: boolean;
  setMyList: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function MovieCard({
  isMyList,
  movie,
  myList,
  setMyList,
}: MovieCardProps) {
  const router = useRouter();
  const { addNotification } = useNotifications();
  const { user } = useUser();
  const { profile } = useProfile();
  const [isLoading, setIsLoading] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  const handleToggleMyList = async (movieId: string) => {
    const isInList = myList?.includes(movieId);
    setIsLoading(true);
    try {
      if (isInList) {
        if (isMyList) {
          // Ẩn phim UI tạm thời
          setIsHidden(true);
          const key = `undo-${movieId}`;
          let isUndo = false;

          // Tạo timeout để gọi xóa thật sau 6s
          const deleteMovie = async () => {
            if (isUndo) {
              return;
            }
            await fetcher.delete(
              `/users/${user?.id}/profiles/${profile?.id}/my-lists/${movieId}`
            );
            await addNotification(
              "Đã xóa khỏi danh sách",
              "Phim đã được xóa khỏi danh sách của bạn.",
              typeNotification.WARNING,
              movie.id,
              movie.title,
              movie.thumbnailUrl
            );
            setMyList((prev) => (prev || []).filter((id) => id !== movieId));
            notification.destroy(key);
          };

          const deleteTimeout = window.setTimeout(() => {}, 6000);

          notification.warning({
            message: "Đã xóa khỏi danh sách",
            description: (
              <div>
                Phim đã được xóa khỏi danh sách của bạn.
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 6, ease: "linear" }}
                  className="h-[4px] bg-green-500 rounded mt-2"
                />
              </div>
            ),
            btn: (
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-500 hover:underline cursor-pointer"
                onClick={() => {
                  isUndo = true;
                  clearTimeout(deleteTimeout);
                  setIsHidden(false);
                  notification.destroy(key);
                }}
              >
                Hoàn tác
              </Button>
            ),
            key,
            duration: 6,
            onClose: () => {
              clearTimeout(deleteTimeout);
              deleteMovie();
            },
          });
        } else {
          await fetcher.delete(
            `/users/${user?.id}/profiles/${profile?.id}/my-lists/${movieId}`
          );
          await addNotification(
            "Đã xóa khỏi danh sách",
            "Phim đã được xóa khỏi danh sách của bạn.",
            typeNotification.WARNING,
            movie.id,
            movie.title,
            movie.thumbnailUrl
          );
          setMyList((myList || []).filter((id) => id !== movieId));
          notification.warning({
            message: "Đã xóa khỏi danh sách",
            description: "Phim đã được xóa khỏi danh sách của bạn.",
          });
        }
      } else {
        await fetcher.post(
          `/users/${user?.id}/profiles/${profile?.id}/my-lists`,
          { movieId }
        );
        await addNotification(
          "Đã thêm vào danh sách",
          "Phim đã được thêm vào danh sách của bạn.",
          typeNotification.SUCCESS,
          movie.id,
          movie.title,
          movie.thumbnailUrl
        );
        setMyList([...(myList || []), movieId]);
        notification.success({
          message: "Đã thêm vào danh sách",
          description: "Phim đã được thêm vào danh sách của bạn.",
        });
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "Có lỗi xảy ra khi thao tác với danh sách";

      notification.error({
        message: "Lỗi",
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayMovie = (movieId: string) => {
    router.push(`/watch/${movieId}`);
  };

  const handleMoreInfo = (movieId: string) => {
    router.push(`/movies/${movieId}`);
  };

  return (
    <AnimatePresence>
      {!isHidden && (
        <motion.div
          key={movie.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.3 } }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0 w-full sm:w-80 group transition-all duration-300"
        >
          <div className="relative overflow-hidden rounded-lg transform group-hover:scale-120 transition-all duration-500 group-hover:z-10">
            <div
              className="relative w-full h-48 rounded-lg overflow-hidden cursor-pointer"
              onClick={() => handleMoreInfo(movie.id)}
            >
              <Image
                fill
                src={movie.thumbnailUrl || "/placeholder.svg"}
                alt={movie.title}
                className="object-cover rounded-lg"
                priority={false}
              />
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

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
                  disabled={isLoading}
                  className="w-8 h-8 rounded-full border-gray-400 text-black hover:border-white p-0 cursor-pointer overflow-hidden"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleMyList(movie.id);
                  }}
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
                        <Loader2 className="w-4 h-4 animate-spin" />
                      </motion.div>
                    ) : myList?.includes(movie.id) ? (
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
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
