import type { PostDetail } from '../../types/post';
import './DetailBanner.css';

interface DetailBannerProps {
  post: PostDetail;
  isOwner?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function DetailBanner({ post, isOwner, onEdit, onDelete }: DetailBannerProps) {
  return (
    <header className="detail-post-header">
      {isOwner && (
        <div className="detail-post-actions">
          <button className="detail-action-btn" type="button" onClick={onEdit}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            수정
          </button>
          <button className="detail-action-btn detail-action-btn--danger" type="button" onClick={onDelete}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
            </svg>
            삭제
          </button>
        </div>
      )}

      {post.series && (
        <a className="detail-series-badge" href={post.series.href}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
          {post.series.name}
          <svg className="detail-series-badge__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </a>
      )}

      <h1 className="detail-post-title">{post.title}</h1>
      <p className="detail-post-desc">{post.desc}</p>

      <div className="detail-post-meta">
        <div className="detail-post-author">
          <div className="detail-author-avatar">
            {post.author.profileImageUrl
              ? <img src={post.author.profileImageUrl} alt="" />
              : post.author.initial}
          </div>
          <div>
            <div className="detail-author-name">{post.author.name}</div>
            <div className="detail-post-date">{post.date}</div>
          </div>
        </div>
        <div className="detail-meta-sep" />
        <span className="detail-read-time">⏱ 약 {post.readTime}분 읽기</span>
      </div>

      <div className="detail-post-tags">
        {post.stacks.map((s) => (
          <span key={s} className="detail-badge-stack">{s}</span>
        ))}
        {post.tags.map((t) => (
          <span key={t} className="detail-badge-tag">{t}</span>
        ))}
      </div>
    </header>
  );
}
