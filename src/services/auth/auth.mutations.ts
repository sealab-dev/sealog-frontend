import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from './auth.api';
import { useAuthStore } from '../../store/authStore';
import type { LoginRequest } from './types/auth.request';

/**
 * 로그인 mutation
 * - onSuccess: 로그인 응답의 AuthProfile로 authStore 업데이트
 */
export const useLoginMutation = () => {
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (request: LoginRequest) => authApi.login(request),
    onSuccess: (res) => {
      setUser(res);
    },
  });
};

/**
 * 로그아웃 mutation
 * - onSettled: 성공/실패 무관하게 store 초기화 + query cache 전체 삭제
 */
export const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  const logout = useAuthStore((s) => s.logout);

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      logout();
      queryClient.clear();
    },
  });
};
