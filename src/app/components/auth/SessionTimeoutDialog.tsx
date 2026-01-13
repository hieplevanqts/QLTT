import React, { useEffect, useState } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from './SessionTimeoutDialog.module.css';

export function SessionTimeoutDialog() {
  const navigate = useNavigate();
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    // Check if we're in browser environment
    if (typeof window === 'undefined') return;

    // Check session every minute
    const checkInterval = setInterval(() => {
      try {
        const sessionExpiry = localStorage.getItem('mappa-session-expiry');
        if (!sessionExpiry) return;

        const expiryTime = parseInt(sessionExpiry);
        const now = Date.now();
        const remaining = expiryTime - now;

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
      } catch (error) {
        console.error('Error checking session:', error);
      }
    }, 60000); // Check every minute

    return () => clearInterval(checkInterval);
  }, []);

  // Update countdown
  useEffect(() => {
    if (!showWarning || isExpired) return;

    const countdownInterval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsExpired(true);
          handleLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [showWarning, isExpired]);

  const handleExtendSession = () => {
    if (typeof window === 'undefined') return;
    
    try {
      // Extend session by 8 hours
      const newExpiry = Date.now() + (8 * 60 * 60 * 1000);
      localStorage.setItem('mappa-session-expiry', newExpiry.toString());
      setShowWarning(false);
      setTimeLeft(0);
    } catch (error) {
      console.error('Error extending session:', error);
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('mappa-user');
        localStorage.removeItem('mappa-session-expiry');
        localStorage.removeItem('mappa-user-pending');
      } catch (error) {
        console.error('Error clearing session:', error);
      }
    }
    navigate('/auth/login');
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