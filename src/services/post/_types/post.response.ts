import type { PostStatus } from './post.enum';

/**
 * 작성자 정보
 */
export interface AuthorInfo {
  nickname: string;
  profileImageUrl: string | null;
}

/**
 * 스택 정보
 */
export interface StackItem {
  id: number;
  name: string;
  sortOrder: number;
}

/**
 * 게시글 목록 응답 (요약 정보)
 */
export interface PostItems {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  status: PostStatus;
  thumbnailUrl: string | null;
  tags: string[];
  stacks: StackItem[];
  author: AuthorInfo;
  createdAt: string;
}

/**
 * 게시글 상세 응답
 */
export interface Detail {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  status: PostStatus;
  thumbnailUrl: string | null;
  tags: string[];
  stacks: StackItem[];
  author: AuthorInfo;
  createdAt: string;
  updatedAt: string;
}

/**
 * 게시글 수정용 응답 (author 없음)
 */
export interface Edit {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  status: PostStatus;
  thumbnailUrl: string | null;
  tags: string[];
  stacks: StackItem[];
  createdAt: string;
  updatedAt: string;
}
