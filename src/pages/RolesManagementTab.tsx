/**
 * Roles Management Tab - MAPPA Portal
 * Quản lý vai trò với CRUD operations và tree permissions selector
 * Tuân thủ design tokens từ /src/styles/theme.css với Inter font
 */

import React, { useState, useEffect } from 'react';
import {
  Shield,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
  Power,
  Users,
  Filter,
  FileDown,
} from 'lucide-react';
import styles from './AdminPage.module.css';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';
import { Pagination, usePagination } from '../components/Pagination';
import { RoleModal } from '../components/RoleModal';
import * as XLSX from 'xlsx';

// ============================================
// TYPES
// ============================================

interface Role {
  id: string | number;
  code: string;
  name: string;
  description: string | null;
  status: number;
  is_system: boolean;
  created_at: string;
  updated_at: string;
  user_count?: number; // From aggregation
}

// ============================================
// MAIN COMPONENT
// ============================================

export const RolesManagementTab: React.FC = () => {
  // State
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<Role[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<number | 'all'>('all');
  const [selectedSystemType, setSelectedSystemType] = useState<'all' | 'system' | 'custom'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  // Pagination
  const itemsPerPage = 20;

  // Fetch data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('roles')
        .select('*, id:_id')
        .order('created_at', { ascending: false });

      if (rolesError) {
        console.error('❌ Error fetching roles:', rolesError);
        toast.error(`Lỗi tải vai trò: ${rolesError.message}`);
        setRoles([]);
      } else {
        
        // Get user counts for each role
        const rolesWithCounts = await Promise.all(
          (rolesData || []).map(async (role) => {
            const { count, error } = await supabase
              .from('user_roles')
              .select('*, id:_id', { count: 'exact', head: true })
              .eq('role_id', role.id);
            
            return {
              ...role,
              user_count: error ? 0 : (count || 0),
            };
          })
        );
        
        setRoles(rolesWithCounts);
      }
    } catch (error) {
      console.error('❌ Error in fetchData:', error);
      toast.error('Lỗi kết nối Supabase');
      setRoles([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter logic
  const filteredRoles = roles.filter((role) => {
    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        role.name?.toLowerCase().includes(query) ||
        role.code?.toLowerCase().includes(query) ||
        role.description?.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    // Status filter
    if (selectedStatus !== 'all' && role.status !== selectedStatus) {
      return false;
    }

    // System type filter
    if (selectedSystemType !== 'all') {
      if (selectedSystemType === 'system' && !role.is_system) {
        return false;
      }
      if (selectedSystemType === 'custom' && role.is_system) {
        return false;
      }
    }

    return true;
  });

  // Pagination
  const {
    currentPage,
    totalPages,
    currentItems: paginatedData,
    setCurrentPage,
  } = usePagination(filteredRoles || [], itemsPerPage);

  // Handlers
  const handleAdd = () => {
    setModalMode('add');
    setSelectedRole(null);
    setShowModal(true);
  };

  const handleEdit = (role: Role) => {
    setModalMode('edit');
    setSelectedRole(role);
    setShowModal(true);
  };

  const handleView = (role: Role) => {
    setModalMode('view');
    setSelectedRole(role);
    setShowModal(true);
  };

  const handleDelete = async (role: Role) => {
    if (role.is_system) {
      toast.error('Không thể xóa vai trò hệ thống');
      return;
    }

    if (!confirm(`Bạn có chắc chắn muốn xóa vai trò "${role.name}"?`)) {
      return;
    }

    try {
      // Check if role has users
      const { count, error: countError } = await supabase
        .from('user_roles')
        .select('*, id:_id', { count: 'exact', head: true })
        .eq('role_id', role.id);

      if (countError) {
        console.error('❌ Error checking user count:', countError);
        toast.error(`Lỗi kiểm tra người dùng: ${countError.message}`);
        return;
      }

      if (count && count > 0) {
        toast.error(`Không thể xóa vai trò đang có ${count} người dùng. Vui lòng gỡ người dùng trước.`);
        return;
      }

      // Delete role_permissions first
      const { error: permError } = await supabase
        .from('role_permissions')
        .delete()
        .eq('role_id', role.id);

      if (permError) {
        console.error('❌ Error deleting role permissions:', permError);
        toast.error(`Lỗi xóa quyền của vai trò: ${permError.message}`);
        return;
      }

      // Delete role
      const { error } = await supabase
        .from('roles')
        .delete()
        .eq('_id', role.id);

      if (error) {
        console.error('❌ Error deleting role:', error);
        toast.error(`Lỗi xóa vai trò: ${error.message}`);
      } else {
        toast.success('Đã xóa vai trò thành công');
        fetchData();
      }
    } catch (error) {
      console.error('❌ Error in handleDelete:', error);
      toast.error('Lỗi xóa vai trò');
    }
  };

  const handleToggleStatus = async (role: Role) => {
    try {
      const newStatus = role.status === 1 ? 0 : 1;
      const { error } = await supabase
        .from('roles')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('_id', role.id);

      if (error) {
        console.error('❌ Error updating role status:', error);
        toast.error(`Lỗi cập nhật trạng thái: ${error.message}`);
      } else {
        toast.success(newStatus === 1 ? 'Đã kích hoạt vai trò' : 'Đã vô hiệu hóa vai trò');
        fetchData();
      }
    } catch (error) {
      console.error('❌ Error in handleToggleStatus:', error);
      toast.error('Lỗi cập nhật trạng thái');
    }
  };

  const getStatusBadge = (status: number) => {
    return status === 1 ? (
      <span className={styles.statusActive}>
        <CheckCircle size={14} />
        Hoạt động
      </span>
    ) : (
      <span className={styles.statusInactive}>
        <XCircle size={14} />
        Vô hiệu hóa
      </span>
    );
  };

  // Export to Excel
  const handleExportExcel = () => {
    try {

      // Prepare data for Excel
      const excelData = filteredRoles.map((role, index) => ({
        'STT': index + 1,
        'Mã vai trò': role.code,
        'Tên vai trò': role.name,
        'Mô tả': role.description || '',
        'Số người dùng': role.user_count || 0,
        'Trạng thái': role.status === 1 ? 'Hoạt động' : 'Vô hiệu hóa',
        'Vai trò hệ thống': role.is_system ? 'Có' : 'Không',
        'Ngày tạo': new Date(role.created_at).toLocaleString('vi-VN'),
        'Ngày cập nhật': new Date(role.updated_at).toLocaleString('vi-VN'),
      }));

      // Create workbook
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);

      // Set column widths
      const colWidths = [
        { wch: 5 },  // STT
        { wch: 20 }, // Mã vai trò
        { wch: 30 }, // Tên vai trò
        { wch: 40 }, // Mô tả
        { wch: 12 }, // Số người dùng
        { wch: 15 }, // Trạng thái
        { wch: 18 }, // Vai trò hệ thống
        { wch: 20 }, // Ngày tạo
        { wch: 20 }, // Ngày cập nhật
      ];
      ws['!cols'] = colWidths;

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Danh sách vai trò');

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const filename = `MAPPA_Vai_Tro_${timestamp}.xlsx`;

      // Write file
      XLSX.writeFile(wb, filename);

      toast.success(`Đã xuất ${filteredRoles.length} vai trò ra Excel`);
    } catch (error) {
      console.error('❌ Error exporting to Excel:', error);
      toast.error('Lỗi xuất Excel');
    }
  };

  // Loading state
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
      {/* Header Row: Search + Actions */}
      <div className={styles.headerRow}>
        {/* Left: Search & Filter Toggle */}
        <div className={styles.filterGroup}>
          {/* Search */}
          <div className={styles.searchBox}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, mã, mô tả..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          {/* Filter Toggle Button */}
          <button
            className={showFilters ? styles.btnPrimary : styles.btnSecondary}
            onClick={() => setShowFilters(!showFilters)}
            title={showFilters ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
          >
            <Filter size={16} />
            Bộ lọc
          </button>
        </div>

        {/* Right: Actions */}
        <div className={styles.actionGroup}>
          <button className={styles.btnSecondary} onClick={fetchData}>
            <RefreshCw size={16} />
            Làm mới
          </button>
          <button className={styles.btnPrimary} onClick={handleAdd}>
            <Plus size={16} />
            Thêm vai trò
          </button>
          <button className={styles.btnPrimary} onClick={handleExportExcel}>
            <FileDown size={16} />
            Xuất Excel
          </button>
        </div>
      </div>

      {/* Filter Panel - Conditional Display, Horizontal Layout */}
      {showFilters && (
        <div className={styles.filterPanel}>
          <div className={styles.filterRow}>
            {/* Status Filter */}
            <div className={styles.filterItem}>
              <label>Trạng thái</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className={styles.select}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value={1}>Hoạt động</option>
                <option value={0}>Vô hiệu hóa</option>
              </select>
            </div>

            {/* System Type Filter */}
            <div className={styles.filterItem}>
              <label>Loại vai trò</label>
              <select
                value={selectedSystemType}
                onChange={(e) => setSelectedSystemType(e.target.value as 'all' | 'system' | 'custom')}
                className={styles.select}
              >
                <option value="all">Tất cả loại</option>
                <option value="system">Vai trò hệ thống</option>
                <option value="custom">Vai trò tùy chỉnh</option>
              </select>
            </div>

            {/* Clear Filters Button */}
            {(selectedStatus !== 'all' || selectedSystemType !== 'all' || searchQuery) && (
              <div className={styles.filterItem}>
                <label>&nbsp;</label>
                <button
                  className={styles.btnSecondary}
                  onClick={() => {
                    setSelectedStatus('all');
                    setSelectedSystemType('all');
                    setSearchQuery('');
                  }}
                >
                  Xóa bộ lọc
                </button>
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
              <th style={{ width: '160px' }}>Mã vai trò</th>
              <th style={{ width: 'auto', minWidth: '200px' }}>Tên & Mô tả</th>
              <th style={{ width: '100px', textAlign: 'center' }}>Người dùng</th>
              <th style={{ width: '120px' }}>Trạng thái</th>
              <th style={{ width: '90px', textAlign: 'center' }}>Hệ thống</th>
              <th style={{ width: '150px', textAlign: 'center' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={7} className={styles.emptyState}>
                  <AlertCircle size={48} />
                  <p>Không tìm thấy vai trò nào</p>
                </td>
              </tr>
            ) : (
              paginatedData.map((role, index) => (
                <tr key={role.id}>
                  <td style={{ textAlign: 'center' }}>
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td>
                    <code className={styles.codeText}>{role.code}</code>
                  </td>
                  <td>
                    <div className={styles.cellMain}>
                      <div className={styles.cellWithIcon}>
                        <Shield size={16} style={{ color: 'var(--primary, #005cb6)' }} />
                        <span className={styles.cellTitle}>{role.name}</span>
                      </div>
                      {role.description && (
                        <div className={styles.cellSubtitle}>{role.description}</div>
                      )}
                    </div>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--spacing-1, 4px)' }}>
                      <Users size={14} style={{ color: 'var(--muted-foreground, #6b7280)' }} />
                      <span style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: 'var(--foreground, #111827)',
                      }}>
                        {role.user_count?.toLocaleString() || 0}
                      </span>
                    </div>
                  </td>
                  <td>{getStatusBadge(role.status)}</td>
                  <td style={{ textAlign: 'center' }}>
                    {role.is_system ? (
                      <CheckCircle size={18} className={styles.iconSuccess} />
                    ) : (
                      <XCircle size={18} className={styles.iconMuted} />
                    )}
                  </td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button
                        className={styles.btnIcon}
                        onClick={() => handleView(role)}
                        title="Xem chi tiết"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className={styles.btnIcon}
                        onClick={() => handleEdit(role)}
                        title="Chỉnh sửa"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className={role.status === 1 ? styles.btnIconWarning : styles.btnIconSuccess}
                        onClick={() => handleToggleStatus(role)}
                        title={role.status === 1 ? 'Vô hiệu hóa' : 'Kích hoạt'}
                      >
                        <Power size={16} />
                      </button>
                      <button
                        className={styles.btnIconDanger}
                        onClick={() => handleDelete(role)}
                        title="Xóa"
                        disabled={role.is_system}
                      >
                        <Trash2 size={16} />
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
      {filteredRoles.length > 0 && totalPages > 1 && (
        <div className={styles.tableFooter}>
          <div className={styles.footerInfo}>
            Hiển thị <strong>{(currentPage - 1) * itemsPerPage + 1}</strong> đến{' '}
            <strong>{Math.min(currentPage * itemsPerPage, filteredRoles.length)}</strong> trong tổng số{' '}
            <strong>{filteredRoles.length}</strong> vai trò
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredRoles.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <RoleModal
          mode={modalMode}
          role={selectedRole}
          onClose={() => setShowModal(false)}
          onSave={fetchData}
        />
      )}
    </div>
  );
};

export default RolesManagementTab;