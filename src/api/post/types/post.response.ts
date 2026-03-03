import type { PostType, PostStatus } from "./post.enums";

/**
 * 작성자 정보 (Backend: PostResponse.AuthorInfo)
 */
export interface AuthorInfo {
  nickname: string;
  profileImagePath: string | null;
}

/**
 * 게시글 목록 아이템 (Backend: PostResponse.PostItems)
 */
export interface PostItemResponse {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  postType: PostType;
  status: PostStatus;
  thumbnailPath: string | null;
  tags: string[];
  stacks: string[];
  author: AuthorInfo;
  createdAt: string;
  // TODO: [컬렉션 API 연결] 백엔드 PostResponse.PostItems에 collectionName 필드 추가 시 활성화
  // → 이 필드가 내려와야 사이드바 컬렉션 목록이 자동으로 표시됨
  collectionName?: string | null;
}

/**
 * 게시글 상세 (Backend: PostResponse.Detail)
 */
export interface PostDetailResponse {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  postType: PostType;
  content: string;
  status: PostStatus;
  thumbnailPath: string | null;
  tags: string[];
  stacks: string[];
  author: AuthorInfo;
  relatedPosts: PostItemResponse[];
  createdAt: string;
  updatedAt: string;
  // TODO: [컬렉션 API 연결] 상세 페이지에서 컬렉션 정보 표시 시 아래 주석 해제
  // collectionName?: string | null;
  // collectionId?: number | null;
}

/**
 * 게시글 수정용 응답 (Backend: PostResponse.Edit)
 */
export interface PostEditResponse {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  postType: PostType;
  content: string;
  status: PostStatus;
  thumbnailPath: string | null;
  tags: string[];
  stacks: string[];
  createdAt: string;
  updatedAt: string;
  // TODO: [컬렉션 API 연결] 수정 폼에서 기존 컬렉션 불러오기 위해 아래 주석 해제
  // collectionId?: number | null;
  // collectionName?: string | null;
}
