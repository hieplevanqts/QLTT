/**
 * USER DETAIL PAGE - Chi tiết người dùng
 * Permission: sa.iam.user.read
 */

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Lock, Unlock, UserX, Shield } from 'lucide-react';
import { message } from 'antd';
import { PermissionGate, ModuleShell, usePermissions } from '../../_shared';
import { usersService, type UserRecord } from '../services/users.service';
import styles from './UserDetailPage.module.css';

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();

  const canUpdate = hasPermission('sa.iam.user.update');
  const canDelete = hasPermission('sa.iam.user.delete');
  const canAssign = hasPermission('sa.iam.assignment.assign');

  const [loading, setLoading] = React.useState(true);
  const [user, setUser] = React.useState<UserRecord | null>(null);
  const [userRoles, setUserRoles] = React.useState<Array<{ code: string; name: string }>>([]);

  React.useEffect(() => {
    if (!id) return;
    const loadUser = async () => {
      setLoading(true);
      try {
        const data = await usersService.getUserById(id);
        setUser(data);
        if (data) {
          const roles = await usersService.listUserRoles(id);
          setUserRoles(roles.map((role) => ({ code: role.code, name: role.name })));
        }
      } catch (err) {
        const messageText = err instanceof Error ? err.message : 'Không thể tải người dùng.';
        message.error(messageText);
      } finally {
        setLoading(false);
      }
    };
    void loadUser();
  }, [id]);

  if (!user && !loading) {
    return (
      <ModuleShell title="Không tìm thấy người dùng">
        <p>Người dùng không tồn tại.</p>
      </ModuleShell>
    );
  }

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 1:
        return <span className={styles.statusActive}>Hoạt động</span>;
      case 0:
        return <span className={styles.statusInactive}>Tạm dừng</span>;
      case 2:
        return <span className={styles.statusLocked}>Khóa</span>;
      default:
        return <span className={styles.statusInactive}>Không rõ</span>;
    }
  };

  return (
    <PermissionGate permission="sa.iam.user.read">
      <ModuleShell
        title={user?.full_name || 'Người dùng'}
        subtitle={user?.username ? `@${user.username}` : undefined}
        breadcrumbs={[
          { label: 'Trang chủ', path: '/' },
          { label: 'Quản trị hệ thống', path: '/system-admin' },
          { label: 'IAM', path: '/system-admin/iam' },
          { label: 'Người dùng', path: '/system-admin/iam/users' },
          { label: user?.full_name || 'Chi tiết' }
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
              title={user?.status === 2 ? 'Mở khóa' : 'Khóa tài khoản'}
              onClick={async () => {
                if (!user) return;
                const nextStatus = user.status === 2 ? 1 : 2;
                try {
                  await usersService.setUserStatus(user.id, nextStatus);
                  setUser({ ...user, status: nextStatus });
                } catch (err) {
                  const messageText = err instanceof Error ? err.message : 'Không thể cập nhật trạng thái.';
                  message.error(messageText);
                }
              }}
            >
              {user?.status === 2 ? <Unlock size={18} /> : <Lock size={18} />}
              {user?.status === 2 ? 'Mở khóa' : 'Khóa'}
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
              {user ? getStatusBadge(user.status) : null}
            </div>
            <div className={styles.infoGrid}>
              <div className={styles.infoRow}>
                <span className={styles.label}>Username:</span>
                <span className={styles.value}>{user?.username || '-'}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Họ và tên:</span>
                <span className={styles.value}>{user?.full_name || '-'}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Email:</span>
                <span className={styles.value}>{user?.email || '-'}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Điện thoại:</span>
                <span className={styles.value}>{user?.phone || '-'}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Đăng nhập lần cuối:</span>
                <span className={styles.value}>
                  {user?.last_login_at ? (
                    new Date(user.last_login_at).toLocaleString('vi-VN', {
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
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString('vi-VN') : '-'}
                </span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Cập nhật:</span>
                <span className={styles.value}>
                  {user?.updated_at ? new Date(user.updated_at).toLocaleDateString('vi-VN') : '-'}
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
                onClick={() => navigate(`/system-admin/iam/assignments/users/${user?.id}`)}
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
                  <div key={role.code} className={styles.roleCard}>
                    <div className={styles.roleInfo}>
                      <div className={styles.roleName}>{role.name}</div>
                      <div className={styles.roleCode}>{role.code}</div>
                    </div>
                    <div className={styles.roleType}>
                      <span className={styles.typeCustom}>Vai trò</span>
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
