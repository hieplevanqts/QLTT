import { useState } from 'react';
import { 
  Search, 
  MapPin, 
  AlertTriangle, 
  TrendingUp, 
  Target, 
  Download,
  Calendar,
  Clock,
  CheckCircle2,
  FileText,
  Plus,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockHotspots } from '@/utils/data/lead-risk/mockLeads';
import type { Hotspot } from '@/utils/data/lead-risk/types';
import { ActionModal, ActionType } from '@/components/ActionModal';
import { Breadcrumb } from '@/components/Breadcrumb';
import styles from './HotspotExplorer.module.css';

export default function HotspotExplorer() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'monitoring' | 'resolved'>('all');
  const [sortBy, setSortBy] = useState<'risk' | 'leads' | 'recent'>('risk');
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<ActionType>('task');

  // Filter and sort hotspots
  const filteredHotspots = mockHotspots
    .filter(h => {
      if (statusFilter !== 'all' && h.status !== statusFilter) return false;
      if (searchQuery && !h.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'risk') return b.riskScore - a.riskScore;
      if (sortBy === 'leads') return b.leadCount - a.leadCount;
      if (sortBy === 'recent') return b.lastActivityAt.getTime() - a.lastActivityAt.getTime();
      return 0;
    });

  const totalHotspots = filteredHotspots.length;
  const activeHotspots = filteredHotspots.filter(h => h.status === 'active').length;
  const totalLeads = filteredHotspots.reduce((sum, h) => sum + h.leadCount, 0);
  const avgRiskScore = filteredHotspots.reduce((sum, h) => sum + h.riskScore, 0) / (totalHotspots || 1);

  const handleActionSubmit = (data: any) => {
    // TODO: Implement actual API call
    alert(`${data.type === 'task' ? 'Công việc' : data.type === 'plan' ? 'Kế hoạch' : 'Theo dõi'} đã được tạo thành công!`);
  };

  return (
    <div className={styles.container}>
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Nguồn tin, Rủi ro', path: '/lead-risk/inbox' },
          { label: 'Phân tích điểm nóng' },
        ]}
      />

      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Khảo sát điểm nóng</h1>
          <p className={styles.subtitle}>Phân tích các điểm nóng vi phạm trên toàn quốc</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.actionBtn}>
            <Download size={16} />
            Xuất báo cáo
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon} style={{ background: 'rgba(249, 65, 68, 0.1)', color: 'rgb(249, 65, 68)' }}>
            <Target size={24} />
          </div>
          <div className={styles.kpiContent}>
            <div className={styles.kpiLabel}>Tổng điểm nóng</div>
            <div className={styles.kpiValue}>{totalHotspots}</div>
            <div className={styles.kpiSubtext}>{activeHotspots} đang hoạt động</div>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon} style={{ background: 'rgba(247, 162, 59, 0.1)', color: 'rgb(247, 162, 59)' }}>
            <AlertTriangle size={24} />
          </div>
          <div className={styles.kpiContent}>
            <div className={styles.kpiLabel}>Điểm rủi ro TB</div>
            <div className={styles.kpiValue}>{avgRiskScore.toFixed(0)}</div>
            <div className={styles.kpiSubtext}>Trên thang 100</div>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon} style={{ background: 'rgba(105, 92, 251, 0.1)', color: 'rgb(105, 92, 251)' }}>
            <TrendingUp size={24} />
          </div>
          <div className={styles.kpiContent}>
            <div className={styles.kpiLabel}>Tổng nguồn tin</div>
            <div className={styles.kpiValue}>{totalLeads}</div>
            <div className={styles.kpiSubtext}>Từ các điểm nóng</div>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon} style={{ background: 'rgba(0, 199, 242, 0.1)', color: 'rgb(0, 199, 242)' }}>
            <MapPin size={24} />
          </div>
          <div className={styles.kpiContent}>
            <div className={styles.kpiLabel}>Khu vực</div>
            <div className={styles.kpiValue}>{new Set(filteredHotspots.map(h => h.province)).size}</div>
            <div className={styles.kpiSubtext}>Tỉnh/Thành phố</div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className={styles.filterBar}>
        <div className={styles.searchBox}>
          <Search size={16} />
          <input
            type="text"
            placeholder="Tìm kiếm điểm nóng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={styles.filters}>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)}>
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="monitoring">Đang theo dõi</option>
            <option value="resolved">Đã giải quyết</option>
          </select>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
            <option value="risk">Sắp xếp: Rủi ro cao nhất</option>
            <option value="leads">Sắp xếp: Nhiều nguồn tin nhất</option>
            <option value="recent">Sắp xếp: Hoạt động gần nhất</option>
          </select>
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {/* Hotspot List */}
        <div className={styles.listPanel}>
          <div className={styles.listHeader}>
            <h3>Danh sách điểm nóng ({filteredHotspots.length})</h3>
          </div>
          <div className={styles.list}>
            {filteredHotspots.map((hotspot) => (
              <div
                key={hotspot.id}
                className={`${styles.hotspotCard} ${selectedHotspot?.id === hotspot.id ? styles.hotspotCardActive : ''}`}
                onClick={() => setSelectedHotspot(hotspot)}
              >
                <div className={styles.hotspotHeader}>
                  <div className={styles.hotspotTitle}>
                    <MapPin size={16} />
                    {hotspot.name}
                  </div>
                  <div className={styles.statusBadge} data-status={hotspot.status}>
                    {getStatusLabel(hotspot.status)}
                  </div>
                </div>

                <div className={styles.hotspotLocation}>
                  {hotspot.district}, {hotspot.province}
                </div>

                <div className={styles.hotspotMetrics}>
                  <div className={styles.metric}>
                    <div className={styles.metricLabel}>Điểm rủi ro</div>
                    <div className={styles.metricValue} data-risk={getRiskLevel(hotspot.riskScore)}>
                      {hotspot.riskScore}
                    </div>
                  </div>
                  <div className={styles.metric}>
                    <div className={styles.metricLabel}>Nguồn tin</div>
                    <div className={styles.metricValue}>{hotspot.leadCount}</div>
                  </div>
                  <div className={styles.metric}>
                    <div className={styles.metricLabel}>Đang xử lý</div>
                    <div className={styles.metricValue}>{hotspot.activeLeadCount}</div>
                  </div>
                </div>

                <div className={styles.categories}>
                  {hotspot.topCategories.slice(0, 2).map((cat, idx) => (
                    <div key={idx} className={styles.categoryTag}>
                      {getCategoryLabel(cat.category)} ({cat.count})
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {filteredHotspots.length === 0 && (
              <div className={styles.emptyState}>
                <Target size={48} />
                <p>Không tìm thấy điểm nóng nào</p>
              </div>
            )}
          </div>
        </div>

        {/* Detail Panel */}
        <div className={styles.detailPanel}>
          {selectedHotspot ? (
            <div className={styles.detail}>
              <div className={styles.detailHeader}>
                <div>
                  <h2 className={styles.detailTitle}>{selectedHotspot.name}</h2>
                  <div className={styles.detailLocation}>
                    <MapPin size={14} />
                    {selectedHotspot.district}, {selectedHotspot.province}
                  </div>
                </div>
                <div className={styles.statusBadge} data-status={selectedHotspot.status}>
                  {getStatusLabel(selectedHotspot.status)}
                </div>
              </div>

              {/* Risk Score */}
              <div className={styles.section}>
                <h3>Điểm rủi ro</h3>
                <div className={styles.riskMeter}>
                  <div className={styles.riskScore} data-risk={getRiskLevel(selectedHotspot.riskScore)}>
                    {selectedHotspot.riskScore}
                  </div>
                  <div className={styles.riskBar}>
                    <div 
                      className={styles.riskFill} 
                      style={{ width: `${selectedHotspot.riskScore}%` }}
                      data-risk={getRiskLevel(selectedHotspot.riskScore)}
                    />
                  </div>
                  <div className={styles.riskLabel}>
                    {getRiskLevelLabel(selectedHotspot.riskScore)}
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className={styles.section}>
                <h3>Thống kê</h3>
                <div className={styles.statsGrid}>
                  <div className={styles.statItem}>
                    <div className={styles.statLabel}>Tổng nguồn tin</div>
                    <div className={styles.statValue}>{selectedHotspot.leadCount}</div>
                  </div>
                  <div className={styles.statItem}>
                    <div className={styles.statLabel}>Đang xử lý</div>
                    <div className={styles.statValue}>{selectedHotspot.activeLeadCount}</div>
                  </div>
                  <div className={styles.statItem}>
                    <div className={styles.statLabel}>Bán kính</div>
                    <div className={styles.statValue}>{selectedHotspot.location.radius}m</div>
                  </div>
                  <div className={styles.statItem}>
                    <div className={styles.statLabel}>Hoạt động gần nhất</div>
                    <div className={styles.statValue}>
                      {new Date(selectedHotspot.lastActivityAt).toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Categories */}
              <div className={styles.section}>
                <h3>Vi phạm chính</h3>
                <div className={styles.categoryList}>
                  {selectedHotspot.topCategories.map((cat, idx) => (
                    <div key={idx} className={styles.categoryItem}>
                      <div className={styles.categoryInfo}>
                        <div className={styles.categoryName}>{getCategoryLabel(cat.category)}</div>
                        <div className={styles.categoryCount}>{cat.count} nguồn tin</div>
                      </div>
                      <div className={styles.categoryBar}>
                        <div 
                          className={styles.categoryBarFill} 
                          style={{ width: `${cat.percentage}%` }}
                        />
                      </div>
                      <div className={styles.categoryPercent}>{cat.percentage.toFixed(1)}%</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div className={styles.section}>
                <h3>Thời gian</h3>
                <div className={styles.timeline}>
                  <div className={styles.timelineItem}>
                    <Calendar size={16} />
                    <div>
                      <div className={styles.timelineLabel}>Phát hiện</div>
                      <div className={styles.timelineValue}>
                        {new Date(selectedHotspot.detectedAt).toLocaleDateString('vi-VN')}
                      </div>
                    </div>
                  </div>
                  <div className={styles.timelineItem}>
                    <Clock size={16} />
                    <div>
                      <div className={styles.timelineLabel}>Hoạt động gần nhất</div>
                      <div className={styles.timelineValue}>
                        {new Date(selectedHotspot.lastActivityAt).toLocaleString('vi-VN')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className={styles.actions}>
                <button 
                  className={styles.primaryBtn}
                  onClick={() => {
                    setActionType('task');
                    setShowActionModal(true);
                  }}
                >
                  <CheckCircle2 size={16} />
                  Tạo công việc
                </button>
                <button 
                  className={styles.primaryBtn}
                  onClick={() => {
                    setActionType('plan');
                    setShowActionModal(true);
                  }}
                >
                  <FileText size={16} />
                  Tạo kế hoạch
                </button>
                <button 
                  className={styles.secondaryBtn}
                  onClick={() => {
                    setActionType('followup');
                    setShowActionModal(true);
                  }}
                >
                  <Plus size={16} />
                  Tạo theo dõi
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.emptyDetail}>
              <Target size={64} />
              <h3>Chọn một điểm nóng</h3>
              <p>Chọn một điểm nóng từ danh sách bên trái để xem chi tiết</p>
            </div>
          )}
        </div>
      </div>

      {/* Action Modal */}
      <ActionModal
        isOpen={showActionModal}
        onClose={() => setShowActionModal(false)}
        onSubmit={handleActionSubmit}
        type={actionType}
        source={selectedHotspot ? {
          type: 'hotspot',
          id: selectedHotspot.id,
          name: selectedHotspot.name
        } : undefined}
      />
    </div>
  );
}

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    active: 'Đang hoạt động',
    monitoring: 'Đang theo dõi',
    resolved: 'Đã giải quyết',
  };
  return labels[status] || status;
}

function getRiskLevel(score: number): string {
  if (score >= 80) return 'critical';
  if (score >= 60) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
}

function getRiskLevelLabel(score: number): string {
  if (score >= 80) return 'Rủi ro nghiêm trọng';
  if (score >= 60) return 'Rủi ro cao';
  if (score >= 40) return 'Rủi ro trung bình';
  return 'Rủi ro thấp';
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    counterfeit: 'Hàng giả',
    smuggling: 'Buôn lậu',
    illegal_trading: 'Kinh doanh bất hợp pháp',
    food_safety: 'An toàn thực phẩm',
    price_fraud: 'Gian lận giá cả',
    unlicensed: 'Không giấy phép',
    other: 'Khác',
  };
  return labels[category] || category;
}
