import { WaveDivider } from '@/components/ui/wave/WaveDivider';
import styles from './UserBanner.module.css';

/**
 * 유저 블로그 상단 배너
 * 파도는 WaveDivider 공통 컴포넌트를 사용합니다.
 */
export const UserBanner = () => (
  <section className={styles.banner}>
    <div className={styles.contentContainer} />
    <WaveDivider
      fillColor="var(--global-bg-tertiary)"
      height={100}
      id="wave-user-banner"
    />
  </section>
);
