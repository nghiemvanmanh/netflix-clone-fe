"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import DirectorModal from "@/components/director/director-modal";
import Cookies from "js-cookie";
import { Director } from "../../../utils/interface";
import { fetcher } from "../../../utils/fetcher";
import Header from "@/components/header/header";
import Image from "next/image";
interface AppUser {
  id: number;
  email: string;
  isAdmin: boolean;
}

export default function DirectorsPage() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [directors, setDirectors] = useState<Director[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDirector, setEditingDirector] = useState<Director | null>(null);
  const router = useRouter();

  useEffect(() => {
    const userData = Cookies.get("user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      router.push("/login");
    }
    fetchDirectors();
  }, [router]);

  const fetchDirectors = async () => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      // TODO: Replace with real API call
      const response = await fetcher.get("/director");

      setDirectors(response.data);
    } catch (error) {
      console.error("Error fetching directors:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDirector = () => {
    setEditingDirector(null);
    setShowModal(true);
  };

  const handleEditDirector = (director: Director) => {
    setEditingDirector(director);
    setShowModal(true);
  };

  const handleDeleteDirector = async (directorId: number) => {
    if (!confirm("Are you sure you want to delete this director?")) return;

    try {
      // TODO: Replace with real API call
      await fetcher.delete(`/director/${directorId}`);

      setDirectors(directors.filter((director) => director.id !== directorId));
    } catch (error) {
      console.error("Error deleting director:", error);
    }
  };

  const handleDirectorSaved = (savedDirector: Director) => {
    if (editingDirector) {
      // Update existing director
      setDirectors(
        directors.map((director) =>
          director.id === savedDirector.id ? savedDirector : director
        )
      );
    } else {
      // Add new director
      setDirectors([...directors, { ...savedDirector }]);
    }
    setShowModal(false);
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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Directors</h1>
              <p className="text-gray-400">
                Meet the visionary directors behind your favorite content
              </p>
            </div>

            {user?.isAdmin && (
              <Button
                onClick={handleAddDirector}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Director
              </Button>
            )}
          </div>

          {/* Directors Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {directors.map((director) => (
              <div key={director.id} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-lg mb-3">
                  <Image
                    width={300}
                    height={400}
                    src={director.photoUrl || "/placeholder.svg"}
                    alt={director.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

                  {/* Admin Controls */}
                  {user?.isAdmin && (
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-8 h-8 p-0 bg-black/50 border-gray-600 hover:bg-black/70"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditDirector(director);
                          }}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-8 h-8 p-0 bg-black/50 border-gray-600 hover:bg-red-600/70"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteDirector(director.id);
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold text-lg group-hover:text-gray-300 transition-colors">
                    {director.name}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {director.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Director Modal */}
      <DirectorModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleDirectorSaved}
        director={editingDirector}
      />
    </div>
  );
}
