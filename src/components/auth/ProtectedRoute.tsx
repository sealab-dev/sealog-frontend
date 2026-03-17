import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

const ProtectedRoute = () => {
  const { isLoggedIn, isAuthReady } = useAuthStore();
  const location = useLocation();

  if (!isAuthReady) {
    // 인증 준비 중일 때는 로딩 상태를 보여주거나 아무것도 렌더링하지 않습니다.
    return null; 
  }

  if (!isLoggedIn) {
    // 로그인되지 않은 경우 홈으로 리다이렉트하거나 
    // 현재 경로를 state로 전달하여 로그인 후 다시 돌아올 수 있게 할 수 있습니다.
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
