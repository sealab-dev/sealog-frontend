import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserResponse } from '@/api/user/types';

interface AuthState {
  // 상태
  user: UserResponse | null;
  isAuthenticated: boolean;

  // 액션
  setUser: (user: UserResponse) => void;
  login: (user: UserResponse) => void;
  logout: () => void;
}

/**
 * 인증 상태 관리
 * - 토큰은 HttpOnly 쿠키로 관리되므로 저장하지 않음
 * - 사용자 정보만 상태로 관리
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // 초기 상태
      user: null,
      isAuthenticated: false,

      // 사용자 정보 설정
      setUser: (user) =>
        set({
          user,
          isAuthenticated: true,
        }),

      // 로그인
      login: (user) =>
        set({
          user,
          isAuthenticated: true,
        }),

      // 로그아웃
      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);