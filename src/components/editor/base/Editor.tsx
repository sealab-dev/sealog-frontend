import { EditorContent } from '@tiptap/react';
import Toolbar from './Toolbar';
import TableBubbleMenu from './TableBubbleMenu';
import { useMyEditor } from '../hooks';
import type { EditorOptions } from '../types';
import styles from './Editor.module.css';

interface EditorProps extends Omit<EditorOptions, 'mode'> {
  className?: string;
}

const Editor = ({
  content,
  placeholder,
  onUpdate,
  editable = true,
  className,
}: EditorProps) => {
  const { editor } = useMyEditor({
    mode: 'editor',
    content,
    placeholder,
    onUpdate,
    editable,
  });

  if (!editor) {
    return <div className={styles.loading}>에디터를 불러오는 중...</div>;
  }

  return (
    <div className={`${styles.container} ${className || ''}`}>
      {editable && <Toolbar editor={editor} />}
      
      <EditorContent editor={editor} className={styles.editorContent} />
      {editable && <TableBubbleMenu editor={editor} />}
    </div>
  );
};

export default Editor;