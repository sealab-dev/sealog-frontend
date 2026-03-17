import { client } from '../core/client';
import type { LoginRequest } from './types/auth.request';
import type { AuthProfile } from './types/auth.response';

export const authApi = {

  /**
   * 로그인 정보
   * GET /api/auth/me
   */
  me: (): Promise<AuthProfile> => {
    return client.get('/auth/me');
  },

  /**
   * 로그인
   * POST /api/auth/login
   */
  login: (request: LoginRequest): Promise<AuthProfile> => {
    return client.post('/auth/login', request);
  },

  /**
   * 로그아웃
   * POST /api/auth/logout
   */
  logout: (): Promise<void> => {
    return client.post('/auth/logout');
  },

  /**
   * 액세스 토큰 재발급
   * POST /api/auth/refresh
   */
  refresh: (): Promise<AuthProfile> => {
    return client.post('/auth/refresh');
  },
};
