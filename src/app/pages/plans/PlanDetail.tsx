import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  Download,
  Building2,
  Calendar,
  User,
  FileText,
  MapPin,
  Layers,
  Eye,
  Edit,
  Send,
  XCircle,
  PlayCircle,
  PauseCircle,
  Trash2,
  CheckCircle2,
  Clock,
  History,
  ClipboardCheck,
  BarChart3,
  Search
} from 'lucide-react';
import styles from './PlanDetail.module.css';
import { StatusBadge } from '@/app/components/common/StatusBadge';
import { getStatusProps } from '@/app/utils/status-badge-helper';
import { 
  type Plan,
} from '@/app/data/kehoach-mock-data';
import { mockInspectionTasks } from '@/app/data/inspection-tasks-mock-data';
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
} from '@/app/components/plans/PlanActionModals';
import { toast } from 'sonner';
import { Card, CardContent } from '@/app/components/ui/card';
import DataTable, { Column } from '@/ui-kit/DataTable';
import ActionColumn, { Action } from '@/patterns/ActionColumn';
import EmptyState from '@/ui-kit/EmptyState';
import { updatePlanApi, deletePlanApi } from '@/utils/api/plansApi';

import { useMemo } from 'react';
import { useSupabaseInspectionRounds, type InspectionRound } from '@/hooks/useSupabaseInspectionRounds';
import { useSupabasePlan } from '@/hooks/useSupabasePlans';
import { mockHistoryEvents } from '@/app/data/kehoach-mock-data';

type TabType = 'info' | 'inspections' | 'sessions' | 'history';

import { 
  SendForApprovalModal as SendRoundApprovalModal,
  StartInspectionModal as StartRoundInspectionModal,
  CompleteRoundModal,
  CancelRoundModal,
  DeleteRoundModal,
  RejectRoundModal,
  PauseRoundModal,
  ResumeRoundModal,
  DeployRoundModal as DeployRoundActionModal
} from '@/app/components/inspections/InspectionRoundActionModals';

// ... other imports

