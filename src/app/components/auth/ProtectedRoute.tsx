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
  const [hasDoneFinalCheck, setHasDoneFinalCheck] = useState(false);
  const [restoreTimeout, setRestoreTimeout] = useState(false);

  // Check if token exists in storage on mount (fallback if Redux restore hasn't run yet)
  // 🔥 FIX: Always check storage on mount, even if restore is in progress
  useEffect(() => {
    const checkStorage = async () => {
      // If already authenticated, mark as checked
      if (isAuthenticated) {
        if (!hasCheckedStorage) {
          console.log('🔒 ProtectedRoute: Already authenticated, marking as checked');
          setHasCheckedStorage(true);
        }
        return;
      }

      // 🔥 FIX: Check storage even if restore is in progress (as a fallback)
      // This ensures we trigger restore if rootSaga hasn't run yet
      if (!hasCheckedStorage) {
        try {
          console.log('🔒 ProtectedRoute: Checking storage for token...', {
            isRestoring,
            isLoading,
            isAuthenticated
          });
          const storedToken = await getStoredToken();
          if (storedToken) {
            console.log('🔒 ProtectedRoute: Found token in storage, triggering restore...', {
              tokenLength: storedToken.length,
              tokenPreview: storedToken.substring(0, 20) + '...'
            });
            // Only trigger restore if not already restoring
            if (!isRestoring) {
              dispatch(restoreSessionRequest());
            } else {
              console.log('🔒 ProtectedRoute: Restore already in progress, waiting...');
            }
          } else {
            console.log('🔒 ProtectedRoute: No token found in storage');
          }
          setHasCheckedStorage(true);
        } catch (error) {
          console.error('❌ ProtectedRoute: Error checking storage:', error);
          setHasCheckedStorage(true);
        }
      }
    };
    
    // Run check immediately on mount
    checkStorage();
  }, [dispatch]); // Only run once on mount

  // 🔥 FIX: Check token expiry periodically and redirect if expired
  // Only check after session is fully restored to avoid premature logout on reload
  useEffect(() => {
    // Don't check if still restoring or loading - wait for restore to complete
    if (isRestoring || isLoading || !isAuthenticated || !token) return;

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

    // Don't check immediately on mount - wait a bit for session to stabilize
    // This prevents premature logout when reloading page
    const timeout = setTimeout(() => {
      checkTokenExpiry();
    }, 2000); // Wait 2 seconds after mount before first check

    // Check every 30 seconds after initial delay
    const interval = setInterval(checkTokenExpiry, 30000);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [isAuthenticated, token, isRestoring, isLoading]);

  // 🔥 FIX: Add timeout to wait for restore to complete
  // Give restore up to 5 seconds to complete before giving up
  useEffect(() => {
    if (isRestoring && !restoreTimeout) {
      const timeout = setTimeout(() => {
        console.warn('⚠️ ProtectedRoute: Restore timeout after 5 seconds');
        setRestoreTimeout(true);
      }, 5000);
      
      return () => clearTimeout(timeout);
    }
  }, [isRestoring, restoreTimeout]);

  // 🔥 FIX: Final check before redirecting - use useEffect to handle async properly
  // MUST be called before any early returns to follow Rules of Hooks
  useEffect(() => {
    // Only run final check if we're not authenticated, not loading/restoring, and haven't done final check yet
    if (!isLoading && !isRestoring && !isAuthenticated && hasCheckedStorage && !hasDoneFinalCheck) {
      const finalCheck = async () => {
        try {
          const storedToken = await getStoredToken();
          if (storedToken) {
            console.log('🔒 ProtectedRoute: Found token in final check, triggering restore...');
            dispatch(restoreSessionRequest());
            setHasDoneFinalCheck(true);
            // Reset hasCheckedStorage to allow restore to complete
            setHasCheckedStorage(false);
          } else {
            console.log('🔒 ProtectedRoute: No token in final check');
            setHasDoneFinalCheck(true);
          }
        } catch (error) {
          console.error('Error in final check:', error);
          setHasDoneFinalCheck(true);
        }
      };
      
      // Run final check
      finalCheck();
    }
  }, [isLoading, isRestoring, isAuthenticated, hasCheckedStorage, hasDoneFinalCheck, dispatch]);

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
  // 🔥 FIX: Always wait for restore to complete before redirecting
  // Wait if:
  // 1. Still loading/restoring (and not timed out)
  // 2. Not authenticated AND haven't checked storage yet
  // 3. Not authenticated AND restore just started (give it time)
  const shouldWaitForRestore = (isLoading || (isRestoring && !restoreTimeout)) || (!isAuthenticated && !hasCheckedStorage);
  
  if (shouldWaitForRestore) {
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
  // 🔥 FIX: Give more time for restore to complete, especially on page reload
  if (!isLoading && !isRestoring && !isAuthenticated && hasCheckedStorage) {
    // Double-check: if we have a token in Redux state, don't redirect yet
    // This handles the case where restore might be in progress but state hasn't updated
    if (token) {
      console.log('🔒 ProtectedRoute: Has token in Redux but not authenticated, waiting for restore to complete...');
      // Show loading for a bit more to allow restore to complete
      // On reload, Redux state resets, so we need to wait for restoreSession to complete
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
    
    // Only redirect if final check is done and no token found
    if (hasDoneFinalCheck) {
      console.log('🔒 ProtectedRoute: No token found after all checks, redirecting to login', {
        hasToken: !!token,
        isAuthenticated,
        hasCheckedStorage,
        hasDoneFinalCheck
      });
      return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }
    
    // Still waiting for final check, show loading
    // This gives restore more time to complete
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
          }}>Đang kiểm tra phiên đăng nhập...</div>
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

  return <>{children}</>;
}