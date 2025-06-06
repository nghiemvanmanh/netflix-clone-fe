import { useState } from "react";
import { notification } from "antd";
import { Check, Plus } from "lucide-react"; // tuỳ vào icon bạn dùng
import { fetcher } from "../../utils/fetcher";
import { useNotifications } from "@/contexts/use_notification-context";
import { typeNotification } from "../../utils/enum";
import { Movie } from "../../utils/interface";

interface UseMyListHandlerProps {
  userId?: string;
  profileId?: string;
  myList: string[];
  setMyList: (list: string[]) => void;
}

export const useMyListHandler = ({
  userId,
  profileId,
  myList,
  setMyList,
}: UseMyListHandlerProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { addNotification } = useNotifications(); // Giả sử bạn có hook này để thêm thông báo
  const handleToggleMyList = async (movie: Movie) => {
    const movieId = movie.id;
    setIsLoading(true);

    const isInList = myList.includes(movieId);

    try {
      if (isInList) {
        await fetcher.delete(
          `/users/${userId}/profiles/${profileId}/my-lists/${movieId}`
        );

        notification.warning({
          message: "Đã xóa khỏi danh sách",
          description: "Phim đã được xóa khỏi danh sách của bạn.",
        });

        await addNotification(
          "Đã xóa khỏi danh sách",
          "Phim đã được xóa khỏi danh sách của bạn.",
          typeNotification.WARNING,
          movie.id,
          movie.title,
          movie.thumbnailUrl
        );

        setMyList(myList.filter((id) => id !== movieId));
      } else {
        await fetcher.post(`/users/${userId}/profiles/${profileId}/my-lists`, {
          movieId,
        });

        notification.success({
          message: "Đã thêm vào danh sách",
          description: "Phim đã được thêm vào danh sách của bạn.",
        });

        await addNotification(
          "Đã thêm vào danh sách",
          "Phim đã được thêm vào danh sách của bạn.",
          typeNotification.SUCCESS,
          movie.id,
          movie.title,
          movie.thumbnailUrl
        );

        setMyList([...myList, movieId]);
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Có lỗi xảy ra khi xử lý danh sách";

      notification.warning({
        message: "Thông báo",
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { handleToggleMyList, isLoading };
};
