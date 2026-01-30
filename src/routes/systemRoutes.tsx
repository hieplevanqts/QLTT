import { RouteObject } from 'react-router-dom';
import { PermissionProtectedRoute } from '@/components/auth/PermissionProtectedRoute';
import UserList from '@/modules/system-admin/pages/legacy-system/UserList';
import RoleList from '@/modules/system-admin/pages/legacy-system/RoleList';
import SystemSettings from '@/modules/system-admin/pages/legacy-system/SystemSettings';

/**
 * System routes
 */
export const systemRoutes: RouteObject[] = [
  {
    path: 'system/users',
    element: (
      <PermissionProtectedRoute>
        <UserList />
      </PermissionProtectedRoute>
    ),
  },
  {
    path: 'system/roles',
    element: (
      <PermissionProtectedRoute>
        <RoleList />
      </PermissionProtectedRoute>
    ),
  },
  {
    path: 'system/settings',
    element: (
      <PermissionProtectedRoute>
        <SystemSettings />
      </PermissionProtectedRoute>
    ),
  },
];


