import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import UserHomeBanner from '../../features/blog/components/userhome/UserHomeBanner';
import UserHomePostGrid from '../../features/blog/components/userhome/UserHomePostGrid';
import UserHomeSideBar from '../../features/blog/components/userhome/UserHomeSideBar';
import { usePublicProfileQuery } from '../../services/user/user.queries';
import { useGroupedStacksByUserQuery } from '../../services/stack/stack.queries';
import { useGuestArchiveListQuery, useGuestArchivePostsQuery } from '../../services/archive/archive.queries';
import { useInfiniteUserPostsQuery } from '../../services/post/post.queries';
import type { UserProfile, SidebarStackGroup } from '../../features/blog/types/userProfile';
import { SOCIAL_ORDER, SOCIAL_LABEL, toSocialUIType } from '../../features/blog/types/userProfile';
import type { StackGroup } from '../../services/stack/_types/stack.enum';
import type { Post } from '../../features/blog/types/post';
import type { PostItems } from '../../services/post/_types/post.response';
import './UserHomePage.css';

const GROUP_ORDER: StackGroup[] = [
  'LANGUAGE',
  'FRAMEWORK',
  'LIBRARY',
  'DATABASE',
  'DEVOPS',
  'KNOWLEDGE',
  'TOOL',
  'ETC',
];

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

export default function UserHomePage() {
  const { username } = useParams<{ username: string }>();
  const nickname = username ?? '';

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeStack, setActiveStack] = useState('전체');
  const [activeSeries, setActiveSeries] = useState<{ id: number; name: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // API queries
  const { data: profileData } = usePublicProfileQuery(nickname);
  const { data: groupedStacksData } = useGroupedStacksByUserQuery(nickname);
  const { data: archiveListData } = useGuestArchiveListQuery(nickname);

  const {
    data: postsData,
    isPending: postsPending,
    isError: postsError,
    refetch: refetchPosts,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteUserPostsQuery(nickname);

  const {
    data: archivePostsData,
    isPending: archivePostsPending,
    isError: archivePostsError,
    refetch: refetchArchivePosts,
  } = useGuestArchivePostsQuery(activeSeries?.id ?? 0);

  const postCount = postsData?.pages[0]?.data.totalElements ?? 0;
  const seriesCount = archiveListData?.totalElements ?? 0;

  // Mapped profile
  const userProfile: UserProfile = profileData
    ? {
        name: profileData.nickname,
        initial: profileData.nickname.charAt(0).toUpperCase(),
        profileImageUrl: profileData.profileImageUrl,
        bio: profileData.about ?? '아직 소개를 작성하지 않았어요. 어떤 개발자인지 궁금하네요!',
        stats: [
          { value: postCount, label: 'posts' },
          { value: seriesCount, label: 'series' },
        ],
        socials: SOCIAL_ORDER
          .filter((t) => profileData.socialLinks.some((s) => s.socialType === t))
          .map((t) => {
            const s = profileData.socialLinks.find((s) => s.socialType === t)!;
            return { type: toSocialUIType(t), url: s.url, label: SOCIAL_LABEL[t] };
          }),
      }
    : {
        name: nickname,
        initial: nickname.charAt(0).toUpperCase(),
        bio: '아직 소개를 작성하지 않았어요. 어떤 개발자인지 궁금하네요!',
        stats: [
          { value: postCount, label: 'posts' },
          { value: seriesCount, label: 'series' },
        ],
        socials: [],
      };

  // Mapped grouped stacks
  const sortedGroupedStacks: SidebarStackGroup[] = useMemo(() => {
    if (!groupedStacksData) return [];
    const { groupedTags } = groupedStacksData;
    return GROUP_ORDER.filter((g) => groupedTags[g]?.length).map((g) => ({
      group: g,
      stacks: (groupedTags[g] ?? []).map((s) => ({ name: s.name, count: s.postCount })),
    }));
  }, [groupedStacksData]);

  // Mapped archive list (series)
  const sidebarSeries = useMemo(() => {
    return (archiveListData?.content ?? []).map((a) => ({
      id: a.id,
      name: a.name,
      count: 0,
    }));
  }, [archiveListData]);

  // All loaded posts (flat from pages)
  const allPosts: Post[] = useMemo(
    () => postsData?.pages.flatMap((page) => page.data.content.map(toPost)) ?? [],
    [postsData],
  );

  // Archive posts
  const archivePosts: Post[] = useMemo(() => {
    if (!activeSeries || !archivePostsData?.content) return [];
    return archivePostsData.content.map((p) => ({
      id: p.postId,
      slug: p.slug,
      authorNickname: nickname,
      title: p.title,
      excerpt: '',
      stacks: [],
      tags: [],
      author: { name: nickname, initial: nickname.charAt(0).toUpperCase() },
      date: '',
    }));
  }, [archivePostsData, activeSeries, nickname]);

  // Filtered display posts
  const displayPosts = activeSeries
    ? archivePosts
    : activeStack !== '전체'
      ? allPosts.filter((p) => p.stacks.includes(activeStack))
      : allPosts;

  const totalCount = postsData?.pages[0]?.data.totalElements ?? 0;

  const isLoading = activeSeries ? archivePostsPending : postsPending;
  const isError = activeSeries ? archivePostsError : postsError;
  const onRetry = activeSeries ? () => refetchArchivePosts() : () => refetchPosts();

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const closeOnMobile = () => {
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  const handleStackClick = (name: string) => {
    setActiveStack((prev) => (prev === name ? '전체' : name));
    setActiveSeries(null);
    closeOnMobile();
  };

  const handleSeriesClick = (item: { id: number; name: string }) => {
    setActiveSeries((prev) => (prev?.id === item.id ? null : item));
    setActiveStack('전체');
    closeOnMobile();
  };

  return (
    <div className={`uh-page-wrapper${sidebarOpen ? ' uh-page-wrapper--sidebar-open' : ''}`}>
      <UserHomeSideBar
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortedGroupedStacks={sortedGroupedStacks}
        activeStack={activeStack}
        onStackClick={handleStackClick}
        activeSeries={activeSeries}
        onSeriesClick={handleSeriesClick}
        sidebarSeries={sidebarSeries}
      />

      {/* Main Area */}
      <div className="uh-main-area">
        <UserHomeBanner profile={userProfile} />
        <UserHomePostGrid
          posts={displayPosts}
          total={totalCount}
          isLoading={isLoading}
          isError={isError}
          onRetry={onRetry}
          hasNextPage={!activeSeries && hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          onLoadMore={() => fetchNextPage()}
        />
      </div>
    </div>
  );
}
