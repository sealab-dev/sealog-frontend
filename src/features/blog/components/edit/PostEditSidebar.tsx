import { useRef, useState, useEffect } from 'react';
import {
  Camera,
  Plus,
  Trash2,
  Globe,
  Lock,
  Check,
  Book,
  X,
  ChevronRight,
} from 'lucide-react';
import styles from './PostEditSidebar.module.css';
import { useCreateSeriesMutation } from '@/services/series/series.mutations';
import type { MySeriesItem } from '@/services/series/types/series.response';

interface PostEditSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  coverFile: File | null;
  coverUrl: string | null;
  selectedArchiveId: number | null;
  isPublic: boolean;
  series: MySeriesItem[];
  onCoverChange: (file: File | null) => void;
  onArchiveChange: (archiveId: number | null) => void;
  onVisibilityChange: (isPublic: boolean) => void;
}

export default function PostEditSidebar({
  isOpen,
  onToggle,
  coverFile,
  coverUrl,
  selectedArchiveId,
  isPublic,
  series,
  onCoverChange,
  onArchiveChange,
  onVisibilityChange,
}: PostEditSidebarProps) {
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showNewInput, setShowNewInput] = useState(false);
  const [newSeriesName, setNewSeriesName] = useState('');

  const createArchiveMutation = useCreateSeriesMutation();

  const effectiveCoverPreview = coverFile ? coverPreview : coverUrl;

  useEffect(() => {
    if (!coverFile) return;
    const url = URL.createObjectURL(coverFile);
    setCoverPreview(url);
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

  const selectedArchive = series.find((a) => a.id === selectedArchiveId);

  return (
    <>
      <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`} aria-label="포스트 설정">
        {/* 커버 이미지 */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>커버 이미지</h3>
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
                  <Camera size={14} />
                  변경
                </button>
                <button
                  type="button"
                  className={`${styles.coverOverlayBtn} ${styles.coverOverlayBtnDanger}`}
                  onClick={handleRemoveCover}
                >
                  <Trash2 size={14} />
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
              <Camera size={20} strokeWidth={1.5} />
              <span>이미지 업로드</span>
            </button>
          )}
        </section>

        {/* 시리즈 */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>시리즈</h3>

          {selectedArchive && (
            <div className={styles.selectedSeries}>
              <span className={styles.selectedSeriesName}>{selectedArchive.name}</span>
              <button
                type="button"
                className={styles.selectedSeriesClear}
                onClick={() => onArchiveChange(null)}
                aria-label="시리즈 선택 해제"
              >
                <X size={14} strokeWidth={2.5} />
              </button>
            </div>
          )}

          {series.length > 0 && (
            <ul className={styles.seriesList}>
              {series.map((archive) => (
                <li key={archive.id}>
                  <button
                    type="button"
                    className={`${styles.seriesItem} ${selectedArchiveId === archive.id ? styles.seriesItemActive : ''}`}
                    onClick={() => handleSelectArchive(archive.id)}
                  >
                    <span className={styles.seriesItemDot} />
                    <span className={styles.seriesItemName}>{archive.name}</span>
                    {selectedArchiveId === archive.id && (
                      <Check size={14} strokeWidth={2.5} className={styles.seriesItemCheck} />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}

          {showNewInput ? (
            <div className={styles.newSeriesWrap}>
              <Book size={16} />
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
                  <Check size={14} strokeWidth={2.5} />
                </button>
                <button type="button" className={styles.newSeriesCancel} onClick={() => { setShowNewInput(false); setNewSeriesName(''); }} aria-label="취소">
                  <X size={14} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          ) : (
            <button type="button" className={styles.addSeriesBtn} onClick={() => setShowNewInput(true)}>
              <Plus size={16} />
              새 시리즈 만들기
            </button>
          )}
        </section>

        {/* 공개 여부 */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>공개 여부</h3>
          <div className={styles.visibilityOptions}>
            <label className={`${styles.visibilityOption} ${isPublic ? styles.active : ''}`}>
              <input
                type="radio"
                name="visibility"
                value="public"
                checked={isPublic}
                onChange={() => onVisibilityChange(true)}
              />
              <Globe size={16} />
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
              <Lock size={16} />
              비공개
            </label>
          </div>
        </section>
      </aside>

      {/* Sidebar Tab Button */}
      <button
        className={`${styles.sidebarTab} ${isOpen ? styles.sidebarTabOpen : ''}`}
        onClick={onToggle}
        aria-label={isOpen ? '사이드바 닫기' : '사이드바 열기'}
        aria-expanded={isOpen}
      >
        <span className={styles.sidebarTabText}>Menu</span>
        <ChevronRight size={11} strokeWidth={2.5} aria-hidden="true" />
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div className={styles.sidebarOverlay} onClick={onToggle} aria-hidden="true" />
      )}
    </>
  );
}
