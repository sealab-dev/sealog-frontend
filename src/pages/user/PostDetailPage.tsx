import { Navigate, useParams, useNavigate } from "react-router-dom";
import { usePostDetails } from "@/features/post/hooks/post/usePostDetails";
import { usePostDelete } from "@/features/post/hooks/post/usePostDelete";
import { useAuthStore } from "@/features/auth/stores/authStore";
import { useTocItems } from "@/components/editor/hooks/useTocItems";
import { TableOfContents } from "@/components/editor/base/TableOfContents";
import {
  PostThumbnail,
  PostDetailHeader,
  PostDetailContents,
  PostRelated,
} from "@/features/post/components/post-detail";
import styles from "./PostDetailPage.module.css";

export const PostDetailPage = () => {
  const { nickname, slug } = useParams<{ nickname: string; slug: string }>();
  const navigate = useNavigate();
  const { post, isLoading } = usePostDetails(nickname!, slug!);
  const { deletePost, isLoading: isDeleting } = usePostDelete();
  const { user } = useAuthStore();

  const tocItems = useTocItems(".tiptap-viewer");

  // URL의 nickname과 로그인 유저 nickname이 같을 때만 수정/삭제 버튼 노출
  const isOwner = !!user && user.nickname === nickname;

  if (isLoading) {
    return null;
  }

  if (!post) {
    return <Navigate to="/404" replace />;
  }

  const handleEdit = () => {
    navigate(`/user/${nickname}/entry/${slug}/edit`);
  };

  const handleDelete = async () => {
    await deletePost(slug!);
  };

  return (
    <div className={styles.pageWrapper}>
      {/* 썸네일 배너 */}
      <PostThumbnail thumbnailPath={post.thumbnailPath} title={post.title} />

      {/* 본문 컨테이너 */}
      <div className={styles.container}>
        {/* 수정/삭제 버튼 — 본인 게시글일 때만 노출 */}
        {isOwner && (
          <div className={styles.ownerActions}>
            <button
              type="button"
              className={styles.editButton}
              onClick={handleEdit}
            >
              수정
            </button>
            <button
              type="button"
              className={styles.deleteButton}
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "삭제 중..." : "삭제"}
            </button>
          </div>
        )}

        {/* 게시글 헤더 */}
        <PostDetailHeader
          title={post.title}
          stacks={post.stacks}
          tags={post.tags}
          createdAt={post.createdAt}
          author={post.author}
        />

        {/* 게시글 본문 */}
        <article className={styles.content}>
          <PostDetailContents markdownContent={post.content} />
        </article>

        {/* 태그 */}
        {post.tags.length > 0 && (
          <div className={styles.tags}>
            {post.tags.map((tag) => (
              <span key={tag} className={styles.tag}>
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* 관련 게시글 */}
        <PostRelated relatedPosts={post.relatedPosts || []} />
      </div>

      {/* 목차 */}
      <TableOfContents items={tocItems} />
    </div>
  );
};
