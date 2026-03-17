import { useState } from 'react';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';
import { 
  useAdminStackListQuery 
} from '../../services/stack/stack.queries';
import {
  useDeleteStackMutation,
  useCreateStackMutation,
  useUpdateStackMutation, 
} from '../../services/stack/stack.mutations';
import type { StackGroup } from '../../services/stack/types/stack.enum';
import styles from './AdminStackPage.module.css';

const STACK_GROUPS: StackGroup[] = [
  'LANGUAGE', 'FRAMEWORK', 'LIBRARY', 'DATABASE', 'DEVOPS', 'KNOWLEDGE', 'TOOL', 'ETC'
];

export default function AdminStackPage() {
  const [keyword, setKeyword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStack, setEditingStack] = useState<{ id: number; name: string; stackGroup: StackGroup } | null>(null);

  const { data, isLoading } = useAdminStackListQuery({ keyword, size: 100 });
  const deleteMutation = useDeleteStackMutation();

  const handleCreate = () => {
    setEditingStack(null);
    setIsModalOpen(true);
  };

  const handleEdit = (stack: { id: number; name: string; stackGroup: StackGroup }) => {
    setEditingStack(stack);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('정말 이 스택을 삭제하시겠습니까?')) return;
    try {
      await deleteMutation.mutateAsync(id);
    } catch (e) {
      // Error handled by interceptor
    }
  };

  const stacks = data?.content ?? [];

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerTitle}>
          <h1 className={styles.title}>스택 관리</h1>
          <p className={styles.subtitle}>게시글에서 사용되는 기술 스택들을 관리합니다.</p>
        </div>
        <button className={styles.createBtn} onClick={handleCreate}>
          <Plus size={18} />
          <span>스택 추가</span>
        </button>
      </header>

      {/* Filters */}
      <section className={styles.filters}>
        <div className={styles.searchBox}>
          <Search size={18} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="스택 이름 검색..." 
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
      </section>

      {/* Grid or Table */}
      <div className={styles.stackGrid}>
        {isLoading ? (
          <div className={styles.loading}>로딩 중...</div>
        ) : stacks.length > 0 ? (
          stacks.map((stack) => (
            <div key={stack.id} className={styles.stackCard}>
              <div className={styles.stackInfo}>
                <div className={styles.stackGroupBadge}>{stack.stackGroup}</div>
                <h3 className={styles.stackName}>{stack.name}</h3>
              </div>
              <div className={styles.stackActions}>
                <button className={styles.iconBtn} onClick={() => handleEdit(stack)} title="수정">
                  <Edit2 size={14} />
                </button>
                <button className={`${styles.iconBtn} ${styles.danger}`} onClick={() => handleDelete(stack.id)} title="삭제">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.empty}>등록된 스택이 없습니다.</div>
        )}
      </div>

      {isModalOpen && (
        <StackModal 
          editingStack={editingStack} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => {
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

function StackModal({ 
  editingStack, 
  onClose, 
  onSuccess 
}: { 
  editingStack: { id: number; name: string; stackGroup: StackGroup } | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [name, setName] = useState(editingStack?.name ?? '');
  const [group, setGroup] = useState<StackGroup>(editingStack?.stackGroup ?? 'LANGUAGE');
  
  const createMutation = useCreateStackMutation();
  const updateMutation = useUpdateStackMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      if (editingStack) {
        await updateMutation.mutateAsync({
          stackId: editingStack.id,
          request: { name, stackGroup: group }
        });
      } else {
        await createMutation.mutateAsync({ name, stackGroup: group });
      }
      onSuccess();
    } catch (e) {
      // Error handled by interceptor
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.modalTitle}>{editingStack ? '스택 수정' : '스택 추가'}</h2>
        <form className={styles.modalForm} onSubmit={handleSubmit}>
          <div className={styles.formField}>
            <label>스택 이름</label>
            <input 
              type="text" 
              placeholder="예: React, Java, AWS" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              autoFocus
              required
            />
          </div>
          <div className={styles.formField}>
            <label>그룹</label>
            <select 
              value={group} 
              onChange={(e) => setGroup(e.target.value as StackGroup)}
            >
              {STACK_GROUPS.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
          <div className={styles.modalActions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>취소</button>
            <button 
              type="submit" 
              className={styles.confirmBtn}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {editingStack ? '수정 완료' : '추가하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
