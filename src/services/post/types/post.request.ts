/**
 * 게시글 생성 요청 (multipart/form-data의 JSON 파트)
 * 썸네일은 별도 파일 파트로 전송
 */
export interface Create {
  title: string;
  content: string;
  seriesId?: number | null;
  tags?: string[];
  stackIds?: number[];
}

/**
 * 게시글 수정 요청 (multipart/form-data의 JSON 파트)
 * 새 썸네일은 별도 파일 파트로 전송, 없으면 기존 썸네일 유지
 */
export interface Update {
  title: string;
  content: string;
  seriesId: number | null;
  tags?: string[];
  stackIds?: number[];
}
