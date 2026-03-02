// import { useParams } from 'react-router-dom';
// import { useGroupedStacksByUserQuery } from '@/api/stack/queries';

// /**
//  * 유저별 사이드바용 스택 훅
//  * 사용처: StackList (유저 페이지)
//  */
// export const useUserStacks = () => {
//   const { nickname } = useParams<{ nickname: string }>();

//   const { data: groupedStacks, isLoading } = useGroupedStacksByUserQuery(nickname ?? '');

//   return {
//     nickname: nickname ?? '',
//     groupedStacks: groupedStacks ?? null,
//     isLoading,
//   };
// };
