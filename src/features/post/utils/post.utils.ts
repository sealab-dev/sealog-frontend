/**
 * 필드 에러 발생 시 해당 필드로 스크롤
 */

// 필드 선택자 맵
const FIELD_SELECTORS: Record<string, string> = {
  title: 'input[placeholder*="제목"]',
  excerpt: 'textarea[placeholder*="요약"]',
  content: '.ProseMirror',
  stacks: '[class*="stackGroups"]',
  tags: '[class*="tagInput"]',
} as const;

export const scrollToField = (fieldName: string): void => {
  const selector = FIELD_SELECTORS[fieldName];
  if (!selector) {
    console.warn(`Unknown field: ${fieldName}`);
    return;
  }

  const element = document.querySelector(selector);
  if (!element) {
    console.warn(`Element not found for field: ${fieldName}`);
    return;
  }

  element.scrollIntoView({ 
    behavior: 'smooth', 
    block: 'center' 
  });

  // input/textarea면 포커스
  if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
    setTimeout(() => element.focus(), 300);
  }
};

/**
 * ISO 날짜 문자열을 'YYYY-MM-DD' 형식으로 변환
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};