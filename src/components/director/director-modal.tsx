"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { Director } from "../../../utils/interface";
import Cookies from "js-cookie";
import { baseURL } from "../../../utils/fetcher";
interface DirectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (director: Director) => void;
  director: Director | null;
}

export default function DirectorModal({
  isOpen,
  onClose,
  onSave,
  director,
}: DirectorModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    photoUrl: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (director) {
      setFormData({
        name: director.name,
        description: director.description,
        photoUrl: director.photoUrl || "",
      });
    } else {
      setFormData({
        name: "",
        description: "",
        photoUrl: "",
      });
    }
  }, [director]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.description.trim()) return;

    setLoading(true);

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const token = Cookies.get("accessToken");
      // TODO: Replace with real API call
      const response = await fetch(
        director
          ? `${baseURL}/directors/${director.id}`
          : `${baseURL}/directors`,
        {
          method: director ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );
      const savedDirector = await response.json();

      onSave(savedDirector);
    } catch (error) {
      console.error("Error saving director:", error);
      alert("Failed to save director");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black border-gray-800 text-white max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {director ? "Edit Actor" : "Add New Actor"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Name *
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
              placeholder="Enter actor name"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description *
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 min-h-[100px]"
              placeholder="Enter actor description"
              required
            />
          </div>

          {/* Photo URL */}
          <div className="space-y-2">
            <Label htmlFor="photoUrl" className="text-sm font-medium">
              Photo URL
            </Label>
            <Input
              id="photoUrl"
              type="url"
              value={formData.photoUrl}
              onChange={(e) =>
                setFormData({ ...formData, photoUrl: e.target.value })
              }
              className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
              placeholder="https://example.com/photo.jpg"
            />
          </div>

          {/* Photo Preview */}
          {formData.photoUrl && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Photo Preview</Label>
              <div className="w-32 h-40 mx-auto rounded-lg overflow-hidden bg-gray-700">
                <Image
                  width={128}
                  height={160}
                  src={formData.photoUrl || "/placeholder.svg"}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-gray-600 text-gray-300 hover:text-white hover:border-white"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              disabled={
                loading || !formData.name.trim() || !formData.description.trim()
              }
            >
              {loading
                ? "Saving..."
                : director
                ? "Update Director"
                : "Add Director"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
