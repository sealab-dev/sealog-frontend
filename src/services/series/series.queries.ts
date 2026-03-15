import { useQuery } from '@tanstack/react-query';
import { archiveApi } from './series.api';
import { archiveKeys } from './series.keys';
import type { PageResponse } from '../core/client.types';
import type * as ArchiveResponse from './types/series.response';

/**
 * 사용자의 공개 아카이브 목록 조회
 * GET /api/guest/archive/{nickname}
 */
export const useGuestArchiveListQuery = (
  nickname: string,
  params?: { page?: number; size?: number },
) => {
  return useQuery({
    queryKey: [...archiveKeys.guestList(nickname), params],
    queryFn: () => archiveApi.getGuestList(nickname, params),
    staleTime: 1000 * 60 * 5,
    enabled: !!nickname,
  });
};

/**
 * 아카이브에 속한 공개 게시글 목록 조회
 * GET /api/guest/archive/{archiveId}/posts
 */
export const useGuestArchivePostsQuery = (
  archiveId: number,
  params?: { page?: number; size?: number },
) => {
  return useQuery({
    queryKey: [...archiveKeys.guestPosts(archiveId), params],
    queryFn: () => archiveApi.getGuestPosts(archiveId, params),
    staleTime: 1000 * 60 * 5,
    enabled: !!archiveId,
  });
};

/**
 * 내 아카이브 목록 조회
 * GET /api/user/archive
 */
export const useMyArchiveListQuery = (params?: { page?: number; size?: number }) => {
  return useQuery({
    queryKey: [...archiveKeys.myList(), params],
    queryFn: () => archiveApi.getMyList(params),
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * 내 아카이브 게시글 목록 조회
 * GET /api/user/archive/{archiveId}/posts
 */
export const useMyArchivePostsQuery = (
  archiveId: number,
  params?: { page?: number; size?: number },
) => {
  return useQuery({
    queryKey: [...archiveKeys.myPosts(archiveId), params],
    queryFn: () => archiveApi.getMyPosts(archiveId, params),
    staleTime: 1000 * 60 * 5,
    enabled: !!archiveId,
  });
};
