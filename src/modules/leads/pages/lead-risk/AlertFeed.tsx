import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle,
  Search,
  Filter,
  MapPin,
  Calendar,
  Clock,
  Eye,
  MessageSquare,
  UserCheck,
  X,
  Map,
  TrendingUp,
} from 'lucide-react';
import { toast } from 'sonner';
import styles from './AlertFeed.module.css';

interface Alert {
  id: string;
  type: 'critical' | 'high' | 'medium' | 'info';
  category: 'lead' | 'risk' | 'threshold' | 'anomaly' | 'system';
  title: string;
  description: string;
  location: {
    address: string;
    district: string;
    coordinates?: { lat: number; lng: number };
  };
  timestamp: string;
  isAcknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  hasNotes: boolean;
  noteCount: number;
  entityId: string;
  entityType: 'store' | 'zone' | 'lead';
  source: string;
}

export default function AlertFeed() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'info'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'lead' | 'risk' | 'threshold' | 'anomaly' | 'system'>('all');
  const [districtFilter, setDistrictFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unacknowledged' | 'acknowledged'>('all');
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Mock alerts data
  const alerts: Alert[] = [
    {
      id: 'ALT-2025-001',
      type: 'critical',
      category: 'lead',
      title: 'Lead mới từ hotline - Vi phạm nghiêm trọng',
      description: 'Phát hiện cửa hàng bán hàng giả quy mô lớn tại 123 Nguyễn Huệ, Quận 1',
      location: {
        address: '123 Nguyễn Huệ',
        district: 'Quận 1',
        coordinates: { lat: 10.7769, lng: 106.7009 },
      },
      timestamp: '2025-01-09T08:30:00',
      isAcknowledged: false,
      hasNotes: false,
      noteCount: 0,
      entityId: 'L-2024-1234',
      entityType: 'lead',
      source: 'Hotline 1800',
    },
    {
      id: 'ALT-2025-002',
      type: 'high',
      category: 'risk',
      title: 'Điểm rủi ro tăng đột biến',
      description: 'Khu vực Quận 1 - Nguyễn Huệ có điểm rủi ro tăng từ 65 lên 85 trong 7 ngày',
      location: {
        address: 'Khu vực Nguyễn Huệ',
        district: 'Quận 1',
        coordinates: { lat: 10.7769, lng: 106.7009 },
      },
      timestamp: '2025-01-09T07:15:00',
      isAcknowledged: true,
      acknowledgedBy: 'Nguyễn Văn A',
      acknowledgedAt: '2025-01-09T07:45:00',
      hasNotes: true,
      noteCount: 2,
      entityId: 'ZONE-001',
      entityType: 'zone',
      source: 'Auto Detection',
    },
    {
      id: 'ALT-2025-003',
      type: 'critical',
      category: 'threshold',
      title: 'Vượt ngưỡng cảnh báo - Cơ sở STR-2024-001',
      description: 'Cửa hàng ABC đã có 5 vi phạm trong 30 ngày (ngưỡng: 3)',
      location: {
        address: '123 Nguyễn Huệ',
        district: 'Quận 1',
      },
      timestamp: '2025-01-08T16:20:00',
      isAcknowledged: true,
      acknowledgedBy: 'Trần Thị B',
      acknowledgedAt: '2025-01-08T17:00:00',
      hasNotes: true,
      noteCount: 1,
      entityId: 'STR-2024-001',
      entityType: 'store',
      source: 'Rule Engine',
    },
    {
      id: 'ALT-2025-004',
      type: 'high',
      category: 'anomaly',
      title: 'Phát hiện bất thường - Tăng đột biến khiếu nại',
      description: 'Số lượng khiếu nại tại Quận 3 tăng 300% so với tuần trước',
      location: {
        address: 'Toàn Quận 3',
        district: 'Quận 3',
      },
      timestamp: '2025-01-08T14:00:00',
      isAcknowledged: false,
      hasNotes: false,
      noteCount: 0,
      entityId: 'ZONE-003',
      entityType: 'zone',
      source: 'Analytics',
    },
    {
      id: 'ALT-2025-005',
      type: 'medium',
      category: 'lead',
      title: 'Lead từ Mobile App - Yêu cầu kiểm tra',
      description: 'Khách hàng phản ánh cửa hàng bán hàng không tem tại Quận 5',
      location: {
        address: '456 Trần Hưng Đạo',
        district: 'Quận 5',
      },
      timestamp: '2025-01-08T10:30:00',
      isAcknowledged: true,
      acknowledgedBy: 'Lê Văn C',
      acknowledgedAt: '2025-01-08T11:00:00',
      hasNotes: false,
      noteCount: 0,
      entityId: 'L-2024-1235',
      entityType: 'lead',
      source: 'Mobile App',
    },
    {
      id: 'ALT-2025-006',
      type: 'info',
      category: 'system',
      title: 'Hoàn thành đồng bộ dữ liệu',
      description: 'Hệ thống đã đồng bộ thành công 150 lead mới từ các nguồn',
      location: {
        address: 'Toàn thành phố',
        district: 'TP.HCM',
      },
      timestamp: '2025-01-08T09:00:00',
      isAcknowledged: true,
      acknowledgedBy: 'System Admin',
      acknowledgedAt: '2025-01-08T09:01:00',
      hasNotes: false,
      noteCount: 0,
      entityId: 'SYS-SYNC-001',
      entityType: 'lead',
      source: 'System',
    },
  ];

  const districts = ['Quận 1', 'Quận 3', 'Quận 5', 'Quận 7', 'Quận 10'];

  // Filter alerts
  const filteredAlerts = alerts.filter((alert) => {
    if (typeFilter !== 'all' && alert.type !== typeFilter) return false;
    if (categoryFilter !== 'all' && alert.category !== categoryFilter) return false;
    if (districtFilter !== 'all' && alert.location.district !== districtFilter) return false;
    if (statusFilter === 'unacknowledged' && alert.isAcknowledged) return false;
    if (statusFilter === 'acknowledged' && !alert.isAcknowledged) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        alert.title.toLowerCase().includes(query) ||
        alert.description.toLowerCase().includes(query) ||
        alert.location.address.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const stats = {
    total: alerts.length,
    unacknowledged: alerts.filter((a) => !a.isAcknowledged).length,
    critical: alerts.filter((a) => a.type === 'critical').length,
    today: alerts.filter((a) => {
      const today = new Date().toDateString();
      return new Date(a.timestamp).toDateString() === today;
    }).length,
  };

  const handleAcknowledge = (alertId: string) => {
    toast.success('Đã xác nhận cảnh báo');
    // In real app: API call
  };

  const handleViewOnMap = (alert: Alert) => {
    if (alert.location.coordinates) {
      // Navigate to map view with coordinates
      toast.info('Đang mở bản đồ...');
      navigate('/lead-risk/map');
    } else {
      toast.error('Không có tọa độ cho địa điểm này');
    }
  };

  const handleViewDetails = (alert: Alert) => {
    if (alert.entityType === 'lead') {
      navigate(`/lead-risk/lead/${alert.entityId}`);
    } else if (alert.entityType === 'store') {
      navigate(`/lead-risk/entity-risk-profile`);
    } else if (alert.entityType === 'zone') {
      navigate(`/lead-risk/risk/${alert.entityId}`);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle size={20} />;
      case 'high':
        return <AlertCircle size={20} />;
      case 'medium':
        return <Info size={20} />;
      case 'info':
        return <Bell size={20} />;
      default:
        return <Bell size={20} />;
    }
  };

  const getTypeClass = (type: string) => {
    const classes = {
      critical: styles.alertCritical,
      high: styles.alertHigh,
      medium: styles.alertMedium,
      info: styles.alertInfo,
    };
    return classes[type as keyof typeof classes] || '';
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      lead: 'Lead',
      risk: 'Rủi ro',
      threshold: 'Ngưỡng',
      anomaly: 'Bất thường',
      system: 'Hệ thống',
    };
    return labels[category as keyof typeof labels] || category;
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <h1 className={styles.title}>Cảnh báo gần đây</h1>
          <p className={styles.subtitle}>Theo dõi và xử lý cảnh báo theo thời gian thực</p>
        </div>

        <button
          className={styles.filterToggle}
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={16} />
          {showFilters ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
        </button>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Bell size={24} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.total}</div>
            <div className={styles.statLabel}>Tổng cảnh báo</div>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.statCardCritical}`}>
          <div className={styles.statIcon}>
            <AlertTriangle size={24} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.unacknowledged}</div>
            <div className={styles.statLabel}>Chưa xác nhận</div>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.statCardHigh}`}>
          <div className={styles.statIcon}>
            <AlertCircle size={24} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.critical}</div>
            <div className={styles.statLabel}>Nghiêm trọng</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Calendar size={24} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.today}</div>
            <div className={styles.statLabel}>Hôm nay</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className={styles.filtersPanel}>
          <div className={styles.searchBox}>
            <Search size={16} />
            <input
              type="text"
              placeholder="Tìm kiếm cảnh báo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className={styles.clearButton}>
                <X size={14} />
              </button>
            )}
          </div>

          <div className={styles.filterRow}>
            <div className={styles.filterGroup}>
              <label>Mức độ</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as any)}
                className={styles.select}
              >
                <option value="all">Tất cả</option>
                <option value="critical">Nghiêm trọng</option>
                <option value="high">Cao</option>
                <option value="medium">Trung bình</option>
                <option value="info">Thông tin</option>
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label>Danh mục</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as any)}
                className={styles.select}
              >
                <option value="all">Tất cả</option>
                <option value="lead">Lead</option>
                <option value="risk">Rủi ro</option>
                <option value="threshold">Ngưỡng</option>
                <option value="anomaly">Bất thường</option>
                <option value="system">Hệ thống</option>
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label>Địa bàn</label>
              <select
                value={districtFilter}
                onChange={(e) => setDistrictFilter(e.target.value)}
                className={styles.select}
              >
                <option value="all">Tất cả</option>
                {districts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label>Trạng thái</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className={styles.select}
              >
                <option value="all">Tất cả</option>
                <option value="unacknowledged">Chưa xác nhận</option>
                <option value="acknowledged">Đã xác nhận</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Alert Feed */}
      <div className={styles.feedContainer}>
        <div className={styles.feedHeader}>
          <h2 className={styles.feedTitle}>
            {filteredAlerts.length} cảnh báo
          </h2>
        </div>

        <div className={styles.alertList}>
          {filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`${styles.alertCard} ${getTypeClass(alert.type)} ${
                !alert.isAcknowledged ? styles.alertUnacknowledged : ''
              }`}
            >
              <div className={styles.alertIcon}>{getTypeIcon(alert.type)}</div>

              <div className={styles.alertContent}>
                <div className={styles.alertHeader}>
                  <div className={styles.alertMeta}>
                    <span className={styles.alertId}>{alert.id}</span>
                    <span className={styles.alertCategory}>
                      {getCategoryLabel(alert.category)}
                    </span>
                    <span className={styles.alertTime}>
                      <Clock size={12} />
                      {formatTimestamp(alert.timestamp)}
                    </span>
                  </div>

                  {!alert.isAcknowledged && (
                    <span className={styles.unacknowledgedBadge}>Chưa xác nhận</span>
                  )}
                </div>

                <h3 className={styles.alertTitle}>{alert.title}</h3>
                <p className={styles.alertDescription}>{alert.description}</p>

                <div className={styles.alertLocation}>
                  <MapPin size={14} />
                  <span>
                    {alert.location.address}, {alert.location.district}
                  </span>
                </div>

                {alert.isAcknowledged && alert.acknowledgedBy && (
                  <div className={styles.acknowledgement}>
                    <UserCheck size={14} />
                    <span>
                      Đã xác nhận bởi <strong>{alert.acknowledgedBy}</strong> lúc{' '}
                      {new Date(alert.acknowledgedAt!).toLocaleString('vi-VN')}
                    </span>
                  </div>
                )}

                {alert.hasNotes && (
                  <div className={styles.notesIndicator}>
                    <MessageSquare size={14} />
                    <span>{alert.noteCount} ghi chú</span>
                  </div>
                )}
              </div>

              <div className={styles.alertActions}>
                {!alert.isAcknowledged && (
                  <button
                    className={styles.acknowledgeButton}
                    onClick={() => handleAcknowledge(alert.id)}
                  >
                    <CheckCircle size={16} />
                    Xác nhận
                  </button>
                )}

                <button
                  className={styles.actionButton}
                  onClick={() => handleViewOnMap(alert)}
                >
                  <Map size={16} />
                  Bản đồ
                </button>

                <button
                  className={styles.actionButton}
                  onClick={() => handleViewDetails(alert)}
                >
                  <Eye size={16} />
                  Chi tiết
                </button>

                <button
                  className={styles.actionButton}
                  onClick={() => navigate(`/lead-risk/alert-acknowledgement/${alert.id}`)}
                >
                  <MessageSquare size={16} />
                  Ghi chú
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredAlerts.length === 0 && (
          <div className={styles.emptyState}>
            <Bell size={48} />
            <h3>Không có cảnh báo</h3>
            <p>Không tìm thấy cảnh báo nào phù hợp với bộ lọc</p>
          </div>
        )}
      </div>
    </div>
  );
}
