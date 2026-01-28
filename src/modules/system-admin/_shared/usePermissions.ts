/**
 * USE PERMISSIONS HOOK - System Admin Shared
 * Hook để kiểm tra quyền hạn của user hiện tại
 */

import { useAuth } from '../../../contexts/AuthContext';

export function usePermissions() {
  const { user } = useAuth();

  // Permissions must come from DB (roles -> role_permissions -> permissions).
  const userPermissions: string[] = (user?.permissions || []).filter(Boolean);
  const normalizedPermissions = new Set(userPermissions.map((p) => p.toUpperCase()));

  const hasAdminAccess =
    normalizedPermissions.has('ADMIN:ACCESS') || normalizedPermissions.has('ADMIN_VIEW');

  // Allow mapping between legacy sa.* permissions and new USER.* codes from DB
  const permissionAliases: Record<string, string[]> = {
    'sa.iam.user.delete': ['USER.DELETE', 'user.delete', 'USER_DELETE'],
    'sa.iam.user.update': ['USER.UPDATE', 'user.update', 'USER_UPDATE'],
    'sa.iam.user.create': ['USER.CREATE', 'user.create', 'USER_CREATE'],
    'sa.iam.user.read': ['USER.READ', 'user.read', 'USER_READ', 'USER.VIEW'],
  };

  const hasPermissionDirect = (permission: string): boolean => {
    const normalized = permission.toUpperCase();
    if (normalizedPermissions.has(normalized)) return true;
    const aliases = permissionAliases[permission];
    if (!aliases) return false;
    return aliases.some((alias) => normalizedPermissions.has(alias.toUpperCase()));
  };

  /**
   * Kiểm tra có quyền cụ thể
   */
  const hasPermission = (permission: string): boolean => {
    if (hasAdminAccess && permission.startsWith('sa.')) {
      return true;
    }
    return hasPermissionDirect(permission);
  };

  /**
   * Kiểm tra có ít nhất 1 trong các quyền
   */
  const hasAnyPermission = (permissions: string[]): boolean => {
    if (hasAdminAccess && permissions.some((p) => p.startsWith('sa.'))) {
      return true;
    }
    return permissions.some((p) => hasPermissionDirect(p));
  };

  /**
   * Kiểm tra có tất cả các quyền
   */
  const hasAllPermissions = (permissions: string[]): boolean => {
    if (hasAdminAccess && permissions.every((p) => p.startsWith('sa.'))) {
      return true;
    }
    return permissions.every((p) => hasPermissionDirect(p));
  };

  /**
   * Kiểm tra có quyền theo pattern (wildcard)
   * Ví dụ: hasPermissionPattern('sa.masterdata.*') sẽ match tất cả quyền masterdata
   */
  const hasPermissionPattern = (pattern: string): boolean => {
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
    return userPermissions.some(p => regex.test(p));
  };

  return {
    userPermissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasPermissionPattern,
  };
}
