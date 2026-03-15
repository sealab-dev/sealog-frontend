import { client } from '../core/client';
import type * as UserRequest from './types/user.request';
import type * as UserResponse from './types/user.response';

export const userApi = {

  // ==================== Guest APIs ====================

  /**
   * 블로그 사용자 프로필 정보 조회
   * GET /api/{nickname}/profile
   */
  getPublicProfile: (nickname: string): Promise<UserResponse.PublicProfile> => {
    return client.get(`/${nickname}/profile`);
  },

  // ==================== User APIs ====================

  /**
   * 내 프로필 정보 조회
   * GET /api/me/profile
   */
  getMyProfile: (): Promise<UserResponse.MyProfile> => {
    return client.get('/me/profile');
  },

  /**
   * 프로필 수정
   * PATCH /api/me/profile
   * - multipart/form-data 전송: JSON → "request" part, 이미지 → "profileImage" part
   */
  updateProfile: (
    request: UserRequest.UpdateProfile,
    profileImage?: File | null,
  ): Promise<UserResponse.MyProfile> => {
    const formData = new FormData();

    formData.append(
      'request',
      new Blob([JSON.stringify(request)], { type: 'application/json' }),
    );

    if (profileImage) {
      formData.append('profileImage', profileImage);
    }

    return client.patch(
      '/me/profile',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
  },

  /**
   * 비밀번호 변경
   * PATCH /api/me/password
   */
  updatePassword: (request: UserRequest.UpdatePassword): Promise<void> => {
    return client.patch('/me/password', request);
  },

  // ==================== Admin APIs ====================

  /**
   * 사용자 생성
   * POST /api/admin/users
   */
  createUser: (request: UserRequest.Create): Promise<void> => {
    return client.post('/admin/users', request);
  },

};