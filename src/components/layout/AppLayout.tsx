import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';
import LoginModal from '@/features/auth/components/LoginModal';
import { useAuthStore } from '@/store/authStore';

export default function AppLayout() {
  const isLoginModalOpen = useAuthStore((s) => s.isLoginModalOpen);

  return (
    <>
      <Header />
      <Outlet />
      <Footer />
      {isLoginModalOpen && <LoginModal />}
    </>
  );
}