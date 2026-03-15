import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postApi } from './post.api';
import { postKeys } from './post.keys';
import type * as PostRequest from './types/post.request';

/**
 * 게시글 생성 mutation
 * POST /api/me/posts
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
      queryClient.invalidateQueries({ queryKey: postKeys.all });
    },
  });
};

/**
 * 게시글 수정 mutation
 * PUT /api/me/posts/{postId}
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
      const { author, slug } = data;
      queryClient.invalidateQueries({ queryKey: postKeys.detail(author.nickname, slug) });
      queryClient.invalidateQueries({ queryKey: postKeys.edit(slug) });
      queryClient.invalidateQueries({ queryKey: postKeys.posts() });
      queryClient.invalidateQueries({ queryKey: postKeys.userPosts(author.nickname) });
    },
  });
};

/**
 * 게시글 삭제 mutation (소프트 삭제)
 * DELETE /api/me/posts/{postId}
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
 * PATCH /api/me/posts/{postId}/restore
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