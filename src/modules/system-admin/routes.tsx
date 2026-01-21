import { Outlet } from "react-router-dom";

import { PermissionProtectedRoute } from "../../app/components/auth/PermissionProtectedRoute";
import ModuleDetailPage from "./pages/ModuleDetailPage";
import ModuleImportHistoryPage from "./pages/ModuleImportHistoryPage";
import ModuleImportPage from "./pages/ModuleImportPage";
import ModuleRegistryPage from "./pages/ModuleRegistryPage";
import ModuleUpdatePage from "./pages/ModuleUpdatePage";
import MenuRegistryPage from "./pages/MenuRegistryPage";

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
