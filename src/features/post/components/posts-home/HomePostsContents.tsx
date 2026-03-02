import { PostsContents } from "@/features/post/components/shared/PostsContents";
import type { PostItemResponse } from "@/api/post/types";
import styles from "./HomePostsContents.module.css";

interface HomePostsContentsProps {
  posts: PostItemResponse[];
}

export const HomePostsContents = ({ posts }: HomePostsContentsProps) => (
  <PostsContents
    posts={posts}
    classNames={{
      postGrid: styles.postGrid,
      emptyState: styles.emptyState,
      emptyIcon: styles.emptyIcon,
      emptyTitle: styles.emptyTitle,
      emptyDescription: styles.emptyDescription,
    }}
  />
);
