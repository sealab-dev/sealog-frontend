import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../services";
import type { LoginRequest, SignUpRequest } from "@/api/auth/types";
/**
 * service   → 어떤 URL로, 어떤 데이터를 보낼지 정의
   mutation  → 그 요청의 상태(loading, error, success)를 관리
 */
export const authKeys = {
  all: ["auth"] as const,
  user: () => [...authKeys.all, "user"] as const,
};

/**
 * 회원가입 mutation
 */
export const useSignUpMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: SignUpRequest) => authApi.signUp(request),
    onSuccess: (data) => {
      if (data.data) {
        queryClient.setQueryData(authKeys.user(), data.data);
      }
    },
  });
};

/**
 * 로그인 mutation
 */
export const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: LoginRequest) => authApi.login(request),
    onSuccess: (data) => {
      if (data.data) {
        queryClient.setQueryData(authKeys.user(), data.data);
      }
    },
  });
};

/**
 * 로그아웃 mutation
 */
export const useLogoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      queryClient.setQueryData(authKeys.user(), null);
      queryClient.removeQueries({ queryKey: authKeys.all });
    },
  });
};

/**
 * 토큰 재발급 mutation
 * - 주로 인터셉터에서 자동으로 호출됨
 */
export const useRefreshMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.refresh(),
    onSuccess: (data) => {
      if (data.data) {
        queryClient.setQueryData(authKeys.user(), data.data);
      }
    },
  });
};
