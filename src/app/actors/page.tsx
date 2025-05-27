"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";

import ActorModal from "@/components/actor/actor-modal";
import Cookies from "js-cookie";
import { fetcher } from "../../../utils/fetcher";
import Header from "@/components/header/header";
import { Actor } from "../../../utils/interface";
import Image from "next/image";

interface AppUser {
  id: number;
  email: string;
  isAdmin: boolean;
}

export default function ActorsPage() {
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingActor, setEditingActor] = useState<Actor | null>(null);
  const router = useRouter();
  const [actors, setActors] = useState<Actor[]>([]);
  const [user, setUser] = useState<AppUser | null>(null);

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

      const response = await fetcher.get("/actor");
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

  const handleDeleteActor = async (actorId: number) => {
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
      setActors([...actors, { ...savedActor, id: Date.now() }]);
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
              <h1 className="text-4xl font-bold mb-2">Actors</h1>
              <p className="text-gray-400">
                Discover talented actors from your favorite shows and movies
              </p>
            </div>

            {user?.isAdmin && (
              <Button
                onClick={handleAddActor}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Actor
              </Button>
            )}
          </div>

          {/* Actors Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {actors.map((actor) => (
              <div key={actor.id} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-lg mb-3">
                  <Image
                    src={actor.photoUrl || "/placeholder.svg"}
                    alt={actor.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    width={256}
                    height={256}
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
                            handleEditActor(actor);
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
                            handleDeleteActor(actor.id);
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
                    {actor.name}
                  </h3>
                  <p className="text-gray-400 text-sm">{actor.description}</p>
                </div>
              </div>
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
