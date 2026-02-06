import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  FileText,
  Users,
  Plus,
  TrendingUp,
  Download,
  Edit,
  CheckCircle,
  AlertCircle,
  Target,
  ClipboardCheck,
  BarChart3,
  Eye,
  Trash2,
  Upload,
  XCircle,
  RefreshCw,
  Play,
  RotateCcw,
  Paperclip,
  Table,
} from 'lucide-react';

import styles from './InspectionRoundDetail.module.css';
import { StatusBadge } from '@/components/common/StatusBadge';
import { getStatusProps } from '@/utils/status-badge-helper';
import CreateTaskModal, { type CreateTaskFormData } from '@/components/tasks/CreateTaskModal';
import { InsFormDetailDialog } from '@/components/inspections/InsFormDetailDialog';
import TaskDetailModal from '@/components/tasks/TaskDetailModal';
import { type InspectionTask } from '@/utils/data/inspection-tasks-mock-data';
import { CancelTaskModal, DeployTaskModal, CompleteTaskModal } from '@/components/tasks/TaskActionModals';
import ReopenTaskModal from '@/components/tasks/ReopenTaskModal';
import AttachEvidenceModal from '@/components/tasks/AttachEvidenceModal';
import InspectionResultModal from '@/components/sessions/InspectionResultModal';
import { Form06Modal } from '@/components/tasks/Form06Modal';
import { Form10Modal } from '@/components/tasks/Form10Modal';
import { Form11Modal } from '@/components/tasks/Form11Modal';
import DataTable, { type Column } from '@/components/ui-kit/DataTable';
import ActionColumn, { type Action } from '@/components/patterns/ActionColumn';
import EmptyState from '@/components/ui-kit/EmptyState';

import { fetchInspectionSessionsApi, createInspectionSessionApi, updateInspectionSessionApi } from '@/utils/api/inspectionSessionsApi';
import { useSupabaseInspectionRound } from '@/hooks/useSupabaseInspectionRound';
import { toast } from 'sonner';
import { useEffect } from 'react';

type TabType = 'overview' | 'sessions' | 'team' | 'scope' | 'history';

const TABS = [
  { id: 'overview' as TabType, label: 'Tổng quan' },
  { id: 'sessions' as TabType, label: 'Phiên kiểm tra', badge: 6 },
  { id: 'team' as TabType, label: 'Nhân sự', badge: 4 },
  { id: 'scope' as TabType, label: 'Phạm vi' },
  { id: 'history' as TabType, label: 'Lịch sử cập nhật', badge: 12 },
];





// Mock team members data
const mockTeamMembers = [
  {
    id: '1',
    name: 'Nguyễn Văn A',
    position: 'Đội trưởng',
    role: 'leader',
    avatar: 'NVA',
  },
  {
    id: '2',
    name: 'Trần Thị B',
    position: 'Thanh tra viên',
    role: 'member',
    avatar: 'TTB',
  },
  {
    id: '3',
    name: 'Lê Văn C',
    position: 'Thanh tra viên',
    role: 'member',
    avatar: 'LVC',
  },
  {
    id: '4',
    name: 'Phạm Thị D',
    position: 'Thanh tra viên',
    role: 'member',
    avatar: 'PTD',
  },
];

