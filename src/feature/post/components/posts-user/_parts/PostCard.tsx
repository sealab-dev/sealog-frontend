import { formatDate } from '@/feature/post/utils';
import { 
  DEFAULT_PROFILE_IMAGE, 
  DEFAULT_THUMBNAIL
} from '@/constants/images';
import { FILE_DOMAIN } from '@/constants/domain';
import type { PostItemResponse } from '@/api/post/types';
import styles from './PostCard.module.css';

interface PostCardProps {
  post: PostItemResponse;
  animationDelay?: number;
  onClick?: () => void;
}

export const PostCard = ({ post, animationDelay = 0, onClick }: PostCardProps) => {

  return (
    <article
      className={styles.postCard}
      style={{ animationDelay: `${animationDelay}s` }}
      onClick={onClick}
    >
      {/* 썸네일 */}
      <div className={styles.thumbnailWrapper} >
        <img src={
          post.thumbnailPath ? FILE_DOMAIN + post.thumbnailPath : DEFAULT_THUMBNAIL} 
          alt={post.title} 
          className={styles.thumbnailImage} 
        />

        <div className={styles.thumbnailOverlay} />
      </div>

      {/* 콘텐츠 */}
      <div className={styles.cardContent}>
        <h3 className={styles.postTitle}>{post.title}</h3>
        <p className={styles.postExcerpt}>{post.excerpt}</p>

        {post.stacks.length > 0 && (
          <div className={styles.stackList}>
            {post.stacks.slice(0, 3).map((stack) => (
              <span key={stack} className={styles.stackBadge}>{stack}</span>
            ))}
            {post.stacks.length > 3 && (
              <span className={styles.stackMore}>+{post.stacks.length - 3}</span>
            )}
          </div>
        )}

        <div className={styles.tagList}>
          {post.tags.slice(0, 3).map((tag) => (
            <span key={tag} className={styles.tagBadge}>#{tag}</span>
          ))}
          {post.tags.length > 3 && <span className={styles.tagMore}></span>}
        </div>

        <footer className={styles.cardFooter}>
          <div className={styles.authorInfo}>
            <img
              src={FILE_DOMAIN + post.author.profileImagePath || DEFAULT_PROFILE_IMAGE}
              alt={post.author.nickname}
              className={styles.authorAvatar}
              onError={(e) => {
                (e.target as HTMLImageElement).src = DEFAULT_PROFILE_IMAGE;
              }}
            />
            <span className={styles.authorName}>{post.author.nickname}</span>
          </div>
          <time className={styles.postDate} dateTime={post.createdAt}>
            {formatDate(post.createdAt)}
          </time>
        </footer>
      </div>
    </article>
  );
};