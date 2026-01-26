import { Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { RootState } from '../../../store/rootReducer';
import { restoreSessionRequest } from '../../../store/slices/authSlice';
import { getStoredToken, isTokenExpired, logout } from '../../../utils/api/authApi';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  // Use Redux auth state - session is restored by rootSaga on app startup
  const { isAuthenticated, isLoading, isRestoring, token } = useAppSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();
  const location = useLocation();
  const [hasCheckedStorage, setHasCheckedStorage] = useState(false);

  // Check if token exists in storage on mount (fallback if Redux restore hasn't run yet)
  useEffect(() => {
    const checkStorage = async () => {
      // If already authenticated, mark as checked
      if (isAuthenticated) {
        if (!hasCheckedStorage) {
          setHasCheckedStorage(true);
        }
        return;
      }

      // Only check storage if not restoring, not loading, and not authenticated
      if (!isRestoring && !isLoading && !isAuthenticated && !hasCheckedStorage) {
        try {
          const storedToken = await getStoredToken();
          if (storedToken) {
            console.log('🔒 ProtectedRoute: Found token in storage, triggering restore...');
            dispatch(restoreSessionRequest());
          }
          setHasCheckedStorage(true);
        } catch (error) {
          console.error('Error checking storage:', error);
          setHasCheckedStorage(true);
        }
      }
    };
    checkStorage();
  }, [isRestoring, isLoading, isAuthenticated, hasCheckedStorage, dispatch]);

  // 🔥 NEW: Check token expiry periodically and redirect if expired
  useEffect(() => {
    if (!isAuthenticated || !token) return;

    const checkTokenExpiry = async () => {
      try {
        const expired = await isTokenExpired(0);
        if (expired) {
          console.log('🔒 ProtectedRoute: Token expired, logging out and redirecting...');
          await logout();
          // Redirect to login
          window.location.replace('/auth/login');
        }
      } catch (error) {
        console.error('Error checking token expiry:', error);
      }
    };

    // Check immediately
    checkTokenExpiry();

    // Check every 30 seconds
    const interval = setInterval(checkTokenExpiry, 30000);

    return () => clearInterval(interval);
  }, [isAuthenticated, token]);

  // Debug logging (remove in production)
  if (typeof window !== 'undefined' && import.meta.env.DEV) {
    console.log('🔒 ProtectedRoute:', {
      isAuthenticated,
      isLoading,
      isRestoring,
      hasToken: !!token,
      hasCheckedStorage,
      path: location.pathname,
    });
  }

  // Show loading state while checking authentication or restoring session
  // If already authenticated, don't wait for hasCheckedStorage
  if (isLoading || isRestoring || (!isAuthenticated && !hasCheckedStorage)) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'var(--background)',
        fontFamily: 'Inter, sans-serif'
      }}>
        <div style={{
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid var(--border)',
            borderTop: '4px solid var(--primary)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <div style={{
            fontSize: '14px',
            color: 'var(--muted-foreground)',
            fontWeight: 500
          }}>Đang tải...</div>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // If not authenticated and not loading/restoring, check storage one more time before redirecting
  if (!isLoading && !isRestoring && !isAuthenticated && hasCheckedStorage) {
    // Double-check: if we have a token in storage, don't redirect yet
    // This handles the case where restore might be in progress but state hasn't updated
    if (token) {
      console.log('🔒 ProtectedRoute: Has token but not authenticated, waiting...');
      // Show loading for a bit more to allow restore to complete
      return (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          background: 'var(--background)',
          fontFamily: 'Inter, sans-serif'
        }}>
          <div style={{
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              border: '4px solid var(--border)',
              borderTop: '4px solid var(--primary)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <div style={{
              fontSize: '14px',
              color: 'var(--muted-foreground)',
              fontWeight: 500
            }}>Đang khôi phục phiên đăng nhập...</div>
          </div>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      );
    }
    
    // No token and not loading/restoring, redirect to login
    console.log('🔒 ProtectedRoute: No token found, redirecting to login');
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}