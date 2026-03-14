import type { Post } from '../../types/post';
import PostCard from '../common/PostCard';
import './UserHomePostGrid.css';

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

export default function UserHomePostGrid({
  posts,
  total,
  isLoading,
  isError,
  onRetry,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}: UserHomePostGridProps) {
  return (
    <div className="uh-content">
      <div className="uh-content-header">
        <h2 className="uh-content-title">
          전체 게시글 <span className="uh-content-count">{total}편</span>
        </h2>
      </div>

      {isLoading ? (
        <div className="uh-post-grid">
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <div key={i} className="uh-post-card-skeleton" aria-hidden="true">
              <div className="uh-post-card-skeleton__thumb" />
              <div className="uh-post-card-skeleton__body">
                <div className="uh-post-card-skeleton__line uh-post-card-skeleton__line--short" />
                <div className="uh-post-card-skeleton__line" />
                <div className="uh-post-card-skeleton__line uh-post-card-skeleton__line--mid" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="uh-post-empty">
          <svg className="uh-post-empty__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className="uh-post-empty__title">게시글을 불러올 수 없어요</p>
          <p className="uh-post-empty__desc">잠시 후 다시 시도해주세요.</p>
          <button className="uh-post-empty__retry" type="button" onClick={onRetry}>
            다시 시도
          </button>
        </div>
      ) : posts.length === 0 ? (
        <div className="uh-post-empty">
          <svg className="uh-post-empty__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <p className="uh-post-empty__title">아직 게시글이 없어요</p>
          <p className="uh-post-empty__desc">첫 번째 글의 주인공이 되어보세요.</p>
        </div>
      ) : (
        <div className="uh-post-grid">
          {posts.map((post, i) => (
            <PostCard key={post.id} post={post} index={i} showAuthor={false} />
          ))}
        </div>
      )}

      {hasNextPage && (
        <div className="uh-load-more">
          <button
            className="uh-load-more__btn"
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
}
