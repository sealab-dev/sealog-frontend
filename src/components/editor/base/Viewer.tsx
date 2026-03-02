import { EditorContent } from '@tiptap/react';
import { useMyEditor } from '../hooks';
import type { EditorOptions } from '../types';
import styles from './Viewer.module.css';

interface ViewerProps extends Omit<EditorOptions, 'mode' | 'onUpdate' | 'editable'> {
  className?: string;
}

const Viewer = ({ content, className }: ViewerProps) => {
  const { editor } = useMyEditor({
    mode: 'viewer',
    content,
    editable: false,
  });

  if (!editor) {
    return <div className={styles.loading}>콘텐츠를 불러오는 중...</div>;
  }

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <EditorContent editor={editor} className={styles.viewerContent} />
    </div>
  );
};

export default Viewer;