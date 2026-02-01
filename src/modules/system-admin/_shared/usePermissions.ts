/**
 * USE PERMISSIONS HOOK - System Admin Shared
 * Hook to check permissions for the current user
 */

import { useAppSelector } from '@/hooks/useAppStore';
import { useIamIdentity } from '@/shared/iam/useIamIdentity';
import { RootState } from '../../../store/rootReducer';

export function usePermissions() {
  const { user } = useAppSelector((state: RootState) => state.auth);
  const { isSuperAdmin: iamSuperAdmin, roleCodes: iamRoleCodes, primaryRoleCode } = useIamIdentity();

  // Temporary hard-override permissions for a specific user email
  // NOTE: Prefer storing permissions in DB (roles -> role_permissions -> permissions) long-term.
  const ADMIN3_EMAIL = 'admin3@vhv.vn';
  const ADMIN3_EXTRA_PERMISSIONS = [
    'map.page.read',
    'map.page.edit',
    'STORES_VIEW',
    'LEAD_RISK',
    'PLAN_VIEW',
    'TASKS_VIEW',
    'EVIDENCE_VIEW',
    'ADMIN_VIEW',
    'TV_VIEW',
  ] as const;

  const roleCodesFromUser = [
    ...(user?.roleCodes ?? []),
    user?.roleCode,
    (user as any)?.role?.code,
  ]
    .filter(Boolean)
    .map((code) => String(code).toLowerCase());

  const roleCodesFromIam = [
    ...(iamRoleCodes ?? []),
    primaryRoleCode,
  ]
    .filter(Boolean)
    .map((code) => String(code).toLowerCase());

  const isSuperAdmin =
    iamSuperAdmin ||
    roleCodesFromUser.includes('super-admin') ||
    roleCodesFromIam.includes('super-admin');

  // Permissions must come from DB (roles -> role_permissions -> permissions).
  const baseUserPermissions: string[] = (user?.permissions || []).filter(Boolean);

  // Add extra permissions if the logged-in user's email matches
  const extraPermissions: string[] =
      (user?.email || '').toLowerCase() === ADMIN3_EMAIL ? [...ADMIN3_EXTRA_PERMISSIONS] : [];

  // Merge + de-duplicate
  const userPermissions: string[] = Array.from(new Set([...baseUserPermissions, ...extraPermissions]));
  const normalizedPermissions = new Set(userPermissions.map((p) => p.toUpperCase()));

  const hasAdminAccess =
      normalizedPermissions.has('ADMIN:ACCESS') || normalizedPermissions.has('ADMIN_VIEW');

  // Allow mapping between legacy sa.* permissions and new USER.* codes from DB
  const permissionAliases: Record<string, string[]> = {
    'sa.iam.user.delete': ['USER.DELETE', 'user.delete', 'USER_DELETE'],
    'sa.iam.user.update': ['USER.UPDATE', 'user.update', 'USER_UPDATE'],
    'sa.iam.user.create': ['USER.CREATE', 'user.create', 'USER_CREATE'],
    'sa.iam.user.read': ['USER.READ', 'user.read', 'USER_READ', 'USER.VIEW'],
    'map.page.read': ['USER.READ', 'user.read', 'USER_READ', 'MAP_VIEW'],
    'map.page.edit': ['MAP_EDIT', 'USER_UPDATE'],
  };

  const hasPermissionDirect = (permission: string): boolean => {
    const normalized = permission.toUpperCase();
    if (normalizedPermissions.has(normalized)) return true;
    const aliases = permissionAliases[permission];
    if (!aliases) return false;
    return aliases.some((alias) => normalizedPermissions.has(alias.toUpperCase()));
  };

  /**
   * Check a specific permission
   */
  const hasPermission = (permission: string): boolean => {
    if (isSuperAdmin) return true;
    if (hasAdminAccess && permission.startsWith('sa.')) {
      return true;
    }
    return hasPermissionDirect(permission);
  };

  /**
   * Check at least one of the permissions
   */
  const hasAnyPermission = (permissions: string[]): boolean => {
    if (isSuperAdmin) return true;
    if (hasAdminAccess && permissions.some((p) => p.startsWith('sa.'))) {
      return true;
    }
    return permissions.some((p) => hasPermissionDirect(p));
  };

  /**
   * Check all permissions
   */
  const hasAllPermissions = (permissions: string[]): boolean => {
    if (isSuperAdmin) return true;
    if (hasAdminAccess && permissions.every((p) => p.startsWith('sa.'))) {
      return true;
    }
    return permissions.every((p) => hasPermissionDirect(p));
  };

  /**
   * Check permissions by pattern (wildcard)
   * Example: hasPermissionPattern('sa.masterdata.*') matches all masterdata permissions
   */
  const hasPermissionPattern = (pattern: string): boolean => {
    if (isSuperAdmin) return true;
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
    return userPermissions.some((p) => regex.test(p));
  };

  return {
    userPermissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasPermissionPattern,
  };
}
