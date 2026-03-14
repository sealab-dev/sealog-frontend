import { useState, useRef } from 'react';
import { useMyProfileQuery } from '../../services/user/user.queries';
import { useUpdateProfileMutation, useUpdatePasswordMutation } from '../../services/user/user.mutations';
import { useToast } from '../../components/ui/toast/useToast';
import { SOCIAL_ORDER, SOCIAL_LABEL } from '../../features/blog/types/userProfile';
import type { SocialType } from '../../services/user/_types/user.enum';
import './MyPage.css';

const SOCIAL_ICON: Record<SocialType, React.ReactElement> = {
  GITHUB: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  ),
  PORTFOLIO: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  NOTION: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.14c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z" />
    </svg>
  ),
  LINKEDIN: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  YOUTUBE: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
  INSTAGRAM: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  ),
};

export default function MyPage() {
  const toast = useToast();
  const { data: profile, isPending } = useMyProfileQuery();
  const updateProfile = useUpdateProfileMutation();
  const updatePassword = useUpdatePasswordMutation();

  // 프로필 상태
  const [nickname, setNickname] = useState('');
  const [position, setPosition] = useState('');
  const [about, setAbout] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 소셜 링크 상태
  const [socialLinks, setSocialLinks] = useState<Partial<Record<SocialType, string>>>({});

  // 비밀번호 상태
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');

  // 프로필 데이터 초기화
  const [prevProfile, setPrevProfile] = useState(profile);
  if (prevProfile !== profile) {
    setPrevProfile(profile);
    if (profile) {
      setNickname(profile.nickname);
      setPosition(profile.position ?? '');
      setAbout(profile.about ?? '');
      const links: Partial<Record<SocialType, string>> = {};
      profile.socialLinks.forEach((s) => { links[s.socialType] = s.url; });
      setSocialLinks(links);
    }
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleProfileSave = async () => {
    const socialLinksPayload = SOCIAL_ORDER
      .filter((t) => socialLinks[t]?.trim())
      .map((t) => ({ socialType: t, url: socialLinks[t]!.trim() }));

    await updateProfile.mutateAsync({
      request: {
        nickname: nickname.trim() || undefined,
        position: position.trim() || undefined,
        about: about.trim() || undefined,
        socialLinks: socialLinksPayload,
      },
      profileImage: avatarFile,
    });
    setAvatarFile(null);
    toast.success('프로필이 저장되었습니다.');
  };

  const handlePasswordSave = async () => {
    if (newPassword !== newPasswordConfirm) {
      toast.error('새 비밀번호가 일치하지 않습니다.');
      return;
    }
    await updatePassword.mutateAsync({
      currentPassword,
      newPassword,
      newPasswordConfirm,
    });
    setCurrentPassword('');
    setNewPassword('');
    setNewPasswordConfirm('');
    toast.success('비밀번호가 변경되었습니다.');
  };

  if (isPending) return null;
  if (!profile) return null;

  return (
    <div className="mypage">
      <div className="mypage__inner">
        <h1 className="mypage__title">마이페이지</h1>

        {/* 프로필 섹션 */}
        <section className="mypage-card">
          <h2 className="mypage-card__title">프로필 정보</h2>

          {/* 아바타 */}
          <div className="mypage-avatar-row">
            <div
              className="mypage-avatar"
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
              title="클릭하여 이미지 변경"
            >
              {avatarPreview || profile.profileImageUrl ? (
                <img src={avatarPreview ?? profile.profileImageUrl!} alt="" />
              ) : (
                <span>{profile.nickname.charAt(0).toUpperCase()}</span>
              )}
              <div className="mypage-avatar__overlay">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </div>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" className="mypage-avatar__input" onChange={handleAvatarChange} />
            <p className="mypage-avatar__hint">클릭하여 프로필 이미지 변경</p>
          </div>

          {/* 읽기전용 필드 */}
          <div className="mypage-fields">
            <div className="mypage-field">
              <label className="mypage-field__label">이름</label>
              <input className="mypage-field__input mypage-field__input--readonly" value={profile.name} readOnly />
            </div>
            <div className="mypage-field">
              <label className="mypage-field__label">이메일</label>
              <input className="mypage-field__input mypage-field__input--readonly" value={profile.email} readOnly />
            </div>
            <div className="mypage-field">
              <label className="mypage-field__label">닉네임</label>
              <input className="mypage-field__input" value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="닉네임" />
            </div>
            <div className="mypage-field">
              <label className="mypage-field__label">직함 / 포지션</label>
              <input className="mypage-field__input" value={position} onChange={(e) => setPosition(e.target.value)} placeholder="예) Frontend Developer" />
            </div>
            <div className="mypage-field mypage-field--full">
              <label className="mypage-field__label">소개</label>
              <textarea className="mypage-field__textarea" value={about} onChange={(e) => setAbout(e.target.value)} placeholder="자신을 소개해보세요" rows={4} />
            </div>
          </div>

          {/* 소셜 링크 */}
          <div className="mypage-section-sub">
            <h3 className="mypage-section-sub__title">소셜 링크</h3>
            <div className="mypage-fields">
              {SOCIAL_ORDER.map((type) => (
                <div key={type} className="mypage-field">
                  <label className="mypage-field__label mypage-field__label--social">{SOCIAL_LABEL[type]}</label>
                  <div className="mypage-social-input">
                    <span className="mypage-social-input__icon">{SOCIAL_ICON[type]}</span>
                    <input
                      className="mypage-field__input mypage-social-input__field"
                      value={socialLinks[type] ?? ''}
                      onChange={(e) => setSocialLinks((prev) => ({ ...prev, [type]: e.target.value }))}
                      placeholder={`${SOCIAL_LABEL[type]} URL`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mypage-card__footer">
            <button
              className="mypage-btn mypage-btn--primary"
              type="button"
              onClick={handleProfileSave}
              disabled={updateProfile.isPending}
            >
              {updateProfile.isPending ? '저장 중...' : '저장'}
            </button>
          </div>
        </section>

        {/* 비밀번호 변경 섹션 */}
        <section className="mypage-card">
          <h2 className="mypage-card__title">비밀번호 변경</h2>
          <div className="mypage-fields">
            <div className="mypage-field mypage-field--full">
              <label className="mypage-field__label">현재 비밀번호</label>
              <input className="mypage-field__input" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="현재 비밀번호" />
            </div>
            <div className="mypage-field">
              <label className="mypage-field__label">새 비밀번호</label>
              <input className="mypage-field__input" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="새 비밀번호" />
            </div>
            <div className="mypage-field">
              <label className="mypage-field__label">새 비밀번호 확인</label>
              <input className="mypage-field__input" type="password" value={newPasswordConfirm} onChange={(e) => setNewPasswordConfirm(e.target.value)} placeholder="새 비밀번호 확인" />
            </div>
          </div>
          <div className="mypage-card__footer">
            <button
              className="mypage-btn mypage-btn--primary"
              type="button"
              onClick={handlePasswordSave}
              disabled={updatePassword.isPending || !currentPassword || !newPassword || !newPasswordConfirm}
            >
              {updatePassword.isPending ? '변경 중...' : '비밀번호 변경'}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
