import { useState } from 'react';
import { 
  TrendingUp, 
  Target, 
  Users, 
  Radio,
  CheckCircle2,
  XCircle,
  Eye,
  Award,
  Filter,
  Calendar,
  Download,
  BarChart3,
} from 'lucide-react';
import { Breadcrumb } from '../../app/components/Breadcrumb';
import styles from './QualityMetrics.module.css';

type TimeRange = '7d' | '30d' | '90d' | 'all';

// Mock data
const accuracyData = {
  overall: {
    total: 156,
    truePositive: 89,
    falsePositive: 45,
    monitoring: 22,
    accuracy: 66.4,
    precision: 66.4,
  },
  trend: [
    { week: 'T1', accuracy: 62, total: 25 },
    { week: 'T2', accuracy: 65, total: 28 },
    { week: 'T3', accuracy: 68, total: 32 },
    { week: 'T4', accuracy: 71, total: 35 },
    { week: 'T5', accuracy: 66, total: 36 },
  ],
};

const sourceQuality = [
  { source: 'Hotline 1800', total: 45, truePositive: 38, falsePositive: 5, monitoring: 2, accuracy: 84.4, trend: 'up' },
  { source: 'Mobile App', total: 38, truePositive: 28, falsePositive: 8, monitoring: 2, accuracy: 73.7, trend: 'stable' },
  { source: 'Hiện trường', total: 32, truePositive: 15, falsePositive: 15, monitoring: 2, accuracy: 46.9, trend: 'down' },
  { source: 'Mạng xã hội', total: 25, truePositive: 5, falsePositive: 15, monitoring: 5, accuracy: 20.0, trend: 'down' },
  { source: 'Tự động phát hiện', total: 16, truePositive: 3, falsePositive: 2, monitoring: 11, accuracy: 60.0, trend: 'up' },
];

const analystPerformance = [
  { name: 'Nguyễn Văn A', userId: 'QT24_NGUYENVANA', handled: 45, truePositive: 35, falsePositive: 8, monitoring: 2, accuracy: 81.4, avgTime: '2.3h' },
  { name: 'Trần Thị B', userId: 'QT24_TRANTHIB', handled: 38, truePositive: 28, falsePositive: 8, monitoring: 2, accuracy: 77.8, avgTime: '3.1h' },
  { name: 'Lê Văn C', userId: 'QT24_LEVANC', handled: 32, truePositive: 18, falsePositive: 12, monitoring: 2, accuracy: 60.0, avgTime: '4.2h' },
  { name: 'Phạm Minh D', userId: 'QT24_PHAMMINHD', handled: 41, truePositive: 8, falsePositive: 17, monitoring: 16, accuracy: 32.0, avgTime: '1.8h' },
];

const riskIntelligence = [
  { riskLevel: 'Critical', total: 12, truePositive: 11, falsePositive: 1, accuracy: 91.7 },
  { riskLevel: 'High', total: 35, truePositive: 28, falsePositive: 5, accuracy: 84.8 },
  { riskLevel: 'Medium', total: 68, truePositive: 38, falsePositive: 25, accuracy: 60.3 },
  { riskLevel: 'Low', total: 41, truePositive: 12, falsePositive: 14, accuracy: 46.2 },
];

