/**
 * ROLE ASSIGNMENTS PAGE - Quản lý phân quyền cho vai trò cụ thể
 * Permission: sa.iam.assignment.read
 */

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { PermissionGate, ModuleShell, EmptyState, usePermissions } from '../../_shared';
import { MOCK_ROLES, MOCK_ROLE_PERMISSION_ASSIGNMENTS, MOCK_PERMISSIONS } from '../mock-data';
import styles from './UserAssignmentsPage.module.css';

export default function RoleAssignmentsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();

  const canAssign = hasPermission('sa.iam.assignment.assign');
  const canRevoke = hasPermission('sa.iam.assignment.revoke');

  const role = MOCK_ROLES.find(r => r.id === id);
  const roleAssignments = MOCK_ROLE_PERMISSION_ASSIGNMENTS.filter(a => a.roleId === id);
  const assignedPermissions = roleAssignments
    .filter(a => a.status === 'active')
    .map(a => ({ ...MOCK_PERMISSIONS.find(p => p.id === a.permissionId), assignmentId: a.id }))
    .filter(Boolean);

  const availablePermissions = MOCK_PERMISSIONS.filter(
    perm => !assignedPermissions.some(ap => ap?.id === perm.id)
  );

  const [selectedPermission, setSelectedPermission] = useState<string>('');

  if (!role) {
    return (
      <ModuleShell title="Không tìm thấy vai trò">
        <p>Vai trò không tồn tại.</p>
      </ModuleShell>
    );
  }

  return (
    <PermissionGate permission="sa.iam.assignment.read">
      <ModuleShell
        title={`Phân quyền: ${role.name}`}
        subtitle={`Quản lý quyền hạn được gán cho vai trò ${role.code}`}
        breadcrumbs={[
          { label: 'Trang chủ', path: '/' },
          { label: 'Quản trị hệ thống', path: '/system-admin' },
          { label: 'IAM', path: '/system-admin/iam' },
          { label: 'Vai trò', path: '/system-admin/iam/roles' },
          { label: role.name }
        ]}
        actions={
          <button
            className={styles.buttonSecondary}
            onClick={() => navigate('/system-admin/iam/roles')}
          >
            <ArrowLeft size={18} />
            Quay lại
          </button>
        }
      >
        {/* Assign New Permission */}
        <div className={styles.assignSection}>
          <h3>Gán quyền mới</h3>
          <div className={styles.assignForm}>
            <select
              value={selectedPermission}
              onChange={(e) => setSelectedPermission(e.target.value)}
              className={styles.roleSelect}
              disabled={!canAssign || availablePermissions.length === 0}
            >
              <option value="">-- Chọn quyền hạn --</option>
              {availablePermissions.map(perm => (
                <option key={perm.id} value={perm.id}>
                  {perm.name} ({perm.code})
                </option>
              ))}
            </select>
            <button
              className={styles.buttonPrimary}
              disabled={!canAssign || !selectedPermission}
            >
              <Plus size={18} />
              Gán quyền
            </button>
          </div>
        </div>

        {/* Assigned Permissions */}
        <div className={styles.rolesSection}>
          <h3>Quyền hạn đã gán ({assignedPermissions.length})</h3>
          {assignedPermissions.length === 0 ? (
            <EmptyState
              title="Chưa có quyền"
              message="Vai trò này chưa được gán quyền hạn nào."
            />
          ) : (
            <div className={styles.rolesList}>
              {assignedPermissions.map((perm) => (
                <div key={perm?.id} className={styles.roleCard}>
                  <div className={styles.roleInfo}>
                    <div className={styles.roleName}>{perm?.name}</div>
                    <div className={styles.roleCode}>{perm?.code}</div>
                    <div className={styles.roleDescription}>{perm?.description}</div>
                    <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginTop: 'var(--spacing-xs)' }}>
                      <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>
                        Resource: <strong>{perm?.resource}</strong>
                      </span>
                      <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>
                        Action: <strong>{perm?.action}</strong>
                      </span>
                    </div>
                  </div>
                  <div className={styles.roleActions}>
                    <div className={styles.roleType}>
                      {perm?.isSystem ? (
                        <span className={styles.typeSystem}>System</span>
                      ) : (
                        <span className={styles.typeCustom}>Custom</span>
                      )}
                    </div>
                    <button
                      className={styles.revokeButton}
                      disabled={!canRevoke}
                      title="Thu hồi quyền"
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
