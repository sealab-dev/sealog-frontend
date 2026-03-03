import { Editor } from '@/components/editor';
import { VALIDATION_LIMITS } from '@/features/post/validations/post.validation';
import styles from './PostEditorSection.module.css';

interface PostEditorSectionProps {
  content: string;
  onContentChange: (value: string) => void;
  contentError?: string | null;
  contentLengthError?: string | null;
  disabled?: boolean;
}

export const PostEditorSection = ({
  content,
  onContentChange,
  contentError,
  contentLengthError,
  disabled = false,
}: PostEditorSectionProps) => {

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.labelRow}>
          <label className={styles.label}>본문</label>
          <span className={`${styles.charCount} ${contentLengthError ? styles.charCountError : ''}`}>
            {content.length}/{VALIDATION_LIMITS.CONTENT_MAX}
          </span>
        </div>
        {contentLengthError && <span className={styles.fieldError}>{contentLengthError}</span>}
        {contentError && !contentLengthError && (
          <span className={styles.fieldError}>{contentError}</span>
        )}
      </div>

      <div className={styles.editorWrapper}>
        <Editor
          content={content}
          placeholder="마크다운 문서도 지원합니다."
          onUpdate={onContentChange}
          editable={!disabled}
        />
      </div>
    </div>
  );
};
