import { useUserTagsAndStacks } from "@/features/post/hooks/stack/useUserTagsAndStacks";
import { BookOpen } from "lucide-react";
import styles from "./StackList.module.css";

interface StackListProps {
  onStackSelect?: () => void;
}

export const StackList = ({ onStackSelect }: StackListProps) => {
  const {
    allStacks,
    allTags,
    allcollection,
    currentStack,
    currentTag,
    currentcollection,
    isLoading,
    handleStackClick,
    handleTagClick,
    handlecollectionClick,
  } = useUserTagsAndStacks();

  const handleStack = (name: string) => {
    handleStackClick(name);
    onStackSelect?.();
  };

  const handleTag = (tag: string) => {
    handleTagClick(tag);
    onStackSelect?.();
  };

  const handlecollection = (name: string) => {
    handlecollectionClick(name);
    onStackSelect?.();
  };

  if (isLoading) {
    return <div className={styles.loading} />;
  }

  const hasStacks = allStacks.length > 0;
  const hasTags = allTags.length > 0;
  // TODO: [컬렉션 API 연결] 백엔드에서 PostItemResponse에 collectionName을 내려주면 자동으로 표시됨
  const hascollection = allcollection.length > 0;

  if (!hasStacks && !hasTags && !hascollection) {
    return (
      <div className={styles.empty}>
        <p>스택·태그가 없습니다</p>
      </div>
    );
  }

  return (
    <nav className={styles.nav}>
      {/* ── 컬렉션 ──
          TODO: [컬렉션 API 연결] 백엔드에서 PostItemResponse에 collectionName 필드 추가 시 자동으로 표시됨
          현재는 hasCollection = false 이므로 이 섹션이 렌더링되지 않음 */}
      {hascollection && (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>컬렉션</h3>
          <ul className={styles.list}>
            {allcollection.map((s) => (
              <li key={s.name}>
                <button
                  type="button"
                  className={`${styles.item} ${currentcollection === s.name ? styles.itemActive : ""}`}
                  onClick={() => handlecollection(s.name)}
                >
                  <span className={styles.collectionItemInner}>
                    <BookOpen size={13} className={styles.collectionIcon} />
                    <span className={styles.itemName}>{s.name}</span>
                  </span>
                  <span className={styles.itemCount}>{s.count}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── 스택 ── */}
      {hasStacks && (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>스택</h3>
          <ul className={styles.list}>
            {allStacks.map((stack) => (
              <li key={stack.id}>
                <button
                  type="button"
                  className={`${styles.item} ${currentStack === stack.name ? styles.itemActive : ""}`}
                  onClick={() => handleStack(stack.name)}
                >
                  <span className={styles.itemName}>{stack.name}</span>
                  <span className={styles.itemCount}>{stack.postCount}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── 태그 ── */}
      {hasTags && (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>태그</h3>
          <ul className={styles.list}>
            {allTags.map(({ tag, count }) => (
              <li key={tag}>
                <button
                  type="button"
                  className={`${styles.item} ${currentTag === tag ? styles.itemActive : ""}`}
                  onClick={() => handleTag(tag)}
                >
                  <span className={styles.itemName}>#{tag}</span>
                  <span className={styles.itemCount}>{count}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </nav>
  );
};
