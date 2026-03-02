import { useThemeContext } from "@/components/ui/theme/ThemeProvider";
import { useTyping } from "@/features/post/hooks/common/useTyping";
import { WaveDivider } from "@/components/ui/wave/WaveDivider";
import type { TimeTheme } from "@/components/ui/theme/useTheme";
import styles from "./HomeBanner.module.css";

// ─── 상수 ──────────────────────────────────────────────────────────────────

const BANNER_MESSAGES = [
  "데이터의 바다에서 가치 있는 진주를 캐내는 여정",
  "기술의 파도를 타는 개발자, 기술의 서핑을 즐기는 공간",
  "끝없는 0과 1의 수평선 너머, 새로운 세계를 코딩합니다.",
  "코드의 흐름이 모여 거대한 지식의 바다가 되는 곳",
];

const CELESTIAL_POSITION: Record<TimeTheme, number> = {
  morning: 40,
  sunset: 85,
  night: 35,
};

// ─── SVG 서브컴포넌트 ────────────────────────────────────────────────────────

const Sun = ({ position }: { position: number }) => {
  const x = 10 + position * 0.8;
  const y = 70 - Math.sin((position / 100) * Math.PI) * 30;
  return (
    <g className={styles.sun} style={{ transform: `translate(${x}%, ${y}%)` }}>
      <circle cx="0" cy="0" r="18" fill="url(#sunGlow)" opacity="0.6" />
      <circle cx="0" cy="0" r="12" fill="url(#sunGlow)" opacity="0.4" />
      <circle cx="0" cy="0" r="8" fill="url(#sunGradient)" />
    </g>
  );
};

const Moon = ({ position }: { position: number }) => {
  const x = 10 + position * 0.8;
  const y = 70 - Math.sin((position / 100) * Math.PI) * 30;
  return (
    <g className={styles.moon} style={{ transform: `translate(${x}%, ${y}%)` }}>
      <circle cx="0" cy="0" r="12" fill="url(#moonGlow)" opacity="0.3" />
      <mask id="crescentMask">
        <circle cx="0" cy="0" r="7" fill="white" />
        <circle cx="4" cy="-1.5" r="5.5" fill="black" />
      </mask>
      <circle
        cx="0"
        cy="0"
        r="7"
        fill="url(#moonGradient)"
        mask="url(#crescentMask)"
      />
    </g>
  );
};

const Stars = () => {
  const stars = [
    { x: 15, y: 25, size: 1, delay: 0 },
    { x: 25, y: 40, size: 0.8, delay: 0.3 },
    { x: 40, y: 20, size: 1.2, delay: 0.6 },
    { x: 55, y: 32, size: 0.9, delay: 0.2 },
    { x: 70, y: 18, size: 1, delay: 0.5 },
    { x: 80, y: 38, size: 0.8, delay: 0.8 },
    { x: 88, y: 22, size: 1.1, delay: 0.1 },
    { x: 35, y: 50, size: 0.9, delay: 0.4 },
    { x: 60, y: 48, size: 0.8, delay: 0.7 },
    { x: 92, y: 42, size: 1, delay: 0.9 },
  ];
  return (
    <g className={styles.stars}>
      {stars.map((star, i) => (
        <circle
          key={i}
          cx={`${star.x}%`}
          cy={`${star.y}%`}
          r={star.size}
          fill="white"
          className={styles.star}
          style={{ animationDelay: `${star.delay}s` }}
        />
      ))}
    </g>
  );
};

const Clouds = () => (
  <g className={styles.clouds}>
    <g className={styles.cloud1}>
      <ellipse cx="60" cy="35" rx="12" ry="6" fill="white" opacity="0.9" />
      <ellipse cx="50" cy="38" rx="9" ry="5" fill="white" opacity="0.9" />
      <ellipse cx="70" cy="38" rx="10" ry="5" fill="white" opacity="0.9" />
      <ellipse cx="58" cy="40" rx="11" ry="4" fill="white" opacity="0.9" />
    </g>
    <g className={styles.cloud2}>
      <ellipse cx="200" cy="45" rx="11" ry="5" fill="white" opacity="0.8" />
      <ellipse cx="190" cy="48" rx="8" ry="4" fill="white" opacity="0.8" />
      <ellipse cx="210" cy="48" rx="9" ry="4.5" fill="white" opacity="0.8" />
      <ellipse cx="198" cy="50" rx="10" ry="3.5" fill="white" opacity="0.8" />
    </g>
    <g className={styles.cloud3}>
      <ellipse cx="320" cy="30" rx="10" ry="4.5" fill="white" opacity="0.85" />
      <ellipse cx="310" cy="33" rx="7.5" ry="3.5" fill="white" opacity="0.85" />
      <ellipse cx="330" cy="33" rx="8.5" ry="4" fill="white" opacity="0.85" />
      <ellipse cx="318" cy="35" rx="9" ry="3" fill="white" opacity="0.85" />
    </g>
  </g>
);

// ─── 메인 컴포넌트 ─────────────────────────────────────────────────────────

export const HomeBanner = () => {
  const { theme } = useThemeContext();
  const text = useTyping(BANNER_MESSAGES);

  const celestialPosition = CELESTIAL_POSITION[theme];
  const isNight = theme === "night";
  const hasSun = theme === "morning" || theme === "sunset";

  return (
    <section className={`${styles.banner} ${styles[theme]}`}>
      {/* 배경 — 하늘 SVG */}
      <div className={styles.backgroundContainer}>
        <svg
          className={styles.sky}
          viewBox="0 0 400 200"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <radialGradient id="sunGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFF7E0" />
              <stop offset="50%" stopColor="#FFD93D" />
              <stop offset="100%" stopColor="#FF8C00" />
            </radialGradient>
            <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFD93D" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FFD93D" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="moonGradient" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FFFEF0" />
              <stop offset="100%" stopColor="#E8E4D9" />
            </radialGradient>
            <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFEF0" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#FFFEF0" stopOpacity="0" />
            </radialGradient>
          </defs>
          {theme === "morning" && <Clouds />}
          {isNight && <Stars />}
          {hasSun && <Sun position={celestialPosition} />}
          {isNight && <Moon position={celestialPosition} />}
        </svg>
      </div>

      {/* 콘텐츠 */}
      <div className={styles.contentContainer}>
        <h1 className={styles.typingText}>
          {text}
          <span className={styles.cursor}>|</span>
        </h1>
      </div>

      {/* 공통 파도 컴포넌트 — --banner-wave-color로 테마별 대비 확보 */}
      <WaveDivider
        fillColor="var(--banner-wave-color)"
        height={100}
        id="wave-home-banner"
      />
    </section>
  );
};
