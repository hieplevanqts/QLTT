/**
 * JURISDICTION MAP PAGE - Xem/Chỉnh sửa ranh giới địa bàn trên bản đồ
 * Permission: sa.masterdata.jurisdiction.read
 */

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, MapPin } from 'lucide-react';
import { PermissionGate, ModuleShell, usePermissions } from '../../_shared';
import { MOCK_JURISDICTIONS } from '../mock-data';
import styles from './JurisdictionMapPage.module.css';

export default function JurisdictionMapPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();

  const canUpdate = hasPermission('sa.masterdata.jurisdiction.update');
  const jurisdiction = MOCK_JURISDICTIONS.find(j => j.id === id);

  if (!jurisdiction) {
    return (
      <ModuleShell title="Không tìm thấy địa bàn">
        <p>Địa bàn không tồn tại.</p>
      </ModuleShell>
    );
  }

  return (
    <PermissionGate permission="sa.masterdata.jurisdiction.read">
      <ModuleShell
        title={`Bản đồ: ${jurisdiction.name}`}
        subtitle="Xem và chỉnh sửa ranh giới địa bàn trên bản đồ"
        breadcrumbs={[
          { label: 'Trang chủ', path: '/' },
          { label: 'Quản trị hệ thống', path: '/system-admin' },
          { label: 'Dữ liệu nền', path: '/system-admin/master-data' },
          { label: 'Địa bàn', path: '/system-admin/master-data/jurisdictions' },
          { label: jurisdiction.name }
        ]}
        actions={
          <>
            <button
              className={styles.buttonSecondary}
              onClick={() => navigate('/system-admin/master-data/jurisdictions')}
            >
              <ArrowLeft size={18} />
              Quay lại
            </button>
            <button className={styles.buttonPrimary} disabled={!canUpdate}>
              <Save size={18} />
              Lưu ranh giới
            </button>
          </>
        }
      >
        {/* Map Container - Placeholder */}
        <div className={styles.mapContainer}>
          <div className={styles.mapPlaceholder}>
            <MapPin size={64} />
            <h3>Tích hợp bản đồ</h3>
            <p>
              Khu vực này sẽ hiển thị bản đồ tương tác để vẽ và chỉnh sửa ranh giới địa bàn.
            </p>
            <p className={styles.mapInfo}>
              <strong>Địa bàn:</strong> {jurisdiction.name} ({jurisdiction.code})
              <br />
              <strong>Loại:</strong> {jurisdiction.type}
              <br />
              <strong>Có ranh giới:</strong> {jurisdiction.boundary ? 'Có' : 'Chưa có'}
            </p>
          </div>
        </div>

        {/* Map Tools */}
        <div className={styles.mapTools}>
          <div className={styles.toolsSection}>
            <h4>Công cụ vẽ</h4>
            <div className={styles.toolButtons}>
              <button className={styles.toolButton} disabled>Vẽ đa giác</button>
              <button className={styles.toolButton} disabled>Chỉnh sửa</button>
              <button className={styles.toolButton} disabled>Xóa</button>
            </div>
          </div>
          <div className={styles.toolsSection}>
            <h4>Lớp bản đồ</h4>
            <div className={styles.layersList}>
              <label className={styles.layerItem}>
                <input type="checkbox" checked disabled />
                <span>Ranh giới hành chính</span>
              </label>
              <label className={styles.layerItem}>
                <input type="checkbox" checked disabled />
                <span>Địa bàn quản lý</span>
              </label>
            </div>
          </div>
        </div>
      </ModuleShell>
    </PermissionGate>
  );
}
