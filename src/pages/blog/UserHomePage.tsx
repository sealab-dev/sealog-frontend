import { useState, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import UserHomeBanner from '../../features/blog/components/userhome/UserHomeBanner';
import UserHomePostGrid from '../../features/blog/components/userhome/UserHomePostGrid';
import UserHomeSideBar from '../../features/blog/components/userhome/UserHomeSideBar';
import { usePublicProfileQuery } from '../../services/user/user.queries';
import { useGroupedStacksByUserQuery } from '../../services/stack/stack.queries';
import { useGuestSeriesListQuery, useGuestSeriesPostsQuery } from '../../services/series/series.queries';
import {
  useInfiniteUserPostsQuery,
  usePostsByStackQuery,
  useSearchUserPostsQuery,
} from '../../services/post/post.queries';
import type { UserProfile, SidebarStackGroup } from '../../features/blog/types/userProfile';
import { SOCIAL_ORDER, SOCIAL_LABEL, toSocialUIType } from '../../features/blog/types/userProfile';
import type { StackGroup } from '../../services/stack/types/stack.enum';
import type { Post } from '../../features/blog/types/post';
import type { PostItem } from '../../services/post/types/post.response';
import type { SeriesPostItem } from '../../services/series/types/series.response';
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

type ActiveSeries = { id: number; slug: string; name: string };

function toPost(
  item: PostItem | SeriesPostItem,
  nickname: string,
  profileImageUrl?: string | null,
): Post {
  const isPostItem = (it: PostItem | SeriesPostItem): it is PostItem => 'postId' in it;

  return {
    id: isPostItem(item) ? item.postId : item.id,
    slug: item.slug,
    authorNickname: nickname,
    title: item.title,
    excerpt: item.excerpt,
    thumbnailUrl: isPostItem(item) ? item.thumbnailPath : item.thumbnailUrl,
    stacks: item.stacks.map((s) => s.name),
    tags: item.tags,
    author: {
      name: nickname,
      initial: nickname.charAt(0).toUpperCase(),
      profileImageUrl: profileImageUrl ?? null,
    },
    date: new Date(item.createdAt).toLocaleDateString('ko-KR'),
  };
}

export default function UserHomePage() {
  const { username, stackName, seriesSlug } = useParams<{
    username: string;
    stackGroup?: string;
    stackName?: string;
    seriesSlug?: string;
  }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const nickname = username ?? '';

  // URL에서 필터 상태 파생
  const keyword = searchParams.get('keyword') ?? '';
  const isSearchMode = keyword.length > 0;
  const isSeriesMode = !isSearchMode && !!seriesSlug;
  const isStackMode = !isSearchMode && !isSeriesMode && !!stackName;

  const activeStack = stackName ?? '전체';

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // API queries
  const { data: profileData } = usePublicProfileQuery(nickname);
  const { data: groupedStacksData } = useGroupedStacksByUserQuery(nickname);
  const { data: seriesListData } = useGuestSeriesListQuery(nickname);

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
    data: stackPostsData,
    isPending: stackPostsPending,
    isError: stackPostsError,
    refetch: refetchStackPosts,
  } = usePostsByStackQuery(nickname, activeStack, undefined, { enabled: isStackMode });

  const {
    data: searchPostsData,
    isPending: searchPostsPending,
    isError: searchPostsError,
    refetch: refetchSearchPosts,
  } = useSearchUserPostsQuery(nickname, keyword, undefined, { enabled: isSearchMode });

  const {
    data: seriesPostsData,
    isPending: seriesPostsPending,
    isError: seriesPostsError,
    refetch: refetchSeriesPosts,
  } = useGuestSeriesPostsQuery(nickname, seriesSlug ?? '', undefined, { enabled: isSeriesMode });

  const totalAllPosts = postsData?.pages[0]?.totalElements ?? 0;
  const seriesCount = seriesListData?.totalElements ?? 0;
  const profileImageUrl = profileData?.profileImageUrl ?? null;

  // Mapped profile
  const userProfile: UserProfile = profileData
    ? {
        name: profileData.nickname,
        initial: profileData.nickname.charAt(0).toUpperCase(),
        profileImageUrl: profileData.profileImageUrl,
        position: profileData.position,
        bio: profileData.about ?? '아직 소개를 작성하지 않았어요. 어떤 개발자인지 궁금하네요!',
        stats: [
          { value: totalAllPosts, label: 'posts' },
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
          { value: totalAllPosts, label: 'posts' },
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

  // Mapped series list for sidebar
  const sidebarSeries = useMemo(() => {
    return (seriesListData?.content ?? []).map((s) => ({
      id: s.id,
      slug: s.slug,
      name: s.name,
      count: s.postCount,
    }));
  }, [seriesListData]);

  // 현재 활성 시리즈 (URL slug → 시리즈 정보 매핑)
  const activeSeries: ActiveSeries | null = useMemo(() => {
    if (!seriesSlug) return null;
    return sidebarSeries.find((s) => s.slug === seriesSlug) ?? null;
  }, [seriesSlug, sidebarSeries]);

  // All loaded posts (flat from infinite scroll pages)
  const allPosts: Post[] = useMemo(
    () =>
      postsData?.pages.flatMap((page) =>
        page.content.map((item) => toPost(item, nickname, profileImageUrl)),
      ) ?? [],
    [postsData, nickname, profileImageUrl],
  );

  // Display posts based on current mode
  const displayPosts: Post[] = useMemo(() => {
    if (isSearchMode) {
      return (searchPostsData?.content ?? []).map((item) => toPost(item, nickname, profileImageUrl));
    }
    if (isSeriesMode) {
      return (seriesPostsData?.content ?? []).map((item) => toPost(item, nickname, profileImageUrl));
    }
    if (isStackMode) {
      return (stackPostsData?.content ?? []).map((item) => toPost(item, nickname, profileImageUrl));
    }
    return allPosts;
  }, [
    isSearchMode,
    isSeriesMode,
    isStackMode,
    searchPostsData,
    seriesPostsData,
    stackPostsData,
    allPosts,
    nickname,
    profileImageUrl,
  ]);

  const currentCount = isSearchMode
    ? searchPostsData?.totalElements ?? 0
    : isSeriesMode
      ? seriesPostsData?.totalElements ?? 0
      : isStackMode
        ? stackPostsData?.totalElements ?? 0
        : totalAllPosts;

  const filterLabel = isSearchMode ? '검색어' : isSeriesMode ? '시리즈' : isStackMode ? '스택' : undefined;
  const filterValue = isSearchMode ? keyword : isSeriesMode ? activeSeries?.name : isStackMode ? activeStack : undefined;

  const isLoading = isSearchMode
    ? searchPostsPending
    : isSeriesMode
      ? seriesPostsPending
      : isStackMode
        ? stackPostsPending
        : postsPending;

  const isError = isSearchMode
    ? searchPostsError
    : isSeriesMode
      ? seriesPostsError
      : isStackMode
        ? stackPostsError
        : postsError;

  const onRetry = isSearchMode
    ? refetchSearchPosts
    : isSeriesMode
      ? refetchSeriesPosts
      : isStackMode
        ? refetchStackPosts
        : () => refetchPosts();

  const closeOnMobile = () => {
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  const handleStackClick = (group: StackGroup, name: string) => {
    // 같은 스택 클릭 시 전체로 돌아감
    if (activeStack === name) {
      navigate(`/${nickname}/posts`);
    } else {
      navigate(`/${nickname}/posts/${group}/${name}`);
    }
    closeOnMobile();
  };

  const handleSeriesClick = (item: ActiveSeries) => {
    // 같은 시리즈 클릭 시 전체로 돌아감
    if (seriesSlug === item.slug) {
      navigate(`/${nickname}/posts`);
    } else {
      navigate(`/${nickname}/series/${item.slug}`);
    }
    closeOnMobile();
  };

  const handleSearchChange = (query: string) => {
    if (query) {
      setSearchParams({ keyword: query }, { replace: true });
    } else {
      navigate(`/${nickname}/posts`, { replace: true });
    }
  };

  return (
    <div className={`uh-page-wrapper${sidebarOpen ? ' uh-page-wrapper--sidebar-open' : ''}`}>
      <UserHomeSideBar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((prev) => !prev)}
        searchQuery={keyword}
        onSearchChange={handleSearchChange}
        sortedGroupedStacks={sortedGroupedStacks}
        activeStack={activeStack}
        onStackClick={handleStackClick}
        activeSeries={activeSeries}
        onSeriesClick={handleSeriesClick}
        sidebarSeries={sidebarSeries}
        isAllActive={!isSearchMode && !isSeriesMode && !isStackMode}
        onAllClick={() => navigate(`/${nickname}/posts`)}
      />

      {/* Main Area */}
      <div className="uh-main-area">
        <UserHomeBanner profile={userProfile} />
        <UserHomePostGrid
          posts={displayPosts}
          total={currentCount}
          filterLabel={filterLabel}
          filterValue={filterValue}
          isLoading={isLoading}
          isError={isError}
          onRetry={onRetry}
          hasNextPage={!isSearchMode && !isSeriesMode && !isStackMode && hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          onLoadMore={() => fetchNextPage()}
        />
      </div>
    </div>
  );
}
