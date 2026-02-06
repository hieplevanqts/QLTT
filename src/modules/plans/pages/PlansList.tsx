import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Download, 
  RefreshCw, 
  ClipboardList, 
  CircleCheck, 
  Clock, 
  Eye, 
  Edit, 
  Calendar, 
  FileEdit, 
  Send, 
  CheckCircle2, 
  PlayCircle, 
  PauseCircle, 
  Trash2, 
  XCircle, 
  FileDown, 
  BarChart3, 
  ClipboardCheck, 
  LayoutGrid,
} from 'lucide-react';
import { toast } from 'sonner';
import PageHeader from '@/layouts/PageHeader';
import EmptyState from '@/components/ui-kit/EmptyState';
import DataTable, { Column } from '@/components/ui-kit/DataTable';
import { SearchInput } from '@/components/ui-kit/SearchInput';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CloudSyncOutlined } from '@ant-design/icons';

import ModernSummaryCard from '@/components/patterns/ModernSummaryCard';
import BulkActionBar, { BulkAction } from '@/components/patterns/BulkActionBar';
import FilterActionBar from '@/components/patterns/FilterActionBar';
import ActionColumn, { Action } from '@/components/patterns/ActionColumn';
import TableFooter from '@/components/ui-kit/TableFooter';
import { StatusBadge } from '@/components/common/StatusBadge';
import { getStatusProps } from '@/utils/status-badge-helper';
import { cn } from '@/components/ui/utils';
import { type Plan } from '@/utils/data/kehoach-mock-data';
import styles from './PlansList.module.css';
import {
  SendForApprovalModal,
  ApproveModal,
  RejectModal,
  RecallModal,
  DeployModal,
  PauseModal,
  DeletePlanModal,
  CompletePlanModal,
  ResumeModal,
  CancelPlanModal
} from '@/components/plans/PlanActionModals';
import { M09ProposalModal } from '@/components/plans/M09ProposalModal';
import { M08ReportModal } from '@/components/plans/M08ReportModal';

import DateRangePicker, { DateRange } from '@/components/ui-kit/DateRangePicker';
import { useSupabasePlans } from '@/hooks/useSupabasePlans';
import { updatePlanApi, deletePlanApi } from '@/utils/api/plansApi';
import PlanCalendarView from '@/components/plans/PlanCalendarView';
import InsSyncModal from '@/modules/plans/components/InsSyncModal';

