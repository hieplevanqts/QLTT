import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Shield,
  ChevronDown,
  ChevronUp,
  Users,
  Check,
  X,
  AlertTriangle,
  FileText,
  MapPin,
  Calendar,
  Briefcase,
  Camera,
  TrendingUp,
  Settings,
  Download,
  RefreshCw,
} from 'lucide-react';
import styles from './AdminPage.module.css';
import { Pagination } from '../components/Pagination';
import { supabase, Tables } from '../lib/supabase';
import type { Role as DBRole } from '../lib/supabase';

// Permission type (matching PermissionsManagement)
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

// Role with permissions
interface RoleWithPermissions {
  id: string;
  code: string;
  name: string;
  description: string;
  userCount: number;
  status: 'active' | 'inactive';
  createdAt: string;
  permissions: string[]; // Array of permission IDs
}

interface RolesTabNewProps {
  roles: any[];
  onOpenModal: (type: any, item?: any) => void;
  allPermissions?: Permission[];
}

export const RolesTabNew: React.FC<RolesTabNewProps> = ({ 
  roles, 
  onOpenModal,
  allPermissions = []
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedRoleId, setExpandedRoleId] = useState<string | null>(null);
  const [selectedModule, setSelectedModule] = useState<string>('all');
  const itemsPerPage = 10;

  // Module definitions (matching PermissionsManagement)
  const modules: Module[] = [
    { id: 'overview', name: 'Tổng quan', icon: Eye, description: 'Dashboard và thống kê' },
    { id: 'map', name: 'Bản đồ', icon: MapPin, description: 'Quản lý bản đồ' },
    { id: 'facilities', name: 'Cơ sở quản lý', icon: FileText, description: 'Quản lý cơ sở' },
    { id: 'risk', name: 'Nguồn tin', icon: AlertTriangle, description: 'Quản lý rủi ro' },
    { id: 'planning', name: 'Kế hoạch', icon: Calendar, description: 'Lập kế hoạch' },
    { id: 'field-tasks', name: 'Nhiệm vụ hiện trường', icon: Briefcase, description: 'Giao việc hiện trường' },
    { id: 'evidence', name: 'Kho chứng cứ', icon: Camera, description: 'Lưu trữ chứng cứ' },
    { id: 'reports', name: 'Báo cáo, thống kê', icon: TrendingUp, description: 'Thống kê báo cáo' },
    { id: 'admin', name: 'Quản trị', icon: Settings, description: 'Quản trị hệ thống' },
  ];

  // Get role permissions from role data
  const getRolePermissions = (role: any): Permission[] => {
    // If role has permissions array (new format)
    if (role.permissions && Array.isArray(role.permissions) && role.permissions.length > 0) {
      // If permissions are IDs, map them to full permission objects
      if (typeof role.permissions[0] === 'string') {
        return allPermissions.filter(p => role.permissions.includes(p.id));
      }
      // If permissions are already full objects, use them
      return role.permissions;
    }
    
    // Fallback: generate from role code (old format)
    return generatePermissionsFromRoleCode(role.code || role.name);
  };

  // Generate permissions based on role code (backward compatibility)
  const generatePermissionsFromRoleCode = (roleCode: string): Permission[] => {
    const code = roleCode.toUpperCase();
    const mockPerms: Permission[] = [];
    
    if (code.includes('ADMIN') || code.includes('QUẢN TRỊ')) {
      // Admin has all permissions
      modules.forEach(module => {
        mockPerms.push(
          { id: `${module.id}-view`, name: `Xem ${module.name}`, code: `${module.id.toUpperCase()}_VIEW`, description: '', type: 'view', isDefault: true, moduleId: module.id },
          { id: `${module.id}-create`, name: `Tạo ${module.name}`, code: `${module.id.toUpperCase()}_CREATE`, description: '', type: 'create', isDefault: true, moduleId: module.id },
          { id: `${module.id}-update`, name: `Sửa ${module.name}`, code: `${module.id.toUpperCase()}_UPDATE`, description: '', type: 'update', isDefault: true, moduleId: module.id },
          { id: `${module.id}-delete`, name: `Xóa ${module.name}`, code: `${module.id.toUpperCase()}_DELETE`, description: '', type: 'delete', isDefault: true, moduleId: module.id }
        );
      });
    } else if (code.includes('MANAGER') || code.includes('QUẢN LÝ')) {
      // Manager has most permissions except admin
      modules.filter(m => m.id !== 'admin').forEach(module => {
        mockPerms.push(
          { id: `${module.id}-view`, name: `Xem ${module.name}`, code: `${module.id.toUpperCase()}_VIEW`, description: '', type: 'view', isDefault: true, moduleId: module.id },
          { id: `${module.id}-create`, name: `Tạo ${module.name}`, code: `${module.id.toUpperCase()}_CREATE`, description: '', type: 'create', isDefault: true, moduleId: module.id },
          { id: `${module.id}-update`, name: `Sửa ${module.name}`, code: `${module.id.toUpperCase()}_UPDATE`, description: '', type: 'update', isDefault: true, moduleId: module.id }
        );
      });
    } else if (code.includes('OFFICER') || code.includes('CÁN BỘ')) {
      // Officer has view + create/update on facilities and tasks
      mockPerms.push(
        { id: 'overview-view', name: 'Xem Tổng quan', code: 'OVERVIEW_VIEW', description: '', type: 'view', isDefault: true, moduleId: 'overview' },
        { id: 'map-view', name: 'Xem Bản đồ', code: 'MAP_VIEW', description: '', type: 'view', isDefault: true, moduleId: 'map' },
        { id: 'facilities-view', name: 'Xem Cơ sở', code: 'FACILITIES_VIEW', description: '', type: 'view', isDefault: true, moduleId: 'facilities' },
        { id: 'facilities-create', name: 'Tạo Cơ sở', code: 'FACILITIES_CREATE', description: '', type: 'create', isDefault: true, moduleId: 'facilities' },
        { id: 'facilities-update', name: 'Sửa Cơ sở', code: 'FACILITIES_UPDATE', description: '', type: 'update', isDefault: true, moduleId: 'facilities' },
        { id: 'field-tasks-view', name: 'Xem Nhiệm vụ', code: 'FIELD_TASKS_VIEW', description: '', type: 'view', isDefault: true, moduleId: 'field-tasks' },
        { id: 'field-tasks-update', name: 'Cập nhật Nhiệm vụ', code: 'FIELD_TASKS_UPDATE', description: '', type: 'update', isDefault: true, moduleId: 'field-tasks' }
      );
    } else {
      // Default: view only
      mockPerms.push(
        { id: 'overview-view', name: 'Xem Tổng quan', code: 'OVERVIEW_VIEW', description: '', type: 'view', isDefault: true, moduleId: 'overview' },
        { id: 'map-view', name: 'Xem Bản đồ', code: 'MAP_VIEW', description: '', type: 'view', isDefault: true, moduleId: 'map' }
      );
    }
    
    return mockPerms;
  };

  // Filter logic
  const filteredRoles = roles.filter(role => {
    const matchesSearch = searchText === '' ||
      role.name.toLowerCase().includes(searchText.toLowerCase()) ||
      role.code.toLowerCase().includes(searchText.toLowerCase()) ||
      role.description?.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || role.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRoles = filteredRoles.slice(startIndex, endIndex);

  // Toggle expand role
  const toggleExpand = (roleId: string) => {
    setExpandedRoleId(expandedRoleId === roleId ? null : roleId);
  };

  // Get permission type color
  const getPermissionTypeColor = (type: Permission['type']) => {
    switch (type) {
      case 'view':
        return '#10b981'; // green
      case 'create':
        return '#3b82f6'; // blue
      case 'update':
        return '#f59e0b'; // orange
      case 'delete':
        return '#ef4444'; // red
      case 'special':
        return '#8b5cf6'; // purple
      default:
        return '#6b7280'; // gray
    }
  };

  // Get permission type label
  const getPermissionTypeLabel = (type: Permission['type']) => {
    switch (type) {
      case 'view':
        return 'Xem';
      case 'create':
        return 'Tạo';
      case 'update':
        return 'Sửa';
      case 'delete':
        return 'Xóa';
      case 'special':
        return 'Đặc biệt';
      default:
        return type;
    }
  };

  // Group permissions by module
  const groupPermissionsByModule = (permissions: Permission[]) => {
    const grouped: { [moduleId: string]: Permission[] } = {};
    
    permissions.forEach(perm => {
      if (!grouped[perm.moduleId]) {
        grouped[perm.moduleId] = [];
      }
      grouped[perm.moduleId].push(perm);
    });
    
    return grouped;
  };

  // Early return if no roles at all (from database)
  if (roles.length === 0) {
    return (
      <div className={styles.tabContentInner}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>Quản lý vai trò</h2>
            <p className={styles.sectionDesc}>
              Tạo và quản lý vai trò, phân quyền truy cập dựa trên Ma trận quyền
            </p>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--spacing-12, 48px)',
            gap: 'var(--spacing-4, 16px)',
            minHeight: '400px',
          }}
        >
          <Shield size={64} style={{ color: 'var(--muted-foreground, #6b7280)', opacity: 0.3 }} />
          <div
            style={{
              fontSize: '18px',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              color: 'var(--foreground, #111827)',
            }}
          >
            Chưa có vai trò nào
          </div>
          <div
            style={{
              fontSize: '14px',
              fontFamily: 'Inter, sans-serif',
              color: 'var(--muted-foreground, #6b7280)',
              textAlign: 'center',
              maxWidth: '500px',
            }}
          >
            Database chưa có dữ liệu vai trò. Vui lòng chạy SQL scripts để tạo dữ liệu mẫu.
          </div>

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
                marginBottom: 'var(--spacing-3, 12px)',
              }}
            >
              📋 Hướng dẫn khắc phục:
            </div>
            <ol
              style={{
                fontSize: '13px',
                fontFamily: 'Inter, sans-serif',
                color: 'var(--muted-foreground, #6b7280)',
                margin: 0,
                paddingLeft: 'var(--spacing-5, 20px)',
                lineHeight: 1.8,
              }}
            >
              <li>
                Mở <strong>Supabase Dashboard</strong> → SQL Editor
              </li>
              <li>
                Copy nội dung file <code style={{
                  background: 'var(--background, #ffffff)',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  border: '1px solid var(--border, #e5e7eb)',
                  fontFamily: 'monospace',
                }}>/database/FIX_RBAC_TABLES.sql</code>
              </li>
              <li>
                Paste và chạy query (tạo tables)
              </li>
              <li>
                Copy nội dung file <code style={{
                  background: 'var(--background, #ffffff)',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  border: '1px solid var(--border, #e5e7eb)',
                  fontFamily: 'monospace',
                }}>/database/insert_sample_data.sql</code>
              </li>
              <li>
                Paste và chạy query (insert data mẫu: 5 roles, 9 modules, permissions)
              </li>
              <li>
                Refresh trang này (F5) để thấy dữ liệu
              </li>
            </ol>

            <div
              style={{
                marginTop: 'var(--spacing-4, 16px)',
                padding: 'var(--spacing-3, 12px)',
                background: '#dbeafe',
                border: '1px solid #3b82f6',
                borderRadius: 'var(--radius, 6px)',
                fontSize: '13px',
                fontFamily: 'Inter, sans-serif',
                color: '#1e40af',
              }}
            >
              <strong>💡 Lưu ý:</strong> Sau khi chạy scripts, bạn sẽ có 5 vai trò mẫu: Admin, Manager, User, Viewer, và Data Entry với đầy đủ permissions.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.tabContentInner}>
      {/* Header */}
      <div className={styles.sectionHeader}>
        <div>
          <h2 className={styles.sectionTitle}>Quản lý vai trò</h2>
          <p className={styles.sectionDesc}>
            Tạo và quản lý vai trò, phân quyền truy cập dựa trên Ma trận quyền
          </p>
        </div>
        <div className={styles.actions}>
          <button className={styles.secondaryBtn}>
            <Download size={16} /> Xuất Excel
          </button>
          <button className={styles.primaryBtn} onClick={() => onOpenModal('add')}>
            <Plus size={16} /> Thêm vai trò
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className={styles.filterBar}>
        <div className={styles.searchBox}>
          <Search size={18} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Tìm vai trò theo tên, mã, mô tả..." 
            className={styles.searchInput}
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <select 
          className={styles.select}
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="active">Đang hoạt động</option>
          <option value="inactive">Ngừng hoạt động</option>
        </select>
        <select 
          className={styles.select}
          value={selectedModule}
          onChange={(e) => setSelectedModule(e.target.value)}
        >
          <option value="all">Tất cả module</option>
          {modules.map(m => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: 'var(--spacing-4, 16px)',
        marginBottom: 'var(--spacing-5, 20px)'
      }}>
        <div style={{
          padding: 'var(--spacing-4, 16px)',
          background: 'var(--card, #ffffff)',
          border: '1px solid var(--border, #e5e7eb)',
          borderRadius: 'var(--radius, 6px)',
        }}>
          <div style={{ 
            fontSize: '13px', 
            fontFamily: 'Inter, sans-serif',
            color: 'var(--muted-foreground, #6b7280)',
            marginBottom: 'var(--spacing-2, 8px)'
          }}>
            Tổng số vai trò
          </div>
          <div style={{ 
            fontSize: '24px', 
            fontFamily: 'Inter, sans-serif',
            fontWeight: 700,
            color: 'var(--foreground, #111827)'
          }}>
            {roles.length}
          </div>
        </div>
        
        <div style={{
          padding: 'var(--spacing-4, 16px)',
          background: 'var(--card, #ffffff)',
          border: '1px solid var(--border, #e5e7eb)',
          borderRadius: 'var(--radius, 6px)',
        }}>
          <div style={{ 
            fontSize: '13px', 
            fontFamily: 'Inter, sans-serif',
            color: 'var(--muted-foreground, #6b7280)',
            marginBottom: 'var(--spacing-2, 8px)'
          }}>
            Vai trò đang hoạt động
          </div>
          <div style={{ 
            fontSize: '24px', 
            fontFamily: 'Inter, sans-serif',
            fontWeight: 700,
            color: 'var(--primary, #005cb6)'
          }}>
            {roles.filter(r => r.status === 'active').length}
          </div>
        </div>
        
        <div style={{
          padding: 'var(--spacing-4, 16px)',
          background: 'var(--card, #ffffff)',
          border: '1px solid var(--border, #e5e7eb)',
          borderRadius: 'var(--radius, 6px)',
        }}>
          <div style={{ 
            fontSize: '13px', 
            fontFamily: 'Inter, sans-serif',
            color: 'var(--muted-foreground, #6b7280)',
            marginBottom: 'var(--spacing-2, 8px)'
          }}>
            Tổng người dùng
          </div>
          <div style={{ 
            fontSize: '24px', 
            fontFamily: 'Inter, sans-serif',
            fontWeight: 700,
            color: 'var(--foreground, #111827)'
          }}>
            {roles.reduce((sum, r) => sum + (r.userCount || 0), 0).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ width: '40px' }}></th>
              <th>Mã vai trò</th>
              <th>Tên vai trò</th>
              <th>Mô tả</th>
              <th style={{ width: '100px', textAlign: 'center' }}>Người dùng</th>
              <th style={{ width: '100px', textAlign: 'center' }}>Số quyền</th>
              <th style={{ width: '120px' }}>Trạng thái</th>
              <th style={{ width: '120px' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {paginatedRoles.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '2rem' }}>
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    gap: 'var(--spacing-3, 12px)',
                    color: 'var(--muted-foreground, #6b7280)',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    <Shield size={48} style={{ opacity: 0.3 }} />
                    <div>Không tìm thấy vai trò nào</div>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedRoles.map((role) => {
                const isExpanded = expandedRoleId === role.id;
                const rolePermissions = getRolePermissions(role);
                const filteredPerms = selectedModule === 'all' 
                  ? rolePermissions 
                  : rolePermissions.filter(p => p.moduleId === selectedModule);
                const groupedPerms = groupPermissionsByModule(filteredPerms);
                
                return (
                  <React.Fragment key={role.id}>
                    <tr>
                      <td>
                        <button
                          onClick={() => toggleExpand(role.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 'var(--spacing-2, 8px)',
                            display: 'flex',
                            alignItems: 'center',
                            color: 'var(--muted-foreground, #6b7280)',
                          }}
                        >
                          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                      </td>
                      <td>
                        <span style={{
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '13px',
                          fontWeight: 600,
                          color: 'var(--foreground, #111827)',
                        }}>
                          {role.code}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2, 8px)' }}>
                          <Shield size={16} style={{ color: 'var(--primary, #005cb6)' }} />
                          <span style={{
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '13px',
                            fontWeight: 600,
                            color: 'var(--foreground, #111827)',
                          }}>
                            {role.name}
                          </span>
                          {role.isSystem && (
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '2px 6px',
                                background: 'rgba(0, 92, 182, 0.1)',
                                border: '1px solid var(--primary, #005cb6)',
                                borderRadius: 'calc(var(--radius, 6px) * 0.5)',
                                fontSize: '10px',
                                fontFamily: 'Inter, sans-serif',
                                fontWeight: 600,
                                color: 'var(--primary, #005cb6)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                              }}
                              title="Vai trò hệ thống không thể xóa"
                            >
                              🔒 System
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span style={{
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '13px',
                          color: 'var(--muted-foreground, #6b7280)',
                        }}>
                          {role.description}
                        </span>
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
                            {role.userCount?.toLocaleString() || 0}
                          </span>
                        </div>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '4px 12px',
                          background: 'var(--muted, #f3f4f6)',
                          borderRadius: 'var(--radius, 6px)',
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '13px',
                          fontWeight: 600,
                          color: 'var(--foreground, #111827)',
                        }}>
                          {rolePermissions.length}
                        </span>
                      </td>
                      <td>
                        <span className={role.status === 'active' ? styles.statusActive : styles.statusInactive}>
                          {role.status === 'active' ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                        </span>
                      </td>
                      <td>
                        <div className={styles.actionButtons}>
                          <button 
                            className={styles.iconBtn} 
                            title="Xem chi tiết"
                            onClick={() => toggleExpand(role.id)}
                          >
                            <Eye size={16} />
                          </button>
                          <button 
                            className={styles.iconBtn} 
                            title="Chỉnh sửa" 
                            onClick={() => onOpenModal('edit', role)}
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            className={styles.iconBtn} 
                            title={role.isSystem ? "Không thể xóa vai trò hệ thống" : "Xóa"}
                            onClick={() => !role.isSystem && onOpenModal('delete', role)}
                            style={{
                              opacity: role.isSystem ? 0.4 : 1,
                              cursor: role.isSystem ? 'not-allowed' : 'pointer',
                            }}
                            disabled={role.isSystem}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expanded row - Show permissions */}
                    {isExpanded && (
                      <tr className={styles.expandedRow}>
                        <td colSpan={8} style={{ padding: 0 }}>
                          <div style={{
                            padding: 'var(--spacing-5, 20px)',
                            background: 'var(--muted, #f9fafb)',
                            borderTop: '1px solid var(--border, #e5e7eb)',
                          }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              marginBottom: 'var(--spacing-4, 16px)',
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2, 8px)' }}>
                                <Shield size={18} style={{ color: 'var(--primary, #005cb6)' }} />
                                <span style={{
                                  fontSize: '14px',
                                  fontWeight: 600,
                                  fontFamily: 'Inter, sans-serif',
                                  color: 'var(--foreground, #111827)',
                                }}>
                                  Danh sách quyền: {role.name}
                                </span>
                                <span style={{
                                  fontSize: '13px',
                                  fontFamily: 'Inter, sans-serif',
                                  color: 'var(--muted-foreground, #6b7280)',
                                }}>
                                  ({filteredPerms.length} quyền)
                                </span>
                              </div>
                              <button 
                                className={styles.secondaryBtn}
                                onClick={() => onOpenModal('edit', role)}
                              >
                                <Edit size={16} /> Chỉnh sửa quyền
                              </button>
                            </div>

                            {/* Permissions grouped by module */}
                            {Object.keys(groupedPerms).length === 0 ? (
                              <div style={{
                                textAlign: 'center',
                                padding: 'var(--spacing-8, 32px)',
                                color: 'var(--muted-foreground, #6b7280)',
                                fontFamily: 'Inter, sans-serif',
                                fontSize: '13px',
                              }}>
                                Vai trò này chưa có quyền nào
                              </div>
                            ) : (
                              <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                                gap: 'var(--spacing-4, 16px)',
                              }}>
                                {modules
                                  .filter(module => groupedPerms[module.id])
                                  .map(module => {
                                    const modulePerms = groupedPerms[module.id];
                                    const ModuleIcon = module.icon;
                                    
                                    return (
                                      <div
                                        key={module.id}
                                        style={{
                                          background: 'var(--card, #ffffff)',
                                          border: '1px solid var(--border, #e5e7eb)',
                                          borderRadius: 'var(--radius, 6px)',
                                          padding: 'var(--spacing-4, 16px)',
                                        }}
                                      >
                                        <div style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: 'var(--spacing-2, 8px)',
                                          marginBottom: 'var(--spacing-3, 12px)',
                                          paddingBottom: 'var(--spacing-3, 12px)',
                                          borderBottom: '1px solid var(--border, #e5e7eb)',
                                        }}>
                                          <ModuleIcon size={16} style={{ color: 'var(--primary, #005cb6)' }} />
                                          <span style={{
                                            fontSize: '13px',
                                            fontWeight: 600,
                                            fontFamily: 'Inter, sans-serif',
                                            color: 'var(--foreground, #111827)',
                                          }}>
                                            {module.name}
                                          </span>
                                          <span style={{
                                            marginLeft: 'auto',
                                            fontSize: '12px',
                                            fontFamily: 'Inter, sans-serif',
                                            color: 'var(--muted-foreground, #6b7280)',
                                          }}>
                                            {modulePerms.length} quyền
                                          </span>
                                        </div>

                                        <div style={{
                                          display: 'flex',
                                          flexDirection: 'column',
                                          gap: 'var(--spacing-2, 8px)',
                                        }}>
                                          {modulePerms.map(perm => (
                                            <div
                                              key={perm.id}
                                              style={{
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                gap: 'var(--spacing-2, 8px)',
                                                padding: 'var(--spacing-2, 8px)',
                                                background: 'var(--muted, #f9fafb)',
                                                borderRadius: 'calc(var(--radius, 6px) * 0.75)',
                                              }}
                                            >
                                              <Check 
                                                size={14} 
                                                style={{ 
                                                  color: getPermissionTypeColor(perm.type),
                                                  marginTop: '2px',
                                                  flexShrink: 0,
                                                }} 
                                              />
                                              <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{
                                                  fontSize: '12px',
                                                  fontFamily: 'Inter, sans-serif',
                                                  fontWeight: 500,
                                                  color: 'var(--foreground, #111827)',
                                                  marginBottom: '2px',
                                                }}>
                                                  {perm.name}
                                                </div>
                                                <div style={{
                                                  display: 'flex',
                                                  alignItems: 'center',
                                                  gap: 'var(--spacing-2, 8px)',
                                                }}>
                                                  <span
                                                    style={{
                                                      display: 'inline-block',
                                                      padding: '2px 6px',
                                                      borderRadius: 'calc(var(--radius, 6px) * 0.5)',
                                                      background: getPermissionTypeColor(perm.type),
                                                      color: '#ffffff',
                                                      fontSize: '10px',
                                                      fontFamily: 'Inter, sans-serif',
                                                      fontWeight: 600,
                                                      textTransform: 'uppercase',
                                                      letterSpacing: '0.5px',
                                                    }}
                                                  >
                                                    {getPermissionTypeLabel(perm.type)}
                                                  </span>
                                                  <span style={{
                                                    fontSize: '11px',
                                                    fontFamily: 'Inter, sans-serif',
                                                    color: 'var(--muted-foreground, #6b7280)',
                                                    fontStyle: 'italic',
                                                  }}>
                                                    {perm.code}
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    );
                                  })}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(filteredRoles.length / itemsPerPage)}
        totalItems={filteredRoles.length}
        itemsPerPage={itemsPerPage}
        onPageChange={(page) => {
          setCurrentPage(page);
          setExpandedRoleId(null);
        }}
      />
    </div>
  );
};