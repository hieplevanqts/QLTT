import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { 
  Filter, 
  LayoutGrid, 
  List, 
  RefreshCw, 
  Download, 
  Plus,
  Play,
  FileText,
  Paperclip,
  RotateCcw,
  XCircle,
  Edit,
  Table,
  BookOpen,
  Eye,
  CheckCircle
} from 'lucide-react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDrag, useDrop } from 'react-dnd';
import styles from './TaskBoard.module.css';
import PageHeader from '@/layouts/PageHeader';
import FilterActionBar from '@/components/patterns/FilterActionBar';
import SearchInput from '@/components/ui-kit/SearchInput';
import EmptyState from '@/components/ui-kit/EmptyState';
import { Button } from '@/components/ui/button';
  import { type InspectionTask, type TaskStatus } from '@/utils/data/inspection-tasks-mock-data';
import { useSupabasePlans } from '@/hooks/useSupabasePlans';
import { useSupabaseInspectionRounds } from '@/hooks/useSupabaseInspectionRounds';
import { fetchInspectionSessionsApi, updateInspectionSessionApi, createInspectionSessionApi } from '@/utils/api/inspectionSessionsApi';
import { TaskCard } from '@/components/tasks/TaskCard';
import { StatusBadge } from '@/components/common/StatusBadge';
import { getStatusProps } from '@/utils/status-badge-helper';
import DataTable, { type Column } from '@/components/ui-kit/DataTable';
import AdvancedFilterModal, { type FilterConfig } from '@/components/ui-kit/AdvancedFilterModal';
import { type InfiniteScrollSelectOption } from '@/components/ui-kit/InfiniteScrollSelect';
import { type DateRange } from '@/components/ui-kit/DateRangePicker';
import { toast } from 'sonner';
import CreateTaskModal, { type CreateTaskFormData } from '@/components/tasks/CreateTaskModal';
import { TaskDetailModal } from '@/components/tasks/TaskDetailModal';
import InspectionResultModal from '@/components/sessions/InspectionResultModal';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import ActionColumn, { type Action } from '@/components/patterns/ActionColumn';
import { Card, CardContent } from '@/components/ui/card';
import TableFooter from '@/components/ui-kit/TableFooter';
import ReopenTaskModal from '@/components/tasks/ReopenTaskModal';
import AttachEvidenceModal from '@/components/tasks/AttachEvidenceModal';
import { Form06Modal } from '@/components/tasks/Form06Modal';
import { Form10Modal } from '@/components/tasks/Form10Modal';
import { Form12Modal } from '@/components/tasks/Form12Modal';
import { Form11Modal } from '@/components/tasks/Form11Modal';
import { DeployTaskModal, CompleteTaskModal, CancelTaskModal } from '@/components/tasks/TaskActionModals';

type ViewMode = 'kanban' | 'list';

// Valid status transitions based on workflow rules - v2
// Valid status transitions based on workflow rules - v2
const VALID_TRANSITIONS: Record<TaskStatus, TaskStatus[]> = {
  not_started: ['in_progress', 'cancelled'], // Chỉ có thể bắt đầu hoặc hủy
  in_progress: ['not_started', 'completed', 'pending_approval', 'cancelled'], // Có thể quay lại, hoàn thành, chờ duyệt hoặc hủy
  pending_approval: ['completed', 'in_progress', 'cancelled'], // Có thể duyệt xong, yêu cầu sửa hoặc hủy
  completed: ['in_progress', 'closed', 'reopened'], // Có thể reopen hoặc đóng
  closed: ['completed', 'reopened'], // Chỉ có thể reopen về hoàn thành/mở lại
  cancelled: ['reopened'], // Từ đã hủy có thể mở lại
  reopened: ['in_progress', 'completed', 'cancelled'], // Từ mở lại có thể đi tiếp
};

// Check if a status transition is valid - v2
const canTransitionTo = (fromStatus: TaskStatus, toStatus: TaskStatus): boolean => {
  if (fromStatus === toStatus) return false; // Same status
  return VALID_TRANSITIONS[fromStatus]?.includes(toStatus) || false;
};

const STATUS_COLUMNS: { key: TaskStatus; label: string; color: string }[] = [
  { key: 'not_started', label: 'Chưa bắt đầu', color: '#6B7280' },
  { key: 'in_progress', label: 'Đang thực hiện', color: '#005cb6' },
  { key: 'completed', label: 'Hoàn thành', color: '#10B981' },
  { key: 'closed', label: 'Đã đóng', color: '#64748B' },
  { key: 'reopened', label: 'Mở lại', color: '#D97706' },
  { key: 'cancelled', label: 'Đã hủy', color: '#DC2626' },
];

// Draggable Task Card Wrapper
interface DraggableTaskProps {
  task: InspectionTask;
  onClick: (task: InspectionTask) => void;
  actions: Action[]; // Add actions
}

