"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Movie } from "../../../utils/interface";
import { baseURL, fetcher } from "../../../utils/fetcher";
import Cookies from "js-cookie";
import { MultiSelectField } from "./MultiSelectField";
import { notification } from "antd";

interface MovieModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (movie: Movie) => void;
  movie: Movie | null;
}

interface SelectItemType {
  value: number;
  label: string;
}

export default function MovieModal({
  isOpen,
  onClose,
  onSave,
  movie,
}: MovieModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    thumbnailUrl: "",
    videoUrl: "",
    duration: "",
    releaseDate: "",
    genreIds: [] as number[],
    movieTypeIds: [] as number[],
    actorIds: [] as number[],
    directorIds: [] as number[],
  });
  const [loading, setLoading] = useState(false);
  const [genres, setGenres] = useState<SelectItemType[]>([]);
  const [movieTypes, setMovieTypes] = useState<SelectItemType[]>([]);
  const [actors, setActors] = useState<SelectItemType[]>([]);
  const [directors, setDirectors] = useState<SelectItemType[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Fetch data for select fields
  useEffect(() => {
    const fetchSelectData = async () => {
      try {
        const [genresData, movieTypesData, actorsData, directorsData] =
          await Promise.all([
            fetcher.get("/genres/select").then((res) => res.data),
            fetcher.get("/movie-types/select").then((res) => res.data),
            fetcher.get("/actors/select").then((res) => res.data),
            fetcher.get("/directors/select").then((res) => res.data),
          ]);
        setGenres(genresData);
        setMovieTypes(movieTypesData);
        setActors(actorsData);
        setDirectors(directorsData);
      } catch (error) {
        console.error("Error fetching select data:", error);
        setFetchError("Failed to load select options");
      }
    };

    fetchSelectData();
  }, []);

  // Update form data when movie prop changes
  useEffect(() => {
    if (movie) {
      setFormData({
        title: movie.title,
        description: movie.description || "",
        thumbnailUrl: movie.thumbnailUrl,
        videoUrl: movie.videoUrl || "",
        duration: movie.duration,
        releaseDate: movie.releaseDate
          ? typeof movie.releaseDate === "string"
            ? movie.releaseDate
            : movie.releaseDate.toISOString().slice(0, 10)
          : "",
        genreIds: movie.genres.map((genre) => genre.id),
        movieTypeIds: movie.movieTypes.map((type) => type.id),
        actorIds: movie.actors.map((actor) => actor.id),
        directorIds: movie.directors.map((director) => director.id),
      });
    } else {
      setFormData({
        title: "",
        description: "",
        thumbnailUrl: "",
        videoUrl: "",
        duration: "",
        releaseDate: "",
        genreIds: [],
        movieTypeIds: [],
        actorIds: [],
        directorIds: [],
      });
    }
  }, [movie]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.title.trim() ||
      !formData.thumbnailUrl.trim() ||
      !formData.videoUrl.trim()
    )
      return;

    setLoading(true);
    try {
      const token = Cookies.get("accessToken");
      const response = await fetch(
        movie ? `${baseURL}/movies/${movie.id}` : `${baseURL}/movies`,
        {
          method: movie ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );
      const savedMovie = await response.json();
      notification.success({
        message: "Phim",
        description: movie ? "Cập nhật thành công" : "Thêm thành công",
      });
      onSave(savedMovie);
    } catch (error) {
      console.error("Error saving movie:", error);
      notification.error({
        message: "Lỗi",
        description: "Đã xảy ra lỗi khi lưu phim",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black border-gray-800 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {movie ? "Edit Movie" : "Add New Movie"}
          </DialogTitle>
        </DialogHeader>

        {fetchError && (
          <div className="text-red-500 text-center">{fetchError}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Title *
            </Label>
            <Input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
              placeholder="Enter movie title"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 min-h-[80px]"
              placeholder="Enter movie description"
            />
          </div>

          {/* URLs Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="thumbnailUrl" className="text-sm font-medium">
                Thumbnail URL *
              </Label>
              <Input
                id="thumbnailUrl"
                type="url"
                value={formData.thumbnailUrl}
                onChange={(e) =>
                  setFormData({ ...formData, thumbnailUrl: e.target.value })
                }
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                placeholder="https://example.com/thumbnail.jpg"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="videoUrl" className="text-sm font-medium">
                Video URL *
              </Label>
              <Input
                id="videoUrl"
                type="url"
                value={formData.videoUrl}
                onChange={(e) =>
                  setFormData({ ...formData, videoUrl: e.target.value })
                }
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                placeholder="https://example.com/video.mp4"
                required
              />
            </div>
          </div>

          {/* Duration and Release Date Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration" className="text-sm font-medium">
                Duration *
              </Label>
              <Input
                id="duration"
                type="text"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                placeholder="e.g., 120m or 2h 30m"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="releaseDate" className="text-sm font-medium">
                Release Date *
              </Label>
              <Input
                id="releaseDate"
                type="date"
                value={formData.releaseDate}
                onChange={(e) =>
                  setFormData({ ...formData, releaseDate: e.target.value })
                }
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                required
              />
            </div>
          </div>

          {/* Genres */}
          <MultiSelectField
            label="Genres"
            field="genreIds"
            items={genres}
            formData={formData}
            setFormData={setFormData}
            badgeColor="bg-red-600"
          />

          {/* Movie Types */}
          <MultiSelectField
            label="Movie Types"
            field="movieTypeIds"
            items={movieTypes}
            formData={formData}
            setFormData={setFormData}
            badgeColor="bg-blue-600"
          />

          {/* Actors */}
          <MultiSelectField
            label="Actors"
            field="actorIds"
            items={actors}
            formData={formData}
            setFormData={setFormData}
            badgeColor="bg-green-600"
          />

          {/* Directors */}
          <MultiSelectField
            label="Directors"
            field="directorIds"
            items={directors}
            formData={formData}
            setFormData={setFormData}
            badgeColor="bg-purple-600"
          />

          {/* Thumbnail Preview */}
          {formData.thumbnailUrl && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Thumbnail Preview</Label>
              <div className="w-48 h-32 mx-auto rounded-lg overflow-hidden bg-gray-700">
                <img
                  src={formData.thumbnailUrl || "/placeholder.svg"}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-gray-600 text-gray-300 hover:text-white hover:border-white"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              disabled={
                loading ||
                !formData.title.trim() ||
                !formData.thumbnailUrl.trim() ||
                !formData.videoUrl.trim()
              }
            >
              {loading ? "Saving..." : movie ? "Update Movie" : "Add Movie"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
