import { Github, Mail } from 'lucide-react';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerBrand}>
          <div className={styles.footerLogo}>
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
            SeaLog.dev
          </div>
          <p className={styles.footerSlogan}>
            기술의 바다에서 지식의 항해를 돕는 기술 블로그 플랫폼
          </p>
        </div>

        <div className={styles.footerSocial}>
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.socialLink}
            aria-label="GitHub"
          >
            <Github size={20} />
          </a>
          <a 
            href="mailto:contact@sealog.dev" 
            className={styles.socialLink}
            aria-label="Email"
          >
            <Mail size={20} />
          </a>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <span className={styles.footerCopy}>
          © 2026 SeaLog.dev — All rights reserved.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
