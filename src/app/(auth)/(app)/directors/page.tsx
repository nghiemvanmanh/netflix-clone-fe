"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import DirectorModal from "@/components/director/director-modal";
import { Director, User } from "../../../../../utils/interface";
import { fetcher } from "../../../../../utils/fetcher";
import Header from "@/components/header/header";
import PersonCard from "@/components/PersonCard";
import Loading from "@/components/ui/loading";
import { useUser } from "@/contexts/user-provider";
import { useQuery } from "@tanstack/react-query";
export default function DirectorsPage() {
  const [showModal, setShowModal] = useState(false);
  const [editingDirector, setEditingDirector] = useState<Director | null>(null);

  const { user } = useUser();
  const {
    data: directors,
    refetch: refetchDirectors,
    isLoading: loading,
  } = useQuery({
    queryKey: ["directors"],
    queryFn: () => {
      return fetcher.get("/directors").then((res) => res.data);
    },
    initialData: [],
  });

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

      refetchDirectors();
    } catch (error) {
      console.error("Error deleting director:", error);
    }
  };

  const handleDirectorSaved = (savedDirector: Director) => {
    if (editingDirector) {
      // Update existing director
      refetchDirectors();
    } else {
      // Add new director
      refetchDirectors();
    }
    setShowModal(false);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-black text-white">

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
            {directors.map((director: Director) => (
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
