import { useNavigate, useLocation } from "react-router-dom";
import { usePosts } from "@/features/post/hooks/post/usePosts";
import {
  HomePostsFilter,
  HomePostsContents,
} from "@/features/post/components/posts-home";
import type { HomeTab } from "@/features/post/components/posts-home/HomePostsFilter";
import { Pagination } from "@/components/ui/pagination/Pagination";
import { SwimmingDolphin } from "@/components/ui/dolphin/SwimmingDolphin";
import { HomeAboutContent } from "@/layout/home/_components/HomeAboutContent";
import styles from "./HomePostsPage.module.css";

/* ------------------------------------------------------------------ */
/* 컬렉션 탭 콘텐츠 (TODO)                                              */
/* ------------------------------------------------------------------ */
const CollectionContent = () => (
  <div className={styles.comingSoon}>
    <p style={{ color: "var(--global-text-primary" }}>
      컬렉션 목록을 준비 중입니다.
    </p>
  </div>
);

/* ------------------------------------------------------------------ */
/* 메인                                                                 */
/* ------------------------------------------------------------------ */
export const HomePostsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { posts, pagination, setPage } = usePosts();

  // pathname으로 현재 탭 결정
  const currentTab: HomeTab = location.pathname.startsWith("/collection")
    ? "COLLECTION"
    : location.pathname.startsWith("/about")
      ? "ABOUT"
      : "POST";

  const handleTabClick = (tab: HomeTab) => {
    if (tab === "POST") navigate("/");
    if (tab === "COLLECTION") navigate("/collection");
    if (tab === "ABOUT") navigate("/about");
  };

  return (
    <div className={styles.container}>
      <div className={styles.sectionWrapper}>
        <SwimmingDolphin />

        {/* 필터 (탭) */}
        <div className={styles.filterWrapper}>
          <HomePostsFilter
            currentTab={currentTab}
            totalCount={
              currentTab === "POST" ? pagination.totalElements : undefined
            }
            onTabClick={handleTabClick}
          />
        </div>

        {/* 탭별 콘텐츠 */}
        <div className={styles.contentsWrapper}>
          {currentTab === "POST" && <HomePostsContents posts={posts} />}
          {currentTab === "COLLECTION" && <CollectionContent />}
          {currentTab === "ABOUT" && <HomeAboutContent />}
        </div>

        {/* 페이지네이션 — 글 탭에서만 */}
        {currentTab === "POST" && pagination.totalPages > 1 && (
          <div className={styles.paginationWrapper}>
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={setPage}
              hasNext={pagination.hasNext}
              hasPrevious={pagination.hasPrevious}
            />
          </div>
        )}
      </div>
    </div>
  );
};
