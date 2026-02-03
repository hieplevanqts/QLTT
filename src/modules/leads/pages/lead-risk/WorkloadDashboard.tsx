import { useState } from 'react';
import {
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Download,
  Calendar,
  ListTodo,
  Activity,
  X,
  Circle,
  CircleDot,
  CircleCheck
} from 'lucide-react';
import styles from './WorkloadDashboard.module.css';

type ViewMode = 'team' | 'individual' | 'tasks';

// Mock data
const teamStats = [
  {
    teamId: 'team-24',
    name: 'Đội 24 - Hà Nội số 4',
    members: 8,
    activeLeads: 45,
    capacity: 80,
    avgLoadPerPerson: 5.6,
    overloaded: 2,
    slaRisk: 12,
    closedToday: 8,
    closedThisWeek: 34,
  },
  {
    teamId: 'team-01',
    name: 'Đội 01 - Quản lý thị trường số 1',
    members: 6,
    activeLeads: 38,
    capacity: 60,
    avgLoadPerPerson: 6.3,
    overloaded: 1,
    slaRisk: 8,
    closedToday: 5,
    closedThisWeek: 28,
  },
  {
    teamId: 'team-02',
    name: 'Đội 02 - Quản lý thị trường số 2',
    members: 7,
    activeLeads: 28,
    capacity: 70,
    avgLoadPerPerson: 4.0,
    overloaded: 0,
    slaRisk: 3,
    closedToday: 6,
    closedThisWeek: 31,
  },
];

const individualStats = [
  {
    userId: 'QT24_NGUYENVANA',
    name: 'Nguyễn Văn A',
    teamId: 'team-24',
    teamName: 'Đội 24',
    activeLeads: 12,
    capacity: 10,
    status: 'overloaded',
    slaRisk: 5,
    avgResponseTime: '2.3h',
    closedThisWeek: 8,
    accuracy: 81.4,
  },
  {
    userId: 'QT24_TRANTHIB',
    name: 'Trần Thị B',
    teamId: 'team-24',
    teamName: 'Đội 24',
    activeLeads: 9,
    capacity: 10,
    status: 'optimal',
    slaRisk: 2,
    avgResponseTime: '3.1h',
    closedThisWeek: 7,
    accuracy: 77.8,
  },
  {
    userId: 'QT24_LEVANC',
    name: 'Lê Văn C',
    teamId: 'team-24',
    teamName: 'Đội 24',
    activeLeads: 11,
    capacity: 10,
    status: 'overloaded',
    slaRisk: 4,
    avgResponseTime: '4.2h',
    closedThisWeek: 6,
    accuracy: 60.0,
  },
  {
    userId: 'QT24_PHAMMINHD',
    name: 'Phạm Minh D',
    teamId: 'team-24',
    teamName: 'Đội 24',
    activeLeads: 3,
    capacity: 10,
    status: 'underutilized',
    slaRisk: 0,
    avgResponseTime: '1.8h',
    closedThisWeek: 5,
    accuracy: 32.0,
  },
  {
    userId: 'QT01_HOANGVANE',
    name: 'Hoàng Văn E',
    teamId: 'team-01',
    teamName: 'Đội 01',
    activeLeads: 8,
    capacity: 10,
    status: 'optimal',
    slaRisk: 1,
    avgResponseTime: '2.8h',
    closedThisWeek: 9,
    accuracy: 75.3,
  },
];

const bottlenecks = [
  {
    type: 'Cán bộ quá tải',
    analyst: 'Nguyễn Văn A',
    team: 'Đội 24',
    severity: 'high',
    description: '12/10 nguồn tin đang xử lý, 5 nguồn tin có nguy cơ quá hạn SLA',
    action: 'Phân phối lại hoặc tăng hỗ trợ',
  },
  {
    type: 'Nguy cơ quá hạn SLA',
    analyst: 'Lê Văn C',
    team: 'Đội 24',
    severity: 'medium',
    description: '4 nguồn tin sắp hết hạn SLA, thời gian phản hồi trung bình cao',
    action: 'Ưu tiên xử lý nguồn tin sắp hết hạn',
  },
  {
    type: 'Độ chính xác thấp',
    analyst: 'Phạm Minh D',
    team: 'Đội 24',
    severity: 'medium',
    description: 'Độ chính xác 32%, thấp hơn trung bình đội 65%',
    action: 'Đánh giá lại quy trình và đào tạo',
  },
  {
    type: 'Chưa tận dụng hết',
    analyst: 'Phạm Minh D',
    team: 'Đội 24',
    severity: 'low',
    description: 'Chỉ 3/10 nguồn tin, có thể nhận thêm',
    action: 'Phân công thêm nguồn tin từ Nguyễn Văn A',
  },
];

type TaskStatus = 'todo' | 'in_progress' | 'completed' | 'overdue';
type TaskPriority = 'critical' | 'high' | 'medium' | 'low';

