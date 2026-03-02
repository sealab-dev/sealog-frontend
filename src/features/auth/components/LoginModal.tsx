import { useEffect, type FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { useLoginModalStore } from '@/features/auth/stores/loginModalStore';
import { useLoginModal } from '@/features/auth/hooks/useLoginModal';
import styles from './LoginModal.module.css';

export const LoginModal = () => {
  const { 
    isOpen, 
    email, 
    password, 
    closeLoginModal, 
    setEmail, 
    setPassword 
  } = useLoginModalStore();
  const { isLoading, error, fieldErrors, login, clearError } = useLoginModal();

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEsc = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeLoginModal();
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, closeLoginModal]);

  // 모달 열릴 때 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await login({ email, password });
  };

  const handleInputChange = () => {
    if (error) clearError();
  };

  const handleClose = () => {
    if (!isLoading) {
      clearError();
      closeLoginModal();
    }
  };

  const handleOverlayClick = () => {
    handleClose();
  };

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal} onClick={handleContentClick}>
        {/* 닫기 버튼 */}
        <button
          type="button"
          className={styles.closeButton}
          onClick={closeLoginModal}
          disabled={isLoading}
          aria-label="닫기"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* 헤더 */}
        <div className={styles.header}>
          <h2 className={styles.title}>로그인</h2>
          <p className={styles.subtitle}>Sealog에 오신 것을 환영합니다</p>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className={styles.errorAlert}>
            <svg className={styles.errorIcon} viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* 폼 */}
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="login-email" className={styles.label}>
              이메일
            </label>
            <input
              id="login-email"
              type="email"
              className={`${styles.input} ${fieldErrors?.email ? styles.inputError : ''}`}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                handleInputChange();
              }}
              placeholder="example@email.com"
              required
              disabled={isLoading}
              autoComplete="email"
            />
            {fieldErrors?.email && (
              <p className={styles.fieldError}>{fieldErrors.email}</p>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="login-password" className={styles.label}>
              비밀번호
            </label>
            <input
              id="login-password"
              type="password"
              className={`${styles.input} ${fieldErrors?.password ? styles.inputError : ''}`}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                handleInputChange();
              }}
              placeholder="비밀번호를 입력하세요"
              required
              disabled={isLoading}
              autoComplete="current-password"
            />
            {fieldErrors?.password && (
              <p className={styles.fieldError}>{fieldErrors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className={styles.loadingWrapper}>
                <svg className={styles.spinner} viewBox="0 0 24 24">
                  <circle
                    className={styles.spinnerCircle}
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className={styles.spinnerPath}
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                로그인 중...
              </span>
            ) : (
              '로그인'
            )}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
};