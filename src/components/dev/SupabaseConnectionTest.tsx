/**
 * MAPPA Portal - Supabase Connection Test Component
 * Component để test kết nối Supabase (chỉ dùng cho development)
 */

import { useState } from 'react';
import { supabase, SUPABASE_URL, logSupabaseInfo } from '../../../utils/supabaseHelpers';
import { projectId } from '@/utils/supabase/info';
import styles from './SupabaseConnectionTest.module.css';

export function SupabaseConnectionTest() {
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const testConnection = async () => {
    setIsLoading(true);
    setTestResult('Đang test kết nối...\n');
    setConnectionStatus('idle');

    try {
      // 1. Test credentials
      setTestResult((prev) => prev + '✓ Credentials loaded\n');
      setTestResult((prev) => prev + `  URL: ${SUPABASE_URL}\n`);
      setTestResult((prev) => prev + `  Project ID: ${projectId}\n\n`);

      // 2. Create client
      setTestResult((prev) => prev + '✓ Supabase client created\n\n');

      // 3. Test query to leads table
      setTestResult((prev) => prev + 'Testing query to "leads" table...\n');
      const { data, error, count } = await supabase
        .from('leads')
        .select('*, id:_id', { count: 'exact' })
        .limit(5);

      if (error) {
        throw new Error(error.message);
      }

      setTestResult((prev) => prev + `✓ Query successful!\n`);
      setTestResult((prev) => prev + `  Total leads in DB: ${count ?? 0}\n`);
      setTestResult((prev) => prev + `  Fetched: ${data?.length ?? 0} records\n\n`);

      if (data && data.length > 0) {
        setTestResult((prev) => prev + '📊 Sample data:\n');
        data.forEach((lead: any, index: number) => {
          setTestResult((prev) => prev + `  ${index + 1}. [${lead.code}] ${lead.title}\n`);
          setTestResult((prev) => prev + `     Status: ${lead.status} | Urgency: ${lead.urgency}\n`);
        });
      } else {
        setTestResult((prev) => prev + '⚠️ No data found. Insert sample data using SQL from guide.\n');
      }

      setTestResult((prev) => prev + '\n✅ CONNECTION SUCCESSFUL!');
      setConnectionStatus('success');

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setTestResult((prev) => prev + `\n❌ ERROR: ${errorMessage}\n\n`);

      // Provide helpful hints
      if (errorMessage.includes('does not exist')) {
        setTestResult((prev) => prev + '💡 Hint: Run the SQL script to create the "leads" table.\n');
        setTestResult((prev) => prev + '   See /SUPABASE_CONNECTION_GUIDE.md for instructions.\n');
      } else if (errorMessage.includes('Failed to fetch') || errorMessage.includes('network')) {
        setTestResult((prev) => prev + '💡 Hint: Check your internet connection or Supabase URL.\n');
      } else if (errorMessage.includes('permission')) {
        setTestResult((prev) => prev + '💡 Hint: Disable RLS (Row Level Security) on the "leads" table.\n');
        setTestResult((prev) => prev + '   Run: ALTER TABLE leads DISABLE ROW LEVEL SECURITY;\n');
      }

      setConnectionStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>🔌 Supabase Connection Test</h2>
        
        <div className={styles.info}>
          <p><strong>Project:</strong> {projectId}</p>
          <p><strong>URL:</strong> {SUPABASE_URL}</p>
        </div>

        <button 
          onClick={testConnection} 
          disabled={isLoading}
          className={styles.testButton}
        >
          {isLoading ? 'Testing...' : 'Test Connection'}
        </button>

        {testResult && (
          <div className={`${styles.result} ${styles[connectionStatus]}`}>
            <pre>{testResult}</pre>
          </div>
        )}

        <div className={styles.help}>
          <p>📖 <strong>Need help?</strong></p>
          <p>Check <code>/SUPABASE_CONNECTION_GUIDE.md</code> for setup instructions.</p>
        </div>
      </div>
    </div>
  );
}
