import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, RotateCcw, Search } from 'lucide-react';
import { useMyPostsQuery, useSearchMyPostsQuery, useDeletedPostsQuery } from '../../services/post/post.queries';
import { useDeletePostMutation, useRestorePostMutation } from '../../services/post/post.mutations';
import { useAuthStore } from '../../store/authStore';
import type { PostStatus } from '../../services/post/types/post.enum';
import styles from './MyPostsPage.module.css';

type Tab = 'active' | 'deleted';

const STATUS_LABEL: Record<PostStatus, string> = {
  PUBLISHED: '공개',
  PRIVATE: '비공개',
  DRAFT: '임시저장',
};

const STATUS_CLASS: Record<PostStatus, string> = {
  PUBLISHED: 'published',
  PRIVATE: 'private',
  DRAFT: 'draft',
};

export default function MyPostsPage() {
  const nickname = useAuthStore((s) => s.user?.nickname ?? '');
  const [tab, setTab] = useState<Tab>('active');
  const [keyword, setKeyword] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const isSearchMode = tab === 'active' && keyword.trim().length > 0;

  const { data: myPosts, isPending: isMyPostsPending } = useMyPostsQuery();
  const { data: searchPosts, isPending: isSearchPending } = useSearchMyPostsQuery(keyword);
  const { data: deletedPosts, isPending: isDeletedPending } = useDeletedPostsQuery();

  const deletePost = useDeletePostMutation();
  const restorePost = useRestorePostMutation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setKeyword(searchInput.trim());
  };

  const handleSearchClear = () => {
    setSearchInput('');
    setKeyword('');
  };

  const activeItems = isSearchMode
    ? (searchPosts?.content ?? [])
    : (myPosts?.content ?? []);

  const isPending = tab === 'active'
    ? (isSearchMode ? isSearchPending : isMyPostsPending)
    : isDeletedPending;

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>내 게시글</h1>
        <p className={styles.pageSubtitle}>작성한 게시글을 관리하세요.</p>
      </header>

      <div className={styles.toolbar}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tabBtn} ${tab === 'active' ? styles.tabBtnActive : ''}`}
            onClick={() => setTab('active')}
          >
            게시글
          </button>
          <button
            className={`${styles.tabBtn} ${tab === 'deleted' ? styles.tabBtnActive : ''}`}
            onClick={() => setTab('deleted')}
          >
            삭제된 게시글
          </button>
        </div>

        {tab === 'active' && (
          <form className={styles.searchForm} onSubmit={handleSearch}>
            <div className={styles.searchWrap}>
              <Search size={14} className={styles.searchIcon} />
              <input
                className={styles.searchInput}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="게시글 검색..."
              />
              {keyword && (
                <button type="button" className={styles.searchClear} onClick={handleSearchClear}>
                  ✕
                </button>
              )}
            </div>
          </form>
        )}
      </div>

      <div className={styles.card}>
        {isPending ? (
          <p className={styles.empty}>불러오는 중...</p>
        ) : tab === 'active' ? (
          activeItems.length === 0 ? (
            <p className={styles.empty}>
              {isSearchMode ? '검색 결과가 없습니다.' : '게시글이 없습니다.'}
            </p>
          ) : (
            <ul className={styles.list}>
              {activeItems.map((post) => (
                <li key={post.id} className={styles.item}>
                  <div className={styles.itemMain}>
                    <span className={`${styles.statusBadge} ${styles[STATUS_CLASS[post.status]]}`}>
                      {STATUS_LABEL[post.status]}
                    </span>
                    <div className={styles.itemInfo}>
                      <p className={styles.itemTitle}>{post.title}</p>
                      <p className={styles.itemMeta}>
                        {post.tags.length > 0 && post.tags.map((t) => `#${t}`).join(' ')}
                        {post.tags.length > 0 && post.stacks.length > 0 && ' · '}
                        {post.stacks.length > 0 && post.stacks.map((s) => s.name).join(', ')}
                      </p>
                    </div>
                  </div>
                  <div className={styles.itemActions}>
                    <span className={styles.itemDate}>
                      {new Date(post.createdAt).toLocaleDateString('ko-KR')}
                    </span>
                    <Link to={`/${nickname}/entry/${post.slug}/edit`} className={styles.actionBtn} title="수정">
                      <Edit2 size={15} />
                    </Link>
                    <button
                      className={`${styles.actionBtn} ${styles.actionBtnDelete}`}
                      title="삭제"
                      onClick={() => deletePost.mutate(post.id)}
                      disabled={deletePost.isPending}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )
        ) : (
          (deletedPosts?.content ?? []).length === 0 ? (
            <p className={styles.empty}>삭제된 게시글이 없습니다.</p>
          ) : (
            <ul className={styles.list}>
              {(deletedPosts?.content ?? []).map((post) => (
                <li key={post.id} className={styles.item}>
                  <div className={styles.itemMain}>
                    <span className={`${styles.statusBadge} ${styles.deleted}`}>삭제됨</span>
                    <div className={styles.itemInfo}>
                      <p className={styles.itemTitle}>{post.title}</p>
                      <p className={styles.itemMeta}>
                        {post.tags.length > 0 && post.tags.map((t) => `#${t}`).join(' ')}
                      </p>
                    </div>
                  </div>
                  <div className={styles.itemActions}>
                    <span className={styles.itemDate}>
                      {new Date(post.createdAt).toLocaleDateString('ko-KR')}
                    </span>
                    <button
                      className={`${styles.actionBtn} ${styles.actionBtnRestore}`}
                      title="복구"
                      onClick={() => restorePost.mutate(post.id)}
                      disabled={restorePost.isPending}
                    >
                      <RotateCcw size={15} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )
        )}
      </div>
    </div>
  );
}
