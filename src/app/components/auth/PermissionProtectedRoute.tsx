import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { Error403 } from '../error-states/Error403';

interface PermissionProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string; // Permission code required to access this route
}

// Map routes to permission codes (matches the mapping in VerticalSidebar and HorizontalNavBar)
const ROUTE_PERMISSION_MAP: { [path: string]: string | undefined } = {
  '/overview': undefined, // No permission required (always accessible)
  '/map': 'MAP_VIEW',
  '/stores': 'STORES_VIEW',
  '/stores/:id': 'STORES_VIEW', // Store detail requires STORES_VIEW
  '/leads': 'LEAD_RISK',
  '/lead-risk/inbox': 'LEAD_RISK',
  '/lead-risk/home': 'LEAD_RISK',
  '/lead-risk/list': 'LEAD_RISK',
  '/lead-risk/map': 'LEAD_RISK',
  '/lead-risk/create-lead-quick': 'LEAD_RISK',
  '/lead-risk/create-lead-full': 'LEAD_RISK',
  '/lead-risk/dashboard': 'LEAD_RISK',
  '/lead-risk/hotspots': 'LEAD_RISK',
  '/lead-risk/sla-operation-map': 'LEAD_RISK',
  '/lead-risk/watchlist': 'LEAD_RISK',
  '/lead-risk/quality-metrics': 'LEAD_RISK',
  '/lead-risk/workload-dashboard': 'LEAD_RISK',
  '/lead-risk/sla-dashboard': 'LEAD_RISK',
  '/lead-risk/permission-matrix': 'LEAD_RISK',
  '/lead-risk/duplicate-detector': 'LEAD_RISK',
  '/lead-risk/escalation-form': 'LEAD_RISK',
  '/lead-risk/verification-outcome': 'LEAD_RISK',
  '/lead-risk/entity-risk-profile': 'LEAD_RISK',
  '/lead-risk/alert-feed': 'LEAD_RISK',
  '/lead-risk/risk-indicators': 'LEAD_RISK',
  '/lead-risk/import-leads': 'LEAD_RISK',
  '/lead-risk/import-review': 'LEAD_RISK',
  '/lead-risk/assignment-dispatch': 'LEAD_RISK',
  '/plans': 'PLAN_VIEW',
  '/plans/list': 'PLAN_VIEW',
  '/plans/create-new': 'PLAN_VIEW',
  '/plans/task-board': 'PLAN_VIEW',
  '/plans/inspection-session': 'PLAN_VIEW',
  '/tasks': 'TASKS_VIEW',
  '/tasks/board': 'TASKS_VIEW',
  '/evidence': 'EVIDENCE_VIEW',
  '/reports': undefined, // No permission required
  '/admin': 'ADMIN_VIEW',
  '/system/users': 'ADMIN_VIEW',
  '/system/roles': 'ADMIN_VIEW',
  '/system/settings': 'ADMIN_VIEW',
  '/tv': 'TV_VIEW', // TV Wallboard mode
};

/**
 * Helper function to match route path with permission map
 * Handles dynamic routes like /stores/:id, /plans/:planId, etc.
 */
function getPermissionForRoute(pathname: string): string | undefined {
  // Try exact match first
  if (ROUTE_PERMISSION_MAP[pathname]) {
    return ROUTE_PERMISSION_MAP[pathname];
  }

  // Try pattern matching for dynamic routes
  // Check if pathname matches any pattern in the map
  for (const [routePattern, permission] of Object.entries(ROUTE_PERMISSION_MAP)) {
    // Convert route pattern to regex (e.g., "/stores/:id" -> "/stores/[^/]+")
    const patternRegex = new RegExp(
      '^' + routePattern.replace(/:[^/]+/g, '[^/]+') + '$'
    );
    
    if (patternRegex.test(pathname)) {
      return permission;
    }
  }

  // Check parent routes (e.g., /lead-risk/lead/:id should match /lead-risk permission)
  const pathSegments = pathname.split('/').filter(Boolean);
  for (let i = pathSegments.length; i > 0; i--) {
    const parentPath = '/' + pathSegments.slice(0, i).join('/');
    if (ROUTE_PERMISSION_MAP[parentPath]) {
      return ROUTE_PERMISSION_MAP[parentPath];
    }
  }

  return undefined;
}

/**
 * PermissionProtectedRoute - Checks if user has required permission to access route
 * If not, shows Error403 page
 */
export function PermissionProtectedRoute({ 
  children, 
  requiredPermission 
}: PermissionProtectedRouteProps) {
  const { user } = useAuth();
  const location = useLocation();

  // Get permission code for current route
  const routePermission = requiredPermission || getPermissionForRoute(location.pathname);

  // If no permission required for this route, allow access
  if (!routePermission) {
    return <>{children}</>;
  }

  // Check if user has the required permission
  const userPermissions = user?.permissions || [];
  const hasPermission = userPermissions.includes(routePermission);

  // If user doesn't have permission, show access denied page
  if (!hasPermission) {
    return <Error403 />;
  }

  // User has permission, render children
  return <>{children}</>;
}

