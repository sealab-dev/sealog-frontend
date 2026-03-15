import type { StackGroup } from './stack.enum';

/**
 * 스택 기본 정보
 */
export interface StackItem {
  id: number;
  name: string;
  stackGroup: StackGroup;
}

/**
 * 스택 + 게시글 수
 */
export interface StackWithCount {
  id: number;
  name: string;
  stackGroup: StackGroup;
  postCount: number;
}

/**
 * 그룹별 스택 목록
 */
export interface GroupedStacks {
  groupedTags: Partial<Record<StackGroup, StackWithCount[]>>;
}
