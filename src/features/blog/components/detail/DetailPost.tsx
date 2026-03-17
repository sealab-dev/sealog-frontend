import { useState, useEffect, useMemo, memo } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
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
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { Node, mergeAttributes } from '@tiptap/core';
import { common, createLowlight } from 'lowlight';
import type { TocItem } from '../../types/post';
import editorStyles from '../edit/PostEditor.module.css';
import './DetailPost.css';

const lowlight = createLowlight(common);

/* ── 커스텀 Image (data-file-id, data-file-path 속성 유지) ── */
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


interface DetailPostProps {
  toc: TocItem[];
  content: string;
}

const PostBody = memo(({ content }: { content: string }) => {
  const extensions = useMemo(() => [
    StarterKit.configure({ codeBlock: false }),
    Underline,
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    TextStyle, Color,
    Link.configure({ openOnClick: true, HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' } }),
    CustomImage.configure({ inline: false }),
    VideoNode, CalloutNode,
    Table.configure({ resizable: false }), TableRow, TableHeader, TableCell,
    CodeBlockLowlight.configure({ lowlight }),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], []);

  const editor = useEditor({
    editable: false,
    extensions,
    content,
  });

  useEffect(() => {
    if (!editor || !content) return;
    if (editor.getHTML() === content) return;
    editor.commands.setContent(content, { emitUpdate: false });
  }, [editor, content]);

  // TipTap이 heading의 id 속성을 스키마에 없다는 이유로 제거하므로, 렌더링 후 DOM에 직접 주입
  useEffect(() => {
    if (!editor) return;
    requestAnimationFrame(() => {
      Array.from(editor.view.dom.querySelectorAll('h1, h2, h3')).forEach((h, i) => {
        (h as HTMLElement).id = `h-${i}`;
      });
    });
  }, [editor, content]);

  useEffect(() => {
    if (!editor) return;

    const dom = editor.view.dom;
    const blocks = dom.querySelectorAll('pre');
    blocks.forEach((block) => {
      if (block.querySelector('.detail-code-copy-floating')) return;

      const codeEl = block.querySelector('code');
      if (!codeEl) return;

      const copyBtn = document.createElement('button');
      copyBtn.className = 'detail-code-copy-floating';
      copyBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
      `;
      copyBtn.title = 'Copy code';
      copyBtn.onclick = () => {
        navigator.clipboard.writeText(codeEl.innerText).then(() => {
          copyBtn.classList.add('copied');
          setTimeout(() => copyBtn.classList.remove('copied'), 2000);
        });
      };

      block.appendChild(copyBtn);
    });
  }, [editor]);

  return <EditorContent editor={editor} className={`${editorStyles.editorContent} detail-post-body`} />;
});

PostBody.displayName = 'PostBody';

export default function DetailPost({ toc, content }: DetailPostProps) {
  const [tocOpen, setTocOpen] = useState(true);
  const [activeToc, setActiveToc] = useState(toc[0]?.id ?? '');

  useEffect(() => {
    if (toc.length === 0) return;
    const sectionIds = toc.map((item) => item.id);
    const onScroll = () => {
      let current = sectionIds[0];
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 120) {
          current = id;
        }
      }
      setActiveToc(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [toc]);

  return (
    <>
      {toc.length > 0 && (
        <div className={`detail-toc-box${tocOpen ? '' : ' detail-toc-box--collapsed'}`}>
          <div
            className="detail-toc-box__header"
            onClick={() => setTocOpen((v) => !v)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setTocOpen((v) => !v)}
          >
            <div className="detail-toc-box__title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
              목차
            </div>
            <div className="detail-toc-box__chevron">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
          </div>
          {tocOpen && (
            <div className="detail-toc-box__body">
              {toc.map((item) => (
                <a
                  key={item.id}
                  className={`detail-toc-item detail-toc-item--h${item.level}${activeToc === item.id ? ' detail-toc-item--active' : ''}`}
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                    setActiveToc(item.id);
                  }}
                >
                  {item.text}
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      <PostBody content={content} />
    </>
  );
}
