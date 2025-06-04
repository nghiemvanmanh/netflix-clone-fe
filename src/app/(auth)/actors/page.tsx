"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";

import ActorModal from "@/components/actor/actor-modal";
import Cookies from "js-cookie";
import { fetcher } from "../../../../utils/fetcher";
import Header from "@/components/header/header";
import { Actor, User } from "../../../../utils/interface";
import PersonCard from "@/components/PersonCard";
import Loading from "@/components/ui/loading";
export default function ActorsPage() {
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingActor, setEditingActor] = useState<Actor | null>(null);
  const router = useRouter();
  const [actors, setActors] = useState<Actor[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userData = Cookies.get("user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      router.push("/login");
    }
    fetchActors();
  }, [router]);
  const fetchActors = async () => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const response = await fetcher.get("/actors");
      setActors(response.data);
    } catch (error) {
      console.error("Error fetching actors:", error);
    } finally {
      setLoading(false);
    }
  };
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

      setActors(actors.filter((actor) => actor.id !== actorId));
    } catch (error) {
      console.error("Error deleting actor:", error);
    }
  };

  const handleActorSaved = (savedActor: Actor) => {
    if (editingActor) {
      // Update existing actor
      setActors(
        actors.map((actor) => (actor.id === savedActor.id ? savedActor : actor))
      );
    } else {
      // Add new actor
      setActors([...actors, { ...savedActor, id: savedActor.id }]);
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
            {actors.map((actor) => (
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
