import { Outlet } from 'react-router-dom';
import LoginModal from '@/features/auth/components/LoginModal';
import { useAuthStore } from '@/store/authStore';

export default function EditorLayout() {
  const isLoginModalOpen = useAuthStore((s) => s.isLoginModalOpen);

  return (
    <>
      <Outlet />
      {isLoginModalOpen && <LoginModal />}
    </>
  );
}
