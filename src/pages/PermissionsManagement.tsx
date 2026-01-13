import React, { useState } from 'react';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  X,
  AlertTriangle,
  Shield,
  Eye,
  FileText,
  MapPin,
  Calendar,
  Briefcase,
  Camera,
  TrendingUp,
  Settings,
  CheckCircle,
  Info,
} from 'lucide-react';
import styles from './AdminPage.module.css';

// Permission type
interface Permission {
  id: string;
  name: string;
  code: string;
  description: string;
  type: 'view' | 'create' | 'update' | 'delete' | 'special';
  isDefault: boolean;
  moduleId: string;
}

// Module type
interface Module {
  id: string;
  name: string;
  icon: any;
  description: string;
}

// Modal state
interface ModalState {
  isOpen: boolean;
  mode: 'add' | 'edit';
  permission?: Permission;
}

export const PermissionsManagement = () => {
  const [selectedModuleId, setSelectedModuleId] = useState('admin');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'default' | 'custom'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'type'>('name');
  const [modalState, setModalState] = useState<ModalState>({ isOpen: false, mode: 'add' });
  const [permissions, setPermissions] = useState<Permission[]>(getInitialPermissions());

  // Form state for modal
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    type: 'view' as Permission['type'],
  });

  // Module definitions
  const modules: Module[] = [
    { id: 'overview', name: 'Tổng quan', icon: Eye, description: 'Trang hiển thị số liệu hoặc thông tin chung' },
    { id: 'map', name: 'Bản đồ điều hành', icon: MapPin, description: 'Quản lý dựa trên bản đồ / vị trí' },
    { id: 'facilities', name: 'Cơ sở & Địa bàn', icon: FileText, description: 'Quản lý đơn vị, cơ sở hạ tầng, khu vực' },
    { id: 'risk', name: 'Nguồn tin / Risk', icon: AlertTriangle, description: 'Quản lý nguồn dữ liệu, theo dõi rủi ro' },
    { id: 'planning', name: 'Kế hoạch tác nghiệp', icon: Calendar, description: 'Lập và triển khai kế hoạch' },
    { id: 'field-tasks', name: 'Nhiệm vụ hiện trường', icon: Briefcase, description: 'Giao việc, theo dõi nhiệm vụ ngoài hiện trường' },
    { id: 'evidence', name: 'Kho chứng cứ', icon: Camera, description: 'Lưu trữ hình ảnh, video, tài liệu' },
    { id: 'reports', name: 'Báo cáo & KPI', icon: TrendingUp, description: 'Thống kê, đánh giá hiệu quả' },
    { id: 'admin', name: 'Quản trị', icon: Settings, description: 'Thiết lập hệ thống, phân quyền, người dùng' },
  ];

  // Get current module
  const currentModule = modules.find(m => m.id === selectedModuleId);

  // Filter and sort permissions
  const filteredPermissions = permissions
    .filter(p => p.moduleId === selectedModuleId)
    .filter(p => {
      if (filterType === 'default') return p.isDefault;
      if (filterType === 'custom') return !p.isDefault;
      return true;
    })
    .filter(p => {
      if (!searchTerm) return true;
      return (
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return a.type.localeCompare(b.type);
    });

  // Handle open add modal
  const handleOpenAddModal = () => {
    setFormData({ name: '', code: '', description: '', type: 'view' });
    setModalState({ isOpen: true, mode: 'add' });
  };

  // Handle open edit modal
  const handleOpenEditModal = (permission: Permission) => {
    setFormData({
      name: permission.name,
      code: permission.code,
      description: permission.description,
      type: permission.type,
    });
    setModalState({ isOpen: true, mode: 'edit', permission });
  };

  // Handle close modal
  const handleCloseModal = () => {
    setModalState({ isOpen: false, mode: 'add' });
    setFormData({ name: '', code: '', description: '', type: 'view' });
  };

  // Handle save permission
  const handleSavePermission = () => {
    if (modalState.mode === 'add') {
      const newPermission: Permission = {
        id: `custom-${Date.now()}`,
        name: formData.name,
        code: formData.code.toUpperCase(),
        description: formData.description,
        type: formData.type,
        isDefault: false,
        moduleId: selectedModuleId,
      };
      setPermissions([...permissions, newPermission]);
    } else if (modalState.mode === 'edit' && modalState.permission) {
      setPermissions(permissions.map(p => 
        p.id === modalState.permission!.id 
          ? { ...p, ...formData, code: formData.code.toUpperCase() }
          : p
      ));
    }
    handleCloseModal();
  };

  // Handle delete permission
  const handleDeletePermission = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa quyền này? Hành động này sẽ ảnh hưởng đến toàn hệ thống.')) {
      setPermissions(permissions.filter(p => p.id !== id));
    }
  };

  // Get permission type display
  const getPermissionTypeDisplay = (type: Permission['type']) => {
    const types = {
      view: { label: 'View', color: '#10b981' },
      create: { label: 'Create', color: '#3b82f6' },
      update: { label: 'Update', color: '#f59e0b' },
      delete: { label: 'Delete', color: '#ef4444' },
      special: { label: 'Special', color: '#8b5cf6' },
    };
    return types[type];
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: 'calc(100vh - 280px)',
      padding: '0 var(--spacing-6, 24px)',
      background: 'var(--background, #f9fafb)',
    }}>
      {/* HEADER */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: 'var(--spacing-5, 20px)',
      }}>
        <div>
          <h2 style={{ 
            fontFamily: 'Inter, sans-serif', 
            fontSize: '20px', 
            fontWeight: 700, 
            color: 'var(--foreground)',
            margin: '0 0 6px 0',
          }}>
            Ma trận quyền
          </h2>
          <p style={{ 
            fontFamily: 'Inter, sans-serif', 
            fontSize: '13px', 
            color: 'var(--muted-foreground)',
            margin: 0,
          }}>
            Quản lý các quyền mặc định và quyền mở rộng thuộc module {currentModule?.name}
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-2, 8px)',
            padding: 'var(--spacing-3, 12px) var(--spacing-4, 16px)',
            background: 'linear-gradient(135deg, var(--primary, #005cb6) 0%, #004a94 100%)',
            color: '#ffffff',
            border: 'none',
            borderRadius: 'var(--radius, 6px)',
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
            fontSize: '13px',
            fontWeight: 600,
            boxShadow: '0 2px 8px rgba(0, 92, 182, 0.3)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 92, 182, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 92, 182, 0.3)';
          }}
        >
          <Plus size={16} />
          Thêm quyền
        </button>
      </div>

      {/* FILTER BAR */}
      <div style={{
        background: 'var(--card, #ffffff)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius, 6px)',
        padding: 'var(--spacing-4, 16px)',
        marginBottom: 'var(--spacing-4, 16px)',
        display: 'grid',
        gridTemplateColumns: '200px 2fr 1fr 1fr',
        gap: 'var(--spacing-4, 16px)',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
      }}>
        {/* Module Selector */}
        <div>
          <label style={{ 
            display: 'block',
            fontFamily: 'Inter, sans-serif',
            fontSize: '11px',
            fontWeight: 600,
            color: 'var(--muted-foreground)',
            marginBottom: 'var(--spacing-2, 8px)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            Module
          </label>
          <select 
            className={styles.select}
            value={selectedModuleId}
            onChange={(e) => setSelectedModuleId(e.target.value)}
            style={{ width: '100%', fontFamily: 'Inter, sans-serif', fontSize: '13px' }}
          >
            {modules.map(module => (
              <option key={module.id} value={module.id}>{module.name}</option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div>
          <label style={{ 
            display: 'block',
            fontFamily: 'Inter, sans-serif',
            fontSize: '11px',
            fontWeight: 600,
            color: 'var(--muted-foreground)',
            marginBottom: 'var(--spacing-2, 8px)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            Tìm kiếm
          </label>
          <div className={styles.searchBox} style={{ margin: 0 }}>
            <Search size={16} className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Tìm theo tên, mã quyền hoặc mô tả..." 
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '36px', fontFamily: 'Inter, sans-serif', fontSize: '13px' }}
            />
          </div>
        </div>

        {/* Filter Type */}
        <div>
          <label style={{ 
            display: 'block',
            fontFamily: 'Inter, sans-serif',
            fontSize: '11px',
            fontWeight: 600,
            color: 'var(--muted-foreground)',
            marginBottom: 'var(--spacing-2, 8px)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            Lọc theo
          </label>
          <select 
            className={styles.select}
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            style={{ width: '100%', fontFamily: 'Inter, sans-serif', fontSize: '13px' }}
          >
            <option value="all">Tất cả</option>
            <option value="default">Mặc định</option>
            <option value="custom">Tùy chỉnh</option>
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label style={{ 
            display: 'block',
            fontFamily: 'Inter, sans-serif',
            fontSize: '11px',
            fontWeight: 600,
            color: 'var(--muted-foreground)',
            marginBottom: 'var(--spacing-2, 8px)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            Sắp xếp
          </label>
          <select 
            className={styles.select}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            style={{ width: '100%', fontFamily: 'Inter, sans-serif', fontSize: '13px' }}
          >
            <option value="name">Theo tên</option>
            <option value="type">Theo loại</option>
          </select>
        </div>
      </div>

      {/* PERMISSIONS TABLE */}
      <div style={{ 
        flex: 1, 
        overflow: 'auto', 
        border: '1px solid var(--border)', 
        borderRadius: 'var(--radius, 6px)',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        background: 'var(--card, #ffffff)',
      }}>
        <table className={styles.table} style={{ minWidth: '100%' }}>
          <thead>
            <tr style={{ background: 'var(--muted, rgba(0, 0, 0, 0.02))' }}>
              <th style={{ 
                width: '25%',
                fontFamily: 'Inter, sans-serif',
                fontSize: '12px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                textAlign: 'left',
              }}>
                Tên quyền
              </th>
              <th style={{ 
                width: '18%',
                fontFamily: 'Inter, sans-serif',
                fontSize: '12px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                textAlign: 'left',
              }}>
                Mã quyền
              </th>
              <th style={{ 
                width: '30%',
                fontFamily: 'Inter, sans-serif',
                fontSize: '12px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                textAlign: 'left',
              }}>
                Mô tả
              </th>
              <th style={{ 
                width: '12%',
                fontFamily: 'Inter, sans-serif',
                fontSize: '12px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                textAlign: 'center',
              }}>
                Loại
              </th>
              <th style={{ 
                width: '10%',
                fontFamily: 'Inter, sans-serif',
                fontSize: '12px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                textAlign: 'center',
              }}>
                Trạng thái
              </th>
              <th style={{ 
                width: '5%',
                fontFamily: 'Inter, sans-serif',
                fontSize: '12px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                textAlign: 'center',
              }}>
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredPermissions.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', fontFamily: 'Inter, sans-serif', color: 'var(--muted-foreground)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-2, 8px)' }}>
                    <Info size={32} style={{ opacity: 0.3 }} />
                    <span>Không tìm thấy quyền nào</span>
                  </div>
                </td>
              </tr>
            ) : (
              filteredPermissions.map((permission) => {
                const typeDisplay = getPermissionTypeDisplay(permission.type);
                return (
                  <tr key={permission.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ 
                      fontFamily: 'Inter, sans-serif', 
                      fontWeight: 500,
                      fontSize: '13px',
                    }}>
                      {permission.name}
                    </td>
                    <td style={{ 
                      fontFamily: 'Inter, sans-serif', 
                      fontSize: '12px',
                      color: 'var(--muted-foreground)',
                      fontWeight: 600,
                    }}>
                      <code style={{
                        background: 'var(--muted, rgba(0, 0, 0, 0.05))',
                        padding: '2px 6px',
                        borderRadius: 'var(--radius-sm, 4px)',
                        fontSize: '11px',
                      }}>
                        {permission.code}
                      </code>
                    </td>
                    <td style={{ 
                      fontFamily: 'Inter, sans-serif', 
                      fontSize: '13px',
                      color: 'var(--muted-foreground)',
                    }}>
                      {permission.description}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 10px',
                        background: `${typeDisplay.color}15`,
                        color: typeDisplay.color,
                        borderRadius: 'var(--radius-sm, 4px)',
                        fontSize: '11px',
                        fontWeight: 600,
                        fontFamily: 'Inter, sans-serif',
                      }}>
                        {typeDisplay.label}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {permission.isDefault ? (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '4px 10px',
                          background: 'var(--muted, rgba(0, 0, 0, 0.05))',
                          color: 'var(--muted-foreground)',
                          borderRadius: 'var(--radius-sm, 4px)',
                          fontSize: '11px',
                          fontWeight: 600,
                          fontFamily: 'Inter, sans-serif',
                        }}>
                          <CheckCircle size={12} />
                          Default
                        </span>
                      ) : (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '4px 10px',
                          background: 'rgba(59, 130, 246, 0.1)',
                          color: '#3b82f6',
                          borderRadius: 'var(--radius-sm, 4px)',
                          fontSize: '11px',
                          fontWeight: 600,
                          fontFamily: 'Inter, sans-serif',
                        }}>
                          Custom
                        </span>
                      )}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: 'var(--spacing-1, 4px)', justifyContent: 'center' }}>
                        {!permission.isDefault && (
                          <>
                            <button
                              onClick={() => handleOpenEditModal(permission)}
                              style={{
                                padding: '6px',
                                background: 'transparent',
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--radius-sm, 4px)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s ease',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
                                e.currentTarget.style.borderColor = '#3b82f6';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.borderColor = 'var(--border)';
                              }}
                              title="Sửa quyền"
                            >
                              <Edit size={14} style={{ color: '#3b82f6' }} />
                            </button>
                            <button
                              onClick={() => handleDeletePermission(permission.id)}
                              style={{
                                padding: '6px',
                                background: 'transparent',
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--radius-sm, 4px)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s ease',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                                e.currentTarget.style.borderColor = '#ef4444';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.borderColor = 'var(--border)';
                              }}
                              title="Xóa quyền"
                            >
                              <Trash2 size={14} style={{ color: '#ef4444' }} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* FOOTER STATS */}
      <div style={{
        marginTop: 'var(--spacing-4, 16px)',
        padding: 'var(--spacing-3, 12px) var(--spacing-4, 16px)',
        background: 'var(--muted, rgba(0, 0, 0, 0.02))',
        borderRadius: 'var(--radius-sm, 4px)',
        fontFamily: 'Inter, sans-serif',
        fontSize: '12px',
        color: 'var(--muted-foreground)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span>
          Tổng số: <strong>{filteredPermissions.length}</strong> quyền
        </span>
        <span>
          Mặc định: <strong>{filteredPermissions.filter(p => p.isDefault).length}</strong> | 
          Tùy chỉnh: <strong style={{ color: '#3b82f6' }}>{filteredPermissions.filter(p => !p.isDefault).length}</strong>
        </span>
      </div>

      {/* MODAL - ADD/EDIT PERMISSION */}
      {modalState.isOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
        }}>
          <div style={{
            background: 'var(--card, #ffffff)',
            borderRadius: 'var(--radius-lg, 12px)',
            width: '90%',
            maxWidth: '600px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            maxHeight: '90vh',
            overflow: 'auto',
          }}>
            {/* Modal Header */}
            <div style={{
              padding: 'var(--spacing-5, 20px)',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <h3 style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '18px',
                fontWeight: 700,
                color: 'var(--foreground)',
                margin: 0,
              }}>
                {modalState.mode === 'add' ? 'Thêm quyền mới' : 'Chỉnh sửa quyền'}
              </h3>
              <button
                onClick={handleCloseModal}
                style={{
                  padding: '6px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 'var(--radius-sm, 4px)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--muted, rgba(0, 0, 0, 0.05))';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <X size={20} style={{ color: 'var(--muted-foreground)' }} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: 'var(--spacing-5, 20px)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4, 16px)' }}>
                {/* Permission Name */}
                <div>
                  <label style={{
                    display: 'block',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'var(--foreground)',
                    marginBottom: 'var(--spacing-2, 8px)',
                  }}>
                    Tên quyền <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ví dụ: Xuất báo cáo dữ liệu"
                    className={styles.input}
                    style={{ 
                      width: '100%', 
                      fontFamily: 'Inter, sans-serif', 
                      fontSize: '13px',
                      padding: 'var(--spacing-3, 12px)',
                    }}
                  />
                </div>

                {/* Permission Code */}
                <div>
                  <label style={{
                    display: 'block',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'var(--foreground)',
                    marginBottom: 'var(--spacing-2, 8px)',
                  }}>
                    Mã quyền <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="Ví dụ: REPORT_EXPORT (viết hoa, không dấu)"
                    className={styles.input}
                    style={{ 
                      width: '100%', 
                      fontFamily: 'Inter, sans-serif', 
                      fontSize: '13px',
                      padding: 'var(--spacing-3, 12px)',
                    }}
                  />
                  <p style={{ 
                    fontFamily: 'Inter, sans-serif', 
                    fontSize: '11px', 
                    color: 'var(--muted-foreground)',
                    marginTop: 'var(--spacing-1, 4px)',
                  }}>
                    Mã phải unique trong toàn hệ thống
                  </p>
                </div>

                {/* Description */}
                <div>
                  <label style={{
                    display: 'block',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'var(--foreground)',
                    marginBottom: 'var(--spacing-2, 8px)',
                  }}>
                    Mô tả
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Mô tả chi tiết về quyền này..."
                    className={styles.input}
                    rows={3}
                    style={{ 
                      width: '100%', 
                      fontFamily: 'Inter, sans-serif', 
                      fontSize: '13px',
                      padding: 'var(--spacing-3, 12px)',
                      resize: 'vertical',
                    }}
                  />
                </div>

                {/* Permission Type */}
                <div>
                  <label style={{
                    display: 'block',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'var(--foreground)',
                    marginBottom: 'var(--spacing-2, 8px)',
                  }}>
                    Loại quyền <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as Permission['type'] })}
                    className={styles.select}
                    style={{ 
                      width: '100%', 
                      fontFamily: 'Inter, sans-serif', 
                      fontSize: '13px',
                    }}
                  >
                    <option value="view">View - Xem dữ liệu</option>
                    <option value="create">Create - Tạo mới</option>
                    <option value="update">Update - Cập nhật</option>
                    <option value="delete">Delete - Xóa</option>
                    <option value="special">Special - Quyền đặc biệt</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: 'var(--spacing-5, 20px)',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 'var(--spacing-3, 12px)',
            }}>
              <button
                onClick={handleCloseModal}
                className={styles.secondaryBtn}
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '13px',
                }}
              >
                Hủy
              </button>
              <button
                onClick={handleSavePermission}
                disabled={!formData.name || !formData.code}
                style={{
                  padding: 'var(--spacing-3, 12px) var(--spacing-5, 20px)',
                  background: (!formData.name || !formData.code) 
                    ? 'var(--muted, rgba(0, 0, 0, 0.1))' 
                    : 'linear-gradient(135deg, var(--primary, #005cb6) 0%, #004a94 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 'var(--radius, 6px)',
                  cursor: (!formData.name || !formData.code) ? 'not-allowed' : 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '13px',
                  fontWeight: 600,
                  transition: 'all 0.2s ease',
                }}
              >
                {modalState.mode === 'add' ? 'Thêm quyền' : 'Lưu thay đổi'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Initial permissions data
function getInitialPermissions(): Permission[] {
  return [
    // ============================================
    // ADMIN MODULE - Quản trị
    // ============================================
    { id: 'admin-1', name: 'Xem người dùng', code: 'USER_VIEW', description: 'Xem danh sách và thông tin người dùng trong hệ thống', type: 'view', isDefault: true, moduleId: 'admin' },
    { id: 'admin-2', name: 'Tạo người dùng', code: 'USER_CREATE', description: 'Tạo mới tài khoản người dùng', type: 'create', isDefault: true, moduleId: 'admin' },
    { id: 'admin-3', name: 'Cập nhật người dùng', code: 'USER_UPDATE', description: 'Chỉnh sửa thông tin người dùng', type: 'update', isDefault: true, moduleId: 'admin' },
    { id: 'admin-4', name: 'Xóa người dùng', code: 'USER_DELETE', description: 'Xóa tài khoản người dùng khỏi hệ thống', type: 'delete', isDefault: true, moduleId: 'admin' },
    { id: 'admin-5', name: 'Khóa/Mở khóa người dùng', code: 'USER_LOCK_UNLOCK', description: 'Khóa hoặc mở khóa tài khoản người dùng', type: 'update', isDefault: true, moduleId: 'admin' },
    { id: 'admin-6', name: 'Reset mật khẩu', code: 'USER_RESET_PASSWORD', description: 'Reset mật khẩu cho người dùng', type: 'special', isDefault: true, moduleId: 'admin' },
    { id: 'admin-7', name: 'Xuất danh sách người dùng', code: 'USER_EXPORT', description: 'Xuất danh sách người dùng ra file Excel', type: 'special', isDefault: false, moduleId: 'admin' },
    { id: 'admin-10', name: 'Xem vai trò', code: 'ROLE_VIEW', description: 'Xem danh sách vai trò trong hệ thống', type: 'view', isDefault: true, moduleId: 'admin' },
    { id: 'admin-11', name: 'Tạo vai trò', code: 'ROLE_CREATE', description: 'Tạo vai trò mới', type: 'create', isDefault: true, moduleId: 'admin' },
    { id: 'admin-12', name: 'Cập nhật vai trò', code: 'ROLE_UPDATE', description: 'Chỉnh sửa thông tin vai trò', type: 'update', isDefault: true, moduleId: 'admin' },
    { id: 'admin-13', name: 'Xóa vai trò', code: 'ROLE_DELETE', description: 'Xóa vai trò khỏi hệ thống', type: 'delete', isDefault: true, moduleId: 'admin' },
    { id: 'admin-14', name: 'Gán vai trò', code: 'ROLE_ASSIGN', description: 'Gán vai trò cho người dùng', type: 'special', isDefault: true, moduleId: 'admin' },
    { id: 'admin-15', name: 'Quản lý quyền của vai trò', code: 'ROLE_PERMISSION_MANAGE', description: 'Thêm/xóa quyền cho vai trò', type: 'special', isDefault: true, moduleId: 'admin' },
    { id: 'admin-20', name: 'Xem quyền', code: 'PERMISSION_VIEW', description: 'Xem danh sách quyền trong hệ thống', type: 'view', isDefault: true, moduleId: 'admin' },
    { id: 'admin-21', name: 'Tạo quyền tùy chỉnh', code: 'PERMISSION_CREATE', description: 'Tạo quyền mới cho hệ thống', type: 'create', isDefault: true, moduleId: 'admin' },
    { id: 'admin-22', name: 'Cập nhật quyền', code: 'PERMISSION_UPDATE', description: 'Chỉnh sửa quyền tùy chỉnh', type: 'update', isDefault: true, moduleId: 'admin' },
    { id: 'admin-23', name: 'Xóa quyền tùy chỉnh', code: 'PERMISSION_DELETE', description: 'Xóa quyền tùy chỉnh khỏi hệ thống', type: 'delete', isDefault: true, moduleId: 'admin' },
    { id: 'admin-30', name: 'Xem cấu hình hệ thống', code: 'SYSTEM_CONFIG_VIEW', description: 'Xem các cấu hình hệ thống', type: 'view', isDefault: true, moduleId: 'admin' },
    { id: 'admin-31', name: 'Cập nhật cấu hình hệ thống', code: 'SYSTEM_CONFIG_UPDATE', description: 'Thay đổi cấu hình hệ thống', type: 'special', isDefault: true, moduleId: 'admin' },
    { id: 'admin-32', name: 'Xem log hệ thống', code: 'SYSTEM_LOG_VIEW', description: 'Xem nhật ký hoạt động hệ thống', type: 'view', isDefault: true, moduleId: 'admin' },
    { id: 'admin-33', name: 'Xuất log hệ thống', code: 'SYSTEM_LOG_EXPORT', description: 'Xuất log hệ thống ra file', type: 'special', isDefault: false, moduleId: 'admin' },
    { id: 'admin-34', name: 'Backup dữ liệu', code: 'SYSTEM_BACKUP', description: 'Sao lưu dữ liệu hệ thống', type: 'special', isDefault: false, moduleId: 'admin' },
    { id: 'admin-35', name: 'Restore dữ liệu', code: 'SYSTEM_RESTORE', description: 'Khôi phục dữ liệu từ backup', type: 'special', isDefault: false, moduleId: 'admin' },

    // ============================================
    // OVERVIEW MODULE - Tổng quan
    // ============================================
    { id: 'overview-1', name: 'Xem dashboard', code: 'DASHBOARD_VIEW', description: 'Xem trang tổng quan và thống kê', type: 'view', isDefault: true, moduleId: 'overview' },
    { id: 'overview-2', name: 'Xuất báo cáo tổng quan', code: 'DASHBOARD_EXPORT', description: 'Xuất dữ liệu dashboard ra file', type: 'special', isDefault: true, moduleId: 'overview' },
    { id: 'overview-3', name: 'Tùy chỉnh dashboard', code: 'DASHBOARD_CUSTOMIZE', description: 'Tùy chỉnh các widget trên dashboard', type: 'update', isDefault: true, moduleId: 'overview' },
    { id: 'overview-4', name: 'Xem thống kê chi tiết', code: 'STATISTICS_VIEW_DETAIL', description: 'Xem thống kê chi tiết theo từng chỉ số', type: 'view', isDefault: true, moduleId: 'overview' },
    { id: 'overview-5', name: 'So sánh kỳ', code: 'STATISTICS_COMPARE', description: 'So sánh thống kê giữa các kỳ', type: 'view', isDefault: false, moduleId: 'overview' },
    { id: 'overview-6', name: 'Lưu dashboard template', code: 'DASHBOARD_SAVE_TEMPLATE', description: 'Lưu cấu hình dashboard thành template', type: 'create', isDefault: false, moduleId: 'overview' },

    // ============================================
    // MAP MODULE - Bản đồ điều hành
    // ============================================
    { id: 'map-1', name: 'Xem bản đồ', code: 'MAP_VIEW', description: 'Xem bản đồ điều hành và các điểm đánh dấu', type: 'view', isDefault: true, moduleId: 'map' },
    { id: 'map-2', name: 'Thêm điểm đánh dấu', code: 'MAP_ADD_MARKER', description: 'Thêm điểm đánh dấu mới trên bản đồ', type: 'create', isDefault: true, moduleId: 'map' },
    { id: 'map-3', name: 'Chỉnh sửa vị trí', code: 'MAP_EDIT_LOCATION', description: 'Cập nhật vị trí điểm đánh dấu', type: 'update', isDefault: true, moduleId: 'map' },
    { id: 'map-4', name: 'Xóa điểm đánh dấu', code: 'MAP_DELETE_MARKER', description: 'Xóa điểm đánh dấu khỏi bản đồ', type: 'delete', isDefault: true, moduleId: 'map' },
    { id: 'map-5', name: 'Vẽ vùng/khu vực', code: 'MAP_DRAW_AREA', description: 'Vẽ vùng, khu vực trên bản đồ', type: 'create', isDefault: true, moduleId: 'map' },
    { id: 'map-6', name: 'Đo khoảng cách', code: 'MAP_MEASURE_DISTANCE', description: 'Sử dụng công cụ đo khoảng cách', type: 'view', isDefault: true, moduleId: 'map' },
    { id: 'map-7', name: 'Xuất bản đồ', code: 'MAP_EXPORT', description: 'Xuất bản đồ ra hình ảnh hoặc PDF', type: 'special', isDefault: false, moduleId: 'map' },
    { id: 'map-8', name: 'Quản lý layer', code: 'MAP_LAYER_MANAGE', description: 'Bật/tắt và quản lý các layer trên bản đồ', type: 'update', isDefault: true, moduleId: 'map' },
    { id: 'map-9', name: 'Theo dõi GPS realtime', code: 'MAP_GPS_TRACKING', description: 'Theo dõi vị trí GPS thời gian thực', type: 'special', isDefault: false, moduleId: 'map' },

    // ============================================
    // FACILITIES MODULE - Cơ sở & Địa bàn
    // ============================================
    { id: 'facilities-1', name: 'Xem cơ sở', code: 'FACILITY_VIEW', description: 'Xem danh sách cơ sở và thông tin chi tiết', type: 'view', isDefault: true, moduleId: 'facilities' },
    { id: 'facilities-2', name: 'Tạo cơ sở', code: 'FACILITY_CREATE', description: 'Thêm mới cơ sở vào hệ thống', type: 'create', isDefault: true, moduleId: 'facilities' },
    { id: 'facilities-3', name: 'Cập nhật cơ sở', code: 'FACILITY_UPDATE', description: 'Chỉnh sửa thông tin cơ sở', type: 'update', isDefault: true, moduleId: 'facilities' },
    { id: 'facilities-4', name: 'Xóa cơ sở', code: 'FACILITY_DELETE', description: 'Xóa cơ sở khỏi hệ thống', type: 'delete', isDefault: true, moduleId: 'facilities' },
    { id: 'facilities-5', name: 'Import cơ sở từ Excel', code: 'FACILITY_IMPORT', description: 'Import hàng loạt cơ sở từ file Excel', type: 'create', isDefault: true, moduleId: 'facilities' },
    { id: 'facilities-6', name: 'Xuất danh sách cơ sở', code: 'FACILITY_EXPORT', description: 'Xuất danh sách cơ sở ra Excel', type: 'special', isDefault: true, moduleId: 'facilities' },
    { id: 'facilities-7', name: 'Phân loại cơ sở', code: 'FACILITY_CATEGORIZE', description: 'Phân loại và gắn nhãn cơ sở', type: 'update', isDefault: true, moduleId: 'facilities' },
    { id: 'facilities-8', name: 'Xem lịch sử cơ sở', code: 'FACILITY_HISTORY_VIEW', description: 'Xem lịch sử thay đổi của cơ sở', type: 'view', isDefault: true, moduleId: 'facilities' },
    { id: 'facilities-9', name: 'Gán người phụ trách', code: 'FACILITY_ASSIGN_MANAGER', description: 'Gán người quản lý cho cơ sở', type: 'update', isDefault: true, moduleId: 'facilities' },
    { id: 'facilities-10', name: 'Đánh giá cơ sở', code: 'FACILITY_RATE', description: 'Đánh giá và chấm điểm cơ sở', type: 'special', isDefault: false, moduleId: 'facilities' },
    { id: 'facilities-11', name: 'Quản lý địa bàn', code: 'TERRITORY_MANAGE', description: 'Quản lý phân vùng địa bàn', type: 'update', isDefault: true, moduleId: 'facilities' },
    { id: 'facilities-12', name: 'Tải ảnh cơ sở', code: 'FACILITY_UPLOAD_PHOTO', description: 'Tải lên hình ảnh cơ sở', type: 'create', isDefault: false, moduleId: 'facilities' },

    // ============================================
    // RISK MODULE - Nguồn tin / Risk
    // ============================================
    { id: 'risk-1', name: 'Xem nguồn tin', code: 'RISK_VIEW', description: 'Xem danh sách nguồn tin và rủi ro', type: 'view', isDefault: true, moduleId: 'risk' },
    { id: 'risk-2', name: 'Tạo nguồn tin', code: 'RISK_CREATE', description: 'Thêm mới nguồn tin vào hệ thống', type: 'create', isDefault: true, moduleId: 'risk' },
    { id: 'risk-3', name: 'Cập nhật nguồn tin', code: 'RISK_UPDATE', description: 'Chỉnh sửa thông tin nguồn tin', type: 'update', isDefault: true, moduleId: 'risk' },
    { id: 'risk-4', name: 'Xóa nguồn tin', code: 'RISK_DELETE', description: 'Xóa nguồn tin khỏi hệ thống', type: 'delete', isDefault: true, moduleId: 'risk' },
    { id: 'risk-5', name: 'Đánh giá rủi ro', code: 'RISK_ASSESS', description: 'Đánh giá mức độ rủi ro (Thấp/Trung bình/Cao)', type: 'special', isDefault: true, moduleId: 'risk' },
    { id: 'risk-6', name: 'Phân loại nguồn tin', code: 'RISK_CATEGORIZE', description: 'Phân loại nguồn tin theo danh mục', type: 'update', isDefault: true, moduleId: 'risk' },
    { id: 'risk-7', name: 'Gán người xử lý', code: 'RISK_ASSIGN_HANDLER', description: 'Gán người phụ trách xử lý rủi ro', type: 'update', isDefault: true, moduleId: 'risk' },
    { id: 'risk-8', name: 'Cập nhật tiến độ xử lý', code: 'RISK_UPDATE_PROGRESS', description: 'Cập nhật tiến độ xử lý rủi ro', type: 'update', isDefault: true, moduleId: 'risk' },
    { id: 'risk-9', name: 'Đóng nguồn tin', code: 'RISK_CLOSE', description: 'Đóng và hoàn thành xử lý nguồn tin', type: 'update', isDefault: true, moduleId: 'risk' },
    { id: 'risk-10', name: 'Xuất báo cáo rủi ro', code: 'RISK_EXPORT_REPORT', description: 'Xuất báo cáo phân tích rủi ro', type: 'special', isDefault: true, moduleId: 'risk' },
    { id: 'risk-11', name: 'Tạo cảnh báo tự động', code: 'RISK_CREATE_ALERT', description: 'Tạo cảnh báo tự động cho rủi ro', type: 'create', isDefault: false, moduleId: 'risk' },
    { id: 'risk-12', name: 'Phân tích xu hướng', code: 'RISK_TREND_ANALYSIS', description: 'Phân tích xu hướng và dự báo rủi ro', type: 'special', isDefault: false, moduleId: 'risk' },

    // ============================================
    // PLANNING MODULE - Kế hoạch tác nghiệp
    // ============================================
    { id: 'planning-1', name: 'Xem kế hoạch', code: 'PLAN_VIEW', description: 'Xem danh sách kế hoạch tác nghiệp', type: 'view', isDefault: true, moduleId: 'planning' },
    { id: 'planning-2', name: 'Tạo kế hoạch', code: 'PLAN_CREATE', description: 'Lập kế hoạch tác nghiệp mới', type: 'create', isDefault: true, moduleId: 'planning' },
    { id: 'planning-3', name: 'Cập nhật kế hoạch', code: 'PLAN_UPDATE', description: 'Chỉnh sửa kế hoạch tác nghiệp', type: 'update', isDefault: true, moduleId: 'planning' },
    { id: 'planning-4', name: 'Xóa kế hoạch', code: 'PLAN_DELETE', description: 'Xóa kế hoạch khỏi hệ thống', type: 'delete', isDefault: true, moduleId: 'planning' },
    { id: 'planning-5', name: 'Gửi phê duyệt', code: 'PLAN_SUBMIT_APPROVAL', description: 'Gửi kế hoạch lên cấp trên phê duyệt', type: 'update', isDefault: true, moduleId: 'planning' },
    { id: 'planning-6', name: 'Phê duyệt kế hoạch', code: 'PLAN_APPROVE', description: 'Phê duyệt hoặc từ chối kế hoạch', type: 'special', isDefault: true, moduleId: 'planning' },
    { id: 'planning-7', name: 'Triển khai kế hoạch', code: 'PLAN_DEPLOY', description: 'Triển khai kế hoạch đã được duyệt', type: 'update', isDefault: true, moduleId: 'planning' },
    { id: 'planning-8', name: 'Theo dõi tiến độ', code: 'PLAN_TRACK_PROGRESS', description: 'Theo dõi tiến độ thực hiện kế hoạch', type: 'view', isDefault: true, moduleId: 'planning' },
    { id: 'planning-9', name: 'Xuất kế hoạch', code: 'PLAN_EXPORT', description: 'Xuất kế hoạch ra file PDF/Word', type: 'special', isDefault: true, moduleId: 'planning' },
    { id: 'planning-10', name: 'Copy kế hoạch', code: 'PLAN_DUPLICATE', description: 'Sao chép kế hoạch từ kế hoạch cũ', type: 'create', isDefault: false, moduleId: 'planning' },
    { id: 'planning-11', name: 'Gán nguồn lực', code: 'PLAN_ASSIGN_RESOURCES', description: 'Gán nguồn lực cho kế hoạch', type: 'update', isDefault: true, moduleId: 'planning' },
    { id: 'planning-12', name: 'Đánh giá kế hoạch', code: 'PLAN_EVALUATE', description: 'Đánh giá hiệu quả thực hiện kế hoạch', type: 'special', isDefault: false, moduleId: 'planning' },

    // ============================================
    // FIELD TASKS MODULE - Nhiệm vụ hiện trường
    // ============================================
    { id: 'tasks-1', name: 'Xem nhiệm vụ', code: 'TASK_VIEW', description: 'Xem danh sách nhiệm vụ hiện trường', type: 'view', isDefault: true, moduleId: 'field-tasks' },
    { id: 'tasks-2', name: 'Tạo nhiệm vụ', code: 'TASK_CREATE', description: 'Tạo nhiệm vụ hiện trường mới', type: 'create', isDefault: true, moduleId: 'field-tasks' },
    { id: 'tasks-3', name: 'Cập nhật nhiệm vụ', code: 'TASK_UPDATE', description: 'Chỉnh sửa thông tin nhiệm vụ', type: 'update', isDefault: true, moduleId: 'field-tasks' },
    { id: 'tasks-4', name: 'Xóa nhiệm vụ', code: 'TASK_DELETE', description: 'Xóa nhiệm vụ khỏi hệ thống', type: 'delete', isDefault: true, moduleId: 'field-tasks' },
    { id: 'tasks-5', name: 'Giao nhiệm vụ', code: 'TASK_ASSIGN', description: 'Giao nhiệm vụ cho người thực hiện', type: 'create', isDefault: true, moduleId: 'field-tasks' },
    { id: 'tasks-6', name: 'Nhận nhiệm vụ', code: 'TASK_ACCEPT', description: 'Nhận và xác nhận nhiệm vụ được giao', type: 'update', isDefault: true, moduleId: 'field-tasks' },
    { id: 'tasks-7', name: 'Cập nhật tiến độ', code: 'TASK_UPDATE_PROGRESS', description: 'Cập nhật tiến độ thực hiện nhiệm vụ', type: 'update', isDefault: true, moduleId: 'field-tasks' },
    { id: 'tasks-8', name: 'Hoàn thành nhiệm vụ', code: 'TASK_COMPLETE', description: 'Đánh dấu nhiệm vụ hoàn thành', type: 'update', isDefault: true, moduleId: 'field-tasks' },
    { id: 'tasks-9', name: 'Xác nhận hoàn thành', code: 'TASK_VERIFY_COMPLETE', description: 'Xác nhận và đóng nhiệm vụ', type: 'special', isDefault: true, moduleId: 'field-tasks' },
    { id: 'tasks-10', name: 'Check-in hiện trường', code: 'TASK_CHECKIN', description: 'Check-in vị trí khi đến hiện trường', type: 'create', isDefault: true, moduleId: 'field-tasks' },
    { id: 'tasks-11', name: 'Báo cáo nhanh', code: 'TASK_QUICK_REPORT', description: 'Gửi báo cáo nhanh từ hiện trường', type: 'create', isDefault: true, moduleId: 'field-tasks' },
    { id: 'tasks-12', name: 'Gửi yêu cầu hỗ trợ', code: 'TASK_REQUEST_SUPPORT', description: 'Gửi yêu cầu hỗ trợ khi gặp khó khăn', type: 'create', isDefault: false, moduleId: 'field-tasks' },
    { id: 'tasks-13', name: 'Đánh giá nhiệm vụ', code: 'TASK_RATE', description: 'Đánh giá chất lượng thực hiện nhiệm vụ', type: 'special', isDefault: false, moduleId: 'field-tasks' },

    // ============================================
    // EVIDENCE MODULE - Kho chứng cứ
    // ============================================
    { id: 'evidence-1', name: 'Xem chứng cứ', code: 'EVIDENCE_VIEW', description: 'Xem kho chứng cứ và tài liệu', type: 'view', isDefault: true, moduleId: 'evidence' },
    { id: 'evidence-2', name: 'Tải lên hình ảnh', code: 'EVIDENCE_UPLOAD_IMAGE', description: 'Tải lên hình ảnh chứng cứ', type: 'create', isDefault: true, moduleId: 'evidence' },
    { id: 'evidence-3', name: 'Tải lên video', code: 'EVIDENCE_UPLOAD_VIDEO', description: 'Tải lên video chứng cứ', type: 'create', isDefault: true, moduleId: 'evidence' },
    { id: 'evidence-4', name: 'Tải lên tài liệu', code: 'EVIDENCE_UPLOAD_DOCUMENT', description: 'Tải lên file tài liệu (PDF, Word, Excel)', type: 'create', isDefault: true, moduleId: 'evidence' },
    { id: 'evidence-5', name: 'Cập nhật thông tin', code: 'EVIDENCE_UPDATE', description: 'Chỉnh sửa thông tin chứng cứ', type: 'update', isDefault: true, moduleId: 'evidence' },
    { id: 'evidence-6', name: 'Xóa chứng cứ', code: 'EVIDENCE_DELETE', description: 'Xóa chứng cứ khỏi kho', type: 'delete', isDefault: true, moduleId: 'evidence' },
    { id: 'evidence-7', name: 'Tải xuống chứng cứ', code: 'EVIDENCE_DOWNLOAD', description: 'Tải xuống file chứng cứ', type: 'view', isDefault: true, moduleId: 'evidence' },
    { id: 'evidence-8', name: 'Chia sẻ chứng cứ', code: 'EVIDENCE_SHARE', description: 'Chia sẻ chứng cứ với người khác', type: 'special', isDefault: true, moduleId: 'evidence' },
    { id: 'evidence-9', name: 'Gắn nhãn/tag', code: 'EVIDENCE_TAG', description: 'Gắn nhãn và phân loại chứng cứ', type: 'update', isDefault: true, moduleId: 'evidence' },
    { id: 'evidence-10', name: 'Tìm kiếm nâng cao', code: 'EVIDENCE_ADVANCED_SEARCH', description: 'Tìm kiếm chứng cứ theo nhiều tiêu chí', type: 'view', isDefault: true, moduleId: 'evidence' },
    { id: 'evidence-11', name: 'Tạo album', code: 'EVIDENCE_CREATE_ALBUM', description: 'Tạo album nhóm chứng cứ', type: 'create', isDefault: false, moduleId: 'evidence' },
    { id: 'evidence-12', name: 'Xuất báo cáo chứng cứ', code: 'EVIDENCE_EXPORT_REPORT', description: 'Xuất báo cáo tổng hợp chứng cứ', type: 'special', isDefault: false, moduleId: 'evidence' },
    { id: 'evidence-13', name: 'Watermark ảnh', code: 'EVIDENCE_WATERMARK', description: 'Thêm watermark vào hình ảnh', type: 'update', isDefault: false, moduleId: 'evidence' },

    // ============================================
    // REPORTS MODULE - Báo cáo & KPI
    // ============================================
    { id: 'reports-1', name: 'Xem báo cáo', code: 'REPORT_VIEW', description: 'Xem các báo cáo và KPI', type: 'view', isDefault: true, moduleId: 'reports' },
    { id: 'reports-2', name: 'Tạo báo cáo', code: 'REPORT_CREATE', description: 'Tạo báo cáo mới', type: 'create', isDefault: true, moduleId: 'reports' },
    { id: 'reports-3', name: 'Cập nhật báo cáo', code: 'REPORT_UPDATE', description: 'Chỉnh sửa nội dung báo cáo', type: 'update', isDefault: true, moduleId: 'reports' },
    { id: 'reports-4', name: 'Xóa báo cáo', code: 'REPORT_DELETE', description: 'Xóa báo cáo khỏi hệ thống', type: 'delete', isDefault: true, moduleId: 'reports' },
    { id: 'reports-5', name: 'Xuất Excel', code: 'REPORT_EXPORT_EXCEL', description: 'Xuất báo cáo ra file Excel', type: 'special', isDefault: true, moduleId: 'reports' },
    { id: 'reports-6', name: 'Xuất PDF', code: 'REPORT_EXPORT_PDF', description: 'Xuất báo cáo ra file PDF', type: 'special', isDefault: true, moduleId: 'reports' },
    { id: 'reports-7', name: 'Xuất Word', code: 'REPORT_EXPORT_WORD', description: 'Xuất báo cáo ra file Word', type: 'special', isDefault: false, moduleId: 'reports' },
    { id: 'reports-8', name: 'In báo cáo', code: 'REPORT_PRINT', description: 'In báo cáo trực tiếp', type: 'special', isDefault: true, moduleId: 'reports' },
    { id: 'reports-9', name: 'Lên lịch báo cáo', code: 'REPORT_SCHEDULE', description: 'Lên lịch tạo báo cáo tự động', type: 'create', isDefault: true, moduleId: 'reports' },
    { id: 'reports-10', name: 'Gửi email báo cáo', code: 'REPORT_EMAIL', description: 'Gửi báo cáo qua email', type: 'special', isDefault: true, moduleId: 'reports' },
    { id: 'reports-11', name: 'Tạo dashboard KPI', code: 'REPORT_CREATE_KPI_DASHBOARD', description: 'Tạo dashboard theo dõi KPI', type: 'create', isDefault: true, moduleId: 'reports' },
    { id: 'reports-12', name: 'Xem KPI theo thời gian', code: 'REPORT_VIEW_KPI_TIMELINE', description: 'Xem biến động KPI theo thời gian', type: 'view', isDefault: true, moduleId: 'reports' },
    { id: 'reports-13', name: 'So sánh KPI', code: 'REPORT_COMPARE_KPI', description: 'So sánh KPI giữa các đơn vị/kỳ', type: 'view', isDefault: true, moduleId: 'reports' },
    { id: 'reports-14', name: 'Tạo template báo cáo', code: 'REPORT_CREATE_TEMPLATE', description: 'Tạo mẫu báo cáo tái sử dụng', type: 'create', isDefault: false, moduleId: 'reports' },
    { id: 'reports-15', name: 'Phân tích dữ liệu', code: 'REPORT_DATA_ANALYSIS', description: 'Công cụ phân tích dữ liệu nâng cao', type: 'special', isDefault: false, moduleId: 'reports' },
  ];
}