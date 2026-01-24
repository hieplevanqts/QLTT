/**
 * PERMISSIONS PAGE - Quản lý quyền hạn
 * Permission: sa.iam.permission.read
 */

import React, { useState, useMemo } from 'react';
import { Search, Key } from 'lucide-react';
import { PermissionGate, ModuleShell, EmptyState, usePermissions } from '../../_shared';
import { MOCK_PERMISSIONS, MOCK_MODULES } from '../mock-data';
import styles from '../pages/UsersPage.module.css';

export default function PermissionsPage() {
  const { hasPermission } = usePermissions();
  const [searchQuery, setSearchQuery] = useState('');
  const [moduleFilter, setModuleFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const filteredData = useMemo(() => {
    return MOCK_PERMISSIONS.filter(perm => {
      if (moduleFilter !== 'all' && perm.moduleId !== moduleFilter) {
        return false;
      }
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        perm.code.toLowerCase().includes(query) ||
        perm.name.toLowerCase().includes(query) ||
        perm.resource.toLowerCase().includes(query) ||
        perm.action.toLowerCase().includes(query)
      );
    });
  }, [searchQuery, moduleFilter]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getModuleName = (moduleId: string) => {
    const module = MOCK_MODULES.find(m => m.id === moduleId);
    return module?.name || 'N/A';
  };

  return (
    <PermissionGate permission="sa.iam.permission.read">
      <ModuleShell
        title="Quản lý Quyền hạn"
        subtitle="Danh sách các quyền hạn trong hệ thống"
        breadcrumbs={[
          { label: 'Trang chủ', path: '/' },
          { label: 'Quản trị hệ thống', path: '/system-admin' },
          { label: 'IAM', path: '/system-admin/iam' },
          { label: 'Quyền hạn' }
        ]}
      >
        <div className={styles.toolbar}>
          <div className={styles.searchBox}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Tìm theo code, tên, resource, action..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          
          <div className={styles.filters}>
            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">Tất cả module</option>
              {MOCK_MODULES.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>

          <div className={styles.stats}>
            <span className={styles.statsText}>
              Tổng: <strong>{filteredData.length}</strong> quyền
            </span>
          </div>
        </div>

        {paginatedData.length === 0 ? (
          <EmptyState
            icon={<Key size={48} />}
            title="Không tìm thấy quyền hạn"
            message="Không có quyền hạn nào phù hợp với tiêu chí tìm kiếm."
          />
        ) : (
          <>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Permission Code</th>
                    <th>Tên quyền</th>
                    <th>Module</th>
                    <th>Resource</th>
                    <th>Action</th>
                    <th>Loại</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((perm) => (
                    <tr key={perm.id}>
                      <td>
                        <span className={styles.username}>{perm.code}</span>
                      </td>
                      <td>
                        <span className={styles.fullName}>{perm.name}</span>
                      </td>
                      <td>{getModuleName(perm.moduleId)}</td>
                      <td>
                        <span className={styles.statusActive}>{perm.resource}</span>
                      </td>
                      <td>
                        <span className={styles.statusInactive}>{perm.action}</span>
                      </td>
                      <td>
                        {perm.isSystem ? (
                          <span className={styles.statusLocked}>System</span>
                        ) : (
                          <span className={styles.statusActive}>Custom</span>
                        )}
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
