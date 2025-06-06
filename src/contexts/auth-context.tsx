"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { usePathname } from "next/navigation";
import { fetcher } from "../../utils/fetcher";

const AuthContext = React.createContext<{
  isAuthenticated: boolean;
  refreshToken: () => Promise<void>;
} | null>(null);

export const AuthProvider = ({ children }: React.PropsWithChildren) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const pathname = usePathname();

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    setIsAuthenticated(!!accessToken);
  }, [pathname]); // kiểm tra lại mỗi khi đổi route

  const refreshToken = async () => {
    const refreshToken = Cookies.get("refreshToken");
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    try {
      const response = await fetcher.post("/auth/refresh", { refreshToken });
      const { accessToken } = response.data;
      Cookies.set("accessToken", accessToken);
      setIsAuthenticated(true);
    } catch (error) {
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      setIsAuthenticated(false);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
