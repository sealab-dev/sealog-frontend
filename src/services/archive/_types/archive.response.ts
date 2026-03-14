/**
 * 아카이브 목록 응답
 */
export interface ArchiveItems {
  id: number;
  slug: string;
  name: string;
}

/**
 * 아카이브에 속하는 게시글 목록 응답
 */
export interface PostItems {
  postId: number;
  title: string;
  slug: string;
  thumbnailPath: string | null;
}
