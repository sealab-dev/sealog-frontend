import { useState, useEffect, type JSX } from 'react';
import styles from './SwimmingDolphin.module.css';

interface SwimmingDolphinProps {
  intervalMs?: number;
  minDuration?: number;
  maxDuration?: number;
  minTop?: number;
  maxTop?: number;
  color?: string;
  opacity?: number;
  size?: number;
  carryChance?: number; // 언어를 물고 갈 확률 (0~1, 기본 0.3)
}

type Language = 'java' | 'javascript' | 'python' | 'typescript' | 'react' | 'spring';

const LANGUAGES: Language[] = ['java', 'javascript', 'python', 'typescript', 'react', 'spring'];

// 언어 아이콘 SVG들
const LanguageIcons: Record<Language, JSX.Element> = {
  java: (
    <svg viewBox="0 0 32 32" fill="none">
      <path d="M11.622 24.74s-1.23.748.855.962c2.51.32 3.847.267 6.625-.267a10.02 10.02 0 001.763.855c-6.25 2.672-14.16-.16-9.243-1.55zm-.8-3.473s-1.336 1.015.748 1.23c2.725.267 4.862.32 8.55-.427a3.26 3.26 0 001.282.801c-7.534 2.244-15.976.214-10.58-1.604zm14.747 6.09s.908.748-1.015 1.336c-3.58 1.07-14.96 1.39-18.114.042-1.122-.481 1.015-1.175 1.7-1.282.695-.16 1.07-.16 1.07-.16-1.23-.855-8.016 1.763-3.42 2.511 12.357 2.029 22.51-.908 19.78-2.457zM12.2 17.633s-5.716 1.39-2.029 1.87c1.55.214 4.648.16 7.534-.053 2.351-.214 4.702-.695 4.702-.695s-.855.374-1.443.748c-5.93 1.55-17.312.855-14.052-.748 2.778-1.39 5.288-1.122 5.288-1.122zm10.366 5.93c5.983-3.1 3.206-6.09 1.282-5.716-.481.107-.695.214-.695.214s.16-.32.534-.427c3.794-1.336 6.786 4.008-1.23 6.09 0 0 .053-.053.107-.16zm-9.136 7.908c5.77.374 14.587-.214 14.8-2.94 0 0-.427 1.07-4.755 1.87-4.916.908-11.007.802-14.587.214 0 0 .748.642 4.542.855z" fill="#E76F00"/>
      <path d="M18.996 3.286s3.313 3.313-3.152 8.39c-5.183 4.114-1.175 6.465 0 9.136-3.046-2.725-5.236-5.13-3.74-7.373 2.19-3.313 8.283-4.916 6.892-10.153z" fill="#5382A1"/>
    </svg>
  ),
  javascript: (
    <svg viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="4" fill="#F7DF1E"/>
      <path d="M8.5 26.5l2.3-1.4c.4.8 1 1.4 1.9 1.4.9 0 1.5-.4 1.5-1.8v-9.7h2.8v9.8c0 3-1.8 4.3-4.3 4.3-2.3 0-3.7-1.2-4.2-2.6zm10 0l2.3-1.4c.6 1 1.3 1.6 2.6 1.6 1.1 0 1.8-.5 1.8-1.3 0-.9-.7-1.2-2-1.7l-.7-.3c-2-.8-3.3-1.9-3.3-4.1 0-2 1.5-3.6 4-3.6 1.7 0 3 .6 3.9 2.1l-2.1 1.4c-.5-.8-1-1.2-1.8-1.2-.8 0-1.3.5-1.3 1.2 0 .8.5 1.2 1.7 1.7l.7.3c2.3 1 3.6 2 3.6 4.2 0 2.4-1.9 3.8-4.5 3.8-2.5 0-4.1-1.2-4.9-2.7z" fill="#000"/>
    </svg>
  ),
  python: (
    <svg viewBox="0 0 32 32" fill="none">
      <path d="M15.885 2.1c-7.1 0-6.651 3.07-6.651 3.07l.008 3.18h6.77v.954H6.538S2.1 8.83 2.1 16.02c0 7.19 3.875 6.934 3.875 6.934h2.312v-3.337s-.125-3.875 3.813-3.875h6.573s3.69.06 3.69-3.57V6.597s.56-4.497-6.478-4.497zm-3.66 2.6a1.19 1.19 0 110 2.38 1.19 1.19 0 010-2.38z" fill="url(#python_a)"/>
      <path d="M16.114 29.9c7.1 0 6.651-3.07 6.651-3.07l-.008-3.18h-6.77v-.954h9.475s4.437.474 4.437-6.716c0-7.19-3.875-6.934-3.875-6.934h-2.312v3.337s.125 3.875-3.813 3.875H13.33s-3.69-.06-3.69 3.57v5.575s-.56 4.497 6.478 4.497zm3.66-2.6a1.19 1.19 0 110-2.38 1.19 1.19 0 010 2.38z" fill="url(#python_b)"/>
      <defs>
        <linearGradient id="python_a" x1="4" y1="3" x2="18" y2="18" gradientUnits="userSpaceOnUse">
          <stop stopColor="#387EB8"/>
          <stop offset="1" stopColor="#366994"/>
        </linearGradient>
        <linearGradient id="python_b" x1="14" y1="14" x2="28" y2="29" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFE052"/>
          <stop offset="1" stopColor="#FFC331"/>
        </linearGradient>
      </defs>
    </svg>
  ),
  typescript: (
    <svg viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="4" fill="#3178C6"/>
      <path d="M18.5 16.5v9h2.8v-3.5h2.3c2.3 0 4-1.4 4-3.8 0-2.3-1.5-3.7-3.9-3.7h-5.2v2zm2.8 0h1.9c1.1 0 1.7.5 1.7 1.5s-.6 1.6-1.7 1.6h-1.9v-3.1zM4.5 14.5v2h3.5v9h2.8v-9h3.5v-2h-9.8z" fill="#fff"/>
    </svg>
  ),
  react: (
    <svg viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="3" fill="#61DAFB"/>
      <ellipse cx="16" cy="16" rx="12" ry="4.5" stroke="#61DAFB" strokeWidth="1.5" fill="none"/>
      <ellipse cx="16" cy="16" rx="12" ry="4.5" stroke="#61DAFB" strokeWidth="1.5" fill="none" transform="rotate(60 16 16)"/>
      <ellipse cx="16" cy="16" rx="12" ry="4.5" stroke="#61DAFB" strokeWidth="1.5" fill="none" transform="rotate(120 16 16)"/>
    </svg>
  ),
  spring: (
    <svg viewBox="0 0 32 32" fill="none">
      <path d="M27.5 5.3c-.8 1.5-2 2.7-3.3 3.6.3-1.7.1-3.5-.6-5.1 2.2.2 3.4.8 3.9 1.5zM16 4c-6.6 0-12 5.4-12 12 0 5.2 3.3 9.6 8 11.3-.1-.9-.2-2.4 0-3.4.2-.9 1.5-6.3 1.5-6.3s-.4-.8-.4-1.9c0-1.8 1-3.1 2.3-3.1 1.1 0 1.6.8 1.6 1.8 0 1.1-.7 2.7-1.1 4.2-.3 1.3.6 2.3 1.9 2.3 2.3 0 4-2.4 4-5.9 0-3.1-2.2-5.2-5.4-5.2-3.7 0-5.8 2.7-5.8 5.6 0 1.1.4 2.3 1 3 .1.1.1.2.1.4l-.4 1.5c-.1.2-.2.3-.4.2-1.5-.7-2.5-2.9-2.5-4.7 0-3.8 2.8-7.4 8-7.4 4.2 0 7.5 3 7.5 7 0 4.2-2.6 7.6-6.3 7.6-1.2 0-2.4-.6-2.8-1.4l-.8 3c-.3 1.1-.9 2.2-1.5 3.1 1.1.3 2.3.5 3.5.5 6.6 0 12-5.4 12-12S22.6 4 16 4z" fill="#6DB33F"/>
    </svg>
  ),
};

