import { VALIDATION_LIMITS } from '@/features/post/validations/post.validation';
import styles from './PostMetaFields.module.css';

interface PostMetaFieldsProps {
  title: string;
  excerpt: string;
  onTitleChange: (value: string) => void;
  onExcerptChange: (value: string) => void;
  titleError?: string | null;
  excerptError?: string | null;
}

export const PostMetaFields = ({
  title,
  excerpt,
  onTitleChange,
  onExcerptChange,
  titleError,
  excerptError,
}: PostMetaFieldsProps) => {
  return (
    <div className={styles.container}>
      {/* 제목 */}
      <div className={styles.field}>
        <div className={styles.labelRow}>
          <label className={styles.label}>제목</label>
          <span className={styles.charCount}>
            {title.length}/{VALIDATION_LIMITS.TITLE_MAX}
          </span>
        </div>
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="제목을 입력하세요"
          className={`${styles.titleInput} ${titleError ? styles.inputError : ''}`}
          maxLength={VALIDATION_LIMITS.TITLE_MAX}
        />
        {titleError && <span className={styles.fieldError}>{titleError}</span>}
      </div>

      {/* 요약 */}
      <div className={styles.field}>
        <div className={styles.labelRow}>
          <label className={styles.label}>요약</label>
          <span className={styles.charCount}>
            {excerpt.length}/{VALIDATION_LIMITS.EXCERPT_MAX}
          </span>
        </div>
        <textarea
          value={excerpt}
          onChange={(e) => onExcerptChange(e.target.value)}
          placeholder="글을 간단히 요약해주세요 (목록에 표시됩니다)"
          className={`${styles.excerptInput} ${excerptError ? styles.inputError : ''}`}
          rows={2}
          maxLength={VALIDATION_LIMITS.EXCERPT_MAX}
        />
        {excerptError && <span className={styles.fieldError}>{excerptError}</span>}
      </div>
    </div>
  );
};
