import { Anchor } from "lucide-react";
import styles from "./AppFooter.module.css";
import { ThemeToggle } from "@/components/ui/theme/ThemeToggle";

export const AppFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className={styles.container}>
      <div>
        <ThemeToggle />
      </div>
      <footer className={styles.footer}>
        <div className={styles.footerLogo}>
          <Anchor size={24} className={styles.footerLogoIcon} />
          <span className={styles.footerLogoText}>SeaLog.dev</span>
        </div>
        <p className={styles.footerDescription}>
          깊이 있는 개발 지식을 함께 나누는 공간
        </p>
        <p className={styles.footerCopyright}>
          © {currentYear} SeaLog.dev All rights reserved.
        </p>
      </footer>
    </div>
  );
};
