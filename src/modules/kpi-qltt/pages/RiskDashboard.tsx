import { useState } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  TrendingUp,
  TrendingDown,
  MapPin,
  Clock,
  RefreshCw,
  X
} from 'lucide-react';
import styles from './KpiQlttDashboard.module.css';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { cn } from '@/components/ui/utils';
import MultiSelectDropdown from '@/components/lead-risk/MultiSelectDropdown';

type TimeRange = '7' | '30' | '90';

// Filter interfaces
interface RiskFilters {
  violationCategories: string[];
  riskStatuses: string[];
  businessTypes: string[];
  industries: string[];
}

// Filter options
const VIOLATION_CATEGORY_OPTIONS = [
  { value: 'food_safety', label: 'An toàn thực phẩm' },
  { value: 'counterfeit', label: 'Hàng giả' },
  { value: 'pharma', label: 'Dược phẩm' },
  { value: 'price', label: 'Giá cả' },
  { value: 'license', label: 'Giấy phép' },
];

const RISK_STATUS_OPTIONS = [
  { value: 'processing', label: 'Đang xử lý' },
  { value: 'resolved', label: 'Đã giải quyết' },
  { value: 'pending', label: 'Chờ xác minh' },
  { value: 'monitoring', label: 'Đang giám sát' },
];

const BUSINESS_TYPE_OPTIONS = [
  { value: 'sole_proprietor', label: 'Doanh nghiệp tư nhân' },
  { value: 'llc', label: 'Công ty TNHH' },
  { value: 'jsc', label: 'Công ty cổ phần' },
  { value: 'household', label: 'Hộ kinh doanh' },
];

const INDUSTRY_OPTIONS = [
  { value: 'tech', label: 'Công nghệ' },
  { value: 'food', label: 'Thực phẩm' },
  { value: 'retail', label: 'Bán lẻ' },
  { value: 'healthcare', label: 'Y tế' },
  { value: 'fashion', label: 'Thời trang' },
];

interface RiskMerchant {
  id: number;
  name: string;
  district: string;
  industry: string;
  riskScore: number;
  riskLevel: 'Cao' | 'Trung bình' | 'Thấp';
  violations: number;
  reoffendCount: number;
  lastViolation: string;
  riskFactors: string[];
}

// Mock data - Top merchants có rủi ro cao
const RISK_MERCHANTS: RiskMerchant[] = [
  {
    id: 1,
    name: 'Cửa hàng Thực phẩm ABC',
    district: 'Q1',
    industry: 'Thực phẩm',
    riskScore: 89,
    riskLevel: 'Cao',
    violations: 5,
    reoffendCount: 3,
    lastViolation: '2025-01-15',
    riskFactors: ['Tái phạm nhiều lần', 'Vi phạm ATTP nghiêm trọng', 'Không khắc phục']
  },
  {
    id: 2,
    name: 'Nhà thuốc XYZ',
    district: 'Q3',
    industry: 'Y tế',
    riskScore: 85,
    riskLevel: 'Cao',
    violations: 4,
    reoffendCount: 2,
    lastViolation: '2025-01-20',
    riskFactors: ['Thuốc không nguồn gốc', 'Tái phạm', 'Kinh doanh không phép']
  },
  {
    id: 3,
    name: 'Siêu thị Mini DEF',
    district: 'Q5',
    industry: 'Bán lẻ',
    riskScore: 78,
    riskLevel: 'Cao',
    violations: 6,
    reoffendCount: 4,
    lastViolation: '2025-01-10',
    riskFactors: ['Tái phạm liên tục', 'Hàng giả', 'Không rõ nguồn gốc']
  },
  {
    id: 4,
    name: 'Cửa hàng Điện tử GHI',
    district: 'Q2',
    industry: 'Công nghệ',
    riskScore: 72,
    riskLevel: 'Cao',
    violations: 3,
    reoffendCount: 1,
    lastViolation: '2025-01-25',
    riskFactors: ['Hàng nhái', 'Không tem kiểm định']
  },
  {
    id: 5,
    name: 'Quán ăn JKL',
    district: 'Q4',
    industry: 'Thực phẩm',
    riskScore: 68,
    riskLevel: 'Trung bình',
    violations: 2,
    reoffendCount: 1,
    lastViolation: '2025-01-18',
    riskFactors: ['ATTP chưa đt', 'Thiếu giấy phép']
  }
];

