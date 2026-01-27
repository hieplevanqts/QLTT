/**
 * Ma trận Phân quyền - MAPPA Portal
 * Kết nối Supabase với bảng permissions và map_modules
 * Tuân thủ design system từ /src/styles/theme.css
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  ChevronDown,
  ChevronRight,
  Loader2,
  Shield,
  Key,
  AlertCircle,
  Check,
  Info,
  FolderOpen,
} from 'lucide-react';
import styles from './PermissionsMatrixTab.module.css';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';
import { ModuleModal, PermissionModal } from './PermissionsMatrixModals';

// ============================================
// TYPES
// ============================================

interface Module {
  id: number; // Changed from string to number (BIGSERIAL)
  code?: string;
  name: string;
  icon?: string;
  description: string | null;
  sort_order?: number;
  status?: number;
  created_at?: string;
  updated_at?: string;
}

interface Permission {
  id: number; // Changed from string to number (BIGSERIAL)
  name: string;
  code: string;
  module_id: number; // Changed from string to number
  description: string | null;
  is_default?: boolean;
  status?: number;
  created_at?: string;
  updated_at?: string;
}

// ============================================
// MAIN COMPONENT
// ============================================

export const PermissionsMatrixTab: React.FC = () => {
  // State
  const [loading, setLoading] = useState(true);
  const [modules, setModules] = useState<Module[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set()); // Changed to Set<number>
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal states
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null);
  const [selectedModuleForPermission, setSelectedModuleForPermission] = useState<number | ''>(''); // Changed to number

  // ============================================
  // DATA FETCHING
  // ============================================

  const fetchModules = async () => {
    try {
      const { data, error } = await supabase
        .from('map_modules')
        .select('*, id:_id')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching modules:', error);
        toast.error('Không thể tải danh sách modules');
        return;
      }

      setModules(data || []);
    } catch (err) {
      console.error('Database connection error:', err);
      toast.error('Lỗi kết nối database');
    }
  };

  const fetchPermissions = async () => {
    try {
      const { data, error } = await supabase
        .from('permissions')
        .select('*, id:_id')
        .order('module_id', { ascending: true })
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching permissions:', error);
        toast.error('Không thể tải danh sách permissions');
        return;
      }

      setPermissions(data || []);
    } catch (err) {
      console.error('Database connection error:', err);
      toast.error('Lỗi kết nối database');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchModules(), fetchPermissions()]);
      setLoading(false);
    };
    loadData();
  }, []);

  // ============================================
  // CRUD OPERATIONS - MODULES
  // ============================================

  const handleSaveModule = async (formData: { name: string; description: string }) => {
    if (editingModule) {
      // UPDATE
      try {
        const { error } = await supabase
          .from('map_modules')
          .update({
            name: formData.name,
            description: formData.description || null,
            updated_at: new Date().toISOString(),
          })
          .eq('_id', editingModule.id);

        if (error) throw error;

        setModules(prev => prev.map(m =>
          m.id === editingModule.id ? { ...m, ...formData, updated_at: new Date().toISOString() } : m
        ));
        toast.success('Cập nhật module thành công');
      } catch (err: any) {
        console.error('Error updating module:', err);
        toast.error(`Lỗi: ${err.message}`);
        return;
      }
    } else {
      // INSERT
      try {
        const { data, error } = await supabase
          .from('map_modules')
          .insert([{
            name: formData.name,
            description: formData.description || null,
          }])
          .select();

        if (error) throw error;

        if (data && data[0]) {
          setModules(prev => [...prev, data[0]]);
          toast.success('Thêm module mới thành công');
        }
      } catch (err: any) {
        console.error('Error creating module:', err);
        toast.error(`Lỗi: ${err.message}`);
        return;
      }
    }
    setShowModuleModal(false);
    setEditingModule(null);
  };

  const handleDeleteModule = async (module: Module) => {
    const modulePerms = permissions.filter(p => p.module_id === module.id);
    if (modulePerms.length > 0) {
      toast.error(`Không thể xóa. Tồn tại ${modulePerms.length} quyền trong module này`);
      return;
    }

    try {
      const { error } = await supabase
        .from('map_modules')
        .delete()
        .eq('_id', module.id);

      if (error) throw error;

      setModules(prev => prev.filter(m => m.id !== module.id));
      toast.success('Xóa module thành công');
    } catch (err: any) {
      console.error('Error deleting module:', err);
      toast.error(`Lỗi: ${err.message}`);
    }
  };

  // ============================================
  // CRUD OPERATIONS - PERMISSIONS
  // ============================================

  const handleSavePermission = async (formData: { name: string; code: string; description: string; module: string }) => {
    if (editingPermission) {
      // UPDATE
      try {
        const { error } = await supabase
          .from('permissions')
          .update({
            name: formData.name,
            code: formData.code,
            module_id: formData.module,
            description: formData.description || null,
            updated_at: new Date().toISOString(),
          })
          .eq('_id', editingPermission.id);

        if (error) throw error;

        setPermissions(prev => prev.map(p =>
          p.id === editingPermission.id 
            ? { ...p, name: formData.name, code: formData.code, module_id: formData.module, description: formData.description || null, updated_at: new Date().toISOString() } 
            : p
        ));
        toast.success('Cập nhật quyền thành công');
      } catch (err: any) {
        console.error('Error updating permission:', err);
        toast.error(`Lỗi: ${err.message}`);
        return;
      }
    } else {
      // INSERT
      try {
        const { data, error } = await supabase
          .from('permissions')
          .insert([{
            name: formData.name,
            code: formData.code,
            module_id: formData.module,
            description: formData.description || null,
          }])
          .select();

        if (error) throw error;

        if (data && data[0]) {
          setPermissions(prev => [...prev, data[0]]);
          toast.success('Thêm quyền mới thành công');
        }
      } catch (err: any) {
        console.error('Error creating permission:', err);
        toast.error(`Lỗi: ${err.message}`);
        return;
      }
    }
    setShowPermissionModal(false);
    setEditingPermission(null);
    setSelectedModuleForPermission('');
  };

  const handleDeletePermission = async (permission: Permission) => {
    try {
      const { error } = await supabase
        .from('permissions')
        .delete()
        .eq('_id', permission.id);

      if (error) throw error;

      setPermissions(prev => prev.filter(p => p.id !== permission.id));
      toast.success('Xóa quyền thành công');
    } catch (err: any) {
      console.error('Error deleting permission:', err);
      toast.error(`Lỗi: ${err.message}`);
    }
  };

  // ============================================
  // FILTERED & PAGINATED DATA
  // ============================================

  const filteredModules = useMemo(() => {
    if (!searchQuery) return modules;
    const query = searchQuery.toLowerCase();
    return modules.filter(m =>
      m.name.toLowerCase().includes(query) ||
      (m.description && m.description.toLowerCase().includes(query))
    );
  }, [modules, searchQuery]);

  const paginatedModules = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredModules.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredModules, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredModules.length / itemsPerPage);

  const toggleModule = (moduleId: number) => {
    setExpandedModules(prev => {
      const newSet = new Set(prev);
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId);
      } else {
        newSet.add(moduleId);
      }
      return newSet;
    });
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
            <h1 className={styles.title}>Ma trận Phân quyền</h1>
            <p className={styles.subtitle}>
              Quản lý modules và permissions của hệ thống MAPPA
            </p>
          </div>
        </div>
      </div>

      {/* Filters + Actions Row (Master Framework) */}
      <div className={styles.filterActionsRow}>
        {/* Left: Search + Filters */}
        <div className={styles.filterGroup}>
          <div className={styles.searchBox}>
            <Search className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Tìm kiếm module..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <button
            className={styles.filterButton}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={16} />
            Bộ lọc
          </button>
        </div>

        {/* Right: Actions */}
        <div className={styles.actionGroup}>
          <button
            className={styles.btnPrimary}
            onClick={() => {
              setEditingModule(null);
              setShowModuleModal(true);
            }}
          >
            <Plus size={16} />
            Thêm Module
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statCardHeader}>
            <FolderOpen className={styles.statIcon} />
            <span className={styles.statLabel}>Tổng Modules</span>
          </div>
          <div className={styles.statValue}>{modules.length}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statCardHeader}>
            <Key className={styles.statIcon} />
            <span className={styles.statLabel}>Tổng Permissions</span>
          </div>
          <div className={styles.statValue}>{permissions.length}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statCardHeader}>
            <Check className={styles.statIcon} />
            <span className={styles.statLabel}>Đang hoạt động</span>
          </div>
          <div className={styles.statValue}>{modules.length}</div>
        </div>
      </div>

      {/* Modules Accordion List */}
      <div className={styles.modulesList}>
        {paginatedModules.length === 0 ? (
          <div className={styles.emptyState}>
            <AlertCircle size={48} />
            <p>Không tìm thấy module nào</p>
          </div>
        ) : (
          paginatedModules.map((module) => {
            const modulePermissions = permissions.filter(p => p.module_id === module.id);
            const isExpanded = expandedModules.has(module.id);

            return (
              <div key={module.id} className={styles.moduleCard}>
                {/* Module Header */}
                <div className={styles.moduleHeader}>
                  <button
                    className={styles.moduleToggle}
                    onClick={() => toggleModule(module.id)}
                  >
                    {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                  </button>
                  <div className={styles.moduleInfo}>
                    <div className={styles.moduleNameRow}>
                      <h3 className={styles.moduleName}>{module.name}</h3>
                    </div>
                    <p className={styles.moduleDescription}>{module.description || 'Không có mô tả'}</p>
                  </div>
                  <div className={styles.moduleMeta}>
                    <span className={styles.permissionCount}>
                      <Key size={14} />
                      {modulePermissions.length} quyền
                    </span>
                  </div>
                  <div className={styles.moduleActions}>
                    <button
                      className={styles.btnIconEdit}
                      onClick={() => {
                        setEditingModule(module);
                        setShowModuleModal(true);
                      }}
                      title="Sửa module"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className={styles.btnIconDelete}
                      onClick={() => handleDeleteModule(module)}
                      title="Xóa module"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Permissions Table (Expanded) */}
                {isExpanded && (
                  <div className={styles.permissionsTable}>
                    <div className={styles.permissionsTableHeader}>
                      <h4 className={styles.permissionsTableTitle}>Danh sách quyền</h4>
                      <button
                        className={styles.btnAddPermission}
                        onClick={() => {
                          setSelectedModuleForPermission(module.id);
                          setEditingPermission(null);
                          setShowPermissionModal(true);
                        }}
                      >
                        <Plus size={14} />
                        Thêm quyền
                      </button>
                    </div>

                    {modulePermissions.length === 0 ? (
                      <div className={styles.emptyPermissions}>
                        <Info size={24} />
                        <p>Chưa có quyền nào trong module này</p>
                      </div>
                    ) : (
                      <table className={styles.table}>
                        <thead>
                          <tr>
                            <th>STT</th>
                            <th>Tên quyền</th>
                            <th className={styles.textCenter}>Thao tác</th>
                          </tr>
                        </thead>
                        <tbody>
                          {modulePermissions.map((perm, idx) => (
                            <tr key={perm.id}>
                              <td className={styles.textCenter}>{idx + 1}</td>
                              <td>
                                <div className={styles.permissionInfo}>
                                  <div className={styles.permissionName}>{perm.name}</div>
                                  <div className={styles.permissionMeta}>
                                    <span className={styles.description}>{perm.description || 'Không có mô tả'}</span>
                                  </div>
                                </div>
                              </td>
                              <td className={styles.textCenter}>
                                <div className={styles.actionButtons}>
                                  <button
                                    className={styles.btnIconEdit}
                                    onClick={() => {
                                      setEditingPermission(perm);
                                      setSelectedModuleForPermission(perm.module_id);
                                      setShowPermissionModal(true);
                                    }}
                                    title="Sửa"
                                  >
                                    <Edit size={14} />
                                  </button>
                                  <button
                                    className={styles.btnIconDelete}
                                    onClick={() => handleDeletePermission(perm)}
                                    title="Xóa"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer with Pagination (Master Framework) */}
      <div className={styles.footer}>
        <div className={styles.footerLeft}>
          <span className={styles.footerText}>
            Hiển thị {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredModules.length)} trong tổng {filteredModules.length} bản ghi
          </span>
        </div>
        <div className={styles.footerRight}>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className={styles.itemsPerPageSelect}
          >
            <option value={5}>5 / trang</option>
            <option value={10}>10 / trang</option>
            <option value={20}>20 / trang</option>
            <option value={50}>50 / trang</option>
          </select>
          <div className={styles.pagination}>
            <button
              className={styles.pageButton}
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
            >
              Trước
            </button>
            <span className={styles.pageInfo}>
              Trang {currentPage} / {totalPages || 1}
            </span>
            <button
              className={styles.pageButton}
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
            >
              Sau
            </button>
          </div>
        </div>
      </div>

      {/* Module Modal */}
      {showModuleModal && (
        <ModuleModal
          module={editingModule}
          onSave={handleSaveModule}
          onClose={() => {
            setShowModuleModal(false);
            setEditingModule(null);
          }}
        />
      )}

      {/* Permission Modal */}
      {showPermissionModal && (
        <PermissionModal
          permission={editingPermission}
          selectedModule={selectedModuleForPermission}
          modules={modules}
          onSave={handleSavePermission}
          onClose={() => {
            setShowPermissionModal(false);
            setEditingPermission(null);
            setSelectedModuleForPermission('');
          }}
        />
      )}
    </div>
  );
};

export default PermissionsMatrixTab;