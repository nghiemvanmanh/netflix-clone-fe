"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Bell,
  User,
  ChevronDown,
  X,
  Play,
  Plus,
  Search as SearchIcon,
} from "lucide-react";
import Cookies from "js-cookie";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Movie, Profile } from "../../../utils/interface";
import { debounce } from "@/lib/utils";
import { fetcher } from "../../../utils/fetcher";
import MovieCard from "../movie/MovieCard";
import { removeAccentsAndSpaces } from "@/constants/common";
import match from "@/helpers/match";
import parseJwt from "../../../utils/token";
import Link from "next/link";
import { MenuOutlined, CloseOutlined } from "@ant-design/icons";
import { Drawer, Menu } from "antd";
import NotificationCenter from "../notification/NotificationCenter";
import { useNotifications } from "@/contexts/use_notification-context";
export default function Header() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [myList, setMyList] = useState<string[]>([]);
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAll,
  } = useNotifications();

  useEffect(() => {
    const fetchData = async () => {
      const profileData = localStorage.getItem("selectedProfile");
      const parsedCookie = parseJwt(Cookies.get("accessToken") || "");
      const parsedProfile = profileData ? JSON.parse(profileData) : null;

      if (!profileData) {
        router.push("/profiles");
        return;
      }
      setProfile(parsedProfile);
      if (parsedCookie?.id && parsedProfile?.id) {
        const response = await fetcher.get(
          `/users/${parsedCookie.id}/profiles/${parsedProfile.id}/my-lists`
        );
        setMyList(response.data?.map((item: any) => item.movie.id));
      }
      setProfile(parsedProfile);
    };
    fetchData();
  }, [router]);

  const handleSignOut = () => {
    Cookies.remove("user");
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    localStorage.removeItem("selectedProfile");
    router.push("/login");
  };

  const handleSwitchProfile = () => {
    localStorage.removeItem("selectedProfile");
    router.push("/profiles");
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (!query.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);

      try {
        const response = await fetcher.get("/movies", {
          params: { query },
        });
        const [genresData, movieTypesData] = await Promise.all([
          fetcher.get("/genres/select").then((res) => res.data),
          fetcher.get("/movie-types/select").then((res) => res.data),
        ]);
        const results = response.data.filter((movie: Movie) => {
          const titleMatch = match(movie.title, query);
          const genreMatch = movie.genres.some((genre) =>
            match(
              genresData.find((g: any) => g.value === genre.id)?.label,
              query
            )
          );
          const movieTypeMatch = movie.movieTypes.some((type) =>
            match(
              movieTypesData.find((t: any) => t.value === type.id)?.label,
              query
            )
          );
          return titleMatch || genreMatch || movieTypeMatch;
        });

        setSearchResults(results);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsSearching(false);
      }
    }, 300),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = removeAccentsAndSpaces(e.target.value);
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const handleSearchToggle = () => {
    setShowSearch(!showSearch);
    if (showSearch) {
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setShowSearch(false);
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  const [drawerVisible, setDrawerVisible] = useState(false);

  const menuItems = [
    { key: "home", label: <Link href="/home">Trang chủ</Link> },
    { key: "tv-shows", label: <Link href="#">TV Shows</Link> },
    { key: "movies", label: <Link href="/movies">Movies</Link> },
    { key: "new-popular", label: <Link href="#">Mới & Phổ biến</Link> },
    { key: "my-lists", label: <Link href="/my-lists">Danh sách của tôi</Link> },
    { key: "actors", label: <Link href="/actors">Diễn viên</Link> },
    { key: "directors", label: <Link href="/directors">Đạo diễn</Link> },
  ];
  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-gradient-to-b from-black to-transparent">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold text-red-600">
              <a href="/home">NETFLIX</a>
            </h1>
            {/* Menu lớn (desktop) */}
            <nav className="hidden md:flex space-x-6">
              {menuItems.map(({ key, label }) => (
                <div
                  key={key}
                  className="hover:text-gray-300 transition-colors cursor-pointer"
                >
                  {label}
                </div>
              ))}
            </nav>

            {/* Nút menu nhỏ (mobile) */}
            <div className="md:hidden">
              <MenuOutlined
                className="text-white text-2xl cursor-pointer"
                onClick={() => setDrawerVisible(true)}
              />
            </div>
          </div>
          {/* Drawer menu cho mobile */}
          <Drawer
            title="Menu"
            placement="right"
            onClose={() => setDrawerVisible(false)}
            visible={drawerVisible}
            closeIcon={<CloseOutlined style={{ color: "white" }} />}
            bodyStyle={{ backgroundColor: "#000" }}
            headerStyle={{ backgroundColor: "#000", color: "white" }}
          >
            <Menu
              mode="inline"
              theme="dark"
              items={menuItems}
              onClick={() => setDrawerVisible(false)}
            />
          </Drawer>
          <div className="flex items-center space-x-4">
            <Search
              className="w-5 h-5 cursor-pointer hover:text-gray-300"
              onClick={handleSearchToggle}
            />
            <NotificationCenter
              notifications={notifications}
              onDeleteAll={deleteAll}
              onMarkAsRead={markAsRead}
              onMarkAllAsRead={markAllAsRead}
              onDeleteNotification={deleteNotification}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center space-x-2 p-0 h-auto bg-transparent border-none focus:outline-none cursor-pointer">
                  <div className="w-8 h-8 rounded overflow-hidden bg-gray-700">
                    {profile?.avatarUrl ? (
                      <Image
                        src={profile.avatarUrl || "/placeholder.svg"}
                        width={100}
                        height={100}
                        alt={profile.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-black border-gray-800 text-white z-[9999]">
                <DropdownMenuItem onClick={handleSwitchProfile}>
                  Switch Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {showSearch && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black/95 z-50 pt-20"
          onClick={handleOverlayClick}
        >
          <div
            className="max-w-7xl mx-auto px-32"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative mb-8">
              <div className="relative">
                <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                <input
                  type="text"
                  placeholder="Search for movies, TV shows, actors..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-14 pr-14 py-4 bg-gray-800 border-gray-700 text-white placeholder-gray-400 rounded-lg text-lg focus:ring-red-600 focus:border-red-600 focus:outline-none"
                  autoFocus
                />
                <button
                  onClick={handleClearSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6 cursor-pointer" />
                </button>
              </div>
            </div>

            <div className="pb-20">
              {isSearching ? (
                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 ">
                  {Array(6)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="bg-gray-700 h-48 rounded-lg mb-2"></div>
                        <div className="bg-gray-700 h-4 rounded mb-1"></div>
                        <div className="bg-gray-700 h-3 rounded w-2/3"></div>
                      </div>
                    ))}
                </div>
              ) : searchQuery && searchResults.length > 0 ? (
                <>
                  <p className="text-gray-400 mb-6">
                    Found {searchResults.length} results for "{searchQuery}"
                  </p>
                  <div
                    className="flex flex-wrap -mx-4 overflow-y-auto max-h-[70vh]"
                    style={{
                      scrollbarWidth: "none", // Firefox
                      msOverflowStyle: "none", // IE 10+
                    }}
                  >
                    {searchResults.map((movie) => (
                      <div
                        key={movie.id}
                        className="w-1/1 sm:w-1/2 md:w-1/3 px-4 mb-6 "
                      >
                        <MovieCard
                          movie={movie}
                          myList={myList}
                          setMyList={setMyList}
                        />
                      </div>
                    ))}
                  </div>
                </>
              ) : searchQuery && searchResults.length === 0 && !isSearching ? (
                <div className="text-center py-16">
                  <SearchIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    Không tìm thấy kết quả
                  </h3>
                  <p className="text-gray-400">
                    Try different keywords or browse our categories
                  </p>
                </div>
              ) : (
                <div className="text-center py-16">
                  <SearchIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Search Netflix</h3>
                  <p className="text-gray-400">
                    Find movies, TV shows, actors and more
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
