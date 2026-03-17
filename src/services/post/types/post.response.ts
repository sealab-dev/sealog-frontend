import type { PostStatus } from './post.enum';

/**
 * 작성자 정보
 */
export interface AuthorInfo {
  nickname: string;
  profileImageUrl: string | null;
}

/**
 * 스택 정보 (일반)
 */
export interface StackItem {
  id: number;
  name: string;
  stackGroup: 'LANGUAGE' | 'FRAMEWORK' | 'LIBRARY' | 'DATABASE' | 'DEVOPS' | 'KNOWLEDGE' | 'TOOL' | 'ETC';
}

/**
 * 게시글 관련 스택 정보 (ID, 이름, 순서)
 */
export interface MyStackItem {
  id: number;
  name: string;
  sortOrder: number;
}

/**
 * 시리즈 요약 정보
 */
export interface SeriesInfo {
  id: number;
  slug: string;
  name: string;
}

/**
 * 공개 게시글 목록 정보 (PostItem)
 */
export interface PostItem {
  id: number;
  title: string;
  slug: string;
  thumbnailUrl: string | null;
  excerpt: string;
  tags: string[];
  stacks: { id: number; name: string }[];
  status: string;
  author: { nickname: string; profileImageUrl: string | null };
  createdAt: string;
}

/**
 * 내 게시글 목록 정보 (MyPostItem)
 */
export interface MyPostItem {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  status: PostStatus;
  thumbnailUrl: string | null;
  tags: string[];
  stacks: MyStackItem[];
  createdAt: string;
}

/**
 * 게시글 상세 정보 (PostDetail)
 */
export interface PostDetail {
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
  seriesInfo: SeriesInfo | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * 게시글 수정용 상세 정보 (MyPostEdit)
 */
export interface MyPostEdit {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  status: PostStatus;
  thumbnailUrl: string | null;
  tags: string[];
  stacks: MyStackItem[];
  seriesId: number;
  createdAt: string;
  updatedAt: string;
}
