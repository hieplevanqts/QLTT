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
} from 'lucide-react';
import styles from './AdminPage.module.css';

// Pagination Component
const Pagination: React.FC<{
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}> = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className={styles.pagination}>
      <div className={styles.paginationInfo}>
        Hiển thị {startItem}-{endItem} trong tổng số {totalItems} bản ghi
      </div>
      <div className={styles.paginationButtons}>
        <button
          className={styles.paginationBtn}
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Trước
        </button>
        <button className={`${styles.paginationBtn} ${styles.active}`}>{currentPage}</button>
        <button
          className={styles.paginationBtn}
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Sau
        </button>
      </div>
    </div>
  );
};

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
      <div className={styles.sectionHeader}>
        <div>
          <h2 className={styles.sectionTitle}>Quản lý người dùng</h2>
          <p className={styles.sectionDesc}>CRUD người dùng, gán vai trò, đơn vị, địa bàn, khóa/mở khóa tài khoản</p>
        </div>
        <div className={styles.actions}>
          <button className={styles.secondaryBtn}>
            <Upload size={16} /> Import
          </button>
          <button className={styles.primaryBtn} onClick={() => onOpenModal('add')}>
            <Plus size={16} /> Thêm người dùng
          </button>
        </div>
      </div>

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
    { module: 'Cơ sở quản lý', view: true, create: true, edit: true, delete: false },
    { module: 'Nhiệm vụ', view: true, create: true, edit: true, delete: true },
    { module: 'Kiểm tra', view: true, create: false, edit: false, delete: false },
    { module: 'Báo cáo', view: true, create: false, edit: false, delete: false },
    { module: 'Quản trị hệ thống', view: selectedUser.role === 'Quản trị hệ thống', create: selectedUser.role === 'Quản trị hệ thống', edit: selectedUser.role === 'Quản trị hệ thống', delete: selectedUser.role === 'Quản trị hệ thống' },
  ];

  return (
    <div className={styles.tabContentInner}>
      <div className={styles.sectionHeader}>
        <div>
          <h2 className={styles.sectionTitle}>Chi tiết người dùng</h2>
          <p className={styles.sectionDesc}>Xem thông tin, vai trò, quyền, phạm vi và lịch sử thao tác</p>
        </div>
        <button className={styles.primaryBtn} onClick={() => onOpenModal('edit', selectedUser)}>
          <Edit size={16} /> Chỉnh sửa
        </button>
      </div>

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

// TAB 1.3: QUẢN LÝ VAI TRÒ
export const RolesTab: React.FC<{
  roles: any[];
  onOpenModal: (type: any, item?: any) => void;
}> = ({ roles, onOpenModal }) => {
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedRoleId, setExpandedRoleId] = useState<string | null>(null);

  // Mock permissions data for each role
  const getRolePermissions = (roleCode: string) => {
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
    switch (roleCode) {
      case 'ADMIN':
        return basePermissions.map(p => ({ ...p, view: true, create: true, edit: true, delete: true }));
      case 'MANAGER':
        return basePermissions.map((p, i) => 
          i <= 5 ? { ...p, view: true, create: i >= 2, edit: i >= 2, delete: false } : p
        );
      case 'OFFICER':
        return basePermissions.map((p, i) => 
          i <= 4 ? { ...p, view: true, create: i >= 2 && i <= 3, edit: i >= 2 && i <= 3, delete: false } : p
        );
      case 'CITIZEN':
        return basePermissions.map((p, i) => 
          i <= 1 ? { ...p, view: true } : p
        );
      default:
        return basePermissions;
    }
  };

  // Filter logic
  const filteredRoles = roles.filter(role => {
    const matchesSearch = searchText === '' ||
      role.name.toLowerCase().includes(searchText.toLowerCase()) ||
      role.code.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || role.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className={styles.tabContentInner}>
      <div className={styles.sectionHeader}>
        <div>
          <h2 className={styles.sectionTitle}>Quản lý vai trò</h2>
          <p className={styles.sectionDesc}>CRUD vai trò, gán quyền cho vai trò, bật/tắt trạng thái</p>
        </div>
        <button className={styles.primaryBtn} onClick={() => onOpenModal('add')}>
          <Plus size={16} /> Thêm vai trò
        </button>
      </div>

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
            {filteredRoles.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>
                  Không tìm thấy kết quả
                </td>
              </tr>
            ) : (
              filteredRoles.map((role) => {
                const isExpanded = expandedRoleId === role.id;
                const permissions = getRolePermissions(role.code);
                
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

      <Pagination currentPage={1} totalItems={filteredRoles.length} itemsPerPage={10} onPageChange={() => {}} />
    </div>
  );
};

// Continue with remaining tabs...
// (keeping rest of the file the same)
