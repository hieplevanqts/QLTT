import React, { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  Check,
  Lock,
  Unlock,
  Clock,
  XCircle,
  ChevronDown,
  ChevronUp,
  Shield,
  TrendingUp,
  Database,
  FileText,
  Activity,
  History,
  AlertTriangle,
  RefreshCw,
  Info,
} from 'lucide-react';
import styles from './AdminPage.module.css';
import { Pagination, usePagination } from '../components/Pagination';
import { LocalitiesTab } from './LocalitiesTab';

// Import the new redesigned PermissionsTab
import { PermissionsTabNew } from './PermissionsTabNew';

// Re-export as PermissionsTab to replace the old one
export { PermissionsTabNew as PermissionsTab };

// Import and export the new PermissionsManagement component
import { PermissionsManagement } from './PermissionsManagement';
export { PermissionsManagement };

// Import and export the new RolesTabNew (replaces old RolesTab)
import { RolesTabNew } from './RolesTabNew';
export { RolesTabNew as RolesTab };

// Import and export the new PermissionsMatrixNew
import { PermissionsMatrixNew } from './PermissionsMatrixNew';
export { PermissionsMatrixNew };

// Import and export the new RolesManagement (complete role management)
import { RolesManagement } from './RolesManagement';
export { RolesManagement };

// Import and export the new TerritoryTabNew
import { TerritoryTabNew } from './TerritoryTabNew';
export { TerritoryTabNew };

// Import and export the new RBACManagement (Full RBAC system with matrix view)
import RBACManagement from './RBACManagement';
export { RBACManagement };

// Import and export the new PermissionsMatrixTabNew (Ma trận quyền)
import { PermissionsMatrixTabNew } from './PermissionsMatrixTabNew';
export { PermissionsMatrixTabNew };

// Import and export the new UserListTabNew (Quản lý người dùng)
import { UserListTabNew } from './UserListTabNew';
export { UserListTabNew };

// For backward compatibility - alias
export const PermissionsMatrixTab = RBACManagement;

