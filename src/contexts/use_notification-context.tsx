// context/NotificationContext.tsx
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

interface NotificationContextProps {
  notifications: Notification[];
  loading: boolean;
  addNotification: (
    notification: Omit<Notification, "id" | "createdAt">
  ) => Promise<Notification>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  deleteAll: () => Promise<void>;
  notifyAddToMyList: (
    movieId: string,
    movieTitle: string,
    movieImage?: string
  ) => Promise<void>;
  notifyRemoveFromMyList: (
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

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetcher.get("/notifications");
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const addNotification = useCallback(
    async (notification: Omit<Notification, "id" | "createdAt">) => {
      const response = await fetcher.post("/notifications", notification);
      const newNotification = response.data;
      setNotifications((prev) => [newNotification, ...prev]);
      return newNotification;
    },
    []
  );

  const markAsRead = useCallback(async (id: string) => {
    await fetcher.patch(`/notifications/${id}/read`);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(async () => {
    await fetcher.patch("/notifications/read-all");
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  const deleteNotification = useCallback(async (id: string) => {
    await fetcher.delete(`/notifications/${id}`);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);
  const deleteAll = useCallback(async () => {
    await fetcher.delete("/notifications");
    setNotifications([]);
  }, []);
  // Add notification when adding to My List
  const notifyAddToMyList = useCallback(
    async (movieId: string, movieTitle: string, movieImage?: string) => {
      await addNotification({
        title: "Đã thêm vào danh sách",
        message: "Phim đã được thêm vào danh sách của bạn",
        type: typeNotification.SUCCESS,
        isRead: false,
        movieId,
        movieTitle,
        movieImage,
      });
    },
    [addNotification]
  );

  // Add notification when removing from My List
  const notifyRemoveFromMyList = useCallback(
    async (movieId: string, movieTitle: string, movieImage?: string) => {
      await addNotification({
        title: "Đã xóa khỏi danh sách",
        message: "Phim đã được xóa khỏi danh sách của bạn",
        type: typeNotification.WARNING,
        isRead: false,
        movieId,
        movieTitle,
        movieImage,
      });
    },
    [addNotification]
  );

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const value = useMemo(
    () => ({
      notifications,
      loading,
      addNotification,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      deleteAll,
      notifyAddToMyList,
      notifyRemoveFromMyList,
      fetchNotifications,
    }),
    [
      notifications,
      loading,
      addNotification,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      deleteAll,
      notifyAddToMyList,
      notifyRemoveFromMyList,
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
