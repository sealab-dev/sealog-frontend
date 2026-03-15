import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useLogoutMutation } from '../../services/auth/auth.mutations';
import headerStyles from './Header.module.css';
import adminStyles from './AdminHeader.module.css';

const AdminHeader = () => {
  const { user } = useAuthStore();
  const logoutMutation = useLogoutMutation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    setDropdownOpen(false);
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        window.location.href = '/';
      },
    });
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className={`${headerStyles.header} ${adminStyles.adminHeader}`}>
      <a className={headerStyles.headerLogo} href="/admin" aria-label="관리자 홈으로">
        <span className={headerStyles.headerLogoIcon}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 6v16" />
            <path d="m19 13 2-1a9 9 0 0 1-18 0l2 1" />
            <path d="M9 11h6" />
            <circle cx="12" cy="4" r="2" />
          </svg>
        </span>
        <span className={headerStyles.headerLogoText}>
          SeaLog<span className={headerStyles.headerLogoPoint}>.dev</span>
          <span className={adminStyles.adminBadge}>Admin</span>
        </span>
      </a>

      <div className={headerStyles.headerActions}>
        {user && (
          <div className={headerStyles.headerProfile} ref={dropdownRef}>
            <button
              className={headerStyles.headerProfileTrigger}
              type="button"
              onClick={() => setDropdownOpen((prev) => !prev)}
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
            >
              <span className={headerStyles.headerUserAvatar}>
                {user.profileImageUrl ? (
                  <img src={user.profileImageUrl} alt={user.nickname} />
                ) : (
                  user.nickname.charAt(0).toUpperCase()
                )}
              </span>
              <span className={headerStyles.headerUserName}>
                {user.nickname}
                <span className={adminStyles.adminUserBadge}>관리자</span>
              </span>
              <svg
                className={`${headerStyles.headerProfileChevron}${dropdownOpen ? ` ${headerStyles.headerProfileChevronOpen}` : ''}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {dropdownOpen && (
              <div className={headerStyles.headerDropdown} role="menu">
                <button 
                  className={`${headerStyles.headerDropdownItem} ${headerStyles.headerDropdownItemDanger}`} 
                  type="button" 
                  role="menuitem" 
                  onClick={handleLogout}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  로그아웃
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default AdminHeader;
