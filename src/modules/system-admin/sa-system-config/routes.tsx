/**
 * SA SYSTEM CONFIG ROUTES
 * Routes cho module System Configuration
 */

import React from 'react';
import { RouteObject } from 'react-router-dom';

const ParametersPage = React.lazy(() => import('./pages/ParametersPage'));
const OrganizationInfoPage = React.lazy(() => import('./pages/OrganizationInfoPage'));
const OperationsPage = React.lazy(() => import('./pages/OperationsPage'));
const NotificationsPage = React.lazy(() => import('./pages/NotificationsPage'));
const SecurityPage = React.lazy(() => import('./pages/SecurityPage'));
const DatabaseLogsPage = React.lazy(() => import('./pages/DatabaseLogsPage'));
const DatabaseBackupsPage = React.lazy(() => import('./pages/DatabaseBackupsPage'));

/**
 * Route configuration cho SA System Config
 * Base path: system-admin/system-config
 */
export const saSystemConfigRoutes: RouteObject = {
  path: 'system-admin/system-config',
  children: [
    // Parameters - Thông số hệ thống
    {
      path: 'parameters',
      element: <ParametersPage />
      // Permission: sa.sysconfig.param.read (checked in component)
      // Buttons require: sa.sysconfig.param.update
    },
    
    // Organization Info - Thông tin tổ chức
    {
      path: 'organization-info',
      element: <OrganizationInfoPage />
      // Permission: sa.sysconfig.orginfo.read (checked in component)
      // Buttons require: sa.sysconfig.orginfo.update
    },
    
    // Operations - Cài đặt vận hành
    {
      path: 'operations',
      element: <OperationsPage />
      // Permission: sa.sysconfig.ops.read (checked in component)
      // Buttons require: sa.sysconfig.ops.update
    },
    
    // Notifications - Mẫu thông báo
    {
      path: 'notifications',
      element: <NotificationsPage />
      // Permission: sa.sysconfig.notify.read (checked in component)
      // Buttons require: sa.sysconfig.notify.create, sa.sysconfig.notify.update
    },
    
    // Security - Cài đặt bảo mật
    {
      path: 'security',
      element: <SecurityPage />
      // Permission: sa.sysconfig.security.read (checked in component)
      // Buttons require: sa.sysconfig.security.update
    },
    
    // Database Logs
    {
      path: 'database/logs',
      element: <DatabaseLogsPage />
      // Permission: sa.sysconfig.db.log.read (checked in component)
      // Buttons require: sa.sysconfig.db.log.export
    },
    
    // Database Backups
    {
      path: 'database/backups',
      element: <DatabaseBackupsPage />
      // Permission: sa.sysconfig.db.backup.read (checked in component)
      // Buttons require: sa.sysconfig.db.backup.create, sa.sysconfig.db.backup.restore
    }
  ]
};
