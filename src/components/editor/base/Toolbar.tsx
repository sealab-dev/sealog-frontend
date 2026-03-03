import type { Editor } from '@tiptap/react';
import {
  FaUndo,
  FaRedo,
  FaBold,
  FaItalic,
  FaStrikethrough,
  FaUnderline,
  FaCode,
  FaHighlighter,
  FaLink,
  FaListUl,
  FaListOl,
  FaTasks,
  FaQuoteRight,
  FaMinus,
  FaTable,
  FaRemoveFormat,
} from 'react-icons/fa';
import { useState } from 'react';
import CodeBlockLanguageSelector from './CodeBlockLanguageSelector';
import LinkModal from './LinkModal';
import styles from './Toolbar.module.css';

interface ToolbarProps {
  editor: Editor;
}

const Toolbar = ({ editor }: ToolbarProps) => {
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);

  const handleHeading = (level: 1 | 2 | 3) => {
    editor.chain().focus().toggleHeading({ level }).run();
  };

  const handleCodeBlock = () => {
    setShowLanguageSelector(true);
  };

  const handleLanguageSelect = (language: string) => {
    editor.chain().focus().toggleCodeBlock({ language }).run();
    setShowLanguageSelector(false);
  };

  const handleLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    if (previousUrl) {
      editor.chain().focus().unsetLink().run();
    } else {
      setShowLinkModal(true);
    }
  };

  const handleLinkSubmit = (url: string) => {
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
    setShowLinkModal(false);
  };

  const handleTable = () => {
    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
  };

  return (
    <div className={styles.toolbar}>
      {/* History */}
      <div className={styles.group}>
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className={styles.button}
          title="실행 취소"
        >
          <FaUndo />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className={styles.button}
          title="다시 실행"
        >
          <FaRedo />
        </button>
      </div>

      <div className={styles.divider} />

      {/* Headings */}
      <div className={styles.group}>
        <button
          type="button"
          onClick={() => handleHeading(1)}
          className={`${styles.button} ${editor.isActive('heading', { level: 1 }) ? styles.active : ''}`}
          title="제목 1"
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => handleHeading(2)}
          className={`${styles.button} ${editor.isActive('heading', { level: 2 }) ? styles.active : ''}`}
          title="제목 2"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => handleHeading(3)}
          className={`${styles.button} ${editor.isActive('heading', { level: 3 }) ? styles.active : ''}`}
          title="제목 3"
        >
          H3
        </button>
      </div>

      <div className={styles.divider} />

      {/* Text Styling */}
      <div className={styles.group}>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`${styles.button} ${editor.isActive('bold') ? styles.active : ''}`}
          title="굵게"
        >
          <FaBold />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`${styles.button} ${editor.isActive('italic') ? styles.active : ''}`}
          title="기울임"
        >
          <FaItalic />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`${styles.button} ${editor.isActive('strike') ? styles.active : ''}`}
          title="취소선"
        >
          <FaStrikethrough />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`${styles.button} ${editor.isActive('underline') ? styles.active : ''}`}
          title="밑줄"
        >
          <FaUnderline />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`${styles.button} ${editor.isActive('code') ? styles.active : ''}`}
          title="인라인 코드"
        >
          <FaCode />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={`${styles.button} ${editor.isActive('highlight') ? styles.active : ''}`}
          title="형광펜"
        >
          <FaHighlighter />
        </button>
      </div>

      <div className={styles.divider} />

      {/* Link */}
      <div className={styles.group}>
        <button
          type="button"
          onClick={handleLink}
          className={`${styles.button} ${editor.isActive('link') ? styles.active : ''}`}
          title="링크"
        >
          <FaLink />
        </button>
      </div>

      <div className={styles.divider} />

      {/* Lists */}
      <div className={styles.group}>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`${styles.button} ${editor.isActive('bulletList') ? styles.active : ''}`}
          title="순서 없는 목록"
        >
          <FaListUl />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`${styles.button} ${editor.isActive('orderedList') ? styles.active : ''}`}
          title="순서 있는 목록"
        >
          <FaListOl />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          className={`${styles.button} ${editor.isActive('taskList') ? styles.active : ''}`}
          title="체크리스트"
        >
          <FaTasks />
        </button>
      </div>

      <div className={styles.divider} />

      {/* Blockquote & HR */}
      <div className={styles.group}>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`${styles.button} ${editor.isActive('blockquote') ? styles.active : ''}`}
          title="인용구"
        >
          <FaQuoteRight />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className={styles.button}
          title="구분선"
        >
          <FaMinus />
        </button>
      </div>

      <div className={styles.divider} />

      {/* Code Block */}
      <div className={styles.group}>
        <button
          type="button"
          onClick={handleCodeBlock}
          className={`${styles.button} ${editor.isActive('codeBlock') ? styles.active : ''}`}
          title="코드 블럭"
        >
          {'</>'}
        </button>
      </div>

      <div className={styles.divider} />

      {/* Table */}
      <div className={styles.group}>
        <button
          type="button"
          onClick={handleTable}
          className={styles.button}
          title="테이블"
        >
          <FaTable />
        </button>
      </div>

      <div className={styles.divider} />

      {/* Clear Format */}
      <div className={styles.group}>
        <button
          type="button"
          onClick={() => editor.chain().focus().unsetAllMarks().run()}
          className={styles.button}
          title="서식 지우기"
        >
          <FaRemoveFormat />
        </button>
      </div>

      {/* Language Selector Modal */}
      {showLanguageSelector && (
        <CodeBlockLanguageSelector
          onSelect={handleLanguageSelect}
          onClose={() => setShowLanguageSelector(false)}
        />
      )}

      {/* Link Modal */}
      {showLinkModal && (
        <LinkModal
          onSubmit={handleLinkSubmit}
          onClose={() => setShowLinkModal(false)}
        />
      )}
    </div>
  );
};

export default Toolbar;