// Mock history data với tham chiếu biểu mẫu INS
const mockHistory = [
  {
    id: 'h-12',
    timestamp: '2025-01-15T16:30:00',
    user: 'Nguyễn Văn A',
    action: 'Cập nhật tiến độ đợt kiểm tra',
    type: 'update' as const,
    description: 'Đã hoàn thành 9/15 phiên kiểm tra, cập nhật tiến độ từ 55% lên 65%',
    insForm: null,
  },
  {
    id: 'h-11',
    timestamp: '2025-01-14T10:15:00',
    user: 'Trần Thị B',
    action: 'Hoàn thành phiên kiểm tra',
    type: 'session_complete' as const,
    description: 'Đã hoàn thành phiên kiểm tra PS-009 tại Siêu thị CoopMart',
    insForm: {
      code: 'BB-KT-009',
      type: 'Mẫu 06',
      name: 'Biên bản kiểm tra',
    },
  },
  {
    id: 'h-10',
    timestamp: '2025-01-12T14:45:00',
    user: 'Nguyễn Văn A',
    action: 'Chỉnh sửa thông tin đợt kiểm tra',
    type: 'edit' as const,
    description: 'Cập nhật phạm vi kiểm tra: thêm phường Nguyễn Cư Trinh vào danh sách',
    insForm: {
      code: '01/QĐ-KT',
      type: 'Mẫu 01',
      name: 'Quyết định kiểm tra',
    },
  },
  {
    id: 'h-9',
    timestamp: '2025-01-10T09:20:00',
    user: 'Lê Văn C',
    action: 'Tạo phiên kiểm tra mới',
    type: 'session_create' as const,
    description: 'Đã tạo phiên kiểm tra PS-008 tại Cửa hàng Thực phẩm Sạch',
    insForm: null,
  },
  {
    id: 'h-8',
    timestamp: '2025-01-09T11:00:00',
    user: 'Nguyễn Văn A',
    action: 'Import biểu mẫu từ INS',
    type: 'import' as const,
    description: 'Đã import Thông báo KT-TB từ hệ thống INS',
    insForm: {
      code: '03/KT-TB',
      type: 'Mẫu 03',
      name: 'Thông báo kiểm tra',
    },
  },
  {
    id: 'h-7',
    timestamp: '2025-01-08T15:30:00',
    user: 'Phạm Thị D',
    action: 'Xóa phiên kiểm tra',
    type: 'session_delete' as const,
    description: 'Đã xóa phiên kiểm tra PS-007 do cơ sở đã ngưng hoạt động',
    insForm: null,
  },
  {
    id: 'h-6',
    timestamp: '2025-01-07T08:45:00',
    user: 'Nguyễn Văn A',
    action: 'Cập nhật nhân sự',
    type: 'team_update' as const,
    description: 'Thêm Phạm Thị D vào đội kiểm tra',
    insForm: {
      code: '05/QĐ-PC',
      type: 'Mẫu 02',
      name: 'Quyết định phân công',
    },
  },
  {
    id: 'h-5',
    timestamp: '2025-01-05T16:00:00',
    user: 'Trần Thị B',
    action: 'Hoàn thành phiên kiểm tra',
    type: 'session_complete' as const,
    description: 'Đã hoàn thành phiên kiểm tra PS-002 tại Siêu thị mini Phú Thọ - Không vi phạm',
    insForm: {
      code: 'BB-KT-002',
      type: 'Mẫu 06',
      name: 'Biên bản kiểm tra',
    },
  },
  {
    id: 'h-4',
    timestamp: '2025-01-05T13:30:00',
    user: 'Nguyễn Văn A',
    action: 'Hoàn thành phiên kiểm tra',
    type: 'session_complete' as const,
    description: 'Đã hoàn thành phiên kiểm tra PS-001 tại Cửa hàng Thực phẩm An Khang - Phát hiện 2 vi phạm',
    insForm: {
      code: 'BB-KT-001',
      type: 'Mẫu 06',
      name: 'Biên bản kiểm tra',
    },
  },
  {
    id: 'h-3',
    timestamp: '2025-01-03T10:00:00',
    user: 'Nguyễn Văn A',
    action: 'Import biểu mẫu từ INS',
    type: 'import' as const,
    description: 'Đã import Quyết định phân công từ hệ thống INS',
    insForm: {
      code: '05/QĐ-PC',
      type: 'Mẫu 02',
      name: 'Quyết định phân công',
    },
  },
  {
    id: 'h-2',
    timestamp: '2025-01-02T14:30:00',
    user: 'Nguyễn Văn A',
    action: 'Import biểu mẫu từ INS',
    type: 'import' as const,
    description: 'Đã import Quyết định kiểm tra từ hệ thống INS',
    insForm: {
      code: '01/QĐ-KT',
      type: 'Mẫu 01',
      name: 'Quyết định kiểm tra',
    },
  },
  {
    id: 'h-1',
    timestamp: '2025-01-01T09:00:00',
    user: 'Nguyễn Văn A',
    action: 'Tạo đợt kiểm tra',
    type: 'create' as const,
    description: 'Đã tạo đợt kiểm tra mới "Kiểm tra Tết Nguyên Đán 2025"',
    insForm: null,
  },
];

