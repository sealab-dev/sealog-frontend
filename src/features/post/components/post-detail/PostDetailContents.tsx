import { Viewer } from '@/components/editor';
import styles from './PostDetailContents.module.css';

interface PostDetailContentsProps {
  /**
   * 서버에서 받은 Markdown 콘텐츠
   */
  markdownContent: string;
}

/**
 * 게시글 본문 컴포넌트
 * @param markdownContent - 서버에서 받은 Markdown 콘텐츠
 * @returns 게시글 본문 컴포넌트
 */
export const PostDetailContents: React.FC<PostDetailContentsProps> = ({ markdownContent }) => {
  return (
    <div className={styles.wrapper}>
      <Viewer content={markdownContent} className={styles.viewer} />
    </div>
  );
};