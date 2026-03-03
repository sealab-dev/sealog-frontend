import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { AppHeader } from "../shared/_components/AppHeader";
import { AppFooter } from "../shared/_components/AppFooter";
import { ProfileCard } from "./_components/ProfileCard";
import { SearchBar } from "./_components/SearchBar";
import { StackList } from "./_components/StackList";
import { ChevronLeft } from "lucide-react";
import styles from "./PostsLayout.module.css";

const STORAGE_KEY = "sidebar_collapsed";
const MOBILE_BREAKPOINT = 1024;
const isMobile = () => window.innerWidth < MOBILE_BREAKPOINT;

export const PostsLayout = () => {
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    if (isMobile()) return true;
    return localStorage.getItem(STORAGE_KEY) === "true";
  });

  const toggle = () => {
    setCollapsed((prev) => {
      const next = !prev;
      if (!isMobile()) localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  };

  const close = () => setCollapsed(true);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobile()) close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!isMobile()) return;
    document.body.style.overflow = !collapsed ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [collapsed]);

  useEffect(() => {
    const onResize = () => {
      if (isMobile()) setCollapsed(true);
      else setCollapsed(localStorage.getItem(STORAGE_KEY) === "true");
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const isOpen = !collapsed;

  return (
    <div
      className={`${styles.layout} ${isOpen ? styles.sidebarOpen : styles.sidebarClosed}`}
    >
      {/* ── 사이드바 ── */}
      <aside className={styles.aside}>
        <div className={styles.sidebarInner}>
          {/* 토글 버튼 — 사이드바 상단 우측 모서리, 열고 닫기 동일 위치 */}
          <button
            className={styles.toggleBtn}
            onClick={toggle}
            aria-label={isOpen ? "사이드바 닫기" : "사이드바 열기"}
          >
            <ChevronLeft
              size={14}
              className={isOpen ? styles.iconOpen : styles.iconClosed}
            />
          </button>

          <ProfileCard onNavigate={close} />
          <SearchBar onSearch={close} />
          <StackList onStackSelect={close} />
        </div>
      </aside>

      {/* 모바일 오버레이 */}
      {isOpen && (
        <div className={styles.overlay} onClick={close} aria-hidden="true" />
      )}

      {/* ── 메인 ── */}
      <div className={styles.mainContainer}>
        <AppHeader onMenuClick={toggle} isSidebarOpen={isOpen} />
        <main className={styles.main}>
          <Outlet />
        </main>
        <footer className={styles.footer}>
          <AppFooter />
        </footer>
      </div>
    </div>
  );
};
