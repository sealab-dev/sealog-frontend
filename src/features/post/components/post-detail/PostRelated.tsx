import type { PostItemResponse } from '@/api/post/types';
import { PostCard } from '../posts-user/_parts/PostCard';
import { usePreloadNavigate } from '@/components/ui/loading/usePreloadNavigate';
import { postKeys } from '@/api/post/queries';
import { postApi } from '@/api/post/services';
import styles from './PostRelated.module.css';

interface PostRelatedProps {
  relatedPosts: PostItemResponse[];
}

export const PostRelated = ({ relatedPosts }: PostRelatedProps) => {
  const preloadNavigate = usePreloadNavigate();

  if (!relatedPosts || relatedPosts.length === 0) {
    return null;
  }

  const handlePostClick = (nickname: string, slug: string) => {
    preloadNavigate(
      `/user/${nickname}/entry/${slug}`,
      [...postKeys.publicDetail(nickname, slug)],
      () => postApi.getPublicPostByNicknameAndSlug(nickname, slug)
    );
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>관련 게시글</h2>
      <div className={styles.grid}>
        {relatedPosts.map((post, index) => (
          <PostCard
            key={post.id}
            post={post}
            animationDelay={index * 0.06}
            onClick={() => handlePostClick(post.author.nickname, post.slug)}
          />
        ))}
      </div>
    </section>
  );
};