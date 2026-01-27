import { RouteObject } from 'react-router-dom';
import { Login } from '../app/pages/auth/Login';
import { PermissionProtectedRoute } from '../app/components/auth/PermissionProtectedRoute';
import TvWallboardPage from '../app/pages/TvWallboardPage';

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

