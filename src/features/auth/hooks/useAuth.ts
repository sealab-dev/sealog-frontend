import { useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '@/api/auth/mutations';
import { useMeQuery } from '@/api/user/queries';
import { useAuthStore } from '../stores';

/**
 * 인증 상태 조회 + 로그아웃 액션
 * - 로그인/회원가입은 각각 useLogin, useSignUp 사용
 */
export const useAuth = () => {
  const navigate = useNavigate();
  const { logout: clearAuth } = useAuthStore();
  
  // Zustand에서 인증 상태 가져오기
  const { isAuthenticated, user } = useAuthStore();
  
  // 로그아웃 mutation
  const logoutMutation = useLogoutMutation();

  const logout = () => {
    logoutMutation.mutate(undefined, {
      onSettled: () => {
        // 성공/실패 상관없이 로컬 상태 정리
        clearAuth();
        navigate('/login');
      },
    });
  };

  // 유저 정보 새로고침 (필요시 사용)
  const meQuery = useMeQuery({ enabled: false });
  
  const refreshUser = async () => {
    const result = await meQuery.refetch();
    if (result.data) {
      useAuthStore.getState().setUser(result.data);
    }
  };

  return {
    isAuthenticated,
    user,
    logout,
    refreshUser,
    isLoggingOut: logoutMutation.isPending,
  };
};