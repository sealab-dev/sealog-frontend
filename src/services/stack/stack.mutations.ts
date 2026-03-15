import { useMutation, useQueryClient } from '@tanstack/react-query';
import { stackApi } from './stack.api';
import { stackKeys } from './stack.keys';
import type * as StackRequest from './types/stack.request';

/**
 * 스택 생성 mutation (Admin)
 * POST /api/admin/stacks
 */
export const useCreateStackMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: StackRequest.Create) => stackApi.create(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: stackKeys.all });
    },
  });
};

/**
 * 스택 수정 mutation (Admin)
 * PUT /api/admin/stacks/{stackId}
 */
export const useUpdateStackMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ stackId, request }: { stackId: number; request: StackRequest.Update }) =>
      stackApi.update(stackId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: stackKeys.all });
    },
  });
};

/**
 * 스택 삭제 mutation (Admin)
 * DELETE /api/admin/stacks/{stackId}
 */
export const useDeleteStackMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (stackId: number) => stackApi.delete(stackId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: stackKeys.all });
    },
  });
};
