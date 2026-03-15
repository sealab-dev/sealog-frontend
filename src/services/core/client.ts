import axios from "axios";
import { BASE_DOMAIN } from "../../constants/domain";
import { useAuthStore } from "../../store/authStore";
import { toast } from "../../components/ui/toast/useToast";

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
  (res) => {
    // 백엔드 공통 포맷 { success, data, message }
    const { success, data, message } = res.data;

    // 1. 성공인 경우 (success: true)
    if (success) {
      if (message) {
        toast.success(message);
      }
      return data; // 실제 데이터 알맹이만 반환
    }

    // 2. 비즈니스 로직 실패인 경우 (success: false)
    if (message) {
      toast.error(message);
    }
    return Promise.reject(res.data);
  },
  async (error) => {
    const originalRequest = error.config;

    /**
     * 401 에러 처리 — 토큰 재발급 후 원래 요청 재시도
     */
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh") &&
      !originalRequest.url?.includes("/auth/login")
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

    // 401 이외의 네트워크 에러나 서버 에러 시 메시지 토스트 표시
    if (error.response?.status !== 401) {
      const serverMessage = error.response?.data?.message;
      toast.error(serverMessage || "서버와의 통신 중 오류가 발생했습니다.");
    }

    return Promise.reject(error);
  }
);
