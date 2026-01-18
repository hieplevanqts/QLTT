/**
 * MAPPA Portal - Test Supabase Connection
 * Simple test page to verify Supabase connection and data
 */

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '@/utils/supabase/info';

const SUPABASE_URL = `https://${projectId}.supabase.co`;
const SUPABASE_ANON_KEY = publicAnonKey;

export default function TestSupabaseConnection() {
  const [status, setStatus] = useState<'connecting' | 'success' | 'error'>('connecting');
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [tableInfo, setTableInfo] = useState<string>('');

  useEffect(() => {
    async function testConnection() {
      try {
        setStatus('connecting');
        
        // Create Supabase client
        const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        
        console.log('🔗 Connecting to Supabase...');
        console.log('URL:', SUPABASE_URL);
        
        // Try to fetch data from leads table
        const { data: leadsData, error: leadsError } = await supabase
          .from('leads')
          .select('*')
          .limit(5);
        
        if (leadsError) {
          throw new Error(`Supabase Error: ${leadsError.message} (Code: ${leadsError.code})`);
        }
        
        console.log('✅ Connected successfully!');
        console.log('📊 Data received:', leadsData);
        
        setData(leadsData || []);
        setTableInfo(`Found ${leadsData?.length || 0} records`);
        setStatus('success');
        setError(null);
        
      } catch (err) {
        console.error('❌ Connection failed:', err);
        setStatus('error');
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    }
    
    testConnection();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-background-primary)] p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
            Test Kết Nối Supabase
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            Kiểm tra kết nối và lấy dữ liệu từ bảng leads
          </p>
        </div>

        {/* Connection Info */}
        <div className="bg-white rounded-lg border border-[var(--color-border)] p-6 mb-6">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
            Thông tin kết nối
          </h2>
          <div className="space-y-2 font-mono text-sm">
            <div className="flex gap-2">
              <span className="text-[var(--color-text-secondary)]">URL:</span>
              <span className="text-[var(--color-text-primary)]">{SUPABASE_URL}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-[var(--color-text-secondary)]">Key:</span>
              <span className="text-[var(--color-text-primary)]">{SUPABASE_ANON_KEY.substring(0, 20)}...</span>
            </div>
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-lg border border-[var(--color-border)] p-6 mb-6">
          <div className="flex items-center gap-4">
            {status === 'connecting' && (
              <>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]"></div>
                <div>
                  <h3 className="font-semibold text-[var(--color-text-primary)]">
                    Đang kết nối...
                  </h3>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    Đang thử kết nối tới Supabase
                  </p>
                </div>
              </>
            )}
            
            {status === 'success' && (
              <>
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-green-900">
                    Kết nối thành công!
                  </h3>
                  <p className="text-sm text-green-700">
                    {tableInfo}
                  </p>
                </div>
              </>
            )}
            
            {status === 'error' && (
              <>
                <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-red-900 mb-1">
                    Lỗi kết nối
                  </h3>
                  <p className="text-sm text-red-700">
                    {error}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Data Display */}
        {status === 'success' && data.length > 0 && (
          <div className="bg-white rounded-lg border border-[var(--color-border)] overflow-hidden">
            <div className="px-6 py-4 bg-[var(--color-background-secondary)] border-b border-[var(--color-border)]">
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
                Dữ liệu mẫu (5 records đầu tiên)
              </h2>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <pre className="text-sm font-mono bg-[var(--color-background-tertiary)] p-4 rounded-lg overflow-x-auto">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </div>
              
              {/* Simple Table View */}
              <div className="mt-6 overflow-x-auto">
                <table className="min-w-full divide-y divide-[var(--color-border)]">
                  <thead className="bg-[var(--color-background-secondary)]">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase">
                        ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase">
                        Code
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase">
                        Title
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-[var(--color-border)]">
                    {data.map((item, index) => (
                      <tr key={index} className="hover:bg-[var(--color-background-tertiary)]">
                        <td className="px-4 py-3 text-sm text-[var(--color-text-primary)] font-mono">
                          {item.id?.substring(0, 8)}...
                        </td>
                        <td className="px-4 py-3 text-sm text-[var(--color-primary)] font-medium">
                          {item.code || 'N/A'}
                        </td>
                        <td className="px-4 py-3 text-sm text-[var(--color-text-primary)]">
                          {item.title || 'N/A'}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                            {item.status || 'N/A'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {status === 'success' && data.length === 0 && (
          <div className="bg-white rounded-lg border border-[var(--color-border)] p-12 text-center">
            <svg 
              className="mx-auto h-12 w-12 text-[var(--color-text-tertiary)]" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" 
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-[var(--color-text-primary)]">
              Bảng leads trống
            </h3>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
              Kết nối thành công nhưng chưa có dữ liệu trong bảng
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
