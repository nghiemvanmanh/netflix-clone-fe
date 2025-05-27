import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Bell, User, ChevronDown } from "lucide-react";
import Cookies from "js-cookie";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Profile } from "../../../utils/interface";
export default function Header() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const profileData = localStorage.getItem("selectedProfile");
      if (!profileData) {
        router.push("/profiles");
        return;
      }
      const parsedProfile = JSON.parse(profileData);
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
  return (
    <header className="fixed top-0 w-full z-50 bg-gradient-to-b from-black to-transparent">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-8">
          <h1 className="text-2xl font-bold text-red-600">NETFLIX</h1>
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="hover:text-gray-300 transition-colors">
              Home
            </a>
            <a href="#" className="hover:text-gray-300 transition-colors">
              TV Shows
            </a>
            <a href="#" className="hover:text-gray-300 transition-colors">
              Movies
            </a>
            <a href="#" className="hover:text-gray-300 transition-colors">
              New & Popular
            </a>
            <a href="#" className="hover:text-gray-300 transition-colors">
              My List
            </a>
            <a href="/actors" className="hover:text-gray-300 transition-colors">
              Actors
            </a>
            <a
              href="/directors"
              className="hover:text-gray-300 transition-colors"
            >
              Directors
            </a>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <Search className="w-5 h-5 cursor-pointer hover:text-gray-300" />
          <Bell className="w-5 h-5 cursor-pointer hover:text-gray-300" />
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
  );
}
