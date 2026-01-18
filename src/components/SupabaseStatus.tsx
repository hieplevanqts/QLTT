/**
 * SupabaseStatus - Connection status indicator
 * 
 * Component hiển thị trạng thái kết nối Supabase.
 * Sử dụng design tokens từ /src/styles/theme.css
 */

import React, { useEffect, useState } from 'react';
import { checkConnection } from '../lib/supabase';

interface StatusState {
  connected: boolean;
  message: string;
  error?: string;
}

export default function SupabaseStatus() {
  const [status, setStatus] = useState<StatusState>({
    connected: false,
    message: 'Đang kiểm tra kết nối...',
  });

  const [show, setShow] = useState(true);

  useEffect(() => {
    checkSupabaseConnection();

    // Auto hide after 10 seconds if connected
    const timer = setTimeout(() => {
      if (status.connected) {
        setShow(false);
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, [status.connected]);

  async function checkSupabaseConnection() {
    try {
      // Import from src/utils/supabase/info.ts (env-backed credentials)
      const { projectId, publicAnonKey } = await import('../../utils/supabase/info');
      const url = `https://${projectId}.supabase.co`;
      const key = publicAnonKey;

      if (!url || !key || !projectId) {
        setStatus({
          connected: false,
          message: '❌ Thiếu Supabase credentials',
          error: 'Kiem tra src/utils/supabase/info.ts hoac .env',
        });
        return;
      }

      const isConnected = await checkConnection();

      if (isConnected) {
        setStatus({
          connected: true,
          message: `✅ Supabase đã kết nối! (${projectId})`,
        });
      } else {
        setStatus({
          connected: false,
          message: '⚠️ Chưa có tables',
          error: 'Chạy /database/insert_sample_data.sql trong SQL Editor',
        });
      }
    } catch (err) {
      setStatus({
        connected: false,
        message: '❌ Lỗi kết nối',
        error: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  }

  // Don't show the status badge by default (user can enable if needed)
  if (!show) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 'var(--spacing-4, 16px)',
        right: 'var(--spacing-4, 16px)',
        backgroundColor: status.connected
          ? 'rgba(16, 185, 129, 0.95)' // green
          : 'rgba(239, 68, 68, 0.95)', // red
        color: '#ffffff',
        padding: 'var(--spacing-3, 12px) var(--spacing-4, 16px)',
        borderRadius: 'var(--radius-md, 8px)',
        boxShadow: 'var(--elevation-md, 0 4px 12px rgba(0,0,0,0.15))',
        fontSize: 'var(--font-size-sm, 14px)',
        fontFamily: 'var(--font-sans, Inter, sans-serif)',
        fontWeight: 500,
        zIndex: 9999,
        maxWidth: '320px',
        cursor: 'pointer',
      }}
      onClick={() => setShow(false)}
      title="Click để ẩn"
    >
      <div
        style={{
          fontWeight: 600,
          marginBottom: status.error ? 'var(--spacing-1, 4px)' : 0,
        }}
      >
        {status.message}
      </div>
      {status.error && (
        <div
          style={{
            fontSize: 'var(--font-size-xs, 12px)',
            opacity: 0.9,
            marginTop: 'var(--spacing-1, 4px)',
          }}
        >
          {status.error}
        </div>
      )}
    </div>
  );
}
