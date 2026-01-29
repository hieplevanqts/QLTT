import React, { useState } from 'react';
import {
  Search,
  Plus,
  Edit,
  Shield,
  ChevronDown,
  ChevronUp,
  X,
  Save,
  AlertTriangle,
  Info,
  FileText,
  MapPin,
  Calendar,
  Briefcase,
  Camera,
  TrendingUp,
  Settings,
  Download,
} from 'lucide-react';
import styles from './RolesManagement.module.css';
import { Pagination } from '../components/Pagination';

// ============================================
// DATA STRUCTURES
// ============================================

// Role structure
interface Role {
  id: string;
  code: string;
  name: string;
  description: string;
  status: 0 | 1; // 0 = inactive, 1 = active
  createdAt?: string;
  updatedAt?: string;
}

// Permission structure
interface Permission {
  id: string;
  moduleId: string;
  name: string;
  code: string;
  description: string;
}

// Role-Permission mapping
interface RolePermission {
  roleId: string;
  permissionId: string;
}

// Module definition
interface Module {
  id: string;
  name: string;
  code: string;
  description: string;
  order: number;
  icon: any;
}

// Form state
interface RoleFormData {
  code: string;
  name: string;
  description: string;
  status: 0 | 1;
  permissionIds: string[];
}

// Modal state
type ModalMode = 'add' | 'edit' | null;

interface ModalState {
  isOpen: boolean;
  mode: ModalMode;
  role?: Role;
}

// ============================================
// MOCK DATA
// ============================================

const MODULES: Module[] = [
  { id: 'overview', name: 'Tổng quan', code: 'OVERVIEW', description: 'Dashboard và thống kê', order: 1, icon: Shield },
  { id: 'map', name: 'Bản đồ', code: 'MAP', description: 'Quản lý bản đồ điều hành', order: 2, icon: MapPin },
  { id: 'facilities', name: 'Cơ sở quản lý', code: 'FACILITIES', description: 'Quản lý cơ sở kinh doanh', order: 3, icon: FileText },
  { id: 'risk', name: 'Nguồn tin', code: 'RISK', description: 'Quản lý nguồn tin và rủi ro', order: 4, icon: AlertTriangle },
  { id: 'planning', name: 'Kế hoạch', code: 'PLANNING', description: 'Lập kế hoạch tác nghiệp', order: 5, icon: Calendar },
  { id: 'field-tasks', name: 'Nhiệm vụ hiện trường', code: 'FIELD_TASKS', description: 'Giao việc hiện trường', order: 6, icon: Briefcase },
  { id: 'evidence', name: 'Kho chứng cứ', code: 'EVIDENCE', description: 'Lưu trữ chứng cứ', order: 7, icon: Camera },
  { id: 'reports', name: 'Báo cáo, thống kê', code: 'REPORTS', description: 'Thống kê và báo cáo', order: 8, icon: TrendingUp },
  { id: 'admin', name: 'Quản trị', code: 'ADMIN', description: 'Quản trị hệ thống', order: 9, icon: Settings },
];

