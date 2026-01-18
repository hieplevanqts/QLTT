import React, { useEffect, useState } from 'react';
import { Shield, CheckCircle2, Building2, User, X } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import styles from './UserRolesPanel.module.css';

interface Role {
  id: string;
  code: string;
  name: string;
  description?: string;
}

interface Department {
  id: string;
  name: string;
  code: string;
  level: number;
}

interface UserRolesPanelProps {
  onClose: () => void;
}

export function UserRolesPanel({ onClose }: UserRolesPanelProps) {
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [roles, setRoles] = useState<Role[]>([]);
  const [department, setDepartment] = useState<Department | null>(null);

  useEffect(() => {
    const fetchCurrentUserData = async () => {
      try {
        setLoading(true);
        console.log('🔍 Fetching current user data...');
        
        // Get current auth user email
        const { data: authData, error: authError } = await supabase.auth.getUser();
        if (authError || !authData?.user) {
          console.error('❌ Error fetching auth user:', authError);
          setLoading(false);
          return;
        }
        
        const userEmail = authData.user.email;
        console.log('📧 Current user email:', userEmail);
        
        // Fetch user from public.users table with roles and department
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select(`
            id,
            email,
            full_name,
            username,
            user_roles (
              roles (
                id,
                code,
                name,
                description
              )
            ),
            department_users (
              departments (
                id,
                name,
                code,
                level
              )
            )
          `)
          .eq('email', userEmail)
          .single();
        
        if (userError) {
          console.error('❌ Error fetching user data:', userError);
          setLoading(false);
          return;
        }
        
        console.log('✅ User data loaded:', userData);
        
        // Set user info
        setFullName(userData.full_name || '');
        setUsername(userData.username || '');
        setEmail(userData.email || '');
        
        // Set roles
        const userRoles = userData.user_roles?.map((ur: any) => ur.roles).filter(Boolean) || [];
        setRoles(userRoles);
        console.log(`✅ Loaded ${userRoles.length} roles`);
        
        // Set department (first one, since 1 user = 1 department)
        const userDept = userData.department_users?.[0]?.departments || null;
        setDepartment(userDept);
        console.log('✅ Department:', userDept?.name || 'None');
        
        setLoading(false);
      } catch (error) {
        console.error('❌ Error in fetchCurrentUserData:', error);
        setLoading(false);
      }
    };

    fetchCurrentUserData();
  }, []);

  // Close panel when clicking overlay
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.panel}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerIcon}>
            <User size={20} />
          </div>
          <div className={styles.headerContent}>
            <h3 className={styles.title}>Thông tin tài khoản</h3>
            <p className={styles.subtitle}>Vai trò và quyền hạn của bạn</p>
          </div>
          <div className={styles.closeButton} onClick={onClose}>
            <X size={20} />
          </div>
        </div>

        {/* User Info */}
        <div className={styles.section}>
          <div className={styles.infoRow}>
            <span className={styles.label}>Họ tên:</span>
            <span className={styles.value}>{fullName}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Tên đăng nhập:</span>
            <span className={styles.valueUsername}>{username}</span>
          </div>
          {email && (
            <div className={styles.infoRow}>
              <span className={styles.label}>Email:</span>
              <span className={styles.value}>{email}</span>
            </div>
          )}
        </div>

        {/* Department */}
        {department && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <Building2 size={16} />
              <h4 className={styles.sectionTitle}>Phòng ban</h4>
            </div>
            <div className={styles.departmentCard}>
              <div className={styles.departmentName}>{department.name}</div>
              <div className={styles.departmentMeta}>
                <span className={styles.badge}>Mã: {department.code}</span>
                <span className={styles.badge}>Cấp {department.level}</span>
              </div>
            </div>
          </div>
        )}

        {/* Roles & Permissions */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <Shield size={16} />
            <h4 className={styles.sectionTitle}>
              Vai trò ({roles.length})
            </h4>
          </div>
          
          {roles.length === 0 ? (
            <div className={styles.emptyState}>
              <Shield size={32} className={styles.emptyIcon} />
              <p className={styles.emptyText}>Chưa được gán vai trò</p>
            </div>
          ) : (
            <div className={styles.rolesList}>
              {roles.map((role) => (
                <div key={role.id} className={styles.roleCard}>
                  <div className={styles.roleHeader}>
                    <CheckCircle2 size={16} className={styles.roleIcon} />
                    <div className={styles.roleContent}>
                      <div className={styles.roleName}>{role.name}</div>
                      <div className={styles.roleCode}>{role.code}</div>
                    </div>
                  </div>
                  {role.description && (
                    <div className={styles.roleDescription}>
                      {role.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info Footer */}
        <div className={styles.footer}>
          <div className={styles.footerNote}>
            💡 <strong>Lưu ý:</strong> Vai trò và quyền hạn được quản lý bởi Quản trị viên
          </div>
        </div>
      </div>
    </div>
  );
}