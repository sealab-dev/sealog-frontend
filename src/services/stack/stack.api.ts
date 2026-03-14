import { client } from '../core/client';
import type { ApiResponse, PageResponse } from '../core/client.types';
import type * as StackRequest from './_types/stack.request';
import type * as StackResponse from './_types/stack.response';

export const stackApi = {

  // ==================== Guest APIs ====================

  /**
   * 사용자의 그룹별 스택 목록 조회 (게시글 수 포함)
   * GET /api/guest/stacks/grouped/user/{nickname}
   */
  getGroupedByUser: async (nickname: string): Promise<ApiResponse<StackResponse.GroupedStacks>> => {
    const response = await client.get<ApiResponse<StackResponse.GroupedStacks>>(
      `guest/stacks/grouped/user/${nickname}`,
    );
    return response.data;
  },

  /**
   * 스택 자동완성 검색
   * GET /api/guest/stacks/autocomplete?keyword=검색어
   */
  autocomplete: async (keyword: string): Promise<ApiResponse<StackResponse.StackItem[]>> => {
    const response = await client.get<ApiResponse<StackResponse.StackItem[]>>(
      'guest/stacks/autocomplete',
      { params: { keyword } },
    );
    return response.data;
  },

  // ==================== Admin APIs ====================

  /**
   * 전체 스택 목록 조회 / 검색 (페이지네이션)
   * GET /api/admin/stacks?keyword=java&page=0&size=20
   */
  getAll: async (params?: {
    keyword?: string;
    page?: number;
    size?: number;
  }): Promise<ApiResponse<PageResponse<StackResponse.StackItem>>> => {
    const response = await client.get<ApiResponse<PageResponse<StackResponse.StackItem>>>(
      'admin/stacks',
      { params },
    );
    return response.data;
  },

  /**
   * 스택 생성
   * POST /api/admin/stacks
   */
  create: async (request: StackRequest.Create): Promise<ApiResponse<StackResponse.StackItem>> => {
    const response = await client.post<ApiResponse<StackResponse.StackItem>>(
      'admin/stacks',
      request,
    );
    return response.data;
  },

  /**
   * 스택 수정
   * PUT /api/admin/stacks/{stackId}
   */
  update: async (
    stackId: number,
    request: StackRequest.Update,
  ): Promise<ApiResponse<StackResponse.StackItem>> => {
    const response = await client.put<ApiResponse<StackResponse.StackItem>>(
      `admin/stacks/${stackId}`,
      request,
    );
    return response.data;
  },

  /**
   * 스택 삭제
   * DELETE /api/admin/stacks/{stackId}
   */
  delete: async (stackId: number): Promise<void> => {
    await client.delete(`admin/stacks/${stackId}`);
  },
};