function DraggableTask({ task, onClick, actions }: DraggableTaskProps) {
  const [{ isDragging }, drag] = useDrag({
    type: 'TASK',
    item: { id: task.id, status: task.status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag as any}
      style={{ 
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
        transition: 'opacity 0.2s ease',
      }}
    >
      <TaskCard task={task} onClick={onClick} actions={actions} />
    </div>
  );
}

// Droppable Column Wrapper  
interface KanbanColumnProps {
  column: typeof STATUS_COLUMNS[0];
  tasks: InspectionTask[];
  onTaskClick: (task: InspectionTask) => void;
  onDropTask: (taskId: string, newStatus: TaskStatus) => void;
  getTaskActions: (task: InspectionTask) => Action[]; // Add this prop
}

function KanbanColumn({ column, tasks, onTaskClick, onDropTask, getTaskActions }: KanbanColumnProps) {
  const [visibleCount, setVisibleCount] = useState(12);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 100) {
      if (visibleCount < tasks.length) {
        setVisibleCount(prev => prev + 12);
      }
    }
  };

  // Reset visibleCount when switching columns or when data changes significantly
  useEffect(() => {
    setVisibleCount(12);
  }, [column.key]);

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'TASK',
    canDrop: (item: { id: string; status: TaskStatus }) => {
      // Allow dropping into same column (will be no-op)
      if (item.status === column.key) {
        return true; // Allow, but won't change status
      }
      // Check if transition is valid according to workflow rules
      const isValid = canTransitionTo(item.status, column.key);
      return isValid;
    },
    drop: (item: { id: string; status: TaskStatus }) => {
      // Silent return if same column (no-op)
      if (item.status === column.key) {
        return; // Just return silently, no action needed
      }
      // Check workflow validation for different columns
      if (!canTransitionTo(item.status, column.key)) {
        return;
      }
      onDropTask(item.id, column.key);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  // Determine column visual state
  const isValidDropZone = isOver && canDrop;
  const isInvalidDropZone = isOver && !canDrop;

  return (
    <div 
      ref={drop as any}
      className={`${styles.kanbanColumn} ${isValidDropZone ? styles.columnDragOver : ''} ${isInvalidDropZone ? styles.columnDragInvalid : ''}`}
    >
      {/* Column Header */}
      <div className={styles.columnHeader}>
        <div className={styles.columnTitle}>
          <span 
            className={styles.statusDot} 
            style={{ backgroundColor: column.color }}
          />
          <h3>{column.label}</h3>
          <span className={styles.taskCount}>{tasks.length}</span>
        </div>
      </div>

      {/* Column Content */}
      <div className={styles.columnContent} onScroll={handleScroll}>
        {tasks.length === 0 ? (
          <div className={styles.emptyColumn}>
            <XCircle size={24} />
            <p>Không có phiên làm việc</p>
          </div>
        ) : (
          <>
            {tasks.slice(0, visibleCount).map(task => (
              <DraggableTask
                key={task.id}
                task={task}
                onClick={onTaskClick}
                actions={getTaskActions(task)}
              />
            ))}
            {visibleCount < tasks.length && (
              <div className={styles.loadingMoreItems}>
                <RefreshCw size={16} className="animate-spin" />
                <span>Đang tải thêm...</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export function TaskBoard() {
  const [searchParams] = useSearchParams();
  const { roundId } = useParams<{ roundId: string }>();

  // Debug: verify component is loading

  // View mode
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  
  // Tasks state
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<InspectionTask | null>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  
  // Action modals state
  const [isEnterResultsModalOpen, setIsEnterResultsModalOpen] = useState(false);
  const [isReopenModalOpen, setIsReopenModalOpen] = useState(false);
  const [isAttachEvidenceModalOpen, setIsAttachEvidenceModalOpen] = useState(false);
  const [actionTask, setActionTask] = useState<InspectionTask | null>(null);
  const [isForm06ModalOpen, setIsForm06ModalOpen] = useState(false);
  const [isForm10ModalOpen, setIsForm10ModalOpen] = useState(false);
  const [isForm12ModalOpen, setIsForm12ModalOpen] = useState(false);
  const [isForm11ModalOpen, setIsForm11ModalOpen] = useState(false);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [cancelTask, setCancelTask] = useState<InspectionTask | null>(null);

  // Filters
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [roundFilter, setRoundFilter] = useState<string>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [dateRangeFilter, setDateRangeFilter] = useState<DateRange>({ startDate: null, endDate: null });

  // Pagination for list view
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);



  // Fetch sessions from API
  const loadSessions = async () => {
    try {
      setLoading(true);
      const campaignId = roundId || searchParams.get('campaignId') || undefined;
      const data = await fetchInspectionSessionsApi(campaignId);
      
      // Map InspectionSession to the expected UI format (InspectionTask compatible)
      const mappedTasks = data.map(session => ({
        id: session.id,
        code: session.id.substring(0, 8).toUpperCase(),
        roundId: session.campaignId,
        roundName: session.campaignName,
        planId: session.departmentId, // Using dept id as fallback if needed
        planName: '--',
        type: session.type, // Use type directly from API
        title: session.name,
        description: session.description || '',
        targetName: session.merchantName,
        targetAddress: session.merchantAddress,
        merchantId: session.merchantId,
        assignee: { id: session.userId || '', name: session.userName },
        assignedBy: { id: '', name: '--' },
        assignedDate: session.createdAt,
        status: session.status,
        priority: session.priority === 3 ? 'urgent' : session.priority === 2 ? 'high' : 'medium',
        dueDate: session.deadlineTime,
        progress: session.status === 'completed' || session.status === 'closed' ? 100 : 
                  session.status === 'in_progress' ? 50 : 0,
        checklistTotal: 0,
        checklistCompleted: 0,
        createdAt: session.createdAt
      }));
      
      setTasks(mappedTasks);
    } catch (error) {
      console.error('TaskBoard loadSessions Error:', error);
      toast.error('Không thể tải danh sách phiên kiểm tra');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, [roundId, searchParams.get('campaignId')]);

  // Initialize filter from URL query params
  useEffect(() => {
    const planParam = searchParams.get('planId') || searchParams.get('plan');
    if (planParam) {
      setPlanFilter(decodeURIComponent(planParam));
    }
  }, [searchParams]);

  // Get real plans and rounds from Supabase
  const { plans: realPlans } = useSupabasePlans();
  const { rounds: realRounds } = useSupabaseInspectionRounds(undefined, true);

  // Prepare plan options with pagination
  const approvedPlans = useMemo(() => {
    return realPlans.filter(plan => plan.status === 'approved' || plan.status === 'active');
  }, [realPlans]);

  const planOptions: InfiniteScrollSelectOption[] = useMemo(() => {
    return approvedPlans.map(plan => ({
      value: plan.id,
      label: plan.name,
      subtitle: `${plan.code || plan.id} - ${plan.planType === 'periodic' ? 'Định kỳ' : plan.planType === 'thematic' ? 'Chuyên đề' : 'Đột xuất'}`,
    }));
  }, [approvedPlans]);

  // Prepare round options
  const roundOptions = useMemo(() => {
    let filteredRounds = realRounds;
    
    if (planFilter !== 'all') {
      filteredRounds = filteredRounds.filter(round => round.planId === planFilter);
    }

    return filteredRounds.map(round => ({
      value: round.id,
      label: round.name,
      subtitle: `${round.code} - ${round.leadUnit}`,
    }));
  }, [realRounds, planFilter]);

  // Reset round filter if it doesn't belong to the selected plan
  useEffect(() => {
    if (planFilter !== 'all' && roundFilter !== 'all') {
      const selectedRound = realRounds.find(r => r.id === roundFilter);
      if (selectedRound && selectedRound.planId !== planFilter) {
        setRoundFilter('all');
      }
    }
  }, [planFilter, roundFilter, realRounds]);



  const uniqueAssignees = useMemo(() => {
    if (!tasks || tasks.length === 0) return [];
    const assignees = Array.from(new Set(tasks.map(t => t?.assignee?.name).filter(Boolean)));
    return assignees;
  }, [tasks]);

  // Filter tasks
  const filteredTasks = useMemo(() => {
    if (!tasks || tasks.length === 0) return [];
    return tasks.filter(task => {
      if (!task) return false;
      const matchesSearch = !searchValue || 
        task.title?.toLowerCase().includes(searchValue.toLowerCase()) ||
        task.code?.toLowerCase().includes(searchValue.toLowerCase()) ||
        task.targetName?.toLowerCase().includes(searchValue.toLowerCase());

      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
      const matchesRound = roundFilter === 'all' || task.roundId === roundFilter;
      const matchesPlan = planFilter === 'all' || task.planId === planFilter;
      const matchesAssignee = assigneeFilter === 'all' || task.assignee?.name === assigneeFilter;
      const matchesType = typeFilter === 'all' || task.type === typeFilter;

      // Date range filter
      let matchesDateRange = true;
      if (dateRangeFilter.startDate || dateRangeFilter.endDate) {
        const taskDate = task.assignedDate ? new Date(task.assignedDate) : null;
        if (taskDate) {
          if (dateRangeFilter.startDate && taskDate < new Date(dateRangeFilter.startDate)) {
            matchesDateRange = false;
          }
          if (dateRangeFilter.endDate) {
            const endOfDay = new Date(dateRangeFilter.endDate);
            endOfDay.setHours(23, 59, 59, 999);
            if (taskDate > endOfDay) {
              matchesDateRange = false;
            }
          }
        }
      }

      return matchesSearch && matchesStatus && matchesPriority && matchesRound && matchesPlan && matchesAssignee && matchesType && matchesDateRange;
    });
  }, [tasks, searchValue, statusFilter, priorityFilter, roundFilter, planFilter, assigneeFilter, typeFilter, dateRangeFilter]);

  // Group tasks by status for Kanban
  const tasksByStatus = useMemo(() => {
    const grouped: Record<TaskStatus, InspectionTask[]> = {
      not_started: [],
      in_progress: [],
      pending_approval: [],
      completed: [],
      closed: [],
      cancelled: [],
      reopened: [],
    };

    filteredTasks.forEach(task => {
      const status = task.status as TaskStatus;
      if (grouped[status]) {
        grouped[status].push(task);
      }
    });

    return grouped;
  }, [filteredTasks]);

  // Pagination for list view
  const paginatedTasks = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTasks.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTasks, currentPage, itemsPerPage]);

  const handleTaskClick = (task: InspectionTask) => {
    // Navigate to task detail in future
    setSelectedTask(task);
    setIsDetailModalOpen(true);
  };

  const handleRefresh = () => {
    toast.success('Đã làm mới dữ liệu');
  };

  const handleExport = () => {
    toast.success('Đang xuất dữ liệu...');
  };

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    // Optimistic update
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, status: newStatus }
          : task
      )
    );

    // Update selected task to trigger re-render in modal
    setSelectedTask(prevTask => 
      prevTask && prevTask.id === taskId 
        ? { ...prevTask, status: newStatus }
        : prevTask
    );

    try {
      // Convert string status to numeric code for database
      const statusMap: Record<string, number> = {
        'not_started': 1,
        'in_progress': 2,
        'completed': 3,
        'closed': 4,
        'reopened': 5,
        'cancelled': 6
      };

      const numericStatus = statusMap[newStatus] || 1;
      
      await updateInspectionSessionApi(taskId, { status: numericStatus });
      toast.success(`Đã cập nhật trạng thái phiên làm việc thành công`);
    } catch (error) {
      console.error('Error updating task status:', error);
      toast.error('Không thể cập nhật trạng thái vào cơ sở dữ liệu');
    }
  };

  const clearFilters = () => {
    setSearchValue('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setRoundFilter('all');
    setPlanFilter('all');
    setAssigneeFilter('all');
    setTypeFilter('all');
    setDateRangeFilter({ startDate: null, endDate: null });
  };

  const hasActiveFilters = useMemo(() => {
    return !!(
      searchValue || 
      statusFilter !== 'all' || 
      priorityFilter !== 'all' || 
      roundFilter !== 'all' || 
      planFilter !== 'all' || 
      assigneeFilter !== 'all' || 
      typeFilter !== 'all' ||
      dateRangeFilter.startDate || 
      dateRangeFilter.endDate
    );
  }, [searchValue, statusFilter, priorityFilter, roundFilter, planFilter, assigneeFilter, typeFilter, dateRangeFilter]);

  // Advanced filter configuration - using correct AdvancedFilterModal format
  const filterConfigs: FilterConfig[] = [
    {
      key: 'type',
      label: 'Loại phiên',
      type: 'select',
      options: [
        { value: 'all', label: 'Tất cả loại' },
        { value: 'passive', label: 'Nguồn tin (Passive)' },
        { value: 'proactive', label: 'Kế hoạch (Proactive)' },
      ],
    },
    {
      key: 'status',
      label: 'Trạng thái',
      type: 'select',
      options: [
        { value: 'all', label: 'Tất cả trạng thái' },
        { value: 'not_started', label: 'Chưa bắt đầu' },
        { value: 'in_progress', label: 'Đang thực hiện' },
        { value: 'completed', label: 'Hoàn thành' },
        { value: 'closed', label: 'Đã đóng' },
      ],
    },
    {
      key: 'priority',
      label: 'Mức độ ưu tiên',
      type: 'select',
      options: [
        { value: 'all', label: 'Tất cả ưu tiên' },
        { value: 'urgent', label: 'Khẩn cấp' },
        { value: 'high', label: 'Cao' },
        { value: 'medium', label: 'Trung bình' },
        { value: 'low', label: 'Thấp' },
      ],
    },
    {
      key: 'assignee',
      label: 'Người thực hiện',
      type: 'select',
      options: [
        { value: 'all', label: 'Tất cả người thực hiện' },
        ...uniqueAssignees.map(assignee => ({ value: assignee, label: assignee })),
      ],
    },
    {
      key: 'dateRange',
      label: 'Ngày giao việc',
      type: 'daterange',
    },
  ];

  const filterValues = {
    status: statusFilter,
    priority: priorityFilter,
    round: roundFilter,
    plan: planFilter,
    assignee: assigneeFilter,
    type: typeFilter,
    dateRange: dateRangeFilter,
  };

  // Handle advanced filter change
  const handleFilterChange = (values: Record<string, any>) => {
    setStatusFilter(values.status || 'all');
    setPriorityFilter(values.priority || 'all');
    setRoundFilter(values.round || 'all');
    setPlanFilter(values.plan || 'all');
    setAssigneeFilter(values.assignee || 'all');
    setTypeFilter(values.type || 'all');
    setDateRangeFilter(values.dateRange || { startDate: null, endDate: null });
  };

  // Handle advanced filter apply
  const handleApplyFilters = () => {
    setIsFilterModalOpen(false);
    toast.success('Đã áp dụng b lọc');
  };

  // Handle advanced filter clear - KHÔNG cần làm gì vì AdvancedFilterModal đã xử lý
  const handleClearFilters = () => {
    // KHÔNG gọi clearFilters() ở đây nữa
    // Vì khi user click "Xóa tất cả" trong popup, chỉ xóa local state trong popup
    // Chỉ khi click "Áp dụng" thì mới update vào filter state chính thông qua handleFilterChange
  };

  // Handle drag and drop
  const handleDropTask = (taskId: string, newStatus: TaskStatus) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    // Allow drop into same column but don't change status (no-op)
    if (task.status === newStatus) {
      return; // Silent return, no toast, no state change
    }
    
    // Validate transition for different columns
    if (!canTransitionTo(task.status, newStatus)) {
      const fromLabel = STATUS_COLUMNS.find(c => c.key === task.status)?.label;
      const toLabel = STATUS_COLUMNS.find(c => c.key === newStatus)?.label;
      toast.error(`Không thể chuyển từ \"${fromLabel}\" sang \"${toLabel}\"`, {
        description: 'Vui lòng tuân thủ quy trình làm việc',
        duration: 3000,
      });
      return;
    }
    
    // Confirm if cancelling
    if ((newStatus as string) === 'cancelled') {
      const taskToCancel = tasks.find(t => t.id === taskId);
      if (taskToCancel) {
        setCancelTask(taskToCancel);
      }
      return;
    }
    const statusLabel = STATUS_COLUMNS.find(c => c.key === newStatus)?.label || newStatus;
    
    // Call centralized handler to update both state and database
    handleStatusChange(taskId, newStatus);
    
    // handleStatusChange already shows success toast, but we can show one here specifically for D&D feedback if needed. 
    // However, duplication might avoid.
    // We'll keep existing behavior but maybe remove duplicate toast later. 
    // For now just add confirm.
    if (newStatus !== 'cancelled') {
       // Only show specific move toast if not cancelled (since cancel handle has own logic? No handleStatusChange is generic)
       // Let's just leave it, double toast is minor issue compared to missing confirm.
       toast.success(`Đã chuyển "${task?.title}" sang "${statusLabel}"`, {
         duration: 2000,
       });
    }
  };

  // Auto-filter by inspectionRound query parameter
  useEffect(() => {
    const inspectionRoundParam = searchParams.get('inspectionRound');
    if (inspectionRoundParam) {
      const decodedRound = decodeURIComponent(inspectionRoundParam);
      setRoundFilter(decodedRound);
      toast.info(`Đã lọc nhiệm vụ theo đợt kiểm tra: ${decodedRound}`);
    }
  }, [searchParams]);

  // Handle create task
  const handleCreateOrUpdateTask = async (formData: CreateTaskFormData, taskId?: string) => {
    if (taskId) {
      // HANDLE EDIT
      try {
        await updateInspectionSessionApi(taskId, {
          name: formData.title,
          description: formData.description,
          merchant_id: formData.merchantId,
          campaign_id: formData.roundId,
          user_id: formData.assigneeId || null,
          start_time: formData.startDate,
          deadline_time: formData.dueDate,
          status: formData.status === 'not_started' ? 1 : 
                  formData.status === 'in_progress' ? 2 : 
                  formData.status === 'completed' ? 3 : 
                  formData.status === 'closed' ? 4 : 5,
        });

        toast.success(`Đã cập nhật nhiệm vụ "${formData.title}" thành công!`);
        // Refresh local list
        loadSessions();
      } catch (error) {
        console.error('Error updating task:', error);
        toast.error('Có lỗi xảy ra khi cập nhật nhiệm vụ');
      }
      return;
    }

    // HANDLE CREATE
    try {
      const newSession = await createInspectionSessionApi({
        name: formData.title,
        description: formData.description,
        merchant_id: formData.merchantId,
        campaign_id: formData.roundId,
        user_id: formData.assigneeId || null,
        start_time: formData.startDate,
        deadline_time: formData.dueDate,
        status: 1, // not_started
        type: 'proactive', // Default to proactive per user request
      });

      if (newSession) {
        toast.success(`Đã tạo nhiệm vụ "${formData.title}" thành công!`);
        // Refresh local list
        loadSessions();
      }
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Có lỗi xảy ra khi tạo nhiệm vụ');
    }
  };

  // Action handlers for task actions
  const handleStartTask = (task: InspectionTask) => {
    setActionTask(task);
    setIsDeployModalOpen(true);
  };

  const handleConfirmStartTask = () => {
    if (actionTask) {
      handleStatusChange(actionTask.id, 'in_progress');
      // In a real app, we would also update the startDate of the task here
      setIsDeployModalOpen(false);
      setActionTask(null);
    }
  };

  const handleConfirmCompleteTask = () => {
    if (actionTask) {
      handleStatusChange(actionTask.id, 'completed');
      toast.success(`Đã hoàn thành phiên làm việc \"${actionTask.title}\"`);
      setIsCompleteModalOpen(false);
      setActionTask(null);
    }
  };


  const handleEnterResults = (task: InspectionTask) => {
    setActionTask(task);
    setIsEnterResultsModalOpen(true);
  };

  const handleAttachEvidence = (task: InspectionTask) => {
    setActionTask(task);
    setIsAttachEvidenceModalOpen(true);
  };

  const handleReopen = (task: InspectionTask) => {
    setActionTask(task);
    setIsReopenModalOpen(true);
  };

  const handleCloseTask = (task: InspectionTask) => {
    handleStatusChange(task.id, 'closed');
    toast.success(`Đã đóng phiên làm việc \"${task.title}\"`);
  };

  const handleCompleteTask = (task: InspectionTask) => {
    setActionTask(task);
    setIsCompleteModalOpen(true);
  };

  // Handle edit task button click
  const handleEditTaskClick = (task: InspectionTask) => {
    setSelectedTask(task);
    setIsDetailModalOpen(false); // Close detail modal if open
    setIsEditModalOpen(true);
  };

  // Generate actions for task based on status (like InspectionRoundsList)
  const getTaskActions = (task: InspectionTask): Action[] => {
    const actions: Action[] = [];

    // Helper to add Cancel Action
    const addCancelAction = () => {
      actions.push({
        label: 'Hủy',
        icon: <XCircle size={16} />,
        priority: 1,
        variant: 'destructive',
        onClick: () => {
          setCancelTask(task);
        },
      });
    };

    switch (task.status) {
      case 'not_started':
        // Chưa bắt đầu: Xem chi tiết, Chỉnh sửa, Bắt đầu, Hủy
        actions.push(
          {
            label: 'Xem chi tiết',
            icon: <Eye size={16} />,
            onClick: () => handleTaskClick(task),
            priority: 10,
          },
          {
            label: 'Chỉnh sửa',
            icon: <Edit size={16} />,
            onClick: () => handleEditTaskClick(task),
            priority: 9,
          },
          {
            label: 'Bắt đầu',
            icon: <Play size={16} />,
            onClick: () => handleStartTask(task),
            priority: 8,
          }
        );
        addCancelAction();
        break;

      case 'in_progress':
        // Đang thực hiện: Xem chi tiết, Chỉnh sửa, Nhập kết quả, Đính kèm chứng cứ, Hủy
        actions.push(
          {
            label: 'Xem chi tiết',
            icon: <Eye size={16} />,
            onClick: () => handleTaskClick(task),
            priority: 11,
          },
          {
            label: 'Chỉnh sửa',
            icon: <Edit size={16} />,
            onClick: () => handleEditTaskClick(task),
            priority: 9,
          },
          {
            label: 'Nhập kết quả',
            icon: <FileText size={16} />,
            onClick: () => handleEnterResults(task),
            priority: 8,
          },
          {
            label: 'Đính kèm chứng cứ',
            icon: <Paperclip size={16} />,
            onClick: () => handleAttachEvidence(task),
            priority: 7,
          },
          {
            label: 'Hoàn thành',
            icon: <CheckCircle size={16} />,
            onClick: () => handleCompleteTask(task),
            priority: 10,
          }
        );
        addCancelAction();
        break;

      case 'completed':
        // Hoàn thành: Xem chi tiết, Biên bản kiểm tra, Bảng kê, Phụ lục, Chỉnh sửa, Mở lại, Đóng
        actions.push(
          {
            label: 'Xem chi tiết',
            icon: <Eye size={16} />,
            onClick: () => handleTaskClick(task),
            priority: 10,
          },
          {
            label: 'Biên bản kiểm tra',
            icon: <FileText size={16} />,
            onClick: () => {
              setActionTask(task);
              setIsForm06ModalOpen(true);
            },
            priority: 9,
          },
          {
            label: 'Bảng kê',
            icon: <Table size={16} />,
            onClick: () => {
              setActionTask(task);
              setIsForm10ModalOpen(true);
            },
            priority: 8,
          },
          {
            label: 'Phụ lục',
            icon: <FileText size={16} />,
            onClick: () => {
              setActionTask(task);
              setIsForm11ModalOpen(true);
            },
            priority: 7,
          },
          {
            label: 'Chỉnh sửa',
            icon: <Edit size={16} />,
            onClick: () => handleEditTaskClick(task),
            priority: 6,
          },
          {
            label: 'Mở lại',
            icon: <RotateCcw size={16} />,
            onClick: () => handleReopen(task),
            priority: 5,
          },
          {
            label: 'Đóng',
            icon: <XCircle size={16} />,
            onClick: () => handleCloseTask(task),
            priority: 4,
          }
        );
        break;

      case 'closed':
      case 'cancelled':
        // Đã đóng/Hủy: Xem chi tiết, Mở lại
        actions.push(
          {
            label: 'Xem chi tiết',
            icon: <Eye size={16} />,
            onClick: () => handleTaskClick(task),
            priority: 10,
          },
          {
            label: 'Mở lại',
            icon: <RotateCcw size={16} />,
            onClick: () => handleReopen(task),
            priority: 9,
          }
        );
         if (task.status === 'closed') {
             actions.push(
               {
                 label: 'Biên bản kiểm tra',
                 icon: <FileText size={16} />,
                 onClick: () => {
                   setActionTask(task);
                   setIsForm06ModalOpen(true);
                 },
                 priority: 8,
               },
               {
                 label: 'Bảng kê',
                 icon: <Table size={16} />,
                 onClick: () => {
                   setActionTask(task);
                   setIsForm10ModalOpen(true);
                 },
                 priority: 7,
               },
               {
                 label: 'Phụ lục',
                 icon: <FileText size={16} />,
                 onClick: () => {
                   setActionTask(task);
                   setIsForm11ModalOpen(true);
                 },
                 priority: 6,
               }
             );
         }
        break;

      case 'reopened':
         // Mở lại: Treat as In Progress basically
        actions.push(
          {
            label: 'Xem chi tiết',
            icon: <Eye size={16} />,
            onClick: () => handleTaskClick(task),
            priority: 11,
          },
          {
            label: 'Chỉnh sửa',
            icon: <Edit size={16} />,
            onClick: () => handleEditTaskClick(task),
            priority: 9,
          },
          {
            label: 'Nhập kết quả',
            icon: <FileText size={16} />,
            onClick: () => handleEnterResults(task),
            priority: 8,
          },
          {
            label: 'Đính kèm chứng cứ',
            icon: <Paperclip size={16} />,
            onClick: () => handleAttachEvidence(task),
            priority: 7,
          },
          {
            label: 'Bắt đầu',
            icon: <Play size={16} />,
            onClick: () => handleStartTask(task),
            priority: 10,
          }
        );
        addCancelAction();
        break;

      default:
        actions.push(
          {
            label: 'Xem chi tiết',
            icon: <Eye size={16} />,
            onClick: () => handleTaskClick(task),
            priority: 10,
          }
        );
    }

    return actions;
  };

  // Table columns for list view
  const columns: Column<InspectionTask>[] = [
    {
      key: 'title',
      label: 'Tên nhiệm vụ',
      sortable: true,
      render: (task) => (
        <div>
          <div className={styles.taskTitleCell}>{task?.title || 'N/A'}</div>
          <div className={styles.taskTargetCell}>{task?.targetName || ''}</div>
        </div>
      ),
    },
    {
      key: 'roundId',
      label: 'Đợt kiểm tra',
      sortable: true,
      render: (task) => (
        <div>
          <div className={styles.taskTitleCell}>{task?.roundId || 'N/A'}</div>
          {task?.planName && (
            <div className={styles.taskTargetCell}>{task.planName}</div>
          )}
        </div>
      ),
    },
    {
      key: 'targetName',
      label: 'Tên cửa hàng',
      sortable: true,
      render: (task) => task?.targetName || 'N/A',
    },
    {
      key: 'status',
      label: 'Trạng thái',
      sortable: true,
      render: (task) => task?.status ? <StatusBadge {...getStatusProps('task', task.status)} size="sm" /> : <span>-</span>,
    },
    {
      key: 'type',
      label: 'Loại',
      sortable: true,
      render: (task) => task?.type ? <StatusBadge {...getStatusProps('sessionType', task.type)} size="sm" /> : <span>--</span>,
    },
    {
      key: 'priority',
      label: 'Ưu tiên',
      sortable: true,
      render: (task) => task?.priority ? <StatusBadge {...getStatusProps('priority', task.priority)} size="sm" /> : <span>-</span>,
    },
    {
      key: 'assignee',
      label: 'Người thực hiện',
      sortable: true,
      render: (task) => task?.assignee?.name || 'N/A',
    },
    {
      key: 'dueDate',
      label: 'Hạn hoàn thành',
      sortable: true,
      render: (task) => {
        if (!task?.dueDate) return <span>-</span>;
        const dueDate = new Date(task.dueDate);
        const today = new Date();
        const isOverdue = dueDate < today && task.status !== 'completed';
        
        return (
          <span className={isOverdue ? styles.overdueDateCell : ''}>
            {dueDate.toLocaleDateString('vi-VN')}
          </span>
        );
      },
    },
    {
      key: 'actions',
      label: 'Thao tác',
      sortable: false,
      sticky: 'right',
      width: '170px',
      render: (task) => (
        <ActionColumn 
          actions={getTaskActions(task)} 
          style={{ justifyContent: 'flex-start' }} 
        />
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <PageHeader
        title="Phiên làm việc"
        breadcrumbs={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Phiên làm việc' },
        ]}
        actions={
          <>
            <div className={styles.viewToggle}>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'kanban' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('kanban')}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>

            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>

            <Button variant="outline" size="sm" onClick={() => setIsForm12ModalOpen(true)}>
              <BookOpen className="h-4 w-4 mr-2" />
              Nhật ký kiểm tra
            </Button>

            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Xuất dữ liệu
            </Button>

            <Button size="sm" onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Tạo phiên làm việc
            </Button>
          </>
        }
      />

      {/* Filters Bar */}
      <div className={styles.summaryContainer}>
        <FilterActionBar
          filters={
            <>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsFilterModalOpen(true)}
              >
                <Filter size={16} />
                Bộ lọc
              </Button>

              <Select value={planFilter} onValueChange={setPlanFilter}>
                <SelectTrigger style={{ width: '220px' }}>
                  <SelectValue placeholder="Kế hoạch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả kế hoạch</SelectItem>
                  {planOptions.map(plan => (
                    <SelectItem key={plan.value} value={plan.value}>
                      {plan.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={roundFilter} onValueChange={setRoundFilter}>
                <SelectTrigger style={{ width: '220px' }}>
                  <SelectValue placeholder="Đợt kiểm tra" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả đợt</SelectItem>
                  {roundOptions.map(round => (
                    <SelectItem key={round.value} value={round.value}>
                      {round.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <SearchInput
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Tìm kiếm phiên làm việc..."
                style={{ width: '400px' }}
              />
            </>
          }
        />
      </div>

      {/* Loading state */}
      {loading ? (
        <div className={styles.loadingContainer} style={{ padding: '60px', textAlign: 'center' }}>
          <RefreshCw className="animate-spin h-8 w-8 mx-auto mb-4" style={{ color: 'var(--primary)' }} />
          <p>Đang tải dữ liệu từ hệ thống...</p>
        </div>
      ) : (
        <>
          {/* Kanban View */}
          {viewMode === 'kanban' && (
            <>
              {filteredTasks.length === 0 ? (
            <div className={styles.emptyStateContainer}>
              <EmptyState
                type="empty"
                title={hasActiveFilters ? "Không tìm thấy kết quả" : "Chưa có phiên làm việc"}
                description={
                  hasActiveFilters
                    ? "Không tìm thấy phiên làm việc nào phù hợp với từ khóa tìm kiếm hoặc bộ lọc. Hãy thử điều chỉnh lại từ khóa hoặc xóa bộ lọc."
                    : "Chưa có phiên làm việc nào được tạo. Hãy tạo phiên làm việc đầu tiên để bắt đầu."
                }
                action={
                  hasActiveFilters
                    ? {
                        label: 'Xóa bộ lọc',
                        onClick: clearFilters,
                      }
                    : {
                        label: 'Tạo phiên làm việc',
                        onClick: () => setIsCreateModalOpen(true),
                      }
                }
              />
            </div>
          ) : (
            <DndProvider backend={HTML5Backend}>
              <div className={styles.kanbanContainer}>
                {STATUS_COLUMNS.map(column => {
                  const tasks = tasksByStatus[column.key];

                  return (
                    <KanbanColumn
                      key={column.key}
                      column={column}
                      tasks={tasks}
                      onTaskClick={handleTaskClick}
                      onDropTask={handleDropTask}
                      getTaskActions={getTaskActions} // Add this prop
                    />
                  );
                })}
              </div>
            </DndProvider>
          )}
        </>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <>
          {filteredTasks.length === 0 ? (
            <div className={styles.emptyStateContainer}>
              <EmptyState
                type="empty"
                title={hasActiveFilters ? "Không tìm thấy kết quả" : "Chưa có phiên làm việc"}
                description={
                  hasActiveFilters
                    ? "Không tìm thấy phiên làm việc nào phù hợp với từ khóa tìm kiếm hoặc bộ lọc. Hãy thử điều chỉnh lại từ khóa hoặc xóa bộ lọc."
                    : "Chưa có phiên làm việc nào được tạo. Hãy tạo phiên làm việc đầu tiên để bắt đầu."
                }
                action={
                  hasActiveFilters
                    ? {
                        label: 'Xóa bộ lọc',
                        onClick: clearFilters,
                      }
                    : {
                        label: 'Tạo phiên làm việc',
                        onClick: () => setIsCreateModalOpen(true),
                      }
                }
              />
            </div>
          ) : (
            <div className={styles.tableContainer}>
              <Card>
                <CardContent className={styles.tableCard}>
                  <DataTable
                    data={paginatedTasks}
                    columns={columns}
                    onRowClick={handleTaskClick}
                  />
                </CardContent>
                <TableFooter
                  currentPage={currentPage}
                  totalPages={Math.ceil(filteredTasks.length / itemsPerPage)}
                  totalRecords={filteredTasks.length}
                  pageSize={itemsPerPage}
                  onPageChange={setCurrentPage}
                  onPageSizeChange={(value) => {
                    setItemsPerPage(value);
                    setCurrentPage(1);
                  }}
                />
              </Card>
            </div>
          )}
        </>
      )}

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateOrUpdateTask}
      />

      {/* Edit Task Modal - REUSING CreateTaskModal */}
      <CreateTaskModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedTask(null);
        }}
        onSubmit={handleCreateOrUpdateTask}
        task={selectedTask}
        taskId={selectedTask?.id}
      />

      {/* Task Detail Modal */}
      <TaskDetailModal
        task={selectedTask}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onStatusChange={(id, status) => {
          if (status === 'cancelled') {
            const task = tasks.find(t => t.id === id);
            if (task) setCancelTask(task);
          } else {
            handleStatusChange(id, status);
          }
        }}
        onEdit={handleEditTaskClick}
        onCompleteTask={handleCompleteTask}
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

      {/* Action Modals */}
      <InspectionResultModal
        session={actionTask ? {
          id: actionTask.id,
          code: actionTask.code,
          title: actionTask.title,
          date: new Date(actionTask.dueDate).toLocaleDateString('vi-VN')
        } : null}
        isOpen={isEnterResultsModalOpen}
        onClose={() => setIsEnterResultsModalOpen(false)}
        onSave={() => {
          toast.success('Đã lưu kết quả kiểm tra');
        }}
        onComplete={() => {
          if (actionTask) {
            handleCompleteTask(actionTask);
          }
        }}
      />

      <ReopenTaskModal
        isOpen={isReopenModalOpen}
        onClose={() => setIsReopenModalOpen(false)}
        taskTitle={actionTask?.title || ''}
        taskId={actionTask?.id || ''}
        onReopen={() => {
          if (actionTask) {
            const updatedTask = {
              ...actionTask,
              reopenedAt: new Date().toISOString(),
              reopenedBy: { id: 'current-user', name: 'Người dùng hiện tại' },
            };
            setTasks(prev => prev.map(t => t.id === actionTask.id ? updatedTask as InspectionTask : t));
            handleStatusChange(actionTask.id, 'reopened');
            toast.success('Đã mở lại phiên làm việc');
          }
        }}
      />

      <CancelTaskModal
        isOpen={!!cancelTask}
        onClose={() => setCancelTask(null)}
        task={cancelTask}
        onConfirm={() => {
          if (cancelTask) {
            handleStatusChange(cancelTask.id, 'cancelled');
            setCancelTask(null);
            if (isDetailModalOpen && selectedTask?.id === cancelTask.id) {
              setIsDetailModalOpen(false);
            }
          }
        }}
      />

      <AttachEvidenceModal
        isOpen={isAttachEvidenceModalOpen}
        onClose={() => setIsAttachEvidenceModalOpen(false)}
        taskTitle={actionTask?.title || ''}
        taskId={actionTask?.id || ''}
        onSubmit={() => {
          toast.success(`Đã đính kèm file chứng cứ`);
        }}
      />

      <Form06Modal
        open={isForm06ModalOpen}
        onOpenChange={setIsForm06ModalOpen}
        task={actionTask}
      />

      <Form10Modal
        open={isForm10ModalOpen}
        onOpenChange={setIsForm10ModalOpen}
        task={actionTask}
      />

      <Form12Modal
        open={isForm12ModalOpen}
        onOpenChange={setIsForm12ModalOpen}
      />

      <Form11Modal
        open={isForm11ModalOpen}
        onOpenChange={setIsForm11ModalOpen}
        task={actionTask || undefined}
      />

      <DeployTaskModal
        isOpen={isDeployModalOpen}
        onClose={() => {
          setIsDeployModalOpen(false);
          setActionTask(null);
        }}
        task={actionTask}
        onConfirm={handleConfirmStartTask}
      />

      <CompleteTaskModal
        isOpen={isCompleteModalOpen}
        onClose={() => {
          setIsCompleteModalOpen(false);
          setActionTask(null);
        }}
        task={actionTask}
        onConfirm={handleConfirmCompleteTask}
      />

        </>
      )}
    </div>
  );
}

export default TaskBoard;
