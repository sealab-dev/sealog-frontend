/**
 * 스택 생성 요청 (StackCreate)
 */
export interface Create {
  name: string;
  stackGroup: string;
}

/**
 * 스택 수정 요청 (StackUpdate)
 */
export interface Update {
  name?: string;
  stackGroup?: string;
}
