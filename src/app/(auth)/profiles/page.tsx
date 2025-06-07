"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

import AddProfileModal from "@/components/Profile/AddProfileModal";
import { fetcher } from "../../../../utils/fetcher";
import Cookies from "js-cookie";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Plus, Trash2, AlertTriangle, User } from "lucide-react";
import { notification } from "antd";
import { Profile } from "../../../../utils/interface";
import Loading from "@/components/ui/loading";
import { useUser } from "@/contexts/user-provider";
import { useQuery } from "@tanstack/react-query";
import { handleSignOut } from "@/helpers/logout";

export default function ProfilesPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const router = useRouter();
  const { user } = useUser();
  const [deleteConfirm, setDeleteConfirm] = useState<{
    show: boolean;
    profile: Profile | null;
  }>({
    show: false,
    profile: null,
  });
  const [deletingProfileId, setDeletingProfileId] = useState<string | null>(
    null
  );

  const {
    data: profiles,
    refetch: refetchProfiles,
    isLoading: loading,
  } = useQuery({
    queryKey: ["profiles"],
    queryFn: () => {
      return fetcher.get(`/profiles`).then((res) => res.data);
    },
    initialData: [],
  });

  const handleDeleteProfile = (profile: Profile, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteConfirm({ show: true, profile });
  };
  const confirmDeleteProfile = async () => {
    if (!deleteConfirm.profile) return;

    setDeletingProfileId(deleteConfirm.profile.id);

    try {
      await fetcher.delete(`/profiles/${deleteConfirm.profile.id}`);

      refetchProfiles();

      notification.success({
        message: "Xóa hồ sơ",
        description: `Hồ sơ "${deleteConfirm.profile.name}" đã được xóa thành công!`,
      });
    } catch (error) {
      console.error("Error deleting profile:", error);
      notification.error({
        message: "Xóa hồ sơ thất bại",
        description: "Vui lòng thử lại sau.",
      });
    } finally {
      setDeletingProfileId(null);
      setDeleteConfirm({ show: false, profile: null });
    }
  };
  const handleProfileSelect = (profile: Profile) => {
    const { id, name, avatarUrl, isKids } = profile;
    Cookies.set(
      "selectedProfile",
      JSON.stringify({ id, name, avatarUrl, isKids })
    );
    router.push("/home");
  };

  const handleProfileCreated = () => {
    refetchProfiles();
    setShowAddModal(false);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Ai đang xem?</h1>
          <p className="text-gray-400 text-lg">Chọn một hồ sơ để tiếp tục</p>
        </div>

        <div className="flex justify-center">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 max-w-4xl">
            {profiles.map((profile: Profile) => (
              <div
                key={profile.id}
                className="flex flex-col items-center cursor-pointer group"
                onClick={() => handleProfileSelect(profile)}
              >
                <div
                  className={`relative mb-3 ${
                    deletingProfileId === profile.id ? "animate-pulse" : ""
                  }`}
                >
                  <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-700 group-hover:ring-4 group-hover:ring-white transition-all duration-200">
                    {profile.avatarUrl ? (
                      <img
                        src={profile.avatarUrl || "/placeholder.svg"}
                        alt={profile.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                        <User className="w-20 h-20 text-white" />
                      </div>
                    )}
                  </div>
                  {/* Delete Button */}
                  {profiles.length > 1 && (
                    <button
                      onClick={(e) => handleDeleteProfile(profile, e)}
                      disabled={deletingProfileId === profile.id}
                      className="z-10 absolute -top-2 -right-2 w-8 h-8 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 transform hover:scale-110 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Delete Profile"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
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
                Thêm Hồ Sơ
              </span>
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
          <Button
            variant="outline"
            className="border-gray-600 text-black hover:border-white cursor-pointer"
            onClick={() => {
              handleSignOut(Cookies, router);
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
        userId={user?.id || ""}
      />
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirm.show}
        onOpenChange={(open) =>
          !open && setDeleteConfirm({ show: false, profile: null })
        }
      >
        <DialogContent className="bg-black border-gray-800 text-white max-w-md">
          <DialogHeader>
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-12 h-12 bg-red-600/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-red-500">
                  Xóa Profile
                </DialogTitle>
                <DialogDescription className="text-gray-400">
                  Hành động này sẽ không thể hoàn tác
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-gray-300">
              Bạn có chắc muốn xóa hồ sơ {deleteConfirm.profile?.name}? Tất cả
              lịch sử xem và sở thích sẽ bị mất vĩnh viễn.
            </p>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                className="flex-1 border-gray-600 text-black/80 hover:text-black hover:border-white"
                onClick={() => setDeleteConfirm({ show: false, profile: null })}
                disabled={deletingProfileId !== null}
              >
                Hủy
              </Button>
              <Button
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                onClick={confirmDeleteProfile}
                disabled={deletingProfileId !== null}
              >
                {deletingProfileId === deleteConfirm.profile?.id ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Đang xóa...</span>
                  </div>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Xóa hồ sơ
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
