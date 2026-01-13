import { createBrowserRouter, Navigate } from 'react-router-dom';
import RootLayout from '../layouts/RootLayout';
import MainLayout from '../layouts/MainLayout';
import OverviewPage from '../pages/OverviewPage';
import MapPage from '../pages/MapPage';
import StoresListPage from '../pages/StoresListPage';
import StoreDetailPage from '../pages/StoreDetailPage';
import DataExportPage from '../pages/DataExportPage';
import LeadsPage from '../pages/LeadsPage';
import PlansPage from '../pages/PlansPage';
import TasksPage from '../pages/TasksPage';
import EvidenceRoutes from '../app/routes/EvidenceRoutes';
import ReportsPage from '../pages/ReportsPage';
import AdminPage from '../pages/AdminPage';
import Profile from '../pages/account/Profile';
import Preferences from '../pages/account/Preferences';
import ActivityLog from '../pages/account/ActivityLog';
import ChangePassword from '../pages/account/ChangePassword';
import { Login } from '../app/pages/auth/Login';
import { ProtectedRoute } from '../app/components/auth/ProtectedRoute';
import UserList from '../pages/system/UserList';
import RoleList from '../pages/system/RoleList';
import SystemSettings from '../pages/system/SystemSettings';
import Error404 from '../pages/system/Error404';

// Lead & Risk pages
import LeadInbox from '../pages/lead-risk/LeadInbox';
import LeadRiskHome from '../pages/lead-risk/LeadRiskHome';
import LeadList from '../pages/lead-risk/LeadList';
import LeadMapView from '../pages/lead-risk/LeadMapView';
import CreateLeadQuick from '../pages/lead-risk/CreateLeadQuick';
import CreateLeadFull from '../pages/lead-risk/CreateLeadFull';
import RiskDashboard from '../pages/lead-risk/RiskDashboard';
import LeadDetail from '../pages/lead-risk/LeadDetail';
import RiskDetail from '../pages/lead-risk/RiskDetail';
import HotspotExplorer from '../pages/lead-risk/HotspotExplorer';
import Watchlist from '../pages/lead-risk/Watchlist';
import QualityMetrics from '../pages/lead-risk/QualityMetrics';
import WorkloadDashboard from '../pages/lead-risk/WorkloadDashboard';
import SLADashboard from '../pages/lead-risk/SLADashboard';
import PermissionMatrix from '../pages/lead-risk/PermissionMatrix';
import DuplicateDetector from '../pages/lead-risk/DuplicateDetector';
import EscalationForm from '../pages/lead-risk/EscalationForm';
import VerificationOutcome from '../pages/lead-risk/VerificationOutcome';
import EntityRiskProfile from '../pages/lead-risk/EntityRiskProfile';
import AlertFeed from '../pages/lead-risk/AlertFeed';
import AlertAcknowledgement from '../pages/lead-risk/AlertAcknowledgement';
import RiskIndicators from '../pages/lead-risk/RiskIndicators';
import ImportLeads from '../pages/lead-risk/ImportLeads';
import ImportReview from '../pages/lead-risk/ImportReview';
import AssignmentDispatch from '../pages/lead-risk/AssignmentDispatch';

// Wrapper component for protected routes
function ProtectedLayout() {
  return (
    <ProtectedRoute>
      <MainLayout />
    </ProtectedRoute>
  );
}

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      // Auth routes (no layout)
      {
        path: '/auth/login',
        element: <Login />,
      },

      // Main app routes (with layout + protected)
      {
        path: '/',
        element: <ProtectedLayout />,
        children: [
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
            element: <MapPage />,
          },
          {
            path: 'stores',
            element: <StoresListPage />,
          },
          {
            path: 'stores/:id',
            element: <StoreDetailPage />,
          },
          {
            path: 'data-export',
            element: <DataExportPage />,
          },
          {
            path: 'leads',
            element: <LeadRiskHome />,
          },
          {
            path: 'plans',
            element: <PlansPage />,
          },
          {
            path: 'tasks',
            element: <TasksPage />,
          },
          {
            path: 'evidence/*',
            element: <EvidenceRoutes />,
          },
          {
            path: 'reports',
            element: <ReportsPage />,
          },
          {
            path: 'admin',
            element: <AdminPage />,
          },
          // Account pages
          {
            path: 'account/profile',
            element: <Profile />,
          },
          {
            path: 'account/preferences',
            element: <Preferences />,
          },
          {
            path: 'account/activity-log',
            element: <ActivityLog />,
          },
          {
            path: 'account/change-password',
            element: <ChangePassword />,
          },
          // System pages
          {
            path: 'system/users',
            element: <UserList />,
          },
          {
            path: 'system/roles',
            element: <RoleList />,
          },
          {
            path: 'system/settings',
            element: <SystemSettings />,
          },
          // Lead & Risk pages
          {
            path: 'lead-risk/inbox',
            element: <LeadInbox />,
          },
          {
            path: 'lead-risk/home',
            element: <LeadRiskHome />,
          },
          {
            path: 'lead-risk/list',
            element: <LeadList />,
          },
          {
            path: 'lead-risk/map',
            element: <LeadMapView />,
          },
          {
            path: 'lead-risk/create-lead-quick',
            element: <CreateLeadQuick />,
          },
          {
            path: 'lead-risk/create-lead-full',
            element: <CreateLeadFull />,
          },
          {
            path: 'lead-risk/dashboard',
            element: <RiskDashboard />,
          },
          {
            path: 'lead-risk/lead/:id',
            element: <LeadDetail />,
          },
          {
            path: 'lead-risk/risk/:id',
            element: <RiskDetail />,
          },
          {
            path: 'lead-risk/hotspots',
            element: <HotspotExplorer />,
          },
          {
            path: 'lead-risk/watchlist',
            element: <Watchlist />,
          },
          {
            path: 'lead-risk/quality-metrics',
            element: <QualityMetrics />,
          },
          {
            path: 'lead-risk/workload-dashboard',
            element: <WorkloadDashboard />,
          },
          {
            path: 'lead-risk/sla-dashboard',
            element: <SLADashboard />,
          },
          {
            path: 'lead-risk/permission-matrix',
            element: <PermissionMatrix />,
          },
          {
            path: 'lead-risk/duplicate-detector',
            element: <DuplicateDetector />,
          },
          {
            path: 'lead-risk/escalation-form',
            element: <EscalationForm />,
          },
          {
            path: 'lead-risk/verification-outcome',
            element: <VerificationOutcome />,
          },
          {
            path: 'lead-risk/entity-risk-profile',
            element: <EntityRiskProfile />,
          },
          {
            path: 'lead-risk/alert-feed',
            element: <AlertFeed />,
          },
          {
            path: 'lead-risk/alert-acknowledgement/:id',
            element: <AlertAcknowledgement />,
          },
          {
            path: 'lead-risk/risk-indicators',
            element: <RiskIndicators />,
          },
          {
            path: 'lead-risk/import-leads',
            element: <ImportLeads />,
          },
          {
            path: 'lead-risk/import-review',
            element: <ImportReview />,
          },
          {
            path: 'lead-risk/assignment-dispatch',
            element: <AssignmentDispatch />,
          },
        ],
      },
      // Catch all - redirect to 404
      {
        path: '*',
        element: <Error404 />,
      },
    ],
  },
]);