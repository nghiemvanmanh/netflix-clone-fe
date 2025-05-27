"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { message } from "antd";
import { useRouter } from "next/navigation";
import { fetcher } from "./fetcher";

interface Permission {
  resource: string;
  scope: string;
  hasAccess: boolean;
}

interface AuthContextType {
  isAuthenticated: boolean;
  permissions: Permission[];
  checkPermission: (resource: string, scope: string) => Promise<boolean>;
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
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Cập nhật trạng thái xác thực khi token thay đổi
    const accessToken = Cookies.get("accessToken");
    setIsAuthenticated(!!accessToken);
  }, []);

  const checkPermission = async (
    resource: string,
    scope: string
  ): Promise<boolean> => {
    if (!isAuthenticated) {
      return false;
    }

    // Kiểm tra quyền đã cache
    const existing = permissions.find(
      (p) => p.resource === resource && p.scope === scope
    );
    if (existing) {
      return existing.hasAccess;
    }

    try {
      const response = await fetcher.post(`/auth/${resource}/${scope}`, {});
      const hasAccess = response.data.message.includes("has access");
      setPermissions((prev) => [...prev, { resource, scope, hasAccess }]);
      return hasAccess;
    } catch (error: any) {
      if (error.response?.status === 401) {
        // Token hết hạn, thử làm mới
        try {
          await refreshToken();
          return checkPermission(resource, scope); // Thử lại
        } catch {
          setIsAuthenticated(false);
          Cookies.remove("accessToken");
          Cookies.remove("refreshToken");
          router.push("/");
          message.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại");
          return false;
        }
      }
      return false;
    }
  };

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
    setPermissions([]);
    router.push("/");
    message.success("Đăng xuất thành công");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        permissions,
        checkPermission,
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
