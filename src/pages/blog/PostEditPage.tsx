import { useParams, useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { Editor } from '@tiptap/react';
import PostEditFooter from '../../features/blog/components/edit/PostEditFooter';
import PostEditForm from '../../features/blog/components/edit/PostEditForm';
import { usePostEditQuery } from '../../services/post/post.queries';
import { useCreatePostMutation, useUpdatePostMutation } from '../../services/post/post.mutations';
import { useMySeriesListQuery } from '../../services/series/series.queries';
import { useAuthStore } from '../../store/authStore';
import { postApi } from '../../services/post/post.api';
import { postKeys } from '../../services/post/post.keys';
import styles from './PostEditPage.module.css';

export interface StackOption {
  id: number;
  name: string;
}

export type PostEditErrors = {
  title?: string;
  content?: string;
};

export default function PostEditPage() {
  const { slug } = useParams<{ username: string; slug: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const isEditMode = !!slug;

  const editorRef = useRef<Editor | null>(null);

  const [title, setTitle] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [selectedStacks, setSelectedStacks] = useState<StackOption[]>([]);
  const [errors, setErrors] = useState<PostEditErrors>({});
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [selectedSeriesId, setSelectedSeriesId] = useState<number | null>(null);
  const [isPublic, setIsPublic] = useState(true);

  const { data: editData } = usePostEditQuery(slug ?? '', { enabled: isEditMode });
  const { data: seriesData } = useMySeriesListQuery();
  const series = seriesData?.content ?? [];

  useEffect(() => {
    if (editData) {
      setTitle(editData.title);
      setCoverUrl(editData.thumbnailUrl);
      setTags(editData.tags);
      setSelectedStacks(editData.stacks.map((s: { id: number; name: string }) => ({ id: s.id, name: s.name })));
      setIsPublic(editData.status === 'PUBLISHED');
      setSelectedSeriesId(editData.seriesId || null);
    }
  }, [editData]);

  const queryClient = useQueryClient();
  const createMutation = useCreatePostMutation();
  const updateMutation = useUpdatePostMutation();

  const validate = (): boolean => {
    const newErrors: PostEditErrors = {};

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      newErrors.title = '제목을 입력해주세요.';
    } else if (/[\u3131-\u3163]/.test(trimmedTitle)) {
      newErrors.title = '제목에 단독 자음 또는 모음은 사용할 수 없습니다.';
    } else if (trimmedTitle.length > 50) {
      newErrors.title = `제목은 50자 이내로 입력해주세요. (현재 ${trimmedTitle.length}자)`;
    }


    const content = editorRef.current?.getHTML() ?? '';
    const textContent = editorRef.current?.getText() ?? '';
    if (!textContent.trim()) {
      newErrors.content = '본문을 입력해주세요.';
    } else if (content.length > 150000) {
      newErrors.content = '본문이 최대 길이를 초과했습니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const buildRequest = () => {
    const content = editorRef.current?.getHTML() ?? '';
    return {
      title,
      content,
      tags,
      stackIds: selectedStacks.map((s) => s.id),
      seriesId: selectedSeriesId,
    };
  };

  const handlePublish = async () => {
    if (!validate()) return;
    try {
      const request = buildRequest();
      const nickname = user?.nickname ?? '';
      if (isEditMode && editData) {
        await updateMutation.mutateAsync({ postId: editData.id, request, thumbnail: coverFile });
        await queryClient.prefetchQuery({
          queryKey: postKeys.detail(nickname, slug ?? ''),
          queryFn: () => postApi.getDetail(nickname, slug ?? ''),
          staleTime: 0,
        });
        navigate(`/${nickname}/entry/${slug}`);
      } else {
        const res = await createMutation.mutateAsync({ request, thumbnail: coverFile });
        await queryClient.prefetchQuery({
          queryKey: postKeys.detail(nickname, res.slug),
          queryFn: () => postApi.getDetail(nickname, res.slug),
          staleTime: 0,
        });
        navigate(`/${nickname}/entry/${res.slug}`);
      }
    } catch {
      // 에러는 client.ts 인터셉터에서 처리
    }
  };

  const handleSave = async () => {
    if (!validate()) return;
    try {
      const request = buildRequest();
      if (isEditMode && editData) {
        await updateMutation.mutateAsync({ postId: editData.id, request, thumbnail: coverFile });
      } else {
        await createMutation.mutateAsync({ request, thumbnail: coverFile });
      }
    } catch {
      // handled
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className={styles.page}>
      <PostEditForm
        title={title}
        tags={tags}
        selectedStacks={selectedStacks}
        coverFile={coverFile}
        coverUrl={coverUrl}
        selectedArchiveId={selectedSeriesId}
        isPublic={isPublic}
        series={series}
        editorRef={editorRef}
        initialContent={isEditMode ? editData?.content : undefined}
        key={isEditMode ? (editData?.id ?? 'loading') : 'new'}
        errors={errors}
        onTitleChange={(v) => { setTitle(v); if (errors.title) setErrors((p) => ({ ...p, title: undefined })); }}
        onTagsChange={setTags}
        onStacksChange={setSelectedStacks}
        onCoverChange={setCoverFile}
        onArchiveChange={setSelectedSeriesId}
        onVisibilityChange={setIsPublic}
      />
      <PostEditFooter onSave={handleSave} onPublish={handlePublish} isPending={isPending} isEditMode={isEditMode} />
    </div>
  );
}
