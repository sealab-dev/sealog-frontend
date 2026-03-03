import { useState, useRef } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "@/features/auth/stores";
import { FILE_DOMAIN } from "@/constants/domain";
import { DEFAULT_PROFILE_IMAGE, DEFAULT_THUMBNAIL } from "@/constants/images";
import styles from "./SettingsPage.module.css";

/* ------------------------------------------------------------------ */
/* Types                                                                */
/* ------------------------------------------------------------------ */
interface ProfileForm {
  nickname: string;
  about: string;
  github: string;
  homepage: string;
}

interface ProfileFormErrors {
  nickname?: string;
  about?: string;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
}

interface PasswordFormErrors {
  currentPassword?: string;
  newPassword?: string;
  newPasswordConfirm?: string;
}

/* ------------------------------------------------------------------ */
/* Component                                                            */
/* ------------------------------------------------------------------ */
export const SettingsPage = () => {
  const { user } = useAuthStore();

  /* ---- 프로필 이미지 ---- */
  const profileImageRef = useRef<HTMLInputElement>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    null,
  );
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [isProfileImageRemoved, setIsProfileImageRemoved] = useState(false);

  /* ---- 배너 이미지 ---- */
  const bannerImageRef = useRef<HTMLInputElement>(null);
  const [bannerImagePreview, setBannerImagePreview] = useState<string | null>(
    null,
  );
  const [bannerImageFile, setBannerImageFile] = useState<File | null>(null);
  const [isBannerRemoved, setIsBannerRemoved] = useState(false);
  const [isBannerUploading, setIsBannerUploading] = useState(false);

  /* ---- 프로필 폼 ---- */
  const [profileForm, setProfileForm] = useState<ProfileForm>({
    nickname: user?.nickname ?? "",
    about: user?.about ?? "",
    github: "",
    homepage: "",
  });
  const [profileErrors, setProfileErrors] = useState<ProfileFormErrors>({});
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [isProfileEditing, setIsProfileEditing] = useState(false);

  /* ---- 썸네일 편집 모드 ---- */
  const [isThumbnailEditing, setIsThumbnailEditing] = useState(false);

  /* ---- 소셜 편집 모드 ---- */
  const [isSocialEditing, setIsSocialEditing] = useState(false);
  const [socialSuccess, setSocialSuccess] = useState(false);

  const [passwordErrors, setPasswordErrors] = useState<PasswordFormErrors>({});
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  /* ================================================================ */
  /* 프로필 이미지 핸들러                                              */
  /* ================================================================ */
  const handleProfileImageClick = () => profileImageRef.current?.click();

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드 가능합니다");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("파일 크기는 5MB 이하여야 합니다");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImagePreview(reader.result as string);
      setProfileImageFile(file);
      setIsProfileImageRemoved(false);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleProfileImageRemove = () => {
    setProfileImagePreview(null);
    setProfileImageFile(null);
    setIsProfileImageRemoved(true);
  };

  const displayProfileImage = profileImagePreview
    ? profileImagePreview
    : isProfileImageRemoved
      ? DEFAULT_PROFILE_IMAGE
      : user?.profileImagePath
        ? FILE_DOMAIN + user.profileImagePath
        : DEFAULT_PROFILE_IMAGE;

  /* ================================================================ */
  /* 배너 이미지 핸들러                                               */
  /* ================================================================ */
  const handleBannerClick = () => bannerImageRef.current?.click();

  const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드 가능합니다");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("파일 크기는 5MB 이하여야 합니다");
      return;
    }

    setIsBannerUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setBannerImagePreview(reader.result as string);
      setBannerImageFile(file);
      setIsBannerRemoved(false);
      setIsBannerUploading(false);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleBannerRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("배너를 제거하시겠습니까?")) return;
    setBannerImagePreview(null);
    setBannerImageFile(null);
    setIsBannerRemoved(true);
  };

  const bannerDisplayUrl = bannerImagePreview
    ? bannerImagePreview
    : isBannerRemoved
      ? null
      : null; // TODO: user?.bannerImagePath ? FILE_DOMAIN + user.bannerImagePath : null

  const hasCustomBanner = !!bannerDisplayUrl;

  /* ================================================================ */
  /* 프로필 폼 핸들러                                                  */
  /* ================================================================ */
  const validateProfile = (): boolean => {
    const errs: ProfileFormErrors = {};
    if (!profileForm.nickname.trim()) errs.nickname = "닉네임을 입력해주세요";
    else if (
      profileForm.nickname.length < 2 ||
      profileForm.nickname.length > 20
    )
      errs.nickname = "닉네임은 2~20자로 입력해주세요";
    if (profileForm.about.length > 200)
      errs.about = "자기소개는 200자 이하로 입력해주세요";
    setProfileErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateProfile()) return;
    // TODO: API 연결 (profileForm, profileImageFile, isProfileImageRemoved)
    console.log("프로필 저장:", {
      profileForm,
      profileImageFile,
      isProfileImageRemoved,
    });
    setIsProfileEditing(false);
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 3000);
  };

  /* ================================================================ */
  /* 소셜 폼 핸들러                                                    */
  /* ================================================================ */
  const handleSocialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: API 연결
    console.log("소셜 저장:", {
      github: profileForm.github,
      homepage: profileForm.homepage,
    });
    setIsSocialEditing(false);
    setSocialSuccess(true);
    setTimeout(() => setSocialSuccess(false), 3000);
  };

  /* ================================================================ */
  /* Render                                                            */
  /* ================================================================ */
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* ============================================================ */}
        {/* 섹션 1: 프로필                                               */}
        {/* ============================================================ */}
        <section className={styles.section}>
          <div className={styles.profileRow}>
            {/* 프로필 이미지 */}
            <div className={styles.avatarColumn}>
              <div className={styles.avatarWrapper}>
                <img
                  src={displayProfileImage}
                  alt="프로필 이미지"
                  className={styles.avatarImg}
                />
              </div>
              <button
                type="button"
                className={styles.uploadButton}
                onClick={handleProfileImageClick}
              >
                이미지 업로드
              </button>
              <button
                type="button"
                className={styles.removeImageButton}
                onClick={handleProfileImageRemove}
              >
                이미지 제거
              </button>
              <input
                ref={profileImageRef}
                type="file"
                accept="image/*"
                className={styles.hiddenInput}
                onChange={handleProfileImageChange}
              />
            </div>

            {/* 프로필 정보 */}
            <div className={styles.profileInfoColumn}>
              {!isProfileEditing ? (
                <>
                  <div className={styles.profileViewRow}>
                    <div className={styles.profileViewText}>
                      <h2 className={styles.profileName}>
                        {profileForm.nickname || user?.nickname}
                      </h2>
                      <p className={styles.profileAbout}>
                        {profileForm.about || user?.about || (
                          <span className={styles.emptyText}>
                            자기소개가 없습니다
                          </span>
                        )}
                      </p>
                      <p className={styles.profileEmail}>{user?.email}</p>
                    </div>
                    <button
                      type="button"
                      className={styles.editButton}
                      onClick={() => setIsProfileEditing(true)}
                    >
                      수정
                    </button>
                  </div>
                  {profileSuccess && (
                    <p className={styles.successText}>저장되었습니다.</p>
                  )}
                </>
              ) : (
                <form
                  className={styles.profileForm}
                  onSubmit={handleProfileSubmit}
                >
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>닉네임</label>
                    <input
                      type="text"
                      className={`${styles.input} ${profileErrors.nickname ? styles.inputError : ""}`}
                      value={profileForm.nickname}
                      onChange={(e) => {
                        setProfileForm((prev) => ({
                          ...prev,
                          nickname: e.target.value,
                        }));
                        if (profileErrors.nickname)
                          setProfileErrors((prev) => ({
                            ...prev,
                            nickname: undefined,
                          }));
                      }}
                      placeholder="닉네임을 입력하세요"
                    />
                    {profileErrors.nickname && (
                      <span className={styles.errorText}>
                        {profileErrors.nickname}
                      </span>
                    )}
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.label}>자기소개</label>
                    <textarea
                      className={`${styles.textarea} ${profileErrors.about ? styles.inputError : ""}`}
                      value={profileForm.about}
                      onChange={(e) => {
                        setProfileForm((prev) => ({
                          ...prev,
                          about: e.target.value,
                        }));
                        if (profileErrors.about)
                          setProfileErrors((prev) => ({
                            ...prev,
                            about: undefined,
                          }));
                      }}
                      placeholder="자기소개를 입력하세요 (200자 이하)"
                      rows={3}
                    />
                    <div className={styles.charCount}>
                      <span
                        className={
                          profileForm.about.length > 200
                            ? styles.charCountOver
                            : ""
                        }
                      >
                        {profileForm.about.length}
                      </span>
                      /200
                    </div>
                    {profileErrors.about && (
                      <span className={styles.errorText}>
                        {profileErrors.about}
                      </span>
                    )}
                  </div>

                  <p className={styles.emailReadonly}>{user?.email}</p>

                  <div className={styles.formActions}>
                    <button
                      type="button"
                      className={styles.cancelButton}
                      onClick={() => {
                        setIsProfileEditing(false);
                        setProfileErrors({});
                        setProfileForm({
                          ...profileForm,
                          nickname: user?.nickname ?? "",
                          about: user?.about ?? "",
                        });
                      }}
                    >
                      취소
                    </button>
                    <button type="submit" className={styles.saveButton}>
                      저장
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>

        <div className={styles.divider} />

        {/* ============================================================ */}
        {/* 섹션 2: 썸네일                                               */}
        {/* ============================================================ */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>썸네일</h3>
            {!isThumbnailEditing && (
              <button
                type="button"
                className={styles.editButton}
                onClick={() => setIsThumbnailEditing(true)}
              >
                수정
              </button>
            )}
          </div>

          {isThumbnailEditing ? (
            <div className={styles.thumbnailEditWrapper}>
              {/* 배너 편집 영역 */}
              <div
                className={styles.bannerContainer}
                onClick={handleBannerClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && handleBannerClick()}
              >
                <img
                  src={bannerDisplayUrl ?? DEFAULT_THUMBNAIL}
                  alt="배너 이미지"
                  className={styles.bannerImage}
                />
                <div className={styles.bannerOverlay} />

                {isBannerUploading && (
                  <div className={styles.bannerUploading}>
                    <span>업로드 중...</span>
                  </div>
                )}

                {hasCustomBanner && !isBannerUploading && (
                  <div className={styles.bannerActions}>
                    <button
                      type="button"
                      className={styles.bannerChangeBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBannerClick();
                      }}
                    >
                      <CameraIcon />
                      변경
                    </button>
                    <button
                      type="button"
                      className={styles.bannerRemoveBtn}
                      onClick={handleBannerRemove}
                    >
                      <TrashIcon />
                      제거
                    </button>
                  </div>
                )}

                {!hasCustomBanner && !isBannerUploading && (
                  <div className={styles.bannerPrompt}>
                    <CameraIcon />
                    <span>클릭하여 썸네일 추가</span>
                    <span className={styles.bannerHint}>
                      권장 크기: 1200x400, 최대 5MB
                    </span>
                  </div>
                )}

                {/* 물결 */}
                <div className={styles.waveWrapper}>
                  <svg
                    className={styles.waves}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 24 150 28"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <path
                        id="gentle-wave-settings"
                        d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
                      />
                    </defs>
                    <g className={styles.parallax}>
                      <use
                        xlinkHref="#gentle-wave-settings"
                        x="48"
                        y="0"
                        className={styles.waveLayer1}
                      />
                      <use
                        xlinkHref="#gentle-wave-settings"
                        x="48"
                        y="7"
                        className={styles.waveLayer2}
                      />
                    </g>
                  </svg>
                </div>
              </div>

              <input
                ref={bannerImageRef}
                type="file"
                accept="image/*"
                className={styles.hiddenInput}
                onChange={handleBannerChange}
              />

              <div className={styles.thumbnailEditActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => {
                    setIsThumbnailEditing(false);
                    setBannerImagePreview(null);
                    setBannerImageFile(null);
                    setIsBannerRemoved(false);
                  }}
                >
                  취소
                </button>
                <button
                  type="button"
                  className={styles.saveButton}
                  onClick={() => {
                    // TODO: API 연결 (bannerImageFile, isBannerRemoved)
                    console.log("썸네일 저장:", {
                      bannerImageFile,
                      isBannerRemoved,
                    });
                    setIsThumbnailEditing(false);
                  }}
                >
                  저장
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.thumbnailPreviewWrapper}>
              <img
                src={bannerDisplayUrl ?? DEFAULT_THUMBNAIL}
                alt="배너 미리보기"
                className={styles.thumbnailPreview}
              />
            </div>
          )}
        </section>

        <div className={styles.divider} />

        {/* ============================================================ */}
        {/* 섹션 3: 소셜 정보                                            */}
        {/* ============================================================ */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>소셜 정보</h3>
          </div>

          <form className={styles.socialForm} onSubmit={handleSocialSubmit}>
            <div className={styles.socialInputWrapper}>
              <span className={styles.socialIcon}>
                <GithubIcon />
              </span>
              <input
                type="text"
                className={styles.socialInput}
                value={profileForm.github}
                onChange={(e) =>
                  setProfileForm((prev) => ({
                    ...prev,
                    github: e.target.value,
                  }))
                }
                placeholder="Github 계정을 입력하세요."
              />
            </div>

            <div className={styles.socialInputWrapper}>
              <span className={styles.socialIcon}>
                <HomepageIcon />
              </span>
              <input
                type="url"
                className={styles.socialInput}
                value={profileForm.homepage}
                onChange={(e) =>
                  setProfileForm((prev) => ({
                    ...prev,
                    homepage: e.target.value,
                  }))
                }
                placeholder="홈페이지 주소를 입력하세요."
              />
            </div>

            {socialSuccess && (
              <p className={styles.successText}>저장되었습니다.</p>
            )}

            <div className={styles.socialFormFooter}>
              <button type="submit" className={styles.saveButton}>
                저장
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Inline SVG Icons                                                     */
/* ------------------------------------------------------------------ */
const CameraIcon = () => (
  <svg
    width="20"
    height="20"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const TrashIcon = () => (
  <svg
    width="20"
    height="20"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

const GithubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);

const HomepageIcon = () => (
  <svg
    width="18"
    height="18"
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
