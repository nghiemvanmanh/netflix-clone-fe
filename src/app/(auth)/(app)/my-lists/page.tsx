"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { fetcher } from "../../../../../utils/fetcher";
import MovieCard from "@/components/movie/MovieCard";
import { useUser } from "@/contexts/user-provider";
import { useProfile } from "@/contexts/use-profile";
import Loading from "@/components/ui/loading";
import { useQuery } from "react-query";
export default function MyListsPage() {
  const router = useRouter();
  const [myList, setMyList] = useState<string[]>([]);
  const { user } = useUser();
  const { profile } = useProfile();
  const [isClient, setIsClient] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["my-lists", user?.id, profile?.id],
    queryFn: () => {
      return fetcher
        .get(`/users/${user?.id}/profiles/${profile?.id}/my-lists`)
        .then((res) => res.data);
    },
    initialData: [],
    onSuccess: (data) => {
      setMyList(data.map((item: any) => item.movie.id));
      setIsClient(true);
    },
  });
  if (!isClient || isLoading) {
    return <Loading />;
  }
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Main Content */}
      <main className="pt-20 px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">My List</h1>
            <p className="text-gray-400">
              {data.length > 0
                ? `${data.length} movies trong danh sách của bạn`
                : "Danh sách của bạn trống. Thêm một số phim và chương trình để xem sau!"}
            </p>
          </div>

          {/* My List Content */}
          {data.length > 0 ? (
            <div className="grid grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))] gap-20">
              {data.map((movie: any) => (
                <MovieCard
                  key={movie.movie.id}
                  movie={movie.movie}
                  isMyList={true}
                  myList={myList}
                  setMyList={setMyList}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-32 h-32 bg-gray-800 rounded-full flex items-center justify-center mb-6">
                <Play className="w-16 h-16 text-gray-600" />
              </div>
              <h2 className="text-2xl font-bold mb-4">
                Danh sách của bạn trống
              </h2>
              <p className="text-gray-400 text-center max-w-md mb-8">
                Xem bộ sưu tập của chúng tôi và thêm phim, chương trình vào danh
                sách của bạn để xem sau.
              </p>
              <Button
                onClick={() => router.push("/home")}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3"
              >
                Xem bộ sưu tập
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
