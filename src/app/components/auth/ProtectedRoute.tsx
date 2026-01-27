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
  const { isAuthenticated, isLoading, isRestoring, token } = useAppSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();
  const location = useLocation();

  const [hasCheckedStorage, setHasCheckedStorage] = useState(false);
  const [hasDoneFinalCheck, setHasDoneFinalCheck] = useState(false);
  const [restoreTimeout, setRestoreTimeout] = useState(false);

  // 1. Kiểm tra storage khi mount
  useEffect(() => {
    const checkStorage = async () => {
      if (isAuthenticated) {
        setHasCheckedStorage(true);
        return;
      }

      try {
        const storedToken = await getStoredToken();
        if (storedToken && !isRestoring) {
          dispatch(restoreSessionRequest());
        }
      } catch {
        // Error silently handled for production
      } finally {
        setHasCheckedStorage(true);
      }
    };
    checkStorage();
  }, [dispatch, isAuthenticated, isRestoring]);

  // 2. Kiểm tra hết hạn Token định kỳ
  useEffect(() => {
    if (isRestoring || isLoading || !isAuthenticated || !token) return;

    const checkTokenExpiry = async () => {
      try {
        const expired = await isTokenExpired(0);
        if (expired) {
          await logout();
          window.location.replace('/auth/login');
        }
      } catch {
        // Error silently handled
      }
    };

    const timeout = setTimeout(checkTokenExpiry, 2000);
    const interval = setInterval(checkTokenExpiry, 30000);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [isAuthenticated, token, isRestoring, isLoading]);

  // 3. Xử lý Timeout khi khôi phục session
  useEffect(() => {
    if (isRestoring && !restoreTimeout) {
      const timer = setTimeout(() => {
        setRestoreTimeout(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isRestoring, restoreTimeout]);

  // 4. Kiểm tra cuối cùng trước khi redirect
  useEffect(() => {
    if (!isLoading && !isRestoring && !isAuthenticated && hasCheckedStorage && !hasDoneFinalCheck) {
      const finalCheck = async () => {
        try {
          const storedToken = await getStoredToken();
          if (storedToken) {
            dispatch(restoreSessionRequest());
            setHasCheckedStorage(false);
          }
        } finally {
          setHasDoneFinalCheck(true);
        }
      };
      finalCheck();
    }
  }, [isLoading, isRestoring, isAuthenticated, hasCheckedStorage, hasDoneFinalCheck, dispatch]);

  // Loading UI Component
  const LoadingScreen = ({ message }: { message: string }) => (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100vh', background: 'var(--background)', fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <div style={{
          width: '48px', height: '48px', border: '4px solid var(--border)',
          borderTop: '4px solid var(--primary)', borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <div style={{ fontSize: '14px', color: 'var(--muted-foreground)', fontWeight: 500 }}>{message}</div>
      </div>
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const shouldWait = (isLoading || (isRestoring && !restoreTimeout)) || (!isAuthenticated && !hasCheckedStorage);
  
  if (shouldWait) return <LoadingScreen message="Đang tải..." />;

  if (!isAuthenticated && !isRestoring && !isLoading) {
    if (token) return <LoadingScreen message="Đang khôi phục phiên đăng nhập..." />;
    if (hasDoneFinalCheck) {
      return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }
    return <LoadingScreen message="Đang kiểm tra phiên đăng nhập..." />;
  }

  return <>{children}</>;
}