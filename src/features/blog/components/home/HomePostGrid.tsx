import type { Post } from '../../types/post';
import PostCard from '../common/PostCard';
import styles from './HomePostGrid.module.css';

const SKELETON_COUNT = 6;

interface PostGridProps {
  posts: Post[];
  onLoadMore?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
}

const HomePostGrid = ({
  posts,
  onLoadMore,
  hasNextPage,
  isFetchingNextPage,
  isLoading,
  isError,
  onRetry,
}: PostGridProps) => {
  return (
    <main className={styles.postSection}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitle}>
          <h2>전체 글</h2>
        </div>
      </div>

      {isLoading ? (
        <div className={styles.postGrid}>
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <div key={i} className={styles.postCardSkeleton} aria-hidden="true">
              <div className={styles.postCardSkeletonThumb} />
              <div className={styles.postCardSkeletonBody}>
                <div className={`${styles.postCardSkeletonLine} ${styles.postCardSkeletonLineShort}`} />
                <div className={styles.postCardSkeletonLine} />
                <div className={`${styles.postCardSkeletonLine} ${styles.postCardSkeletonLineMid}`} />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className={styles.postEmpty}>
          <svg className={styles.postEmptyIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className={styles.postEmptyTitle}>게시글을 불러올 수 없어요</p>
          <p className={styles.postEmptyDesc}>잠시 후 다시 시도해주세요.</p>
          <button className={styles.postEmptyRetry} type="button" onClick={onRetry}>
            다시 시도
          </button>
        </div>
      ) : posts.length === 0 ? (
        <div className={styles.postEmpty}>
          <svg className={styles.postEmptyIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <p className={styles.postEmptyTitle}>아직 게시글이 없어요</p>
          <p className={styles.postEmptyDesc}>첫 번째 글의 주인공이 되어보세요.</p>
        </div>
      ) : (
        <div className={styles.postGrid}>
          {posts.map((post, index) => (
            <PostCard key={post.id} post={post} index={index} />
          ))}
        </div>
      )}

      {hasNextPage && (
        <div className={styles.loadMore}>
          <button
            className={styles.loadMoreBtn}
            type="button"
            onClick={onLoadMore}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? '불러오는 중...' : '더 많은 글 보기'}
            {!isFetchingNextPage && (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 5v14" />
                <path d="m19 12-7 7-7-7" />
              </svg>
            )}
          </button>
        </div>
      )}
    </main>
  );
};

export default HomePostGrid;
