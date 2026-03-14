import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-logo">
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
      <span className="footer-copy">
        © 2026 SeaLog.dev — 깊이 있는 개발 지식을 함께 나누는 공간
      </span>
    </footer>
  );
}