interface Task {
  id: string;
  title: string;
  leadCode: string;
  leadTitle: string;
  assignedTo: string;
  assignedToId: string;
  teamName: string;
  deadline: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: string;
  completedAt?: string;
  description: string;
  hoursRemaining: number;
}

const tasksData: Task[] = [
  {
    id: 'T001',
    title: 'Xác minh thông tin cửa hàng Bách Hóa Xanh',
    leadCode: 'LD24-0125',
    leadTitle: 'Báo cáo bán hàng hết hạn',
    assignedTo: 'Nguyễn Văn A',
    assignedToId: 'QT24_NGUYENVANA',
    teamName: 'Đội 24',
    deadline: '2025-01-13T17:00:00Z',
    status: 'overdue',
    priority: 'critical',
    createdAt: '2025-01-10T08:00:00Z',
    description: 'Kiểm tra giấy phép kinh doanh và nguồn gốc hàng hóa',
    hoursRemaining: -8,
  },
  {
    id: 'T002',
    title: 'Thu thập bằng chứng vi phạm',
    leadCode: 'LD24-0138',
    leadTitle: 'Phát hiện thuốc giả',
    assignedTo: 'Trần Thị B',
    assignedToId: 'QT24_TRANTHIB',
    teamName: 'Đội 24',
    deadline: '2025-01-14T10:00:00Z',
    status: 'in_progress',
    priority: 'high',
    createdAt: '2025-01-11T14:00:00Z',
    description: 'Chụp ảnh, lấy mẫu sản phẩm để kiểm nghiệm',
    hoursRemaining: 18,
  },
  {
    id: 'T003',
    title: 'Soạn báo cáo xử lý vi phạm',
    leadCode: 'LD24-0089',
    leadTitle: 'Mỹ phẩm không rõ nguồn gốc',
    assignedTo: 'Lê Văn C',
    assignedToId: 'QT24_LEVANC',
    teamName: 'Đội 24',
    deadline: '2025-01-15T16:00:00Z',
    status: 'in_progress',
    priority: 'medium',
    createdAt: '2025-01-09T09:00:00Z',
    description: 'Tổng hợp kết quả điều tra và đề xuất biện pháp xử lý',
    hoursRemaining: 48,
  },
  {
    id: 'T004',
    title: 'Phỏng vấn nhân chứng',
    leadCode: 'LD24-0142',
    leadTitle: 'Khiếu nại về chất lượng sản phẩm',
    assignedTo: 'Nguyễn Văn A',
    assignedToId: 'QT24_NGUYENVANA',
    teamName: 'Đội 24',
    deadline: '2025-01-13T14:00:00Z',
    status: 'todo',
    priority: 'high',
    createdAt: '2025-01-12T10:00:00Z',
    description: 'Lấy lời khai từ người tiêu dùng và chủ cơ sở',
    hoursRemaining: 6,
  },
  {
    id: 'T005',
    title: 'Kiểm tra hồ sơ pháp lý',
    leadCode: 'LD24-0095',
    leadTitle: 'Nhập khẩu hàng không đúng quy định',
    assignedTo: 'Phạm Minh D',
    assignedToId: 'QT24_PHAMMINHD',
    teamName: 'Đội 24',
    deadline: '2025-01-18T17:00:00Z',
    status: 'todo',
    priority: 'medium',
    createdAt: '2025-01-10T15:00:00Z',
    description: 'Đối chiếu giấy tờ nhập khẩu với quy định hiện hành',
    hoursRemaining: 120,
  },
  {
    id: 'T006',
    title: 'Thanh tra đột xuất cơ sở',
    leadCode: 'LD24-0112',
    leadTitle: 'Nghi ngờ hàng giả',
    assignedTo: 'Hoàng Văn E',
    assignedToId: 'QT01_HOANGVANE',
    teamName: 'Đội 01',
    deadline: '2025-01-14T09:00:00Z',
    status: 'overdue',
    priority: 'critical',
    createdAt: '2025-01-08T08:00:00Z',
    description: 'Kiểm tra kho hàng và xuất xứ sản phẩm',
    hoursRemaining: -3,
  },
  {
    id: 'T007',
    title: 'Cập nhật hồ sơ vụ việc',
    leadCode: 'LD24-0078',
    leadTitle: 'Vi phạm quy định an toàn thực phẩm',
    assignedTo: 'Trần Thị B',
    assignedToId: 'QT24_TRANTHIB',
    teamName: 'Đội 24',
    deadline: '2025-01-12T17:00:00Z',
    status: 'completed',
    priority: 'low',
    createdAt: '2025-01-08T11:00:00Z',
    completedAt: '2025-01-12T15:30:00Z',
    description: 'Nhập liệu kết quả xử lý vào hệ thống',
    hoursRemaining: 0,
  },
  {
    id: 'T008',
    title: 'Lập biên bản vi phạm',
    leadCode: 'LD24-0134',
    leadTitle: 'Bán hàng không tem phiếu',
    assignedTo: 'Lê Văn C',
    assignedToId: 'QT24_LEVANC',
    teamName: 'Đội 24',
    deadline: '2025-01-16T12:00:00Z',
    status: 'todo',
    priority: 'medium',
    createdAt: '2025-01-11T08:00:00Z',
    description: 'Lập biên bản và thu thập chữ ký các bên',
    hoursRemaining: 72,
  },
  {
    id: 'T009',
    title: 'Gửi mẫu kiểm nghiệm',
    leadCode: 'LD24-0138',
    leadTitle: 'Phát hiện thuốc giả',
    assignedTo: 'Nguyễn Văn A',
    assignedToId: 'QT24_NGUYENVANA',
    teamName: 'Đội 24',
    deadline: '2025-01-12T16:00:00Z',
    status: 'completed',
    priority: 'high',
    createdAt: '2025-01-11T10:00:00Z',
    completedAt: '2025-01-12T14:20:00Z',
    description: 'Gửi mẫu sản phẩm đến Viện Kiểm nghiệm',
    hoursRemaining: 0,
  },
  {
    id: 'T010',
    title: 'Họp bàn phương án xử lý',
    leadCode: 'LD24-0125',
    leadTitle: 'Báo cáo bán hàng hết hạn',
    assignedTo: 'Phạm Minh D',
    assignedToId: 'QT24_PHAMMINHD',
    teamName: 'Đội 24',
    deadline: '2025-01-17T10:00:00Z',
    status: 'todo',
    priority: 'low',
    createdAt: '2025-01-12T09:00:00Z',
    description: 'Tổ chức họp với lãnh đạo để quyết định biện pháp xử lý',
    hoursRemaining: 96,
  },
];

