import HomeBanner from '../../features/blog/components/home/HomeBanner';
import HomePostGrid from '../../features/blog/components/home/HomePostGrid';
import { useInfinitePostsQuery } from '../../services/post/post.queries';
import type { PostItems } from '../../services/post/_types/post.response';
import type { Post } from '../../features/blog/types/post';

function toPost(item: PostItems): Post {
  return {
    id: item.id,
    slug: item.slug,
    authorNickname: item.author.nickname,
    title: item.title,
    excerpt: item.excerpt,
    thumbnailUrl: item.thumbnailUrl,
    stacks: item.stacks.map((s) => s.name),
    tags: item.tags,
    author: {
      name: item.author.nickname,
      initial: item.author.nickname.charAt(0).toUpperCase(),
      profileImageUrl: item.author.profileImageUrl,
    },
    date: item.createdAt.slice(0, 10),
  };
}

export default function HomePage() {
  const { data, isPending, fetchNextPage, hasNextPage, isFetchingNextPage, isError, refetch } =
    useInfinitePostsQuery();

  const posts = data?.pages.flatMap((page) => page.data.content.map(toPost)) ?? [];

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
