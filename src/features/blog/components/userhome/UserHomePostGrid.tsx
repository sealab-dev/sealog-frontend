import type { Post } from '../../types/post';
import PostCard from '../common/PostCard';
import styles from './UserHomePostGrid.module.css';

const SKELETON_COUNT = 6;

interface UserHomePostGridProps {
  posts: Post[];
  total: number;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onLoadMore?: () => void;
}

const UserHomePostGrid = ({
  posts,
  total,
  isLoading,
  isError,
  onRetry,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}: UserHomePostGridProps) => {
  return (
    <div className={styles.uhContent}>
      <div className={styles.uhContentHeader}>
        <h2 className={styles.uhContentTitle}>
          전체 게시글 <span className={styles.uhContentCount}>{total}편</span>
        </h2>
      </div>

      {isLoading ? (
        <div className={styles.uhPostGrid}>
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <div key={i} className={styles.uhPostCardSkeleton} aria-hidden="true">
              <div className={styles.uhPostCardSkeletonThumb} />
              <div className={styles.uhPostCardSkeletonBody}>
                <div className={`${styles.uhPostCardSkeletonLine} ${styles.uhPostCardSkeletonLineShort}`} />
                <div className={styles.uhPostCardSkeletonLine} />
                <div className={`${styles.uhPostCardSkeletonLine} ${styles.uhPostCardSkeletonLineMid}`} />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className={styles.uhPostEmpty}>
          <svg className={styles.uhPostEmptyIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className={styles.uhPostEmptyTitle}>게시글을 불러올 수 없어요</p>
          <p className={styles.uhPostEmptyDesc}>잠시 후 다시 시도해주세요.</p>
          <button className={styles.uhPostEmptyRetry} type="button" onClick={onRetry}>
            다시 시도
          </button>
        </div>
      ) : posts.length === 0 ? (
        <div className={styles.uhPostEmpty}>
          <svg className={styles.uhPostEmptyIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <p className={styles.uhPostEmptyTitle}>아직 게시글이 없어요</p>
          <p className={styles.uhPostEmptyDesc}>첫 번째 글의 주인공이 되어보세요.</p>
        </div>
      ) : (
        <div className={styles.uhPostGrid}>
          {posts.map((post, i) => (
            <PostCard key={post.id} post={post} index={i} />
          ))}
        </div>
      )}

      {hasNextPage && (
        <div className={styles.uhLoadMore}>
          <button
            className={styles.uhLoadMoreBtn}
            type="button"
            onClick={onLoadMore}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? '불러오는 중...' : '더 보기'}
            {!isFetchingNextPage && (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 5v14" />
                <path d="m19 12-7 7-7-7" />
              </svg>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default UserHomePostGrid;
