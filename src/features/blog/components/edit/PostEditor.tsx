import { useEditor, EditorContent, useEditorState } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { Node, mergeAttributes, Extension } from '@tiptap/core';
import { TextSelection, NodeSelection } from '@tiptap/pm/state';
import { useCallback, useRef, useState, useEffect } from 'react';
import type { Editor } from '@tiptap/react';
import styles from './PostEditor.module.css';
import { fileApi } from '../../../../services/file/file.api';

const lowlight = createLowlight(common);

/* ── 표 셀 내 전체 선택 ── */
const TableCellSelect = Extension.create({
  name: 'tableCellSelect',
  priority: 200, // 테이블 익스텐션(기본 100)보다 먼저 실행
  addKeyboardShortcuts() {
    const getCellNode = ($pos: { depth: number; node: (d: number) => { type: { name: string } } }) => {
      for (let d = $pos.depth; d > 0; d--) {
        const name = $pos.node(d).type.name;
        if (name === 'tableCell' || name === 'tableHeader') return { node: $pos.node(d), depth: d };
      }
      return null;
    };

    const deleteIfSameCell = (editor: Editor) => {
      const { selection } = editor.state;

      // 1. 테이블 자체가 선택된 경우 (NodeSelection) 삭제
      if (selection instanceof NodeSelection && selection.node.type.name === 'table') {
        return editor.commands.deleteTable();
      }

      const { $from, empty } = selection;
      const cell = getCellNode($from);

      if (cell) {
        // 테이블 전체에 내용이 하나도 없는지 확인 (빈 테이블 삭제 로직)
        const tableNode = $from.node(cell.depth - 2);
        if (tableNode && tableNode.type.name === 'table') {
          let hasContent = false;
          tableNode.descendants((node) => {
            if (node.isText || node.type.name === 'image' || node.type.name === 'video') {
              hasContent = true;
              return false;
            }
          });

          if (!hasContent && empty) {
            return editor.commands.deleteTable();
          }
        }

        // 2. 셀 내부 선택 영역 삭제 처리
        if (!empty) {
          const toCell = getCellNode(selection.$to);
          if (toCell && cell.node === toCell.node) {
            // 셀 전체가 선택된 경우, 내용을 지우고 빈 단락을 삽입하여 포커스 유지
            if (selection.from === $from.start(cell.depth) && selection.to === $from.end(cell.depth)) {
              return editor.chain().focus().insertContent('<p></p>').setTextSelection($from.start(cell.depth) + 1).run();
            }
            return editor.chain().focus().deleteSelection().run();
          }
        }
      }

      return false;
    };

    return {
      'Mod-a': ({ editor }) => {
        const { state } = editor.view;
        const { selection } = state;
        const cell = getCellNode(selection.$from);
        if (!cell) return false;

        const start = selection.$from.start(cell.depth);
        const end = selection.$from.end(cell.depth);

        // 이미 셀 내용이 전체 선택된 상태라면, 한 번 더 눌렀을 때 에디터 전체 선택이 되도록 false 반환
        if (selection.from === start && selection.to === end) {
          return false;
        }

        editor.view.dispatch(state.tr.setSelection(TextSelection.create(state.doc, start, end)));
        return true;
      },
      'Backspace': ({ editor }) => deleteIfSameCell(editor),
      'Delete': ({ editor }) => deleteIfSameCell(editor),
    };
  },
});

/* ── 커스텀 Image ── */
const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      'data-file-id': { default: null, parseHTML: (el) => el.getAttribute('data-file-id'), renderHTML: (attrs) => attrs['data-file-id'] ? { 'data-file-id': attrs['data-file-id'] } : {} },
      'data-file-path': { default: null, parseHTML: (el) => el.getAttribute('data-file-path'), renderHTML: (attrs) => attrs['data-file-path'] ? { 'data-file-path': attrs['data-file-path'] } : {} },
    };
  },
});

/* ── 커스텀 Video ── */
const VideoNode = Node.create({
  name: 'video', group: 'block', atom: true,
  addAttributes() { return { src: { default: null }, 'data-file-id': { default: null }, 'data-file-path': { default: null } }; },
  parseHTML() { return [{ tag: 'video[src], video[data-file-id]' }]; },
  renderHTML({ HTMLAttributes }) { return ['video', mergeAttributes(HTMLAttributes, { controls: '', style: 'max-width: 100%; border-radius: 8px;' })]; },
});

