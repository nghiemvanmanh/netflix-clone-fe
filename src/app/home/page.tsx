"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

import { Play, Info, ChevronDown, Plus, ThumbsUp } from "lucide-react";

import { fetcher } from "../../../utils/fetcher";
import Image from "next/image";
import { Profile } from "../../../utils/interface";
import Header from "@/components/header/header";

interface Movie {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  videoUrl: string;
  genre: string;
  year: number;
  rating: string;
}

export default function HomePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  // const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const router = useRouter();
  const featuredMovie = {
    imageUrl:
      "https://gamelade.vn/wp-content/uploads/2024/12/69146d02-242e-496d-8bf6-66626775b710_1920x1080.jpg",
    title: "Stranger Things",
    description:
      "Khi một cậu bé biến mất, thị trấn nhỏ của anh ta phát hiện ra một bí ẩn liên quan đến các thí nghiệm bí mật, những lực lượng siêu nhiên đáng sợ và một cô bé kỳ lạ.",
    year: "2022",
    rating: "16+",
    duration: "3 Seasons",
    genre: ["Kinh dị", "Khoa học viễn tưởng", "Drama"],
  };

  useEffect(() => {
    const fetchData = async () => {
      const profileData = localStorage.getItem("selectedProfile");
      if (!profileData) {
        router.push("/profiles");
        return;
      }
      const parsedProfile = JSON.parse(profileData);
      console.log({ parsedProfile });
      setProfile(parsedProfile);
      console.log({ profileData });
      try {
        const movieData = await fetcher.get("/movies/getMovies");

        setMovies(movieData.data);

        // // Ví dụ chọn ngẫu nhiên 1 movie để featured
        // if (movieData.data.length > 0) {
        //   setFeaturedMovie(movieData.data[0]); // hoặc logic chọn ngẫu nhiên
        // }
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchData();
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
      {featuredMovie && (
        <section className="relative h-screen">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${featuredMovie.imageUrl})`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

          <div className="relative z-10 flex items-center h-full px-6">
            <div className="max-w-lg">
              <h1 className="text-5xl font-bold mb-4">{featuredMovie.title}</h1>
              <p className="text-lg mb-6 text-gray-200">
                {featuredMovie.description}
              </p>
              <div className="flex items-center space-x-4 mb-6">
                <span className="bg-gray-800 px-2 py-1 rounded text-sm">
                  {featuredMovie.rating}
                </span>
                <span className="text-gray-300">{featuredMovie.year}</span>
                <span className="text-gray-300">{featuredMovie.genre}</span>
              </div>
              <div className="flex space-x-4">
                <Button className="bg-white text-black hover:bg-gray-200 px-8 py-3 text-lg font-semibold cursor-pointer">
                  <Play className="w-5 h-5 mr-2" />
                  Play
                </Button>
                <Button
                  variant="outline"
                  className="border-gray-400 text-black hover:border-white px-8 py-3 text-lg cursor-pointer"
                >
                  <Info className="w-5 h-5 mr-2" />
                  More Info
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Content Rows */}
      <section className="relative z-10 -mt-32 px-6 pb-20">
        <div className="space-y-12">
          <div>
            <h2 className="text-2xl font-bold mb-6">Trending Now</h2>
            <div className="flex space-x-4 overflow-x-auto pb-4">
              {movies.map((movie) => (
                <div
                  key={movie.id}
                  className="flex-shrink-0 w-64 cursor-pointer group"
                >
                  <div className="relative overflow-hidden rounded-lg transform group-hover:scale-110 transition-all duration-300 group-hover:z-10">
                    <Image
                      width={256}
                      height={144}
                      src={movie.imageUrl || "/placeholder.svg"}
                      alt={movie.title}
                      className="w-full h-36 object-cover"
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
                            <Plus className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-8 h-8 rounded-full border-gray-400 text-white hover:border-white p-0"
                          >
                            <ThumbsUp className="w-4 h-4" />
                          </Button>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-8 h-8 rounded-full border-gray-400 text-white hover:border-white p-0"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="text-xs text-gray-300">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="bg-gray-800 px-1 py-0.5 rounded text-xs">
                            {movie.rating}
                          </span>
                          <span>{movie.year}</span>
                        </div>
                        <div className="text-gray-400">{movie.genre}</div>
                      </div>
                    </div>
                  </div>
                  <h3 className="mt-2 font-semibold group-hover:text-gray-300 transition-colors">
                    {movie.title}
                  </h3>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-6">Popular on Netflix</h2>
            <div className="flex space-x-4 overflow-x-auto pb-4">
              {movies
                .slice()
                .reverse()
                .map((movie) => (
                  <div
                    key={movie.id}
                    className="flex-shrink-0 w-64 cursor-pointer group"
                  >
                    <div className="relative overflow-hidden rounded-lg transform group-hover:scale-110 transition-all duration-300 group-hover:z-10">
                      <Image
                        width={256}
                        height={144}
                        src={movie.imageUrl || "/placeholder.svg"}
                        alt={movie.title}
                        className="w-full h-36 object-cover"
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
                              <Plus className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-8 h-8 rounded-full border-gray-400 text-white hover:border-white p-0"
                            >
                              <ThumbsUp className="w-4 h-4" />
                            </Button>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-8 h-8 rounded-full border-gray-400 text-white hover:border-white p-0"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="text-xs text-gray-300">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="bg-gray-800 px-1 py-0.5 rounded text-xs">
                              {movie.rating}
                            </span>
                            <span>{movie.year}</span>
                          </div>
                          <div className="text-gray-400">{movie.genre}</div>
                        </div>
                      </div>
                    </div>
                    <h3 className="mt-2 font-semibold group-hover:text-gray-300 transition-colors">
                      {movie.title}
                    </h3>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
