import { useParams, useNavigate } from "react-router-dom";
import { useBlogUserQuery } from "@/api/user/queries";
import { FILE_DOMAIN } from "@/constants/domain";
import { DEFAULT_PROFILE_IMAGE } from "@/constants/images";
import styles from "./ProfileCard.module.css";

interface ProfileCardProps {
  onNavigate?: () => void;
}

export const ProfileCard = ({ onNavigate }: ProfileCardProps) => {
  const navigate = useNavigate();
  const params = useParams<{ nickname: string }>();
  const nickname = params.nickname || "";

  // 블로그 주인 정보 조회
  const { data: blogUser, isLoading } = useBlogUserQuery(nickname);

  const handleNicknameClick = () => {
    navigate(`/user/${nickname}`);
    onNavigate?.(); // 모바일에서만 사이드바 닫기
  };

  // 로딩 중
  if (isLoading) {
    return (
      <div className={styles.profileCard}>
        <div className={styles.avatarSkeleton} />
        <div className={styles.nameSkeleton} />
        <div className={styles.positionSkeleton} />
      </div>
    );
  }

  // 블로그 주인 정보가 없을 때
  if (!blogUser) {
    return null;
  }

  const profileImage = blogUser.profileImagePath
    ? FILE_DOMAIN + blogUser.profileImagePath
    : DEFAULT_PROFILE_IMAGE;

  return (
    <div className={styles.profileCard}>
      {/* 프로필 이미지 */}
      <div className={styles.profileAvatar}>
        <img
          src={profileImage}
          alt={`${blogUser.nickname}의 프로필`}
          className={styles.avatarImg}
        />
      </div>

      {/* 정보 */}
      <div className={styles.profileInfo}>
        <button className={styles.profileName} onClick={handleNicknameClick}>
          {blogUser.nickname}
        </button>

        {blogUser.position && (
          <p className={styles.profilePosition}>{blogUser.position}</p>
        )}

        {blogUser.about && (
          <p className={styles.profileAbout}>{blogUser.about}</p>
        )}
      </div>
    </div>
  );
};