const PERMISSIONS: Permission[] = [
  // Overview
  { id: 'perm-overview-view', moduleId: 'overview', name: 'Xem', code: 'OVERVIEW_VIEW', description: 'Xem trang tổng quan' },
  { id: 'perm-overview-create', moduleId: 'overview', name: 'Thêm', code: 'OVERVIEW_CREATE', description: 'Tạo widget dashboard' },
  { id: 'perm-overview-update', moduleId: 'overview', name: 'Sửa', code: 'OVERVIEW_UPDATE', description: 'Chỉnh sửa dashboard' },
  { id: 'perm-overview-delete', moduleId: 'overview', name: 'Xóa', code: 'OVERVIEW_DELETE', description: 'Xóa widget' },
  
  // Map
  { id: 'perm-map-view', moduleId: 'map', name: 'Xem', code: 'MAP_VIEW', description: 'Xem bản đồ điều hành' },
  { id: 'perm-map-create', moduleId: 'map', name: 'Thêm', code: 'MAP_CREATE', description: 'Thêm điểm đánh dấu' },
  { id: 'perm-map-update', moduleId: 'map', name: 'Sửa', code: 'MAP_UPDATE', description: 'Cập nhật vị trí' },
  { id: 'perm-map-delete', moduleId: 'map', name: 'Xóa', code: 'MAP_DELETE', description: 'Xóa điểm đánh dấu' },
  
  // Facilities
  { id: 'perm-facilities-view', moduleId: 'facilities', name: 'Xem', code: 'FACILITIES_VIEW', description: 'Xem danh sách cơ sở' },
  { id: 'perm-facilities-create', moduleId: 'facilities', name: 'Thêm', code: 'FACILITIES_CREATE', description: 'Tạo cơ sở mới' },
  { id: 'perm-facilities-update', moduleId: 'facilities', name: 'Sửa', code: 'FACILITIES_UPDATE', description: 'Chỉnh sửa cơ sở' },
  { id: 'perm-facilities-delete', moduleId: 'facilities', name: 'Xóa', code: 'FACILITIES_DELETE', description: 'Xóa cơ sở' },
  { id: 'perm-facilities-approve', moduleId: 'facilities', name: 'Duyệt', code: 'FACILITIES_APPROVE', description: 'Phê duyệt cơ sở' },
  
  // Risk
  { id: 'perm-risk-view', moduleId: 'risk', name: 'Xem', code: 'RISK_VIEW', description: 'Xem nguồn tin' },
  { id: 'perm-risk-create', moduleId: 'risk', name: 'Thêm', code: 'RISK_CREATE', description: 'Tạo nguồn tin' },
  { id: 'perm-risk-update', moduleId: 'risk', name: 'Sửa', code: 'RISK_UPDATE', description: 'Cập nhật nguồn tin' },
  { id: 'perm-risk-delete', moduleId: 'risk', name: 'Xóa', code: 'RISK_DELETE', description: 'Xóa nguồn tin' },
  
  // Planning
  { id: 'perm-planning-view', moduleId: 'planning', name: 'Xem', code: 'PLANNING_VIEW', description: 'Xem kế hoạch' },
  { id: 'perm-planning-create', moduleId: 'planning', name: 'Thêm', code: 'PLANNING_CREATE', description: 'Tạo kế hoạch' },
  { id: 'perm-planning-update', moduleId: 'planning', name: 'Sửa', code: 'PLANNING_UPDATE', description: 'Chỉnh sửa kế hoạch' },
  { id: 'perm-planning-delete', moduleId: 'planning', name: 'Xóa', code: 'PLANNING_DELETE', description: 'Xóa kế hoạch' },
  
  // Field Tasks
  { id: 'perm-field-view', moduleId: 'field-tasks', name: 'Xem', code: 'FIELD_TASKS_VIEW', description: 'Xem nhiệm vụ' },
  { id: 'perm-field-create', moduleId: 'field-tasks', name: 'Thêm', code: 'FIELD_TASKS_CREATE', description: 'Tạo nhiệm vụ' },
  { id: 'perm-field-update', moduleId: 'field-tasks', name: 'Sửa', code: 'FIELD_TASKS_UPDATE', description: 'Cập nhật nhiệm vụ' },
  { id: 'perm-field-delete', moduleId: 'field-tasks', name: 'Xóa', code: 'FIELD_TASKS_DELETE', description: 'Xóa nhiệm vụ' },
  
  // Evidence
  { id: 'perm-evidence-view', moduleId: 'evidence', name: 'Xem', code: 'EVIDENCE_VIEW', description: 'Xem kho chứng cứ' },
  { id: 'perm-evidence-create', moduleId: 'evidence', name: 'Thêm', code: 'EVIDENCE_CREATE', description: 'Upload chứng cứ' },
  { id: 'perm-evidence-update', moduleId: 'evidence', name: 'Sửa', code: 'EVIDENCE_UPDATE', description: 'Cập nhật chứng cứ' },
  { id: 'perm-evidence-delete', moduleId: 'evidence', name: 'Xóa', code: 'EVIDENCE_DELETE', description: 'Xóa chứng cứ' },
  
  // Reports
  { id: 'perm-reports-view', moduleId: 'reports', name: 'Xem', code: 'REPORTS_VIEW', description: 'Xem báo cáo' },
  { id: 'perm-reports-create', moduleId: 'reports', name: 'Thêm', code: 'REPORTS_CREATE', description: 'Tạo báo cáo' },
  { id: 'perm-reports-update', moduleId: 'reports', name: 'Sửa', code: 'REPORTS_UPDATE', description: 'Chỉnh sửa báo cáo' },
  { id: 'perm-reports-delete', moduleId: 'reports', name: 'Xóa', code: 'REPORTS_DELETE', description: 'Xóa báo cáo' },
  
  // Admin
  { id: 'perm-admin-user-view', moduleId: 'admin', name: 'Xem người dùng', code: 'USER_VIEW', description: 'Xem danh sách người dùng' },
  { id: 'perm-admin-user-create', moduleId: 'admin', name: 'Thêm người dùng', code: 'USER_CREATE', description: 'Tạo người dùng mới' },
  { id: 'perm-admin-user-update', moduleId: 'admin', name: 'Sửa người dùng', code: 'USER_UPDATE', description: 'Chỉnh sửa người dùng' },
  { id: 'perm-admin-user-delete', moduleId: 'admin', name: 'Xóa người dùng', code: 'USER_DELETE', description: 'Xóa người dùng' },
  { id: 'perm-admin-role-manage', moduleId: 'admin', name: 'Quản lý vai trò', code: 'ROLE_MANAGE', description: 'Quản lý vai trò' },
  { id: 'perm-admin-permission-manage', moduleId: 'admin', name: 'Quản lý quyền', code: 'PERMISSION_MANAGE', description: 'Quản lý ma trận quyền' },
];

