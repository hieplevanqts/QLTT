import { createBrowserRouter, Navigate } from 'react-router-dom';
import RootLayout from '../layouts/RootLayout';
import MainLayout from '../layouts/MainLayout';
import OverviewPage from '../pages/OverviewPage';
import MapPage from '../pages/MapPage';
import StoresListPage from '../pages/StoresListPage';
import DataExportPage from '../pages/DataExportPage';
import LeadsPage from '../pages/LeadsPage';
import PlansPage from '../pages/PlansPage';
import TasksPage from '../pages/TasksPage';
import EvidencePage from '../pages/EvidencePage';
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
            path: 'data-export',
            element: <DataExportPage />,
          },
          {
            path: 'leads',
            element: <LeadsPage />,
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
            path: 'evidence',
            element: <EvidencePage />,
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