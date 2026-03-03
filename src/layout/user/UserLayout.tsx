import { Outlet } from "react-router-dom";
import { AppHeader } from "../shared/_components/AppHeader";
import styles from "./UserLayout.module.css";

export const UserLayout = () => {
  return (
    <div className={styles.layout}>
      <AppHeader />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};
