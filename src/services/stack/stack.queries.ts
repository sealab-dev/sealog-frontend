import { useQuery } from '@tanstack/react-query';
import { stackApi } from './stack.api';
import { stackKeys } from './stack.keys';
import type { ApiResponse, PageResponse } from '../core/client.types';
import type * as StackResponse from './_types/stack.response';

/**
 * 사용자의 그룹별 스택 목록 조회
 * GET /api/guest/stacks/grouped/user/{nickname}
 */
export const useGroupedStacksByUserQuery = (nickname: string) => {
  return useQuery({
    queryKey: stackKeys.groupedByUser(nickname),
    queryFn: () => stackApi.getGroupedByUser(nickname),
    select: (response: ApiResponse<StackResponse.GroupedStacks>) => response.data,
    staleTime: 1000 * 60 * 5,
    enabled: !!nickname,
  });
};

/**
 * 스택 자동완성 검색
 * GET /api/guest/stacks/autocomplete?keyword=검색어
 */
export const useStackAutocompleteQuery = (keyword: string) => {
  return useQuery({
    queryKey: stackKeys.autocomplete(keyword),
    queryFn: () => stackApi.autocomplete(keyword),
    select: (response: ApiResponse<StackResponse.StackItem[]>) => response.data,
    staleTime: 1000 * 60,
    enabled: !!keyword,
  });
};

/**
 * 전체 스택 목록 조회 / 검색 (Admin)
 * GET /api/admin/stacks
 */
export const useAdminStackListQuery = (params?: {
  keyword?: string;
  page?: number;
  size?: number;
}) => {
  return useQuery({
    queryKey: stackKeys.adminList(params?.keyword),
    queryFn: () => stackApi.getAll(params),
    select: (response: ApiResponse<PageResponse<StackResponse.StackItem>>) => response.data,
    staleTime: 1000 * 60 * 5,
  });
};
