/**
 * NOTIFICATIONS PAGE - Mẫu thông báo
 * Permission: sa.sysconfig.notify.read
 */

import React, { useState, useMemo } from 'react';
import { Search, Bell, Edit, Eye } from 'lucide-react';
import { PermissionGate, ModuleShell, EmptyState, usePermissions } from '../../_shared';
import { MOCK_NOTIFICATION_TEMPLATES } from '../mock-data';
import type { NotificationTemplate } from '../types';
import styles from './SystemConfigPages.module.css';

export default function NotificationsPage() {
  const { hasPermission } = usePermissions();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const canUpdate = hasPermission('sa.sysconfig.notify.update');
  const canCreate = hasPermission('sa.sysconfig.notify.create');

  const types: NotificationTemplate['type'][] = ['email', 'sms', 'in-app', 'push'];

  const filteredData = useMemo(() => {
    return MOCK_NOTIFICATION_TEMPLATES.filter(template => {
      if (typeFilter !== 'all' && template.type !== typeFilter) {
        return false;
      }
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        template.code.toLowerCase().includes(query) ||
        template.name.toLowerCase().includes(query) ||
        template.subject.toLowerCase().includes(query)
      );
    });
  }, [searchQuery, typeFilter]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getTypeLabel = (type: NotificationTemplate['type']) => {
    const labels: Record<NotificationTemplate['type'], string> = {
      email: 'Email',
      sms: 'SMS',
      'in-app': 'In-App',
      push: 'Push'
    };
    return labels[type];
  };

  return (
    <PermissionGate permission="sa.sysconfig.notify.read">
      <ModuleShell
        title="Mẫu Thông báo"
        subtitle="Quản lý mẫu thông báo và email template"
        breadcrumbs={[
          { label: 'Trang chủ', path: '/' },
          { label: 'Quản trị hệ thống', path: '/system-admin' },
          { label: 'Cấu hình', path: '/system-admin/system-config' },
          { label: 'Thông báo' }
        ]}
        actions={
          <button className={styles.buttonPrimary} disabled={!canCreate}>
            <Bell size={18} />
            Thêm mẫu
          </button>
        }
      >
        <div className={styles.toolbar}>
          <div className={styles.searchBox}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Tìm theo mã, tên, tiêu đề..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          
          <div className={styles.filters}>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">Tất cả loại</option>
              {types.map(type => (
                <option key={type} value={type}>{getTypeLabel(type)}</option>
              ))}
            </select>
          </div>

          <div className={styles.stats}>
            <span className={styles.statsText}>
              Tổng: <strong>{filteredData.length}</strong> mẫu
            </span>
          </div>
        </div>

        {paginatedData.length === 0 ? (
          <EmptyState
            icon={<Bell size={48} />}
            title="Không tìm thấy mẫu thông báo"
            message="Không có mẫu thông báo nào phù hợp với tiêu chí tìm kiếm."
          />
        ) : (
          <>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Mã mẫu</th>
                    <th>Tên mẫu</th>
                    <th>Loại</th>
                    <th>Danh mục</th>
                    <th>Tiêu đề</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((template) => (
                    <tr key={template.id}>
                      <td>
                        <span className={styles.code}>{template.code}</span>
                      </td>
                      <td>
                        <span className={styles.name}>{template.name}</span>
                      </td>
                      <td>
                        <span className={styles.dataType}>{getTypeLabel(template.type)}</span>
                      </td>
                      <td>
                        <span className={styles.category}>{template.category}</span>
                      </td>
                      <td style={{ maxWidth: '300px' }}>
                        <span className={styles.description}>{template.subject}</span>
                      </td>
                      <td>
                        {template.status === 'active' ? (
                          <span className={styles.statusActive}>Hoạt động</span>
                        ) : (
                          <span className={styles.statusInactive}>Tạm dừng</span>
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
                          <button
                            className={styles.buttonSecondary}
                            title="Xem chi tiết"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            className={styles.buttonSecondary}
                            disabled={!canUpdate}
                            title="Chỉnh sửa"
                          >
                            <Edit size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={styles.pagination}>
              <button
                className={styles.paginationButton}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Trước
              </button>
              <span className={styles.paginationInfo}>
                Trang {currentPage} / {totalPages}
              </span>
              <button
                className={styles.paginationButton}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Sau
              </button>
            </div>
          </>
        )}
      </ModuleShell>
    </PermissionGate>
  );
}
