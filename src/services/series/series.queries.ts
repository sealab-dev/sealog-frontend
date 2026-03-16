import { useQuery } from '@tanstack/react-query';
import { seriesApi } from './series.api';
import { seriesKeys } from './series.keys';

/**
 * 유저의 공개 시리즈 목록 조회
 */
export const useGuestSeriesListQuery = (
  nickname: string,
  params?: { page?: number; size?: number },
) => {
  return useQuery({
    queryKey: [...seriesKeys.guestList(nickname), params],
    queryFn: () => seriesApi.getGuestList(nickname, params),
    staleTime: 1000 * 60 * 5,
    enabled: !!nickname,
  });
};

/**
 * 시리즈 내 공개 게시글 목록 조회
 */
export const useGuestSeriesPostsQuery = (
  nickname: string,
  slug: string,
  params?: { page?: number; size?: number },
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: [...seriesKeys.guestPosts(nickname, slug), params],
    queryFn: () => seriesApi.getGuestPosts(nickname, slug, params),
    staleTime: 1000 * 60 * 5,
    enabled: (options?.enabled ?? true) && !!nickname && !!slug,
  });
};

/**
 * 내 시리즈 목록 조회
 */
export const useMySeriesListQuery = (params?: { page?: number; size?: number }) => {
  return useQuery({
    queryKey: params ? [...seriesKeys.myList(), params] : seriesKeys.myList(),
    queryFn: () => seriesApi.getMyList(params),
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * 내 시리즈 상세/게시글 목록 조회
 */
export const useMySeriesPostsQuery = (
  slug: string,
  params?: { page?: number; size?: number },
) => {
  return useQuery({
    queryKey: [...seriesKeys.myPosts(slug), params],
    queryFn: () => seriesApi.getMyPosts(slug, params),
    staleTime: 1000 * 60 * 5,
    enabled: !!slug,
  });
};
