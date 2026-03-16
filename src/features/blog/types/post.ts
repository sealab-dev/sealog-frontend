export interface Author {
  name: string;
  nickname?: string;
  initial: string;
  profileImageUrl?: string | null;
}

export interface Post {
  id: number;
  slug: string;
  authorNickname: string;
  title: string;
  excerpt: string;
  thumbnailUrl?: string | null;
  stacks: string[];
  tags: string[];
  author: Author;
  date: string;
  seriesBadge?: string;
}

export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

export interface PostDetail {
  id: number;
  title: string;
  author: Author;
  date: string;
  readTime: number;
  stacks: string[];
  tags: string[];
  series?: { name: string; href: string };
  toc: TocItem[];
}