import styles from './WaveDivider.module.css';

interface WaveDividerProps {
  /** 물결 채우기 색상. CSS 변수 문자열 or hex 모두 가능.
   *  기본값: var(--app-bg-primary) */
  fillColor?: string;
  /** 앞쪽(layer1) 색상. 미지정 시 fillColor 사용 */
  fillColor2?: string;
  /** 래퍼 높이 (px). 기본값: 100 */
  height?: number;
  /** SVG path id — 같은 페이지에 여러 개 쓸 경우 고유값 필요 */
  id?: string;
  className?: string;
}

/**
 * 공통 물결 애니메이션 컴포넌트
 *
 * 사용 예:
 *   <WaveDivider fillColor="var(--app-bg-primary)" height={100} id="thumb-wave" />
 *   <WaveDivider fillColor="var(--banner-wave-color)" height={60} id="home-wave" />
 */
export const WaveDivider = ({
  fillColor = 'var(--app-bg-primary)',
  fillColor2,
  height = 100,
  id = 'gentle-wave',
  className,
}: WaveDividerProps) => (
  <div
    className={`${styles.waveWrapper} ${className ?? ''}`}
    style={{ height }}
  >
    <svg
      className={styles.waves}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 24 150 28"
      preserveAspectRatio="none"
    >
      <defs>
        <path
          id={id}
          d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
        />
      </defs>
      <g className={styles.parallax}>
        <use
          xlinkHref={`#${id}`}
          x="48"
          y="0"
          className={styles.waveLayer1}
          style={{ fill: fillColor2 ?? fillColor }}
        />
        <use
          xlinkHref={`#${id}`}
          x="48"
          y="7"
          className={styles.waveLayer2}
          style={{ fill: fillColor }}
        />
      </g>
    </svg>
  </div>
);