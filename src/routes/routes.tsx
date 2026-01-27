import React from 'react';
import { Navigate, createBrowserRouter } from 'react-router-dom';
import RootLayout from '../layouts/RootLayout';
import MainLayout from '../layouts/MainLayout';
import { Login } from '../app/pages/auth/Login';
import { ProtectedRoute } from '../app/components/auth/ProtectedRoute';
import { PermissionProtectedRoute } from '../app/components/auth/PermissionProtectedRoute';
import TvWallboardPage from '../app/pages/TvWallboardPage';
import { systemAdminDashboardRoute } from '../modules/system-admin/routes';
import { saMasterDataRoutes } from '../modules/system-admin/sa-master-data';
import { saIamRoutes } from '../modules/system-admin/sa-iam';
import { saSystemConfigRoutes } from '../modules/system-admin/sa-system-config';
// Plans module - moved to /src/app/pages/plans/
import { PlansProvider } from '../app/contexts/PlansContext';

// Lead & Risk pages
import { installedRoutes } from '../imports/installedModules';

import { InspectionRoundsProvider } from '../contexts/InspectionRoundsContext';

const OverviewPage = React.lazy(() => import('../pages/OverviewPage'));
const MapPage = React.lazy(() => import('../pages/MapPage'));
const StoreDetailPage = React.lazy(() => import('../pages/StoreDetailPage'));
const DataExportPage = React.lazy(() => import('../pages/DataExportPage'));

const RegistryHomePage = React.lazy(() => import('../pages/registry/RegistryHomePage'));
const RegistryStoreListPage = React.lazy(() => import('../pages/registry/RegistryStoreListPage'));
const RegistryDedupWorkbenchPage = React.lazy(() => import('../pages/registry/RegistryDedupWorkbenchPage'));
const RegistryVerificationQueuePage = React.lazy(() => import('../pages/registry/RegistryVerificationQueuePage'));
const RegistryVerificationDetailPage = React.lazy(() => import('../pages/registry/RegistryVerificationDetailPage'));
const RegistryApprovalQueuePage = React.lazy(() => import('../pages/registry/RegistryApprovalQueuePage'));
const RegistryApprovalDetailPage = React.lazy(() => import('../pages/registry/RegistryApprovalDetailPage'));
const RegistryImportPage = React.lazy(() => import('../pages/registry/RegistryImportPage'));
const RegistryImportReviewPage = React.lazy(() => import('../pages/registry/RegistryImportReviewPage'));
const RegistryAuditLogPage = React.lazy(() => import('../pages/registry/RegistryAuditLogPage'));
const EditRegistryPage = React.lazy(() => import('../pages/EditRegistryPage'));
const FullEditRegistryPage = React.lazy(() => import('../pages/FullEditRegistryPage'));
const EvidenceRoutes = React.lazy(() => import('../app/routes/EvidenceRoutes'));
const ReportsPage = React.lazy(() => import('../pages/ReportsPage'));
const DashboardPage = React.lazy(() => import('../pages/DashboardPage'));
const AdminPage = React.lazy(() => import('../pages/AdminPage'));
const Profile = React.lazy(() => import('../pages/account/Profile'));
const Preferences = React.lazy(() => import('../pages/account/Preferences'));
const ActivityLog = React.lazy(() => import('../pages/account/ActivityLog'));
const ChangePassword = React.lazy(() => import('../pages/account/ChangePassword'));
const UserList = React.lazy(() => import('../pages/system/UserList'));
const RoleList = React.lazy(() => import('../pages/system/RoleList'));
const SystemSettings = React.lazy(() => import('../pages/system/SystemSettings'));
const Error404 = React.lazy(() => import('../pages/system/Error404'));

