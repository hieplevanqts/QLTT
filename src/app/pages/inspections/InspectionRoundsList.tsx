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
import PageHeader from '@/layouts/PageHeader';
import EmptyState from '@/ui-kit/EmptyState';
import DataTable, { Column } from '@/ui-kit/DataTable';
import { SearchInput } from '@/ui-kit/SearchInput';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import SummaryCard from '@/patterns/SummaryCard';
import ModernSummaryCard from '@/patterns/ModernSummaryCard';
import BulkActionBar, { BulkAction } from '@/patterns/BulkActionBar';
import FilterActionBar from '@/patterns/FilterActionBar';
import ActionColumn, { Action } from '@/patterns/ActionColumn';
import TableFooter from '@/ui-kit/TableFooter';
import { InspectionRoundStatusBadge } from '@/app/components/inspections/InspectionRoundStatusBadge';
import { type InspectionRound } from '@/app/data/inspection-rounds-mock-data';
import { useInspectionRounds } from '@/contexts/InspectionRoundsContext';
import styles from './InspectionRoundsList.module.css';
import AdvancedFilterModal, { FilterConfig } from '@/ui-kit/AdvancedFilterModal';
import DateRangePicker, { DateRange } from '@/ui-kit/DateRangePicker';
import { 
  SendForApprovalModal,
  StartInspectionModal,
  CompleteInspectionModal,
  CompleteRoundModal,
  CancelRoundModal,
  DeleteRoundModal,
  RejectRoundModal
} from '@/app/components/inspections/InspectionRoundActionModals';
import { CreateSessionDialog } from '@/app/components/inspections/CreateSessionDialog';
import { exportToCSV, formatDateForExport, type ExportColumn } from '@/utils/exportToExcel';

