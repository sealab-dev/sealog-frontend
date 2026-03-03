import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreatePostMutation } from '@/api/post/mutations/post.mutations';
import { useFileUploadMutation } from '@/api/file/mutations/file.mutations';
import { getFieldErrors } from '@/api/core/api.error';
import { scrollToField } from '../../utils';
import {
  canAddStack,
  canAddTag,
  validateContentLength,
  validatePostForm,
} from '../../validations/post.validation';
import type { CreatePostRequest } from '@/api/post/types';
import type { ValidationErrors } from '../../validations/post.validation';

const INITIAL_FORM: CreatePostRequest = {
  title: '',
  excerpt: '',
  postType: 'CORE',
  content: '',
  stacks: [],
  tags: [],
  thumbnailFileId: null,
  thumbnailPath: null,
};

/**
 * 게시글 생성 훅
 * - 폼 상태 관리
 * - 썸네일 업로드 (선택 시 즉시 업로드)
 * - 게시글 생성 mutation
 */
export const usePostCreate = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<CreatePostRequest>(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState<ValidationErrors | null>(null);
  const [contentLengthError, setContentLengthError] = useState<string | null>(null);

  // Mutations
  const createMutation = useCreatePostMutation();
  const uploadMutation = useFileUploadMutation();

  // 로딩 상태 통합
  const isLoading = createMutation.isPending || uploadMutation.isPending;

  // 변경사항 확인
  const hasUnsavedChanges = useMemo(() => {
    return (
      form.title.trim() !== '' ||
      form.excerpt.trim() !== '' ||
      form.content.trim() !== '' ||
      form.stacks.length > 0 ||
      form.tags.length > 0
    );
  }, [form]);

  // 필드 에러 제거 헬퍼
  const removeFieldError = useCallback((fieldName: string) => {
    setFieldErrors((prev) => {
      if (!prev || !prev[fieldName as keyof ValidationErrors]) return prev;
      const updated = { ...prev };
      delete updated[fieldName as keyof ValidationErrors];
      return Object.keys(updated).length > 0 ? updated : null;
    });
  }, []);

  // 필드 업데이트
  const updateField = useCallback(
    <K extends keyof CreatePostRequest>(key: K, value: CreatePostRequest[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));

      // 본문 실시간 길이 검사
      if (key === 'content' && typeof value === 'string') {
        setContentLengthError(validateContentLength(value));
      }

      // 해당 필드 에러 제거
      if (fieldErrors?.[key as keyof ValidationErrors]) {
        removeFieldError(key as string);
      }
    },
    [fieldErrors, removeFieldError]
  );

  // 썸네일 설정 (파일 선택 시 즉시 업로드)
  const setThumbnail = useCallback(
    async (file: File | undefined) => {
      if (!file) {
        // 썸네일 제거
        setForm((prev) => ({
          ...prev,
          thumbnailFileId: null,
          thumbnailPath: null,
        }));
        return;
      }

      try {
        // 파일 업로드
        const response = await uploadMutation.mutateAsync({ file });
        
        if (response.success && response.data) {
          setForm((prev) => ({
            ...prev,
            thumbnailFileId: response.data.id,
            thumbnailPath: response.data.path,
          }));
        }
      } catch (err) {
        // 에러는 mutation의 onError에서 토스트로 처리됨
        console.error('썸네일 업로드 실패:', err);
      }
    },
    [uploadMutation]
  );

  // 태그 추가
  const addTag = useCallback(
    (tag: string) => {
      const trimmed = tag.trim();

      if (!trimmed || !canAddTag(form.tags) || form.tags.includes(trimmed)) {
        return;
      }

      setForm((prev) => ({ ...prev, tags: [...prev.tags, trimmed] }));

      if (fieldErrors?.tags) {
        removeFieldError('tags');
      }
    },
    [form.tags, fieldErrors, removeFieldError]
  );

  // 태그 제거
  const removeTag = useCallback((tagToRemove: string) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  }, []);

  // 스택 추가
  const addStack = useCallback(
    (stack: string) => {
      if (!canAddStack(form.stacks) || form.stacks.includes(stack)) {
        return;
      }

      setForm((prev) => ({ ...prev, stacks: [...prev.stacks, stack] }));

      if (fieldErrors?.stacks) {
        removeFieldError('stacks');
      }
    },
    [form.stacks, fieldErrors, removeFieldError]
  );

  // 스택 제거
  const removeStack = useCallback((stackToRemove: string) => {
    setForm((prev) => ({
      ...prev,
      stacks: prev.stacks.filter((stack) => stack !== stackToRemove),
    }));
  }, []);

  // 제출
  const submit = useCallback(async () => {
    // 클라이언트 유효성 검사
    const validationErrors = validatePostForm(form);
    if (validationErrors) {
      setFieldErrors(validationErrors);
      const firstErrorKey = Object.keys(validationErrors)[0];
      scrollToField(firstErrorKey);
      return;
    }

    setFieldErrors(null);

    try {
      const response = await createMutation.mutateAsync(form);

      if (response.success) {
        navigate(`/user/${response.data.author.nickname}/entry/${response.data.slug}`);
      }
    } catch (err) {
      // 서버에서 필드 에러가 내려온 경우 UI에 표시
      const serverFieldErrors = getFieldErrors(err);
      if (serverFieldErrors) {
        setFieldErrors(serverFieldErrors as ValidationErrors);
        const firstErrorKey = Object.keys(serverFieldErrors)[0];
        scrollToField(firstErrorKey);
      }
      // 일반 서버 에러는 apiClient 인터셉터에서 토스트로 처리됨
    }
  }, [form, createMutation, navigate]);

  return {
    form,
    isLoading,
    fieldErrors,
    contentLengthError,
    hasUnsavedChanges,
    updateField,
    setThumbnail,
    addTag,
    removeTag,
    addStack,
    removeStack,
    submit,
  };
};