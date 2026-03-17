import { useState, useRef, useEffect } from 'react';
import { Camera } from 'lucide-react';
import { useMyProfileQuery } from '../../services/user/user.queries';
import { useUpdateProfileMutation, useUpdatePasswordMutation } from '../../services/user/user.mutations';
import { SOCIAL_ORDER, SOCIAL_LABEL } from '../../features/blog/types/userProfile';
import type { SocialType } from '../../services/user/types/user.enum';
import styles from './MyProfilePage.module.css';

type ProfileErrors = {
  nickname?: string;
  about?: string;
  position?: string;
};

export default function MyProfilePage() {
  const { data: profile, isPending } = useMyProfileQuery();
  const updateProfile = useUpdateProfileMutation();
  const updatePassword = useUpdatePasswordMutation();

  const [nickname, setNickname] = useState('');
  const [position, setPosition] = useState('');
  const [about, setAbout] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [removeAvatar, setRemoveAvatar] = useState(false);
  const [socialLinks, setSocialLinks] = useState<Partial<Record<SocialType, string>>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [errors, setErrors] = useState<ProfileErrors>({});
  const [socialLinkErrors, setSocialLinkErrors] = useState<Partial<Record<SocialType, string>>>({});

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');

  useEffect(() => {
    if (!profile) return;
    setNickname(profile.nickname);
    setPosition(profile.position ?? '');
    setAbout(profile.about ?? '');
    const links: Partial<Record<SocialType, string>> = {};
    profile.socialLinks.forEach((s) => { links[s.socialType] = s.url; });
    setSocialLinks(links);
  }, [profile]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setRemoveAvatar(false);
    e.target.value = '';
  };

  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    setRemoveAvatar(true);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const validate = (): boolean => {
    const newErrors: ProfileErrors = {};
    const newSocialErrors: Partial<Record<SocialType, string>> = {};

    const trimmedNickname = nickname.trim();
    if (!trimmedNickname) {
      newErrors.nickname = '닉네임을 입력해주세요.';
    } else if (trimmedNickname.length < 2) {
      newErrors.nickname = '닉네임은 2글자 이상이어야 합니다.';
    } else if (trimmedNickname.length >= 20) {
      newErrors.nickname = '닉네임은 20글자 미만이어야 합니다.';
    }

    if (about.length > 150) {
      newErrors.about = `소개는 150자 이내로 입력해주세요. (현재 ${about.length}자)`;
    }

    if (position.length > 50) {
      newErrors.position = `포지션은 50자 이내로 입력해주세요. (현재 ${position.length}자)`;
    }

    SOCIAL_ORDER.forEach((type) => {
      const url = socialLinks[type] ?? '';
      if (url.length > 500) {
        newSocialErrors[type] = `URL은 500자 이내로 입력해주세요. (현재 ${url.length}자)`;
      }
    });

    setErrors(newErrors);
    setSocialLinkErrors(newSocialErrors);
    return Object.keys(newErrors).length === 0 && Object.keys(newSocialErrors).length === 0;
  };

  const handleProfileSave = async () => {
    if (!validate()) return;

    const socialLinksPayload = SOCIAL_ORDER
      .filter((t) => socialLinks[t]?.trim())
      .map((t) => ({ socialType: t, url: socialLinks[t]!.trim() }));

    try {
      await updateProfile.mutateAsync({
        request: {
          nickname: nickname.trim() || undefined,
          position: position.trim() || undefined,
          about: about.trim() || undefined,
          removeProfileImage: removeAvatar || undefined,
          socialLinks: socialLinksPayload,
        },
        profileImage: avatarFile,
      });
      setAvatarFile(null);
      setRemoveAvatar(false);
    } catch {
      // 에러 처리는 client.ts 인터셉터에서 toast로 처리
    }
  };

  const handlePasswordSave = async () => {
    try {
      await updatePassword.mutateAsync({ currentPassword, newPassword, newPasswordConfirm });
      setCurrentPassword('');
      setNewPassword('');
      setNewPasswordConfirm('');
    } catch {
      // 에러 처리는 client.ts 인터셉터에서 toast로 처리
    }
  };

  if (isPending) return <div className={styles.loading}>불러오는 중...</div>;
  if (!profile) return null;

  const currentAvatarSrc = avatarPreview ?? (removeAvatar ? null : profile.profileImageUrl);

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>내 정보</h1>
        <p className={styles.pageSubtitle}>프로필과 계정 정보를 관리하세요.</p>
      </header>

      {/* 프로필 카드 */}
      <section className={styles.card}>
        <h2 className={styles.cardTitle}>프로필 수정</h2>

        {/* 아바타 */}
        <div className={styles.avatarSection}>
          <div className={styles.avatar}>
            {currentAvatarSrc
              ? <img src={currentAvatarSrc} alt="" />
              : <span>{profile.nickname.charAt(0).toUpperCase()}</span>}
          </div>
          <div className={styles.avatarActions}>
            <button type="button" onClick={() => fileInputRef.current?.click()} className={styles.avatarChangeBtn}>
              <Camera size={14} />
              이미지 변경
            </button>
            {currentAvatarSrc && (
              <button type="button" onClick={handleRemoveAvatar} className={styles.avatarRemoveBtn}>
                삭제
              </button>
            )}
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" className={styles.hiddenInput} onChange={handleAvatarChange} />
        </div>

        {/* 필드 */}
        <div className={styles.fields}>
          <div className={styles.field}>
            <label className={styles.label}>이름</label>
            <input className={`${styles.input} ${styles.inputReadonly}`} value={profile.name} readOnly />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>이메일</label>
            <input className={`${styles.input} ${styles.inputReadonly}`} value={profile.email} readOnly />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>닉네임</label>
            <input
              className={`${styles.input} ${errors.nickname ? styles.inputError : ''}`}
              value={nickname}
              onChange={(e) => { setNickname(e.target.value); if (errors.nickname) setErrors((p) => ({ ...p, nickname: undefined })); }}
              placeholder="닉네임"
            />
            {errors.nickname && <span className={styles.fieldErrorMsg}>{errors.nickname}</span>}
          </div>
          <div className={styles.field}>
            <label className={styles.label}>직군 / 포지션</label>
            <input
              className={`${styles.input} ${errors.position ? styles.inputError : ''}`}
              value={position}
              onChange={(e) => { setPosition(e.target.value); if (errors.position) setErrors((p) => ({ ...p, position: undefined })); }}
              placeholder="예: Backend Developer"
            />
            {errors.position && <span className={styles.fieldErrorMsg}>{errors.position}</span>}
          </div>
          <div className={`${styles.field} ${styles.fieldFull}`}>
            <div className={styles.labelRow}>
              <label className={styles.label}>소개</label>
              <span className={`${styles.charCount} ${about.length > 150 ? styles.charCountOver : ''}`}>
                {about.length} / 150
              </span>
            </div>
            <textarea
              className={`${styles.textarea} ${errors.about ? styles.textareaError : ''}`}
              value={about}
              onChange={(e) => { setAbout(e.target.value); if (errors.about) setErrors((p) => ({ ...p, about: undefined })); }}
              placeholder="자신을 소개해보세요"
              rows={4}
            />
            {errors.about && <span className={styles.fieldErrorMsg}>{errors.about}</span>}
          </div>
        </div>

        {/* 소셜 링크 */}
        <div className={styles.socialSection}>
          <h3 className={styles.socialTitle}>소셜 링크</h3>
          <div className={styles.fields}>
            {SOCIAL_ORDER.map((type) => (
              <div key={type} className={styles.field}>
                <label className={styles.label}>{SOCIAL_LABEL[type]}</label>
                <input
                  className={`${styles.input} ${socialLinkErrors[type] ? styles.inputError : ''}`}
                  value={socialLinks[type] ?? ''}
                  onChange={(e) => {
                    setSocialLinks((prev) => ({ ...prev, [type]: e.target.value }));
                    if (socialLinkErrors[type]) setSocialLinkErrors((p) => ({ ...p, [type]: undefined }));
                  }}
                  placeholder={`${SOCIAL_LABEL[type]} URL`}
                />
                {socialLinkErrors[type] && <span className={styles.fieldErrorMsg}>{socialLinkErrors[type]}</span>}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.cardFooter}>
          <button
            className={styles.saveBtn}
            type="button"
            onClick={handleProfileSave}
            disabled={updateProfile.isPending}
          >
            {updateProfile.isPending ? '저장 중...' : '저장하기'}
          </button>
        </div>
      </section>

      {/* 비밀번호 카드 */}
      <section className={styles.card}>
        <h2 className={styles.cardTitle}>비밀번호 변경</h2>
        <div className={styles.fields}>
          <div className={`${styles.field} ${styles.fieldFull}`}>
            <label className={styles.label}>현재 비밀번호</label>
            <input
              className={styles.input}
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="현재 비밀번호"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>새 비밀번호</label>
            <input
              className={styles.input}
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="새 비밀번호"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>새 비밀번호 확인</label>
            <input
              className={styles.input}
              type="password"
              value={newPasswordConfirm}
              onChange={(e) => setNewPasswordConfirm(e.target.value)}
              placeholder="새 비밀번호 확인"
            />
          </div>
        </div>
        <div className={styles.cardFooter}>
          <button
            className={styles.saveBtn}
            type="button"
            onClick={handlePasswordSave}
            disabled={updatePassword.isPending || !currentPassword || !newPassword || !newPasswordConfirm}
          >
            {updatePassword.isPending ? '변경 중...' : '비밀번호 변경'}
          </button>
        </div>
      </section>
    </div>
  );
}
