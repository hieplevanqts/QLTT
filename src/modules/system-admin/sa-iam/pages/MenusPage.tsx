/**
 * MENUS PAGE - Quản lý menu navigation
 * Permission: sa.iam.menu.read
 */

import React, { useState, useMemo } from 'react';
import { Plus, Search, Menu } from 'lucide-react';
import { PermissionGate, ModuleShell, EmptyState, usePermissions } from '../../_shared';
import { MOCK_MENUS, MOCK_MODULES } from '../mock-data';
import styles from '../pages/UsersPage.module.css';

export default function MenusPage() {
  const { hasPermission } = usePermissions();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const canCreate = hasPermission('sa.iam.menu.create');
  const canUpdate = hasPermission('sa.iam.menu.update');

  const filteredData = useMemo(() => {
    return MOCK_MENUS.filter(menu => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        menu.code.toLowerCase().includes(query) ||
        menu.label.toLowerCase().includes(query) ||
        menu.path.toLowerCase().includes(query)
      );
    });
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getModuleName = (moduleId: string) => {
    const module = MOCK_MODULES.find(m => m.id === moduleId);
    return module?.name || 'N/A';
  };

  const getParentLabel = (parentId: string | null) => {
    if (!parentId) return '—';
    const parent = MOCK_MENUS.find(m => m.id === parentId);
    return parent?.label || 'N/A';
  };

  return (
    <PermissionGate permission="sa.iam.menu.read">
      <ModuleShell
        title="Quản lý Menu"
        subtitle="Cấu hình menu navigation trong hệ thống"
        breadcrumbs={[
          { label: 'Trang chủ', path: '/' },
          { label: 'Quản trị hệ thống', path: '/system-admin' },
          { label: 'IAM', path: '/system-admin/iam' },
          { label: 'Menu' }
        ]}
        actions={
          <button className={styles.buttonPrimary} disabled={!canCreate}>
            <Plus size={18} />
            Thêm menu
          </button>
        }
      >
        <div className={styles.toolbar}>
          <div className={styles.searchBox}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Tìm theo mã, label, path..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.stats}>
            <span className={styles.statsText}>
              Tổng: <strong>{filteredData.length}</strong> menu
            </span>
          </div>
        </div>

        {paginatedData.length === 0 ? (
          <EmptyState
            icon={<Menu size={48} />}
            title="Không tìm thấy menu"
            message="Không có menu nào phù hợp với tiêu chí tìm kiếm."
          />
        ) : (
          <>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Mã menu</th>
                    <th>Label</th>
                    <th>Path</th>
                    <th>Module</th>
                    <th>Menu cha</th>
                    <th>Thứ tự</th>
                    <th>Quyền yêu cầu</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((menu) => (
                    <tr key={menu.id}>
                      <td>
                        <span className={styles.username}>{menu.code}</span>
                      </td>
                      <td>
                        <span className={styles.fullName}>{menu.label}</span>
                      </td>
                      <td>
                        <span className={styles.email}>{menu.path}</span>
                      </td>
                      <td>{getModuleName(menu.moduleId)}</td>
                      <td>{getParentLabel(menu.parentId)}</td>
                      <td>
                        <span className={styles.statusActive}>{menu.order}</span>
                      </td>
                      <td>
                        {menu.requiredPermission ? (
                          <span className={styles.email}>{menu.requiredPermission}</span>
                        ) : (
                          <span>—</span>
                        )}
                      </td>
                      <td>
                        {menu.status === 'active' ? (
                          <span className={styles.statusActive}>Hoạt động</span>
                        ) : (
                          <span className={styles.statusInactive}>Ẩn</span>
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
