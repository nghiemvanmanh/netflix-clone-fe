"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetcher } from "../../../utils/fetcher";
import { Movie, Profile } from "../../../utils/interface";
import Header from "@/components/header/header";
import MovieCard from "@/components/movie/MovieCard";
import { FeaturedMovie } from "@/components/movie/FeatureMovie";
export default function HomePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const router = useRouter();

  useEffect(() => {
    const profileData = localStorage.getItem("selectedProfile");
    if (!profileData) {
      router.push("/profiles");
      return;
    }
    setProfile(JSON.parse(profileData));

    let intervalId: NodeJS.Timeout | null = null;

    const fetchMovies = async () => {
      try {
        const res = await fetcher.get("/movies");
        const movies = res.data;
        setMovies(movies);

        if (movies.length > 0) {
          const pickRandom = () =>
            setFeaturedMovie(movies[Math.floor(Math.random() * movies.length)]);

          pickRandom();
          intervalId = setInterval(pickRandom, 8000);
        }
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };
    fetchMovies();

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [router]);

  if (!profile) {
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

      {/* Featured Content */}
      {featuredMovie && <FeaturedMovie movie={featuredMovie} />}

      {/* Content Rows */}
      <section className="relative z-10 -mt-32 px-6 pb-20">
        <div className="space-y-12">
          <div>
            <h2 className="text-2xl font-bold mb-6">Xu hướng hiện tại</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-6">Phổ biến trên Netflix</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {movies
                .slice()
                .reverse()
                .map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
