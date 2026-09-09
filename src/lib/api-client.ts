import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { APP_CONFIG } from "./constants";

export const apiClient: AxiosInstance = axios.create({
  baseURL: APP_CONFIG.apiUrl,
  withCredentials: true, // Send HTTP-only cookies automatically
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Optionally attach Bearer token if stored in local state or fallback
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Ignore refresh loop on auth endpoints
    const isAuthEndpoint =
      originalRequest?.url?.includes("/auth/login") ||
      originalRequest?.url?.includes("/auth/refresh") ||
      originalRequest?.url?.includes("/auth/register") ||
      originalRequest?.url?.includes("/auth/me") ||
      originalRequest?.url?.includes("/auth/logout");

    if (error.response?.status === 401 && !originalRequest?._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => apiClient(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axios.post(
          `${APP_CONFIG.apiUrl}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        processQueue(null);
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        if (typeof window !== "undefined") {
          const currentPath = window.location.pathname;
          const isPublicPath =
            currentPath === "/" ||
            currentPath.startsWith("/login") ||
            currentPath.startsWith("/register") ||
            currentPath.startsWith("/forgot-password") ||
            currentPath.startsWith("/reset-password") ||
            currentPath.startsWith("/callback") ||
            currentPath === "/trending" ||
            (currentPath === "/keyboards" ||
              (currentPath.startsWith("/keyboards/") &&
                !currentPath.startsWith("/keyboards/manage") &&
                !currentPath.startsWith("/keyboards/liked")));

          if (!isPublicPath) {
            window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
          }
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
