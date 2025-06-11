import { removeAccentsAndSpaces } from "@/lib/constants/common";

export default function match(query: string, text: string): boolean {
  const lowerQuery = removeAccentsAndSpaces(query);
  const normalizedText = removeAccentsAndSpaces(text);

  return lowerQuery.includes(normalizedText);
}
