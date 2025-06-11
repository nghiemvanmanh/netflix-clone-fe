import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function BackButton() {
  const router = useRouter();
  return (
    <div className="fixed top-6 left-6 z-40 mt-10">
      <Button
        variant="ghost"
        className="bg-black/50 hover:bg-white/50 text-white rounded-full w-12 h-12 p-0 cursor-pointer"
        onClick={() => router.back()}
      >
        <ArrowLeft className="w-[25px] h-[30px] sm:w-6 sm:h-6" />
      </Button>
    </div>
  );
}
