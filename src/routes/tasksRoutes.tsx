import { RouteObject } from 'react-router-dom';
import { PermissionProtectedRoute } from '../app/components/auth/PermissionProtectedRoute';
import { InspectionTasksList } from '../app/pages/tasks/InspectionTasksList';
import { TaskBoard } from '../app/pages/tasks/TaskBoard';

/**
 * Tasks routes
 */
export const tasksRoutes: RouteObject[] = [
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
];

