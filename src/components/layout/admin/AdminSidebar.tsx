import { NavLink } from 'react-router-dom';
import { Users, FileText, Layers } from 'lucide-react';
import styles from './AdminSidebar.module.css';

interface AdminSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function AdminSidebar({ isOpen, onToggle }: AdminSidebarProps) {
  const menuItems = [
    {
      path: '/admin/users',
      label: '유저 관리',
      icon: Users,
    },
    {
      path: '/admin/posts',
      label: '글 관리',
      icon: FileText,
    },
    {
      path: '/admin/stacks',
      label: '스택 관리',
      icon: Layers,
    },
  ];

  return (
    <>
      <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`} aria-label="관리자 메뉴">
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>관리자 메뉴</h3>
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
        <span className={styles.sidebarTabText}>Admin</span>
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
