import { client } from '../core/client';
import type { PageResponse } from '../core/client.types';
import type * as StackRequest from './types/stack.request';
import type * as StackResponse from './types/stack.response';

export const stackApi = {

  // ==================== Guest APIs ====================

  /**
   * 사용자의 그룹별 스택 목록 조회 (게시글 수 포함)
   * GET /api/{nickname}/stacks
   */
  getGroupedByUser: (nickname: string): Promise<StackResponse.GroupedStacks> => {
    return client.get(`/${nickname}/stacks`);
  },

  /**
   * 스택 검색
   * GET /api/stacks/search?keyword=검색어
   */
  searchStackByName: (keyword: string): Promise<StackResponse.StackItem[]> => {
    return client.get('/stacks/search', { params: { keyword } });
  },

  // ==================== Admin APIs ====================

  /**
   * 전체 스택 목록 조회 / 검색 (페이지네이션)
   * GET /api/admin/stacks?keyword=java&page=0&size=20
   */
  getAll: (params?: {
    keyword?: string;
    page?: number;
    size?: number;
  }): Promise<PageResponse<StackResponse.StackItem>> => {
    return client.get('admin/stacks', { params });
  },

  /**
   * 스택 생성
   * POST /api/admin/stacks
   */
  create: (request: StackRequest.Create): Promise<StackResponse.StackItem> => {
    return client.post('admin/stacks', request);
  },

  /**
   * 스택 수정
   * PUT /api/admin/stacks/{stackId}
   */
  update: (
    stackId: number,
    request: StackRequest.Update,
  ): Promise<StackResponse.StackItem> => {
    return client.put(`admin/stacks/${stackId}`, request);
  },

  /**
   * 스택 삭제
   * DELETE /api/admin/stacks/{stackId}
   */
  delete: (stackId: number): Promise<void> => {
    return client.delete(`admin/stacks/${stackId}`);
  },
};
