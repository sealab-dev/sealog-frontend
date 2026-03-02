import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useUserPublicPostsQuery } from "@/api/post/queries";
import { useGroupedStacksByUserQuery } from "@/api/stack/queries";
import { STACK_GROUP_ORDER } from "@/api/stack/types";
import { useMemo } from "react";

/**
 * 유저 사이드바용 스택 + 태그 + 컬렉션 훅
 * - 스택: API에서 그룹별로 가져와 플랫하게 변환
 * - 태그: 전체 포스트에서 수집 (중복 제거, 빈도순)
 * - 컬렉션: 전체 포스트의 collectionName 필드에서 수집
 *   → TODO: [컬렉션 API 연결] 백엔드에서 PostItemResponse에 collectionName을 내려줘야 동작
 */
export const useUserTagsAndStacks = () => {
  const { nickname } = useParams<{ nickname: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentStack = useParams<{ stack?: string }>().stack ?? null;
  const currentTag = searchParams.get("tag") ?? null;
  // TODO: [컬렉션 API 연결] 백엔드 collection 필터 지원 시 이 값이 URL에서 읽혀 사이드바 활성 상태에 반영됨
  const currentcollection = searchParams.get("collection") ?? null;

  // 스택 (그룹별)
  const { data: groupedStacks, isLoading: stackLoading } =
    useGroupedStacksByUserQuery(nickname ?? "");

  // 전체 포스트 (태그/컬렉션 수집용 — size 크게)
  const { data: postsData, isLoading: postLoading } = useUserPublicPostsQuery(
    nickname ?? "",
    { page: 0, size: 200 },
  );

  // 플랫 스택 목록
  const allStacks = useMemo(() => {
    if (!groupedStacks) return [];
    return STACK_GROUP_ORDER.flatMap((group) => groupedStacks[group] ?? []);
  }, [groupedStacks]);

  // 태그 목록 (중복 제거, 빈도순)
  const allTags = useMemo(() => {
    const posts = postsData?.data?.content ?? [];
    const freq: Record<string, number> = {};
    posts.forEach((p) => {
      p.tags.forEach((t) => {
        freq[t] = (freq[t] ?? 0) + 1;
      });
    });
    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .map(([tag, count]) => ({ tag, count }));
  }, [postsData]);

  // 컬렉션 목록
  // TODO: [컬렉션 API 연결] 백엔드 PostItemResponse에 collectionName 필드가 내려와야 아래 목록이 채워짐
  // 현재는 collectionName이 없으면 allcollection = [] → 사이드바에 컬렉션 섹션이 표시되지 않음 (정상)
  const allcollection = useMemo(() => {
    const posts = postsData?.data?.content ?? [];
    const freq: Record<string, number> = {};
    posts.forEach((p) => {
      if (p.collectionName) {
        freq[p.collectionName] = (freq[p.collectionName] ?? 0) + 1;
      }
    });
    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));
  }, [postsData]);

  // 스택 클릭
  const handleStackClick = (stackName: string) => {
    const keyword = searchParams.get("q");
    const base =
      currentStack === stackName
        ? `/user/${nickname}`
        : `/user/${nickname}/stack/${stackName}`;
    navigate(keyword ? `${base}?q=${keyword}` : base);
  };

  // 태그 클릭 → ?tag=xxx 쿼리 파라미터로 필터링
  const handleTagClick = (tag: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (currentTag === tag) {
      newParams.delete("tag");
    } else {
      newParams.set("tag", tag);
      newParams.delete("collection"); // 태그/컬렉션 동시 선택 방지
    }
    navigate(`/user/${nickname}?${newParams.toString()}`);
  };

  // 컬렉션 클릭 → ?collection=xxx 쿼리 파라미터로 필터링
  // TODO: [컬렉션 API 연결] 백엔드에서 GET /api/posts/user/{nickname}?collection=컬렉션명 지원 시 실제 필터링 동작
  // 현재는 URL에 ?collection=xxx 가 붙지만 백엔드 미지원이라 필터링 결과는 전체 게시글과 동일
  const handlecollectionClick = (collectionName: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (currentcollection === collectionName) {
      newParams.delete("collection");
    } else {
      newParams.set("collection", collectionName);
      newParams.delete("tag"); // 태그/컬렉션 동시 선택 방지
    }
    navigate(`/user/${nickname}?${newParams.toString()}`);
  };

  return {
    allStacks,
    allTags,
    allcollection,
    currentStack,
    currentTag,
    currentcollection,
    isLoading: stackLoading || postLoading,
    handleStackClick,
    handleTagClick,
    handlecollectionClick,
  };
};
