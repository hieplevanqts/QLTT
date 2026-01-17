/**
 * User List Tab - MAPPA Portal
 * Quản lý người dùng với CRUD operations, filter, export Excel
 * Tuân thủ design tokens từ /src/styles/theme.css với Inter font
 */

import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  AlertCircle,
  Loader2,
  Filter,
  FileDown,
  Lock,
  Unlock,
  Check,
  Clock,
  Shield,
  Mail,
  Phone,
  RotateCcw,
} from 'lucide-react';
import styles from './AdminPage.module.css';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';
import { Pagination, usePagination } from '../components/Pagination';
import * as XLSX from 'xlsx';
import { UserModal } from '../components/UserModal';
import { DatabaseErrorAlert } from '../components/DatabaseErrorAlert';
import bcrypt from 'bcryptjs';
import { DepartmentTreeSelect } from '../components/DepartmentTreeSelect';

// Default password
const DEFAULT_PASSWORD = 'Couppa@123';

/**
 * ⚠️ IMPORTANT - RBAC Implementation Notes:
 * 
 * Database has a legacy 'role' field (varchar) in users table that is DEPRECATED.
 * DO NOT USE users.role field.
 * 
 * ✅ CORRECT: Use user_roles junction table (many-to-many)
 *   - users (1) ←→ (N) user_roles (N) ←→ (1) roles
 *   - Query: .select('*, user_roles(roles(id, code, name))')
 *   - Access: user.user_roles?.map(ur => ur.roles.name)
 * 
 * ⚠️ IMPORTANT - Department Relationship:
 *   - Uses department_users junction table (many-to-many, but 1 user = 1 department)
 *   - users (1) ←→ (N) department_users (N) ←→ (1) departments
 *   - 1 user has only 1 department (enforce in logic)
 *   - Query: .select('*, department_users(departments(id, name, code, level))')
 *   - Access: user.department_users?.[0]?.departments
 * 
 * ❌ INCORRECT: user.role (legacy field)
 */

interface User {
  id: string;
  email: string;
  username?: string;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  status: number; // 1 = kích hoạt, 0 = hủy kích hoạt
  created_at: string;
  updated_at: string;
  last_login?: string;
  user_roles?: {
    roles: {
      id: string;
      name: string;
      code: string;
    };
  }[];
  department_users?: {
    departments: {
      id: string;
      name: string;
      code: string;
      level: number;
    };
  }[];
  // Helper property for easy access (1 user = 1 department)
  department?: {
    id: string;
    name: string;
    code: string;
    level: number;
  };
}

interface Role {
  id: string;
  code: string;
  name: string;
  description?: string;
}

interface Department {
  id: string;
  parent_id: string | null;
  name: string;
  code: string;
  level: number;
  path: string | null;
}

