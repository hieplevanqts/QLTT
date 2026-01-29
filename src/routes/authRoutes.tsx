import { RouteObject } from 'react-router-dom';
import { Login } from '@/modules/auth';
import { PermissionProtectedRoute } from '@/components/auth';
import { TvWallboardPage } from '@/modules/tv';

/**
 * Auth routes - không cần layout
 */
export const authRoutes: RouteObject[] = [
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
];

