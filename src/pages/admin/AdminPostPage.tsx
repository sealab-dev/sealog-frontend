import { useState, useMemo } from 'react';
import { Search, Filter, ExternalLink, FileText, Calendar } from 'lucide-react';
import styles from './AdminPostPage.module.css';

// Mock Data
interface Post {
  id: number;
  title: string;
  authorNickname: string;
  status: 'PUBLISHED' | 'DRAFT';
  createdAt: string;
  viewCount: number;
}

const MOCK_POSTS: Post[] = [
  { id: 1, title: 'SeaLog 프로젝트 시작하기', authorNickname: 'admin', status: 'PUBLISHED', createdAt: '2024-03-01', viewCount: 125 },
  { id: 2, title: 'React Query를 사용한 데이터 페칭', authorNickname: '길동이', status: 'PUBLISHED', createdAt: '2024-03-05', viewCount: 84 },
  { id: 3, title: 'CSS Module vs Tailwind CSS', authorNickname: '장군님', status: 'DRAFT', createdAt: '2024-03-10', viewCount: 0 },
  { id: 4, title: '관리자 페이지 디자인 가이드', authorNickname: 'admin', status: 'PUBLISHED', createdAt: '2024-03-12', viewCount: 42 },
];

export default function AdminPostPage() {
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PUBLISHED' | 'DRAFT'>('ALL');

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch = 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.authorNickname.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'ALL' || post.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [posts, searchQuery, statusFilter]);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerTitle}>
          <h1 className={styles.title}>글 관리</h1>
          <p className={styles.subtitle}>플랫폼의 모든 게시글을 모니터링하고 관리합니다.</p>
        </div>
      </header>

      {/* Filters */}
      <section className={styles.filters}>
        <div className={styles.searchBox}>
          <Search size={18} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="제목, 작성자 검색..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className={styles.filterGroup}>
          <div className={styles.selectBox}>
            <Filter size={16} />
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value as any)}
            >
              <option value="ALL">모든 상태</option>
              <option value="PUBLISHED">공개됨</option>
              <option value="DRAFT">임시저장</option>
            </select>
          </div>
        </div>
      </section>

      {/* Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>제목</th>
              <th>작성자</th>
              <th>작성일</th>
              <th>조회수</th>
              <th>상태</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {filteredPosts.map((post) => (
              <tr key={post.id}>
                <td>{post.id}</td>
                <td className={styles.postTitle}>{post.title}</td>
                <td>{post.authorNickname}</td>
                <td>{post.createdAt}</td>
                <td>{post.viewCount}</td>
                <td>
                  <span className={`${styles.statusBadge} ${post.status === 'PUBLISHED' ? styles.statusPublished : styles.statusDraft}`}>
                    {post.status === 'PUBLISHED' ? '공개됨' : '임시저장'}
                  </span>
                </td>
                <td>
                  <button className={styles.detailBtn} onClick={() => alert('상세 페이지로 이동합니다 (준비중)')}>
                    <ExternalLink size={16} />
                    보기
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredPosts.length === 0 && (
          <div className={styles.empty}>
            검색 결과가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
