import { useState, useRef } from "react";
import { VALIDATION_LIMITS } from "@/features/post/validations/post.validation";
import styles from "./PostTagSection.module.css";

interface TagSectionProps {
  tags: string[];
  fieldError: string | null;
  onTagAdd: (tag: string) => void;
  onTagRemove: (tag: string) => void;
}

export const PostTagSection = ({
  tags,
  fieldError,
  onTagAdd,
  onTagRemove,
}: TagSectionProps) => {
  const [tagInput, setTagInput] = useState("");
  const [duplicateError, setDuplicateError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const isMaxReached = tags.length >= VALIDATION_LIMITS.TAGS_MAX;

  const tryAddTag = () => {
    const trimmed = tagInput.trim();
    if (!trimmed) return;

    if (tags.includes(trimmed)) {
      setDuplicateError(`"${trimmed}"은 이미 추가된 태그입니다`);
      return;
    }
    if (isMaxReached) return;

    onTagAdd(trimmed);
    setTagInput("");
    setDuplicateError("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      tryAddTag();
    }
    // Backspace로 마지막 태그 제거
    if (e.key === "Backspace" && tagInput === "" && tags.length > 0) {
      onTagRemove(tags[tags.length - 1]);
      setDuplicateError("");
    }
    // 에러 초기화
    if (duplicateError) setDuplicateError("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
    if (duplicateError) setDuplicateError("");
  };

  const error = fieldError || duplicateError;

  return (
    <div className={styles.field}>
      <div className={styles.labelRow}>
        <label className={styles.label}>
          태그 ({tags.length}/{VALIDATION_LIMITS.TAGS_MAX})
        </label>
      </div>

      {error && <span className={styles.fieldError}>{error}</span>}

      {/* 토큰 박스 */}
      <div
        className={`${styles.tokenBox} ${error ? styles.tokenBoxError : ""}`}
        onClick={() => inputRef.current?.focus()}
      >
        {tags.map((tag) => (
          <span key={tag} className={styles.chip}>
            #{tag}
            <button
              type="button"
              className={styles.chipRemove}
              onClick={(e) => {
                e.stopPropagation();
                onTagRemove(tag);
                setDuplicateError("");
              }}
              aria-label={`${tag} 제거`}
            >
              ×
            </button>
          </span>
        ))}

        {!isMaxReached ? (
          <input
            ref={inputRef}
            type="text"
            value={tagInput}
            className={styles.searchInput}
            placeholder={
              tags.length === 0 ? "Enter로 추가, Backspace로 제거" : ""
            }
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <span className={styles.maxHint}>
            최대 {VALIDATION_LIMITS.TAGS_MAX}개
          </span>
        )}
      </div>
    </div>
  );
};
