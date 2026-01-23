import { Navigate, RouteObject } from 'react-router-dom';
import { PermissionProtectedRoute } from '../app/components/auth/PermissionProtectedRoute';
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

/**
 * Plans và Inspection Rounds routes
 */
export const plansRoutes: RouteObject[] = [
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
];

