import { create } from 'zustand';

interface LoadingState {
  isLoading: boolean;
  requestCount: number;
  showLoading: () => void;
  hideLoading: () => void;
}

// 디바운스 타이머
// 디바운스 타이머
let showTimer: ReturnType<typeof setTimeout> | null = null;
let hideTimer: ReturnType<typeof setTimeout> | null = null;

// 내부 스토어 (외부 노출 X)
const useLoadingStore = create<LoadingState>((set, get) => ({
  isLoading: false,
  requestCount: 0,
  
  showLoading: () => {
    // hideLoading 타이머가 있으면 취소 (껐다 켜는 것 방지)
    if (hideTimer) {
      clearTimeout(hideTimer);
      hideTimer = null;
    }

    // 요청 카운트 즉시 증가
    set((state) => ({
      requestCount: state.requestCount + 1,
    }));

    // 이미 로딩 중이면 타이머 설정 불필요
    if (get().isLoading) return;

    // 로딩 표시는 150ms 후에 (빠른 요청은 로딩 안 보임)
    if (showTimer) clearTimeout(showTimer);
    showTimer = setTimeout(() => {
      if (get().requestCount > 0) {
        set({ isLoading: true });
      }
      showTimer = null;
    }, 150);
  },
  
  hideLoading: () => {
    // showLoading 타이머가 있으면 취소 (켰다 끄는 것 방지)
    if (showTimer) {
      clearTimeout(showTimer);
      showTimer = null;
    }

    // 요청 카운트 즉시 감소
    set((state) => ({
      requestCount: Math.max(0, state.requestCount - 1),
    }));

    // 로딩 숨김은 300ms 후에 (여러 요청 처리 시 깜박임 방지)
    if (hideTimer) clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      if (get().requestCount === 0) {
        set({ isLoading: false });
      }
      hideTimer = null;
    }, 300);
  },
}));

// 컴포넌트에서 사용할 훅
export const useLoading = () => {
  return useLoadingStore((state) => state.isLoading);
};

// Axios 인터셉터에서 사용 (내부 전용)
export const _getLoadingStore = () => useLoadingStore.getState();