import { FILE_DOMAIN } from '@/constants/domain';
import { WaveDivider } from '@/components/ui/wave/WaveDivider';
import styles from './PostThumbnail.module.css';

interface PostThumbnailProps {
  thumbnailPath?: string | null;
  title: string;
}

export const PostThumbnail = ({ thumbnailPath, title }: PostThumbnailProps) => {
  const displayImageUrl = thumbnailPath ? FILE_DOMAIN + thumbnailPath : null;

  return (
    <section className={styles.banner}>
      <div className={styles.backgroundContainer}>
        {displayImageUrl ? (
          <img
            src={displayImageUrl}
            alt={title}
            className={styles.thumbnailImage}
          />
        ) : (
          /* 디폴트: 테마 포인트 색상 기반 단색 배경 */
          <div className={styles.defaultBackground} />
        )}
        <div className={styles.bannerOverlay} />

        <WaveDivider
          fillColor="var(--global-bg-primary)"
          height={100}
          id="wave-post-thumbnail"
        />
      </div>
    </section>
  );
};
