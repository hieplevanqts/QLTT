/**
 * PARAMETERS PAGE - Thông số hệ thống
 * Permission: sa.sysconfig.param.read
 */

import React, { useState, useMemo } from 'react';
import { Search, Settings, Edit } from 'lucide-react';
import { PermissionGate, ModuleShell, EmptyState, usePermissions } from '../../_shared';
import { MOCK_SYSTEM_PARAMETERS } from '../mock-data';
import styles from './SystemConfigPages.module.css';

export default function ParametersPage() {
  const { hasPermission } = usePermissions();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const canUpdate = hasPermission('sa.sysconfig.param.update');

  const categories = Array.from(new Set(MOCK_SYSTEM_PARAMETERS.map(p => p.category)));

  const filteredData = useMemo(() => {
    return MOCK_SYSTEM_PARAMETERS.filter(param => {
      if (categoryFilter !== 'all' && param.category !== categoryFilter) {
        return false;
      }
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        param.code.toLowerCase().includes(query) ||
        param.name.toLowerCase().includes(query) ||
        param.description.toLowerCase().includes(query)
      );
    });
  }, [searchQuery, categoryFilter]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatValue = (value: string, dataType: string) => {
    if (dataType === 'boolean') {
      return value === 'true' ? 'Bật' : 'Tắt';
    }
    if (dataType === 'number') {
      return parseInt(value).toLocaleString('vi-VN');
    }
    return value;
  };

  return (
    <PermissionGate permission="sa.sysconfig.param.read">
      <ModuleShell
        title="Thông số Hệ thống"
        subtitle="Cấu hình và quản lý các thông số hệ thống"
        breadcrumbs={[
          { label: 'Trang chủ', path: '/' },
          { label: 'Quản trị hệ thống', path: '/system-admin' },
          { label: 'Cấu hình', path: '/system-admin/system-config' },
          { label: 'Thông số hệ thống' }
        ]}
      >
        <div className={styles.toolbar}>
          <div className={styles.searchBox}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Tìm theo mã, tên, mô tả..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          
          <div className={styles.filters}>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">Tất cả danh mục</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className={styles.stats}>
            <span className={styles.statsText}>
              Tổng: <strong>{filteredData.length}</strong> thông số
            </span>
          </div>
        </div>

        {paginatedData.length === 0 ? (
          <EmptyState
            icon={<Settings size={48} />}
            title="Không tìm thấy thông số"
            message="Không có thông số nào phù hợp với tiêu chí tìm kiếm."
          />
        ) : (
          <>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Danh mục</th>
                    <th>Mã thông số</th>
                    <th>Tên thông số</th>
                    <th>Giá trị</th>
                    <th>Kiểu dữ liệu</th>
                    <th>Cập nhật</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((param) => (
                    <tr key={param.id}>
                      <td>
                        <span className={styles.category}>{param.category}</span>
                      </td>
                      <td>
                        <span className={styles.code}>{param.code}</span>
                      </td>
                      <td>
                        <div className={styles.nameCell}>
                          <span className={styles.name}>{param.name}</span>
                          <span className={styles.description}>{param.description}</span>
                        </div>
                      </td>
                      <td>
                        <span className={styles.value}>
                          {formatValue(param.value, param.dataType)}
                        </span>
                      </td>
                      <td>
                        <span className={styles.dataType}>{param.dataType}</span>
                      </td>
                      <td>
                        <div className={styles.updateInfo}>
                          <span className={styles.updatedBy}>{param.updatedBy}</span>
                          <span className={styles.updatedAt}>
                            {new Date(param.updatedAt).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                      </td>
                      <td>
                        <button
                          className={styles.buttonSecondary}
                          disabled={!canUpdate || !param.isEditable}
                          title={!param.isEditable ? 'System parameter không thể sửa' : 'Chỉnh sửa'}
                        >
                          <Edit size={14} />
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
