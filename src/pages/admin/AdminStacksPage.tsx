import { useState } from "react";
import { Plus, Pencil, Trash2, Layers, X } from "lucide-react";
import { useStacksQuery } from "@/api/stack/queries";
import {
  useCreateStackMutation,
  useUpdateStackMutation,
  useDeleteStackMutation,
} from "@/api/stack/mutations";
import { STACK_GROUP_LABELS, STACK_GROUP_ORDER } from "@/api/stack/types";
import type { StackResponse } from "@/api/stack/types";
import styles from "./AdminStacksPage.module.css";

export const AdminStacksPage = () => {
  // 스택 목록 조회
  const { data: stacks, isLoading } = useStacksQuery();

  // Mutations
  const createMutation = useCreateStackMutation();
  const updateMutation = useUpdateStackMutation();
  const deleteMutation = useDeleteStackMutation();

  // 생성 폼 상태
  const [newName, setNewName] = useState("");
  const [newGroup, setNewGroup] = useState("");

  // 수정 모달 상태
  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    stack: StackResponse | null;
  }>({ isOpen: false, stack: null });
  const [editName, setEditName] = useState("");
  const [editGroup, setEditGroup] = useState("");

  // 스택 생성
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newGroup) return;

    try {
      await createMutation.mutateAsync({
        name: newName.trim(),
        stackGroup: newGroup,
      });
      setNewName("");
      setNewGroup("");
    } catch (error) {
      // 에러는 전역 핸들러에서 처리
    }
  };

  // 수정 모달 열기
  const openEditModal = (stack: StackResponse) => {
    setEditModal({ isOpen: true, stack });
    setEditName(stack.name);
    setEditGroup(stack.stackGroup);
  };

  // 수정 모달 닫기
  const closeEditModal = () => {
    setEditModal({ isOpen: false, stack: null });
    setEditName("");
    setEditGroup("");
  };

  // 스택 수정
  const handleUpdate = async () => {
    if (!editModal.stack || !editName.trim() || !editGroup) return;

    try {
      await updateMutation.mutateAsync({
        stackId: editModal.stack.id,
        request: {
          name: editName.trim(),
          stackGroup: editGroup,
        },
      });
      closeEditModal();
    } catch (error) {
      // 에러는 전역 핸들러에서 처리
    }
  };

  // 스택 삭제
  const handleDelete = async (stackId: number, stackName: string) => {
    if (!window.confirm(`"${stackName}" 스택을 삭제하시겠습니까?`)) return;

    try {
      await deleteMutation.mutateAsync(stackId);
    } catch (error) {
      // 에러는 전역 핸들러에서 처리
    }
  };

  return (
    <div>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>스택 관리</h1>
        <p className={styles.description}>
          게시글에 사용되는 기술 스택을 관리합니다.
        </p>
      </div>

      {/* Create Form */}
      <form className={styles.createForm} onSubmit={handleCreate}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>그룹</label>
          <select
            className={styles.select}
            value={newGroup}
            onChange={(e) => setNewGroup(e.target.value)}
          >
            <option value="">그룹 선택</option>
            {STACK_GROUP_ORDER.map((group) => (
              <option key={group} value={group.toLowerCase()}>
                {STACK_GROUP_LABELS[group]}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>스택 이름</label>
          <input
            type="text"
            className={styles.input}
            placeholder="예: React, Spring Boot"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className={styles.createButton}
          disabled={!newName.trim() || !newGroup || createMutation.isPending}
        >
          <Plus size={18} />
          생성
        </button>
      </form>

      {/* Table */}
      <div className={styles.tableContainer}>
        {isLoading ? (
          <div className={styles.loading}>로딩 중...</div>
        ) : !stacks || stacks.length === 0 ? (
          <div className={styles.emptyState}>
            <Layers size={48} className={styles.emptyIcon} />
            <p className={styles.emptyText}>등록된 스택이 없습니다.</p>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>스택 이름</th>
                <th>그룹</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {stacks.map((stack) => (
                <tr key={stack.id}>
                  <td>{stack.id}</td>
                  <td className={styles.stackName}>{stack.name}</td>
                  <td>
                    <span className={styles.groupBadge}>
                      {STACK_GROUP_LABELS[stack.stackGroup] || stack.stackGroup}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        className={styles.actionButton}
                        onClick={() => openEditModal(stack)}
                        title="수정"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        className={`${styles.actionButton} ${styles.danger}`}
                        onClick={() => handleDelete(stack.id, stack.name)}
                        title="삭제"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit Modal */}
      {editModal.isOpen && (
        <div className={styles.modalOverlay} onClick={closeEditModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>스택 수정</h2>
              <button className={styles.modalClose} onClick={closeEditModal}>
                <X size={20} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>스택 이름</label>
                <input
                  type="text"
                  className={styles.input}
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>그룹</label>
                <select
                  className={styles.select}
                  value={editGroup}
                  onChange={(e) => setEditGroup(e.target.value)}
                >
                  <option value="">그룹 선택</option>
                  {STACK_GROUP_ORDER.map((group) => (
                    <option key={group} value={group}>
                      {STACK_GROUP_LABELS[group]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.cancelButton} onClick={closeEditModal}>
                취소
              </button>
              <button
                className={styles.saveButton}
                onClick={handleUpdate}
                disabled={
                  !editName.trim() || !editGroup || updateMutation.isPending
                }
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
