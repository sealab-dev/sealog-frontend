import type { StackGroup } from './stack.enum';

/**
 * 스택 생성 요청 (Admin)
 */
export interface Create {
  name: string;
  stackGroup: StackGroup;
}

/**
 * 스택 수정 요청 (Admin)
 */
export interface Update {
  name: string;
  stackGroup: StackGroup;
}
