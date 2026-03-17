import { useState, useMemo } from 'react';
import { Search, Filter, UserCog, UserPlus } from 'lucide-react';
import styles from './AdminUserPage.module.css';
import { useCreateUserMutation } from '../../services/user/user.mutations';

// Mock Data
interface User {
  id: number;
  email: string;
  name: string;
  nickname: string;
  role: 'USER' | 'ADMIN';
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

const MOCK_USERS: User[] = [
  { id: 1, email: 'admin@sealog.dev', name: '관리자', nickname: 'admin', role: 'ADMIN', status: 'ACTIVE', createdAt: '2024-01-01' },
  { id: 2, email: 'user1@example.com', name: '홍길동', nickname: '길동이', role: 'USER', status: 'ACTIVE', createdAt: '2024-02-15' },
  { id: 3, email: 'user2@example.com', name: '이순신', nickname: '장군님', role: 'USER', status: 'INACTIVE', createdAt: '2024-03-10' },
  { id: 4, email: 'test@test.com', name: '테스터', nickname: 'testuser', role: 'USER', status: 'ACTIVE', createdAt: '2024-03-12' },
];

export default function AdminUserPage() {
  const [users] = useState<User[]>(MOCK_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Filters
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch = 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.nickname.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'ALL' || user.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [users, searchQuery, statusFilter]);

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleCreateClick = () => {
    setIsCreateModalOpen(true);
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerTitle}>
          <h1 className={styles.title}>유저 관리</h1>
          <p className={styles.subtitle}>전체 사용자 목록을 관리하고 새 사용자를 추가합니다.</p>
        </div>
        <button className={styles.createBtn} onClick={handleCreateClick}>
          <UserPlus size={18} />
          <span>사용자 추가</span>
        </button>
      </header>

      {/* Filters */}
      <section className={styles.filters}>
        <div className={styles.searchBox}>
          <Search size={18} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="이름, 이메일, 닉네임 검색..." 
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
              <option value="ACTIVE">활성</option>
              <option value="INACTIVE">비활성</option>
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
              <th>이름 / 닉네임</th>
              <th>이메일</th>
              <th>가입일</th>
              <th>상태</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>
                  <div className={styles.userInfo}>
                    <span className={styles.userName}>{user.name}</span>
                    <span className={styles.userNickname}>@{user.nickname}</span>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>{user.createdAt}</td>
                <td>
                  <span className={`${styles.statusBadge} ${user.status === 'ACTIVE' ? styles.statusActive : styles.statusInactive}`}>
                    {user.status === 'ACTIVE' ? '활성' : '비활성'}
                  </span>
                </td>
                <td>
                  <button className={styles.editBtn} onClick={() => handleEditClick(user)}>
                    <UserCog size={16} />
                    수정
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && (
          <div className={styles.empty}>
            검색 결과가 없습니다.
          </div>
        )}
      </div>

      {/* Modals placeholders */}
      {isCreateModalOpen && (
        <UserCreateModal onClose={() => setIsCreateModalOpen(false)} />
      )}
      {isEditModalOpen && selectedUser && (
        <UserEditModal 
          user={selectedUser} 
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedUser(null);
          }} 
        />
      )}
    </div>
  );
}

// Sub-components for Modals
function UserCreateModal({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({ email: '', password: '', name: '', nickname: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { mutate: createUser, isPending } = useCreateUserMutation();

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (formData.email.length > 50) {
      newErrors.email = '이메일은 최대 50자까지 입력 가능합니다.';
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else if (formData.password.length < 8 || formData.password.length >= 20) {
      newErrors.password = '비밀번호는 8자 이상 20자 미만으로 입력해주세요.';
    }

    if (!formData.name) {
      newErrors.name = '이름을 입력해주세요.';
    } else if (formData.name.length < 2 || formData.name.length >= 20) {
      newErrors.name = '이름은 2자 이상 20자 미만으로 입력해주세요.';
    }

    if (!formData.nickname) {
      newErrors.nickname = '닉네임을 입력해주세요.';
    } else if (formData.nickname.length < 2 || formData.nickname.length >= 20) {
      newErrors.nickname = '닉네임은 2자 이상 20자 미만으로 입력해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    createUser(formData, {
      onSuccess: () => onClose(),
    });
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.modalTitle}>사용자 생성</h2>
        <form className={styles.modalForm} onSubmit={handleSubmit}>
          <div className={styles.formField}>
            <label>이름</label>
            <input
              type="text"
              placeholder="이름 입력 (2자 이상 20자 미만)"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            {errors.name && <span className={styles.fieldError}>{errors.name}</span>}
          </div>
          <div className={styles.formField}>
            <label>닉네임</label>
            <input
              type="text"
              placeholder="닉네임 입력 (2자 이상 20자 미만)"
              value={formData.nickname}
              onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
            />
            {errors.nickname && <span className={styles.fieldError}>{errors.nickname}</span>}
          </div>
          <div className={styles.formField}>
            <label>이메일</label>
            <input
              type="email"
              placeholder="이메일 입력 (최대 50자)"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            {errors.email && <span className={styles.fieldError}>{errors.email}</span>}
          </div>
          <div className={styles.formField}>
            <label>비밀번호</label>
            <input
              type="password"
              placeholder="비밀번호 입력 (8자 이상 20자 미만)"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            {errors.password && <span className={styles.fieldError}>{errors.password}</span>}
          </div>
          <div className={styles.modalActions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose} disabled={isPending}>취소</button>
            <button type="submit" className={styles.confirmBtn} disabled={isPending}>
              {isPending ? '생성 중...' : '생성하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function UserEditModal({ user, onClose }: { user: User; onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: user.name,
    nickname: user.nickname,
    email: user.email,
    status: user.status,
  });

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.modalTitle}>사용자 정보 수정</h2>
        <form className={styles.modalForm} onSubmit={(e) => { e.preventDefault(); onClose(); }}>
          <div className={styles.formField}>
            <label>이름</label>
            <input 
              type="text" 
              value={formData.name} 
              onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
            />
          </div>
          <div className={styles.formField}>
            <label>닉네임</label>
            <input 
              type="text" 
              value={formData.nickname} 
              onChange={(e) => setFormData({ ...formData, nickname: e.target.value })} 
            />
          </div>
          <div className={styles.formField}>
            <label>이메일</label>
            <input 
              type="email" 
              value={formData.email} 
              onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
            />
          </div>
          <div className={styles.formField}>
            <label>상태</label>
            <select 
              value={formData.status} 
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            >
              <option value="ACTIVE">활성</option>
              <option value="INACTIVE">비활성</option>
            </select>
          </div>
          <div className={styles.modalActions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>취소</button>
            <button type="submit" className={styles.confirmBtn}>수정 완료</button>
          </div>
        </form>
      </div>
    </div>
  );
}
