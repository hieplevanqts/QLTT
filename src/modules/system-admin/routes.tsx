import React from "react";
import { Outlet, type RouteObject } from "react-router-dom";

import { PermissionProtectedRoute } from "../../app/components/auth/PermissionProtectedRoute";

const ModuleDetailPage = React.lazy(() => import("./pages/ModuleDetailPage"));
const ModuleImportHistoryPage = React.lazy(() => import("./pages/ModuleImportHistoryPage"));
const ModuleImportPage = React.lazy(() => import("./pages/ModuleImportPage"));
const ModuleRegistryPage = React.lazy(() => import("./pages/ModuleRegistryPage"));
const SystemAdminDashboardPage = React.lazy(() => import("./pages/SystemAdminDashboardPage"));
const ModuleUpdatePage = React.lazy(() => import("./pages/ModuleUpdatePage"));
const MenuRegistryPage = React.lazy(() => import("./pages/MenuRegistryPage"));

export const systemModulesRoute = {
  path: "system",
  element: (
    <PermissionProtectedRoute requiredPermission="ADMIN_VIEW">
      <Outlet />
    </PermissionProtectedRoute>
  ),
  children: [
    { path: "modules", element: <ModuleRegistryPage /> },
    { path: "modules/import", element: <ModuleImportPage /> },
    { path: "modules/history", element: <ModuleImportHistoryPage /> },
    { path: "modules/:id/update", element: <ModuleUpdatePage /> },
    { path: "modules/:id", element: <ModuleDetailPage /> },
    { path: "menus", element: <MenuRegistryPage /> },
  ],
};

export const systemAdminDashboardRoute: RouteObject = {
  path: "system-admin",
  element: (
    <PermissionProtectedRoute requiredPermission="ADMIN_VIEW">
      <SystemAdminDashboardPage />
    </PermissionProtectedRoute>
  ),
};
