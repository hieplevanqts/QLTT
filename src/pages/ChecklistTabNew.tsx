import React, { useState } from 'react';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  FileDown,
  Check,
  XCircle,
  CheckSquare,
} from 'lucide-react';
import styles from './AdminPage.module.css';
import { Pagination, usePagination } from '../components/Pagination';
import { toast } from 'sonner';

interface Checklist {
  id: string;
  code: string;
  name: string;
  topic: string;
  itemCount: number;
  status: 'active' | 'inactive';
  createdAt: string;
  createdBy: string;
  formTemplateId?: string;
}

interface ChecklistTabNewProps {
  checklists: Checklist[];
  onOpenModal: (type: 'add' | 'edit' | 'view' | 'delete', item?: any, subTab?: string) => void;
}

export const ChecklistTabNew: React.FC<ChecklistTabNewProps> = ({ checklists, onOpenModal }) => {
  return (
    <div className={styles.tabContentInner}>
      <ChecklistsContent checklists={checklists} onOpenModal={onOpenModal} />
    </div>
  );
};

// ============================================
// CHECKLIST CONTENT
// ============================================
const ChecklistsContent: React.FC<{
  checklists: Checklist[];
  onOpenModal: (type: 'add' | 'edit' | 'view' | 'delete', item?: any, subTab?: string) => void;
}> = ({ checklists = [], onOpenModal }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTopic, setFilterTopic] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Filter data with defensive check
  const filteredData = (checklists || []).filter((item) => {
    const matchSearch =
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.topic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTopic = filterTopic === 'all' || item.topic === filterTopic;
    const matchStatus = filterStatus === 'all' || item.status === filterStatus;
    return matchSearch && matchTopic && matchStatus;
  });

  // Pagination
  const { currentPage, itemsPerPage, paginatedData, totalPages, handlePageChange, handleItemsPerPageChange } =
    usePagination(filteredData, 15);

  // Get unique topics
  const topics = Array.from(new Set((checklists || []).map((item) => item.topic)));

  return (
    <>
      {/* Filters & Actions Row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 'var(--spacing-4, 16px)',
        padding: 'var(--spacing-4, 16px)',
        background: 'var(--card, #ffffff)',
        borderRadius: 'var(--radius-md, 8px)',
        border: '1px solid var(--border, #d0d5dd)',
        marginBottom: 'var(--spacing-4, 16px)',
      }}>
        {/* Left: Search */}
        <div style={{
          position: 'relative',
          flex: '1',
          maxWidth: '400px',
        }}>
          <Search size={18} style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--muted-foreground, #667085)',
          }} />
          <input
            type="text"
            placeholder="Tìm theo mã, tên, chuyên đề..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              height: '43px',
              paddingLeft: '40px',
              paddingRight: 'var(--spacing-3, 12px)',
              fontFamily: 'Inter, sans-serif',
              fontSize: 'var(--text-sm, 14px)',
              color: 'var(--foreground, #101828)',
              background: 'var(--background, #f9fafb)',
              border: '1px solid var(--border, #d0d5dd)',
              borderRadius: 'var(--radius-md, 8px)',
              outline: 'none',
            }}
          />
        </div>

        {/* Middle: Filters */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-3, 12px)',
        }}>
          <select
            value={filterTopic}
            onChange={(e) => setFilterTopic(e.target.value)}
            style={{
              height: '43px',
              padding: '0 var(--spacing-3, 12px)',
              fontFamily: 'Inter, sans-serif',
              fontSize: 'var(--text-sm, 14px)',
              color: 'var(--foreground, #101828)',
              background: 'var(--background, #f9fafb)',
              border: '1px solid var(--border, #d0d5dd)',
              borderRadius: 'var(--radius-md, 8px)',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="all">Tất cả chuyên đề</option>
            {topics.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              height: '43px',
              padding: '0 var(--spacing-3, 12px)',
              fontFamily: 'Inter, sans-serif',
              fontSize: 'var(--text-sm, 14px)',
              color: 'var(--foreground, #101828)',
              background: 'var(--background, #f9fafb)',
              border: '1px solid var(--border, #d0d5dd)',
              borderRadius: 'var(--radius-md, 8px)',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Không hoạt động</option>
          </select>
        </div>

        {/* Right: Actions */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-2, 8px)',
        }}>
          <button
            onClick={() => window.location.reload()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-2, 8px)',
              height: '43px',
              padding: '0 var(--spacing-4, 16px)',
              fontFamily: 'Inter, sans-serif',
              fontSize: 'var(--text-sm, 14px)',
              fontWeight: 500,
              color: 'var(--foreground, #101828)',
              background: 'var(--card, #ffffff)',
              border: '1px solid var(--border, #d0d5dd)',
              borderRadius: 'var(--radius-md, 8px)',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--muted, #f2f4f7)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--card, #ffffff)';
            }}
          >
            <RefreshCw size={18} />
            Làm mới
          </button>

          <button
            onClick={() => toast.info('Chức năng xuất Excel đang phát triển')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-2, 8px)',
              height: '43px',
              padding: '0 var(--spacing-4, 16px)',
              fontFamily: 'Inter, sans-serif',
              fontSize: 'var(--text-sm, 14px)',
              fontWeight: 500,
              color: 'var(--foreground, #101828)',
              background: 'var(--card, #ffffff)',
              border: '1px solid var(--border, #d0d5dd)',
              borderRadius: 'var(--radius-md, 8px)',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--muted, #f2f4f7)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--card, #ffffff)';
            }}
          >
            <FileDown size={18} />
            Xuất Excel
          </button>

          <button
            onClick={() => onOpenModal('add', null, 'checklist')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-2, 8px)',
              height: '43px',
              padding: '0 var(--spacing-4, 16px)',
              fontFamily: 'Inter, sans-serif',
              fontSize: 'var(--text-sm, 14px)',
              fontWeight: 500,
              color: 'var(--primary-foreground, #ffffff)',
              background: 'var(--primary, #005cb6)',
              border: 'none',
              borderRadius: 'var(--radius-md, 8px)',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
          >
            <Plus size={18} />
            Thêm Checklist
          </button>
        </div>
      </div>

      {/* Table */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Mã</th>
              <th>Tên checklist</th>
              <th>Chuyên đề</th>
              <th>Số tiêu chí</th>
              <th>Trạng thái</th>
              <th className={styles.actionCol}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={6} className={styles.emptyState}>
                  <CheckSquare size={48} strokeWidth={1} />
                  <p>Không tìm thấy checklist nào</p>
                </td>
              </tr>
            ) : (
              paginatedData.map((item) => (
                <tr key={item.id}>
                  <td>
                    <code className={styles.code}>{item.code}</code>
                  </td>
                  <td>
                    <strong>{item.name}</strong>
                  </td>
                  <td>{item.topic}</td>
                  <td>{item.itemCount}</td>
                  <td>
                    {item.status === 'active' ? (
                      <span className={styles.statusActive}>
                        <Check size={12} /> Hoạt động
                      </span>
                    ) : (
                      <span className={styles.statusInactive}>
                        <XCircle size={12} /> Không hoạt động
                      </span>
                    )}
                  </td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button
                        className={styles.iconBtn}
                        title="Xem"
                        onClick={() => onOpenModal('view', item, 'checklist')}
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className={styles.iconBtn}
                        title="Sửa"
                        onClick={() => onOpenModal('edit', item, 'checklist')}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className={styles.iconBtn}
                        title="Xóa"
                        onClick={() => onOpenModal('delete', item, 'checklist')}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredData.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredData.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      )}
    </>
  );
};