import { useState } from 'react';
import { 
  ClipboardCheck,
  AlertTriangle,
  FileWarning,
  TrendingUp,
  TrendingDown,
  MapPin,
  Users,
  Store,
  Shield,
  Filter,
  X
} from 'lucide-react';
import styles from './KpiQlttDashboard.module.css';
import { 
  BarChart, 
  Bar, 
  PieChart,
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ComposedChart,
  Line
} from 'recharts';
import { cn } from '@/components/ui/utils';
import MultiSelectDropdown from '@/components/lead-risk/MultiSelectDropdown';

type TimeRange = '7' | '30' | '90';

// Filter interfaces
interface InspectionFilters {
  fromDate: string;
  toDate: string;
  teams: string[];
  violationTypes: string[];
}

// Filter options
const TEAM_OPTIONS = [
  { value: 'team1', label: 'Đội 1' },
  { value: 'team2', label: 'Đội 2' },
  { value: 'team3', label: 'Đội 3' },
  { value: 'team4', label: 'Đội 4' },
  { value: 'team5', label: 'Đội 5' },
];

const VIOLATION_TYPE_OPTIONS = [
  { value: 'food_safety', label: 'Vi phạm an toàn thực phẩm' },
  { value: 'price', label: 'Vi phạm giá cả' },
  { value: 'license', label: 'Vi phạm giấy phép' },
  { value: 'counterfeit', label: 'Hàng giả, hàng nhái' },
  { value: 'pharma', label: 'Vi phạm dược phẩm' },
];

// ================= MOCK DATA =================

// Inspection results by district
const INSPECTION_BY_DISTRICT = [
  { district: 'Q1', total: 45, passed: 28, violated: 12, serious: 5, rate: 62.2 },
  { district: 'Q2', total: 38, passed: 25, violated: 10, serious: 3, rate: 65.8 },
  { district: 'Q3', total: 52, passed: 30, violated: 15, serious: 7, rate: 57.7 },
  { district: 'Q4', total: 31, passed: 22, violated: 7, serious: 2, rate: 71.0 },
  { district: 'Q5', total: 42, passed: 26, violated: 11, serious: 5, rate: 61.9 },
  { district: 'Q7', total: 29, passed: 20, violated: 6, serious: 3, rate: 69.0 }
];

// Inspection results by team
const INSPECTION_BY_TEAM = [
  { team: 'Đội 1', total: 51, passed: 32, violated: 14, serious: 5, passRate: 62.7 },
  { team: 'Đội 2', total: 48, passed: 29, violated: 13, serious: 6, passRate: 60.4 },
  { team: 'Đội 3', total: 45, passed: 30, violated: 11, serious: 4, passRate: 66.7 },
  { team: 'Đội 4', total: 39, passed: 28, violated: 8, serious: 3, passRate: 71.8 },
  { team: 'Đội 5', total: 54, passed: 32, violated: 16, serious: 6, passRate: 59.3 }
];

// Inspection results by industry
const INSPECTION_BY_INDUSTRY = [
  { industry: 'Thực phẩm', total: 89, passed: 52, violated: 25, serious: 12, rate: 58.4 },
  { industry: 'Y tế', total: 45, passed: 28, violated: 11, serious: 6, rate: 62.2 },
  { industry: 'Bán lẻ', total: 38, passed: 26, violated: 9, serious: 3, rate: 68.4 },
  { industry: 'Công nghệ', total: 25, passed: 20, violated: 4, serious: 1, rate: 80.0 },
  { industry: 'Thời trang', total: 32, passed: 21, violated: 8, serious: 3, rate: 65.6 }
];

// Inspection results by merchant type
const INSPECTION_BY_TYPE = [
  { type: 'Hộ kinh doanh', total: 98, passed: 56, violated: 28, serious: 14, rate: 57.1 },
  { type: 'Công ty TNHH', total: 78, passed: 52, violated: 18, serious: 8, rate: 66.7 },
  { type: 'Công ty CP', total: 35, passed: 26, violated: 7, serious: 2, rate: 74.3 },
  { type: 'Doanh nghiệp tư nhân', total: 26, passed: 17, violated: 6, serious: 3, rate: 65.4 }
];

