import { useState, useRef, useEffect } from "react";
import { VALIDATION_LIMITS } from "@/features/post/validations/post.validation";
import { useStacksForForm } from "@/features/post/hooks/stack";
import styles from "./PostStackSection.module.css";

interface StackSectionProps {
  selectedStacks: string[];
  fieldError: string | null;
  onStackAdd: (stack: string) => void;
  onStackRemove: (stack: string) => void;
}

export const PostStackSection = ({
  selectedStacks,
  fieldError,
  onStackAdd,
  onStackRemove,
}: StackSectionProps) => {
  const { groupedStacks, isLoading } = useStacksForForm();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 전체 스택 flat 배열
  const allStacks = groupedStacks ? Object.values(groupedStacks).flat() : [];

  // 검색 필터링 (이미 선택된 항목 제외)
  const filtered = allStacks.filter(
    (s) =>
      s.name.toLowerCase().includes(query.toLowerCase()) &&
      !selectedStacks.includes(s.name),
  );

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (stackName: string) => {
    if (selectedStacks.length >= VALIDATION_LIMITS.STACKS_MAX) return;
    onStackAdd(stackName);
    setQuery("");
    inputRef.current?.focus();
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Backspace로 마지막 태그 제거
    if (e.key === "Backspace" && query === "" && selectedStacks.length > 0) {
      onStackRemove(selectedStacks[selectedStacks.length - 1]);
    }
    if (e.key === "Escape") {
      setIsOpen(false);
      setQuery("");
    }
  };

  const isMaxReached = selectedStacks.length >= VALIDATION_LIMITS.STACKS_MAX;

  return (
    <div className={styles.field}>
      <div className={styles.labelRow}>
        <label className={styles.label}>
          스택 ({selectedStacks.length}/{VALIDATION_LIMITS.STACKS_MAX})
        </label>
      </div>

      {fieldError && <span className={styles.fieldError}>{fieldError}</span>}

      {/* 검색 + 선택된 태그 인풋 영역 */}
      <div ref={wrapperRef} className={styles.inputArea}>
        <div
          className={`${styles.tokenBox} ${isOpen ? styles.tokenBoxFocused : ""}`}
          onClick={() => {
            if (!isMaxReached) {
              setIsOpen(true);
              inputRef.current?.focus();
            }
          }}
        >
          {/* 선택된 스택 칩 */}
          {selectedStacks.map((stack) => (
            <span key={stack} className={styles.chip}>
              {stack}
              <button
                type="button"
                className={styles.chipRemove}
                onClick={(e) => {
                  e.stopPropagation();
                  onStackRemove(stack);
                }}
                aria-label={`${stack} 제거`}
              >
                ×
              </button>
            </span>
          ))}

          {/* 검색 인풋 */}
          {!isMaxReached && (
            <input
              ref={inputRef}
              type="text"
              value={query}
              className={styles.searchInput}
              placeholder={selectedStacks.length === 0 ? "스택 검색..." : ""}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              onKeyDown={handleInputKeyDown}
            />
          )}

          {isMaxReached && (
            <span className={styles.maxHint}>
              최대 {VALIDATION_LIMITS.STACKS_MAX}개
            </span>
          )}
        </div>

        {/* 드롭다운 */}
        {isOpen && !isMaxReached && (
          <div className={styles.dropdown}>
            {isLoading ? (
              <div className={styles.dropdownEmpty}>로딩 중...</div>
            ) : filtered.length > 0 ? (
              <ul className={styles.dropdownList}>
                {filtered.map((stack) => (
                  <li key={stack.id}>
                    <button
                      type="button"
                      className={styles.dropdownItem}
                      onMouseDown={(e) => {
                        e.preventDefault(); // blur 방지
                        handleSelect(stack.name);
                      }}
                    >
                      <span className={styles.dropdownName}>{stack.name}</span>
                      <span className={styles.dropdownGroup}>
                        {stack.stackGroup}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className={styles.dropdownEmpty}>
                {query
                  ? `"${query}"에 해당하는 스택이 없습니다`
                  : "검색어를 입력하세요"}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
