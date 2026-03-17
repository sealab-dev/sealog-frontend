import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Header';
import MyPageSidebar from './MyPageSidebar';
import LoginModal from '@/features/auth/components/LoginModal';
import { useAuthStore } from '@/store/authStore';
import styles from './MyPageLayout.module.css';

const MyPageLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isLoginModalOpen = useAuthStore((s) => s.isLoginModalOpen);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <div className={styles.wrapper}>
      <Header />
      <div className={`${styles.container} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <MyPageSidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
      {isLoginModalOpen && <LoginModal />}
    </div>
  );
};

export default MyPageLayout;
