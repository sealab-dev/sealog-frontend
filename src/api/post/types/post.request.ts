import type { PostType } from "./post.enums";

/**
 * 게시글 검색 파라미터
 */
export interface PostSearchParams {
  postType?: PostType;
  stack?: string;
  tag?: string;
  // TODO: [컬렉션 API 연결] 백엔드에서 ?collection=컬렉션명 쿼리 파라미터 지원 시 활성화
  // collection?: string;
  keyword?: string;
  page?: number;
  size?: number;
  sort?: string;
}

/**
 * 게시글 생성 요청 (Backend: PostRequest.Create)
 */
export interface CreatePostRequest {
  title: string;
  excerpt: string;
  postType: PostType;
  content: string;
  stacks: string[];
  tags: string[];
  thumbnailFileId?: number | null;
  thumbnailPath?: string | null;
  // TODO: [컬렉션 API 연결] 백엔드 CreatePostRequest에 컬렉션 필드 추가 시 아래 주석 해제
  // collectionId?: number | null;
  // newcollectionName?: string | null;
}

/**
 * 게시글 수정 요청 (Backend: PostRequest.Update)
 */
export interface UpdatePostRequest {
  title: string;
  excerpt: string;
  postType: PostType;
  content: string;
  stacks: string[];
  tags: string[];
  thumbnailFileId?: number | null;
  thumbnailPath?: string | null;
  removeThumbnail?: boolean;
  // TODO: [컬렉션 API 연결] 백엔드 UpdatePostRequest에 컬렉션 필드 추가 시 아래 주석 해제
  // collectionId?: number | null;
  // newcollectionName?: string | null;
}
