/**
 * RBAC Management - MAPPA Portal
 * Quản lý đầy đủ Users, Roles, Permissions với Ma trận Phân quyền
 * Tuân thủ design system từ /src/styles/theme.css với Inter font
 */

import React, { useState, useEffect } from 'react';
import {
  Users,
  Shield,
  Key,
  Grid3x3,
  Search,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Loader2,
  AlertCircle,
  CheckSquare,
  Square,
  Settings,
} from 'lucide-react';
import styles from './RBACManagement.module.css';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';

// ============================================
// TYPES
// ============================================

interface User {
  id: string;
  email: string;
  full_name: string | null;
  username: string | null;
  status: number;
  created_at: string;
  updated_at: string;
}

interface Role {
  id: number;
  code: string;
  name: string;
  description: string | null;
  status: number;
  is_system: boolean;
  created_at: string;
  updated_at: string;
}

interface Permission {
  id: number;
  module_id: number;
  code: string;
  name: string;
  description: string | null;
  permission_type: string;
  is_default: boolean;
  status: number;
  created_at: string;
  updated_at: string;
}

interface Module {
  id: number;
  code: string;
  name: string;
  icon: string | null;
  description: string | null;
  order_index: number;
  status: number;
  created_at: string;
  updated_at: string;
}

interface RolePermission {
  id: number;
  role_id: number;
  permission_id: number;
  created_at: string;
}

interface UserRole {
  id: number;
  user_id: string;
  role_id: number;
  created_at: string;
}

// ============================================
// MAIN COMPONENT
// ============================================

export const RBACManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'roles' | 'permissions' | 'matrix'>('matrix');
  const [loading, setLoading] = useState(true);

  // Data states
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);

  // UI states
  const [searchQuery, setSearchQuery] = useState('');

  // ============================================
  // DATA FETCHING
  // ============================================

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [
        usersRes,
        rolesRes,
        permissionsRes,
        modulesRes,
        rolePermsRes,
        userRolesRes,
      ] = await Promise.all([
        supabase.from('users').select('*').order('created_at', { ascending: false }),
        supabase.from('roles').select('*').order('name', { ascending: true }),
        supabase.from('permissions').select('*').order('module_id', { ascending: true }),
        supabase.from('modules').select('*').order('order_index', { ascending: true }),
        supabase.from('role_permissions').select('*'),
        supabase.from('user_roles').select('*'),
      ]);

      if (usersRes.error) throw usersRes.error;
      if (rolesRes.error) throw rolesRes.error;
      if (permissionsRes.error) throw permissionsRes.error;
      if (modulesRes.error) throw modulesRes.error;
      if (rolePermsRes.error) throw rolePermsRes.error;
      if (userRolesRes.error) throw userRolesRes.error;

      setUsers(usersRes.data || []);
      setRoles(rolesRes.data || []);
      setPermissions(permissionsRes.data || []);
      setModules(modulesRes.data || []);
      setRolePermissions(rolePermsRes.data || []);
      setUserRoles(userRolesRes.data || []);
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast.error('Lỗi tải dữ liệu: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // ============================================
  // PERMISSION MATRIX LOGIC
  // ============================================

  const hasPermission = (roleId: number, permissionId: number): boolean => {
    return rolePermissions.some(
      (rp) => rp.role_id === roleId && rp.permission_id === permissionId
    );
  };

  const togglePermission = async (roleId: number, permissionId: number) => {
    const exists = hasPermission(roleId, permissionId);

    try {
      if (exists) {
        // Remove permission
        const { error } = await supabase
          .from('role_permissions')
          .delete()
          .eq('role_id', roleId)
          .eq('permission_id', permissionId);

        if (error) throw error;

        setRolePermissions((prev) =>
          prev.filter((rp) => !(rp.role_id === roleId && rp.permission_id === permissionId))
        );
        toast.success('Đã gỡ quyền');
      } else {
        // Add permission
        const { data, error } = await supabase
          .from('role_permissions')
          .insert([{ role_id: roleId, permission_id: permissionId }])
          .select();

        if (error) throw error;

        if (data && data[0]) {
          setRolePermissions((prev) => [...prev, data[0]]);
          toast.success('Đã gán quyền');
        }
      }
    } catch (error: any) {
      console.error('Error toggling permission:', error);
      toast.error('Lỗi: ' + error.message);
    }
  };

  // ============================================
  // RENDER
  // ============================================

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader2 className={styles.spinner} />
        <p className={styles.loadingText}>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Shield className={styles.headerIcon} />
          <div>
            <h1 className={styles.title}>Quản trị Phân quyền</h1>
            <p className={styles.subtitle}>
              Quản lý người dùng, vai trò và ma trận phân quyền hệ thống MAPPA
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className={styles.tabsContainer}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'matrix' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('matrix')}
          >
            <Grid3x3 size={18} />
            Ma trận Phân quyền
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'roles' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('roles')}
          >
            <Shield size={18} />
            Vai trò ({roles.length})
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'permissions' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('permissions')}
          >
            <Key size={18} />
            Quyền hạn ({permissions.length})
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'users' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <Users size={18} />
            Người dùng ({users.length})
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className={styles.tabContent}>
        {activeTab === 'matrix' && (
          <PermissionMatrixView
            roles={roles}
            permissions={permissions}
            modules={modules}
            rolePermissions={rolePermissions}
            onTogglePermission={togglePermission}
          />
        )}

        {activeTab === 'roles' && (
          <RolesView roles={roles} onRefresh={fetchAllData} />
        )}

        {activeTab === 'permissions' && (
          <PermissionsView
            permissions={permissions}
            modules={modules}
            onRefresh={fetchAllData}
          />
        )}

        {activeTab === 'users' && (
          <UsersView users={users} roles={roles} userRoles={userRoles} onRefresh={fetchAllData} />
        )}
      </div>

      {/* Stats Footer */}
      <div className={styles.statsFooter}>
        <div className={styles.statItem}>
          <Users size={16} />
          <span>{users.length} người dùng</span>
        </div>
        <div className={styles.statItem}>
          <Shield size={16} />
          <span>{roles.length} vai trò</span>
        </div>
        <div className={styles.statItem}>
          <Key size={16} />
          <span>{permissions.length} quyền</span>
        </div>
        <div className={styles.statItem}>
          <Settings size={16} />
          <span>{modules.length} modules</span>
        </div>
      </div>
    </div>
  );
};

