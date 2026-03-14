import { useState, useEffect } from 'react';
import type { TocItem } from '../../types/post';
import './DetailPost.css';

interface DetailPostProps {
  toc: TocItem[];
  content: string;
}

export default function DetailPost({ toc, content }: DetailPostProps) {
  const [tocOpen, setTocOpen] = useState(true);
  const [activeToc, setActiveToc] = useState(toc[0]?.id ?? '');
  const [prevToc, setPrevToc] = useState(toc);

  if (prevToc !== toc) {
    setPrevToc(toc);
    setActiveToc(toc[0]?.id ?? '');
  }

  useEffect(() => {
    if (toc.length === 0) return;
    const sectionIds = toc.map((item) => item.id);
    const onScroll = () => {
      let current = sectionIds[0];
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 100) current = id;
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
          <div className="detail-toc-box__header" onClick={() => setTocOpen((v) => !v)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && setTocOpen((v) => !v)}>
            <div className="detail-toc-box__title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
                  className={`detail-toc-item${item.level === 3 ? ' detail-toc-item--h3' : ''}${activeToc === item.id ? ' detail-toc-item--active' : ''}`}
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

      <div
        className="detail-post-body"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </>
  );
}
