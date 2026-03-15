import { Link } from 'react-router-dom';
import type { PostDetail } from '../../types/post';
import styles from './DetailBanner.module.css';

interface DetailBannerProps {
  post: PostDetail;
  isOwner?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

const DetailBanner = ({ post, isOwner, onEdit, onDelete }: DetailBannerProps) => {
  return (
    <header className={styles.detailHeader}>
      {/* 상단 액션 및 시리즈 정보 */}
      <div className={styles.headerTop}>
        {post.series ? (
          <a className={styles.seriesBadge} href={post.series.href}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            {post.series.name}
          </a>
        ) : <div />}

        {isOwner && (
          <div className={styles.actions}>
            <button className={styles.actionBtn} onClick={onEdit} aria-label="수정">수정</button>
            <button className={`${styles.actionBtn} ${styles.actionBtnDanger}`} onClick={onDelete} aria-label="삭제">삭제</button>
          </div>
        )}
      </div>

      {/* 제목 및 설명 */}
      <h1 className={styles.title}>{post.title}</h1>
      {post.desc && <p className={styles.description}>{post.desc}</p>}

      {/* 프로필 및 메타 정보 블록 */}
      <div className={styles.authorBlock}>
        <Link to={`/${post.author.nickname}/posts`} className={styles.authorLink}>
          <div className={styles.avatar}>
            {post.author.profileImageUrl
              ? <img src={post.author.profileImageUrl} alt={post.author.name} />
              : <span>{post.author.initial}</span>}
          </div>
          <div className={styles.authorName}>{post.author.name}</div>
        </Link>
        <div className={styles.authorMetaSeparator} />
        <div className={styles.authorMeta}>
          <div className={styles.postInfo}>
            <time dateTime={post.date}>{post.date}</time>
            <span className={styles.dot}>·</span>
            <span>{post.readTime} min read</span>
          </div>
        </div>
      </div>

      {/* 기술 스택 및 태그 그룹 */}
      <div className={styles.metadata}>
        <div className={styles.stackGroup}>
          {post.stacks.map((s) => (
            <span key={s} className={styles.stackBadge}>{s}</span>
          ))}
        </div>
        <div className={styles.tagGroup}>
          {post.tags.map((t) => (
            <span key={t} className={styles.tagItem}>#{t}</span>
          ))}
        </div>
      </div>
    </header>
  );
};

export default DetailBanner;
