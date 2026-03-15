import { client } from '../core/client';
import type { FileResponse } from './types/file.response';

export const fileApi = {

  /**
   * 파일 업로드
   * POST /api/files/upload
   * - multipart/form-data, 파일 파트명: "file"
   */
  upload: (file: File): Promise<FileResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    return client.post(
      'files/upload',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
  },
};
