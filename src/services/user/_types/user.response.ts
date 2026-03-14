import type { SocialType, UserRole } from "./user.enum";

/**
 * 소셜 링크 단건 응답
 */
export interface SocialLinkItem {
  socialType: SocialType;
  url: string;
}

/**
 * 내 프로필 응답
 */
export interface MyProfile {
  id: number;
  email: string;
  name: string;
  nickname: string;
  role: UserRole;
  position: string | null;
  about: string | null;
  profileImageUrl: string | null;  // profileImagePath → profileImageUrl
  socialLinks: SocialLinkItem[];   // 추가
}

/**
 * 공개 프로필 응답
 */
export interface PublicProfile {
  nickname: string;
  profileImageUrl: string | null;  // profileImagePath → profileImageUrl
  position: string | null;
  about: string | null;
  socialLinks: SocialLinkItem[];   // 추가
}