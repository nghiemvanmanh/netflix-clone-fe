"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { Movie, Profile, User } from "../../../utils/interface";
import { fetcher } from "../../../utils/fetcher";
import Header from "@/components/header/header";
import MovieCard from "@/components/movie/MovieCard";
import Cookies from "js-cookie";
export default function MyListsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [myListMovies, setMyListMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const profileData = localStorage.getItem("selectedProfile");
    const userData = Cookies.get("user");

    const parsedProfile = JSON.parse(profileData || "{}");
    const parsedUser = JSON.parse(userData || "{}");
    console.log({ parsedProfile, parsedUser });
    setProfile(parsedProfile);
    setUser(parsedUser);

    fetchMyList();
  }, [router]);

  const fetchMyList = async () => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // TODO: Replace with real API call
      const response = await fetcher.get(
        `/users/${user?.id}/profiles/${profile?.id}/my-list`
      );
      setMyListMovies(response.data);
    } catch (error) {
      console.error("Error fetching My List:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromList = async (movieId: number) => {
    try {
      // TODO: Replace with real API call
      await fetcher.delete(
        `/users/${user?.id}/profiles/${profile?.id}/my-list/${movieId}`
      );

      setMyListMovies(myListMovies.filter((movie) => movie.id !== movieId));
    } catch (error) {
      console.error("Error removing from My List:", error);
    }
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
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">My List</h1>
            <p className="text-gray-400">
              {myListMovies.length > 0
                ? `${myListMovies.length} ${
                    myListMovies.length === 1 ? "title" : "titles"
                  } in your list`
                : "Your list is empty. Add some movies and shows to watch later!"}
            </p>
          </div>

          {/* My List Content */}
          {myListMovies.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {myListMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-32 h-32 bg-gray-800 rounded-full flex items-center justify-center mb-6">
                <Play className="w-16 h-16 text-gray-600" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Your list is empty</h2>
              <p className="text-gray-400 text-center max-w-md mb-8">
                Browse our collection and add movies and shows to your list to
                watch them later.
              </p>
              <Button
                onClick={() => router.push("/home")}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3"
              >
                Browse Content
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
