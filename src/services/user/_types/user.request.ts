import type { SocialType } from "./user.enum";

/**
 * 소셜 링크 단건
 */
export interface UpdateSocialLink {
  socialType: SocialType;
  url: string;
}

/**
 * 프로필 수정
 * - multipart/form-data 로 전송 (JSON part: "request", 이미지 part: "profileImage")
 */
export interface UpdateProfile {
  nickname?: string;
  position?: string;
  about?: string;
  removeProfileImage?: boolean;
  socialLinks?: UpdateSocialLink[] | null; // null: 변경 없음, []: 전체 삭제
}

/**
 * 비밀번호 변경
 */
export interface UpdatePassword {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
}