import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { useLoginModalStore } from '@/features/auth/stores/loginModalStore';

interface RouteGuardProps {
  children: React.ReactNode;
}

/**
 * 인증이 필요한 라우트를 보호하는 컴포넌트
 * - 미인증 시 로그인 모달 열기
 */
export const ProtectedRoute = ({ children }: RouteGuardProps) => {
  const { isAuthenticated } = useAuthStore();
  const { openLoginModal } = useLoginModalStore();

  useEffect(() => {
    if (!isAuthenticated) {
      openLoginModal();
    }
  }, [isAuthenticated, openLoginModal]);

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

/**
 * 이미 로그인한 사용자의 접근을 막는 컴포넌트
 * - 로그인/회원가입 페이지에 사용
 * - 이미 로그인된 경우 메인 페이지로 리다이렉트
 */
export const GuestRoute = ({ children }: RouteGuardProps) => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (isAuthenticated) {
    const from = (location.state as { from?: Location })?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};

/**
 * 어드민 전용 라우트를 보호하는 컴포넌트
 * - 미인증 시 로그인 모달 열기
 * - 인증됐지만 어드민이 아니면 404로 리다이렉트
 */
export const AdminRoute = ({ children }: RouteGuardProps) => {
  const { isAuthenticated, user } = useAuthStore();
  const { openLoginModal } = useLoginModalStore();

  useEffect(() => {
    if (!isAuthenticated) {
      openLoginModal();
    }
  }, [isAuthenticated, openLoginModal]);

  if (!isAuthenticated) {
    return null;
  }

  if (user?.role !== 'ADMIN') {
    return <Navigate to="/404" replace />;
  }

  return <>{children}</>;
};