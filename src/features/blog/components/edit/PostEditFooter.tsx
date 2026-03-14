import styles from './PostEditFooter.module.css';

interface PostEditFooterProps {
  onSave: () => void;
  onPublish: () => void;
  isPending: boolean;
  isEditMode: boolean;
}

export default function PostEditFooter({ onSave, onPublish, isPending, isEditMode }: PostEditFooterProps) {
  return (
    <footer className={styles.footer}>
      <div className={styles.actions}>
        <button className={styles.saveBtn} type="button" onClick={onSave} disabled={isPending}>
          임시저장
        </button>
        <button className={styles.publishBtn} type="button" onClick={onPublish} disabled={isPending}>
          {isPending ? '저장 중...' : isEditMode ? '수정 완료' : '발행하기'}
        </button>
      </div>
    </footer>
  );
}
