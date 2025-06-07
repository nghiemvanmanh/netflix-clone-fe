"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ActorModal from "@/components/actor/actor-modal";
import Header from "@/components/header/header";
import PersonCard from "@/components/PersonCard";

import { useUser } from "@/contexts/user-provider";
import { Actor } from "../../../../../utils/interface";
import { fetcher } from "../../../../../utils/fetcher";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/components/ui/loading";

export default function ActorsPage() {
  const [showModal, setShowModal] = useState(false);
  const [editingActor, setEditingActor] = useState<Actor | null>(null);
  const [isClient, setIsClient] = useState(true);
  const { user } = useUser();
  const {
    data: actors,
    refetch: refetchActors,
    isLoading: loading,
  } = useQuery({
    queryKey: ["actors"],
    queryFn: () => {
      return fetcher.get("/actors").then((res) => res.data);
    },
    initialData: [],
  });
  useEffect(() => {
    setIsClient(false);
  }, []);
  const handleAddActor = () => {
    setEditingActor(null);
    setShowModal(true);
  };

  const handleEditActor = (actor: Actor) => {
    setEditingActor(actor);
    setShowModal(true);
  };

  const handleDeleteActor = async (actorId: string) => {
    if (!confirm("Are you sure you want to delete this actor?")) return;

    try {
      // TODO: Replace with real API call
      await fetcher.delete(`/actors/${actorId}`);

      refetchActors();
    } catch (error) {
      console.error("Error deleting actor:", error);
    }
  };

  const handleActorSaved = (savedActor: Actor) => {
    if (editingActor) {
      // Update existing actor
      refetchActors();
    } else {
      // Add new actor
      refetchActors();
    }
    setShowModal(false);
  };

  if (isClient || loading) {
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
              <h1 className="text-4xl font-bold mb-2">Diễn viên</h1>
              <p className="text-gray-400">
                Khám phá các diễn viên tài năng từ các chương trình và bộ phim
                yêu thích của bạn
              </p>
            </div>

            {user?.isAdmin && (
              <Button
                onClick={handleAddActor}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Thêm diễn viên
              </Button>
            )}
          </div>

          {/* Actors Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {actors.map((actor: Actor) => (
              <PersonCard
                key={actor.id}
                person={actor}
                isAdmin={user?.isAdmin}
                onEdit={handleEditActor}
                onDelete={handleDeleteActor}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Actor Modal */}
      <ActorModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleActorSaved}
        actor={editingActor}
      />
    </div>
  );
}
