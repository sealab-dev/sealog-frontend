import {
  useParams,
  useNavigate,
  useSearchParams,
  Navigate,
} from "react-router-dom";
import { useUserPosts } from "@/features/post/hooks/post/useUserPosts";
import { useBlogUserQuery } from "@/api/user/queries";
import type { PostType } from "@/api/post/types";
import {
  UserPostsFilter,
  UserPostsContents,
  UserBanner,
} from "@/features/post/components/posts-user";
import { PostThumbnail } from "@/features/post/components/post-detail";
import { Pagination } from "@/components/ui/pagination/Pagination";
import styles from "./PostsPage.module.css";

export const PostsPage = () => {
  const navigate = useNavigate();
  const params = useParams<{
    nickname: string;
    postType?: string;
    stack?: string;
  }>();
  const [searchParams] = useSearchParams();
  const { posts, pagination, filter, isError, setPage } = useUserPosts();

  const nickname = params.nickname ?? "";
  // const currentPostType = filter.postType || "ALL";

  // 블로그 유저 정보 (배너 이미지)
  // TODO: BlogUserResponse에 bannerImagePath 필드 추가 후 (blogUser as any) 제거
  const { data: blogUser } = useBlogUserQuery(nickname);
  const bannerImagePath: string | null =
    (blogUser as any)?.bannerImagePath ?? null;

  if (isError) {
    return <Navigate to="/404" replace />;
  }

  // const handleTabClick = (type: PostType | "ALL") => {
  //   const keyword = searchParams.get("q");
  //   const { stack } = params;

  //   let basePath = `/user/${nickname}`;

  //   if (stack) {
  //     basePath =
  //       type === "ALL"
  //         ? `/user/${nickname}/stack/${stack}`
  //         : `/user/${nickname}/stack/${stack}/type/${type.toLowerCase()}`;
  //   } else {
  //     basePath =
  //       type === "ALL"
  //         ? `/user/${nickname}`
  //         : `/user/${nickname}/type/${type.toLowerCase()}`;
  //   }

  //   navigate(keyword ? `${basePath}?q=${keyword}` : basePath);
  // };

  return (
    <div className={styles.container}>
      {/* 배너: 썸네일 등록 시 이미지, 없으면 기본 UserBanner */}
      {bannerImagePath ? (
        <PostThumbnail thumbnailPath={bannerImagePath} title={nickname} />
      ) : (
        <UserBanner />
      )}

      <div className={styles.sectionWrapper}>
        <div className={styles.filterWrapper}>
          {/* <UserPostsFilter
            currentPostType={currentPostType}
            totalCount={pagination.totalElements}
            onTabClick={handleTabClick}
          /> */}
        </div>

        <div className={styles.contentsWrapper}>
          <UserPostsContents posts={posts} />
        </div>

        {pagination.totalPages > 1 && (
          <div className={styles.paginationWrapper}>
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={setPage}
              hasNext={pagination.hasNext}
              hasPrevious={pagination.hasPrevious}
            />
          </div>
        )}
      </div>
    </div>
  );
};
