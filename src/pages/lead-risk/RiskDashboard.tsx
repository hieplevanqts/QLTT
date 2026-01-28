import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
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
  FileCheck, // Thêm icon cho "Đang xác minh"
  Ban, // Thêm icon cho "Đã huỷ"
  FileText, // Thêm icon cho "Mới"
} from 'lucide-react';
import { mockDashboardMetrics, mockRiskProfiles } from '../../data/lead-risk/mockLeads';
import MultiSelectDropdown from '../../app/components/lead-risk/MultiSelectDropdown';
import { RiskFormModal } from '../../app/components/lead-risk/RiskFormModal';
import { Breadcrumb } from '../../app/components/Breadcrumb';
import { SkeletonCardGroup, SkeletonTable, SkeletonFilterBar } from '../../app/components/SkeletonLoader';
import type { RiskLevel, RiskTrendDirection, RiskProfile } from '../../data/lead-risk/types';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import styles from './RiskDashboard.module.css';

type FilterType = 'all' | 'total' | 'moi' | 'dang_xac_minh' | 'dang_xu_ly' | 'da_xu_ly' | 'da_huy';

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
    newStatus: 0, // Thêm trạng thái mới
    inVerification: 0, // Thêm đang xác minh
    cancelled: 0, // Thêm đã huỷ
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
        latestCaseStatus: profile.latestCaseStatus || 'new', // Thêm status
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
        totalEntities: mockRiskProfiles.length || 0,
        criticalEntities: mockRiskProfiles.filter(p => p.riskLevel === 'critical').length || 0,
        highEntities: mockRiskProfiles.filter(p => p.riskLevel === 'high').length || 0,
        watchlistedEntities: mockRiskProfiles.filter(p => p.isWatchlisted).length || 0,
        alertEntities: mockRiskProfiles.filter(p => p.hasActiveAlert).length || 0,
        totalLeads: mockDashboardMetrics.totalLeads || 0,
        activeLeads: mockDashboardMetrics.inProgress || 0,
        resolvedLeads: mockDashboardMetrics.resolved || 0,
        inProgress: mockRiskProfiles.filter(p => p.latestCaseStatus === 'dang_xu_ly').length || 0,
        overdue: mockDashboardMetrics.overdue || 0,
        resolved: mockRiskProfiles.filter(p => p.latestCaseStatus === 'da_xu_ly').length || 0,
        newStatus: mockRiskProfiles.filter(p => p.latestCaseStatus === 'moi').length || 0,
        inVerification: mockRiskProfiles.filter(p => p.latestCaseStatus === 'dang_xac_minh').length || 0,
        cancelled: mockRiskProfiles.filter(p => p.latestCaseStatus === 'da_huy').length || 0,
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
    // Active filter from overview cards - Status-based filters only
    if (activeFilter === 'moi' && !['moi', 'new'].includes(profile.latestCaseStatus || '')) return false;
    if (activeFilter === 'dang_xac_minh' && !['dang_xac_minh', 'verifying', 'in_verification'].includes(profile.latestCaseStatus || '')) return false;
    if (activeFilter === 'dang_xu_ly' && !['dang_xu_ly', 'processing', 'in_progress'].includes(profile.latestCaseStatus || '')) return false;
    if (activeFilter === 'da_xu_ly' && !['da_xu_ly', 'resolved', 'closed'].includes(profile.latestCaseStatus || '')) return false;
    if (activeFilter === 'da_huy' && !['da_huy', 'rejected', 'cancelled'].includes(profile.latestCaseStatus || '')) return false;

    // Risk level filter (from dropdown)
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

  // Helper function to get status label
  const getStatusLabel = (status?: string): string => {
    if (!status) return 'Chưa xác định';
    const labels: Record<string, string> = {
      // Tiếng Việt mới
      moi: 'Mới',
      dang_xac_minh: 'Đang xác minh',
      dang_xu_ly: 'Đang xử lý',
      da_xu_ly: 'Đã xử lý',
      da_huy: 'Đã huỷ',
      // Tiếng Anh cũ (backward compatibility)
      new: 'Mới',
      verifying: 'Đang xác minh',
      in_verification: 'Đang xác minh',
      processing: 'Đang xử lý',
      in_progress: 'Đang xử lý',
      under_investigation: 'Đang điều tra',
      resolved: 'Đã xử lý',
      closed: 'Đã đóng',
      rejected: 'Đã từ chối',
      cancelled: 'Đã huỷ',
    };
    return labels[status] || status;
  };

  // Helper function to get status style class
  const getStatusClass = (status?: string): string => {
    if (!status) return 'statusUnknown';
    const classes: Record<string, string> = {
      // Tiếng Việt mới
      moi: 'statusNew',
      dang_xac_minh: 'statusVerification',
      dang_xu_ly: 'statusProgress',
      da_xu_ly: 'statusResolved',
      da_huy: 'statusClosed',
      // Tiếng Anh cũ (backward compatibility)
      new: 'statusNew',
      verifying: 'statusVerification',
      in_verification: 'statusVerification',
      processing: 'statusProgress',
      in_progress: 'statusProgress',
      under_investigation: 'statusInvestigation',
      resolved: 'statusResolved',
      closed: 'statusClosed',
      rejected: 'statusClosed',
      cancelled: 'statusClosed',
    };
    return classes[status] || 'statusUnknown';
  };

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
          <SkeletonCardGroup />

          {/* Loading Filters */}
          <SkeletonFilterBar />

          {/* Loading Table */}
          <SkeletonTable />
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
                <span className={styles.metricLabel}>Tổng các rủi ro</span>
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
              className={`${styles.metricCard} ${activeFilter === 'moi' ? styles.metricCardActive : ''}`}
              onClick={() => setActiveFilter('moi')}
            >
              <div className={styles.metricHeader}>
                <div className={styles.metricIcon} style={{ backgroundColor: 'rgba(239, 246, 255, 1)' }}>
                  <FileText size={20} style={{ color: 'rgba(37, 99, 235, 1)' }} />
                </div>
                <span className={styles.metricLabel}>Trạng thái mới</span>
              </div>
              <div className={styles.metricValue}>{metrics.newStatus}</div>
              <div className={styles.metricDetail}>
                <span className={styles.metricDetailLabel}>Chờ xử lý</span>
              </div>
            </div>

            <div
              className={`${styles.metricCard} ${activeFilter === 'dang_xac_minh' ? styles.metricCardActive : ''}`}
              onClick={() => setActiveFilter('dang_xac_minh')}
            >
              <div className={styles.metricHeader}>
                <div className={styles.metricIcon} style={{ backgroundColor: 'rgba(254, 249, 195, 1)' }}>
                  <FileCheck size={20} style={{ color: 'rgba(161, 98, 7, 1)' }} />
                </div>
                <span className={styles.metricLabel}>Đang xác minh</span>
              </div>
              <div className={styles.metricValue}>{metrics.inVerification}</div>
              <div className={styles.metricDetail}>
                <span className={styles.metricDetailLabel}>Cần kiểm tra</span>
              </div>
            </div>

            <div
              className={`${styles.metricCard} ${activeFilter === 'dang_xu_ly' ? styles.metricCardActive : ''}`}
              onClick={() => setActiveFilter('dang_xu_ly')}
            >
              <div className={styles.metricHeader}>
                <div className={styles.metricIcon} style={{ backgroundColor: 'rgba(254, 243, 199, 1)' }}>
                  <Clock size={20} style={{ color: 'rgba(180, 83, 9, 1)' }} />
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

            <div
              className={`${styles.metricCard} ${activeFilter === 'da_xu_ly' ? styles.metricCardActive : ''}`}
              onClick={() => setActiveFilter('da_xu_ly')}
            >
              <div className={styles.metricHeader}>
                <div className={styles.metricIcon} style={{ backgroundColor: 'rgba(220, 252, 231, 1)' }}>
                  <CheckCircle2 size={20} style={{ color: 'rgba(34, 197, 94, 1)' }} />
                </div>
                <span className={styles.metricLabel}>Đã xử lý</span>
              </div>
              <div className={styles.metricValue}>{metrics.resolved}</div>
              <div className={styles.metricDetail}>
                <span className={styles.metricDetailLabel}>Hoàn thành</span>
              </div>
            </div>

            <div
              className={`${styles.metricCard} ${activeFilter === 'da_huy' ? styles.metricCardActive : ''}`}
              onClick={() => setActiveFilter('da_huy')}
            >
              <div className={styles.metricHeader}>
                <div className={styles.metricIcon} style={{ backgroundColor: 'rgba(243, 244, 246, 1)' }}>
                  <Ban size={20} style={{ color: 'rgba(107, 114, 128, 1)' }} />
                </div>
                <span className={styles.metricLabel}>Đã huỷ</span>
              </div>
              <div className={styles.metricValue}>{metrics.cancelled}</div>
              <div className={styles.metricDetail}>
                <span className={styles.metricDetailLabel}>Không xử lý</span>
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
                {activeFilter === 'moi' && 'Trạng thái mới'}
                {activeFilter === 'dang_xac_minh' && 'Đang xác minh'}
                {activeFilter === 'dang_xu_ly' && 'Đang xử lý'}
                {activeFilter === 'da_xu_ly' && 'Đã xử lý'}
                {activeFilter === 'da_huy' && 'Đã huỷ'}
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
                      <span className={styles[getStatusClass(profile.latestCaseStatus)]}>
                        {getStatusLabel(profile.latestCaseStatus)}
                      </span>
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