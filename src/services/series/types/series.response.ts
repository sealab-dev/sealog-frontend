import type { PostStatus } from '../../post/types/post.enum';

/**
 * 공개 시리즈 목록 정보
 */
export interface SeriesItem {
  id: number;
  slug: string;
  name: string;
  postCount: number;
}

/**
 * 내 시리즈 목록 정보 (공개 여부 포함)
 */
export interface MySeriesItem {
  id: number;
  slug: string;
  name: string;
  isPublic: boolean;
  postCount: number;
}

/**
 * 시리즈에 속한 공개 게시글 정보
 */
export interface SeriesPostItem {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  status: PostStatus;
  thumbnailUrl: string | null;
  tags: string[];
  stacks: {
    id: number;
    name: string;
    stackGroup: string;
  }[];
  author: {
    nickname: string;
    profileImageUrl: string | null;
  };
  createdAt: string;
}

/**
 * 내 시리즈 상세(관리용)에 포함된 게시글 정보
 */
export interface MySeriesPostItem {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  status: PostStatus;
  thumbnailUrl: string | null;
  tags: string[];
  stacks: {
    id: number;
    name: string;
    sortOrder: number;
  }[];
  createdAt: string;
}
