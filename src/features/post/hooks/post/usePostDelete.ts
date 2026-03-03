import { useNavigate } from 'react-router-dom';
import { useDeletePostMutation } from '@/api/post/mutations/post.mutations';
import { useToast } from '@/components/ui/toast/useToast';
import { getErrorMessage } from '@/api/core/api.error';

/**
 * 게시글 삭제 훅
 */
export const usePostDelete = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const mutation = useDeletePostMutation();

  const deletePost = async (slug: string): Promise<boolean> => {
    if (!window.confirm('정말 삭제하시겠습니까?')) {
      return false;
    }

    try {
      const response = await mutation.mutateAsync(slug);
      if (response.success) {
        toast.success(response.message || '게시글이 삭제되었습니다');
        navigate('/');
        return true;
      }
      return false;
    } catch (err) {
      const message = getErrorMessage(err);
      toast.error(message);
      return false;
    }
  };

  return {
    isLoading: mutation.isPending,
    error: mutation.error ? getErrorMessage(mutation.error) : null,
    deletePost,
  };
};