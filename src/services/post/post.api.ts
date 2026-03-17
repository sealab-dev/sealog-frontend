import { client } from '../core/client';
import type { PageResponse } from '../core/client.types';
import type * as PostRequest from './types/post.request';
import type * as PostResponse from './types/post.response';

export const postApi = {

  // ==================== Guest APIs ====================

  /**
   * 전체 공개 게시글 목록 조회
   * GET /api/posts
   */
  getPosts: (params?: {
    page?: number;
    size?: number;
  }): Promise<PageResponse<PostResponse.PostItem>> => {
    return client.get('/posts', { params });
  },

  /**
   * 유저의 전체 게시글 목록 조회
   * GET /api/{nickname}/posts
   */
  getUserPosts: (
    nickname: string,
    params?: { page?: number; size?: number },
  ): Promise<PageResponse<PostResponse.PostItem>> => {
    return client.get(`/${nickname}/posts`, { params });
  },

  /**
   * 유저의 스택별 게시글 목록 조회
   * GET /api/{nickname}/posts?stackName={stackName}
   */
  getPostsByStack: (
    nickname: string,
    stackName: string,
    params?: { page?: number; size?: number },
  ): Promise<PageResponse<PostResponse.PostItem>> => {
    return client.get(
      `/${nickname}/posts`,
      { params: { stackName, ...params } },
    );
  },

  /**
   * 공개 게시글 검색
   * GET /api/posts/search?keyword=검색어
   */
  searchPosts: (
    keyword: string,
    params?: { page?: number; size?: number }
  ): Promise<PageResponse<PostResponse.PostItem>> => {
    return client.get(
      '/posts/search',
      { params: { keyword, ...params } },
    );
  },

  /**
   * 유저의 공개 게시글 검색
   * GET /api/{nickname}/posts/search?keyword=검색어
   */
  searchPostsByNickname: (
    nickname: string,
    keyword: string,
    params?: { page?: number; size?: number }
  ): Promise<PageResponse<PostResponse.PostItem>> => {
    return client.get(
      `/${nickname}/posts/search`,
      { params: { keyword, ...params } },
    );
  },

  /**
   * 게시글 상세 조회 (Nickname + Slug 기반)
   * GET /api/{nickname}/posts/{slug}
   */
  getDetail: (nickname: string, slug: string): Promise<PostResponse.PostDetail> => {
    return client.get(`/${nickname}/posts/${slug}`);
  },

  // ==================== User APIs ====================

  /**
   * 내 게시글 검색 (DRAFT 포함)
   * GET /api/me/posts/search?keyword=검색어
   */
  searchMyPosts: (
    keyword: string,
    params?: { page?: number; size?: number }
  ): Promise<PageResponse<PostResponse.MyPostItem>> => {
    return client.get(
      '/me/posts/search',
      { params: { keyword, ...params } }
    );
  },

  /**
   * 내 전체 게시글 목록 조회 (DRAFT 포함)
   * GET /api/me/posts
   */
  getMyPosts: (params?: {
    page?: number;
    size?: number;
  }): Promise<PageResponse<PostResponse.MyPostItem>> => {
    return client.get('/me/posts', { params });
  },

  /**
   * 게시글 생성
   * POST /api/me/posts
   */
  create: (
    request: PostRequest.Create,
    thumbnail?: File | null,
  ): Promise<PostResponse.MyPostItem> => {
    const formData = new FormData();

    formData.append(
      'request',
      new Blob([JSON.stringify(request)], { type: 'application/json' }),
    );

    if (thumbnail) {
      formData.append('thumbnail', thumbnail);
    }

    return client.post(
      '/me/posts',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
  },

  /**
   * 게시글 수정용 데이터 조회
   * GET /api/me/posts/edit/{slug}
   */
  getEdit: (slug: string): Promise<PostResponse.MyPostEdit> => {
    return client.get(`/me/posts/edit/${slug}`);
  },

  /**
   * 게시글 수정
   * PUT /api/me/posts/{postId}
   */
  update: (
    postId: number,
    request: PostRequest.Update,
    thumbnail?: File | null,
  ): Promise<PostResponse.MyPostItem> => {
    const formData = new FormData();

    formData.append(
      'request',
      new Blob([JSON.stringify(request)], { type: 'application/json' }),
    );

    if (thumbnail) {
      formData.append('thumbnail', thumbnail);
    }

    return client.put(
      `/me/posts/${postId}`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
  },

  /**
   * 게시글 삭제 (소프트 삭제)
   * DELETE /api/me/posts/{postId}
   */
  delete: (postId: number): Promise<void> => {
    return client.delete(`/me/posts/${postId}`);
  },

  /**
   * 게시글 복구
   * PATCH /api/me/posts/{postId}/restore
   */
  restore: (postId: number): Promise<void> => {
    return client.patch(`/me/posts/${postId}/restore`);
  },

  /**
   * 삭제된 게시글 목록 조회
   * GET /api/me/posts/deleted
   */
  getDeleted: (params?: {
    page?: number;
    size?: number;
  }): Promise<PageResponse<PostResponse.MyPostItem>> => {
    return client.get(
      '/me/posts/deleted',
      { params },
    );
  },
};
