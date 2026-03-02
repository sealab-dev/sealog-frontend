import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useMeQuery } from '@/api/user/queries';
import { useAuthStore } from '@/features/auth/stores';

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * 인증 상태 동기화 Provider
 * - 인증된 상태에서만 서버에서 유저 정보 조회
 * - 라우트 변경 시마다 유저 상태 갱신
 * - 토큰 만료 등으로 인증 실패 시 자동 로그아웃
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const location = useLocation();
  const { setUser, logout, isAuthenticated } = useAuthStore();

  // 인증된 상태에서만 me API 호출
  const { data: user, error, refetch } = useMeQuery({
    enabled: isAuthenticated,
  });

  // 라우트 변경 시 유저 정보 갱신 (인증된 경우에만)
  useEffect(() => {
    if (isAuthenticated) {
      refetch();
    }
  }, [location.pathname, isAuthenticated, refetch]);

  // 유저 정보 동기화
  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user, setUser]);

  // 인증 에러 시 로그아웃 처리 (401 등)
  useEffect(() => {
    if (error && isAuthenticated) {
      logout();
    }
  }, [error, isAuthenticated, logout]);

  return <>{children}</>;
};