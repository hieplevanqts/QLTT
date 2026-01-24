/**
 * SA IAM ROUTES
 * Routes cho module Identity & Access Management
 */

import React from 'react';
import { RouteObject } from 'react-router-dom';

// Pages
import {
  UsersPage,
  UserDetailPage,
  RolesPage,
  PermissionsPage,
  AssignmentsPage,
  UserAssignmentsPage,
  RoleAssignmentsPage,
  ModulesPage,
  MenusPage
} from './pages';

/**
 * Route configuration cho SA IAM
 * Base path: system-admin/iam
 */
export const saIamRoutes: RouteObject = {
  path: 'system-admin/iam',
  children: [
    // Users - Người dùng
    {
      path: 'users',
      element: <UsersPage />
      // Permission: sa.iam.user.read (checked in component)
    },
    {
      path: 'users/:id',
      element: <UserDetailPage />
      // Permission: sa.iam.user.read (checked in component)
    },
    
    // Roles - Vai trò
    {
      path: 'roles',
      element: <RolesPage />
      // Permission: sa.iam.role.read (checked in component)
    },
    
    // Permissions - Quyền hạn
    {
      path: 'permissions',
      element: <PermissionsPage />
      // Permission: sa.iam.permission.read (checked in component)
    },
    
    // Assignments - Phân quyền
    {
      path: 'assignments',
      element: <AssignmentsPage />
      // Permission: sa.iam.assignment.read (checked in component)
    },
    {
      path: 'assignments/users/:id',
      element: <UserAssignmentsPage />
      // Permission: sa.iam.assignment.read (checked in component)
      // Buttons require: sa.iam.assignment.assign, sa.iam.assignment.revoke
    },
    {
      path: 'assignments/roles/:id',
      element: <RoleAssignmentsPage />
      // Permission: sa.iam.assignment.read (checked in component)
      // Buttons require: sa.iam.assignment.assign, sa.iam.assignment.revoke
    },
    
    // Modules - Phân hệ
    {
      path: 'modules',
      element: <ModulesPage />
      // Permission: sa.iam.module.read (checked in component)
    },
    
    // Menus - Menu navigation
    {
      path: 'menus',
      element: <MenusPage />
      // Permission: sa.iam.menu.read (checked in component)
    }
  ]
};
