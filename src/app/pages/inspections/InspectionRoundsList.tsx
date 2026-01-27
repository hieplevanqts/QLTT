import { useState, useMemo, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Download, 
  RefreshCw, 
  ClipboardCheck, 
  FileEdit,
  Clock,
  PlayCircle,
  CheckCircle2,
  XCircle,
  Eye,
  Edit,
  Trash2,
  PauseCircle,
  Calendar,
  Filter,
  Send,
  BarChart3
} from 'lucide-react';
import { toast } from 'sonner';
import PageHeader from '@/layouts/PageHeader';
import EmptyState from '@/ui-kit/EmptyState';
import DataTable, { Column } from '@/ui-kit/DataTable';
import { SearchInput } from '@/ui-kit/SearchInput';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import ModernSummaryCard from '@/patterns/ModernSummaryCard';
import FilterActionBar from '@/patterns/FilterActionBar';
import ActionColumn, { Action } from '@/patterns/ActionColumn';
import TableFooter from '@/ui-kit/TableFooter';
import { StatusBadge } from '@/app/components/common/StatusBadge';
import { useSupabaseInspectionRounds, type InspectionRound } from '@/hooks/useSupabaseInspectionRounds';
import styles from './InspectionRoundsList.module.css';
import AdvancedFilterModal, { FilterConfig } from '@/ui-kit/AdvancedFilterModal';
import { DateRange } from '@/ui-kit/DateRangePicker';

import { 
  SendForApprovalModal,
  StartInspectionModal,
  CompleteInspectionModal,
  CompleteRoundModal,
  CancelRoundModal,
  DeleteRoundModal,
  RejectRoundModal,
  PauseRoundModal,
  ResumeRoundModal,
  DeployRoundModal
} from '@/app/components/inspections/InspectionRoundActionModals';

import { CreateSessionDialog } from '@/app/components/inspections/CreateSessionDialog';
import { exportToCSV, formatDateForExport, type ExportColumn } from '@/utils/exportToExcel';

