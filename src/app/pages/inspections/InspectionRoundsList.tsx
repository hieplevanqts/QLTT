import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Download, 
  RefreshCw, 
  ClipboardCheck, 
  FileEdit,
  Clock,
  PlayCircle,
  FileText,
  CheckCircle2,
  XCircle,
  Eye,
  Edit,
  Users,
  BarChart3,
  Send,
  Trash2,
  PauseCircle,
  Calendar,
  Filter
} from 'lucide-react';
import { toast } from 'sonner';
import PageHeader from '../../../layouts/PageHeader';
import EmptyState from '../../../ui-kit/EmptyState';
import DataTable, { Column } from '../../../ui-kit/DataTable';
import { SearchInput } from '../../../ui-kit/SearchInput';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import SummaryCard from '../../../patterns/SummaryCard';
import ModernSummaryCard from '../../../patterns/ModernSummaryCard';
import BulkActionBar, { BulkAction } from '../../../patterns/BulkActionBar';
import FilterActionBar from '../../../patterns/FilterActionBar';
import ActionColumn, { Action } from '../../../patterns/ActionColumn';
import TableFooter from '../../../ui-kit/TableFooter';
import { InspectionRoundStatusBadge } from '../../components/inspections/InspectionRoundStatusBadge';
import { mockInspectionRounds, type InspectionRound } from '../../data/inspection-rounds-mock-data';
import styles from './InspectionRoundsList.module.css';
import AdvancedFilterModal, { FilterConfig } from '../../../ui-kit/AdvancedFilterModal';
import DateRangePicker, { DateRange } from '../../../ui-kit/DateRangePicker';
import {
  SendForApprovalModal,
  StartInspectionModal,
  CompleteInspectionModal,
  CompleteRoundModal,
  CancelRoundModal,
  DeleteRoundModal
} from '../../components/inspections/InspectionRoundActionModals';
import { exportToCSV, formatDateForExport, type ExportColumn } from '../../../utils/exportToExcel';
import { InspectionRoundDocumentDrawer } from '../../components/documents/InspectionRoundDocumentDrawer';
import { SelectFromInsModal, type InsDocument } from '../../components/documents/SelectFromInsModal';
import { InsSyncLogDrawer } from '../../components/documents/InsSyncLogDrawer';
import { useDocumentChecklist } from '../../../hooks/useDocumentChecklist';
import type { DocumentCode } from '../../../types/ins-documents';

