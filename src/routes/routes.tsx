import React from 'react';
import { Navigate, createBrowserRouter } from 'react-router-dom';
import { RootLayout, MainLayout } from '@/layouts';
import { Login, Profile, Preferences, ActivityLog, ChangePassword } from '@/modules/auth';
import { ProtectedRoute, PermissionProtectedRoute } from '@/components/auth';
import { TvWallboardPage } from '@/modules/tv';
import { moduleRoutes } from '@/modules/_registry';
import { PlansProvider, InspectionRoundsProvider } from '@/contexts';

const OverviewPage = React.lazy(() => import('@/modules/overview/pages/OverviewPage'));
const MapPage = React.lazy(() => import('@/modules/map/pages/MapPage'));
const StoreDetailPage = React.lazy(() => import('@/modules/registry/pages/StoreDetailPage'));
const DataExportPage = React.lazy(() => import('@/modules/reports/pages/DataExportPage'));

const RegistryHomePage = React.lazy(() => import('@/modules/registry/pages/RegistryHomePage'));
const RegistryStoreListPage = React.lazy(() => import('@/modules/registry/pages/RegistryStoreListPage'));
const RegistryDedupWorkbenchPage = React.lazy(() => import('@/modules/registry/pages/RegistryDedupWorkbenchPage'));
const RegistryVerificationQueuePage = React.lazy(() => import('@/modules/registry/pages/RegistryVerificationQueuePage'));
const RegistryVerificationDetailPage = React.lazy(() => import('@/modules/registry/pages/RegistryVerificationDetailPage'));
const RegistryApprovalQueuePage = React.lazy(() => import('@/modules/registry/pages/RegistryApprovalQueuePage'));
const RegistryApprovalDetailPage = React.lazy(() => import('@/modules/registry/pages/RegistryApprovalDetailPage'));
const RegistryImportPage = React.lazy(() => import('@/modules/registry/pages/RegistryImportPage'));
const RegistryImportReviewPage = React.lazy(() => import('@/modules/registry/pages/RegistryImportReviewPage'));
const RegistryAuditLogPage = React.lazy(() => import('@/modules/registry/pages/RegistryAuditLogPage'));
const EditRegistryPage = React.lazy(() => import('@/modules/registry/pages/EditRegistryPage'));
const FullEditRegistryPage = React.lazy(() => import('@/modules/registry/pages/FullEditRegistryPage'));
const EvidenceRoutes = React.lazy(() => import('./EvidenceRoutes'));
const ReportsPage = React.lazy(() => import('@/modules/reports/pages/ReportsPage'));
const DashboardPage = React.lazy(() => import('@/modules/overview/pages/DashboardPage'));
const Error404 = React.lazy(() => import('@/modules/system-admin/pages/legacy-system/Error404'));
const PlansList = React.lazy(() =>
  import('@/modules/plans/pages/PlansList').then((module) => ({ default: module.PlansList })),
);
const PlanCreate = React.lazy(() =>
  import('@/modules/plans/pages/PlanCreate').then((module) => ({ default: module.PlanCreate })),
);
const PlanDetail = React.lazy(() =>
  import('@/modules/plans/pages/PlanDetail').then((module) => ({ default: module.PlanDetail })),
);
const TaskBoard = React.lazy(() =>
  import('@/modules/tasks/pages/TaskBoard').then((module) => ({ default: module.TaskBoard })),
);
const InspectionRoundsList = React.lazy(() =>
  import('@/modules/plans/pages/inspections/InspectionRoundsList').then((module) => ({
    default: module.InspectionRoundsList,
  })),
);
const InspectionRoundDetail = React.lazy(() => import('@/modules/plans/pages/inspections/InspectionRoundDetail'));
const InspectionRoundCreate = React.lazy(() => import('@/modules/plans/pages/inspections/InspectionRoundCreate'));
const InspectionRoundStatistics = React.lazy(
  () => import('@/modules/plans/pages/inspections/InspectionRoundStatistics'),
);

