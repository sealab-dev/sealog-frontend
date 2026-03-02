import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePostCreate } from "@/features/post/hooks/post/usePostCreate";
import { useUnsaved } from "@/features/post/hooks/common/useUnsaved";
import {
  PostThumbnailEdit,
  UnsavedModal,
  PostStackSection,
  PostTagSection,
  PostMetaFields,
  PostEditorSection,
  PostFormActions,
} from "@/features/post/components/post-form";
import { PublishModal } from "@/features/post/components/post-form/PublishModal";
import type { CollectionOption } from "@/features/post/components/post-form/PublishModal";
import styles from "./PostFormPage.module.css";

// TODO: API 연결 후 실제 컬렉션 목록으로 교체
const MOCK_COLLECTION: CollectionOption[] = [];

export const PostFormPage = () => {
  const navigate = useNavigate();
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  const {
    form,
    isLoading,
    fieldErrors,
    contentLengthError,
    hasUnsavedChanges,
    updateField,
    addTag,
    removeTag,
    addStack,
    removeStack,
    submit,
  } = usePostCreate();

  const { showModal, handleConfirm, handleCancel, confirmNavigation } =
    useUnsaved({
      hasUnsavedChanges,
    });

  const handleCancelClick = () => {
    confirmNavigation(() => navigate("/"));
  };

  const handleThumbnailUploadSuccess = (fileId: number, filePath: string) => {
    updateField("thumbnailFileId", fileId);
    updateField("thumbnailPath", filePath);
  };

  const handleThumbnailRemove = () => {
    updateField("thumbnailFileId", null);
    updateField("thumbnailPath", null);
  };

  // 발행하기 버튼 → 모달 열기 (폼 유효성은 모달 confirm 시점에 submit에서 검증)
  const handlePublishClick = () => {
    setIsPublishModalOpen(true);
  };

  // 모달 confirm → 컬렉션 정보 포함하여 실제 발행
  const handlePublishConfirm = (
    collectionId: number | null,
    newCollectionName: string | null,
  ) => {
    setIsPublishModalOpen(false);
    // TODO: collectionId / newCollectionName을 form에 추가하거나 submit 인자로 전달
    console.log("발행 컬렉션:", { collectionId, newCollectionName });
    submit();
  };

  return (
    <div className={styles.page}>
      {/* 썸네일 */}
      <PostThumbnailEdit
        thumbnailPath={form.thumbnailPath}
        title={form.title || "새 글"}
        onUploadSuccess={handleThumbnailUploadSuccess}
        onThumbnailRemove={handleThumbnailRemove}
      />

      <form className={styles.form}>
        <div className={styles.scrollArea}>
          <div className={styles.header}>
            <h1 className={styles.pageTitle}>새 글 작성</h1>
          </div>

          <div className={styles.metaSection}>
            <PostMetaFields
              title={form.title}
              excerpt={form.excerpt}
              onTitleChange={(v) => updateField("title", v)}
              onExcerptChange={(v) => updateField("excerpt", v)}
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

          <div className={styles.editorSection}>
            <PostEditorSection
              content={form.content}
              onContentChange={(v) => updateField("content", v)}
              contentError={fieldErrors?.content}
              contentLengthError={contentLengthError}
              disabled={isLoading}
            />
          </div>
        </div>

        <PostFormActions
          mode="create"
          isLoading={isLoading}
          isDisabled={!!contentLengthError}
          onCancel={handleCancelClick}
          onPublishClick={handlePublishClick}
        />
      </form>

      {/* 미저장 경고 모달 */}
      <UnsavedModal
        isOpen={showModal}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />

      {/* 발행 모달 */}
      <PublishModal
        isOpen={isPublishModalOpen}
        collectionList={MOCK_COLLECTION}
        onConfirm={handlePublishConfirm}
        onCancel={() => setIsPublishModalOpen(false)}
      />
    </div>
  );
};
