/**
 * 소셜 링크 타입 (이넘)
 */
export type SocialType = 'GITHUB' | 'NOTION' | 'PORTFOLIO' | 'LINKEDIN' | 'YOUTUBE' | 'INSTAGRAM';

/**
 * 소셜 링크 아이템
 */
export interface SocialLinkItem {
  socialType: SocialType;
  url: string;
}

/**
 * 내 프로필 정보 응답 (MyProfile)
 */
export interface MyProfile {
  id: number;
  email: string;
  name: string;
  nickname: string;
  position: string | null;
  about: string | null;
  profileImageUrl: string | null;
  socialLinks: SocialLinkItem[];
}

/**
 * 공개 사용자 프로필 정보 응답 (UserProfile)
 */
export interface UserProfile {
  nickname: string;
  position: string | null;
  profileImageUrl: string | null;
  about: string | null;
  socialLinks: SocialLinkItem[];
}
