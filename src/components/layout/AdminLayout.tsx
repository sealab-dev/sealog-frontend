import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import AdminSidebar from '../../features/admin/components/AdminSidebar';
import styles from './AdminLayout.module.css';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <div className={styles.wrapper}>
      <AdminHeader />
      <div className={`${styles.container} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <AdminSidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
