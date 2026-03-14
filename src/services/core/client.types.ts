// 공통 API 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// 에러 응답 타입
export interface ErrorResponse {
  success: boolean;
  message: string;
  status: number;
  timestamp: string;
  errors?: Record<string, string>;
}

// 페이지네이션 응답 타입
export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
  size: number;
  hasNext: boolean;
  hasPrevious: boolean;
}