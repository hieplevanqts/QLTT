import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastNotificationProps {
  show: boolean;
  type: ToastType;
  title: string;
  message: string;
  onClose: () => void;
  duration?: number;
}

export function ToastNotification({
  show,
  type,
  title,
  message,
  onClose,
  duration = 5000,
}: ToastNotificationProps) {
  useEffect(() => {
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!show) return null;

  const config = {
    success: {
      icon: CheckCircle2,
      color: '#10b981',
      bg: '#10b98115',
      borderColor: '#10b981',
    },
    error: {
      icon: AlertCircle,
      color: '#ef4444',
      bg: '#ef444415',
      borderColor: '#ef4444',
    },
    info: {
      icon: Info,
      color: '#3b82f6',
      bg: '#3b82f615',
      borderColor: '#3b82f6',
    },
  };

  const { icon: Icon, color, bg, borderColor } = config[type];

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 10000,
        animation: 'slideInRight 0.3s ease',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 'var(--spacing-3, 12px)',
          minWidth: '320px',
          maxWidth: '450px',
          padding: 'var(--spacing-4, 16px)',
          background: 'var(--card, #ffffff)',
          border: `1px solid ${borderColor}`,
          borderRadius: 'var(--radius, 6px)',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: 'calc(var(--radius, 6px) * 0.75)',
            background: bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Icon size={20} style={{ color }} />
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--foreground, #111827)',
              marginBottom: '4px',
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: '12px',
              color: 'var(--muted-foreground, #6b7280)',
              lineHeight: 1.5,
            }}
          >
            {message}
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'none',
            border: 'none',
            borderRadius: 'calc(var(--radius, 6px) * 0.5)',
            color: 'var(--muted-foreground, #6b7280)',
            cursor: 'pointer',
            flexShrink: 0,
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--muted, #f3f4f6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'none';
          }}
        >
          <X size={16} />
        </button>
      </div>

      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