export function InspectionRoundsList() {
  const navigate = useNavigate();
  const { rounds: mockInspectionRounds, deleteRound, updateRound } = useInspectionRounds();
  
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
    type: 'sendApproval' | 'startInspection' | 'completeInspection' | 'completeRound' | 'cancel' | 'delete' | 'reject' | null;
    round: InspectionRound | null;
  }>({ type: null, round: null });

  // Advanced Filter Modal state
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  
  // Create Session Dialog state
  const [createSessionDialog, setCreateSessionDialog] = useState<{
    open: boolean;
    roundId: string;
    roundName: string;
  }>({ open: false, roundId: '', roundName: '' });

  const closeModal = () => setModalState({ type: null, round: null });
  const openModal = (type: typeof modalState.type, round: InspectionRound) => setModalState({ type, round });

  // Calculate stats
  const stats = useMemo(() => {
    return {
      total: mockInspectionRounds.length,
      draft: mockInspectionRounds.filter(r => r.status === 'draft').length,
      pendingApproval: mockInspectionRounds.filter(r => r.status === 'pending_approval').length,
      approved: mockInspectionRounds.filter(r => r.status === 'approved').length,
      rejected: mockInspectionRounds.filter(r => r.status === 'rejected').length,
      active: mockInspectionRounds.filter(r => r.status === 'active').length,
      paused: mockInspectionRounds.filter(r => r.status === 'paused').length,
      inProgress: mockInspectionRounds.filter(r => r.status === 'in_progress').length,
      completed: mockInspectionRounds.filter(r => r.status === 'completed').length,
      cancelled: mockInspectionRounds.filter(r => r.status === 'cancelled').length,
    };
  }, [mockInspectionRounds]);

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
  }, [mockInspectionRounds, searchValue, typeFilter, planFilter, activeFilter, dateRange]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize]);

  // Get actions for each round
  const getRoundActions = (round: InspectionRound): Action[] => {
    const actions: Action[] = [];

    switch (round.status) {
      case 'draft':
        // Nháp: Xem, Chỉnh sửa, Gửi duyệt, Xóa
        actions.push(
          {
            label: 'Xem chi tiết',
            icon: <Eye size={16} />,
            onClick: () => navigate(`/plans/inspection-rounds/${encodeURIComponent(round.id)}`),
            priority: 11,
          },
          {
            label: 'Chỉnh sửa',
            icon: <Edit size={16} />,
            onClick: () => {
              navigate(`/plans/inspection-rounds/create-new?mode=edit&id=${encodeURIComponent(round.id)}`);
            },
            priority: 10,
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

      case 'pending_approval':
        // Chờ duyệt: Xem, Chỉnh sửa, Phê duyệt, Từ chối (đã bỏ Hủy đợt kiểm tra)
        actions.push(
          {
            label: 'Xem chi tiết',
            icon: <Eye size={16} />,
            onClick: () => navigate(`/plans/inspection-rounds/${encodeURIComponent(round.id)}`),
            priority: 11,
          },
          {
            label: 'Chỉnh sửa',
            icon: <Edit size={16} />,
            onClick: () => {
              navigate(`/plans/inspection-rounds/create-new?mode=edit&id=${encodeURIComponent(round.id)}`);
            },
            priority: 10,
          },
          {
            label: 'Phê duyệt',
            icon: <CheckCircle2 size={16} />,
            onClick: () => openModal('startInspection', round),
            priority: 9,
          },
          {
            label: 'Từ chối',
            icon: <XCircle size={16} />,
            onClick: () => openModal('reject', round),
            variant: 'destructive' as const,
            separator: true,
            priority: 8,
          }
        );
        break;

      case 'approved':
        // Đã duyệt: Xem, Chỉnh sửa, Tạo phiên làm việc, Bắt đầu kiểm tra, Hủy
        actions.push(
          {
            label: 'Xem chi tiết',
            icon: <Eye size={16} />,
            onClick: () => navigate(`/plans/inspection-rounds/${encodeURIComponent(round.id)}`),
            priority: 11,
          },
          {
            label: 'Chỉnh sửa',
            icon: <Edit size={16} />,
            onClick: () => {
              navigate(`/plans/inspection-rounds/create-new?mode=edit&id=${encodeURIComponent(round.id)}`);
            },
            priority: 10,
          },
          {
            label: 'Tạo phiên làm việc',
            icon: <Calendar size={16} />,
            onClick: () => {
              setCreateSessionDialog({
                open: true,
                roundId: round.id,
                roundName: round.name,
              });
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
        // Đang kiểm tra: Xem, Chỉnh sửa, Tạo phiên làm việc, Hoàn thành
        actions.push(
          {
            label: 'Xem chi tiết',
            icon: <Eye size={16} />,
            onClick: () => navigate(`/plans/inspection-rounds/${encodeURIComponent(round.id)}`),
            priority: 11,
          },
          {
            label: 'Chỉnh sửa',
            icon: <Edit size={16} />,
            onClick: () => {
              navigate(`/plans/inspection-rounds/create-new?mode=edit&id=${encodeURIComponent(round.id)}`);
            },
            priority: 10,
          },
          {
            label: 'Tạo phiên làm việc',
            icon: <Calendar size={16} />,
            onClick: () => {
              setCreateSessionDialog({
                open: true,
                roundId: round.id,
                roundName: round.name,
              });
            },
            priority: 9,
          },
          {
            label: 'Hoàn thành',
            icon: <CheckCircle2 size={16} />,
            onClick: () => openModal('completeInspection', round),
            priority: 7,
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

      case 'completed':
        // Hoàn thành: Xem chi tiết, Thống kê
        actions.push(
          {
            label: 'Xem chi tiết',
            icon: <Eye size={16} />,
            onClick: () => navigate(`/plans/inspection-rounds/${encodeURIComponent(round.id)}`),
            priority: 11,
          },
          {
            label: 'Thống kê',
            icon: <BarChart3 size={16} />,
            onClick: () => navigate(`/plans/inspection-rounds/${encodeURIComponent(round.id)}/statistics`),
            priority: 8,
          }
        );
        break;

      case 'rejected':
        // Từ chối duyệt: Xem, Chỉnh sửa, Gửi lại
        actions.push(
          {
            label: 'Xem chi tiết',
            icon: <Eye size={16} />,
            onClick: () => navigate(`/plans/inspection-rounds/${encodeURIComponent(round.id)}`),
            priority: 11,
          },
          {
            label: 'Chỉnh sửa',
            icon: <Edit size={16} />,
            onClick: () => {
              navigate(`/plans/inspection-rounds/create-new?mode=edit&id=${encodeURIComponent(round.id)}`);
            },
            priority: 10,
          },
          {
            label: 'Gửi lại duyệt',
            icon: <Send size={16} />,
            onClick: () => openModal('sendApproval', round),
            priority: 9,
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

      case 'cancelled':
        // Đã hủy: Xem chi tiết
        actions.push(
          {
            label: 'Xem chi tiết',
            icon: <Eye size={16} />,
            onClick: () => navigate(`/plans/inspection-rounds/${encodeURIComponent(round.id)}`),
            priority: 11,
          },
          {
            label: 'Xóa',
            icon: <Trash2 size={16} />,
            onClick: () => openModal('delete', round),
            variant: 'destructive' as const,
            priority: 1,
          }
        );
        break;

      default:
        actions.push(
          {
            label: 'Xem chi tiết',
            icon: <Eye size={16} />,
            onClick: () => navigate(`/plans/inspection-rounds/${encodeURIComponent(round.id)}`),
            priority: 11,
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
    toast.success('Đã áp dụng bộ lọc');
  };

  // Handle clear filters
  const handleClearFilters = () => {
    // AdvancedFilterModal handles local state clearing
  };

  // Handle export to Excel (for exporting all filtered data)
  const handleExportToExcel = () => {
    try {
      // Get status label
      const getStatusLabel = (status: string): string => {
        const statusMap: Record<string, string> = {
          draft: 'Nháp',
          pending_approval: 'Chờ duyệt',
          approved: 'Đã duyệt',
          in_progress: 'Đang kiểm tra',
          completed: 'Hoàn thành',
          rejected: 'Từ chối duyệt',
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

  // Bulk actions - dynamically generated based on selected rounds' statuses
  const bulkActions: BulkAction[] = useMemo(() => {
    if (selectedRows.size === 0) return [];

    // Get selected rounds
    const selectedRounds = filteredData.filter(r => selectedRows.has(r.id));
    const selectedStatuses = new Set(selectedRounds.map(r => r.status));

    const actions: BulkAction[] = [];

    // "Gửi duyệt" - Only if ALL selected rounds are draft or rejected
    const canSendApproval = selectedRounds.every(r => r.status === 'draft' || r.status === 'rejected');
    if (canSendApproval && selectedRounds.length > 0) {
      actions.push({
        label: 'Gửi duyệt',
        onClick: () => {
          selectedRounds.forEach(round => {
            updateRound(round.id, { status: 'pending_approval' });
          });
          toast.success(`Đã gửi ${selectedRows.size} đợt kiểm tra đi phê duyệt`);
          setSelectedRows(new Set());
        },
        icon: <Send size={16} />,
      });
    }

    // "Phê duyệt" - Only if ALL selected rounds are pending_approval
    const canApprove = selectedRounds.every(r => r.status === 'pending_approval');
    if (canApprove && selectedRounds.length > 0) {
      actions.push({
        label: 'Phê duyệt',
        onClick: () => {
          selectedRounds.forEach(round => {
            updateRound(round.id, { status: 'approved' });
          });
          toast.success(`Đã phê duyệt ${selectedRows.size} đợt kiểm tra`);
          setSelectedRows(new Set());
        },
        icon: <CheckCircle2 size={16} />,
      });
    }

    // "Bắt đầu kiểm tra" - Only if ALL selected rounds are approved
    const canStart = selectedRounds.every(r => r.status === 'approved');
    if (canStart && selectedRounds.length > 0) {
      actions.push({
        label: 'Bắt đầu kiểm tra',
        onClick: () => {
          selectedRounds.forEach(round => {
            updateRound(round.id, { status: 'in_progress' });
          });
          toast.success(`Đã bắt đầu ${selectedRows.size} đợt kiểm tra`);
          setSelectedRows(new Set());
        },
        icon: <PlayCircle size={16} />,
      });
    }

    // "Hoàn thành" - Only if ALL selected rounds are in_progress
    const canComplete = selectedRounds.every(r => r.status === 'in_progress');
    if (canComplete && selectedRounds.length > 0) {
      actions.push({
        label: 'Hoàn thành',
        onClick: () => {
          selectedRounds.forEach(round => {
            updateRound(round.id, { status: 'completed' });
          });
          toast.success(`Đã hoàn thành ${selectedRows.size} đợt kiểm tra`);
          setSelectedRows(new Set());
        },
        icon: <CheckCircle2 size={16} />,
      });
    }

    // "Hủy đợt kiểm tra" - Only if ALL selected rounds are approved or in_progress (removed pending_approval)
    const canCancel = selectedRounds.every(r => 
      r.status === 'approved' || 
      r.status === 'in_progress'
    );
    if (canCancel && selectedRounds.length > 0) {
      actions.push({
        label: 'Hủy đợt kiểm tra',
        onClick: () => {
          selectedRounds.forEach(round => {
            updateRound(round.id, { status: 'cancelled' });
          });
          toast.warning(`Đã hủy ${selectedRows.size} đợt kiểm tra`);
          setSelectedRows(new Set());
        },
        variant: 'destructive',
        icon: <XCircle size={16} />,
      });
    }

    // "Xuất dữ liệu" - Always available
    actions.push({
      label: 'Xuất dữ liệu',
      onClick: () => {
        try {
          // Get status label
          const getStatusLabel = (status: string): string => {
            const statusMap: Record<string, string> = {
              draft: 'Nháp',
              pending_approval: 'Chờ duyệt',
              approved: 'Đã duyệt',
              in_progress: 'Đang kiểm tra',
              completed: 'Hoàn thành',
              rejected: 'Từ chối duyệt',
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

          // Export only selected rows
          exportToCSV(selectedRounds, exportColumns, {
            filename: 'Danh_sach_dot_kiem_tra_da_chon',
          });

          toast.success(`Đã xuất ${selectedRounds.length} đợt kiểm tra ra Excel`);
        } catch (error) {
          console.error('Export error:', error);
          toast.error('Có lỗi khi xuất dữ liệu. Vui lòng thử lại.');
        }
      },
      variant: 'secondary',
      icon: <Download size={16} />,
    });

    // "Xóa" - Only if ALL selected rounds are draft, cancelled, or rejected
    const canDelete = selectedRounds.every(r => 
      r.status === 'draft' || 
      r.status === 'cancelled' || 
      r.status === 'rejected'
    );
    if (canDelete && selectedRounds.length > 0) {
      actions.push({
        label: 'Xóa',
        onClick: () => {
          selectedRounds.forEach(round => {
            deleteRound(round.id);
          });
          toast.success(`Đã xóa ${selectedRows.size} đợt kiểm tra`);
          setSelectedRows(new Set());
        },
        variant: 'destructive',
        icon: <Trash2 size={16} />,
      });
    }

    return actions;
  }, [selectedRows, filteredData, updateRound, deleteRound]);

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
            label="Chờ duyệt"
            value={stats.pendingApproval.toString()}
            icon={Clock}
            variant="warning"
            active={activeFilter === 'pending_approval'}
            onClick={() => setActiveFilter('pending_approval')}
          />
          <ModernSummaryCard
            label="Đã duyệt"
            value={stats.approved.toString()}
            icon={CheckCircle2}
            variant="info"
            active={activeFilter === 'approved'}
            onClick={() => setActiveFilter('approved')}
          />
          <ModernSummaryCard
            label="Đang triển khai"
            value={stats.active.toString()}
            icon={PlayCircle}
            variant="info"
            active={activeFilter === 'active'}
            onClick={() => setActiveFilter('active')}
          />
          <ModernSummaryCard
            label="Tạm dừng"
            value={stats.paused.toString()}
            icon={PauseCircle}
            variant="warning"
            active={activeFilter === 'paused'}
            onClick={() => setActiveFilter('paused')}
          />
          <ModernSummaryCard
            label="Đang kiểm tra"
            value={stats.inProgress.toString()}
            icon={PlayCircle}
            variant="info"
            active={activeFilter === 'in_progress'}
            onClick={() => setActiveFilter('in_progress')}
          />
          {/* Hidden: Hoàn thành and Từ chối cards as per user request */}
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
          onClear={() => setSelectedRows(new Set())}
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
          if (modalState.round) {
            updateRound(modalState.round.id, { status: 'pending_approval' });
            toast.success('Đã gửi đợt kiểm tra đi phê duyệt');
            console.log('Send for approval with note:', note);
          }
          closeModal();
        }}
      />
      <StartInspectionModal
        isOpen={modalState.type === 'startInspection'}
        round={modalState.round}
        onClose={closeModal}
        onConfirm={(note) => {
          if (modalState.round) {
            // Depending on current status: pending_approval -> approved, approved -> in_progress
            const newStatus = modalState.round.status === 'pending_approval' ? 'approved' : 'in_progress';
            updateRound(modalState.round.id, { status: newStatus });
            const statusLabel = newStatus === 'approved' ? 'Đã duyệt' : 'Đang kiểm tra';
            toast.success(`Đã chuyển sang trạng thái ${statusLabel}`);
            console.log('Start inspection with note:', note);
          }
          closeModal();
        }}
      />
      <CompleteInspectionModal
        isOpen={modalState.type === 'completeInspection'}
        round={modalState.round}
        onClose={closeModal}
        onConfirm={(summary) => {
          if (modalState.round) {
            updateRound(modalState.round.id, { status: 'completed' });
            toast.success('Đã chuyển sang trạng thái Hoàn thành');
            console.log('Complete inspection with summary:', summary);
          }
          closeModal();
        }}
      />
      <CompleteRoundModal
        isOpen={modalState.type === 'completeRound'}
        round={modalState.round}
        onClose={closeModal}
        onConfirm={() => {
          if (modalState.round) {
            updateRound(modalState.round.id, { status: 'completed' });
            toast.success('Đã hoàn thành đợt kiểm tra');
            console.log('Complete round');
          }
          closeModal();
        }}
      />
      <CancelRoundModal
        isOpen={modalState.type === 'cancel'}
        round={modalState.round}
        onClose={closeModal}
        onConfirm={(reason) => {
          if (modalState.round) {
            updateRound(modalState.round.id, { status: 'cancelled' });
            toast.warning('Đã hủy đợt kiểm tra');
            console.log('Cancel round with reason:', reason);
          }
          closeModal();
        }}
      />
      <DeleteRoundModal
        isOpen={modalState.type === 'delete'}
        round={modalState.round}
        onClose={closeModal}
        onConfirm={() => {
          if (modalState.round) {
            deleteRound(modalState.round.id);
            toast.success('Đã xóa đợt kiểm tra');
            console.log('Delete round');
          }
          closeModal();
        }}
      />
      <RejectRoundModal
        isOpen={modalState.type === 'reject'}
        round={modalState.round}
        onClose={closeModal}
        onConfirm={(reason) => {
          if (modalState.round) {
            updateRound(modalState.round.id, { status: 'rejected' });
            toast.warning('Đã từ chối phê duyệt đợt kiểm tra');
            console.log('Reject round with reason:', reason);
          }
          closeModal();
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

      {/* Create Session Dialog */}
      <CreateSessionDialog
        open={createSessionDialog.open}
        onOpenChange={(open) => setCreateSessionDialog({ ...createSessionDialog, open })}
        roundId={createSessionDialog.roundId}
        roundName={createSessionDialog.roundName}
        onCreateSession={(sessionData) => {
          console.log('Created session:', sessionData);
          // Handle session creation here - could update context or make API call
        }}
      />
    </div>
  );
}