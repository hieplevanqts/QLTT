import { RouteObject } from 'react-router-dom';
import { PermissionProtectedRoute } from '../app/components/auth/PermissionProtectedRoute';
import UserList from '../pages/system/UserList';
import RoleList from '../pages/system/RoleList';
import SystemSettings from '../pages/system/SystemSettings';

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

