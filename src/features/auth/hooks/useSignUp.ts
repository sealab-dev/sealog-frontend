import { useNavigate } from 'react-router-dom';
import { getErrorMessage, getFieldErrors } from '@/api/core/api.error';
import { useSignUpMutation } from '@/api/auth/mutations';
import type { SignUpRequest } from '@/api/auth/types';
import { useAuthStore } from '../stores';

export const useSignUp = () => {
  const navigate = useNavigate();
  const { login: setAuth } = useAuthStore();

  const mutation = useSignUpMutation();

  const signUp = (request: SignUpRequest) => {
    mutation.mutate(request, {
      onSuccess: (response) => {
        if (response.success) {
          setAuth(response.data);
          navigate('/');
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
    signUp,
    clearError,
  };
};