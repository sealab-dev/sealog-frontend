import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAuthStore } from '../../../store/authStore';
import { useLoginMutation } from '../../../services/auth/auth.mutations';
import { useToast } from '../../../components/ui/toast/useToast';
import { getFieldErrors } from '../../../services/core/client.error';
import type { AxiosError } from 'axios';
import styles from './LoginModal.module.css';

// AppLayout에서 isLoginModalOpen일 때만 렌더되므로
// 마운트 시점 = 모달 열림 → state는 항상 초기값으로 시작

export default function LoginModal() {
  const closeLoginModal = useAuthStore((s) => s.closeLoginModal);
  const toast = useToast();
  const loginMutation = useLoginMutation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const emailRef = useRef<HTMLInputElement>(null);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    loginMutation.mutate(
      { email, password },
      {
        onSuccess: () => {
          toast.success('로그인되었습니다');
          closeLoginModal();
        },
        onError: (err) => {
          const errors = getFieldErrors(err as AxiosError);
          if (errors && Object.keys(errors).length > 0) {
            setFieldErrors(errors);
          }
          // 글로벌 에러(toast)는 인터셉터가 처리
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
              onChange={(e) => setEmail(e.target.value)}
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
              id="login-password"
              className={`${styles.input} ${fieldErrors.password ? styles.inputError : ''}`}
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
