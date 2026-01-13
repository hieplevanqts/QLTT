import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  CheckSquare, 
  UserPlus, 
  XCircle,
  Inbox,
  X,
  Trash2,
  CheckCircle2,
  Map,
} from 'lucide-react';
import { mockLeads } from '../../data/lead-risk/mockLeads';
import { StatusBadge } from '../../app/components/lead-risk/StatusBadge';
import { UrgencyBadge } from '../../app/components/lead-risk/UrgencyBadge';
import { SLATimer } from '../../app/components/lead-risk/SLATimer';
import { LeadFormModal } from '../../app/components/lead-risk/LeadFormModal';
import { DeleteConfirmModal } from '../../app/components/lead-risk/DeleteConfirmModal';
import { ConfirmationDialog } from '../../app/components/lead-risk/ConfirmationDialog';
import { AddNoteModal } from '../../app/components/lead-risk/AddNoteModal';
import { UpdateSLAModal } from '../../app/components/lead-risk/UpdateSLAModal';
import { RejectLeadModal } from '../../app/components/lead-risk/RejectLeadModal';
import { LeadActionMenu } from '../../app/components/lead-risk/LeadActionMenu';
import { WatchlistPanel, type WatchlistItem } from '../../app/components/lead-risk/WatchlistPanel';
import MultiSelectDropdown from '../../app/components/lead-risk/MultiSelectDropdown';
import { Breadcrumb } from '../../app/components/Breadcrumb';
import type { Lead, LeadStatus } from '../../data/lead-risk/types';
import styles from './LeadInbox.module.css';

type FilterType = 'all' | 'new' | 'in_verification' | 'in_progress' | 'resolved' | 'rejected' | 'cancelled' | 'sla_risk' | 'critical' | 'unassigned' | 'assigned_to_me';

// Status configuration for overview cards
const STATUS_CONFIG = [
  {
    key: 'all' as const,
    label: 'Tổng số nguồn tin',
    icon: Inbox,
    iconColor: 'var(--primary)',
    bgColor: 'rgba(239, 246, 255, 1)',
    detailLabel: 'Tất cả',
    getDetailValue: () => null,
    detailColor: 'var(--primary)',
  },
  {
    key: 'new' as const,
    label: 'Mới',
    icon: CheckSquare,
    iconColor: 'var(--primary)',
    bgColor: 'rgba(239, 246, 255, 1)',
    detailLabel: 'Cần xử lý',
    getDetailValue: () => null,
    detailColor: 'var(--primary)',
  },
  {
    key: 'in_verification' as const,
    label: 'Đang xác minh',
    icon: CheckCircle2,
    iconColor: 'rgba(180, 83, 9, 1)',
    bgColor: 'rgba(254, 243, 199, 1)',
    detailLabel: 'Đang kiểm tra',
    getDetailValue: () => null,
    detailColor: 'rgba(180, 83, 9, 1)',
  },
  {
    key: 'in_progress' as const,
    label: 'Đang xử lý',
    icon: CheckCircle2,
    iconColor: 'rgba(59, 130, 246, 1)',
    bgColor: 'rgba(219, 234, 254, 1)',
    detailLabel: 'Đang thực hiện',
    getDetailValue: () => null,
    detailColor: 'rgba(59, 130, 246, 1)',
  },
  {
    key: 'resolved' as const,
    label: 'Đã xử lý',
    icon: CheckCircle2,
    iconColor: 'rgba(34, 197, 94, 1)',
    bgColor: 'rgba(220, 252, 231, 1)',
    detailLabel: 'Hoàn thành',
    getDetailValue: () => null,
    detailColor: 'rgba(34, 197, 94, 1)',
  },
];

// Action definitions based on status
type LeadAction = 
  | 'view'
  | 'edit'
  | 'delete'
  | 'start_verification'
  | 'assign'
  | 'reject'
  | 'hold'
  | 'cancel'
  | 'complete'
  | 'reopen_to_progress'
  | 'reopen_to_verification'
  | 'note'
  | 'update_sla'
  | 'add_evidence'
  | 'export';

