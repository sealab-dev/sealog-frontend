import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DetailBanner from '../../features/blog/components/detail/DetailBanner';
import DetailPostHeader from '../../features/blog/components/detail/DetailPostHeader';
import DetailPost from '../../features/blog/components/detail/DetailPost';
import { usePostDetailQuery } from '../../services/post/post.queries';
import { useDeletePostMutation } from '../../services/post/post.mutations';
import { useAuthStore } from '../../store/authStore';
import type { PostDetail, TocItem } from '../../features/blog/types/post';
import './PostDetailPage.css';

function generateToc(html: string): TocItem[] {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return Array.from(doc.querySelectorAll('h1, h2, h3')).map((h, i) => ({
    id: `h-${i}`,
    text: h.textContent?.trim() ?? '',
    level: Number(h.tagName[1]) as 1 | 2 | 3,
  }));
}

function calcReadTime(html: string): number {
  const words = html.replace(/<[^>]*>/g, '').trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export default function PostDetailPage() {
  const { username, slug } = useParams<{ username: string; slug: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      setProgress(Math.min((doc.scrollTop / (doc.scrollHeight - doc.clientHeight)) * 100, 100));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const { data: postData, isLoading, isError } = usePostDetailQuery(username ?? '', slug ?? '');
  const deleteMutation = useDeletePostMutation();

  const content = postData?.content ?? '';

  const toc = useMemo(
    () => (content ? generateToc(content) : []),
    [content],
  );

  const postDetail: PostDetail | null = postData
    ? {
        id: postData.id,
        title: postData.title,
        author: {
          name: postData.author.nickname,
          nickname: postData.author.nickname,
          initial: postData.author.nickname.charAt(0).toUpperCase(),
          profileImageUrl: postData.author.profileImageUrl,
        },
        date: postData.createdAt.slice(0, 10),
        readTime: calcReadTime(postData.content),
        stacks: postData.stacks.map((s) => s.name),
        tags: postData.tags,
        series: postData.seriesInfo
          ? { name: postData.seriesInfo.name, href: `/${postData.author.nickname}/posts` }
          : undefined,
        toc,
      }
    : null;

  const isOwner = !!user && user.nickname === postData?.author.nickname;

  const handleEdit = () => navigate(`/${username}/entry/${slug}/edit`);

  const handleDelete = async () => {
    if (!postData || !window.confirm('게시글을 삭제하시겠습니까?')) return;
    await deleteMutation.mutateAsync(postData.id);
    navigate(`/${username}/posts`);
  };

  if (isLoading || !postDetail) return null;
  if (isError) return null;

  return (
    <>
      <div className="pd-progress-bar">
        <div className="pd-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <DetailBanner thumbnailUrl={postData?.thumbnailUrl} />

      <div className="pd-page">
        <article>
          <DetailPostHeader
            post={postDetail}
            isOwner={isOwner}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          <DetailPost toc={toc} content={content} />
        </article>
      </div>
    </>
  );
}
