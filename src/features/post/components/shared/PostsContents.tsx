import { usePreloadNavigate } from "@/components/ui/loading/usePreloadNavigate";
import { postApi } from "@/api/post/services";
import { postKeys } from "@/api/post/queries";
import type { PostItemResponse } from "@/api/post/types";
import { PostCard } from "./PostCard";

// CSS module을 외부에서 주입받아 home/user 각자의 변수를 유지
interface ClassNames {
  postGrid: string;
  emptyState: string;
  emptyIcon: string;
  emptyTitle: string;
  emptyDescription: string;
}

interface PostsContentsProps {
  posts: PostItemResponse[];
  classNames: ClassNames;
}

export const PostsContents = ({ posts, classNames }: PostsContentsProps) => {
  const preloadNavigate = usePreloadNavigate();

  const handlePostClick = (nickname: string, slug: string) => {
    preloadNavigate(
      `/user/${nickname}/entry/${slug}`,
      [...postKeys.publicDetail(nickname, slug)],
      () => postApi.getPublicPostByNicknameAndSlug(nickname, slug),
    );
  };

  if (posts.length === 0) {
    return (
      <div className={classNames.emptyState}>
        <div className={classNames.emptyIcon}>
          <svg
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
        <h3 className={classNames.emptyTitle}>아직 게시글이 없습니다</h3>
        <p className={classNames.emptyDescription}>
          다른 검색어나 필터를 시도해보세요
        </p>
      </div>
    );
  }

  return (
    <div className={classNames.postGrid}>
      {posts.map((post, index) => (
        <PostCard
          key={post.id}
          post={post}
          animationDelay={index * 0.06}
          onClick={() => handlePostClick(post.author.nickname, post.slug)}
        />
      ))}
    </div>
  );
};
