import { client } from '../core/client';
import type { ApiResponse } from '../core/client.types';
import type { AuthProfile, LoginRequest } from './auth.types';

export const authApi = {

  /**
   * 로그인 정보
   * POST /api/auth/me
   */
  me: async (): Promise<ApiResponse<AuthProfile>> => {
    const res = await client.get<ApiResponse<AuthProfile>>('/auth/me');
    return res.data;
  },

  /**
   * 로그인
   * POST /api/auth/login
   */
  login: async (request: LoginRequest): Promise<ApiResponse<AuthProfile>> => {
    const res = await client.post<ApiResponse<AuthProfile>>('/auth/login', request);
    return res.data;
  },

  /**
   * 로그아웃
   * POST /api/auth/logout
   */
  logout: async (): Promise<void> => {
    await client.post('/auth/logout');
  },

  /**
   * 회원가입
   * POST /api/auth/signup
   */
  signup: async (request: any): Promise<ApiResponse<AuthProfile>> => {
    const res = await client.post<ApiResponse<AuthProfile>>('/auth/signup', request);
    return res.data;
  },

  /**
   * 액세스 토큰 재발급
   * POST /api/auth/refresh
   */
  refresh: async (): Promise<ApiResponse<AuthProfile>> => {
    const res = await client.post<ApiResponse<AuthProfile>>('/auth/refresh');
    return res.data;
  },
};
