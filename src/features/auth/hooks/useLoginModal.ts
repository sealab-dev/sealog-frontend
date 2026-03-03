import { useLoginMutation } from '@/api/auth/mutations';
import { getErrorMessage, getFieldErrors } from '@/api/core/api.error';
import type { LoginRequest } from '@/api/auth/types';
import { useLoginModalStore } from '../stores/loginModalStore';
import { useAuthStore } from '../stores/authStore';

export const useLoginModal = () => {
  const { closeLoginModal } = useLoginModalStore();
  const { login: setAuth } = useAuthStore();
  const mutation = useLoginMutation();

  const login = (request: LoginRequest) => {
    mutation.mutate(request, {
      onSuccess: (response) => {
        if (response.success && response.data) {
          setAuth(response.data);
          closeLoginModal();
        }
      },
    });
  };

  const clearError = () => {
    mutation.reset();
  };

  return {
    isLoading: mutation.isPending,
    error: mutation.error ? getErrorMessage(mutation.error) : null,
    fieldErrors: mutation.error ? getFieldErrors(mutation.error) : null,
    login,
    clearError,
  };
};