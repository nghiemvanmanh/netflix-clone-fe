"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Play, Info } from "lucide-react";
import Cookies from "js-cookie";
import MovieModal from "@/components/movie/movie-modal";
import { Movie, Profile, User } from "../../../utils/interface";
import { fetcher } from "../../../utils/fetcher";
import Header from "@/components/header/header";

export default function MoviesPage() {
  const [user, setUser] = useState<User | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const router = useRouter();

  useEffect(() => {
    const userCookie = Cookies.get("user");
    if (userCookie) {
      setUser(JSON.parse(userCookie));
    }
    fetchMovies();
  }, [router]);

  const fetchMovies = async () => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // TODO: Replace with real API call
      const response = await fetcher.get("/movies");
      setMovies(response.data);
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMovie = () => {
    setEditingMovie(null);
    setShowModal(true);
  };

  const handleEditMovie = (movie: Movie) => {
    setEditingMovie(movie);
    setShowModal(true);
  };

  const handleDeleteMovie = async (movieId: number) => {
    if (!confirm("Are you sure you want to delete this movie?")) return;

    try {
      // TODO: Replace with real API call
      await fetcher.delete(`/movies/${movieId}`);

      setMovies(movies.filter((movie) => movie.id !== movieId));
    } catch (error) {
      console.error("Error deleting movie:", error);
    }
  };

  const handleMovieSaved = (savedMovie: Movie) => {
    if (editingMovie) {
      // Update existing movie
      setMovies(
        movies.map((movie) => (movie.id === savedMovie.id ? savedMovie : movie))
      );
    } else {
      // Add new movie
      setMovies([...movies, { ...savedMovie }]);
    }
    setShowModal(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="pt-20 px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Movies</h1>
              <p className="text-gray-400">
                Discover amazing movies and series
              </p>
            </div>

            {user?.isAdmin && (
              <Button
                onClick={handleAddMovie}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Movie
              </Button>
            )}
          </div>

          {/* Movies Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {movies.map((movie) => (
              <div key={movie.id} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-lg mb-3 transform group-hover:scale-105 transition-all duration-300 group-hover:z-10">
                  <img
                    src={movie.thumbnailUrl || "/placeholder.svg"}
                    alt={movie.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Hover Controls */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          className="w-8 h-8 rounded-full bg-white text-black hover:bg-gray-200 p-0"
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-8 h-8 rounded-full border-gray-400 text-white hover:border-white p-0"
                        >
                          <Info className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-xs text-gray-300">
                      <div className="flex items-center space-x-2 mb-1">
                        <span>{new Date(movie.releaseDate).getFullYear()}</span>
                        <span>{movie.duration}</span>
                      </div>
                      <div className="text-gray-400">
                        {movie.genres.join(", ")}
                      </div>
                    </div>
                  </div>

                  {/* Admin Controls */}
                  {user?.isAdmin && (
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-8 h-8 p-0 bg-black/50 border-gray-600 hover:bg-black/70"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditMovie(movie);
                          }}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-8 h-8 p-0 bg-black/50 border-gray-600 hover:bg-red-600/70"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteMovie(movie.id);
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
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
                    {movie.genres.join(", ")}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">{movie.duration}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Movie Modal */}
      <MovieModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleMovieSaved}
        movie={editingMovie}
      />
    </div>
  );
}