// Violation statistics by type with penalty handling rate
const VIOLATION_BY_TYPE = [
  { type: 'An toàn thực phẩm', count: 45, handled: 38, handledRate: 84.4, avgFine: 18.5 },
  { type: 'Hàng giả, hàng nhái', count: 38, handled: 35, handledRate: 92.1, avgFine: 25.3 },
  { type: 'Dược phẩm', count: 28, handled: 24, handledRate: 85.7, avgFine: 42.8 },
  { type: 'Giấy phép', count: 18, handled: 15, handledRate: 83.3, avgFine: 22.0 },
  { type: 'Giá cả', count: 11, handled: 11, handledRate: 100, avgFine: 5.5 }
];

// Penalty level distribution
const PENALTY_DISTRIBUTION = [
  { level: 'Cảnh cáo', count: 15, percentage: 10.7, color: '#0fc87a' },
  { level: 'Phạt tiền', count: 85, percentage: 60.7, color: '#f7a23b' },
  { level: 'Tước quyền', count: 22, percentage: 15.7, color: '#f94144' },
  { level: 'Phạt + Tước quyền', count: 18, percentage: 12.9, color: '#a855f7' }
];

// Pending cases by phase
const PENDING_BY_PHASE = [
  { phase: 'Tiếp nhận', count: 12, avgDays: 3.5, slaTarget: 2, overdue: 2 },
  { phase: 'Xác minh', count: 28, avgDays: 8.2, slaTarget: 7, overdue: 8 },
  { phase: 'Xử lý', count: 45, avgDays: 15.8, slaTarget: 14, overdue: 15 },
];

// Reoffender analysis
const REOFFENDER_STATS = {
  total: 140,
  reoffenders: 42,
  rate: 30.0,
  byFrequency: [
    { frequency: '1 lần', count: 98, rate: 70.0 },
    { frequency: '2 lần', count: 28, rate: 20.0 },
    { frequency: '3 lần', count: 10, rate: 7.1 },
    { frequency: '> 3 lần', count: 4, rate: 2.9 }
  ]
};

// ================= MAIN COMPONENT =================

interface InspectionDashboardProps {
  timeRange: TimeRange;
}

