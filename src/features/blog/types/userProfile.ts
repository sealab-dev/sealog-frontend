import type { SocialType } from '../../../services/user/types/user.response';

export type SocialUIType = 'github' | 'portfolio' | 'notion' | 'linkedin' | 'youtube' | 'instagram';

export interface UserProfileSocial {
  type: SocialUIType;
  url: string;
  label: string;
}

export interface UserProfile {
  name: string;
  initial: string;
  profileImageUrl?: string | null;
  position?: string | null;
  bio: string;
  stats: { value: number; label: string }[];
  socials: UserProfileSocial[];
}

export interface SidebarStackItem {
  name: string;
  count: number;
}

export interface SidebarStackGroup {
  group: import('../../../services/stack/types/stack.enum').StackGroup;
  stacks: SidebarStackItem[];
}

export interface SidebarSeriesItem {
  name: string;
  count: number;
}

export const SOCIAL_ORDER: SocialType[] = [
  'GITHUB',
  'PORTFOLIO',
  'NOTION',
  'LINKEDIN',
  'YOUTUBE',
  'INSTAGRAM',
];

export const SOCIAL_LABEL: Record<SocialType, string> = {
  GITHUB: 'GitHub',
  PORTFOLIO: 'Portfolio',
  NOTION: 'Notion',
  LINKEDIN: 'LinkedIn',
  YOUTUBE: 'YouTube',
  INSTAGRAM: 'Instagram',
};

export function toSocialUIType(type: SocialType): SocialUIType {
  const map: Record<SocialType, SocialUIType> = {
    GITHUB: 'github',
    PORTFOLIO: 'portfolio',
    NOTION: 'notion',
    LINKEDIN: 'linkedin',
    YOUTUBE: 'youtube',
    INSTAGRAM: 'instagram',
  };
  return map[type];
}