export function PlanDetail() {
  const navigate = useNavigate();
  const { planId } = useParams<{ planId: string }>();
  const [activeTab, setActiveTab] = useState<TabType>('info');

  // Modal states
  const [modalState, setModalState] = useState<{
    type: 'sendApproval' | 'approve' | 'reject' | 'recall' | 'deploy' | 'pause' | 'delete' | 'complete' | 'resume' | 'cancel' | null;
    plan: Plan | null;
  }>({ type: null, plan: null });

  // Inspection Round Modal states
  const [roundModalState, setRoundModalState] = useState<{
    type: 'sendRoundApproval' | 'startRoundInspection' | 'completeRound' | 'cancelRound' | 'deleteRound' | 'rejectRound' | 'pauseRound' | 'resumeRound' | 'deployRound' | null;
    round: InspectionRound | null;
  }>({ type: null, round: null });

  const closeModal = () => setModalState({ type: null, plan: null });
  const openModal = (type: typeof modalState.type, planData: Plan) => 
    setModalState({ type, plan: planData });

  const closeRoundModal = () => setRoundModalState({ type: null, round: null });
  const openRoundModal = (type: typeof roundModalState.type, round: InspectionRound) => 
    setRoundModalState({ type, round });

  // Decode planId since it's URL encoded
  const decodedPlanId = planId ? decodeURIComponent(planId) : undefined;
  
  // Use Supabase hook to fetch plan
  const { plan, loading: planLoading, error: planError, refetch } = useSupabasePlan(decodedPlanId);

  // Use Supabase hook to fetch inspection rounds
  const { rounds: planRounds, updateRoundStatus: updatePlanRoundStatus } = useSupabaseInspectionRounds(
    decodedPlanId, 
    activeTab === 'inspections'
  );
  
  const [roundSearch, setRoundSearch] = useState('');
  
  const filteredRounds = useMemo(() => {
    if (!roundSearch) return planRounds;
    return planRounds.filter(r => 
      r.name.toLowerCase().includes(roundSearch.toLowerCase()) ||
      r.code.toLowerCase().includes(roundSearch.toLowerCase()) ||
      r.leadUnit?.toLowerCase().includes(roundSearch.toLowerCase())
    );
  }, [planRounds, roundSearch]);
  
  const planTasks = mockInspectionTasks?.filter(t => t.planId === decodedPlanId) || [];
  const planHistory = mockHistoryEvents?.filter(h => h.planId === decodedPlanId) || [];
  
  const inspectionRoundsCount = planRounds.length;
  const workingSessionsCount = planTasks.length;
  
  // Dynamic tabs with badges
  const TABS_DYNAMIC = [
    { id: 'info' as TabType, label: 'Thông tin chung' },
    { id: 'inspections' as TabType, label: 'Đợt kiểm tra', badge: inspectionRoundsCount },
    { id: 'sessions' as TabType, label: 'Phiên làm việc', badge: workingSessionsCount },
    { id: 'history' as TabType, label: 'Lịch sử', badge: planHistory.length }
  ];

  // Logic to get actions for an inspection round based on status
  const getRoundActions = (round: InspectionRound): Action[] => {
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
        actions.push(
          {
            label: 'Chỉnh sửa',
            icon: <Edit size={16} />,
            onClick: () => navigate(`/plans/inspection-rounds/create-new?mode=edit&id=${encodeURIComponent(round.id)}`),
            priority: 8,
          },
          {
            label: 'Gửi duyệt',
            icon: <Send size={16} />,
            onClick: () => openRoundModal('sendRoundApproval', round),
            priority: 9,
          },
          {
            label: 'Xóa',
            icon: <Trash2 size={16} />,
            onClick: () => openRoundModal('deleteRound', round),
            variant: 'destructive',
            separator: true,
            priority: 1,
          }
        );
        break;

      case 'pending_approval':
        actions.push(
          {
            label: 'Phê duyệt',
            icon: <CheckCircle2 size={16} />,
            onClick: () => openRoundModal('startRoundInspection', round),
            priority: 9,
          },
          {
            label: 'Từ chối',
            icon: <XCircle size={16} />,
            onClick: () => openRoundModal('rejectRound', round),
            variant: 'destructive',
            separator: true,
            priority: 5,
          }
        );
        break;

      case 'approved':
        actions.push(
          {
            label: 'Triển khai',
            icon: <PlayCircle size={16} />,
            onClick: () => openRoundModal('deployRound', round),
            priority: 9,
          },
          {
            label: 'Chỉnh sửa',
            icon: <Edit size={16} />,
            onClick: () => navigate(`/plans/inspection-rounds/create-new?mode=edit&id=${encodeURIComponent(round.id)}`),
            priority: 8,
          }
        );
        break;

      case 'active':
      case 'in_progress':
        actions.push(
          {
            label: 'Hoàn thành',
            icon: <ClipboardCheck size={16} />,
            onClick: () => openRoundModal('completeRound', round),
            priority: 10,
          },
          {
            label: 'Tạm dừng',
            icon: <PauseCircle size={16} />,
            onClick: () => openRoundModal('pauseRound', round),
            variant: 'destructive',
            separator: true,
            priority: 3,
          }
        );
        break;

      case 'paused':
        actions.push(
          {
            label: 'Tiếp tục',
            icon: <PlayCircle size={16} />,
            onClick: () => openRoundModal('resumeRound', round),
            priority: 9,
          }
        );
        break;

      case 'completed':
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
      case 'cancelled':
        actions.push(
          {
            label: 'Xóa',
            icon: <Trash2 size={16} />,
            onClick: () => openRoundModal('deleteRound', round),
            variant: 'destructive',
            priority: 1,
          }
        );
        break;
    }

    return actions;
  };

  if (planLoading) {
    return (
      <div className={styles.container}>
        <div style={{ padding: '64px', textAlign: 'center' }}>
          <div className="animate-spin" style={{ width: '32px', height: '32px', margin: '0 auto 16px', border: '2px solid transparent', borderTopColor: 'var(--color-primary)', borderRadius: '50%' }}></div>
          <p>Đang tải thông tin kế hoạch...</p>
        </div>
      </div>
    );
  }

  if (planError || !plan) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <h3 className={styles.emptyTitle}>{planError || 'Không tìm thấy kế hoạch'}</h3>
          <p className={styles.emptyDesc}>
            {planError ? 'Đã xảy ra lỗi khi tải dữ liệu' : 'Kế hoạch này không tồn tại hoặc đã bị xóa'}
          </p>
          <button className={styles.primaryButton} onClick={() => navigate('/plans/list')}>
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  // Define columns for Inspection Rounds table
  const roundColumns: Column<InspectionRound>[] = [
    {
      key: 'code',
      label: 'Mã đợt',
      sortable: true,
      width: '140px',
      render: (round) => (
        <div>
          <div className={styles.roundCodeBadgeRow}>
            <StatusBadge {...getStatusProps('inspectionType', round.type)} size="sm" />
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
          <div className={styles.roundName}>{round.name || 'Chưa đặt tên'}</div>
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
      width: '180px',
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
      label: 'Người chủ trì',
      sortable: true,
      width: '200px',
      truncate: true,
      render: (round) => (
        <span className={styles.leadUnit}>{round.leadUnit || 'Chưa xác định'}</span>
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
            {round.totalTargets > 0 ? `${round.inspectedTargets}/${round.totalTargets}` : 'Chưa xác định'}
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
      render: (round) => <StatusBadge {...getStatusProps('round', round.status)} size="sm" />,
    },
    {
      key: 'actions',
      label: 'Thao tác',
      sticky: 'right',
      width: '120px',
      render: (round) => <ActionColumn actions={getRoundActions(round)} />,
    },
  ];

  // Define columns for Inspection Sessions table
  const sessionColumns: Column<typeof mockInspectionTasks[0]>[] = [
    {
      key: 'code',
      label: 'Mã nhiệm vụ',
      sortable: true,
    },
    {
      key: 'targetName',
      label: 'Cơ sở kiểm tra',
      sortable: true,
    },
    {
      key: 'targetAddress',
      label: 'Địa chỉ',
      sortable: true,
    },
    {
      key: 'assignee',
      label: 'Thanh tra viên',
      sortable: true,
      render: (task) => task.assignee.name,
    },
    {
      key: 'dueDate',
      label: 'Hạn hoàn thành',
      sortable: true,
      render: (task) => {
        const date = new Date(task.dueDate);
        return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
      },
    },
    {
      key: 'status',
      label: 'Trạng thái',
      render: (task) => {
        const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
          not_started: { label: 'Chưa bắt đầu', color: '#6B7280', bg: '#F3F4F6' },
          in_progress: { label: 'Đang thực hiện', color: '#2563EB', bg: '#EFF6FF' },
          completed: { label: 'Hoàn thành', color: '#059669', bg: '#ECFDF5' },
          closed: { label: 'Đã đóng', color: '#64748B', bg: '#F1F5F9' },
        };
        const config = statusConfig[task.status] || { label: task.status, color: '#6B7280', bg: '#F3F4F6' };
        return (
          <span style={{
            padding: '4px 12px',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--font-size-xs)',
            fontWeight: 'var(--font-weight-medium)',
            background: config.bg,
            color: config.color,
          }}>
            {config.label}
          </span>
        );
      },
    },
    {
      key: 'actions',
      label: 'Thao tác',
      sticky: 'right',
      render: (task) => (
        <ActionColumn
          actions={[
            {
              label: 'Xem chi tiết',
              icon: <Eye size={16} />,
              onClick: () => {
                navigate(`/plans/working-sessions/${encodeURIComponent(task.id)}`);
              },
              priority: 10,
            },
          ]}
        />
      ),
    },
  ];

  // Define columns for History table
  const historyColumns: Column<typeof mockHistoryEvents[0]>[] = [
    {
      key: 'timestamp',
      label: 'Thời gian',
      sortable: true,
      render: (event) => {
        const date = new Date(event.timestamp);
        return (
          <div className={styles.historyTime}>
            <div>{date.toLocaleDateString('vi-VN')}</div>
            <div className={styles.historyTimeSmall}>
              {date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        );
      },
    },
    {
      key: 'eventType',
      label: 'Hành động',
      sortable: true,
      render: (event) => {
        const actionConfig: Record<string, { icon: any; color: string; label: string }> = {
          created: { icon: <Plus size={16} />, color: 'var(--success)', label: 'Tạo mới' },
          submitted: { icon: <Send size={16} />, color: 'var(--info)', label: 'Trình duyệt' },
          approved: { icon: <CheckCircle2 size={16} />, color: 'var(--success)', label: 'Phê duyệt' },
          rejected: { icon: <XCircle size={16} />, color: 'var(--destructive)', label: 'Từ chối' },
          paused: { icon: <PauseCircle size={16} />, color: 'var(--warning)', label: 'Tạm dừng' },
          deployed: { icon: <PlayCircle size={16} />, color: 'var(--primary)', label: 'Triển khai' },
          cancelled: { icon: <XCircle size={16} />, color: 'var(--destructive)', label: 'Hủy' },
          status_changed: { icon: <Clock size={16} />, color: 'var(--warning)', label: 'Đổi trạng thái' },
        };
        const config = actionConfig[event.eventType] || { 
          icon: <History size={16} />, 
          color: 'var(--muted-foreground)',
          label: event.eventType
        };
        return (
          <div className={styles.historyAction}>
            <span style={{ color: config.color }}>{config.icon}</span>
            <span>{config.label}</span>
          </div>
        );
      },
    },
    {
      key: 'description',
      label: 'Mô tả',
      render: (event) => <div className={styles.historyDesc}>{event.description}</div>,
    },
    {
      key: 'user',
      label: 'Người thực hiện',
      sortable: true,
      render: (event) => (
        <div className={styles.historyUser}>
          <User size={14} />
          <span>{event.user}</span>
        </div>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <button className={styles.backButton} onClick={() => navigate('/plans/list')}>
            <ArrowLeft size={20} />
          </button>

          <div className={styles.headerTitle}>
            <div className={styles.headerTitleRow}>
              <span className={styles.planId}>{plan.id}</span>
              <StatusBadge {...getStatusProps('plan', plan.status)} size="sm" />
            </div>
            <h1 className={styles.pageTitle}>{plan.name}</h1>
          </div>

          <div className={styles.headerActions}>
            {/* Draft status actions */}
            {plan.status === 'draft' && (
              <>
                <button 
                  className={styles.outlineButton}
                  onClick={() => {
                    navigate(`/plans/${encodeURIComponent(plan.id)}/edit`);
                  }}
                >
                  <Edit size={18} />
                  Chỉnh sửa
                </button>
                <button 
                  className={styles.primaryButton}
                  onClick={() => openModal('sendApproval', plan)}
                >
                  <Send size={18} />
                  Trình duyệt
                </button>
                <button 
                  className={styles.deleteButton}
                  onClick={() => openModal('delete', plan)}
                  title="Xóa kế hoạch"
                >
                  <Trash2 size={18} />
                </button>
              </>
            )}

            {/* Pending approval status actions */}
            {plan.status === 'pending_approval' && (
              <>
                <button 
                  className={styles.outlineButton}
                  onClick={() => openModal('recall', plan)}
                >
                  <XCircle size={18} />
                  Thu hồi
                </button>
                <button 
                  className={styles.outlineButton}
                  onClick={() => openModal('reject', plan)}
                >
                  <XCircle size={18} />
                  Từ chối
                </button>
                <button 
                  className={styles.primaryButton}
                  onClick={() => openModal('approve', plan)}
                >
                  <CheckCircle2 size={18} />
                  Phê duyệt
                </button>
              </>
            )}

            {/* Approved status actions */}
            {plan.status === 'approved' && (
              <>
                <button 
                  className={styles.primaryButton}
                  onClick={() => openModal('deploy', plan)}
                >
                  <PlayCircle size={18} />
                  Triển khai
                </button>
              </>
            )}

            {/* In progress status actions */}
            {plan.status === 'active' && (
              <>
                <button 
                  className={styles.warningButton}
                  onClick={() => openModal('pause', plan)}
                >
                  <PauseCircle size={18} />
                  Tạm dừng
                </button>
                <button 
                  className={styles.primaryButton}
                  onClick={() => openModal('complete', plan)}
                  style={{ background: 'var(--success)' }}
                >
                  <ClipboardCheck size={18} />
                  Hoàn thành
                </button>
              </>
            )}

            {/* Paused status actions */}
            {plan.status === 'paused' && (
              <>
                <button 
                  className={styles.primaryButton}
                  onClick={() => openModal('resume', plan)}
                >
                  <PlayCircle size={18} />
                  Tiếp tục
                </button>
                <button 
                  className={styles.outlineButton}
                  onClick={() => openModal('cancel', plan)}
                  style={{ color: 'var(--destructive)', borderColor: 'var(--destructive)' }}
                >
                  <XCircle size={18} />
                  Hủy kế hoạch
                </button>
              </>
            )}

            {/* Export button - available for all statuses */}
            <button className={styles.outlineButton}>
              <Download size={18} />
              Xuất báo cáo
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        {TABS_DYNAMIC.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            {tab.badge !== undefined && tab.badge > 0 && (
              <span className={styles.tabBadge}>{tab.badge}</span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className={styles.content}>
        {activeTab === 'info' && (
          <div className={styles.tabPanel}>
            <Card>
              <CardContent className={styles.cardContent}>
                <h2 className={styles.sectionTitle}>Thông tin chung</h2>
                <div className={styles.infoGrid}>
                  <div className={styles.infoField}>
                    <div className={styles.infoLabel}>Mã kế hoạch</div>
                    <div className={styles.infoValue}>
                      <FileText size={16} className={styles.infoIcon} />
                      {plan.id}
                    </div>
                  </div>

                  <div className={styles.infoField}>
                    <div className={styles.infoLabel}>Quý/Năm</div>
                    <div className={styles.infoValue}>
                      <Calendar size={16} className={styles.infoIcon} />
                      {plan.quarter}
                    </div>
                  </div>

                  <div className={styles.infoField}>
                    <div className={styles.infoLabel}>Đơn vị chịu trách nhiệm</div>
                    <div className={styles.infoValue}>
                      <Building2 size={16} className={styles.infoIcon} />
                      {plan.responsibleUnit}
                    </div>
                  </div>

                  <div className={styles.infoField}>
                    <div className={styles.infoLabel}>Người lập kế hoạch</div>
                    <div className={styles.infoValue}>
                      <User size={16} className={styles.infoIcon} />
                      {plan.createdBy}
                    </div>
                  </div>

                  <div className={styles.infoField}>
                    <div className={styles.infoLabel}>Khu vực kiểm tra</div>
                    <div className={styles.infoValue}>
                      <MapPin size={16} className={styles.infoIcon} />
                      {plan.scopeLocation}
                    </div>
                  </div>

                  <div className={styles.infoField}>
                    <div className={styles.infoLabel}>Ưu tiên</div>
                    <div className={styles.infoValue}>
                      <StatusBadge {...getStatusProps('priority', plan.priority)} size="sm" />
                    </div>
                  </div>

                  <div className={`${styles.infoField} ${styles.infoFieldFull}`}>
                    <div className={styles.infoLabel}>Chủ đề kiểm tra</div>
                    <div className={styles.infoValue}>{plan.topic}</div>
                  </div>

                  <div className={`${styles.infoField} ${styles.infoFieldFull}`}>
                    <div className={styles.infoLabel}>Mục tiêu</div>
                    <div className={styles.infoValue}>{plan.objectives}</div>
                  </div>

                  {/* Rejection Reason - Only show if plan is rejected */}
                  {plan.status === 'rejected' && plan.rejectionReason && (
                    <div className={`${styles.infoField} ${styles.infoFieldFull}`}>
                      <div className={styles.infoLabel} style={{ color: 'var(--destructive)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <XCircle size={16} />
                        Lý do từ chối
                      </div>
                      <div 
                        className={styles.infoValue} 
                        style={{ 
                          background: 'var(--destructive-light, #FEF2F2)', 
                          padding: '12px', 
                          borderRadius: 'var(--radius-md)',
                          borderLeft: '3px solid var(--destructive)',
                        }}
                      >
                        <div style={{ marginBottom: '8px' }}>
                          <strong>{plan.rejectionReason}</strong>
                        </div>
                        {plan.rejectedBy && plan.rejectedAt && (
                          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--muted-foreground)', marginTop: '8px' }}>
                            Từ chối bởi {plan.rejectedBy} vào {new Date(plan.rejectedAt).toLocaleString('vi-VN')}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Pause Reason - Only show if plan is cancelled/paused */}
                  {plan.status === 'cancelled' && plan.pausedReason && (
                    <div className={`${styles.infoField} ${styles.infoFieldFull}`}>
                      <div className={styles.infoLabel} style={{ color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <PauseCircle size={16} />
                        Lý do tạm dừng
                      </div>
                      <div 
                        className={styles.infoValue} 
                        style={{ 
                          background: 'var(--warning-light, #FFF7ED)', 
                          padding: '12px', 
                          borderRadius: 'var(--radius-md)',
                          borderLeft: '3px solid var(--warning)',
                        }}
                      >
                        <div style={{ marginBottom: '8px' }}>
                          <strong>{plan.pausedReason}</strong>
                        </div>
                        {plan.pausedBy && plan.pausedAt && (
                          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--muted-foreground)', marginTop: '8px' }}>
                            Tạm dừng bởi {plan.pausedBy} vào {new Date(plan.pausedAt).toLocaleString('vi-VN')}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Approval Info - Only show if plan is approved */}
                  {(plan.status === 'approved' || plan.status === 'active' || plan.status === 'completed') && plan.approvedBy && (
                    <div className={`${styles.infoField} ${styles.infoFieldFull}`}>
                      <div className={styles.infoLabel} style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CheckCircle2 size={16} />
                        Thông tin phê duyệt
                      </div>
                      <div 
                        className={styles.infoValue} 
                        style={{ 
                          background: 'var(--success-light, #F0FDF4)', 
                          padding: '12px', 
                          borderRadius: 'var(--radius-md)',
                          borderLeft: '3px solid var(--success)',
                        }}
                      >
                        Phê duyệt bởi <strong>{plan.approvedBy}</strong>
                        {plan.approvedAt && (
                          <span> vào {new Date(plan.approvedAt).toLocaleString('vi-VN')}</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'inspections' && (
          <div className={styles.tabPanel}>


            <Card>
              <CardContent className={styles.cardContent}>
                <div className={styles.sectionHeader}>
                  <div>
                    <h2 className={styles.sectionTitle}>Đợt kiểm tra</h2>
                    <p className={styles.sectionDesc}>Danh sách các đợt kiểm tra thuộc kế hoạch</p>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ position: 'relative' }}>
                      <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)' }} />
                      <input 
                        type="text" 
                        placeholder="Tìm kiếm đợt..." 
                        className={styles.roundSearchInput}
                        value={roundSearch}
                        onChange={(e) => setRoundSearch(e.target.value)}
                        style={{
                          padding: '8px 12px 8px 36px',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border)',
                          fontSize: 'var(--font-size-sm)',
                          width: '240px'
                        }}
                      />
                    </div>
                    <button 
                      className={styles.primaryButton}
                      onClick={() => navigate(`/plans/inspection-rounds/create-new?planId=${encodeURIComponent(plan.id)}`)}
                    >
                      <Plus size={16} />
                      Tạo đợt kiểm tra
                    </button>
                  </div>
                </div>
                {filteredRounds.length > 0 ? (
                  <DataTable
                    columns={roundColumns}
                    data={filteredRounds}
                    getRowId={(round) => round.id}
                  />
                ) : (
                  <EmptyState
                    icon={<Layers size={48} />}
                    title="Chưa có đợt kiểm tra"
                    description="Tạo đợt kiểm tra mới cho kế hoạch này"
                  />
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'sessions' && (
          <div className={styles.tabPanel}>
            <Card>
              <CardContent className={styles.cardContent}>
                <div className={styles.sectionHeader}>
                  <div>
                    <h2 className={styles.sectionTitle}>Phiên làm việc</h2>
                    <p className={styles.sectionDesc}>Danh sách các phiên làm việc đã thực hiện</p>
                  </div>
                </div>
                {planTasks.length > 0 ? (
                  <DataTable
                    columns={sessionColumns}
                    data={planTasks}
                    getRowId={(task) => task.id}
                  />
                ) : (
                  <EmptyState
                    icon={<Calendar size={48} />}
                    title="Chưa có phiên làm việc"
                    description="Các phiên làm việc sẽ hiển thị ở đây khi đợt kiểm tra được triển khai"
                  />
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'history' && (
          <div className={styles.tabPanel}>
            <Card>
              <CardContent className={styles.cardContent}>
                <h2 className={styles.sectionTitle}>Lịch sử thay đổi</h2>
                <p className={styles.sectionDesc}>Lịch sử các thay đổi và hoạt động của kế hoạch</p>
                {planHistory.length > 0 ? (
                  <DataTable
                    columns={historyColumns}
                    data={planHistory}
                    getRowId={(event) => event.id}
                  />
                ) : (
                  <EmptyState
                    icon={<History size={48} />}
                    title="Chưa có lịch sử"
                    description="Các thay đổi của kế hoạch sẽ được ghi lại ở đây"
                  />
                )}
              </CardContent>
            </Card>
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
                  closeModal();
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
                  closeModal();
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
            onConfirm={async (_reason: string) => {
              if (modalState.plan) {
                try {
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
            onConfirm={async (startDate: string) => {
              if (modalState.plan) {
                try {
                  await updatePlanApi(modalState.plan.id, { status: 'active', startDate });
                  toast.success(`Đã triển khai kế hoạch "${modalState.plan?.name}" từ ${startDate}`);
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
            onConfirm={async (_reason: string) => {
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
                  navigate('/plans/list');
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
            onConfirm={async (_note: string) => {
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
            onConfirm={async (_reason: string) => {
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

      {/* Inspection Round Modals */}
      {roundModalState.round && (
        <>
          <SendRoundApprovalModal
            isOpen={roundModalState.type === 'sendRoundApproval'}
            onClose={closeRoundModal}
            round={roundModalState.round}
            onConfirm={async () => {
              if (roundModalState.round) {
                try {
                  await updatePlanRoundStatus(roundModalState.round.id, 'pending_approval');
                  toast.success(`Đã gửi duyệt đợt kiểm tra "${roundModalState.round.name}"`);
                  closeRoundModal();
                } catch (err) {
                  toast.error('Lỗi khi cập nhật trạng thái');
                }
              }
            }}
          />
          <StartRoundInspectionModal
            isOpen={roundModalState.type === 'startRoundInspection'}
            onClose={closeRoundModal}
            round={roundModalState.round}
            onConfirm={async () => {
              if (roundModalState.round) {
                try {
                  const newStatus = roundModalState.round.status === 'pending_approval' ? 'approved' : 'in_progress';
                  await updatePlanRoundStatus(roundModalState.round.id, newStatus);
                  toast.success(`Thêm tác thành công cho "${roundModalState.round.name}"`);
                  closeRoundModal();
                } catch (err) {
                  toast.error('Lỗi khi cập nhật trạng thái');
                }
              }
            }}
          />
          <CompleteRoundModal
            isOpen={roundModalState.type === 'completeRound'}
            onClose={closeRoundModal}
            round={roundModalState.round}
            onConfirm={async () => {
              if (roundModalState.round) {
                try {
                  await updatePlanRoundStatus(roundModalState.round.id, 'completed');
                  toast.success(`Đã hoàn thành đợt kiểm tra "${roundModalState.round.name}"`);
                  closeRoundModal();
                } catch (err) {
                  toast.error('Lỗi khi cập nhật trạng thái');
                }
              }
            }}
          />
          <CancelRoundModal
            isOpen={roundModalState.type === 'cancelRound'}
            onClose={closeRoundModal}
            round={roundModalState.round}
            onConfirm={async () => {
              if (roundModalState.round) {
                try {
                  await updatePlanRoundStatus(roundModalState.round.id, 'cancelled');
                  toast.success(`Đã hủy đợt kiểm tra "${roundModalState.round.name}"`);
                  closeRoundModal();
                } catch (err) {
                  toast.error('Lỗi khi cập nhật trạng thái');
                }
              }
            }}
          />
          <DeleteRoundModal
            isOpen={roundModalState.type === 'deleteRound'}
            onClose={closeRoundModal}
            round={roundModalState.round}
            onConfirm={async () => {
              if (roundModalState.round) {
                try {
                  toast.info('Tính năng xóa đang được phát triển');
                  closeRoundModal();
                } catch (err) {
                  toast.error('Lỗi khi xóa');
                }
              }
            }}
          />
          <RejectRoundModal
            isOpen={roundModalState.type === 'rejectRound'}
            onClose={closeRoundModal}
            round={roundModalState.round}
            onConfirm={async () => {
              if (roundModalState.round) {
                try {
                  await updatePlanRoundStatus(roundModalState.round.id, 'rejected');
                  toast.success(`Đã từ chối duyệt đợt kiểm tra "${roundModalState.round.name}"`);
                  closeRoundModal();
                } catch (err) {
                  toast.error('Lỗi khi cập nhật trạng thái');
                }
              }
            }}
          />
          <PauseRoundModal
            isOpen={roundModalState.type === 'pauseRound'}
            onClose={closeRoundModal}
            round={roundModalState.round}
            onConfirm={async () => {
              if (roundModalState.round) {
                try {
                  await updatePlanRoundStatus(roundModalState.round.id, 'paused');
                  toast.success(`Đã tạm dừng đợt kiểm tra "${roundModalState.round.name}"`);
                  closeRoundModal();
                } catch (err) {
                  toast.error('Lỗi khi cập nhật trạng thái');
                }
              }
            }}
          />
          <ResumeRoundModal
            isOpen={roundModalState.type === 'resumeRound'}
            onClose={closeRoundModal}
            round={roundModalState.round}
            onConfirm={async () => {
              if (roundModalState.round) {
                try {
                  await updatePlanRoundStatus(roundModalState.round.id, 'in_progress');
                  toast.success(`Đã tiếp tục đợt kiểm tra "${roundModalState.round.name}"`);
                  closeRoundModal();
                } catch (err) {
                  toast.error('Lỗi khi cập nhật trạng thái');
                }
              }
            }}
          />
          <DeployRoundActionModal
            isOpen={roundModalState.type === 'deployRound'}
            onClose={closeRoundModal}
            round={roundModalState.round}
            onConfirm={async () => {
              if (roundModalState.round) {
                try {
                  await updatePlanRoundStatus(roundModalState.round.id, 'active');
                  toast.success(`Đã triển khai đợt kiểm tra "${roundModalState.round.name}"`);
                  closeRoundModal();
                } catch (err) {
                  toast.error('Lỗi khi cập nhật trạng thái');
                }
              }
            }}
          />
        </>
      )}
    </div>
  );
}
