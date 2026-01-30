/**
 * Role Modal Component - MAPPA Portal
 * Form quản lý vai trò với tree selector chọn permissions theo module
 * Tuân thủ design tokens từ /src/styles/theme.css với Inter font
 */

import React, { useState, useEffect } from 'react';
import {
  Shield,
  CheckCircle,
  Loader2,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Info,
  X,
} from 'lucide-react';
import styles from '../pages/AdminPage.module.css';
import { toast } from 'sonner';
import { supabase } from '@/api/supabaseClient';

// ============================================
// TYPES
// ============================================

interface Module {
  id: string | number;
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
  id: string | number;
  module_id: string | number;
  code: string;
  name: string;
  description: string | null;
  permission_type: string;
  status: number;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

interface Role {
  id: string | number;
  code: string;
  name: string;
  description: string | null;
  status: number;
  is_system: boolean;
  created_at: string;
  updated_at: string;
}

interface RoleModalProps {
  mode: 'add' | 'edit' | 'view';
  role: Role | null;
  onClose: () => void;
  onSave: () => void;
}

// ============================================
// ROLE MODAL COMPONENT
// ============================================

export const RoleModal: React.FC<RoleModalProps> = ({
  mode,
  role,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    code: role?.code || '',
    name: role?.name || '',
    description: role?.description || '',
    status: role?.status ?? 1,
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modules, setModules] = useState<Module[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string | number>>(new Set());
  const [expandedModules, setExpandedModules] = useState<Set<string | number>>(new Set());

  const isViewMode = mode === 'view';

  // Fetch modules and permissions
  useEffect(() => {
    fetchData();
  }, []);

  // Load selected permissions for edit mode
  useEffect(() => {
    if (role && mode !== 'add') {
      loadRolePermissions();
    }
  }, [role, mode]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch modules
      const { data: modulesData, error: modulesError } = await supabase
        .from('modules')
        .select('*, id:_id')
        .eq('status', 1)
        .order('order_index', { ascending: true });

      if (modulesError) {
        console.error('❌ Error fetching modules:', modulesError);
        toast.error(`Lỗi tải modules: ${modulesError.message}`);
        setModules([]);
      } else {
        setModules(modulesData || []);
      }

      // Fetch permissions (only active)
      const { data: permissionsData, error: permissionsError } = await supabase
        .from('permissions')
        .select('*, id:_id')
        .eq('status', 1)
        .order('module_id', { ascending: true })
        .order('code', { ascending: true });

      if (permissionsError) {
        console.error('❌ Error fetching permissions:', permissionsError);
        toast.error(`Lỗi tải permissions: ${permissionsError.message}`);
        setPermissions([]);
      } else {
        setPermissions(permissionsData || []);
      }
    } catch (error) {
      console.error('❌ Error in fetchData:', error);
      toast.error('Lỗi kết nối Supabase');
      setModules([]);
      setPermissions([]);
    } finally {
      setLoading(false);
    }
  };

  const loadRolePermissions = async () => {
    if (!role) return;

    try {
      
      const { data, error } = await supabase
        .from('role_permissions')
        .select('permission_id')
        .eq('role_id', role.id);

      if (error) {
        console.error('❌ Error loading role permissions:', error);
        toast.error(`Lỗi tải quyền của vai trò: ${error.message}`);
      } else {
        const permIds = new Set(data?.map(rp => rp.permission_id) || []);
        setSelectedPermissions(permIds);
      }
    } catch (error) {
      console.error('❌ Error in loadRolePermissions:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.code || !formData.name) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    try {
      setSaving(true);

      if (mode === 'add') {
        
        // Create new role
        const { data: newRole, error: roleError } = await supabase
          .from('roles')
          .insert([{
            code: formData.code,
            name: formData.name,
            description: formData.description,
            status: formData.status,
            is_system: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }])
          .select()
          .single();

        if (roleError) {
          console.error('❌ Error creating role:', roleError);
          toast.error(`Lỗi tạo vai trò: ${roleError.message}`);
          setSaving(false);
          return;
        }


        // Insert role permissions
        if (selectedPermissions.size > 0) {
          
          const rolePermissions = Array.from(selectedPermissions).map(permId => ({
            role_id: newRole.id,
            permission_id: permId,
            created_at: new Date().toISOString(),
          }));


          const { error: permError } = await supabase
            .from('role_permissions')
            .insert(rolePermissions);

          if (permError) {
            console.error('❌ Error assigning permissions:', permError);
            toast.error(`Lỗi gán quyền: ${permError.message}`);
            setSaving(false);
            return;
          }

        } else {
        }

        toast.success(`Đã tạo vai trò "${formData.name}" với ${selectedPermissions.size} quyền`);
        onSave();
        onClose();
        
      } else if (mode === 'edit' && role) {
        
        // Update role basic info
        const { error: roleError } = await supabase
          .from('roles')
          .update({
            code: formData.code,
            name: formData.name,
            description: formData.description,
            status: formData.status,
            updated_at: new Date().toISOString(),
          })
          .eq('_id', role.id);

        if (roleError) {
          console.error('❌ Error updating role:', roleError);
          toast.error(`Lỗi cập nhật vai trò: ${roleError.message}`);
          setSaving(false);
          return;
        }


        // Delete existing permissions
        const { error: deleteError } = await supabase
          .from('role_permissions')
          .delete()
          .eq('role_id', role.id);

        if (deleteError) {
          console.error('❌ Error deleting old permissions:', deleteError);
          toast.error(`Lỗi xóa quyền cũ: ${deleteError.message}`);
          setSaving(false);
          return;
        }


        // Insert new permissions
        if (selectedPermissions.size > 0) {
          
          const rolePermissions = Array.from(selectedPermissions).map(permId => ({
            role_id: role.id,
            permission_id: permId,
            created_at: new Date().toISOString(),
          }));


          const { error: permError } = await supabase
            .from('role_permissions')
            .insert(rolePermissions);

          if (permError) {
            console.error('❌ Error inserting new permissions:', permError);
            toast.error(`Lỗi gán quyền mới: ${permError.message}`);
            setSaving(false);
            return;
          }

        } else {
        }

        toast.success(`Đã cập nhật vai trò "${formData.name}" với ${selectedPermissions.size} quyền`);
        onSave();
        onClose();
      }
    } catch (error) {
      console.error('❌ Error in handleSubmit:', error);
      toast.error('Lỗi khi lưu vai trò');
      setSaving(false);
    } finally {
      if (mode === 'add' || mode === 'edit') {
        setSaving(false);
      }
    }
  };

  // Toggle module expansion
  const toggleModule = (moduleId: string | number) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  // Toggle permission selection
  const togglePermission = (permissionId: string | number) => {
    if (isViewMode) return;

    const newSelected = new Set(selectedPermissions);
    if (newSelected.has(permissionId)) {
      newSelected.delete(permissionId);
    } else {
      newSelected.add(permissionId);
    }
    setSelectedPermissions(newSelected);
  };

  // Toggle all permissions in a module
  const toggleModulePermissions = (moduleId: string | number) => {
    if (isViewMode) return;

    const modulePerms = permissions.filter(p => String(p.module_id) === String(moduleId));
    const modulePermIds = modulePerms.map(p => p.id);
    const allSelected = modulePermIds.every(id => selectedPermissions.has(id));

    const newSelected = new Set(selectedPermissions);
    if (allSelected) {
      // Unselect all
      modulePermIds.forEach(id => newSelected.delete(id));
    } else {
      // Select all
      modulePermIds.forEach(id => newSelected.add(id));
    }
    setSelectedPermissions(newSelected);
  };

  // Check if module is fully selected
  const isModuleFullySelected = (moduleId: string | number) => {
    const modulePerms = permissions.filter(p => String(p.module_id) === String(moduleId));
    if (modulePerms.length === 0) return false;
    return modulePerms.every(p => selectedPermissions.has(p.id));
  };

  // Check if module is partially selected
  const isModulePartiallySelected = (moduleId: string | number) => {
    const modulePerms = permissions.filter(p => String(p.module_id) === String(moduleId));
    if (modulePerms.length === 0) return false;
    const selectedCount = modulePerms.filter(p => selectedPermissions.has(p.id)).length;
    return selectedCount > 0 && selectedCount < modulePerms.length;
  };

  // Group permissions by module
  const permissionsByModule = modules.map(module => ({
    module,
    permissions: permissions.filter(p => String(p.module_id) === String(module.id)),
  }));

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div 
        className={styles.modal} 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '700px', maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
      >
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            <Shield size={20} />
            {mode === 'add' ? 'Thêm vai trò mới' : mode === 'edit' ? 'Chỉnh sửa vai trò' : 'Chi tiết vai trò'}
          </h2>
          <button className={styles.modalClose} onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1 }}>
          <div className={styles.modalBody} style={{ overflowY: 'auto', flex: 1 }}>
            {/* Basic Info Section */}
            <div style={{ marginBottom: 'var(--spacing-6, 24px)' }}>
              {/* Row 1: Code & Name */}
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    <span className={styles.labelText}>Mã vai trò</span>
                    <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className={styles.input}
                    placeholder="VD: MANAGER"
                    disabled={isViewMode}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    <span className={styles.labelText}>Tên vai trò</span>
                    <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={styles.input}
                    placeholder="VD: Quản lý"
                    disabled={isViewMode}
                    required
                  />
                </div>
              </div>

