"use client";

import Loading from "@/components/ui/loading";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const router = useRouter();
  useEffect(() => {
    // Redirect to the login page after 2 seconds
    const timer = setTimeout(() => {
      router.push("/login");
    }, 2000);
    return () => clearTimeout(timer); // Cleanup the timer on unmount
  }, [router]);
  return <Loading />;
}
