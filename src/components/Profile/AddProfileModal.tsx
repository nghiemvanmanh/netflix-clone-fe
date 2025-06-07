"use client";

import type React from "react";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { User } from "lucide-react";
import Image from "next/image";
import { fetcher } from "../../../utils/fetcher";
import { Profile } from "../../../utils/interface";
import { notification } from "antd";

interface AddProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileCreated: (profile: Profile) => void;
  userId: string;
}

const avatarOptions = [
  "/avatars/avatar1.png",
  "/avatars/avatar2.png",
  "/avatars/avatar3.png",
  "/avatars/avatar4.png",
  "/avatars/avatar5.png",
  "/avatars/avatar6.png",
];

export default function AddProfileModal({
  isOpen,
  onClose,
  onProfileCreated,
  userId,
}: AddProfileModalProps) {
  const [name, setName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [isKids, setIsKids] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);

    try {
      const response = await fetcher.post("/profiles", {
        name: name.trim(),
        avatarUrl: selectedAvatar,
        isKids,
        userId,
      });

      const newProfile = response.data;
      onProfileCreated(newProfile);
      notification.success({
        message: "Thêm hồ sơ thành công",
        description: `Hồ sơ "${newProfile.name}" đã được tạo thành công!`,
      });
      setName("");
      setSelectedAvatar(null);
      setIsKids(false);

      onClose();
    } catch (error) {
      console.error("Error creating profile:", error);
      alert("Failed to create profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black border-gray-800 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Thêm Hồ Sơ Mới
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Chọn Avatar</Label>
            <div className="grid grid-cols-3 gap-3">
              {avatarOptions.map((avatar, index) => (
                <div
                  key={index}
                  className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                    selectedAvatar === avatar
                      ? "border-red-600 ring-2 ring-red-600"
                      : "border-gray-600 hover:border-gray-400"
                  }`}
                  onClick={() => setSelectedAvatar(avatar)}
                >
                  <Image
                    src={avatar}
                    alt={`Avatar ${index + 1}`}
                    width={100}
                    height={100}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            {!selectedAvatar && (
              <div className="text-center">
                <div className="w-20 h-20 mx-auto rounded-lg bg-gray-700 flex items-center justify-center mb-2">
                  <User className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-sm text-gray-400">
                  Không có avatar được chọn
                </p>
              </div>
            )}
          </div>

          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="profileName" className="text-sm font-medium">
              Tên Hồ Sơ
            </Label>
            <Input
              id="profileName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
              placeholder="Nhập tên hồ sơ"
              maxLength={20}
              required
            />
            <p className="text-xs text-gray-400">{name.length}/20 ký tự</p>
          </div>

          {/* Kids Profile Checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isKids"
              checked={isKids}
              onCheckedChange={(checked) => setIsKids(checked as boolean)}
              className="border-gray-600 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
            />
            <Label htmlFor="isKids" className="text-sm">
              Kids Profile
            </Label>
          </div>
          <p className="text-xs text-gray-400 ml-6">
            Kids profiles chỉ hiển thị nội dung được phân loại cho độ tuổi 12
            trở xuống.
          </p>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-gray-600 text-black/80 hover:text-black hover:border-white"
              onClick={onClose}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              disabled={loading || !name.trim()}
            >
              {loading ? "Đang tạo..." : "Tạo Hồ Sơ"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
