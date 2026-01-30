import React, { useState } from 'react';
import { 
  Shield,
  Lock,
  Unlock,
  Eye,
  Download,
  Upload,
  Edit,
  Trash2,
  User,
  Users,
  Clock,
  Calendar,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  HardDrive,
  Server,
  Database,
  TrendingUp,
  TrendingDown,
  Minus,
  Zap,
  RefreshCw,
  Settings,
  FileText,
  Image as ImageIcon,
  Video,
  File,
  AlertCircle,
  Info,
  CheckSquare,
  Square,
  Wifi,
  WifiOff,
  CloudOff,
  Loader2,
  Ban,
  Inbox,
  PackageOpen,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import styles from './EvidenceAdminSystem.module.css';

interface Role {
  id: string;
  name: string;
  permissions: {
    view: boolean;
    download: boolean;
    upload: boolean;
    edit: boolean;
    delete: boolean;
    approve: boolean;
    export: boolean;
    admin: boolean;
  };
}

interface AuditLogEntry {
  id: number;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  result: 'success' | 'failed';
  ipAddress: string;
  details: string;
}

export default function EvidenceAdminSystem() {
  const [selectedRole, setSelectedRole] = useState('viewer');
  const [auditFilter, setAuditFilter] = useState('all');

  // Mock roles data
  const roles: Role[] = [
    {
      id: 'viewer',
      name: 'Người xem',
      permissions: {
        view: true,
        download: false,
        upload: false,
        edit: false,
        delete: false,
        approve: false,
        export: false,
        admin: false
      }
    },
    {
      id: 'inspector',
      name: 'Thanh tra viên',
      permissions: {
        view: true,
        download: true,
        upload: true,
        edit: false,
        delete: false,
        approve: false,
        export: false,
        admin: false
      }
    },
    {
      id: 'reviewer',
      name: 'Người duyệt',
      permissions: {
        view: true,
        download: true,
        upload: true,
        edit: true,
        delete: false,
        approve: true,
        export: true,
        admin: false
      }
    },
    {
      id: 'admin',
      name: 'Quản trị viên',
      permissions: {
        view: true,
        download: true,
        upload: true,
        edit: true,
        delete: true,
        approve: true,
        export: true,
        admin: true
      }
    }
  ];

  // Mock audit log data
  const auditLogs: AuditLogEntry[] = [
    {
      id: 1,
      timestamp: '2026-01-08 14:30:15',
      user: 'Nguyễn Văn A',
      action: 'Xem minh chứng',
      resource: 'EV-2026-100',
      result: 'success',
      ipAddress: '192.168.1.100',
      details: 'Xem chi tiết minh chứng building_violation_01.jpg'
    },
    {
      id: 2,
      timestamp: '2026-01-08 14:25:08',
      user: 'Trần Thị B',
      action: 'Tải xuống',
      resource: 'EV-2026-101',
      result: 'success',
      ipAddress: '192.168.1.101',
      details: 'Tải xuống video inspection_video_01.mp4'
    },
    {
      id: 3,
      timestamp: '2026-01-08 14:20:45',
      user: 'Lê Văn C',
      action: 'Xuất gói',
      resource: 'PACK-2026-001',
      result: 'success',
      ipAddress: '192.168.1.102',
      details: 'Xuất gói minh chứng với 15 file'
    },
    {
      id: 4,
      timestamp: '2026-01-08 14:15:30',
      user: 'Phạm Thị D',
      action: 'Duyệt',
      resource: 'EV-2026-102',
      result: 'success',
      ipAddress: '192.168.1.103',
      details: 'Duyệt minh chứng document_scan_01.pdf'
    },
    {
      id: 5,
      timestamp: '2026-01-08 14:10:22',
      user: 'Hoàng Văn E',
      action: 'Xóa',
      resource: 'EV-2026-099',
      result: 'failed',
      ipAddress: '192.168.1.104',
      details: 'Không có quyền xóa minh chứng'
    }
  ];

  // Mock storage data
  const storageStats = {
    total: 1000,
    used: 652,
    available: 348,
    byType: {
      images: 380,
      videos: 220,
      documents: 52
    },
    health: 'good',
    syncStatus: 'synced',
    lastBackup: '2026-01-08 03:00:00'
  };

  const handlePermissionToggle = (roleId: string, permission: string) => {
    toast.success(`Đã cập nhật quyền "${permission}" cho vai trò ${roles.find(r => r.id === roleId)?.name}`);
  };

  const handleRefreshStorage = () => {
    toast.success('Đang làm mới thông tin lưu trữ...');
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'Xem minh chứng':
        return <Eye className={styles.actionIcon} />;
      case 'Tải xuống':
        return <Download className={styles.actionIcon} />;
      case 'Xuất gói':
        return <Upload className={styles.actionIcon} />;
      case 'Duyệt':
        return <CheckCircle className={styles.actionIcon} />;
      case 'Xóa':
        return <Trash2 className={styles.actionIcon} />;
      default:
        return <Activity className={styles.actionIcon} />;
    }
  };

  return (
    <div className={styles.container}>
      <Tabs defaultValue="access-policy" className={styles.subTabs}>
        {/* Sub Tabs */}
        <TabsList className={styles.subTabsList}>
          <TabsTrigger value="access-policy" className={styles.subTabsTrigger}>
            <Shield className={styles.subTabIcon} />
            Chính sách Truy cập
          </TabsTrigger>
          <TabsTrigger value="audit-log" className={styles.subTabsTrigger}>
            <FileText className={styles.subTabIcon} />
            Nhật ký Kiểm toán
          </TabsTrigger>
          <TabsTrigger value="storage-health" className={styles.subTabsTrigger}>
            <Database className={styles.subTabIcon} />
            Sức khỏe Lưu trữ
          </TabsTrigger>
          <TabsTrigger value="system-states" className={styles.subTabsTrigger}>
            <Activity className={styles.subTabIcon} />
            Trạng thái Hệ thống
          </TabsTrigger>
        </TabsList>

        {/* WEB-05-17: Access Policy */}
        <TabsContent value="access-policy" className={styles.subTabContent}>
          <div className={styles.policyContainer}>
            {/* Header */}
            <div className={styles.pageHeader}>
              <div className={styles.headerLeft}>
                <h2 className={styles.pageTitle}>Chính sách truy cập</h2>
                <p className={styles.pageDescription}>
                  Quản lý ma trận phân quyền và chính sách bảo mật
                </p>
              </div>
              <div className={styles.headerRight}>
                <Button variant="outline" size="sm">
                  <Settings className={styles.buttonIcon} />
                  Cấu hình
                </Button>
                <Button size="sm">
                  <Plus className={styles.buttonIcon} />
                  Thêm vai trò
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}>
                  <Users />
                </div>
                <div className={styles.statContent}>
                  <div className={styles.statValue}>4</div>
                  <div className={styles.statLabel}>Vai trò</div>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                  <User />
                </div>
                <div className={styles.statContent}>
                  <div className={styles.statValue}>156</div>
                  <div className={styles.statLabel}>Người dùng</div>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
                  <Shield />
                </div>
                <div className={styles.statContent}>
                  <div className={styles.statValue}>8</div>
                  <div className={styles.statLabel}>Quyền hạn</div>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}>
                  <Lock />
                </div>
                <div className={styles.statContent}>
                  <div className={styles.statValue}>3</div>
                  <div className={styles.statLabel}>Vi phạm hôm nay</div>
                </div>
              </div>
            </div>

            {/* Permission Matrix */}
            <div className={styles.matrixContainer}>
              <div className={styles.matrixHeader}>
                <h3 className={styles.matrixTitle}>Ma trận phân quyền</h3>
                <div className={styles.matrixLegend}>
                  <span className={styles.legendItem}>
                    <CheckCircle className={styles.legendIcon} style={{ color: '#10b981' }} />
                    Có quyền
                  </span>
                  <span className={styles.legendItem}>
                    <XCircle className={styles.legendIcon} style={{ color: '#ef4444' }} />
                    Không có quyền
                  </span>
                </div>
              </div>

              <div className={styles.matrixTable}>
                <div className={styles.matrixTableHeader}>
                  <div className={styles.matrixHeaderCell}>Vai trò</div>
                  <div className={styles.matrixHeaderCell}>Xem</div>
                  <div className={styles.matrixHeaderCell}>Tải xuống</div>
                  <div className={styles.matrixHeaderCell}>Tải lên</div>
                  <div className={styles.matrixHeaderCell}>Chỉnh sửa</div>
                  <div className={styles.matrixHeaderCell}>Xóa</div>
                  <div className={styles.matrixHeaderCell}>Duyệt</div>
                  <div className={styles.matrixHeaderCell}>Xuất gói</div>
                  <div className={styles.matrixHeaderCell}>Quản trị</div>
                </div>

                {roles.map(role => (
                  <div key={role.id} className={styles.matrixRow}>
                    <div className={styles.matrixRoleCell}>
                      <div className={styles.roleInfo}>
                        <span className={styles.roleName}>{role.name}</span>
                        <span className={styles.roleId}>{role.id}</span>
                      </div>
                    </div>
                    <div className={styles.matrixPermCell}>
                      <button 
                        className={`${styles.permButton} ${role.permissions.view ? styles.permGranted : styles.permDenied}`}
                        onClick={() => handlePermissionToggle(role.id, 'view')}
                      >
                        {role.permissions.view ? <CheckCircle /> : <XCircle />}
                      </button>
                    </div>
                    <div className={styles.matrixPermCell}>
                      <button 
                        className={`${styles.permButton} ${role.permissions.download ? styles.permGranted : styles.permDenied}`}
                        onClick={() => handlePermissionToggle(role.id, 'download')}
                      >
                        {role.permissions.download ? <CheckCircle /> : <XCircle />}
                      </button>
                    </div>
                    <div className={styles.matrixPermCell}>
                      <button 
                        className={`${styles.permButton} ${role.permissions.upload ? styles.permGranted : styles.permDenied}`}
                        onClick={() => handlePermissionToggle(role.id, 'upload')}
                      >
                        {role.permissions.upload ? <CheckCircle /> : <XCircle />}
                      </button>
                    </div>
                    <div className={styles.matrixPermCell}>
                      <button 
                        className={`${styles.permButton} ${role.permissions.edit ? styles.permGranted : styles.permDenied}`}
                        onClick={() => handlePermissionToggle(role.id, 'edit')}
                      >
                        {role.permissions.edit ? <CheckCircle /> : <XCircle />}
                      </button>
                    </div>
                    <div className={styles.matrixPermCell}>
                      <button 
                        className={`${styles.permButton} ${role.permissions.delete ? styles.permGranted : styles.permDenied}`}
                        onClick={() => handlePermissionToggle(role.id, 'delete')}
                      >
                        {role.permissions.delete ? <CheckCircle /> : <XCircle />}
                      </button>
                    </div>
                    <div className={styles.matrixPermCell}>
                      <button 
                        className={`${styles.permButton} ${role.permissions.approve ? styles.permGranted : styles.permDenied}`}
                        onClick={() => handlePermissionToggle(role.id, 'approve')}
                      >
                        {role.permissions.approve ? <CheckCircle /> : <XCircle />}
                      </button>
                    </div>
                    <div className={styles.matrixPermCell}>
                      <button 
                        className={`${styles.permButton} ${role.permissions.export ? styles.permGranted : styles.permDenied}`}
                        onClick={() => handlePermissionToggle(role.id, 'export')}
                      >
                        {role.permissions.export ? <CheckCircle /> : <XCircle />}
                      </button>
                    </div>
                    <div className={styles.matrixPermCell}>
                      <button 
                        className={`${styles.permButton} ${role.permissions.admin ? styles.permGranted : styles.permDenied}`}
                        onClick={() => handlePermissionToggle(role.id, 'admin')}
                      >
                        {role.permissions.admin ? <CheckCircle /> : <XCircle />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* WEB-05-18: Audit Log */}
        <TabsContent value="audit-log" className={styles.subTabContent}>
          <div className={styles.auditContainer}>
            {/* Header */}
            <div className={styles.pageHeader}>
              <div className={styles.headerLeft}>
                <h2 className={styles.pageTitle}>Nhật ký truy vết</h2>
                <p className={styles.pageDescription}>
                  Theo dõi toàn bộ hoạt động của người dùng
                </p>
              </div>
              <div className={styles.headerRight}>
                <Button variant="outline" size="sm">
                  <Download className={styles.buttonIcon} />
                  Xuất báo cáo
                </Button>
              </div>
            </div>

            {/* Filter Bar */}
            <div className={styles.filterBar}>
              <div className={styles.searchBox}>
                <Search className={styles.searchIcon} />
                <Input 
                  placeholder="Tìm kiếm người dùng, hành động..."
                  className={styles.searchInput}
                />
              </div>
              <Select value={auditFilter} onValueChange={setAuditFilter}>
                <SelectTrigger className={styles.filterSelect}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả hành động</SelectItem>
                  <SelectItem value="view">Xem</SelectItem>
                  <SelectItem value="download">Tải xuống</SelectItem>
                  <SelectItem value="upload">Tải lên</SelectItem>
                  <SelectItem value="export">Xuất gói</SelectItem>
                  <SelectItem value="approve">Duyệt</SelectItem>
                  <SelectItem value="delete">Xóa</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="today">
                <SelectTrigger className={styles.filterSelect}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Hôm nay</SelectItem>
                  <SelectItem value="week">7 ngày qua</SelectItem>
                  <SelectItem value="month">30 ngày qua</SelectItem>
                  <SelectItem value="custom">Tùy chỉnh</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Audit Log Table */}
            <div className={styles.auditTable}>
              <div className={styles.auditTableHeader}>
                <div className={styles.auditHeaderCell}>Thời gian</div>
                <div className={styles.auditHeaderCell}>Người dùng</div>
                <div className={styles.auditHeaderCell}>Hành động</div>
                <div className={styles.auditHeaderCell}>Tài nguyên</div>
                <div className={styles.auditHeaderCell}>Kết quả</div>
                <div className={styles.auditHeaderCell}>IP Address</div>
                <div className={styles.auditHeaderCell}>Chi tiết</div>
              </div>
              {auditLogs.map(log => (
                <div key={log.id} className={styles.auditRow}>
                  <div className={styles.auditCell}>
                    <Clock className={styles.cellIcon} />
                    {log.timestamp}
                  </div>
                  <div className={styles.auditCell}>
                    <User className={styles.cellIcon} />
                    {log.user}
                  </div>
                  <div className={styles.auditCell}>
                    {getActionIcon(log.action)}
                    {log.action}
                  </div>
                  <div className={styles.auditCell}>
                    <span className={styles.resourceId}>{log.resource}</span>
                  </div>
                  <div className={styles.auditCell}>
                    <Badge variant={log.result === 'success' ? 'default' : 'destructive'}>
                      {log.result === 'success' ? (
                        <CheckCircle className={styles.badgeIcon} />
                      ) : (
                        <XCircle className={styles.badgeIcon} />
                      )}
                      {log.result === 'success' ? 'Thành công' : 'Thất bại'}
                    </Badge>
                  </div>
                  <div className={styles.auditCell}>
                    <span className={styles.ipAddress}>{log.ipAddress}</span>
                  </div>
                  <div className={styles.auditCell}>
                    <span className={styles.details}>{log.details}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* WEB-05-19: Storage Health */}
        <TabsContent value="storage-health" className={styles.subTabContent}>
          <div className={styles.storageContainer}>
            {/* Header */}
            <div className={styles.pageHeader}>
              <div className={styles.headerLeft}>
                <h2 className={styles.pageTitle}>Tình trạng lưu trữ</h2>
                <p className={styles.pageDescription}>
                  Giám sát sức khỏe và đồng bộ hệ thống lưu trữ
                </p>
              </div>
              <div className={styles.headerRight}>
                <Button variant="outline" size="sm" onClick={handleRefreshStorage}>
                  <RefreshCw className={styles.buttonIcon} />
                  Làm mới
                </Button>
              </div>
            </div>

            {/* Storage Overview */}
            <div className={styles.storageOverview}>
              <div className={styles.overviewCard}>
                <div className={styles.overviewHeader}>
                  <h3 className={styles.overviewTitle}>Tổng quan dung lượng</h3>
                  <Badge variant="default">
                    <CheckCircle className={styles.badgeIcon} />
                    Tốt
                  </Badge>
                </div>
                <div className={styles.storageProgress}>
                  <div className={styles.progressBar}>
                    <div 
                      className={styles.progressFill}
                      style={{ width: `${(storageStats.used / storageStats.total) * 100}%` }}
                    />
                  </div>
                  <div className={styles.progressLabels}>
                    <span>{storageStats.used} GB / {storageStats.total} GB</span>
                    <span>{((storageStats.used / storageStats.total) * 100).toFixed(1)}% đã sử dụng</span>
                  </div>
                </div>
                <div className={styles.storageBreakdown}>
                  <div className={styles.breakdownItem}>
                    <ImageIcon className={styles.breakdownIcon} style={{ color: '#3b82f6' }} />
                    <span className={styles.breakdownLabel}>Hình ảnh</span>
                    <span className={styles.breakdownValue}>{storageStats.byType.images} GB</span>
                  </div>
                  <div className={styles.breakdownItem}>
                    <Video className={styles.breakdownIcon} style={{ color: '#10b981' }} />
                    <span className={styles.breakdownLabel}>Video</span>
                    <span className={styles.breakdownValue}>{storageStats.byType.videos} GB</span>
                  </div>
                  <div className={styles.breakdownItem}>
                    <FileText className={styles.breakdownIcon} style={{ color: '#f59e0b' }} />
                    <span className={styles.breakdownLabel}>Tài liệu</span>
                    <span className={styles.breakdownValue}>{storageStats.byType.documents} GB</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Health Metrics */}
            <div className={styles.healthGrid}>
              <div className={styles.healthCard}>
                <div className={styles.healthIcon} style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                  <Server />
                </div>
                <div className={styles.healthContent}>
                  <div className={styles.healthLabel}>Trạng thái server</div>
                  <div className={styles.healthValue}>
                    <Wifi className={styles.healthStatusIcon} style={{ color: '#10b981' }} />
                    Online
                  </div>
                </div>
              </div>
              <div className={styles.healthCard}>
                <div className={styles.healthIcon} style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}>
                  <Database />
                </div>
                <div className={styles.healthContent}>
                  <div className={styles.healthLabel}>Đồng bộ</div>
                  <div className={styles.healthValue}>
                    <CheckCircle className={styles.healthStatusIcon} style={{ color: '#10b981' }} />
                    Hoàn tất
                  </div>
                </div>
              </div>
              <div className={styles.healthCard}>
                <div className={styles.healthIcon} style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
                  <HardDrive />
                </div>
                <div className={styles.healthContent}>
                  <div className={styles.healthLabel}>Backup lần cuối</div>
                  <div className={styles.healthValue}>
                    <Clock className={styles.healthStatusIcon} />
                    {storageStats.lastBackup}
                  </div>
                </div>
              </div>
              <div className={styles.healthCard}>
                <div className={styles.healthIcon} style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' }}>
                  <Zap />
                </div>
                <div className={styles.healthContent}>
                  <div className={styles.healthLabel}>Hiệu suất</div>
                  <div className={styles.healthValue}>
                    <TrendingUp className={styles.healthStatusIcon} style={{ color: '#10b981' }} />
                    98.5%
                  </div>
                </div>
              </div>
            </div>

            {/* Storage Actions */}
            <div className={styles.storageActions}>
              <div className={styles.actionsCard}>
                <h3 className={styles.actionsTitle}>Hành động quản lý</h3>
                <div className={styles.actionButtons}>
                  <Button variant="outline">
                    <RefreshCw className={styles.buttonIcon} />
                    Đồng bộ thủ công
                  </Button>
                  <Button variant="outline">
                    <Download className={styles.buttonIcon} />
                    Backup ngay
                  </Button>
                  <Button variant="outline">
                    <Trash2 className={styles.buttonIcon} />
                    Dọn dẹp cache
                  </Button>
                  <Button variant="outline">
                    <Settings className={styles.buttonIcon} />
                    Cấu hình
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* WEB-05-20: System States */}
        <TabsContent value="system-states" className={styles.subTabContent}>
          <div className={styles.statesContainer}>
            {/* Header */}
            <div className={styles.pageHeader}>
              <div className={styles.headerLeft}>
                <h2 className={styles.pageTitle}>Trạng thái hệ thống</h2>
                <p className={styles.pageDescription}>
                  Xem trước các trạng thái UI: Empty, Loading, Error
                </p>
              </div>
            </div>

            <div className={styles.statesGrid}>
              {/* Empty State */}
              <div className={styles.stateCard}>
                <div className={styles.stateHeader}>
                  <h3 className={styles.stateTitle}>Empty State</h3>
                  <Badge variant="secondary">Trống</Badge>
                </div>
                <div className={styles.statePreview}>
                  <div className={styles.emptyState}>
                    <Inbox className={styles.emptyIcon} />
                    <h4 className={styles.emptyTitle}>Chưa có minh chứng</h4>
                    <p className={styles.emptyText}>
                      Chưa có minh chứng nào trong danh sách. Hãy tải lên minh chứng đầu tiên.
                    </p>
                    <Button>
                      <Upload className={styles.buttonIcon} />
                      Tải lên minh chứng
                    </Button>
                  </div>
                </div>
              </div>

              {/* Loading State */}
              <div className={styles.stateCard}>
                <div className={styles.stateHeader}>
                  <h3 className={styles.stateTitle}>Loading State</h3>
                  <Badge variant="secondary">Đang tải</Badge>
                </div>
                <div className={styles.statePreview}>
                  <div className={styles.loadingState}>
                    <Loader2 className={styles.loadingIcon} />
                    <h4 className={styles.loadingTitle}>Đang tải dữ liệu...</h4>
                    <p className={styles.loadingText}>
                      Vui lòng đợi trong giây lát
                    </p>
                  </div>
                </div>
              </div>

              {/* Error 403 State */}
              <div className={styles.stateCard}>
                <div className={styles.stateHeader}>
                  <h3 className={styles.stateTitle}>403 Forbidden</h3>
                  <Badge variant="destructive">Lỗi</Badge>
                </div>
                <div className={styles.statePreview}>
                  <div className={styles.errorState}>
                    <Ban className={styles.errorIcon} />
                    <h4 className={styles.errorTitle}>Không có quyền truy cập</h4>
                    <p className={styles.errorText}>
                      Bạn không có quyền xem nội dung này. Vui lòng liên hệ quản trị viên để được cấp quyền.
                    </p>
                    <div className={styles.errorActions}>
                      <Button variant="outline">
                        Quay lại
                      </Button>
                      <Button>
                        Liên hệ quản trị
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Error 500 State */}
              <div className={styles.stateCard}>
                <div className={styles.stateHeader}>
                  <h3 className={styles.stateTitle}>500 Server Error</h3>
                  <Badge variant="destructive">Lỗi</Badge>
                </div>
                <div className={styles.statePreview}>
                  <div className={styles.errorState}>
                    <AlertTriangle className={styles.errorIcon} />
                    <h4 className={styles.errorTitle}>Lỗi hệ thống</h4>
                    <p className={styles.errorText}>
                      Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau hoặc liên hệ hỗ trợ kỹ thuật.
                    </p>
                    <div className={styles.errorActions}>
                      <Button variant="outline">
                        <RefreshCw className={styles.buttonIcon} />
                        Thử lại
                      </Button>
                      <Button>
                        Báo lỗi
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* No Connection State */}
              <div className={styles.stateCard}>
                <div className={styles.stateHeader}>
                  <h3 className={styles.stateTitle}>No Connection</h3>
                  <Badge variant="secondary">Offline</Badge>
                </div>
                <div className={styles.statePreview}>
                  <div className={styles.errorState}>
                    <WifiOff className={styles.errorIcon} />
                    <h4 className={styles.errorTitle}>Mất kết nối</h4>
                    <p className={styles.errorText}>
                      Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng của bạn.
                    </p>
                    <div className={styles.errorActions}>
                      <Button>
                        <RefreshCw className={styles.buttonIcon} />
                        Kết nối lại
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* No Results State */}
              <div className={styles.stateCard}>
                <div className={styles.stateHeader}>
                  <h3 className={styles.stateTitle}>No Results</h3>
                  <Badge variant="secondary">Không tìm thấy</Badge>
                </div>
                <div className={styles.statePreview}>
                  <div className={styles.emptyState}>
                    <PackageOpen className={styles.emptyIcon} />
                    <h4 className={styles.emptyTitle}>Không tìm thấy kết quả</h4>
                    <p className={styles.emptyText}>
                      Không có kết quả phù hợp với tìm kiếm của bạn. Thử điều chỉnh bộ lọc hoặc từ khóa.
                    </p>
                    <Button variant="outline">
                      <XCircle className={styles.buttonIcon} />
                      Xóa bộ lọc
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
