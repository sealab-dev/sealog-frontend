import { useState } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, ChevronDown, ChevronUp } from 'lucide-react';
import { useMySeriesListQuery, useMySeriesPostsQuery } from '../../services/series/series.queries';
import {
  useCreateSeriesMutation,
  useUpdateSeriesMutation,
  useDeleteSeriesMutation,
  useShowSeriesMutation,
  useHideSeriesMutation,
} from '../../services/series/series.mutations';
import type { MySeriesItem } from '../../services/series/types/series.response';
import styles from './MySeriesPage.module.css';

/* ── Series Form Modal ── */
interface SeriesFormModalProps {
  mode: 'create' | 'edit';
  initial?: string;
  onSubmit: (name: string) => void;
  onClose: () => void;
  isPending: boolean;
}

function SeriesFormModal({ mode, initial = '', onSubmit, onClose, isPending }: SeriesFormModalProps) {
  const [name, setName] = useState(initial);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit(name.trim());
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.modalTitle}>{mode === 'create' ? '시리즈 만들기' : '시리즈 이름 수정'}</h3>
        <form onSubmit={handleSubmit}>
          <input
            className={styles.modalInput}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="시리즈 이름"
            autoFocus
          />
          <div className={styles.modalActions}>
            <button type="button" className={styles.modalCancelBtn} onClick={onClose}>
              취소
            </button>
            <button type="submit" className={styles.modalSubmitBtn} disabled={!name.trim() || isPending}>
              {isPending ? '처리 중...' : mode === 'create' ? '만들기' : '수정'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Series Posts (expandable) ── */
function SeriesPosts({ slug }: { slug: string }) {
  const { data, isPending } = useMySeriesPostsQuery(slug);
  const posts = data?.content ?? [];

  if (isPending) return <p className={styles.postsEmpty}>불러오는 중...</p>;
  if (posts.length === 0) return <p className={styles.postsEmpty}>등록된 게시글이 없습니다.</p>;

  return (
    <ul className={styles.postsList}>
      {posts.map((post) => (
        <li key={post.id} className={styles.postsItem}>
          <span className={`${styles.postStatus} ${post.status === 'PUBLISHED' ? styles.postPublished : post.status === 'DRAFT' ? styles.postDraft : styles.postPrivate}`}>
            {post.status === 'PUBLISHED' ? '공개' : post.status === 'DRAFT' ? '임시' : '비공개'}
          </span>
          <span className={styles.postsItemTitle}>{post.title}</span>
          <span className={styles.postsItemDate}>{new Date(post.createdAt).toLocaleDateString('ko-KR')}</span>
        </li>
      ))}
    </ul>
  );
}

/* ── Series Row ── */
interface SeriesRowProps {
  series: MySeriesItem;
  onEdit: (series: MySeriesItem) => void;
  onDelete: (series: MySeriesItem) => void;
  onTogglePublic: (series: MySeriesItem) => void;
  isTogglePending: boolean;
  isDeletePending: boolean;
}

function SeriesRow({ series, onEdit, onDelete, onTogglePublic, isTogglePending, isDeletePending }: SeriesRowProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <li className={styles.seriesItem}>
      <div className={styles.seriesRow}>
        <div className={styles.seriesMain}>
          <button
            className={styles.seriesExpandBtn}
            onClick={() => setExpanded((v) => !v)}
            title={expanded ? '접기' : '게시글 보기'}
          >
            {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
          <span className={`${styles.visibilityBadge} ${series.isPublic ? styles.visibilityPublic : styles.visibilityPrivate}`}>
            {series.isPublic ? '공개' : '비공개'}
          </span>
          <span className={styles.seriesName}>{series.name}</span>
        </div>
        <div className={styles.seriesActions}>
          <button
            className={styles.actionBtn}
            title={series.isPublic ? '비공개로 전환' : '공개로 전환'}
            onClick={() => onTogglePublic(series)}
            disabled={isTogglePending}
          >
            {series.isPublic ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
          <button
            className={styles.actionBtn}
            title="수정"
            onClick={() => onEdit(series)}
          >
            <Edit2 size={15} />
          </button>
          <button
            className={`${styles.actionBtn} ${styles.actionBtnDelete}`}
            title="삭제"
            onClick={() => onDelete(series)}
            disabled={isDeletePending}
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
      {expanded && (
        <div className={styles.seriesPostsWrap}>
          <SeriesPosts slug={series.slug} />
        </div>
      )}
    </li>
  );
}

/* ── Delete Confirm Modal ── */
interface DeleteConfirmProps {
  series: MySeriesItem;
  onConfirm: () => void;
  onClose: () => void;
  isPending: boolean;
}

function DeleteConfirmModal({ series, onConfirm, onClose, isPending }: DeleteConfirmProps) {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.modalTitle}>시리즈 삭제</h3>
        <p className={styles.modalDesc}>
          <strong>{series.name}</strong> 시리즈를 삭제하시겠습니까?<br />
          시리즈에 속한 게시글은 삭제되지 않습니다.
        </p>
        <div className={styles.modalActions}>
          <button type="button" className={styles.modalCancelBtn} onClick={onClose}>
            취소
          </button>
          <button type="button" className={styles.modalDeleteBtn} onClick={onConfirm} disabled={isPending}>
            {isPending ? '삭제 중...' : '삭제'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ── */
export default function MySeriesPage() {
  const { data, isPending } = useMySeriesListQuery();
  const seriesList = data?.content ?? [];

  const createSeries = useCreateSeriesMutation();
  const updateSeries = useUpdateSeriesMutation();
  const deleteSeries = useDeleteSeriesMutation();
  const showSeries = useShowSeriesMutation();
  const hideSeries = useHideSeriesMutation();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editTarget, setEditTarget] = useState<MySeriesItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MySeriesItem | null>(null);

  const handleCreate = async (name: string) => {
    await createSeries.mutateAsync({ name });
    setShowCreateModal(false);
  };

  const handleEdit = async (name: string) => {
    if (!editTarget) return;
    await updateSeries.mutateAsync({ seriesId: editTarget.id, request: { name } });
    setEditTarget(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteSeries.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
  };

  const handleTogglePublic = (series: MySeriesItem) => {
    if (series.isPublic) {
      hideSeries.mutate(series.id);
    } else {
      showSeries.mutate(series.id);
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <div className={styles.headerRow}>
          <div>
            <h1 className={styles.pageTitle}>내 시리즈</h1>
            <p className={styles.pageSubtitle}>시리즈를 만들고 게시글을 묶어 관리하세요.</p>
          </div>
          <button className={styles.createBtn} onClick={() => setShowCreateModal(true)}>
            <Plus size={15} />
            시리즈 만들기
          </button>
        </div>
      </header>

      <div className={styles.card}>
        {isPending ? (
          <p className={styles.empty}>불러오는 중...</p>
        ) : seriesList.length === 0 ? (
          <p className={styles.empty}>시리즈가 없습니다. 새 시리즈를 만들어보세요.</p>
        ) : (
          <ul className={styles.seriesList}>
            {seriesList.map((series) => (
              <SeriesRow
                key={series.id}
                series={series}
                onEdit={setEditTarget}
                onDelete={setDeleteTarget}
                onTogglePublic={handleTogglePublic}
                isTogglePending={showSeries.isPending || hideSeries.isPending}
                isDeletePending={deleteSeries.isPending}
              />
            ))}
          </ul>
        )}
      </div>

      {showCreateModal && (
        <SeriesFormModal
          mode="create"
          onSubmit={handleCreate}
          onClose={() => setShowCreateModal(false)}
          isPending={createSeries.isPending}
        />
      )}

      {editTarget && (
        <SeriesFormModal
          mode="edit"
          initial={editTarget.name}
          onSubmit={handleEdit}
          onClose={() => setEditTarget(null)}
          isPending={updateSeries.isPending}
        />
      )}

      {deleteTarget && (
        <DeleteConfirmModal
          series={deleteTarget}
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
          isPending={deleteSeries.isPending}
        />
      )}
    </div>
  );
}
