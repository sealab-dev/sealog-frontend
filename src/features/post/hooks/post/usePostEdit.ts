import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePostEditQuery } from '@/api/post/queries/post.queries';
import { useUpdatePostMutation } from '@/api/post/mutations/post.mutations';
import { useFileUploadMutation } from '@/api/file/mutations/file.mutations';
import { getFieldErrors } from '@/api/core/api.error';
import { scrollToField } from '../../utils';
import {
  validatePostForm,
  validateContentLength,
  canAddTag,
  canAddStack,
} from '../../validations/post.validation';
import type { UpdatePostRequest } from '@/api/post/types';
import type { ValidationErrors } from '../../validations/post.validation';

const INITIAL_FORM: UpdatePostRequest = {
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
 * 게시글 수정 훅
 */
export const usePostEdit = (slug: string) => {
  const navigate = useNavigate();

  // Queries & Mutations
  const editQuery = usePostEditQuery(slug);
  const updateMutation = useUpdatePostMutation();
  const uploadMutation = useFileUploadMutation();

  // 서버 데이터를 기반으로 초기 폼 생성
  const initialData = useMemo(() => {
    if (!editQuery.data?.data) return INITIAL_FORM;
    
    const post = editQuery.data.data;
    return {
      title: post.title,
      excerpt: post.excerpt,
      postType: post.postType,
      content: post.content,
      stacks: post.stacks,
      tags: post.tags,
      thumbnailFileId: null,
      thumbnailPath: post.thumbnailPath,
    };
  }, [editQuery.data]);

  // initialData로 직접 초기화
  const [form, setForm] = useState<UpdatePostRequest>(initialData);
  const [originalForm, setOriginalForm] = useState<UpdatePostRequest>(initialData);
  const [originalThumbnailUrl, setOriginalThumbnailUrl] = useState<string | null>(
    editQuery.data?.data?.thumbnailPath ?? null
  );
  const [removeThumbnail, setRemoveThumbnail] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<ValidationErrors | null>(null);
  const [contentLengthError, setContentLengthError] = useState<string | null>(
    editQuery.data?.data?.content ? validateContentLength(editQuery.data.data.content) : null
  );

  // initialData가 바뀔 때마다 form 동기화
  useEffect(() => {
    setForm(initialData);
    setOriginalForm(initialData);
  }, [initialData]);

  // originalThumbnailUrl 동기화
  useEffect(() => {
    if (editQuery.data?.data?.thumbnailPath !== undefined) {
      setOriginalThumbnailUrl(editQuery.data.data.thumbnailPath);
    }
  }, [editQuery.data]);

  // contentLengthError 동기화
  useEffect(() => {
    if (editQuery.data?.data?.content) {
      setContentLengthError(validateContentLength(editQuery.data.data.content));
    }
  }, [editQuery.data]);

  // 로딩 상태
  const isFetching = editQuery.isLoading;
  const isLoading = updateMutation.isPending || uploadMutation.isPending;

  // 변경사항 확인
  const hasUnsavedChanges = useMemo(() => {
    if (
      form.title !== originalForm.title ||
      form.excerpt !== originalForm.excerpt ||
      form.postType !== originalForm.postType ||
      form.content !== originalForm.content ||
      removeThumbnail
    ) {
      return true;
    }

    if (
      form.stacks.length !== originalForm.stacks.length ||
      !form.stacks.every((stack) => originalForm.stacks.includes(stack))
    ) {
      return true;
    }

    if (
      form.tags.length !== originalForm.tags.length ||
      !form.tags.every((tag) => originalForm.tags.includes(tag))
    ) {
      return true;
    }

    return false;
  }, [form, originalForm, removeThumbnail]);

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
    <K extends keyof UpdatePostRequest>(key: K, value: UpdatePostRequest[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));

      if (key === 'content' && typeof value === 'string') {
        setContentLengthError(validateContentLength(value));
      }

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
        setForm((prev) => ({
          ...prev,
          thumbnailFileId: null,
          thumbnailUrl: originalThumbnailUrl,
        }));
        setRemoveThumbnail(false);
        return;
      }

      try {
        const response = await uploadMutation.mutateAsync({ file });

        if (response.success && response.data) {
          setForm((prev) => ({
            ...prev,
            thumbnailFileId: response.data.id,
            thumbnailUrl: response.data.path,
          }));
          setRemoveThumbnail(false);
        }
      } catch (err) {
        console.error('썸네일 업로드 실패:', err);
      }
    },
    [uploadMutation, originalThumbnailUrl]
  );

  // 썸네일 제거 플래그 설정
  const handleSetRemoveThumbnail = useCallback((remove: boolean) => {
    setRemoveThumbnail(remove);
    if (remove) {
      setForm((prev) => ({
        ...prev,
        thumbnailFileId: null,
        thumbnailUrl: null,
      }));
    }
  }, []);

  // 태그 추가
  const addTag = useCallback(
    (tag: string) => {
      const trimmed = tag.trim();
      if (!trimmed) return;

      if (!canAddTag(form.tags) || form.tags.includes(trimmed)) {
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

  // 수정 제출
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
      const response = await updateMutation.mutateAsync({ 
        slug, 
        request: { ...form, removeThumbnail }
      });

      if (response.success) {
          navigate(`/user/${response.data.author.nickname}/entry/${response.data.slug}`);
      }
    } catch (err) {
      const serverFieldErrors = getFieldErrors(err);
      if (serverFieldErrors) {
        setFieldErrors(serverFieldErrors as ValidationErrors);
        const firstErrorKey = Object.keys(serverFieldErrors)[0];
        scrollToField(firstErrorKey);
      }
    }
  }, [form, slug, removeThumbnail, updateMutation, navigate]);

  return {
    form,
    originalThumbnailUrl,
    isLoading,
    isFetching,
    fieldErrors,
    contentLengthError,
    hasUnsavedChanges,
    updateField,
    setThumbnail,
    setRemoveThumbnail: handleSetRemoveThumbnail,
    addTag,
    removeTag,
    addStack,
    removeStack,
    submit,
  };
};