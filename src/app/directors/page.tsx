"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import DirectorModal from "@/components/director/director-modal";
import Cookies from "js-cookie";
import { Director, User } from "../../../utils/interface";
import { fetcher } from "../../../utils/fetcher";
import Header from "@/components/header/header";
import PersonCard from "@/components/PersonCard";
import Loading from "@/components/ui/loading";
export default function DirectorsPage() {
  const [user, setUser] = useState<User | null>(null);
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
      const response = await fetcher.get("/directors");

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

  const handleDeleteDirector = async (directorId: string) => {
    if (!confirm("Are you sure you want to delete this director?")) return;

    try {
      // TODO: Replace with real API call
      await fetcher.delete(`/directors/${directorId}`);

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
    return <Loading />;
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
              <h1 className="text-4xl font-bold mb-2">Đạo diễn</h1>
              <p className="text-gray-400">
                Gặp gỡ những đạo diễn có tầm nhìn xa trông rộng đằng sau nội
                dung yêu thích của bạn
              </p>
            </div>

            {user?.isAdmin && (
              <Button
                onClick={handleAddDirector}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Thêm đạo diễn
              </Button>
            )}
          </div>

          {/* Directors Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {directors.map((director) => (
              <PersonCard
                key={director.id}
                person={director}
                isAdmin={user?.isAdmin}
                onEdit={handleEditDirector}
                onDelete={handleDeleteDirector}
              />
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
