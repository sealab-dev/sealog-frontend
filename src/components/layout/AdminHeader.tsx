import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useLogoutMutation } from '../../services/auth/auth.mutations';
import { useToast } from '../ui/toast/useToast';
import './AdminHeader.css';

export default function AdminHeader() {
  const { user } = useAuthStore();
  const toast = useToast();
  const logoutMutation = useLogoutMutation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    setDropdownOpen(false);
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success('로그아웃되었습니다');
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
    <header className="header admin-header">
      <a className="header-logo" href="/admin" aria-label="관리자 홈으로">
        <span className="header-logo__icon">
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
        <span className="header-logo__text">
          SeaLog<span className="header-logo__point">.dev</span>
          <span className="admin-badge">Admin</span>
        </span>
      </a>

      <div className="header-actions">
        {user && (
          <div className="header-profile" ref={dropdownRef}>
            <button
              className="header-profile__trigger"
              type="button"
              onClick={() => setDropdownOpen((prev) => !prev)}
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
            >
              <span className="header-user__avatar">
                {user.profileImageUrl ? (
                  <img src={user.profileImageUrl} alt={user.nickname} />
                ) : (
                  user.nickname.charAt(0).toUpperCase()
                )}
              </span>
              <span className="header-user__name">
                {user.nickname}
                <span className="admin-user-badge">관리자</span>
              </span>
              <svg
                className={`header-profile__chevron${dropdownOpen ? ' header-profile__chevron--open' : ''}`}
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
              <div className="header-dropdown" role="menu">
                <button 
                  className="header-dropdown__item header-dropdown__item--danger" 
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
}
