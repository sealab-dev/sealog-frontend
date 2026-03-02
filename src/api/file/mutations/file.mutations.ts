import { useMutation } from '@tanstack/react-query';
import { fileApi } from '../services';
import { FileValidationError } from '../utils/file.validator';
import { toast } from '@/components/ui/toast/useToast';

/**
 * 파일 업로드 옵션
 */
interface UploadFileOptions {
  file: File;
  fileKey?: string;
}

/**
 * 파일 업로드 Mutation
 * POST /api/files/upload
 */
export const useFileUploadMutation = () => {
  return useMutation({
    mutationFn: ({ file, fileKey = 'file' }: UploadFileOptions) =>
      fileApi.uploadFile(file, fileKey),
    onError: (error) => {
      // FileValidationError는 토스트로 표시
      if (error instanceof FileValidationError) {
        toast.error(error.message);
      } else {
        // 기타 에러는 일반 에러 메시지 (서버 에러는 apiClient에서 처리됨)
        console.error('파일 업로드 에러:', error);
      }
    },
  });
};

/**
 * 사용 예시:
 * ```tsx
 * const uploadMutation = useFileUploadMutation();
 * 
 * const handleUpload = async (file: File) => {
 *   try {
 *     const result = await uploadMutation.mutateAsync({ file });
 *     console.log('업로드 성공:', result.data);
 *   } catch (error) {
 *     // 에러는 mutation의 onError에서 토스트로 처리됨
 *   }
 * };
 * ```
 */