// Get allowed actions for each status
const getAllowedActions = (status: LeadStatus): LeadAction[] => {
  switch (status) {
    case 'new':
      return ['view', 'note', 'start_verification'];
    case 'in_verification':
      return ['view', 'note', 'assign', 'reject', 'hold', 'cancel'];
    case 'in_progress':
      return ['view', 'note', 'add_evidence', 'update_sla', 'complete', 'hold', 'cancel'];
    case 'resolved':
      return ['view', 'note', 'export', 'reopen_to_progress', 'reopen_to_verification'];
    case 'rejected':
      return ['view', 'export'];
    case 'cancelled':
      return ['view', 'export'];
    default:
      return ['view'];
  }
};

export default function LeadInbox() {
  const navigate = useNavigate();
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  
  // Multi-select filters
  const [selectedUrgencies, setSelectedUrgencies] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(['new']); // Default to "Mới"
  const [selectedAssignments, setSelectedAssignments] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [deletingLead, setDeletingLead] = useState<Lead | null>(null);
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);
  const [isUpdateSLAModalOpen, setIsUpdateSLAModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [currentLead, setCurrentLead] = useState<Lead | null>(null);

  // Confirmation Dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    type: 'info' | 'warning' | 'danger' | 'success';
    leadCode?: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Xác nhn',
    type: 'warning',
    onConfirm: () => {},
  });

  // Mock watchlist data
  const [watchlistItems] = useState<WatchlistItem[]>([
    {
      id: 'w1',
      type: 'store',
      name: 'Cửa hàng Bách Hóa Xanh Q1',
      code: 'CH-2024-001',
      reason: 'Phát hiện 3 trường hợp bán hàng hết hạn trong tháng qua',
      addedAt: '2025-01-01T08:00:00Z',
      addedBy: 'Nguyễn Văn A',
      priority: 'high',
      status: 'alert',
      riskScore: 75,
      location: 'Q1, TP.HCM',
      lastActivity: '2025-01-08T14:30:00Z',
      alertCount: 2,
    },
    {
      id: 'w2',
      type: 'lead',
      name: 'Lead báo cáo thuốc giả',
      code: 'LD24-0125',
      reason: 'Nguồn tin đáng tin cậy từ thanh tra viên, cần theo dõi tiến độ',
      addedAt: '2025-01-05T10:00:00Z',
      addedBy: 'Trần Thị B',
      priority: 'high',
      status: 'active',
      location: 'Q3, TP.HCM',
      lastActivity: '2025-01-09T09:15:00Z',
    },
    {
      id: 'w3',
      type: 'location',
      name: 'Khu vực chợ Bến Thành',
      reason: 'Điểm nóng về hàng giả, hàng nhái - yêu cầu tuần tra thường xuyên',
      addedAt: '2024-12-20T08:00:00Z',
      addedBy: 'Lê Văn C',
      priority: 'medium',
      status: 'active',
      riskScore: 62,
      location: 'Q1, TP.HCM',
      lastActivity: '2025-01-08T16:45:00Z',
      alertCount: 1,
    },
    {
      id: 'w4',
      type: 'store',
      name: 'Nhà thuốc An Khang',
      code: 'CH-2023-456',
      reason: 'Đã xử lý vi phạm, theo dõi cải thiện',
      addedAt: '2024-11-15T08:00:00Z',
      addedBy: 'Phạm Thị D',
      priority: 'low',
      status: 'resolved',
      riskScore: 35,
      location: 'Q10, TP.HCM',
      lastActivity: '2025-01-05T11:20:00Z',
    },
    {
      id: 'w5',
      type: 'lead',
      name: 'Phản ánh mỹ phẩm không rõ nguồn gốc',
      code: 'LD24-0089',
      reason: 'Nhiều người tiêu dùng phản ánh, nghi ngờ hàng nhập lậu',
      addedAt: '2024-12-28T14:00:00Z',
      addedBy: 'Nguyễn Văn A',
      priority: 'medium',
      status: 'alert',
      location: 'Q7, TP.HCM',
      lastActivity: '2025-01-07T10:30:00Z',
      alertCount: 3,
    },
  ]);

  const handleRemoveFromWatchlist = (id: string) => {
    if (confirm('Bạn có chắc muốn bỏ theo dõi mục này?')) {
      alert(`Đã bỏ theo dõi: ${id}`);
    }
  };

  const handleViewWatchlistItemDetails = (item: WatchlistItem) => {
    if (item.type === 'lead') {
      // Navigate to lead detail if we have the lead ID
      const lead = mockLeads.find(l => l.code === item.code);
      if (lead) {
        navigate(`/lead-risk/lead/${lead.id}`);
      }
    } else if (item.type === 'store') {
      alert(`Xem chi tiết cơ sở: ${item.name}`);
    } else {
      alert(`Xem chi tiết địa điểm: ${item.name}`);
    }
    setIsWatchlistOpen(false);
  };

  // Calculate lead counts for filters
  const newLeads = mockLeads.filter(l => l.status === 'new').length;
  const inVerificationLeads = mockLeads.filter(l => l.status === 'in_verification').length;
  const inProgressLeads = mockLeads.filter(l => l.status === 'in_progress').length;
  const resolvedLeads = mockLeads.filter(l => l.status === 'resolved').length;
  const rejectedLeads = mockLeads.filter(l => l.status === 'rejected').length;
  const cancelledLeads = mockLeads.filter(l => l.status === 'cancelled').length;
  const assignedToMe = mockLeads.filter(l => l.assignedTo?.userId === 'QT24_NGUYENVANA').length;
  const unassignedLeads = mockLeads.filter(l => !l.assignedTo).length;

  // Get count for each status
  const getStatusCount = (key: string) => {
    switch (key) {
      case 'all': return mockLeads.length;
      case 'new': return newLeads;
      case 'in_verification': return inVerificationLeads;
      case 'in_progress': return inProgressLeads;
      case 'resolved': return resolvedLeads;
      case 'rejected': return rejectedLeads;
      case 'cancelled': return cancelledLeads;
      default: return 0;
    }
  };

  // Apply filters
  const filteredLeads = mockLeads.filter(lead => {
    // Urgency filter
    if (selectedUrgencies.length > 0 && !selectedUrgencies.includes(lead.urgency)) return false;

    // Status filter
    if (selectedStatuses.length > 0 && !selectedStatuses.includes(lead.status)) return false;

    // Assignment filter - OR logic
    if (selectedAssignments.length > 0) {
      const matchesAssignment = selectedAssignments.some(filter => {
        if (filter === 'assigned') return !!lead.assignedTo;
        if (filter === 'unassigned') return !lead.assignedTo;
        if (filter === 'assigned_to_me') return lead.assignedTo?.userId === 'QT24_NGUYENVANA';
        return false;
      });
      if (!matchesAssignment) return false;
    }

    // Category filter
    if (selectedCategories.length > 0 && !selectedCategories.includes(lead.category)) return false;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        lead.title.toLowerCase().includes(query) ||
        lead.code.toLowerCase().includes(query) ||
        lead.description.toLowerCase().includes(query) ||
        lead.reporterName?.toLowerCase().includes(query) ||
        lead.storeName?.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    return true;
  });

  const toggleSelectLead = (leadId: string) => {
    const newSelected = new Set(selectedLeads);
    if (newSelected.has(leadId)) {
      newSelected.delete(leadId);
    } else {
      newSelected.add(leadId);
    }
    setSelectedLeads(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedLeads.size === filteredLeads.length) {
      setSelectedLeads(new Set());
    } else {
      setSelectedLeads(new Set(filteredLeads.map(l => l.id)));
    }
  };

  const handleBulkTriage = () => {
    alert(`Phân loại ${selectedLeads.size} lead`);
  };

  const handleBulkAssign = () => {
    alert(`Giao xử lý ${selectedLeads.size} lead`);
  };

  const handleBulkReject = () => {
    if (confirm(`Bạn có chắc muốn từ chối ${selectedLeads.size} lead?`)) {
      alert('Đã từ chối');
    }
  };

  const clearAllFilters = () => {
    setSelectedUrgencies([]);
    setSelectedStatuses([]);
    setSelectedAssignments([]);
    setSelectedCategories([]);
    setSearchQuery('');
  };

  const hasActiveFilters = selectedUrgencies.length > 0 || selectedStatuses.length > 0 || selectedAssignments.length > 0 || selectedCategories.length > 0 || searchQuery !== '';

  // CRUD Handlers
  const handleCreateLead = () => {
    setFormMode('create');
    setEditingLead(null);
    setIsFormModalOpen(true);
  };

  const handleEditLead = (lead: Lead) => {
    setFormMode('edit');
    setEditingLead(lead);
    setIsFormModalOpen(true);
  };

  const handleDeleteLead = (lead: Lead) => {
    setDeletingLead(lead);
    setIsDeleteModalOpen(true);
  };

  const handleBulkDelete = () => {
    setDeletingLead(null);
    setIsDeleteModalOpen(true);
  };

  const handleSaveLead = (leadData: Partial<Lead>) => {
    if (formMode === 'create') {
      console.log('Creating lead:', leadData);
      alert('Lead đã được tạo thành công!');
    } else {
      console.log('Updating lead:', editingLead?.id, leadData);
      alert('Lead đã được cập nhật thành công!');
    }
    setSelectedLeads(new Set());
  };

  const handleConfirmDelete = () => {
    if (deletingLead) {
      console.log('Deleting single lead:', deletingLead.id);
      alert(`Đã xóa lead: ${deletingLead.code}`);
    } else {
      console.log('Deleting leads:', Array.from(selectedLeads));
      alert(`Đã xóa ${selectedLeads.size} leads`);
      setSelectedLeads(new Set());
    }
  };

  // Handle actions from menu
  const handleLeadAction = (lead: Lead, action: LeadAction) => {
    console.log(`Action ${action} on lead ${lead.code}`);
    
    switch (action) {
      case 'view':
        navigate(`/lead-risk/lead/${lead.id}`);
        break;
      case 'edit':
        handleEditLead(lead);
        break;
      case 'delete':
        handleDeleteLead(lead);
        break;
      case 'start_verification':
        setConfirmDialog({
          isOpen: true,
          title: 'Bắt đầu xác minh',
          message: 'Bạn có sẵn sàng bắt đầu quá trình xác minh lead này?',
          confirmText: 'Bắt đầu',
          type: 'success',
          leadCode: lead.code,
          onConfirm: () => {
            alert(`Bắt đầu xác minh: ${lead.code}`);
          },
        });
        break;
      case 'assign':
        setConfirmDialog({
          isOpen: true,
          title: 'Giao xử lý Lead',
          message: 'Bạn có muốn giao lead này cho người xử lý?',
          confirmText: 'Giao việc',
          type: 'info',
          leadCode: lead.code,
          onConfirm: () => {
            alert(`Đã giao xử lý lead: ${lead.code}`);
          },
        });
        break;
      case 'reject':
        setCurrentLead(lead);
        setIsRejectModalOpen(true);
        break;
      case 'hold':
        setConfirmDialog({
          isOpen: true,
          title: 'Tạm dừng xử lý',
          message: 'Lead này sẽ được tạm dừng xử lý. Bạn có muốn tiếp tục?',
          confirmText: 'Tạm dừng',
          type: 'warning',
          leadCode: lead.code,
          onConfirm: () => {
            alert(`Tạm dừng: ${lead.code}`);
          },
        });
        break;
      case 'cancel':
        setConfirmDialog({
          isOpen: true,
          title: 'Hủy bỏ Lead',
          message: 'Lead này sẽ được hủy bỏ và không được xử lý tiếp. Bạn có chắc chắn?',
          confirmText: 'Hủy bỏ',
          type: 'danger',
          leadCode: lead.code,
          onConfirm: () => {
            alert(`Hủy bỏ: ${lead.code}`);
          },
        });
        break;
      case 'complete':
        setConfirmDialog({
          isOpen: true,
          title: 'Đánh dấu hoàn thành',
          message: 'Lead này sẽ được đánh dấu là đã xử lý xong. Bạn có chắc chắn?',
          confirmText: 'Hoàn thành',
          type: 'success',
          leadCode: lead.code,
          onConfirm: () => {
            alert(`Đánh dấu đã xong: ${lead.code}`);
          },
        });
        break;
      case 'reopen_to_progress':
        setConfirmDialog({
          isOpen: true,
          title: 'Mở lại Lead',
          message: 'Lead đã đóng sẽ được mở lại để xử lý tiếp. Bạn có chắc chắn?',
          confirmText: 'Mở lại',
          type: 'warning',
          leadCode: lead.code,
          onConfirm: () => {
            alert(`Mở lại: ${lead.code}`);
          },
        });
        break;
      case 'reopen_to_verification':
        setConfirmDialog({
          isOpen: true,
          title: 'Mở lại Lead',
          message: 'Lead đã đóng sẽ được mở lại để xử lý tiếp. Bạn có chắc chắn?',
          confirmText: 'Mở lại',
          type: 'warning',
          leadCode: lead.code,
          onConfirm: () => {
            alert(`Mở li: ${lead.code}`);
          },
        });
        break;
      case 'note':
        setCurrentLead(lead);
        setIsAddNoteModalOpen(true);
        break;
      case 'update_sla':
        setCurrentLead(lead);
        setIsUpdateSLAModalOpen(true);
        break;
      case 'add_evidence':
        alert(`Thêm bằng chứng: ${lead.code}`);
        break;
      case 'export':
        alert(`Xuất báo cáo: ${lead.code}`);
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  return (
    <div className={styles.container}>
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Nguồn tin, Rủi ro', path: '/lead-risk/inbox' },
          { label: 'Xử lý nguồn tin hằng ngày' },
        ]}
      />

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Hộp thư nguồn tin</h1>
          <p className={styles.subtitle}>
            Xử lý nguồn tin hàng ngày
          </p>
        </div>
        <div className={styles.headerRight}>
          <button className={styles.createButton} onClick={handleCreateLead}>
            <Plus size={18} />
            <span>Tạo Lead</span>
          </button>
        </div>
      </div>

      {/* Filters & Search Row - Single Row with All Elements */}
      <div className={styles.filterRow}>

        <MultiSelectDropdown
          label="Mức độ"
          options={[
            { value: 'critical', label: 'Nghiêm trọng', count: mockLeads.filter(l => l.urgency === 'critical').length },
            { value: 'high', label: 'Cao', count: mockLeads.filter(l => l.urgency === 'high').length },
            { value: 'medium', label: 'Trung bình', count: mockLeads.filter(l => l.urgency === 'medium').length },
            { value: 'low', label: 'Thấp', count: mockLeads.filter(l => l.urgency === 'low').length },
          ]}
          selectedValues={selectedUrgencies}
          onChange={setSelectedUrgencies}
          placeholder="Tất cả"
        />

        <MultiSelectDropdown
          label="Trạng thái"
          options={[
            { value: 'new', label: 'Mới', count: newLeads },
            { value: 'in_verification', label: 'Đang xác minh', count: inVerificationLeads },
            { value: 'in_progress', label: 'Đang xử lý', count: inProgressLeads },
            { value: 'resolved', label: 'Đã giải quyết', count: resolvedLeads },
            { value: 'rejected', label: 'Đã từ chối', count: rejectedLeads },
            { value: 'cancelled', label: 'Đã hủy bỏ', count: cancelledLeads },
          ]}
          selectedValues={selectedStatuses}
          onChange={setSelectedStatuses}
          placeholder="Tất cả"
        />

        <MultiSelectDropdown
          label="Phân công"
          options={[
            { value: 'assigned', label: 'Đã giao', count: mockLeads.filter(l => l.assignedTo).length },
            { value: 'unassigned', label: 'Chưa giao', count: unassignedLeads },
            { value: 'assigned_to_me', label: 'Của tôi', count: assignedToMe },
          ]}
          selectedValues={selectedAssignments}
          onChange={setSelectedAssignments}
          placeholder="Tất cả"
        />

        <MultiSelectDropdown
          label="Danh mục vi phạm"
          options={[
            { value: 'counterfeit', label: 'Hàng giả', count: mockLeads.filter(l => l.category === 'counterfeit').length },
            { value: 'smuggling', label: 'Buôn lậu', count: mockLeads.filter(l => l.category === 'smuggling').length },
            { value: 'illegal_trading', label: 'Kinh doanh bất hợp pháp', count: mockLeads.filter(l => l.category === 'illegal_trading').length },
            { value: 'food_safety', label: 'An toàn thực phẩm', count: mockLeads.filter(l => l.category === 'food_safety').length },
            { value: 'price_fraud', label: 'Gian lận giá cả', count: mockLeads.filter(l => l.category === 'price_fraud').length },
            { value: 'unlicensed', label: 'Không giấy phép', count: mockLeads.filter(l => l.category === 'unlicensed').length },
            { value: 'other', label: 'Khác', count: mockLeads.filter(l => l.category === 'other').length },
          ]}
          selectedValues={selectedCategories}
          onChange={setSelectedCategories}
          placeholder="Tất cả"
        />

        {/* Search Box - On the right */}
        <div className={styles.searchBoxInline}>
          <Search className={styles.searchIcon} size={18} />
          <input
            type="text"
            placeholder="Tìm kiếm theo mã, tiêu đề, người báo, cửa hàng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        {/* View Map Button */}
        <button 
          className={styles.viewMapButton}
          onClick={() => alert('Chức năng xem bản đồ đang được phát triển')}
          title="Xem bản đồ"
        >
          <Map size={18} />
          <span>Xem Map</span>
        </button>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button className={styles.clearFiltersBtn} onClick={clearAllFilters}>
            <X size={14} />
            Xóa bộ lọc
          </button>
        )}
      </div>

      {/* Bulk Actions */}
      {selectedLeads.size > 0 && (
        <div className={styles.bulkActions}>
          <div className={styles.bulkActionsLeft}>
            <CheckSquare size={18} />
            <span>{selectedLeads.size} lead đã chọn</span>
          </div>
          <div className={styles.bulkActionsRight}>
            <button className={styles.bulkButton} onClick={handleBulkTriage}>
              <CheckCircle2 size={16} />
              Phân loại
            </button>
            <button className={styles.bulkButton} onClick={handleBulkAssign}>
              <UserPlus size={16} />
              Giao xử lý
            </button>
            <button className={styles.bulkButtonDanger} onClick={handleBulkReject}>
              <XCircle size={16} />
              Từ chối
            </button>
            <button className={styles.bulkButtonDanger} onClick={handleBulkDelete}>
              <Trash2 size={16} />
              Xóa
            </button>
          </div>
        </div>
      )}

      {/* Leads Table */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ width: '40px', minWidth: '40px', maxWidth: '40px' }}>
                <div className={styles.checkboxWrapper}>
                  <input
                    type="checkbox"
                    checked={selectedLeads.size === filteredLeads.length && filteredLeads.length > 0}
                    onChange={toggleSelectAll}
                    className={styles.checkbox}
                  />
                </div>
              </th>
              <th style={{ width: '120px' }}>Mã Lead</th>
              <th style={{ width: '280px' }}>Tiêu đề</th>
              <th style={{ width: '180px' }}>Người báo</th>
              <th style={{ width: '160px' }}>Cửa hàng</th>
              <th style={{ width: '180px' }}>Nội dung</th>
              <th style={{ width: '110px' }}>Trạng thái</th>
              <th style={{ width: '100px' }}>Mức độ</th>
              <th style={{ width: '110px' }}>SLA</th>
              <th style={{ width: '140px' }}>Người xử lý</th>
              <th style={{ width: '140px', textAlign: 'center' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.map((lead) => (
              <tr 
                key={lead.id}
                className={selectedLeads.has(lead.id) ? styles.rowSelected : ''}
              >
                <td onClick={(e) => e.stopPropagation()} style={{ width: '40px', minWidth: '40px', maxWidth: '40px' }}>
                  <div className={styles.checkboxWrapper}>
                    <input
                      type="checkbox"
                      checked={selectedLeads.has(lead.id)}
                      onChange={() => toggleSelectLead(lead.id)}
                      className={styles.checkbox}
                    />
                  </div>
                </td>
                <td onClick={() => navigate(`/lead-risk/lead/${lead.id}`)} style={{ cursor: 'pointer' }}>
                  <span className={styles.leadCode}>{lead.code}</span>
                </td>
                <td onClick={() => navigate(`/lead-risk/lead/${lead.id}`)} style={{ cursor: 'pointer' }}>
                  <div className={styles.leadTitle}>{lead.title}</div>
                </td>
                <td onClick={() => navigate(`/lead-risk/lead/${lead.id}`)} style={{ cursor: 'pointer' }}>
                  <div className={styles.reporterInfo}>
                    <span className={styles.reporterName}>{lead.reporterName || '-'}</span>
                    <span className={styles.reporterPhone}>{lead.reporterPhone || '-'}</span>
                  </div>
                </td>
                <td onClick={() => navigate(`/lead-risk/lead/${lead.id}`)} style={{ cursor: 'pointer' }}>
                  <span className={styles.storeName}>{lead.storeName || '-'}</span>
                </td>
                <td onClick={() => navigate(`/lead-risk/lead/${lead.id}`)} style={{ cursor: 'pointer' }}>
                  <div className={styles.contentPreview}>
                    {lead.description.substring(0, 50)}...
                  </div>
                </td>
                <td onClick={() => navigate(`/lead-risk/lead/${lead.id}`)} style={{ cursor: 'pointer' }}>
                  <StatusBadge status={lead.status} size="sm" />
                </td>
                <td onClick={() => navigate(`/lead-risk/lead/${lead.id}`)} style={{ cursor: 'pointer' }}>
                  <UrgencyBadge urgency={lead.urgency} size="sm" />
                </td>
                <td onClick={() => navigate(`/lead-risk/lead/${lead.id}`)} style={{ cursor: 'pointer' }}>
                  <SLATimer
                    deadline={lead.sla.deadline}
                    remainingHours={lead.sla.remainingHours}
                    isOverdue={lead.sla.isOverdue}
                    size="sm"
                  />
                </td>
                <td onClick={() => navigate(`/lead-risk/lead/${lead.id}`)} style={{ cursor: 'pointer' }}>
                  <span className={styles.assignee}>
                    {lead.assignedTo ? lead.assignedTo.userName : 'Chưa giao'}
                  </span>
                </td>
                <td onClick={(e) => e.stopPropagation()}>
                  <div className={styles.actionButtons}>
                    <LeadActionMenu
                      status={lead.status}
                      onAction={(action) => handleLeadAction(lead, action)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredLeads.length === 0 && (
          <div className={styles.emptyState}>
            <Inbox size={48} />
            <p>Không tìm thấy lead nào</p>
            <p className={styles.emptyHint}>Thử điều chỉnh bộ lọc hoặc tìm kiếm</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredLeads.length > 0 && (
        <div className={styles.pagination}>
          <div className={styles.paginationInfo}>
            Hiển thị {filteredLeads.length} / {mockLeads.length} leads
          </div>
          <div className={styles.paginationButtons}>
            <button className={styles.pageButton} disabled>Trước</button>
            <button className={styles.pageButtonActive}>1</button>
            <button className={styles.pageButton}>2</button>
            <button className={styles.pageButton}>3</button>
            <button className={styles.pageButton}>Sau</button>
          </div>
        </div>
      )}

      {/* Modals */}
      <LeadFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        mode={formMode}
        lead={editingLead}
        onSave={handleSaveLead}
      />
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={deletingLead ? 'Xóa Lead' : 'Xóa nhiều Leads'}
        message={deletingLead 
          ? `Bạn có chắc muốn xóa lead "${deletingLead.code}"? Hành động này không thể hoàn tác.`
          : `Bạn có chắc muốn xóa ${selectedLeads.size} leads đã chọn? Hành động này không thể hoàn tác.`
        }
        count={deletingLead ? undefined : selectedLeads.size}
      />
      <WatchlistPanel
        isOpen={isWatchlistOpen}
        onClose={() => setIsWatchlistOpen(false)}
        items={watchlistItems}
        onRemoveItem={handleRemoveFromWatchlist}
        onViewDetails={handleViewWatchlistItemDetails}
      />
      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={confirmDialog.confirmText}
        type={confirmDialog.type}
        onConfirm={confirmDialog.onConfirm}
        leadCode={confirmDialog.leadCode}
      />
      <AddNoteModal
        isOpen={isAddNoteModalOpen}
        onClose={() => setIsAddNoteModalOpen(false)}
        lead={currentLead}
        onSave={(note) => {
          console.log('Adding note:', note, 'to lead:', currentLead?.code);
          alert(`Đã thêm ghi chú cho lead ${currentLead?.code}`);
        }}
      />
      <UpdateSLAModal
        isOpen={isUpdateSLAModalOpen}
        onClose={() => setIsUpdateSLAModalOpen(false)}
        lead={currentLead}
        onSave={(deadline, reason) => {
          console.log('Updating SLA:', { deadline, reason }, 'for lead:', currentLead?.code);
          alert(`Đã cập nhật thời hạn cho lead ${currentLead?.code}`);
        }}
      />
      <RejectLeadModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        lead={currentLead}
        onSave={(reason) => {
          console.log('Rejecting lead:', { reason }, 'for lead:', currentLead?.code);
          alert(`Đã từ chối lead ${currentLead?.code}`);
        }}
      />
    </div>
  );
}