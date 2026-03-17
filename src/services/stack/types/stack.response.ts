import type { StackGroup } from "./stack.enum";

/**
 * 스택 아이템 (어드민용/기본)
 */
export interface StackItem {
  id: number;
  name: string;
  stackGroup: StackGroup;
}

/**
 * 스택 + 게시글 수 정보 (StackWithCount)
 */
export interface StackWithCount {
  id: number;
  name: string;
  stackGroup: StackGroup;
  postCount: number;
}

/**
 * 그룹별 스택 목록 (GroupedStacks)
 */
export interface GroupedStacks {
  groupedTags: Record<string, StackWithCount[]>;
}
