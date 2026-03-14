import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postApi } from './post.api';
import { postKeys } from './post.keys';
import type * as PostRequest from './_types/post.request';

/**
 * 게시글 생성 mutation
 * POST /api/user/posts
 */
export const useCreatePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      request,
      thumbnail,
    }: {
      request: PostRequest.Create;
      thumbnail?: File | null;
    }) => postApi.create(request, thumbnail),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.posts() });
    },
  });
};

/**
 * 게시글 수정 mutation
 * PUT /api/user/posts/{postId}
 */
export const useUpdatePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      postId,
      request,
      thumbnail,
    }: {
      postId: number;
      request: PostRequest.Update;
      thumbnail?: File | null;
    }) => postApi.update(postId, request, thumbnail),
    onSuccess: (data) => {
      if (data.data) {
        const { author, slug } = data.data;
        queryClient.invalidateQueries({ queryKey: postKeys.detail(author.nickname, slug) });
        queryClient.invalidateQueries({ queryKey: postKeys.edit(slug) });
        queryClient.invalidateQueries({ queryKey: postKeys.posts() });
      }
    },
  });
};

/**
 * 게시글 삭제 mutation (소프트 삭제)
 * DELETE /api/user/posts/{postId}
 */
export const useDeletePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: number) => postApi.delete(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.posts() });
      queryClient.invalidateQueries({ queryKey: postKeys.deleted() });
    },
  });
};

/**
 * 게시글 복구 mutation
 * PATCH /api/user/posts/{postId}/restore
 */
export const useRestorePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: number) => postApi.restore(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.posts() });
      queryClient.invalidateQueries({ queryKey: postKeys.deleted() });
    },
  });
};
