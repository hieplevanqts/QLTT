import { Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { supabase } from '../../../lib/supabase';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, checkSession } = useAuth();
  const location = useLocation();
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [hasValidSession, setHasValidSession] = useState(false);

  // Verify Supabase session on mount and when auth state changes
  useEffect(() => {
    // Only check if not already loading from AuthContext
    if (isLoading) {
      return;
    }

    const verifySession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error || !session) {
          setHasValidSession(false);
          setIsCheckingSession(false);
          return;
        }

        // Check if session is expired
        if (session.expires_at) {
          const expiresAt = session.expires_at * 1000; // Convert to milliseconds
          const now = Date.now();
          
          if (now >= expiresAt) {
            setHasValidSession(false);
            setIsCheckingSession(false);
            return;
          }
        }

        // Session is valid
        setHasValidSession(true);
      } catch (error) {
        console.error('Error verifying session:', error);
        setHasValidSession(false);
      } finally {
        setIsCheckingSession(false);
      }
    };

    verifySession();
  }, [isAuthenticated, isLoading]); // Re-check when isAuthenticated or isLoading changes

  // Show loading state while checking authentication
  if (isLoading || isCheckingSession) {
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

  // Check if session is still valid - require both React state and Supabase session
  const isSessionValid = checkSession();

  // If no valid session from Supabase, definitely redirect
  if (!hasValidSession || !isAuthenticated || !isSessionValid) {
    // Also double-check localStorage to ensure no leftover data
    const hasUserData = localStorage.getItem('mappa-user') || localStorage.getItem('mappa-session-expiry');
    
    // If React state says not authenticated but localStorage still has data, something is wrong
    // Clear it and redirect
    if (!isAuthenticated && hasUserData) {
      console.log('⚠️ Inconsistent state: not authenticated but localStorage has data. Clearing...');
      localStorage.clear();
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.clear();
      }
    }
    
    // Redirect to login page but save the location they were trying to access
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}