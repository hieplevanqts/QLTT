/**
 * DATABASE LOGS PAGE - Log database
 * Permission: sa.sysconfig.db.log.read
 */

import React, { useState, useMemo } from 'react';
import { Search, Database, Download } from 'lucide-react';
import { PermissionGate, ModuleShell, EmptyState, usePermissions } from '../../_shared';
import { MOCK_DATABASE_LOGS } from '../mock-data';
import type { DatabaseLog } from '../types';
import styles from './SystemConfigPages.module.css';

export default function DatabaseLogsPage() {
  const { hasPermission } = usePermissions();
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const canExport = hasPermission('sa.sysconfig.db.log.export');

  const levels: DatabaseLog['level'][] = ['info', 'warning', 'error', 'critical'];
  const categories: DatabaseLog['category'][] = ['query', 'connection', 'migration', 'backup', 'system'];

  const filteredData = useMemo(() => {
    return MOCK_DATABASE_LOGS.filter(log => {
      if (levelFilter !== 'all' && log.level !== levelFilter) return false;
      if (categoryFilter !== 'all' && log.category !== categoryFilter) return false;
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        log.message.toLowerCase().includes(query) ||
        (log.details && log.details.toLowerCase().includes(query))
      );
    });
  }, [searchQuery, levelFilter, categoryFilter]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getLevelBadge = (level: DatabaseLog['level']) => {
    switch (level) {
      case 'info':
        return <span className={styles.statusInfo}>Info</span>;
      case 'warning':
        return <span className={styles.statusWarning}>Warning</span>;
      case 'error':
        return <span className={styles.statusError}>Error</span>;
      case 'critical':
        return <span className={styles.statusError}>Critical</span>;
    }
  };

  return (
    <PermissionGate permission="sa.sysconfig.db.log.read">
      <ModuleShell
        title="Database Logs"
        subtitle="Quản lý và giám sát logs database"
        breadcrumbs={[
          { label: 'Trang chủ', path: '/' },
          { label: 'Quản trị hệ thống', path: '/system-admin' },
          { label: 'Cấu hình', path: '/system-admin/system-config' },
          { label: 'Database Logs' }
        ]}
        actions={
          <button className={styles.buttonPrimary} disabled={!canExport}>
            <Download size={18} />
            Export Logs
          </button>
        }
      >
        <div className={styles.toolbar}>
          <div className={styles.searchBox}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Tìm trong message, details..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          
          <div className={styles.filters}>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">Tất cả level</option>
              {levels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
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
              Tổng: <strong>{filteredData.length}</strong> logs
            </span>
          </div>
        </div>

        {paginatedData.length === 0 ? (
          <EmptyState
            icon={<Database size={48} />}
            title="Không tìm thấy logs"
            message="Không có log nào phù hợp với tiêu chí tìm kiếm."
          />
        ) : (
          <>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Level</th>
                    <th>Category</th>
                    <th>Message</th>
                    <th>User/IP</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((log) => (
                    <tr key={log.id}>
                      <td style={{ whiteSpace: 'nowrap' }}>
                        <span className={styles.updatedAt}>
                          {new Date(log.timestamp).toLocaleString('vi-VN', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                          })}
                        </span>
                      </td>
                      <td>{getLevelBadge(log.level)}</td>
                      <td>
                        <span className={styles.category}>{log.category}</span>
                      </td>
                      <td style={{ maxWidth: '400px' }}>
                        <div className={styles.nameCell}>
                          <span className={styles.name}>{log.message}</span>
                          {log.details && (
                            <span className={styles.description}>{log.details}</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className={styles.updateInfo}>
                          {log.userId && (
                            <span className={styles.updatedBy}>{log.userId}</span>
                          )}
                          {log.ipAddress && (
                            <span className={styles.updatedAt}>{log.ipAddress}</span>
                          )}
                          {!log.userId && !log.ipAddress && (
                            <span className={styles.updatedAt}>—</span>
                          )}
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
