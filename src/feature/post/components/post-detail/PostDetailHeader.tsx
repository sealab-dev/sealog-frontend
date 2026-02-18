import { formatDate } from '@/feature/post/utils';
import type { AuthorInfo } from '@/api/post/types';
import { useNavigate } from 'react-router-dom';
import { FILE_DOMAIN } from '@/constants/domain';
import styles from './PostDetailHeader.module.css';

interface PostDetailHeaderProps {
  postType: string;
  title: string;
  stacks: string[];
  tags: string[];
  createdAt: string;
  author: AuthorInfo;
}

export const PostDetailHeader = ({
  postType,
  title,
  stacks,
  tags,
  createdAt,
  author
}: PostDetailHeaderProps) => {
  const navigate = useNavigate();

  const handleAuthorClick = () => {
    navigate(`/user/${author.nickname}`);
  };

  return (
    <header className={styles.header}>
      <span className={styles.postType}>{postType}</span>
      <h1 className={styles.title}>{title}</h1>

      {/* 스택 */}
      {stacks.length > 0 && (
        <div className={styles.stacks}>
          {stacks.map((stack) => (
            <span key={stack} className={styles.stack}>
              {stack}
            </span>
          ))}
        </div>
      )}

      {/* 태그 */}
      {tags.length > 0 && (
        <div className={styles.tags}>
          {tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* 메타 정보 */}
      <div className={styles.meta}>
        <div className={styles.authorLink} onClick={handleAuthorClick}>
          <div className={styles.profileImage}>
            {author.profileImagePath ? (
              <img 
                src={FILE_DOMAIN + author.profileImagePath} 
                alt={`${author.nickname}의 프로필`}
              />
            ) : (
              <div className={styles.profilePlaceholder}>
                {author.nickname.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <span className={styles.author}>{author.nickname}</span>
        </div>
        <span className={styles.dot}>·</span>
        <span className={styles.date}>{formatDate(createdAt)}</span>
      </div>
    </header>
  );
};