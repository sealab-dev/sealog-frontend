import type { PostType } from "@/api/post/types";
import { Waves } from "lucide-react";

const POST_TYPE_TABS: {
  value: PostType | "ALL";
  label: string;
  description: string;
}[] = [
  { value: "ALL", label: "전체", description: "모든 글" },
  { value: "CORE", label: "Core", description: "핵심 개념" },
  { value: "ARCHITECTURE", label: "Architecture", description: "설계 패턴" },
  {
    value: "TROUBLESHOOTING",
    label: "Troubleshooting",
    description: "문제 해결",
  },
  { value: "ESSAY", label: "Essay", description: "개발 에세이" },
];

interface ClassNames {
  filterContainer: string;
  // headerSection: string;
  titleWrapper: string;
  iconWrapper: string;
  titleIcon?: string;
  iconGlow: string;
  titleContent: string;
  title: string;
  subtitle: string;
  count: string;
  searchQuery?: string;
  categoryNav: string;
  categoryTabs: string;
  categoryTab: string;
  active: string;
  tabLabel: string;
  tabDescription: string;
}

interface PostsFilterProps {
  currentPostType: PostType | "ALL";
  totalCount: number;
  onTabClick: (type: PostType | "ALL") => void;
  title: string;
  searchQuery?: string; // 유저 페이지에서만 사용
  showIcon?: boolean; // 유저 페이지에서만 아이콘 표시
  classNames: ClassNames;
}

export const PostsFilter = ({
  currentPostType,
  totalCount,
  onTabClick,
  title,
  searchQuery,
  showIcon = false,
  classNames,
}: PostsFilterProps) => {
  return (
    <div className={classNames.filterContainer}>
      <div className={classNames.titleWrapper}>
        {/* {showIcon && (
          <div className={classNames.iconWrapper}>
            <Waves size={32} className={classNames.titleIcon} />
            <div className={classNames.iconGlow} />
          </div>
        )} */}
        <div className={classNames.titleContent}>
          <h1 className={classNames.title}>{title}</h1>
          <p className={classNames.subtitle}>
            {searchQuery ? (
              <>
                <span className={classNames.searchQuery}>{searchQuery}</span>{" "}
                검색 결과 <span className={classNames.count}>{totalCount}</span>
                개
              </>
            ) : (
              <>
                깊은 바다처럼 깊이 있는{" "}
                <span className={classNames.count}>{totalCount}</span>개의 개발
                이야기
              </>
            )}
          </p>
        </div>
      </div>

      <nav className={classNames.categoryNav}>
        <div className={classNames.categoryTabs}>
          {POST_TYPE_TABS.map((tab) => (
            <button
              key={tab.value}
              className={`${classNames.categoryTab} ${currentPostType === tab.value ? classNames.active : ""}`}
              onClick={() => onTabClick(tab.value)}
              aria-pressed={currentPostType === tab.value}
            >
              <span className={classNames.tabLabel}>{tab.label}</span>
              <span className={classNames.tabDescription}>
                {tab.description}
              </span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};
