import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { toast } from 'sonner';
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  Flag,
  MapPin,
  Calendar,
  User,
  AlertOctagon,
  UserPlus,
  XCircle,
  AlertTriangle,
  Building2,
  FileText,
  ImageIcon,
  Clock,
  LinkIcon,
  Send,
  Phone,
  Mail,
  ChevronLeft,
  Loader2,
  PauseCircle,
  PlayCircle,
} from 'lucide-react';
import { useSupabaseLead } from '@/hooks/useSupabaseLeads';
import { StatusBadge } from '@/components/lead-risk/StatusBadge';
import { UrgencyBadge } from '@/components/lead-risk/UrgencyBadge';
import { SLATimer } from '@/components/lead-risk/SLATimer';
import { OutcomeModal } from '@/components/OutcomeModal';
import { StoreRiskProfile } from '@/components/StoreRiskProfile';
import { EscalationPanel } from '@/components/EscalationPanel';
import { AuditTrail } from '@/components/AuditTrail';
import { Breadcrumb } from '@/components/Breadcrumb';
import AssignLeadSidebar from '@/components/lead-risk/AssignLeadSidebar';
import AssignLeadModal from '@/components/lead-risk/AssignLeadModal';
import { getSupabaseClient } from '@/utils/supabaseClient';
import { projectId, publicAnonKey } from '@/utils/supabase/info';
import type { LeadUrgency, LeadConfidence, LeadCategory } from '@/utils/data/lead-risk/types';
import styles from './LeadDetail.module.css';


// Mock evidence data
const mockEvidenceImages = [
  {
    id: 'ev-001',
    url: 'https://images.unsplash.com/photo-1556742400-b5b6c5e44c2b?w=800&h=600&fit=crop',
    caption: 'Hình ảnh tổng quan cửa hàng',
    timestamp: new Date('2025-01-07T08:35:00'),
    uploadedBy: 'Nguyễn Văn A',
  },
  {
    id: 'ev-002',
    url: 'https://images.unsplash.com/photo-1605902711834-8b11c3e3ef2f?w=800&h=600&fit=crop',
    caption: 'Sản phẩm nghi giả mạo - Điện thoại không tem',
    timestamp: new Date('2025-01-07T08:40:00'),
    uploadedBy: 'Nguyễn Văn A',
  },
  {
    id: 'ev-003',
    url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=600&fit=crop',
    caption: 'Chi tiết sản phẩm - Thiếu thông tin xuất xứ',
    timestamp: new Date('2025-01-07T08:45:00'),
    uploadedBy: 'Nguyễn Văn A',
  },
  {
    id: 'ev-004',
    url: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&h=600&fit=crop',
    caption: 'Hóa đơn bán hàng nghi vấn',
    timestamp: new Date('2025-01-07T08:50:00'),
    uploadedBy: 'Nguyễn Văn A',
  },
  {
    id: 'ev-005',
    url: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=800&h=600&fit=crop',
    caption: 'Biển hiệu cửa hàng',
    timestamp: new Date('2025-01-07T08:55:00'),
    uploadedBy: 'Trần Văn B',
  },
  {
    id: 'ev-006',
    url: 'https://images.unsplash.com/photo-1512941675424-1c7c9f6f5e0e?w=800&h=600&fit=crop',
    caption: 'Kho chứa hàng phía sau cửa hàng',
    timestamp: new Date('2025-01-07T09:00:00'),
    uploadedBy: 'Trần Văn B',
  },
];

