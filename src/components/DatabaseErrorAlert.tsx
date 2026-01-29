import React from 'react';
import { AlertCircle, Database, ExternalLink, Copy, CheckCircle } from 'lucide-react';
import styles from './DatabaseErrorAlert.module.css';

interface DatabaseErrorAlertProps {
  error?: {
    code?: string;
    message?: string;
    details?: string;
  };
  onRetry?: () => void;
  onClose?: () => void;
}

export const DatabaseErrorAlert: React.FC<DatabaseErrorAlertProps> = ({ error, onRetry, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  // Check if it's a user_roles missing error
  const isUserRolesError = 
    error?.code === 'PGRST200' || 
    error?.message?.toLowerCase().includes('user_roles');

  if (!error || !isUserRolesError) {
    return null;
  }

  const sqlScript = `-- Quick Fix: Create user_roles table
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role_id)
);

CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON public.user_roles(role_id);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to manage user_roles" 
  ON public.user_roles FOR ALL USING (auth.role() = 'authenticated');`;

  const handleCopySQL = () => {
    navigator.clipboard.writeText(sqlScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.container}>
      <div className={styles.alert}>
        <div className={styles.header}>
          <AlertCircle className={styles.icon} />
          <h3 className={styles.title}>Thiếu Bảng Database: user_roles</h3>
        </div>

        <div className={styles.content}>
          <p className={styles.description}>
            Bảng <code>user_roles</code> chưa được tạo trong database. 
            Bảng này cần thiết để ánh xạ người dùng với vai trò.
          </p>

          <div className={styles.steps}>
            <h4 className={styles.stepsTitle}>
              <Database size={16} />
              Cách fix (2 phút):
            </h4>
            
            <ol className={styles.stepsList}>
              <li>
                Mở{' '}
                <a 
                  href="https://app.supabase.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  Supabase Dashboard
                  <ExternalLink size={12} />
                </a>
              </li>
              <li>Chọn project của bạn → <strong>SQL Editor</strong></li>
              <li>
                Click nút dưới đây để copy SQL script:
                <button 
                  onClick={handleCopySQL}
                  className={styles.copyButton}
                  type="button"
                >
                  {copied ? (
                    <>
                      <CheckCircle size={16} />
                      Đã copy!
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      Copy SQL Script
                    </>
                  )}
                </button>
              </li>
              <li>Paste vào SQL Editor và click <strong>RUN</strong></li>
              <li>
                Quay lại đây và click{' '}
                {onRetry && (
                  <button 
                    onClick={onRetry}
                    className={styles.retryButton}
                    type="button"
                  >
                    Thử lại
                  </button>
                )}
              </li>
            </ol>
          </div>

          <details className={styles.details}>
            <summary className={styles.detailsSummary}>
              Xem SQL Script (tùy chọn)
            </summary>
            <pre className={styles.code}>
              <code>{sqlScript}</code>
            </pre>
          </details>

          <div className={styles.moreHelp}>
            <p>
              Cần hướng dẫn chi tiết hơn? 
              Xem file <code>/FIX_DATABASE_ERROR.md</code> hoặc{' '}
              <code>/database/quick-fix-user-roles.sql</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
