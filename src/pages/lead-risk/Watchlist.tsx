import { useState } from 'react';
import {
  Eye,
  Search,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  Building2,
  MapPin,
  Plus,
  EyeOff,
  Calendar,
  Activity,
  FileText,
  CheckCircle2,
} from 'lucide-react';
import { mockRiskProfiles } from '../../data/lead-risk/mockLeads';
import type { RiskProfile } from '../../data/lead-risk/types';
import { ActionModal, ActionType } from '../../app/components/ActionModal';
import { Breadcrumb } from '../../app/components/Breadcrumb';
import styles from './Watchlist.module.css';

type WatchlistTab = 'all' | 'stores' | 'zones';

export default function Watchlist() {
  const [activeTab, setActiveTab] = useState<WatchlistTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all');
  const [trendFilter, setTrendFilter] = useState<'all' | 'increasing' | 'stable' | 'decreasing'>('all');
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<ActionType>('task');
  const [selectedProfile, setSelectedProfile] = useState<RiskProfile | null>(null);
  
  // In real app, this would fetch from API
  const watchlistedProfiles = mockRiskProfiles.filter(p => p.isWatchlisted);
  
  // Filter profiles
  const filteredProfiles = watchlistedProfiles.filter(profile => {
    if (activeTab === 'stores' && profile.entityType !== 'store') return false;
    if (activeTab === 'zones' && profile.entityType !== 'zone') return false;
    if (searchQuery && !profile.entityName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (riskFilter !== 'all' && profile.riskLevel !== riskFilter) return false;
    if (trendFilter !== 'all' && profile.trendDirection !== trendFilter) return false;
    return true;
  });
  
  const totalWatched = watchlistedProfiles.length;
  const criticalCount = watchlistedProfiles.filter(p => p.riskLevel === 'critical').length;
  const activeAlerts = watchlistedProfiles.filter(p => p.hasActiveAlert).length;
  const increasingTrend = watchlistedProfiles.filter(p => p.trendDirection === 'increasing').length;

  const handleRemoveFromWatchlist = (profileId: string) => {
    // TODO: Call API to remove from watchlist
  };

  const handleAddToWatchlist = () => {
    // TODO: Show modal to search and add entities to watchlist
  };

  const handleActionModal = (type: ActionType, profile: RiskProfile) => {
    setActionType(type);
    setSelectedProfile(profile);
    setShowActionModal(true);
  };

  const handleActionSubmit = (data: any) => {
    alert(`${data.type === 'task' ? 'Task' : data.type === 'plan' ? 'Plan' : 'Follow-up'} đã được tạo thành công!`);
  };

  return (
    <div className={styles.container}>
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Nguồn tin, Rủi ro', path: '/lead-risk/inbox' },
          { label: 'Theo dõi đặc biệt' },
        ]}
      />

      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Watchlist</h1>
          <p className={styles.subtitle}>Theo dõi các cơ sở và khu vực có rủi ro cao</p>
        </div>
        <button className={styles.addBtn} onClick={handleAddToWatchlist}>
          <Plus size={16} />
          Thêm vào watchlist
        </button>
      </div>

      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon} style={{ background: 'rgba(0, 92, 182, 0.1)', color: 'rgb(0, 92, 182)' }}>
            <Eye size={24} />
          </div>
          <div className={styles.kpiContent}>
            <div className={styles.kpiLabel}>Đang theo dõi</div>
            <div className={styles.kpiValue}>{totalWatched}</div>
            <div className={styles.kpiSubtext}>Cơ sở & khu vực</div>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon} style={{ background: 'rgba(249, 65, 68, 0.1)', color: 'rgb(249, 65, 68)' }}>
            <AlertTriangle size={24} />
          </div>
          <div className={styles.kpiContent}>
            <div className={styles.kpiLabel}>Rủi ro nghiêm trọng</div>
            <div className={styles.kpiValue}>{criticalCount}</div>
            <div className={styles.kpiSubtext}>Cần xử lý khẩn</div>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon} style={{ background: 'rgba(247, 162, 59, 0.1)', color: 'rgb(247, 162, 59)' }}>
            <Activity size={24} />
          </div>
          <div className={styles.kpiContent}>
            <div className={styles.kpiLabel}>Cảnh báo hoạt động</div>
            <div className={styles.kpiValue}>{activeAlerts}</div>
            <div className={styles.kpiSubtext}>Hoạt động bất thường</div>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon} style={{ background: 'rgba(105, 92, 251, 0.1)', color: 'rgb(105, 92, 251)' }}>
            <TrendingUp size={24} />
          </div>
          <div className={styles.kpiContent}>
            <div className={styles.kpiLabel}>Xu hướng tăng</div>
            <div className={styles.kpiValue}>{increasingTrend}</div>
            <div className={styles.kpiSubtext}>Tăng số vi phạm</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button 
          className={activeTab === 'all' ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab('all')}
        >
          Tất cả ({watchlistedProfiles.length})
        </button>
        <button 
          className={activeTab === 'stores' ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab('stores')}
        >
          Cơ sở ({watchlistedProfiles.filter(p => p.entityType === 'store').length})
        </button>
        <button 
          className={activeTab === 'zones' ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab('zones')}
        >
          Khu vực ({watchlistedProfiles.filter(p => p.entityType === 'zone').length})
        </button>
      </div>

      {/* Filters */}
      <div className={styles.filterBar}>
        <div className={styles.searchBox}>
          <Search size={16} />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={styles.filters}>
          <select value={riskFilter} onChange={(e) => setRiskFilter(e.target.value as any)}>
            <option value="all">Tất cả mức rủi ro</option>
            <option value="critical">Nghiêm trọng</option>
            <option value="high">Cao</option>
            <option value="medium">Trung bình</option>
            <option value="low">Thấp</option>
          </select>

          <select value={trendFilter} onChange={(e) => setTrendFilter(e.target.value as any)}>
            <option value="all">Tất cả xu hướng</option>
            <option value="increasing">Đang tăng</option>
            <option value="stable">Ổn định</option>
            <option value="decreasing">Đang giảm</option>
          </select>
        </div>
      </div>

      {/* Watchlist Grid */}
      <div className={styles.grid}>
        {filteredProfiles.map((profile) => (
          <div key={profile.entityId} className={styles.card}>
            {/* Card Header */}
            <div className={styles.cardHeader}>
              <div className={styles.cardTitle}>
                <div className={styles.entityIcon}>
                  {profile.entityType === 'store' ? <Building2 size={18} /> : <MapPin size={18} />}
                </div>
                <div>
                  <h3>{profile.entityName}</h3>
                  <div className={styles.entityType}>
                    {profile.entityType === 'store' ? 'Cơ sở kinh doanh' : 'Khu vực'}
                  </div>
                </div>
              </div>
              <button 
                className={styles.unwatchBtn}
                onClick={() => handleRemoveFromWatchlist(profile.entityId)}
                title="Bỏ theo dõi"
              >
                <EyeOff size={16} />
              </button>
            </div>

            {/* Risk Score */}
            <div className={styles.riskSection}>
              <div className={styles.riskScoreContainer}>
                <div className={styles.riskScore} data-risk={profile.riskLevel}>
                  {profile.riskScore}
                </div>
                <div className={styles.riskLevelBadge} data-risk={profile.riskLevel}>
                  {getRiskLevelLabel(profile.riskLevel)}
                </div>
              </div>
              <div className={styles.trendIndicator} data-trend={profile.trendDirection}>
                {profile.trendDirection === 'increasing' && <TrendingUp size={16} />}
                {profile.trendDirection === 'stable' && <Minus size={16} />}
                {profile.trendDirection === 'decreasing' && <TrendingDown size={16} />}
                <span>{profile.monthOverMonthChange > 0 ? '+' : ''}{profile.monthOverMonthChange.toFixed(1)}%</span>
              </div>
            </div>

            {/* Stats */}
            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <div className={styles.statLabel}>Tổng leads</div>
                <div className={styles.statValue}>{profile.totalLeads}</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statLabel}>Đang xử lý</div>
                <div className={styles.statValue}>{profile.activeLeads}</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statLabel}>Đã giải quyết</div>
                <div className={styles.statValue}>{profile.resolvedLeads}</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statLabel}>Từ chối</div>
                <div className={styles.statValue}>{profile.rejectedLeads}</div>
              </div>
            </div>

            {/* Categories */}
            <div className={styles.categories}>
              <div className={styles.categoriesLabel}>Vi phạm gần đây:</div>
              <div className={styles.categoryTags}>
                {profile.recentCategories.map((cat, idx) => (
                  <span key={idx} className={styles.categoryTag}>
                    {getCategoryLabel(cat)}
                  </span>
                ))}
              </div>
            </div>

            {/* Last Activity */}
            <div className={styles.lastActivity}>
              <Calendar size={14} />
              <span>Lead gần nhất: {new Date(profile.lastLeadDate).toLocaleDateString('vi-VN')}</span>
            </div>

            {/* Alerts */}
            {profile.hasActiveAlert && (
              <div className={styles.alert}>
                <AlertTriangle size={14} />
                <span>Có hoạt động bất thường gần đây</span>
              </div>
            )}

            {/* Actions */}
            <div className={styles.cardActions}>
              <button className={styles.viewBtn} onClick={() => handleActionModal('task', profile)}>
                <CheckCircle2 size={14} />
                Tạo Task
              </button>
              <button className={styles.leadsBtn} onClick={() => handleActionModal('plan', profile)}>
                <FileText size={14} />
                Tạo Plan
              </button>
              <button className={styles.leadsBtn} onClick={() => handleActionModal('followup', profile)}>
                <Plus size={14} />
                Follow-up
              </button>
            </div>
          </div>
        ))}

        {filteredProfiles.length === 0 && (
          <div className={styles.emptyState}>
            <Eye size={64} />
            <h3>Chưa có mục nào trong watchlist</h3>
            <p>Thêm các cơ sở hoặc khu vực có rủi ro cao để theo dõi</p>
            <button className={styles.addEmptyBtn} onClick={handleAddToWatchlist}>
              <Plus size={16} />
              Thêm vào watchlist
            </button>
          </div>
        )}
      </div>

      {/* Action Modal */}
      <ActionModal
        isOpen={showActionModal}
        onClose={() => setShowActionModal(false)}
        onSubmit={handleActionSubmit}
        type={actionType}
        source={selectedProfile ? {
          type: 'watchlist',
          id: selectedProfile.entityId,
          name: selectedProfile.entityName
        } : undefined}
      />
    </div>
  );
}

function getRiskLevelLabel(level: string): string {
  const labels: Record<string, string> = {
    critical: 'Nghiêm trọng',
    high: 'Cao',
    medium: 'Trung bình',
    low: 'Thấp',
  };
  return labels[level] || level;
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