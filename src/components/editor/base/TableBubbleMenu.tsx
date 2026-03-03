import { type Editor } from '@tiptap/react';
import { useEffect, useState, useRef } from 'react';
import {
  FaPlus,
  FaMinus,
  FaArrowUp,
  FaArrowDown,
  FaArrowLeft,
  FaArrowRight,
  FaObjectGroup,
  FaCut,
  FaTrash,
  FaTable,
} from 'react-icons/fa';
import styles from './TableBubbleMenu.module.css';

interface TableBubbleMenuProps {
  editor: Editor;
}

const TableBubbleMenu = ({ editor }: TableBubbleMenuProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!editor) return;

    const updateMenu = () => {
      const isTableActive = editor.isActive('table');

      if (isTableActive) {
        setIsVisible(true);

        // 테이블 요소 찾기
        const { view } = editor;
        const { state } = view;
        const { from } = state.selection;
        
        // 현재 선택된 노드에서 테이블 찾기
        let tableNode = null;
        let tablePos = null;
        
        state.doc.nodesBetween(from, from, (node, pos) => {
          if (node.type.name === 'table') {
            tableNode = node;
            tablePos = pos;
            return false;
          }
        });

        if (tableNode && tablePos !== null) {
          // 테이블의 DOM 요소 가져오기
          const tableDOM = view.nodeDOM(tablePos) as HTMLElement;
          
          if (tableDOM) {
            const rect = tableDOM.getBoundingClientRect();
            const menuWidth = 600; // 메뉴의 대략적인 너비
            
            // 테이블 상단 중앙에 위치
            setPosition({
              top: rect.top - 50, // 테이블 위 50px
              left: rect.left + (rect.width / 2) - (menuWidth / 2), // 중앙 정렬
            });
          }
        }
      } else {
        setIsVisible(false);
      }
    };

    editor.on('selectionUpdate', updateMenu);
    editor.on('transaction', updateMenu);

    // 초기 업데이트
    updateMenu();

    return () => {
      editor.off('selectionUpdate', updateMenu);
      editor.off('transaction', updateMenu);
    };
  }, [editor]);

  if (!isVisible || !editor) return null;

  return (
    <div
      ref={menuRef}
      className={styles.menu}
      style={{
        position: 'fixed',
        top: `${position.top}px`,
        left: `${position.left}px`,
        zIndex: 1000,
      }}
    >
      {/* 행 추가 */}
      <div className={styles.group}>
        <button
          type="button"
          onClick={() => editor.chain().focus().addRowBefore().run()}
          className={styles.button}
          title="위에 행 추가"
        >
          <FaArrowUp />
          <FaPlus className={styles.smallIcon} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().addRowAfter().run()}
          className={styles.button}
          title="아래에 행 추가"
        >
          <FaArrowDown />
          <FaPlus className={styles.smallIcon} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().deleteRow().run()}
          className={styles.button}
          title="행 삭제"
        >
          <FaMinus />
          <FaArrowUp />
        </button>
      </div>

      <div className={styles.divider} />

      {/* 열 추가 */}
      <div className={styles.group}>
        <button
          type="button"
          onClick={() => editor.chain().focus().addColumnBefore().run()}
          className={styles.button}
          title="왼쪽에 열 추가"
        >
          <FaArrowLeft />
          <FaPlus className={styles.smallIcon} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().addColumnAfter().run()}
          className={styles.button}
          title="오른쪽에 열 추가"
        >
          <FaArrowRight />
          <FaPlus className={styles.smallIcon} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().deleteColumn().run()}
          className={styles.button}
          title="열 삭제"
        >
          <FaMinus />
          <FaArrowLeft />
        </button>
      </div>

      <div className={styles.divider} />

      {/* 헤더 */}
      <div className={styles.group}>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeaderRow().run()}
          className={styles.button}
          title="헤더 행 토글"
        >
          <FaTable />
          <span className={styles.headerText}>H</span>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeaderColumn().run()}
          className={styles.button}
          title="헤더 열 토글"
        >
          <FaTable />
          <span className={styles.headerText}>V</span>
        </button>
      </div>

      <div className={styles.divider} />

      {/* 셀 병합/분할 */}
      <div className={styles.group}>
        <button
          type="button"
          onClick={() => editor.chain().focus().mergeCells().run()}
          disabled={!editor.can().mergeCells()}
          className={styles.button}
          title="셀 병합"
        >
          <FaObjectGroup />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().splitCell().run()}
          disabled={!editor.can().splitCell()}
          className={styles.button}
          title="셀 분할"
        >
          <FaCut />
        </button>
      </div>

      <div className={styles.divider} />

      {/* 테이블 삭제 */}
      <div className={styles.group}>
        <button
          type="button"
          onClick={() => editor.chain().focus().deleteTable().run()}
          className={`${styles.button} ${styles.danger}`}
          title="테이블 삭제"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

export default TableBubbleMenu;