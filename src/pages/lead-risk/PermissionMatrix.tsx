import { useState } from 'react';
import { Shield, Save, RotateCcw, Download, Search, Info, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from './PermissionMatrix.module.css';

type PermissionValue = 'granted' | 'denied' | 'conditional';

interface Permission {
  action: string;
  description: string;
  cục: PermissionValue;
  chiCục: PermissionValue;
  analyst: PermissionValue;
  đội: PermissionValue;
  viewer: PermissionValue;
  notes?: string;
}

const initialPermissions: Permission[] = [
  {
    action: 'Xem Inbox/List',
    description: 'Xem danh sách lead trong phạm vi quản lý',
    cục: 'granted',
    chiCục: 'granted',
    analyst: 'granted',
    đội: 'granted',
    viewer: 'granted',
    notes: 'Mỗi role chỉ thấy lead trong scope của mình'
  },
  {
    action: 'Tạo Lead',
    description: 'Tạo nguồn tin mới trong hệ thống',
    cục: 'granted',
    chiCục: 'granted',
    analyst: 'granted',
    đội: 'granted',
    viewer: 'denied',
    notes: 'Viewer chỉ xem, không nhập dữ liệu'
  },
  {
    action: 'Triage Decision',
    description: 'Phân loại và đánh giá mức độ ưu tiên',
    cục: 'granted',
    chiCục: 'granted',
    analyst: 'granted',
    đội: 'conditional',
    viewer: 'denied',
    notes: 'Đội chỉ triage lead do mình tạo hoặc được giao'
  },
  {
    action: 'Assign/Reassign',
    description: 'Phân công hoặc chuyển giao lead',
    cục: 'granted',
    chiCục: 'granted',
    analyst: 'granted',
    đội: 'conditional',
    viewer: 'denied',
    notes: 'Đội chỉ assign nội bộ, không giao ra ngoài đơn vị'
  },
  {
    action: 'Escalation',
    description: 'Báo cáo lên cấp trên',
    cục: 'granted',
    chiCục: 'granted',
    analyst: 'granted',
    đội: 'granted',
    viewer: 'denied',
    notes: 'Escalate chỉ đi lên, không chuyển ngang vượt cấp'
  },
  {
    action: 'Close Lead',
    description: 'Đóng và hoàn thành lead',
    cục: 'granted',
    chiCục: 'granted',
    analyst: 'granted',
    đội: 'conditional',
    viewer: 'denied',
    notes: 'Đội close → chờ duyệt; Analyst duyệt → closed thật'
  },
  {
    action: 'Xem Risk Dashboard',
    description: 'Truy cập dashboard phân tích rủi ro',
    cục: 'granted',
    chiCục: 'granted',
    analyst: 'granted',
    đội: 'granted',
    viewer: 'granted',
    notes: 'Viewer chỉ thấy tổng hợp, không drill-down chi tiết'
  },
  {
    action: 'Quản lý Watchlist',
    description: 'Tạo và quản lý danh sách theo dõi',
    cục: 'granted',
    chiCục: 'conditional',
    analyst: 'denied',
    đội: 'denied',
    viewer: 'denied',
    notes: 'Chi cục chỉ quản lý watchlist trong phạm vi tỉnh'
  },
  {
    action: 'Quản lý Alert Rules',
    description: 'Cấu hình quy tắc cảnh báo tự động',
    cục: 'granted',
    chiCục: 'conditional',
    analyst: 'denied',
    đội: 'denied',
    viewer: 'denied',
    notes: 'Chi cục chỉ quản lý rule trong phạm vi địa bàn'
  },
  {
    action: 'Export Lead List',
    description: 'Xuất dữ liệu lead ra file',
    cục: 'granted',
    chiCục: 'granted',
    analyst: 'conditional',
    đội: 'conditional',
    viewer: 'denied',
    notes: 'Analyst/Đội chỉ export dữ liệu mình phụ trách, có watermark/log'
  },
  {
    action: 'Xem Audit Trail',
    description: 'Xem lịch sử thay đổi và hành động',
    cục: 'granted',
    chiCục: 'granted',
    analyst: 'granted',
    đội: 'conditional',
    viewer: 'denied',
    notes: 'Đội chỉ xem audit trail của lead mình xử lý'
  },
  {
    action: 'Quản lý User/Role',
    description: 'Tạo và quản lý người dùng, vai trò',
    cục: 'granted',
    chiCục: 'conditional',
    analyst: 'denied',
    đội: 'denied',
    viewer: 'denied',
    notes: 'Chi cục chỉ quản lý user trong đơn vị mình'
  },
];

const roles = [
  { key: 'cục', label: 'Cục', description: 'Quản trị / Cấp trung ương' },
  { key: 'chiCục', label: 'Chi cục', description: 'Cấp tỉnh / Vùng' },
  { key: 'analyst', label: 'Analyst', description: 'Phân tích - Duyệt' },
  { key: 'đội', label: 'Đội', description: 'Người xử lý thực địa' },
  { key: 'viewer', label: 'Viewer', description: 'Chỉ xem' },
];

export default function PermissionMatrix() {
  const navigate = useNavigate();
  const [permissions, setPermissions] = useState<Permission[]>(initialPermissions);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [hasChanges, setHasChanges] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{ row: number; role: string } | null>(null);

  // Filter permissions based on search
  const filteredPermissions = permissions.filter((perm) =>
    perm.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    perm.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePermissionChange = (index: number, role: keyof Permission, value: PermissionValue) => {
    const newPermissions = [...permissions];
    newPermissions[index] = { ...newPermissions[index], [role]: value };
    setPermissions(newPermissions);
    setHasChanges(true);
  };

  const handleSave = () => {
    // TODO: Save to backend
    console.log('Saving permissions:', permissions);
    setHasChanges(false);
    alert('Đã lưu ma trận phân quyền thành công!');
  };

  const handleReset = () => {
    if (confirm('Bạn có chắc muốn khôi phục về cài đặt mặc định?')) {
      setPermissions(initialPermissions);
      setHasChanges(false);
    }
  };

  const handleExport = () => {
    // TODO: Export to CSV/Excel
    console.log('Exporting permission matrix');
    alert('Đang xuất file ma trận phân quyền...');
  };

  const getPermissionSymbol = (value: PermissionValue) => {
    switch (value) {
      case 'granted':
        return '✓';
      case 'denied':
        return '✗';
      case 'conditional':
        return '~';
      default:
        return '-';
    }
  };

  const getPermissionClass = (value: PermissionValue) => {
    switch (value) {
      case 'granted':
        return styles.permissionGranted;
      case 'denied':
        return styles.permissionDenied;
      case 'conditional':
        return styles.permissionConditional;
      default:
        return '';
    }
  };

  const cyclePermission = (current: PermissionValue): PermissionValue => {
    switch (current) {
      case 'granted':
        return 'conditional';
      case 'conditional':
        return 'denied';
      case 'denied':
        return 'granted';
      default:
        return 'granted';
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <button 
            className={styles.backButton}
            onClick={() => navigate('/lead-risk/inbox')}
          >
            <ChevronLeft size={16} />
            Quay lại
          </button>
          <div className={styles.titleGroup}>
            <div className={styles.titleRow}>
              <Shield size={24} className={styles.titleIcon} />
              <h1 className={styles.title}>Ma trận phân quyền</h1>
            </div>
            <p className={styles.subtitle}>
              Quản lý quyền hạn theo vai trò trong hệ thống Lead & Risk Management
            </p>
          </div>
        </div>
        <div className={styles.headerActions}>
          {hasChanges && (
            <button className={styles.resetButton} onClick={handleReset}>
              <RotateCcw size={16} />
              Khôi phục
            </button>
          )}
          <button className={styles.exportButton} onClick={handleExport}>
            <Download size={16} />
            Xuất file
          </button>
          <button 
            className={styles.saveButton} 
            onClick={handleSave}
            disabled={!hasChanges}
          >
            <Save size={16} />
            Lưu thay đổi
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className={styles.legend}>
        <div className={styles.legendTitle}>
          <Info size={16} />
          <span>Ký hiệu:</span>
        </div>
        <div className={styles.legendItems}>
          <div className={styles.legendItem}>
            <span className={`${styles.legendSymbol} ${styles.permissionGranted}`}>✓</span>
            <span className={styles.legendLabel}>Được phép</span>
          </div>
          <div className={styles.legendItem}>
            <span className={`${styles.legendSymbol} ${styles.permissionDenied}`}>✗</span>
            <span className={styles.legendLabel}>Không được phép</span>
          </div>
          <div className={styles.legendItem}>
            <span className={`${styles.legendSymbol} ${styles.permissionConditional}`}>~</span>
            <span className={styles.legendLabel}>Có điều kiện (tuỳ)</span>
          </div>
        </div>
        <div className={styles.legendNote}>
          <Info size={14} />
          <span>Click vào ô để thay đổi quyền</span>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filterRow}>
        <div className={styles.searchBox}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Tìm kiếm hành động..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className={styles.roleFilter}
        >
          <option value="all">Tất cả vai trò</option>
          {roles.map((role) => (
            <option key={role.key} value={role.key}>
              {role.label}
            </option>
          ))}
        </select>

        <div className={styles.resultCount}>
          {filteredPermissions.length} hành động
        </div>
      </div>

      {/* Permission Matrix Table */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.actionColumn}>
                <div className={styles.columnHeader}>
                  <span>Hành động</span>
                </div>
              </th>
              {roles.map((role) => (
                <th 
                  key={role.key} 
                  className={`${styles.roleColumn} ${selectedRole === role.key ? styles.roleColumnActive : ''}`}
                >
                  <div className={styles.columnHeader}>
                    <div className={styles.roleName}>{role.label}</div>
                    <div className={styles.roleDescription}>{role.description}</div>
                  </div>
                </th>
              ))}
              <th className={styles.notesColumn}>Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            {filteredPermissions.map((permission, index) => (
              <tr key={index}>
                <td className={styles.actionCell}>
                  <div className={styles.actionName}>{permission.action}</div>
                  <div className={styles.actionDescription}>{permission.description}</div>
                </td>
                {roles.map((role) => {
                  const value = permission[role.key as keyof Permission] as PermissionValue;
                  const isSelected = selectedCell?.row === index && selectedCell?.role === role.key;
                  
                  return (
                    <td
                      key={role.key}
                      className={`${styles.permissionCell} ${getPermissionClass(value)} ${
                        isSelected ? styles.permissionCellSelected : ''
                      } ${selectedRole === role.key ? styles.permissionCellHighlight : ''}`}
                      onClick={() => {
                        handlePermissionChange(index, role.key as keyof Permission, cyclePermission(value));
                        setSelectedCell({ row: index, role: role.key });
                      }}
                    >
                      <div className={styles.permissionSymbol}>
                        {getPermissionSymbol(value)}
                      </div>
                    </td>
                  );
                })}
                <td className={styles.notesCell}>
                  {permission.notes && (
                    <div className={styles.notesContent}>
                      <Info size={14} className={styles.notesIcon} />
                      <span>{permission.notes}</span>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Info Cards */}
      <div className={styles.infoGrid}>
        <div className={styles.infoCard}>
          <div className={styles.infoCardHeader}>
            <Shield size={18} />
            <h3>Vai trò (Role)</h3>
          </div>
          <p className={styles.infoCardText}>
            Role ≠ chức danh, mà là <strong>quyền trong hệ thống</strong>. 
            Một người có thể có nhiều role tùy theo phạm vi công việc.
          </p>
        </div>

        <div className={styles.infoCard}>
          <div className={styles.infoCardHeader}>
            <Info size={18} />
            <h3>Scope (Phạm vi)</h3>
          </div>
          <p className={styles.infoCardText}>
            Quyền luôn đi kèm với <strong>scope</strong>: địa bàn, chuyên đề, đơn vị. 
            Ví dụ: Chi cục chỉ xem lead trong tỉnh mình quản lý.
          </p>
        </div>

        <div className={styles.infoCard}>
          <div className={styles.infoCardHeader}>
            <Info size={18} />
            <h3>Điều kiện (Conditional)</h3>
          </div>
          <p className={styles.infoCardText}>
            Ký hiệu <strong>(~)</strong> = có điều kiện phụ. 
            Ví dụ: Đội chỉ assign lead nội bộ, không giao ra ngoài đơn vị.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <div className={styles.footerNote}>
          <Info size={16} />
          <span>
            Ma trận này áp dụng cho cả Backend API (bảo mật) và Frontend UI (trải nghiệm người dùng).
            Mọi thay đổi cần được kiểm tra kỹ trước khi triển khai.
          </span>
        </div>
      </div>
    </div>
  );
}
