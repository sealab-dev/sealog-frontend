import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { BASE_DOMAIN } from "../../constants/domain";
import { useAuthStore } from "../../store/authStore";

/**
 * API 클라이언트 생성
 */
export const client = axios.create({
  baseURL: BASE_DOMAIN,
  timeout: 5000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

/**
 * API 응답 인터셉터
 */
client.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    /**
     * 401 에러 처리 — 토큰 재발급 후 원래 요청 재시도
     */
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh") &&
      !originalRequest.url?.includes("/auth/login") &&
      !originalRequest.url?.includes("/auth/signup")
    ) {
      originalRequest._retry = true;

      try {
        await client.post("/api/auth/refresh");
        return client(originalRequest);
      } catch (refreshError) {
        const wasLoggedIn = useAuthStore.getState().isLoggedIn;
        useAuthStore.getState().logout();
        if (wasLoggedIn) {
          useAuthStore.getState().openLoginModal();
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
