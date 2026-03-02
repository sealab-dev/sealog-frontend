import { useRef, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Search, X } from "lucide-react";
import { useUserPostSearch } from "@/features/post/hooks/post/useUserPostSearch";
import styles from "./UserPostsFilter.module.css";

interface UserPostsFilterProps {
  totalCount: number;
}

export const UserPostsFilter = ({ totalCount }: UserPostsFilterProps) => {
  const { nickname } = useParams<{ nickname: string }>();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q");
  const inputRef = useRef<HTMLInputElement>(null);

  const { inputValue, setInputValue, handleSearch, clearSearch } =
    useUserPostSearch();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
    if (e.key === "Escape") {
      clearSearch();
      inputRef.current?.blur();
    }
  };

  // Cmd+K 단축키
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className={styles.container}>
      {/* 상단: 제목 + 글 수 */}
      <div className={styles.header}>
        <h1 className={styles.title}>{nickname}의 항해 일지</h1>
        <p className={styles.subtitle}>
          {searchQuery ? (
            <>
              <span className={styles.keyword}>"{searchQuery}"</span> 검색 결과{" "}
              <span className={styles.count}>{totalCount}</span>개
            </>
          ) : (
            <>
              총 <span className={styles.count}>{totalCount}</span>개의 글
            </>
          )}
        </p>
      </div>

      {/* 검색바 */}
      <div className={styles.searchWrapper}>
        <Search size={16} className={styles.searchIcon} />
        <input
          ref={inputRef}
          type="text"
          className={styles.searchInput}
          placeholder="글 검색..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className={styles.searchActions}>
          {inputValue && (
            <button
              type="button"
              className={styles.clearButton}
              onClick={clearSearch}
              aria-label="검색어 지우기"
            >
              <X size={14} />
            </button>
          )}
          <kbd className={styles.shortcut}>⌘K</kbd>
        </div>
      </div>
    </div>
  );
};
