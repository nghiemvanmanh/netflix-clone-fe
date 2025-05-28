import axios from "axios";
import Cookies from "js-cookie";

export const fetcher = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_PREFIX}`,
  withCredentials: true,
});

fetcher.interceptors.request.use(
  (config) => {
    const token = Cookies.get("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

fetcher.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = Cookies.get("refreshToken");
        if (!refreshToken) {
          throw new Error("Không có refresh token");
        }
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_PREFIX}/auth/refresh`,
          { refreshToken },
          {
            withCredentials: true,
          }
        );
        const { accessToken } = response.data;
        Cookies.set("accessToken", accessToken);
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        return fetcher(originalRequest);
      } catch (refreshError) {
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const baseURL = `${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_PREFIX}`;
