export const removeAccentsAndSpaces = (str: string) =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f\s]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();

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

export const SUBPLAN_OPTIONS: any = [
  {
    value: "basic",
    label: "Cơ bản",
  },
  {
    value: "standard",
    label: "Tiêu chuẩn",
  },
  {
    value: "premium",
    label: "Cao cấp",
  },
];
