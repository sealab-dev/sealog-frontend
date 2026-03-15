import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { postApi } from './post.api';
import { postKeys } from './post.keys';
import type { PageResponse } from '../core/client.types';
import type * as PostResponse from './types/post.response';

/* 전체 게시글 목록 조회 */
export const usePostsQuery = (params?: { page?: number; size?: number }) => {
  return useQuery({
    queryKey: [...postKeys.posts(), params],
    queryFn: () => postApi.getPosts(params),
    staleTime: 1000 * 60 * 5,
  });
};

/* 특정 유저의 전체 게시글 목록 조회 */
export const useUserPostsQuery = (
  nickname: string,
  params?: { page?: number; size?: number },
) => {
  return useQuery({
    queryKey: [...postKeys.userPosts(nickname), params],
    queryFn: () => postApi.getUserPosts(nickname, params),
    staleTime: 1000 * 60 * 5,
    enabled: !!nickname,
  });
};

/* 특정 유저의 스택별 게시글 목록 조회 */
export const usePostsByStackQuery = (
  nickname: string,
  stackName: string,
  params?: { page?: number; size?: number },
) => {
  return useQuery({
    queryKey: [...postKeys.stackPosts(nickname, stackName), params],
    queryFn: () => postApi.getPostsByStack(nickname, stackName, params),
    staleTime: 1000 * 60 * 5,
    enabled: !!nickname && !!stackName,
  });
};

/* 전체 게시글 검색 */
export const useSearchPostsQuery = (keyword: string, params?: { page?: number; size?: number }) => {
  return useQuery({
    queryKey: [...postKeys.search(keyword), params],
    queryFn: () => postApi.searchPosts(keyword, params),
    staleTime: 1000 * 60 * 5,
    enabled: !!keyword,
  });
};

/* 특정 유저 전체 게시글 검색 */
export const useSearchUserPostsQuery = (nickname: string, keyword: string, params?: { page?: number; size?: number }) => {
  return useQuery({
    queryKey: [...postKeys.searchUser(nickname, keyword), params],
    queryFn: () => postApi.searchPostsByNickname(nickname, keyword, params),
    staleTime: 1000 * 60 * 5,
    enabled: !!nickname && !!keyword,
  });
};

/* 게시글 상세 조회 */
export const usePostDetailQuery = (nickname: string, slug: string) => {
  return useQuery({
    queryKey: postKeys.detail(nickname, slug),
    queryFn: () => postApi.getDetail(nickname, slug),
    staleTime: 1000 * 60 * 5,
    enabled: !!nickname && !!slug,
  });
};

/* 내 전체 게시글 검색 */
export const useSearchMyPostsQuery = (keyword: string, params?: { page?: number; size?: number }) => {
  return useQuery({
    queryKey: [...postKeys.searchMe(keyword), params],
    queryFn: () => postApi.searchMyPosts(keyword, params),
    staleTime: 1000 * 60 * 5,
    enabled: !!keyword,
  });
};

/* 게시글 수정용 데이터 조회회 */
export const usePostEditQuery = (slug: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: postKeys.edit(slug),
    queryFn: () => postApi.getEdit(slug),
    staleTime: 1000 * 60 * 5,
    enabled: !!slug,
    ...options,
  });
};

/* 전체 공개 게시글 무한 스크롤 조회 */
export const useInfinitePostsQuery = (size = 6) => {
  return useInfiniteQuery({
    queryKey: [...postKeys.posts(), { size }],
    queryFn: ({ pageParam }) => postApi.getPosts({ page: pageParam as number, size }),
    getNextPageParam: (lastPage) => {
      const { hasNext, currentPage } = lastPage;
      return hasNext ? currentPage + 1 : undefined;
    },
    initialPageParam: 0,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
};

/* 특정 사용자의 공개 게시글 무한 스크롤 조회 */
export const useInfiniteUserPostsQuery = (nickname: string, size = 6) => {
  return useInfiniteQuery({
    queryKey: [...postKeys.userPosts(nickname), { size }],
    queryFn: ({ pageParam }) => postApi.getUserPosts(nickname, { page: pageParam as number, size }),
    getNextPageParam: (lastPage) => {
      const { hasNext, currentPage } = lastPage;
      return hasNext ? currentPage + 1 : undefined;
    },
    initialPageParam: 0,
    staleTime: 1000 * 60 * 5,
    retry: false,
    enabled: !!nickname,
  });
};

/* 삭제된 게시글 목록 조회 */
export const useDeletedPostsQuery = (params?: { page?: number; size?: number }) => {
  return useQuery({
    queryKey: [...postKeys.deleted(), params],
    queryFn: () => postApi.getDeleted(params),
    staleTime: 0,
  });
};