// Xu hướng vi phạm theo thời gian
const VIOLATION_TREND = [
  { month: 'T8/24', count: 145, change: 0 },
  { month: 'T9/24', count: 158, change: 8.9 },
  { month: 'T10/24', count: 172, change: 8.8 },
  { month: 'T11/24', count: 168, change: -2.3 },
  { month: 'T12/24', count: 189, change: 12.5 },
  { month: 'T1/25', count: 203, change: 7.4 }
];

// Điểm bùng phát vi phạm theo địa bàn
const HOTSPOT_DATA = [
  { district: 'Q1', violations: 45, trend: 12, status: 'Tăng mạnh' },
  { district: 'Q3', violations: 38, trend: 8, status: 'Tăng' },
  { district: 'Q5', violations: 42, trend: 15, status: 'Tăng mạnh' },
  { district: 'Q2', violations: 28, trend: -5, status: 'Giảm' },
  { district: 'Q4', violations: 31, trend: 3, status: 'Ổn định' },
  { district: 'Q7', violations: 19, trend: -8, status: 'Giảm' }
];

// Phân tích tái phạm
const REOFFEND_ANALYSIS = [
  { interval: '< 1 tháng', count: 12, rate: 42 },
  { interval: '1-3 tháng', count: 18, rate: 35 },
  { interval: '3-6 tháng', count: 15, rate: 28 },
  { interval: '> 6 tháng', count: 8, rate: 15 }
];

interface RiskDashboardProps {
  timeRange: TimeRange;
}

