"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AddProfileModal from "@/components/Profile/AddProfileModal";
import { fetcher } from "../../../utils/fetcher";
import Cookies from "js-cookie";

interface Profile {
  id: number;
  name: string;
  avatarUrl: string | null;
  isKids: boolean;
}

interface UserProfile {
  id: number;
  email: string;
  profiles: Profile[];
}

export default function ProfilesPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userData = Cookies.get("user");
    if (!userData) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    fetchProfiles();
  }, [router]);

  const fetchProfiles = async () => {
    try {
      const response = await fetcher.get(`/profile/getProfile`);
      setProfiles(response.data);
    } catch (error) {
      console.error("Error fetching profiles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSelect = (profile: Profile) => {
    localStorage.setItem("selectedProfile", JSON.stringify(profile));
    router.push("/home");
  };

  const handleProfileCreated = (newProfile: Profile) => {
    setProfiles([...profiles, newProfile]);
    setShowAddModal(false);
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
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Who's watching?</h1>
          <p className="text-gray-400 text-lg">Select a profile to continue</p>
        </div>

        <div className="flex justify-center">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 max-w-4xl">
            {profiles.map((profile) => (
              <div
                key={profile.id}
                className="flex flex-col items-center cursor-pointer group"
                onClick={() => handleProfileSelect(profile)}
              >
                <div className="relative mb-3">
                  <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-700 group-hover:ring-4 group-hover:ring-white transition-all duration-200">
                    {profile.avatarUrl ? (
                      <img
                        src={profile.avatarUrl || "/placeholder.svg"}
                        alt={profile.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                        {/* Placeholder for User icon */}
                      </div>
                    )}
                  </div>
                  {profile.isKids && (
                    <div className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs px-2 py-1 rounded-full font-bold">
                      KIDS
                    </div>
                  )}
                </div>
                <span className="text-lg font-medium group-hover:text-white text-gray-300 transition-colors">
                  {profile.name}
                </span>
              </div>
            ))}

            {/* Add Profile Button */}
            <div
              className="flex flex-col items-center cursor-pointer group"
              onClick={() => setShowAddModal(true)}
            >
              <div className="w-32 h-32 rounded-lg border-2 border-dashed border-gray-600 group-hover:border-white transition-colors duration-200 flex items-center justify-center mb-3">
                <Plus className="w-12 h-12 text-gray-600 group-hover:text-white transition-colors" />
              </div>
              <span className="text-lg font-medium group-hover:text-white text-gray-300 transition-colors">
                Add Profile
              </span>
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
          <Button
            variant="outline"
            className="border-gray-600 text-black hover:border-white cursor-pointer"
            onClick={() => {
              Cookies.remove("user");
              Cookies.remove("accessToken");
              Cookies.remove("refreshToken");
              router.push("/login");
            }}
          >
            Sign Out
          </Button>
        </div>
      </div>

      <AddProfileModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onProfileCreated={handleProfileCreated}
        userId={user?.id || 0}
      />
    </div>
  );
}
