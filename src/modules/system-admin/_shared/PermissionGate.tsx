/**
 * PERMISSION GATE - System Admin Shared
 * Kiểm tra quyền trước khi render children
 */

import React from 'react';
import { usePermissions } from './usePermissions';
import styles from './PermissionGate.module.css';

interface PermissionGateProps {
  permission: string | string[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
  requireAll?: boolean; // true = cần tất cả quyền, false = cần ít nhất 1 quyền
}

export function PermissionGate({
  permission,
  fallback,
  children,
  requireAll = false
}: PermissionGateProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions();

  let hasAccess = false;

  if (Array.isArray(permission)) {
    hasAccess = requireAll
      ? hasAllPermissions(permission)
      : hasAnyPermission(permission);
  } else {
    hasAccess = hasPermission(permission);
  }

  if (!hasAccess) {
    if (fallback) {
      return fallback as React.ReactElement;
    }

    return (
      <div className={styles.denied}>
        <div className={styles.deniedIcon}>🔒</div>
        <h3 className={styles.deniedTitle}>Không có quyền truy cập</h3>
        <p className={styles.deniedMessage}>
          Bạn không có quyền để xem nội dung này. Vui lòng liên hệ quản trị viên.
        </p>
      </div>
    );
  }

  return children as React.ReactElement;
}