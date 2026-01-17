import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Search,
  Filter,
  SlidersHorizontal,
  Eye,
  AlertOctagon,
  Building2,
  MapPin,
  X,
  Plus,
  Trash2,
} from 'lucide-react';
import { mockDashboardMetrics, mockRiskProfiles } from '../../data/lead-risk/mockLeads';
import MultiSelectDropdown from '../../app/components/lead-risk/MultiSelectDropdown';
import { RiskFormModal } from '../../app/components/lead-risk/RiskFormModal';
import { Breadcrumb } from '../../app/components/Breadcrumb';
import type { RiskLevel, RiskTrendDirection, RiskProfile } from '../../data/lead-risk/types';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import styles from './RiskDashboard.module.css';

type FilterType = 'all' | 'total' | 'critical' | 'high' | 'resolved' | 'watchlist' | 'in_progress';

// API base URL
const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-bb2eb709`;

export default function RiskDashboard() {
  const navigate = useNavigate();
  
  // Data states
  const [riskProfiles, setRiskProfiles] = useState<RiskProfile[]>([]);
  const [metrics, setMetrics] = useState({
    totalEntities: 0,
    criticalEntities: 0,
    highEntities: 0,
    watchlistedEntities: 0,
    alertEntities: 0,
    totalLeads: 0,
    activeLeads: 0,
    resolvedLeads: 0,
    inProgress: 0,
    overdue: 0,
    resolved: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Multi-select filters
  const [selectedRiskLevels, setSelectedRiskLevels] = useState<string[]>([]);
  const [selectedEntityTypes, setSelectedEntityTypes] = useState<string[]>([]);
  const [selectedTrends, setSelectedTrends] = useState<string[]>([]);
  const [selectedWatchlistStatuses, setSelectedWatchlistStatuses] = useState<string[]>([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // Mỗi trang 4 bản ghi

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editingRisk, setEditingRisk] = useState<RiskProfile | null>(null);
  const [deletingRisk, setDeletingRisk] = useState<RiskProfile | null>(null);

  // Fetch data from API
  useEffect(() => {
    fetchRiskData();
  }, []);

  const fetchRiskData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch risk profiles (aggregated from cases)
      const profilesResponse = await fetch(`${API_BASE_URL}/risk-profiles`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!profilesResponse.ok) {
        throw new Error(`HTTP error! status: ${profilesResponse.status}`);
      }

      const profilesData = await profilesResponse.json();

      if (!profilesData.success) {
        throw new Error(profilesData.error || 'Failed to fetch risk profiles');
      }

      // Fetch statistics
      const statsResponse = await fetch(`${API_BASE_URL}/risk-stats`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!statsResponse.ok) {
        throw new Error(`HTTP error! status: ${statsResponse.status}`);
      }

      const statsData = await statsResponse.json();

      if (!statsData.success) {
        throw new Error(statsData.error || 'Failed to fetch risk stats');
      }

      console.log('✅ Successfully fetched data from database');
      console.log(`📊 Loaded ${profilesData.data.length} risk profiles`);
      console.log(`📈 Stats:`, statsData.data);

      // Transform database data to RiskProfile format
      const transformedProfiles: RiskProfile[] = profilesData.data.map((profile: any) => ({
        entityId: profile.entityId,
        entityType: profile.entityType,
        entityName: profile.entityName,
        riskScore: profile.riskScore,
        riskLevel: profile.riskLevel,
        totalLeads: profile.totalLeads || 0,
        activeLeads: profile.activeLeads || 0,
        resolvedLeads: profile.resolvedLeads || 0,
        rejectedLeads: profile.rejectedLeads || 0,
        lastLeadDate: profile.lastLeadDate ? new Date(profile.lastLeadDate) : new Date(),
        recentCategories: profile.recentCategories || [],
        trendDirection: profile.trendDirection || 'stable',
        monthOverMonthChange: profile.monthOverMonthChange || 0,
        isWatchlisted: profile.isWatchlisted || false,
        hasActiveAlert: profile.hasActiveAlert || false,
      }));

      setRiskProfiles(transformedProfiles);
      setMetrics(statsData.data);
    } catch (err) {
      console.error('❌ Error fetching risk data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      
      // Fallback to mock data on error
      console.log('⚠️ Using mock data as fallback...');
      setRiskProfiles(mockRiskProfiles);
      setMetrics({
        totalEntities: mockRiskProfiles.length,
        criticalEntities: mockRiskProfiles.filter(p => p.riskLevel === 'critical').length,
        highEntities: mockRiskProfiles.filter(p => p.riskLevel === 'high').length,
        watchlistedEntities: mockRiskProfiles.filter(p => p.isWatchlisted).length,
        alertEntities: mockRiskProfiles.filter(p => p.hasActiveAlert).length,
        totalLeads: mockDashboardMetrics.totalLeads,
        activeLeads: mockDashboardMetrics.inProgress,
        resolvedLeads: mockDashboardMetrics.resolved,
        inProgress: mockDashboardMetrics.inProgress,
        overdue: mockDashboardMetrics.overdue,
        resolved: mockDashboardMetrics.resolved,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle save risk (create or edit)
  const handleSaveRisk = (riskData: Partial<RiskProfile>) => {
    if (formMode === 'create') {
      console.log('Creating new risk:', riskData);
      // TODO: Add to mockRiskProfiles or call API
      alert('✅ Đã thêm cơ sở giám sát mới thành công!');
    } else {
      console.log('Updating risk:', riskData);
      // TODO: Update in mockRiskProfiles or call API
      alert('✅ Đã cập nhật thông tin cơ sở thành công!');
    }
    setIsFormModalOpen(false);
    setEditingRisk(null);
  };

  // Handle delete risk
  const handleDeleteRisk = () => {
    if (deletingRisk) {
      console.log('Deleting risk:', deletingRisk);
      // TODO: Remove from mockRiskProfiles or call API
      alert(`✅ Đã xóa "${deletingRisk.entityName}" khỏi danh sách giám sát!`);
      setIsDeleteModalOpen(false);
      setDeletingRisk(null);
    }
  };

  // Apply filters
  const filteredProfiles = riskProfiles.filter(profile => {
    // Active filter from overview cards
    if (activeFilter === 'critical' && profile.riskLevel !== 'critical') return false;
    if (activeFilter === 'high' && profile.riskLevel !== 'high') return false;
    if (activeFilter === 'watchlist' && !profile.isWatchlisted) return false;
    if (activeFilter === 'in_progress' && profile.activeLeads === 0) return false;

    // Risk level filter
    if (selectedRiskLevels.length > 0 && !selectedRiskLevels.includes(profile.riskLevel)) return false;

    // Entity type filter
    if (selectedEntityTypes.length > 0 && !selectedEntityTypes.includes(profile.entityType)) return false;

    // Trend filter
    if (selectedTrends.length > 0 && !selectedTrends.includes(profile.trendDirection)) return false;

    // Watchlist filter
    if (selectedWatchlistStatuses.length > 0) {
      if (selectedWatchlistStatuses.includes('watched') && !profile.isWatchlisted) return false;
      if (selectedWatchlistStatuses.includes('not_watched') && profile.isWatchlisted) return false;
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        profile.entityName.toLowerCase().includes(query) ||
        profile.entityId.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    return true;
  });

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, selectedRiskLevels, selectedEntityTypes, selectedTrends, selectedWatchlistStatuses, searchQuery]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredProfiles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProfiles = filteredProfiles.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const clearAllFilters = () => {
    setActiveFilter('all');
    setSelectedRiskLevels([]);
    setSelectedEntityTypes([]);
    setSelectedTrends([]);
    setSelectedWatchlistStatuses([]);
    setSearchQuery('');
    setCurrentPage(1);
  };

  const hasActiveFilters = 
    activeFilter !== 'all' || 
    selectedRiskLevels.length > 0 || 
    selectedEntityTypes.length > 0 || 
    selectedTrends.length > 0 || 
    selectedWatchlistStatuses.length > 0 || 
    searchQuery !== '';

  return (
    <div className={styles.container}>
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Nguồn tin, Rủi ro', path: '/lead-risk/inbox' },
          { label: 'Tổng quan rủi ro' },
        ]}
      />

      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Tổng quan rủi ro</h1>
          <p className={styles.subtitle}>
            Giám sát rủi ro cửa hàng và khu vực
          </p>
        </div>
        <button className={styles.createButton} onClick={() => setIsFormModalOpen(true)} disabled={isLoading}>
          <Plus size={20} />
          Thêm rủi ro
        </button>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className={styles.loadingOverlay}>
          {/* Loading Overview Cards */}
          <div className={styles.loadingGrid}>
            {[...Array(6)].map((_, idx) => (
              <div key={idx} className={`${styles.loadingCard} ${styles.skeleton}`} />
            ))}
          </div>

          {/* Loading Filters */}
          <div className={styles.loadingFilters}>
            {[...Array(5)].map((_, idx) => (
              <div key={idx} className={`${styles.loadingFilter} ${styles.skeleton}`} />
            ))}
          </div>

          {/* Loading Table */}
          <div className={styles.loadingTable}>
            <div className={`${styles.loadingTableHeader} ${styles.skeleton}`} />
            <div className={styles.loadingTableBody}>
              {[...Array(4)].map((_, idx) => (
                <div key={idx} className={styles.loadingRow}>
                  <div className={`${styles.loadingCell} ${styles.loadingCellLarge} ${styles.skeleton}`} />
                  <div className={`${styles.loadingCell} ${styles.loadingCellSmall} ${styles.skeleton}`} />
                  <div className={`${styles.loadingCell} ${styles.loadingCellSmall} ${styles.skeleton}`} />
                  <div className={`${styles.loadingCell} ${styles.loadingCellSmall} ${styles.skeleton}`} />
                  <div className={`${styles.loadingCell} ${styles.loadingCellMedium} ${styles.skeleton}`} />
                  <div className={`${styles.loadingCell} ${styles.loadingCellSmall} ${styles.skeleton}`} />
                  <div className={`${styles.loadingCell} ${styles.loadingCellSmall} ${styles.skeleton}`} />
                  <div className={`${styles.loadingCell} ${styles.loadingCellMedium} ${styles.skeleton}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Overview Metrics Grid - Clickable */}
          <div className={styles.overviewGrid}>
            <div 
              className={`${styles.metricCard} ${activeFilter === 'total' ? styles.metricCardActive : ''}`}
              onClick={() => setActiveFilter('total')}
            >
              <div className={styles.metricHeader}>
                <div className={styles.metricIcon} style={{ backgroundColor: 'rgba(239, 246, 255, 1)' }}>
                  <AlertTriangle size={20} style={{ color: 'rgba(37, 99, 235, 1)' }} />
                </div>
                <span className={styles.metricLabel}>Tổng cơ sở giám sát</span>
              </div>
              <div className={styles.metricValue}>{metrics.totalEntities}</div>
              <div className={styles.metricDetail}>
                <span className={styles.metricDetailLabel}>Cửa hàng:</span>
                <span className={styles.metricDetailValue}>
                  {riskProfiles.filter(p => p.entityType === 'store').length}
                </span>
              </div>
            </div>

            <div 
              className={`${styles.metricCard} ${activeFilter === 'critical' ? styles.metricCardActive : ''}`}
              onClick={() => setActiveFilter('critical')}
            >
              <div className={styles.metricHeader}>
                <div className={styles.metricIcon} style={{ backgroundColor: 'rgba(254, 226, 226, 1)' }}>
                  <XCircle size={20} style={{ color: 'var(--destructive)' }} />
                </div>
                <span className={styles.metricLabel}>Rủi ro nghiêm trọng</span>
              </div>
              <div className={styles.metricValue}>{metrics.criticalEntities}</div>
              <div className={styles.metricDetail}>
                <span className={styles.metricDetailLabel}>Cần xử lý khẩn</span>
              </div>
            </div>

            <div 
              className={`${styles.metricCard} ${activeFilter === 'high' ? styles.metricCardActive : ''}`}
              onClick={() => setActiveFilter('high')}
            >
              <div className={styles.metricHeader}>
                <div className={styles.metricIcon} style={{ backgroundColor: 'rgba(254, 243, 199, 1)' }}>
                  <AlertOctagon size={20} style={{ color: 'rgba(180, 83, 9, 1)' }} />
                </div>
                <span className={styles.metricLabel}>Rủi ro cao</span>
              </div>
              <div className={styles.metricValue}>{metrics.highEntities}</div>
              <div className={styles.metricDetail}>
                <span className={styles.metricDetailLabel}>Theo dõi sát</span>
              </div>
            </div>

            <div 
              className={`${styles.metricCard} ${activeFilter === 'resolved' ? styles.metricCardActive : ''}`}
              onClick={() => setActiveFilter('resolved')}
            >
              <div className={styles.metricHeader}>
                <div className={styles.metricIcon} style={{ backgroundColor: 'rgba(220, 252, 231, 1)' }}>
                  <CheckCircle2 size={20} style={{ color: 'rgba(34, 197, 94, 1)' }} />
                </div>
                <span className={styles.metricLabel}>Leads đã xử lý</span>
              </div>
              <div className={styles.metricValue}>{metrics.resolved}</div>
              <div className={styles.metricDetail}>
                <span className={styles.metricDetailLabel}>Tuần này:</span>
                <span className={styles.metricDetailValue} style={{ color: 'rgba(34, 197, 94, 1)' }}>
                  {Math.floor(metrics.resolved * 0.4)}
                </span>
              </div>
            </div>

            <div 
              className={`${styles.metricCard} ${activeFilter === 'watchlist' ? styles.metricCardActive : ''}`}
              onClick={() => setActiveFilter('watchlist')}
            >
              <div className={styles.metricHeader}>
                <div className={styles.metricIcon} style={{ backgroundColor: 'rgba(243, 244, 246, 1)' }}>
                  <Eye size={20} style={{ color: 'rgba(107, 114, 128, 1)' }} />
                </div>
                <span className={styles.metricLabel}>Đang theo dõi</span>
              </div>
              <div className={styles.metricValue}>{metrics.watchlistedEntities}</div>
              <div className={styles.metricDetail}>
                <span className={styles.metricDetailLabel}>Có cảnh báo:</span>
                <span className={styles.metricDetailValue} style={{ color: 'var(--destructive)' }}>
                  {metrics.alertEntities}
                </span>
              </div>
            </div>

            <div 
              className={`${styles.metricCard} ${activeFilter === 'in_progress' ? styles.metricCardActive : ''}`}
              onClick={() => setActiveFilter('in_progress')}
            >
              <div className={styles.metricHeader}>
                <div className={styles.metricIcon} style={{ backgroundColor: 'rgba(239, 246, 255, 1)' }}>
                  <Clock size={20} style={{ color: 'rgba(37, 99, 235, 1)' }} />
                </div>
                <span className={styles.metricLabel}>Đang xử lý</span>
              </div>
              <div className={styles.metricValue}>{metrics.inProgress}</div>
              <div className={styles.metricDetail}>
                <span className={styles.metricDetailLabel}>Quá hạn:</span>
                <span className={styles.metricDetailValue} style={{ color: 'var(--destructive)' }}>
                  {metrics.overdue}
                </span>
              </div>
            </div>
          </div>

          {/* Filters & Search Row - Single Row */}
          <div className={styles.filterRow}>
            <MultiSelectDropdown
              label="Mức rủi ro"
              options={[
                { value: 'critical', label: 'Nghiêm trọng', count: riskProfiles.filter(p => p.riskLevel === 'critical').length },
                { value: 'high', label: 'Cao', count: riskProfiles.filter(p => p.riskLevel === 'high').length },
                { value: 'medium', label: 'Trung bình', count: riskProfiles.filter(p => p.riskLevel === 'medium').length },
                { value: 'low', label: 'Thấp', count: riskProfiles.filter(p => p.riskLevel === 'low').length },
              ]}
              selectedValues={selectedRiskLevels}
              onChange={setSelectedRiskLevels}
              placeholder="Tất cả"
            />

            <MultiSelectDropdown
              label="Loại cơ sở"
              options={[
                { value: 'store', label: 'Cửa hàng', count: riskProfiles.filter(p => p.entityType === 'store').length },
                { value: 'zone', label: 'Khu vực', count: riskProfiles.filter(p => p.entityType === 'zone').length },
              ]}
              selectedValues={selectedEntityTypes}
              onChange={setSelectedEntityTypes}
              placeholder="Tất cả"
            />

            <MultiSelectDropdown
              label="Xu hướng"
              options={[
                { value: 'increasing', label: 'Tăng', count: riskProfiles.filter(p => p.trendDirection === 'increasing').length },
                { value: 'stable', label: 'n định', count: riskProfiles.filter(p => p.trendDirection === 'stable').length },
                { value: 'decreasing', label: 'Giảm', count: riskProfiles.filter(p => p.trendDirection === 'decreasing').length },
              ]}
              selectedValues={selectedTrends}
              onChange={setSelectedTrends}
              placeholder="Tất cả"
            />

            <MultiSelectDropdown
              label="Theo dõi"
              options={[
                { value: 'watched', label: 'Đang theo dõi', count: metrics.watchlistedEntities },
                { value: 'not_watched', label: 'Chưa theo dõi', count: metrics.totalEntities - metrics.watchlistedEntities },
              ]}
              selectedValues={selectedWatchlistStatuses}
              onChange={setSelectedWatchlistStatuses}
              placeholder="Tất cả"
            />

            {/* Search Box - On the right */}
            <div className={styles.searchBoxInline}>
              <Search className={styles.searchIcon} size={18} />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên cơ sở, mã ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button className={styles.clearFiltersBtn} onClick={clearAllFilters}>
                <X size={14} />
                Xóa bộ lọc
              </button>
            )}
          </div>

          {/* Active Filter Indicator */}
          {activeFilter !== 'all' && (
            <div className={styles.activeFilterBar}>
              <span className={styles.activeFilterLabel}>Đang lọc:</span>
              <span className={styles.activeFilterBadge}>
                {activeFilter === 'total' && 'Tất cả cơ sở'}
                {activeFilter === 'critical' && 'Rủi ro nghiêm trọng'}
                {activeFilter === 'high' && 'Rủi ro cao'}
                {activeFilter === 'resolved' && 'Leads đã xử lý'}
                {activeFilter === 'watchlist' && 'Đang theo dõi'}
                {activeFilter === 'in_progress' && 'Có leads đang xử lý'}
              </span>
              <span className={styles.activeFilterCount}>({filteredProfiles.length} cơ sở)</span>
            </div>
          )}

          {/* Risk Profiles Table */}
          <div className={styles.riskTable}>
            <div className={styles.tableHeader}>
              <div className={styles.headerCell} style={{ flex: '1 1 0', minWidth: '200px' }}>Cơ sở</div>
              <div className={styles.headerCell} style={{ flex: '0 0 120px', textAlign: 'center' }}>Điểm rủi ro</div>
              <div className={styles.headerCell} style={{ flex: '0 0 110px', textAlign: 'center' }}>Tổng nguồn tin</div>
              <div className={styles.headerCell} style={{ flex: '0 0 120px', textAlign: 'center' }}>Đang xử lý</div>
              <div className={styles.headerCell} style={{ flex: '0 0 140px', textAlign: 'center' }}>Xu hướng</div>
              <div className={styles.headerCell} style={{ flex: '0 0 130px', textAlign: 'center' }}>Cập nhật cuối</div>
              <div className={styles.headerCell} style={{ flex: '0 0 110px', textAlign: 'center' }}>Trạng thái</div>
              <div className={styles.headerCell} style={{ flex: '0 0 140px', textAlign: 'center' }}>Thao tác</div>
            </div>

            <div className={styles.tableBody}>
              {paginatedProfiles.length > 0 ? (
                paginatedProfiles.map((profile) => (
                  <div 
                    key={profile.entityId} 
                    className={styles.riskRow}
                  >
                    <div className={styles.riskCell} style={{ flex: '1 1 0', minWidth: '200px' }}>
                      <div className={styles.entityInfo}>
                        <div className={styles.entityIcon}>
                          {profile.entityType === 'store' ? <Building2 size={18} /> : <MapPin size={18} />}
                        </div>
                        <div>
                          <div className={styles.entityName}>{profile.entityName}</div>
                          <div className={styles.entityType}>
                            {profile.entityType === 'store' ? 'Cửa hàng' : 'Khu vực'}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={styles.riskCell} style={{ flex: '0 0 120px', justifyContent: 'center' }}>
                      <div className={styles.riskScore} data-level={profile.riskLevel}>
                        {profile.riskScore}
                      </div>
                    </div>

                    <div className={styles.riskCell} style={{ flex: '0 0 110px', justifyContent: 'center' }}>
                      <span className={styles.leadCount}>{profile.totalLeads}</span>
                    </div>

                    <div className={styles.riskCell} style={{ flex: '0 0 120px', justifyContent: 'center' }}>
                      <span className={styles.activeCount}>{profile.activeLeads}</span>
                    </div>

                    <div className={styles.riskCell} style={{ flex: '0 0 140px', justifyContent: 'center' }}>
                      <div className={styles.trendBadge} data-direction={profile.trendDirection}>
                        {profile.trendDirection === 'increasing' && <TrendingUp size={14} />}
                        {profile.trendDirection === 'decreasing' && <TrendingDown size={14} />}
                        <span>
                          {profile.monthOverMonthChange > 0 ? '+' : ''}
                          {profile.monthOverMonthChange.toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    <div className={styles.riskCell} style={{ flex: '0 0 130px', justifyContent: 'center' }}>
                      <span className={styles.lastUpdate}>
                        {profile.lastLeadDate.toLocaleDateString('vi-VN')}
                      </span>
                    </div>

                    <div className={styles.riskCell} style={{ flex: '0 0 110px', justifyContent: 'center' }}>
                      <div className={styles.statusBadges}>
                        {profile.isWatchlisted && (
                          <span className={styles.watchBadge} title="Đang theo dõi">
                            <Eye size={12} />
                          </span>
                        )}
                        {profile.hasActiveAlert && (
                          <span className={styles.alertBadge} title="Có cảnh báo">
                            <AlertTriangle size={12} />
                          </span>
                        )}
                      </div>
                    </div>

                    <div className={styles.riskCell} style={{ flex: '0 0 140px', justifyContent: 'center' }} onClick={(e) => e.stopPropagation()}>
                      <div className={styles.actionButtons}>
                        <button 
                          className={styles.actionButton}
                          onClick={() => navigate(`/lead-risk/risk/${profile.entityId}`)}
                          title="Xem chi tiết"
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.emptyState}>
                  <AlertTriangle size={48} />
                  <p>Không tìm thấy cơ sở nào</p>
                  <p className={styles.emptyHint}>Thử điều chỉnh bộ lọc hoặc tìm kiếm</p>
                </div>
              )}
            </div>
          </div>

          {/* Pagination */}
          {filteredProfiles.length > 0 && (
            <div className={styles.pagination}>
              <div className={styles.paginationInfo}>
                Hiển thị {filteredProfiles.length} / {metrics.totalEntities} cơ sở
              </div>
              <div className={styles.paginationButtons}>
                <button className={styles.pageButton} disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>Trước</button>
                {getPageNumbers().map(page => (
                  <button 
                    key={page} 
                    className={currentPage === page ? styles.pageButtonActive : styles.pageButton}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                ))}
                <button className={styles.pageButton} disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>Sau</button>
              </div>
            </div>
          )}

          {/* Risk Form Modal - Only shows when isFormModalOpen is true */}
          <RiskFormModal
            isOpen={isFormModalOpen}
            onClose={() => {
              setIsFormModalOpen(false);
              setEditingRisk(null);
              setFormMode('create');
            }}
            onSave={handleSaveRisk}
            risk={editingRisk}
            mode={formMode}
          />

          {/* Delete Confirmation Modal */}
          {isDeleteModalOpen && deletingRisk && (
            <div className={styles.modalOverlay} onClick={() => setIsDeleteModalOpen(false)}>
              <div className={styles.deleteModal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.deleteModalHeader}>
                  <AlertTriangle size={24} style={{ color: 'var(--destructive)' }} />
                  <h3>Xác nhận xóa</h3>
                </div>
                <div className={styles.deleteModalBody}>
                  <p>Bạn có chắc chắn muốn xóa cơ sở <strong>"{deletingRisk.entityName}"</strong> khỏi danh sách giám sát?</p>
                  <p style={{ marginTop: '8px', fontSize: '14px', color: 'var(--muted-foreground)' }}>
                    Hành động này không thể hoàn tác.
                  </p>
                </div>
                <div className={styles.deleteModalFooter}>
                  <button 
                    className={styles.cancelButton} 
                    onClick={() => {
                      setIsDeleteModalOpen(false);
                      setDeletingRisk(null);
                    }}
                  >
                    Hủy
                  </button>
                  <button 
                    className={styles.deleteButton}
                    onClick={handleDeleteRisk}
                  >
                    <Trash2 size={16} />
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}