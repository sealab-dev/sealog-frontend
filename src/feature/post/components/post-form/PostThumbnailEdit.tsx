// ThumbnailBannerEdit.tsx
import { useRef, useState } from 'react';
import { useFileUploadMutation } from '@/api/file/mutations/file.mutations';
import { DEFAULT_THUMBNAIL } from '@/constants/images';
import styles from './PostThumbnailEdit.module.css';
import { FILE_DOMAIN } from '@/constants/domain';

interface PostThumbnailEditProps {
  thumbnailPath?: string | null;
  title: string;
  onUploadSuccess: (fileId: number, fileUrl: string) => void;
  onThumbnailRemove: () => void;
}

export const PostThumbnailEdit = ({
  thumbnailPath,
  title,
  onUploadSuccess,
  onThumbnailRemove,
}: PostThumbnailEditProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadMutation = useFileUploadMutation();
  const [isUploading, setIsUploading] = useState(false);

  const handleBannerClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 이미지 파일 검증
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다');
      return;
    }

    // 파일 크기 검증 (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('파일 크기는 5MB 이하여야 합니다');
      return;
    }

    try {
      setIsUploading(true);

      // 즉시 서버에 업로드
      const response = await uploadMutation.mutateAsync({ file });

      if (response.success && response.data) {
        // 업로드 성공 → 부모에게 fileId와 url 전달
        onUploadSuccess(response.data.id, response.data.path);
      }
    } catch (err) {
      console.error('썸네일 업로드 실패:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('썸네일을 제거하시겠습니까?')) {
      onThumbnailRemove();
    }
  };

  // ✅ 표시할 이미지 URL 결정
  const displayImageUrl = thumbnailPath 
    ? FILE_DOMAIN + thumbnailPath 
    : DEFAULT_THUMBNAIL;

  // ✅ 커스텀 썸네일 여부
  const hasCustomThumbnail = !!thumbnailPath;

  return (
    <section className={styles.banner}>
      <div
        className={styles.backgroundContainer}
        onClick={handleBannerClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleBannerClick()}
      >
        {/* ✅ 항상 이미지 표시 (커스텀 or 기본) */}
        <img 
          src={displayImageUrl} 
          alt={title} 
          className={styles.thumbnailImage} 
        />
        <div className={styles.bannerOverlay} />

        {/* 업로딩 오버레이 */}
        {isUploading && (
          <div className={styles.uploadingOverlay}>
            <span>업로드 중...</span>
          </div>
        )}

        {/* ✅ 커스텀 썸네일이 있을 때만 변경/제거 버튼 표시 */}
        {hasCustomThumbnail && !isUploading && (
          <div className={styles.imageActions}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleBannerClick();
              }}
              className={styles.changeButton}
            >
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              변경
            </button>
            <button
              type="button"
              onClick={handleRemoveClick}
              className={styles.removeButton}
            >
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              제거
            </button>
          </div>
        )}

        {/* ✅ 기본 이미지일 때만 업로드 안내 표시 */}
        {!hasCustomThumbnail && !isUploading && (
          <div className={styles.uploadPrompt}>
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>클릭하여 썸네일 추가</span>
            <span className={styles.uploadHint}>
              권장 크기: 1200x400, 최대 5MB
            </span>
          </div>
        )}

        {/* 물결 효과 */}
        <div className={styles.waveWrapper}>
          <svg
            className={styles.waves}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 24 150 28"
            preserveAspectRatio="none"
          >
            <defs>
              <path
                id="gentle-wave-edit"
                d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
              />
            </defs>
            <g className={styles.parallax}>
              <use xlinkHref="#gentle-wave-edit" x="48" y="0" className={styles.waveLayer1} />
              <use xlinkHref="#gentle-wave-edit" x="48" y="7" className={styles.waveLayer2} />
            </g>
          </svg>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className={styles.hiddenInput}
      />
    </section>
  );
};