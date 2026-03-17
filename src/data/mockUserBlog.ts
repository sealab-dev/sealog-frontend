import type { Post } from '../features/blog/types/post';
import type {
  UserProfile,
  SidebarStackItem,
  SidebarSeriesItem,
  SidebarStackGroup,
} from '../features/blog/types/userProfile';

export const mockUserProfile: UserProfile = {
  name: '김해린',
  initial: '김',
  bio: '바다처럼 깊은 기술을 탐구하는 프론트엔드 개발자 · React와 TypeScript를 주로 사용하며 좋은 사용자 경험을 만드는 데 관심이 많습니다 🌊',
  stats: [
    { value: 24, label: '게시글' },
    { value: 5, label: '시리즈' },
  ],
  socials: [
    { type: 'github', url: '#', label: 'GitHub' },
    { type: 'linkedin', url: '#', label: 'LinkedIn' },
    { type: 'link', url: '#', label: 'Blog' },
  ],
  stacks: ['React', 'TypeScript', 'Vite', 'Node.js'],
};

export const mockSidebarStacks: SidebarStackItem[] = [
  { name: '전체', count: 24 },
  { name: 'React', count: 10 },
  { name: 'TypeScript', count: 8 },
  { name: 'Vite', count: 4 },
  { name: 'Node.js', count: 2 },
];

export const mockGroupedSidebarStacks: SidebarStackGroup[] = [
  {
    group: 'LANGUAGE',
    stacks: [
      { name: 'TypeScript', count: 8 },
      { name: 'Java', count: 3 },
      { name: 'Python', count: 2 },
    ],
  },
  {
    group: 'FRAMEWORK',
    stacks: [
      { name: 'React', count: 10 },
      { name: 'Next.js', count: 5 },
      { name: 'Node.js', count: 2 },
    ],
  },
  {
    group: 'LIBRARY',
    stacks: [
      { name: 'TanStack Query', count: 4 },
      { name: 'Zustand', count: 3 },
    ],
  },
  {
    group: 'DATABASE',
    stacks: [
      { name: 'PostgreSQL', count: 2 },
      { name: 'Redis', count: 1 },
    ],
  },
  {
    group: 'DEVOPS',
    stacks: [
      { name: 'Docker', count: 3 },
      { name: 'GitHub Actions', count: 2 },
    ],
  },
  {
    group: 'KNOWLEDGE',
    stacks: [
      { name: 'CS 기초', count: 2 },
      { name: '알고리즘', count: 1 },
    ],
  },
  {
    group: 'TOOL',
    stacks: [
      { name: 'Vite', count: 4 },
      { name: 'ESLint', count: 1 },
    ],
  },
  {
    group: 'ETC',
    stacks: [{ name: '회고', count: 2 }],
  },
];

export const mockSidebarSeries: SidebarSeriesItem[] = [
  { name: 'React 완전 정복', count: 6 },
  { name: 'TypeScript 깊이 파기', count: 5 },
  { name: '빌드 툴 마스터하기', count: 4 },
  { name: '성능 최적화 일지', count: 3 },
  { name: 'CSS 모던 테크닉', count: 3 },
];

export const mockUserPosts: Post[] = [
  {
    id: 1,
    title: 'React Query로 서버 상태 관리 완벽 정리',
    excerpt: '캐싱 전략부터 낙관적 업데이트까지, 실무에서 바로 쓸 수 있는 TanStack Query 패턴들.',
    stacks: ['React'],
    tags: ['#상태관리', '#TanStack'],
    author: { name: '김해린', initial: '김' },
    date: '2026-03-05',
    seriesBadge: 'React 완전 정복 · 6',
  },
  {
    id: 2,
    title: 'TypeScript 제네릭 — 타입 시스템을 제대로 다루는 법',
    excerpt: '타입 추론을 극대화하면서 재사용성을 높이는 제네릭 패턴을 깊이 있게 다룹니다.',
    stacks: ['TypeScript'],
    tags: ['#제네릭', '#타입추론'],
    author: { name: '김해린', initial: '김' },
    date: '2026-03-04',
  },
  {
    id: 3,
    title: 'Vite 플러그인 시스템을 직접 만들어보며 이해하기',
    excerpt: 'Rollup 기반의 Vite 플러그인 API를 분석하고 커스텀 플러그인을 제작하는 전 과정.',
    stacks: ['Vite'],
    tags: ['#빌드툴', '#플러그인'],
    author: { name: '김해린', initial: '김' },
    date: '2026-03-02',
    seriesBadge: '빌드 툴 마스터하기 · 3',
  },
  {
    id: 4,
    title: '모노레포 환경에서 Vite + React 세팅 A to Z',
    excerpt: 'pnpm workspace 기반 모노레포에서 멀티 패키지 프로젝트 구성 방법.',
    stacks: ['React', 'TypeScript'],
    tags: ['#모노레포', '#pnpm'],
    author: { name: '김해린', initial: '김' },
    date: '2026-02-28',
  },
  {
    id: 5,
    title: 'React 렌더링 최적화 — memo, useMemo, useCallback 제대로 쓰기',
    excerpt: '불필요한 리렌더링을 막는 메모이제이션 전략과 실제로 효과 있는 케이스들.',
    stacks: ['React'],
    tags: ['#최적화', '#렌더링'],
    author: { name: '김해린', initial: '김' },
    date: '2026-02-25',
    seriesBadge: '성능 최적화 일지 · 2',
  },
  {
    id: 6,
    title: 'Node.js 스트림으로 대용량 파일 처리하기',
    excerpt: '스트림 파이프라인으로 메모리를 최소화하면서 수 GB 파일을 처리하는 방법.',
    stacks: ['Node.js'],
    tags: ['#스트림', '#성능'],
    author: { name: '김해린', initial: '김' },
    date: '2026-02-20',
  },
];
