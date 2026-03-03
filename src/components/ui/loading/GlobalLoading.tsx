import { useLoading } from './useLoading';
import styles from './GlobalLoading.module.css';

export const GlobalLoading = () => {
  const isLoading = useLoading();

  if (!isLoading) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        {/* 스피너 */}
        <div className={styles.spinner}>
          <div className={styles.spinnerTrack}></div>
          <div className={styles.spinnerFill}></div>
        </div>
        
        {/* 로딩 텍스트 */}
        <p className={styles.text}>처리 중입니다...</p>
      </div>
    </div>
  );
};