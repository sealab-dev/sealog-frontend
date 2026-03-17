import HomeBanner from '../../features/blog/components/home/HomeBanner';
import HomePostGrid from '../../features/blog/components/home/HomePostGrid';
import { useInfinitePostsQuery } from '../../services/post/post.queries';
import type { PostItem } from '../../services/post/types/post.response';
import type { Post } from '../../features/blog/types/post';

function toPost(item: PostItem): Post {
  return {
    id: item.postId,
    slug: item.slug,
    authorNickname: '', // PostItem에는 작성자 정보가 없으므로 빈 문자열 처리
    title: item.title,
    excerpt: item.excerpt,
    thumbnailUrl: item.thumbnailPath,
    stacks: item.stacks.map((s: { name: string }) => s.name),
    tags: item.tags,
    author: {
      name: '',
      initial: '',
      profileImageUrl: null,
    },
    date: item.createdAt.slice(0, 10),
  };
}

export default function HomePage() {
  const { data, isPending, fetchNextPage, hasNextPage, isFetchingNextPage, isError, refetch } =
    useInfinitePostsQuery();

  const posts = data?.pages.flatMap((page) => page.content.map(toPost)) ?? [];

  return (
    <>
      <HomeBanner />
      <HomePostGrid
        posts={posts}
        onLoadMore={() => fetchNextPage()}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        isLoading={isPending}
        isError={isError}
        onRetry={() => refetch()}
      />
    </>
  );
}
