import React, { useState } from 'react';
import styles from './RPCSetupHelper.module.css';

/**
 * Component hiển thị error và hướng dẫn fix RPC functions
 * Xuất hiện khi detect error "Could not find the function"
 */
export const RPCSetupHelper: React.FC<{
  error: string;
  functionName: string;
  onDismiss: () => void;
}> = ({ error, functionName, onDismiss }) => {
  const [showInstructions, setShowInstructions] = useState(false);

  if (!error.includes('Could not find the function')) {
    return null;
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.errorIcon}>⚠️</span>
          <h2 className={styles.title}>Database Function Missing</h2>
          <button 
            className={styles.closeButton}
            onClick={onDismiss}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Error Message */}
        <div className={styles.errorBox}>
          <strong>Function not found:</strong> <code>{functionName}</code>
        </div>

        {/* Quick Fix */}
        <div className={styles.content}>
          <p>
            The database function <code>{functionName}</code> needs to be created in your Supabase database.
            This is a <strong>one-time setup</strong> that takes about 1 minute.
          </p>

          <div className={styles.actions}>
            <button
              className={styles.primaryButton}
              onClick={() => setShowInstructions(!showInstructions)}
            >
              {showInstructions ? '▼ Hide Instructions' : '▶ Show Quick Fix (1 minute)'}
            </button>
          </div>

          {/* Instructions */}
          {showInstructions && (
            <div className={styles.instructions}>
              <h3>📋 Quick Fix Steps:</h3>
              
              <ol className={styles.stepsList}>
                <li>
                  <strong>Open Supabase Dashboard</strong>
                  <div className={styles.stepDetail}>
                    <a 
                      href="https://supabase.com/dashboard" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={styles.link}
                    >
                      https://supabase.com/dashboard →
                    </a>
                    <span> Select your project → Click <strong>SQL Editor</strong></span>
                  </div>
                </li>

                <li>
                  <strong>Copy Migration File</strong>
                  <div className={styles.stepDetail}>
                    <div className={styles.codeBlock}>
                      <code>/supabase/migrations/20260117000001_update_user_profile_function.sql</code>
                      <button 
                        className={styles.copyButton}
                        onClick={() => {
                          navigator.clipboard.writeText('/supabase/migrations/20260117000001_update_user_profile_function.sql');
                        }}
                        title="Copy file path"
                      >
                        📋
                      </button>
                    </div>
                    <span>Open this file in your code editor, select all (Ctrl+A), and copy (Ctrl+C)</span>
                  </div>
                </li>

                <li>
                  <strong>Run in SQL Editor</strong>
                  <div className={styles.stepDetail}>
                    Paste the SQL into Supabase SQL Editor and click <strong>"Run"</strong>
                  </div>
                </li>

                <li>
                  <strong>Verify</strong>
                  <div className={styles.stepDetail}>
                    <div className={styles.codeBlock}>
                      <code>SELECT proname FROM pg_proc WHERE proname = 'update_user_profile';</code>
                      <button 
                        className={styles.copyButton}
                        onClick={() => {
                          navigator.clipboard.writeText("SELECT proname FROM pg_proc WHERE proname = 'update_user_profile';");
                        }}
                        title="Copy query"
                      >
                        📋
                      </button>
                    </div>
                    <span>Expected result: 1 row ✅</span>
                  </div>
                </li>

                <li>
                  <strong>Refresh This App</strong>
                  <div className={styles.stepDetail}>
                    Press <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>R</kbd> (or <kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>R</kbd> on Mac)
                  </div>
                </li>
              </ol>

              <div className={styles.helpBox}>
                <p><strong>📚 Need more help?</strong></p>
                <ul className={styles.linksList}>
                  <li>
                    <span className={styles.fileIcon}>📄</span>
                    <code>/QUICK_FIX.md</code> - Ultra-fast guide
                  </li>
                  <li>
                    <span className={styles.fileIcon}>📄</span>
                    <code>/FIX_RPC_ERROR.md</code> - Detailed walkthrough
                  </li>
                  <li>
                    <span className={styles.fileIcon}>📄</span>
                    <code>/TROUBLESHOOTING.md</code> - Common issues
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button
            className={styles.dismissButton}
            onClick={onDismiss}
          >
            I'll fix this later
          </button>
          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.primaryButton}
          >
            Open Supabase Dashboard →
          </a>
        </div>
      </div>
    </div>
  );
};