export function PlansList() {
  const navigate = useNavigate();
  const { plans, loading, error, refetch } = useSupabasePlans();
  
  // Ensure plans is always an array
  const safePlans = Array.isArray(plans) ? plans : [];
  
  // State management
  const [searchValue, setSearchValue] = useState('');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'calendar'>('table');
  
  // Filter states
  const [planTypeFilter, setPlanTypeFilter] = useState<string>('periodic'); // Default to first tab
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [dateRangeFilter, setDateRangeFilter] = useState<DateRange>({ startDate: null, endDate: null });
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Modal states
  const [modalState, setModalState] = useState<{
    type: 'sendApproval' | 'approve' | 'reject' | 'recall' | 'deploy' | 'pause' | 'delete' | 'complete' | 'resume' | 'cancel' | null;
    plan: Plan | null;
  }>({ type: null, plan: null });

  // M09 & M08 Modal states
  const [m09ModalOpen, setM09ModalOpen] = useState(false);
  const [m08ModalOpen, setM08ModalOpen] = useState(false);
  const [selectedPlanForDocument, setSelectedPlanForDocument] = useState<Plan | null>(null);
  const [openIns, setOpenIns] = useState(false);

  const closeModal = () => setModalState({ type: null, plan: null });
  const openModal = (type: typeof modalState.type, plan: Plan) => setModalState({ type, plan });

  // Calculate stats
  const stats = useMemo(() => {
    return {
      total: safePlans.length,
      draft: safePlans.filter(p => p.status === 'draft').length,
      pending: safePlans.filter(p => p.status === 'pending_approval').length,
      approved: safePlans.filter(p => p.status === 'approved').length,
      active: safePlans.filter(p => p.status === 'active').length,
      paused: safePlans.filter(p => p.status === 'paused').length,
      completed: safePlans.filter(p => p.status === 'completed').length,
      // Count by plan type
      periodic: safePlans.filter(p => p.planType === 'periodic').length,
      thematic: safePlans.filter(p => p.planType === 'thematic').length,
      urgent: safePlans.filter(p => p.planType === 'urgent').length,
    };
  }, [safePlans]);

  // Apply filters
  const filteredData = useMemo(() => {
    return safePlans.filter(plan => {
      const matchesSearch = plan.name.toLowerCase().includes(searchValue.toLowerCase()) ||
                           (plan.code && plan.code.toLowerCase().includes(searchValue.toLowerCase()));
      const matchesType = planTypeFilter === 'all' || plan.planType === planTypeFilter;
      const matchesStatus = statusFilter === 'all' || plan.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || plan.priority === priorityFilter;
      const matchesActiveFilter = activeFilter === null || plan.status === activeFilter;
      
      // Date range filter
      const matchesDateRange = (() => {
        if (!dateRangeFilter.startDate && !dateRangeFilter.endDate) return true;
        
        const planDate = new Date(plan.startDate);
        
        if (dateRangeFilter.startDate && dateRangeFilter.endDate) {
          const start = new Date(dateRangeFilter.startDate);
          const end = new Date(dateRangeFilter.endDate);
          end.setHours(23, 59, 59, 999);
          return planDate >= start && planDate <= end;
        } else if (dateRangeFilter.startDate) {
          const start = new Date(dateRangeFilter.startDate);
          return planDate >= start;
        } else if (dateRangeFilter.endDate) {
          const end = new Date(dateRangeFilter.endDate);
          end.setHours(23, 59, 59, 999);
          return planDate <= end;
        }
        return true;
      })();
      
      return matchesSearch && matchesType && matchesStatus && matchesPriority && matchesActiveFilter && matchesDateRange;
    });
  }, [safePlans, searchValue, planTypeFilter, statusFilter, priorityFilter, activeFilter, dateRangeFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = useMemo(() => {
    // Ensure filteredData is an array and filter out any invalid items
    const validData = Array.isArray(filteredData) ? filteredData.filter(item => item && typeof item === 'object') : [];
    const startIndex = (currentPage - 1) * pageSize;
    return validData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize]);

  // Get actions for each plan
  const getPlanActions = (plan: Plan): Action[] => {
    // Default actions available for all statuses
    const actions: Action[] = [
      {
        label: 'Xem chi tiết',
        icon: <Eye size={16} />,
        onClick: () => navigate(`/plans/${encodeURIComponent(plan.id)}`),
        priority: 10,
      }
    ];

    switch (plan.status) {
      case 'draft':
        // Nháp: Chỉnh sửa, Gửi duyệt, Tải đề xuất, Xóa
        actions.push(
          {
            label: 'Chỉnh sửa',
            icon: <Edit size={16} />,
            onClick: () => navigate(`/plans/${encodeURIComponent(plan.id)}/edit`),
            priority: 8,
          },
          {
            label: 'Gửi duyệt',
            icon: <Send size={16} />,
            onClick: () => openModal('sendApproval', plan),
            priority: 9,
          },
          {
            label: 'Tải đề xuất',
            icon: <FileDown size={16} />,
            onClick: () => {
              setSelectedPlanForDocument(plan);
              setM09ModalOpen(true);
            },
            priority: 7,
          },
          {
            label: 'Xóa',
            icon: <Trash2 size={16} className="text-destructive" />,
            onClick: () => openModal('delete', plan),
            variant: 'destructive' as const,
            separator: true,
            priority: 1,
          }
        );
        break;

      case 'pending_approval':
        // Chờ duyệt: Phê duyệt, Tải đề xuất, Từ chối
        actions.push(
          {
            label: 'Phê duyệt',
            icon: <CheckCircle2 size={16} />,
            onClick: () => openModal('approve', plan),
            priority: 9,
          },
          {
            label: 'Tải đề xuất',
            icon: <FileDown size={16} />,
            onClick: () => {
              setSelectedPlanForDocument(plan);
              setM09ModalOpen(true);
            },
            priority: 7,
          },
          {
            label: 'Từ chối',
            icon: <XCircle size={16} />,
            onClick: () => openModal('reject', plan),
            variant: 'destructive' as const,
            separator: true,
            priority: 5,
          }
        );
        break;

      case 'approved':
        // Đã duyệt: Triển khai, Tải đề xuất, Chỉnh sửa
        actions.push(
          {
            label: 'Triển khai',
            icon: <PlayCircle size={16} />,
            onClick: () => openModal('deploy', plan),
            priority: 9,
          },
          {
            label: 'Tải đề xuất',
            icon: <FileDown size={16} />,
            onClick: () => {
              setSelectedPlanForDocument(plan);
              setM09ModalOpen(true);
            },
            priority: 7,
          },
           {
            label: 'Chỉnh sửa',
            icon: <Edit size={16} />,
            onClick: () => navigate(`/plans/${encodeURIComponent(plan.id)}/edit`),
            priority: 8,
          }
        );
        break;

      case 'active':
        // Đang thực hiện: Phiên làm việc, Hoàn thành, Báo cáo, Tải đề xuất, Tạm dừng
        actions.push(
          {
            label: 'Phiên làm việc',
            icon: <Calendar size={16} />,
            onClick: () => navigate(`/plans/inspection-session?planId=${encodeURIComponent(plan.id)}`),
            priority: 9,
          },
          {
            label: 'Hoàn thành',
            icon: <ClipboardCheck size={16} />,
            onClick: () => openModal('complete', plan),
            priority: 10,
          },
          {
            label: 'Báo cáo (M08)',
            icon: <BarChart3 size={16} />,
            onClick: () => {
              setSelectedPlanForDocument(plan);
              setM08ModalOpen(true);
            },
            priority: 8,
          },
          {
            label: 'Tải đề xuất',
            icon: <FileDown size={16} />,
            onClick: () => {
              setSelectedPlanForDocument(plan);
              setM09ModalOpen(true);
            },
            priority: 7,
          },
          {
            label: 'Tạm dừng',
            icon: <PauseCircle size={16} />,
            onClick: () => openModal('pause', plan),
            variant: 'destructive' as const,
            separator: true,
            priority: 3,
          }
        );
        break;

      case 'paused':
        // Tạm dừng: Tiếp tục, Hủy
        actions.push(
          {
            label: 'Tiếp tục',
            icon: <PlayCircle size={16} />,
            onClick: () => openModal('resume', plan),
            priority: 9,
          },
          {
            label: 'Hủy kế hoạch',
            icon: <XCircle size={16} />,
            onClick: () => openModal('cancel', plan),
            variant: 'destructive' as const,
            separator: true,
            priority: 1,
          }
        );
        break;

      case 'completed':
        // Hoàn thành: Báo cáo, Tải đề xuất
        actions.push(
          {
            label: 'Phiên làm việc',
            icon: <Calendar size={16} />,
            onClick: () => navigate(`/plans/inspection-session?planId=${encodeURIComponent(plan.id)}`),
            priority: 10,
          },
          {
            label: 'Báo cáo (M08)',
            icon: <BarChart3 size={16} />,
            onClick: () => {
              setSelectedPlanForDocument(plan);
              setM08ModalOpen(true);
            },
            priority: 9,
          },
          {
            label: 'Tải đề xuất',
            icon: <FileDown size={16} />,
            onClick: () => {
              setSelectedPlanForDocument(plan);
              setM09ModalOpen(true);
            },
            priority: 7,
          }
        );
        break;

      case 'rejected':
        // Từ chối: Chỉnh sửa, Gửi duyệt
        actions.push(
          {
            label: 'Chỉnh sửa',
            icon: <Edit size={16} />,
            onClick: () => navigate(`/plans/${encodeURIComponent(plan.id)}/edit`),
            priority: 8,
          },
          {
            label: 'Gửi duyệt',
            icon: <Send size={16} />,
            onClick: () => openModal('sendApproval', plan),
            priority: 9,
          }
        );
        break;

      case 'cancelled':
        // Đã hủy: Không cho xóa bản ghi
        break;
    }

    return actions;
  };

  // Define table columns
  const columns: Column<Plan>[] = [
    {
      key: 'stt',
      label: 'STT',
      width: '60px',
      className: 'text-center',
      render: (_, index) => (
        <div className="text-center">{(currentPage - 1) * pageSize + index + 1}</div>
      ),
    },
    {
      key: 'code',
      label: 'Mã kế hoạch',
      sortable: true,
      width: '140px',
      render: (plan) => (
        <div>
          <div className={styles.planIdBadgeRow}>
            <StatusBadge {...getStatusProps('planType', plan.planType)} size="sm" />
          </div>
          <div className={styles.planId}>{plan.code || '--'}</div>
        </div>
      ),
    },
    {
      key: 'name',
      label: 'Tiêu đề kế hoạch',
      sortable: true,
      width: '350px',
      render: (plan) => {
        let timeStr = 'Chưa xác định';
        if (plan.startDate && plan.endDate) {
           const startDate = new Date(plan.startDate);
           const endDate = new Date(plan.endDate);
           timeStr = `${startDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })} - ${endDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}`;
        }

        return (
          <div>
            <div className={styles.planName}>{plan.name || '--'}</div>
            <div className={styles.planTopic}>Thời gian: {timeStr}</div>
          </div>
        );
      },
    },
    {
      key: 'scope',
      label: 'Khu vực kiểm tra',
      sortable: true,
      width: '220px',
      render: (plan) => (
        <span className={styles.planScope}>{plan.scopeLocation || '--'}</span>
      ),
    },
    {
      key: 'leadUnit',
      label: 'Đơn vị thực hiện',
      sortable: true,
      width: '200px',
      render: (plan) => (
        <span className={styles.planLeadUnit}>{plan.responsibleUnit || '--'}</span>
      ),
    },
    {
      key: 'priority',
      label: 'Ưu tiên',
      sortable: true,
      width: '130px',
      render: (plan) => <StatusBadge {...getStatusProps('priority', plan.priority)} size="sm" />,
    },
    {
      key: 'status',
      label: 'Trạng thái',
      width: '150px',
      render: (plan) => <StatusBadge {...getStatusProps('plan', plan.status)} size="sm" />,
    },
    {
      key: 'creator',
      label: 'Người tạo',
      sortable: true,
      width: '160px',
      render: (plan) => <span className={styles.creator}>{plan.createdBy || '--'}</span>,
    },
    {
      key: 'actions',
      label: 'Thao tác',
      sticky: 'right',
      width: '180px',
      render: (plan) => (
        <ActionColumn actions={getPlanActions(plan)} />
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
      setSelectedRows(new Set(paginatedData.map(p => p.id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
    setSelectedRows(new Set());
  }, [planTypeFilter, statusFilter, priorityFilter, searchValue, activeFilter]);



  // Bulk actions
  const bulkActions: BulkAction[] = [
    {
      label: 'Gửi duyệt',
      onClick: () => {
        toast.success(`Đã gửi ${selectedRows.size} kế hoạch đi phê duyệt`);
        setSelectedRows(new Set());
      },
      icon: <Send size={16} />,
    },
    {
      label: 'Xuất dữ liệu',
      onClick: () => {
        toast.success(`Đã xuất ${selectedRows.size} kế hoạch`);
      },
      variant: 'secondary',
      icon: <Download size={16} />,
    },
    {
      label: 'Xóa',
      onClick: () => {
        toast.error(`Đã xóa ${selectedRows.size} kế hoạch`);
        setSelectedRows(new Set());
      },
      variant: 'destructive',
      icon: <Trash2 size={16} className="text-destructive" />,
    },
  ];

  // Show loading state
  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <PageHeader
          breadcrumbs={[
            { label: 'Trang chủ', href: '/' },
            { label: 'Kế hoạch tác nghiệp', href: '/plans/list' },
            { label: 'Kế hoạch kiểm tra' }
          ]}
          title="Kế hoạch kiểm tra"
        />
        <div style={{ padding: '48px', textAlign: 'center' }}>
          <RefreshCw className="animate-spin" style={{ margin: '0 auto 16px' }} size={32} />
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className={styles.pageContainer}>
        <PageHeader
          breadcrumbs={[
            { label: 'Trang chủ', href: '/' },
            { label: 'Kế hoạch tác nghiệp', href: '/plans/list' },
            { label: 'Kế hoạch kiểm tra' }
          ]}
          title="Kế hoạch kiểm tra"
        />
        <EmptyState
          type="error"
          title="Lỗi tải dữ liệu"
          description={error}
          action={{
            label: 'Thử lại',
            onClick: refetch,
          }}
        />
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <PageHeader
        breadcrumbs={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Kế hoạch tác nghiệp', href: '/plans/list' },
          { label: 'Kế hoạch kiểm tra' }
        ]}
        title="Kế hoạch kiểm tra"
        actions={
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div className={styles.viewToggle}>
              <button 
                className={cn(styles.toggleBtn, viewMode === 'table' && styles.active)}
                onClick={() => setViewMode('table')}
                title="Xem dạng bảng"
              >
                <LayoutGrid size={18} />
              </button>
              <button 
                className={cn(styles.toggleBtn, viewMode === 'calendar' && styles.active)}
                onClick={() => setViewMode('calendar')}
                title="Xem dạng lịch"
              >
                <Calendar size={18} />
              </button>
            </div>

            <Button variant="outline" size="sm" onClick={() => {
              setSearchValue('');
              setPlanTypeFilter('periodic');
              setStatusFilter('all');
              setPriorityFilter('all');
              setDateRangeFilter({ startDate: null, endDate: null });
              refetch();
              toast.success('Đã tải lại dữ liệu');
            }}>
              <RefreshCw size={16} className="mr-2" />
              Tải lại
            </Button>
            <Button variant="outline" size="sm" onClick={() => toast.success('Xuất dữ liệu thành công')}>
              <Download size={16} />
              Xuất dữ liệu
            </Button>
            <Button variant="outline" size="sm" onClick={() => setOpenIns(true)}>
              <CloudSyncOutlined className="mr-2" />
              Kết nối INS
            </Button>
          </div>
        }
      />

      <InsSyncModal open={openIns} onClose={() => setOpenIns(false)} />

      {/* Summary Cards */}
      <div className={styles.summaryContainer}>
        <div className={styles.summaryGrid}>
          <ModernSummaryCard
            label="Tổng số kế hoạch"
            value={stats.total.toString()}
            icon={ClipboardList}
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
            value={stats.pending.toString()}
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
          <ModernSummaryCard
            label="Hoàn thành"
            value={stats.completed.toString()}
            icon={CircleCheck}
            variant="success"
            active={activeFilter === 'completed'}
            onClick={() => setActiveFilter('completed')}
          />
        </div>
      </div>

      {/* QLTT Standard: Filters and Search on SAME ROW */}
      <div className={styles.filterSection}>
        <FilterActionBar
          filters={
            <>
              <Select value={activeFilter || 'all'} onValueChange={(val) => setActiveFilter(val === 'all' ? null : val)}>
                <SelectTrigger style={{ width: '180px' }}>
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="draft">Nháp</SelectItem>
                  <SelectItem value="pending_approval">Chờ duyệt</SelectItem>
                  <SelectItem value="approved">Đã duyệt</SelectItem>
                  <SelectItem value="active">Đang triển khai</SelectItem>
                  <SelectItem value="paused">Tạm dừng</SelectItem>
                  <SelectItem value="completed">Hoàn thành</SelectItem>
                  <SelectItem value="rejected">Từ chối duyệt</SelectItem>
                  <SelectItem value="cancelled">Đã hủy</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger style={{ width: '150px' }}>
                  <SelectValue placeholder="Ưu tiên" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả ưu tiên</SelectItem>
                  <SelectItem value="low">Thấp</SelectItem>
                  <SelectItem value="medium">Trung bình</SelectItem>
                  <SelectItem value="high">Cao</SelectItem>
                  <SelectItem value="critical">Khẩn cấp</SelectItem>
                </SelectContent>
              </Select>

              <DateRangePicker 
                value={dateRangeFilter} 
                onChange={setDateRangeFilter}
                placeholder="Thời gian triển khai"
                className={styles.datePicker}
              />
            </>
          }
          searchInput={
            <SearchInput
              placeholder="Mã, tiêu đề kế hoạch"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              style={{ width: '400px' }}
            />
          }
        />
      </div>

      {/* Tabs for Plan Types */}
      <Tabs value={planTypeFilter} onValueChange={setPlanTypeFilter} className={styles.planTabs}>
        <div className={styles.tabsHeader}>
          <TabsList>
            <TabsTrigger value="periodic">
              Định kỳ <span className={styles.tabCount}>({stats.periodic})</span>
            </TabsTrigger>
            <TabsTrigger value="thematic">
              Chuyên đề <span className={styles.tabCount}>({stats.thematic})</span>
            </TabsTrigger>
            <TabsTrigger value="urgent">
              Đột xuất <span className={styles.tabCount}>({stats.urgent})</span>
            </TabsTrigger>
          </TabsList>
          
          <Button 
            size="sm" 
            onClick={() => {
              navigate(`/plans/create-new?type=${planTypeFilter}`);
            }}
            className="text-white"
            style={{ color: 'white' }}
          >
            <Plus size={16} />
            Thêm {planTypeFilter === 'periodic' ? 'định kỳ' : planTypeFilter === 'thematic' ? 'chuyên đề' : 'đột xuất'}
          </Button>
        </div>

        <TabsContent value={planTypeFilter} className={styles.tabContent}>
          {/* Content renders below based on current tab */}
        </TabsContent>
      </Tabs>

      {/* Bulk Action Bar */}
      {selectedRows.size > 0 && (
        <BulkActionBar
          selectedCount={selectedRows.size}
          actions={bulkActions}
          onClear={() => setSelectedRows(new Set())}
        />
      )}

      {/* Data Content (Table or Calendar) */}
      <div className={styles.mainContent}>
        {viewMode === 'table' ? (
          <div className={styles.tableContainer}>
            <Card>
              <CardContent className={styles.tableCard}>
                {filteredData.length === 0 ? (
                  <EmptyState
                    icon={ClipboardList}
                    title="Không tìm thấy kế hoạch"
                    description="Không có kế hoạch nào phù hợp với bộ lọc hiện tại"
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
                      getRowId={(plan) => plan.id}
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
        ) : (
          <div className={styles.tableContainer}>
            <PlanCalendarView plans={filteredData} />
          </div>
        )}
      </div>

      {/* Modals */}
      {modalState.plan && (
        <>
          <SendForApprovalModal 
            isOpen={modalState.type === 'sendApproval'} 
            onClose={closeModal}
            plan={modalState.plan}
            onConfirm={async () => {
              if (modalState.plan) {
                try {
                  await updatePlanApi(modalState.plan.id, { status: 'pending_approval' });
                  toast.success(`Đã gửi kế hoạch "${modalState.plan?.name}" đi phê duyệt`);
                  refetch();
                } catch (error: any) {
                  toast.error(`Lỗi: ${error.message}`);
                }
              }
            }}
          />
          <ApproveModal 
            isOpen={modalState.type === 'approve'} 
            onClose={closeModal}
            plan={modalState.plan}
            onConfirm={async () => {
              if (modalState.plan) {
                try {
                  await updatePlanApi(modalState.plan.id, { status: 'approved' });
                  toast.success(`Kế hoạch "${modalState.plan?.name}" đã được phê duyệt`);
                  refetch();
                } catch (error: any) {
                  toast.error(`Lỗi: ${error.message}`);
                }
              }
            }}
          />
          <RejectModal 
            isOpen={modalState.type === 'reject'} 
            onClose={closeModal}
            plan={modalState.plan}
            onConfirm={async (_reason) => {
              if (modalState.plan) {
                try {
                  // In a real app, we might want to save the reason too
                  await updatePlanApi(modalState.plan.id, { status: 'rejected' });
                  toast.error(`Kế hoạch "${modalState.plan?.name}" đã bị từ chối`);
                  closeModal();
                  refetch();
                } catch (error: any) {
                  toast.error(`Lỗi: ${error.message}`);
                }
              }
            }}
          />
          <RecallModal 
            isOpen={modalState.type === 'recall'} 
            onClose={closeModal}
            plan={modalState.plan}
            onConfirm={async () => {
              if (modalState.plan) {
                try {
                  await updatePlanApi(modalState.plan.id, { status: 'draft' });
                  toast.info(`Đã thu hồi kế hoạch "${modalState.plan?.name}" về bản nháp`);
                  closeModal();
                  refetch();
                } catch (error: any) {
                  toast.error(`Lỗi: ${error.message}`);
                }
              }
            }}
          />
          <DeployModal 
            isOpen={modalState.type === 'deploy'} 
            onClose={closeModal}
            plan={modalState.plan}
            onConfirm={async () => {
              if (modalState.plan) {
                try {
                  await updatePlanApi(modalState.plan.id, { status: 'active' });
                  toast.success(`Đã triển khai kế hoạch "${modalState.plan?.name}"`);
                  closeModal();
                  refetch();
                } catch (error: any) {
                  toast.error(`Lỗi: ${error.message}`);
                }
              }
            }}
          />
          <PauseModal 
            isOpen={modalState.type === 'pause'} 
            onClose={closeModal}
            plan={modalState.plan}
            onConfirm={async (_reason) => {
              if (modalState.plan) {
                try {
                  await updatePlanApi(modalState.plan.id, { status: 'paused' });
                  toast.warning(`Đã tạm dừng kế hoạch "${modalState.plan?.name}"`);
                  closeModal();
                  refetch();
                } catch (error: any) {
                  toast.error(`Lỗi: ${error.message}`);
                }
              }
            }}
          />
          <DeletePlanModal 
            isOpen={modalState.type === 'delete'} 
            onClose={closeModal}
            plan={modalState.plan}
            onConfirm={async () => {
              if (modalState.plan) {
                try {
                  await deletePlanApi(modalState.plan.id);
                  toast.success(`Đã xóa kế hoạch "${modalState.plan?.name}"`);
                  closeModal();
                  refetch();
                } catch (error: any) {
                  toast.error(`Lỗi: ${error.message}`);
                }
              }
            }}
          />
          <CompletePlanModal
            isOpen={modalState.type === 'complete'}
            onClose={closeModal}
            plan={modalState.plan}
            onConfirm={async () => {
              if (modalState.plan) {
                try {
                  await updatePlanApi(modalState.plan.id, { status: 'completed' });
                  toast.success(`Đã hoàn thành kế hoạch "${modalState.plan?.name}"`);
                  closeModal();
                  refetch();
                } catch (error: any) {
                  toast.error(`Lỗi: ${error.message}`);
                }
              }
            }}
          />
          <ResumeModal
            isOpen={modalState.type === 'resume'}
            onClose={closeModal}
            plan={modalState.plan}
            onConfirm={async () => {
              if (modalState.plan) {
                try {
                  await updatePlanApi(modalState.plan.id, { status: 'active' });
                  toast.success(`Đã tiếp tục kế hoạch "${modalState.plan?.name}"`);
                  closeModal();
                  refetch();
                } catch (error: any) {
                  toast.error(`Lỗi: ${error.message}`);
                }
              }
            }}
          />
          <CancelPlanModal
            isOpen={modalState.type === 'cancel'}
            onClose={closeModal}
            plan={modalState.plan}
            onConfirm={async (_reason) => {
              if (modalState.plan) {
                try {
                  await updatePlanApi(modalState.plan.id, { status: 'cancelled' });
                  toast.error(`Đã hủy kế hoạch "${modalState.plan?.name}"`);
                  closeModal();
                  refetch();
                } catch (error: any) {
                  toast.error(`Lỗi: ${error.message}`);
                }
              }
            }}
          />

        </>
      )}

      {/* Advanced Filter Modal */}


      {/* M09 Proposal Modal */}
      {selectedPlanForDocument && (
        <M09ProposalModal
          open={m09ModalOpen}
          onOpenChange={setM09ModalOpen}
          plan={selectedPlanForDocument}
        />
      )}

      {/* M08 Report Modal */}
      {selectedPlanForDocument && (
        <M08ReportModal
          open={m08ModalOpen}
          onOpenChange={setM08ModalOpen}
          plan={selectedPlanForDocument}
        />
      )}
    </div>
  );
}
