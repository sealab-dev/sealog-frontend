import { useEffect, useCallback, useState } from 'react';

interface UseUnsavedChangesOptions {
  hasUnsavedChanges: boolean;
  onConfirm?: () => void;
}

export const useUnsaved = ({
  hasUnsavedChanges,
  onConfirm,
}: UseUnsavedChangesOptions) => {
  const [showModal, setShowModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null);

  // 브라우저의 beforeunload 이벤트 처리 (새로고침, 탭 닫기)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  // 네비게이션 함수를 받아 모달을 표시하는 함수
  const confirmNavigation = useCallback((navigationFn: () => void) => {
    if (hasUnsavedChanges) {
      // 함수를 올바르게 저장하기 위해 이중 화살표 함수 사용
      setPendingNavigation(() => () => navigationFn());
      setShowModal(true);
      return false;
    }
    navigationFn();
    return true;
  }, [hasUnsavedChanges]);

  // 모달에서 "나가기" 확인
  const handleConfirm = useCallback(() => {
    setShowModal(false);
    if (onConfirm) {
      onConfirm();
    }
    if (pendingNavigation) {
      pendingNavigation();
      setPendingNavigation(null);
    }
  }, [pendingNavigation, onConfirm]);

  // 모달에서 "계속 작성하기" 취소
  const handleCancel = useCallback(() => {
    setShowModal(false);
    setPendingNavigation(null);
  }, []);

  return {
    showModal,
    handleConfirm,
    handleCancel,
    confirmNavigation,
  };
};