import { Breadcrumb } from '@/components/Breadcrumb';

export default function WorkloadDashboard() {
  const [viewMode, setViewMode] = useState<ViewMode>('team');
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailMode, setDetailMode] = useState<'team' | 'individual' | 'task'>('team');
  const [selectedDetail, setSelectedDetail] = useState<any>(null);

  const filteredIndividuals = selectedTeam === 'all'
    ? individualStats
    : individualStats.filter(s => s.teamId === selectedTeam);

  const totalActiveLeads = teamStats.reduce((sum, t) => sum + t.activeLeads, 0);
  const totalCapacity = teamStats.reduce((sum, t) => sum + t.capacity, 0);
  const totalOverloaded = teamStats.reduce((sum, t) => sum + t.overloaded, 0);
  const totalSlaRisk = teamStats.reduce((sum, t) => sum + t.slaRisk, 0);

  const handleTeamClick = (team: any) => {
    setSelectedDetail(team);
    setDetailMode('team');
    setDetailModalOpen(true);
  };

  const handleIndividualClick = (analyst: any) => {
    setSelectedDetail(analyst);
    setDetailMode('individual');
    setDetailModalOpen(true);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedDetail(task);
    setDetailMode('task');
    setDetailModalOpen(true);
  };

  const closeModal = () => {
    setDetailModalOpen(false);
    setSelectedDetail(null);
  };

  return (
    <div className={styles.container}>
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Nguồn tin, Rủi ro', path: '/lead-risk/inbox' },
          { label: 'Quản lý công việc' },
        ]}
      />

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <div className={styles.titleSection}>
            <Activity size={32} className={styles.titleIcon} />
            <div>
              <h1 className={styles.title}>Bảng điều phối công việc</h1>
              <p className={styles.subtitle}>Quản lý công việc và phân bổ nguồn lực</p>
            </div>
          </div>
          <div className={styles.headerActions}>
            <div className={styles.viewToggle}>
              <button
                className={viewMode === 'team' ? styles.viewActive : styles.viewBtn}
                onClick={() => setViewMode('team')}
              >
                <Users size={16} />
                Theo đội
              </button>
              <button
                className={viewMode === 'individual' ? styles.viewActive : styles.viewBtn}
                onClick={() => setViewMode('individual')}
              >
                <Users size={16} />
                Cá nhân
              </button>
              <button
                className={viewMode === 'tasks' ? styles.viewActive : styles.viewBtn}
                onClick={() => setViewMode('tasks')}
              >
                <ListTodo size={16} />
                Nhiệm vụ
              </button>
            </div>
            <button className={styles.exportBtn}>
              <Download size={16} />
              Xuất báo cáo
            </button>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className={styles.overviewGrid}>
        <div className={styles.overviewCard}>
          <div className={styles.cardIcon} style={{ background: 'rgba(0, 92, 182, 0.1)', color: 'var(--primary)' }}>
            <Activity size={24} />
          </div>
          <div className={styles.cardContent}>
            <div className={styles.cardLabel}>Đang xử lý</div>
            <div className={styles.cardValue}>{totalActiveLeads}</div>
            <div className={styles.cardMeta}>
              {((totalActiveLeads / totalCapacity) * 100).toFixed(0)}% công suất
            </div>
          </div>
        </div>

        <div className={styles.overviewCard}>
          <div className={styles.cardIcon} style={{ background: 'rgba(249, 65, 68, 0.1)', color: 'var(--chart-1)' }}>
            <AlertTriangle size={24} />
          </div>
          <div className={styles.cardContent}>
            <div className={styles.cardLabel}>Cán bộ quá tải</div>
            <div className={styles.cardValue}>{totalOverloaded}</div>
            <div className={styles.cardMeta}>
              Cần phân phối lại công việc
            </div>
          </div>
        </div>

        <div className={styles.overviewCard}>
          <div className={styles.cardIcon} style={{ background: 'rgba(255, 159, 64, 0.1)', color: 'var(--chart-2)' }}>
            <Clock size={24} />
          </div>
          <div className={styles.cardContent}>
            <div className={styles.cardLabel}>Có nguy cơ quá hạn</div>
            <div className={styles.cardValue}>{totalSlaRisk}</div>
            <div className={styles.cardMeta}>
              Nguồn tin sắp quá hạn
            </div>
          </div>
        </div>

        <div className={styles.overviewCard}>
          <div className={styles.cardIcon} style={{ background: 'rgba(15, 202, 122, 0.1)', color: 'var(--chart-4)' }}>
            <CheckCircle2 size={24} />
          </div>
          <div className={styles.cardContent}>
            <div className={styles.cardLabel}>Hoàn thành tuần này</div>
            <div className={styles.cardValue}>
              {teamStats.reduce((sum, t) => sum + t.closedThisWeek, 0)}
            </div>
            <div className={styles.cardMeta}>
              <TrendingUp size={14} />
              +12% so tuần trước
            </div>
          </div>
        </div>
      </div>

      {/* Team View */}
      {viewMode === 'team' && (
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <h2>Khối lượng công việc theo đội</h2>
              <p className={styles.sectionDesc}>Tổng quan hiệu suất và công suất của từng đội</p>
            </div>
          </div>

          <div className={styles.tableCard}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Đội</th>
                  <th>Thành viên</th>
                  <th>Công suất</th>
                  <th>Trạng thái</th>
                  <th>TB/người</th>
                  <th>CB quá tải</th>
                  <th>Nguy cơ SLA</th>
                  <th>HT hôm nay</th>
                  <th>HT tuần này</th>
                </tr>
              </thead>
              <tbody>
                {teamStats.map((team) => {
                  const loadPercentage = (team.activeLeads / team.capacity) * 100;
                  const isOverloaded = loadPercentage > 85;
                  const isUnderutilized = loadPercentage < 50;
                  const status = isOverloaded ? 'overloaded' : isUnderutilized ? 'underutilized' : 'optimal';

                  return (
                    <tr key={team.teamId} className={styles.tableRow} data-status={status} onClick={() => handleTeamClick(team)}>
                      <td>
                        <div className={styles.teamNameCell}>
                          <div className={styles.teamIconSmall}>
                            <Users size={16} />
                          </div>
                          <div>
                            <div className={styles.teamName}>{team.name}</div>
                            <div className={styles.teamId}>ID: {team.teamId}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={styles.badge} data-type="primary">
                          {team.members}
                        </span>
                      </td>
                      <td>
                        <div className={styles.capacityCell}>
                          <div className={styles.capacityText}>
                            {team.activeLeads}/{team.capacity}
                          </div>
                          <div className={styles.capacityBarSmall}>
                            <div
                              className={styles.capacityFillSmall}
                              style={{
                                width: `${Math.min(loadPercentage, 100)}%`,
                                backgroundColor: isOverloaded
                                  ? 'var(--chart-1)'
                                  : isUnderutilized
                                    ? 'var(--chart-2)'
                                    : 'var(--chart-4)'
                              }}
                            />
                          </div>
                          <div className={styles.capacityPercent}>
                            {Math.round(loadPercentage)}%
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className={styles.statusBadge} data-status={status}>
                          {isOverloaded && (
                            <>
                              <AlertTriangle size={14} />
                              <span>Quá tải</span>
                            </>
                          )}
                          {isUnderutilized && (
                            <>
                              <TrendingUp size={14} />
                              <span>Còn trống</span>
                            </>
                          )}
                          {!isOverloaded && !isUnderutilized && (
                            <>
                              <CheckCircle2 size={14} />
                              <span>Tối ưu</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className={styles.metricValue}>
                          {team.avgLoadPerPerson.toFixed(1)}
                        </span>
                      </td>
                      <td>
                        {team.overloaded > 0 ? (
                          <span className={styles.badge} data-type="error">
                            {team.overloaded}
                          </span>
                        ) : (
                          <span className={styles.mutedText}>—</span>
                        )}
                      </td>
                      <td>
                        {team.slaRisk > 0 ? (
                          <div className={styles.slaRiskCell}>
                            <span className={styles.badge} data-type="warning">
                              {team.slaRisk}
                            </span>
                          </div>
                        ) : (
                          <span className={styles.mutedText}>—</span>
                        )}
                      </td>
                      <td>
                        <span className={styles.completedValue}>
                          {team.closedToday}
                        </span>
                      </td>
                      <td>
                        <span className={styles.completedValue}>
                          {team.closedThisWeek}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Individual View */}
      {viewMode === 'individual' && (
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <h2>Khối lượng công việc cá nhân</h2>
              <p className={styles.sectionDesc}>Hiệu suất và công việc của từng cán bộ</p>
            </div>
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className={styles.teamFilter}
            >
              <option value="all">Tất cả đội</option>
              {teamStats.map(t => (
                <option key={t.teamId} value={t.teamId}>{t.name}</option>
              ))}
            </select>
          </div>

          <div className={styles.tableCard}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Cán bộ</th>
                  <th>Đội</th>
                  <th>Công suất</th>
                  <th>Trạng thái</th>
                  <th>TG phản hồi</th>
                  <th>Nguy cơ SLA</th>
                  <th>Độ chính xác</th>
                  <th>HT tuần này</th>
                </tr>
              </thead>
              <tbody>
                {filteredIndividuals.map((analyst) => {
                  const loadPercentage = (analyst.activeLeads / analyst.capacity) * 100;
                  const isOverloaded = analyst.status === 'overloaded';
                  const isUnderutilized = analyst.status === 'underutilized';

                  return (
                    <tr key={analyst.userId} className={styles.tableRow} data-status={analyst.status} onClick={() => handleIndividualClick(analyst)}>
                      <td>
                        <div className={styles.analystNameCell}>
                          <div className={styles.analystAvatarSmall}>
                            {analyst.name.split(' ').slice(-2).map((n: string) => n[0]).join('')}
                          </div>
                          <div>
                            <div className={styles.analystNameText}>{analyst.name}</div>
                            <div className={styles.analystIdText}>{analyst.userId}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={styles.teamBadgeSmall}>{analyst.teamName}</span>
                      </td>
                      <td>
                        <div className={styles.capacityCell}>
                          <div className={styles.capacityText}>
                            {analyst.activeLeads}/{analyst.capacity}
                          </div>
                          <div className={styles.capacityBarSmall}>
                            <div
                              className={styles.capacityFillSmall}
                              style={{
                                width: `${Math.min(loadPercentage, 100)}%`,
                                backgroundColor: isOverloaded
                                  ? 'var(--chart-1)'
                                  : isUnderutilized
                                    ? 'var(--chart-2)'
                                    : 'var(--chart-4)'
                              }}
                            />
                          </div>
                          <div className={styles.capacityPercent}>
                            {Math.round(loadPercentage)}%
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className={styles.statusBadge} data-status={analyst.status}>
                          {isOverloaded && (
                            <>
                              <AlertTriangle size={14} />
                              <span>Quá tải</span>
                            </>
                          )}
                          {isUnderutilized && (
                            <>
                              <TrendingUp size={14} />
                              <span>Còn trống</span>
                            </>
                          )}
                          {!isOverloaded && !isUnderutilized && (
                            <>
                              <CheckCircle2 size={14} />
                              <span>Tối ưu</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className={styles.timeCell}>
                          <Clock size={14} />
                          <span>{analyst.avgResponseTime}</span>
                        </div>
                      </td>
                      <td>
                        {analyst.slaRisk > 0 ? (
                          <div className={styles.slaRiskCell}>
                            <span className={styles.badge} data-type="warning">
                              {analyst.slaRisk}
                            </span>
                            {analyst.slaRisk > 3 && (
                              <AlertTriangle size={14} style={{ color: 'var(--chart-1)', marginLeft: 'var(--spacing-1)' }} />
                            )}
                          </div>
                        ) : (
                          <span className={styles.mutedText}>—</span>
                        )}
                      </td>
                      <td>
                        <div className={styles.accuracyCell}>
                          <span
                            className={styles.accuracyBadge}
                            style={{
                              color: analyst.accuracy >= 70
                                ? 'var(--chart-4)'
                                : analyst.accuracy >= 50
                                  ? 'var(--chart-2)'
                                  : 'var(--chart-1)'
                            }}
                          >
                            {analyst.accuracy}%
                          </span>
                          {analyst.accuracy < 50 && (
                            <AlertTriangle size={14} style={{ color: 'var(--chart-1)', marginLeft: 'var(--spacing-1)' }} />
                          )}
                        </div>
                      </td>
                      <td>
                        <span className={styles.completedValue}>
                          {analyst.closedThisWeek}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tasks View */}
      {viewMode === 'tasks' && (
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <h2>Danh sách nhiệm vụ cần làm</h2>
              <p className={styles.sectionDesc}>Toàn bộ công việc đang được theo dõi</p>
            </div>
          </div>

          {/* Task Stats */}
          <div className={styles.taskStatsGrid}>
            <div className={styles.taskStatCard} data-status="overdue">
              <div className={styles.taskStatIcon}>
                <AlertTriangle size={20} />
              </div>
              <div>
                <div className={styles.taskStatValue}>
                  {tasksData.filter(t => t.status === 'overdue').length}
                </div>
                <div className={styles.taskStatLabel}>Quá hạn</div>
              </div>
            </div>
            <div className={styles.taskStatCard} data-status="todo">
              <div className={styles.taskStatIcon}>
                <Circle size={20} />
              </div>
              <div>
                <div className={styles.taskStatValue}>
                  {tasksData.filter(t => t.status === 'todo').length}
                </div>
                <div className={styles.taskStatLabel}>Chưa làm</div>
              </div>
            </div>
            <div className={styles.taskStatCard} data-status="in_progress">
              <div className={styles.taskStatIcon}>
                <CircleDot size={20} />
              </div>
              <div>
                <div className={styles.taskStatValue}>
                  {tasksData.filter(t => t.status === 'in_progress').length}
                </div>
                <div className={styles.taskStatLabel}>Đang làm</div>
              </div>
            </div>
            <div className={styles.taskStatCard} data-status="completed">
              <div className={styles.taskStatIcon}>
                <CircleCheck size={20} />
              </div>
              <div>
                <div className={styles.taskStatValue}>
                  {tasksData.filter(t => t.status === 'completed').length}
                </div>
                <div className={styles.taskStatLabel}>Hoàn thành</div>
              </div>
            </div>
          </div>

          {/* Tasks Table */}
          <div className={styles.tableCard}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Trạng thái</th>
                  <th>Nhiệm vụ</th>
                  <th>Lead liên quan</th>
                  <th>Người thực hiện</th>
                  <th>Đội</th>
                  <th>Mức độ</th>
                  <th>Hạn chót</th>
                  <th>Còn lại</th>
                </tr>
              </thead>
              <tbody>
                {tasksData
                  .sort((a, b) => {
                    // Sort by status priority: overdue > todo > in_progress > completed
                    const statusPriority: Record<TaskStatus, number> = {
                      overdue: 0,
                      todo: 1,
                      in_progress: 2,
                      completed: 3,
                    };
                    if (statusPriority[a.status] !== statusPriority[b.status]) {
                      return statusPriority[a.status] - statusPriority[b.status];
                    }
                    // Then sort by hours remaining (ascending)
                    return a.hoursRemaining - b.hoursRemaining;
                  })
                  .map((task) => (
                    <tr key={task.id} onClick={() => handleTaskClick(task)}>
                      <td>
                        <div className={styles.taskStatusIcon} data-status={task.status}>
                          {task.status === 'overdue' && <AlertTriangle size={18} />}
                          {task.status === 'todo' && <Circle size={18} />}
                          {task.status === 'in_progress' && <CircleDot size={18} />}
                          {task.status === 'completed' && <CircleCheck size={18} />}
                        </div>
                      </td>
                      <td>
                        <div className={styles.taskTitleCell}>
                          <div className={styles.taskTitle}>{task.title}</div>
                          <div className={styles.taskDesc}>{task.description}</div>
                        </div>
                      </td>
                      <td>
                        <div className={styles.leadInfoCell}>
                          <div className={styles.leadCode}>{task.leadCode}</div>
                          <div className={styles.leadTitle}>{task.leadTitle}</div>
                        </div>
                      </td>
                      <td>
                        <div className={styles.assigneeCell}>
                          <Users size={14} />
                          <span>{task.assignedTo}</span>
                        </div>
                      </td>
                      <td>
                        <span className={styles.teamBadge}>{task.teamName}</span>
                      </td>
                      <td>
                        <div className={styles.priorityBadge} data-priority={task.priority}>
                          {task.priority === 'critical' && 'Nghiêm trọng'}
                          {task.priority === 'high' && 'Cao'}
                          {task.priority === 'medium' && 'Trung bình'}
                          {task.priority === 'low' && 'Thấp'}
                        </div>
                      </td>
                      <td>
                        <div className={styles.deadlineCell}>
                          <Calendar size={14} />
                          <span>{new Date(task.deadline).toLocaleDateString('vi-VN')}</span>
                        </div>
                      </td>
                      <td>
                        {task.status === 'completed' ? (
                          <span className={styles.completedText}>
                            Đã xong
                          </span>
                        ) : task.hoursRemaining < 0 ? (
                          <span className={styles.overdueText}>
                            Quá {Math.abs(task.hoursRemaining)}h
                          </span>
                        ) : task.hoursRemaining < 24 ? (
                          <span className={styles.urgentText}>
                            Còn {task.hoursRemaining}h
                          </span>
                        ) : (
                          <span className={styles.normalText}>
                            Còn {Math.floor(task.hoursRemaining / 24)}d
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bottlenecks */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <h2>Vấn đề & điểm nghẽn</h2>
            <p className={styles.sectionDesc}>Các vấn đề cần xử lý ngay</p>
          </div>
        </div>
        <div className={styles.bottleneckGrid}>
          {bottlenecks.map((issue, idx) => (
            <div key={idx} className={styles.bottleneckCard} data-severity={issue.severity}>
              <div className={styles.bottleneckHeader}>
                <div className={styles.bottleneckType}>
                  <AlertTriangle size={16} />
                  {issue.type}
                </div>
                <div className={styles.severityBadge} data-severity={issue.severity}>
                  {issue.severity === 'high' && 'Cao'}
                  {issue.severity === 'medium' && 'Trung bình'}
                  {issue.severity === 'low' && 'Thấp'}
                </div>
              </div>
              <div className={styles.bottleneckBody}>
                <div className={styles.bottleneckMeta}>
                  <span className={styles.analystTag}>{issue.analyst}</span>
                  <span className={styles.teamTag}>{issue.team}</span>
                </div>
                <p className={styles.bottleneckDesc}>{issue.description}</p>
                <div className={styles.bottleneckAction}>
                  <strong>Hành động:</strong> {issue.action}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Đề xuất thông minh</h2>
        </div>
        <div className={styles.recommendGrid}>
          <div className={styles.recommendCard}>
            <CheckCircle2 size={20} />
            <div>
              <h4>Phân phối lại công việc</h4>
              <p>Chuyển 4 nguồn tin từ Nguyễn Văn A sang Phạm Minh D để cân bằng tải.</p>
              <button className={styles.actionBtn}>Thực hiện</button>
            </div>
          </div>
          <div className={styles.recommendCard}>
            <AlertTriangle size={20} />
            <div>
              <h4>Ưu tiên nguy cơ quá hạn</h4>
              <p>12 nguồn tin sắp quá hạn cần xử lý trong 24h tới.</p>
              <button className={styles.actionBtn}>Xem chi tiết</button>
            </div>
          </div>
          <div className={styles.recommendCard}>
            <Users size={20} />
            <div>
              <h4>Đào tạo cho Phạm Minh D</h4>
              <p>Độ chính xác thấp (32%) cần đánh giá lại quy trình và hỗ trợ.</p>
              <button className={styles.actionBtn}>Tạo kế hoạch</button>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {detailModalOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>
                {detailMode === 'team' && 'Chi tiết đội'}
                {detailMode === 'individual' && 'Chi tiết cá nhân'}
                {detailMode === 'task' && 'Chi tiết nhiệm vụ'}
              </h3>
              <button className={styles.closeBtn} onClick={closeModal}>
                <X size={16} />
              </button>
            </div>
            <div className={styles.modalBody}>
              {detailMode === 'team' && (
                <div className={styles.teamDetail}>
                  <div className={styles.teamNameCell}>
                    <div className={styles.teamIconSmall}>
                      <Users size={16} />
                    </div>
                    <div>
                      <div className={styles.teamName}>{selectedDetail.name}</div>
                      <div className={styles.teamId}>ID: {selectedDetail.teamId}</div>
                    </div>
                  </div>
                  <div className={styles.teamStats}>
                    <div className={styles.statItem}>
                      <div className={styles.statLabel}>Thành viên</div>
                      <div className={styles.statValue}>{selectedDetail.members}</div>
                    </div>
                    <div className={styles.statItem}>
                      <div className={styles.statLabel}>Công suất</div>
                      <div className={styles.statValue}>
                        {selectedDetail.activeLeads}/{selectedDetail.capacity}
                      </div>
                    </div>
                    <div className={styles.statItem}>
                      <div className={styles.statLabel}>Trạng thái</div>
                      <div className={styles.statValue}>
                        {selectedDetail.overloaded > 0 ? 'Quá tải' : 'Tối ưu'}
                      </div>
                    </div>
                    <div className={styles.statItem}>
                      <div className={styles.statLabel}>TB/người</div>
                      <div className={styles.statValue}>{selectedDetail.avgLoadPerPerson.toFixed(1)}</div>
                    </div>
                    <div className={styles.statItem}>
                      <div className={styles.statLabel}>CB quá tải</div>
                      <div className={styles.statValue}>{selectedDetail.overloaded}</div>
                    </div>
                    <div className={styles.statItem}>
                      <div className={styles.statLabel}>Nguy cơ SLA</div>
                      <div className={styles.statValue}>{selectedDetail.slaRisk}</div>
                    </div>
                    <div className={styles.statItem}>
                      <div className={styles.statLabel}>HT hôm nay</div>
                      <div className={styles.statValue}>{selectedDetail.closedToday}</div>
                    </div>
                    <div className={styles.statItem}>
                      <div className={styles.statLabel}>HT tuần này</div>
                      <div className={styles.statValue}>{selectedDetail.closedThisWeek}</div>
                    </div>
                  </div>
                </div>
              )}
              {detailMode === 'individual' && (
                <div className={styles.individualDetail}>
                  <div className={styles.analystNameCell}>
                    <div className={styles.analystAvatarSmall}>
                      {selectedDetail.name.split(' ').slice(-2).map((n: string) => n[0]).join('')}
                    </div>
                    <div>
                      <div className={styles.analystNameText}>{selectedDetail.name}</div>
                      <div className={styles.analystIdText}>{selectedDetail.userId}</div>
                    </div>
                  </div>
                  <div className={styles.individualStats}>
                    <div className={styles.statItem}>
                      <div className={styles.statLabel}>Đội</div>
                      <div className={styles.statValue}>{selectedDetail.teamName}</div>
                    </div>
                    <div className={styles.statItem}>
                      <div className={styles.statLabel}>Công suất</div>
                      <div className={styles.statValue}>
                        {selectedDetail.activeLeads}/{selectedDetail.capacity}
                      </div>
                    </div>
                    <div className={styles.statItem}>
                      <div className={styles.statLabel}>Trạng thái</div>
                      <div className={styles.statValue}>
                        {selectedDetail.status === 'overloaded' ? 'Quá tải' : 'Tối ưu'}
                      </div>
                    </div>
                    <div className={styles.statItem}>
                      <div className={styles.statLabel}>TG phản hồi</div>
                      <div className={styles.statValue}>{selectedDetail.avgResponseTime}</div>
                    </div>
                    <div className={styles.statItem}>
                      <div className={styles.statLabel}>Nguy cơ SLA</div>
                      <div className={styles.statValue}>{selectedDetail.slaRisk}</div>
                    </div>
                    <div className={styles.statItem}>
                      <div className={styles.statLabel}>Độ chính xác</div>
                      <div className={styles.statValue}>{selectedDetail.accuracy}%</div>
                    </div>
                    <div className={styles.statItem}>
                      <div className={styles.statLabel}>HT tuần này</div>
                      <div className={styles.statValue}>{selectedDetail.closedThisWeek}</div>
                    </div>
                  </div>
                </div>
              )}
              {detailMode === 'task' && (
                <div className={styles.taskDetail}>
                  <div className={styles.taskTitleCell}>
                    <div className={styles.taskTitle}>{selectedDetail.title}</div>
                    <div className={styles.taskDesc}>{selectedDetail.description}</div>
                  </div>
                  <div className={styles.taskStats}>
                    <div className={styles.statItem}>
                      <div className={styles.statLabel}>Lead liên quan</div>
                      <div className={styles.statValue}>
                        <div className={styles.leadCode}>{selectedDetail.leadCode}</div>
                        <div className={styles.leadTitle}>{selectedDetail.leadTitle}</div>
                      </div>
                    </div>
                    <div className={styles.statItem}>
                      <div className={styles.statLabel}>Người thực hiện</div>
                      <div className={styles.statValue}>
                        <Users size={14} />
                        <span>{selectedDetail.assignedTo}</span>
                      </div>
                    </div>
                    <div className={styles.statItem}>
                      <div className={styles.statLabel}>Đội</div>
                      <div className={styles.statValue}>{selectedDetail.teamName}</div>
                    </div>
                    <div className={styles.statItem}>
                      <div className={styles.statLabel}>Mức độ</div>
                      <div className={styles.statValue}>
                        <div className={styles.priorityBadge} data-priority={selectedDetail.priority}>
                          {selectedDetail.priority === 'critical' && 'Nghiêm trọng'}
                          {selectedDetail.priority === 'high' && 'Cao'}
                          {selectedDetail.priority === 'medium' && 'Trung bình'}
                          {selectedDetail.priority === 'low' && 'Thấp'}
                        </div>
                      </div>
                    </div>
                    <div className={styles.statItem}>
                      <div className={styles.statLabel}>Hạn chót</div>
                      <div className={styles.statValue}>
                        <div className={styles.deadlineCell}>
                          <Calendar size={14} />
                          <span>{new Date(selectedDetail.deadline).toLocaleDateString('vi-VN')}</span>
                        </div>
                      </div>
                    </div>
                    <div className={styles.statItem}>
                      <div className={styles.statLabel}>Còn lại</div>
                      <div className={styles.statValue}>
                        {selectedDetail.status === 'completed' ? (
                          <span className={styles.completedText}>
                            Đã xong
                          </span>
                        ) : selectedDetail.hoursRemaining < 0 ? (
                          <span className={styles.overdueText}>
                            Quá {Math.abs(selectedDetail.hoursRemaining)}h
                          </span>
                        ) : selectedDetail.hoursRemaining < 24 ? (
                          <span className={styles.urgentText}>
                            Còn {selectedDetail.hoursRemaining}h
                          </span>
                        ) : (
                          <span className={styles.normalText}>
                            Còn {Math.floor(selectedDetail.hoursRemaining / 24)}d
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
