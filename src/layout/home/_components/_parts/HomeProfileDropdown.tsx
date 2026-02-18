import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineLogout, HiOutlineUser, HiOutlinePencilAlt, HiOutlineDocumentText } from 'react-icons/hi';
import { useAuthStore } from '@/feature/auth/stores/authStore';
import { useLogout } from '@/feature/auth/hooks/useLogout';
import { FILE_DOMAIN } from '@/constants/domain';
import { DEFAULT_PROFILE_IMAGE } from '@/constants/images';
import styles from './HomeProfileDropdown.module.css';

export const HomeProfileDropdown = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { user } = useAuthStore();
  const { logout } = useLogout();

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (!user) return null;

  const profileImage = user.profileImagePath 
    ? FILE_DOMAIN + user.profileImagePath 
    : DEFAULT_PROFILE_IMAGE;

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <div className={styles.container} ref={dropdownRef}>
      {/* 프로필 버튼 */}
      <button 
        className={styles.profileButton}
        onClick={handleToggle}
        aria-label="프로필 메뉴"
      >
        <img 
          src={profileImage} 
          alt={user.nickname}
          className={styles.avatar}
        />
        <span className={styles.nickname}>{user.nickname}</span>
      </button>

      {/* 드롭다운 메뉴 */}
      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.menu}>
            <button
              className={styles.menuItem}
              onClick={() => handleNavigate(`/user/${user.nickname}/write`)}
            >
              <HiOutlinePencilAlt className={styles.menuIcon} />
              <span>글 작성</span>
            </button>

            <button
              className={styles.menuItem}
              onClick={() => handleNavigate(`/user/${user.nickname}`)}
            >
              <HiOutlineDocumentText className={styles.menuIcon} />
              <span>내 게시글</span>
            </button>

            <button
              className={styles.menuItem}
              onClick={() => handleNavigate(`/user/${user.nickname}/settings`)}
            >
              <HiOutlineUser className={styles.menuIcon} />
              <span>마이페이지</span>
            </button>

            <div className={styles.divider} />

            <button
              className={`${styles.menuItem} ${styles.logoutItem}`}
              onClick={handleLogout}
            >
              <HiOutlineLogout className={styles.menuIcon} />
              <span>로그아웃</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};