/**
 * USE PERMISSIONS HOOK - System Admin Shared
 * Hook để kiểm tra quyền hạn của user hiện tại
 */

import { useAuth } from '../../../contexts/AuthContext';

export function usePermissions() {
  const { user } = useAuth();

  // Check if user is qt_admin (full access to all system-admin functions)
  const isQtAdmin = user?.username?.toLowerCase() === 'qt_admin';

  // Mock permissions - trong thực tế sẽ lấy từ user.permissions
  // Format: ['sa.masterdata.orgunit.read', 'sa.masterdata.orgunit.create', ...]
  const userPermissions: string[] = isQtAdmin 
    ? [
        // qt_admin has ALL permissions - full CRUD on all modules
        'sa.masterdata.orgunit.read',
        'sa.masterdata.orgunit.create',
        'sa.masterdata.orgunit.update',
        'sa.masterdata.orgunit.delete',
        'sa.masterdata.department.read',
        'sa.masterdata.department.create',
        'sa.masterdata.department.update',
        'sa.masterdata.department.delete',
        'sa.masterdata.jurisdiction.read',
        'sa.masterdata.jurisdiction.create',
        'sa.masterdata.jurisdiction.update',
        'sa.masterdata.jurisdiction.delete',
        'sa.masterdata.catalog.read',
        'sa.masterdata.catalog.create',
        'sa.masterdata.catalog.update',
        'sa.masterdata.catalog.delete',
        'sa.iam.user.read',
        'sa.iam.user.create',
        'sa.iam.user.update',
        'sa.iam.user.delete',
        'sa.iam.role.read',
        'sa.iam.role.create',
        'sa.iam.role.update',
        'sa.iam.role.delete',
        'sa.iam.permission.read',
        'sa.iam.assignment.read',
        'sa.iam.assignment.create',
        'sa.iam.assignment.delete',
        'sa.config.parameter.read',
        'sa.config.parameter.update',
        'sa.config.organization.read',
        'sa.config.organization.update',
        'sa.config.security.read',
        'sa.config.security.update',
        'sa.config.backup.read',
        'sa.config.backup.create',
        'sa.config.backup.restore',
        'sa.config.backup.delete'
      ]
    : (user?.permissions || [
        // Default permissions cho testing (limited access)
        'sa.masterdata.orgunit.read',
        'sa.masterdata.orgunit.create',
        'sa.masterdata.orgunit.update',
        'sa.masterdata.department.read',
        'sa.masterdata.department.create',
        'sa.masterdata.jurisdiction.read',
        'sa.masterdata.catalog.read',
        'sa.masterdata.catalog.update',
      ]);

  const hasAdminAccess =
    userPermissions.includes('admin:access') || userPermissions.includes('ADMIN_VIEW');

  // Allow mapping between legacy sa.* permissions and new USER.* codes from DB
  const permissionAliases: Record<string, string[]> = {
    'sa.iam.user.delete': ['USER.DELETE', 'user.delete', 'USER_DELETE'],
    'sa.iam.user.update': ['USER.UPDATE', 'user.update', 'USER_UPDATE'],
    'sa.iam.user.create': ['USER.CREATE', 'user.create', 'USER_CREATE'],
    'sa.iam.user.read': ['USER.READ', 'user.read', 'USER_READ', 'USER.VIEW'],
  };

  const hasPermissionDirect = (permission: string): boolean => {
    if (userPermissions.includes(permission)) return true;
    const aliases = permissionAliases[permission];
    if (!aliases) return false;
    return aliases.some((alias) => userPermissions.includes(alias));
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
