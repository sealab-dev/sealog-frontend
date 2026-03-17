import { useMutation } from '@tanstack/react-query';
import { fileApi } from './file.api';

/**
 * 파일 업로드 mutation
 * POST /api/files/upload
 */
export const useFileUploadMutation = () => {
  return useMutation({
    mutationFn: (file: File) => fileApi.upload(file),
  });
};
