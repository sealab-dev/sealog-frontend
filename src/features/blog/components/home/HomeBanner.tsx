import { useEffect, useRef } from 'react';
import { WaveDivider } from '../../../../components/ui/wave/WaveDivider';
import './HomeBanner.css';

export default function HomeBanner() {
  const starsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = starsRef.current;
    if (!el) return;

    for (let i = 0; i < 80; i++) {
      const star = document.createElement('div');
      star.className = 'hero-star';
      star.style.cssText = `
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 85}%;
        --dur: ${2 + Math.random() * 4}s;
        --delay: ${Math.random() * 5}s;
        --bright: ${0.3 + Math.random() * 0.6};
        width: ${Math.random() > 0.8 ? 3 : 2}px;
        height: ${Math.random() > 0.8 ? 3 : 2}px;
      `;
      el.appendChild(star);
    }

    return () => {
      el.innerHTML = '';
    };
  }, []);

  return (
    <section className="hero">
      <div className="hero-bg" />
      <div className="hero-stars" ref={starsRef} />

      <div className="hero-content">
        <p className="hero-eyebrow">Developer Knowledge Log</p>
        <h1 className="hero-title">
          깊이 있는 기술의 파도,<br />
          <em>바다의 기록</em>
        </h1>
        <p className="hero-sub">
          개발자들이 항해하며 발견한 지식을 함께 나누는 공간
        </p>
      </div>

<WaveDivider
        fillColor="var(--banner-wave-color)"
        fillColor2="var(--banner-wave-color-2)"
        height={80}
        id="hero-wave"
      />
    </section>
  );
}
