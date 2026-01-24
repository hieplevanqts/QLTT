import { Navigate, Outlet, createBrowserRouter } from 'react-router-dom';
import RootLayout from '../layouts/RootLayout';
import MainLayout from '../layouts/MainLayout';
import OverviewPage from '../pages/OverviewPage';
import MapPage from '../pages/MapPage';
import StoreDetailPage from '../pages/StoreDetailPage';
import DataExportPage from '../pages/DataExportPage';

// Registry pages
import RegistryHomePage from '../pages/registry/RegistryHomePage';
import RegistryStoreListPage from '../pages/registry/RegistryStoreListPage';
import RegistryDedupWorkbenchPage from '../pages/registry/RegistryDedupWorkbenchPage';
import RegistryVerificationQueuePage from '../pages/registry/RegistryVerificationQueuePage';
import RegistryVerificationDetailPage from '../pages/registry/RegistryVerificationDetailPage';
import RegistryApprovalQueuePage from '../pages/registry/RegistryApprovalQueuePage';
import RegistryApprovalDetailPage from '../pages/registry/RegistryApprovalDetailPage';
import RegistryImportPage from '../pages/registry/RegistryImportPage';
import RegistryImportReviewPage from '../pages/registry/RegistryImportReviewPage';
import RegistryAuditLogPage from '../pages/registry/RegistryAuditLogPage';
import EditRegistryPage from '../pages/EditRegistryPage';
import FullEditRegistryPage from '../pages/FullEditRegistryPage';
import EvidenceRoutes from '../app/routes/EvidenceRoutes';
import ReportsPage from '../pages/ReportsPage';
import DashboardPage from '../pages/DashboardPage';
import AdminPage from '../pages/AdminPage';
import Profile from '../pages/account/Profile';
import Preferences from '../pages/account/Preferences';
import ActivityLog from '../pages/account/ActivityLog';
import ChangePassword from '../pages/account/ChangePassword';
import { Login } from '../app/pages/auth/Login';
import { ProtectedRoute } from '../app/components/auth/ProtectedRoute';
import { PermissionProtectedRoute } from '../app/components/auth/PermissionProtectedRoute';
import UserList from '../pages/system/UserList';
import RoleList from '../pages/system/RoleList';
import SystemSettings from '../pages/system/SystemSettings';
import Error404 from '../pages/system/Error404';
import { systemAdminDashboardRoute } from '../modules/system-admin/routes';
import { saMasterDataRoutes } from '../modules/system-admin/sa-master-data';
import { saIamRoutes } from '../modules/system-admin/sa-iam';
import { saSystemConfigRoutes } from '../modules/system-admin/sa-system-config';
// Plans module - moved to /src/app/pages/plans/
import { PlansProvider } from '../app/contexts/PlansContext';
import { PlansList } from '../app/pages/plans/PlansList';
import { PlanCreate } from '../app/pages/plans/PlanCreate';
import { PlanDetail } from '../app/pages/plans/PlanDetail';
import { PlanTaskBoard } from '../app/pages/plans/PlanTaskBoard';
import { InspectionRoundsList } from '../app/pages/inspections/InspectionRoundsList';
import InspectionRoundDetail from '../app/pages/inspections/InspectionRoundDetail';
import InspectionRoundCreate from '../app/pages/inspections/InspectionRoundCreate';
import InspectionRoundStatistics from '../app/pages/inspections/InspectionRoundStatistics';
import { InspectionTasksList } from '../app/pages/tasks/InspectionTasksList';
import { TaskBoard } from '../app/pages/tasks/TaskBoard';
import TvWallboardPage from '../app/pages/TvWallboardPage';

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
import CaseDetail from '../pages/lead-risk/CaseDetail';
import HotspotExplorer from '../pages/lead-risk/HotspotExplorer';
import SLAOperationMap from '../pages/lead-risk/SLAOperationMap';
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
import { installedRoutes } from '../imports/installedModules';

import { InspectionRoundsProvider } from '../contexts/InspectionRoundsContext';

