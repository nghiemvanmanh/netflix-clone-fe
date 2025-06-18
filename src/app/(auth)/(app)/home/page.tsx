"use client";

import { useState, useEffect } from "react";
import { fetcher } from "../../../../../utils/fetcher";
import { Movie } from "../../../../../utils/interface";
import Header from "@/components/header/header";
import MovieCard from "@/components/movie/MovieCard";
import { FeaturedMovie } from "@/components/movie/FeatureMovie";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import Loading from "@/components/ui/loading";
import { useProfile } from "@/contexts/use-profile";
import { useUser } from "@/contexts/user-provider";
import { useQueries } from "react-query";
export default function HomePage() {
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [myList, setMyList] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);
  const { user } = useUser();
  const { profile } = useProfile();
  let intervalId: NodeJS.Timeout | null = null;
  const queries = useQueries([
    {
      queryKey: ["movies"],
      queryFn: () => fetcher.get("/movies").then((res) => res.data),
      initialData: [],
      onSuccess: (data: Movie[]) => {
        if (data.length > 0) {
          const pickRandom = () =>
            setFeaturedMovie(data[Math.floor(Math.random() * data.length)]);
          pickRandom();
          intervalId = setInterval(pickRandom, 8000);
        }
        setIsClient(true);
      },
      onError: (error: any) => {
        console.error("Error fetching movies:", error);
      },
    },
    {
      queryKey: ["my-lists", user?.id, profile?.id],
      queryFn: () =>
        fetcher
          .get(`/users/${user?.id}/profiles/${profile?.id}/my-lists`)
          .then((res) => res.data),
      enabled: !!user?.id && !!profile?.id,
      initialData: [],
      onSuccess: (data: Movie[]) => {
        setMyList(data.map((item: any) => item.movie.id));
        setIsClient(true);
      },
    },
  ]);
  const movies: Movie[] = queries[0].data;
  const isLoading = queries.some((query) => query.isLoading);
  useEffect(() => {
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [intervalId]);

  if (!isClient || isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-black text-white">
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
              className="!overflow-visible"
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
              {movies.map((movie: Movie) => (
                <SwiperSlide className="hover:z-50" key={movie.id}>
                  <MovieCard
                    movie={movie}
                    isMyList={false}
                    myList={myList}
                    setMyList={setMyList}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-6">Phổ biến trên Netflop</h2>

            <Swiper
              className="!overflow-visible"
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
                .map((movie: Movie) => (
                  <SwiperSlide className=" hover:z-50" key={movie.id}>
                    <MovieCard
                      movie={movie}
                      isMyList={false}
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
