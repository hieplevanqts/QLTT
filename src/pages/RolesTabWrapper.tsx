/**
 * RolesTabWrapper - Fetches roles from Supabase and renders RolesTabNew
 * 
 * This wrapper fetches data from Supabase 'roles' table and passes it to RolesTabNew component.
 * Uses design tokens from /src/styles/theme.css for all UI elements.
 */

import React, { useState, useEffect } from 'react';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { RolesTabNew } from './RolesTabNew';
import { supabase, Tables } from '../lib/supabase';
import type { Role as DBRole } from '../lib/supabase';
import styles from './AdminPage.module.css';

interface RolesTabWrapperProps {
  onOpenModal: (type: any, item?: any) => void;
}

export const RolesTabWrapper: React.FC<RolesTabWrapperProps> = ({ onOpenModal }) => {
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔍 Fetching roles from Supabase...');
      console.log('📌 Table name:', Tables.ROLES);
      console.log('📌 Supabase client:', {
        url: (supabase as any).supabaseUrl,
        hasKey: !!(supabase as any).supabaseKey,
      });

      // Fetch roles from Supabase
      const { data: rolesData, error: rolesError } = await supabase
        .from(Tables.ROLES)
        .select('*')
        .order('created_at', { ascending: false });

      console.log('📊 Roles query result:', { rolesData, rolesError });

      if (rolesError) {
        console.error('❌ Roles error:', rolesError);
        console.error('❌ Error code:', rolesError.code);
        console.error('❌ Error details:', JSON.stringify(rolesError, null, 2));
        console.error('❌ Error hint:', rolesError.hint);
        console.error('❌ Error message:', rolesError.message);
        throw new Error(`Lỗi khi tải vai trò: ${rolesError.message || rolesError.hint || 'Unknown error'}`);
      }

      if (!rolesData || rolesData.length === 0) {
        console.warn('⚠️ No roles data returned from Supabase');
        console.warn('⚠️ This could mean:');
        console.warn('   1. Table "roles" is empty');
        console.warn('   2. RLS policies are blocking the query');
        console.warn('   3. Run /database/insert_sample_data.sql');
        console.warn('   4. Run /database/FIX_RLS_POLICIES.sql');
      }

      // Fetch user_roles to count users per role
      const { data: userRolesData, error: userRolesError } = await supabase
        .from(Tables.USER_ROLES)
        .select('role_id');

      if (userRolesError) {
        console.warn('⚠️ Lỗi khi tải user_roles:', userRolesError);
      }

      // Count users per role
      const userCountMap: { [roleId: string]: number } = {};
      if (userRolesData) {
        userRolesData.forEach(ur => {
          userCountMap[ur.role_id] = (userCountMap[ur.role_id] || 0) + 1;
        });
      }

      console.log('👥 User count map:', userCountMap);

      // Transform roles to match RolesTabNew expected format
      const transformedRoles = (rolesData || []).map((role: DBRole) => ({
        id: role.id, // UUID string
        code: role.code,
        name: role.name,
        description: role.description || '',
        userCount: userCountMap[role.id] || 0,
        status: role.status === 1 ? 'active' : 'inactive', // INTEGER: 1 = active, 0 = inactive
        isSystem: role.is_system || false,
        createdAt: role.created_at || '',
        permissions: [], // TODO: Fetch role permissions from role_permissions table
      }));

      console.log('✅ Transformed roles:', transformedRoles);
      console.log(`✅ Loaded ${transformedRoles.length} roles from Supabase`);

      setRoles(transformedRoles);
    } catch (err: any) {
      console.error('❌ Error fetching roles:', err);
      setError(err.message || 'Không thể tải dữ liệu vai trò');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  if (loading) {
    return (
      <div className={styles.tabContentInner}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--spacing-12, 48px)',
            gap: 'var(--spacing-4, 16px)',
          }}
        >
          <RefreshCw
            size={48}
            style={{
              color: 'var(--primary, #005cb6)',
              animation: 'spin 1s linear infinite',
            }}
          />
          <div
            style={{
              fontSize: '14px',
              fontFamily: 'Inter, sans-serif',
              color: 'var(--muted-foreground, #6b7280)',
            }}
          >
            Đang tải dữ liệu vai trò...
          </div>
        </div>
        <style>
          {`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.tabContentInner}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--spacing-12, 48px)',
            gap: 'var(--spacing-4, 16px)',
          }}
        >
          <AlertCircle size={48} style={{ color: 'var(--destructive, #ef4444)' }} />
          <div
            style={{
              fontSize: '16px',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              color: 'var(--foreground, #111827)',
            }}
          >
            Lỗi khi tải dữ liệu
          </div>
          <div
            style={{
              fontSize: '14px',
              fontFamily: 'Inter, sans-serif',
              color: 'var(--muted-foreground, #6b7280)',
              textAlign: 'center',
              maxWidth: '400px',
            }}
          >
            {error}
          </div>
          <button
            onClick={fetchRoles}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-2, 8px)',
              padding: 'var(--spacing-3, 12px) var(--spacing-5, 20px)',
              background: 'var(--primary, #005cb6)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 'var(--radius, 6px)',
              fontSize: '14px',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={16} />
            Thử lại
          </button>
          
          <div
            style={{
              marginTop: 'var(--spacing-6, 24px)',
              padding: 'var(--spacing-4, 16px)',
              background: 'var(--muted, #f9fafb)',
              border: '1px solid var(--border, #e5e7eb)',
              borderRadius: 'var(--radius, 6px)',
              maxWidth: '600px',
            }}
          >
            <div
              style={{
                fontSize: '13px',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                color: 'var(--foreground, #111827)',
                marginBottom: 'var(--spacing-2, 8px)',
              }}
            >
              💡 Hướng dẫn khắc phục:
            </div>
            <ol
              style={{
                fontSize: '13px',
                fontFamily: 'Inter, sans-serif',
                color: 'var(--muted-foreground, #6b7280)',
                margin: 0,
                paddingLeft: 'var(--spacing-5, 20px)',
              }}
            >
              <li>Mở Console (F12) để xem chi tiết lỗi</li>
              <li>Chạy SQL: <code>/database/TEST_ROLES_QUERY.sql</code> để kiểm tra data</li>
              <li>Nếu table chưa có: <code>/database/FIX_RBAC_TABLES.sql</code></li>
              <li>Nếu data rỗng: <code>/database/insert_sample_data.sql</code></li>
              <li>Nếu RLS block query: <code>/database/FIX_RLS_POLICIES.sql</code></li>
              <li>Xem hướng dẫn chi tiết: <code>/TROUBLESHOOT_ROLES_TAB.md</code></li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return <RolesTabNew roles={roles} onOpenModal={onOpenModal} />;
};