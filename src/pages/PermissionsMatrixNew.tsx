import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Plus,
  X,
  Info,
  Check,
  Eye,
  FileText,
  MapPin,
  Calendar,
  Briefcase,
  Camera,
  TrendingUp,
  Settings,
  AlertTriangle,
  Shield,
  Search,
  Save,
} from 'lucide-react';
import styles from './PermissionsMatrix.module.css';

// Module definition
interface Module {
  id: string;
  name: string;
  code: string;
  description: string;
  order: number;
}

// Permission definition
interface Permission {
  id: string;
  moduleId: string;
  name: string;
  code: string;
  description: string;
  isDefault: boolean;
}

// Role permission assignment
interface RolePermission {
  roleId: string;
  permissionId: string;
}

interface PermissionsMatrixNewProps {
  selectedRole?: any;
  onSave?: (permissions: string[]) => void;
}

export const PermissionsMatrixNew: React.FC<PermissionsMatrixNewProps> = ({
  selectedRole,
  onSave,
}) => {
  // State for expanded modules
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set(['overview', 'facilities', 'admin']));
  
  // State for showing add permission dialog
  const [addingPermissionFor, setAddingPermissionFor] = useState<string | null>(null);
  
  // State for visible permissions per module (including dynamically added ones)
  const [visiblePermissions, setVisiblePermissions] = useState<{ [moduleId: string]: Set<string> }>({});
  
  // State for selected permissions for the role
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set());

  // Modules data
  const modules: Module[] = [
    { id: 'overview', name: 'Tổng quan', code: 'OVERVIEW', description: 'Trang hiển thị số liệu và thông tin chung', order: 1 },
    { id: 'map', name: 'Bản đồ điều hành', code: 'MAP', description: 'Quản lý dựa trên bản đồ và vị trí', order: 2 },
    { id: 'facilities', name: 'Cơ sở & Địa bàn', code: 'FACILITIES', description: 'Quản lý đơn vị, cơ sở, khu vực', order: 3 },
    { id: 'risk', name: 'Nguồn tin / Risk', code: 'RISK', description: 'Quản lý nguồn dữ liệu và theo dõi rủi ro', order: 4 },
    { id: 'planning', name: 'Kế hoạch tác nghiệp', code: 'PLANNING', description: 'Lập và triển khai kế hoạch', order: 5 },
    { id: 'field-tasks', name: 'Nhiệm vụ hiện trường', code: 'FIELD_TASKS', description: 'Giao việc và theo dõi nhiệm vụ hiện trường', order: 6 },
    { id: 'evidence', name: 'Kho chứng cứ', code: 'EVIDENCE', description: 'Lưu trữ hình ảnh, video, tài liệu', order: 7 },
    { id: 'reports', name: 'Báo cáo & KPI', code: 'REPORTS', description: 'Thống kê, đánh giá hiệu quả', order: 8 },
    { id: 'admin', name: 'Quản trị hệ thống', code: 'ADMIN', description: 'Thiết lập hệ thống, phân quyền, người dùng', order: 9 },
  ];

  // Permissions data
  const permissions: Permission[] = [
    // OVERVIEW Module
    { id: 'overview-view', moduleId: 'overview', name: 'Xem', code: 'OVERVIEW_VIEW', description: 'Xem trang tổng quan và thống kế', isDefault: true },
    { id: 'overview-create', moduleId: 'overview', name: 'Thêm', code: 'OVERVIEW_CREATE', description: 'Tạo widget tùy chỉnh trên dashboard', isDefault: true },
    { id: 'overview-update', moduleId: 'overview', name: 'Sửa', code: 'OVERVIEW_UPDATE', description: 'Chỉnh sửa cấu hình dashboard', isDefault: true },
    { id: 'overview-delete', moduleId: 'overview', name: 'Xóa', code: 'OVERVIEW_DELETE', description: 'Xóa widget khỏi dashboard', isDefault: true },
    { id: 'overview-export', moduleId: 'overview', name: 'Xuất báo cáo', code: 'OVERVIEW_EXPORT', description: 'Xuất dữ liệu dashboard ra file Excel/PDF', isDefault: false },
    { id: 'overview-compare', moduleId: 'overview', name: 'So sánh kỳ', code: 'OVERVIEW_COMPARE', description: 'So sánh thống kê giữa các kỳ', isDefault: false },

    // MAP Module
    { id: 'map-view', moduleId: 'map', name: 'Xem', code: 'MAP_VIEW', description: 'Xem bản đồ điều hành và điểm đánh dấu', isDefault: true },
    { id: 'map-create', moduleId: 'map', name: 'Thêm', code: 'MAP_CREATE', description: 'Thêm điểm đánh dấu mới trên bản đồ', isDefault: true },
    { id: 'map-update', moduleId: 'map', name: 'Sửa', code: 'MAP_UPDATE', description: 'Cập nhật vị trí điểm đánh dấu', isDefault: true },
    { id: 'map-delete', moduleId: 'map', name: 'Xóa', code: 'MAP_DELETE', description: 'Xóa điểm đánh dấu khỏi bản đồ', isDefault: true },
    { id: 'map-draw', moduleId: 'map', name: 'Vẽ vùng', code: 'MAP_DRAW_AREA', description: 'Vẽ vùng, khu vực trên bản đồ', isDefault: false },
    { id: 'map-measure', moduleId: 'map', name: 'Đo khoảng cách', code: 'MAP_MEASURE', description: 'Sử dụng công cụ đo khoảng cách', isDefault: false },
    { id: 'map-export', moduleId: 'map', name: 'Xuất bản đồ', code: 'MAP_EXPORT', description: 'Xuất bản đồ ra hình ảnh hoặc PDF', isDefault: false },
    { id: 'map-gps', moduleId: 'map', name: 'Theo dõi GPS', code: 'MAP_GPS_TRACKING', description: 'Theo dõi vị trí GPS thời gian thực', isDefault: false },

    // FACILITIES Module
    { id: 'facilities-view', moduleId: 'facilities', name: 'Xem', code: 'FACILITIES_VIEW', description: 'Xem danh sách cơ sở và thông tin chi tiết', isDefault: true },
    { id: 'facilities-create', moduleId: 'facilities', name: 'Thêm', code: 'FACILITIES_CREATE', description: 'Tạo mới cơ sở kinh doanh', isDefault: true },
    { id: 'facilities-update', moduleId: 'facilities', name: 'Sửa', code: 'FACILITIES_UPDATE', description: 'Chỉnh sửa thông tin cơ sở', isDefault: true },
    { id: 'facilities-delete', moduleId: 'facilities', name: 'Xóa', code: 'FACILITIES_DELETE', description: 'Xóa cơ sở khỏi hệ thống', isDefault: true },
    { id: 'facilities-import', moduleId: 'facilities', name: 'Nhập từ Excel', code: 'FACILITIES_IMPORT', description: 'Nhập danh sách cơ sở từ file Excel', isDefault: false },
    { id: 'facilities-export', moduleId: 'facilities', name: 'Xuất Excel', code: 'FACILITIES_EXPORT', description: 'Xuất danh sách cơ sở ra file Excel', isDefault: false },
    { id: 'facilities-approve', moduleId: 'facilities', name: 'Duyệt', code: 'FACILITIES_APPROVE', description: 'Phê duyệt cơ sở mới đăng ký', isDefault: false },
    { id: 'facilities-assign', moduleId: 'facilities', name: 'Gán người phụ trách', code: 'FACILITIES_ASSIGN', description: 'Gán cán bộ phụ trách cho cơ sở', isDefault: false },

    // RISK Module
    { id: 'risk-view', moduleId: 'risk', name: 'Xem', code: 'RISK_VIEW', description: 'Xem nguồn tin và cảnh báo rủi ro', isDefault: true },
    { id: 'risk-create', moduleId: 'risk', name: 'Thêm', code: 'RISK_CREATE', description: 'Tạo nguồn tin mới', isDefault: true },
    { id: 'risk-update', moduleId: 'risk', name: 'Sửa', code: 'RISK_UPDATE', description: 'Cập nhật thông tin nguồn tin', isDefault: true },
    { id: 'risk-delete', moduleId: 'risk', name: 'Xóa', code: 'RISK_DELETE', description: 'Xóa nguồn tin', isDefault: true },
    { id: 'risk-assess', moduleId: 'risk', name: 'Đánh giá rủi ro', code: 'RISK_ASSESS', description: 'Đánh giá và phân loại mức độ rủi ro', isDefault: false },
    { id: 'risk-verify', moduleId: 'risk', name: 'Xác minh', code: 'RISK_VERIFY', description: 'Xác minh nguồn tin', isDefault: false },

    // PLANNING Module
    { id: 'planning-view', moduleId: 'planning', name: 'Xem', code: 'PLANNING_VIEW', description: 'Xem kế hoạch tác nghiệp', isDefault: true },
    { id: 'planning-create', moduleId: 'planning', name: 'Thêm', code: 'PLANNING_CREATE', description: 'Tạo kế hoạch mới', isDefault: true },
    { id: 'planning-update', moduleId: 'planning', name: 'Sửa', code: 'PLANNING_UPDATE', description: 'Chỉnh sửa kế hoạch', isDefault: true },
    { id: 'planning-delete', moduleId: 'planning', name: 'Xóa', code: 'PLANNING_DELETE', description: 'Xóa kế hoạch', isDefault: true },
    { id: 'planning-approve', moduleId: 'planning', name: 'Phê duyệt', code: 'PLANNING_APPROVE', description: 'Phê duyệt kế hoạch', isDefault: false },
    { id: 'planning-publish', moduleId: 'planning', name: 'Công bố', code: 'PLANNING_PUBLISH', description: 'Công bố kế hoạch cho cán bộ', isDefault: false },

    // FIELD_TASKS Module
    { id: 'field-view', moduleId: 'field-tasks', name: 'Xem', code: 'FIELD_TASKS_VIEW', description: 'Xem danh sách nhiệm vụ', isDefault: true },
    { id: 'field-create', moduleId: 'field-tasks', name: 'Thêm', code: 'FIELD_TASKS_CREATE', description: 'Tạo nhiệm vụ mới', isDefault: true },
    { id: 'field-update', moduleId: 'field-tasks', name: 'Sửa', code: 'FIELD_TASKS_UPDATE', description: 'Cập nhật thông tin nhiệm vụ', isDefault: true },
    { id: 'field-delete', moduleId: 'field-tasks', name: 'Xóa', code: 'FIELD_TASKS_DELETE', description: 'Xóa nhiệm vụ', isDefault: true },
    { id: 'field-assign', moduleId: 'field-tasks', name: 'Gán nhiệm vụ', code: 'FIELD_TASKS_ASSIGN', description: 'Gán nhiệm vụ cho cán bộ', isDefault: false },
    { id: 'field-complete', moduleId: 'field-tasks', name: 'Hoàn thành', code: 'FIELD_TASKS_COMPLETE', description: 'Đánh dấu nhiệm vụ hoàn thành', isDefault: false },
    { id: 'field-track', moduleId: 'field-tasks', name: 'Theo dõi GPS', code: 'FIELD_TASKS_GPS_TRACK', description: 'Theo dõi vị trí cán bộ', isDefault: false },

    // EVIDENCE Module
    { id: 'evidence-view', moduleId: 'evidence', name: 'Xem', code: 'EVIDENCE_VIEW', description: 'Xem kho chứng cứ', isDefault: true },
    { id: 'evidence-create', moduleId: 'evidence', name: 'Thêm', code: 'EVIDENCE_CREATE', description: 'Upload chứng cứ mới', isDefault: true },
    { id: 'evidence-update', moduleId: 'evidence', name: 'Sửa', code: 'EVIDENCE_UPDATE', description: 'Cập nhật thông tin chứng cứ', isDefault: true },
    { id: 'evidence-delete', moduleId: 'evidence', name: 'Xóa', code: 'EVIDENCE_DELETE', description: 'Xóa chứng cứ', isDefault: true },
    { id: 'evidence-download', moduleId: 'evidence', name: 'Tải xuống', code: 'EVIDENCE_DOWNLOAD', description: 'Tải xuống file chứng cứ', isDefault: false },
    { id: 'evidence-share', moduleId: 'evidence', name: 'Chia sẻ', code: 'EVIDENCE_SHARE', description: 'Chia sẻ chứng cứ cho người khác', isDefault: false },

    // REPORTS Module
    { id: 'reports-view', moduleId: 'reports', name: 'Xem', code: 'REPORTS_VIEW', description: 'Xem báo cáo và KPI', isDefault: true },
    { id: 'reports-create', moduleId: 'reports', name: 'Thêm', code: 'REPORTS_CREATE', description: 'Tạo báo cáo mới', isDefault: true },
    { id: 'reports-update', moduleId: 'reports', name: 'Sửa', code: 'REPORTS_UPDATE', description: 'Chỉnh sửa báo cáo', isDefault: true },
    { id: 'reports-delete', moduleId: 'reports', name: 'Xóa', code: 'REPORTS_DELETE', description: 'Xóa báo cáo', isDefault: true },
    { id: 'reports-export', moduleId: 'reports', name: 'Xuất báo cáo', code: 'REPORTS_EXPORT', description: 'Xuất báo cáo ra Excel/PDF', isDefault: false },
    { id: 'reports-approve', moduleId: 'reports', name: 'Phê duyệt', code: 'REPORTS_APPROVE', description: 'Phê duyệt báo cáo', isDefault: false },
    { id: 'reports-schedule', moduleId: 'reports', name: 'Lên lịch', code: 'REPORTS_SCHEDULE', description: 'Lên lịch tự động gửi báo cáo', isDefault: false },

    // ADMIN Module
    { id: 'admin-user-view', moduleId: 'admin', name: 'Xem người dùng', code: 'USER_VIEW', description: 'Xem danh sách người dùng', isDefault: true },
    { id: 'admin-user-create', moduleId: 'admin', name: 'Thêm người dùng', code: 'USER_CREATE', description: 'Tạo tài khoản người dùng mới', isDefault: true },
    { id: 'admin-user-update', moduleId: 'admin', name: 'Sửa người dùng', code: 'USER_UPDATE', description: 'Chỉnh sửa thông tin người dùng', isDefault: true },
    { id: 'admin-user-delete', moduleId: 'admin', name: 'Xóa người dùng', code: 'USER_DELETE', description: 'Xóa tài khoản người dùng', isDefault: true },
    { id: 'admin-role-view', moduleId: 'admin', name: 'Xem vai trò', code: 'ROLE_VIEW', description: 'Xem danh sách vai trò', isDefault: false },
    { id: 'admin-role-create', moduleId: 'admin', name: 'Thêm vai trò', code: 'ROLE_CREATE', description: 'Tạo vai trò mới', isDefault: false },
    { id: 'admin-role-update', moduleId: 'admin', name: 'Sửa vai trò', code: 'ROLE_UPDATE', description: 'Chỉnh sửa vai trò', isDefault: false },
    { id: 'admin-role-delete', moduleId: 'admin', name: 'Xóa vai trò', code: 'ROLE_DELETE', description: 'Xóa vai trò', isDefault: false },
    { id: 'admin-permission-manage', moduleId: 'admin', name: 'Quản lý quyền', code: 'PERMISSION_MANAGE', description: 'Quản lý ma trận phân quyền', isDefault: false },
    { id: 'admin-config', moduleId: 'admin', name: 'Cấu hình hệ thống', code: 'SYSTEM_CONFIG', description: 'Thay đổi cấu hình hệ thống', isDefault: false },
    { id: 'admin-log', moduleId: 'admin', name: 'Xem log', code: 'SYSTEM_LOG_VIEW', description: 'Xem nhật ký hoạt động', isDefault: false },
    { id: 'admin-backup', moduleId: 'admin', name: 'Backup/Restore', code: 'SYSTEM_BACKUP', description: 'Sao lưu và khôi phục dữ liệu', isDefault: false },
  ];

  // Get module icon
  const getModuleIcon = (moduleId: string) => {
    switch (moduleId) {
      case 'overview': return Eye;
      case 'map': return MapPin;
      case 'facilities': return FileText;
      case 'risk': return AlertTriangle;
      case 'planning': return Calendar;
      case 'field-tasks': return Briefcase;
      case 'evidence': return Camera;
      case 'reports': return TrendingUp;
      case 'admin': return Settings;
      default: return Shield;
    }
  };

  // Toggle module expansion
  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  // Get permissions for a module
  const getModulePermissions = (moduleId: string): Permission[] => {
    const modulePerms = permissions.filter(p => p.moduleId === moduleId);
    
    // Get visible permission IDs for this module
    const visibleIds = visiblePermissions[moduleId] || new Set<string>();
    
    // Return default permissions + dynamically added ones
    return modulePerms.filter(p => p.isDefault || visibleIds.has(p.id));
  };

  // Get non-visible permissions for adding
  const getAvailablePermissions = (moduleId: string): Permission[] => {
    const modulePerms = permissions.filter(p => p.moduleId === moduleId);
    const visibleIds = visiblePermissions[moduleId] || new Set<string>();
    
    return modulePerms.filter(p => !p.isDefault && !visibleIds.has(p.id));
  };

  // Toggle permission selection
  const togglePermission = (permissionId: string) => {
    const newSelected = new Set(selectedPermissions);
    if (newSelected.has(permissionId)) {
      newSelected.delete(permissionId);
    } else {
      newSelected.add(permissionId);
    }
    setSelectedPermissions(newSelected);
  };

  // Add permission to visible list
  const addPermissionToModule = (moduleId: string, permissionId: string) => {
    const newVisible = { ...visiblePermissions };
    if (!newVisible[moduleId]) {
      newVisible[moduleId] = new Set<string>();
    }
    newVisible[moduleId].add(permissionId);
    setVisiblePermissions(newVisible);
  };

  // Remove permission from visible list
  const removePermissionFromModule = (moduleId: string, permissionId: string) => {
    const newVisible = { ...visiblePermissions };
    if (newVisible[moduleId]) {
      newVisible[moduleId].delete(permissionId);
    }
    setVisiblePermissions(newVisible);
    
    // Also uncheck if selected
    const newSelected = new Set(selectedPermissions);
    newSelected.delete(permissionId);
    setSelectedPermissions(newSelected);
  };

  // Select all permissions in a module
  const selectAllInModule = (moduleId: string) => {
    const modulePerms = getModulePermissions(moduleId);
    const newSelected = new Set(selectedPermissions);
    modulePerms.forEach(p => newSelected.add(p.id));
    setSelectedPermissions(newSelected);
  };

  // Deselect all permissions in a module
  const deselectAllInModule = (moduleId: string) => {
    const modulePerms = getModulePermissions(moduleId);
    const newSelected = new Set(selectedPermissions);
    modulePerms.forEach(p => newSelected.delete(p.id));
    setSelectedPermissions(newSelected);
  };

  // Check if module has any selected permissions
  const hasSelectedPermissions = (moduleId: string): boolean => {
    const modulePerms = getModulePermissions(moduleId);
    return modulePerms.some(p => selectedPermissions.has(p.id));
  };

  // Check if all permissions in module are selected
  const allPermissionsSelected = (moduleId: string): boolean => {
    const modulePerms = getModulePermissions(moduleId);
    if (modulePerms.length === 0) return false;
    return modulePerms.every(p => selectedPermissions.has(p.id));
  };

  return (
    <div className={styles.matrixContainer}>
      {/* Header */}
      <div className={styles.matrixHeader}>
        <div>
          <h2 className={styles.matrixTitle}>Ma trận phân quyền</h2>
          <p className={styles.matrixDesc}>
            {selectedRole ? `Quản lý quyền cho vai trò: ${selectedRole.name}` : 'Chọn vai trò để phân quyền'}
          </p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.secondaryBtn}>
            <Search size={16} /> Tìm quyền
          </button>
          <button className={styles.primaryBtn} onClick={() => onSave?.(Array.from(selectedPermissions))}>
            <Save size={16} /> Lưu thay đổi
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Tổng số module</div>
          <div className={styles.statValue}>{modules.length}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Quyền đã chọn</div>
          <div className={styles.statValue} style={{ color: 'var(--primary, #005cb6)' }}>
            {selectedPermissions.size}
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Tổng quyền khả dụng</div>
          <div className={styles.statValue}>{permissions.length}</div>
        </div>
      </div>

      {/* Permissions Matrix Table */}
      <div className={styles.matrixTable}>
        {modules.sort((a, b) => a.order - b.order).map(module => {
          const ModuleIcon = getModuleIcon(module.id);
          const isExpanded = expandedModules.has(module.id);
          const modulePerms = getModulePermissions(module.id);
          const availablePerms = getAvailablePermissions(module.id);
          const hasSelected = hasSelectedPermissions(module.id);
          const allSelected = allPermissionsSelected(module.id);
          
          return (
            <div key={module.id} className={styles.moduleSection}>
              {/* Module Header Row */}
              <div className={styles.moduleHeader} onClick={() => toggleModule(module.id)}>
                <div className={styles.moduleHeaderLeft}>
                  <button className={styles.expandBtn}>
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  <ModuleIcon size={18} className={styles.moduleIcon} />
                  <div>
                    <div className={styles.moduleName}>{module.name}</div>
                    <div className={styles.moduleDesc}>{module.description}</div>
                  </div>
                </div>
                <div className={styles.moduleHeaderRight}>
                  <span className={styles.permissionCount}>
                    {modulePerms.length} quyền
                  </span>
                  {hasSelected && (
                    <span className={styles.selectedBadge}>
                      <Check size={14} /> {modulePerms.filter(p => selectedPermissions.has(p.id)).length} đã chọn
                    </span>
                  )}
                </div>
              </div>

              {/* Permissions Table (when expanded) */}
              {isExpanded && (
                <div className={styles.permissionsTable}>
                  {/* Table Header */}
                  <div className={styles.tableHeader}>
                    <div className={styles.permNameCol}>
                      <input
                        type="checkbox"
                        className={styles.checkbox}
                        checked={allSelected}
                        onChange={() => allSelected ? deselectAllInModule(module.id) : selectAllInModule(module.id)}
                      />
                      <span>Tên quyền</span>
                    </div>
                    <div className={styles.permCodeCol}>Mã quyền</div>
                    <div className={styles.permDescCol}>Mô tả</div>
                    <div className={styles.permActionCol}>Thao tác</div>
                  </div>

                  {/* Permission Rows */}
                  {modulePerms.length === 0 ? (
                    <div className={styles.emptyState}>
                      <Shield size={32} style={{ opacity: 0.3 }} />
                      <div>Chưa có quyền nào cho module này</div>
                    </div>
                  ) : (
                    modulePerms.map(perm => (
                      <div 
                        key={perm.id} 
                        className={`${styles.permissionRow} ${selectedPermissions.has(perm.id) ? styles.selected : ''}`}
                      >
                        <div className={styles.permNameCol}>
                          <label className={styles.checkboxLabel}>
                            <input
                              type="checkbox"
                              className={styles.checkbox}
                              checked={selectedPermissions.has(perm.id)}
                              onChange={() => togglePermission(perm.id)}
                            />
                            <span className={styles.permName}>{perm.name}</span>
                            {!perm.isDefault && (
                              <span className={styles.customBadge}>Tùy chỉnh</span>
                            )}
                          </label>
                        </div>
                        <div className={styles.permCodeCol}>
                          <code className={styles.permCode}>{perm.code}</code>
                        </div>
                        <div className={styles.permDescCol}>
                          <div className={styles.permDesc} title={perm.description}>
                            {perm.description}
                            <button className={styles.infoBtn} title={perm.description}>
                              <Info size={14} />
                            </button>
                          </div>
                        </div>
                        <div className={styles.permActionCol}>
                          {!perm.isDefault && (
                            <button
                              className={styles.removeBtn}
                              onClick={() => removePermissionFromModule(module.id, perm.id)}
                              title="Ẩn quyền này khỏi bảng"
                            >
                              <X size={14} /> Ẩn
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}

                  {/* Add Permission Button */}
                  {availablePerms.length > 0 && (
                    <div className={styles.addPermissionSection}>
                      {addingPermissionFor === module.id ? (
                        <div className={styles.addPermissionDropdown}>
                          <div className={styles.dropdownHeader}>
                            <span>Chọn quyền để thêm vào bảng</span>
                            <button
                              className={styles.closeDropdownBtn}
                              onClick={() => setAddingPermissionFor(null)}
                            >
                              <X size={16} />
                            </button>
                          </div>
                          <div className={styles.dropdownList}>
                            {availablePerms.map(perm => (
                              <button
                                key={perm.id}
                                className={styles.dropdownItem}
                                onClick={() => {
                                  addPermissionToModule(module.id, perm.id);
                                  setAddingPermissionFor(null);
                                }}
                              >
                                <div>
                                  <div className={styles.dropdownItemName}>{perm.name}</div>
                                  <div className={styles.dropdownItemDesc}>{perm.description}</div>
                                </div>
                                <code className={styles.dropdownItemCode}>{perm.code}</code>
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <button
                          className={styles.addPermissionBtn}
                          onClick={() => setAddingPermissionFor(module.id)}
                        >
                          <Plus size={16} /> Thêm quyền ({availablePerms.length} khả dụng)
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary Footer */}
      <div className={styles.matrixFooter}>
        <div className={styles.footerInfo}>
          Đã chọn <strong>{selectedPermissions.size}</strong> quyền trên <strong>{permissions.length}</strong> quyền
        </div>
        <div className={styles.footerActions}>
          <button 
            className={styles.secondaryBtn}
            onClick={() => setSelectedPermissions(new Set())}
          >
            Bỏ chọn tất cả
          </button>
          <button 
            className={styles.primaryBtn}
            onClick={() => onSave?.(Array.from(selectedPermissions))}
          >
            <Save size={16} /> Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
};