// ============================================
// MAIN COMPONENT
// ============================================

export const RolesManagement: React.FC = () => {
  // State for roles
  const [roles, setRoles] = useState<Role[]>([
    {
      id: 'role-1',
      code: 'SUPER_ADMIN',
      name: 'Quản trị viên cấp cao',
      description: 'Toàn quyền quản trị hệ thống',
      status: 1,
      createdAt: '2025-01-01',
      updatedAt: '2025-01-01',
    },
    {
      id: 'role-2',
      code: 'MANAGER',
      name: 'Quản lý',
      description: 'Quản lý nghiệp vụ và điều phối',
      status: 1,
      createdAt: '2025-01-02',
      updatedAt: '2025-01-02',
    },
    {
      id: 'role-3',
      code: 'OFFICER',
      name: 'Cán bộ thực thi',
      description: 'Thực hiện công việc hiện trường',
      status: 1,
      createdAt: '2025-01-03',
      updatedAt: '2025-01-03',
    },
    {
      id: 'role-4',
      code: 'VIEWER',
      name: 'Người xem',
      description: 'Chỉ xem, không chỉnh sửa',
      status: 0,
      createdAt: '2025-01-04',
      updatedAt: '2025-01-04',
    },
  ]);

  // State for role-permissions mapping
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([
    // Super Admin - All permissions
    { roleId: 'role-1', permissionId: 'perm-overview-view' },
    { roleId: 'role-1', permissionId: 'perm-overview-create' },
    { roleId: 'role-1', permissionId: 'perm-overview-update' },
    { roleId: 'role-1', permissionId: 'perm-facilities-view' },
    { roleId: 'role-1', permissionId: 'perm-facilities-create' },
    { roleId: 'role-1', permissionId: 'perm-facilities-update' },
    { roleId: 'role-1', permissionId: 'perm-facilities-delete' },
    { roleId: 'role-1', permissionId: 'perm-admin-user-view' },
    { roleId: 'role-1', permissionId: 'perm-admin-user-create' },
    { roleId: 'role-1', permissionId: 'perm-admin-role-manage' },
    
    // Manager - Most permissions
    { roleId: 'role-2', permissionId: 'perm-overview-view' },
    { roleId: 'role-2', permissionId: 'perm-facilities-view' },
    { roleId: 'role-2', permissionId: 'perm-facilities-create' },
    { roleId: 'role-2', permissionId: 'perm-facilities-update' },
    { roleId: 'role-2', permissionId: 'perm-planning-view' },
    { roleId: 'role-2', permissionId: 'perm-planning-create' },
    
    // Officer - Limited permissions
    { roleId: 'role-3', permissionId: 'perm-overview-view' },
    { roleId: 'role-3', permissionId: 'perm-facilities-view' },
    { roleId: 'role-3', permissionId: 'perm-field-view' },
    { roleId: 'role-3', permissionId: 'perm-field-update' },
    
    // Viewer - View only
    { roleId: 'role-4', permissionId: 'perm-overview-view' },
    { roleId: 'role-4', permissionId: 'perm-facilities-view' },
  ]);

  // UI state
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | '1' | '0'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [modalState, setModalState] = useState<ModalState>({ isOpen: false, mode: null });
  const [confirmDeactivate, setConfirmDeactivate] = useState<Role | null>(null);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set(['overview', 'facilities']));
  
  // Form state
  const [formData, setFormData] = useState<RoleFormData>({
    code: '',
    name: '',
    description: '',
    status: 1,
    permissionIds: [],
  });

  const itemsPerPage = 10;

  // ============================================
  // HELPER FUNCTIONS
  // ============================================

  // Get permissions for a role
  const getRolePermissions = (roleId: string): Permission[] => {
    const permIds = rolePermissions
      .filter(rp => rp.roleId === roleId)
      .map(rp => rp.permissionId);
    
    return PERMISSIONS.filter(p => permIds.includes(p.id));
  };

  // Get permissions grouped by module
  const getGroupedPermissions = (roleId: string) => {
    const perms = getRolePermissions(roleId);
    const grouped: { [moduleId: string]: Permission[] } = {};
    
    perms.forEach(perm => {
      if (!grouped[perm.moduleId]) {
        grouped[perm.moduleId] = [];
      }
      grouped[perm.moduleId].push(perm);
    });
    
    return grouped;
  };

  // Format permissions display for table cell
  const formatPermissionsDisplay = (roleId: string) => {
    const grouped = getGroupedPermissions(roleId);
    const modules = Object.keys(grouped);
    
    if (modules.length === 0) {
      return <span className={styles.noPermissions}>Chưa có quyền</span>;
    }

    return (
      <div className={styles.permissionsSummary}>
        {modules.slice(0, 2).map(moduleId => {
          const module = MODULES.find(m => m.id === moduleId);
          const perms = grouped[moduleId];
          
          return (
            <div key={moduleId} className={styles.permissionGroup}>
              <span className={styles.moduleName}>{module?.name}:</span>
              <span className={styles.permissionList}>
                {perms.map(p => p.name).join(', ')}
              </span>
            </div>
          );
        })}
        {modules.length > 2 && (
          <span className={styles.morePermissions}>
            +{modules.length - 2} module khác
          </span>
        )}
      </div>
    );
  };

  // Toggle role status
  const toggleRoleStatus = (role: Role) => {
    if (role.status === 1) {
      // Ask confirmation before deactivating
      setConfirmDeactivate(role);
    } else {
      // Activate directly
      setRoles(roles.map(r => 
        r.id === role.id ? { ...r, status: 1 as 0 | 1 } : r
      ));
    }
  };

  const confirmDeactivateRole = () => {
    if (!confirmDeactivate) return;
    
    setRoles(roles.map(r => 
      r.id === confirmDeactivate.id ? { ...r, status: 0 as 0 | 1 } : r
    ));
    setConfirmDeactivate(null);
  };

  // Open modal
  const openModal = (mode: ModalMode, role?: Role) => {
    setModalState({ isOpen: true, mode, role });
    
    if (mode === 'edit' && role) {
      const rolePerms = getRolePermissions(role.id);
      setFormData({
        code: role.code,
        name: role.name,
        description: role.description,
        status: role.status,
        permissionIds: rolePerms.map(p => p.id),
      });
    } else if (mode === 'add') {
      setFormData({
        code: '',
        name: '',
        description: '',
        status: 1,
        permissionIds: [],
      });
    }
  };

  // Close modal
  const closeModal = () => {
    setModalState({ isOpen: false, mode: null });
    setFormData({
      code: '',
      name: '',
      description: '',
      status: 1,
      permissionIds: [],
    });
  };

  // Save role
  const saveRole = () => {
    if (!formData.code || !formData.name) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    if (modalState.mode === 'add') {
      const newRole: Role = {
        id: `role-${Date.now()}`,
        code: formData.code,
        name: formData.name,
        description: formData.description,
        status: formData.status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setRoles([...roles, newRole]);
      
      // Add permissions
      const newRolePerms: RolePermission[] = formData.permissionIds.map(permId => ({
        roleId: newRole.id,
        permissionId: permId,
      }));
      setRolePermissions([...rolePermissions, ...newRolePerms]);
      
    } else if (modalState.mode === 'edit' && modalState.role) {
      setRoles(roles.map(r => 
        r.id === modalState.role!.id 
          ? { 
              ...r, 
              name: formData.name, 
              description: formData.description, 
              status: formData.status,
              updatedAt: new Date().toISOString(),
            } 
          : r
      ));
      
      // Update permissions
      const newRolePerms: RolePermission[] = formData.permissionIds.map(permId => ({
        roleId: modalState.role!.id,
        permissionId: permId,
      }));
      setRolePermissions([
        ...rolePermissions.filter(rp => rp.roleId !== modalState.role!.id),
        ...newRolePerms,
      ]);
    }
    
    closeModal();
  };

  // Toggle permission in form
  const togglePermission = (permId: string) => {
    setFormData(prev => ({
      ...prev,
      permissionIds: prev.permissionIds.includes(permId)
        ? prev.permissionIds.filter(id => id !== permId)
        : [...prev.permissionIds, permId],
    }));
  };

  // Select all permissions in a module
  const selectAllInModule = (moduleId: string) => {
    const modulePerms = PERMISSIONS.filter(p => p.moduleId === moduleId);
    const allSelected = modulePerms.every(p => formData.permissionIds.includes(p.id));
    
    if (allSelected) {
      // Deselect all
      setFormData(prev => ({
        ...prev,
        permissionIds: prev.permissionIds.filter(id => 
          !modulePerms.some(p => p.id === id)
        ),
      }));
    } else {
      // Select all
      const newIds = modulePerms.map(p => p.id);
      setFormData(prev => ({
        ...prev,
        permissionIds: [...new Set([...prev.permissionIds, ...newIds])],
      }));
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

  // Filter roles
  const filteredRoles = roles.filter(role => {
    const matchesSearch = searchText === '' ||
      role.code.toLowerCase().includes(searchText.toLowerCase()) ||
      role.name.toLowerCase().includes(searchText.toLowerCase()) ||
      role.description.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || role.status === parseInt(filterStatus);
    
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRoles = filteredRoles.slice(startIndex, endIndex);

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Quản lý vai trò</h1>
          <p className={styles.description}>
            Tạo và quản lý vai trò, gán quyền truy cập cho từng vai trò
          </p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.secondaryBtn}>
            <Download size={16} /> Xuất Excel
          </button>
          <button className={styles.primaryBtn} onClick={() => openModal('add')}>
            <Plus size={16} /> Thêm vai trò
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className={styles.filterBar}>
        <div className={styles.searchBox}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Tìm vai trò theo mã, tên, mô tả..."
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
            setFilterStatus(e.target.value as 'all' | '1' | '0');
            setCurrentPage(1);
          }}
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="1">Đang hoạt động</option>
          <option value="0">Ngưng hoạt động</option>
        </select>
      </div>

      {/* Table */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ width: '50px' }}>#</th>
              <th style={{ width: '150px' }}>Mã vai trò</th>
              <th style={{ width: '200px' }}>Tên vai trò</th>
              <th style={{ minWidth: '200px' }}>Mô tả</th>
              <th style={{ minWidth: '300px' }}>Chức năng / Quyền</th>
              <th style={{ width: '140px', textAlign: 'center' }}>Trạng thái</th>
              <th style={{ width: '100px', textAlign: 'center' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {paginatedRoles.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>
                  <div className={styles.emptyState}>
                    <Shield size={48} style={{ opacity: 0.3 }} />
                    <div>Không tìm thấy vai trò nào</div>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedRoles.map((role, index) => (
                <tr key={role.id} className={role.status === 0 ? styles.inactiveRow : ''}>
                  <td>{startIndex + index + 1}</td>
                  <td>
                    <code className={styles.roleCode}>{role.code}</code>
                  </td>
                  <td>
                    <div className={styles.roleName}>
                      <Shield size={16} className={styles.roleIcon} />
                      {role.name}
                    </div>
                  </td>
                  <td>
                    <span className={styles.roleDesc}>{role.description}</span>
                  </td>
                  <td>
                    <div className={styles.permissionsCell}>
                      {formatPermissionsDisplay(role.id)}
                    </div>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <label className={styles.statusToggle}>
                      <input
                        type="checkbox"
                        checked={role.status === 1}
                        onChange={() => toggleRoleStatus(role)}
                      />
                      <span className={styles.toggleSlider}></span>
                      <span className={styles.toggleLabel}>
                        {role.status === 1 ? 'Hoạt động' : 'Ngưng'}
                      </span>
                    </label>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      className={styles.iconBtn}
                      onClick={() => openModal('edit', role)}
                      title="Chnh sửa vai trò"
                    >
                      <Edit size={16} />
                    </button>
                  </td>
                </tr>
              ))
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
        onPageChange={setCurrentPage}
      />

      {/* Modal: Add/Edit Role */}
      {modalState.isOpen && (modalState.mode === 'add' || modalState.mode === 'edit') && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {modalState.mode === 'add' ? 'Thêm vai trò mới' : 'Chỉnh sửa vai trò'}
              </h2>
              <button className={styles.closeBtn} onClick={closeModal}>
                <X size={20} />
              </button>
            </div>

            <div className={styles.modalBody}>
              {/* Code */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Mã vai trò <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="VD: MANAGER, OFFICER..."
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  disabled={modalState.mode === 'edit'}
                />
                {modalState.mode === 'edit' && (
                  <small className={styles.hint}>Mã vai trò không thể thay đổi sau khi tạo</small>
                )}
              </div>

              {/* Name */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Tên vai trò <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="VD: Quản lý, Cán bộ thực thi..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              {/* Description */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Mô tả</label>
                <textarea
                  className={styles.textarea}
                  placeholder="Mô tả vai trò và trách nhiệm..."
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              {/* Status */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Trạng thái</label>
                <label className={styles.statusToggle}>
                  <input
                    type="checkbox"
                    checked={formData.status === 1}
                    onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 1 : 0 })}
                  />
                  <span className={styles.toggleSlider}></span>
                  <span className={styles.toggleLabel}>
                    {formData.status === 1 ? 'Đang hoạt động' : 'Ngưng hoạt động'}
                  </span>
                </label>
              </div>

              {/* Permissions */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Chức năng / Quyền
                  <span className={styles.permissionCount}>
                    ({formData.permissionIds.length} quyền đã chọn)
                  </span>
                </label>
                
                <div className={styles.permissionsTree}>
                  {MODULES.sort((a, b) => a.order - b.order).map(module => {
                    const ModuleIcon = module.icon;
                    const isExpanded = expandedModules.has(module.id);
                    const modulePerms = PERMISSIONS.filter(p => p.moduleId === module.id);
                    const selectedCount = modulePerms.filter(p => formData.permissionIds.includes(p.id)).length;
                    const allSelected = selectedCount === modulePerms.length;
                    const someSelected = selectedCount > 0 && selectedCount < modulePerms.length;
                    
                    return (
                      <div key={module.id} className={styles.moduleNode}>
                        <div className={styles.moduleNodeHeader} onClick={() => toggleModule(module.id)}>
                          <button className={styles.expandBtn}>
                            {isExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                          </button>
                          <input
                            type="checkbox"
                            className={styles.checkbox}
                            checked={allSelected}
                            onChange={(e) => {
                              e.stopPropagation();
                              selectAllInModule(module.id);
                            }}
                            ref={input => {
                              if (input) {
                                input.indeterminate = someSelected;
                              }
                            }}
                          />
                          <ModuleIcon size={16} className={styles.moduleNodeIcon} />
                          <span className={styles.moduleNodeName}>{module.name}</span>
                          {selectedCount > 0 && (
                            <span className={styles.moduleSelectedBadge}>
                              {selectedCount}/{modulePerms.length}
                            </span>
                          )}
                        </div>
                        
                        {isExpanded && (
                          <div className={styles.permissionsList}>
                            {modulePerms.map(perm => (
                              <label key={perm.id} className={styles.permissionNode} title={perm.description}>
                                <input
                                  type="checkbox"
                                  className={styles.checkbox}
                                  checked={formData.permissionIds.includes(perm.id)}
                                  onChange={() => togglePermission(perm.id)}
                                />
                                <span className={styles.permissionNodeName}>{perm.name}</span>
                                <code className={styles.permissionNodeCode}>{perm.code}</code>
                                <button className={styles.infoIcon} title={perm.description}>
                                  <Info size={12} />
                                </button>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.secondaryBtn} onClick={closeModal}>
                Hủy
              </button>
              <button 
                className={styles.primaryBtn} 
                onClick={saveRole}
                disabled={!formData.code || !formData.name}
              >
                <Save size={16} />
                {modalState.mode === 'add' ? 'Thêm vai trò' : 'Lưu thay đổi'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Deactivate Modal */}
      {confirmDeactivate && (
        <div className={styles.modalOverlay} onClick={() => setConfirmDeactivate(null)}>
          <div className={styles.confirmModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.confirmIcon}>
              <AlertTriangle size={48} />
            </div>
            <h3 className={styles.confirmTitle}>Xác nhận ngưng hoạt động</h3>
            <p className={styles.confirmMessage}>
              Bạn có chắc chắn muốn ngưng hoạt động vai trò <strong>{confirmDeactivate.name}</strong>?
              <br />
              Vai trò sẽ không còn hiệu lực phân quyền cho người dùng.
            </p>
            <div className={styles.confirmActions}>
              <button className={styles.secondaryBtn} onClick={() => setConfirmDeactivate(null)}>
                Hủy
              </button>
              <button className={styles.dangerBtn} onClick={confirmDeactivateRole}>
                Xác nhận ngưng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
