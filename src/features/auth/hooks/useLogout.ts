import { useNavigate } from 'react-router-dom';
import { getErrorMessage } from '@/api/core/api.error';
import { useLogoutMutation } from '@/api/auth/mutations';
import { useAuthStore } from '../stores';

export const useLogout = () => {
  const navigate = useNavigate();
  const { logout: clearAuth } = useAuthStore();

  const mutation = useLogoutMutation();

  const logout = () => {
    if (mutation.isPending) return;

    mutation.mutate(undefined, {
      onSuccess: () => {
        clearAuth();
        navigate('/', { replace: true });
      },
      onError: () => {
        // 에러가 나도 로컬 상태는 정리
        clearAuth();
        navigate('/', { replace: true });
      },
    });
  };

  const clearError = () => {
    mutation.reset();
  };

  return {
    isLoading: mutation.isPending,
    error: mutation.error ? getErrorMessage(mutation.error) : null,
    logout,
    clearError,
  };
};