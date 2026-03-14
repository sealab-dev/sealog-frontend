import type { PostDetail } from '../features/blog/types/post';

export const mockPostDetail: PostDetail = {
  id: 1,
  title: 'React Query로 서버 상태 관리 완벽 정리',
  desc: '캐싱 전략부터 낙관적 업데이트까지, 실무에서 바로 쓸 수 있는 TanStack Query 패턴들을 깊이 있게 정리했습니다.',
  author: { name: '김해린', initial: '김' },
  date: '2026-03-05',
  readTime: 8,
  stacks: ['React', 'TypeScript'],
  tags: ['#상태관리', '#TanStack', '#비동기'],
  series: { name: 'React 완전 정복', href: '/series/react-mastery' },
  toc: [
    { id: 's1', text: '서버 상태란 무엇인가', level: 2 },
    { id: 's2', text: 'TanStack Query 기본 설정', level: 2 },
    { id: 's3', text: 'useQuery 핵심 패턴', level: 2 },
    { id: 's3-1', text: '쿼리 키 설계 전략', level: 3 },
    { id: 's4', text: '낙관적 업데이트', level: 2 },
    { id: 's5', text: '무한 스크롤 구현', level: 2 },
  ],
};