export function InspectionRoundsList() {
  const navigate = useNavigate();
  const { rounds, loading, error, refetch, updateRoundStatus, deleteRound } = useSupabaseInspectionRounds();
  
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

  // Advanced Filter Modal state
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Modal states
  const [modalState, setModalState] = useState<{
    type: 'sendApproval' | 'startInspection' | 'completeInspection' | 'completeRound' | 'cancel' | 'delete' | 'reject' | 'pause' | 'resume' | 'deploy' | null;
    round: InspectionRound | null;
  }>({ type: null, round: null });
  
  // Create Session Dialog state
  const [createSessionDialog, setCreateSessionDialog] = useState<{
    open: boolean;
    roundId: string;
    roundName: string;
  }>({ open: false, roundId: '', roundName: '' });

  const closeModal = () => setModalState({ type: null, round: null });
  const openModal = (type: typeof modalState.type, round: InspectionRound) => setModalState({ type, round });

  // Modal action handlers
  const handleSendForApproval = async () => {
    if (!modalState.round) return;
    
    try {
      // Update status from 'draft' to 'pending_approval'
      await updateRoundStatus(modalState.round.id, 'pending_approval');
      
      // Close modal first
      closeModal();
      
      // Show success message
      toast.success(`Đã gửi duyệt đợt kiểm tra "${modalState.round.name}"`);
      
      // Refresh data to show updated status
      await refetch();
    } catch (error) {
      console.error('=== SEND FOR APPROVAL ERROR ===');
      console.error('Error details:', error);
      toast.error('Có lỗi xảy ra khi gửi duyệt');
    }
  };

  const handleStartInspection = async () => {
    if (!modalState.round) return;
    
    try {
      const isApproval = modalState.round.status === 'pending_approval';
      
      if (isApproval) {
        // Phê duyệt: Update status from 'pending_approval' to 'approved'
        await updateRoundStatus(modalState.round.id, 'approved');
        closeModal();
        toast.success(`Đã phê duyệt đợt kiểm tra "${modalState.round.name}"`);
        await refetch();
      } else {
        // Bắt đầu kiểm tra: Update status from 'approved' to 'in_progress'
        await updateRoundStatus(modalState.round.id, 'in_progress');
        closeModal();
        toast.success(`Đã bắt đầu kiểm tra "${modalState.round.name}"`);
        await refetch();
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi thực hiện thao tác');
      console.error('Start inspection error:', error);
    }
  };

  const handleCompleteInspection = async () => {
    if (!modalState.round) return;
    
    try {
      // Update status from 'in_progress' to 'completed'
      await updateRoundStatus(modalState.round.id, 'completed');
      closeModal();
      toast.success(`Đã hoàn thành kiểm tra "${modalState.round.name}"`);
      await refetch();
    } catch (error) {
      toast.error('Có lỗi xảy ra khi hoàn thành kiểm tra');
      console.error('Complete inspection error:', error);
    }
  };

  const handleCompleteRound = async () => {
    if (!modalState.round) return;
    
    try {
      // Update status from 'active' to 'completed'
      await updateRoundStatus(modalState.round.id, 'completed');
      closeModal();
      toast.success(`Đã hoàn thành đợt kiểm tra "${modalState.round.name}"`);
      await refetch();
    } catch (error) {
      toast.error('Có lỗi xảy ra khi hoàn thành đợt kiểm tra');
      console.error('Complete round error:', error);
    }
  };

  const handleCancelRound = async () => {
    if (!modalState.round) return;
    
    try {
      await updateRoundStatus(modalState.round.id, 'cancelled');
      closeModal();
      toast.success(`Đã hủy đợt kiểm tra "${modalState.round.name}"`);
      await refetch();
    } catch (error) {
      toast.error('Có lỗi xảy ra khi hủy đợt kiểm tra');
      console.error('Cancel round error:', error);
    }
  };

  const handleDeleteRound = async () => {
    if (!modalState.round) return;
    
    try {
      await deleteRound(modalState.round.id);
      closeModal();
      toast.success(`Đã xóa đợt kiểm tra "${modalState.round.name}"`);
      await refetch();
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xóa đợt kiểm tra');
      console.error('Delete round error:', error);
    }
  };

  const handleRejectRound = async () => {
    if (!modalState.round) return;
    
    try {
      // Update status from 'pending_approval' to 'rejected'
      await updateRoundStatus(modalState.round.id, 'rejected');
      closeModal();
      toast.success(`Đã từ chối duyệt đợt kiểm tra "${modalState.round.name}"`);
      await refetch();
    } catch (error) {
      toast.error('Có lỗi xảy ra khi từ chối duyệt');
      console.error('Reject round error:', error);
    }
  };

  const handlePauseRound = async () => {
    if (!modalState.round) return;
    
    try {
      // Update status from 'in_progress' to 'paused'
      await updateRoundStatus(modalState.round.id, 'paused');
      closeModal();
      toast.success(`Đã tạm dừng đợt kiểm tra "${modalState.round.name}"`);
      await refetch();
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tạm dừng đợt kiểm tra');
      console.error('Pause round error:', error);
    }
  };

  const handleResumeRound = async () => {
    if (!modalState.round) return;
    
    try {
      // Update status from 'paused' to 'in_progress'
      await updateRoundStatus(modalState.round.id, 'in_progress');
      closeModal();
      toast.success(`Đã tiếp tục đợt kiểm tra "${modalState.round.name}"`);
      await refetch();
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tiếp tục đợt kiểm tra');
      console.error('Resume round error:', error);
    }
  };

  const handleDeployRound = async () => {
    if (!modalState.round) return;
    
    try {
      // Update status from 'approved' to 'active'
      await updateRoundStatus(modalState.round.id, 'active');
      closeModal();
      toast.success(`Đã triển khai đợt kiểm tra "${modalState.round.name}"`);
      await refetch();
    } catch (error) {
      toast.error('Có lỗi xảy ra khi triển khai đợt kiểm tra');
      console.error('Deploy round error:', error);
    }
  };

  // Calculate stats
  const stats = useMemo(() => {
    return {
      total: rounds.length,
      draft: rounds.filter((r: InspectionRound) => r.status === 'draft').length,
      pending_approval: rounds.filter((r: InspectionRound) => r.status === 'pending_approval').length,
      approved: rounds.filter((r: InspectionRound) => r.status === 'approved').length,
      active: rounds.filter((r: InspectionRound) => r.status === 'active' || r.status === 'in_progress').length,
      paused: rounds.filter((r: InspectionRound) => r.status === 'paused').length,
      completed: rounds.filter((r: InspectionRound) => r.status === 'completed').length,
      cancelled: rounds.filter((r: InspectionRound) => r.status === 'cancelled').length,
    };
  }, [rounds]);

  // Apply filters
  const filteredData = useMemo(() => {
    return rounds.filter((round: InspectionRound) => {
      const matchesSearch = round.name.toLowerCase().includes(searchValue.toLowerCase()) ||
                           round.code.toLowerCase().includes(searchValue.toLowerCase()) ||
                           round.leadUnit.toLowerCase().includes(searchValue.toLowerCase());
      const matchesType = typeFilter === 'all' || round.type === typeFilter;
      const matchesPlan = planFilter === 'all' || 
                         (planFilter === 'with_plan' && round.planId) ||
                         (planFilter === 'no_plan' && !round.planId);
      const matchesActiveFilter = activeFilter === null || 
                                 (activeFilter === 'active' 
                                   ? (round.status === 'active' || round.status === 'in_progress')
                                   : round.status === (activeFilter as any));
      
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
  }, [rounds, searchValue, typeFilter, planFilter, activeFilter, dateRange]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize]);

  // Get actions for each round
  const getRoundActions = (round: InspectionRound): Action[] => {
    // Default action available for all statuses
    const actions: Action[] = [
      {
        label: 'Xem chi tiết',
        icon: <Eye size={16} />,
        onClick: () => navigate(`/plans/inspection-rounds/${encodeURIComponent(round.id)}`),
        priority: 10,
      }
    ];

    switch (round.status) {
      case 'draft':
        // Nháp: Chỉnh sửa, Gửi duyệt, Xóa
        actions.push(
          {
            label: 'Chỉnh sửa',
            icon: <Edit size={16} />,
            onClick: () => {
              navigate(`/plans/inspection-rounds/create-new?mode=edit&id=${encodeURIComponent(round.id)}`);
            },
            priority: 8,
          },
          {
            label: 'Gửi duyệt',
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

      case 'pending_approval':
        // Chờ duyệt: Phê duyệt, Từ chối
        actions.push(
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
            priority: 5,
          }
        );
        break;

      case 'approved':
        // Đã duyệt: Triển khai, Chỉnh sửa
        actions.push(
          {
            label: 'Triển khai',
            icon: <PlayCircle size={16} />,
            onClick: () => openModal('deploy', round),
            priority: 9,
          },
          {
            label: 'Chỉnh sửa',
            icon: <Edit size={16} />,
            onClick: () => {
              navigate(`/plans/inspection-rounds/create-new?mode=edit&id=${encodeURIComponent(round.id)}`);
            },
            priority: 8,
          }
        );
        break;

      case 'active':
      case 'in_progress':
        // Đang triển khai/Đang kiểm tra: Phiên làm việc, Hoàn thành, Tạm dừng
        actions.push(
          {
            label: 'Phiên làm việc',
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
            icon: <ClipboardCheck size={16} />,
            onClick: () => openModal('completeInspection', round),
            priority: 10,
          },
          {
            label: 'Tạm dừng',
            icon: <PauseCircle size={16} />,
            onClick: () => openModal('pause', round),
            variant: 'destructive' as const,
            separator: true,
            priority: 3,
          }
        );
        break;

      case 'paused':
        // Tạm dừng: Tiếp tục
        actions.push(
          {
            label: 'Tiếp tục',
            icon: <PlayCircle size={16} />,
            onClick: () => openModal('resume', round),
            priority: 9,
          }
        );
        break;

      case 'completed':
        // Hoàn thành: Thống kê
        actions.push(
          {
            label: 'Thống kê',
            icon: <BarChart3 size={16} />,
            onClick: () => navigate(`/plans/inspection-rounds/${encodeURIComponent(round.id)}/statistics`),
            priority: 9,
          }
        );
        break;

      case 'rejected':
        // Từ chối duyệt: Chỉnh sửa, Gửi lại, Xóa
        actions.push(
          {
            label: 'Chỉnh sửa',
            icon: <Edit size={16} />,
            onClick: () => {
              navigate(`/plans/inspection-rounds/create-new?mode=edit&id=${encodeURIComponent(round.id)}`);
            },
            priority: 8,
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
        // Đã hủy: Xóa
        actions.push(
          {
            label: 'Xóa',
            icon: <Trash2 size={16} />,
            onClick: () => openModal('delete', round),
            variant: 'destructive' as const,
            priority: 1,
          }
        );
        break;
    }

    return actions;
  };

  // Define table columns
  const columns: Column<InspectionRound>[] = [
    {
      key: 'code',
      label: 'Mã đợt',
      sortable: true,
      width: '140px',
      render: (round) => (
        <div className={styles.roundCode}>{round.campaign_code || '--'}</div>
      ),
    },
    {
      key: 'name',
      label: 'Tên đợt kiểm tra',
      sortable: true,
      render: (round) => (
        <div>
          <div className={styles.roundName}>{round.name || '--'}</div>
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
      width: '220px',
      render: (round) => {
        if (!round.startDate || !round.endDate) {
          return <span className={styles.timeRange}>Chưa xác định</span>;
        }
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
      width: '250px',
      truncate: true,
      render: (round) => (
        <span className={styles.leadUnit}>{round.leadUnit || '--'}</span>
      ),
    },
    {
      key: 'team',
      label: 'Lực lượng',
      sortable: true,
      width: '120px',
      render: (round) => (
        <span className={styles.teamSize}>
          {round.teamSize > 0 ? `${round.teamSize} người` : '--'}
        </span>
      ),
    },
    {
      key: 'targets',
      label: 'Số cơ sở',
      sortable: true,
      width: '100px',
      render: (round) => (
        <div className={styles.targetsInfo}>
          <div className={styles.targetsCount}>
            {round.totalTargets > 0 ? `${round.inspectedTargets}/${round.totalTargets}` : '--'}
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
      width: '140px',
      render: (round) => <StatusBadge type="round" value={round.status} size="sm" />,
    },
    {
      key: 'creator',
      label: 'Người tạo',
      sortable: true,
      width: '140px',
      truncate: true,
      render: (round) => <span className={styles.creator}>{round.createdBy || '--'}</span>,
    },
    {
      key: 'actions',
      label: 'Thao tác',
      sticky: 'right',
      width: '180px',
      render: (round) => (
        <ActionColumn actions={getRoundActions(round)} />
      ),
    },
  ];

  // Handle row selection
  const handleSelectRow = (id: string | number) => {
    const stringId = String(id);
    const newSelected = new Set(selectedRows);
    if (newSelected.has(stringId)) {
      newSelected.delete(stringId);
    } else {
      newSelected.add(stringId);
    }
    setSelectedRows(newSelected);
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedRows(new Set(paginatedData.map((r: InspectionRound) => r.id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  // Reset to page 1 when filters change
  useEffect(() => {
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

  const handleRefresh = async () => {
    await refetch();
    toast.success('Đã làm mới dữ liệu');
  };

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
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              Tải lại
            </Button>
            <Button variant="outline" size="sm">
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
            label="Tổng s đợt"
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
            value={stats.pending_approval.toString()}
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
            variant="primary"
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

      {/* Data Table */}
      <div className={styles.tableContainer}>
        <Card>
          <CardContent className={styles.tableCard}>
            {loading ? (
              <div className={styles.loadingContainer}>
                <RefreshCw size={32} className="animate-spin text-primary" />
                <p>Đang tải dữ liệu...</p>
              </div>
            ) : error ? (
              <div className={styles.errorContainer}>
                <p className={styles.errorMessage}>{error}</p>
                <Button onClick={refetch} variant="outline">
                  Thử lại
                </Button>
              </div>
            ) : filteredData.length === 0 ? (
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

      {/* Advanced Filter Modal */}
      <AdvancedFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={handleApplyFilters}
        onClear={() => {}}
        filters={filterConfigs}
        values={filterValues}
        onChange={handleFilterChange}
      />

      {/* Action Modals */}
      <SendForApprovalModal
        isOpen={modalState.type === 'sendApproval'}
        onClose={closeModal}
        round={modalState.round}
        onConfirm={handleSendForApproval}
      />
      <StartInspectionModal
        isOpen={modalState.type === 'startInspection'}
        onClose={closeModal}
        round={modalState.round}
        onConfirm={handleStartInspection}
      />
      <CompleteInspectionModal
        isOpen={modalState.type === 'completeInspection'}
        onClose={closeModal}
        round={modalState.round}
        onConfirm={handleCompleteInspection}
      />
      <CompleteRoundModal
        isOpen={modalState.type === 'completeRound'}
        onClose={closeModal}
        round={modalState.round}
        onConfirm={handleCompleteRound}
      />
      <CancelRoundModal
        isOpen={modalState.type === 'cancel'}
        onClose={closeModal}
        round={modalState.round}
        onConfirm={handleCancelRound}
      />
      <DeleteRoundModal
        isOpen={modalState.type === 'delete'}
        onClose={closeModal}
        round={modalState.round}
        onConfirm={handleDeleteRound}
      />
      <RejectRoundModal
        isOpen={modalState.type === 'reject'}
        onClose={closeModal}
        round={modalState.round}
        onConfirm={handleRejectRound}
      />
      <PauseRoundModal
        isOpen={modalState.type === 'pause'}
        onClose={closeModal}
        round={modalState.round}
        onConfirm={handlePauseRound}
      />
      <ResumeRoundModal
        isOpen={modalState.type === 'resume'}
        onClose={closeModal}
        round={modalState.round}
        onConfirm={handleResumeRound}
      />
      <DeployRoundModal
        isOpen={modalState.type === 'deploy'}
        onClose={closeModal}
        round={modalState.round}
        onConfirm={handleDeployRound}
      />

      {/* Create Session Dialog */}
      <CreateSessionDialog
        isOpen={createSessionDialog.open}
        onClose={() => setCreateSessionDialog({ open: false, roundId: '', roundName: '' })}
        roundId={createSessionDialog.roundId}
        roundName={createSessionDialog.roundName}
      />
    </div>
  );
}