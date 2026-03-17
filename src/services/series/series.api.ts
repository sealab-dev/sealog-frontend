import { client } from '../core/client';
import type { PageResponse } from '../core/client.types';
import type * as SeriesRequest from './types/series.request';
import type * as SeriesResponse from './types/series.response';

export const seriesApi = {

  // ==================== Guest APIs ====================

  /**
   * 유저의 공개 시리즈 목록 조회
   * GET /api/{nickname}/series
   */
  getGuestList: (
    nickname: string,
    params?: { page?: number; size?: number },
  ): Promise<PageResponse<SeriesResponse.SeriesItem>> => {
    return client.get(`/${nickname}/series`, { params });
  },

  /**
   * 시리즈 내 공개 게시글 목록 조회
   * GET /api/{nickname}/series/{slug}
   */
  getGuestPosts: (
    nickname: string,
    slug: string,
    params?: { page?: number; size?: number },
  ): Promise<PageResponse<SeriesResponse.SeriesPostItem>> => {
    return client.get(`/${nickname}/series/${slug}`, { params });
  },

  // ==================== User APIs ====================

  /**
   * 내 시리즈 목록 조회
   * GET /api/me/series
   */
  getMyList: (
    params?: { page?: number; size?: number },
  ): Promise<PageResponse<SeriesResponse.MySeriesItem>> => {
    return client.get('/me/series', { params });
  },

  /**
   * 내 시리즈 상세/게시글 목록 조회
   * GET /api/me/series/{slug}
   */
  getMyPosts: (
    slug: string,
    params?: { page?: number; size?: number },
  ): Promise<PageResponse<SeriesResponse.MySeriesPostItem>> => {
    return client.get(`/me/series/${slug}`, { params });
  },

  /**
   * 시리즈 생성
   * POST /api/me/series
   */
  create: (request: SeriesRequest.Create): Promise<void> => {
    return client.post('/me/series', request);
  },

  /**
   * 시리즈 수정
   * PUT /api/me/series/{seriesId}
   */
  update: (
    seriesId: number,
    request: SeriesRequest.Update,
  ): Promise<void> => {
    return client.put(`/me/series/${seriesId}`, request);
  },

  /**
   * 시리즈 삭제
   * DELETE /api/me/series/{seriesId}
   */
  delete: (seriesId: number): Promise<void> => {
    return client.delete(`/me/series/${seriesId}`);
  },

  /**
   * 시리즈 공개 처리
   * PATCH /api/me/series/{seriesId}/show
   */
  show: (seriesId: number): Promise<void> => {
    return client.patch(`/me/series/${seriesId}/show`);
  },

  /**
   * 시리즈 비공개 처리
   * PATCH /api/me/series/{seriesId}/hide
   */
  hide: (seriesId: number): Promise<void> => {
    return client.patch(`/me/series/${seriesId}/hide`);
  },
};
