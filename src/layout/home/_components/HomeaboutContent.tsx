import { useMeQuery } from "@/api/user/queries";
import styles from "./HomeAboutContent.module.css";

/* ------------------------------------------------------------------ */
/* Skeleton                                                             */
/* ------------------------------------------------------------------ */
const AboutSkeleton = () => (
  <div className={styles.wrapper}>
    <div className={styles.skeleton}>
      <div className={styles.skeletonName} />
      <div className={styles.skeletonText} />
      <div className={styles.skeletonText} style={{ width: "70%" }} />
      <div className={styles.skeletonSocial} />
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/* Component                                                            */
/* ------------------------------------------------------------------ */
export const HomeAboutContent = () => {
  const { data: me, isLoading } = useMeQuery({ enabled: true });

  if (isLoading) return <AboutSkeleton />;

  if (!me) {
    return (
      <div className={styles.wrapper}>
        <p className={styles.empty}>소개 정보를 불러올 수 없습니다.</p>
      </div>
    );
  }

  // TODO: UserResponse에 github, homepage 필드 추가 후 (me as any) 제거
  const github: string | null = (me as any).github ?? null;
  const homepage: string | null = (me as any).homepage ?? null;
  const hasSocial = github || homepage;

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        {/* 닉네임 */}
        <h2 className={styles.nickname}>{me.nickname}</h2>

        {/* 자기소개 */}
        {me.about ? (
          <p className={styles.about}>{me.about}</p>
        ) : (
          <p className={styles.aboutEmpty}>아직 자기소개가 없습니다.</p>
        )}

        {/* 소셜 링크 */}
        {hasSocial && (
          <div className={styles.socialLinks}>
            {github && (
              <a
                href={`https://github.com/${github}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
              >
                <GithubIcon />
                <span>{github}</span>
              </a>
            )}
            {homepage && (
              <a
                href={homepage}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
              >
                <HomepageIcon />
                <span>{homepage}</span>
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Icons                                                                */
/* ------------------------------------------------------------------ */
const GithubIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);

const HomepageIcon = () => (
  <svg
    width="16"
    height="16"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    />
  </svg>
);
