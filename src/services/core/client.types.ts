// 백엔드 공통 응답 포맷
export interface ApiResponse<T> {
  success: boolean;
  data: T;            // 실제 데이터 또는 페이지네이션 객체
  message: string | null;
  status: number;     // HTTP 또는 커스텀 상태 코드
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
