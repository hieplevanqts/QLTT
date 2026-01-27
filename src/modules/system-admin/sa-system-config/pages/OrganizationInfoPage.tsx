/**
 * ORGANIZATION INFO PAGE - Thông tin tổ chức
 * Permission: sa.sysconfig.orginfo.read
 */

import React from 'react';
import { Building2, Edit } from 'lucide-react';
import { PermissionGate, ModuleShell, usePermissions } from '../../_shared';
import { MOCK_ORGANIZATION_INFO } from '../mock-data';
import styles from './OrganizationInfoPage.module.css';

export default function OrganizationInfoPage() {
  const { hasPermission } = usePermissions();
  const canUpdate = hasPermission('sa.sysconfig.orginfo.update');
  const org = MOCK_ORGANIZATION_INFO;

  return (
    <PermissionGate permission="sa.sysconfig.orginfo.read">
      <ModuleShell
        title="Thông tin Tổ chức"
        subtitle="Quản lý thông tin tổ chức và cơ quan"
        breadcrumbs={[
          { label: 'Trang chủ', path: '/' },
          { label: 'Quản trị hệ thống', path: '/system-admin' },
          { label: 'Cấu hình', path: '/system-admin/system-config' },
          { label: 'Thông tin tổ chức' }
        ]}
        actions={
          <button className={styles.buttonPrimary} disabled={!canUpdate}>
            <Edit size={18} />
            Chỉnh sửa
          </button>
        }
      >
        <div className={styles.orgContainer}>
          {/* Logo Section */}
          <div className={styles.logoSection}>
            <div className={styles.logoPlaceholder}>
              <Building2 size={48} />
            </div>
            <button className={styles.buttonSecondary} disabled={!canUpdate}>
              Tải lên logo
            </button>
          </div>

          {/* Info Grid */}
          <div className={styles.infoGrid}>
            {/* Basic Info */}
            <div className={styles.infoSection}>
              <h3 className={styles.sectionTitle}>Thông tin cơ bản</h3>
              <div className={styles.infoRows}>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Tên đầy đủ:</span>
                  <span className={styles.value}>{org.fullName}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Tên viết tắt:</span>
                  <span className={styles.value}>{org.shortName}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Tên tiếng Anh:</span>
                  <span className={styles.value}>{org.englishName}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Mã số thuế:</span>
                  <span className={styles.value}>{org.taxCode}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Ngày thành lập:</span>
                  <span className={styles.value}>
                    {new Date(org.establishedDate).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className={styles.infoSection}>
              <h3 className={styles.sectionTitle}>Thông tin liên hệ</h3>
              <div className={styles.infoRows}>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Địa chỉ:</span>
                  <span className={styles.value}>{org.address}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Quận/Huyện:</span>
                  <span className={styles.value}>{org.district}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Tỉnh/Thành phố:</span>
                  <span className={styles.value}>{org.city}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Điện thoại:</span>
                  <span className={styles.value}>{org.phone}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Fax:</span>
                  <span className={styles.value}>{org.fax}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Email:</span>
                  <span className={styles.value}>{org.email}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Website:</span>
                  <span className={styles.value}>
                    <a href={org.website} target="_blank" rel="noopener noreferrer">
                      {org.website}
                    </a>
                  </span>
                </div>
              </div>
            </div>

            {/* Legal Representative */}
            <div className={styles.infoSection}>
              <h3 className={styles.sectionTitle}>Người đại diện pháp luật</h3>
              <div className={styles.infoRows}>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Họ và tên:</span>
                  <span className={styles.value}>{org.legalRepresentative}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Chức vụ:</span>
                  <span className={styles.value}>{org.legalRepresentativePosition}</span>
                </div>
              </div>
            </div>

            {/* Update Info */}
            <div className={styles.infoSection}>
              <h3 className={styles.sectionTitle}>Thông tin cập nhật</h3>
              <div className={styles.infoRows}>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Cập nhật bởi:</span>
                  <span className={styles.value}>{org.updatedBy}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Cập nhật lúc:</span>
                  <span className={styles.value}>
                    {new Date(org.updatedAt).toLocaleString('vi-VN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ModuleShell>
    </PermissionGate>
  );
}
