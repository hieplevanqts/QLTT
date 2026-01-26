/**
 * USER ASSIGNMENTS PAGE - Quản lý phân quyền cho người dùng cụ thể
 * Permission: sa.iam.assignment.read
 */

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { PermissionGate, ModuleShell, EmptyState, usePermissions } from '../../_shared';
import { MOCK_USERS, MOCK_USER_ROLE_ASSIGNMENTS, MOCK_ROLES } from '../mock-data';
import styles from './UserAssignmentsPage.module.css';

export default function UserAssignmentsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();

  const canAssign = hasPermission('sa.iam.assignment.assign');
  const canRevoke = hasPermission('sa.iam.assignment.revoke');

  const user = MOCK_USERS.find(u => u.id === id);
  const userAssignments = MOCK_USER_ROLE_ASSIGNMENTS.filter(a => a.userId === id);
  const assignedRoles = userAssignments
    .filter(a => a.status === 'active')
    .map(a => ({ ...MOCK_ROLES.find(r => r.id === a.roleId), assignmentId: a.id }))
    .filter(Boolean);

  const availableRoles = MOCK_ROLES.filter(
    role => !assignedRoles.some(ar => ar?.id === role.id)
  );

  const [selectedRole, setSelectedRole] = useState<string>('');

  if (!user) {
    return (
      <ModuleShell title="Không tìm thấy người dùng">
        <p>Người dùng không tồn tại.</p>
      </ModuleShell>
    );
  }

  return (
    <PermissionGate permission="sa.iam.assignment.read">
      <ModuleShell
        title={`Phân quyền: ${user.fullName}`}
        subtitle={`Quản lý vai trò được gán cho @${user.username}`}
        breadcrumbs={[
          { label: 'Trang chủ', path: '/' },
          { label: 'Quản trị hệ thống', path: '/system-admin' },
          { label: 'IAM', path: '/system-admin/iam' },
          { label: 'Phân quyền', path: '/system-admin/iam/assignments' },
          { label: user.fullName }
        ]}
        actions={
          <button
            className={styles.buttonSecondary}
            onClick={() => navigate('/system-admin/iam/assignments')}
          >
            <ArrowLeft size={18} />
            Quay lại
          </button>
        }
      >
        {/* Assign New Role */}
        <div className={styles.assignSection}>
          <h3>Gán vai trò mới</h3>
          <div className={styles.assignForm}>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className={styles.roleSelect}
              disabled={!canAssign || availableRoles.length === 0}
            >
              <option value="">-- Chọn vai trò --</option>
              {availableRoles.map(role => (
                <option key={role.id} value={role.id}>
                  {role.name} ({role.code})
                </option>
              ))}
            </select>
            <button
              className={styles.buttonPrimary}
              disabled={!canAssign || !selectedRole}
            >
              <Plus size={18} />
              Gán vai trò
            </button>
          </div>
        </div>

        {/* Assigned Roles */}
        <div className={styles.rolesSection}>
          <h3>Vai trò đã gán ({assignedRoles.length})</h3>
          {assignedRoles.length === 0 ? (
            <EmptyState
              title="Chưa có vai trò"
              message="Người dùng này chưa được gán vai trò nào."
            />
          ) : (
            <div className={styles.rolesList}>
              {assignedRoles.map((role) => (
                <div key={role?.id} className={styles.roleCard}>
                  <div className={styles.roleInfo}>
                    <div className={styles.roleName}>{role?.name}</div>
                    <div className={styles.roleCode}>{role?.code}</div>
                    <div className={styles.roleDescription}>{role?.description}</div>
                  </div>
                  <div className={styles.roleActions}>
                    <div className={styles.roleType}>
                      {role?.type === 'system' ? (
                        <span className={styles.typeSystem}>System</span>
                      ) : (
                        <span className={styles.typeCustom}>Custom</span>
                      )}
                    </div>
                    <button
                      className={styles.revokeButton}
                      disabled={!canRevoke}
                      title="Thu hồi vai trò"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ModuleShell>
    </PermissionGate>
  );
}
