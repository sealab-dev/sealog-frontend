import { AxiosError } from 'axios';
import type { ErrorResponse } from './client.types';

/**
 * API 에러에서 메시지 추출
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const errorResponse = error.response?.data as ErrorResponse | undefined;
    
    // 서버에서 보낸 에러 메시지
    if (errorResponse?.message) {
      return errorResponse.message;
    }
    
    // HTTP 상태별 기본 메시지
    switch (error.response?.status) {
      case 400:
        return '잘못된 요청입니다.';
      case 401:
        return '로그인이 필요합니다.';
      case 403:
        return '접근 권한이 없습니다.';
      case 404:
        return '요청한 리소스를 찾을 수 없습니다.';
      case 409:
        return '이미 존재하는 데이터입니다.';
      case 500:
        return '서버 오류가 발생했습니다.';
      default:
        return '알 수 없는 오류가 발생했습니다.';
    }
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return '알 수 없는 오류가 발생했습니다.';
};

/**
 * API 에러에서 필드별 에러 추출 (유효성 검사)
 */
export const getFieldErrors = (error: unknown): Record<string, string> | null => {
  if (error instanceof AxiosError) {
    const errorResponse = error.response?.data as ErrorResponse | undefined;
    return errorResponse?.errors ?? null;
  }
  return null;
};

/**
 * 네트워크 에러 여부 확인
 */
export const isNetworkError = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    return !error.response && error.code === 'ERR_NETWORK';
  }
  return false;
};

/**
 * 인증 에러 여부 확인
 */
export const isAuthError = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    return error.response?.status === 401;
  }
  return false;
};