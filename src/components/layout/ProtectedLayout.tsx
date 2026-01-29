import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAppSelector } from '@/hooks/useAppStore';
import { RootState } from '../../../store/rootReducer';
import MainLayout from '../../../layouts/MainLayout';

export function ProtectedLayout() {
  // Get auth state from Redux instead of AuthContext
  const { isAuthenticated } = useAppSelector((state: RootState) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login page but save the location they were trying to access
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <MainLayout />;
}
