import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck,
  Clock,
  AlertCircle,
  Eye,
  User,
  MapPin,
  Calendar,
  FileText,
  Image,
  Video,
  Filter,
  Search,
  ChevronDown,
  X,
  FileAudio,
  File,
  ChevronUp
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import PageHeader from '../../../layouts/PageHeader';
import styles from './EvidenceReviewQueuePage.module.css';
import { generateMockEvidenceItems } from '../../data/evidence-mock-data';
import { EvidenceItem, getStatusLabel, getTypeLabel } from '../../types/evidence.types';

// WEB-05-09 — Review Queue (P0)
// UI: queue list, SLA badges, assignment, quick preview
// AC: reviewer chỉ thấy queue trong scope

interface ReviewQueueFilters {
  search: string;
  status: string;
  type: string;
  sensitivity: string;
  province: string;
  assignee: string;
}

type SortField = 'uploadedAt' | 'evidenceId' | 'status' | 'province';
type SortDirection = 'asc' | 'desc';

export default function EvidenceReviewQueuePage() {
  const navigate = useNavigate();
  const [filterExpanded, setFilterExpanded] = useState(false);
  const [sortField, setSortField] = useState<SortField>('uploadedAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  
  const [filters, setFilters] = useState<ReviewQueueFilters>({
    search: '',
    status: '',
    type: '',
    sensitivity: '',
    province: '',
    assignee: ''
  });

  // Get mock evidence items that need review
  const allItems = useMemo(() => {
    return generateMockEvidenceItems(50).filter(item => 
      item.status === 'Submitted' || 
      item.status === 'InReview' || 
      item.status === 'NeedMoreInfo'
    );
  }, []);

  // Apply filters and sorting
  const filteredItems = useMemo(() => {
    let result = [...allItems];

    // Search filter
    if (filters.search.trim()) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(item => 
        item.evidenceId.toLowerCase().includes(searchLower) ||
        item.file.filename.toLowerCase().includes(searchLower) ||
        item.submitter.userId.toLowerCase().includes(searchLower) ||
        item.notes?.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (filters.status) {
      result = result.filter(item => item.status === filters.status);
    }

    // Type filter
    if (filters.type) {
      result = result.filter(item => item.type === filters.type);
    }

    // Sensitivity filter
    if (filters.sensitivity) {
      result = result.filter(item => item.sensitivityLabel === filters.sensitivity);
    }

    // Province filter
    if (filters.province) {
      result = result.filter(item => item.scope.province === filters.province);
    }

    // Assignee filter
    if (filters.assignee === 'assigned') {
      result = result.filter(item => item.review?.assignedReviewerId);
    } else if (filters.assignee === 'unassigned') {
      result = result.filter(item => !item.review?.assignedReviewerId);
    }

    // Apply sorting
    result.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'uploadedAt':
          aValue = new Date(a.uploadedAt).getTime();
          bValue = new Date(b.uploadedAt).getTime();
          break;
        case 'evidenceId':
          aValue = a.evidenceId;
          bValue = b.evidenceId;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'province':
          aValue = a.scope.province;
          bValue = b.scope.province;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [allItems, filters, sortField, sortDirection]);

  // Calculate stats
  const stats = useMemo(() => ({
    total: filteredItems.length,
    submitted: filteredItems.filter(item => item.status === 'Submitted').length,
    inReview: filteredItems.filter(item => item.status === 'InReview').length,
    needMoreInfo: filteredItems.filter(item => item.status === 'NeedMoreInfo').length,
    assigned: filteredItems.filter(item => item.review?.assignedReviewerId).length
  }), [filteredItems]);

  // Get unique provinces for filter
  const provinces = useMemo(() => {
    const uniqueProvinces = new Set(allItems.map(item => item.scope.province));
    return Array.from(uniqueProvinces).sort();
  }, [allItems]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.status) count++;
    if (filters.type) count++;
    if (filters.sensitivity) count++;
    if (filters.province) count++;
    if (filters.assignee) count++;
    return count;
  }, [filters]);

  const updateFilter = (key: keyof ReviewQueueFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      status: '',
      type: '',
      sensitivity: '',
      province: '',
      assignee: ''
    });
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ChevronUp size={14} className={styles.sortIcon} /> : 
      <ChevronDown size={14} className={styles.sortIcon} />;
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'PHOTO': return <Image size={18} />;
      case 'VIDEO': return <Video size={18} />;
      case 'PDF': return <FileText size={18} />;
      case 'AUDIO': return <FileAudio size={18} />;
      default: return <File size={18} />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; bg: string }> = {
      'Submitted': { color: 'var(--chart-2)', bg: 'rgba(105, 92, 251, 0.1)' },
      'InReview': { color: 'var(--chart-3)', bg: 'rgba(0, 199, 242, 0.1)' },
      'NeedMoreInfo': { color: 'var(--chart-5)', bg: 'rgba(247, 162, 59, 0.1)' }
    };
    const config = statusConfig[status] || statusConfig.Submitted;
    return (
      <Badge variant="outline" style={{ borderColor: config.color, color: config.color, background: config.bg, fontSize: 'var(--text-xs)' }}>
        {getStatusLabel(status)}
      </Badge>
    );
  };

  const getSensitivityBadge = (sensitivity: string) => {
    const sensitivityConfig: Record<string, { color: string; bg: string }> = {
      'Public': { color: 'var(--chart-4)', bg: 'rgba(15, 202, 122, 0.1)' },
      'Internal': { color: 'var(--chart-3)', bg: 'rgba(0, 199, 242, 0.1)' },
      'Restricted': { color: 'var(--chart-5)', bg: 'rgba(247, 162, 59, 0.1)' },
      'Secret-lite': { color: 'var(--chart-1)', bg: 'rgba(249, 65, 68, 0.1)' }
    };
    const config = sensitivityConfig[sensitivity] || sensitivityConfig.Internal;
    return (
      <Badge variant="outline" style={{ borderColor: config.color, color: config.color, background: config.bg, fontSize: 'var(--text-xs)' }}>
        {sensitivity}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className={styles.container}>
      <PageHeader
        breadcrumbs={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Kho chứng cứ', href: '/evidence' },
          { label: 'Hàng đợi xét duyệt' }
        ]}
        title="Hàng đợi xét duyệt"
      />

      <div className={styles.content}>
        {/* Stats Cards */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: 'rgba(0, 92, 182, 0.1)', color: 'var(--primary)' }}>
              <ShieldCheck size={24} />
            </div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Tổng số chờ duyệt</p>
              <h3 className={styles.statValue}>{stats.total}</h3>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: 'rgba(105, 92, 251, 0.1)', color: 'var(--chart-2)' }}>
              <Clock size={24} />
            </div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Mới nộp</p>
              <h3 className={styles.statValue}>{stats.submitted}</h3>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: 'rgba(0, 199, 242, 0.1)', color: 'var(--chart-3)' }}>
              <Eye size={24} />
            </div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Đang xét duyệt</p>
              <h3 className={styles.statValue}>{stats.inReview}</h3>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: 'rgba(247, 162, 59, 0.1)', color: 'var(--chart-5)' }}>
              <AlertCircle size={24} />
            </div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Cần bổ sung</p>
              <h3 className={styles.statValue}>{stats.needMoreInfo}</h3>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className={styles.filterSection}>
          <div className={styles.searchBar}>
            <Search size={16} />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã, tên file, người nộp..."
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className={styles.searchInput}
            />
            {filters.search && (
              <button 
                className={styles.clearButton}
                onClick={() => updateFilter('search', '')}
                aria-label="Xóa tìm kiếm"
              >
                <X size={16} />
              </button>
            )}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilterExpanded(!filterExpanded)}
            className={styles.filterToggle}
          >
            <Filter size={16} />
            Bộ lọc
            {activeFilterCount > 0 && (
              <span className={styles.filterBadge}>{activeFilterCount}</span>
            )}
            <ChevronDown 
              size={16} 
              style={{ 
                transform: filterExpanded ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.2s ease'
              }} 
            />
          </Button>

          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className={styles.clearFiltersButton}
            >
              <X size={14} />
              Xóa bộ lọc
            </Button>
          )}
        </div>

        {/* Filter Panel */}
        {filterExpanded && (
          <div className={styles.filterPanel}>
            <div className={styles.filterGrid}>
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Trạng thái</label>
                <select 
                  className={styles.filterSelect}
                  value={filters.status}
                  onChange={(e) => updateFilter('status', e.target.value)}
                >
                  <option value="">Tất cả trạng thái</option>
                  <option value="Submitted">Mới nộp</option>
                  <option value="InReview">Đang xét duyệt</option>
                  <option value="NeedMoreInfo">Cần bổ sung</option>
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Loại chứng cứ</label>
                <select 
                  className={styles.filterSelect}
                  value={filters.type}
                  onChange={(e) => updateFilter('type', e.target.value)}
                >
                  <option value="">Tất cả loại</option>
                  <option value="PHOTO">Ảnh</option>
                  <option value="VIDEO">Video</option>
                  <option value="PDF">PDF</option>
                  <option value="AUDIO">Audio</option>
                  <option value="OTHER">Khác</option>
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Độ nhạy cảm</label>
                <select 
                  className={styles.filterSelect}
                  value={filters.sensitivity}
                  onChange={(e) => updateFilter('sensitivity', e.target.value)}
                >
                  <option value="">Tất cả mức độ</option>
                  <option value="Public">Public</option>
                  <option value="Internal">Internal</option>
                  <option value="Restricted">Restricted</option>
                  <option value="Secret-lite">Secret-lite</option>
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Tỉnh/Thành</label>
                <select 
                  className={styles.filterSelect}
                  value={filters.province}
                  onChange={(e) => updateFilter('province', e.target.value)}
                >
                  <option value="">Tất cả tỉnh/thành</option>
                  {provinces.map(province => (
                    <option key={province} value={province}>{province}</option>
                  ))}
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Người duyệt</label>
                <select 
                  className={styles.filterSelect}
                  value={filters.assignee}
                  onChange={(e) => updateFilter('assignee', e.target.value)}
                >
                  <option value="">Tất cả</option>
                  <option value="assigned">Đã phân công</option>
                  <option value="unassigned">Chưa phân công</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Table Section */}
        <div className={styles.tableContainer}>
          <div className={styles.tableHeader}>
            <h2 className={styles.sectionTitle}>
              Danh sách chờ duyệt ({filteredItems.length})
            </h2>
          </div>

          {filteredItems.length === 0 ? (
            <div className={styles.emptyState}>
              <FileText size={48} className={styles.emptyIcon} />
              <h3 className={styles.emptyTitle}>Không có chứng cứ nào</h3>
              <p className={styles.emptyDescription}>
                {activeFilterCount > 0 || filters.search
                  ? 'Không tìm thấy chứng cứ nào phù hợp với bộ lọc.'
                  : 'Hiện tại không có chứng cứ nào cần xét duyệt.'}
              </p>
              {(activeFilterCount > 0 || filters.search) && (
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Xóa bộ lọc
                </Button>
              )}
            </div>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th}>
                      <button className={styles.thButton} onClick={() => handleSort('evidenceId')}>
                        <span>Mã chứng cứ</span>
                        <SortIcon field="evidenceId" />
                      </button>
                    </th>
                    <th className={styles.th}>
                      <span className={styles.thLabel}>Thông tin file</span>
                    </th>
                    <th className={styles.th}>
                      <button className={styles.thButton} onClick={() => handleSort('status')}>
                        <span>Trạng thái</span>
                        <SortIcon field="status" />
                      </button>
                    </th>
                    <th className={styles.th}>
                      <button className={styles.thButton} onClick={() => handleSort('province')}>
                        <span>Địa điểm</span>
                        <SortIcon field="province" />
                      </button>
                    </th>
                    <th className={styles.th}>
                      <span className={styles.thLabel}>Người nộp</span>
                    </th>
                    <th className={styles.th}>
                      <button className={styles.thButton} onClick={() => handleSort('uploadedAt')}>
                        <span>Thời gian</span>
                        <SortIcon field="uploadedAt" />
                      </button>
                    </th>
                    <th className={styles.th}>
                      <span className={styles.thLabel}>Người duyệt</span>
                    </th>
                    <th className={styles.thAction}>
                      <span className={styles.thLabel}>Thao tác</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => (
                    <tr key={item.evidenceId} className={styles.tableRow}>
                      <td className={styles.td}>
                        <div className={styles.idCell}>
                          <span className={styles.evidenceId}>{item.evidenceId}</span>
                          {getSensitivityBadge(item.sensitivityLabel)}
                        </div>
                      </td>
                      <td className={styles.td}>
                        <div className={styles.fileCell}>
                          <div className={styles.fileIcon}>
                            {getFileIcon(item.type)}
                          </div>
                          <div className={styles.fileDetails}>
                            <div className={styles.fileName}>{item.file.filename}</div>
                            <div className={styles.fileMeta}>
                              <span className={styles.fileType}>{getTypeLabel(item.type)}</span>
                              <span className={styles.fileSeparator}>•</span>
                              <span className={styles.fileSize}>{formatFileSize(item.file.sizeBytes)}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className={styles.td}>
                        {getStatusBadge(item.status)}
                      </td>
                      <td className={styles.td}>
                        <div className={styles.locationCell}>
                          <MapPin size={14} className={styles.locationIcon} />
                          <div className={styles.locationText}>
                            {item.scope.district ? `${item.scope.district}, ${item.scope.province}` : item.scope.province}
                          </div>
                        </div>
                      </td>
                      <td className={styles.td}>
                        <div className={styles.userCell}>
                          <User size={14} className={styles.userIcon} />
                          <span className={styles.userName}>{item.submitter.userId}</span>
                        </div>
                      </td>
                      <td className={styles.td}>
                        <div className={styles.dateCell}>
                          <Calendar size={14} className={styles.dateIcon} />
                          <span className={styles.dateText}>{formatDate(item.uploadedAt)}</span>
                        </div>
                      </td>
                      <td className={styles.td}>
                        {item.review?.assignedReviewerId ? (
                          <div className={styles.assigneeCell}>
                            <User size={14} className={styles.assigneeIcon} />
                            <span className={styles.assigneeName}>{item.review.assignedReviewerId}</span>
                          </div>
                        ) : (
                          <Badge variant="outline" className={styles.unassignedBadge}>
                            Chưa phân công
                          </Badge>
                        )}
                      </td>
                      <td className={styles.tdAction}>
                        <Button
                          size="sm"
                          onClick={() => navigate(`/evidence/review/${item.evidenceId}`)}
                          className={styles.actionButton}
                        >
                          <ShieldCheck size={14} />
                          Xét duyệt
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
