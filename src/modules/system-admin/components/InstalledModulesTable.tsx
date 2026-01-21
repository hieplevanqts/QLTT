/**
 * Installed Modules Table Component
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Package, RotateCcw, UploadCloud } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import type { ModuleInfo } from '../types';
import styles from './InstalledModulesTable.module.css';

interface InstalledModulesTableProps {
  modules: ModuleInfo[];
  onRollback?: (id: string) => void;
}

export function InstalledModulesTable({ modules, onRollback }: InstalledModulesTableProps) {
  const formatDate = (dateString?: string): string => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status?: ModuleInfo['status']) => {
    if (status === 'inactive') {
      return <Badge variant="outline">Tạm dừng</Badge>;
    }
    return <Badge variant="secondary">Hoạt động</Badge>;
  };

  if (modules.length === 0) {
    return (
      <div className={styles.emptyState}>
        <Package />
        <h3>Chưa có mô-đun nào</h3>
        <p>Bắt đầu bằng cách import mô-đun mới</p>
      </div>
    );
  }

  return (
    <table className={styles.modulesTable}>
      <thead>
        <tr>
          <th>Module</th>
          <th>Phiên bản</th>
          <th>Trạng thái</th>
          <th>Đường dẫn base</th>
          <th>Tệp entry</th>
          <th>Cài đặt lúc</th>
          <th>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        {modules.map((module) => (
          <tr key={module.id}>
            <td>
              <div className={styles.moduleInfo}>
                <div className={styles.moduleName}>{module.name || module.id}</div>
                <div className={styles.moduleId}>{module.id}</div>
              </div>
            </td>
            <td>
              <span className={styles.versionBadge}>v{module.version}</span>
            </td>
            <td>
              {getStatusBadge(module.status)}
            </td>
            <td>
              <code className={styles.code}>{module.basePath}</code>
            </td>
            <td>
              <code className={styles.code}>{module.entry || '-'}</code>
            </td>
            <td>
              <span className={styles.mutedText}>{formatDate(module.installedAt)}</span>
            </td>
            <td>
              <div className={styles.actions}>
                <Link to={`/system/modules/${module.id}`}>
                  <Button variant="ghost" size="icon" title="Xem chi tiết">
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to={`/system/modules/${module.id}/update`}>
                  <Button variant="ghost" size="icon" title="Cập nhật mô-đun">
                    <UploadCloud className="h-4 w-4" />
                  </Button>
                </Link>
                {onRollback && module.id !== 'system-admin' && (
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Rollback mô-đun"
                    onClick={() => onRollback(module.id)}
                  >
                    <RotateCcw className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
