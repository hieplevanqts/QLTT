import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import MainLayout from '../../../layouts/MainLayout';

export function ProtectedLayout() {
  const { isAuthenticated, checkSession } = useAuth();
  const location = useLocation();

  // Check if session is still valid
  const isSessionValid = checkSession();

  if (!isAuthenticated || !isSessionValid) {
    // Redirect to login page but save the location they were trying to access
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <MainLayout />;
}
