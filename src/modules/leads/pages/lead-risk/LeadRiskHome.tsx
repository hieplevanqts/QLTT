import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSupabaseClient } from '@/utils/supabaseClient';
import {
  Inbox,
  AlertTriangle,
  TrendingUp,
  Clock,
  Users,
  MapPin,
  ArrowUpRight,
  Plus,
  Filter,
  Calendar,
  Activity,
  Target,
  Shield,
  ChevronRight,
  Star
} from 'lucide-react';
import AiWorkAssistantNavButton from "@/components/ai/AiWorkAssistantNavButton";
import styles from './LeadRiskHome.module.css';

interface KPICard {
  label: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon: any;
  color: string;
  bgColor: string;
  link: string;
}

interface QuickAction {
  label: string;
  description: string;
  icon: any;
  link: string;
  color: string;
}

interface RecentEscalation {
  id: string;
  title: string;
  from: string;
  to: string;
  priority: 'critical' | 'high' | 'medium';
  timestamp: string;
  area: string;
}

export default function LeadRiskHome() {
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState<'today' | 'week' | 'month'>('today');

  /* State for KPI counts */
  const [todayLeadCount, setTodayLeadCount] = useState(0);
  const [newLeadCount, setNewLeadCount] = useState(0);
  const [processingCount, setProcessingCount] = useState(0);
  const [resolvedWeekCount, setResolvedWeekCount] = useState(0);

  useEffect(() => {
    async function fetchStats() {
      const supabase = getSupabaseClient();

      try {
        // 1. Tổng số Leads (Total leads all time)
        const { count: totalCount } = await supabase
          .from('leads')
          .select('*', { count: 'exact', head: true });
        setTodayLeadCount(totalCount || 0);

        // 2. Chờ triage (Status = 'new')
        const { count: newCount } = await supabase
          .from('leads')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'new');
        setNewLeadCount(newCount || 0);

        // 3. Đang xử lý (Strict 'processing' status)
        const { count: procCount } = await supabase
          .from('leads')
          .select('*', { count: 'exact', head: true })
          .in('status', ['processing', 'in_progress']);
        setProcessingCount(procCount || 0);

        // 4. Đã xử lý (Total Resolved - All time)
        const { count: resolvedCount } = await supabase
          .from('leads')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'resolved');
        setResolvedWeekCount(resolvedCount || 0);

      } catch (error) {
        console.error('Error fetching KPI stats:', error);
      }
    }

    fetchStats();
  }, []);

  // Mock data with real values
  const kpiCards: KPICard[] = [
    {
      label: 'Tổng số Lead',
      value: todayLeadCount,
      change: 0, // Dynamic change calculation omitted for simplicity
      trend: 'stable',
      icon: Inbox,
      color: 'rgba(0, 92, 182, 1)',
      bgColor: 'rgba(239, 246, 255, 1)',
      link: '/lead-risk/inbox?status=all',
    },
    {
      label: 'Lead quá hạn',
      value: 8,
      change: -3,
      trend: 'down',
      icon: Clock,
      color: 'rgba(239, 68, 68, 1)',
      bgColor: 'rgba(255, 237, 237, 1)',
      link: '/lead-risk/inbox?filter=overdue',
    },
    {
      label: 'Rủi ro cao',
      value: 15,
      change: 5,
      trend: 'up',
      icon: AlertTriangle,
      color: 'rgba(251, 146, 60, 1)',
      bgColor: 'rgba(255, 247, 237, 1)',
      link: '/lead-risk/dashboard?priority=high',
    },
    {
      label: 'Chờ triage',
      value: newLeadCount,
      change: 0,
      trend: 'stable',
      icon: Target,
      color: 'rgba(168, 85, 247, 1)',
      bgColor: 'rgba(243, 232, 255, 1)',
      link: '/lead-risk/inbox?status=new',
    },
    {
      label: 'Đang xử lý',
      value: processingCount,
      change: 0,
      trend: 'up',
      icon: Users,
      color: 'rgba(59, 130, 246, 1)',
      bgColor: 'rgba(239, 246, 255, 1)',
      link: '/lead-risk/inbox?status=in_progress',
    },
    {
      label: 'Đã xử lý',
      value: resolvedWeekCount,
      change: 0,
      trend: 'up',
      icon: TrendingUp,
      color: 'rgba(34, 197, 94, 1)',
      bgColor: 'rgba(240, 253, 244, 1)',
      link: '/lead-risk/inbox?status=resolved',
    },
  ];

  const quickActions: QuickAction[] = [
    {
      label: 'Tạo nhanh nguồn tin',
      description: 'Tạo nguồn tin trong 60 giây',
      icon: Plus,
      link: '/lead-risk/create-lead-quick',
      color: 'var(--primary)',
    },
    {
      label: 'Xem bản đồ',
      description: 'Phân tích lead theo địa bàn',
      icon: MapPin,
      link: '/lead-risk/map',
      color: 'rgba(34, 197, 94, 1)',
    },
    {
      label: 'Dashboard rủi ro',
      description: 'Phân tích điểm nóng & xu hướng',
      icon: Activity,
      link: '/lead-risk/dashboard',
      color: 'rgba(251, 146, 60, 1)',
    },
    {
      label: 'Theo dõi đặc biệt',
      description: 'Danh sách watchlist & cảnh báo',
      icon: Star,
      link: '/lead-risk/watchlist',
      color: 'rgba(251, 146, 60, 1)',
    },
  ];

  const recentEscalations: RecentEscalation[] = [
    {
      id: 'L-2024-1523',
      title: 'Phát hiện chuỗi cửa hàng vi phạm quy mô lớn',
      from: 'Đội 3 - Phường 1',
      to: 'Chi cục Hà Nội',
      priority: 'critical',
      timestamp: '15 phút trước',
      area: 'Phường 1, Hà Nội',
    },
    {
      id: 'L-2024-1518',
      title: 'Nguồn tin về hàng giả nhãn mác nổi tiếng',
      from: 'Thanh tra viên Nguyễn Văn A',
      to: 'Đội 2 - Phường 3',
      priority: 'high',
      timestamp: '1 giờ trước',
      area: 'Phường 3, Hà Nội',
    },
    {
      id: 'L-2024-1512',
      title: 'Khiếu nại từ người tiêu dùng về chất lượng',
      from: 'Hotline 1800',
      to: 'Đội 1 - Phường 7',
      priority: 'medium',
      timestamp: '2 giờ trước',
      area: 'Phường 7, Hà Nội',
    },
  ];

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'critical':
        return styles.priorityCritical;
      case 'high':
        return styles.priorityHigh;
      case 'medium':
        return styles.priorityMedium;
      default:
        return '';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'Khẩn cấp';
      case 'high':
        return 'Cao';
      case 'medium':
        return 'Trung bình';
      default:
        return priority;
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <div className={styles.titleRow}>
            <Shield size={28} className={styles.titleIcon} />
            <h1 className={styles.title}>Quản lý nguồn tin và rủi ro</h1>
          </div>
          <p className={styles.subtitle}>
            Quản lý nguồn tin và phân tích rủi ro tập trung
          </p>
        </div>

        <div className={styles.headerActions}>
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value as any)}
            className={styles.timeFilter}
          >
            <option value="today">Hôm nay</option>
            <option value="week">Tuần này</option>
            <option value="month">Tháng này</option>
          </select>

          <AiWorkAssistantNavButton className={styles.assistantButton} />

          <button className={styles.createButton} onClick={() => navigate('/lead-risk/create-lead-quick')}>
            <Plus size={18} />
            Tạo nhanh nguồn tin
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className={styles.kpiGrid}>
        {kpiCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <div
              key={index}
              className={styles.kpiCard}
              onClick={() => navigate(card.link)}
              style={{ cursor: 'pointer' }}
            >
              <div className={styles.kpiHeader}>
                <div
                  className={styles.kpiIcon}
                  style={{ backgroundColor: card.bgColor, color: card.color }}
                >
                  <IconComponent size={24} />
                </div>
                <div className={`${styles.kpiChange} ${styles[`trend-${card.trend}`]}`}>
                  {card.change > 0 && '+'}
                  {card.change}
                </div>
              </div>

              <div className={styles.kpiValue}>{card.value}</div>
              <div className={styles.kpiLabel}>{card.label}</div>

              <div className={styles.kpiAction}>
                <span>Xem chi tiết</span>
                <ArrowUpRight size={14} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Thao tác nhanh</h2>
          <p className={styles.sectionSubtitle}>Truy cập các chức năng thường dùng</p>
        </div>

        <div className={styles.quickActionsGrid}>
          {quickActions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <div
                key={index}
                className={styles.quickActionCard}
                onClick={() => navigate(action.link)}
              >
                <div className={styles.quickActionIcon} style={{ color: action.color }}>
                  <IconComponent size={28} />
                </div>
                <div className={styles.quickActionContent}>
                  <h3 className={styles.quickActionLabel}>{action.label}</h3>
                  <p className={styles.quickActionDescription}>{action.description}</p>
                </div>
                <ChevronRight size={20} className={styles.quickActionArrow} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Escalations */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>Báo cáo lên cấp gần đây</h2>
            <p className={styles.sectionSubtitle}>Lead được escalate trong 24h qua</p>
          </div>
          <button
            className={styles.viewAllButton}
            onClick={() => navigate('/lead-risk/inbox?filter=escalated')}
          >
            Xem tất cả
            <ChevronRight size={16} />
          </button>
        </div>

        <div className={styles.escalationsContainer}>
          {recentEscalations.map((escalation) => (
            <div
              key={escalation.id}
              className={styles.escalationCard}
              onClick={() => navigate(`/lead-risk/lead/${escalation.id}`)}
            >
              <div className={styles.escalationHeader}>
                <div className={styles.escalationMeta}>
                  <span className={styles.escalationId}>{escalation.id}</span>
                  <span className={`${styles.priorityBadge} ${getPriorityBadgeClass(escalation.priority)}`}>
                    {getPriorityLabel(escalation.priority)}
                  </span>
                </div>
                <span className={styles.escalationTime}>{escalation.timestamp}</span>
              </div>

              <h3 className={styles.escalationTitle}>{escalation.title}</h3>

              <div className={styles.escalationFlow}>
                <div className={styles.escalationFrom}>
                  <span className={styles.escalationLabel}>Từ:</span>
                  <span className={styles.escalationValue}>{escalation.from}</span>
                </div>
                <ArrowUpRight size={16} className={styles.escalationArrow} />
                <div className={styles.escalationTo}>
                  <span className={styles.escalationLabel}>Đến:</span>
                  <span className={styles.escalationValue}>{escalation.to}</span>
                </div>
              </div>

              <div className={styles.escalationFooter}>
                <div className={styles.escalationArea}>
                  <MapPin size={14} />
                  <span>{escalation.area}</span>
                </div>
                <ChevronRight size={16} className={styles.escalationViewIcon} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Bar */}
      <div className='pb-4'>
        <div className={styles.statsBar}>
          <div className={styles.statItem}>
            <Calendar size={18} className={styles.statIcon} />
            <div className={styles.statContent}>
              <span className={styles.statLabel}>SLA tuân thủ</span>
              <span className={styles.statValue}>92%</span>
            </div>
          </div>

          <div className={styles.statDivider}></div>

          <div className={styles.statItem}>
            <Users size={18} className={styles.statIcon} />
            <div className={styles.statContent}>
              <span className={styles.statLabel}>Thanh tra viên hoạt động</span>
              <span className={styles.statValue}>48 người</span>
            </div>
          </div>

          <div className={styles.statDivider}></div>

          <div className={styles.statItem}>
            <MapPin size={18} className={styles.statIcon} />
            <div className={styles.statContent}>
              <span className={styles.statLabel}>Điểm nóng đang giám sát</span>
              <span className={styles.statValue}>12 khu vực</span>
            </div>
          </div>

          <div className={styles.statDivider}></div>

          <div className={styles.statItem}>
            <Filter size={18} className={styles.statIcon} />
            <div className={styles.statContent}>
              <span className={styles.statLabel}>Tỷ lệ lead hợp lệ</span>
              <span className={styles.statValue}>87%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
