import type { FileMetadata, UploadResult } from "../types";
import { fileApi } from "@/api/file/services/file.api";
import { FileValidationError } from "@/api/file/utils/file.validator";

/**
 * 파일 크기를 읽기 쉬운 형식으로 변환
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * 파일 업로드
 */
export const uploadFile = async (file: File): Promise<UploadResult> => {
  try {
    const response = await fileApi.uploadFile(file);

    if (!response.success || !response.data) {
      return {
        success: false,
        error: '파일 업로드에 실패했습니다.',
      };
    }

    const metadata: FileMetadata = {
      id: response.data.id,
      path: response.data.path,
      fileName: response.data.originalName,
      size: response.data.size,
      contentType: response.data.contentType,
    };

    return {
      success: true,
      data: metadata,
    };
  } catch (error) {
    if (error instanceof FileValidationError) {
      return {
        success: false,
        error: error.message,
      };
    }

    console.error('File upload error:', error);
    return {
      success: false,
      error: '파일 업로드에 실패했습니다.',
    };
  }
};

/**
 * 드래그 앤 드롭 파일 추출
 */
export const extractFilesFromDrop = (dataTransfer: DataTransfer | null): File[] | null => {
  if (!dataTransfer) return null;
  const files = Array.from(dataTransfer.files);
  return files.length > 0 ? files : null;
};