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
        let session, error;
        try {
          const sessionResult = await supabase.auth.getSession();
          session = sessionResult.data.session;
          error = sessionResult.error;
        } catch (err: any) {
          // Handle AbortError - this means session was aborted (likely expired)
          if (err?.name === 'AbortError' || err?.message?.includes('aborted')) {
            console.warn('Session verification aborted - likely session expired');
            // Clear all storage immediately
            try {
              localStorage.clear();
              if (typeof sessionStorage !== 'undefined') {
                sessionStorage.clear();
              }
              // Clear cookies
              if (typeof document !== 'undefined' && document.cookie) {
                const cookies = document.cookie.split(';');
                cookies.forEach(cookie => {
                  const eqPos = cookie.indexOf('=');
                  const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
                  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
                  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
                  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${window.location.hostname}`;
                });
              }
            } catch (clearError) {
              console.error('Error clearing storage:', clearError);
            }
            setHasValidSession(false);
            setIsCheckingSession(false);
            return;
          }
          error = err;
        }
        
        if (error || !session) {
          // Clear storage on error
          try {
            localStorage.clear();
            if (typeof sessionStorage !== 'undefined') {
              sessionStorage.clear();
            }
          } catch (clearError) {
            console.error('Error clearing storage:', clearError);
          }
          setHasValidSession(false);
          setIsCheckingSession(false);
          return;
        }

        // Check if session is expired
        if (session.expires_at) {
          const expiresAt = session.expires_at * 1000; // Convert to milliseconds
          const now = Date.now();
          
          if (now >= expiresAt) {
            // Clear storage when session expired
            try {
              localStorage.clear();
              if (typeof sessionStorage !== 'undefined') {
                sessionStorage.clear();
              }
            } catch (clearError) {
              console.error('Error clearing storage:', clearError);
            }
            setHasValidSession(false);
            setIsCheckingSession(false);
            return;
          }
        }

        // Session is valid
        setHasValidSession(true);
      } catch (error: any) {
        // Handle any other errors
        if (error?.name === 'AbortError' || error?.message?.includes('aborted')) {
          // Session aborted - clear everything
          try {
            localStorage.clear();
            if (typeof sessionStorage !== 'undefined') {
              sessionStorage.clear();
            }
          } catch (clearError) {
            console.error('Error clearing storage:', clearError);
          }
        }
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