export default function QualityMetrics() {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [selectedCategory, setSelectedCategory] = useState('all');

  return (
    <div className={styles.container}>
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Nguồn tin, Rủi ro', path: '/lead-risk/inbox' },
          { label: 'Phân tích chất lượng' },
        ]}
      />

      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.titleRow}>
            <div className={styles.titleSection}>
              <BarChart3 size={32} className={styles.titleIcon} />
              <div>
                <h1 className={styles.title}>Chỉ số chất lượng</h1>
                <p className={styles.subtitle}>Phân tích chất lượng nguồn tin và hiệu suất xử lý</p>
              </div>
            </div>
            <div className={styles.headerActions}>
              <select 
                value={timeRange} 
                onChange={(e) => setTimeRange(e.target.value as TimeRange)}
                className={styles.timeRangeSelect}
              >
                <option value="7d">7 ngày qua</option>
                <option value="30d">30 ngày qua</option>
                <option value="90d">90 ngày qua</option>
                <option value="all">Tất cả</option>
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
              <Target size={24} />
            </div>
            <div className={styles.cardContent}>
              <div className={styles.cardLabel}>Độ chính xác chung</div>
              <div className={styles.cardValue}>{accuracyData.overall.accuracy}%</div>
              <div className={styles.cardMeta}>
                <TrendingUp size={14} />
                +4.2% so với tháng trước
              </div>
            </div>
          </div>

          <div className={styles.overviewCard}>
            <div className={styles.cardIcon} style={{ background: 'rgba(0, 92, 182, 0.1)', color: 'var(--primary)' }}>
              <CheckCircle2 size={24} />
            </div>
            <div className={styles.cardContent}>
              <div className={styles.cardLabel}>Chính xác</div>
              <div className={styles.cardValue}>{accuracyData.overall.truePositive}</div>
              <div className={styles.cardMeta}>
                {((accuracyData.overall.truePositive / accuracyData.overall.total) * 100).toFixed(1)}% tổng nguồn tin
              </div>
            </div>
          </div>

          <div className={styles.overviewCard}>
            <div className={styles.cardIcon} style={{ background: 'rgba(249, 65, 68, 0.1)', color: 'var(--chart-1)' }}>
              <XCircle size={24} />
            </div>
            <div className={styles.cardContent}>
              <div className={styles.cardLabel}>Không chính xác</div>
              <div className={styles.cardValue}>{accuracyData.overall.falsePositive}</div>
              <div className={styles.cardMeta}>
                {((accuracyData.overall.falsePositive / accuracyData.overall.total) * 100).toFixed(1)}% tổng nguồn tin
              </div>
            </div>
          </div>

          <div className={styles.overviewCard}>
            <div className={styles.cardIcon} style={{ background: 'rgba(255, 159, 64, 0.1)', color: 'var(--chart-2)' }}>
              <Eye size={24} />
            </div>
            <div className={styles.cardContent}>
              <div className={styles.cardLabel}>Đang theo dõi</div>
              <div className={styles.cardValue}>{accuracyData.overall.monitoring}</div>
              <div className={styles.cardMeta}>
                {((accuracyData.overall.monitoring / accuracyData.overall.total) * 100).toFixed(1)}% tổng nguồn tin
              </div>
            </div>
          </div>
        </div>

        {/* Accuracy Trend */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Xu hướng độ chính xác</h2>
            <p className={styles.sectionDesc}>Độ chính xác theo thời gian</p>
          </div>
          <div className={styles.chartCard}>
            <div className={styles.trendChart}>
              {accuracyData.trend.map((point, idx) => (
                <div key={idx} className={styles.trendBar}>
                  <div className={styles.barValue}>{point.accuracy}%</div>
                  <div className={styles.bar}>
                    <div 
                      className={styles.barFill} 
                      style={{ height: `${point.accuracy}%` }}
                    />
                  </div>
                  <div className={styles.barLabel}>{point.week}</div>
                  <div className={styles.barCount}>{point.total} nguồn tin</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Source Quality */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <h2>Chất lượng theo Nguồn</h2>
              <p className={styles.sectionDesc}>Nguồn nào cung cấp leads chính xác nhất</p>
            </div>
          </div>
          <div className={styles.tableCard}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nguồn</th>
                  <th>Tổng nguồn tin</th>
                  <th>Chính xác</th>
                  <th>Không chính xác</th>
                  <th>Theo dõi</th>
                  <th>Độ chính xác</th>
                  <th>Xu hướng</th>
                </tr>
              </thead>
              <tbody>
                {sourceQuality.map((source, idx) => (
                  <tr key={idx}>
                    <td>
                      <div className={styles.sourceCell}>
                        <Radio size={16} />
                        {source.source}
                      </div>
                    </td>
                    <td>{source.total}</td>
                    <td>
                      <span className={styles.badge} data-type="success">
                        {source.truePositive}
                      </span>
                    </td>
                    <td>
                      <span className={styles.badge} data-type="error">
                        {source.falsePositive}
                      </span>
                    </td>
                    <td>
                      <span className={styles.badge} data-type="warning">
                        {source.monitoring}
                      </span>
                    </td>
                    <td>
                      <div className={styles.accuracyCell}>
                        <div className={styles.accuracyBar}>
                          <div 
                            className={styles.accuracyFill}
                            style={{ 
                              width: `${source.accuracy}%`,
                              background: source.accuracy >= 70 ? 'var(--chart-4)' : source.accuracy >= 50 ? 'var(--chart-2)' : 'var(--chart-1)'
                            }}
                          />
                        </div>
                        <span className={styles.accuracyValue}>{source.accuracy}%</span>
                      </div>
                    </td>
                    <td>
                      <div className={styles.trendIcon} data-trend={source.trend}>
                        {source.trend === 'up' && <TrendingUp size={16} />}
                        {source.trend === 'down' && <TrendingUp size={16} style={{ transform: 'rotate(180deg)' }} />}
                        {source.trend === 'stable' && '—'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Analyst Performance */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <h2>Hiệu suất Analyst</h2>
              <p className={styles.sectionDesc}>Đánh giá độ chính xác của từng cán bộ</p>
            </div>
          </div>
          <div className={styles.tableCard}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Cán bộ</th>
                  <th>Đã xử lý</th>
                  <th>Chính xác</th>
                  <th>Không chính xác</th>
                  <th>Theo dõi</th>
                  <th>Độ chính xác</th>
                  <th>TG trung bình</th>
                  <th>Xếp hạng</th>
                </tr>
              </thead>
              <tbody>
                {analystPerformance
                  .sort((a, b) => b.accuracy - a.accuracy)
                  .map((analyst, idx) => (
                    <tr key={idx}>
                      <td>
                        <div className={styles.analystCell}>
                          <Users size={16} />
                          <div>
                            <div className={styles.analystName}>{analyst.name}</div>
                            <div className={styles.analystId}>{analyst.userId}</div>
                          </div>
                        </div>
                      </td>
                      <td>{analyst.handled}</td>
                      <td>
                        <span className={styles.badge} data-type="success">
                          {analyst.truePositive}
                        </span>
                      </td>
                      <td>
                        <span className={styles.badge} data-type="error">
                          {analyst.falsePositive}
                        </span>
                      </td>
                      <td>
                        <span className={styles.badge} data-type="warning">
                          {analyst.monitoring}
                        </span>
                      </td>
                      <td>
                        <div className={styles.accuracyCell}>
                          <div className={styles.accuracyBar}>
                            <div 
                              className={styles.accuracyFill}
                              style={{ 
                                width: `${analyst.accuracy}%`,
                                background: analyst.accuracy >= 70 ? 'var(--chart-4)' : analyst.accuracy >= 50 ? 'var(--chart-2)' : 'var(--chart-1)'
                              }}
                            />
                          </div>
                          <span className={styles.accuracyValue}>{analyst.accuracy}%</span>
                        </div>
                      </td>
                      <td>{analyst.avgTime}</td>
                      <td>
                        {idx === 0 && (
                          <div className={styles.rankBadge} data-rank="1">
                            <Award size={14} />
                            #1
                          </div>
                        )}
                        {idx > 0 && (
                          <div className={styles.rankBadge}>
                            #{idx + 1}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Risk Intelligence */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <h2>Chất lượng phân tích rủi ro</h2>
              <p className={styles.sectionDesc}>Tương quan giữa điểm rủi ro và kết quả thực tế</p>
            </div>
          </div>
          <div className={styles.riskIntelGrid}>
            {riskIntelligence.map((risk, idx) => (
              <div key={idx} className={styles.riskIntelCard}>
                <div className={styles.riskIntelHeader}>
                  <h4>{risk.riskLevel}</h4>
                  <span className={styles.riskIntelAccuracy}>{risk.accuracy}%</span>
                </div>
                <div className={styles.riskIntelBody}>
                  <div className={styles.riskIntelRow}>
                    <span>Tổng nguồn tin:</span>
                    <span>{risk.total}</span>
                  </div>
                  <div className={styles.riskIntelRow}>
                    <span>Chính xác:</span>
                    <span className={styles.greenText}>{risk.truePositive}</span>
                  </div>
                  <div className={styles.riskIntelRow}>
                    <span>Không chính xác:</span>
                    <span className={styles.redText}>{risk.falsePositive}</span>
                  </div>
                </div>
                <div className={styles.riskIntelBar}>
                  <div 
                    className={styles.riskIntelFill}
                    style={{ 
                      width: `${risk.accuracy}%`,
                      background: risk.accuracy >= 80 ? 'var(--chart-4)' : risk.accuracy >= 60 ? 'var(--chart-2)' : 'var(--chart-1)'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Insights */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Phân tích chính</h2>
          </div>
          <div className={styles.insightsGrid}>
            <div className={styles.insightCard} data-type="success">
              <CheckCircle2 size={20} />
              <div>
                <h4>Hotline 1800 có độ chính xác cao nhất</h4>
                <p>84.4% nguồn tin từ hotline là chính xác. Nên ưu tiên xử lý nguồn này.</p>
              </div>
            </div>
            <div className={styles.insightCard} data-type="warning">
              <XCircle size={20} />
              <div>
                <h4>Mạng xã hội có nhiều nhiễu</h4>
                <p>Chỉ 20% độ chính xác. Cần cải thiện bộ lọc hoặc sàng lọc kỹ hơn.</p>
              </div>
            </div>
            <div className={styles.insightCard} data-type="info">
              <Target size={20} />
              <div>
                <h4>Chấm điểm rủi ro hoạt động tốt</h4>
                <p>Critical và High risk có độ chính xác 85-92%. Có thể tin tưởng vào phân tích rủi ro.</p>
              </div>
            </div>
            <div className={styles.insightCard} data-type="warning">
              <Users size={20} />
              <div>
                <h4>Một cán bộ cần đào tạo</h4>
                <p>Phạm Minh D có độ chính xác 32%, thấp hơn trung bình. Cần đánh giá lại quy trình.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}