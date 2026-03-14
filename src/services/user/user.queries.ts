import { useQuery } from '@tanstack/react-query';
import { userApi } from './user.api';
import { userKeys } from './user.keys';
import type { ApiResponse } from '../core/client.types';
import type * as UserResponse from './_types/user.response';

/**
 * 블로그 사용자 정보 조회
 */
export const usePublicProfileQuery = (nickname: string) => {
  return useQuery({
    queryKey: userKeys.publicProfile(nickname),
    queryFn: () => userApi.getPublicProfile(nickname),
    select: (response: ApiResponse<UserResponse.PublicProfile>) => response.data,
    staleTime: 1000 * 60 * 5,
    enabled: !!nickname,
  });
};

/**
 * 내 정보 조회
 * GET /api/user/me
 */
export const useMyProfileQuery = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: userKeys.myProfile(),
    queryFn: () => userApi.getMyProfile(),
    select: (response: ApiResponse<UserResponse.MyProfile>) => response.data,
    staleTime: 1000 * 60 * 5,
    ...options,
  });
};
