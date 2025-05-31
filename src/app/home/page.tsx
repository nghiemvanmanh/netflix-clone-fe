"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetcher } from "../../../utils/fetcher";
import { Movie, Profile, User } from "../../../utils/interface";
import Header from "@/components/header/header";
import MovieCard from "@/components/movie/MovieCard";
import { FeaturedMovie } from "@/components/movie/FeatureMovie";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";
import parseJwt from "../../../utils/token";
import Cookies from "js-cookie";
export default function HomePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [myList, setMyList] = useState<number[]>([]);

  const router = useRouter();

  useEffect(() => {
    const profileData = localStorage.getItem("selectedProfile");
    const parsedCookie = parseJwt(Cookies.get("accessToken") || "");
    const parsedProfile = profileData ? JSON.parse(profileData) : null;
    if (!profileData) {
      router.push("/profiles");
      return;
    }
    setProfile(parsedProfile);
    setUser(parsedCookie);
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

    const fetchMyList = async () => {
      if (parsedCookie?.id && parsedProfile?.id) {
        const response = await fetcher.get(
          `/users/${parsedCookie.id}/profiles/${parsedProfile.id}/my-lists`
        );
        setMyList(response.data?.map((item: any) => item.movie.id));
      }
    };
    fetchMyList();
    fetchMovies();

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

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
      {/* Search Overlay */}
      {/* Featured Content */}
      <AnimatePresence mode="wait">
        {featuredMovie && (
          <motion.div
            key={featuredMovie.id} // 👈 quan trọng để Framer biết có sự thay đổi
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
          >
            <FeaturedMovie movie={featuredMovie} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content Rows */}
      <section className="relative z-10 -mt-32 px-6 pb-20">
        <div className="space-y-12">
          <div>
            <h2 className="text-2xl font-bold mb-6">Xu hướng hiện tại</h2>

            <Swiper
              modules={[Autoplay]}
              autoplay={{
                delay: 3000, // 5 giây
                disableOnInteraction: false, // tiếp tục autoplay sau khi người dùng tương tác
                pauseOnMouseEnter: true,
              }}
              spaceBetween={10}
              slidesPerView={5}
              loop={true}
              breakpoints={{
                320: { slidesPerView: 1 },
                480: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
                1280: { slidesPerView: 5 },
              }}
            >
              {movies.map((movie) => (
                <SwiperSlide key={movie.id}>
                  <MovieCard
                    movie={movie}
                    myList={myList}
                    setMyList={setMyList}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-6">Phổ biến trên Netflix</h2>

            <Swiper
              modules={[Autoplay]}
              autoplay={{
                delay: 3000, // 3 giây
                disableOnInteraction: false, // tiếp tục autoplay sau khi người dùng tương tác
                pauseOnMouseEnter: true,
              }}
              spaceBetween={10}
              slidesPerView={5}
              loop={true}
              breakpoints={{
                320: { slidesPerView: 1 },
                480: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
                1280: { slidesPerView: 5 },
              }}
            >
              {movies
                .slice()
                .reverse()
                .map((movie) => (
                  <SwiperSlide key={movie.id}>
                    <MovieCard
                      movie={movie}
                      myList={myList}
                      setMyList={setMyList}
                    />
                  </SwiperSlide>
                ))}
            </Swiper>
          </div>
        </div>
      </section>
    </div>
  );
}
