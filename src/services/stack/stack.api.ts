import { client } from '../core/client';
import type { PageResponse } from '../core/client.types';
import type * as StackRequest from './types/stack.request';
import type * as StackResponse from './types/stack.response';

export const stackApi = {

  // ==================== Guest APIs ====================

  /**
   * 그룹별 스택 목록 조회 (사용자별)
   * GET /api/stacks/user/{nickname}
   */
  getGroupedByUser: (nickname: string): Promise<StackResponse.GroupedStacks> => {
    return client.get(`/stacks/user/${nickname}`);
  },

  /**
   * 스택 자동완성 검색
   * GET /api/stacks/search?keyword=검색어
   */
  searchStackByName: (keyword: string): Promise<StackResponse.StackItem[]> => {
    return client.get('/stacks/search', { params: { keyword } });
  },

  // ==================== Admin APIs ====================

  /**
   * 전체 기술 스택 목록 조회 (페이징)
   * GET /api/admin/stacks?keyword=java&page=0&size=20
   */
  getAll: (params?: {
    keyword?: string;
    page?: number;
    size?: number;
  }): Promise<PageResponse<StackResponse.StackItem>> => {
    return client.get('/admin/stacks', { params });
  },

  /**
   * 신규 기술 스택 생성
   * POST /api/admin/stacks
   */
  create: (request: StackRequest.Create): Promise<StackResponse.StackItem> => {
    return client.post('/admin/stacks', request);
  },

  /**
   * 기술 스택 정보 수정
   * PUT /api/admin/stacks/{stackId}
   */
  update: (
    stackId: number,
    request: StackRequest.Update,
  ): Promise<StackResponse.StackItem> => {
    return client.put(`/admin/stacks/${stackId}`, request);
  },

  /**
   * 기술 스택 삭제
   * DELETE /api/admin/stacks/{stackId}
   */
  delete: (stackId: number): Promise<void> => {
    return client.delete(`/api/admin/stacks/${stackId}`);
  },
};
