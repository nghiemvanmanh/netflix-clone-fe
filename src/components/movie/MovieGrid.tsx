// components/MovieCard.tsx
import { Play, Info, Edit, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Movie } from "../../../utils/interface";
import Image from "next/image";

type Props = {
  movie: Movie;
  isAdmin?: boolean;
  onEdit?: (movie: Movie) => void;
  onDelete?: (id: number) => void;
};

export default function MovieGrid({ movie, isAdmin, onEdit, onDelete }: Props) {
  return (
    <div className="group cursor-pointer">
      <div className="relative overflow-hidden rounded-lg mb-3 transform group-hover:scale-105 transition-all duration-300 group-hover:z-10">
        <Image
          width={384}
          height={256}
          src={movie.thumbnailUrl || "/placeholder.svg"}
          alt={movie.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Hover Controls */}
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
            >
              <Plus className="w-4 h-4" />
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

      <div>
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
