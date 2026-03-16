import { WaveDivider } from '../../../../components/ui/wave/WaveDivider';
import type { UserProfile, SocialUIType } from '../../types/userProfile';
import styles from './UserHomeBanner.module.css';

interface UserHomeBannerProps {
  profile: UserProfile;
}

const SocialIcon = ({ type }: { type: SocialUIType }) => {
  if (type === 'github') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
      </svg>
    );
  }
  if (type === 'linkedin') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    );
  }
  if (type === 'youtube') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
      </svg>
    );
  }
  if (type === 'instagram') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    );
  }
  if (type === 'notion') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 4h16v16H4z" />
        <path d="M9 9h6M9 12h6M9 15h4" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
};

const UserHomeBanner = ({ profile }: UserHomeBannerProps) => {
  const postStat = profile.stats[0];
  const seriesStat = profile.stats[1];

  return (
    <section className={styles.profileBanner}>
      <div className={styles.profileBannerGlow} />
      <div className={styles.profileBannerInner}>
        <div className={styles.profileTop}>
          <div className={styles.profileLeft}>
            <div className={styles.profileAvatarWrap}>
              <div className={styles.profileAvatar}>
                {profile.profileImageUrl
                  ? <img src={profile.profileImageUrl} alt="" />
                  : profile.initial}
              </div>
            </div>

            <div className={styles.profileIdentity}>
              <div className={styles.profileIdentityNameRow}>
                <h1 className={styles.profileIdentityName}>{profile.name}</h1>
                {(postStat || seriesStat) && (
                  <span className={styles.profileIdentityMeta}>
                    {postStat && <span>{postStat.value} posts</span>}
                    {postStat && seriesStat && <span className={styles.profileIdentityMetaDot}>·</span>}
                    {seriesStat && <span>{seriesStat.value} series</span>}
                  </span>
                )}
              </div>
              
              {profile.position && (
                <p className={styles.profilePosition}>{profile.position}</p>
              )}

              <p className={styles.profileIdentityBio}>{profile.bio}</p>
              
              {profile.socials.length > 0 && (
                <div className={styles.profileSocials}>
                  {profile.socials.map((s) => (
                    <a key={s.type} className={styles.profileSocial} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                      <SocialIcon type={s.type} />
                      {s.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <WaveDivider fillColor="var(--ub-wave-color)" fillColor2="var(--ub-wave-color-2)" height={80} id="ub-wave" />
    </section>
  );
};

export default UserHomeBanner;
