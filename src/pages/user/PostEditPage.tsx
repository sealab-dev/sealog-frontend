import { useParams, useNavigate } from "react-router-dom";
import { usePostEdit } from "@/features/post/hooks/post/usePostEdit";
import { useUnsaved } from "@/features/post/hooks/common/useUnsaved";
import {
  PostThumbnailEdit,
  UnsavedModal,
  PostStackSection,
  PostTagSection,
  // PostTypeSelector,
  PostMetaFields,
  PostEditorSection,
  PostFormActions,
} from "@/features/post/components/post-form";
import styles from "./PostFormPage.module.css";

export const PostEditPage = () => {
  const { slug, nickname } = useParams<{ slug: string; nickname: string }>();
  const navigate = useNavigate();

  const {
    form,
    originalThumbnailUrl,
    isLoading,
    isFetching,
    fieldErrors,
    contentLengthError,
    hasUnsavedChanges,
    updateField,
    setRemoveThumbnail,
    addTag,
    removeTag,
    addStack,
    removeStack,
    submit,
  } = usePostEdit(slug ?? "");

  const { showModal, handleConfirm, handleCancel, confirmNavigation } =
    useUnsaved({
      hasUnsavedChanges,
    });

  if (!slug || !nickname) {
    navigate("/");
    return null;
  }

  const handleCancelClick = () => {
    confirmNavigation(() => navigate(`/user/${nickname}/entry/${slug}`));
  };

  const handleThumbnailUploadSuccess = (fileId: number, fileUrl: string) => {
    updateField("thumbnailFileId", fileId);
    updateField("thumbnailPath", fileUrl);
    setRemoveThumbnail(false);
  };

  const handleThumbnailRemove = () => {
    if (originalThumbnailUrl) {
      setRemoveThumbnail(true);
    }
    updateField("thumbnailFileId", null);
    updateField("thumbnailPath", null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit();
  };

  if (isFetching) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>게시글을 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <PostThumbnailEdit
        thumbnailPath={form.thumbnailPath}
        title={form.title || "글 수정"}
        onUploadSuccess={handleThumbnailUploadSuccess}
        onThumbnailRemove={handleThumbnailRemove}
      />

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.scrollArea}>
          <div className={styles.container}>
            <div className={styles.header}>
              <h1 className={styles.pageTitle}>글 수정</h1>
            </div>

            {/* 상단 메타 영역 */}
            <div className={styles.metaSection}>
              {/* <PostTypeSelector
                value={form.postType}
                onChange={(type) => updateField("postType", type)}
              /> */}

              <PostMetaFields
                title={form.title}
                excerpt={form.excerpt}
                onTitleChange={(value) => updateField("title", value)}
                onExcerptChange={(value) => updateField("excerpt", value)}
                titleError={fieldErrors?.title}
                excerptError={fieldErrors?.excerpt}
              />

              <PostStackSection
                selectedStacks={form.stacks}
                fieldError={fieldErrors?.stacks ?? null}
                onStackAdd={addStack}
                onStackRemove={removeStack}
              />

              <PostTagSection
                tags={form.tags}
                fieldError={fieldErrors?.tags ?? null}
                onTagAdd={addTag}
                onTagRemove={removeTag}
              />
            </div>

            {/* 에디터 영역 */}
            <div className={styles.editorSection}>
              <PostEditorSection
                content={form.content}
                onContentChange={(value) => updateField("content", value)}
                contentError={fieldErrors?.content}
                contentLengthError={contentLengthError}
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        {/* 하단 고정 액션 */}
        <PostFormActions
          mode="edit"
          isLoading={isLoading}
          isDisabled={!!contentLengthError}
          onCancel={handleCancelClick}
          onPublishClick={submit}
        />
      </form>

      <UnsavedModal
        isOpen={showModal}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
};
