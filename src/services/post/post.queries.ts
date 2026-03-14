import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { postApi } from './post.api';
import { postKeys } from './post.keys';
import type { ApiResponse, PageResponse } from '../core/client.types';
import type * as PostResponse from './_types/post.response';

/**
 * 게시글 상세 조회
 * GET /api/guest/{nickname}/posts/{slug}
 */
export const usePostDetailQuery = (nickname: string, slug: string) => {
  return useQuery({
    queryKey: postKeys.detail(nickname, slug),
    queryFn: () => postApi.getDetail(nickname, slug),
    select: (response: ApiResponse<PostResponse.Detail>) => response.data,
    staleTime: 1000 * 60 * 5,
    enabled: !!nickname && !!slug,
  });
};

/**
 * 특정 사용자의 공개 게시글 목록 조회
 * GET /api/guest/{nickname}/posts
 */
export const useUserPostsQuery = (
  nickname: string,
  params?: { page?: number; size?: number },
) => {
  return useQuery({
    queryKey: [...postKeys.userPosts(nickname), params],
    queryFn: () => postApi.getUserPosts(nickname, params),
    select: (response: ApiResponse<PageResponse<PostResponse.PostItems>>) => response.data,
    staleTime: 1000 * 60 * 5,
    enabled: !!nickname,
  });
};

/**
 * 전체 공개 게시글 목록 조회
 * GET /api/guest/posts
 */
export const usePostsQuery = (params?: { page?: number; size?: number }) => {
  return useQuery({
    queryKey: [...postKeys.posts(), params],
    queryFn: () => postApi.getPosts(params),
    select: (response: ApiResponse<PageResponse<PostResponse.PostItems>>) => response.data,
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * 게시글 자동완성 검색
 * GET /api/guest/posts/autocomplete?keyword=검색어
 */
export const usePostAutocompleteQuery = (keyword: string) => {
  return useQuery({
    queryKey: postKeys.autocomplete(keyword),
    queryFn: () => postApi.autocomplete(keyword),
    select: (response: ApiResponse<PostResponse.PostItems[]>) => response.data,
    staleTime: 1000 * 60,
    enabled: !!keyword,
  });
};

/**
 * 게시글 수정용 데이터 조회
 * GET /api/user/posts/{slug}
 */
export const usePostEditQuery = (slug: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: postKeys.edit(slug),
    queryFn: () => postApi.getEdit(slug),
    select: (response: ApiResponse<PostResponse.Edit>) => response.data,
    staleTime: 1000 * 60 * 5,
    enabled: !!slug,
    ...options,
  });
};

/**
 * 전체 공개 게시글 무한 스크롤 조회 (홈 피드)
 * GET /api/guest/posts
 */
export const useInfinitePostsQuery = (size = 6) => {
  return useInfiniteQuery({
    queryKey: [...postKeys.posts(), { size }],
    queryFn: ({ pageParam }) => postApi.getPosts({ page: pageParam as number, size }),
    getNextPageParam: (lastPage) => {
      const { hasNext, currentPage } = lastPage.data;
      return hasNext ? currentPage + 1 : undefined;
    },
    initialPageParam: 0,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
};

/**
 * 특정 사용자의 공개 게시글 무한 스크롤 조회
 * GET /api/guest/{nickname}/posts
 */
export const useInfiniteUserPostsQuery = (nickname: string, size = 6) => {
  return useInfiniteQuery({
    queryKey: [...postKeys.userPosts(nickname), { size }],
    queryFn: ({ pageParam }) => postApi.getUserPosts(nickname, { page: pageParam as number, size }),
    getNextPageParam: (lastPage) => {
      const { hasNext, currentPage } = lastPage.data;
      return hasNext ? currentPage + 1 : undefined;
    },
    initialPageParam: 0,
    staleTime: 1000 * 60 * 5,
    retry: false,
    enabled: !!nickname,
  });
};

/**
 * 삭제된 게시글 목록 조회
 * GET /api/user/posts/deleted
 */
export const useDeletedPostsQuery = (params?: { page?: number; size?: number }) => {
  return useQuery({
    queryKey: [...postKeys.deleted(), params],
    queryFn: () => postApi.getDeleted(params),
    select: (response: ApiResponse<PageResponse<PostResponse.PostItems>>) => response.data,
    staleTime: 0,
  });
};
