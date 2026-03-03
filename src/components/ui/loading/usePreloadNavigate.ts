import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { _getLoadingStore } from '@/components/ui/loading/useLoading';
import { toast } from '@/components/ui/toast/useToast'; // toast 경로 확인 필요

export const usePreloadNavigate = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  /**
   * @param url 이동할 경로 (예: `/post/${slug}`)
   * @param queryKey React Query 키 (예: `['post', slug]`)
   * @param queryFn 데이터를 가져올 함수 (예: `() => getPostDetail(slug)`)
   */
  const navigateWithLoad = async <T>(
    url: string,
    queryKey: unknown[],
    queryFn: () => Promise<T>
  ) => {
    // 1. 상태 스토어 직접 접근
    const loadingStore = _getLoadingStore();

    try {
      // 2. 전역 로딩 강제 시작 (Request Count +1)
      loadingStore.showLoading();

      // 3. 데이터 미리 가져오기 (Prefetch)
      // staleTime을 설정하여 이동한 페이지에서 즉시 다시 fetching하는 것을 방지합니다.
      await queryClient.fetchQuery({
        queryKey,
        queryFn,
        staleTime: 1000 * 10, // 10초간 신선한 상태 유지
      });

      // 4. 데이터 로딩 완료 후 페이지 이동
      // 이미 캐시에 데이터가 있으므로, 이동 시 로딩 없이 즉시 렌더링됩니다.
      navigate(url);

    } catch (error) {
      console.error("Preload navigation failed:", error);
      toast.error("페이지를 불러오는 데 실패했습니다.");
      // 실패 시 이동하지 않고 현재 페이지 유지
    } finally {
      // 5. 전역 로딩 종료 (Request Count -1)
      loadingStore.hideLoading();
    }
  };

  return navigateWithLoad;
};