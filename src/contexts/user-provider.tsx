"use client";
import React, { PropsWithChildren, useEffect, useState } from "react";
import { User } from "../../utils/interface";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import parseJwt from "../../utils/token";

const UserContext = React.createContext<{
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
} | null>(null);

export const UserProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const userData = Cookies.get("accessToken");
    if (userData) {
      setUser(parseJwt(userData));
    } else {
      router.push("/login");
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = React.useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
};
