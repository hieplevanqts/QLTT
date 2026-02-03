import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  Download,
  Save,
  X,
  ChevronDown,
  Calendar,
  MapPin,
  User,
  Tag,
  Clock,
  AlertTriangle,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  Star,
  StarOff,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Settings,
} from 'lucide-react';
import styles from './LeadList.module.css';

interface Lead {
  id: string;
  title: string;
  source: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'new' | 'triaged' | 'in_progress' | 'resolved' | 'closed';
  assignee: string;
  area: string;
  category: string;
  createdAt: string;
  dueDate: string;
  slaStatus: 'on_time' | 'at_risk' | 'overdue';
  starred: boolean;
}

interface SavedView {
  id: string;
  name: string;
  filters: any;
  isDefault: boolean;
}

export default function LeadList() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [sortBy, setSortBy] = useState<{ field: string; direction: 'asc' | 'desc' }>({
    field: 'createdAt',
    direction: 'desc',
  });
  const [showSaveViewModal, setShowSaveViewModal] = useState(false);
  const [viewName, setViewName] = useState('');
  
  // Filters
  const [filters, setFilters] = useState({
    status: [] as string[],
    priority: [] as string[],
    source: [] as string[],
    area: [] as string[],
    category: [] as string[],
    assignee: [] as string[],
    slaStatus: [] as string[],
    dateRange: { from: '', to: '' },
  });

  // Mock saved views
  const [savedViews, setSavedViews] = useState<SavedView[]>([
    { id: '1', name: 'Lead quá hạn', filters: { slaStatus: ['overdue'] }, isDefault: false },
    { id: '2', name: 'Rủi ro cao', filters: { priority: ['critical', 'high'] }, isDefault: false },
    { id: '3', name: 'Chờ xử lý', filters: { status: ['new', 'triaged'] }, isDefault: true },
  ]);

  // Mock data
  const mockLeads: Lead[] = Array.from({ length: 150 }, (_, i) => ({
    id: `L-2024-${(1500 + i).toString().padStart(4, '0')}`,
    title: [
      'Phát hiện cửa hàng kinh doanh hàng giả',
      'Khiếu nại về chất lượng sản phẩm',
      'Vi phạm niêm yết giá',
      'Hàng không rõ nguồn gốc',
      'Không cung cấp hóa đơn',
    ][i % 5],
    source: ['Hotline', 'Thanh tra viên', 'Website', 'Mobile App', 'Email'][i % 5],
    priority: (['critical', 'high', 'medium', 'low'] as const)[i % 4],
    status: (['new', 'triaged', 'in_progress', 'resolved', 'closed'] as const)[i % 5],
    assignee: ['Nguyễn Văn A', 'Trần Thị B', 'Lê Văn C', 'Phạm Thị D'][i % 4],
    area: ['Phường 1', 'Phường 3', 'Phường 7', 'Phường 10'][i % 4],
    category: ['Hàng giả', 'Chất lượng', 'Giá cả', 'An toàn thực phẩm'][i % 4],
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
    dueDate: new Date(Date.now() + (7 - i % 10) * 86400000).toISOString(),
    slaStatus: (['on_time', 'at_risk', 'overdue'] as const)[i % 3],
    starred: i % 7 === 0,
  }));

  const filteredLeads = mockLeads.filter((lead) => {
    // Search
    if (searchQuery && !lead.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !lead.id.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filters
    if (filters.status.length && !filters.status.includes(lead.status)) return false;
    if (filters.priority.length && !filters.priority.includes(lead.priority)) return false;
    if (filters.source.length && !filters.source.includes(lead.source)) return false;
    if (filters.area.length && !filters.area.includes(lead.area)) return false;
    if (filters.category.length && !filters.category.includes(lead.category)) return false;
    if (filters.slaStatus.length && !filters.slaStatus.includes(lead.slaStatus)) return false;
    
    return true;
  });

  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedLeads(paginatedLeads.map((lead) => lead.id));
    } else {
      setSelectedLeads([]);
    }
  };

  const handleSelectLead = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedLeads([...selectedLeads, id]);
    } else {
      setSelectedLeads(selectedLeads.filter((leadId) => leadId !== id));
    }
  };

  const getPriorityClass = (priority: string) => {
    const classes = {
      critical: styles.priorityCritical,
      high: styles.priorityHigh,
      medium: styles.priorityMedium,
      low: styles.priorityLow,
    };
    return classes[priority as keyof typeof classes] || '';
  };

  const getStatusClass = (status: string) => {
    const classes = {
      new: styles.statusNew,
      triaged: styles.statusTriaged,
      in_progress: styles.statusInProgress,
      resolved: styles.statusResolved,
      closed: styles.statusClosed,
    };
    return classes[status as keyof typeof classes] || '';
  };

  const getSLAClass = (slaStatus: string) => {
    const classes = {
      on_time: styles.slaOnTime,
      at_risk: styles.slaAtRisk,
      overdue: styles.slaOverdue,
    };
    return classes[slaStatus as keyof typeof classes] || '';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      new: 'Mới',
      triaged: 'Đã phân loại',
      in_progress: 'Đang xử lý',
      resolved: 'Đã xử lý',
      closed: 'Đã đóng',
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getPriorityLabel = (priority: string) => {
    const labels = {
      critical: 'Khẩn cấp',
      high: 'Cao',
      medium: 'Trung bình',
      low: 'Thấp',
    };
    return labels[priority as keyof typeof labels] || priority;
  };

  const handleExport = () => {
    alert(`Đang xuất ${filteredLeads.length} lead ra file Excel...`);
  };

  const handleSaveView = () => {
    if (!viewName.trim()) return;
    
    const newView: SavedView = {
      id: Date.now().toString(),
      name: viewName,
      filters: { ...filters },
      isDefault: false,
    };
    
    setSavedViews([...savedViews, newView]);
    setViewName('');
    setShowSaveViewModal(false);
    alert('Đã lưu bộ lọc thành công!');
  };

  const loadView = (view: SavedView) => {
    setFilters(view.filters);
    setShowFilters(false);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('vi-VN');
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <h1 className={styles.title}>Danh sách Lead</h1>
          <p className={styles.subtitle}>Tra cứu và quản lý nguồn tin</p>
        </div>

        <div className={styles.headerActions}>
          <button className={styles.exportButton} onClick={handleExport}>
            <Download size={16} />
            Xuất Excel
          </button>
        </div>
      </div>

      {/* Saved Views */}
      <div className={styles.savedViews}>
        <div className={styles.savedViewsLabel}>
          <Settings size={16} />
          <span>Bộ lọc đã lưu:</span>
        </div>
        <div className={styles.savedViewsList}>
          {savedViews.map((view) => (
            <button
              key={view.id}
              className={styles.savedViewButton}
              onClick={() => loadView(view)}
            >
              {view.name}
              {view.isDefault && <Star size={12} className={styles.defaultStar} />}
            </button>
          ))}
          <button
            className={styles.saveViewButton}
            onClick={() => setShowSaveViewModal(true)}
          >
            <Save size={14} />
            Lưu bộ lọc hiện tại
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className={styles.searchBar}>
        <div className={styles.searchBox}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Tìm kiếm theo ID hoặc tiêu đề..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          {searchQuery && (
            <button className={styles.clearSearch} onClick={() => setSearchQuery('')}>
              <X size={16} />
            </button>
          )}
        </div>

        <button
          className={`${styles.filterButton} ${showFilters ? styles.filterButtonActive : ''}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={16} />
          Bộ lọc
          {Object.values(filters).some((f) => Array.isArray(f) ? f.length > 0 : false) && (
            <span className={styles.filterBadge}>
              {Object.values(filters).filter((f) => Array.isArray(f) && f.length > 0).length}
            </span>
          )}
        </button>

        <div className={styles.resultCount}>
          {filteredLeads.length} kết quả
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className={styles.filtersPanel}>
          <div className={styles.filtersPanelHeader}>
            <h3>Bộ lọc nâng cao</h3>
            <button onClick={() => setFilters({
              status: [],
              priority: [],
              source: [],
              area: [],
              category: [],
              assignee: [],
              slaStatus: [],
              dateRange: { from: '', to: '' },
            })}>
              Xóa tất cả
            </button>
          </div>

          <div className={styles.filtersGrid}>
            {/* Status Filter */}
            <div className={styles.filterGroup}>
              <label>Trạng thái</label>
              <div className={styles.checkboxGroup}>
                {['new', 'triaged', 'in_progress', 'resolved', 'closed'].map((status) => (
                  <label key={status} className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={filters.status.includes(status)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFilters({ ...filters, status: [...filters.status, status] });
                        } else {
                          setFilters({ ...filters, status: filters.status.filter((s) => s !== status) });
                        }
                      }}
                    />
                    {getStatusLabel(status)}
                  </label>
                ))}
              </div>
            </div>

            {/* Priority Filter */}
            <div className={styles.filterGroup}>
              <label>Độ ưu tiên</label>
              <div className={styles.checkboxGroup}>
                {['critical', 'high', 'medium', 'low'].map((priority) => (
                  <label key={priority} className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={filters.priority.includes(priority)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFilters({ ...filters, priority: [...filters.priority, priority] });
                        } else {
                          setFilters({ ...filters, priority: filters.priority.filter((p) => p !== priority) });
                        }
                      }}
                    />
                    {getPriorityLabel(priority)}
                  </label>
                ))}
              </div>
            </div>

            {/* Area Filter */}
            <div className={styles.filterGroup}>
              <label>Địa bàn</label>
              <div className={styles.checkboxGroup}>
                {['Phường 1', 'Phường 3', 'Phường 7', 'Phường 10'].map((area) => (
                  <label key={area} className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={filters.area.includes(area)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFilters({ ...filters, area: [...filters.area, area] });
                        } else {
                          setFilters({ ...filters, area: filters.area.filter((a) => a !== area) });
                        }
                      }}
                    />
                    {area}
                  </label>
                ))}
              </div>
            </div>

            {/* SLA Status Filter */}
            <div className={styles.filterGroup}>
              <label>Tình trạng SLA</label>
              <div className={styles.checkboxGroup}>
                {[
                  { value: 'on_time', label: 'Đúng hạn' },
                  { value: 'at_risk', label: 'Sắp hết hạn' },
                  { value: 'overdue', label: 'Quá hạn' },
                ].map((sla) => (
                  <label key={sla.value} className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={filters.slaStatus.includes(sla.value)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFilters({ ...filters, slaStatus: [...filters.slaStatus, sla.value] });
                        } else {
                          setFilters({ ...filters, slaStatus: filters.slaStatus.filter((s) => s !== sla.value) });
                        }
                      }}
                    />
                    {sla.label}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      {selectedLeads.length > 0 && (
        <div className={styles.bulkActions}>
          <span className={styles.bulkActionsLabel}>
            Đã chọn {selectedLeads.length} lead
          </span>
          <div className={styles.bulkActionsButtons}>
            <button className={styles.bulkActionButton}>
              <User size={14} />
              Gán người xử lý
            </button>
            <button className={styles.bulkActionButton}>
              <Tag size={14} />
              Thêm nhãn
            </button>
            <button className={styles.bulkActionButton}>
              <Download size={14} />
              Xuất đã chọn
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.checkboxColumn}>
                <input
                  type="checkbox"
                  checked={selectedLeads.length === paginatedLeads.length && paginatedLeads.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </th>
              <th className={styles.starColumn}></th>
              <th>ID</th>
              <th>Tiêu đề</th>
              <th>Trạng thái</th>
              <th>Ưu tiên</th>
              <th>SLA</th>
              <th>Người xử lý</th>
              <th>Địa bàn</th>
              <th>Ngày tạo</th>
              <th className={styles.actionsColumn}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {paginatedLeads.map((lead) => (
              <tr key={lead.id} onClick={() => navigate(`/lead-risk/lead/${lead.id}`)}>
                <td className={styles.checkboxCell} onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedLeads.includes(lead.id)}
                    onChange={(e) => handleSelectLead(lead.id, e.target.checked)}
                  />
                </td>
                <td className={styles.starCell} onClick={(e) => e.stopPropagation()}>
                  {lead.starred ? (
                    <Star size={16} className={styles.starredIcon} />
                  ) : (
                    <StarOff size={16} className={styles.unstarredIcon} />
                  )}
                </td>
                <td className={styles.idCell}>{lead.id}</td>
                <td className={styles.titleCell}>{lead.title}</td>
                <td>
                  <span className={`${styles.statusBadge} ${getStatusClass(lead.status)}`}>
                    {getStatusLabel(lead.status)}
                  </span>
                </td>
                <td>
                  <span className={`${styles.priorityBadge} ${getPriorityClass(lead.priority)}`}>
                    {getPriorityLabel(lead.priority)}
                  </span>
                </td>
                <td>
                  <span className={`${styles.slaBadge} ${getSLAClass(lead.slaStatus)}`}>
                    {lead.slaStatus === 'on_time' && 'Đúng hạn'}
                    {lead.slaStatus === 'at_risk' && 'Sắp hết'}
                    {lead.slaStatus === 'overdue' && 'Quá hạn'}
                  </span>
                </td>
                <td>{lead.assignee}</td>
                <td>
                  <div className={styles.areaCell}>
                    <MapPin size={14} />
                    {lead.area}
                  </div>
                </td>
                <td className={styles.dateCell}>{formatDate(lead.createdAt)}</td>
                <td className={styles.actionsCell} onClick={(e) => e.stopPropagation()}>
                  <button className={styles.actionButton} onClick={() => navigate(`/lead-risk/lead/${lead.id}`)}>
                    <Eye size={16} />
                  </button>
                  <button className={styles.actionButton}>
                    <Edit size={16} />
                  </button>
                  <button className={styles.actionButton}>
                    <MoreVertical size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className={styles.pagination}>
        <div className={styles.paginationInfo}>
          Hiển thị {(currentPage - 1) * itemsPerPage + 1} -{' '}
          {Math.min(currentPage * itemsPerPage, filteredLeads.length)} trong tổng số{' '}
          {filteredLeads.length} lead
        </div>

        <div className={styles.paginationControls}>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className={styles.itemsPerPageSelect}
          >
            <option value={10}>10 / trang</option>
            <option value={25}>25 / trang</option>
            <option value={50}>50 / trang</option>
            <option value={100}>100 / trang</option>
          </select>

          <div className={styles.paginationButtons}>
            <button
              className={styles.paginationButton}
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              <ChevronLeft size={16} />
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={i}
                  className={`${styles.paginationButton} ${currentPage === pageNum ? styles.paginationButtonActive : ''}`}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              className={styles.paginationButton}
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Save View Modal */}
      {showSaveViewModal && (
        <div className={styles.modalOverlay} onClick={() => setShowSaveViewModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Lưu bộ lọc</h3>
              <button onClick={() => setShowSaveViewModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <label>Tên bộ lọc</label>
              <input
                type="text"
                placeholder="Ví dụ: Lead khẩn cấp chưa xử lý"
                value={viewName}
                onChange={(e) => setViewName(e.target.value)}
                className={styles.modalInput}
              />
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.modalCancelButton} onClick={() => setShowSaveViewModal(false)}>
                Hủy
              </button>
              <button className={styles.modalSaveButton} onClick={handleSaveView}>
                <Save size={16} />
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
