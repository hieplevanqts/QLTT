/**
 * ROLES PAGE - Quản lý vai trò
 * Permission: sa.iam.role.read
 */

import React, { useState, useMemo } from 'react';
import { Plus, Search, Shield, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PermissionGate, ModuleShell, EmptyState, usePermissions } from '../../_shared';
import { MOCK_ROLES } from '../mock-data';
import type { Role } from '../types';
import styles from '../pages/UsersPage.module.css';

export default function RolesPage() {
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | Role['type']>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const canCreate = hasPermission('sa.iam.role.create');
  const canUpdate = hasPermission('sa.iam.role.update');
  const canDelete = hasPermission('sa.iam.role.delete');

  const filteredData = useMemo(() => {
    return MOCK_ROLES.filter(role => {
      if (typeFilter !== 'all' && role.type !== typeFilter) {
        return false;
      }
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        role.code.toLowerCase().includes(query) ||
        role.name.toLowerCase().includes(query) ||
        role.description.toLowerCase().includes(query)
      );
    });
  }, [searchQuery, typeFilter]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <PermissionGate permission="sa.iam.role.read">
      <ModuleShell
        title="Quản lý Vai trò"
        subtitle="Quản lý vai trò và phân quyền trong hệ thống"
        breadcrumbs={[
          { label: 'Trang chủ', path: '/' },
          { label: 'Quản trị hệ thống', path: '/system-admin' },
          { label: 'IAM', path: '/system-admin/iam' },
          { label: 'Vai trò' }
        ]}
        actions={
          <button className={styles.buttonPrimary} disabled={!canCreate}>
            <Plus size={18} />
            Thêm vai trò
          </button>
        }
      >
        <div className={styles.toolbar}>
          <div className={styles.searchBox}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Tìm theo mã, tên vai trò..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          
          <div className={styles.filters}>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className={styles.filterSelect}
            >
              <option value="all">Tất cả loại</option>
              <option value="system">System</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          <div className={styles.stats}>
            <span className={styles.statsText}>
              Tổng: <strong>{filteredData.length}</strong> vai trò
            </span>
          </div>
        </div>

        {paginatedData.length === 0 ? (
          <EmptyState
            icon={<Shield size={48} />}
            title="Không tìm thấy vai trò"
            message="Không có vai trò nào phù hợp với tiêu chí tìm kiếm."
          />
        ) : (
          <>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Mã vai trò</th>
                    <th>Tên vai trò</th>
                    <th>Mô tả</th>
                    <th>Loại</th>
                    <th>Phạm vi</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((role) => (
                    <tr key={role.id}>
                      <td>
                        <span className={styles.username}>{role.code}</span>
                      </td>
                      <td>
                        <span className={styles.fullName}>{role.name}</span>
                      </td>
                      <td style={{ maxWidth: '300px' }}>
                        <span className={styles.email}>{role.description}</span>
                      </td>
                      <td>
                        {role.type === 'system' ? (
                          <span className={styles.statusLocked}>System</span>
                        ) : (
                          <span className={styles.statusActive}>Custom</span>
                        )}
                      </td>
                      <td>
                        {role.scope === 'global' ? 'Toàn cục' : 'Đơn vị'}
                      </td>
                      <td>
                        {role.status === 'active' ? (
                          <span className={styles.statusActive}>Hoạt động</span>
                        ) : (
                          <span className={styles.statusInactive}>Tạm dừng</span>
                        )}
                      </td>
                      <td>
                        <div className={styles.actionButtons}>
                          <button
                            className={styles.buttonSecondary}
                            onClick={() => navigate(`/system-admin/iam/assignments/roles/${role.id}`)}
                            title="Xem phân quyền"
                          >
                            <Shield size={14} />
                          </button>
                          <button
                            className={styles.buttonSecondary}
                            disabled={!canUpdate}
                            title="Chỉnh sửa"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            className={styles.buttonSecondary}
                            disabled={!canDelete || role.type === 'system'}
                            title={role.type === 'system' ? 'Không thể xóa system role' : 'Xóa'}
                          >
                            <Trash2 size={14} />
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
