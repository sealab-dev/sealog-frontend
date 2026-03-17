import { Link } from "react-router-dom";
import styles from "./NotFoundPage.module.css";

const NotFoundPage = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.errorCode}>404</h1>
      <h2 className={styles.title}>페이지를 찾을 수 없습니다</h2>
      <p className={styles.description}>
        요청하신 페이지가 삭제되었거나, 주소가 변경되었을 수 있습니다.
      </p>
      <Link to="/" className={styles.homeButton}>
        홈으로 돌아가기
      </Link>
    </div>
  );
};

export default NotFoundPage;