const LeadInbox = React.lazy(() => import('@/modules/leads/pages/lead-risk/LeadInbox'));
const LeadInboxAIDemo = React.lazy(() => import('@/modules/leads/pages/lead-risk/LeadInboxAIDemo'));
const LeadDetailAIDemo = React.lazy(() => import('@/modules/leads/pages/lead-risk/LeadDetailAIDemo'));
const LeadDuplicateDemo = React.lazy(() => import('@/modules/leads/pages/lead-risk/LeadDuplicateDemo'));
const LeadRiskHome = React.lazy(() => import('@/modules/leads/pages/lead-risk/LeadRiskHome'));
const LeadList = React.lazy(() => import('@/modules/leads/pages/lead-risk/LeadList'));
const LeadMapView = React.lazy(() => import('@/modules/leads/pages/lead-risk/LeadMapView'));
const CreateLeadQuick = React.lazy(() => import('@/modules/leads/pages/lead-risk/CreateLeadQuick'));
const CreateLeadFull = React.lazy(() => import('@/modules/leads/pages/lead-risk/CreateLeadFull'));
const CreateLeadSource = React.lazy(() => import('@/modules/leads/pages/lead-risk/CreateLeadSource'));
const RiskDashboard = React.lazy(() => import('@/modules/leads/pages/lead-risk/RiskDashboard'));
const LeadDetail = React.lazy(() => import('@/modules/leads/pages/lead-risk/LeadDetail'));
const RiskDetail = React.lazy(() => import('@/modules/leads/pages/lead-risk/RiskDetail'));
const CaseDetail = React.lazy(() => import('@/modules/leads/pages/lead-risk/CaseDetail'));
const HotspotExplorer = React.lazy(() => import('@/modules/leads/pages/lead-risk/HotspotExplorer'));
const SLAOperationMap = React.lazy(() => import('@/modules/leads/pages/lead-risk/SLAOperationMap'));
const Watchlist = React.lazy(() => import('@/modules/leads/pages/lead-risk/Watchlist'));
const QualityMetrics = React.lazy(() => import('@/modules/leads/pages/lead-risk/QualityMetrics'));
const WorkloadDashboard = React.lazy(() => import('@/modules/leads/pages/lead-risk/WorkloadDashboard'));
const SLADashboard = React.lazy(() => import('@/modules/leads/pages/lead-risk/SLADashboard'));
const PermissionMatrix = React.lazy(() => import('@/modules/leads/pages/lead-risk/PermissionMatrix'));
const DuplicateDetector = React.lazy(() => import('@/modules/leads/pages/lead-risk/DuplicateDetector'));
const EscalationForm = React.lazy(() => import('@/modules/leads/pages/lead-risk/EscalationForm'));
const VerificationOutcome = React.lazy(() => import('@/modules/leads/pages/lead-risk/VerificationOutcome'));
const EntityRiskProfile = React.lazy(() => import('@/modules/leads/pages/lead-risk/EntityRiskProfile'));
const AlertFeed = React.lazy(() => import('@/modules/leads/pages/lead-risk/AlertFeed'));
const AlertAcknowledgement = React.lazy(() => import('@/modules/leads/pages/lead-risk/AlertAcknowledgement'));
const RiskIndicators = React.lazy(() => import('@/modules/leads/pages/lead-risk/RiskIndicators'));
const ImportLeads = React.lazy(() => import('@/modules/leads/pages/lead-risk/ImportLeads'));
const ImportReview = React.lazy(() => import('@/modules/leads/pages/lead-risk/ImportReview'));
const AssignmentDispatch = React.lazy(() => import('@/modules/leads/pages/lead-risk/AssignmentDispatch'));

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
                <TaskBoard />
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
            element: <Navigate to="/system-admin" replace />,
          },
          ...moduleRoutes,
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
            path: 'lead-risk/create-lead-source',
            element: (
              <PermissionProtectedRoute>
                <CreateLeadSource />
              </PermissionProtectedRoute>
            ),
          },
          {
            path: 'lead-risk/inbox-ai-demo',
            element: (
              <PermissionProtectedRoute>
                <LeadInboxAIDemo />
              </PermissionProtectedRoute>
            ),
          },
          {
            path: 'lead-risk/lead-detail-ai-demo',
            element: (
              <PermissionProtectedRoute>
                <LeadDetailAIDemo />
              </PermissionProtectedRoute>
            ),
          },
          {
            path: 'lead-risk/duplicate-demo',
            element: (
              <PermissionProtectedRoute>
                <LeadDuplicateDemo />
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




