import { Outlet } from "react-router-dom";
import { AppHeader } from "../shared/_components/AppHeader";
import { AppFooter } from "../shared/_components/AppFooter";
import { HomeBanner } from "./_components/HomeBanner";
import styles from "./HomePostsLayout.module.css";

export const HomePostsLayout = () => {
  return (
    <div className={styles.layout}>
      <AppHeader />

      <div className={styles.banner}>
        <HomeBanner />
      </div>

      <main className={styles.main}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <AppFooter />
      </footer>
    </div>
  );
};
