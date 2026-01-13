import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  UserPlus,
  Clock,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Search,
  Filter,
  BarChart3,
  Calendar,
  Send,
  ArrowRight,
  User,
  MapPin,
  FileText,
  Zap,
  Target,
} from 'lucide-react';
import { toast } from 'sonner';
import styles from './AssignmentDispatch.module.css';

interface Inspector {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  currentLoad: number;
  maxCapacity: number;
  activeLeads: number;
  completedToday: number;
  avgResponseTime: number; // minutes
  performance: number; // 0-100
  specialties: string[];
  location: string;
  availability: 'available' | 'busy' | 'offline';
}

interface PendingAssignment {
  id: string;
  leadId: string;
  title: string;
  urgency: 'critical' | 'high' | 'medium' | 'low';
  location: string;
  district: string;
  createdAt: string;
  slaDeadline: string;
  remainingHours: number;
  violationType: string;
  requiresSpecialty?: string;
}

export default function AssignmentDispatch() {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<'pending' | 'dispatched' | 'performance'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState<'all' | 'critical' | 'high'>('all');
  const [selectedLead, setSelectedLead] = useState<PendingAssignment | null>(null);
  const [selectedInspector, setSelectedInspector] = useState<Inspector | null>(null);

  // Mock inspectors data
  const inspectors: Inspector[] = [
    {
      id: 'INS-001',
      name: 'Nguyễn Văn A',
      role: 'Thanh tra viên cấp cao',
      currentLoad: 5,
      maxCapacity: 8,
      activeLeads: 5,
      completedToday: 2,
      avgResponseTime: 35,
      performance: 92,
      specialties: ['Thuốc', 'Hóa chất'],
      location: 'Quận 1',
      availability: 'available',
    },
    {
      id: 'INS-002',
      name: 'Trần Thị B',
      role: 'Thanh tra viên',
      currentLoad: 7,
      maxCapacity: 8,
      activeLeads: 7,
      completedToday: 1,
      avgResponseTime: 42,
      performance: 88,
      specialties: ['Thực phẩm', 'Mỹ phẩm'],
      location: 'Quận 3',
      availability: 'busy',
    },
    {
      id: 'INS-003',
      name: 'Lê Văn C',
      role: 'Thanh tra viên',
      currentLoad: 3,
      maxCapacity: 8,
      activeLeads: 3,
      completedToday: 3,
      avgResponseTime: 28,
      performance: 95,
      specialties: ['Điện tử', 'Hàng hóa công nghiệp'],
      location: 'Quận 5',
      availability: 'available',
    },
    {
      id: 'INS-004',
      name: 'Phạm Thị D',
      role: 'Thanh tra viên cấp cao',
      currentLoad: 6,
      maxCapacity: 10,
      activeLeads: 6,
      completedToday: 2,
      avgResponseTime: 38,
      performance: 90,
      specialties: ['Thuốc', 'Thực phẩm'],
      location: 'Quận 7',
      availability: 'available',
    },
    {
      id: 'INS-005',
      name: 'Hoàng Văn E',
      role: 'Thanh tra viên',
      currentLoad: 8,
      maxCapacity: 8,
      activeLeads: 8,
      completedToday: 0,
      avgResponseTime: 55,
      performance: 75,
      specialties: ['Hóa chất'],
      location: 'Quận 10',
      availability: 'busy',
    },
  ];

  // Mock pending assignments
  const pendingAssignments: PendingAssignment[] = [
    {
      id: 'PA-001',
      leadId: 'LD24-0234',
      title: 'Phát hiện thuốc giả quy mô lớn',
      urgency: 'critical',
      location: '123 Nguyễn Huệ, Quận 1',
      district: 'Quận 1',
      createdAt: '2025-01-09T08:30:00',
      slaDeadline: '2025-01-09T16:30:00',
      remainingHours: 2.5,
      violationType: 'Thuốc',
      requiresSpecialty: 'Thuốc',
    },
    {
      id: 'PA-002',
      leadId: 'LD24-0235',
      title: 'Khiếu nại về thực phẩm hết hạn',
      urgency: 'high',
      location: '456 Lê Lợi, Quận 3',
      district: 'Quận 3',
      createdAt: '2025-01-09T09:00:00',
      slaDeadline: '2025-01-10T09:00:00',
      remainingHours: 18,
      violationType: 'Thực phẩm',
      requiresSpecialty: 'Thực phẩm',
    },
    {
      id: 'PA-003',
      leadId: 'LD24-0236',
      title: 'Báo cáo hàng điện tử nhái',
      urgency: 'medium',
      location: '789 Trần Hưng Đạo, Quận 5',
      district: 'Quận 5',
      createdAt: '2025-01-09T10:00:00',
      slaDeadline: '2025-01-11T10:00:00',
      remainingHours: 42,
      violationType: 'Điện tử',
      requiresSpecialty: 'Điện tử',
    },
    {
      id: 'PA-004',
      leadId: 'LD24-0237',
      title: 'Mỹ phẩm không rõ nguồn gốc',
      urgency: 'high',
      location: '321 Nguyễn Trãi, Quận 1',
      district: 'Quận 1',
      createdAt: '2025-01-09T07:00:00',
      slaDeadline: '2025-01-09T19:00:00',
      remainingHours: 5,
      violationType: 'Mỹ phẩm',
      requiresSpecialty: 'Mỹ phẩm',
    },
    {
      id: 'PA-005',
      leadId: 'LD24-0238',
      title: 'Hóa chất công nghiệp không phép',
      urgency: 'critical',
      location: '555 Võ Văn Tần, Quận 3',
      district: 'Quận 3',
      createdAt: '2025-01-09T11:00:00',
      slaDeadline: '2025-01-09T19:00:00',
      remainingHours: 4,
      violationType: 'Hóa chất',
      requiresSpecialty: 'Hóa chất',
    },
  ];

  const filteredPending = pendingAssignments.filter((pa) => {
    if (urgencyFilter !== 'all' && pa.urgency !== urgencyFilter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        pa.title.toLowerCase().includes(query) ||
        pa.location.toLowerCase().includes(query) ||
        pa.leadId.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const stats = {
    pendingTotal: pendingAssignments.length,
    criticalPending: pendingAssignments.filter((p) => p.urgency === 'critical').length,
    slaAtRisk: pendingAssignments.filter((p) => p.remainingHours <= 4).length,
    avgWaitTime: 2.3,
  };

  const handleQuickAssign = (assignment: PendingAssignment) => {
    // Find best inspector based on specialty, location, and workload
    const suitable = inspectors
      .filter((i) => i.availability === 'available')
      .filter((i) => !assignment.requiresSpecialty || i.specialties.includes(assignment.requiresSpecialty))
      .sort((a, b) => {
        const aScore = (10 - a.currentLoad) + (a.location === assignment.district ? 5 : 0);
        const bScore = (10 - b.currentLoad) + (b.location === assignment.district ? 5 : 0);
        return bScore - aScore;
      });

    if (suitable.length > 0) {
      setSelectedLead(assignment);
      setSelectedInspector(suitable[0]);
    } else {
      toast.error('Không có thanh tra viên phù hợp');
    }
  };

  const handleDispatch = () => {
    if (!selectedLead || !selectedInspector) return;

    toast.success(
      `Đã phân công lead ${selectedLead.leadId} cho ${selectedInspector.name}`,
      { duration: 3000 }
    );

    setSelectedLead(null);
    setSelectedInspector(null);
  };

  const getUrgencyClass = (urgency: string) => {
    const classes = {
      critical: styles.urgencyCritical,
      high: styles.urgencyHigh,
      medium: styles.urgencyMedium,
      low: styles.urgencyLow,
    };
    return classes[urgency as keyof typeof classes] || '';
  };

  const getAvailabilityClass = (availability: string) => {
    const classes = {
      available: styles.availabilityAvailable,
      busy: styles.availabilityBusy,
      offline: styles.availabilityOffline,
    };
    return classes[availability as keyof typeof classes] || '';
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <h1 className={styles.title}>Phân công & Điều phối</h1>
          <p className={styles.subtitle}>
            Quản lý phân công lead cho thanh tra viên với theo dõi SLA
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Clock size={24} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.pendingTotal}</div>
            <div className={styles.statLabel}>Chờ phân công</div>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.statCardCritical}`}>
          <div className={styles.statIcon}>
            <AlertTriangle size={24} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.criticalPending}</div>
            <div className={styles.statLabel}>Khẩn cấp</div>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.statCardWarning}`}>
          <div className={styles.statIcon}>
            <Target size={24} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.slaAtRisk}</div>
            <div className={styles.statLabel}>SLA rủi ro</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <TrendingUp size={24} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.avgWaitTime}h</div>
            <div className={styles.statLabel}>Thời gian chờ TB</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeView === 'pending' ? styles.tabActive : ''}`}
          onClick={() => setActiveView('pending')}
        >
          <Clock size={16} />
          Chờ phân công ({filteredPending.length})
        </button>
        <button
          className={`${styles.tab} ${activeView === 'dispatched' ? styles.tabActive : ''}`}
          onClick={() => setActiveView('dispatched')}
        >
          <CheckCircle size={16} />
          Đã phân công
        </button>
        <button
          className={`${styles.tab} ${activeView === 'performance' ? styles.tabActive : ''}`}
          onClick={() => setActiveView('performance')}
        >
          <BarChart3 size={16} />
          Hiệu suất
        </button>
      </div>

      {/* Pending View */}
      {activeView === 'pending' && (
        <div className={styles.content}>
          {/* Filters */}
          <div className={styles.toolbar}>
            <div className={styles.searchBox}>
              <Search size={16} />
              <input
                type="text"
                placeholder="Tìm kiếm lead..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            <select
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value as any)}
              className={styles.select}
            >
              <option value="all">Tất cả độ khẩn</option>
              <option value="critical">Khẩn cấp</option>
              <option value="high">Cao</option>
            </select>
          </div>

          <div className={styles.mainGrid}>
            {/* Pending Leads */}
            <div className={styles.pendingSection}>
              <h2 className={styles.sectionTitle}>
                Lead chờ phân công ({filteredPending.length})
              </h2>

              <div className={styles.pendingList}>
                {filteredPending.map((assignment) => (
                  <div
                    key={assignment.id}
                    className={`${styles.pendingCard} ${
                      selectedLead?.id === assignment.id ? styles.selectedCard : ''
                    }`}
                    onClick={() => setSelectedLead(assignment)}
                  >
                    <div className={styles.pendingHeader}>
                      <div className={styles.leadId}>{assignment.leadId}</div>
                      <div className={`${styles.urgencyBadge} ${getUrgencyClass(assignment.urgency)}`}>
                        {assignment.urgency === 'critical' && 'Khẩn cấp'}
                        {assignment.urgency === 'high' && 'Cao'}
                        {assignment.urgency === 'medium' && 'TB'}
                        {assignment.urgency === 'low' && 'Thấp'}
                      </div>
                    </div>

                    <h3 className={styles.pendingTitle}>{assignment.title}</h3>

                    <div className={styles.pendingMeta}>
                      <div className={styles.metaItem}>
                        <MapPin size={14} />
                        <span>{assignment.location}</span>
                      </div>
                      <div className={styles.metaItem}>
                        <FileText size={14} />
                        <span>{assignment.violationType}</span>
                      </div>
                    </div>

                    <div className={styles.slaInfo}>
                      <Clock size={14} />
                      <span
                        className={assignment.remainingHours <= 4 ? styles.slaAtRisk : ''}
                      >
                        Còn {assignment.remainingHours}h
                      </span>
                    </div>

                    <button
                      className={styles.quickAssignButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuickAssign(assignment);
                      }}
                    >
                      <Zap size={14} />
                      Gán nhanh
                    </button>
                  </div>
                ))}
              </div>

              {filteredPending.length === 0 && (
                <div className={styles.emptyState}>
                  <CheckCircle size={48} />
                  <p>Không có lead chờ phân công</p>
                </div>
              )}
            </div>

            {/* Inspector List */}
            <div className={styles.inspectorSection}>
              <h2 className={styles.sectionTitle}>Thanh tra viên ({inspectors.length})</h2>

              <div className={styles.inspectorList}>
                {inspectors.map((inspector) => (
                  <div
                    key={inspector.id}
                    className={`${styles.inspectorCard} ${
                      selectedInspector?.id === inspector.id ? styles.selectedCard : ''
                    }`}
                    onClick={() => setSelectedInspector(inspector)}
                  >
                    <div className={styles.inspectorHeader}>
                      <div className={styles.inspectorAvatar}>
                        <User size={20} />
                      </div>
                      <div className={styles.inspectorInfo}>
                        <div className={styles.inspectorName}>{inspector.name}</div>
                        <div className={styles.inspectorRole}>{inspector.role}</div>
                      </div>
                      <div
                        className={`${styles.availabilityBadge} ${getAvailabilityClass(inspector.availability)}`}
                      >
                        {inspector.availability === 'available' && '●'}
                        {inspector.availability === 'busy' && '●'}
                        {inspector.availability === 'offline' && '●'}
                      </div>
                    </div>

                    <div className={styles.workloadBar}>
                      <div className={styles.workloadLabel}>
                        Công việc: {inspector.currentLoad}/{inspector.maxCapacity}
                      </div>
                      <div className={styles.workloadProgress}>
                        <div
                          className={styles.workloadFill}
                          style={{
                            width: `${(inspector.currentLoad / inspector.maxCapacity) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className={styles.inspectorStats}>
                      <div className={styles.statItem}>
                        <span className={styles.statLabel}>Hiệu suất:</span>
                        <span className={styles.statValue}>{inspector.performance}%</span>
                      </div>
                      <div className={styles.statItem}>
                        <span className={styles.statLabel}>Hoàn thành hôm nay:</span>
                        <span className={styles.statValue}>{inspector.completedToday}</span>
                      </div>
                    </div>

                    <div className={styles.specialties}>
                      {inspector.specialties.map((s, i) => (
                        <span key={i} className={styles.specialtyTag}>
                          {s}
                        </span>
                      ))}
                    </div>

                    <div className={styles.location}>
                      <MapPin size={12} />
                      <span>{inspector.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Assignment Action */}
          {selectedLead && selectedInspector && (
            <div className={styles.assignmentAction}>
              <div className={styles.actionContent}>
                <div className={styles.actionSummary}>
                  <ArrowRight size={24} />
                  <div>
                    <strong>{selectedLead.leadId}</strong> → <strong>{selectedInspector.name}</strong>
                  </div>
                </div>

                <button className={styles.dispatchButton} onClick={handleDispatch}>
                  <Send size={16} />
                  Xác nhận phân công
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Dispatched View */}
      {activeView === 'dispatched' && (
        <div className={styles.content}>
          <div className={styles.emptyState}>
            <CheckCircle size={64} />
            <h3>Đã phân công</h3>
            <p>Xem danh sách lead đã được phân công cho thanh tra viên</p>
          </div>
        </div>
      )}

      {/* Performance View */}
      {activeView === 'performance' && (
        <div className={styles.content}>
          <div className={styles.emptyState}>
            <BarChart3 size={64} />
            <h3>Báo cáo hiệu suất</h3>
            <p>Phân tích hiệu suất và năng suất của thanh tra viên</p>
          </div>
        </div>
      )}
    </div>
  );
}
