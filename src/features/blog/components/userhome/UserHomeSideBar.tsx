import { useState } from 'react';
import {
  Code2,
  Layers,
  Package,
  Database,
  GitBranch,
  BookOpen,
  Wrench,
  MoreHorizontal,
  ChevronDown,
  Search,
  X,
  BookMarked,
} from 'lucide-react';
import type { SidebarStackGroup } from '../../types/userProfile';
import type { StackGroup } from '../../../../services/stack/_types/stack.enum';
import styles from './UserHomeSideBar.module.css';

const GROUP_META: Record<StackGroup, { icon: React.ElementType; label: string }> = {
  LANGUAGE: { icon: Code2, label: 'Language' },
  FRAMEWORK: { icon: Layers, label: 'Framework' },
  LIBRARY: { icon: Package, label: 'Library' },
  DATABASE: { icon: Database, label: 'Database' },
  DEVOPS: { icon: GitBranch, label: 'DevOps' },
  KNOWLEDGE: { icon: BookOpen, label: 'Knowledge' },
  TOOL: { icon: Wrench, label: 'Tool' },
  ETC: { icon: MoreHorizontal, label: 'ETC' },
};

interface UserHomeSideBarProps {
  isOpen: boolean;
  onToggle: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortedGroupedStacks: SidebarStackGroup[];
  activeStack: string;
  onStackClick: (name: string) => void;
  activeSeries: { id: number; name: string } | null;
  onSeriesClick: (item: { id: number; name: string }) => void;
  sidebarSeries: { id: number; name: string; count: number }[];
}

export default function UserHomeSideBar({
  isOpen,
  onToggle,
  searchQuery,
  onSearchChange,
  sortedGroupedStacks,
  activeStack,
  onStackClick,
  activeSeries,
  onSeriesClick,
  sidebarSeries,
}: UserHomeSideBarProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<StackGroup>>(new Set());

  const toggleGroup = (group: StackGroup) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(group)) next.delete(group);
      else next.add(group);
      return next;
    });
  };

  return (
    <>
      <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`} aria-label="블로그 필터">
        {/* Search */}
        <div className={styles.searchWrap}>
          <div className={styles.search}>
            <Search size={13} className={styles.searchIcon} aria-hidden="true" />
            <input
              type="text"
              placeholder="이 블로그에서 검색..."
              aria-label="블로그 내 검색"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            {searchQuery && (
              <button
                className={styles.searchClear}
                type="button"
                onClick={() => onSearchChange('')}
                aria-label="검색어 지우기"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Stacks */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>스택</h3>

          {sortedGroupedStacks.map(({ group, stacks }) => {
            const { icon: Icon, label } = GROUP_META[group];
            const isExpanded = expandedGroups.has(group);
            const hasActiveStack = !activeSeries && stacks.some((s) => s.name === activeStack);

            return (
              <div key={group} className={styles.group}>
                <button
                  type="button"
                  className={`${styles.groupHeader} ${hasActiveStack ? styles.groupHeaderHasActive : ''}`}
                  onClick={() => toggleGroup(group)}
                  aria-expanded={isExpanded}
                >
                  <span className={styles.groupLeft}>
                    <Icon size={14} className={styles.groupIcon} />
                    <span className={styles.groupName}>{label}</span>
                  </span>
                  <ChevronDown
                    size={13}
                    className={`${styles.groupChevron} ${isExpanded ? styles.groupChevronOpen : ''}`}
                  />
                </button>

                {isExpanded && (
                  <ul className={styles.groupList}>
                    {stacks.map((stack) => (
                      <li key={stack.name}>
                        <button
                          type="button"
                          className={`${styles.stackItem} ${activeStack === stack.name && !activeSeries ? styles.stackItemActive : ''}`}
                          onClick={() => onStackClick(stack.name)}
                        >
                          <span className={styles.stackItemName}>{stack.name}</span>
                          <span className={styles.stackItemCount}>{stack.count}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </section>

        {/* Series */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>시리즈</h3>
          <ul className={styles.seriesList}>
            {sidebarSeries.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className={`${styles.seriesItem} ${activeSeries?.id === item.id ? styles.seriesItemActive : ''}`}
                  onClick={() => onSeriesClick(item)}
                >
                  <BookMarked size={13} className={styles.seriesItemIcon} />
                  <span className={styles.seriesItemName}>{item.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      </aside>

      {/* Sidebar Tab Button */}
      <button
        className={`${styles.sidebarTab} ${isOpen ? styles.sidebarTabOpen : ''}`}
        onClick={onToggle}
        aria-label={isOpen ? '사이드바 닫기' : '사이드바 열기'}
        aria-expanded={isOpen}
      >
        <span className={styles.sidebarTabText}>Menu</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div className={styles.sidebarOverlay} onClick={onToggle} aria-hidden="true" />
      )}
    </>
  );
}
