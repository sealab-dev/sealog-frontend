import { NavLink } from 'react-router-dom';
import { User, FileText, BookOpen } from 'lucide-react';
import styles from './MyPageSidebar.module.css';

interface MyPageSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const menuItems = [
  { path: '/mypage/profile', label: '내 정보', icon: User },
  { path: '/mypage/posts', label: '내 게시글', icon: FileText },
  { path: '/mypage/series', label: '내 시리즈', icon: BookOpen },
];

export default function MyPageSidebar({ isOpen, onToggle }: MyPageSidebarProps) {
  return (
    <>
      <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`} aria-label="마이페이지 메뉴">
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>내 계정</h3>
          <ul className={styles.navList}>
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
                    }
                    onClick={() => {
                      if (window.innerWidth < 768) onToggle();
                    }}
                  >
                    <Icon size={16} className={styles.navIcon} />
                    <span className={styles.navLabel}>{item.label}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </section>
      </aside>

      {/* Sidebar Tab Button */}
      <button
        className={`${styles.sidebarTab} ${isOpen ? styles.sidebarTabOpen : ''}`}
        onClick={onToggle}
        aria-label={isOpen ? '사이드바 닫기' : '사이드바 열기'}
        aria-expanded={isOpen}
      >
        <span className={styles.sidebarTabText}>My</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div className={styles.sidebarOverlay} onClick={onToggle} aria-hidden="true" />
      )}
    </>
  );
}
