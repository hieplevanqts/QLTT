import { RouteObject } from 'react-router-dom';
import Profile from '../pages/account/Profile';
import Preferences from '../pages/account/Preferences';
import ActivityLog from '../pages/account/ActivityLog';
import ChangePassword from '../pages/account/ChangePassword';

/**
 * Account routes
 */
export const accountRoutes: RouteObject[] = [
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
];