// Wrapper component for protected routes
function ProtectedLayout() {
  return (
    <PlansProvider>
      <InspectionRoundsProvider>
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      </InspectionRoundsProvider>
    </PlansProvider>
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

      // TV Wallboard Mode (requires auth, permission, but no layout)
      {
        path: '/tv',
        element: (
          <PermissionProtectedRoute>
            <TvWallboardPage />
          </PermissionProtectedRoute>
        ),
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
            path: 'plans',
            element: <Navigate to="/plans/list" replace />,
          },
          // Kế hoạch tác nghiệp routes
          {
            path: 'plans/list',
            element: (
              <PermissionProtectedRoute>
                <PlansList />
              </PermissionProtectedRoute>
            ),
          },
          {
            path: 'plans/create-new',
            element: (
              <PermissionProtectedRoute>
                <PlanCreate />
              </PermissionProtectedRoute>
            ),
          },
          {
            path: 'plans/:planId',
            element: (
              <PermissionProtectedRoute>
                <PlanDetail />
              </PermissionProtectedRoute>
            ),
          },
          {
            path: 'plans/:planId/edit',
            element: (
              <PermissionProtectedRoute>
                <PlanCreate /> {/* Reuse create component for edit */}
              </PermissionProtectedRoute>
            ),
          },
          {
            path: 'plans/:planId/inspection-session-board',
            element: (
              <PermissionProtectedRoute>
                <PlanTaskBoard />
              </PermissionProtectedRoute>
            ),
          },
          {
            path: 'plans/inspection-session',
            element: (
              <PermissionProtectedRoute>
                <TaskBoard />
              </PermissionProtectedRoute>
            ),
          },
          {
            path: 'plans/task-board',
            element: (
              <PermissionProtectedRoute>
                <PlanTaskBoard />
              </PermissionProtectedRoute>
            ),
          },
          // Inspection rounds routes - now under /plans
          {
            path: 'plans/inspection-rounds',
            element: (
              <PermissionProtectedRoute>
                <InspectionRoundsList />
              </PermissionProtectedRoute>
            ),
          },
          {
            path: 'plans/inspection-rounds/create-new',
            element: (
              <PermissionProtectedRoute>
                <InspectionRoundCreate />
              </PermissionProtectedRoute>
            ),
          },
          {
            path: 'plans/inspection-rounds/:roundId',
            element: (
              <PermissionProtectedRoute>
                <InspectionRoundDetail />
              </PermissionProtectedRoute>
            ),
          },
          {
            path: 'plans/inspection-rounds/:roundId/statistics',
            element: (
              <PermissionProtectedRoute>
                <InspectionRoundStatistics />
              </PermissionProtectedRoute>
            ),
          },
          {
            path: 'plans/inspection-rounds/:roundId/tasks',
            element: (
              <PermissionProtectedRoute>
                <InspectionTasksList />
              </PermissionProtectedRoute>
            ),
          },
          {
            path: 'tasks',
            element: (
              <PermissionProtectedRoute>
                <InspectionTasksList />
              </PermissionProtectedRoute>
            ),
          },
          {
            path: 'tasks/board',
            element: (
              <PermissionProtectedRoute>
                <TaskBoard />
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
          systemAdminDashboardRoute,
          saMasterDataRoutes,
          saIamRoutes,
          saSystemConfigRoutes,
          ...installedRoutes,
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
          // Registry routes
          {
            path: 'registry',
            children: [
              {
                index: true,
                element: <RegistryHomePage />,
              },
              {
                path: 'stores',
                element: <RegistryStoreListPage />,
              },
              {
                path: 'stores/:id',
                element: <StoreDetailPage />,
              },
              {
                path: 'full-edit/:id',
                element: <FullEditRegistryPage />,
              },
              {
                path: 'edit/:id',
                element: <EditRegistryPage />,
              },
              // TODO: Add nested store routes
              // {
              //   path: 'stores/map',
              //   element: <RegistryStoreMapSplitPage />,
              // },
              // {
              //   path: 'stores/new',
              //   element: <RegistryStoreCreateWizardPage />,
              // },
              // {
              //   path: 'stores/:storeId',
              //   element: <RegistryStoreDetailPage />,
              // },
              // {
              //   path: 'stores/:storeId/edit',
              //   element: <RegistryStoreEditPage />,
              // },
              {
                path: 'dedup',
                element: <RegistryDedupWorkbenchPage />,
              },
              {
                path: 'verification',
                element: <RegistryVerificationQueuePage />,
              },
              {
                path: 'verification/:caseId',
                element: <RegistryVerificationDetailPage />,
              },
              {
                path: 'approvals',
                element: <RegistryApprovalQueuePage />,
              },
              {
                path: 'approvals/:approvalId',
                element: <RegistryApprovalDetailPage />,
              },
              {
                path: 'import',
                element: <RegistryImportPage />,
              },
              {
                path: 'import-review',
                element: <RegistryImportReviewPage />,
              },
              {
                path: 'import/review/:jobId',
                element: <RegistryImportReviewPage />,
              },
              {
                path: 'audit',
                element: <RegistryAuditLogPage />,
              },
            ],
          },
          // Lead & Risk pages
          {
            path: 'lead-risk/inbox',
            element: (
              <PermissionProtectedRoute>
                <LeadInbox />
              </PermissionProtectedRoute>
            ),
          },
          {
            path: 'lead-risk/home',
            element: (
              <PermissionProtectedRoute>
                <LeadRiskHome />
              </PermissionProtectedRoute>
            ),
          },
          {
            path: 'lead-risk/list',
            element: (
              <PermissionProtectedRoute>
                <LeadList />
              </PermissionProtectedRoute>
            ),
          },
          {
            path: 'lead-risk/map',
            element: (
              <PermissionProtectedRoute>
                <LeadMapView />
              </PermissionProtectedRoute>
            ),
          },
          {
            path: 'lead-risk/create-lead-quick',
            element: (
              <PermissionProtectedRoute>
                <CreateLeadQuick />
              </PermissionProtectedRoute>
            ),
          },
          {
            path: 'lead-risk/create-lead-full',
            element: (
              <PermissionProtectedRoute>
                <CreateLeadFull />
              </PermissionProtectedRoute>
            ),
          },
          {
            path: 'lead-risk/dashboard',
            element: (
              <PermissionProtectedRoute>
                <RiskDashboard />
              </PermissionProtectedRoute>
            ),
          },
          {
            path: 'lead-risk/lead/:id',
            element: (
              <PermissionProtectedRoute>
                <LeadDetail />
              </PermissionProtectedRoute>
            ),
          },
          {
            path: 'lead-risk/risk/:id',
            element: (
              <PermissionProtectedRoute>
                <RiskDetail />
              </PermissionProtectedRoute>
            ),
          },
          {
            path: 'lead-risk/case/:id',
            element: (
              <PermissionProtectedRoute>
                <CaseDetail />
              </PermissionProtectedRoute>
            ),
          },
          {
            path: 'lead-risk/hotspots',
            element: (
              <PermissionProtectedRoute>
                <HotspotExplorer />
              </PermissionProtectedRoute>
            ),
          },
          {
            path: 'lead-risk/sla-operation-map',
            element: (
              <PermissionProtectedRoute>
                <SLAOperationMap />
              </PermissionProtectedRoute>
            ),
          },
          {
            path: 'lead-risk/watchlist',
            element: (
              <PermissionProtectedRoute>
                <Watchlist />
              </PermissionProtectedRoute>
            ),
          },
          {
            path: 'lead-risk/quality-metrics',
            element: (
              <PermissionProtectedRoute>
                <QualityMetrics />
              </PermissionProtectedRoute>
            ),
          },
          {
            path: 'lead-risk/workload-dashboard',
            element: (
              <PermissionProtectedRoute>
                <WorkloadDashboard />
              </PermissionProtectedRoute>
            ),
          },
          {
            path: 'lead-risk/sla-dashboard',
            element: (
              <PermissionProtectedRoute>
                <SLADashboard />
              </PermissionProtectedRoute>
            ),
          },
          {
            path: 'lead-risk/permission-matrix',
            element: (
              <PermissionProtectedRoute>
                <PermissionMatrix />
              </PermissionProtectedRoute>
            ),
          },
          {
            path: 'lead-risk/duplicate-detector',
            element: (
              <PermissionProtectedRoute>
                <DuplicateDetector />
              </PermissionProtectedRoute>
            ),
          },
          {
            path: 'lead-risk/escalation-form',
            element: (
              <PermissionProtectedRoute>
                <EscalationForm />
              </PermissionProtectedRoute>
            ),
          },
          {
            path: 'lead-risk/verification-outcome',
            element: (
              <PermissionProtectedRoute>
                <VerificationOutcome />
              </PermissionProtectedRoute>
            ),
          },
          {
            path: 'lead-risk/entity-risk-profile',
            element: (
              <PermissionProtectedRoute>
                <EntityRiskProfile />
              </PermissionProtectedRoute>
            ),
          },
          {
            path: 'lead-risk/alert-feed',
            element: (
              <PermissionProtectedRoute>
                <AlertFeed />
              </PermissionProtectedRoute>
            ),
          },
          {
            path: 'lead-risk/alert-acknowledgement/:id',
            element: (
              <PermissionProtectedRoute>
                <AlertAcknowledgement />
              </PermissionProtectedRoute>
            ),
          },
          {
            path: 'lead-risk/risk-indicators',
            element: (
              <PermissionProtectedRoute>
                <RiskIndicators />
              </PermissionProtectedRoute>
            ),
          },
          {
            path: 'lead-risk/import-leads',
            element: (
              <PermissionProtectedRoute>
                <ImportLeads />
              </PermissionProtectedRoute>
            ),
          },
          {
            path: 'lead-risk/import-review',
            element: (
              <PermissionProtectedRoute>
                <ImportReview />
              </PermissionProtectedRoute>
            ),
          },
          {
            path: 'lead-risk/assignment-dispatch',
            element: (
              <PermissionProtectedRoute>
                <AssignmentDispatch />
              </PermissionProtectedRoute>
            ),
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