export default function RiskDashboard({ timeRange }: RiskDashboardProps) {
  const [filters, setFilters] = useState<RiskFilters>({
    violationCategories: [],
    riskStatuses: [],
    businessTypes: [],
    industries: [],
  });
  
  // KPI calculations
  const highRiskMerchants = RISK_MERCHANTS.filter(m => m.riskLevel === 'Cao').length;
  const avgRiskScore = (RISK_MERCHANTS.reduce((sum, m) => sum + m.riskScore, 0) / RISK_MERCHANTS.length).toFixed(1);
  const totalReoffenders = RISK_MERCHANTS.filter(m => m.reoffendCount > 1).length;
  const reoffendRate = ((totalReoffenders / RISK_MERCHANTS.length) * 100).toFixed(1);

  return (
    <div className={styles.tabContent}>
      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <div className={styles.kpiTitleRow}>
              <div className={styles.kpiIcon} style={{ color: '#f94144' }}>
                <ShieldAlert className="w-5 h-5" />
              </div>
              <span className={styles.kpiTitle}>Merchant rủi ro cao</span>
            </div>
            <span className={cn(styles.kpiTrend, styles.trendUp)}>
              <TrendingUp className="w-3 h-3" />
              8.5%
            </span>
          </div>
          <div className={styles.kpiValue}>
            <span className={styles.kpiNumber}>{highRiskMerchants}</span>
            <span className={styles.kpiUnit}>merchant</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <div className={styles.kpiTitleRow}>
              <div className={styles.kpiIcon} style={{ color: '#f7a23b' }}>
                <AlertTriangle className="w-5 h-5" />
              </div>
              <span className={styles.kpiTitle}>Điểm rủi ro trung bình</span>
            </div>
          </div>
          <div className={styles.kpiValue}>
            <span className={styles.kpiNumber}>{avgRiskScore}</span>
            <span className={styles.kpiUnit}>/100</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <div className={styles.kpiTitleRow}>
              <div className={styles.kpiIcon} style={{ color: '#f94144' }}>
                <RefreshCw className="w-5 h-5" />
              </div>
              <span className={styles.kpiTitle}>Merchant tái phạm</span>
            </div>
            <span className={cn(styles.kpiTrend, styles.trendUp)}>
              <TrendingUp className="w-3 h-3" />
              12.3%
            </span>
          </div>
          <div className={styles.kpiValue}>
            <span className={styles.kpiNumber}>{totalReoffenders}</span>
            <span className={styles.kpiUnit}>merchant</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <div className={styles.kpiTitleRow}>
              <div className={styles.kpiIcon} style={{ color: '#f7a23b' }}>
                <Clock className="w-5 h-5" />
              </div>
              <span className={styles.kpiTitle}>Tỷ lệ tái phạm</span>
            </div>
            <span className={cn(styles.kpiTrend, styles.trendDown)}>
              <TrendingDown className="w-3 h-3" />
              3.2%
            </span>
          </div>
          <div className={styles.kpiValue}>
            <span className={styles.kpiNumber}>{reoffendRate}</span>
            <span className={styles.kpiUnit}>%</span>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className={styles.filterSection}>
        <div className={styles.filterItem}>
          <label className={styles.filterLabel}>Danh mục vi phạm:</label>
          <MultiSelectDropdown
            label="Danh mục vi phạm"
            options={VIOLATION_CATEGORY_OPTIONS}
            selectedValues={filters.violationCategories}
            onChange={(selected) => setFilters({ ...filters, violationCategories: selected })}
            placeholder="Chọn..."
            showLabel={false}
          />
        </div>
        <div className={styles.filterItem}>
          <label className={styles.filterLabel}>Tình trạng rủi ro:</label>
          <MultiSelectDropdown
            label="Tình trạng rủi ro"
            options={RISK_STATUS_OPTIONS}
            selectedValues={filters.riskStatuses}
            onChange={(selected) => setFilters({ ...filters, riskStatuses: selected })}
            placeholder="Chọn..."
            showLabel={false}
          />
        </div>
        <div className={styles.filterItem}>
          <label className={styles.filterLabel}>Phân loại doanh nghiệp:</label>
          <MultiSelectDropdown
            label="Phân loại doanh nghiệp"
            options={BUSINESS_TYPE_OPTIONS}
            selectedValues={filters.businessTypes}
            onChange={(selected) => setFilters({ ...filters, businessTypes: selected })}
            placeholder="Chọn..."
            showLabel={false}
          />
        </div>
        <div className={styles.filterItem}>
          <label className={styles.filterLabel}>Ngành nghề:</label>
          <MultiSelectDropdown
            label="Ngành nghề"
            options={INDUSTRY_OPTIONS}
            selectedValues={filters.industries}
            onChange={(selected) => setFilters({ ...filters, industries: selected })}
            placeholder="Chọn..."
            showLabel={false}
          />
        </div>
        <button 
          className={styles.clearFilterButton} 
          onClick={() => setFilters({ violationCategories: [], riskStatuses: [], businessTypes: [], industries: [] })}
        >
          <X className="w-4 h-4" />
          Xóa bộ lọc
        </button>
      </div>

      {/* Top High Risk Merchants */}
      <div className={styles.chartCard}>
        <h3 className={styles.chartTitle}>Top Merchant rủi ro cao (Top {RISK_MERCHANTS.length})</h3>
        <p className={styles.chartSubtitle}>
          Danh sách các merchant có điểm rủi ro cao cần giám sát đặc biệt
        </p>
        <div className={styles.tableContainer}>
          <table className={styles.performanceTable}>
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên merchant</th>
                <th>Địa bàn</th>
                <th>Ngành</th>
                <th>Điểm rủi ro</th>
                <th>Mức độ</th>
                <th>Số lần vi phạm</th>
                <th>Số lần tái phạm</th>
                <th>Yếu tố rủi ro</th>
              </tr>
            </thead>
            <tbody>
              {RISK_MERCHANTS.map((merchant, index) => (
                <tr key={merchant.id}>
                  <td>{index + 1}</td>
                  <td className={styles.teamName}>{merchant.name}</td>
                  <td>{merchant.district}</td>
                  <td>{merchant.industry}</td>
                  <td>
                    <span 
                      className={styles.completionRate}
                      style={{ 
                        color: merchant.riskScore >= 80 ? '#f94144' : 
                               merchant.riskScore >= 60 ? '#f7a23b' : '#0fc87a' 
                      }}
                    >
                      {merchant.riskScore}
                    </span>
                  </td>
                  <td>
                    <span 
                      className={cn(
                        styles.statusBadge,
                        merchant.riskLevel === 'Cao' ? styles.statusDanger :
                        merchant.riskLevel === 'Trung bình' ? styles.statusWarning :
                        styles.statusEfficient
                      )}
                    >
                      {merchant.riskLevel}
                    </span>
                  </td>
                  <td>{merchant.violations}</td>
                  <td>
                    <span style={{ color: merchant.reoffendCount > 2 ? '#f94144' : 'inherit' }}>
                      {merchant.reoffendCount}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
                      {merchant.riskFactors.slice(0, 2).join(', ')}
                      {merchant.riskFactors.length > 2 && '...'}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts Grid */}
      <div className={styles.chartsGrid}>
        {/* Violation Trend */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Xu hướng vi phạm theo thời gian</h3>
          <p className={styles.chartSubtitle}>
            Biến động số lượng vi phạm qua các tháng
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={VIOLATION_TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--card)', 
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#f94144" 
                strokeWidth={2}
                name="Số vi phạm"
                dot={{ fill: '#f94144', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Hotspot by District */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Điểm bùng phát vi phạm theo địa bàn</h3>
          <p className={styles.chartSubtitle}>
            Các địa bàn có xu hướng tăng vi phạm đột biến
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={HOTSPOT_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="district" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--card)', 
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)'
                }}
              />
              <Legend />
              <Bar dataKey="violations" name="Số vi phạm" radius={[8, 8, 0, 0]}>
                {HOTSPOT_DATA.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.trend > 10 ? '#f94144' : entry.trend > 5 ? '#f7a23b' : '#695cfb'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* Legend for hotspot status */}
          <div style={{ marginTop: '1rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            {HOTSPOT_DATA.map((item, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin 
                  className="w-4 h-4" 
                  style={{ 
                    color: item.trend > 10 ? '#f94144' : item.trend > 5 ? '#f7a23b' : '#0fc87a' 
                  }} 
                />
                <span style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
                  {item.district}: {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reoffender Analysis */}
      <div className={styles.chartCard}>
        <h3 className={styles.chartTitle}>Phân tích tái phạm</h3>
        <p className={styles.chartSubtitle}>
          Thời gian giữa các lần vi phạm và hiệu quả hậu kiểm
        </p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={REOFFEND_ANALYSIS}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="interval" stroke="var(--muted-foreground)" />
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
            <Bar 
              yAxisId="left"
              dataKey="count" 
              fill="#695cfb" 
              name="Số merchant" 
              radius={[8, 8, 0, 0]} 
            />
            <Bar 
              yAxisId="right"
              dataKey="rate" 
              fill="#f7a23b" 
              name="Tỷ lệ tái phạm (%)" 
              radius={[8, 8, 0, 0]} 
            />
          </BarChart>
        </ResponsiveContainer>

        {/* Analysis Summary */}
        <div className={styles.analysisCard} style={{ marginTop: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}>
                Tái phạm nhanh {'(<'} 1 tháng)
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: '600', color: '#f94144' }}>
                42%
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}>
                Thời gian TB giữa các lần
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--primary)' }}>
                2.8 tháng
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}>
                Hiệu quả hậu kiểm
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: '600', color: '#0fc87a' }}>
                68%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
