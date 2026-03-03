import { useState, useCallback, useEffect } from 'react';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';

interface UseSearchReturn {
  // 상태
  keyword: string;
  inputValue: string;

  // 액션
  setInputValue: (value: string) => void;
  handleSearch: () => void;
  clearSearch: () => void;
}

export const useUserPostSearch = (): UseSearchReturn => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // URL의 q 파라미터
  const keyword = searchParams.get('q') || '';

  // 입력 필드 값 (URL과 별도로 관리)
  const [inputValue, setInputValue] = useState(keyword);

  // URL keyword가 변경되면 input도 동기화
  useEffect(() => {
    setInputValue(keyword);
  }, [keyword]);

  // 검색 실행 (현재 path 유지하면서 query만 변경)
  const handleSearch = useCallback(() => {
    const trimmed = inputValue.trim();
    const newParams = new URLSearchParams(searchParams);

    if (trimmed) {
      newParams.set('q', trimmed);
    } else {
      newParams.delete('q');
    }

    // 페이지는 리셋
    newParams.delete('page');

    const queryString = newParams.toString();
    const newPath = queryString ? `${location.pathname}?${queryString}` : location.pathname;

    navigate(newPath);
  }, [inputValue, searchParams, location.pathname, navigate]);

  // 검색어 초기화
  const clearSearch = useCallback(() => {
    setInputValue('');

    const newParams = new URLSearchParams(searchParams);
    newParams.delete('q');
    newParams.delete('page');

    const queryString = newParams.toString();
    const newPath = queryString ? `${location.pathname}?${queryString}` : location.pathname;

    navigate(newPath);
  }, [searchParams, location.pathname, navigate]);

  return {
    keyword,
    inputValue,
    setInputValue,
    handleSearch,
    clearSearch,
  };
};