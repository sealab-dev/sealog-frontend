import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

const AdminRoute = () => {
  const { user, isLoggedIn, isAuthReady } = useAuthStore();

  if (!isAuthReady) {
    return null;
  }

  if (!isLoggedIn || user?.role !== "ADMIN") {
    // 관리자가 아니면 홈으로 리다이렉트
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
