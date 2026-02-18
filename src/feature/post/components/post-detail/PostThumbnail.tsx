import { FILE_DOMAIN } from '@/constants/domain';
import { DEFAULT_THUMBNAIL } from '@/constants/images';
import styles from './PostThumbnail.module.css';

interface PostThumbnailProps {
  thumbnailPath?: string | null;
  title: string;
}

export const PostThumbnail = ({ thumbnailPath, title }: PostThumbnailProps) => {
  const displayImageUrl = thumbnailPath 
    ? FILE_DOMAIN + thumbnailPath 
    : DEFAULT_THUMBNAIL;

  return (
    <section className={styles.banner}>
      <div className={styles.backgroundContainer}>
        <img 
          src={displayImageUrl} 
          alt={title} 
          className={styles.thumbnailImage} 
        />
        <div className={styles.bannerOverlay} />
        
        {/* 물결 효과 */}
        <div className={styles.waveWrapper}>
          <svg 
            className={styles.waves} 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 24 150 28" 
            preserveAspectRatio="none"
          >
            <defs>
              <path 
                id="gentle-wave" 
                d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" 
              />
            </defs>
            <g className={styles.parallax}>
              <use xlinkHref="#gentle-wave" x="48" y="0" className={styles.waveLayer1} />
              <use xlinkHref="#gentle-wave" x="48" y="7" className={styles.waveLayer2} />
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
};