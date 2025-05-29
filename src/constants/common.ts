export const removeAccentsAndSpaces = (str: string) =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f\s]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();
