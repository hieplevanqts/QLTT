import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import styles from './SessionTimeoutDialog.module.css';

export function SessionTimeoutDialog() {
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isExpired, setIsExpired] = useState(false);
  
  // 🔥 FIX: Use ref to prevent multiple logout calls
  const logoutInProgressRef = useRef(false);
  const checkIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleLogout = useCallback(() => {
    // 🔥 FIX: Prevent multiple logout calls
    if (logoutInProgressRef.current) {
      return;
    }
    logoutInProgressRef.current = true;

    // Clear all intervals first to prevent further calls
    if (checkIntervalRef.current) {
      clearInterval(checkIntervalRef.current);
      checkIntervalRef.current = null;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }

    // Clear storage
    try {
      localStorage.clear();
      sessionStorage.clear();
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      }
    } catch (error) {
      console.error('Error clearing storage:', error);
    }

    // Use window.location.replace instead of navigate to prevent multiple navigations
    // and ensure a full page reload
    window.location.replace('/auth/login');
  }, []);

  useEffect(() => {
    // Check if we're in browser environment
    if (typeof window === 'undefined') return;

    // Check session every minute
    checkIntervalRef.current = setInterval(async () => {
      try {
        // Prevent checking if logout is in progress
        if (logoutInProgressRef.current) return;
        
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setIsExpired(true);
          setShowWarning(true);
          handleLogout();
          return;
        }

        // Check if session is expired using expires_at from backend
        if (session.expires_at) {
          const expiresAt = session.expires_at * 1000; // Convert to milliseconds
          const now = Date.now();
          const remaining = expiresAt - now;

          // Show warning 5 minutes before expiry
          if (remaining <= 5 * 60 * 1000 && remaining > 0) {
            setTimeLeft(Math.floor(remaining / 1000));
            setShowWarning(true);
          }

          // Session expired
          if (remaining <= 0) {
            setIsExpired(true);
            setShowWarning(true);
            handleLogout();
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
      }
    }, 60000); // Check every minute

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
        checkIntervalRef.current = null;
      }
    };
  }, [handleLogout]);

  // Update countdown
  useEffect(() => {
    if (!showWarning || isExpired) return;

    countdownIntervalRef.current = setInterval(() => {
      // Prevent countdown if logout is in progress
      if (logoutInProgressRef.current) return;
      
      setTimeLeft((prev: number) => {
        if (prev <= 1) {
          setIsExpired(true);
          handleLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
    };
  }, [showWarning, isExpired, handleLogout]);

  const handleExtendSession = async () => {
    if (typeof window === 'undefined') return;
    
    try {
      // Refresh the session to extend expiry time
      const { data: { session }, error } = await supabase.auth.refreshSession();
      if (error) {
        console.error('Error refreshing session:', error);
        return;
      }
      
      if (session) {
        // Update session expiry in localStorage
        if (session.expires_at) {
          const sessionExpiry = session.expires_at * 1000;
          localStorage.setItem('mappa-session-expiry', sessionExpiry.toString());
        }
        setShowWarning(false);
        setTimeLeft(0);
      }
    } catch (error) {
      console.error('Error extending session:', error);
    }
  };

  if (!showWarning) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  if (isExpired) {
    return (
      <div className={styles.overlay}>
        <div className={styles.dialog}>
          <div className={styles.icon} style={{ color: '#dc2626' }}>
            <AlertTriangle size={48} />
          </div>
          <h2 className={styles.title}>Phiên đăng nhập đã hết hạn</h2>
          <p className={styles.message}>
            Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại để tiếp tục.
          </p>
          <div className={styles.actions}>
            <button className={styles.primaryButton} onClick={handleLogout}>
              Đăng nhập lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.dialog}>
        <div className={styles.icon} style={{ color: '#f59e0b' }}>
          <Clock size={48} />
        </div>
        <h2 className={styles.title}>Phiên đăng nhập sắp hết hạn</h2>
        <p className={styles.message}>
          Phiên làm việc của bạn sẽ hết hạn trong{' '}
          <strong>
            {minutes}:{seconds.toString().padStart(2, '0')}
          </strong>
        </p>
        <p className={styles.hint}>
          Bạn có muốn gia hạn phiên làm việc không?
        </p>
        <div className={styles.actions}>
          <button className={styles.secondaryButton} onClick={handleLogout}>
            Đăng xuất
          </button>
          <button className={styles.primaryButton} onClick={handleExtendSession}>
            Gia hạn phiên
          </button>
        </div>
      </div>
    </div>
  );
}