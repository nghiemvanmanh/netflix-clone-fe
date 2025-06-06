// components/MovieCard.tsx
import { Play, Info, Edit, Trash2, Plus, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Movie } from "../../../utils/interface";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { notification } from "antd";
import { fetcher } from "../../../utils/fetcher";
import { useNotifications } from "@/contexts/use_notification-context";
import { useUser } from "@/contexts/user-provider";
import { useProfile } from "@/contexts/use-profile";
import { typeNotification } from "../../../utils/enum";
import { useMyListHandler } from "@/hooks/use-toggle-mylist";
type Props = {
  movie: Movie;
  isAdmin?: boolean;
  onEdit?: (movie: Movie) => void;
  onDelete?: (id: string) => void;
};

export default function MovieGrid({ movie, isAdmin, onEdit, onDelete }: Props) {
  const router = useRouter();
  const [myList, setMyList] = useState<string[]>([]);
  const { user } = useUser();
  const { profile } = useProfile();
  const { handleToggleMyList, isLoading } = useMyListHandler({
    userId: user?.id,
    profileId: profile?.id,
    myList,
    setMyList,
  });

  const handlePlayMovie = (movieId: string) => {
    router.push(`/watch/${movieId}`);
  };
  const handleMoreInfo = (movieId: string) => {
    router.push(`/movies/${movieId}`);
  };
  return (
    <div className="flex-shrink-0 w-full sm:w-80 group transition-all duration-300">
      <div className="relative overflow-hidden rounded-lg mb-3 transform group-hover:scale-105 transition-all duration-300 group-hover:z-10">
        <div
          className="relative w-full h-48 rounded-lg overflow-hidden"
          onClick={() => handleMoreInfo(movie.id)}
        >
          <Image
            fill
            src={movie.thumbnailUrl || "/placeholder.svg"}
            alt={movie.title}
            className="object-cover rounded-lg"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Hover Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
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
                handleToggleMyList(movie);
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
              <span>{new Date(movie.releaseDate).getFullYear()}</span>
              <span>{movie.duration}</span>
            </div>
            <div className="text-gray-400">
              {movie.genres.map((genre) => genre.name).join(", ")}
            </div>
          </div>
        </div>

        {/* Admin Controls */}
        {isAdmin && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex space-x-1">
              <Button
                size="sm"
                variant="outline"
                className="w-8 h-8 p-0 bg-black/50 border-gray-600 hover:bg-black/70"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.(movie);
                }}
              >
                <Edit className="w-3 h-3 text-white" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="w-8 h-8 p-0 bg-black/50 border-gray-600 hover:bg-red-600/70"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(movie.id);
                }}
              >
                <Trash2 className="w-3 h-3 text-white" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <div
        onClick={(e) => {
          e.stopPropagation();
          handleMoreInfo(movie.id);
        }}
        className="cursor-pointer group-hover:text-white transition-colors"
      >
        <h3 className="font-semibold text-lg group-hover:text-gray-300 transition-colors">
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
