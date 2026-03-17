import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from './user.api';
import { userKeys } from './user.keys';
import { useAuthStore } from '../../store/authStore';
import type * as UserRequest from './types/user.request';

/**
 * 프로필 수정 mutation
 */
export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();
  const { user, setUser } = useAuthStore();

  return useMutation({
    mutationFn: ({
      request,
      profileImage,
    }: {
      request: UserRequest.UpdateProfile;
      profileImage?: File | null;
    }) => userApi.updateProfile(request, profileImage),
    onSuccess: (data) => {
      queryClient.setQueryData(userKeys.myProfile(), data);
      if (user) {
        setUser({
          ...user,
          nickname: data.nickname,
          profileImageUrl: data.profileImageUrl,
        });
      }
    },
  });
};

/**
 * 비밀번호 변경 mutation
 */
export const useUpdatePasswordMutation = () => {
  return useMutation({
    mutationFn: (request: UserRequest.UpdatePassword) => userApi.updatePassword(request),
  });
};

/**
 * 사용자 생성 mutation (Admin)
 */
export const useCreateUserMutation = () => {
  return useMutation({
    mutationFn: (request: UserRequest.CreateUser) => userApi.createUser(request),
  });
};
