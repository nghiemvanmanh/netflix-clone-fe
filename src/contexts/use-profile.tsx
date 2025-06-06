// context/ProfileContext.tsx
"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  PropsWithChildren,
} from "react";
import { Profile } from "../../utils/interface";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
const ProfileContext = createContext<{
  profile: Profile | null;
  setProfile: React.Dispatch<React.SetStateAction<Profile | null>>;
} | null>(null);

export const ProfileProvider = ({ children }: PropsWithChildren) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const router = useRouter();
  useEffect(() => {
    const stored = Cookies.get("selectedProfile");
    if (stored) {
      setProfile(JSON.parse(stored));
    }
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};
