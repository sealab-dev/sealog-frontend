/**
 * 파일 업로드 응답 (FileResponse)
 */
export interface FileResponse {
  id: number;
  originalName: string;
  path: string;
  fileUrl: string;
  size: number;
  contentType: string;
}
