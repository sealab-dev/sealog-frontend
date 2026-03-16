import type { SocialType } from './user.enum';

/**
 * 프로필 수정 요청 (UpdateProfile)
 */
export interface UpdateProfile {
  nickname?: string;
  position?: string;
  about?: string;
  removeProfileImage?: boolean;
  socialLinks?: {
    socialType: SocialType;
    url: string;
  }[];
}

/**
 * 비밀번호 변경 요청 (UpdatePassword)
 */
export interface UpdatePassword {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
}

/**
 * 사용자 생성 요청 (Create - Admin용)
 */
export interface CreateUser {
  email: string;
  password: string;
  name: string;
  nickname: string;
}