/* ── 콜아웃 ── */
const CalloutNode = Node.create({
  name: 'callout',
  group: 'block',
  content: 'block+',
  defining: true,
  parseHTML() { return [{ tag: 'div[data-type="callout"]' }]; },
  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'callout', class: 'callout' }), 0];
  },
});

interface PostEditorProps { editorRef?: React.MutableRefObject<Editor | null>; initialContent?: string; }
interface ToolbarButtonProps { onClick: () => void; active?: boolean; disabled?: boolean; title: string; children: React.ReactNode; }

function ToolbarButton({ onClick, active, disabled, title, children }: ToolbarButtonProps) {
  return (
    <button type="button" onMouseDown={(e) => { e.preventDefault(); onClick(); }} className={`${styles.toolbarBtn} ${active ? styles.toolbarBtnActive : ''}`} disabled={disabled} title={title}>
      {children}
    </button>
  );
}

function ToolbarDivider() { return <span className={styles.toolbarDivider} />; }

export default function PostEditor({ editorRef, initialContent }: PostEditorProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isSticky, setIsSticky] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const hideOverlayTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [tableOverlay, setTableOverlay] = useState<{
    addColPos: { x: number; y: number } | null;
    addRowPos: { x: number; y: number } | null;
    delColPos: { x: number; y: number } | null;
    delRowPos: { x: number; y: number } | null;
    hoveredCell: HTMLTableCellElement;
  } | null>(null);

  useEffect(() => {
    const toolbar = toolbarRef.current;
    if (!toolbar) return;
    const scrollEl = toolbar.closest('[data-scroll-root]') as HTMLElement | null;
    if (!scrollEl) return;
    const onScroll = () => {
      const toolbarTop = toolbar.getBoundingClientRect().top;
      const containerTop = scrollEl.getBoundingClientRect().top;
      setIsSticky(toolbarTop <= containerTop + 1);
    };
    scrollEl.addEventListener('scroll', onScroll, { passive: true });
    return () => scrollEl.removeEventListener('scroll', onScroll);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }), 
      Underline, 
      TextAlign.configure({ types: ['heading', 'paragraph'] }), 
      TextStyle, Color,
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: 'noopener noreferrer' } }), 
      CustomImage.configure({ inline: false }), 
      VideoNode, CalloutNode,
      Table.configure({ resizable: true }), TableRow, TableHeader, TableCell, TableCellSelect,
      Placeholder.configure({ placeholder: '내용을 작성하거나 노션에서 복사한 내용을 붙여넣으세요...' }), 
      CharacterCount, 
      CodeBlockLowlight.extend({
        addKeyboardShortcuts() {
          return {
            'Mod-a': ({ editor }) => {
              const { state } = editor.view;
              const { $from } = state.selection;
              let depth = $from.depth;
              while (depth > 0) {
                if ($from.node(depth).type.name === 'codeBlock') {
                  const start = $from.start(depth);
                  const end = $from.end(depth);
                  editor.view.dispatch(state.tr.setSelection(TextSelection.create(state.doc, start, end)));
                  return true;
                }
                depth--;
              }
              return false;
            },
          };
        },
      }).configure({ lowlight }),
    ],
    content: initialContent ?? '',
  });

  useEffect(() => { if (editorRef) editorRef.current = editor; }, [editor, editorRef]);

  const active = useEditorState({
    editor: editor!,
    selector: ({ editor: e }) => ({
      bold:        e?.isActive('bold') ?? false,
      italic:      e?.isActive('italic') ?? false,
      underline:   e?.isActive('underline') ?? false,
      h1:          e?.isActive('heading', { level: 1 }) ?? false,
      h2:          e?.isActive('heading', { level: 2 }) ?? false,
      h3:          e?.isActive('heading', { level: 3 }) ?? false,
      bulletList:  e?.isActive('bulletList') ?? false,
      orderedList: e?.isActive('orderedList') ?? false,
      blockquote:  e?.isActive('blockquote') ?? false,
      callout:     e?.isActive('callout') ?? false,
      codeBlock:   e?.isActive('codeBlock') ?? false,
      code:        e?.isActive('code') ?? false,
      link:        e?.isActive('link') ?? false,
    }),
  });

  const setLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes('link').href ?? '';
    const url = window.prompt('링크 URL을 입력하세요', prev);
    if (url === null) return;
    if (url === '') { editor.chain().focus().extendMarkRange('link').unsetLink().run(); return; }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const scheduleHide = useCallback(() => {
    hideOverlayTimeout.current = setTimeout(() => setTableOverlay(null), 400);
  }, []);

  const cancelHide = useCallback(() => clearTimeout(hideOverlayTimeout.current), []);

  const handleEditorMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    cancelHide();
    const cell = (e.target as HTMLElement).closest('td, th') as HTMLTableCellElement | null;
    if (!cell) { scheduleHide(); return; }
    const table = cell.closest('table') as HTMLTableElement | null;
    if (!table) { scheduleHide(); return; }

    const row = cell.closest('tr') as HTMLTableRowElement;
    const allRows = Array.from(table.querySelectorAll('tr'));
    const cellsInRow = Array.from(row.querySelectorAll('td, th'));
    const isFirstRow = row === allRows[0];
    const isLastRow = row === allRows[allRows.length - 1];
    const isFirstCol = cell === cellsInRow[0];
    const isLastCol = cell === cellsInRow[cellsInRow.length - 1];

    const tableRect = table.getBoundingClientRect();
    const cellRect = cell.getBoundingClientRect();
    const origin = wrapperRef.current?.getBoundingClientRect() ?? { top: 0, left: 0 };

    setTableOverlay({
      addColPos: isLastCol ? { x: tableRect.right + 6 - origin.left, y: tableRect.top + tableRect.height / 2 - 11 - origin.top } : null,
      addRowPos: isLastRow ? { x: tableRect.left + tableRect.width / 2 - 11 - origin.left, y: tableRect.bottom + 6 - origin.top } : null,
      delColPos: isFirstRow ? { x: cellRect.left + cellRect.width / 2 - 11 - origin.left, y: tableRect.top - 28 - origin.top } : null,
      delRowPos: isFirstCol ? { x: tableRect.left - 28 - origin.left, y: cellRect.top + cellRect.height / 2 - 11 - origin.top } : null,
      hoveredCell: cell,
    });
  }, [cancelHide, scheduleHide]);

  const runTableCommand = useCallback((
    cell: HTMLTableCellElement | null,
    command: 'addColumnAfter' | 'deleteColumn' | 'addRowAfter' | 'deleteRow',
  ) => {
    if (!editor || !cell) return;
    try {
      const pos = editor.view.posAtDOM(cell, 0);
      const chain = editor.chain().focus().setTextSelection(pos + 1);
      switch (command) {
        case 'addColumnAfter': chain.addColumnAfter().run(); break;
        case 'deleteColumn': chain.deleteColumn().run(); break;
        case 'addRowAfter': chain.addRowAfter().run(); break;
        case 'deleteRow': chain.deleteRow().run(); break;
      }
    } catch {}
  }, [editor]);

  const handleMediaUpload = useCallback(async (file: File) => {
    if (!editor) return;
    setIsUploading(true);
    try {
      const res = await fileApi.upload(file);
      const nodeType = file.type.startsWith('video/') ? 'video' : 'image';
      editor.chain().focus().insertContent({ type: nodeType, attrs: { src: res.fileUrl, 'data-file-id': String(res.id), 'data-file-path': res.path } }).run();
    } catch {} finally { setIsUploading(false); }
  }, [editor]);

  if (!editor) return null;

  return (
    <div ref={wrapperRef} className={styles.wrapper} style={{ position: 'relative' }}>
      <div ref={toolbarRef} className={`${styles.toolbar} ${isSticky ? styles.toolbarSticky : ''}`}>
        {/* 헤딩 버튼 (드롭다운 대신 버튼으로) */}
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={active.h1} title="H1">
          <span style={{ fontWeight: 'bold', fontSize: '16px' }}>H1</span>
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={active.h2} title="H2">
          <span style={{ fontWeight: 'bold', fontSize: '16px' }}>H2</span>
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={active.h3} title="H3">
          <span style={{ fontWeight: 'bold', fontSize: '16px' }}>H3</span>
        </ToolbarButton>

        <ToolbarDivider />

        {/* 텍스트 서식 */}
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={active.bold} title="굵게 (Ctrl+B)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></svg>
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={active.italic} title="기울임 (Ctrl+I)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={active.underline} title="밑줄 (Ctrl+U)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"/><line x1="4" y1="21" x2="20" y2="21"/></svg>
        </ToolbarButton>

        <ToolbarDivider />

        {/* 리스트 및 블록 */}
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={active.bulletList} title="글머리 기호">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/><circle cx="4" cy="6" r="1" fill="currentColor"/><circle cx="4" cy="12" r="1" fill="currentColor"/><circle cx="4" cy="18" r="1" fill="currentColor"/></svg>
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={active.orderedList} title="번호 목록">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={active.blockquote} title="인용문">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => {
            if (active.callout) {
              editor.chain().focus().lift('callout').run();
            } else {
              editor.chain().focus().wrapIn('callout').run();
            }
          }}
          active={active.callout}
          title="콜아웃"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="3"/><circle cx="7" cy="12" r="1.5" fill="currentColor" stroke="none"/><line x1="11" y1="9" x2="19" y2="9"/><line x1="11" y1="12" x2="19" y2="12"/><line x1="11" y1="15" x2="16" y2="15"/></svg>
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={active.codeBlock} title="코드 블록">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="16" rx="2"/><path d="M8 9l-3 3 3 3"/><path d="M16 9l3 3-3 3"/><line x1="12" y1="7" x2="12" y2="17" opacity=".5"/></svg>
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()} active={active.code} title="인라인 코드">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="10 8 4 12 10 16"/><polyline points="14 8 20 12 14 16"/></svg>
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="구분선">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="12" x2="21" y2="12"/></svg>
        </ToolbarButton>

        <ToolbarDivider />

        {/* 미디어 및 링크 */}
        <ToolbarButton onClick={setLink} active={active.link} title="링크 삽입">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
        </ToolbarButton>
        <ToolbarButton onClick={() => imageInputRef.current?.click()} disabled={isUploading} title="이미지 업로드">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
        </ToolbarButton>
        <input ref={imageInputRef} type="file" accept="image/*" className={styles.hiddenInput} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleMediaUpload(f); e.target.value = ''; }} />
        
        <ToolbarButton onClick={() => videoInputRef.current?.click()} disabled={isUploading} title="비디오 업로드">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
        </ToolbarButton>
        <input ref={videoInputRef} type="file" accept="video/*" className={styles.hiddenInput} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleMediaUpload(f); e.target.value = ''; }} />

        <ToolbarButton onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} title="표 삽입">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>
        </ToolbarButton>

        {isUploading && <span className={styles.uploadingIndicator}>업로드 중...</span>}
      </div>
      <div onMouseMove={handleEditorMouseMove} onMouseLeave={scheduleHide}>
        <EditorContent editor={editor} className={styles.editorContent} />
      </div>

      {tableOverlay && (
        <>
          {/* 열 추가 (+) — 마지막 열 호버 시 오른쪽 */}
          {tableOverlay.addColPos && (
            <button
              className={styles.tableCtrlAdd}
              style={{ top: tableOverlay.addColPos.y, left: tableOverlay.addColPos.x }}
              onMouseEnter={cancelHide}
              onMouseLeave={scheduleHide}
              onMouseDown={(e) => { e.preventDefault(); runTableCommand(tableOverlay.hoveredCell, 'addColumnAfter'); }}
              title="열 추가"
            >+</button>
          )}

          {/* 행 추가 (+) — 마지막 행 호버 시 하단 */}
          {tableOverlay.addRowPos && (
            <button
              className={styles.tableCtrlAdd}
              style={{ top: tableOverlay.addRowPos.y, left: tableOverlay.addRowPos.x }}
              onMouseEnter={cancelHide}
              onMouseLeave={scheduleHide}
              onMouseDown={(e) => { e.preventDefault(); runTableCommand(tableOverlay.hoveredCell, 'addRowAfter'); }}
              title="행 추가"
            >+</button>
          )}

          {/* 열 삭제 (−) — 첫 번째 행 호버 시 상단 */}
          {tableOverlay.delColPos && (
            <button
              className={styles.tableCtrlDel}
              style={{ top: tableOverlay.delColPos.y, left: tableOverlay.delColPos.x }}
              onMouseEnter={cancelHide}
              onMouseLeave={scheduleHide}
              onMouseDown={(e) => { e.preventDefault(); runTableCommand(tableOverlay.hoveredCell, 'deleteColumn'); }}
              title="열 삭제"
            >−</button>
          )}

          {/* 행 삭제 (−) — 첫 번째 열 호버 시 왼쪽 */}
          {tableOverlay.delRowPos && (
            <button
              className={styles.tableCtrlDel}
              style={{ top: tableOverlay.delRowPos.y, left: tableOverlay.delRowPos.x }}
              onMouseEnter={cancelHide}
              onMouseLeave={scheduleHide}
              onMouseDown={(e) => { e.preventDefault(); runTableCommand(tableOverlay.hoveredCell, 'deleteRow'); }}
              title="행 삭제"
            >−</button>
          )}
        </>
      )}
    </div>
  );
}