export const UserListTabNew: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleId, setSelectedRoleId] = useState<string>('all');
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [userToReset, setUserToReset] = useState<User | null>(null);
  const [databaseError, setDatabaseError] = useState<any>(null);

  const itemsPerPage = 20;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setDatabaseError(null); // Clear previous errors
      console.log('🔍 Fetching users, roles, and departments from Supabase...');

      // Fetch roles first
      const { data: rolesData, error: rolesError } = await supabase
        .from('roles')
        .select('*')
        .order('name', { ascending: true });

      if (rolesError) {
        console.error('❌ Error fetching roles:', rolesError);
        toast.error(`Lỗi tải vai trò: ${rolesError.message}`);
      } else {
        console.log(`✅ Loaded ${rolesData?.length || 0} roles`);
        setRoles(rolesData || []);
      }

      // Fetch departments
      const { data: departmentsData, error: deptError } = await supabase
        .from('departments')
        .select('*')
        .is('deleted_at', null) // ✅ Filter out deleted records
        .order('path', { ascending: true });

      if (deptError) {
        console.error('❌ Error fetching departments:', deptError);
        toast.error(`Lỗi tải phòng ban: ${deptError.message}`);
      } else {
        console.log(`✅ Loaded ${departmentsData?.length || 0} departments`);
        setDepartments(departmentsData || []);
      }

      // Fetch users with their roles
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select(`
          *,
          user_roles (
            roles (
              id,
              code,
              name
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
        .order('created_at', { ascending: false });

      if (usersError) {
        console.error('❌ Error fetching users:', usersError);
        setDatabaseError(usersError); // Set the error for display
        // toast.error(`Lỗi tải người dùng: ${usersError.message}`);
      } else {
        console.log(`✅ Loaded ${usersData?.length || 0} users`);
        
        // ✅ Manually map departments to users (no foreign key constraint)
        const usersWithDepartments = usersData?.map((user) => {
          if (user.department_users && user.department_users.length > 0) {
            const department = user.department_users[0].departments;
            return {
              ...user,
              department: {
                id: department.id,
                name: department.name,
                code: department.code,
                level: department.level,
              },
            };
          }
          return user;
        });
        
        setUsers(usersWithDepartments || []);
      }
    } catch (error) {
      console.error('❌ Error in fetchData:', error);
      toast.error('Lỗi kết nối Supabase');
      setUsers([]);
      setDatabaseError(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    // Status filter
    if (selectedStatus !== 'all' && user.status !== parseInt(selectedStatus)) {
      return false;
    }

    // Role filter
    if (selectedRoleId !== 'all') {
      const hasRole = user.user_roles?.some(
        (ur) => ur.roles.id === selectedRoleId
      );
      if (!hasRole) return false;
    }

    // Department filter
    if (selectedDepartmentId !== 'all') {
      if (user.department?.id !== selectedDepartmentId) {
        return false;
      }
    }

    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        user.full_name?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.phone?.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    return true;
  });

  const {
    currentPage,
    totalPages,
    currentItems: paginatedData,
    setCurrentPage,
  } = usePagination(filteredUsers || [], itemsPerPage);

  const handleToggleStatus = async (user: User) => {
    const newStatus = user.status === 1 ? 0 : 1;

    try {
      const { error } = await supabase
        .from('users')
        .update({ status: newStatus })
        .eq('id', user.id);

      if (error) {
        console.error('❌ Error updating status:', error);
        toast.error(`Lỗi cập nhật trạng thái: ${error.message}`);
      } else {
        console.log('✅ Status updated successfully');
        toast.success(
          newStatus === 1
            ? 'Đã mở khóa tài khoản'
            : 'Đã khóa tài khoản'
        );
        fetchData();
      }
    } catch (error) {
      console.error('❌ Error in handleToggleStatus:', error);
      toast.error('Lỗi cập nhật trạng thái');
    }
  };

  const handleResetPassword = async (user: User) => {
    // Mở confirm dialog
    setUserToReset(user);
    setShowResetConfirm(true);
  };

  const confirmResetPassword = async () => {
    if (!userToReset) return;

    try {
      // Hash password với bcrypt
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(DEFAULT_PASSWORD, salt);

      console.log('🔐 Resetting password for user:', {
        userId: userToReset.id,
        userName: userToReset.full_name,
        hashedPasswordLength: hashedPassword.length,
        hashedPasswordPreview: hashedPassword.substring(0, 20) + '...'
      });

      // Debug: First, try to fetch the current user data to see schema
      const { data: currentUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userToReset.id)
        .single();

      if (fetchError) {
        console.error('❌ Error fetching user for debug:', fetchError);
      } else {
        console.log('📋 Current user data schema:', Object.keys(currentUser || {}));
        console.log('📋 Current user data:', currentUser);
      }

      // Update password trong database
      // Note: Trong production, nên hash password ở server-side để bảo mật hơn
      const { data, error } = await supabase
        .from('users')
        .update({ 
          password: hashedPassword,
          updated_at: new Date().toISOString() 
        })
        .eq('id', userToReset.id)
        .select();

      if (error) {
        console.error('❌ Error resetting password:', error);
        console.error('❌ Error details:', JSON.stringify(error, null, 2));
        toast.error(`Lỗi reset mật khẩu: ${error.message}`);
      } else {
        console.log('✅ Password reset successfully. Updated data:', data);
        toast.success(
          `Đã reset mật khẩu về "${DEFAULT_PASSWORD}" cho ${userToReset.full_name}`
        );
      }
    } catch (error) {
      console.error('❌ Error in confirmResetPassword:', error);
      toast.error('Lỗi reset mật khẩu');
    } finally {
      setShowResetConfirm(false);
      setUserToReset(null);
    }
  };

  const handleAdd = () => {
    setModalMode('add');
    setSelectedUser(null);
    setShowModal(true);
  };

  const handleEdit = (user: User) => {
    setModalMode('edit');
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleView = (user: User) => {
    setModalMode('view');
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleExportExcel = () => {
    try {
      console.log('📊 Exporting users to Excel...');

      const excelData = filteredUsers.map((user, index) => ({
        'STT': index + 1,
        'Email': user.email,
        'Họ tên': user.full_name,
        'Điện thoại': user.phone || '',
        'Vai trò': user.user_roles?.map((ur) => ur.roles.name).join(', ') || '',
        'Trạng thái':
          user.status === 1
            ? 'Hoạt động'
            : 'Đã khóa',
        'Ngày tạo': new Date(user.created_at).toLocaleString('vi-VN'),
        'Đăng nhập cuối': user.last_login
          ? new Date(user.last_login).toLocaleString('vi-VN')
          : '',
        'Bộ phận': user.department?.name || '',
      }));

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);

      const colWidths = [
        { wch: 5 },  // STT
        { wch: 30 }, // Email
        { wch: 25 }, // Họ tên
        { wch: 15 }, // Điện thoại
        { wch: 20 }, // Vai trò
        { wch: 12 }, // Trạng thái
        { wch: 20 }, // Ngày tạo
        { wch: 20 }, // Đăng nhập cuối
        { wch: 20 }, // Bộ phận
      ];
      ws['!cols'] = colWidths;

      XLSX.utils.book_append_sheet(wb, ws, 'Người dùng');

      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const filename = `MAPPA_Nguoi_Dung_${timestamp}.xlsx`;

      XLSX.writeFile(wb, filename);

      console.log(`✅ Exported ${filteredUsers.length} users to ${filename}`);
      toast.success(`Đã xuất ${filteredUsers.length} người dùng ra Excel`);
    } catch (error) {
      console.error('❌ Error exporting to Excel:', error);
      toast.error('Lỗi xuất Excel');
    }
  };

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 1:
        return (
          <span className={styles.statusActive}>
            <Check size={12} /> Hoạt động
          </span>
        );
      case 0:
        return (
          <span className={styles.statusLocked}>
            <Lock size={12} /> Đã khóa
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader2 className={styles.spinner} size={48} />
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className={styles.tabContent}>
      {/* Header Row */}
      <div className={styles.headerRow}>
        <div className={styles.filterGroup}>
          <div className={styles.searchBox}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, email, SĐT..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <button
            className={showFilters ? styles.btnPrimary : styles.btnSecondary}
            onClick={() => setShowFilters(!showFilters)}
            title={showFilters ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
          >
            <Filter size={16} />
            Bộ lọc
          </button>
        </div>

        <div className={styles.actionGroup}>
          <button className={styles.btnSecondary} onClick={fetchData}>
            <RefreshCw size={16} />
            Làm mới
          </button>
          <button className={styles.btnPrimary} onClick={handleAdd}>
            <Plus size={16} />
            Thêm người dùng
          </button>
          <button className={styles.btnPrimary} onClick={handleExportExcel}>
            <FileDown size={16} />
            Xuất Excel
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className={styles.filterPanel}>
          <div className={styles.filterRow}>
            {/* Role Filter */}
            <div className={styles.filterItem}>
              <label>Vai trò</label>
              <select
                value={selectedRoleId}
                onChange={(e) => setSelectedRoleId(e.target.value)}
                className={styles.select}
              >
                <option value="all">Tất cả vai trò ({users.length})</option>
                {roles.map((role) => {
                  const count = users.filter((u) =>
                    u.user_roles?.some((ur) => ur.roles.id === role.id)
                  ).length;
                  return (
                    <option key={role.id} value={role.id}>
                      {role.name} ({count})
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Department Filter */}
            <div className={styles.filterItem}>
              <label>Bộ phận</label>
              <DepartmentTreeSelect
                departments={departments}
                value={selectedDepartmentId}
                onChange={(value) => setSelectedDepartmentId(value)}
                userCounts={(() => {
                  const counts = new Map<string, number>();
                  departments.forEach((dept) => {
                    const count = users.filter((u) => u.department?.id === dept.id).length;
                    counts.set(dept.id, count);
                  });
                  return counts;
                })()}
                totalUsers={users.length}
              />
            </div>

            {/* Status Filter */}
            <div className={styles.filterItem}>
              <label>Trạng thái</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className={styles.select}
              >
                <option value="all">Tất cả trạng thái ({users.length})</option>
                <option value="1">
                  Hoạt động ({users.filter((u) => u.status === 1).length})
                </option>
                <option value="0">
                  Đã khóa ({users.filter((u) => u.status === 0).length})
                </option>
              </select>
            </div>

            {/* Clear Filters */}
            {(selectedRoleId !== 'all' || selectedDepartmentId !== 'all' || selectedStatus !== 'all' || searchQuery) && (
              <div className={styles.filterItem}>
                <label>&nbsp;</label>
                <button
                  className={styles.btnSecondary}
                  onClick={() => {
                    setSelectedRoleId('all');
                    setSelectedDepartmentId('all');
                    setSelectedStatus('all');
                    setSearchQuery('');
                    console.log('🧹 Filters cleared');
                  }}
                >
                  Xóa bộ lọc
                </button>
              </div>
            )}
          </div>

          {/* Filter Status */}
          <div style={{ marginTop: '8px', fontSize: '14px', color: 'var(--text-secondary, #6c757d)' }}>
            {selectedRoleId !== 'all' || selectedDepartmentId !== 'all' || selectedStatus !== 'all' ? (
              <div>
                🔍 Kết quả lọc: <strong>{filteredUsers.length}</strong> người dùng
              </div>
            ) : (
              <div>
                📊 Tổng: <strong>{users.length}</strong> người dùng
              </div>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ width: '50px' }}>STT</th>
              <th style={{ width: 'auto', minWidth: '250px' }}>Thông tin người dùng</th>
              <th style={{ width: '200px' }}>Vai trò</th>
              <th style={{ width: '180px' }}>Bộ phận</th>
              <th style={{ width: '150px' }}>Trạng thái</th>
              <th style={{ width: '180px' }}>Đăng nhập cuối</th>
              <th style={{ width: '180px', textAlign: 'center' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={7} className={styles.emptyState}>
                  <AlertCircle size={48} />
                  <p>Không tìm thấy người dùng nào</p>
                </td>
              </tr>
            ) : (
              paginatedData.map((user, index) => (
                <tr key={user.id}>
                  <td style={{ textAlign: 'center' }}>
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td>
                    <div className={styles.cellMain}>
                      <div className={styles.userCell}>
                        <div className={styles.avatar}>
                          {user.full_name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <div className={styles.cellTitle}>{user.full_name}</div>
                          <div className={styles.cellSubtext}>
                            <Mail size={12} style={{ marginRight: '4px' }} />
                            {user.email}
                          </div>
                          {user.phone && (
                            <div className={styles.cellSubtext}>
                              <Phone size={12} style={{ marginRight: '4px' }} />
                              {user.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    {user.user_roles && user.user_roles.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {user.user_roles.map((ur) => (
                          <span key={ur.roles.id} className={styles.badge}>
                            <Shield size={12} />
                            {ur.roles.name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span style={{ color: 'var(--text-secondary)' }}>-</span>
                    )}
                  </td>
                  <td>
                    {user.department ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <div>
                          <span style={{ fontWeight: 500, fontSize: '13px' }}>
                            {user.department.name}
                          </span>
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                          {user.department.code} • Cấp {user.department.level}
                        </div>
                      </div>
                    ) : (
                      <span style={{ color: 'var(--text-secondary)' }}>Chưa phân bộ</span>
                    )}
                  </td>
                  <td>{getStatusBadge(user.status)}</td>
                  <td>
                    {user.last_login ? (
                      <span style={{ fontSize: '13px' }}>
                        {new Date(user.last_login).toLocaleString('vi-VN', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-secondary)' }}>Chưa đăng nhập</span>
                    )}
                  </td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button
                        className={styles.btnIcon}
                        onClick={() => handleView(user)}
                        title="Xem chi tiết"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className={styles.btnIcon}
                        onClick={() => handleEdit(user)}
                        title="Chỉnh sửa"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className={styles.btnIcon}
                        onClick={() => handleToggleStatus(user)}
                        title={user.status === 1 ? 'Khóa tài khoản' : 'Mở khóa'}
                      >
                        {user.status === 1 ? (
                          <Lock size={16} />
                        ) : (
                          <Unlock size={16} />
                        )}
                      </button>
                      <button
                        className={styles.btnIcon}
                        onClick={() => handleResetPassword(user)}
                        title="Reset mật khẩu"
                      >
                        <RotateCcw size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer with Pagination */}
      {filteredUsers.length > 0 && totalPages > 1 && (
        <div className={styles.tableFooter}>
          <div className={styles.footerInfo}>
            Hiển thị <strong>{(currentPage - 1) * itemsPerPage + 1}</strong> đến{' '}
            <strong>{Math.min(currentPage * itemsPerPage, filteredUsers.length)}</strong> trong tổng số{' '}
            <strong>{filteredUsers.length}</strong> người dùng
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredUsers.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <UserModal
          mode={modalMode}
          user={selectedUser}
          roles={roles}
          departments={departments}
          onClose={() => setShowModal(false)}
          onSave={fetchData}
        />
      )}

      {/* Reset Password Confirmation */}
      {showResetConfirm && userToReset && (
        <div className={styles.confirmDialog}>
          <div className={styles.confirmContent}>
            <AlertCircle size={48} className={styles.confirmIcon} />
            <p className={styles.confirmText}>
              Bạn có chắc chắn muốn reset mật khẩu về "{DEFAULT_PASSWORD}" cho người dùng "{userToReset.full_name}"?
            </p>
            <div className={styles.confirmButtons}>
              <button
                className={styles.btnSecondary}
                onClick={() => setShowResetConfirm(false)}
              >
                Hủy
              </button>
              <button
                className={styles.btnPrimary}
                onClick={confirmResetPassword}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Database Error Alert */}
      {databaseError && (
        <DatabaseErrorAlert
          error={databaseError}
          onRetry={fetchData}
          onClose={() => setDatabaseError(null)}
        />
      )}
    </div>
  );
};

export default UserListTabNew;