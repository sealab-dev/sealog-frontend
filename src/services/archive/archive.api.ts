import { client } from '../core/client';
import type { ApiResponse, PageResponse } from '../core/client.types';
import type * as ArchiveRequest from './_types/archive.request';
import type * as ArchiveResponse from './_types/archive.response';

export const archiveApi = {

  // ==================== Guest APIs ====================

  /**
   * 사용자의 공개 아카이브 목록 조회
   * GET /api/guest/archive/{nickname}
   */
  getGuestList: async (
    nickname: string,
    params?: { page?: number; size?: number },
  ): Promise<ApiResponse<PageResponse<ArchiveResponse.ArchiveItems>>> => {
    const response = await client.get<ApiResponse<PageResponse<ArchiveResponse.ArchiveItems>>>(
      `guest/archive/${nickname}`,
      { params },
    );
    return response.data;
  },

  /**
   * 아카이브에 속한 공개 게시글 목록 조회
   * GET /api/guest/archive/{archiveId}/posts
   */
  getGuestPosts: async (
    archiveId: number,
    params?: { page?: number; size?: number },
  ): Promise<ApiResponse<PageResponse<ArchiveResponse.PostItems>>> => {
    const response = await client.get<ApiResponse<PageResponse<ArchiveResponse.PostItems>>>(
      `guest/archive/${archiveId}/posts`,
      { params },
    );
    return response.data;
  },

  // ==================== User APIs ====================

  /**
   * 내 아카이브 목록 조회
   * GET /api/user/archive
   */
  getMyList: async (
    params?: { page?: number; size?: number },
  ): Promise<ApiResponse<PageResponse<ArchiveResponse.ArchiveItems>>> => {
    const response = await client.get<ApiResponse<PageResponse<ArchiveResponse.ArchiveItems>>>(
      'user/archive',
      { params },
    );
    return response.data;
  },

  /**
   * 내 아카이브 게시글 목록 조회
   * GET /api/user/archive/{archiveId}/posts
   */
  getMyPosts: async (
    archiveId: number,
    params?: { page?: number; size?: number },
  ): Promise<ApiResponse<PageResponse<ArchiveResponse.PostItems>>> => {
    const response = await client.get<ApiResponse<PageResponse<ArchiveResponse.PostItems>>>(
      `user/archive/${archiveId}/posts`,
      { params },
    );
    return response.data;
  },

  /**
   * 아카이브 생성
   * POST /api/user/archive
   */
  create: async (request: ArchiveRequest.Create): Promise<ApiResponse<void>> => {
    const response = await client.post<ApiResponse<void>>('user/archive', request);
    return response.data;
  },

  /**
   * 아카이브 수정
   * PUT /api/user/archive/{nickname}/{slug}
   */
  update: async (
    nickname: string,
    slug: string,
    request: ArchiveRequest.Update,
  ): Promise<ApiResponse<void>> => {
    const response = await client.put<ApiResponse<void>>(
      `user/archive/${nickname}/${slug}`,
      request,
    );
    return response.data;
  },

  /**
   * 아카이브 공개
   * PATCH /api/user/archive/{nickname}/{slug}/show
   */
  show: async (nickname: string, slug: string): Promise<ApiResponse<void>> => {
    const response = await client.patch<ApiResponse<void>>(
      `user/archive/${nickname}/${slug}/show`,
    );
    return response.data;
  },

  /**
   * 아카이브 비공개
   * PATCH /api/user/archive/{nickname}/{slug}/hide
   */
  hide: async (nickname: string, slug: string): Promise<ApiResponse<void>> => {
    const response = await client.patch<ApiResponse<void>>(
      `user/archive/${nickname}/${slug}/hide`,
    );
    return response.data;
  },

  /**
   * 아카이브 삭제
   * DELETE /api/user/archive/{nickname}/{slug}
   */
  delete: async (nickname: string, slug: string): Promise<ApiResponse<void>> => {
    const response = await client.delete<ApiResponse<void>>(
      `user/archive/${nickname}/${slug}`,
    );
    return response.data;
  },

  /**
   * 게시글 아카이브 배정
   * PATCH /api/user/archive/{archiveId}/post/{postId}
   */
  changePostArchive: async (archiveId: number, postId: number): Promise<ApiResponse<void>> => {
    const response = await client.patch<ApiResponse<void>>(
      `user/archive/${archiveId}/post/${postId}`,
    );
    return response.data;
  },

  /**
   * 게시글 아카이브 해제
   * DELETE /api/user/archive/post/{postId}
   */
  deletePostArchive: async (postId: number): Promise<ApiResponse<void>> => {
    const response = await client.delete<ApiResponse<void>>(
      `user/archive/post/${postId}`,
    );
    return response.data;
  },
};
