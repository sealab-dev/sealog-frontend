import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { WaveDivider } from '../../components/ui/wave/WaveDivider';
import DetailBanner from '../../features/blog/components/detail/DetailBanner';
import DetailPost from '../../features/blog/components/detail/DetailPost';
import { usePostDetailQuery } from '../../services/post/post.queries';
import { useDeletePostMutation } from '../../services/post/post.mutations';
import { useAuthStore } from '../../store/authStore';
import type { PostDetail, TocItem } from '../../features/blog/types/post';
import './PostDetailPage.css';

function generateToc(html: string): TocItem[] {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return Array.from(doc.querySelectorAll('h2, h3')).map((h, i) => ({
    id: `h-${i}`,
    text: h.textContent?.trim() ?? '',
    level: Number(h.tagName[1]) as 2 | 3,
  }));
}

function injectHeadingIds(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  Array.from(doc.querySelectorAll('h2, h3')).forEach((h, i) => h.setAttribute('id', `h-${i}`));
  return doc.body.innerHTML;
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

  const content = postData?.content;

  const processedContent = useMemo(
    () => (content ? injectHeadingIds(content) : ''),
    [content],
  );

  const toc = useMemo(
    () => (content ? generateToc(content) : []),
    [content],
  );

  const postDetail: PostDetail | null = postData
    ? {
        id: postData.id,
        title: postData.title,
        desc: postData.excerpt,
        author: {
          name: postData.author.nickname,
          initial: postData.author.nickname.charAt(0).toUpperCase(),
          profileImageUrl: postData.author.profileImageUrl,
        },
        date: postData.createdAt.slice(0, 10),
        readTime: calcReadTime(postData.content),
        stacks: postData.stacks.map((s) => s.name),
        tags: postData.tags,
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

      <section className="pd-thumb-banner">
        <div className="pd-thumb-banner__img">
          {postData?.thumbnailUrl && <img src={postData.thumbnailUrl} alt="" />}
        </div>
        <div className="pd-thumb-banner__bg" />
        <WaveDivider
          fillColor="var(--pd-wave-color)"
          fillColor2="var(--pd-wave-color-2)"
          height={80}
          id="pd-wave"
        />
      </section>

      <div className="pd-page">
        <article>
          <DetailBanner
            post={postDetail}
            isOwner={isOwner}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          <DetailPost toc={toc} content={processedContent} />
        </article>
      </div>
    </>
  );
}
