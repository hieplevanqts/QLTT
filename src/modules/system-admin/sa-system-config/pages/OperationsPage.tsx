/**
 * OPERATIONS PAGE - Cài đặt vận hành
 * Permission: sa.sysconfig.ops.read
 */

import React, { useState } from 'react';
import { Settings, Power, Edit } from 'lucide-react';
import { PermissionGate, ModuleShell, usePermissions } from '../../_shared';
import { MOCK_OPERATION_SETTINGS } from '../mock-data';
import styles from './SystemConfigPages.module.css';

export default function OperationsPage() {
  const { hasPermission } = usePermissions();
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const canUpdate = hasPermission('sa.sysconfig.ops.update');

  const categories = Array.from(new Set(MOCK_OPERATION_SETTINGS.map(s => s.category)));
  
  const filteredData = categoryFilter === 'all'
    ? MOCK_OPERATION_SETTINGS
    : MOCK_OPERATION_SETTINGS.filter(s => s.category === categoryFilter);

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      system: 'Hệ thống',
      workflow: 'Quy trình',
      notification: 'Thông báo',
      report: 'Báo cáo'
    };
    return labels[category] || category;
  };

  return (
    <PermissionGate permission="sa.sysconfig.ops.read">
      <ModuleShell
        title="Cài đặt Vận hành"
        subtitle="Cấu hình các cài đặt vận hành hệ thống"
        breadcrumbs={[
          { label: 'Trang chủ', path: '/' },
          { label: 'Quản trị hệ thống', path: '/system-admin' },
          { label: 'Cấu hình', path: '/system-admin/system-config' },
          { label: 'Vận hành' }
        ]}
      >
        <div className={styles.toolbar}>
          <div className={styles.filters}>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">Tất cả danh mục</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{getCategoryLabel(cat)}</option>
              ))}
            </select>
          </div>

          <div className={styles.stats}>
            <span className={styles.statsText}>
              Tổng: <strong>{filteredData.length}</strong> cài đặt
            </span>
          </div>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Danh mục</th>
                <th>Mã cài đặt</th>
                <th>Tên cài đặt</th>
                <th>Trạng thái</th>
                <th>Cập nhật</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((setting) => (
                <tr key={setting.id}>
                  <td>
                    <span className={styles.category}>{getCategoryLabel(setting.category)}</span>
                  </td>
                  <td>
                    <span className={styles.code}>{setting.code}</span>
                  </td>
                  <td>
                    <div className={styles.nameCell}>
                      <span className={styles.name}>{setting.name}</span>
                      <span className={styles.description}>{setting.description}</span>
                    </div>
                  </td>
                  <td>
                    {setting.enabled ? (
                      <span className={styles.statusActive}>
                        <Power size={12} style={{ display: 'inline', marginRight: '4px' }} />
                        Bật
                      </span>
                    ) : (
                      <span className={styles.statusInactive}>Tắt</span>
                    )}
                  </td>
                  <td>
                    <div className={styles.updateInfo}>
                      <span className={styles.updatedBy}>{setting.updatedBy}</span>
                      <span className={styles.updatedAt}>
                        {new Date(setting.updatedAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  </td>
                  <td>
                    <button
                      className={styles.buttonSecondary}
                      disabled={!canUpdate}
                      title="Cấu hình"
                    >
                      <Edit size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ModuleShell>
    </PermissionGate>
  );
}