export default function InspectionDashboard({ timeRange }: InspectionDashboardProps) {
  const [overviewBy, setOverviewBy] = useState<'district' | 'team' | 'industry'>('district');
  const [filters, setFilters] = useState<InspectionFilters>({
    fromDate: '',
    toDate: '',
    teams: [],
    violationTypes: [],
  });

  // Calculate overall KPIs
  const totalInspections = INSPECTION_BY_DISTRICT.reduce((sum, d) => sum + d.total, 0);
  const passedInspections = INSPECTION_BY_DISTRICT.reduce((sum, d) => sum + d.passed, 0);
  const violatedInspections = INSPECTION_BY_DISTRICT.reduce((sum, d) => sum + d.violated + d.serious, 0);
  const passRate = ((passedInspections / totalInspections) * 100).toFixed(1);
  
  const totalViolations = VIOLATION_BY_TYPE.reduce((sum, v) => sum + v.count, 0);
  const totalPending = PENDING_BY_PHASE.reduce((sum, p) => sum + p.count, 0);
  const overdueCount = PENDING_BY_PHASE.reduce((sum, p) => sum + p.overdue, 0);

  // Select data based on filter
  const getOverviewData = () => {
    switch(overviewBy) {
      case 'team':
        return INSPECTION_BY_TEAM.map(t => ({ 
          name: t.team, 
          total: t.total, 
          passed: t.passed, 
          violated: t.violated, 
          serious: t.serious,
          rate: t.passRate 
        }));
      case 'industry':
        return INSPECTION_BY_INDUSTRY.map(i => ({ 
          name: i.industry, 
          total: i.total, 
          passed: i.passed, 
          violated: i.violated, 
          serious: i.serious,
          rate: i.rate 
        }));
      default:
        return INSPECTION_BY_DISTRICT.map(d => ({ 
          name: d.district, 
          total: d.total, 
          passed: d.passed, 
          violated: d.violated, 
          serious: d.serious,
          rate: d.rate 
        }));
    }
  };

  return (
    <div className={styles.tabContent}>
      {/* Overall KPI Cards */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <div className={styles.kpiTitleRow}>
              <div className={styles.kpiIcon} style={{ color: 'var(--primary)' }}>
                <ClipboardCheck className="w-5 h-5" />
              </div>
              <span className={styles.kpiTitle}>Tổng số kiểm tra</span>
            </div>
            <span className={cn(styles.kpiTrend, styles.trendUp)}>
              <TrendingUp className="w-3 h-3" />
              8.5%
            </span>
          </div>
          <div className={styles.kpiValue}>
            <span className={styles.kpiNumber}>{totalInspections}</span>
            <span className={styles.kpiUnit}>cơ sở</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <div className={styles.kpiTitleRow}>
              <div className={styles.kpiIcon} style={{ color: '#0fc87a' }}>
                <Shield className="w-5 h-5" />
              </div>
              <span className={styles.kpiTitle}>Tỷ lệ đạt chuẩn</span>
            </div>
            <span className={cn(styles.kpiTrend, styles.trendUp)}>
              <TrendingUp className="w-3 h-3" />
              3.2%
            </span>
          </div>
          <div className={styles.kpiValue}>
            <span className={styles.kpiNumber}>{passRate}</span>
            <span className={styles.kpiUnit}>%</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <div className={styles.kpiTitleRow}>
              <div className={styles.kpiIcon} style={{ color: '#f94144' }}>
                <AlertTriangle className="w-5 h-5" />
              </div>
              <span className={styles.kpiTitle}>Tổng vi phạm</span>
            </div>
            <span className={cn(styles.kpiTrend, styles.trendDown)}>
              <TrendingDown className="w-3 h-3" />
              5.2%
            </span>
          </div>
          <div className={styles.kpiValue}>
            <span className={styles.kpiNumber}>{totalViolations}</span>
            <span className={styles.kpiUnit}>vụ</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <div className={styles.kpiTitleRow}>
              <div className={styles.kpiIcon} style={{ color: '#f7a23b' }}>
                <FileWarning className="w-5 h-5" />
              </div>
              <span className={styles.kpiTitle}>Hồ sơ tồn đọng</span>
            </div>
            <span className={cn(styles.kpiTrend, styles.trendDown)}>
              <TrendingDown className="w-3 h-3" />
              12.5%
            </span>
          </div>
          <div className={styles.kpiValue}>
            <span className={styles.kpiNumber}>{totalPending}</span>
            <span className={styles.kpiUnit}>hồ sơ</span>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className={styles.filterSection}>
        <div className={styles.filterItem}>
          <label className={styles.filterLabel}>Từ ngày:</label>
          <input
            type="date"
            className={styles.filterInput}
            value={filters.fromDate}
            onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
          />
        </div>
        <div className={styles.filterItem}>
          <label className={styles.filterLabel}>Đến ngày:</label>
          <input
            type="date"
            className={styles.filterInput}
            value={filters.toDate}
            onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
          />
        </div>
        <div className={styles.filterItem}>
          <label className={styles.filterLabel}>Đội kiểm tra:</label>
          <MultiSelectDropdown
            label="Đội kiểm tra"
            options={TEAM_OPTIONS}
            selectedValues={filters.teams}
            onChange={(selected) => setFilters({ ...filters, teams: selected })}
            placeholder="Chọn..."
            showLabel={false}
          />
        </div>
        <div className={styles.filterItem}>
          <label className={styles.filterLabel}>Loại vi phạm:</label>
          <MultiSelectDropdown
            label="Loại vi phạm"
            options={VIOLATION_TYPE_OPTIONS}
            selectedValues={filters.violationTypes}
            onChange={(selected) => setFilters({ ...filters, violationTypes: selected })}
            placeholder="Chọn..."
            showLabel={false}
          />
        </div>
        <button className={styles.clearFilterButton} onClick={() => setFilters({ fromDate: '', toDate: '', teams: [], violationTypes: [] })}>
          <X className="w-4 h-4" />
          Xóa bộ lọc
        </button>
      </div>

      {/* ========== 1. Biểu đồ tổng quan kết quả kiểm tra ========== */}
      <div className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <div>
              <h3 className={styles.chartTitle}>Tổng quan kết quả kiểm tra</h3>
              <p className={styles.chartSubtitle}>
                Phân tích số lượng và tỷ lệ đạt/vi phạm để đánh giá hiệu quả công việc
              </p>
            </div>
            <div className={styles.filterButtonGroup}>
              <button
                className={cn(styles.filterButton, overviewBy === 'district' && styles.filterButtonActive)}
                onClick={() => setOverviewBy('district')}
              >
                <MapPin className="w-4 h-4" />
                Theo địa bàn
              </button>
              <button
                className={cn(styles.filterButton, overviewBy === 'team' && styles.filterButtonActive)}
                onClick={() => setOverviewBy('team')}
              >
                <Users className="w-4 h-4" />
                Theo đội
              </button>
              <button
                className={cn(styles.filterButton, overviewBy === 'industry' && styles.filterButtonActive)}
                onClick={() => setOverviewBy('industry')}
              >
                <Store className="w-4 h-4" />
                Theo ngành hàng
              </button>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={getOverviewData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--card)', 
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)'
                }}
              />
              <Legend />
              <Bar dataKey="passed" fill="#0fc87a" name="Đạt" stackId="a" radius={[0, 0, 0, 0]} />
              <Bar dataKey="violated" fill="#f7a23b" name="Vi phạm" stackId="a" radius={[0, 0, 0, 0]} />
              <Bar dataKey="serious" fill="#f94144" name="Vi phạm nghiêm trọng" stackId="a" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ========== 6. Biểu đồ phân tích tái phạm ========== */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Phân tích tái phạm</h3>
          <p className={styles.chartSubtitle}>
            Đánh giá mức độ tuân thủ và cảnh báo các merchant cần theo dõi
          </p>
          
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={REOFFENDER_STATS.byFrequency}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="frequency" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--card)', 
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)'
                }}
              />
              <Legend />
              <Bar dataKey="count" name="Số merchant" radius={[8, 8, 0, 0]}>
                {REOFFENDER_STATS.byFrequency.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`}
                    fill={index === 0 ? '#0fc87a' : index === 1 ? '#f7a23b' : '#f94144'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* Reoffender Summary */}
          <div className={styles.analysisCard} style={{ marginTop: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', textAlign: 'center' }}>
              <div>
                <div style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
                  Tổng merchant vi phạm
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--primary)' }}>
                  {REOFFENDER_STATS.total}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
                  Merchant tái phạm
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: '600', color: '#f94144' }}>
                  {REOFFENDER_STATS.reoffenders}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
                  Tỷ lệ tái phạm
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: '600', color: '#f7a23b' }}>
                  {REOFFENDER_STATS.rate}%
                </div>
              </div>
            </div>
            
            <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: 'var(--muted)', borderRadius: 'var(--radius)', fontSize: '0.875rem' }}>
              <strong>⚠️ Cảnh báo:</strong> {REOFFENDER_STATS.byFrequency[2].count + REOFFENDER_STATS.byFrequency[3].count} merchant vi phạm ≥ 3 lần cần giám sát chặt chẽ và xử lý nghiêm khắc hơn.
            </div>
          </div>
        </div>
      </div>

      {/* ========== 2 & 3: Biểu đồ vi phạm và merchant type ========== */}
      <div className={styles.chartsGrid}>
        {/* ========== 2. Biểu đồ tỷ lệ vi phạm và mức độ xử lý ========== */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Tỷ lệ vi phạm và mức độ xử lý</h3>
          <p className={styles.chartSubtitle}>
            So sánh tỷ lệ vi phạm và hiệu quả xử lý giữa các loại vi phạm
          </p>
          
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={VIOLATION_BY_TYPE}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="type" stroke="var(--muted-foreground)" />
              <YAxis yAxisId="left" stroke="var(--muted-foreground)" label={{ value: 'Số vụ', angle: -90, position: 'insideLeft' }} />
              <YAxis yAxisId="right" orientation="right" stroke="var(--muted-foreground)" label={{ value: 'Tỷ lệ xử lý (%)', angle: 90, position: 'insideRight' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--card)', 
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)'
                }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="count" fill="#f94144" name="Số vụ vi phạm" radius={[8, 8, 0, 0]} />
              <Bar yAxisId="left" dataKey="handled" fill="#0fc87a" name="Đã xử lý" radius={[8, 8, 0, 0]} />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="handledRate" 
                stroke="#695cfb" 
                strokeWidth={3}
                name="Tỷ lệ xử lý (%)"
                dot={{ fill: '#695cfb', r: 5 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* ========== 3. Biểu đồ kết quả kiểm tra theo loại hình merchant ========== */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Kết quả kiểm tra theo loại hình merchant</h3>
          <p className={styles.chartSubtitle}>
            So sánh mức độ tuân thủ giữa các loại hình tổ chức
          </p>
          
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={INSPECTION_BY_TYPE}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="type" stroke="var(--muted-foreground)" />
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
              <Bar yAxisId="left" dataKey="total" fill="#695cfb" name="Tổng kiểm tra" radius={[8, 8, 0, 0]} />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="rate" 
                stroke="#0fc87a" 
                strokeWidth={3}
                name="Tỷ lệ đạt (%)"
                dot={{ fill: '#0fc87a', r: 5 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={styles.chartsGrid}>
        {/* ========== 4. Biểu đồ kết quả xử lý vi phạm ========== */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Kết quả xử lý vi phạm</h3>
          <p className={styles.chartSubtitle}>
            Phân bố các hình thức xử phạt (cảnh cáo, phạt tiền, tước quyền)
          </p>
          
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={PENALTY_DISTRIBUTION}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ level, percentage }) => `${level}: ${percentage}%`}
                outerRadius={90}
                fill="#8884d8"
                dataKey="count"
              >
                {PENALTY_DISTRIBUTION.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          {/* Summary Stats */}
          <div className={styles.analysisCard} style={{ marginTop: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', textAlign: 'center' }}>
              <div>
                <div style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
                  Tổng số vụ xử lý
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--primary)' }}>
                  {PENALTY_DISTRIBUTION.reduce((sum, p) => sum + p.count, 0)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
                  Tỷ lệ xử lý nghiêm
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: '600', color: '#f94144' }}>
                  {(PENALTY_DISTRIBUTION[2].percentage + PENALTY_DISTRIBUTION[3].percentage).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========== 5. Biểu đồ theo dõi hồ sơ tồn đọng ========== */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Hồ sơ tồn đọng theo pha xử lý</h3>
          <p className={styles.chartSubtitle}>
            Theo dõi tiến độ xử lý hồ sơ qua các giai đoạn
          </p>
          
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={PENDING_BY_PHASE}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="phase" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--card)', 
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)'
                }}
              />
              <Legend />
              <Bar dataKey="count" fill="#695cfb" name="Tổng hồ sơ" radius={[8, 8, 0, 0]} />
              <Bar dataKey="overdue" fill="#f94144" name="Quá hạn" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>

          {/* SLA Summary */}
          <div className={styles.analysisCard} style={{ marginTop: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', textAlign: 'center' }}>
              <div>
                <div style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
                  Tổng hồ sơ tồn
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--primary)' }}>
                  {totalPending}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
                  Hồ sơ quá hạn
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: '600', color: '#f94144' }}>
                  {overdueCount}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