export default function InspectionRoundDetail() {
  const { roundId } = useParams();
  const navigate = useNavigate();
  const { round: data, loading, error, updateStatus } = useSupabaseInspectionRound(roundId);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [sessions, setSessions] = useState<any[]>([]);
  const [showInsFormDetail, setShowInsFormDetail] = useState(false);
  const [selectedInsForm, setSelectedInsForm] = useState<{ code: string; type: string; name: string } | null>(null);
  const [selectedTask, setSelectedTask] = useState<InspectionTask | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any | null>(null);
  const [taskModalState, setTaskModalState] = useState<{
    type: 'cancel' | 'deploy' | 'complete' | null;
    task: any | null;
  }>({ type: null, task: null });

  // Additional modal states for full parity with TaskBoard
  const [isReopenModalOpen, setIsReopenModalOpen] = useState(false);
  const [isAttachEvidenceModalOpen, setIsAttachEvidenceModalOpen] = useState(false);
  const [isEnterResultsModalOpen, setIsEnterResultsModalOpen] = useState(false);
  const [isForm06ModalOpen, setIsForm06ModalOpen] = useState(false);
  const [isForm10ModalOpen, setIsForm10ModalOpen] = useState(false);
  const [isForm11ModalOpen, setIsForm11ModalOpen] = useState(false);
  
  // We need a separate state for the task being acted upon by these new modals
  // reusing selectedTask might conflict with View Detail, so let's check.
  // View Detail uses setSelectedTask + setIsDetailModalOpen.
  // We can reuse selectedTask for these action modals if we are careful, 
  // or use a separate 'actionTask' state like TaskBoard to be safe.
  const [actionTask, setActionTask] = useState<any | null>(null);
  
  // Selection State
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

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
      setSelectedRows(new Set(sessions.map((s) => s.id)));
    } else {
      setSelectedRows(new Set());
    }
  };


  useEffect(() => {
    const loadSessions = async () => {
      if (!roundId) return;
      try {
        const data = await fetchInspectionSessionsApi(roundId);
        // Map API sessions to match the UI format if needed
        // Map API sessions to match the UI format if needed
        const mapped = data.map(s => {
          return {
            id: s.id,
            code: s.id,
            title: s.name,
            roundId: roundId,
            planName: 'Kế hoạch năm 2025', // Should be fetched or passed
            targetName: s.merchantName,
            targetAddress: s.merchantAddress,
            assignee: { name: s.userName || 'Chưa phân công' },
            dueDate: s.startTime || s.deadlineTime,
            status: s.status, // Use direct status from API mapping
            type: s.type || 'proactive',
            priority: 'medium',
            roundName: 'Đợt kiểm tra hiện tại',
            description: s.description || s.note, // Prioritize description
            merchantId: s.merchantId,
            merchantName: s.merchantName, // Ensure merchantName is passed if needed as targetName fallback
            assigneeId: s.userId, // Map userId to assigneeId if used, though modal uses userId or assignee.id
            userId: s.userId,
            startDate: s.startTime,
          };
        });
        setSessions(mapped);
      } catch (err) {
        console.error('Error fetching sessions:', err);
      } finally {
        // loading state handled by parent if needed
      }
    };
    loadSessions();
  }, [roundId]);

  const handleCreateTask = async (formData: CreateTaskFormData, taskId?: string) => {
    try {
      // API expects numeric status. Map string to number.
      // 1: not_started, 2: in_progress, 3: completed, 4: closed, 5: reopened, 6: cancelled
      const statusMap: Record<string, number> = {
        'not_started': 1,
        'in_progress': 2,
        'completed': 3,
        'closed': 4,
        'reopened': 5,
        'cancelled': 6
      };

      if (taskId) {
        // UPDATE MODE
        await updateInspectionSessionApi(taskId, {
          campaign_id: formData.roundId,
          merchant_id: formData.merchantId,
          user_id: formData.assigneeId || null,
          department_id: formData.departmentId || null, // Add department_id
          start_time: formData.startDate,
          deadline_time: formData.dueDate,
          description: formData.description,
          note: '', // Clear note or keep separate if needed, but user wants description
          name: formData.title,
          status: statusMap[formData.status] || 1, 
          priority: formData.priority === 'urgent' ? 4 : 
                    formData.priority === 'high' ? 3 : 
                    formData.priority === 'low' ? 1 : 2,
        });
        toast.success(`Đã cập nhật phiên làm việc "${formData.title}"`);
      } else {
        // CREATE MODE
        await createInspectionSessionApi({
          campaign_id: formData.roundId,
          merchant_id: formData.merchantId,
          user_id: formData.assigneeId || null,
          department_id: formData.departmentId || null, // Add department_id
          start_time: formData.startDate,
          deadline_time: formData.dueDate,
          description: formData.description, // Save to description
          note: '',
          name: formData.title,
          type: 'proactive',
          status: statusMap[formData.status] || 1, 
          priority: formData.priority === 'urgent' ? 4 : 
                    formData.priority === 'high' ? 3 : 
                    formData.priority === 'low' ? 1 : 2,
        });
        toast.success(`Đã tạo phiên làm việc "${formData.title}" thành công`);
      }

      // Refresh session list
      const updatedSessions = await fetchInspectionSessionsApi(roundId!);
      const mapped = updatedSessions.map(s => {
        // Map to InspectionTask-like structure for DataTable
        return {
          id: s.id,
          code: s.id,
          title: s.name,
          roundId: roundId,
          planName: 'Kế hoạch năm 2025', // Should be fetched or passed
          targetName: s.merchantName,
          targetAddress: s.merchantAddress,
          assignee: { name: s.userName || 'Chưa phân công' },
          dueDate: s.startTime || s.deadlineTime,
          status: s.status, // Use direct status from API mapping
          type: s.type || 'proactive',
          priority: 'medium', // Default if missing
          roundName: 'Đợt kiểm tra hiện tại',

          // Preserve other fields needed for edit
          description: s.description || s.note,
          merchantId: s.merchantId,
          userId: s.userId,
          startDate: s.startTime,
        };
      });
      setSessions(mapped);
      setShowCreateDialog(false);
      setEditingTask(null);
      
      // Also refresh if action modals update status
      setTaskModalState({ type: null, task: null });
      setActionTask(null);
      
    } catch (err) {
      console.error('Error saving session:', err);
      toast.error('Có lỗi xảy ra khi lưu thông tin');
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>
          <RefreshCw className={styles.loadingIcon} size={40} />
          <p>Đang tải thông tin đợt kiểm tra...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <h3 className={styles.emptyTitle}>{error || 'Không tìm thấy đợt kiểm tra'}</h3>
          <button className={styles.primaryButton} onClick={() => navigate('/plans/inspection-rounds')}>
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  const percentIncrease = data.stats 
    ? Math.round(((data.stats.storesInspected - data.stats.storesPlanned) / data.stats.storesPlanned) * 100)
    : 0;

  const handleBack = () => {
    navigate('/plans/inspection-rounds');
  };

  const handleEdit = () => {
    navigate(`/plans/inspection-rounds/create-new?mode=edit&id=${encodeURIComponent(data.id)}`);
  };

  const handleComplete = async () => {
    try {
      await updateStatus('completed');
      toast.success('Đã hoàn thành đợt kiểm tra');
    } catch (err) {
      toast.error('Lỗi khi cập nhật trạng thái');
    }
  };

  const handleInsFormClick = (insForm: { code: string; type: string; name: string }) => {
    setSelectedInsForm(insForm);
    setShowInsFormDetail(true);
  };

  const handleViewDetail = (session: any) => {
    const task: any = {
      ...session, // session already mapped
    };
    setSelectedTask(task);
    setIsDetailModalOpen(true);
  };

  const loadSessions = async () => {
      if (!roundId) return;
      try {
        const sessionsData = await fetchInspectionSessionsApi(roundId);
        const mapped = sessionsData.map(s => {
          return {
            id: s.id,
            code: s.id,
            title: s.name,
            roundId: roundId,
            planName: 'Kế hoạch năm 2025', 
            targetName: s.merchantName,
            targetAddress: s.merchantAddress,
            assignee: { name: s.userName || 'Chưa phân công' },
            dueDate: s.startTime || s.deadlineTime,
            status: s.status, 
            type: s.type || 'proactive',
            priority: 'medium',
            roundName: s.campaignName || data?.name || 'Đợt kiểm tra hiện tại',
            description: s.description || s.note, 
            merchantId: s.merchantId,
            merchantName: s.merchantName,
            assigneeId: s.userId, 
            userId: s.userId,
            startDate: s.startTime,
            createdAt: s.createdAt, // Needed for date checks if any
          };
        });
        setSessions(mapped);
      } catch (err) {
        console.error('Error fetching sessions:', err);
      }
  };

  // Reusable Refresh Handler
  const handleRefreshList = () => {
      loadSessions();
  };

  // Handlers for new actions
  const handleStartTask = (task: any) => {
    setTaskModalState({ type: 'deploy', task });
  };
  
  const handleCompleteTask = (task: any) => {
    setTaskModalState({ type: 'complete', task });
  };

  const handleCancelTask = (task: any) => {
      setTaskModalState({ type: 'cancel', task });
  };

  const handleReopen = (task: any) => {
    setActionTask(task);
    setIsReopenModalOpen(true);
  };

  const handleAttachEvidence = (task: any) => {
    setActionTask(task);
    setIsAttachEvidenceModalOpen(true);
  };

  const handleEnterResults = (task: any) => {
    setActionTask(task);
    setIsEnterResultsModalOpen(true);
  };

  const handleCloseTask = async (task: any) => {
    try {
        await updateInspectionSessionApi(task.id, { status: 4 }); // 4 = closed
        toast.success(`Đã đóng phiên làm việc "${task.title}"`);
        handleRefreshList();
    } catch (error) {
        toast.error('Không thể đóng phiên làm việc');
    }
  };

  // Define columns matching TaskBoard exactly
  const columns: Column<any>[] = [
    {
      key: 'stt',
      label: 'STT',
      width: '60px',
      className: 'text-center',
      render: (_, index) => (
        <div className="text-center">{index + 1}</div>
      ),
    },
    {
      key: 'title',
      label: 'Tên phiên làm việc',
      sortable: true,
      render: (task) => (
        <div>
          <div style={{ fontWeight: 500 }}>{task?.title || 'N/A'}</div>
          <div style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>{task?.targetName || ''}</div>
        </div>
      ),
    },
    {
      key: 'roundId',
      label: 'Đợt kiểm tra',
      sortable: true,
      render: (task) => (
        <div style={{ fontWeight: 500 }}>{task?.roundName || 'N/A'}</div>
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
      key: 'startDate',
      label: 'Ngày bắt đầu',
      sortable: true,
      render: (task) => {
        if (!task?.startDate) return <span>-</span>;
        return <span>{new Date(task.startDate).toLocaleDateString('vi-VN')}</span>;
      },
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
          <span style={isOverdue ? { color: 'var(--destructive)' } : {}}>
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
      render: (task) => {
        const actions: any[] = [];

        // Helper to add Cancel Action
        const addCancelAction = () => {
          actions.push({
            label: 'Hủy',
            icon: <XCircle size={16} />,
            priority: 1,
            variant: 'destructive',
            onClick: () => handleCancelTask(task),
          });
        };

        switch (task.status) {
          case 'not_started':
            // Chưa bắt đầu: Xem chi tiết, Chỉnh sửa, Bắt đầu, Hủy
            actions.push(
              {
                label: 'Xem chi tiết',
                icon: <Eye size={16} />,
                onClick: () => handleViewDetail(task),
                priority: 10,
              },
              {
                label: 'Chỉnh sửa',
                icon: <Edit size={16} />,
                onClick: () => {
                  setEditingTask(task);
                  setShowCreateDialog(true);
                },
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
                onClick: () => handleViewDetail(task),
                priority: 11,
              },
              {
                label: 'Chỉnh sửa',
                icon: <Edit size={16} />,
                onClick: () => {
                    setEditingTask(task);
                    setShowCreateDialog(true);
                },
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
                onClick: () => handleViewDetail(task),
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
                onClick: () => {
                    setEditingTask(task);
                    setShowCreateDialog(true);
                },
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
                onClick: () => handleViewDetail(task),
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
                 // Reopened: usually similiar to In Progress + Cancel
                 actions.push(
                     {
                        label: 'Xem chi tiết',
                        icon: <Eye size={16} />,
                        onClick: () => handleViewDetail(task),
                        priority: 10,
                     },
                     {
                        label: 'Chỉnh sửa',
                        icon: <Edit size={16} />,
                         onClick: () => {
                            setEditingTask(task);
                            setShowCreateDialog(true);
                        },
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

          default:
            // Fallback
             actions.push({
                label: 'Xem chi tiết',
                icon: <Eye size={16} />,
                onClick: () => handleViewDetail(task),
                priority: 10,
             });
        }

        return (
          <ActionColumn
            style={{ justifyContent: 'flex-start' }}
            actions={actions}
          />
        );
      },
    },
  ];

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <button className={styles.backButton} onClick={handleBack}>
            <ArrowLeft size={20} />
          </button>

          <div className={styles.headerTitle}>
            <div className={styles.headerTitleRow}>
              <span className={styles.roundId}>{data.code}</span>
              <StatusBadge {...getStatusProps('round', data.status)} />
              <StatusBadge {...getStatusProps('inspectionType', data.type)} />
              <StatusBadge {...getStatusProps('priority', data.priority || 'medium')} />
            </div>
            <h1 className={styles.pageTitle}>{data.name}</h1>
            <p className={styles.pageSubtitle}>
              Thuộc {data.planCode} - {data.planName} - {data.quarter}
            </p>
          </div>

          <div className={styles.headerActions}>
            <button className={styles.primaryButton} onClick={handleComplete}>
              <ClipboardCheck size={18} />
              Hoàn thành
            </button>
            <button className={styles.outlineButton} onClick={handleEdit}>
              <Edit size={18} />
              Sửa đợt
            </button>
            <button className={styles.outlineButton}>
              <Download size={18} />
              Xuất báo cáo
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            {tab.badge && <span className={styles.tabBadge}>{tab.badge}</span>}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className={styles.content}>
        {activeTab === 'overview' && (
          <div className={styles.overviewContent}>
            {/* Summary Stats */}
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: '#8B5CF6' }}>
                  <ClipboardCheck size={24} />
                </div>
                <div className={styles.statContent}>
                  <div className={styles.statLabel}>Tổng phiên kiểm tra</div>
                  <div className={styles.statValue}>{data.stats?.totalSessions || 0}</div>
                  <div className={styles.statSubtext}>
                    {data.stats?.completedSessions || 0} đã hoàn thành
                  </div>
                </div>

              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: '#10B981' }}>
                  <Target size={24} />
                </div>
                <div className={styles.statContent}>
                  <div className={styles.statLabel}>Cửa hàng đã kiểm tra</div>
                  <div className={styles.statValue}>{data.stats?.storesInspected || 0}</div>
                  <div className={`${styles.statSubtext} ${styles.statPositive}`}>
                    +{percentIncrease}% so vi dự kiến
                  </div>
                </div>

              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: '#F59E0B' }}>
                  <AlertCircle size={24} />
                </div>
                <div className={styles.statContent}>
                  <div className={styles.statLabel}>Vi phạm phát hiện</div>
                  <div className={`${styles.statValue} ${styles.statDanger}`}>
                    {data.stats?.violationsFound || 0}
                  </div>
                  <div className={styles.statSubtext}>
                    {data.stats?.violationRate || 0}% tỷ lệ phát hiện
                  </div>
                </div>

              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: '#005cb6' }}>
                  <TrendingUp size={24} />
                </div>
                <div className={styles.statContent}>
                  <div className={styles.statLabel}>Tiến độ</div>
                  <div className={styles.statValue}>{data.stats?.progress || 0}%</div>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{ width: `${data.stats?.progress || 0}%` }}
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* Basic Info */}
            <div className={styles.infoContent}>
              <h2 className={styles.sectionTitle}>Thông tin cơ bản</h2>
              <div className={styles.infoGrid}>
                <div className={styles.infoField}>
                  <div className={styles.infoLabel}>Mã đợt kiểm tra</div>
                  <div className={styles.infoValue}>
                    <FileText size={16} className={styles.infoIcon} />
                    {data.code}
                  </div>
                </div>

                <div className={styles.infoField}>
                  <div className={styles.infoLabel}>Mức độ ưu tiên</div>
                  <div className={styles.infoValue}>
                    <TrendingUp size={16} className={styles.infoIcon} />
                    <StatusBadge {...getStatusProps('priority', data.priority || 'medium')} size="sm" />
                  </div>
                </div>

                <div className={styles.infoField}>
                  <div className={styles.infoLabel}>Loại kiểm tra</div>
                  <div className={styles.infoValue}>
                    <ClipboardCheck size={16} className={styles.infoIcon} />
                    <StatusBadge {...getStatusProps('inspectionType', data.type)} size="sm" />
                  </div>
                </div>

                <div className={styles.infoField}>
                  <div className={styles.infoLabel}>Thời gian triển khai</div>
                  <div className={styles.infoValue}>
                    <Calendar size={16} className={styles.infoIcon} />
                    {new Date(data.startDate).toLocaleDateString('vi-VN')} -{' '}
                    {new Date(data.endDate).toLocaleDateString('vi-VN')}
                  </div>
                </div>

                <div className={styles.infoField}>
                  <div className={styles.infoLabel}>Người chủ trì</div>
                  <div className={styles.infoValue}>
                    <Users size={16} className={styles.infoIcon} />
                    {data.leadUnit}
                  </div>
                </div>

                <div className={styles.infoField}>
                  <div className={styles.infoLabel}>Phạm vi</div>
                  <div className={styles.infoValue}>
                    <MapPin size={16} className={styles.infoIcon} />
                    {data.scope || 'Chưa xác định'}
                  </div>
                </div>

                <div className={styles.infoField}>
                  <div className={styles.infoLabel}>Đội trưởng</div>
                  <div className={styles.infoValue}>
                    <Users size={16} className={styles.infoIcon} />
                    {data.teamLeader || 'Chưa xác định'}
                  </div>
                </div>

                <div className={`${styles.infoField} ${styles.infoFieldFull}`}>
                  <div className={styles.infoLabel}>Biểu mẫu kiểm tra</div>
                  <div className={styles.infoValue}>
                    <FileText size={16} className={styles.infoIcon} />
                    {data.formTemplate}
                  </div>
                </div>

                <div className={`${styles.infoField} ${styles.infoFieldFull}`}>
                  <div className={styles.infoLabel}>Ghi chú</div>
                  <div className={styles.infoValue}>{data.notes}</div>
                </div>
              </div>
            </div>

            {/* Biểu mẫu từ INS */}
            <div className={styles.infoContent}>
              <h2 className={styles.sectionTitle}>Biểu mẫu từ INS</h2>
              <div className={styles.decisionsGrid}>
                <div className={styles.decisionCard}>
                  <div className={styles.decisionHeader}>
                    <FileText size={20} className={styles.decisionIcon} style={{ color: '#005cb6' }} />
                    <div>
                      <div className={styles.decisionLabel}>Quyết định kiểm tra</div>
                      <div className={styles.decisionCode}>01/QĐ-KT</div>
                      <div className={styles.decisionTitle}>QĐ kiểm tra việc chấp hành pháp luật trong sản xuất Q1/2026</div>
                    </div>
                  </div>
                </div>
                <div className={styles.decisionCard}>
                  <div className={styles.decisionHeader}>
                    <Users size={20} className={styles.decisionIcon} style={{ color: '#10B981' }} />
                    <div>
                      <div className={styles.decisionLabel}>Quyết định phân công</div>
                      <div className={styles.decisionCode}>05/QĐ-PC</div>
                      <div className={styles.decisionTitle}>QĐ phân công công chức thực hiện biện pháp nghiệp vụ</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className={styles.infoContent}>
              <h2 className={styles.sectionTitle}>Thao tác nhanh</h2>
              <div className={styles.actionButtons}>
                <button className={styles.actionButton} onClick={() => {
                  setEditingTask(null);
                  setShowCreateDialog(true);
                }}>
                  <Plus size={20} />
                  <div>
                    <div className={styles.actionButtonTitle}>Tạo phiên kiểm tra</div>
                    <div className={styles.actionButtonDesc}>Lập phiên kiểm tra mới</div>
                  </div>
                </button>
                <button className={styles.actionButton}>
                  <Users size={20} />
                  <div>
                    <div className={styles.actionButtonTitle}>Phân công nhân sự</div>
                    <div className={styles.actionButtonDesc}>Bổ nhiệm đội ngũ</div>
                  </div>
                </button>
                <button className={styles.actionButton} onClick={() => navigate(`/plans/inspection-rounds/${encodeURIComponent(data.id)}/statistics`)}>
                  <BarChart3 size={20} />
                  <div>
                    <div className={styles.actionButtonTitle}>Theo dõi tiến độ</div>
                    <div className={styles.actionButtonDesc}>Xem báo cáo chi tiết</div>
                  </div>
                </button>
                <button className={styles.actionButton}>
                  <Download size={20} />
                  <div>
                    <div className={styles.actionButtonTitle}>Xuất báo cáo</div>
                    <div className={styles.actionButtonDesc}>Tải file PDF/Excel</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sessions' && (
          <div className={styles.sessionsContent}>
            {/* Header with Create Button */}
            <div className={styles.sessionsHeader}>
              <div>
                <h2 className={styles.sectionTitle}>Danh sách phiên kiểm tra</h2>
                <p className={styles.sectionDesc}>
                  Tổng {sessions.length} phiên - {sessions.filter(s => s.status === 'completed').length} đã hoàn thành
                </p>
              </div>
              <button className={styles.primaryButton} onClick={() => setShowCreateDialog(true)}>
                <Plus size={18} />
                Tạo phiên mới
              </button>
            </div>

            {/* Sessions Table */}
            {/* Sessions Table using DataTable */}
            <div className={styles.sessionsTable} style={{ overflow: 'visible' }}>
              {sessions.length > 0 ? (
                <DataTable
                  columns={columns}
                  data={sessions}
                  getRowId={(s) => s.id}
                  selectable={true}
                  selectedRows={selectedRows}
                  onSelectRow={handleSelectRow}
                  onSelectAll={handleSelectAll}
                />
              ) : (
                <EmptyState
                  icon={<ClipboardCheck size={48} />}
                  title="Chưa có phiên kiểm tra"
                  description="Tạo phiên kiểm tra mới cho đợt này"
                />
              )}
            </div>

            {/* Table Footer with Pagination */}

          </div>
        )}

        {activeTab === 'team' && (
          <div className={styles.teamContent}>
            {/* Header with Assign Button */}
            <div className={styles.teamHeader}>
              <div>
                <h2 className={styles.sectionTitle}>Nhân sự tham gia</h2>
              </div>
            </div>

            {/* Team Members List */}
            <div className={styles.teamList}>
              {mockTeamMembers.map((member) => (
                <div key={member.id} className={styles.teamMember}>
                  <div
                    className={styles.memberAvatar}
                    style={{
                      background: member.role === 'leader' ? '#8B5CF6' : '#E5E7EB',
                      color: member.role === 'leader' ? 'white' : '#6B7280',
                    }}
                  >
                    {member.avatar}
                  </div>
                  <div className={styles.memberInfo}>
                    <div className={styles.memberName}>{member.name}</div>
                    <div className={styles.memberPosition}>{member.position}</div>
                  </div>
                  {member.role === 'leader' && (
                    <span className={styles.leaderBadge}>Đội trưởng</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'scope' && (
          <div className={styles.scopeContent}>
            <h2 className={styles.sectionTitle}>Phạm vi kiểm tra</h2>
            
            <div className={styles.scopeHeader}>
              <p className={styles.scopeDesc}>
                Danh sách phường/xã ({data.scopeDetails?.wards?.length || 0})
              </p>
            </div>

            <div className={styles.wardsList}>
              {data.scopeDetails?.wards?.map((ward: string, index: number) => (
                <div key={index} className={styles.wardItem}>
                  <MapPin size={20} className={styles.wardIcon} />
                  <span className={styles.wardName}>{ward}</span>
                </div>
              ))}
              {(!data.scopeDetails?.wards || data.scopeDetails.wards.length === 0) && (
                <p className={styles.emptyText}>Chưa xác định phạm vi kiểm tra</p>
              )}
            </div>

          </div>
        )}

        {activeTab === 'history' && (
          <div className={styles.historyContent}>
            <h2 className={styles.sectionTitle}>Lịch sử cập nhật</h2>
            
            <div className={styles.historyList}>
              {mockHistory.map((historyItem) => (
                <div key={historyItem.id} className={styles.historyItem}>
                  <div className={styles.historyIcon}>
                    {historyItem.type === 'create' && <Plus size={20} />}
                    {historyItem.type === 'update' && <RefreshCw size={20} />}
                    {historyItem.type === 'edit' && <Edit size={20} />}
                    {historyItem.type === 'import' && <Upload size={20} />}
                    {historyItem.type === 'session_create' && <Plus size={20} />}
                    {historyItem.type === 'session_complete' && <CheckCircle size={20} />}
                    {historyItem.type === 'session_delete' && <Trash2 size={20} />}
                    {historyItem.type === 'team_update' && <Users size={20} />}
                  </div>
                  <div className={styles.historyInfo}>
                    <div className={styles.historyDate}>
                      {new Date(historyItem.timestamp).toLocaleString('vi-VN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                    <div className={styles.historyAction}>
                      <strong>{historyItem.user}</strong> - {historyItem.action}
                    </div>
                    <div className={styles.historyDescription}>{historyItem.description}</div>
                    {historyItem.insForm && (
                      <div className={styles.historyInsForm} onClick={() => handleInsFormClick(historyItem.insForm)}>
                        <FileText size={16} className={styles.historyInsFormIcon} />
                        <span>
                          <strong>{historyItem.insForm.type}</strong> - {historyItem.insForm.name} ({historyItem.insForm.code})
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={showCreateDialog}
        onClose={() => {
          setShowCreateDialog(false);
          setEditingTask(null);
        }}
        onSubmit={handleCreateTask}
        defaultRoundId={roundId}
        defaultPlanId={data?.planId}
        defaultDepartmentId={data?.leadUnitId}
        task={editingTask}
        taskId={editingTask?.id}
      />

      {/* InsForm Detail Dialog */}
      <InsFormDetailDialog
        isOpen={showInsFormDetail}
        onClose={() => setShowInsFormDetail(false)}
        formData={selectedInsForm ? {
          type: selectedInsForm.type.includes('01') ? 'decision' : 
                selectedInsForm.type.includes('02') ? 'assignment' : 
                selectedInsForm.type.includes('03') ? 'notification' : 
                selectedInsForm.type.includes('06') ? 'inspection' : 
                'violation',
          code: selectedInsForm.code,
          title: selectedInsForm.name,
          issueDate: '15/01/2026',
          issuer: {
            name: 'Nguyễn Văn Long',
            position: 'Chi cục trưởng',
            unit: 'Chi cục Quản lý thị trường Phường 1',
          },
          content: {},
        } : null}
      />
      
      <TaskDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        task={selectedTask}
        onEdit={(task) => {
          setIsDetailModalOpen(false);
          setEditingTask(task);
          setShowCreateDialog(true);
        }}
      />

      {/* Action Modals - Full Set */}
      {taskModalState.task && (
        <>
          <DeployTaskModal
            isOpen={taskModalState.type === 'deploy'}
            onClose={() => setTaskModalState({ type: null, task: null })}
            task={taskModalState.task}
            onConfirm={() => {
               // Update status to in_progress (2)
               updateInspectionSessionApi(taskModalState.task.id, { status: 2, start_time: new Date().toISOString() })
                 .then(() => {
                   toast.success('Đã bắt đầu phiên kiểm tra');
                   handleRefreshList();
                 })
                 .catch(() => toast.error('Lỗi khi bắt đầu phiên'));
               setTaskModalState({ type: null, task: null });
            }}
          />
          <CancelTaskModal
            isOpen={taskModalState.type === 'cancel'}
            onClose={() => setTaskModalState({ type: null, task: null })}
            task={taskModalState.task}
             onConfirm={() => {
               // Update status to cancelled (6)
               updateInspectionSessionApi(taskModalState.task.id, { status: 6, note: 'Đã hủy bởi người dùng' })
                 .then(() => {
                   toast.success('Đã hủy phiên kiểm tra');
                   handleRefreshList();
                 })
                 .catch(() => toast.error('Lỗi khi hủy phiên'));
               setTaskModalState({ type: null, task: null });
            }}
          />
          <CompleteTaskModal
            isOpen={taskModalState.type === 'complete'}
            onClose={() => setTaskModalState({ type: null, task: null })}
            task={taskModalState.task}
            onConfirm={() => {
                // Update status to completed (3)
               updateInspectionSessionApi(taskModalState.task.id, { status: 3 })
                 .then(() => {
                   toast.success('Đã hoàn thành phiên kiểm tra');
                   handleRefreshList();
                 })
                 .catch(() => toast.error('Lỗi khi hoàn thành phiên'));
               setTaskModalState({ type: null, task: null });
            }}
          />
        </>
      )}

      {/* Other Action Modals */}
      {actionTask && (
        <>
          <ReopenTaskModal
            isOpen={isReopenModalOpen}
            onClose={() => setIsReopenModalOpen(false)}
            taskTitle={actionTask.title}
            taskId={actionTask.id}
            onReopen={(reason) => {
               // Call API to reopen (5)
               updateInspectionSessionApi(actionTask.id, { status: 5, reopen_reason: reason })
                 .then(() => {
                   toast.success(`Đã mở lại phiên làm việc "${actionTask.title}"`);
                   handleRefreshList();
                 })
                 .catch(() => toast.error('Không thể mở lại phiên làm việc'));
                setIsReopenModalOpen(false);
                setActionTask(null);
            }}
          />
          <AttachEvidenceModal
            isOpen={isAttachEvidenceModalOpen}
            onClose={() => setIsAttachEvidenceModalOpen(false)}
            taskTitle={actionTask.title}
            taskId={actionTask.id}
            onSubmit={(files) => {
                 // Mock submission
                 toast.success(`Đã đính kèm ${files.length} tập tin`);
                 handleRefreshList();
                 setIsAttachEvidenceModalOpen(false);
            }}
          />
          <InspectionResultModal
            isOpen={isEnterResultsModalOpen}
            onClose={() => setIsEnterResultsModalOpen(false)}
            session={{
                id: actionTask.id,
                code: actionTask.code || actionTask.id,
                title: actionTask.title,
                date: actionTask.startDate || new Date().toISOString()
            }}
            onSave={(data) => {
                toast.success('Đã lưu kết quả (Mock)');
                setIsEnterResultsModalOpen(false);
            }}
            onComplete={(data) => {
                 // Update status to completed (3)
                 updateInspectionSessionApi(actionTask.id, { status: 3 })
                   .then(() => {
                     toast.success('Đã hoàn thành phiên kiểm tra');
                     handleRefreshList();
                   })
                   .catch(() => toast.error('Lỗi khi hoàn thành phiên'));
                setIsEnterResultsModalOpen(false);
            }}
          />
          <Form06Modal
            open={isForm06ModalOpen}
            onClose={() => setIsForm06ModalOpen(false)}
            task={actionTask}
          />
          <Form10Modal
            open={isForm10ModalOpen}
            onClose={() => setIsForm10ModalOpen(false)}
            task={actionTask}
          />
          <Form11Modal
            open={isForm11ModalOpen}
            onClose={() => setIsForm11ModalOpen(false)}
            task={actionTask}
          />
        </>
      )}
    </div>
  );
}
