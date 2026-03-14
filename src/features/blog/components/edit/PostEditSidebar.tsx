import { useRef, useState, useEffect } from 'react';
import styles from './PostEditSidebar.module.css';
import { useMyArchiveListQuery } from '../../../../services/archive/archive.queries';
import { useCreateArchiveMutation } from '../../../../services/archive/archive.mutations';

interface PostEditSidebarProps {
  coverFile: File | null;
  coverUrl: string | null;
  selectedArchiveId: number | null;
  isPublic: boolean;
  onCoverChange: (file: File | null) => void;
  onArchiveChange: (archiveId: number | null) => void;
  onVisibilityChange: (isPublic: boolean) => void;
}

export default function PostEditSidebar({
  coverFile,
  coverUrl,
  selectedArchiveId,
  isPublic,
  onCoverChange,
  onArchiveChange,
  onVisibilityChange,
}: PostEditSidebarProps) {
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showNewInput, setShowNewInput] = useState(false);
  const [newSeriesName, setNewSeriesName] = useState('');

  const { data: archiveData } = useMyArchiveListQuery();
  const archives = archiveData?.content ?? [];
  const createArchiveMutation = useCreateArchiveMutation();

  const effectiveCoverPreview = coverFile ? coverPreview : coverUrl;

  useEffect(() => {
    if (!coverFile) return;
    const url = URL.createObjectURL(coverFile);
    setCoverPreview(url); // eslint-disable-line react-hooks/set-state-in-effect
    return () => URL.revokeObjectURL(url);
  }, [coverFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onCoverChange(file);
    e.target.value = '';
  };

  const handleRemoveCover = () => {
    onCoverChange(null);
  };

  const handleSelectArchive = (id: number) => {
    onArchiveChange(selectedArchiveId === id ? null : id);
  };

  const handleAddSeries = async () => {
    const trimmed = newSeriesName.trim();
    if (!trimmed) return;
    try {
      await createArchiveMutation.mutateAsync({ name: trimmed });
    } catch {
      // handled
    }
    setNewSeriesName('');
    setShowNewInput(false);
  };

  const selectedArchive = archives.find((a) => a.id === selectedArchiveId);

  return (
    <aside className={styles.panel}>

      {/* 커버 이미지 */}
      <section className={styles.section}>
        <h3 className={styles.title}>커버 이미지</h3>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className={styles.fileInput}
          onChange={handleFileChange}
        />
        {effectiveCoverPreview ? (
          <div className={styles.coverPreview}>
            <img src={effectiveCoverPreview ?? undefined} alt="커버 이미지 미리보기" className={styles.coverImg} />
            <div className={styles.coverOverlay}>
              <button
                type="button"
                className={styles.coverOverlayBtn}
                onClick={() => fileInputRef.current?.click()}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                변경
              </button>
              <button
                type="button"
                className={`${styles.coverOverlayBtn} ${styles.coverOverlayBtnDanger}`}
                onClick={handleRemoveCover}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  <path d="M10 11v6M14 11v6" />
                </svg>
                삭제
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            className={styles.coverUpload}
            onClick={() => fileInputRef.current?.click()}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <span>이미지 업로드</span>
          </button>
        )}
      </section>

      {/* 시리즈 */}
      <section className={styles.section}>
        <h3 className={styles.title}>시리즈</h3>

        {selectedArchive && (
          <div className={styles.selectedSeries}>
            <span className={styles.selectedSeriesName}>{selectedArchive.name}</span>
            <button
              type="button"
              className={styles.selectedSeriesClear}
              onClick={() => onArchiveChange(null)}
              aria-label="시리즈 선택 해제"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        )}

        {archives.length > 0 && (
          <ul className={styles.seriesList}>
            {archives.map((archive) => (
              <li key={archive.id}>
                <button
                  type="button"
                  className={`${styles.seriesItem} ${selectedArchiveId === archive.id ? styles.seriesItemActive : ''}`}
                  onClick={() => handleSelectArchive(archive.id)}
                >
                  <span className={styles.seriesItemDot} />
                  <span className={styles.seriesItemName}>{archive.name}</span>
                  {selectedArchiveId === archive.id && (
                    <svg className={styles.seriesItemCheck} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}

        {showNewInput ? (
          <div className={styles.newSeriesWrap}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            <input
              className={styles.newSeriesInput}
              type="text"
              placeholder="시리즈 이름 입력..."
              value={newSeriesName}
              onChange={(e) => setNewSeriesName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddSeries();
                if (e.key === 'Escape') { setShowNewInput(false); setNewSeriesName(''); }
              }}
              autoFocus
            />
            <div className={styles.newSeriesActions}>
              <button type="button" className={styles.newSeriesConfirm} onClick={handleAddSeries} aria-label="추가">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </button>
              <button type="button" className={styles.newSeriesCancel} onClick={() => { setShowNewInput(false); setNewSeriesName(''); }} aria-label="취소">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <button type="button" className={styles.addSeriesBtn} onClick={() => setShowNewInput(true)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            새 시리즈 만들기
          </button>
        )}
      </section>

      {/* 공개 여부 */}
      <section className={styles.section}>
        <h3 className={styles.title}>공개 여부</h3>
        <div className={styles.visibilityOptions}>
          <label className={`${styles.visibilityOption} ${isPublic ? styles.active : ''}`}>
            <input
              type="radio"
              name="visibility"
              value="public"
              checked={isPublic}
              onChange={() => onVisibilityChange(true)}
            />
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            전체 공개
          </label>
          <label className={`${styles.visibilityOption} ${!isPublic ? styles.active : ''}`}>
            <input
              type="radio"
              name="visibility"
              value="private"
              checked={!isPublic}
              onChange={() => onVisibilityChange(false)}
            />
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            비공개
          </label>
        </div>
      </section>

    </aside>
  );
}
