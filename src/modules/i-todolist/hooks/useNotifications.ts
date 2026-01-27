import { useState, useCallback, useEffect } from 'react';
import type { ToastProps, ToastType } from '../components/Toast';

let toastIdCounter = 0;

export function useNotifications() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);
  const [browserNotificationsEnabled, setBrowserNotificationsEnabled] = useState(false);

  // Request browser notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'granted') {
      setBrowserNotificationsEnabled(true);
    }
  }, []);

  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setBrowserNotificationsEnabled(permission === 'granted');
      return permission === 'granted';
    }
    return false;
  }, []);

  const showToast = useCallback(
    (type: ToastType, title: string, message?: string, duration = 5000) => {
      const id = `toast-${toastIdCounter++}`;
      const newToast: ToastProps = {
        id,
        type,
        title,
        message,
        duration,
        onClose: (toastId) => {
          setToasts((prev) => prev.filter((t) => t.id !== toastId));
        },
      };

      setToasts((prev) => [...prev, newToast]);
      return id;
    },
    []
  );

  const showBrowserNotification = useCallback(
    (title: string, options?: NotificationOptions) => {
      if (browserNotificationsEnabled && 'Notification' in window) {
        try {
          const notification = new Notification(title, {
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            ...options,
          });

          notification.onclick = () => {
            window.focus();
            notification.close();
          };

          return notification;
        } catch (error) {
          console.error('Failed to show browser notification:', error);
        }
      }
      return null;
    },
    [browserNotificationsEnabled]
  );

  const notify = useCallback(
    (
      type: ToastType,
      title: string,
      message?: string,
      options?: {
        duration?: number;
        browserNotification?: boolean;
      }
    ) => {
      // Show toast notification
      showToast(type, title, message, options?.duration);

      // Show browser notification if enabled and requested
      if (options?.browserNotification && browserNotificationsEnabled) {
        showBrowserNotification(title, {
          body: message,
          tag: `notification-${Date.now()}`,
        });
      }
    },
    [showToast, showBrowserNotification, browserNotificationsEnabled]
  );

  const closeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return {
    toasts,
    notify,
    showToast,
    showBrowserNotification,
    closeToast,
    requestNotificationPermission,
    browserNotificationsEnabled,
  };
}
