import { useQuery } from '@tanstack/react-query';
import { userApi } from './user.api';
import { userKeys } from './user.keys';

/**
 * 블로그 사용자 정보 조회
 */
export const usePublicProfileQuery = (nickname: string) => {
  return useQuery({
    queryKey: userKeys.publicProfile(nickname),
    queryFn: () => userApi.getPublicProfile(nickname),
    staleTime: 1000 * 60 * 5,
    enabled: !!nickname,
  });
};

/**
 * 내 프로필 정보 조회
 */
export const useMyProfileQuery = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: userKeys.myProfile(),
    queryFn: () => userApi.getMyProfile(),
    staleTime: 1000 * 60 * 5,
    ...options,
  });
};
