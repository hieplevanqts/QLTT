import { useState } from 'react';
import { 
  Clock, 
  AlertTriangle, 
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Users,
  MapPin,
  Calendar,
  Download,
  Filter,
  BarChart3,
  Map,
  X,
  Navigation,
  Search,
  ChevronDown,
  ZoomIn,
  Layers,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { Breadcrumb } from '../../app/components/Breadcrumb';
import SLAOperationMap from './SLAOperationMap';
import styles from './SLADashboard.module.css';

type TimeRange = '24h' | '7d' | '30d';
type SLAStatus = 'onTrack' | 'atRisk' | 'overdue';
type LeadStatus = 'assigned' | 'inVerification' | 'escalated';
type Urgency = 'low' | 'medium' | 'high' | 'critical';
type TimeWindow = 'today' | '24h' | '48h' | 'overdue';

interface MapFilters {
  slaStatus: SLAStatus[];
  organizations: string[];
  leadStatus: LeadStatus[];
  urgency: Urgency[];
  timeWindow: TimeWindow[];
  areas: string[];
  topics: string[];
}

interface Lead {
  id: string;
  title: string;
  lat: number;
  lng: number;
  urgency: Urgency;
  slaStatus: SLAStatus;
  assignedTo: string;
  deadline: string;
  status: LeadStatus;
  topic: string;
  area: string;
}

// Mock data
const overallMetrics = {
  totalLeads: 156,
  withinSLA: 128,
  atRisk: 18,
  breached: 10,
  slaCompliance: 82.1,
  avgResponseTime: '3.2h',
  avgResolutionTime: '18.4h',
};

const byTeam = [
  { team: 'Đội 24 - TP.HCM số 4', total: 45, withinSLA: 32, atRisk: 8, breached: 5, compliance: 71.1, location: { lat: 10.7756, lng: 106.7019, address: 'Quận 1, TP.HCM' }, activeMembers: 8 },
  { team: 'Đội 01 - QLTT số 1', total: 38, withinSLA: 34, atRisk: 3, breached: 1, compliance: 89.5, location: { lat: 21.0285, lng: 105.8542, address: 'Hoàn Kiếm, Hà Nội' }, activeMembers: 6 },
  { team: 'Đội 02 - QLTT số 2', total: 32, withinSLA: 29, atRisk: 2, breached: 1, compliance: 90.6, location: { lat: 21.0245, lng: 105.8412, address: 'Ba Đình, Hà Nội' }, activeMembers: 5 },
  { team: 'Đội 15 - Hà Nội số 3', total: 28, withinSLA: 23, atRisk: 3, breached: 2, compliance: 82.1, location: { lat: 21.0122, lng: 105.8256, address: 'Đống Đa, Hà Nội' }, activeMembers: 7 },
  { team: 'Đội 07 - Đà Nẵng số 1', total: 13, withinSLA: 10, atRisk: 2, breached: 1, compliance: 76.9, location: { lat: 16.0544, lng: 108.2022, address: 'Hải Châu, Đà Nẵng' }, activeMembers: 4 },
];

const byUrgency = [
  { level: 'Critical', total: 12, withinSLA: 9, atRisk: 2, breached: 1, avgTime: '4.2h', slaTarget: '6h' },
  { level: 'High', total: 35, withinSLA: 28, atRisk: 5, breached: 2, avgTime: '8.5h', slaTarget: '12h' },
  { level: 'Medium', total: 68, withinSLA: 58, atRisk: 7, breached: 3, avgTime: '16.3h', slaTarget: '24h' },
  { level: 'Low', total: 41, withinSLA: 33, atRisk: 4, breached: 4, avgTime: '38.2h', slaTarget: '72h' },
];

const backlog = [
  { team: 'Đội 24', backlog: 12, avgAge: '3.2 ngày', oldest: '8 ngày', trend: 'up' },
  { team: 'Đội 01', backlog: 6, avgAge: '1.8 ngày', oldest: '4 ngày', trend: 'down' },
  { team: 'Đội 02', backlog: 4, avgAge: '1.2 ngày', oldest: '3 ngày', trend: 'stable' },
  { team: 'Đội 15', backlog: 8, avgAge: '2.5 ngày', oldest: '6 ngày', trend: 'up' },
];

export default function SLADashboard() {
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  return (
    <div className={styles.container}>
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Nguồn tin, Rủi ro', path: '/lead-risk/inbox' },
          { label: 'Giám sát SLA' },
        ]}
      />

      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.titleRow}>
            <div className={styles.titleSection}>
              <Clock size={32} className={styles.titleIcon} />
              <div>
                <h1 className={styles.title}>Bảng điều khiển thỏa thuận mức dịch vụ</h1>
                <p className={styles.subtitle}>Giám sát hiệu suất xử lý và tuân thủ thỏa thuận</p>
              </div>
            </div>
            <div className={styles.headerActions}>
              <button 
                className={styles.mapButton}
                onClick={() => setIsMapModalOpen(true)}
              >
                <Map size={16} />
                Xem bản đồ
              </button>
              <select 
                value={timeRange} 
                onChange={(e) => setTimeRange(e.target.value as TimeRange)}
                className={styles.timeRangeSelect}
              >
                <option value="24h">24 giờ qua</option>
                <option value="7d">7 ngày qua</option>
                <option value="30d">30 ngày qua</option>
              </select>
              <button className={styles.exportBtn}>
                <Download size={16} />
                Xuất báo cáo
              </button>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className={styles.overviewGrid}>
          <div className={styles.overviewCard}>
            <div className={styles.cardIcon} style={{ background: 'rgba(15, 202, 122, 0.1)', color: 'var(--chart-4)' }}>
              <CheckCircle2 size={24} />
            </div>
            <div className={styles.cardContent}>
              <div className={styles.cardLabel}>Trong hạn</div>
              <div className={styles.cardValue}>{overallMetrics.withinSLA}</div>
              <div className={styles.cardMeta}>
                {((overallMetrics.withinSLA / overallMetrics.totalLeads) * 100).toFixed(1)}% tổng tín hiệu
              </div>
            </div>
          </div>

          <div className={styles.overviewCard}>
            <div className={styles.cardIcon} style={{ background: 'rgba(255, 159, 64, 0.1)', color: 'var(--chart-2)' }}>
              <AlertTriangle size={24} />
            </div>
            <div className={styles.cardContent}>
              <div className={styles.cardLabel}>Sắp quá hạn</div>
              <div className={styles.cardValue}>{overallMetrics.atRisk}</div>
              <div className={styles.cardMeta}>
                Cần xử lý khẩn cấp
              </div>
            </div>
          </div>

          <div className={styles.overviewCard}>
            <div className={styles.cardIcon} style={{ background: 'rgba(249, 65, 68, 0.1)', color: 'var(--chart-1)' }}>
              <Clock size={24} />
            </div>
            <div className={styles.cardContent}>
              <div className={styles.cardLabel}>Đã quá hạn</div>
              <div className={styles.cardValue}>{overallMetrics.breached}</div>
              <div className={styles.cardMeta}>
                Vượt thời hạn xử lý
              </div>
            </div>
          </div>

          <div className={styles.overviewCard}>
            <div className={styles.cardIcon} style={{ background: 'rgba(0, 92, 182, 0.1)', color: 'var(--primary)' }}>
              <BarChart3 size={24} />
            </div>
            <div className={styles.cardContent}>
              <div className={styles.cardLabel}>Tuân thủ thỏa thuận</div>
              <div className={styles.cardValue}>{overallMetrics.slaCompliance}%</div>
              <div className={styles.cardMeta}>
                <TrendingUp size={14} />
                +2.3% so tháng trước
              </div>
            </div>
          </div>
        </div>

        {/* SLA by Team */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Tuân thủ thỏa thuận theo đơn vị</h2>
          </div>
          <div className={styles.tableCard}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Đơn vị</th>
                  <th>Tổng tín hiệu</th>
                  <th>Trong hạn</th>
                  <th>Sắp hạn</th>
                  <th>Quá hạn</th>
                  <th>Tuân thủ</th>
                </tr>
              </thead>
              <tbody>
                {byTeam.map((team, idx) => (
                  <tr key={idx}>
                    <td>
                      <div className={styles.teamCell}>
                        <Users size={16} />
                        {team.team}
                      </div>
                    </td>
                    <td>{team.total}</td>
                    <td>
                      <span className={styles.badge} data-type="success">
                        {team.withinSLA}
                      </span>
                    </td>
                    <td>
                      <span className={styles.badge} data-type="warning">
                        {team.atRisk}
                      </span>
                    </td>
                    <td>
                      <span className={styles.badge} data-type="error">
                        {team.breached}
                      </span>
                    </td>
                    <td>
                      <div className={styles.complianceCell}>
                        <div className={styles.complianceBar}>
                          <div 
                            className={styles.complianceFill}
                            style={{ 
                              width: `${team.compliance}%`,
                              background: team.compliance >= 85 ? 'var(--chart-4)' : team.compliance >= 70 ? 'var(--chart-2)' : 'var(--chart-1)'
                            }}
                          />
                        </div>
                        <span className={styles.complianceValue}>{team.compliance}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SLA by Urgency */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Hiệu suất xử lý theo mức độ khẩn</h2>
          </div>
          <div className={styles.tableCard}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Mức độ khẩn</th>
                  <th>Tổng</th>
                  <th>Trong hạn</th>
                  <th>Sắp hạn</th>
                  <th>Quá hạn</th>
                  <th>TG trung bình</th>
                  <th>Mục tiêu</th>
                </tr>
              </thead>
              <tbody>
                {byUrgency.map((item, idx) => (
                  <tr key={idx}>
                    <td>
                      <span className={styles.urgencyBadge} data-urgency={item.level.toLowerCase()}>
                        {item.level}
                      </span>
                    </td>
                    <td>{item.total}</td>
                    <td>
                      <span className={styles.badge} data-type="success">
                        {item.withinSLA}
                      </span>
                    </td>
                    <td>
                      <span className={styles.badge} data-type="warning">
                        {item.atRisk}
                      </span>
                    </td>
                    <td>
                      <span className={styles.badge} data-type="error">
                        {item.breached}
                      </span>
                    </td>
                    <td>{item.avgTime}</td>
                    <td className={styles.targetCell}>{item.slaTarget}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Backlog */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Tồn đọng & Thời gian chờ</h2>
            <p className={styles.sectionDesc}>Tín hiệu chưa được xử lý</p>
          </div>
          <div className={styles.backlogGrid}>
            {backlog.map((item, idx) => (
              <div key={idx} className={styles.backlogCard}>
                <div className={styles.backlogHeader}>
                  <h4>{item.team}</h4>
                  <span className={styles.backlogCount}>{item.backlog}</span>
                </div>
                <div className={styles.backlogBody}>
                  <div className={styles.backlogRow}>
                    <span>TG trung bình:</span>
                    <span>{item.avgAge}</span>
                  </div>
                  <div className={styles.backlogRow}>
                    <span>Lâu nhất:</span>
                    <span className={styles.warningText}>{item.oldest}</span>
                  </div>
                </div>
                <div className={styles.backlogTrend} data-trend={item.trend}>
                  {item.trend === 'up' && (
                    <>
                      <TrendingUp size={14} />
                      Tăng
                    </>
                  )}
                  {item.trend === 'down' && (
                    <>
                      <TrendingDown size={14} />
                      Giảm
                    </>
                  )}
                  {item.trend === 'stable' && '→ Ổn định'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Escalation Summary */}
        {/* REMOVED: Tổng hợp báo cáo cấp trên */}

        {/* Insights */}
        {/* REMOVED: Nhận định lãnh đạo */}
      </div>

      {/* SLA Operation Map Modal */}
      <SLAOperationMap
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
      />
    </div>
  );
}