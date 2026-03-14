import { Link } from 'react-router-dom';
import type { Post } from '../../types/post';
import './PostCard.css';

interface PostCardProps {
  post: Post;
  index: number;
  showAuthor?: boolean;
}

export default function PostCard({ post, index, showAuthor = true }: PostCardProps) {
  return (
    <Link
      to={`/${post.authorNickname}/entry/${post.slug}`}
      className="post-card"
      style={{ animationDelay: `${(index + 1) * 0.05}s` }}
    >
      <div className="post-card__thumb">
        {post.thumbnailUrl && (
          <img src={post.thumbnailUrl} alt="" className="post-card__thumb-img" />
        )}
        {post.seriesBadge && (
          <span className="post-card__series-badge">{post.seriesBadge}</span>
        )}
      </div>
      <div className="post-card__body">
        <div className="post-card__stacks">
          {post.stacks.map((stack) => (
            <span key={stack} className="badge-stack">{stack}</span>
          ))}
        </div>
        <h3 className="post-card__title">{post.title}</h3>
        <p className="post-card__excerpt">{post.excerpt}</p>
        <div className="post-card__tags">
          {post.tags.map((tag) => (
            <span key={tag} className="badge-tag">{tag}</span>
          ))}
        </div>
        <footer className="post-card__footer">
          {showAuthor && (
            <div className="post-card__author">
              <div className="post-card__avatar">
                {post.author.profileImageUrl
                  ? <img src={post.author.profileImageUrl} alt="" />
                  : post.author.initial}
              </div>
              <span className="post-card__author-name">{post.author.name}</span>
            </div>
          )}
          <time className="post-card__date" dateTime={post.date}>{post.date}</time>
        </footer>
      </div>
    </Link>
  );
}
