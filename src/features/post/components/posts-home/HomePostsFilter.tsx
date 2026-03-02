import styles from "./HomePostsFilter.module.css";

export type HomeTab = "POST" | "COLLECTION" | "ABOUT";

const HOME_TABS: { value: HomeTab; label: string }[] = [
  { value: "POST", label: "글" },
  { value: "COLLECTION", label: "컬렉션" },
  { value: "ABOUT", label: "소개" },
];

interface HomePostsFilterProps {
  currentTab: HomeTab;
  totalCount?: number;
  onTabClick: (tab: HomeTab) => void;
}

export const HomePostsFilter = ({
  currentTab,
  totalCount,
  onTabClick,
}: HomePostsFilterProps) => (
  <div className={styles.filterContainer}>
    {/* 타이틀 */}
    <div className={styles.titleWrapper}>
      <div className={styles.titleContent}>
        <h1 className={styles.title}>선원들의 항해 일지</h1>
        {currentTab !== "ABOUT" && totalCount !== undefined && (
          <p className={styles.subtitle}>
            깊은 바다처럼 깊이 있는{" "}
            <span className={styles.count}>{totalCount}</span>개의 개발 이야기
          </p>
        )}
      </div>
    </div>

    {/* 탭 */}
    <nav className={styles.categoryNav}>
      <div className={styles.categoryTabs}>
        {HOME_TABS.map((tab) => (
          <button
            key={tab.value}
            className={`${styles.categoryTab} ${currentTab === tab.value ? styles.active : ""}`}
            onClick={() => onTabClick(tab.value)}
            aria-pressed={currentTab === tab.value}
          >
            <span className={styles.tabLabel}>{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  </div>
);
