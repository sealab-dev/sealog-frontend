import { useMutation, useQueryClient } from '@tanstack/react-query';
import { archiveApi } from './series.api';
import { archiveKeys } from './series.keys';
import type * as ArchiveRequest from './types/series.request';

/**
 * 아카이브 생성 mutation
 * POST /api/user/archive
 */
export const useCreateArchiveMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: ArchiveRequest.Create) => archiveApi.create(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: archiveKeys.myList() });
    },
  });
};

/**
 * 아카이브 수정 mutation
 * PUT /api/user/archive/{nickname}/{slug}
 */
export const useUpdateArchiveMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      nickname,
      slug,
      request,
    }: {
      nickname: string;
      slug: string;
      request: ArchiveRequest.Update;
    }) => archiveApi.update(nickname, slug, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: archiveKeys.myList() });
    },
  });
};

/**
 * 아카이브 공개 mutation
 * PATCH /api/user/archive/{nickname}/{slug}/show
 */
export const useShowArchiveMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ nickname, slug }: { nickname: string; slug: string }) =>
      archiveApi.show(nickname, slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: archiveKeys.myList() });
    },
  });
};

/**
 * 아카이브 비공개 mutation
 * PATCH /api/user/archive/{nickname}/{slug}/hide
 */
export const useHideArchiveMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ nickname, slug }: { nickname: string; slug: string }) =>
      archiveApi.hide(nickname, slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: archiveKeys.myList() });
    },
  });
};

/**
 * 아카이브 삭제 mutation
 * DELETE /api/user/archive/{nickname}/{slug}
 */
export const useDeleteArchiveMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ nickname, slug }: { nickname: string; slug: string }) =>
      archiveApi.delete(nickname, slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: archiveKeys.myList() });
    },
  });
};

/**
 * 게시글 아카이브 배정 mutation
 * PATCH /api/user/archive/{archiveId}/post/{postId}
 */
export const useChangePostArchiveMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ archiveId, postId }: { archiveId: number; postId: number }) =>
      archiveApi.changePostArchive(archiveId, postId),
    onSuccess: (_data, { archiveId }) => {
      queryClient.invalidateQueries({ queryKey: archiveKeys.myPosts(archiveId) });
    },
  });
};

/**
 * 게시글 아카이브 해제 mutation
 * DELETE /api/user/archive/post/{postId}
 */
export const useDeletePostArchiveMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: number) => archiveApi.deletePostArchive(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: archiveKeys.all });
    },
  });
};
