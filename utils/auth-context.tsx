"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { message } from "antd";
import { useRouter } from "next/navigation";
import { fetcher } from "./fetcher";

interface AuthContextType {
  isAuthenticated: boolean;
  refreshToken: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!Cookies.get("accessToken")
  );
  const router = useRouter();

  useEffect(() => {
    // Cập nhật trạng thái xác thực khi token thay đổi
    const accessToken = Cookies.get("accessToken");
    setIsAuthenticated(!!accessToken);
  }, []);

  const refreshToken = async () => {
    const refreshToken = Cookies.get("refreshToken");
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    try {
      const response = await fetcher.post("/auth/refresh", { refreshToken });
      const { accessToken } = response.data; // Chỉ lấy accessToken vì backend không trả refreshToken mới
      Cookies.set("accessToken", accessToken, {
        secure: true,
        sameSite: "strict",
      });
      setIsAuthenticated(true);
    } catch (error) {
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      setIsAuthenticated(false);
      throw error;
    }
  };

  const logout = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    setIsAuthenticated(false);
    router.push("/");
    message.success("Đăng xuất thành công");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        refreshToken,
        logout,
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

export default AuthContext;
