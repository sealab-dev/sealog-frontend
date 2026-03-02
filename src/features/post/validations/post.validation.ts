import type { CreatePostRequest } from "@/api/post/types";

// 기존 타입에서 타입 Key를 기반으로 데이터를 가져옴
type PostFormData = Pick<
  CreatePostRequest,
  "title" | "excerpt" | "content" | "stacks" | "tags"
>;

/**
 * 게시글 폼 유효성 검사(메시지) 타입
 */
export interface ValidationErrors {
  title?: string;
  excerpt?: string;
  content?: string;
  stacks?: string;
  tags?: string;
}

// 유효성 검사 상수
export const VALIDATION_LIMITS = {
  TITLE_MIN: 1,
  TITLE_MAX: 50,
  EXCERPT_MAX: 200,
  CONTENT_MAX: 50000,
  STACKS_MIN: 1,
  STACKS_MAX: 10,
  TAGS_MAX: 5,
} as const;

/**
 * 제목이 유효한 slug를 생성할 수 있는지 검사
 */
const canGenerateSlug = (title: string): boolean => {
  // 영문자 또는 숫자가 있는지 체크
  const hasAlphanumeric = /[a-zA-Z0-9]/.test(title);

  // 완성된 한글이 있는지 체크 (자음/모음만 있으면 false)
  const hasCompleteKorean = /[가-힣]/.test(title);

  // 영문/숫자가 있거나, 완성된 한글이 있으면 OK
  return hasAlphanumeric || hasCompleteKorean;
};

/**
 * 제출 시 전체 유효성 검사
 */
export const validatePostForm = (
  form: PostFormData,
): ValidationErrors | null => {
  const errors: ValidationErrors = {};

  // 제목 검사
  if (!form.title.trim()) {
    errors.title = "제목을 입력해주세요";
  } else if (form.title.length > VALIDATION_LIMITS.TITLE_MAX) {
    errors.title = `제목은 ${VALIDATION_LIMITS.TITLE_MAX}자 이내로 입력해주세요`;
  } else if (!canGenerateSlug(form.title)) {
    errors.title = "제목에 영문, 숫자 또는 완성된 한글을 포함해주세요";
  }

  // 요약 검사
  if (!form.excerpt.trim()) {
    errors.excerpt = "요약을 입력해주세요";
  } else if (form.excerpt.length > VALIDATION_LIMITS.EXCERPT_MAX) {
    errors.excerpt = `요약은 ${VALIDATION_LIMITS.EXCERPT_MAX}자 이내로 입력해주세요`;
  }

  // 본문 검사
  if (!form.content.trim()) {
    errors.content = "본문을 입력해주세요";
  } else if (form.content.length > VALIDATION_LIMITS.CONTENT_MAX) {
    errors.content = `본문은 ${VALIDATION_LIMITS.CONTENT_MAX}자 이내로 입력해주세요`;
  }

  // 스택 검사
  if (form.stacks.length < VALIDATION_LIMITS.STACKS_MIN) {
    errors.stacks = "스택을 1개 이상 선택해주세요";
  } else if (form.stacks.length > VALIDATION_LIMITS.STACKS_MAX) {
    errors.stacks = `스택은 ${VALIDATION_LIMITS.STACKS_MAX}개까지만 선택 가능합니다`;
  }

  // 태그 검사 (선택사항이므로 최대값만 체크)
  if (form.tags.length > VALIDATION_LIMITS.TAGS_MAX) {
    errors.tags = `태그는 ${VALIDATION_LIMITS.TAGS_MAX}개까지만 추가 가능합니다`;
  }

  return Object.keys(errors).length > 0 ? errors : null;
};

/**
 * 실시간 본문 길이 검사 (입력 중)
 */
export const validateContentLength = (content: string): string | null => {
  if (content.length > VALIDATION_LIMITS.CONTENT_MAX) {
    return `본문이 ${VALIDATION_LIMITS.CONTENT_MAX}자를 초과했습니다 (현재 ${content.length}자)`;
  }
  return null;
};

/**
 * 태그 추가 가능 여부 검사
 */
export const canAddTag = (currentTags: string[]): boolean => {
  return currentTags.length < VALIDATION_LIMITS.TAGS_MAX;
};

/**
 * 스택 추가 가능 여부 검사
 */
export const canAddStack = (currentStacks: string[]): boolean => {
  return currentStacks.length < VALIDATION_LIMITS.STACKS_MAX;
};
