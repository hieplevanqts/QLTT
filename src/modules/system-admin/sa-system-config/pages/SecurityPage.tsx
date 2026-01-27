/**
 * SECURITY PAGE - Cài đặt bảo mật
 * Permission: sa.sysconfig.security.read
 */

import React, { useState } from 'react';
import { Shield, Edit } from 'lucide-react';
import { PermissionGate, ModuleShell, usePermissions } from '../../_shared';
import { MOCK_SECURITY_SETTINGS } from '../mock-data';
import styles from './SystemConfigPages.module.css';

export default function SecurityPage() {
  const { hasPermission } = usePermissions();
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const canUpdate = hasPermission('sa.sysconfig.security.update');

  const categories = Array.from(new Set(MOCK_SECURITY_SETTINGS.map(s => s.category)));

  const filteredData = categoryFilter === 'all'
    ? MOCK_SECURITY_SETTINGS
    : MOCK_SECURITY_SETTINGS.filter(s => s.category === categoryFilter);

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      password: 'Mật khẩu',
      session: 'Phiên đăng nhập',
      access: 'Kiểm soát truy cập',
      audit: 'Audit & Logs'
    };
    return labels[category] || category;
  };

  const formatValue = (value: string | number | boolean, dataType: string) => {
    if (dataType === 'boolean') {
      return value === true ? 'Bật' : 'Tắt';
    }
    if (dataType === 'number') {
      return value.toLocaleString('vi-VN');
    }
    return String(value);
  };

  return (
    <PermissionGate permission="sa.sysconfig.security.read">
      <ModuleShell
        title="Cài đặt Bảo mật"
        subtitle="Cấu hình các chính sách bảo mật hệ thống"
        breadcrumbs={[
          { label: 'Trang chủ', path: '/' },
          { label: 'Quản trị hệ thống', path: '/system-admin' },
          { label: 'Cấu hình', path: '/system-admin/system-config' },
          { label: 'Bảo mật' }
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
                <th>Giá trị</th>
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
                    <span className={styles.value}>
                      {formatValue(setting.value, setting.dataType)}
                    </span>
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
                      title="Chỉnh sửa"
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