export default function LeadDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Redirect to inbox if no ID provided
  useEffect(() => {
    if (!id) {
      navigate('/lead-risk/inbox', { replace: true });
    }
  }, [id, navigate]);

  // Fetch lead from Supabase
  const { lead, loading, error, refetch } = useSupabaseLead(id);

  // ❌ REMOVED: Auto-update notification - không còn tự động chuyển trạng thái nữa
  // User chỉ XEM chi tiết, status được update thông qua action buttons

  const [activeTab, setActiveTab] = useState<'details' | 'evidence' | 'activity' | 'related'>('details');
  const [showTriagePanel, setShowTriagePanel] = useState(lead?.status === 'verifying');
  const [showAssignPanel, setShowAssignPanel] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Triage form state
  const [triageDecision, setTriageDecision] = useState<'approve' | 'reject' | 'escalate'>('approve');
  const [triageUrgency, setTriageUrgency] = useState<LeadUrgency>(lead?.urgency || 'medium');
  const [triageConfidence, setTriageConfidence] = useState<LeadConfidence>(lead?.confidence || 'medium');
  const [triageCategory, setTriageCategory] = useState<LeadCategory>(lead?.category || 'other');
  const [triageReason, setTriageReason] = useState('');

  // Assignment form state
  const [assignTo, setAssignTo] = useState('');
  const [assignTeam, setAssignTeam] = useState('');
  const [assignInstructions, setAssignInstructions] = useState('');
  const [assignPriority, setAssignPriority] = useState<LeadUrgency>('medium');

  // Assign Lead Sidebar state
  const [showAssignLeadSidebar, setShowAssignLeadSidebar] = useState(false);

  // Assign Lead Modal state (for verification status)
  const [showAssignLeadModal, setShowAssignLeadModal] = useState(false);

  // Quick Actions Sidebar state
  const [showQuickActionsSidebar, setShowQuickActionsSidebar] = useState(false);

  // Start Verification Modal state
  const [showStartVerificationModal, setShowStartVerificationModal] = useState(false);

  // Auto-redirect if lead not found
  useEffect(() => {
    if (id && !lead) {
      const timer = setTimeout(() => {
        navigate('/lead-risk/inbox', { replace: true });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [id, lead, navigate]);

  if (!id) {
    // This should be caught by the first useEffect, but just in case
    return null;
  }

  if (!lead) {
    return (
      <div className={styles.notFound}>
        <AlertTriangle size={48} />
        <h2>Không tìm thấy lead</h2>
        <p>Đang chuyển về trang danh sách...</p>
        <button onClick={() => navigate('/lead-risk/inbox', { replace: true })} className={styles.backButton}>
          <ArrowLeft size={16} />
          Quay lại ngay
        </button>
      </div>
    );
  }

  const handleTriage = () => {
    console.log('Triage decision:', {
      leadId: lead._id,
      decision: triageDecision,
      urgency: triageUrgency,
      confidence: triageConfidence,
      category: triageCategory,
      reason: triageReason,
    });
    setShowTriagePanel(false);
    toast.success('Đã phân loại lead!');
  };

  const handleAssign = () => {
    console.log('Assignment:', {
      leadId: lead._id,
      assignTo,
      assignTeam,
      instructions: assignInstructions,
      priority: assignPriority,
    });
    setShowAssignPanel(false);
    setShowAssignPanel(false);
    toast.success('Đã phân công lead!');
  };

  const handleEscalate = (data: any) => {
    console.log('Escalated:', data);
    toast.success(`Lead đã được escalate đến ${data.escalateTo}!`);
  };

  // Handle pause verification
  const handlePauseVerification = async () => {
    try {
      const supabase = getSupabaseClient();

      console.log(`⏸️ [LeadDetail] Pausing verification for lead ${lead.code}`);

      const { data, error } = await supabase
        .from('leads')
        .update({
          status: 'verify_paused',
          updated_at: new Date().toISOString()
        })
        .eq('_id', lead._id)
        .select()
        .single();

      if (error) {
        console.error('❌ [LeadDetail] Failed to pause verification:', error);
        toast.error('Lỗi khi tạm dừng xác minh', {
          description: error.message,
        });
        return;
      }

      console.log('✅ [LeadDetail] Verification paused successfully');

      toast.success('Đã tạm dừng xác minh', {
        description: `Lead ${lead.code} đã được tạm dừng.`,
        duration: 3000,
      });

      setShowQuickActionsSidebar(false);
      // Refetch lead data to update UI
      await refetch();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Lỗi không xác định';
      console.error('❌ [LeadDetail] Error pausing verification:', errorMessage);
      toast.error('Lỗi hệ thống', {
        description: errorMessage,
      });
    }
  };

  // Handle resume processing (process_paused → processing)
  const handleResumeProcessing = async () => {
    try {
      const supabase = getSupabaseClient();

      console.log(`▶️ [LeadDetail] Resuming processing for lead ${lead.code}`);

      const { data, error } = await supabase
        .from('leads')
        .update({
          status: 'processing',
          updated_at: new Date().toISOString()
        })
        .eq('_id', lead._id)
        .select()
        .single();

      if (error) {
        console.error('❌ [LeadDetail] Failed to resume processing:', error);
        toast.error('Lỗi khi tiếp tục xử lý', {
          description: error.message,
        });
        return;
      }

      console.log('✅ [LeadDetail] Processing resumed successfully');

      toast.success('Đã tiếp tục xử lý', {
        description: `Lead ${lead.code} đã được tiếp tục xử lý.`,
        duration: 3000,
      });

      setShowQuickActionsSidebar(false);
      // Refetch lead data to update UI
      await refetch();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Lỗi không xác định';
      console.error('❌ [LeadDetail] Error resuming processing:', errorMessage);
      toast.error('Lỗi hệ thống', {
        description: errorMessage,
      });
    }
  };

  // Handle resume verification (verify_paused → verifying)
  const handleResumeVerification = async () => {
    try {
      const supabase = getSupabaseClient();

      console.log(`▶️ [LeadDetail] Resuming verification for lead ${lead.code}`);
      console.log(`🔍 [LeadDetail] Current status: "${lead.status}" → Target status: "verifying"`);

      const updatePayload = {
        status: 'verifying',
        updated_at: new Date().toISOString()
      };

      console.log(`📤 [LeadDetail] Sending update payload to Supabase:`, updatePayload);

      const { data, error } = await supabase
        .from('leads')
        .update(updatePayload)
        .eq('_id', lead._id)
        .select()
        .single();

      if (error) {
        console.error('❌ [LeadDetail] Failed to resume verification:', error);
        toast.error('Lỗi khi tiếp tục xác minh', {
          description: error.message,
        });
        return;
      }

      console.log('✅ [LeadDetail] Verification resumed successfully');

      toast.success('Đã tiếp tục xác minh', {
        description: `Lead ${lead.code} đã được tiếp tục xác minh.`,
        duration: 3000,
      });

      setShowQuickActionsSidebar(false);
      // Refetch lead data to update UI
      await refetch();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Lỗi không xác định';
      console.error('❌ [LeadDetail] Error resuming verification:', errorMessage);
      toast.error('Lỗi hệ thống', {
        description: errorMessage,
      });
    }
  };

  // Handle start verification (new → verifying)
  const handleConfirmStartVerification = async () => {
    try {
      const supabase = getSupabaseClient();

      console.log(`▶️ [LeadDetail] Starting verification for lead ${lead.code}`);

      const updatePayload = {
        status: 'verifying',
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('leads')
        .update(updatePayload)
        .eq('_id', lead._id);

      if (error) {
        console.error('❌ [LeadDetail] Failed to start verification:', error);
        toast.error('Lỗi khi bắt đầu xác minh', {
          description: error.message,
        });
        return;
      }

      console.log('✅ [LeadDetail] Verification started successfully');

      toast.success('Đã bắt đầu xác minh', {
        description: `Lead ${lead.code} đã chuyển sang trạng thái đang xác minh.`,
        duration: 3000,
      });

      setShowStartVerificationModal(false);
      // Refetch lead data to update UI
      await refetch();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Lỗi không xác định';
      console.error('❌ [LeadDetail] Error starting verification:', errorMessage);
      toast.error('Lỗi hệ thống', {
        description: errorMessage,
      });
    }
  };

  return (
    <>
      <div className={styles.container}>
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Nguồn tin, Rủi ro', path: '/lead-risk/inbox' },
            { label: 'Xử lý nguồn tin hằng ngày', path: '/lead-risk/inbox' },
            { label: lead.code },
          ]}
        />

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <div className={styles.headerLeft}>
              <button onClick={() => navigate('/lead-risk/inbox')} className={styles.backBtn}>
                <ChevronLeft size={16} />
                Quay lại
              </button>
            </div>
          </div>

          <div className={styles.headerContent}>
            <div className={styles.titleRow}>
              <div>
                <div className={styles.code}>{lead.code}</div>
                <h1 className={styles.title}>{lead.title}</h1>
              </div>
              <SLATimer
                deadline={lead.sla.deadline}
                remainingHours={typeof lead.sla.remainingHours === 'number' && !isNaN(lead.sla.remainingHours) ? lead.sla.remainingHours : 24}
                isOverdue={lead.sla.isOverdue}
                size="lg"
              />
            </div>

            <div className={styles.metadata}>
              <StatusBadge status={lead.status} />
              <UrgencyBadge urgency={lead.urgency} />
              <div className={styles.metaItem}>
                <MapPin size={14} />
                {lead.location.district}, {lead.location.province}
              </div>
              {lead.assignedTo && (
                <div className={styles.metaItem}>
                  <User size={14} />
                  {lead.assignedTo.userName}
                </div>
              )}
            </div>

            {/* Timeline metadata - Redesigned */}
            <div className={styles.timelineMetadata}>
              <div className={styles.timelineItem}>
                <div className={styles.timelineLabel}>Tiếp nhận</div>
                <div className={styles.timelineValue}>
                  <Calendar size={14} />
                  {new Date(lead.reportedAt).toLocaleDateString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
              <div className={styles.timelineDivider}>→</div>
              <div className={styles.timelineItem}>
                <div className={styles.timelineLabel}>Cập nhật</div>
                <div className={styles.timelineValue}>
                  <Calendar size={14} />
                  {new Date(lead.updatedAt || lead.reportedAt).toLocaleDateString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
              <div className={styles.timelineDivider}>→</div>
              <div className={styles.timelineItem}>
                <div className={styles.timelineLabel}>Hạn xử lý</div>
                <div className={`${styles.timelineValue} ${lead.sla.isOverdue ? styles.timelineOverdue : ''}`}>
                  <Clock size={14} />
                  {new Date(lead.sla.deadline).toLocaleDateString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.content}>
          {/* Sidebar - Triage/Assignment Panels */}
          <div className={styles.sidebar}>
            {/* Triage Panel */}
            {showTriagePanel && (
              <div className={styles.panel}>
                <div className={styles.panelHeader}>
                  <AlertOctagon size={20} />
                  <h3>Phân loại Lead</h3>
                </div>

                <div className={styles.panelBody}>
                  <div className={styles.formGroup}>
                    <label>Quyết định</label>
                    <div className={styles.radioGroup}>
                      <label className={styles.radio}>
                        <input
                          type="radio"
                          name="decision"
                          value="approve"
                          checked={triageDecision === 'approve'}
                          onChange={(e) => setTriageDecision(e.target.value as 'approve')}
                        />
                        <CheckCircle2 size={16} />
                        Chấp nhận
                      </label>
                      <label className={styles.radio}>
                        <input
                          type="radio"
                          name="decision"
                          value="reject"
                          checked={triageDecision === 'reject'}
                          onChange={(e) => setTriageDecision(e.target.value as 'reject')}
                        />
                        <XCircle size={16} />
                        Từ chối
                      </label>
                      <label className={styles.radio}>
                        <input
                          type="radio"
                          name="decision"
                          value="escalate"
                          checked={triageDecision === 'escalate'}
                          onChange={(e) => setTriageDecision(e.target.value as 'escalate')}
                        />
                        <AlertTriangle size={16} />
                        Báo cáo lên
                      </label>
                    </div>
                  </div>

                  {triageDecision === 'approve' && (
                    <>
                      <div className={styles.formGroup}>
                        <label>Mức độ khn cấp</label>
                        <select value={triageUrgency} onChange={(e) => setTriageUrgency(e.target.value as LeadUrgency)}>
                          <option value="low">Thấp</option>
                          <option value="medium">Trung bình</option>
                          <option value="high">Cao</option>
                          <option value="critical">Nghiêm trọng</option>
                        </select>
                      </div>

                      <div className={styles.formGroup}>
                        <label>Độ tin cậy</label>
                        <select value={triageConfidence} onChange={(e) => setTriageConfidence(e.target.value as LeadConfidence)}>
                          <option value="low">Thấp</option>
                          <option value="medium">Trung bình</option>
                          <option value="high">Cao</option>
                        </select>
                      </div>

                      <div className={styles.formGroup}>
                        <label>Danh mục vi phạm</label>
                        <select value={triageCategory} onChange={(e) => setTriageCategory(e.target.value as LeadCategory)}>
                          <option value="counterfeit">Hàng giả</option>
                          <option value="smuggling">Buôn lậu</option>
                          <option value="illegal_trading">Kinh doanh bất hợp pháp</option>
                          <option value="food_safety">An toàn thực phẩm</option>
                          <option value="price_fraud">Gian lận giá cả</option>
                          <option value="unlicensed">Không giấy phép</option>
                          <option value="other">Khác</option>
                        </select>
                      </div>
                    </>
                  )}

                  <div className={styles.formGroup}>
                    <label>Lý do / Ghi chú</label>
                    <textarea
                      value={triageReason}
                      onChange={(e) => setTriageReason(e.target.value)}
                      placeholder="Nhập lý do quyết định..."
                      rows={4}
                    />
                  </div>

                  <button className={styles.submitBtn} onClick={handleTriage}>
                    <Send size={16} />
                    Xác nhận phân loại
                  </button>
                </div>
              </div>
            )}

            {/* Status-Based Actions Panel */}
            {!showTriagePanel && (
              <div className={styles.panel} style={{ marginTop: '16px' }}>
                <div className={styles.panelHeader}>
                  <AlertOctagon size={20} />
                  <h3>Thao tác nhanh</h3>
                </div>

                <div className={styles.panelBody}>
                  <div className={styles.quickActionsGrid} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {/* NEW status */}
                    {/* NEW status - Chỉ có Bắt đầu xác minh, không có Từ chối */}
                    {/* Nghiệp vụ: Lead mới phải qua xác minh trước, không thể từ chối ngay */}
                    {lead.status === 'new' && (
                      <button
                        className={styles.submitBtn}
                        onClick={() => setShowStartVerificationModal(true)}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%' }}
                      >
                        <PlayCircle size={16} />
                        Bắt đầu xác minh
                      </button>
                    )}

                    {/* VERIFYING status */}
                    {lead.status === 'verifying' && (
                      <>
                        <button
                          className={styles.secondaryBtn}
                          onClick={handlePauseVerification}
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%' }}
                        >
                          <PauseCircle size={16} />
                          Tạm dừng xác minh
                        </button>
                        <button
                          className={styles.submitBtn}
                          onClick={() => setShowAssignLeadModal(true)}
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%' }}
                        >
                          <UserPlus size={16} />
                          Giao việc
                        </button>
                      </>
                    )}

                    {/* VERIFY_PAUSED status */}
                    {lead.status === 'verify_paused' && (
                      <>
                        <button
                          className={styles.submitBtn}
                          onClick={handleResumeVerification}
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%' }}
                        >
                          <PlayCircle size={16} />
                          Tiếp tục xác minh
                        </button>
                        <button
                          className={styles.secondaryBtn}
                          onClick={() => setShowAssignLeadModal(true)}
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%' }}
                        >
                          <UserPlus size={16} />
                          Giao việc
                        </button>
                      </>
                    )}

                    {/* ASSIGNED / PROCESSING status */}
                    {(lead.status === 'assigned' || lead.status === 'processing') && (
                      <>
                        <button
                          className={styles.secondaryBtn}
                          onClick={handlePauseVerification}
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%' }}
                        >
                          <PauseCircle size={16} />
                          Tạm dừng xử lý
                        </button>
                        <button
                          className={styles.submitBtn}
                          onClick={() => toast.info('Tính năng đang được cập nhật')}
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%' }}
                        >
                          <CheckCircle2 size={16} />
                          Hoàn thành xử lý
                        </button>
                        {(typeof lead.sla.remainingHours === 'number' && !isNaN(lead.sla.remainingHours) && lead.sla.remainingHours <= 4) && (
                          <button
                            className={styles.secondaryBtn}
                            onClick={() => toast.info('Vui lòng sử dụng panel "Báo cáo lên" bên dưới')}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%' }}
                          >
                            <AlertTriangle size={16} />
                            Báo cáo lên cấp trên
                          </button>
                        )}
                      </>
                    )}

                    {/* PROCESS_PAUSED status */}
                    {lead.status === 'process_paused' && (
                      <>
                        <button
                          className={styles.submitBtn}
                          onClick={handleResumeProcessing}
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%' }}
                        >
                          <PlayCircle size={16} />
                          Tiếp tục xử lý
                        </button>
                        <button
                          className={styles.secondaryBtn}
                          onClick={() => setShowAssignLeadModal(true)}
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%' }}
                        >
                          <UserPlus size={16} />
                          Giao việc lại
                        </button>
                      </>
                    )}

                    {/* INSPECTION_SCHEDULED status */}
                    {lead.status === 'inspection_scheduled' && (
                      <>
                        <button
                          className={styles.submitBtn}
                          onClick={() => toast.success('Đã bắt đầu kiểm tra tại hiện trường')}
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%' }}
                        >
                          <PlayCircle size={16} />
                          Bắt đầu kiểm tra
                        </button>
                        <button
                          className={styles.secondaryBtn}
                          onClick={() => toast.info('Đã hủy lịch kiểm tra')}
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%' }}
                        >
                          <XCircle size={16} />
                          Hủy lịch kiểm tra
                        </button>
                      </>
                    )}

                    {/* COMPLETED status */}
                    {lead.status === 'completed' && (
                      <button
                        className={styles.submitBtn}
                        onClick={() => toast.info('Tính năng đang được cập nhật')}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%' }}
                      >
                        <CheckCircle2 size={16} />
                        Đóng lead
                      </button>
                    )}

                    {/* CLOSED status */}
                    {lead.status === 'closed' && (
                      <button
                        className={styles.submitBtn}
                        onClick={() => toast.success('Đã mở lại lead')}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%' }}
                      >
                        <PlayCircle size={16} />
                        Mở lại lead
                      </button>
                    )}
                  </div>

                  {/* Assignment Info - Show when lead is assigned */}
                  {lead.assignedTo && (lead.status === 'assigned' || lead.status === 'processing' || lead.status === 'process_paused') && (
                    <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                      <div className={styles.assignedInfo}>
                        <div className={styles.assignedItem}>
                          <User size={16} />
                          <div>
                            <div className={styles.assignedLabel}>Cán bộ phụ trách</div>
                            <div className={styles.assignedValue}>{lead.assignedTo.userName}</div>
                          </div>
                        </div>
                        <div className={styles.assignedItem}>
                          <Building2 size={16} />
                          <div>
                            <div className={styles.assignedLabel}>Đội QLTT</div>
                            <div className={styles.assignedValue}>{lead.assignedTo.teamName}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Báo cáo lên */}
            {!showTriagePanel && (typeof lead.sla.remainingHours === 'number' && !isNaN(lead.sla.remainingHours) && lead.sla.remainingHours <= 4) && (
              <div style={{ marginTop: '16px' }}>
                <EscalationPanel
                  leadId={lead._id}
                  leadTitle={lead.title}
                  currentUrgency={lead.urgency}
                  slaRemaining={typeof lead.sla.remainingHours === 'number' && !isNaN(lead.sla.remainingHours) ? lead.sla.remainingHours : 24}
                  onEscalate={handleEscalate}
                />
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className={styles.main}>
            {/* Tabs */}
            <div className={styles.tabs}>
              <button
                className={activeTab === 'details' ? styles.tabActive : styles.tab}
                onClick={() => setActiveTab('details')}
              >
                <FileText size={16} />
                Chi tiết
              </button>
              <button
                className={activeTab === 'evidence' ? styles.tabActive : styles.tab}
                onClick={() => setActiveTab('evidence')}
              >
                <ImageIcon size={16} />
                Minh chứng ({mockEvidenceImages.length})
              </button>
              <button
                className={activeTab === 'activity' ? styles.tabActive : styles.tab}
                onClick={() => setActiveTab('activity')}
              >
                <Clock size={16} />
                Hoạt động (5)
              </button>
              <button
                className={activeTab === 'related' ? styles.tabActive : styles.tab}
                onClick={() => setActiveTab('related')}
              >
                <LinkIcon size={16} />
                Liên quan ({lead.relatedLeadsCount})
              </button>
            </div>

            {/* Tab Content */}
            <div className={styles.tabContent}>
              {activeTab === 'details' && (
                <div className={styles.detailsTab}>
                  {/* Thông tin cơ bản */}
                  <section className={styles.section}>
                    <h3>Thông tin cơ bản</h3>
                    <div className={styles.infoGrid}>
                      <div className={styles.infoRow}>
                        <div className={styles.infoLabel}>Nguồn tin</div>
                        <div className={styles.infoValue}>{getSourceLabel(lead.source)}</div>
                      </div>
                      <div className={styles.infoRow}>
                        <div className={styles.infoLabel}>Mức độ khẩn cấp</div>
                        <div className={styles.infoValue}>
                          <UrgencyBadge urgency={lead.urgency} />
                        </div>
                      </div>
                      <div className={styles.infoRow}>
                        <div className={styles.infoLabel}>Cửa hàng bị phản ánh</div>
                        <div className={styles.infoValue}>{lead.storeName || 'Chưa xác định'}</div>
                      </div>
                      <div className={styles.infoRow}>
                        <div className={styles.infoLabel}>Loại vấn đề</div>
                        <div className={styles.infoValue}>{getCategoryLabel(lead.category)}</div>
                      </div>

                      {lead.status === 'rejected' && lead.rejection_reason && (
                        <div className={styles.infoRow} style={{ gridColumn: '1 / -1', marginTop: '8px' }}>
                          <div className={styles.infoLabel} style={{ color: 'var(--destructive)' }}>
                            <AlertTriangle size={14} style={{ display: 'inline', marginRight: '4px' }} />
                            Lý do từ chối
                          </div>
                          <div className={styles.infoValue} style={{ color: 'var(--destructive)', fontWeight: 500 }}>
                            {lead.rejection_reason}
                          </div>
                        </div>
                      )}
                    </div>
                  </section>

                  {/* Mô tả chi tiết */}
                  <section className={styles.section}>
                    <h3>Mô tả chi tiết</h3>
                    <div className={styles.descriptionBox}>
                      <p className={styles.description}>{lead.description}</p>
                    </div>
                  </section>

                  {/* Minh chứng đính kèm */}
                  <section className={styles.section}>
                    <h3>Minh chứng đính kèm</h3>
                    <div className={styles.evidencePreview}>
                      {mockEvidenceImages.length > 0 ? (
                        <div className={styles.evidenceGrid}>
                          {mockEvidenceImages.slice(0, 4).map((img, idx) => (
                            <div
                              key={idx}
                              className={styles.evidenceThumbnail}
                              onClick={() => setSelectedImage(img.url)}
                            >
                              <img src={img.url} alt={img.caption} />
                              {idx === 3 && mockEvidenceImages.length > 4 && (
                                <div className={styles.moreOverlay}>
                                  +{mockEvidenceImages.length - 4}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className={styles.noEvidence}>
                          <ImageIcon size={24} />
                          <span>Chưa có minh chứng đính kèm</span>
                        </div>
                      )}
                    </div>
                  </section>

                  {/* Thông tin người cung cấp */}
                  <section className={styles.section}>
                    <h3>Thông tin người cung cấp</h3>
                    <div className={styles.infoGrid}>
                      <div className={styles.infoRow}>
                        <div className={styles.infoLabel}>Thời gian xảy ra</div>
                        <div className={styles.infoValue}>
                          {new Date(lead.reportedAt).toLocaleString('vi-VN')}
                        </div>
                      </div>
                      <div className={styles.infoRow}>
                        <div className={styles.infoLabel}>Người cung cấp</div>
                        <div className={styles.infoValue}>{lead.reporterName || 'Ẩn danh'}</div>
                      </div>
                      <div className={styles.infoRow}>
                        <div className={styles.infoLabel}>Số điện thoại</div>
                        <div className={styles.infoValue}>
                          {lead.reporterPhone ? (
                            <a href={`tel:${lead.reporterPhone}`} className={styles.contactLink}>
                              {lead.reporterPhone}
                            </a>
                          ) : (
                            <span className={styles.emptyValue}>Không có</span>
                          )}
                        </div>
                      </div>
                      <div className={styles.infoRow}>
                        <div className={styles.infoLabel}>Email</div>
                        <div className={styles.infoValue}>
                          {lead.reporterEmail ? (
                            <a href={`mailto:${lead.reporterEmail}`} className={styles.contactLink}>
                              {lead.reporterEmail}
                            </a>
                          ) : (
                            <span className={styles.emptyValue}>Không có</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Thông tin phân công */}
                  <section className={styles.section}>
                    <h3>Thông tin phân công & SLA</h3>
                    {lead.assignedTo ? (
                      <div className={styles.assignmentCard}>
                        <div className={styles.assignmentGrid}>
                          <div className={styles.assignmentItem}>
                            <div className={styles.assignmentIcon}>
                              <User size={20} />
                            </div>
                            <div>
                              <div className={styles.assignmentLabel}>Cán bộ phụ trách</div>
                              <div className={styles.assignmentValue}>{lead.assignedTo.userName}</div>
                            </div>
                          </div>
                          <div className={styles.assignmentItem}>
                            <div className={styles.assignmentIcon}>
                              <Building2 size={20} />
                            </div>
                            <div>
                              <div className={styles.assignmentLabel}>Đội QLTT</div>
                              <div className={styles.assignmentValue}>{lead.assignedTo.teamName}</div>
                            </div>
                          </div>
                          <div className={styles.assignmentItem}>
                            <div className={styles.assignmentIcon}>
                              <Calendar size={20} />
                            </div>
                            <div>
                              <div className={styles.assignmentLabel}>Thời gian phân công</div>
                              <div className={styles.assignmentValue}>
                                {lead.assignedAt ? new Date(lead.assignedAt).toLocaleString('vi-VN') : 'Không có'}
                              </div>
                            </div>
                          </div>
                          <div className={styles.assignmentItem}>
                            <div className={styles.assignmentIcon} style={{
                              color: lead.sla.isOverdue ? 'var(--destructive)' : 'var(--primary)'
                            }}>
                              <Clock size={20} />
                            </div>
                            <div>
                              <div className={styles.assignmentLabel}>Hạn xử lý SLA</div>
                              <div className={styles.assignmentValue} style={{
                                color: lead.sla.isOverdue ? 'var(--destructive)' : 'inherit'
                              }}>
                                {new Date(lead.sla.deadline).toLocaleString('vi-VN')}
                                {lead.sla.isOverdue ? (
                                  <span className={styles.slaWarning}> (QUÁ HẠN)</span>
                                ) : (
                                  <span className={styles.slaInfo}> (Còn {typeof lead.sla.remainingHours === 'number' && !isNaN(lead.sla.remainingHours) ? Math.floor(lead.sla.remainingHours) : 24}h)</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className={styles.emptyNotice}>
                        <AlertTriangle size={20} />
                        <span>Nguồn tin chưa được phân công cho cán bộ nào</span>
                      </div>
                    )}
                  </section>

                  {/* Location & Store - Combined Section */}
                  <section className={styles.section}>
                    <h3>Địa điểm & Cơ sở liên quan</h3>
                    <div className={styles.locationStoreGrid}>
                      {/* Location Card */}
                      <div className={styles.locationCard}>
                        <div className={styles.cardHeader}>
                          <MapPin size={18} />
                          <span className={styles.cardTitle}>Vị trí vi phạm</span>
                        </div>
                        <div className={styles.cardBody}>
                          <div className={styles.address}>{lead.location.address}</div>
                          <div className={styles.addressDetail}>
                            {lead.location.ward && `${lead.location.ward}, `}
                            {lead.location.district}, {lead.location.province}
                          </div>
                          <div className={styles.coordinates}>
                            <span className={styles.coordLabel}>Tọa độ GPS:</span> {lead.location.lat.toFixed(6)}, {lead.location.lng.toFixed(6)}
                          </div>
                          <button className={styles.mapBtn}>
                            <MapPin size={14} />
                            Xem trên bản đồ
                          </button>
                        </div>
                      </div>

                      {/* Store Card */}
                      {lead.storeId ? (
                        <div className={styles.storeCardNew}>
                          <div className={styles.cardHeader}>
                            <Building2 size={18} />
                            <span className={styles.cardTitle}>Cơ sở kinh doanh</span>
                          </div>
                          <div className={styles.cardBody}>
                            <div className={styles.storeName}>{lead.storeName}</div>
                            <div className={styles.storeId}>Mã cơ sở: {lead.storeId}</div>
                            <div className={styles.storeMetaInfo}>
                              <div className={styles.storeMetaItem}>
                                <AlertOctagon size={14} />
                                <span>Vi phạm trước đây: 5 lần</span>
                              </div>
                              <div className={styles.storeMetaItem}>
                                <Calendar size={14} />
                                <span>Kiểm tra cuối: 15/12/2024</span>
                              </div>
                            </div>
                            <button className={styles.linkBtn}>
                              <LinkIcon size={14} />
                              Xem hồ sơ cơ sở
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className={styles.storeCardNew}>
                          <div className={styles.cardHeader}>
                            <Building2 size={18} />
                            <span className={styles.cardTitle}>Cơ sở kinh doanh</span>
                          </div>
                          <div className={styles.cardBody}>
                            <div className={styles.emptyNotice}>
                              <AlertTriangle size={16} />
                              <span>Chưa xác định được cơ sở vi phạm</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </section>

                  {/* Thống kê bổ sung */}
                  <section className={styles.section}>
                    <h3>Thống kê & Metadata</h3>
                    <div className={styles.statsGrid}>
                      <div className={styles.statCard}>
                        <div className={styles.statIcon}>
                          <ImageIcon size={20} />
                        </div>
                        <div className={styles.statContent}>
                          <div className={styles.statValue}>{lead.evidenceCount}</div>
                          <div className={styles.statLabel}>Minh chứng</div>
                        </div>
                      </div>
                      <div className={styles.statCard}>
                        <div className={styles.statIcon}>
                          <LinkIcon size={20} />
                        </div>
                        <div className={styles.statContent}>
                          <div className={styles.statValue}>{lead.relatedLeadsCount}</div>
                          <div className={styles.statLabel}>Nguồn tin liên quan</div>
                        </div>
                      </div>
                      <div className={styles.statCard}>
                        <div className={styles.statIcon}>
                          <Clock size={20} />
                        </div>
                        <div className={styles.statContent}>
                          <div className={styles.statValue}>{lead.activityCount}</div>
                          <div className={styles.statLabel}>Hoạt động</div>
                        </div>
                      </div>
                      <div className={styles.statCard}>
                        <div className={styles.statIcon}>
                          <Calendar size={20} />
                        </div>
                        <div className={styles.statContent}>
                          <div className={styles.statValue}>
                            {Math.ceil((new Date().getTime() - new Date(lead.reportedAt).getTime()) / (1000 * 60 * 60 * 24))}
                          </div>
                          <div className={styles.statLabel}>Ngày kể từ tiếp nhận</div>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Metadata hệ thống */}
                  <section className={styles.section}>
                    <h3>Metadata hệ thống</h3>
                    <div className={styles.metadataGrid}>
                      <div className={styles.metadataItem}>
                        <div className={styles.metadataLabel}>
                          <User size={14} />
                          Tạo bởi
                        </div>
                        <div className={styles.metadataValue}>{lead.createdBy}</div>
                        <div className={styles.metadataTime}>
                          {new Date(lead.createdAt).toLocaleString('vi-VN')}
                        </div>
                      </div>
                      <div className={styles.metadataItem}>
                        <div className={styles.metadataLabel}>
                          <Clock size={14} />
                          Cập nhật lần cuối
                        </div>
                        <div className={styles.metadataValue}>
                          {Math.floor((new Date().getTime() - new Date(lead.updatedAt).getTime()) / (1000 * 60))} phút trước
                        </div>
                        <div className={styles.metadataTime}>
                          {new Date(lead.updatedAt).toLocaleString('vi-VN')}
                        </div>
                      </div>
                      <div className={styles.metadataItem}>
                        <div className={styles.metadataLabel}>
                          <Flag size={14} />
                          Flags
                        </div>
                        <div className={styles.metadataValue}>
                          {lead.isDuplicate && <span className={styles.flagBadge}>Trùng lặp</span>}
                          {lead.isWatched && <span className={styles.flagBadge}>Đang theo dõi</span>}
                          {lead.hasAlert && <span className={styles.flagBadge}>Có cảnh báo</span>}
                          {!lead.isDuplicate && !lead.isWatched && !lead.hasAlert && (
                            <span style={{ color: 'var(--muted-foreground)' }}>Không có</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </section>

                  {lead.storeId && (
                    <>
                      <section className={styles.section}>
                        <StoreRiskProfile
                          storeId={lead.storeId}
                          storeName={lead.storeName || 'Cơ sở không tên'}
                          riskScore={75}
                          riskLevel="high"
                          violationCount={5}
                          lastInspection={new Date('2025-12-15')}
                          trendDirection="increasing"
                        />
                      </section>
                    </>
                  )}
                </div>
              )}

              {activeTab === 'evidence' && (
                <div className={styles.evidenceTab}>
                  <div className={styles.evidenceHeader}>
                    <h3>Minh chứng & Ảnh chụp</h3>
                    <button className={styles.uploadBtn}>
                      <ImageIcon size={16} />
                      Tải lên ảnh
                    </button>
                  </div>

                  <div className={styles.evidenceGrid}>
                    {mockEvidenceImages.map((evidence) => (
                      <div
                        key={evidence.id}
                        className={styles.evidenceCard}
                        onClick={() => setSelectedImage(evidence.url)}
                      >
                        <div className={styles.evidenceImage}>
                          <img src={evidence.url} alt={evidence.caption} />
                        </div>
                        <div className={styles.evidenceInfo}>
                          <div className={styles.evidenceCaption}>{evidence.caption}</div>
                          <div className={styles.evidenceMeta}>
                            <span>{evidence.uploadedBy}</span>
                            <span>•</span>
                            <span>{evidence.timestamp.toLocaleString('vi-VN')}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'activity' && (
                <div className={styles.activityTab}>
                  <AuditTrail entries={[
                    {
                      id: '1',
                      action: 'created',
                      userId: 'QT24_ADMIN',
                      userName: 'Nguyễn Văn Admin',
                      timestamp: '2025-01-06T09:00:00Z',
                      location: 'TP.HCM',
                    },
                    {
                      id: '2',
                      action: 'triaged',
                      userId: 'QT24_NGUYENVANA',
                      userName: 'Nguyễn Văn A',
                      timestamp: '2025-01-06T09:15:00Z',
                      details: {
                        status: 'approved',
                        urgency: lead.urgency,
                        reason: 'Lead có độ tin cậy cao, cần kiểm tra ngay'
                      },
                      location: 'TP.HCM',
                    },
                    {
                      id: '3',
                      action: 'assigned',
                      userId: 'QT24_TEAMLEAD',
                      userName: 'Trần Văn Team Lead',
                      timestamp: '2025-01-06T09:30:00Z',
                      details: {
                        assignedTo: lead.assignedTo?.userName || 'N/A',
                        deadline: '2025-01-08T17:00:00Z',
                        instructions: 'Kiểm tra tại địa điểm, thu thập bằng chứng'
                      },
                      location: 'TP.HCM',
                    },
                    ...((typeof lead.sla.remainingHours === 'number' && !isNaN(lead.sla.remainingHours) && lead.sla.remainingHours <= 2) ? [{
                      id: '4',
                      action: 'escalated' as const,
                      userId: 'QT24_NGUYENVANA',
                      userName: 'Nguyễn Văn A',
                      timestamp: '2025-01-07T14:00:00Z',
                      details: {
                        escalateTo: 'Chi Cục Trưởng',
                        reason: 'SLA < 2h, cn hỗ trợ khẩn cấp'
                      },
                      location: 'TP.HCM',
                    }] : []),
                  ]} />
                </div>
              )}

              {activeTab === 'related' && (
                <div className={styles.relatedTab}>
                  <div className={styles.emptyState}>
                    <LinkIcon size={48} />
                    <p>Không có lead liên quan</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Image Lightbox */}
        {selectedImage && (
          <div className={styles.lightbox} onClick={() => setSelectedImage(null)}>
            <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
              <button className={styles.closeBtn} onClick={() => setSelectedImage(null)}>
                <XCircle size={24} />
              </button>
              <img src={selectedImage} alt="Evidence" />
            </div>
          </div>
        )}

        {/* Assign Lead Sidebar */}
        <AssignLeadSidebar
          isOpen={showAssignLeadSidebar}
          onClose={() => setShowAssignLeadSidebar(false)}
          lead={lead}
          onAssign={async (inspectorId: string, note: string) => {
            console.log('👤 [LeadDetail] Assigning lead:', lead.code, 'to inspector:', inspectorId, 'note:', note);
            // TODO: Update Supabase with assignment
            toast.success(`Đã giao việc thành công`);
            setShowAssignLeadSidebar(false);
            // Refetch lead data to update UI
            await refetch();
          }}
        />

        {/* Assign Lead Modal */}
        <AssignLeadModal
          isOpen={showAssignLeadModal}
          onClose={() => setShowAssignLeadModal(false)}
          lead={lead}
          onAssign={async (data) => {
            console.log('👤 [LeadDetail] Assigning lead:', lead.code, 'with data:', data);

            try {
              // Step 1: Insert into map_inspection_sessions table and get the new session ID
              const { data: sessionData, error: sessionError } = await supabase
                .from('map_inspection_sessions')
                .insert({
                  merchant_id: data.merchantId,
                  status: 'pending',
                  type: 'passive',
                  description: data.description || null,
                })
                .select('_id')
                .single();

              if (sessionError) {
                console.error('❌ [LeadDetail] Error inserting inspection session:', sessionError);
                toast.error('Không thể giao việc. Vui lòng thử lại.');
                return;
              }

              console.log('✅ [LeadDetail] Created inspection session:', sessionData._id);

              // Step 2: Insert into lead_sessions table
              const { error: leadSessionError } = await supabase
                .from('lead_sessions')
                .insert({
                  lead_id: lead._id,
                  session_id: sessionData._id,
                });

              if (leadSessionError) {
                console.error('❌ [LeadDetail] Error inserting lead session:', leadSessionError);
                toast.error('Không thể liên kết giao việc. Vui lòng thử lại.');
                return;
              }

              console.log('✅ [LeadDetail] Created lead session link');

              // Step 3: Update lead status from 'verifying' to 'processing'
              const { error: updateError } = await supabase
                .from('leads')
                .update({ status: 'processing' })
                .eq('_id', lead._id);

              if (updateError) {
                console.error('❌ [LeadDetail] Error updating lead status:', updateError);
                toast.error('Không thể cập nhật trạng thái. Vui lòng thử lại.');
                return;
              }

              console.log('✅ [LeadDetail] Updated lead status to processing');

              toast.success(`Đã giao việc thành công`);
              setShowAssignLeadModal(false);
              // Refetch lead data to update UI
              await refetch();
            } catch (error) {
              console.error('❌ [LeadDetail] Error assigning lead:', error);
              toast.error('Đã xảy ra lỗi khi giao việc');
            }
          }}
        />

        {/* Start Verification Confirmation Modal */}
        <ConfirmationDialog
          isOpen={showStartVerificationModal}
          onClose={() => setShowStartVerificationModal(false)}
          onConfirm={handleConfirmStartVerification}
          title="Bắt đầu xác minh"
          message="Bạn có chắc muốn chuyển lead này sang trạng thái 'Đang xác minh'?"
          leadCode={lead.code}
          confirmText="Xác nhận"
          cancelText="Hủy"
          type="info"
        />
      </div>
    </>
  );
}

function getSourceLabel(source: string): string {
  const labels: Record<string, string> = {
    app: 'Mobile App',
    hotline: 'Hotline 1800',
    import: 'Import hàng loạt',
    field: 'Hiện trường',
    tip: 'Nguồn tin ẩn danh',
    system: 'Tự động phát hiện',
    social: 'Mạng xã hội',
  };
  return labels[source] || source;
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    counterfeit: 'Hàng giả',
    smuggling: 'Buôn lậu',
    illegal_trading: 'Kinh doanh bất hợp pháp',
    food_safety: 'An toàn thực phẩm',
    price_fraud: 'Gian lận giá cả',
    unlicensed: 'Không giấy phép',
    other: 'Khác',
  };
  return labels[category] || category;
}

function getConfidenceLabel(confidence: string): string {
  const labels: Record<string, string> = {
    low: 'Thấp',
    medium: 'Trung bình',
    high: 'Cao',
  };
  return labels[confidence] || confidence;
}

