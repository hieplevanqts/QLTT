import { Navigate, RouteObject } from 'react-router-dom';
import { PermissionProtectedRoute } from '../app/components/auth/PermissionProtectedRoute';
import OverviewPage from '../pages/OverviewPage';
import MapPage from '../pages/MapPage';
import DataExportPage from '../pages/DataExportPage';
import DashboardPage from '../pages/DashboardPage';
import ReportsPage from '../pages/ReportsPage';
import AdminPage from '../pages/AdminPage';
import LeadRiskHome from '../pages/lead-risk/LeadRiskHome';
import EvidenceRoutes from '../app/routes/EvidenceRoutes';

/**
 * Main routes - overview, map, dashboard, reports, admin
 */
export const mainRoutes: RouteObject[] = [
  {
    index: true,
    element: <Navigate to="/overview" replace />,
  },
  {
    path: 'overview',
    element: <OverviewPage />,
  },
  {
    path: 'map',
    element: (
      <PermissionProtectedRoute>
        <MapPage />
      </PermissionProtectedRoute>
    ),
  },
  // Old routes - Redirect to Registry (Backward compatibility)
  {
    path: 'stores',
    element: <Navigate to="/registry/stores" replace />,
  },
  {
    path: 'data-export',
    element: <DataExportPage />,
  },
  {
    path: 'leads',
    element: (
      <PermissionProtectedRoute>
        <LeadRiskHome />
      </PermissionProtectedRoute>
    ),
  },
  {
    path: 'evidence/*',
    element: (
      <PermissionProtectedRoute>
        <EvidenceRoutes />
      </PermissionProtectedRoute>
    ),
  },
  {
    path: 'dashboard',
    element: <DashboardPage />,
  },
  {
    path: 'reports',
    element: <ReportsPage />,
  },
  {
    path: 'admin',
    element: (
      <PermissionProtectedRoute>
        <AdminPage />
      </PermissionProtectedRoute>
    ),
  },
];

