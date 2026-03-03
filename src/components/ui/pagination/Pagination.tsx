import styles from './Pagination.module.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  hasNext = currentPage < totalPages - 1,
  hasPrevious = currentPage > 0,
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  // 페이지 번호 생성 로직
  const getPageNumbers = (): (number | 'dots')[] => {
    const pages: (number | 'dots')[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      // 전체 페이지가 적으면 모두 표시
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 항상 첫 페이지
      pages.push(0);

      if (currentPage <= 2) {
        // 앞쪽에 있을 때: 1, 2, 3, 4, ..., last
        for (let i = 1; i <= 3; i++) {
          pages.push(i);
        }
        pages.push('dots');
        pages.push(totalPages - 1);
      } else if (currentPage >= totalPages - 3) {
        // 뒤쪽에 있을 때: 1, ..., last-3, last-2, last-1, last
        pages.push('dots');
        for (let i = totalPages - 4; i < totalPages; i++) {
          pages.push(i);
        }
      } else {
        // 중간에 있을 때: 1, ..., prev, current, next, ..., last
        pages.push('dots');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('dots');
        pages.push(totalPages - 1);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav className={styles.pagination}>
      <button
        className={`${styles.pageBtn} ${styles.prev}`}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrevious}
        aria-label="이전 페이지"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <div className={styles.pageNumbers}>
        {pageNumbers.map((page, index) =>
          page === 'dots' ? (
            <span key={`dots-${index}`} className={styles.pageDots}>
              ⋯
            </span>
          ) : (
            <button
              key={page}
              className={`${styles.pageNum} ${currentPage === page ? styles.active : ''}`}
              onClick={() => onPageChange(page)}
            >
              {page + 1}
            </button>
          )
        )}
      </div>

      <button
        className={`${styles.pageBtn} ${styles.next}`}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNext}
        aria-label="다음 페이지"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </nav>
  );
};