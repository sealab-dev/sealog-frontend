import { apiClient } from "@/api/core/apiClient";
import type { ApiResponse } from "@/api/core/api.response";
import type { UserResponse } from "@/api/user/types";
import type { LoginRequest, SignUpRequest } from "../types";

/**
 * service   → 어떤 URL로, 어떤 데이터를 보낼지 정의
   mutation  → 그 요청의 상태(loading, error, success)를 관리
 */
export const authApi = {
  /**
   * 로그인
   * - 성공 시 쿠키에 토큰 자동 저장
   */
  login: async (request: LoginRequest): Promise<ApiResponse<UserResponse>> => {
    const response = await apiClient.post<ApiResponse<UserResponse>>(
      "/auth/login",
      request,
    );
    return response.data;
  },

  /**
   * 로그아웃
   * - 쿠키에서 토큰 삭제
   */
  logout: async (): Promise<ApiResponse<void>> => {
    const response = await apiClient.post<ApiResponse<void>>("/auth/logout");
    return response.data;
  },

  /**
   * 토큰 재발급
   * - 쿠키의 Refresh Token으로 자동 처리
   */
  refresh: async (): Promise<ApiResponse<UserResponse>> => {
    const response =
      await apiClient.post<ApiResponse<UserResponse>>("/auth/refresh");
    return response.data;
  },

  // =========== 어드민 =============

  /**
   * 회원가입
   * - 성공 시 쿠키에 토큰 자동 저장
   */
  signUp: async (
    request: SignUpRequest,
  ): Promise<ApiResponse<UserResponse>> => {
    const response = await apiClient.post<ApiResponse<UserResponse>>(
      "/admin/auth/signup",
      request,
    );
    return response.data;
  },
};
