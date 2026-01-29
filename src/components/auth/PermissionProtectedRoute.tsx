import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAppSelector } from '@/hooks/useAppStore';
import { RootState } from '@/store/rootReducer';
import { useMenuRegistry } from '@/hooks/useMenuRegistry';
import { usePermissions } from '@/modules/system-admin/_shared/usePermissions';
import { Error403 } from '../error-states/Error403';

interface PermissionProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string; // Permission code required to access this route
}

// Map routes to permission codes (matches the mapping in VerticalSidebar and HorizontalNavBar)
const ROUTE_PERMISSION_MAP: { [path: string]: string | undefined } = {
  '/overview': undefined,
  '/map': 'MAP_VIEW',
  '/stores': 'STORES_VIEW',
  '/leads': 'LEAD_RISK',
  '/plans': 'PLAN_VIEW',
  '/tasks': 'TASKS_VIEW',
  '/evidence': 'EVIDENCE_VIEW',
  '/reports': undefined,
  '/admin': 'ADMIN_VIEW',
  '/tv': 'TV_VIEW',
};

/**
 * PermissionProtectedRoute - Checks if user has required permission to access route
 * If not, shows Error403 page
 */
export function PermissionProtectedRoute({ 
  children, 
  requiredPermission 
}: PermissionProtectedRouteProps) {
  const { isLoading: isAuthLoading } = useAppSelector((state: RootState) => state.auth);
  const { menus, loading: isMenuLoading } = useMenuRegistry();
  const { hasPermission, hasAnyPermission } = usePermissions();
  const location = useLocation();

  // 🔥 FIX: Skip permission check for system-admin routes (children of "Quản trị" menu)
  // All routes under /system-admin/* don't need permission check
  if (location.pathname.startsWith('/system-admin') || location.pathname.startsWith('/system/')) {
    return <>{children}</>;
  }

  // Show nothing while loading auth or menus to prevent flickering or false 403
  if (isAuthLoading || isMenuLoading) {
    return null; // or a loading spinner
  }

  // 1. If explicit permission is required, check it first
  if (requiredPermission) {
    if (!hasPermission(requiredPermission)) {
      return <Error403 />;
    }
    return <>{children}</>;
  }

  // 2. Check dynamic permissions from menus
  if (menus) {
    // Find exact match or longest prefix match
    const sortedMenus = [...menus]
      .filter(m => m.path && m.path !== '/')
      .sort((a, b) => (b.path?.length || 0) - (a.path?.length || 0));
    
    for (const m of sortedMenus) {
      if (m.path && (location.pathname === m.path || location.pathname.startsWith(m.path + '/'))) {
        if (m.permissionsAny && m.permissionsAny.length > 0) {
          if (!hasAnyPermission(m.permissionsAny)) {
            return <Error403 />;
          }
          return <>{children}</>; // Found matching menu and user has permission
        }
        // If menu found but no permissions required, allow access
        break; 
      }
    }
  }

  // 3. Fallback to static mapping for legacy or special routes
  // Convert current path to pattern match for dynamic routes (e.g. /stores/123 -> /stores)
  const staticPermission = ROUTE_PERMISSION_MAP[location.pathname];
  if (staticPermission && !hasPermission(staticPermission)) {
    return <Error403 />;
  }

  return <>{children}</>;
}

