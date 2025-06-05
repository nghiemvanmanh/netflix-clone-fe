"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import { typeNotification } from "../../utils/enum";
import { fetcher } from "../../utils/fetcher";
import { Notification } from "../../utils/interface";
import { useProfile } from "./use-profile";

interface NotificationContextProps {
  notifications: Notification[];
  loading: boolean;
  handleAddNotification: (
    notification: Omit<Notification, "id" | "createdAt">
  ) => Promise<Notification>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  deleteAll: () => Promise<void>;
  addNotification: (
    title: string,
    message: string,
    type: typeNotification,
    movieId: string,
    movieTitle: string,
    movieImage?: string
  ) => Promise<void>;
  fetchNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(
  undefined
);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useProfile();
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetcher.get("/notifications", {
        params: { profileId: profile?.id },
      });
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  }, [profile]);

  const handleAddNotification = useCallback(
    async (notification: Omit<Notification, "id" | "createdAt">) => {
      const response = await fetcher.post("/notifications", {
        ...notification,
        profileId: profile?.id,
      });
      const newNotification = response.data;
      setNotifications((prev) => [newNotification, ...prev]);
      return newNotification;
    },
    [profile]
  );

  const markAsRead = useCallback(
    async (id: string) => {
      await fetcher.patch(`/notifications/${id}/read`, {
        params: { profileId: profile?.id },
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    },
    [profile]
  );

  const markAllAsRead = useCallback(async () => {
    await fetcher.patch("/notifications/read-all", {
      profileId: profile?.id,
    });
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, [profile]);

  const deleteNotification = useCallback(
    async (id: string) => {
      await fetcher.delete(`/notifications/${id}`, {
        params: { profileId: profile?.id },
      });
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    },
    [profile]
  );

  const deleteAll = useCallback(async () => {
    await fetcher.delete("/notifications", {
      params: { profileId: profile?.id },
    });
    setNotifications([]);
  }, [profile]);
  // Add notification when adding to My List
  const addNotification = useCallback(
    async (
      title: string,
      message: string,
      type: typeNotification,
      movieId: string,
      movieTitle: string,
      movieImage?: string
    ) => {
      await handleAddNotification({
        title,
        message,
        type,
        isRead: false,
        movieId,
        movieTitle,
        movieImage,
      });
    },
    [handleAddNotification]
  );

  useEffect(() => {
    if (profile?.id) {
      fetchNotifications();
    }
  }, [fetchNotifications]);

  const value = useMemo(
    () => ({
      notifications,
      loading,
      handleAddNotification,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      deleteAll,
      addNotification,
      fetchNotifications,
    }),
    [
      notifications,
      loading,
      handleAddNotification,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      deleteAll,
      addNotification,
      fetchNotifications,
    ]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};
