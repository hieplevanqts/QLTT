/**
 * USER DETAIL PAGE - Chi tiết người dùng
 * Permission: sa.iam.user.read
 */

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Lock, Unlock, UserX, Shield } from 'lucide-react';
import { PermissionGate, ModuleShell, usePermissions } from '../../_shared';
import { MOCK_USERS, MOCK_USER_ROLE_ASSIGNMENTS, MOCK_ROLES } from '../mock-data';
import type { User } from '../types';
import styles from './UserDetailPage.module.css';

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();

  const canUpdate = hasPermission('sa.iam.user.update');
  const canDelete = hasPermission('sa.iam.user.delete');
  const canAssign = hasPermission('sa.iam.assignment.assign');

  const user = MOCK_USERS.find(u => u.id === id);
  const userAssignments = MOCK_USER_ROLE_ASSIGNMENTS.filter(a => a.userId === id && a.status === 'active');
  const userRoles = userAssignments.map(a => MOCK_ROLES.find(r => r.id === a.roleId)).filter(Boolean);

  if (!user) {
    return (
      <ModuleShell title="Không tìm thấy người dùng">
        <p>Người dùng không tồn tại.</p>
      </ModuleShell>
    );
  }

  const getStatusBadge = (status: User['status']) => {
    switch (status) {
      case 'active':
        return <span className={styles.statusActive}>Hoạt động</span>;
      case 'inactive':
        return <span className={styles.statusInactive}>Tạm dừng</span>;
      case 'locked':
        return <span className={styles.statusLocked}>Khóa</span>;
    }
  };

  return (
    <PermissionGate permission="sa.iam.user.read">
      <ModuleShell
        title={user.fullName}
        subtitle={`@${user.username}`}
        breadcrumbs={[
          { label: 'Trang chủ', path: '/' },
          { label: 'Quản trị hệ thống', path: '/system-admin' },
          { label: 'IAM', path: '/system-admin/iam' },
          { label: 'Người dùng', path: '/system-admin/iam/users' },
          { label: user.fullName }
        ]}
        actions={
          <>
            <button
              className={styles.buttonSecondary}
              onClick={() => navigate('/system-admin/iam/users')}
            >
              <ArrowLeft size={18} />
              Quay lại
            </button>
            <button
              className={styles.buttonSecondary}
              disabled={!canUpdate}
              title={user.status === 'locked' ? 'Mở khóa' : 'Khóa tài khoản'}
            >
              {user.status === 'locked' ? <Unlock size={18} /> : <Lock size={18} />}
              {user.status === 'locked' ? 'Mở khóa' : 'Khóa'}
            </button>
            <button className={styles.buttonPrimary} disabled={!canUpdate}>
              <Edit size={18} />
              Chỉnh sửa
            </button>
          </>
        }
      >
        <div className={styles.detailGrid}>
          {/* Info Card */}
          <div className={styles.infoCard}>
            <div className={styles.cardHeader}>
              <h3>Thông tin cơ bản</h3>
              {getStatusBadge(user.status)}
            </div>
            <div className={styles.infoGrid}>
              <div className={styles.infoRow}>
                <span className={styles.label}>Username:</span>
                <span className={styles.value}>{user.username}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Họ và tên:</span>
                <span className={styles.value}>{user.fullName}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Email:</span>
                <span className={styles.value}>{user.email}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Điện thoại:</span>
                <span className={styles.value}>{user.phone}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Chức vụ:</span>
                <span className={styles.value}>{user.position}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Đăng nhập lần cuối:</span>
                <span className={styles.value}>
                  {user.lastLoginAt ? (
                    new Date(user.lastLoginAt).toLocaleString('vi-VN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                  ) : (
                    <em>Chưa đăng nhập</em>
                  )}
                </span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Ngày tạo:</span>
                <span className={styles.value}>
                  {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                </span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Cập nhật:</span>
                <span className={styles.value}>
                  {new Date(user.updatedAt).toLocaleDateString('vi-VN')}
                </span>
              </div>
            </div>
          </div>

          {/* Roles Card */}
          <div className={styles.rolesCard}>
            <div className={styles.cardHeader}>
              <h3>Vai trò được gán ({userRoles.length})</h3>
              <button
                className={styles.buttonSecondary}
                disabled={!canAssign}
                onClick={() => navigate(`/system-admin/iam/assignments/users/${user.id}`)}
              >
                <Shield size={16} />
                Quản lý phân quyền
              </button>
            </div>
            {userRoles.length === 0 ? (
              <div className={styles.emptyRoles}>
                <p>Người dùng chưa được gán vai trò nào.</p>
              </div>
            ) : (
              <div className={styles.rolesList}>
                {userRoles.map((role) => (
                  <div key={role?.id} className={styles.roleCard}>
                    <div className={styles.roleInfo}>
                      <div className={styles.roleName}>{role?.name}</div>
                      <div className={styles.roleCode}>{role?.code}</div>
                    </div>
                    <div className={styles.roleType}>
                      {role?.type === 'system' ? (
                        <span className={styles.typeSystem}>System</span>
                      ) : (
                        <span className={styles.typeCustom}>Custom</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Danger Zone */}
        {canDelete && (
          <div className={styles.dangerZone}>
            <h3>Vùng nguy hiểm</h3>
            <p>Các thao tác không thể hoàn tác. Vui lòng cẩn thận.</p>
            <button className={styles.buttonDanger} disabled>
              <UserX size={18} />
              Xóa tài khoản
            </button>
          </div>
        )}
      </ModuleShell>
    </PermissionGate>
  );
}
