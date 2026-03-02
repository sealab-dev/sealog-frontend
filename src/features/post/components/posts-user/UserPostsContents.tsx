import { PostsContents } from "@/features/post/components/shared/PostsContents";
import type { PostItemResponse } from "@/api/post/types";
import styles from "./UserPostsContents.module.css";

interface UserPostsContentsProps {
  posts: PostItemResponse[];
}

export const UserPostsContents = ({ posts }: UserPostsContentsProps) => (
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