              {/* Row 2: Description */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <span className={styles.labelText}>Mô tả</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={styles.textarea}
                  placeholder="Mô tả vai trò..."
                  rows={2}
                  disabled={isViewMode}
                />
              </div>

              {/* Row 3: Status */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <span className={styles.labelText}>Trạng thái</span>
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: Number(e.target.value) })}
                  className={styles.input}
                  disabled={isViewMode}
                >
                  <option value={1}>Hoạt động</option>
                  <option value={0}>Vô hiệu hóa</option>
                </select>
              </div>
            </div>

            {/* Permissions Section */}
            <div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                marginBottom: 'var(--spacing-3, 12px)',
                paddingBottom: 'var(--spacing-3, 12px)',
                borderBottom: '1px solid var(--border, #e5e7eb)',
              }}>
                <label className={styles.label} style={{ marginBottom: 0 }}>
                  <span className={styles.labelText}>Chức năng/quyền</span>
                </label>
                {selectedPermissions.size > 0 && (
                  <span style={{
                    fontSize: '13px',
                    fontFamily: 'Inter, sans-serif',
                    color: 'var(--muted-foreground, #6b7280)',
                  }}>
                    Đã chọn: <strong>{selectedPermissions.size}</strong> quyền
                  </span>
                )}
              </div>

              {loading ? (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  padding: 'var(--spacing-8, 32px)',
                  gap: 'var(--spacing-2, 8px)',
                }}>
                  <Loader2 className={styles.spinner} size={20} />
                  <span style={{ fontSize: '13px', fontFamily: 'Inter, sans-serif', color: 'var(--muted-foreground, #6b7280)' }}>
                    Đang tải...
                  </span>
                </div>
              ) : modules.length === 0 ? (
                <div className={styles.alertWarning}>
                  <AlertCircle size={18} />
                  <div>
                    <strong>Chưa có modules trong hệ thống!</strong>
                    <p>Vui lòng tạo ít nhất một module trước.</p>
                  </div>
                </div>
              ) : (
                <div style={{
                  border: '1px solid var(--border, #e5e7eb)',
                  borderRadius: 'var(--radius, 6px)',
                  maxHeight: '400px',
                  overflowY: 'auto',
                }}>
                  {permissionsByModule.map(({ module, permissions: modulePerms }) => {
                    const isExpanded = expandedModules.has(module.id);
                    const isFullySelected = isModuleFullySelected(module.id);
                    const isPartiallySelected = isModulePartiallySelected(module.id);

                    return (
                      <div key={module.id} style={{
                        borderBottom: '1px solid var(--border, #e5e7eb)',
                      }}>
                        {/* Module Header */}
                        <div 
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: 'var(--spacing-3, 12px)',
                            gap: 'var(--spacing-2, 8px)',
                            background: isExpanded ? 'var(--muted, #f9fafb)' : 'transparent',
                            cursor: 'pointer',
                            userSelect: 'none',
                          }}
                          onClick={() => toggleModule(module.id)}
                        >
                          {/* Expand/Collapse Icon */}
                          <div style={{ display: 'flex', alignItems: 'center', width: '20px' }}>
                            {isExpanded ? (
                              <ChevronDown size={16} style={{ color: 'var(--muted-foreground, #6b7280)' }} />
                            ) : (
                              <ChevronRight size={16} style={{ color: 'var(--muted-foreground, #6b7280)' }} />
                            )}
                          </div>

                          {/* Module Checkbox */}
                          <input
                            type="checkbox"
                            checked={isFullySelected}
                            ref={(el) => {
                              if (el) {
                                el.indeterminate = isPartiallySelected;
                              }
                            }}
                            onChange={(e) => {
                              e.stopPropagation();
                              toggleModulePermissions(module.id);
                            }}
                            disabled={isViewMode || modulePerms.length === 0}
                            className={styles.checkbox}
                            style={{ width: '16px', height: '16px', margin: 0 }}
                          />

                          {/* Module Name */}
                          <span style={{
                            flex: 1,
                            fontSize: '14px',
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: 600,
                            color: 'var(--foreground, #111827)',
                          }}>
                            {module.name}
                          </span>

                          {/* Permission Count */}
                          <span style={{
                            fontSize: '12px',
                            fontFamily: 'Inter, sans-serif',
                            color: 'var(--muted-foreground, #6b7280)',
                            background: 'var(--muted, #f3f4f6)',
                            padding: '2px 8px',
                            borderRadius: 'calc(var(--radius, 6px) * 0.5)',
                          }}>
                            {modulePerms.length}
                          </span>
                        </div>

                        {/* Permissions List */}
                        {isExpanded && modulePerms.length > 0 && (
                          <div style={{
                            background: 'var(--background, #ffffff)',
                            padding: 'var(--spacing-2, 8px) var(--spacing-3, 12px)',
                          }}>
                            {modulePerms.map(permission => (
                              <label
                                key={permission.id}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  padding: 'var(--spacing-2, 8px)',
                                  paddingLeft: 'var(--spacing-9, 36px)',
                                  gap: 'var(--spacing-2, 8px)',
                                  cursor: isViewMode ? 'default' : 'pointer',
                                  borderRadius: 'calc(var(--radius, 6px) * 0.5)',
                                  transition: 'background 0.15s ease',
                                }}
                                onMouseEnter={(e) => {
                                  if (!isViewMode) {
                                    e.currentTarget.style.background = 'var(--muted, #f9fafb)';
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = 'transparent';
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedPermissions.has(permission.id)}
                                  onChange={() => togglePermission(permission.id)}
                                  disabled={isViewMode}
                                  className={styles.checkbox}
                                  style={{ width: '14px', height: '14px', margin: 0 }}
                                />
                                <span style={{
                                  flex: 1,
                                  fontSize: '13px',
                                  fontFamily: 'Inter, sans-serif',
                                  color: 'var(--foreground, #111827)',
                                }}>
                                  {permission.name}
                                </span>
                                <span style={{
                                  fontSize: '11px',
                                  fontFamily: 'Inter, sans-serif',
                                  color: 'var(--muted-foreground, #6b7280)',
                                  background: 'var(--muted, #f3f4f6)',
                                  padding: '2px 6px',
                                  borderRadius: 'calc(var(--radius, 6px) * 0.5)',
                                }}>
                                  {permission.permission_type}
                                </span>
                              </label>
                            ))}
                          </div>
                        )}

                        {isExpanded && modulePerms.length === 0 && (
                          <div style={{
                            padding: 'var(--spacing-4, 16px)',
                            paddingLeft: 'var(--spacing-9, 36px)',
                            fontSize: '13px',
                            fontFamily: 'Inter, sans-serif',
                            color: 'var(--muted-foreground, #6b7280)',
                            fontStyle: 'italic',
                          }}>
                            Không có quyền nào
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Info for View Mode */}
            {mode === 'view' && role && (
              <div className={styles.infoBox} style={{ marginTop: 'var(--spacing-4, 16px)' }}>
                <Info size={16} className={styles.infoIcon} />
                <div className={styles.infoContent}>
                  <div className={styles.infoRow}>
                    <strong>Tạo lúc:</strong> {new Date(role.created_at).toLocaleString('vi-VN')}
                  </div>
                  <div className={styles.infoRow}>
                    <strong>Cập nhật:</strong> {new Date(role.updated_at).toLocaleString('vi-VN')}
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
                    {mode === 'add' ? 'Tạo vai trò' : 'Cập nhật'}
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

export default RoleModal;
