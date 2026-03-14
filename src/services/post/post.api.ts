import { client } from '../core/client';
import type { ApiResponse, PageResponse } from '../core/client.types';
import type * as PostRequest from './_types/post.request';
import type * as PostResponse from './_types/post.response';

export const postApi = {

  // ==================== Guest APIs ====================

  /**
   * 게시글 상세 조회 (Nickname + Slug 기반)
   * GET /api/guest/{nickname}/posts/{slug}
   */
  getDetail: async (nickname: string, slug: string): Promise<ApiResponse<PostResponse.Detail>> => {
    const response = await client.get<ApiResponse<PostResponse.Detail>>(`guest/${nickname}/posts/${slug}`);
    return response.data;
  },

  /**
   * 특정 사용자의 공개 게시글 목록 조회
   * GET /api/guest/{nickname}/posts
   */
  getUserPosts: async (
    nickname: string,
    params?: { page?: number; size?: number },
  ): Promise<ApiResponse<PageResponse<PostResponse.PostItems>>> => {
    const response = await client.get<ApiResponse<PageResponse<PostResponse.PostItems>>>(
      `/guest/${nickname}/posts`,
      { params },
    );
    return response.data;
  },

  /**
   * 전체 공개 게시글 목록 조회
   * GET /api/guest/posts
   */
  getPosts: async (params?: {
    page?: number;
    size?: number;
  }): Promise<ApiResponse<PageResponse<PostResponse.PostItems>>> => {
    const response = await client.get<ApiResponse<PageResponse<PostResponse.PostItems>>>(
      '/guest/posts',
      { params },
    );
    return response.data;
  },

  /**
   * 게시글 자동완성 검색
   * GET /api/guest/posts/autocomplete?keyword=검색어
   */
  autocomplete: async (keyword: string): Promise<ApiResponse<PostResponse.PostItems[]>> => {
    const response = await client.get<ApiResponse<PostResponse.PostItems[]>>(
      '/guest/posts/autocomplete',
      { params: { keyword } },
    );
    return response.data;
  },

  // ==================== User APIs ====================

  /**
   * 게시글 생성
   * POST /api/user/posts
   */
  create: async (
    request: PostRequest.Create,
    thumbnail?: File | null,
  ): Promise<ApiResponse<PostResponse.Detail>> => {
    const formData = new FormData();

    formData.append(
      'request',
      new Blob([JSON.stringify(request)], { type: 'application/json' }),
    );

    if (thumbnail) {
      formData.append('thumbnail', thumbnail);
    }

    const response = await client.post<ApiResponse<PostResponse.Detail>>(
      '/user/posts',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
    return response.data;
  },

  /**
   * 게시글 수정용 데이터 조회
   * GET /api/user/posts/{slug}
   */
  getEdit: async (slug: string): Promise<ApiResponse<PostResponse.Edit>> => {
    const response = await client.get<ApiResponse<PostResponse.Edit>>(`/user/posts/${slug}`);
    return response.data;
  },

  /**
   * 게시글 수정
   * PUT /api/user/posts/{postId}
   */
  update: async (
    postId: number,
    request: PostRequest.Update,
    thumbnail?: File | null,
  ): Promise<ApiResponse<PostResponse.Detail>> => {
    const formData = new FormData();

    formData.append(
      'request',
      new Blob([JSON.stringify(request)], { type: 'application/json' }),
    );

    if (thumbnail) {
      formData.append('thumbnail', thumbnail);
    }

    const response = await client.put<ApiResponse<PostResponse.Detail>>(
      `/user/posts/${postId}`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
    return response.data;
  },

  /**
   * 게시글 삭제 (소프트 삭제)
   * DELETE /api/user/posts/{postId}
   */
  delete: async (postId: number): Promise<void> => {
    await client.delete(`/user/posts/${postId}`);
  },

  /**
   * 게시글 복구
   * PATCH /api/user/posts/{postId}/restore
   */
  restore: async (postId: number): Promise<ApiResponse<void>> => {
    const response = await client.patch<ApiResponse<void>>(`/user/posts/${postId}/restore`);
    return response.data;
  },

  /**
   * 삭제된 게시글 목록 조회
   * GET /api/user/posts/deleted
   */
  getDeleted: async (params?: {
    page?: number;
    size?: number;
  }): Promise<ApiResponse<PageResponse<PostResponse.PostItems>>> => {
    const response = await client.get<ApiResponse<PageResponse<PostResponse.PostItems>>>(
      '/user/posts/deleted',
      { params },
    );
    return response.data;
  },
};
