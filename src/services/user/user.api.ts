import { client } from '../core/client';
import type { ApiResponse } from '../core/client.types';
import type * as UserRequest from './_types/user.request';
import type * as UserResponse from './_types/user.response';

export const userApi = {

  // ==================== Guest APIs ====================

  /**
   * 블로그 사용자 프로필 정보 조회
   * GET /api/guest/user/{nickname}/profile
   */
  getPublicProfile: async (nickname: string): Promise<ApiResponse<UserResponse.PublicProfile>> => {
    const response = await client.get<ApiResponse<UserResponse.PublicProfile>>(`/guest/user/${nickname}/profile`);
    return response.data;
  },

  // ==================== User APIs ====================

  /**
   * 내 프로필 정보 조회
   * GET /api/user/me/profile
   */
  getMyProfile: async (): Promise<ApiResponse<UserResponse.MyProfile>> => {
    const response = await client.get<ApiResponse<UserResponse.MyProfile>>('/user/me/profile');
    return response.data;
  },

  /**
   * 프로필 수정
   * PATCH /api/user/me/profile
   * - multipart/form-data 전송: JSON → "request" part, 이미지 → "profileImage" part
   */
  updateProfile: async (
    request: UserRequest.UpdateProfile,
    profileImage?: File | null,
  ): Promise<ApiResponse<UserResponse.MyProfile>> => {
    const formData = new FormData();

    formData.append(
      'request',
      new Blob([JSON.stringify(request)], { type: 'application/json' }),
    );

    if (profileImage) {
      formData.append('profileImage', profileImage);
    }

    const response = await client.patch<ApiResponse<UserResponse.MyProfile>>(
      'user/me/profile',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
    return response.data;
  },

  /**
   * 비밀번호 변경
   * PATCH /api/user/me/password
   */
  updatePassword: async (request: UserRequest.UpdatePassword): Promise<ApiResponse<void>> => {
    const response = await client.patch<ApiResponse<void>>('user/me/password', request);
    return response.data;
  },
};