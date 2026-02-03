import type { ReactNode } from 'react';
import { 
  MessageSquare,
  Phone,
  Smartphone,
  Globe,
  Users,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  AlertCircle
} from 'lucide-react';
import styles from './KpiQlttDashboard.module.css';
import { 
  BarChart, 
  Bar, 
  PieChart,
  Pie,
  Cell,
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { cn } from '@/components/ui/utils';

type TimeRange = '7' | '30' | '90';

interface FeedbackChannel {
  channel: string;
  icon: ReactNode;
  total: number;
  verified: number;
  correct: number;
  incorrect: number;
  avgVerificationTime: number; // hours
  correctnessRate: number;
}

// Mock data - Feedback channels
const FEEDBACK_CHANNELS: FeedbackChannel[] = [
  {
    channel: 'Hotline 1800',
    icon: <Phone className="w-5 h-5" />,
    total: 245,
    verified: 238,
    correct: 198,
    incorrect: 40,
    avgVerificationTime: 2.5,
    correctnessRate: 83.2
  },
  {
    channel: 'App di động',
    icon: <Smartphone className="w-5 h-5" />,
    total: 189,
    verified: 185,
    correct: 165,
    incorrect: 20,
    avgVerificationTime: 1.8,
    correctnessRate: 89.2
  },
  {
    channel: 'Website',
    icon: <Globe className="w-5 h-5" />,
    total: 156,
    verified: 148,
    correct: 122,
    incorrect: 26,
    avgVerificationTime: 3.2,
    correctnessRate: 82.4
  },
  {
    channel: 'Trực tiếp',
    icon: <Users className="w-5 h-5" />,
    total: 98,
    verified: 98,
    correct: 92,
    incorrect: 6,
    avgVerificationTime: 0.5,
    correctnessRate: 93.9
  }
];

// SLA Performance
interface SLAMetric {
  stage: string;
  target: number; // hours
  actual: number; // hours
  onTimeRate: number; // percentage
}

const SLA_METRICS: SLAMetric[] = [
  { stage: 'Tiếp nhận → Phân công', target: 2, actual: 1.5, onTimeRate: 95.2 },
  { stage: 'Phân công → Xác minh', target: 24, actual: 18.3, onTimeRate: 88.5 },
  { stage: 'Xác minh → Xử lý', target: 48, actual: 42.1, onTimeRate: 82.1 },
  { stage: 'Xử lý → Phản hồi', target: 72, actual: 68.5, onTimeRate: 79.3 }
];

// Feedback trend over time
const FEEDBACK_TREND = [
  { month: 'T8/24', total: 582, correct: 485, rate: 83.3 },
  { month: 'T9/24', total: 615, correct: 528, rate: 85.9 },
  { month: 'T10/24', total: 598, correct: 515, rate: 86.1 },
  { month: 'T11/24', total: 634, correct: 552, rate: 87.1 },
  { month: 'T12/24', total: 671, correct: 589, rate: 87.8 },
  { month: 'T1/25', total: 688, correct: 577, rate: 83.9 }
];

// Channel effectiveness comparison
const CHANNEL_EFFECTIVENESS = FEEDBACK_CHANNELS.map(ch => ({
  channel: ch.channel,
  correctRate: ch.correctnessRate,
  verifySpeed: parseFloat((24 / ch.avgVerificationTime).toFixed(1)), // normalized score
  totalVolume: ch.total
}));

interface FeedbackDashboardProps {
  timeRange: TimeRange;
}

export default function FeedbackDashboard({ timeRange }: FeedbackDashboardProps) {
  
  const totalFeedback = FEEDBACK_CHANNELS.reduce((sum, ch) => sum + ch.total, 0);
  const totalVerified = FEEDBACK_CHANNELS.reduce((sum, ch) => sum + ch.verified, 0);
  const totalCorrect = FEEDBACK_CHANNELS.reduce((sum, ch) => sum + ch.correct, 0);
  const avgCorrectRate = ((totalCorrect / totalVerified) * 100).toFixed(1);
  const avgVerificationTime = (
    FEEDBACK_CHANNELS.reduce((sum, ch) => sum + ch.avgVerificationTime * ch.total, 0) / totalFeedback
  ).toFixed(1);
  const overallSLARate = (
    SLA_METRICS.reduce((sum, m) => sum + m.onTimeRate, 0) / SLA_METRICS.length
  ).toFixed(1);

  // Channel distribution for pie chart
  const channelDistribution = FEEDBACK_CHANNELS.map((ch, index) => ({
    name: ch.channel,
    value: ch.total,
    color: ['#695cfb', '#0fc87a', '#f7a23b', '#4ecdc4'][index]
  }));

  return (
    <div className={styles.tabContent}>
      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <div className={styles.kpiTitleRow}>
              <div className={styles.kpiIcon} style={{ color: 'var(--primary)' }}>
                <MessageSquare className="w-5 h-5" />
              </div>
              <span className={styles.kpiTitle}>Tổng nguồn tin nhận</span>
            </div>
            <span className={cn(styles.kpiTrend, styles.trendUp)}>
              <TrendingUp className="w-3 h-3" />
              8.2%
            </span>
          </div>
          <div className={styles.kpiValue}>
            <span className={styles.kpiNumber}>{totalFeedback}</span>
            <span className={styles.kpiUnit}>nguồn tin</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <div className={styles.kpiTitleRow}>
              <div className={styles.kpiIcon} style={{ color: '#0fc87a' }}>
                <CheckCircle className="w-5 h-5" />
              </div>
              <span className={styles.kpiTitle}>Tỷ lệ nguồn tin đúng</span>
            </div>
            <span className={cn(styles.kpiTrend, styles.trendUp)}>
              <TrendingUp className="w-3 h-3" />
              2.5%
            </span>
          </div>
          <div className={styles.kpiValue}>
            <span className={styles.kpiNumber}>{avgCorrectRate}</span>
            <span className={styles.kpiUnit}>%</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <div className={styles.kpiTitleRow}>
              <div className={styles.kpiIcon} style={{ color: '#f7a23b' }}>
                <Clock className="w-5 h-5" />
              </div>
              <span className={styles.kpiTitle}>Thời gian xác minh TB</span>
            </div>
            <span className={cn(styles.kpiTrend, styles.trendDown)}>
              <TrendingDown className="w-3 h-3" />
              12.3%
            </span>
          </div>
          <div className={styles.kpiValue}>
            <span className={styles.kpiNumber}>{avgVerificationTime}</span>
            <span className={styles.kpiUnit}>giờ</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <div className={styles.kpiTitleRow}>
              <div className={styles.kpiIcon} style={{ color: '#695cfb' }}>
                <AlertCircle className="w-5 h-5" />
              </div>
              <span className={styles.kpiTitle}>Tỷ lệ đúng hạn SLA</span>
            </div>
            <span className={cn(styles.kpiTrend, styles.trendDown)}>
              <TrendingDown className="w-3 h-3" />
              3.8%
            </span>
          </div>
          <div className={styles.kpiValue}>
            <span className={styles.kpiNumber}>{overallSLARate}</span>
            <span className={styles.kpiUnit}>%</span>
          </div>
        </div>
      </div>

      {/* Channel Performance Table */}
      <div className={styles.chartCard}>
        <h3 className={styles.chartTitle}>Báo cáo theo kênh nguồn tin</h3>
        <p className={styles.chartSubtitle}>
          Phân tích hiệu quả từng kênh tiếp nhận phản ánh người dân
        </p>
        <div className={styles.tableContainer}>
          <table className={styles.performanceTable}>
            <thead>
              <tr>
                <th>Kênh</th>
                <th>Tổng tiếp nhận</th>
                <th>Đã xác minh</th>
                <th>Nguồn tin đúng</th>
                <th>Nguồn tin sai</th>
                <th>Tỷ lệ đúng (%)</th>
                <th>TG xác minh TB (giờ)</th>
                <th>Đánh giá</th>
              </tr>
            </thead>
            <tbody>
              {FEEDBACK_CHANNELS.map((channel, index) => (
                <tr key={index}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ color: 'var(--primary)' }}>
                        {channel.icon}
                      </div>
                      <span className={styles.teamName}>{channel.channel}</span>
                    </div>
                  </td>
                  <td>{channel.total}</td>
                  <td>{channel.verified}</td>
                  <td style={{ color: '#0fc87a' }}>{channel.correct}</td>
                  <td style={{ color: '#f94144' }}>{channel.incorrect}</td>
                  <td>
                    <span 
                      className={styles.completionRate}
                      style={{ 
                        color: channel.correctnessRate >= 85 ? '#0fc87a' : 
                               channel.correctnessRate >= 70 ? '#f7a23b' : '#f94144' 
                      }}
                    >
                      {channel.correctnessRate}%
                    </span>
                  </td>
                  <td>{channel.avgVerificationTime}</td>
                  <td>
                    <span 
                      className={cn(
                        styles.statusBadge,
                        channel.correctnessRate >= 85 ? styles.statusEfficient :
                        channel.correctnessRate >= 70 ? styles.statusBalanced :
                        styles.statusWarning
                      )}
                    >
                      {channel.correctnessRate >= 85 ? 'Hiệu quả cao' :
                       channel.correctnessRate >= 70 ? 'Trung bình' : 'Cần cải thiện'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts Grid */}
      <div className={styles.chartsGrid}>
        {/* Channel Distribution */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Phân bố nguồn tin theo kênh</h3>
          <p className={styles.chartSubtitle}>
            Tỷ trọng nguồn tin từ các kênh tiếp nhận
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={channelDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {channelDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Feedback Trend */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Xu hướng nguồn tin & tỷ lệ đúng</h3>
          <p className={styles.chartSubtitle}>
            Biến động số lượng và chất lượng nguồn tin theo thời gian
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={FEEDBACK_TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" stroke="var(--muted-foreground)" />
              <YAxis yAxisId="left" stroke="var(--muted-foreground)" />
              <YAxis yAxisId="right" orientation="right" stroke="var(--muted-foreground)" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--card)', 
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)'
                }}
              />
              <Legend />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="total" 
                stroke="#695cfb" 
                strokeWidth={2}
                name="Tổng nguồn tin"
                dot={{ fill: '#695cfb', r: 4 }}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="rate" 
                stroke="#0fc87a" 
                strokeWidth={2}
                name="Tỷ lệ đúng (%)"
                dot={{ fill: '#0fc87a', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* SLA Performance */}
      <div className={styles.chartCard}>
        <h3 className={styles.chartTitle}>Báo cáo SLA phản hồi</h3>
        <p className={styles.chartSubtitle}>
          Theo dõi thời gian xử lý từng giai đoạn và tỷ lệ đáp ứng SLA
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Bar Chart */}
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={SLA_METRICS}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="stage" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--card)', 
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)'
                }}
              />
              <Legend />
              <Bar dataKey="target" fill="#695cfb" name="Mục tiêu (giờ)" radius={[8, 8, 0, 0]} />
              <Bar dataKey="actual" fill="#0fc87a" name="Thực tế (giờ)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>

          {/* Table */}
          <div className={styles.tableContainer}>
            <table className={styles.performanceTable}>
              <thead>
                <tr>
                  <th>Giai đoạn</th>
                  <th>Mục tiêu</th>
                  <th>Thực tế</th>
                  <th>Tỷ lệ đúng hạn</th>
                </tr>
              </thead>
              <tbody>
                {SLA_METRICS.map((metric, index) => (
                  <tr key={index}>
                    <td className={styles.teamName} style={{ fontSize: '0.875rem' }}>
                      {metric.stage}
                    </td>
                    <td>{metric.target}h</td>
                    <td>{metric.actual}h</td>
                    <td>
                      <span 
                        className={styles.completionRate}
                        style={{ 
                          color: metric.onTimeRate >= 90 ? '#0fc87a' : 
                                 metric.onTimeRate >= 75 ? '#f7a23b' : '#f94144' 
                        }}
                      >
                        {metric.onTimeRate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Stats */}
        <div className={styles.analysisCard} style={{ marginTop: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}>
                TG xử lý toàn trình TB
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--primary)' }}>
                130.4 giờ
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}>
                Tỷ lệ đáp ứng SLA chung
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: '600', color: '#0fc87a' }}>
                {overallSLARate}%
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}>
                Giai đoạn chậm nhất
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: '600', color: '#f94144' }}>
                Xử lý → Phản hồi
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Channel Effectiveness Comparison */}
      <div className={styles.chartCard}>
        <h3 className={styles.chartTitle}>So sánh hiệu quả các kênh</h3>
        <p className={styles.chartSubtitle}>
          Đánh giá tổng hợp độ chính xác và tốc độ xác minh
        </p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={CHANNEL_EFFECTIVENESS}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="channel" stroke="var(--muted-foreground)" />
            <YAxis stroke="var(--muted-foreground)" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--card)', 
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)'
              }}
            />
            <Legend />
            <Bar dataKey="correctRate" fill="#0fc87a" name="Tỷ lệ đúng (%)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>

        {/* Insights */}
        <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: 'var(--muted)', borderRadius: 'var(--radius)' }}>
          <div style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
            💡 Nhận xét:
          </div>
          <ul style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginLeft: '1.5rem', lineHeight: '1.6' }}>
            <li>Kênh <strong>Trực tiếp</strong> có tỷ lệ đúng cao nhất (93.9%) và thời gian xác minh nhanh nhất (0.5 giờ)</li>
            <li>Kênh <strong>App di động</strong> đạt hiệu quả tốt với 89.2% nguồn tin đúng và xác minh nhanh (1.8 giờ)</li>
            <li>Kênh <strong>Hotline 1800</strong> có khối lượng lớn nhất (245 nguồn tin) nhưng cần cải thiện tỷ lệ đúng (83.2%)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