export function InspectionRoundsList() {
  const navigate = useNavigate();
  
  // State management
  const [searchValue, setSearchValue] = useState('');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  
  // Filter states
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<DateRange>({ startDate: null, endDate: null });
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Modal states
  const [modalState, setModalState] = useState<{
    type: 'sendApproval' | 'startInspection' | 'completeInspection' | 'completeRound' | 'cancel' | 'delete' | null;
    round: InspectionRound | null;
  }>({ type: null, round: null });

  // Advanced Filter Modal state
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Document management states
  const [documentDrawerOpen, setDocumentDrawerOpen] = useState(false);
  const [documentDrawerRound, setDocumentDrawerRound] = useState<InspectionRound | null>(null);
  const [highlightMissingDocs, setHighlightMissingDocs] = useState(false);
  const [showSelectInsModal, setShowSelectInsModal] = useState(false);
  const [showSyncLogDrawer, setShowSyncLogDrawer] = useState(false);
  const [selectedDocumentCode, setSelectedDocumentCode] = useState<DocumentCode>('M01');

  const closeModal = () => setModalState({ type: null, round: null });
  const openModal = (type: typeof modalState.type, round: InspectionRound) => setModalState({ type, round });

  // Calculate stats
  const stats = useMemo(() => {
    return {
      total: mockInspectionRounds.length,
      draft: mockInspectionRounds.filter(r => r.status === 'draft').length,
      preparing: mockInspectionRounds.filter(r => r.status === 'preparing').length,
      inProgress: mockInspectionRounds.filter(r => r.status === 'in_progress').length,
      reporting: mockInspectionRounds.filter(r => r.status === 'reporting').length,
      completed: mockInspectionRounds.filter(r => r.status === 'completed').length,
    };
  }, []);

  // Apply filters
  const filteredData = useMemo(() => {
    return mockInspectionRounds.filter(round => {
      const matchesSearch = round.name.toLowerCase().includes(searchValue.toLowerCase()) ||
                           round.code.toLowerCase().includes(searchValue.toLowerCase()) ||
                           round.leadUnit.toLowerCase().includes(searchValue.toLowerCase());
      const matchesType = typeFilter === 'all' || round.type === typeFilter;
      const matchesPlan = planFilter === 'all' || 
                         (planFilter === 'with_plan' && round.planId) ||
                         (planFilter === 'no_plan' && !round.planId);
      const matchesActiveFilter = activeFilter === null || round.status === activeFilter;
      
      // Date range filter
      let matchesDateRange = true;
      if (dateRange.startDate && dateRange.endDate) {
        const filterStart = new Date(dateRange.startDate);
        const filterEnd = new Date(dateRange.endDate);
        const roundStart = new Date(round.startDate);
        const roundEnd = new Date(round.endDate);
        
        // Check if round overlaps with filter range
        matchesDateRange = roundStart <= filterEnd && roundEnd >= filterStart;
      }
      
      return matchesSearch && matchesType && matchesPlan && matchesActiveFilter && matchesDateRange;
    });
  }, [searchValue, typeFilter, planFilter, activeFilter, dateRange]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize]);

  // Get actions for each round
  const getRoundActions = (round: InspectionRound): Action[] => {
    const actions: Action[] = [];

    // ⭐ ALWAYS ADD: Hồ sơ biểu mẫu (first in all cases)
    actions.push({
      label: 'Hồ sơ biểu mẫu',
      icon: <FileText size={16} />,
      onClick: () => {
        setDocumentDrawerRound(round);
        setHighlightMissingDocs(false);
        setDocumentDrawerOpen(true);
      },
      priority: 11, // Highest priority to show first
    });

    switch (round.status) {
      case 'draft':
        // Nháp: Chỉnh sửa, Phân công lực lượng, Gửi duyệt, Xóa
        actions.push(
          {
            label: 'Chỉnh sửa',
            icon: <Edit size={16} />,
            onClick: () => {
              toast.info('Mở form chnh sửa đợt kiểm tra');
              console.log('Edit round', round.id);
            },
            priority: 10,
          },
          {
            label: 'Phân công lực lượng',
            icon: <Users size={16} />,
            onClick: () => {
              toast.info('Mở trang phân công lực lượng kiểm tra');
              console.log('Assign team', round.id);
            },
            priority: 9,
          },
          {
            label: 'Gửi duyệt',
            icon: <Send size={16} />,
            onClick: () => openModal('sendApproval', round),
            priority: 8,
          },
          {
            label: 'Xóa',
            icon: <Trash2 size={16} />,
            onClick: () => openModal('delete', round),
            variant: 'destructive' as const,
            separator: true,
            priority: 1,
          }
        );
        break;

      case 'preparing':
        // Chuẩn bị: Xem chi tiết, Phân công, Bắt đầu kiểm tra, Hủy
        actions.push(
          {
            label: 'Xem chi tiết',
            icon: <Eye size={16} />,
            onClick: () => navigate(`/plans/inspection-rounds/${encodeURIComponent(round.id)}`),
            priority: 10,
          },
          {
            label: 'Phân công lực lượng',
            icon: <Users size={16} />,
            onClick: () => {
              toast.info('Mở trang phân công lực lượng kiểm tra');
              console.log('Assign team', round.id);
            },
            priority: 9,
          },
          {
            label: 'Bắt đầu kiểm tra',
            icon: <PlayCircle size={16} />,
            onClick: () => openModal('startInspection', round),
            priority: 8,
          },
          {
            label: 'Hủy đợt kiểm tra',
            icon: <XCircle size={16} />,
            onClick: () => openModal('cancel', round),
            variant: 'destructive' as const,
            separator: true,
            priority: 2,
          }
        );
        break;

      case 'in_progress':
        // Đang kiểm tra: Xem chi tiết, Nhiệm vụ, Hoàn thành
        actions.push(
          {
            label: 'Xem chi tiết',
            icon: <Eye size={16} />,
            onClick: () => navigate(`/plans/inspection-rounds/${encodeURIComponent(round.id)}`),
            priority: 10,
          },
          {
            label: 'Nhiệm vụ',
            icon: <Calendar size={16} />,
            onClick: () => navigate(`/plans/inspection-session?inspectionRound=${encodeURIComponent(round.id)}`),
            priority: 9,
          },
          {
            label: 'Hoàn thành kiểm tra',
            icon: <CheckCircle2 size={16} />,
            onClick: () => openModal('completeInspection', round),
            priority: 6,
          }
        );
        break;

      case 'reporting':
        // Hoàn thành báo cáo: Xem chi tiết, Chỉnh sửa báo cáo, Hoàn thành
        actions.push(
          {
            label: 'Xem chi tiết',
            icon: <Eye size={16} />,
            onClick: () => navigate(`/plans/inspection-rounds/${encodeURIComponent(round.id)}`),
            priority: 10,
          },
          {
            label: 'Chỉnh sửa báo cáo',
            icon: <FileText size={16} />,
            onClick: () => {
              toast.info('Mở form chỉnh sửa báo cáo');
              console.log('Edit report', round.id);
            },
            priority: 8,
          },
          {
            label: 'Hoàn thành',
            icon: <CheckCircle2 size={16} />,
            onClick: () => openModal('completeRound', round),
            priority: 7,
          }
        );
        break;

      case 'completed':
        // Hoàn thành: Xem chi tit, Tải báo cáo
        actions.push(
          {
            label: 'Xem chi tiết',
            icon: <Eye size={16} />,
            onClick: () => navigate(`/plans/inspection-rounds/${encodeURIComponent(round.id)}`),
            priority: 10,
          },
          {
            label: 'Tải báo cáo',
            icon: <Download size={16} />,
            onClick: () => {
              toast.success('Đang tải báo cáo...');
              console.log('Download report', round.id);
            },
            priority: 8,
          }
        );
        break;

      case 'cancelled':
        // Đã hủy: Xem chi tiết
        actions.push(
          {
            label: 'Xem chi tiết',
            icon: <Eye size={16} />,
            onClick: () => navigate(`/plans/inspection-rounds/${encodeURIComponent(round.id)}`),
            priority: 10,
          }
        );
        break;

      default:
        actions.push(
          {
            label: 'Xem chi tiết',
            icon: <Eye size={16} />,
            onClick: () => navigate(`/plans/inspection-rounds/${encodeURIComponent(round.id)}`),
            priority: 10,
          }
        );
    }

    return actions;
  };

  // Define table columns
  const columns: Column<InspectionRound>[] = [
    {
      key: 'code',
      label: 'Mã đợt',
      sortable: true,
      render: (round) => (
        <div>
          <div className={styles.roundCodeBadgeRow}>
            <InspectionRoundStatusBadge type="inspectionType" value={round.type} size="sm" />
          </div>
          <div className={styles.roundCode}>{round.code}</div>
        </div>
      ),
    },
    {
      key: 'name',
      label: 'Tên đợt kiểm tra',
      sortable: true,
      render: (round) => (
        <div>
          <div className={styles.roundName}>{round.name}</div>
          {round.planName && (
            <div className={styles.roundPlan}>KH: {round.planName}</div>
          )}
        </div>
      ),
    },
    {
      key: 'time',
      label: 'Thời gian',
      sortable: true,
      render: (round) => {
        const startDate = new Date(round.startDate);
        const endDate = new Date(round.endDate);
        return (
          <span className={styles.timeRange}>
            {startDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
            {' - '}
            {endDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
          </span>
        );
      },
    },
    {
      key: 'leadUnit',
      label: 'Đơn vị chủ trì',
      sortable: true,
      render: (round) => (
        <span className={styles.leadUnit}>{round.leadUnit}</span>
      ),
    },
    {
      key: 'team',
      label: 'Lực lượng',
      sortable: true,
      render: (round) => (
        <span className={styles.teamSize}>
          {round.teamSize > 0 ? `${round.teamSize} người` : 'Chưa phân công'}
        </span>
      ),
    },
    {
      key: 'targets',
      label: 'Số cơ sở',
      sortable: true,
      render: (round) => (
        <div className={styles.targetsInfo}>
          <div className={styles.targetsCount}>
            {round.inspectedTargets}/{round.totalTargets}
          </div>
          {round.totalTargets > 0 && (
            <div className={styles.targetsProgress}>
              {Math.round((round.inspectedTargets / round.totalTargets) * 100)}%
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Trạng thái',
      render: (round) => <InspectionRoundStatusBadge type="round" value={round.status} size="sm" />,
    },
    {
      key: 'creator',
      label: 'Người tạo',
      sortable: true,
      render: (round) => <span className={styles.creator}>{round.createdBy}</span>,
    },
    {
      key: 'actions',
      label: 'Thao tác',
      sticky: 'right',
      render: (round) => (
        <ActionColumn actions={getRoundActions(round)} />
      ),
    },
  ];

  // Handle row selection
  const handleSelectRow = (id: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedRows(new Set(paginatedData.map(r => r.id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [typeFilter, planFilter, searchValue, activeFilter]);

  // Advanced Filter configuration
  const filterConfigs: FilterConfig[] = [
    {
      key: 'type',
      label: 'Loại đợt kiểm tra',
      type: 'select',
      options: [
        { value: 'all', label: 'Tất cả loại' },
        { value: 'routine', label: 'Định kỳ' },
        { value: 'targeted', label: 'Chuyên đề' },
        { value: 'sudden', label: 'Đột xuất' },
        { value: 'followup', label: 'Tái kiểm tra' },
      ],
    },
    {
      key: 'plan',
      label: 'Kế hoạch',
      type: 'select',
      options: [
        { value: 'all', label: 'Tất cả' },
        { value: 'with_plan', label: 'Thuộc kế hoạch' },
        { value: 'no_plan', label: 'Không thuộc KH' },
      ],
    },
    {
      key: 'dateRange',
      label: 'Thời gian kiểm tra',
      type: 'daterange',
    },
  ];

  const filterValues = {
    type: typeFilter,
    plan: planFilter,
    dateRange: dateRange,
  };

  // Handle filter change
  const handleFilterChange = (values: Record<string, any>) => {
    setTypeFilter(values.type || 'all');
    setPlanFilter(values.plan || 'all');
    setDateRange(values.dateRange || { startDate: null, endDate: null });
  };

  // Handle apply filters
  const handleApplyFilters = () => {
    setIsFilterModalOpen(false);
    toast.success('Đã áp d���ng bộ lọc');
  };

  // Handle clear filters
  const handleClearFilters = () => {
    // AdvancedFilterModal handles local state clearing
  };

  // Export to Excel function
  const handleExportToExcel = () => {
    try {
      // Get status label
      const getStatusLabel = (status: string): string => {
        const statusMap: Record<string, string> = {
          draft: 'Nháp',
          preparing: 'Chuẩn bị',
          in_progress: 'Đang kiểm tra',
          reporting: 'Hoàn thành báo cáo',
          completed: 'Hoàn thành',
          cancelled: 'Đã hủy',
        };
        return statusMap[status] || status;
      };

      // Get type label
      const getTypeLabel = (type: string): string => {
        const typeMap: Record<string, string> = {
          routine: 'Định kỳ',
          targeted: 'Chuyên đề',
          sudden: 'Đột xuất',
          followup: 'Tái kiểm tra',
        };
        return typeMap[type] || type;
      };

      // Define export columns
      const exportColumns: ExportColumn<InspectionRound>[] = [
        { key: 'code', label: 'Mã đợt' },
        { key: 'name', label: 'Tên đợt kiểm tra' },
        { 
          key: 'type', 
          label: 'Loại đợt',
          format: (value) => getTypeLabel(value)
        },
        { key: 'planName', label: 'Kế hoạch' },
        { 
          key: 'startDate', 
          label: 'Ngày bắt đầu',
          format: (value) => formatDateForExport(value)
        },
        { 
          key: 'endDate', 
          label: 'Ngày kết thúc',
          format: (value) => formatDateForExport(value)
        },
        { key: 'leadUnit', label: 'Đơn vị chủ trì' },
        { 
          key: 'teamSize', 
          label: 'Lực lượng',
          format: (value) => value > 0 ? `${value} người` : 'Chưa phân công'
        },
        { 
          key: 'totalTargets', 
          label: 'Tổng số cơ sở'
        },
        { 
          key: 'inspectedTargets', 
          label: 'Đã kiểm tra'
        },
        { 
          key: 'status', 
          label: 'Trạng thái',
          format: (value) => getStatusLabel(value)
        },
        { key: 'createdBy', label: 'Người tạo' },
        { 
          key: 'createdAt', 
          label: 'Ngày tạo',
          format: (value) => formatDateForExport(value)
        },
      ];

      // Export filtered data (not paginated, all filtered results)
      exportToCSV(filteredData, exportColumns, {
        filename: 'Danh_sach_dot_kiem_tra',
      });

      toast.success(`Đã xuất ${filteredData.length} đợt kiểm tra ra Excel`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Có lỗi khi xuất dữ liệu. Vui lòng thử lại.');
    }
  };

  // Bulk actions
  const bulkActions: BulkAction[] = [
    {
      label: 'Gửi duyệt',
      onClick: () => {
        toast.success(`Đã gửi ${selectedRows.size} đợt kiểm tra đi phê duyệt`);
        setSelectedRows(new Set());
      },
      icon: <Send size={16} />,
    },
    {
      label: 'Xuất dữ liệu',
      onClick: handleExportToExcel,
      variant: 'secondary',
      icon: <Download size={16} />,
    },
    {
      label: 'Xóa',
      onClick: () => {
        toast.error(`Đã xóa ${selectedRows.size} đợt kiểm tra`);
        setSelectedRows(new Set());
      },
      variant: 'destructive',
      icon: <Trash2 size={16} />,
    },
  ];

  return (
    <div className={styles.pageContainer}>
      <PageHeader
        breadcrumbs={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Đợt kiểm tra' }
        ]}
        title="Quản lý đợt kiểm tra"
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => {
              setSearchValue('');
              setTypeFilter('all');
              setPlanFilter('all');
              setDateRange({ startDate: null, endDate: null });
              setActiveFilter(null);
              toast.success('Đã tải lại dữ liệu');
            }}>
              <RefreshCw size={16} />
              Tải lại
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportToExcel}>
              <Download size={16} />
              Xuất dữ liệu
            </Button>
            <Button size="sm" onClick={() => navigate('/plans/inspection-rounds/create-new')}>
              <Plus size={16} />
              Thêm mới
            </Button>
          </>
        }
      />

      {/* Summary Cards */}
      <div className={styles.summaryContainer}>
        <div className={styles.summaryGrid}>
          <ModernSummaryCard
            label="Tổng số đợt"
            value={stats.total.toString()}
            icon={ClipboardCheck}
            variant="primary"
            active={activeFilter === null}
            onClick={() => setActiveFilter(null)}
          />
          <ModernSummaryCard
            label="Nháp"
            value={stats.draft.toString()}
            icon={FileEdit}
            variant="neutral"
            active={activeFilter === 'draft'}
            onClick={() => setActiveFilter('draft')}
          />
          <ModernSummaryCard
            label="Chuẩn bị"
            value={stats.preparing.toString()}
            icon={Clock}
            variant="warning"
            active={activeFilter === 'preparing'}
            onClick={() => setActiveFilter('preparing')}
          />
          <ModernSummaryCard
            label="Đang kiểm tra"
            value={stats.inProgress.toString()}
            icon={PlayCircle}
            variant="info"
            active={activeFilter === 'in_progress'}
            onClick={() => setActiveFilter('in_progress')}
          />
          <ModernSummaryCard
            label="Hoàn thành"
            value={stats.completed.toString()}
            icon={CheckCircle2}
            variant="success"
            active={activeFilter === 'completed'}
            onClick={() => setActiveFilter('completed')}
          />
        </div>

        {/* QLTT Standard: Filters and Search on SAME ROW */}
        <FilterActionBar
          searchInput={
            <SearchInput
              placeholder="Tìm theo mã, tên đợt hoặc đơn vị"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              style={{ width: '400px' }}
            />
          }
          filters={
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsFilterModalOpen(true)}
            >
              <Filter size={16} />
              Bộ lọc
            </Button>
          }
        />
      </div>

      {/* Bulk Action Bar */}
      {selectedRows.size > 0 && (
        <BulkActionBar
          selectedCount={selectedRows.size}
          actions={bulkActions}
          onClearSelection={() => setSelectedRows(new Set())}
        />
      )}

      {/* Data Table */}
      <div className={styles.tableContainer}>
        <Card>
          <CardContent className={styles.tableCard}>
            {filteredData.length === 0 ? (
              <EmptyState
                icon={ClipboardCheck}
                title="Không tìm thấy đợt kiểm tra"
                description="Không có đợt kiểm tra nào phù hợp với bộ lọc hiện tại"
              />
            ) : (
              <>
                <DataTable
                  columns={columns}
                  data={paginatedData}
                  selectable={true}
                  selectedRows={selectedRows}
                  onSelectRow={handleSelectRow}
                  onSelectAll={handleSelectAll}
                  getRowId={(round) => round.id}
                />
                
                {/* QLTT Standard: Footer with Pagination */}
                <TableFooter
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalRecords={filteredData.length}
                  pageSize={pageSize}
                  onPageChange={setCurrentPage}
                  onPageSizeChange={(size) => {
                    setPageSize(size);
                    setCurrentPage(1);
                  }}
                />
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <SendForApprovalModal
        isOpen={modalState.type === 'sendApproval'}
        round={modalState.round}
        onClose={closeModal}
        onConfirm={(note) => {
          closeModal();
          toast.success('Đã gửi đợt kiểm tra đi phê duyệt');
          console.log('Send for approval with note:', note);
        }}
      />
      <StartInspectionModal
        isOpen={modalState.type === 'startInspection'}
        round={modalState.round}
        onClose={closeModal}
        onConfirm={(note) => {
          closeModal();
          toast.success('Đã chuyển sang trạng thái Đang kiểm tra');
          console.log('Start inspection with note:', note);
        }}
      />
      <CompleteInspectionModal
        isOpen={modalState.type === 'completeInspection'}
        round={modalState.round}
        onClose={closeModal}
        onConfirm={(summary) => {
          closeModal();
          toast.success('Đã chuyển sang trạng thái Hoàn thành báo cáo');
          console.log('Complete inspection with summary:', summary);
        }}
      />
      <CompleteRoundModal
        isOpen={modalState.type === 'completeRound'}
        round={modalState.round}
        onClose={closeModal}
        onConfirm={() => {
          closeModal();
          toast.success('Đã hoàn thành đợt kiểm tra');
          console.log('Complete round');
        }}
      />
      <CancelRoundModal
        isOpen={modalState.type === 'cancel'}
        round={modalState.round}
        onClose={closeModal}
        onConfirm={(reason) => {
          closeModal();
          toast.warning('Đã hủy đợt kiểm tra');
          console.log('Cancel round with reason:', reason);
        }}
      />
      <DeleteRoundModal
        isOpen={modalState.type === 'delete'}
        round={modalState.round}
        onClose={closeModal}
        onConfirm={() => {
          closeModal();
          toast.success('Đã xóa đợt kiểm tra');
          console.log('Delete round');
        }}
      />

      {/* Advanced Filter Modal */}
      <AdvancedFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={filterConfigs}
        values={filterValues}
        onChange={handleFilterChange}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
      />

      {/* Document Management Drawers & Modals */}
      {documentDrawerRound && (
        <>
          <InspectionRoundDocumentDrawer
            open={documentDrawerOpen}
            onOpenChange={setDocumentDrawerOpen}
            round={documentDrawerRound}
            highlightMissingDocs={highlightMissingDocs}
            onImportClick={(code) => {
              setSelectedDocumentCode(code);
              setShowSelectInsModal(true);
            }}
            onViewPdfClick={(code) => {
              toast.info('Xem PDF biểu mẫu (chức năng đang phát triển)');
            }}
            onSyncClick={(code) => {
              toast.success('Đã đồng bộ lại biểu mẫu từ INS');
            }}
            onViewLogClick={() => setShowSyncLogDrawer(true)}
          />

          <SelectFromInsModal
            open={showSelectInsModal}
            onOpenChange={setShowSelectInsModal}
            documentCode={selectedDocumentCode}
            documentName={
              selectedDocumentCode === 'M01'
                ? 'Quyết định kiểm tra việc chấp hành pháp luật'
                : selectedDocumentCode === 'M04'
                ? 'Quyết định phân công công chức thực hiện biện pháp nghiệp vụ'
                : selectedDocumentCode === 'M02'
                ? 'Quyết định sửa đổi, bổ sung Quyết định kiểm tra'
                : 'Quyết định kéo dài/Gia hạn thời hạn thẩm tra'
            }
            onSelect={(doc: InsDocument) => {
              toast.success(`Đã import ${doc.code} từ INS thành công`);
              setShowSelectInsModal(false);
            }}
          />

          <InsSyncLogDrawer
            open={showSyncLogDrawer}
            onOpenChange={setShowSyncLogDrawer}
          />
        </>
      )}
    </div>
  );
}