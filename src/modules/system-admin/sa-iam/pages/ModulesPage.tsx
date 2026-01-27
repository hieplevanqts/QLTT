/**
 * MODULES PAGE - Quản lý module/phân hệ
 * Permission: sa.iam.module.read
 */

import React, { useState, useMemo } from 'react';
import { Plus, Search, Package } from 'lucide-react';
import { PermissionGate, ModuleShell, EmptyState, usePermissions } from '../../_shared';
import { MOCK_MODULES } from '../mock-data';
import styles from '../pages/UsersPage.module.css';

export default function ModulesPage() {
  const { hasPermission } = usePermissions();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const canCreate = hasPermission('sa.iam.module.create');
  const canUpdate = hasPermission('sa.iam.module.update');

  const filteredData = useMemo(() => {
    return MOCK_MODULES.filter(module => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        module.code.toLowerCase().includes(query) ||
        module.name.toLowerCase().includes(query) ||
        module.description.toLowerCase().includes(query)
      );
    });
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getParentName = (parentId: string | null) => {
    if (!parentId) return '—';
    const parent = MOCK_MODULES.find(m => m.id === parentId);
    return parent?.name || 'N/A';
  };

  return (
    <PermissionGate permission="sa.iam.module.read">
      <ModuleShell
        title="Quản lý Module"
        subtitle="Quản lý các phân hệ/module trong hệ thống"
        breadcrumbs={[
          { label: 'Trang chủ', path: '/' },
          { label: 'Quản trị hệ thống', path: '/system-admin' },
          { label: 'IAM', path: '/system-admin/iam' },
          { label: 'Module' }
        ]}
        actions={
          <button className={styles.buttonPrimary} disabled={!canCreate}>
            <Plus size={18} />
            Thêm module
          </button>
        }
      >
        <div className={styles.toolbar}>
          <div className={styles.searchBox}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Tìm theo mã, tên module..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.stats}>
            <span className={styles.statsText}>
              Tổng: <strong>{filteredData.length}</strong> module
            </span>
          </div>
        </div>

        {paginatedData.length === 0 ? (
          <EmptyState
            icon={<Package size={48} />}
            title="Không tìm thấy module"
            message="Không có module nào phù hợp với tiêu chí tìm kiếm."
          />
        ) : (
          <>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Mã module</th>
                    <th>Tên module</th>
                    <th>Mô tả</th>
                    <th>Icon</th>
                    <th>Module cha</th>
                    <th>Thứ tự</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((module) => (
                    <tr key={module.id}>
                      <td>
                        <span className={styles.username}>{module.code}</span>
                      </td>
                      <td>
                        <span className={styles.fullName}>{module.name}</span>
                      </td>
                      <td style={{ maxWidth: '250px' }}>
                        <span className={styles.email}>{module.description}</span>
                      </td>
                      <td>
                        <span className={styles.statusInactive}>{module.icon}</span>
                      </td>
                      <td>{getParentName(module.parentId)}</td>
                      <td>
                        <span className={styles.statusActive}>{module.order}</span>
                      </td>
                      <td>
                        {module.status === 'active' ? (
                          <span className={styles.statusActive}>Hoạt động</span>
                        ) : (
                          <span className={styles.statusInactive}>Tạm dừng</span>
                        )}
                      </td>
                      <td>
                        <button
                          className={styles.buttonSecondary}
                          disabled={!canUpdate}
                        >
                          Chỉnh sửa
                        </button>
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
