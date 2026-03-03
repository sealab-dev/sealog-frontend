import { BarChart3, Users, FileText, Layers, UserPlus } from 'lucide-react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import styles from './AdminLayout.module.css';
import { FILE_DOMAIN } from '@/constants/domain';
import { DEFAULT_PROFILE_IMAGE } from '@/constants/images';
import { useAuthStore } from '@/features/auth/stores';

export const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();

  const isActive = (path: string) => location.pathname === path;

  if (!user) return null;
  const profileImage = user.profileImagePath 
    ? FILE_DOMAIN + user.profileImagePath 
    : DEFAULT_PROFILE_IMAGE;
  
  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <BarChart3 size={32} />
          <span>Admin Panel</span>
        </div>

        <nav className={styles.navMenu}>
          <button 
            className={`${styles.navItem} ${isActive('/admin/dashboard') ? styles.active : ''}`}
            onClick={() => navigate('/admin/dashboard')}
          >
            <BarChart3 size={20} />
            <span>대시보드</span>
          </button>

          <button 
            className={`${styles.navItem} ${isActive('/admin/users') ? styles.active : ''}`}
            onClick={() => navigate('/admin/users')}
          >
            <Users size={20} />
            <span>사용자 관리</span>
          </button>

          <button 
            className={`${styles.navItem} ${isActive('/admin/posts') ? styles.active : ''}`}
            onClick={() => navigate('/admin/posts')}
          >
            <FileText size={20} />
            <span>게시글 관리</span>
          </button>

          <button 
            className={`${styles.navItem} ${isActive('/admin/stacks') ? styles.active : ''}`}
            onClick={() => navigate('/admin/stacks')}
          >
            <Layers size={20} />
            <span>스택 관리</span>
          </button>

          <button 
            className={`${styles.navItem} ${isActive('/admin/create-account') ? styles.active : ''}`}
            onClick={() => navigate('/admin/create-account')}
          >
            <UserPlus size={20} />
            <span>계정 생성</span>
          </button>
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userProfile}>
            <img 
              src={profileImage} 
              alt={user.nickname}
              className={styles.avatar}
            />
            <div className={styles.userInfo}>
              <div className={styles.userName}>{user.nickname}</div>
              <div className={styles.userEmail}>{user.email}</div>
            </div>
          </div>
        </div>
      </aside>

      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  );
}