export const SwimmingDolphin = ({
  intervalMs = 10 * 1000,
  minDuration = 5,
  maxDuration = 8,
  minTop = 40,
  maxTop = 80,
  color = 'rgba(255, 255, 255, 0.15)',
  opacity = 1,
  size = 80,
  carryChance = 0.4,
}: SwimmingDolphinProps) => {
  const [dolphin, setDolphin] = useState<{
    id: number;
    direction: 'left' | 'right';
    top: number;
    duration: number;
    language: Language | null;
  } | null>(null);

  useEffect(() => {
    const spawnDolphin = () => {
      const direction = Math.random() > 0.5 ? 'left' : 'right';
      const top = minTop + Math.random() * (maxTop - minTop);
      const duration = minDuration + Math.random() * (maxDuration - minDuration);
      
      // carryChance 확률로 언어를 물고 감
      const carriesLanguage = Math.random() < carryChance;
      const language = carriesLanguage 
        ? LANGUAGES[Math.floor(Math.random() * LANGUAGES.length)] 
        : null;

      setDolphin({
        id: Date.now(),
        direction,
        top,
        duration,
        language,
      });

      setTimeout(() => {
        setDolphin(null);
      }, duration * 1000);
    };

    spawnDolphin();
    const interval = setInterval(spawnDolphin, intervalMs);

    return () => clearInterval(interval);
  }, [intervalMs, minDuration, maxDuration, minTop, maxTop, carryChance]);

  if (!dolphin) return null;

  return (
    <div
      key={dolphin.id}
      className={`${styles.dolphin} ${styles[dolphin.direction]}`}
      style={{
        top: `${dolphin.top}%`,
        animationDuration: `${dolphin.duration}s`,
        opacity,
        width: size,
        height: size * 0.5,
      }}
    >
      {/* 언어 아이콘 (입에 물고 있음) */}
      {dolphin.language && (
        <div 
          className={`${styles.languageIcon} ${styles[`icon_${dolphin.direction}`]}`}
          style={{ width: size * 0.25, height: size * 0.25 }}
        >
          {LanguageIcons[dolphin.language]}
        </div>
      )}
      
      {/* 돌고래 */}
      <svg
        viewBox="0 0 100 50"
        className={styles.dolphinSvg}
        style={{ color }}
      >
        {/* 돌고래 몸통 */}
        <ellipse cx="50" cy="28" rx="32" ry="14" fill="currentColor" />
        
        {/* 머리/주둥이 */}
        <path
          d="M78 25 Q92 24 98 26 Q92 28 78 28"
          fill="currentColor"
        />
        
        {/* 이마 (멜론) */}
        <ellipse cx="75" cy="22" rx="8" ry="6" fill="currentColor" />
        
        {/* 등지느러미 */}
        <path
          d="M45 14 Q50 2 58 14"
          fill="currentColor"
        />
        
        {/* 꼬리지느러미 */}
        <path
          d="M18 28 Q8 18 5 22 Q10 28 5 34 Q8 38 18 28"
          fill="currentColor"
        />
        
        {/* 가슴지느러미 */}
        <path
          d="M58 38 Q62 48 52 46 Q54 40 58 38"
          fill="currentColor"
        />
        
        {/* 눈 */}
        <circle cx="82" cy="24" r="2" fill="rgba(0,0,0,0.3)" />
        
        {/* 입 라인 */}
        <path
          d="M88 27 Q92 27 96 26"
          stroke="rgba(0,0,0,0.15)"
          strokeWidth="0.8"
          fill="none"
        />
      </svg>
    </div>
  );
};