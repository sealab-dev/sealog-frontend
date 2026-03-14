import { client } from '../core/client';
import type { ApiResponse } from '../core/client.types';
import type { FileResponse } from './_types/file.response';

export const fileApi = {

  /**
   * 파일 업로드
   * POST /api/files/upload
   * - multipart/form-data, 파일 파트명: "file"
   */
  upload: async (file: File): Promise<ApiResponse<FileResponse>> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await client.post<ApiResponse<FileResponse>>(
      'files/upload',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
    return response.data;
  },
};
