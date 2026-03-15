import { client } from '../core/client';
import type { PageResponse } from '../core/client.types';
import type * as ArchiveRequest from './types/series.request';
import type * as ArchiveResponse from './types/series.response';

export const archiveApi = {

  // ==================== Guest APIs ====================

  /**
   * 사용자의 공개 아카이브 목록 조회
   * GET /api/guest/archive/{nickname}
   */
  getGuestList: (
    nickname: string,
    params?: { page?: number; size?: number },
  ): Promise<PageResponse<ArchiveResponse.ArchiveItems>> => {
    return client.get(`guest/archive/${nickname}`, { params });
  },

  /**
   * 아카이브에 속한 공개 게시글 목록 조회
   * GET /api/guest/archive/{archiveId}/posts
   */
  getGuestPosts: (
    archiveId: number,
    params?: { page?: number; size?: number },
  ): Promise<PageResponse<ArchiveResponse.PostItems>> => {
    return client.get(`guest/archive/${archiveId}/posts`, { params });
  },

  // ==================== User APIs ====================

  /**
   * 내 아카이브 목록 조회
   * GET /api/user/archive
   */
  getMyList: (
    params?: { page?: number; size?: number },
  ): Promise<PageResponse<ArchiveResponse.ArchiveItems>> => {
    return client.get('user/archive', { params });
  },

  /**
   * 내 아카이브 게시글 목록 조회
   * GET /api/user/archive/{archiveId}/posts
   */
  getMyPosts: (
    archiveId: number,
    params?: { page?: number; size?: number },
  ): Promise<PageResponse<ArchiveResponse.PostItems>> => {
    return client.get(`user/archive/${archiveId}/posts`, { params });
  },

  /**
   * 아카이브 생성
   * POST /api/user/archive
   */
  create: (request: ArchiveRequest.Create): Promise<void> => {
    return client.post('user/archive', request);
  },

  /**
   * 아카이브 수정
   * PUT /api/user/archive/{nickname}/{slug}
   */
  update: (
    nickname: string,
    slug: string,
    request: ArchiveRequest.Update,
  ): Promise<void> => {
    return client.put(`user/archive/${nickname}/${slug}`, request);
  },

  /**
   * 아카이브 공개
   * PATCH /api/user/archive/{nickname}/{slug}/show
   */
  show: (nickname: string, slug: string): Promise<void> => {
    return client.patch(`user/archive/${nickname}/${slug}/show`);
  },

  /**
   * 아카이브 비공개
   * PATCH /api/user/archive/{nickname}/{slug}/hide
   */
  hide: (nickname: string, slug: string): Promise<void> => {
    return client.patch(`user/archive/${nickname}/${slug}/hide`);
  },

  /**
   * 아카이브 삭제
   * DELETE /api/user/archive/{nickname}/{slug}
   */
  delete: (nickname: string, slug: string): Promise<void> => {
    return client.delete(`user/archive/${nickname}/${slug}`);
  },

  /**
   * 게시글 아카이브 배정
   * PATCH /api/user/archive/{archiveId}/post/{postId}
   */
  changePostArchive: (archiveId: number, postId: number): Promise<void> => {
    return client.patch(`user/archive/${archiveId}/post/${postId}`);
  },

  /**
   * 게시글 아카이브 해제
   * DELETE /api/user/archive/post/{postId}
   */
  deletePostArchive: (postId: number): Promise<void> => {
    return client.delete(`user/archive/post/${postId}`);
  },
};
