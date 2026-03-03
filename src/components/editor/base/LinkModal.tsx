import { useState } from 'react';
import styles from './LinkModal.module.css';

interface LinkModalProps {
  onSubmit: (url: string) => void;
  onClose: () => void;
}

const LinkModal = ({ onSubmit, onClose }: LinkModalProps) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(url);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.title}>링크 추가</h3>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className={styles.input}
            autoFocus
            required
          />
          <div className={styles.buttons}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              취소
            </button>
            <button type="submit" className={styles.submitButton}>
              추가
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LinkModal;
