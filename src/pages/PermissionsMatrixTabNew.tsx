/**
 * Permissions Matrix Tab - MAPPA Portal
 * Ma trận quyền - Hiển thị permissions theo module với CRUD operations
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
  Filter,
  RefreshCw,
  Grid3x3,
  Key,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Power,
  Info,
  Settings,
} from 'lucide-react';
import styles from './AdminPage.module.css';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';
import { Pagination, usePagination } from '../components/Pagination';

// ============================================
// TYPES
// ============================================

interface Module {
  id: string | number; // Support both UUID and integer
  code: string;
  name: string;
  icon: string | null;
  path: string | null;
  description: string | null;
  order_index: number;
  status: number;
  created_at: string;
  updated_at: string;
}

interface Permission {
  id: string | number; // Support both UUID and integer
  module_id: string | number; // Support both UUID and integer
  code: string;
  name: string;
  description: string | null;
  permission_type: string;
  status: number;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

interface PermissionWithModule extends Permission {
  module?: Module;
}

// ============================================
// MAIN COMPONENT
// ============================================

export const PermissionsMatrixTabNew: React.FC = () => {
  // State
  const [loading, setLoading] = useState(true);
  const [modules, setModules] = useState<Module[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState<string | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<number | 'all'>('all');
  const [selectedType, setSelectedType] = useState<string | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);

  // Pagination
  const itemsPerPage = 20;
  
  // Fetch data
  useEffect(() => {
    fetchData();
  }, []);

  // Debug helper - expose to window for testing
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).testSupabaseConnection = async () => {
        console.log('🧪 Testing Supabase connection...');
        
        // Test modules
        const { data: modulesData, error: modulesError } = await supabase
          .from('modules')
          .select('*')
          .order('order_index', { ascending: true });
        
        console.log('Modules query result:', { data: modulesData, error: modulesError });
        
        // Test permissions
        const { data: permissionsData, error: permissionsError } = await supabase
          .from('permissions')
          .select('*')
          .limit(5);
        
        console.log('Permissions query result:', { data: permissionsData, error: permissionsError });
        
        return { modulesData, modulesError, permissionsData, permissionsError };
      };
      
      console.log('💡 Debug helper loaded. Run window.testSupabaseConnection() in console to test.');
    }
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching modules and permissions from Supabase...');

      // Fetch modules from modules table
      const { data: modulesData, error: modulesError } = await supabase
        .from('modules')
        .select('*')
        .order('order_index', { ascending: true });

      if (modulesError) {
        console.error('❌ Error fetching modules:', modulesError);
        console.error('   Error details:', {
          code: modulesError.code,
          message: modulesError.message,
          details: modulesError.details,
          hint: modulesError.hint,
        });
        
        // Check if it's a table not found error
        if (modulesError.code === '42P01') {
          toast.error('Bảng modules chưa được tạo. Vui lòng chạy migration scripts.');
        } else if (modulesError.code === '42501') {
          toast.error('Lỗi phân quyn: Vui lòng chạy QUICK_FIX_RLS.sql trong Supabase.');
        } else {
          toast.error(`Lỗi tải modules: ${modulesError.message}`);
        }
        
        // Set empty array to show error but not block UI
        setModules([]);
      } else {
        console.log(`✅ Loaded ${modulesData?.length || 0} modules from Supabase`);
        console.log('📦 Modules data:', modulesData);
        setModules(modulesData || []);
        
        // If no modules exist, show warning with instruction
        if (!modulesData || modulesData.length === 0) {
          console.warn('⚠️ No modules found in database. Please check:');
          console.warn('   1. RLS policies allow read access');
          console.warn('   2. Data exists in modules table');
          console.warn('   3. Run: SELECT * FROM modules; in Supabase SQL Editor');
          toast.warning(
            'Không tìm thấy modules. Vui lòng kiểm tra RLS policies hoặc chạy QUICK_FIX_RLS.sql',
            { duration: 6000 }
          );
        }
      }

      // Fetch permissions
      const { data: permissionsData, error: permissionsError } = await supabase
        .from('permissions')
        .select('*')
        .order('module_id', { ascending: true })
        .order('code', { ascending: true });

      if (permissionsError) {
        console.error('❌ Error fetching permissions:', permissionsError);
        console.error('   Error details:', {
          code: permissionsError.code,
          message: permissionsError.message,
          details: permissionsError.details,
          hint: permissionsError.hint,
        });
        
        if (permissionsError.code === '42P01') {
          toast.error('Bảng permissions chưa được tạo. Vui lòng chạy migration scripts.');
        } else if (permissionsError.code === '42501') {
          toast.error('Lỗi phân quyền permissions: Vui lòng chạy QUICK_FIX_RLS.sql trong Supabase.');
        } else {
          toast.error(`Lỗi tải permissions: ${permissionsError.message}`);
        }
        
        setPermissions([]);
      } else {
        console.log(`✅ Loaded ${permissionsData?.length || 0} permissions from Supabase`);
        setPermissions(permissionsData || []);
      }
    } catch (error) {
      console.error('❌ Error in fetchData:', error);
      toast.error('Lỗi kết nối Supabase. Vui lòng kiểm tra kết nối.');
      // Set empty arrays to prevent blocking
      setModules([]);
      setPermissions([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter logic
  const filteredPermissions = permissions.filter((permission) => {
    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        permission.name?.toLowerCase().includes(query) ||
        permission.code?.toLowerCase().includes(query) ||
        permission.description?.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    // Module filter - support both UUID (string) and integer
    if (selectedModule !== 'all') {
      // Direct comparison works for both string UUID and number
      if (String(permission.module_id) !== String(selectedModule)) {
        return false;
      }
    }

    // Status filter
    if (selectedStatus !== 'all' && permission.status !== selectedStatus) {
      return false;
    }

    // Type filter
    if (selectedType !== 'all' && permission.permission_type !== selectedType) {
      return false;
    }

    return true;
  });

  // Get permission types (unique)
  const permissionTypes = Array.from(new Set(permissions.map(p => p.permission_type).filter(Boolean)));

  // Pagination
  const {
    currentPage,
    totalPages,
    currentItems: paginatedData,
    setCurrentPage,
  } = usePagination(filteredPermissions || [], itemsPerPage);

  // Pagination handlers
  const goToPage = (page: number) => setCurrentPage(page);
  const prevPage = () => setCurrentPage(Math.max(1, currentPage - 1));
  const nextPage = () => setCurrentPage(Math.min(totalPages, currentPage + 1));

  // Group permissions by module (not used currently but keep for future)
  const permissionsByModule = modules.map(module => ({
    module,
    permissions: filteredPermissions.filter(p => p.module_id === module.id),
  }));

  // Handlers
  const handleAdd = () => {
    // Check if modules are loaded
    if (!modules || modules.length === 0) {
      toast.error('Vui lòng đợi hệ thống tải danh sách modules');
      return;
    }
    
    setModalMode('add');
    setSelectedPermission(null);
    setShowModal(true);
  };

  const handleEdit = (permission: Permission) => {
    if (!modules || modules.length === 0) {
      toast.error('Vui lòng đợi hệ thống tải danh sách modules');
      return;
    }
    
    setModalMode('edit');
    setSelectedPermission(permission);
    setShowModal(true);
  };

  const handleView = (permission: Permission) => {
    if (!modules || modules.length === 0) {
      toast.error('Vui lòng đợi hệ thống tải danh sách modules');
      return;
    }
    
    setModalMode('view');
    setSelectedPermission(permission);
    setShowModal(true);
  };

  const handleDelete = async (permission: Permission) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa quyền "${permission.name}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('permissions')
        .delete()
        .eq('id', permission.id);

      if (error) {
        console.error('❌ Error deleting permission:', error);
        toast.error(`Lỗi xóa quyền: ${error.message}`);
      } else {
        console.log('✅ Permission deleted successfully');
        toast.success('Đã xóa quyền thành công');
        fetchData();
      }
    } catch (error) {
      console.error('❌ Error in handleDelete:', error);
      toast.error('Lỗi xóa quyền');
    }
  };

  const handleToggleStatus = async (permission: Permission) => {
    try {
      const newStatus = permission.status === 1 ? 0 : 1;
      const { error } = await supabase
        .from('permissions')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', permission.id);

      if (error) {
        console.error('❌ Error updating permission status:', error);
        toast.error(`Lỗi cập nhật trạng thái: ${error.message}`);
      } else {
        console.log('✅ Permission status updated');
        toast.success(newStatus === 1 ? 'Đã kích hoạt quyền' : 'Đã vô hiệu hóa quyền');
        fetchData();
      }
    } catch (error) {
      console.error('❌ Error in handleToggleStatus:', error);
      toast.error('Lỗi cập nhật trạng thái');
    }
  };

  const getModuleName = (moduleId: string | number) => {
    const module = modules.find(m => String(m.id) === String(moduleId));
    return module?.name || 'N/A';
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

  const getTypeBadge = (type: string) => {
    const typeColors: Record<string, string> = {
      'read': styles.badgeInfo,
      'write': styles.badgeWarning,
      'delete': styles.badgeDanger,
      'admin': styles.badgePrimary,
    };
    return (
      <span className={typeColors[type] || styles.badgeDefault}>
        {type}
      </span>
    );
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
      {/* Header Row: Filters + Actions */}
      <div className={styles.headerRow}>
        {/* Left: Filters */}
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
            Thêm quyền
          </button>
        </div>
      </div>

      {/* Filter Panel - Conditional Display, Horizontal Layout */}
      {showFilters && (
        <div className={styles.filterPanel}>
          <div className={styles.filterRow}>
            {/* Module Filter */}
            <div className={styles.filterItem}>
              <label>Module</label>
              <select
                value={selectedModule}
                onChange={(e) => {
                  const newValue = e.target.value === 'all' ? 'all' : e.target.value;
                  console.log('🔍 Module filter changed:', { 
                    rawValue: e.target.value, 
                    parsedValue: newValue,
                    currentValue: selectedModule,
                    availableModules: modules.map(m => ({ id: m.id, name: m.name }))
                  });
                  setSelectedModule(newValue);
                }}
                className={styles.select}
              >
                <option value="all">Tất cả module</option>
                {modules.map((module) => (
                  <option key={module.id} value={module.id}>
                    {module.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className={styles.filterItem}>
              <label>Trạng thái</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className={styles.select}
              >
                <option value="all">Tất cả</option>
                <option value={1}>Hoạt động</option>
                <option value={0}>Vô hiệu hóa</option>
              </select>
            </div>

            {/* Type Filter */}
            <div className={styles.filterItem}>
              <label>Loại quyền</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className={styles.select}
              >
                <option value="all">Tất cả</option>
                {permissionTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters Button */}
            {(selectedModule !== 'all' || selectedStatus !== 'all' || selectedType !== 'all' || searchQuery) && (
              <div className={styles.filterItem}>
                <label>&nbsp;</label>
                <button
                  className={styles.btnSecondary}
                  onClick={() => {
                    setSelectedModule('all');
                    setSelectedStatus('all');
                    setSelectedType('all');
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
              <th style={{ width: '240px' }}>Module</th>
              <th style={{ width: '160px' }}>Mã quyền</th>
              <th style={{ width: 'auto', minWidth: '200px' }}>Tên & Mô tả</th>
              <th style={{ width: '110px' }}>Loại</th>
              <th style={{ width: '120px' }}>Trạng thái</th>
              <th style={{ width: '90px', textAlign: 'center' }}>Mặc định</th>
              <th style={{ width: '150px', textAlign: 'center' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={8} className={styles.emptyState}>
                  <AlertCircle size={48} />
                  <p>Không tìm thấy quyền nào</p>
                  <button className={styles.btnPrimary} onClick={handleAdd}>
                    <Plus size={16} />
                    Thêm quyền mới
                  </button>
                </td>
              </tr>
            ) : (
              paginatedData.map((permission, index) => (
                <tr key={permission.id}>
                  <td style={{ textAlign: 'center' }}>
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td>
                    <div className={styles.cellWithIcon}>
                      <Grid3x3 size={16} />
                      <span className={styles.cellModuleName}>{getModuleName(permission.module_id)}</span>
                    </div>
                  </td>
                  <td>
                    <code className={styles.codeText}>{permission.code}</code>
                  </td>
                  <td>
                    <div className={styles.cellMain}>
                      <div className={styles.cellTitle}>{permission.name}</div>
                      {permission.description && (
                        <div className={styles.cellSubtitle}>{permission.description}</div>
                      )}
                    </div>
                  </td>
                  <td>{getTypeBadge(permission.permission_type)}</td>
                  <td>{getStatusBadge(permission.status)}</td>
                  <td style={{ textAlign: 'center' }}>
                    {permission.is_default ? (
                      <CheckCircle size={18} className={styles.iconSuccess} />
                    ) : (
                      <XCircle size={18} className={styles.iconMuted} />
                    )}
                  </td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button
                        className={styles.btnIcon}
                        onClick={() => handleView(permission)}
                        title="Xem chi tiết"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className={styles.btnIcon}
                        onClick={() => handleEdit(permission)}
                        title="Chỉnh sửa"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className={permission.status === 1 ? styles.btnIconWarning : styles.btnIconSuccess}
                        onClick={() => handleToggleStatus(permission)}
                        title={permission.status === 1 ? 'Vô hiệu hóa' : 'Kích hoạt'}
                      >
                        <Power size={16} />
                      </button>
                      <button
                        className={styles.btnIconDanger}
                        onClick={() => handleDelete(permission)}
                        title="Xóa"
                        disabled={permission.is_default}
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
      {filteredPermissions.length > 0 && totalPages > 1 && (
        <div className={styles.tableFooter}>
          <div className={styles.footerInfo}>
            Hiển thị <strong>{(currentPage - 1) * itemsPerPage + 1}</strong> đến{' '}
            <strong>{Math.min(currentPage * itemsPerPage, filteredPermissions.length)}</strong> trong tổng số{' '}
            <strong>{filteredPermissions.length}</strong> quyền
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredPermissions.length}
            itemsPerPage={itemsPerPage}
            onPageChange={goToPage}
          />
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <PermissionModal
          mode={modalMode}
          permission={selectedPermission}
          modules={modules}
          onClose={() => setShowModal(false)}
          onSave={fetchData}
        />
      )}
    </div>
  );
};

// ============================================
// PERMISSION MODAL
// ============================================

interface PermissionModalProps {
  mode: 'add' | 'edit' | 'view';
  permission: Permission | null;
  modules: Module[];
  onClose: () => void;
  onSave: () => void;
}

const PermissionModal: React.FC<PermissionModalProps> = ({
  mode,
  permission,
  modules,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    module_id: permission?.module_id || (modules[0]?.id || ''),
    code: permission?.code || '',
    name: permission?.name || '',
    description: permission?.description || '',
    permission_type: permission?.permission_type || 'read',
    status: permission?.status ?? 1,
    is_default: permission?.is_default || false,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.code || !formData.name) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      setSaving(true);

      if (mode === 'add') {
        const { error } = await supabase
          .from('permissions')
          .insert([{
            ...formData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }]);

        if (error) {
          console.error('❌ Error creating permission:', error);
          toast.error(`Lỗi tạo quyền: ${error.message}`);
        } else {
          console.log('✅ Permission created successfully');
          toast.success('Đã tạo quyền thành công');
          onSave();
          onClose();
        }
      } else if (mode === 'edit' && permission) {
        const { error } = await supabase
          .from('permissions')
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', permission.id);

        if (error) {
          console.error('❌ Error updating permission:', error);
          toast.error(`Lỗi cập nhật quyền: ${error.message}`);
        } else {
          console.log('✅ Permission updated successfully');
          toast.success('Đã cập nhật quyền thành công');
          onSave();
          onClose();
        }
      }
    } catch (error) {
      console.error('❌ Error in handleSubmit:', error);
      toast.error('Lỗi khi lưu quyền');
    } finally {
      setSaving(false);
    }
  };

  const isViewMode = mode === 'view';

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            <Key size={20} />
            {mode === 'add' ? 'Thêm quyền mới' : mode === 'edit' ? 'Chỉnh sửa quyền' : 'Chi tiết quyền'}
          </h2>
          <button className={styles.modalClose} onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            {/* Alert if no modules available */}
            {(!modules || modules.length === 0) && (
              <div className={styles.alertWarning}>
                <AlertCircle size={18} />
                <div>
                  <strong>Chưa có modules trong hệ thống!</strong>
                  <p>Vui lòng tạo ít nhất một module trước khi thêm quyền.</p>
                </div>
              </div>
            )}

            {/* Row 1: Module & Code */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <span className={styles.labelText}>Module</span>
                  <span className={styles.required}>*</span>
                </label>
                {modules.length > 0 ? (
                  <select
                    value={formData.module_id}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      console.log('🔍 Modal module selection:', {
                        rawValue: e.target.value,
                        parsedValue: newValue,
                        currentValue: formData.module_id
                      });
                      setFormData({ ...formData, module_id: newValue });
                    }}
                    className={styles.input}
                    disabled={isViewMode}
                    required
                  >
                    {modules.map((module) => (
                      <option key={module.id} value={module.id}>
                        {module.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <select className={styles.input} disabled>
                    <option>Không có module nào</option>
                  </select>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <span className={styles.labelText}>Mã quyền</span>
                  <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className={styles.input}
                  placeholder="VD: FACILITY_VIEW"
                  disabled={isViewMode || modules.length === 0}
                  required
                />
              </div>
            </div>

            {/* Row 2: Name */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                <span className={styles.labelText}>Tên quyền</span>
                <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={styles.input}
                placeholder="VD: Xem danh sách cơ sở"
                disabled={isViewMode || modules.length === 0}
                required
              />
            </div>

            {/* Row 3: Description */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                <span className={styles.labelText}>Mô tả</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className={styles.textarea}
                placeholder="Mô tả chi tiết về quyền này..."
                rows={3}
                disabled={isViewMode || modules.length === 0}
              />
            </div>

            {/* Row 4: Permission Type & Status */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <span className={styles.labelText}>Loại quyền</span>
                  <span className={styles.required}>*</span>
                </label>
                <select
                  value={formData.permission_type}
                  onChange={(e) => setFormData({ ...formData, permission_type: e.target.value })}
                  className={styles.input}
                  disabled={isViewMode || modules.length === 0}
                  required
                >
                  <option value="read">Read (Xem)</option>
                  <option value="write">Write (Ghi)</option>
                  <option value="delete">Delete (Xóa)</option>
                  <option value="admin">Admin (Quản trị)</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <span className={styles.labelText}>Trạng thái</span>
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: Number(e.target.value) })}
                  className={styles.input}
                  disabled={isViewMode || modules.length === 0}
                >
                  <option value={1}>Hoạt động</option>
                  <option value={0}>Vô hiệu hóa</option>
                </select>
              </div>
            </div>

            {/* Row 5: Is Default */}
            <div className={styles.formGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formData.is_default}
                  onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                  disabled={isViewMode || modules.length === 0}
                  className={styles.checkbox}
                />
                <span className={styles.checkboxText}>Quyền mặc định (tự động gán cho vai trò mới)</span>
              </label>
            </div>

            {/* Info for View Mode */}
            {mode === 'view' && permission && (
              <div className={styles.infoBox}>
                <Info size={16} className={styles.infoIcon} />
                <div className={styles.infoContent}>
                  <div className={styles.infoRow}>
                    <strong>Tạo lúc:</strong> {new Date(permission.created_at).toLocaleString('vi-VN')}
                  </div>
                  <div className={styles.infoRow}>
                    <strong>Cập nhật:</strong> {new Date(permission.updated_at).toLocaleString('vi-VN')}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className={styles.modalFooter}>
            <button type="button" className={styles.btnSecondary} onClick={onClose}>
              {isViewMode ? 'Đóng' : 'Hủy'}
            </button>
            {!isViewMode && (
              <button type="submit" className={styles.btnPrimary} disabled={saving || modules.length === 0}>
                {saving ? (
                  <>
                    <Loader2 className={styles.spinner} size={16} />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <CheckCircle size={16} />
                    {mode === 'add' ? 'Tạo quyền' : 'Cập nhật'}
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default PermissionsMatrixTabNew;