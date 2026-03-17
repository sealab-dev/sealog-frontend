import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAuthStore } from '../../../store/authStore';
import { useLoginMutation } from '../../../services/auth/auth.mutations';
import styles from './LoginModal.module.css';

export default function LoginModal() {
  const closeLoginModal = useAuthStore((s) => s.closeLoginModal);
  const loginMutation = useLoginMutation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  // 마운트 시 이메일 인풋 포커스
  useEffect(() => {
    const timer = setTimeout(() => emailRef.current?.focus(), 50);
    return () => clearTimeout(timer);
  }, []);

  // ESC 닫기
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLoginModal();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [closeLoginModal]);

  const validate = () => {
    const errors: { email?: string; password?: string } = {};

    // 이메일 유효성 검사
    if (!email.trim()) {
      errors.email = '이메일을 입력해주세요.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = '올바른 이메일 형식이 아닙니다.';
    }

    // 비밀번호 유효성 검사 (8자 이상 20자 미만)
    if (!password) {
      errors.password = '비밀번호를 입력해주세요.';
    } else if (password.length < 8 || password.length >= 20) {
      errors.password = '비밀번호는 8자 이상 20자 미만이어야 합니다.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (loginMutation.isPending) return;

    // 프론트엔드 유효성 검증
    if (!validate()) return;

    loginMutation.mutate(
      { email, password },
      {
        onSuccess: () => {
          closeLoginModal();
        },
        onError: () => {
          // 로그인 실패 시 비밀번호 필드 초기화 및 포커스 재설정
          setPassword('');
          passwordRef.current?.focus();
          // 서버 에러(아이디/비번 불일치 등)는 인터셉터가 토스트로 처리함
        },
      },
    );
  };

  return createPortal(
    <div
      className={styles.overlay}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) closeLoginModal();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="로그인"
    >
      <div className={styles.modal}>
        {/* 헤더 */}
        <div className={styles.header}>
          <div className={styles.logo}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 6v16" />
              <path d="m19 13 2-1a9 9 0 0 1-18 0l2 1" />
              <path d="M9 11h6" />
              <circle cx="12" cy="4" r="2" />
            </svg>
          </div>
          <h2 className={styles.title}>SeaLog<span>.dev</span></h2>
          <p className={styles.subtitle}>지식의 바다로 항해를 시작하세요</p>
        </div>

        {/* 폼 */}
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="login-email">
              이메일
            </label>
            <input
              ref={emailRef}
              id="login-email"
              className={`${styles.input} ${fieldErrors.email ? styles.inputError : ''}`}
              type="email"
              placeholder="이메일을 입력하세요"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: undefined });
              }}
              autoComplete="email"
              required
            />
            {fieldErrors.email && (
              <span className={styles.errorMsg}>{fieldErrors.email}</span>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="login-password">
              비밀번호
            </label>
            <input
              ref={passwordRef}
              id="login-password"
              className={`${styles.input} ${fieldErrors.password ? styles.inputError : ''}`}
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: undefined });
              }}
              autoComplete="current-password"
              required
            />
            {fieldErrors.password && (
              <span className={styles.errorMsg}>{fieldErrors.password}</span>
            )}
          </div>

          <button
            className={styles.submitBtn}
            type="submit"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? (
              <span className={styles.spinner} aria-hidden="true" />
            ) : (
              <>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
                로그인
              </>
            )}
          </button>
        </form>

        {/* 닫기 버튼 */}
        <button
          className={styles.closeBtn}
          type="button"
          onClick={closeLoginModal}
          aria-label="닫기"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>,
    document.body,
  );
}
