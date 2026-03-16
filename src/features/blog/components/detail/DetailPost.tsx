import { useState, useEffect, memo } from 'react';
import type { TocItem } from '../../types/post';
import './DetailPost.css';

interface DetailPostProps {
  toc: TocItem[];
  content: string;
}

/**
 * 게시글 본문 영역 (메모이제이션 적용)
 * 목차 활성화 상태 변화로 인한 리렌더링 시 HTML이 다시 그려지는 것을 방지하여 깜빡임을 해결합니다.
 */
const PostBody = memo(({ html }: { html: string }) => {
  return (
    <div
      className="detail-post-body"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
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
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
              목차
            </div>
            <div className="detail-toc-box__chevron">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
          </div>
          {tocOpen && (
            <div className="detail-toc-box__body">
              {toc.map((item) => (
                <a
                  key={item.id}
                  className={`detail-toc-item detail-toc-item--h${item.level}${
                    activeToc === item.id ? ' detail-toc-item--active' : ''
                  }`}
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

      <PostBody html={content} />
    </>
  );
}
