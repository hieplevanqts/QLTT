import { RouteObject } from 'react-router-dom';
import { Profile, Preferences, ActivityLog, ChangePassword } from '@/modules/auth';

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


