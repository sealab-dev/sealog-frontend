import styles from './UnsavedModal.module.css';

interface UnsavedChangesModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const UnsavedModal = ({
  isOpen,
  onConfirm,
  onCancel,
}: UnsavedChangesModalProps) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.iconWrapper}>
          <svg
            className={styles.icon}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className={styles.title}>저장되지 않은 변경사항</h2>
        <p className={styles.message}>
          작성 중인 내용이 저장되지 않았습니다.
          <br />
          페이지를 벗어나면 모든 변경사항이 사라집니다.
        </p>
        <div className={styles.actions}>
          <button
            type="button"
            onClick={onCancel}
            className={styles.cancelButton}
          >
            계속 작성하기
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={styles.confirmButton}
          >
            나가기
          </button>
        </div>
      </div>
    </div>
  );
};