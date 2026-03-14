import styles from './SidebarToggleBtn.module.css';

interface Props {
  isOpen: boolean;
  onToggle: () => void;
}

export default function SidebarToggleBtn({ isOpen, onToggle }: Props) {
  return (
    <button
      type="button"
      className={styles.btn}
      onClick={onToggle}
      aria-label={isOpen ? '사이드바 닫기' : '사이드바 열기'}
      title={isOpen ? '사이드바 닫기' : '사이드바 열기'}
    >
      <span className={styles.dot} />
      <span className={styles.dot} />
      <span className={styles.dot} />
    </button>
  );
}
