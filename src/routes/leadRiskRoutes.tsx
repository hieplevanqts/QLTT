import { RouteObject } from 'react-router-dom';
import { PermissionProtectedRoute } from '@/components/auth/PermissionProtectedRoute';
import LeadInbox from '@/modules/leads/pages/lead-risk/LeadInbox';
import LeadRiskHome from '@/modules/leads/pages/lead-risk/LeadRiskHome';
import LeadList from '@/modules/leads/pages/lead-risk/LeadList';
import LeadMapView from '@/modules/leads/pages/lead-risk/LeadMapView';
import CreateLeadQuick from '@/modules/leads/pages/lead-risk/CreateLeadQuick';
import CreateLeadFull from '@/modules/leads/pages/lead-risk/CreateLeadFull';
import RiskDashboard from '@/modules/leads/pages/lead-risk/RiskDashboard';
import LeadDetail from '@/modules/leads/pages/lead-risk/LeadDetail';
import RiskDetail from '@/modules/leads/pages/lead-risk/RiskDetail';
import CaseDetail from '@/modules/leads/pages/lead-risk/CaseDetail';
import HotspotExplorer from '@/modules/leads/pages/lead-risk/HotspotExplorer';
import SLAOperationMap from '@/modules/leads/pages/lead-risk/SLAOperationMap';
import Watchlist from '@/modules/leads/pages/lead-risk/Watchlist';
import QualityMetrics from '@/modules/leads/pages/lead-risk/QualityMetrics';
import WorkloadDashboard from '@/modules/leads/pages/lead-risk/WorkloadDashboard';
import SLADashboard from '@/modules/leads/pages/lead-risk/SLADashboard';
import PermissionMatrix from '@/modules/leads/pages/lead-risk/PermissionMatrix';
import DuplicateDetector from '@/modules/leads/pages/lead-risk/DuplicateDetector';
import EscalationForm from '@/modules/leads/pages/lead-risk/EscalationForm';
import VerificationOutcome from '@/modules/leads/pages/lead-risk/VerificationOutcome';
import EntityRiskProfile from '@/modules/leads/pages/lead-risk/EntityRiskProfile';
import AlertFeed from '@/modules/leads/pages/lead-risk/AlertFeed';
import AlertAcknowledgement from '@/modules/leads/pages/lead-risk/AlertAcknowledgement';
import RiskIndicators from '@/modules/leads/pages/lead-risk/RiskIndicators';
import ImportLeads from '@/modules/leads/pages/lead-risk/ImportLeads';
import ImportReview from '@/modules/leads/pages/lead-risk/ImportReview';
import AssignmentDispatch from '@/modules/leads/pages/lead-risk/AssignmentDispatch';

/**
 * Lead & Risk routes
 */
export const leadRiskRoutes: RouteObject[] = [
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
];


