import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineLogin } from "react-icons/hi";
import { Anchor, Menu } from "lucide-react";
import { useAuthStore } from "@/features/auth/stores/authStore";
import { useLoginModalStore } from "@/features/auth/stores/loginModalStore";
import { ProfileDropdown } from "./ProfileDropdown";
import styles from "./AppHeader.module.css";

interface AppHeaderProps {
  onMenuClick?: () => void;
  isSidebarOpen?: boolean;
}

export const AppHeader = ({ onMenuClick, isSidebarOpen }: AppHeaderProps) => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isAuthenticated } = useAuthStore();
  const { openLoginModal } = useLoginModalStore();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={isSidebarOpen ? styles.sidebarOpen : ""}>
      <div className={styles.container}>
        <div
          className={`${styles.content} ${isScrolled ? styles.scrolled : ""}`}
        >
          <div className={styles.headerBg} />

          <div className={styles.leftSection}>
            <button
              className={styles.logoWrapper}
              onClick={() => navigate("/")}
              aria-label="홈으로"
            >
              <Anchor className={styles.shellIcon} />
            </button>
            <nav className={styles.nav}>
              {user && (
                <button
                  onClick={() => navigate(`/user/${user.nickname}/write`)}
                  className={styles.navButton}
                >
                  Post
                </button>
              )}
            </nav>
          </div>

          <div className={styles.rightSection}>
            {isAuthenticated ? (
              <ProfileDropdown />
            ) : (
              <button onClick={openLoginModal} className={styles.authButton}>
                <HiOutlineLogin className={styles.authIcon} />
                <span>로그인</span>
              </button>
            )}
            {/* 햄버거 — 모바일에서만, 프로필 오른쪽 */}
            {onMenuClick && (
              <button
                className={styles.mobileIcon}
                onClick={onMenuClick}
                aria-label="메뉴 열기"
              >
                <Menu size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
