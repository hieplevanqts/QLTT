import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  Filter,
  Download,
  Calendar,
  User,
  MapPin,
  Eye,
  Edit,
  Upload,
  Lock,
  Unlock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  FileText,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PageHeader from '@/layouts/PageHeader';
import styles from './EvidenceAuditLogPage.module.css';
import { toast } from 'sonner';

// WEB-05-Audit — Evidence Audit Log (P1)
// Tách khỏi custody per-item để xem toàn bộ hệ thống
// FR-20, FR-21: Chain of custody & audit tracking

interface AuditLogEntry {
  id: string;
  timestamp: string;
  evidenceId: string;
  evidenceName: string;
  eventType: 'upload' | 'view' | 'edit' | 'review' | 'approve' | 'reject' | 'download' | 'seal' | 'unseal' | 'export' | 'package' | 'delete';
  actor: string;
  action: string;
  ipAddress?: string;
  device?: string;
  location?: string;
  details?: string;
}

export default function EvidenceAuditLogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterExpanded, setFilterExpanded] = useState(false);
  const [selectedEventType, setSelectedEventType] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedUser, setSelectedUser] = useState('');

  // Mock audit log data
  const auditLogs: AuditLogEntry[] = [
    {
      id: 'AUD-2026-9876',
      timestamp: '10/01/2026 15:30:45',
      evidenceId: 'EVD-2026-1252',
      evidenceName: 'anh_vi_pham_ve_sinh.jpg',
      eventType: 'download',
      actor: 'Lê Văn C',
      action: 'Download chứng cứ từ Package PKG-2026-042',
      ipAddress: '14.231.xxx.xxx',
      device: 'Chrome - Windows 11',
      location: 'Quận 1, TP.HCM',
      details: 'Download via Export Center - Job EXP-2026-156'
    },
    {
      id: 'AUD-2026-9875',
      timestamp: '10/01/2026 14:22:10',
      evidenceId: 'EVD-2026-1251',
      evidenceName: 'video_thanh_tra.mp4',
      eventType: 'seal',
      actor: 'Trần Thị B (Supervisor)',
      action: 'Niêm phong chứng cứ sau khi phê duyệt',
      ipAddress: '113.161.xxx.xxx',
      device: 'Chrome - Windows 11',
      location: 'Quận 3, TP.HCM',
      details: 'Reason: Chứng cứ quan trọng cho vụ án, cần bảo toàn tính toàn vẹn'
    },
    {
      id: 'AUD-2026-9874',
      timestamp: '10/01/2026 13:45:33',
      evidenceId: 'EVD-2026-1250',
      evidenceName: 'bien_ban_kiem_tra.pdf',
      eventType: 'approve',
      actor: 'Phạm Thị D (Reviewer)',
      action: 'Phê duyệt chứng cứ',
      ipAddress: '14.231.xxx.xxx',
      device: 'Chrome - Windows 11',
      location: 'Quận 5, TP.HCM',
      details: 'Comment: Tài liệu hợp lệ, đầy đủ thông tin'
    },
    {
      id: 'AUD-2026-9873',
      timestamp: '10/01/2026 11:20:15',
      evidenceId: 'EVD-2026-1249',
      evidenceName: 'giay_phep_attp.pdf',
      eventType: 'reject',
      actor: 'Lê Văn C (Reviewer)',
      action: 'Từ chối chứng cứ',
      ipAddress: '14.231.xxx.xxx',
      device: 'Chrome - Windows 11',
      location: 'Quận 7, TP.HCM',
      details: 'Reason: Hình ảnh không rõ ràng, không đủ điều kiện làm chứng cứ'
    },
    {
      id: 'AUD-2026-9872',
      timestamp: '10/01/2026 09:30:22',
      evidenceId: 'EVD-2026-1252',
      evidenceName: 'anh_vi_pham_ve_sinh.jpg',
      eventType: 'upload',
      actor: 'Nguyễn Văn A',
      action: 'Tải lên chứng cứ từ Mobile App',
      ipAddress: '113.161.xxx.xxx',
      device: 'iPhone 14 Pro - iOS 17.2',
      location: 'Quận 1, TP.HCM',
      details: 'Hash: sha256:a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6'
    },
    {
      id: 'AUD-2026-9871',
      timestamp: '10/01/2026 08:15:10',
      evidenceId: 'EVD-2026-1248',
      evidenceName: 'anh_kho_hang.jpg',
      eventType: 'edit',
      actor: 'Trần Thị B',
      action: 'Cập nhật metadata - Thêm nhãn bảo mật: Confidential',
      ipAddress: '14.231.xxx.xxx',
      device: 'Chrome - Windows 11',
      location: 'Quận 10, TP.HCM',
      details: 'Reason code: Nội dung chứa thông tin nhạy cảm về cơ sở vi phạm'
    },
    {
      id: 'AUD-2026-9870',
      timestamp: '09/01/2026 16:40:55',
      evidenceId: 'EVD-2026-1245',
      evidenceName: 'video_kiem_tra.mp4',
      eventType: 'package',
      actor: 'Lê Văn C',
      action: 'Thêm vào gói chứng cứ PKG-2026-042',
      ipAddress: '14.231.xxx.xxx',
      device: 'Chrome - Windows 11',
      location: 'Quận 1, TP.HCM',
      details: 'Package: Gói chứng cứ vụ vi phạm ATTP Quận 1'
    },
    {
      id: 'AUD-2026-9869',
      timestamp: '09/01/2026 14:20:30',
      evidenceId: 'EVD-2026-1252',
      evidenceName: 'anh_vi_pham_ve_sinh.jpg',
      eventType: 'view',
      actor: 'Phạm Thị D',
      action: 'Xem chi tiết chứng cứ',
      ipAddress: '113.161.xxx.xxx',
      device: 'Chrome - Windows 11',
      location: 'Quận 1, TP.HCM'
    },
    {
      id: 'AUD-2026-9868',
      timestamp: '08/01/2026 10:15:20',
      evidenceId: 'EVD-2026-1243',
      evidenceName: 'bien_ban_xu_phat.pdf',
      eventType: 'export',
      actor: 'Lê Văn C',
      action: 'Xuất khẩu ZIP Full Package',
      ipAddress: '14.231.xxx.xxx',
      device: 'Chrome - Windows 11',
      location: 'Quận 3, TP.HCM',
      details: 'Export Job: EXP-2026-154'
    }
  ];

  const stats = {
    total: auditLogs.length,
    today: auditLogs.filter(log => log.timestamp.includes('10/01/2026')).length,
    sensitive: auditLogs.filter(log => ['download', 'export', 'seal', 'delete'].includes(log.eventType)).length,
    reviewActions: auditLogs.filter(log => ['approve', 'reject', 'review'].includes(log.eventType)).length
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'upload': return <Upload size={16} />;
      case 'view': return <Eye size={16} />;
      case 'edit': return <Edit size={16} />;
      case 'review': return <ShieldCheck size={16} />;
      case 'approve': return <CheckCircle size={16} />;
      case 'reject': return <XCircle size={16} />;
      case 'download': return <Download size={16} />;
      case 'seal': return <Lock size={16} />;
      case 'unseal': return <Unlock size={16} />;
      case 'export': return <Download size={16} />;
      case 'package': return <FileText size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const getEventColor = (eventType: string) => {
    switch (eventType) {
      case 'upload': return '#005cb6';
      case 'approve': return '#22c55e';
      case 'reject': return '#ef4444';
      case 'seal': return '#8b5cf6';
      case 'download': return '#f59e0b';
      case 'export': return '#f59e0b';
      case 'delete': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const getEventBadge = (eventType: string) => {
    const eventConfig: Record<string, string> = {
      upload: 'Upload',
      view: 'View',
      edit: 'Edit',
      review: 'Review',
      approve: 'Approve',
      reject: 'Reject',
      download: 'Download',
      seal: 'Seal',
      unseal: 'Unseal',
      export: 'Export',
      package: 'Package',
      delete: 'Delete'
    };
    const color = getEventColor(eventType);
    return (
      <Badge variant="outline" style={{ borderColor: color, color: color, background: `${color}15` }}>
        {getEventIcon(eventType)}
        {eventConfig[eventType] || eventType}
      </Badge>
    );
  };

  const handleExportLog = () => {
    toast.success('Đang xuất audit log. File CSV sẽ sẵn sàng sau ít phút.');
  };

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = !searchTerm ||
      log.evidenceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.evidenceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.actor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEventType = !selectedEventType || log.eventType === selectedEventType;
    const matchesUser = !selectedUser || log.actor.includes(selectedUser);
    return matchesSearch && matchesEventType && matchesUser;
  });

  return (
    <div className={styles.container}>
      <PageHeader
        breadcrumbs={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Kho chứng cứ', href: '/evidence' },
          { label: 'Audit Log' }
        ]}
        title="Audit Log - Nhật ký kiểm toán"
        actions={
          <Button onClick={handleExportLog}>
            <Download size={16} />
            Xuất Log
          </Button>
        }
      />

      <div className={styles.content}>
        {/* Stats Cards */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#005cb615', color: '#005cb6' }}>
              <ShieldCheck size={24} />
            </div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Tổng số events</p>
              <h3 className={styles.statValue}>{stats.total}</h3>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#22c55e15', color: '#22c55e' }}>
              <Calendar size={24} />
            </div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Hôm nay</p>
              <h3 className={styles.statValue}>{stats.today}</h3>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#f59e0b15', color: '#f59e0b' }}>
              <AlertCircle size={24} />
            </div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Thao tác nhạy cảm</p>
              <h3 className={styles.statValue}>{stats.sensitive}</h3>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#8b5cf615', color: '#8b5cf6' }}>
              <CheckCircle size={24} />
            </div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Review actions</p>
              <h3 className={styles.statValue}>{stats.reviewActions}</h3>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className={styles.filterSection}>
          <div className={styles.searchBar}>
            <Search size={16} />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã chứng cứ, tên file, người thực hiện..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilterExpanded(!filterExpanded)}
          >
            <Filter size={16} />
            Bộ lọc
            <ChevronDown size={16} style={{ transform: filterExpanded ? 'rotate(180deg)' : 'none' }} />
          </Button>
        </div>

        {filterExpanded && (
          <div className={styles.filterGrid}>
            <select
              className={styles.filterSelect}
              value={selectedEventType}
              onChange={(e) => setSelectedEventType(e.target.value)}
            >
              <option value="">Tất cả loại event</option>
              <option value="upload">Upload</option>
              <option value="view">View</option>
              <option value="edit">Edit</option>
              <option value="review">Review</option>
              <option value="approve">Approve</option>
              <option value="reject">Reject</option>
              <option value="download">Download</option>
              <option value="seal">Seal</option>
              <option value="export">Export</option>
              <option value="package">Package</option>
            </select>

            <select
              className={styles.filterSelect}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            >
              <option value="">Tất cả thời gian</option>
              <option value="today">Hôm nay</option>
              <option value="yesterday">Hôm qua</option>
              <option value="week">7 ngày qua</option>
              <option value="month">30 ngày qua</option>
            </select>

            <select
              className={styles.filterSelect}
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              <option value="">Tất cả người dùng</option>
              <option value="Nguyễn Văn A">Nguyễn Văn A</option>
              <option value="Trần Thị B">Trần Thị B</option>
              <option value="Lê Văn C">Lê Văn C</option>
              <option value="Phạm Thị D">Phạm Thị D</option>
            </select>
          </div>
        )}

        {/* Audit Log Table */}
        <div className={styles.logSection}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Lịch sử thao tác ({filteredLogs.length})</h3>
          </div>

          <div className={styles.logList}>
            {filteredLogs.map((log) => (
              <div key={log.id} className={styles.logCard}>
                <div className={styles.logIcon} style={{
                  background: `${getEventColor(log.eventType)}15`,
                  color: getEventColor(log.eventType)
                }}>
                  {getEventIcon(log.eventType)}
                </div>

                <div className={styles.logContent}>
                  <div className={styles.logHeader}>
                    <div className={styles.logHeaderLeft}>
                      <span className={styles.logId}>{log.id}</span>
                      {getEventBadge(log.eventType)}
                    </div>
                    <span className={styles.logTime}>
                      <Clock size={12} />
                      {log.timestamp}
                    </span>
                  </div>

                  <div className={styles.logDetails}>
                    <div className={styles.evidenceInfo}>
                      <span className={styles.evidenceId}>{log.evidenceId}</span>
                      <span className={styles.evidenceName}>{log.evidenceName}</span>
                    </div>
                  </div>

                  <p className={styles.logAction}>{log.action}</p>

                  <div className={styles.logMeta}>
                    <div className={styles.metaItem}>
                      <User size={12} />
                      <span>{log.actor}</span>
                    </div>
                    {log.ipAddress && (
                      <div className={styles.metaItem}>
                        <span className={styles.metaLabel}>IP:</span>
                        <span>{log.ipAddress}</span>
                      </div>
                    )}
                    {log.device && (
                      <div className={styles.metaItem}>
                        <span className={styles.metaLabel}>Device:</span>
                        <span>{log.device}</span>
                      </div>
                    )}
                    {log.location && (
                      <div className={styles.metaItem}>
                        <MapPin size={12} />
                        <span>{log.location}</span>
                      </div>
                    )}
                  </div>

                  {log.details && (
                    <div className={styles.logDetailsBox}>
                      <AlertCircle size={12} />
                      <span>{log.details}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* OWASP Logging Notice */}
        <div className={styles.owaspNotice}>
          <ShieldCheck size={16} />
          <div>
            <p className={styles.noticeTitle}>OWASP Logging Guidance Compliance</p>
            <p className={styles.noticeText}>
              Tất cả audit log được ghi theo tiêu chuẩn OWASP logging guidance, bao gồm:
              timestamp chính xác, user identity, event type, IP address, device/user agent,
              action context, và result status. Thao tác nhạy cảm (download, export, seal, delete)
              được đánh dấu và monitor đặc biệt.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