// ============================================
// PERMISSION MATRIX VIEW
// ============================================

interface PermissionMatrixViewProps {
  roles: Role[];
  permissions: Permission[];
  modules: Module[];
  rolePermissions: RolePermission[];
  onTogglePermission: (roleId: number, permissionId: number) => void;
}

const PermissionMatrixView: React.FC<PermissionMatrixViewProps> = ({
  roles,
  permissions,
  modules,
  rolePermissions,
  onTogglePermission,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState<number | 'all'>('all');

  const hasPermission = (roleId: number, permissionId: number): boolean => {
    return rolePermissions.some(
      (rp) => rp.role_id === roleId && rp.permission_id === permissionId
    );
  };

  const filteredPermissions = permissions.filter((perm) => {
    const matchesSearch = searchQuery
      ? perm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        perm.code.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    const matchesModule = selectedModule === 'all' || perm.module_id === selectedModule;
    return matchesSearch && matchesModule;
  });

  // Group permissions by module
  const permissionsByModule = modules.map((module) => ({
    module,
    permissions: filteredPermissions.filter((p) => p.module_id === module.id),
  }));

  return (
    <div className={styles.matrixView}>
      {/* Filters */}
      <div className={styles.matrixFilters}>
        <div className={styles.searchBox}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Tìm kiếm quyền..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <select
          className={styles.filterSelect}
          value={selectedModule}
          onChange={(e) => setSelectedModule(e.target.value === 'all' ? 'all' : Number(e.target.value))}
        >
          <option value="all">Tất cả Modules</option>
          {modules.map((mod) => (
            <option key={mod.id} value={mod.id}>
              {mod.name}
            </option>
          ))}
        </select>
      </div>

      {/* Permission Matrix Table */}
      <div className={styles.matrixTableContainer}>
        <table className={styles.matrixTable}>
          <thead>
            <tr>
              <th className={styles.stickyColumn}>Quyền</th>
              {roles.map((role) => (
                <th key={role.id} className={styles.roleHeader}>
                  <div className={styles.roleHeaderContent}>
                    <span className={styles.roleName}>{role.name}</span>
                    {role.is_system && (
                      <span className={styles.systemBadge}>System</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {permissionsByModule.map(({ module, permissions: modulePerms }) => {
              if (modulePerms.length === 0) return null;

              return (
                <React.Fragment key={module.id}>
                  {/* Module Header Row */}
                  <tr className={styles.moduleRow}>
                    <td colSpan={roles.length + 1} className={styles.moduleHeader}>
                      <Settings size={16} />
                      <span>{module.name}</span>
                    </td>
                  </tr>
                  {/* Permission Rows */}
                  {modulePerms.map((permission) => (
                    <tr key={permission.id} className={styles.permissionRow}>
                      <td className={styles.stickyColumn}>
                        <div className={styles.permissionCell}>
                          <span className={styles.permissionName}>{permission.name}</span>
                          <span className={styles.permissionCode}>{permission.code}</span>
                        </div>
                      </td>
                      {roles.map((role) => {
                        const checked = hasPermission(role.id, permission.id);
                        return (
                          <td key={role.id} className={styles.checkboxCell}>
                            <button
                              className={`${styles.checkboxButton} ${checked ? styles.checked : ''}`}
                              onClick={() => onTogglePermission(role.id, permission.id)}
                              disabled={role.is_system && role.code === 'admin'} // Admin luôn có tất cả quyền
                              title={checked ? 'Click để gỡ quyền' : 'Click để gán quyền'}
                            >
                              {checked ? (
                                <CheckSquare size={20} className={styles.checkIcon} />
                              ) : (
                                <Square size={20} className={styles.uncheckIcon} />
                              )}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>

        {filteredPermissions.length === 0 && (
          <div className={styles.emptyState}>
            <AlertCircle size={48} />
            <p>Không tìm thấy quyền nào</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// ROLES VIEW (Placeholder)
// ============================================

interface RolesViewProps {
  roles: Role[];
  onRefresh: () => void;
}

const RolesView: React.FC<RolesViewProps> = ({ roles, onRefresh }) => {
  return (
    <div className={styles.listView}>
      <div className={styles.listHeader}>
        <h2 className={styles.listTitle}>Danh sách Vai trò</h2>
        <button className={styles.btnPrimary}>
          <Plus size={16} />
          Thêm vai trò
        </button>
      </div>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên vai trò</th>
              <th>Mã</th>
              <th>Mô tả</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role, idx) => (
              <tr key={role.id}>
                <td>{idx + 1}</td>
                <td>
                  <div className={styles.roleNameCell}>
                    {role.name}
                    {role.is_system && <span className={styles.systemBadge}>System</span>}
                  </div>
                </td>
                <td><code className={styles.code}>{role.code}</code></td>
                <td>{role.description || '—'}</td>
                <td>
                  <span className={role.status === 1 ? styles.statusActive : styles.statusInactive}>
                    {role.status === 1 ? 'Hoạt động' : 'Ngừng'}
                  </span>
                </td>
                <td>
                  <div className={styles.actionButtons}>
                    <button className={styles.btnIconEdit} title="Sửa">
                      <Edit size={14} />
                    </button>
                    <button
                      className={styles.btnIconDelete}
                      title="Xóa"
                      disabled={role.is_system}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ============================================
// PERMISSIONS VIEW (Placeholder)
// ============================================

interface PermissionsViewProps {
  permissions: Permission[];
  modules: Module[];
  onRefresh: () => void;
}

const PermissionsView: React.FC<PermissionsViewProps> = ({ permissions, modules, onRefresh }) => {
  const getModuleName = (moduleId: number) => {
    return modules.find((m) => m.id === moduleId)?.name || 'Unknown';
  };

  return (
    <div className={styles.listView}>
      <div className={styles.listHeader}>
        <h2 className={styles.listTitle}>Danh sách Quyền</h2>
        <button className={styles.btnPrimary}>
          <Plus size={16} />
          Thêm quyền
        </button>
      </div>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>STT</th>
              <th>Module</th>
              <th>Tên quyền</th>
              <th>Mã</th>
              <th>Loại</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {permissions.map((perm, idx) => (
              <tr key={perm.id}>
                <td>{idx + 1}</td>
                <td>{getModuleName(perm.module_id)}</td>
                <td>{perm.name}</td>
                <td><code className={styles.code}>{perm.code}</code></td>
                <td><span className={styles.permissionType}>{perm.permission_type}</span></td>
                <td>
                  <span className={perm.status === 1 ? styles.statusActive : styles.statusInactive}>
                    {perm.status === 1 ? 'Hoạt động' : 'Ngừng'}
                  </span>
                </td>
                <td>
                  <div className={styles.actionButtons}>
                    <button className={styles.btnIconEdit} title="Sửa">
                      <Edit size={14} />
                    </button>
                    <button className={styles.btnIconDelete} title="Xóa">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ============================================
// USERS VIEW (Placeholder)
// ============================================

interface UsersViewProps {
  users: User[];
  roles: Role[];
  userRoles: UserRole[];
  onRefresh: () => void;
}

const UsersView: React.FC<UsersViewProps> = ({ users, roles, userRoles, onRefresh }) => {
  const getUserRoles = (userId: string) => {
    const userRoleIds = userRoles.filter((ur) => ur.user_id === userId).map((ur) => ur.role_id);
    return roles.filter((r) => userRoleIds.includes(r.id));
  };

  return (
    <div className={styles.listView}>
      <div className={styles.listHeader}>
        <h2 className={styles.listTitle}>Danh sách Người dùng</h2>
        <button className={styles.btnPrimary}>
          <Plus size={16} />
          Thêm người dùng
        </button>
      </div>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>STT</th>
              <th>Email</th>
              <th>Tên đầy đủ</th>
              <th>Username</th>
              <th>Vai trò</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => {
              const userRolesList = getUserRoles(user.id);
              return (
                <tr key={user.id}>
                  <td>{idx + 1}</td>
                  <td>{user.email}</td>
                  <td>{user.full_name || '—'}</td>
                  <td>{user.username || '—'}</td>
                  <td>
                    <div className={styles.rolesCell}>
                      {userRolesList.length > 0
                        ? userRolesList.map((r) => (
                            <span key={r.id} className={styles.roleBadge}>
                              {r.name}
                            </span>
                          ))
                        : '—'}
                    </div>
                  </td>
                  <td>
                    <span className={user.status === 1 ? styles.statusActive : styles.statusInactive}>
                      {user.status === 1 ? 'Hoạt động' : 'Ngừng'}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button className={styles.btnIconEdit} title="Sửa">
                        <Edit size={14} />
                      </button>
                      <button className={styles.btnIconDelete} title="Xóa">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RBACManagement;