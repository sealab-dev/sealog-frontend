import { useParams, useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import type { Editor } from '@tiptap/react';
import PostEditFooter from '../../features/blog/components/edit/PostEditFooter';
import PostEditForm from '../../features/blog/components/edit/PostEditForm';
import { usePostEditQuery } from '../../services/post/post.queries';
import { useCreatePostMutation, useUpdatePostMutation } from '../../services/post/post.mutations';
import { useChangePostArchiveMutation } from '../../services/archive/archive.mutations';
import { useAuthStore } from '../../store/authStore';
import styles from './PostEditPage.module.css';

export interface StackOption {
  id: number;
  name: string;
}

export default function PostEditPage() {
  const { slug } = useParams<{ username: string; slug: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const isEditMode = !!slug;

  const editorRef = useRef<Editor | null>(null);

  const [title, setTitle] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [selectedStacks, setSelectedStacks] = useState<StackOption[]>([]);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [selectedArchiveId, setSelectedArchiveId] = useState<number | null>(null);
  const [isPublic, setIsPublic] = useState(true);

  const { data: editData } = usePostEditQuery(slug ?? '', { enabled: isEditMode });

  useEffect(() => {
    if (editData) {
      setTitle(editData.title);
      setCoverUrl(editData.thumbnailUrl);
      setTags(editData.tags);
      setSelectedStacks(editData.stacks.map((s: { id: number; name: string }) => ({ id: s.id, name: s.name })));
      setIsPublic(editData.status === 'PUBLISHED');
    }
  }, [editData]);

  const createMutation = useCreatePostMutation();
  const updateMutation = useUpdatePostMutation();
  const changeArchiveMutation = useChangePostArchiveMutation();

  const buildRequest = () => {
    const content = editorRef.current?.getHTML() ?? '';
    const excerpt = content.replace(/<[^>]*>/g, '').trim().slice(0, 200) || title;
    return { title, excerpt, content, tags, stackIds: selectedStacks.map((s) => s.id) };
  };

  const handlePublish = async () => {
    try {
      const request = buildRequest();
      if (isEditMode && editData) {
        await updateMutation.mutateAsync({ postId: editData.id, request, thumbnail: coverFile });
        navigate(`/${user?.nickname}/entry/${slug}`);
      } else {
        const res = await createMutation.mutateAsync({ request, thumbnail: coverFile });
        if (selectedArchiveId && res.data) {
          await changeArchiveMutation.mutateAsync({ archiveId: selectedArchiveId, postId: res.data.id });
        }
        navigate(`/${user?.nickname}/entry/${res.data.slug}`);
      }
    } catch {
      // 에러는 상위 인터셉터 또는 mutation.isError로 처리
    }
  };

  const handleSave = async () => {
    try {
      const request = buildRequest();
      if (isEditMode && editData) {
        await updateMutation.mutateAsync({ postId: editData.id, request, thumbnail: coverFile });
      } else {
        const res = await createMutation.mutateAsync({ request, thumbnail: coverFile });
        if (selectedArchiveId && res.data) {
          await changeArchiveMutation.mutateAsync({ archiveId: selectedArchiveId, postId: res.data.id });
        }
      }
    } catch {
      // handled
    }
  };

  const isPending =
    createMutation.isPending || updateMutation.isPending || changeArchiveMutation.isPending;

  return (
    <div className={styles.page}>
      <PostEditForm
        title={title}
        tags={tags}
        selectedStacks={selectedStacks}
        coverFile={coverFile}
        coverUrl={coverUrl}
        selectedArchiveId={selectedArchiveId}
        isPublic={isPublic}
        editorRef={editorRef}
        initialContent={isEditMode ? editData?.content : undefined}
        onTitleChange={setTitle}
        onTagsChange={setTags}
        onStacksChange={setSelectedStacks}
        onCoverChange={setCoverFile}
        onArchiveChange={setSelectedArchiveId}
        onVisibilityChange={setIsPublic}
      />
      <PostEditFooter onSave={handleSave} onPublish={handlePublish} isPending={isPending} isEditMode={isEditMode} />
    </div>
  );
}
