import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Phone,
  Mail,
  Calendar,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  FileText,
  Activity,
  Target,
  Shield,
  BarChart3,
  ListChecks,
  Plus,
  ExternalLink,
} from 'lucide-react';
import styles from './EntityRiskProfile.module.css';

interface RiskFactor {
  factor: string;
  score: number;
  weight: number;
  impact: 'critical' | 'high' | 'medium' | 'low';
  description: string;
}

interface Incident {
  id: string;
  date: string;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'resolved' | 'in_progress' | 'pending';
  description: string;
  leadId: string;
}

interface Evidence {
  id: string;
  type: string;
  date: string;
  description: string;
  fileCount: number;
}

interface NextAction {
  action: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  assignee: string;
}

export default function EntityRiskProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'incidents' | 'evidence' | 'actions'>('overview');

  // Mock store data
  const store = {
    id: id || 'STR-2024-001',
    name: 'Cửa hàng điện thoại ABC',
    businessName: 'Công ty TNHH Thương mại ABC',
    address: '123 Nguyễn Huệ, Phường Bến Nghé',
    district: 'Quận 1',
    city: 'TP. Hồ Chí Minh',
    phone: '028 3829 1234',
    email: 'contact@abc-store.vn',
    businessLicense: 'GP 01234567',
    registrationDate: '2020-03-15',
    owner: 'Nguyễn Văn A',
    businessType: 'Kinh doanh điện thoại di động',
  };

  // Mock risk profile
  const riskProfile = {
    overallScore: 78,
    previousScore: 65,
    trend: 'increasing' as const,
    level: 'high' as const,
    lastUpdated: '2025-01-09T10:30:00',
    totalIncidents: 12,
    activeIncidents: 3,
    resolvedIncidents: 9,
  };

  // Mock risk factors
  const riskFactors: RiskFactor[] = [
    {
      factor: 'Lịch sử vi phạm',
      score: 85,
      weight: 30,
      impact: 'critical',
      description: '12 vụ vi phạm trong 24 tháng, bao gồm 3 vụ hàng giả',
    },
    {
      factor: 'Tần suất khiếu nại',
      score: 72,
      weight: 25,
      impact: 'high',
      description: 'Trung bình 2 khiếu nại/tháng từ khách hàng',
    },
    {
      factor: 'Mức độ tuân thủ',
      score: 45,
      weight: 20,
      impact: 'high',
      description: 'Không cung cấp đầy đủ hóa đơn, chứng từ',
    },
    {
      factor: 'Vị trí địa lý',
      score: 68,
      weight: 15,
      impact: 'medium',
      description: 'Nằm trong khu vực có mật độ vi phạm cao',
    },
    {
      factor: 'Quy mô kinh doanh',
      score: 55,
      weight: 10,
      impact: 'medium',
      description: 'Doanh thu lớn, ảnh hưởng rộng nếu vi phạm',
    },
  ];

  // Mock incidents
  const incidents: Incident[] = [
    {
      id: 'L-2024-1234',
      date: '2025-01-05',
      type: 'Hàng giả',
      severity: 'critical',
      status: 'in_progress',
      description: 'Phát hiện bán điện thoại giả mạo nhãn hiệu Apple',
      leadId: 'L-2024-1234',
    },
    {
      id: 'L-2024-1156',
      date: '2025-01-01',
      type: 'Vi phạm niêm yết giá',
      severity: 'medium',
      status: 'resolved',
      description: 'Không niêm yết giá đầy đủ',
      leadId: 'L-2024-1156',
    },
    {
      id: 'L-2023-2891',
      date: '2024-12-20',
      type: 'Không có hóa đơn',
      severity: 'high',
      status: 'resolved',
      description: 'Bán hàng không cung cấp hóa đơn VAT',
      leadId: 'L-2023-2891',
    },
    {
      id: 'L-2023-2654',
      date: '2024-11-15',
      type: 'Hàng nhập lậu',
      severity: 'critical',
      status: 'resolved',
      description: 'Phát hiện 50 điện thoại nhập lậu',
      leadId: 'L-2023-2654',
    },
  ];

  // Mock evidence
  const evidenceList: Evidence[] = [
    {
      id: 'EV-001',
      type: 'Biên bản thanh tra',
      date: '2025-01-05',
      description: 'Biên bản thanh tra đột xuất ngày 05/01/2025',
      fileCount: 5,
    },
    {
      id: 'EV-002',
      type: 'Hình ảnh hiện trường',
      date: '2025-01-05',
      description: 'Hình ảnh sản phẩm vi phạm',
      fileCount: 12,
    },
    {
      id: 'EV-003',
      type: 'Chứng từ kinh doanh',
      date: '2024-12-20',
      description: 'Giấy phép kinh doanh và chứng từ liên quan',
      fileCount: 8,
    },
  ];

  // Mock next actions
  const nextActions: NextAction[] = [
    {
      action: 'Thanh tra định kỳ 3 tháng',
      priority: 'high',
      dueDate: '2025-04-01',
      assignee: 'Nguyễn Văn A',
    },
    {
      action: 'Xác minh nguồn gốc hàng hóa',
      priority: 'high',
      dueDate: '2025-01-20',
      assignee: 'Trần Thị B',
    },
    {
      action: 'Kiểm tra hóa đơn chứng từ',
      priority: 'medium',
      dueDate: '2025-02-01',
      assignee: 'Lê Văn C',
    },
  ];

  const getRiskLevelClass = (level: string) => {
    const classes = {
      critical: styles.riskCritical,
      high: styles.riskHigh,
      medium: styles.riskMedium,
      low: styles.riskLow,
    };
    return classes[level as keyof typeof classes] || '';
  };

  const getRiskLevelLabel = (level: string) => {
    const labels = {
      critical: 'Rất cao',
      high: 'Cao',
      medium: 'Trung bình',
      low: 'Thấp',
    };
    return labels[level as keyof typeof labels] || level;
  };

  const getSeverityClass = (severity: string) => {
    const classes = {
      critical: styles.severityCritical,
      high: styles.severityHigh,
      medium: styles.severityMedium,
      low: styles.severityLow,
    };
    return classes[severity as keyof typeof classes] || '';
  };

  const getStatusClass = (status: string) => {
    const classes = {
      resolved: styles.statusResolved,
      in_progress: styles.statusInProgress,
      pending: styles.statusPending,
    };
    return classes[status as keyof typeof classes] || '';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      resolved: 'Đã xử lý',
      in_progress: 'Đang xử lý',
      pending: 'Chờ xử lý',
    };
    return labels[status as keyof typeof labels] || status;
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          <ArrowLeft size={16} />
        </button>

        <div className={styles.titleGroup}>
          <h1 className={styles.title}>Hồ sơ rủi ro cơ sở</h1>
          <p className={styles.subtitle}>{store.id}</p>
        </div>

        <div className={styles.headerActions}>
          <button className={styles.actionButton}>
            <Eye size={16} />
            Theo dõi
          </button>
          <button className={styles.actionButton}>
            <Plus size={16} />
            Tạo kế hoạch
          </button>
        </div>
      </div>

      {/* Store Info Card */}
      <div className={styles.storeCard}>
        <div className={styles.storeHeader}>
          <div className={styles.storeIcon}>
            <Building2 size={32} />
          </div>
          <div className={styles.storeInfo}>
            <h2 className={styles.storeName}>{store.name}</h2>
            <div className={styles.businessName}>{store.businessName}</div>
            <div className={styles.storeMetaGrid}>
              <div className={styles.metaItem}>
                <MapPin size={14} />
                <span>{store.address}, {store.district}, {store.city}</span>
              </div>
              <div className={styles.metaItem}>
                <Phone size={14} />
                <span>{store.phone}</span>
              </div>
              <div className={styles.metaItem}>
                <Mail size={14} />
                <span>{store.email}</span>
              </div>
              <div className={styles.metaItem}>
                <Calendar size={14} />
                <span>Đăng ký: {new Date(store.registrationDate).toLocaleDateString('vi-VN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Score Summary */}
      <div className={styles.riskSummary}>
        <div className={styles.scoreCard}>
          <div className={styles.scoreLabel}>Điểm rủi ro tổng thể</div>
          <div className={styles.scoreDisplay}>
            <div className={`${styles.scoreValue} ${getRiskLevelClass(riskProfile.level)}`}>
              {riskProfile.overallScore}
            </div>
            <div className={styles.scoreTrend}>
              {riskProfile.trend === 'increasing' ? (
                <TrendingUp size={20} className={styles.trendUp} />
              ) : (
                <TrendingDown size={20} className={styles.trendDown} />
              )}
              <span>+{riskProfile.overallScore - riskProfile.previousScore} từ tháng trước</span>
            </div>
          </div>
          <div className={`${styles.riskLevel} ${getRiskLevelClass(riskProfile.level)}`}>
            <Shield size={16} />
            Mức độ: {getRiskLevelLabel(riskProfile.level)}
          </div>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <AlertTriangle size={24} />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{riskProfile.activeIncidents}</div>
              <div className={styles.statLabel}>Vi phạm đang xử lý</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <CheckCircle size={24} />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{riskProfile.resolvedIncidents}</div>
              <div className={styles.statLabel}>Vi phạm đã xử lý</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Activity size={24} />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{riskProfile.totalIncidents}</div>
              <div className={styles.statLabel}>Tổng số vi phạm</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'overview' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <BarChart3 size={16} />
          Phân tích rủi ro
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'incidents' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('incidents')}
        >
          <AlertTriangle size={16} />
          Lịch sử vi phạm
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'evidence' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('evidence')}
        >
          <FileText size={16} />
          Chứng từ liên quan
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'actions' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('actions')}
        >
          <Target size={16} />
          Hành động tiếp theo
        </button>
      </div>

      {/* Tab Content */}
      <div className={styles.tabContent}>
        {activeTab === 'overview' && (
          <div className={styles.overviewTab}>
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Các yếu tố rủi ro</h3>
              <div className={styles.factorsList}>
                {riskFactors.map((factor, index) => (
                  <div key={index} className={styles.factorCard}>
                    <div className={styles.factorHeader}>
                      <div className={styles.factorInfo}>
                        <div className={styles.factorName}>{factor.factor}</div>
                        <div className={styles.factorDescription}>{factor.description}</div>
                      </div>
                      <div className={`${styles.impactBadge} ${getSeverityClass(factor.impact)}`}>
                        {factor.impact === 'critical' && 'Nghiêm trọng'}
                        {factor.impact === 'high' && 'Cao'}
                        {factor.impact === 'medium' && 'Trung bình'}
                        {factor.impact === 'low' && 'Thấp'}
                      </div>
                    </div>
                    <div className={styles.factorMetrics}>
                      <div className={styles.metricItem}>
                        <div className={styles.metricLabel}>Điểm số</div>
                        <div className={styles.metricValue}>{factor.score}/100</div>
                      </div>
                      <div className={styles.metricItem}>
                        <div className={styles.metricLabel}>Trọng số</div>
                        <div className={styles.metricValue}>{factor.weight}%</div>
                      </div>
                      <div className={styles.metricItem}>
                        <div className={styles.metricLabel}>Đóng góp</div>
                        <div className={styles.metricValue}>
                          {((factor.score * factor.weight) / 100).toFixed(1)}
                        </div>
                      </div>
                    </div>
                    <div className={styles.progressBar}>
                      <div
                        className={`${styles.progressFill} ${getSeverityClass(factor.impact)}`}
                        style={{ width: `${factor.score}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.recommendations}>
              <h3 className={styles.sectionTitle}>Khuyến nghị</h3>
              <div className={styles.recommendationsList}>
                <div className={styles.recommendationItem}>
                  <AlertTriangle size={20} className={styles.recommendationIcon} />
                  <div>
                    <div className={styles.recommendationTitle}>Tăng cường giám sát</div>
                    <div className={styles.recommendationText}>
                      Nên tiến hành thanh tra định kỳ 3 tháng/lần do lịch sử vi phạm nghiêm trọng
                    </div>
                  </div>
                </div>
                <div className={styles.recommendationItem}>
                  <ListChecks size={20} className={styles.recommendationIcon} />
                  <div>
                    <div className={styles.recommendationTitle}>Kiểm tra nguồn gốc</div>
                    <div className={styles.recommendationText}>
                      Yêu cầu xuất trình đầy đủ chứng từ nguồn gốc hàng hóa
                    </div>
                  </div>
                </div>
                <div className={styles.recommendationItem}>
                  <Eye size={20} className={styles.recommendationIcon} />
                  <div>
                    <div className={styles.recommendationTitle}>Thêm vào watchlist</div>
                    <div className={styles.recommendationText}>
                      Đưa vào danh sách theo dõi đặc biệt để cảnh báo sớm
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'incidents' && (
          <div className={styles.incidentsTab}>
            <div className={styles.incidentsList}>
              {incidents.map((incident) => (
                <div key={incident.id} className={styles.incidentCard}>
                  <div className={styles.incidentHeader}>
                    <div className={styles.incidentId}>{incident.id}</div>
                    <div className={styles.incidentBadges}>
                      <span className={`${styles.severityBadge} ${getSeverityClass(incident.severity)}`}>
                        {incident.type}
                      </span>
                      <span className={`${styles.statusBadge} ${getStatusClass(incident.status)}`}>
                        {getStatusLabel(incident.status)}
                      </span>
                    </div>
                  </div>
                  <div className={styles.incidentDescription}>{incident.description}</div>
                  <div className={styles.incidentFooter}>
                    <div className={styles.incidentDate}>
                      <Calendar size={14} />
                      {new Date(incident.date).toLocaleDateString('vi-VN')}
                    </div>
                    <button
                      className={styles.viewLeadButton}
                      onClick={() => navigate(`/lead-risk/lead/${incident.leadId}`)}
                    >
                      <ExternalLink size={14} />
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'evidence' && (
          <div className={styles.evidenceTab}>
            <div className={styles.evidenceList}>
              {evidenceList.map((evidence) => (
                <div key={evidence.id} className={styles.evidenceCard}>
                  <div className={styles.evidenceIcon}>
                    <FileText size={32} />
                  </div>
                  <div className={styles.evidenceContent}>
                    <div className={styles.evidenceType}>{evidence.type}</div>
                    <div className={styles.evidenceDescription}>{evidence.description}</div>
                    <div className={styles.evidenceMeta}>
                      <span>
                        <Calendar size={14} />
                        {new Date(evidence.date).toLocaleDateString('vi-VN')}
                      </span>
                      <span>{evidence.fileCount} tệp</span>
                    </div>
                  </div>
                  <button className={styles.viewButton}>
                    <Eye size={16} />
                    Xem
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'actions' && (
          <div className={styles.actionsTab}>
            <div className={styles.actionsList}>
              {nextActions.map((action, index) => (
                <div key={index} className={styles.actionCard}>
                  <div className={styles.actionContent}>
                    <div className={styles.actionHeader}>
                      <div className={styles.actionTitle}>{action.action}</div>
                      <span className={`${styles.priorityBadge} ${styles[`priority${action.priority}`]}`}>
                        {action.priority === 'high' && 'Cao'}
                        {action.priority === 'medium' && 'Trung bình'}
                        {action.priority === 'low' && 'Thấp'}
                      </span>
                    </div>
                    <div className={styles.actionMeta}>
                      <div className={styles.actionMetaItem}>
                        <Clock size={14} />
                        Hạn: {new Date(action.dueDate).toLocaleDateString('vi-VN')}
                      </div>
                      <div className={styles.actionMetaItem}>
                        <Activity size={14} />
                        Phân công: {action.assignee}
                      </div>
                    </div>
                  </div>
                  <button className={styles.completeButton}>
                    <CheckCircle size={16} />
                    Hoàn thành
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
