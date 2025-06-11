"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Bell, X, Check, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Notification } from "../../../utils/interface";
import { motion, AnimatePresence } from "framer-motion";
import { formatTime } from "@/lib/constants/date";

interface NotificationCenterProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDeleteNotification: (id: string) => void;
  onDeleteAll: () => void;
}

export default function NotificationCenter({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteNotification,
  onDeleteAll,
}: NotificationCenterProps) {
  const [isDeletingAll, setIsDeletingAll] = useState(false);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <Check className="w-4 h-4 text-green-500" />;
      case "info":
        return <Plus className="w-4 h-4 text-blue-500" />;
      case "warning":
        return <Bell className="w-4 h-4 text-yellow-500" />;
      case "error":
        return <X className="w-4 h-4 text-red-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  // Hàm mới xử lý xóa tất cả kèm animation
  const handleDeleteAll = () => {
    setIsDeletingAll(true);
    setTimeout(() => {
      onDeleteAll();
      setIsDeletingAll(false);
    }, 0); // Thời gian animation 300ms
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="ghost" className="relative p-2 cursor-pointer">
          <Bell className="w-5 h-5 cursor-pointer hover:text-gray-300" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 bg-red-600 text-white text-xs flex items-center justify-center rounded-full">
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className=" bg-black border border-gray-800 text-white 
        w-[250px] sm:w-96"
      >
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Thông báo</h3>
            {unreadCount > 0 && (
              <Button
                size="sm"
                onClick={onMarkAllAsRead}
                className="text-blue-400 hover:text-blue-600 text-xs cursor-pointer"
              >
                Đánh dấu tất cả đã đọc
              </Button>
            )}
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-sm text-gray-400 mt-1">
              {unreadCount} thông báo chưa đọc
            </p>
            <Button
              size="sm"
              onClick={handleDeleteAll} // Sửa ở đây dùng hàm mới
              className="text-red-400 hover:text-red-600 text-xs cursor-pointer"
            >
              Xoá tất cả
            </Button>
          </div>
        </div>

        <div
          className="max-h-96 overflow-y-auto"
          style={{
            scrollbarWidth: "none", // Firefox
            msOverflowStyle: "none", // IE 10+
          }}
        >
          <AnimatePresence>
            {!isDeletingAll && notifications.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-8 text-center text-gray-400"
              >
                <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Chưa có thông báo nào</p>
              </motion.div>
            ) : (
              !isDeletingAll &&
              notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{
                    opacity: 0,
                    y: -20,
                    height: 0,
                    margin: 0,
                    padding: 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className={`p-4 border-gray-800 transition-colors cursor-pointer ${
                    !notification.isRead ? "bg-blue-500/20" : ""
                  }`}
                  onClick={() =>
                    !notification.isRead && onMarkAsRead(notification.id)
                  }
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between ">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-white">
                            {notification.title}
                          </h4>
                          <p className="text-sm text-gray-400 mt-1">
                            {notification.message}
                          </p>
                          {notification.movieTitle && (
                            <p className="text-xs text-blue-400 mt-1">
                              "{notification.movieTitle}"
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteNotification(notification.id);
                          }}
                          className="text-gray-500 hover:text-gray-900 p-1 h-auto cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  {notification.movieImage && (
                    <div className="w-40 sm:w-72 h-full flex-shrink-0 ml-auto mr-auto mt-2">
                      <Image
                        src={notification.movieImage}
                        alt={notification.movieTitle || "Movie"}
                        width={400}
                        height={200}
                        className="object-cover rounded"
                      />
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500">
                      {formatTime(notification?.createdAt)}
                    </span>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>

          {/* Khi đang xóa tất cả thì ẩn toàn bộ list với animation */}
          <AnimatePresence>
            {isDeletingAll && (
              <motion.div
                key="delete-all"
                initial={{ opacity: 1 }}
                animate={{ opacity: 0, height: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="max-h-96 overflow-y-auto"
              />
            )}
          </AnimatePresence>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
