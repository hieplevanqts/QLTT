import { Navigate, RouteObject } from 'react-router-dom';
import { PermissionProtectedRoute } from '@/components/auth/PermissionProtectedRoute';
import { OverviewPage, DashboardPage } from '@/modules/overview';
import { MapPage } from '@/modules/map';
import { DataExportPage, ReportsPage } from '@/modules/reports';
import LeadRiskHome from '@/modules/leads/pages/lead-risk/LeadRiskHome';
import EvidenceRoutes from './EvidenceRoutes';

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
    element: <Navigate to="/system-admin" replace />,
  },
];

