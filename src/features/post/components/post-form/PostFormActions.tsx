import styles from "./PostFormActions.module.css";

interface PostFormActionsProps {
  mode: "create" | "edit";
  isLoading: boolean;
  isDisabled?: boolean;
  onCancel: () => void;
  onPublishClick: () => void; // 발행하기 클릭 → 모달 열기
}

export const PostFormActions = ({
  mode,
  isLoading,
  isDisabled = false,
  onCancel,
  onPublishClick,
}: PostFormActionsProps) => {
  const label = mode === "create" ? "발행하기" : "수정하기";

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <button
          type="button"
          onClick={onCancel}
          className={styles.cancelButton}
          disabled={isLoading}
        >
          취소
        </button>
        <button
          type="button"
          className={styles.submitButton}
          disabled={isLoading || isDisabled}
          onClick={onPublishClick}
        >
          {isLoading ? "저장 중..." : label}
        </button>
      </div>
    </div>
  );
};
