"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Cookies from "js-cookie";
import MovieModal from "@/components/movie/movie-modal";
import { Movie, User } from "../../../utils/interface";
import { fetcher } from "../../../utils/fetcher";
import Header from "@/components/header/header";
import MovieGrid from "@/components/movie/MovieGrid";

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
                Khám phá những bộ phim và series phim tuyệt vời
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
          <div className="flex flex-wrap -mx-16">
            {movies.map((movie) => (
              <div key={movie.id} className="w-1/2 sm:w-1/3 md:w-1/4 px-4 mb-6">
                <MovieGrid
                  movie={movie}
                  isAdmin={user?.isAdmin}
                  onEdit={handleEditMovie}
                  onDelete={handleDeleteMovie}
                />
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
