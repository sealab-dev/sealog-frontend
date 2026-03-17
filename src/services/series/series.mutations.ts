import { useMutation, useQueryClient } from '@tanstack/react-query';
import { seriesApi } from './series.api';
import { seriesKeys } from './series.keys';
import type * as SeriesRequest from './types/series.request';

/**
 * 시리즈 생성 mutation
 */
export const useCreateSeriesMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: SeriesRequest.Create) => seriesApi.create(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: seriesKeys.myList() });
    },
  });
};

/**
 * 시리즈 수정 mutation
 */
export const useUpdateSeriesMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ seriesId, request }: { seriesId: number; request: SeriesRequest.Update }) =>
      seriesApi.update(seriesId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: seriesKeys.myList() });
    },
  });
};

/**
 * 시리즈 삭제 mutation
 */
export const useDeleteSeriesMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (seriesId: number) => seriesApi.delete(seriesId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: seriesKeys.myList() });
    },
  });
};

/**
 * 시리즈 공개 처리 mutation
 */
export const useShowSeriesMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (seriesId: number) => seriesApi.show(seriesId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: seriesKeys.myList() });
    },
  });
};

/**
 * 시리즈 비공개 처리 mutation
 */
export const useHideSeriesMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (seriesId: number) => seriesApi.hide(seriesId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: seriesKeys.myList() });
    },
  });
};