const PlansList = React.lazy(() =>
  import('../app/pages/plans/PlansList').then((module) => ({ default: module.PlansList })),
);
const PlanCreate = React.lazy(() =>
  import('../app/pages/plans/PlanCreate').then((module) => ({ default: module.PlanCreate })),
);
const PlanDetail = React.lazy(() =>
  import('../app/pages/plans/PlanDetail').then((module) => ({ default: module.PlanDetail })),
);
const PlanTaskBoard = React.lazy(() =>
  import('../app/pages/plans/PlanTaskBoard').then((module) => ({ default: module.PlanTaskBoard })),
);
const InspectionRoundsList = React.lazy(() =>
  import('../app/pages/inspections/InspectionRoundsList').then((module) => ({
    default: module.InspectionRoundsList,
  })),
);
const InspectionRoundDetail = React.lazy(() => import('../app/pages/inspections/InspectionRoundDetail'));
const InspectionRoundCreate = React.lazy(() => import('../app/pages/inspections/InspectionRoundCreate'));
const InspectionRoundStatistics = React.lazy(
  () => import('../app/pages/inspections/InspectionRoundStatistics'),
);
const TaskBoard = React.lazy(() =>
  import('../app/pages/tasks/TaskBoard').then((module) => ({ default: module.TaskBoard })),
);

const LeadInbox = React.lazy(() => import('../pages/lead-risk/LeadInbox'));
const LeadRiskHome = React.lazy(() => import('../pages/lead-risk/LeadRiskHome'));
const LeadList = React.lazy(() => import('../pages/lead-risk/LeadList'));
const LeadMapView = React.lazy(() => import('../pages/lead-risk/LeadMapView'));
const CreateLeadQuick = React.lazy(() => import('../pages/lead-risk/CreateLeadQuick'));
const CreateLeadFull = React.lazy(() => import('../pages/lead-risk/CreateLeadFull'));
const RiskDashboard = React.lazy(() => import('../pages/lead-risk/RiskDashboard'));
const LeadDetail = React.lazy(() => import('../pages/lead-risk/LeadDetail'));
const RiskDetail = React.lazy(() => import('../pages/lead-risk/RiskDetail'));
const CaseDetail = React.lazy(() => import('../pages/lead-risk/CaseDetail'));
const HotspotExplorer = React.lazy(() => import('../pages/lead-risk/HotspotExplorer'));
const SLAOperationMap = React.lazy(() => import('../pages/lead-risk/SLAOperationMap'));
const Watchlist = React.lazy(() => import('../pages/lead-risk/Watchlist'));
const QualityMetrics = React.lazy(() => import('../pages/lead-risk/QualityMetrics'));
const WorkloadDashboard = React.lazy(() => import('../pages/lead-risk/WorkloadDashboard'));
const SLADashboard = React.lazy(() => import('../pages/lead-risk/SLADashboard'));
const PermissionMatrix = React.lazy(() => import('../pages/lead-risk/PermissionMatrix'));
const DuplicateDetector = React.lazy(() => import('../pages/lead-risk/DuplicateDetector'));
const EscalationForm = React.lazy(() => import('../pages/lead-risk/EscalationForm'));
const VerificationOutcome = React.lazy(() => import('../pages/lead-risk/VerificationOutcome'));
const EntityRiskProfile = React.lazy(() => import('../pages/lead-risk/EntityRiskProfile'));
const AlertFeed = React.lazy(() => import('../pages/lead-risk/AlertFeed'));
const AlertAcknowledgement = React.lazy(() => import('../pages/lead-risk/AlertAcknowledgement'));
const RiskIndicators = React.lazy(() => import('../pages/lead-risk/RiskIndicators'));
const ImportLeads = React.lazy(() => import('../pages/lead-risk/ImportLeads'));
const ImportReview = React.lazy(() => import('../pages/lead-risk/ImportReview'));
const AssignmentDispatch = React.lazy(() => import('../pages/lead-risk/AssignmentDispatch'));

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
                <TaskBoard />
              </PermissionProtectedRoute>
            ),
          },
          {
            path: 'tasks',
            element: (
              <PermissionProtectedRoute>
                <TaskBoard />
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