// TAB 1.1: QUẢN LÝ NGƯỜI DÙNG
export const UserListTab: React.FC<{
  users: any[];
  onOpenModal: (type: any, item?: any) => void;
  onToggleStatus: (userId: string) => void;
}> = ({ users, onOpenModal, onToggleStatus }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const itemsPerPage = 10;

  // Filter logic
  const filteredUsers = users.filter(user => {
    const matchesSearch = searchText === '' || 
      user.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
      user.username.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  return (
    <div className={styles.tabContentInner}>
      <div className={styles.filterBar}>
        <div className={styles.searchBox}>
          <Search size={18} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Tìm theo tên, tài khoản, email..." 
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
          value={filterRole}
          onChange={(e) => {
            setFilterRole(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="all">Tất cả vai trò</option>
          <option value="Công dân">Công dân</option>
          <option value="Cán bộ thực thi">Cán bộ thực thi</option>
          <option value="Quản lý cấp huyện">Quản lý cấp huyện</option>
          <option value="Quản trị hệ thống">Quản trị hệ thống</option>
        </select>
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
          <option value="locked">Đã khóa</option>
          <option value="pending">Chờ duyệt</option>
        </select>
        <button className={styles.secondaryBtn}>
          <Download size={16} /> Xuất Excel
        </button>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Mã</th>
              <th>Tài khoản</th>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Điện thoại</th>
              <th>Vai trò</th>
              <th>Trạng thái</th>
              <th className={styles.actionCol}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '2rem' }}>
                  Không tìm thấy kết quả
                </td>
              </tr>
            ) : (
              paginatedUsers.map((user) => (
                <tr key={user.id}>
                  <td><code className={styles.code}>{user.id}</code></td>
                  <td><strong>{user.username}</strong></td>
                  <td>
                    <div className={styles.userCell}>
                      <div className={styles.avatar}>{user.fullName.charAt(0)}</div>
                      <div>{user.fullName}</div>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td><span className={styles.badge}>{user.role}</span></td>
                  <td>
                    {user.status === 'active' && <span className={styles.statusActive}><Check size={12} /> Hoạt động</span>}
                    {user.status === 'locked' && <span className={styles.statusLocked}><Lock size={12} /> Đã khóa</span>}
                    {user.status === 'pending' && <span className={styles.statusPending}><Clock size={12} /> Chờ duyệt</span>}
                  </td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button className={styles.iconBtn} title="Xem chi tiết" onClick={() => onOpenModal('view', user)}>
                        <Eye size={16} />
                      </button>
                      <button className={styles.iconBtn} title="Chỉnh sửa" onClick={() => onOpenModal('edit', user)}>
                        <Edit size={16} />
                      </button>
                      <button className={styles.iconBtn} title={user.status === 'active' ? 'Khóa' : 'Mở khóa'} onClick={() => onToggleStatus(user.id)}>
                        {user.status === 'active' ? <Lock size={16} /> : <Unlock size={16} />}
                      </button>
                      <button className={styles.iconBtn} title="Xóa" onClick={() => onOpenModal('delete', user)}>
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

      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(filteredUsers.length / itemsPerPage)}
        totalItems={filteredUsers.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

// TAB 1.2: CHI TIẾT NGƯỜI DÙNG
export const UserDetailTab: React.FC<{
  users: any[];
  onOpenModal: (type: any, item?: any) => void;
}> = ({ users, onOpenModal }) => {
  const [selectedUser, setSelectedUser] = useState(users[0]);

  if (!selectedUser) return <div className={styles.placeholder}>Chưa có người dùng</div>;

  // Mock permissions data based on role
  const userPermissions = [
    { module: 'Tổng quan', view: true, create: false, edit: false, delete: false },
    { module: 'Bản đồ', view: true, create: false, edit: false, delete: false },
    { module: 'Cơ sở & Địa bàn', view: true, create: true, edit: true, delete: false },
    { module: 'Nhiệm vụ', view: true, create: true, edit: true, delete: true },
    { module: 'Kiểm tra', view: true, create: false, edit: false, delete: false },
    { module: 'Báo cáo', view: true, create: false, edit: false, delete: false },
    { module: 'Quản trị hệ thống', view: selectedUser.role === 'Quản trị hệ thống', create: selectedUser.role === 'Quản trị hệ thống', edit: selectedUser.role === 'Quản trị hệ thống', delete: selectedUser.role === 'Quản trị hệ thống' },
  ];

  return (
    <div className={styles.tabContentInner}>

      <div className={styles.filterBar}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Chọn người dùng:</label>
          <select 
            className={styles.select} 
            style={{ minWidth: '300px' }}
            value={selectedUser.id}
            onChange={(e) => {
              const user = users.find(u => u.id === e.target.value);
              if (user) setSelectedUser(user);
            }}
          >
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.fullName} ({u.username})</option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.detailCard}>
        <div className={styles.detailHeader}>
          <div className={styles.detailAvatar}>{selectedUser.fullName.charAt(0)}</div>
          <div>
            <h3>{selectedUser.fullName}</h3>
            <p className={styles.meta}>{selectedUser.username} • {selectedUser.email}</p>
          </div>
          {selectedUser.status === 'active' && <span className={styles.statusActive}><Check size={14} /> Hoạt động</span>}
          {selectedUser.status === 'locked' && <span className={styles.statusLocked}><Lock size={14} /> Đã khóa</span>}
        </div>
        <div className={styles.detailGrid}>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Mã người dùng:</span>
            <span className={styles.detailValue}><code>{selectedUser.id}</code></span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Vai trò:</span>
            <span className={styles.detailValue}><span className={styles.badge}>{selectedUser.role}</span></span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Đơn vị:</span>
            <span className={styles.detailValue}>{selectedUser.unit}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Địa bàn:</span>
            <span className={styles.detailValue}>{selectedUser.territory}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Điện thoại:</span>
            <span className={styles.detailValue}>{selectedUser.phone}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Ngày tạo:</span>
            <span className={styles.detailValue}>{selectedUser.createdAt}</span>
          </div>
        </div>
      </div>

      {/* VAI TRÒ VÀ QUYỀN HẠN */}
      <div className={styles.detailCard} style={{ marginTop: '1.5rem' }}>
        <div style={{ padding: 'var(--spacing-5, 20px)', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, fontSize: '1.1rem', fontWeight: 600, fontFamily: 'Inter, sans-serif', color: 'var(--foreground)' }}>
            <Shield size={18} />
            Vai trò và Quyền hạn
          </h3>
        </div>
        
        <div style={{ padding: 'var(--spacing-5, 20px)' }}>
          <div style={{ marginBottom: 'var(--spacing-4, 16px)' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2, 8px)', marginTop: 'var(--spacing-2, 8px)' }}>
              <span className={styles.roleTag}>{selectedUser.role}</span>
              <span className={styles.roleTagSecondary}>Mã: {selectedUser.roleId}</span>
            </div>
          </div>

          <div style={{ marginTop: 'var(--spacing-4, 16px)' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: 'var(--spacing-3, 12px)', fontFamily: 'Inter, sans-serif', color: 'var(--foreground)' }}>
              Ma trận quyền theo module
            </h4>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Module</th>
                    <th style={{ textAlign: 'center', width: '80px' }}>Xem</th>
                    <th style={{ textAlign: 'center', width: '80px' }}>Tạo</th>
                    <th style={{ textAlign: 'center', width: '80px' }}>Sửa</th>
                    <th style={{ textAlign: 'center', width: '80px' }}>Xóa</th>
                  </tr>
                </thead>
                <tbody>
                  {userPermissions.map((perm, idx) => (
                    <tr key={idx}>
                      <td><strong>{perm.module}</strong></td>
                      <td style={{ textAlign: 'center' }}>
                        {perm.view ? <Check size={16} style={{ color: 'var(--success, #10b981)' }} /> : <XCircle size={16} style={{ color: 'var(--text-tertiary, #9ca3af)' }} />}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {perm.create ? <Check size={16} style={{ color: 'var(--success, #10b981)' }} /> : <XCircle size={16} style={{ color: 'var(--text-tertiary, #9ca3af)' }} />}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {perm.edit ? <Check size={16} style={{ color: 'var(--success, #10b981)' }} /> : <XCircle size={16} style={{ color: 'var(--text-tertiary, #9ca3af)' }} />}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {perm.delete ? <Check size={16} style={{ color: 'var(--success, #10b981)' }} /> : <XCircle size={16} style={{ color: 'var(--text-tertiary, #9ca3af)' }} />}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// TAB 1.3: QUẢN LÝ VAI TRÒ (OLD - REPLACED BY RolesTabNew)
const RolesTabOld: React.FC<{
  roles: any[];
  onOpenModal: (type: any, item?: any) => void;
}> = ({ roles, onOpenModal }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedRoleId, setExpandedRoleId] = useState<string | null>(null);
  const itemsPerPage = 10;

  // Get role permissions - use actual role.permissions if available, else fallback to mock
  const getRolePermissions = (role: any) => {
    // If role has permissions defined, use them
    if (role.permissions && Array.isArray(role.permissions) && role.permissions.length > 0) {
      return role.permissions;
    }

    // Otherwise, generate based on role code for backwards compatibility
    const basePermissions = [
      { module: 'Tổng quan', view: true, create: false, edit: false, delete: false },
      { module: 'Bản đồ', view: true, create: false, edit: false, delete: false },
      { module: 'Cơ sở & Địa bàn', view: false, create: false, edit: false, delete: false },
      { module: 'Nhiệm vụ', view: false, create: false, edit: false, delete: false },
      { module: 'Kiểm tra', view: false, create: false, edit: false, delete: false },
      { module: 'Báo cáo', view: false, create: false, edit: false, delete: false },
      { module: 'Quản trị hệ thống', view: false, create: false, edit: false, delete: false },
    ];

    // Role-based permissions logic
    const roleCode = role.code?.toUpperCase() || '';
    
    if (roleCode.includes('ADMIN')) {
      return basePermissions.map(p => ({ ...p, view: true, create: true, edit: true, delete: true }));
    } else if (roleCode.includes('MANAGER') || roleCode.includes('QL')) {
      return basePermissions.map((p, i) => 
        i <= 5 ? { ...p, view: true, create: i >= 2, edit: i >= 2, delete: false } : p
      );
    } else if (roleCode.includes('OFFICER') || roleCode.includes('CB')) {
      return basePermissions.map((p, i) => 
        i <= 4 ? { ...p, view: true, create: i >= 2 && i <= 3, edit: i >= 2 && i <= 3, delete: false } : p
      );
    } else if (roleCode.includes('CITIZEN') || roleCode.includes('CD')) {
      return basePermissions.map((p, i) => 
        i <= 1 ? { ...p, view: true } : p
      );
    }
    
    return basePermissions;
  };

  // Filter logic
  const filteredRoles = roles.filter(role => {
    const matchesSearch = searchText === '' ||
      role.name.toLowerCase().includes(searchText.toLowerCase()) ||
      role.code.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || role.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });
  
  // Pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRoles = filteredRoles.slice(startIndex, endIndex);

  return (
    <div className={styles.tabContentInner}>
      <div className={styles.filterBar}>
        <div className={styles.searchBox}>
          <Search size={18} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Tìm vai trò..." 
            className={styles.searchInput}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        <select 
          className={styles.select}
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="active">Đang hoạt động</option>
          <option value="inactive">Không hoạt động</option>
        </select>
        <button className={styles.secondaryBtn}>
          <Download size={16} /> Xuất Excel
        </button>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ width: '40px' }}></th>
              <th>Mã vai trò</th>
              <th>Tên vai trò</th>
              <th>Mô tả</th>
              <th>Số người dùng</th>
              <th>Trạng thái</th>
              <th className={styles.actionCol}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {paginatedRoles.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>
                  Không tìm thấy kết quả
                </td>
              </tr>
            ) : (
              paginatedRoles.map((role) => {
                const isExpanded = expandedRoleId === role.id;
                const permissions = getRolePermissions(role);
                
                return (
                  <React.Fragment key={role.id}>
                    <tr style={{ background: isExpanded ? 'rgba(0, 92, 182, 0.03)' : undefined }}>
                      <td>
                        <button 
                          className={styles.expandBtn}
                          onClick={() => setExpandedRoleId(isExpanded ? null : role.id)}
                          title={isExpanded ? "Thu gọn" : "Xem quyền"}
                        >
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </td>
                      <td><code className={styles.code}>{role.code}</code></td>
                      <td><strong>{role.name}</strong></td>
                      <td>{role.description}</td>
                      <td>{role.userCount.toLocaleString()}</td>
                      <td>
                        {role.status === 'active' ? (
                          <span className={styles.statusActive}><Check size={12} /> Hoạt động</span>
                        ) : (
                          <span className={styles.statusInactive}><XCircle size={12} /> Không hoạt động</span>
                        )}
                      </td>
                      <td>
                        <div className={styles.actionButtons}>
                          <button className={styles.iconBtn} title="Chỉnh sửa" onClick={() => onOpenModal('edit', role)}>
                            <Edit size={16} />
                          </button>
                          <button className={styles.iconBtn} title="Xóa" onClick={() => onOpenModal('delete', role)}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className={styles.expandedRow}>
                        <td colSpan={7} style={{ padding: 0 }}>
                          <div className={styles.permissionExpandedContent}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2, 8px)', marginBottom: 'var(--spacing-4, 16px)' }}>
                              <Shield size={16} style={{ color: 'var(--primary, #005cb6)' }} />
                              <span style={{ fontSize: '14px', fontWeight: 600, fontFamily: 'Inter, sans-serif', color: 'var(--foreground)' }}>
                                Ma trận quyền: {role.name}
                              </span>
                            </div>

                            <div className={styles.permissionGrid}>
                              {permissions.map((perm, idx) => {
                                const hasAnyPermission = perm.view || perm.create || perm.edit || perm.delete;
                                return (
                                  <div key={idx} className={styles.permissionCard}>
                                    <div style={{ fontSize: '13px', fontWeight: 600, fontFamily: 'Inter, sans-serif', color: 'var(--foreground)', marginBottom: '8px' }}>
                                      {perm.module}
                                    </div>
                                    {!hasAnyPermission ? (
                                      <div style={{ fontSize: '12px', fontFamily: 'Inter, sans-serif', color: 'var(--muted-foreground)', fontStyle: 'italic' }}>
                                        Không có quyền
                                      </div>
                                    ) : (
                                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                        {perm.view && (
                                          <span className={styles.permChip}>
                                            <Check size={12} /> Xem
                                          </span>
                                        )}
                                        {perm.create && (
                                          <span className={styles.permChip}>
                                            <Check size={12} /> Tạo
                                          </span>
                                        )}
                                        {perm.edit && (
                                          <span className={styles.permChip}>
                                            <Check size={12} /> Sửa
                                          </span>
                                        )}
                                        {perm.delete && (
                                          <span className={styles.permChip}>
                                            <Check size={12} /> Xóa
                                          </span>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>

                            <div style={{ marginTop: 'var(--spacing-4, 16px)', paddingTop: 'var(--spacing-4, 16px)', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
                              <button 
                                className={styles.secondaryBtn}
                                onClick={() => onOpenModal('edit', role)}
                              >
                                <Edit size={16} /> Chỉnh sửa vai trò & quyền
                              </button>
                            </div>
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

      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(filteredRoles.length / itemsPerPage)}
        totalItems={filteredRoles.length}
        itemsPerPage={itemsPerPage}
        onPageChange={(page) => {
          setCurrentPage(page);
          setExpandedRoleId(null); // Collapse expanded rows when changing page
        }}
      />
    </div>
  );
};

// TAB 1.4: MA TRẬN QUYỀN (OLD - DEPRECATED, use PermissionsTabNew instead)
const PermissionsTabOld = () => {
  const [selectedModule, setSelectedModule] = useState('report-dashboard');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [searchAction, setSearchAction] = useState('');

  // Module definitions
  const modules = [
    { id: 'report-dashboard', name: 'Report & Dashboard', icon: TrendingUp },
    { id: 'master-data', name: 'Master Data', icon: Database },
    { id: 'templates', name: 'Templates', icon: FileText },
    { id: 'jobs-monitor', name: 'Jobs Monitor', icon: Activity },
    { id: 'audit-log', name: 'Audit Log', icon: History },
  ];

  // Role definitions
  const roles = [
    { id: 'hq-admin', name: 'HQ Admin / Director' },
    { id: 'provincial-admin', name: 'Provincial Admin / Ops' },
    { id: 'analyst', name: 'Analyst / Reporter' },
    { id: 'supervisor', name: 'Supervisor' },
    { id: 'viewer', name: 'Viewer' },
  ];

  // Permission levels
  const permissionLevels = [
    { id: 'full', label: 'Full', icon: Check, color: 'var(--success, #10b981)' },
    { id: 'limited', label: 'Limited', icon: AlertTriangle, color: 'var(--warning, #f59e0b)' },
    { id: 'no-access', label: 'No Access', icon: XCircle, color: 'var(--muted-foreground, #94a3b8)' },
  ];

  // Permissions data structure for each module
  const permissionsData: Record<string, Array<{
    action: string;
    permissions: Record<string, 'full' | 'limited' | 'no-access'>;
  }>> = {
    'report-dashboard': [
      { action: 'View Dashboard Overview', permissions: { 'hq-admin': 'full', 'provincial-admin': 'full', 'analyst': 'full', 'supervisor': 'limited', 'viewer': 'limited' } },
      { action: 'Export Dashboard Data', permissions: { 'hq-admin': 'full', 'provincial-admin': 'full', 'analyst': 'limited', 'supervisor': 'no-access', 'viewer': 'no-access' } },
      { action: 'Create Custom Reports', permissions: { 'hq-admin': 'full', 'provincial-admin': 'full', 'analyst': 'full', 'supervisor': 'no-access', 'viewer': 'no-access' } },
      { action: 'Schedule Reports', permissions: { 'hq-admin': 'full', 'provincial-admin': 'limited', 'analyst': 'limited', 'supervisor': 'no-access', 'viewer': 'no-access' } },
      { action: 'Share Reports', permissions: { 'hq-admin': 'full', 'provincial-admin': 'full', 'analyst': 'limited', 'supervisor': 'limited', 'viewer': 'no-access' } },
      { action: 'Manage Report Templates', permissions: { 'hq-admin': 'full', 'provincial-admin': 'no-access', 'analyst': 'no-access', 'supervisor': 'no-access', 'viewer': 'no-access' } },
    ],
    'master-data': [
      { action: 'View Master Data', permissions: { 'hq-admin': 'full', 'provincial-admin': 'full', 'analyst': 'full', 'supervisor': 'limited', 'viewer': 'limited' } },
      { action: 'Create Master Data', permissions: { 'hq-admin': 'full', 'provincial-admin': 'limited', 'analyst': 'no-access', 'supervisor': 'no-access', 'viewer': 'no-access' } },
      { action: 'Edit Master Data', permissions: { 'hq-admin': 'full', 'provincial-admin': 'limited', 'analyst': 'no-access', 'supervisor': 'no-access', 'viewer': 'no-access' } },
      { action: 'Delete Master Data', permissions: { 'hq-admin': 'full', 'provincial-admin': 'no-access', 'analyst': 'no-access', 'supervisor': 'no-access', 'viewer': 'no-access' } },
      { action: 'Import Bulk Data', permissions: { 'hq-admin': 'full', 'provincial-admin': 'limited', 'analyst': 'no-access', 'supervisor': 'no-access', 'viewer': 'no-access' } },
      { action: 'Export Master Data', permissions: { 'hq-admin': 'full', 'provincial-admin': 'full', 'analyst': 'full', 'supervisor': 'limited', 'viewer': 'no-access' } },
    ],
    'templates': [
      { action: 'View Templates', permissions: { 'hq-admin': 'full', 'provincial-admin': 'full', 'analyst': 'full', 'supervisor': 'full', 'viewer': 'full' } },
      { action: 'Create Templates', permissions: { 'hq-admin': 'full', 'provincial-admin': 'full', 'analyst': 'limited', 'supervisor': 'no-access', 'viewer': 'no-access' } },
      { action: 'Edit Templates', permissions: { 'hq-admin': 'full', 'provincial-admin': 'full', 'analyst': 'limited', 'supervisor': 'no-access', 'viewer': 'no-access' } },
      { action: 'Delete Templates', permissions: { 'hq-admin': 'full', 'provincial-admin': 'limited', 'analyst': 'no-access', 'supervisor': 'no-access', 'viewer': 'no-access' } },
      { action: 'Publish Templates', permissions: { 'hq-admin': 'full', 'provincial-admin': 'no-access', 'analyst': 'no-access', 'supervisor': 'no-access', 'viewer': 'no-access' } },
      { action: 'Archive Templates', permissions: { 'hq-admin': 'full', 'provincial-admin': 'limited', 'analyst': 'no-access', 'supervisor': 'no-access', 'viewer': 'no-access' } },
    ],
    'jobs-monitor': [
      { action: 'View Job Status', permissions: { 'hq-admin': 'full', 'provincial-admin': 'full', 'analyst': 'full', 'supervisor': 'limited', 'viewer': 'limited' } },
      { action: 'Start/Stop Jobs', permissions: { 'hq-admin': 'full', 'provincial-admin': 'limited', 'analyst': 'no-access', 'supervisor': 'no-access', 'viewer': 'no-access' } },
      { action: 'View Job Logs', permissions: { 'hq-admin': 'full', 'provincial-admin': 'full', 'analyst': 'limited', 'supervisor': 'limited', 'viewer': 'no-access' } },
      { action: 'Configure Jobs', permissions: { 'hq-admin': 'full', 'provincial-admin': 'no-access', 'analyst': 'no-access', 'supervisor': 'no-access', 'viewer': 'no-access' } },
      { action: 'Retry Failed Jobs', permissions: { 'hq-admin': 'full', 'provincial-admin': 'limited', 'analyst': 'no-access', 'supervisor': 'no-access', 'viewer': 'no-access' } },
    ],
    'audit-log': [
      { action: 'View Audit Logs', permissions: { 'hq-admin': 'full', 'provincial-admin': 'limited', 'analyst': 'limited', 'supervisor': 'no-access', 'viewer': 'no-access' } },
      { action: 'Export Audit Logs', permissions: { 'hq-admin': 'full', 'provincial-admin': 'no-access', 'analyst': 'no-access', 'supervisor': 'no-access', 'viewer': 'no-access' } },
      { action: 'Search Audit History', permissions: { 'hq-admin': 'full', 'provincial-admin': 'limited', 'analyst': 'limited', 'supervisor': 'no-access', 'viewer': 'no-access' } },
      { action: 'View User Activities', permissions: { 'hq-admin': 'full', 'provincial-admin': 'limited', 'analyst': 'no-access', 'supervisor': 'no-access', 'viewer': 'no-access' } },
      { action: 'Archive Old Logs', permissions: { 'hq-admin': 'full', 'provincial-admin': 'no-access', 'analyst': 'no-access', 'supervisor': 'no-access', 'viewer': 'no-access' } },
    ],
  };

  // Get current module permissions
  const currentPermissions = permissionsData[selectedModule] || [];

  // Filter permissions based on search and filters
  const filteredPermissions = currentPermissions.filter(perm => {
    // Search filter
    if (searchAction && !perm.action.toLowerCase().includes(searchAction.toLowerCase())) {
      return false;
    }

    // Permission level filter
    if (selectedLevels.length > 0) {
      const hasMatchingLevel = Object.values(perm.permissions).some(level => 
        selectedLevels.includes(level)
      );
      if (!hasMatchingLevel) return false;
    }

    return true;
  });

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedRole('all');
    setSelectedLevels([]);
    setSearchAction('');
  };

  // Toggle permission level in multi-select
  const togglePermissionLevel = (levelId: string) => {
    setSelectedLevels(prev => 
      prev.includes(levelId) 
        ? prev.filter(l => l !== levelId)
        : [...prev, levelId]
    );
  };

  // Get permission badge
  const getPermissionBadge = (level: 'full' | 'limited' | 'no-access', roleId: string) => {
    const config = permissionLevels.find(p => p.id === level);
    if (!config) return null;

    const Icon = config.icon;
    const isHighlighted = selectedRole === 'all' || selectedRole === roleId;
    const opacity = isHighlighted ? 1 : 0.4;

    return (
      <div 
        className={styles.permBadge}
        style={{ 
          background: level === 'full' ? 'rgba(16, 185, 129, 0.1)' : 
                      level === 'limited' ? 'rgba(245, 158, 11, 0.1)' : 
                      'rgba(148, 163, 184, 0.1)',
          border: `1px solid ${config.color}`,
          color: config.color,
          opacity,
          fontFamily: 'Inter, sans-serif',
          fontSize: '12px',
          fontWeight: 500,
          padding: '4px 8px',
          borderRadius: 'var(--radius-sm, 4px)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          whiteSpace: 'nowrap',
        }}
        title={level === 'limited' ? 'Giới hạn theo phạm vi địa bàn được gán. Chỉ áp dụng cho dữ liệu thuộc scope. Không bao gồm dữ liệu nhạy cảm.' : undefined}
      >
        <Icon size={12} />
        {config.label}
      </div>
    );
  };

  return (
    <div className={styles.tabContentInner} style={{ display: 'flex', gap: 'var(--spacing-6, 24px)', height: 'calc(100vh - 280px)' }}>
      {/* LEFT SIDEBAR - MODULE LIST */}
      <div style={{ 
        width: '280px', 
        flexShrink: 0,
        borderRight: '1px solid var(--border)',
        paddingRight: 'var(--spacing-6, 24px)',
        overflowY: 'auto',
      }}>
        <div style={{ marginBottom: 'var(--spacing-4, 16px)' }}>
          <h3 style={{ 
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            fontWeight: 600,
            color: 'var(--foreground)',
            marginBottom: 'var(--spacing-3, 12px)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            Modules
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2, 8px)' }}>
          {modules.map(module => {
            const Icon = module.icon;
            const isActive = selectedModule === module.id;
            
            return (
              <button
                key={module.id}
                onClick={() => setSelectedModule(module.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-3, 12px)',
                  padding: 'var(--spacing-3, 12px)',
                  background: isActive ? 'var(--primary, #005cb6)' : 'transparent',
                  color: isActive ? '#ffffff' : 'var(--foreground)',
                  border: `1px solid ${isActive ? 'var(--primary, #005cb6)' : 'var(--border)'}`,
                  borderRadius: 'var(--radius, 6px)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  fontWeight: isActive ? 600 : 400,
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'var(--accent, rgba(0, 92, 182, 0.05))';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <Icon size={18} />
                <span>{module.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* RIGHT MAIN CONTENT */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* FILTER BAR */}
        <div style={{
          background: 'var(--card, #ffffff)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius, 6px)',
          padding: 'var(--spacing-4, 16px)',
          marginBottom: 'var(--spacing-4, 16px)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'var(--spacing-4, 16px)',
          alignItems: 'flex-end',
        }}>
          {/* Filter by Role */}
          <div style={{ flex: '1 1 200px', minWidth: '200px' }}>
            <label style={{ 
              display: 'block',
              fontFamily: 'Inter, sans-serif',
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--foreground)',
              marginBottom: 'var(--spacing-2, 8px)',
            }}>
              Vai trò
            </label>
            <select 
              className={styles.select}
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              style={{ width: '100%' }}
            >
              <option value="all">Tất cả</option>
              {roles.map(role => (
                <option key={role.id} value={role.id}>{role.name}</option>
              ))}
            </select>
          </div>

          {/* Filter by Permission Level */}
          <div style={{ flex: '1 1 250px', minWidth: '250px' }}>
            <label style={{ 
              display: 'block',
              fontFamily: 'Inter, sans-serif',
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--foreground)',
              marginBottom: 'var(--spacing-2, 8px)',
            }}>
              Mức quyền
            </label>
            <div style={{ display: 'flex', gap: 'var(--spacing-2, 8px)', flexWrap: 'wrap' }}>
              {permissionLevels.map(level => (
                <label 
                  key={level.id}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    background: selectedLevels.includes(level.id) ? level.color : 'var(--background)',
                    color: selectedLevels.includes(level.id) ? '#ffffff' : 'var(--foreground)',
                    border: `1px solid ${selectedLevels.includes(level.id) ? level.color : 'var(--border)'}`,
                    borderRadius: 'var(--radius-sm, 4px)',
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '12px',
                    fontWeight: 500,
                    transition: 'all 0.2s',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedLevels.includes(level.id)}
                    onChange={() => togglePermissionLevel(level.id)}
                    style={{ margin: 0 }}
                  />
                  {level.label}
                </label>
              ))}
            </div>
          </div>

          {/* Search by Action */}
          <div style={{ flex: '1 1 250px', minWidth: '250px' }}>
            <label style={{ 
              display: 'block',
              fontFamily: 'Inter, sans-serif',
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--foreground)',
              marginBottom: 'var(--spacing-2, 8px)',
            }}>
              Tìm chức năng
            </label>
            <div className={styles.searchBox} style={{ margin: 0 }}>
              <Search size={16} className={styles.searchIcon} />
              <input 
                type="text" 
                placeholder="Tìm theo chức năng / hành động..." 
                className={styles.searchInput}
                value={searchAction}
                onChange={(e) => setSearchAction(e.target.value)}
                style={{ paddingLeft: '36px' }}
              />
            </div>
          </div>

          {/* Reset Filters */}
          <div>
            <button 
              className={styles.secondaryBtn}
              onClick={handleResetFilters}
              style={{ whiteSpace: 'nowrap' }}
            >
              <RefreshCw size={16} /> Xóa bộ lọc
            </button>
          </div>
        </div>

        {/* PERMISSIONS MATRIX TABLE */}
        <div style={{ flex: 1, overflow: 'auto', border: '1px solid var(--border)', borderRadius: 'var(--radius, 6px)' }}>
          <table className={styles.table} style={{ minWidth: '800px' }}>
            <thead>
              <tr>
                <th style={{ width: '280px', position: 'sticky', left: 0, background: 'var(--card)', zIndex: 2 }}>
                  Chức năng / Hành động
                </th>
                {roles.map(role => (
                  <th 
                    key={role.id}
                    style={{ 
                      minWidth: '140px',
                      background: selectedRole === role.id ? 'rgba(0, 92, 182, 0.05)' : 'var(--card)',
                      fontWeight: selectedRole === role.id ? 700 : 600,
                    }}
                  >
                    {role.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredPermissions.length === 0 ? (
                <tr>
                  <td colSpan={roles.length + 1} style={{ textAlign: 'center', padding: '2rem', fontFamily: 'Inter, sans-serif' }}>
                    Không tìm thấy kết quả phù hợp với bộ lọc
                  </td>
                </tr>
              ) : (
                filteredPermissions.map((perm, idx) => (
                  <tr key={idx}>
                    <td style={{ 
                      fontFamily: 'Inter, sans-serif', 
                      fontWeight: 500,
                      position: 'sticky',
                      left: 0,
                      background: 'var(--card)',
                      zIndex: 1,
                    }}>
                      {perm.action}
                    </td>
                    {roles.map(role => (
                      <td 
                        key={role.id}
                        style={{ 
                          textAlign: 'center',
                          background: selectedRole === role.id ? 'rgba(0, 92, 182, 0.02)' : 'transparent',
                        }}
                      >
                        {getPermissionBadge(perm.permissions[role.id], role.id)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* FOOTER INFO */}
        <div style={{
          marginTop: 'var(--spacing-4, 16px)',
          padding: 'var(--spacing-3, 12px)',
          background: 'var(--muted, rgba(0, 0, 0, 0.03))',
          borderRadius: 'var(--radius-sm, 4px)',
          fontFamily: 'Inter, sans-serif',
          fontSize: '12px',
          color: 'var(--muted-foreground)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-2, 8px)',
        }}>
          <Info size={14} />
          <span>
            <strong>Limited:</strong> Giới hạn theo phạm vi địa bàn được gán. Chỉ áp dụng cho dữ liệu thuộc scope. Không bao gồm dữ liệu nhạy cảm.
          </span>
        </div>
      </div>
    </div>
  );
};

// TAB 1.5: ĐỊA BÀN & PHẠM VI
export const TerritoryTab: React.FC<{
  territories: any[];
  onOpenModal: (type: any, item?: any) => void;
}> = ({ territories, onOpenModal }) => {
  return (
    <div className={styles.tabContentInner}>

      <div className={styles.filterBar}>
        <div className={styles.searchBox}>
          <Search size={18} className={styles.searchIcon} />
          <input type="text" placeholder="Tìm địa bàn..." className={styles.searchInput} />
        </div>
        <select className={styles.select}>
          <option>Tất cả cấp</option>
          <option>Tỉnh/TP</option>
          <option>Quận/Huyện</option>
          <option>Phường/Xã</option>
        </select>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Mã</th>
              <th>Tên địa bàn</th>
              <th>Cấp</th>
              <th>Số người dùng</th>
              <th>Trạng thái</th>
              <th className={styles.actionCol}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {territories.map((territory) => (
              <tr key={territory.id}>
                <td><code className={styles.code}>{territory.code}</code></td>
                <td><strong>{territory.name}</strong></td>
                <td>
                  {territory.level === 'province' && 'Tỉnh/TP'}
                  {territory.level === 'district' && 'Quận/Huyện'}
                  {territory.level === 'ward' && 'Phường/Xã'}
                </td>
                <td>{territory.userCount}</td>
                <td>
                  {territory.status === 'active' ? (
                    <span className={styles.statusActive}><Check size={12} /> Hoạt động</span>
                  ) : (
                    <span className={styles.statusInactive}><XCircle size={12} /> Không hoạt động</span>
                  )}
                </td>
                <td>
                  <div className={styles.actionButtons}>
                    <button className={styles.iconBtn} title="Chỉnh sửa" onClick={() => onOpenModal('edit', territory)}>
                      <Edit size={16} />
                    </button>
                    <button className={styles.iconBtn} title="Xóa" onClick={() => onOpenModal('delete', territory)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination currentPage={1} totalItems={territories.length} itemsPerPage={10} onPageChange={() => {}} />
    </div>
  );
};

// TAB 1.6: ĐƠN VỊ / ĐỘI
export const TeamsTab: React.FC<{
  teams: any[];
  onOpenModal: (type: any, item?: any) => void;
}> = ({ teams, onOpenModal }) => {
  return (
    <div className={styles.tabContentInner}>

      <div className={styles.filterBar}>
        <div className={styles.searchBox}>
          <Search size={18} className={styles.searchIcon} />
          <input type="text" placeholder="Tìm đơn vị..." className={styles.searchInput} />
        </div>
        <select className={styles.select}>
          <option>Tất cả loại</option>
          <option>Phòng ban</option>
          <option>Đội</option>
          <option>Tổ</option>
        </select>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Mã</th>
              <th>Tên đơn vị</th>
              <th>Loại</th>
              <th>Trưởng đơn vị</th>
              <th>Số thành viên</th>
              <th>Trạng thái</th>
              <th className={styles.actionCol}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team) => (
              <tr key={team.id}>
                <td><code className={styles.code}>{team.code}</code></td>
                <td><strong>{team.name}</strong></td>
                <td>
                  {team.type === 'department' && 'Phòng ban'}
                  {team.type === 'team' && 'Đội'}
                  {team.type === 'group' && 'Tổ'}
                </td>
                <td>{team.leader}</td>
                <td>{team.memberCount}</td>
                <td>
                  {team.status === 'active' ? (
                    <span className={styles.statusActive}><Check size={12} /> Hoạt động</span>
                  ) : (
                    <span className={styles.statusInactive}><XCircle size={12} /> Không hoạt động</span>
                  )}
                </td>
                <td>
                  <div className={styles.actionButtons}>
                    <button className={styles.iconBtn} title="Chỉnh sửa" onClick={() => onOpenModal('edit', team)}>
                      <Edit size={16} />
                    </button>
                    <button className={styles.iconBtn} title="Xóa" onClick={() => onOpenModal('delete', team)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination currentPage={1} totalItems={teams.length} itemsPerPage={10} onPageChange={() => {}} />
    </div>
  );
};

// TAB 2.1: DANH MỤC DÙNG CHUNG - Now with Localities sub-menu
export const CommonCategoriesTab = () => {
  return <LocalitiesTab />;
};

// TAB 2.2: CRUD DANH MỤC
export const CategoryManagementTab: React.FC<{
  categories: any[];
  onOpenModal: (type: any, item?: any) => void;
}> = ({ categories, onOpenModal }) => {
  return (
    <div className={styles.tabContentInner}>

      <div className={styles.filterBar}>
        <div className={styles.searchBox}>
          <Search size={18} className={styles.searchIcon} />
          <input type="text" placeholder="Tìm danh mục..." className={styles.searchInput} />
        </div>
        <select className={styles.select}>
          <option>Tất cả trạng thái</option>
          <option>Draft</option>
          <option>Pending</option>
          <option>Approved</option>
          <option>Rejected</option>
        </select>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Mã</th>
              <th>Tên danh mục</th>
              <th>Loại</th>
              <th>Version</th>
              <th>Hiệu lực từ</th>
              <th>Trạng thái</th>
              <th className={styles.actionCol}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id}>
                <td><code className={styles.code}>{cat.code}</code></td>
                <td><strong>{cat.name}</strong></td>
                <td>{cat.type}</td>
                <td>{cat.version}</td>
                <td>{cat.effectiveFrom}</td>
                <td>
                  {cat.status === 'approved' && <span className={styles.statusApproved}>Đã duyệt</span>}
                  {cat.status === 'pending' && <span className={styles.statusPending}>Chờ duyệt</span>}
                  {cat.status === 'draft' && <span className={styles.statusDraft}>Nháp</span>}
                  {cat.status === 'rejected' && <span className={styles.statusRejected}>Từ chối</span>}
                </td>
                <td>
                  <div className={styles.actionButtons}>
                    <button className={styles.iconBtn} title="Xem" onClick={() => onOpenModal('view', cat)}>
                      <Eye size={16} />
                    </button>
                    <button className={styles.iconBtn} title="Sửa" onClick={() => onOpenModal('edit', cat)}>
                      <Edit size={16} />
                    </button>
                    <button className={styles.iconBtn} title="Xóa" onClick={() => onOpenModal('delete', cat)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination currentPage={1} totalItems={categories.length} itemsPerPage={10} onPageChange={() => {}} />
    </div>
  );
};

// TAB 2.3: CẤU HÌNH CHỈ BÁO RỦI RO
export const RiskConfigTab: React.FC<{
  indicators: any[];
  onOpenModal: (type: any, item?: any) => void;
}> = ({ indicators, onOpenModal }) => {
  return (
    <div className={styles.tabContentInner}>

      <div className={styles.filterBar}>
        <div className={styles.searchBox}>
          <Search size={18} className={styles.searchIcon} />
          <input type="text" placeholder="Tìm chỉ báo..." className={styles.searchInput} />
        </div>
        <select className={styles.select}>
          <option>Tất cả mức độ</option>
          <option>Cao</option>
          <option>Trung bình</option>
          <option>Thấp</option>
        </select>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Mã</th>
              <th>Tên chỉ báo</th>
              <th>Mức độ</th>
              <th>Ngưỡng</th>
              <th>Trạng thái</th>
              <th className={styles.actionCol}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {indicators.map((ind) => (
              <tr key={ind.id}>
                <td><code className={styles.code}>{ind.code}</code></td>
                <td><strong>{ind.name}</strong></td>
                <td>
                  {ind.type === 'high' && <span className={styles.riskHigh}>Cao</span>}
                  {ind.type === 'medium' && <span className={styles.riskMedium}>Trung bình</span>}
                  {ind.type === 'low' && <span className={styles.riskLow}>Thấp</span>}
                </td>
                <td>{ind.threshold}</td>
                <td>
                  {ind.status === 'active' ? (
                    <span className={styles.statusActive}><Check size={12} /> Hoạt động</span>
                  ) : (
                    <span className={styles.statusInactive}><XCircle size={12} /> Không hoạt động</span>
                  )}
                </td>
                <td>
                  <div className={styles.actionButtons}>
                    <button className={styles.iconBtn} title="Sửa" onClick={() => onOpenModal('edit', ind)}>
                      <Edit size={16} />
                    </button>
                    <button className={styles.iconBtn} title="Xóa" onClick={() => onOpenModal('delete', ind)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination currentPage={1} totalItems={indicators.length} itemsPerPage={10} onPageChange={() => {}} />
    </div>
  );
};

// TAB 2.4: CHECKLIST
export const ChecklistTab: React.FC<{
  checklists: any[];
  onOpenModal: (type: any, item?: any) => void;
}> = ({ checklists, onOpenModal }) => {
  return (
    <div className={styles.tabContentInner}>

      <div className={styles.filterBar}>
        <div className={styles.searchBox}>
          <Search size={18} className={styles.searchIcon} />
          <input type="text" placeholder="Tìm checklist..." className={styles.searchInput} />
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Mã</th>
              <th>Tên checklist</th>
              <th>Chuyên đề</th>
              <th>Số mục</th>
              <th>Trạng thái</th>
              <th className={styles.actionCol}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {checklists.map((list) => (
              <tr key={list.id}>
                <td><code className={styles.code}>{list.code}</code></td>
                <td><strong>{list.name}</strong></td>
                <td>{list.topic}</td>
                <td>{list.itemCount}</td>
                <td>
                  {list.status === 'active' ? (
                    <span className={styles.statusActive}><Check size={12} /> Hoạt động</span>
                  ) : (
                    <span className={styles.statusInactive}><XCircle size={12} /> Không hoạt động</span>
                  )}
                </td>
                <td>
                  <div className={styles.actionButtons}>
                    <button className={styles.iconBtn} title="Sửa" onClick={() => onOpenModal('edit', list)}>
                      <Edit size={16} />
                    </button>
                    <button className={styles.iconBtn} title="Xóa" onClick={() => onOpenModal('delete', list)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination currentPage={1} totalItems={checklists.length} itemsPerPage={10} onPageChange={() => {}} />
    </div>
  );
};

// TAB 2.5: QUY TẮC THÔNG BÁO
export const NotificationRulesTab: React.FC<{
  rules: any[];
  onOpenModal: (type: any, item?: any) => void;
}> = ({ rules, onOpenModal }) => {
  return (
    <div className={styles.tabContentInner}>

      <div className={styles.filterBar}>
        <div className={styles.searchBox}>
          <Search size={18} className={styles.searchIcon} />
          <input type="text" placeholder="Tìm quy tắc..." className={styles.searchInput} />
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Tên quy tắc</th>
              <th>Sự kiện</th>
              <th>Điều kiện</th>
              <th>Người nhận</th>
              <th>Trạng thái</th>
              <th className={styles.actionCol}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {rules.map((rule) => (
              <tr key={rule.id}>
                <td><strong>{rule.name}</strong></td>
                <td>{rule.event}</td>
                <td>{rule.condition}</td>
                <td>{rule.recipients}</td>
                <td>
                  {rule.status === 'active' ? (
                    <span className={styles.statusActive}><Check size={12} /> Hoạt động</span>
                  ) : (
                    <span className={styles.statusInactive}><XCircle size={12} /> Không hoạt động</span>
                  )}
                </td>
                <td>
                  <div className={styles.actionButtons}>
                    <button className={styles.iconBtn} title="Sửa" onClick={() => onOpenModal('edit', rule)}>
                      <Edit size={16} />
                    </button>
                    <button className={styles.iconBtn} title="Xóa" onClick={() => onOpenModal('delete', rule)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination currentPage={1} totalItems={rules.length} itemsPerPage={10} onPageChange={() => {}} />
    </div>
  );
};

// Audit Tabs - Placeholders
export const ExportCenterTab = () => (
  <div className={styles.tabContentInner}>
    <div className={styles.placeholder}>Trung tâm xuất dữ liệu - Component đang phát triển</div>
  </div>
);

export const SystemLogsTab = () => (
  <div className={styles.tabContentInner}>
    <div className={styles.placeholder}>Nhật ký hệ thống - Component đang phát triển</div>
  </div>
);

export const DataChangesTab = () => (
  <div className={styles.tabContentInner}>
    <div className={styles.placeholder}>Biến động dữ liệu - Component đang phát triển</div>
  </div>
);

export const ExportLogsTab = () => (
  <div className={styles.tabContentInner}>
    <div className={styles.placeholder}>Nhật ký tải / xuất - Component đang phát triển</div>
  </div>
);

export const SecurityConfigTab = () => (
  <div className={styles.tabContentInner}>
    <div className={styles.placeholder}>Cấu hình bảo mật - Component đang phát triển</div>
  </div>
);

export const IntegrationStatusTab = () => (
  <div className={styles.tabContentInner}>
    <div className={styles.placeholder}>Trạng thái tích hợp - Component đang phát triển</div>
  </div>
);

export const SystemMonitoringTab = () => (
  <div className={styles.tabContentInner}>
    <div className={styles.placeholder}>Giám sát hệ thống - Component đang phát triển</div>
  </div>
);

export const SystemStatusTab = () => (
  <div className={styles.tabContentInner}>
    <div className={styles.placeholder}>Trạng thái hệ thống - Component đang phát triển</div>
  </div>
);