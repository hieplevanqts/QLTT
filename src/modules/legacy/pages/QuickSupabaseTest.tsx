/**
 * MAPPA Portal - Quick Supabase Test
 * Extremely simple test to verify Supabase connection
 */

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '@/utils/supabase/info';

export default function QuickSupabaseTest() {
  const [result, setResult] = useState<string>('Chưa test');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setResult('Đang kết nối...');
    
    try {
      const url = `https://${projectId}.supabase.co`;
      const key = publicAnonKey;
      
      
      // Create client
      const supabase = createClient(url, key);
      
      // Test 1: Try to get auth status
      const { data: authData, error: authError } = await supabase.auth.getSession();
      
      // Test 2: Try to list tables (will fail but shows connection works)
      const { data: testData, error: testError } = await supabase
        .from('leads')
        .select('count')
        .limit(1);
      
      if (testError) {
          message: testError.message,
          details: testError.details,
          hint: testError.hint,
          code: testError.code
        });
      }
      
      // Test 3: Actual data fetch
      const { data: leadsData, error: leadsError } = await supabase
        .from('leads')
        .select('*, id:_id')
        .limit(5);
      
      if (leadsError) {
        console.error('❌ Leads fetch error:', leadsError);
        setResult(`LỖI: ${leadsError.message}\nCode: ${leadsError.code}\nDetails: ${leadsError.details || 'N/A'}\nHint: ${leadsError.hint || 'N/A'}`);
      } else {
        setResult(`THÀNH CÔNG!\nLấy được ${leadsData?.length || 0} records\n\nDữ liệu:\n${JSON.stringify(leadsData, null, 2)}`);
      }
      
    } catch (err) {
      console.error('❌ Exception:', err);
      setResult(`EXCEPTION: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-900">
            Quick Supabase Test
          </h1>
          
          <div className="mb-6 p-4 bg-blue-50 rounded border border-blue-200">
            <p className="text-sm font-mono text-blue-900">
              <strong>Project ID:</strong> {projectId}
            </p>
            <p className="text-sm font-mono text-blue-900 mt-2">
              <strong>URL:</strong> https://{projectId}.supabase.co
            </p>
            <p className="text-sm font-mono text-blue-900 mt-2">
              <strong>Key:</strong> {publicAnonKey.substring(0, 50)}...
            </p>
          </div>
          
          <button
            onClick={testConnection}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? '🔄 Đang test...' : '🚀 Test Kết Nối'}
          </button>
          
          <div className="mt-6 p-4 bg-gray-100 rounded border border-gray-300 min-h-[200px]">
            <h3 className="font-semibold text-gray-900 mb-2">Kết quả:</h3>
            <pre className="text-sm font-mono whitespace-pre-wrap text-gray-800">
              {result}
            </pre>
          </div>
          
          <div className="mt-6 p-4 bg-yellow-50 rounded border border-yellow-200">
            <h3 className="font-semibold text-yellow-900 mb-2">⚠️ Debug Tips:</h3>
            <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
              <li>Mở Console (F12) để xem logs chi tiết</li>
              <li>Kiểm tra Network tab để xem requests</li>
              <li>Nếu lỗi "relation does not exist" → bảng 'leads' chưa tồn tại</li>
              <li>Nếu lỗi "permission denied" → cần config RLS policies</li>
              <li>Nếu lỗi CORS → key có thể sai</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
