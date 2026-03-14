import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (_failureCount, error: unknown) => {
        // 404는 재시도 안 함
        if ((error as { response?: { status?: number } })?.response?.status === 404) return false;
        // 나머지는 재시도 안 함
        return false;
      },
      refetchOnWindowFocus: false,
    },
  },
});