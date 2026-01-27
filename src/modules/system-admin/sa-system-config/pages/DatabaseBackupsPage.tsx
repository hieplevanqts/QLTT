/**
 * DATABASE BACKUPS PAGE - Sao lưu database
 * Permission: sa.sysconfig.db.backup.read
 */

import React, { useState } from 'react';
import { Database, Download, RotateCcw, Plus } from 'lucide-react';
import { PermissionGate, ModuleShell, usePermissions } from '../../_shared';
import { MOCK_DATABASE_BACKUPS, MOCK_BACKUP_STATS } from '../mock-data';
import type { DatabaseBackup } from '../types';
import styles from './DatabaseBackupsPage.module.css';

export default function DatabaseBackupsPage() {
  const { hasPermission } = usePermissions();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const canCreate = hasPermission('sa.sysconfig.db.backup.create');
  const canRestore = hasPermission('sa.sysconfig.db.backup.restore');

  const stats = MOCK_BACKUP_STATS;
  const totalPages = Math.ceil(MOCK_DATABASE_BACKUPS.length / itemsPerPage);
  const paginatedData = MOCK_DATABASE_BACKUPS.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '—';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getStatusBadge = (status: DatabaseBackup['status']) => {
    switch (status) {
      case 'completed':
        return <span className={styles.statusSuccess}>Hoàn thành</span>;
      case 'in-progress':
        return <span className={styles.statusProgress}>Đang xử lý</span>;
      case 'pending':
        return <span className={styles.statusPending}>Đang chờ</span>;
      case 'failed':
        return <span className={styles.statusFailed}>Thất bại</span>;
    }
  };

  return (
    <PermissionGate permission="sa.sysconfig.db.backup.read">
      <ModuleShell
        title="Database Backups"
        subtitle="Quản lý sao lưu và phục hồi database"
        breadcrumbs={[
          { label: 'Trang chủ', path: '/' },
          { label: 'Quản trị hệ thống', path: '/system-admin' },
          { label: 'Cấu hình', path: '/system-admin/system-config' },
          { label: 'Database Backups' }
        ]}
        actions={
          <button className={styles.buttonPrimary} disabled={!canCreate}>
            <Plus size={18} />
            Tạo backup mới
          </button>
        }
      >
        {/* Stats Grid */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#eff6ff', color: '#2563eb' }}>
              <Database size={24} />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{stats.totalBackups}</div>
              <div className={styles.statLabel}>Tổng backups</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#f0fdf4', color: '#16a34a' }}>
              <Database size={24} />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{stats.successfulBackups}</div>
              <div className={styles.statLabel}>Thành công</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#fef2f2', color: '#dc2626' }}>
              <Database size={24} />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{stats.failedBackups}</div>
              <div className={styles.statLabel}>Thất bại</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#f5f3ff', color: '#7c3aed' }}>
              <Download size={24} />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{formatFileSize(stats.totalSize)}</div>
              <div className={styles.statLabel}>Tổng dung lượng</div>
            </div>
          </div>
        </div>

        {/* Backups Table */}
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Tên file</th>
                <th>Loại</th>
                <th>Kích thước</th>
                <th>Thời gian</th>
                <th>Thời lượng</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((backup) => (
                <tr key={backup.id}>
                  <td>
                    <div className={styles.fileNameCell}>
                      <span className={styles.fileName}>{backup.fileName}</span>
                      <span className={styles.createdBy}>
                        Bởi: {backup.createdBy}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className={styles.backupType}>{backup.backupType}</span>
                  </td>
                  <td>
                    <span className={styles.fileSize}>
                      {formatFileSize(backup.fileSize)}
                    </span>
                  </td>
                  <td>
                    <div className={styles.timeCell}>
                      <span className={styles.startTime}>
                        {new Date(backup.startedAt).toLocaleString('vi-VN', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </td>
                  <td>{formatDuration(backup.duration)}</td>
                  <td>
                    <div>
                      {getStatusBadge(backup.status)}
                      {backup.errorMessage && (
                        <div className={styles.errorMessage}>{backup.errorMessage}</div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button
                        className={styles.buttonDownload}
                        disabled={backup.status !== 'completed'}
                        title="Tải xuống"
                      >
                        <Download size={14} />
                      </button>
                      <button
                        className={styles.buttonRestore}
                        disabled={!canRestore || !backup.canRestore}
                        title="Phục hồi"
                      >
                        <RotateCcw size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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
      </ModuleShell>
    </PermissionGate>
  );
}
