import { useState } from "react";
import { X, Plus, BookOpen } from "lucide-react";
import styles from "./PublishModal.module.css";

/* ------------------------------------------------------------------ */
/* Types                                                                */
/* ------------------------------------------------------------------ */
export interface CollectionOption {
  id: number;
  name: string;
}

interface PublishModalProps {
  isOpen: boolean;
  collectionList: CollectionOption[];
  onConfirm: (
    collectionId: number | null,
    newCollectionName: string | null,
  ) => void;
  onCancel: () => void;
}

type CollectionMode = "existing" | "new";

/* ------------------------------------------------------------------ */
/* Component                                                            */
/* ------------------------------------------------------------------ */
export const PublishModal = ({
  isOpen,
  collectionList,
  onConfirm,
  onCancel,
}: PublishModalProps) => {
  // 기존 컬렉션이 있으면 existing 먼저, 없으면 new 먼저
  const [mode, setMode] = useState<CollectionMode>(
    collectionList.length > 0 ? "existing" : "new",
  );
  const [selectedCollectionId, setSelectedCollectionId] = useState<
    number | null
  >(collectionList.length > 0 ? collectionList[0].id : null);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [newCollectionError, setNewCollectionError] = useState("");

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (mode === "new") {
      const trimmed = newCollectionName.trim();
      if (!trimmed) {
        setNewCollectionError("컬렉션 이름을 입력해주세요");
        return;
      }
      if (trimmed.length > 50) {
        setNewCollectionError("50자 이하로 입력해주세요");
        return;
      }
      onConfirm(null, trimmed);
    } else {
      if (!selectedCollectionId) {
        return; // 선택 안 된 경우 — UI에서 막힘
      }
      onConfirm(selectedCollectionId, null);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onCancel();
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal} role="dialog" aria-modal="true">
        {/* 헤더 */}
        <div className={styles.header}>
          <h2 className={styles.title}>글 발행</h2>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onCancel}
          >
            <X size={20} />
          </button>
        </div>

        {/* 본문 */}
        <div className={styles.body}>
          <p className={styles.question}>이 글을 포함할 컬렉션을 선택하세요</p>

          {/* 탭 */}
          <div className={styles.tabs}>
            {collectionList.length > 0 && (
              <button
                type="button"
                className={`${styles.tab} ${mode === "existing" ? styles.tabActive : ""}`}
                onClick={() => setMode("existing")}
              >
                <BookOpen size={15} />
                기존 컬렉션
              </button>
            )}
            <button
              type="button"
              className={`${styles.tab} ${mode === "new" ? styles.tabActive : ""}`}
              onClick={() => setMode("new")}
            >
              <Plus size={15} />새 컬렉션
            </button>
          </div>

          {/* 기존 컬렉션 목록 */}
          {mode === "existing" && (
            <ul className={styles.collectionList}>
              {collectionList.map((s) => (
                <li key={s.id}>
                  <label
                    className={`${styles.collectionItem} ${selectedCollectionId === s.id ? styles.collectionItemActive : ""}`}
                  >
                    <input
                      type="radio"
                      name="collectionId"
                      className={styles.radioInput}
                      checked={selectedCollectionId === s.id}
                      onChange={() => setSelectedCollectionId(s.id)}
                    />
                    <span className={styles.collectionName}>{s.name}</span>
                  </label>
                </li>
              ))}
            </ul>
          )}

          {/* 새 컬렉션 입력 */}
          {mode === "new" && (
            <div className={styles.newCollectionWrapper}>
              <input
                type="text"
                className={`${styles.newCollectionInput} ${newCollectionError ? styles.inputError : ""}`}
                placeholder="컬렉션 이름을 입력하세요"
                value={newCollectionName}
                onChange={(e) => {
                  setNewCollectionName(e.target.value);
                  if (newCollectionError) setNewCollectionError("");
                }}
                maxLength={50}
                autoFocus
              />
              <div className={styles.inputMeta}>
                {newCollectionError ? (
                  <span className={styles.errorText}>{newCollectionError}</span>
                ) : (
                  <span />
                )}
                <span className={styles.charCount}>
                  {newCollectionName.length}/50
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 푸터 */}
        <div className={styles.footer}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={onCancel}
          >
            취소
          </button>
          <button
            type="button"
            className={styles.confirmButton}
            onClick={handleConfirm}
            disabled={mode === "existing" && !selectedCollectionId}
          >
            발행하기
          </button>
        </div>
      </div>
    </div>
  );
};
