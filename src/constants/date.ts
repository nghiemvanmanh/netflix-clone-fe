export const formatTime = (date: Date) => {
  const now = new Date();
  const correctedDate = new Date(date).getTime() + 7 * 60 * 60 * 1000; // timezone fix
  const diffInMinutes = Math.floor((now.getTime() - correctedDate) / 1000 / 60);

  if (diffInMinutes < 1) return "Vừa xong";
  if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
  if (diffInMinutes < 1440)
    return `${Math.floor(diffInMinutes / 60)} giờ trước`;
  return `${Math.floor(diffInMinutes / 1440)} ngày trước`;
};
