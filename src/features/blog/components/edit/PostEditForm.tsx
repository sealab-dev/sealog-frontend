import { useState, useEffect } from 'react';
import type { Editor } from '@tiptap/react';
import PostEditSidebar from './PostEditSidebar';
import PostEditor from './PostEditor';
import styles from './PostEditForm.module.css';
import SidebarToggleBtn from './SidebarToggleBtn';
import { useStackAutocompleteQuery } from '../../../../services/stack/stack.queries';
import type { StackOption } from '../../../../pages/blog/PostEditPage';

interface PostEditFormProps {
  title: string;
  tags: string[];
  selectedStacks: StackOption[];
  coverFile: File | null;
  coverUrl: string | null;
  selectedArchiveId: number | null;
  isPublic: boolean;
  editorRef: React.MutableRefObject<Editor | null>;
  initialContent?: string;
  onTitleChange: (title: string) => void;
  onTagsChange: (tags: string[]) => void;
  onStacksChange: (stacks: StackOption[]) => void;
  onCoverChange: (file: File | null) => void;
  onArchiveChange: (archiveId: number | null) => void;
  onVisibilityChange: (isPublic: boolean) => void;
}

export default function PostEditForm({
  title,
  tags,
  selectedStacks,
  coverFile,
  coverUrl,
  selectedArchiveId,
  isPublic,
  editorRef,
  initialContent,
  onTitleChange,
  onTagsChange,
  onStacksChange,
  onCoverChange,
  onArchiveChange,
  onVisibilityChange,
}: PostEditFormProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [tagInput, setTagInput] = useState('');
  const [stackQuery, setStackQuery] = useState('');
  const [debouncedStackQuery, setDebouncedStackQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedStackQuery(stackQuery), 300);
    return () => clearTimeout(timer);
  }, [stackQuery]);

  const { data: stackSuggestions } = useStackAutocompleteQuery(debouncedStackQuery);
  const filteredSuggestions = (stackSuggestions ?? []).filter(
    (s) => !selectedStacks.some((sel) => sel.id === s.id),
  );

  /* ── 태그 ── */
  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed) && tags.length < 10) {
      onTagsChange([...tags, trimmed]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => onTagsChange(tags.filter((t) => t !== tag));

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
    if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
      onTagsChange(tags.slice(0, -1));
    }
  };

  /* ── 스택 ── */
  const addStack = (stack: StackOption) => {
    if (!selectedStacks.some((s) => s.id === stack.id)) {
      onStacksChange([...selectedStacks, stack]);
    }
    setStackQuery('');
  };

  const removeStack = (id: number) => onStacksChange(selectedStacks.filter((s) => s.id !== id));

  return (
    <div className={styles.wrapper}>
      <div className={`${styles.sidebarWrap} ${sidebarOpen ? '' : styles.collapsed}`}>
        <PostEditSidebar
          coverFile={coverFile}
          coverUrl={coverUrl}
          selectedArchiveId={selectedArchiveId}
          isPublic={isPublic}
          onCoverChange={onCoverChange}
          onArchiveChange={onArchiveChange}
          onVisibilityChange={onVisibilityChange}
        />
      </div>
      <div className={styles.sidebarToggleWrap}>
        <SidebarToggleBtn isOpen={sidebarOpen} onToggle={() => setSidebarOpen((v) => !v)} />
      </div>
      <div className={styles.editor} data-scroll-root>
        <div className={styles.editorInner}>

          {/* 제목 */}
          <textarea
            className={styles.title}
            placeholder="제목을 입력하세요"
            rows={1}
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            onInput={(e) => {
              const el = e.currentTarget;
              el.style.height = 'auto';
              el.style.height = `${el.scrollHeight}px`;
            }}
          />

          <div className={styles.divider} />

          {/* 스택 */}
          <div className={styles.stackRow}>
            {selectedStacks.map((stack) => (
              <span key={stack.id} className={styles.stackTag}>
                {stack.name}
                <button type="button" onClick={() => removeStack(stack.id)} aria-label={`${stack.name} 제거`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </span>
            ))}
            <div className={styles.stackSearch}>
              <input
                className={styles.stackInput}
                type="text"
                placeholder={selectedStacks.length === 0 ? '사용 스택을 추가해보세요' : '스택 추가...'}
                value={stackQuery}
                onChange={(e) => setStackQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && filteredSuggestions.length > 0) {
                    e.preventDefault();
                    addStack(filteredSuggestions[0]);
                  }
                  if (e.key === 'Backspace' && !stackQuery && selectedStacks.length > 0) {
                    removeStack(selectedStacks[selectedStacks.length - 1].id);
                  }
                }}
              />
              {filteredSuggestions.length > 0 && (
                <ul className={styles.stackDropdown}>
                  {filteredSuggestions.map((stack) => (
                    <li key={stack.id}>
                      <button type="button" onMouseDown={() => addStack(stack)}>
                        {stack.name}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className={styles.divider} />

          {/* 태그 */}
          <div className={styles.tags}>
            {tags.map((tag) => (
              <span key={tag} className={styles.tag}>
                {tag}
                <button type="button" onClick={() => removeTag(tag)} aria-label={`${tag} 제거`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </span>
            ))}
            <input
              className={styles.tagInput}
              type="text"
              placeholder={tags.length === 0 ? '태그를 입력하세요 (Enter로 추가)' : '태그 추가...'}
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              onBlur={addTag}
            />
          </div>

          <div className={styles.divider} />

          {/* 에디터 */}
          <PostEditor editorRef={editorRef} initialContent={initialContent} />

        </div>
      </div>
    </div>
  );
}
