"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import { Movie, Profile } from "../../../../utils/interface";
import { fetcher } from "../../../../utils/fetcher";
import VideoPlayer from "@/components/movie/video-player";
import Header from "@/components/header/header";

export default function MovieDetailPage() {
  const router = useRouter();
  const params = useParams();
  const movieId = params.id as number | string;

  const [movie, setMovie] = useState<Movie | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const profileData = localStorage.getItem("selectedProfile");
    if (!profileData) {
      router.push("/profiles");
      return;
    }
    const fetchMovieDetails = async () => {
      try {
        const response = await fetcher.get(`/movies/${movieId}`);
        console.log({ response });
        setMovie(response.data);

        // // Get similar movies (same genre)
        // const similar = response.data
        //   .filter(
        //     (m: any) =>
        //       m.id !== response.data.id && m.genre === response.data.genre
        //   )
        //   .slice(0, 6);
        // setSimilarMovies(similar);
      } catch (error) {
        console.error("Error fetching movie details:", error);
        router.push("/home");
      } finally {
        setLoading(false);
      }
    };
    const parsedProfile = JSON.parse(profileData);
    setProfile(parsedProfile);

    fetchMovieDetails();
  }, [movieId, router]);

  const handlePlay = () => {
    setShowVideoPlayer(true);
  };

  const handleCloseVideo = () => {
    setShowVideoPlayer(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Movie not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      {/* Video Player Modal */}
      {showVideoPlayer && (
        <VideoPlayer
          videoUrl="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          title={movie.title}
          onClose={handleCloseVideo}
        />
      )}

      {/* Back Button */}
      <div className="fixed top-6 left-6 z-40 mt-10">
        <Button
          variant="ghost"
          className="bg-black/50 text-white rounded-full w-12 h-12 p-0 cursor-pointer"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
      </div>

      {/* Hero Section */}
      <section className="relative h-screen">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${movie.thumbnailUrl || "/placeholder.svg"})`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

        <div className="relative z-10 flex items-end h-full px-6 pb-32">
          <div className="max-w-2xl">
            <h1 className="text-6xl font-bold mb-4">{movie.title}</h1>

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
                HD
              </span>
            </div>
            <div className="flex items-center space-x-4 mb-6">
              <span className="bg-gray-800 px-3 py-1 rounded-full text-sm">
                {movie.movieTypes.map((m) => m.name).join(", ")}
              </span>
            </div>
            <div className="flex items-center space-x-4 mb-6">
              <span className="bg-red-600 px-3 py-1 rounded-full text-sm">
                {movie.genres.map((genre) => genre.name).join(", ")}
              </span>
            </div>

            <p className="text-lg mb-8 text-gray-200 leading-relaxed max-w-xl">
              {movie.description}
            </p>

            <div className="flex space-x-4 mb-8">
              <Button
                className="bg-white text-black hover:bg-gray-200 px-8 py-3 text-lg font-semibold"
                onClick={handlePlay}
              >
                <Play className="w-6 h-6 mr-2" />
                Play
              </Button>
              <Button
                variant="outline"
                className="border-gray-400 text-black hover:border-white px-8 py-3 text-lg"
              >
                <Plus className="w-6 h-6 mr-2" />
                My List
              </Button>
              <Button
                variant="outline"
                className="border-gray-400 text-black hover:border-white px-4 py-3"
              >
                <ThumbsUp className="w-6 h-6" />
              </Button>
              <Button
                variant="outline"
                className="border-gray-400 text-black hover:border-white px-4 py-3"
              >
                <ThumbsDown className="w-6 h-6" />
              </Button>
              <Button
                variant="outline"
                className="border-gray-400 text-black hover:border-white px-4 py-3"
              >
                <Share className="w-6 h-6" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="bg-red-600 px-3 py-1 rounded-full text-sm">
                Sci-Fi
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Details Section */}
      <section className="relative z-10 -mt-32 px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-gray-900 rounded-lg p-8 mb-8">
                <h2 className="text-2xl font-bold mb-6">About {movie.title}</h2>

                <div className="space-y-4">
                  <div>
                    <span className="text-gray-400 font-medium">
                      Director:{" "}
                    </span>
                    <span className="text-white">
                      {movie.directors
                        .map((director) => director.name)
                        .join(", ")}
                    </span>
                  </div>

                  <div>
                    <span className="text-gray-400 font-medium">Actor: </span>
                    <span className="text-white">
                      {movie.actors.map((actor) => actor.name).join(", ")}
                    </span>
                  </div>

                  <div>
                    <span className="text-gray-400 font-medium">Genre: </span>
                    <span className="text-white">
                      {movie.genres.map((genre) => genre.name).join(", ")}
                    </span>
                  </div>

                  <div>
                    <span className="text-gray-400 font-medium">
                      Release Year:{" "}
                    </span>
                    <span className="text-white">
                      {new Date(movie.releaseDate).getFullYear()}
                    </span>
                  </div>

                  <div>
                    <span className="text-gray-400 font-medium">
                      Duration:{" "}
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
              <div className="bg-gray-900 rounded-lg p-6 mb-8">
                <h3 className="text-xl font-bold mb-4">More Like This</h3>
                <div className="space-y-4">
                  {similarMovies.map((similarMovie) => (
                    <div
                      key={similarMovie.id}
                      className="flex space-x-3 cursor-pointer hover:bg-gray-800 p-2 rounded"
                      onClick={() => router.push(`/movies/${similarMovie.id}`)}
                    >
                      <img
                        src={similarMovie.thumbnailUrl || "/placeholder.svg"}
                        alt={similarMovie.title}
                        className="w-24 h-36 object-cover rounded"
                      />
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
              </div>

              <div className="bg-gray-900 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">Details</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-400">Audio:</span>
                    <span className="text-white ml-2">English, Vietnamese</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Subtitles:</span>
                    <span className="text-white ml-2">English, Vietnamese</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Quality:</span>
                    <span className="text-white ml-2">4K Ultra HD, HDR</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
