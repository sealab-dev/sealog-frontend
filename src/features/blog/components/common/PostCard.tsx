import { Link } from 'react-router-dom';
import type { Post } from '../../types/post';
import styles from './PostCard.module.css';

interface PostCardProps {
  post: Post;
  index: number;
}

const PostCard = ({ post, index }: PostCardProps) => {
  return (
    <Link
      to={`/${post.authorNickname}/entry/${post.slug}`}
      className={styles.postCard}
      style={{ animationDelay: `${(index + 1) * 0.05}s` }}
    >
      <div className={styles.postCardThumb}>
        {post.thumbnailUrl && (
          <img src={post.thumbnailUrl} alt="" className={styles.postCardThumbImg} />
        )}
        {post.seriesBadge && (
          <span className={styles.postCardSeriesBadge}>{post.seriesBadge}</span>
        )}
      </div>
      <div className={styles.postCardBody}>
        <div className={styles.postCardStacks}>
          {post.stacks.map((stack) => (
            <span key={stack} className={styles.badgeStack}>{stack}</span>
          ))}
        </div>
        <h3 className={styles.postCardTitle}>{post.title}</h3>
        <p className={styles.postCardExcerpt}>{post.excerpt}</p>
        <div className={styles.postCardTags}>
          {post.tags.map((tag) => (
            <span key={tag} className={styles.badgeTag}>{tag}</span>
          ))}
        </div>
        <footer className={styles.postCardFooter}>
          <div className={styles.postCardAuthor}>
            <div className={styles.postCardAvatar}>
              {post.author.profileImageUrl
                ? <img src={post.author.profileImageUrl} alt="" />
                : post.author.initial}
            </div>
            <span className={styles.postCardAuthorName}>{post.author.name}</span>
          </div>
          <time className={styles.postCardDate} dateTime={post.date}>{post.date}</time>
        </footer>
      </div>
    </Link>
  );
};

export default PostCard;
