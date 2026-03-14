import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useLogoutMutation } from '../../services/auth/auth.mutations';
import { useToast } from '../ui/toast/useToast';
import './Header.css';

export default function Header() {
  const { isLoggedIn, isAuthReady, user, openLoginModal } = useAuthStore();
  const toast = useToast();
  const logoutMutation = useLogoutMutation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    setDropdownOpen(false);
    logoutMutation.mutate(undefined, {
      onSuccess: () => toast.success('로그아웃되었습니다'),
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
    <header className="header">
      <a className="header-logo" href="/" aria-label="홈으로">
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
        </span>
      </a>

      <div className="header-actions">
        {isAuthReady && (isLoggedIn && user ? (
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
              <span className="header-user__name">{user.nickname}</span>
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
                <a className="header-dropdown__item" href={`/${user.nickname}/posts`} role="menuitem" onClick={() => setDropdownOpen(false)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                  내 글
                </a>
                <a className="header-dropdown__item" href="/write" role="menuitem" onClick={() => setDropdownOpen(false)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  글 쓰기
                </a>
                <a className="header-dropdown__item" href="/mypage" role="menuitem" onClick={() => setDropdownOpen(false)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  마이페이지
                </a>
                <div className="header-dropdown__divider" />
                <button className="header-dropdown__item header-dropdown__item--danger" type="button" role="menuitem" onClick={handleLogout}>
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
        ) : (
          <button className="header-login" type="button" onClick={openLoginModal}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            로그인
          </button>
        ))}
      </div>
    </header>
  );
}
