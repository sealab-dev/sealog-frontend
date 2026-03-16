import { WaveDivider } from '@/components/ui/wave/WaveDivider';
import styles from './DetailBanner.module.css';

interface DetailBannerProps {
  thumbnailUrl?: string | null;
}

export default function DetailBanner({ thumbnailUrl }: DetailBannerProps) {
  return (
    <section className={styles.banner}>
      <div className={styles.img}>
        {thumbnailUrl && <img src={thumbnailUrl} alt="" />}
      </div>
      <div className={styles.bg} />
      <WaveDivider
        fillColor="var(--detail-wave-color)"
        fillColor2="var(--detail-wave-color-2)"
        height={80}
        id="detail-wave"
      />
    </section>
  );
}
