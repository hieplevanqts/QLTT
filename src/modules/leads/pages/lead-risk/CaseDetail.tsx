import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Calendar,
  MapPin,
  FileText,
  Send,
  AlertOctagon,
  UserPlus,
  Play,
  Pause,
  FileCheck,
  Flag,
  Search,
  Upload,
  CheckSquare,
  Loader2,
  Eye,
  Building2,
  Activity,
  Image as ImageIcon,
} from 'lucide-react';
import { Breadcrumb } from '@/components/Breadcrumb';
import { StatusBadge } from '@/components/common/StatusBadge';
import { getStatusProps } from '@/utils/status-badge-helper';
import { UrgencyBadge } from '@/components/lead-risk/UrgencyBadge';
import { projectId, publicAnonKey } from '@/utils/supabase/info';
import styles from './CaseDetail.module.css';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-bb2eb709`;

type CaseStatus = 'new' | 'in_verification' | 'in_progress' | 'under_investigation' | 'resolved' | 'closed';

interface CaseData {
  id: number;
  store_name: string;
  category: string;
  severity: string;
  description: string;
  status: CaseStatus;
  source: string;
  created_at: string;
  updated_at: string;
}

export default function CaseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form states for different panels
  const [triageDecision, setTriageDecision] = useState<'approve' | 'reject' | 'escalate'>('approve');
  const [triageNotes, setTriageNotes] = useState('');
  const [assignee, setAssignee] = useState('');
  const [verificationChecks, setVerificationChecks] = useState({
    locationVerified: false,
    evidenceCollected: false,
    witnessInterviewed: false,
    documentsObtained: false,
  });
  const [progressNotes, setProgressNotes] = useState('');
  const [investigationFindings, setInvestigationFindings] = useState('');
  const [resolutionOutcome, setResolutionOutcome] = useState('');

  useEffect(() => {
    const fetchCaseDetail = async () => {
      if (!id) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/risk-cases`, {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch case data');
        }

        const matchedCase = data.data.find((c: any) => c.id === parseInt(id));

        if (!matchedCase) {
          throw new Error('Case not found');
        }

        setCaseData(matchedCase);
      } catch (err) {
        console.error('❌ Error fetching case detail:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCaseDetail();
  }, [id]);

  const getCategoryLabel = (category: string): string => {
    const labels: Record<string, string> = {
      counterfeit: 'Hàng giả',
      smuggling: 'Buôn lậu',
      illegal_trading: 'Kinh doanh bất hợp pháp',
      food_safety: 'An toàn thực phẩm',
      price_fraud: 'Gian lận giá cả',
      unlicensed: 'Không giấy phép',
      product_quality: 'Chất lượng sản phẩm',
      labeling: 'Nhãn mác',
      advertising: 'Quảng cáo',
      other: 'Khác',
    };
    return labels[category] || category;
  };

  const getStatusLabel = (status: string): string => {
    const labels: Record<string, string> = {
      new: 'Mới',
      in_verification: 'Đang xác minh',
      in_progress: 'Đang xử lý',
      under_investigation: 'Đang điều tra',
      resolved: 'Đã xử lý',
      closed: 'Đã đóng',
    };
    return labels[status] || status;
  };

  const handleStatusChange = async (newStatus: CaseStatus) => {
    // In real app, this would call API to update status
    if (caseData) {
      setCaseData({ ...caseData, status: newStatus });
      alert(`Đã chuyển trạng thái sang: ${getStatusLabel(newStatus)}`);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className={styles.container}>
        <Breadcrumb
          items={[
            { label: 'Nguồn tin, Rủi ro', path: '/lead-risk/inbox' },
            { label: 'Tổng quan rủi ro', path: '/lead-risk/dashboard' },
            { label: 'Chi tiết case' },
          ]}
        />
        <div className={styles.loadingState}>
          <Loader2 size={48} className={styles.spinner} />
          <p>Đang tải thông tin case...</p>
        </div>
      </div>
    );
  }

  // Not found state
  if (!caseData) {
    return (
      <div className={styles.container}>
        <Breadcrumb
          items={[
            { label: 'Nguồn tin, Rủi ro', path: '/lead-risk/inbox' },
            { label: 'Tổng quan rủi ro', path: '/lead-risk/dashboard' },
            { label: 'Chi tiết case' },
          ]}
        />
        <div className={styles.notFound}>
          <AlertTriangle size={48} />
          <h2>Không tìm thấy case</h2>
          <p>Case với ID "{id}" không tồn tại trong hệ thống</p>
          <button onClick={() => navigate('/lead-risk/dashboard')} className={styles.backButton}>
            <ArrowLeft size={16} />
            Quay lại Dashboard
          </button>
        </div>
      </div>
    );
  }

  const urgency = caseData.severity === 'critical' ? 'high' as const : 
                  caseData.severity === 'major' ? 'medium' as const : 'low' as const;

  return (
    <div className={styles.container}>
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Nguồn tin, Rủi ro', path: '/lead-risk/inbox' },
          { label: 'Tổng quan rủi ro', path: '/lead-risk/dashboard' },
          { label: `CASE-${String(caseData.id).padStart(4, '0')}` },
        ]}
      />

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <button onClick={() => navigate(-1)} className={styles.backBtn}>
            <ArrowLeft size={20} />
            Quay lại
          </button>
          <div className={styles.headerActions}>
            <button className={styles.actionBtn}>
              <Eye size={16} />
              Theo dõi
            </button>
            <button className={styles.actionBtn}>
              <Flag size={16} />
              Báo cáo
            </button>
          </div>
        </div>

        <div className={styles.headerContent}>
          <div>
            <div className={styles.caseCode}>CASE-{String(caseData.id).padStart(4, '0')}</div>
            <h1 className={styles.title}>
              {getCategoryLabel(caseData.category)} - {caseData.severity}
            </h1>
          </div>

          <div className={styles.badges}>
            <StatusBadge {...getStatusProps('lead', caseData.status)} />
            <UrgencyBadge urgency={urgency} />
          </div>
        </div>

        <div className={styles.metadata}>
          <div className={styles.metaItem}>
            <Building2 size={14} />
            {caseData.store_name}
          </div>
          <div className={styles.metaItem}>
            <Calendar size={14} />
            {new Date(caseData.created_at).toLocaleDateString('vi-VN')}
          </div>
          <div className={styles.metaItem}>
            <FileText size={14} />
            {caseData.source || 'Hệ thống'}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {/* Dynamic Sidebar based on Status */}
        <div className={styles.sidebar}>
          {/* Status: NEW - Triage Panel */}
          {caseData.status === 'new' && (
            <div className={styles.panel}>
              <div className={styles.panelHeader}>
                <AlertOctagon size={20} />
                <h3>Phân loại Case</h3>
              </div>
              <div className={styles.panelBody}>
                <p className={styles.panelHint}>
                  Case mới cần được phân loại để xác định hướng xử lý
                </p>

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
                      Chấp nhận xử lý
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
                      <Flag size={16} />
                      Báo cáo lên
                    </label>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Ghi chú đánh giá</label>
                  <textarea
                    value={triageNotes}
                    onChange={(e) => setTriageNotes(e.target.value)}
                    placeholder="Nhập đánh giá ban đầu về case..."
                    rows={4}
                  />
                </div>

                <button
                  className={styles.submitBtn}
                  onClick={() => handleStatusChange('in_verification')}
                >
                  <Send size={16} />
                  Xác nhận phân loại
                </button>
              </div>
            </div>
          )}

          {/* Status: IN_VERIFICATION - Verification Panel */}
          {caseData.status === 'in_verification' && (
            <div className={styles.panel}>
              <div className={styles.panelHeader}>
                <Search size={20} />
                <h3>Xác minh thông tin</h3>
              </div>
              <div className={styles.panelBody}>
                <p className={styles.panelHint}>
                  Checklist xác minh trước khi tiến hành xử lý
                </p>

                <div className={styles.checklistGroup}>
                  <label className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={verificationChecks.locationVerified}
                      onChange={(e) =>
                        setVerificationChecks({
                          ...verificationChecks,
                          locationVerified: e.target.checked,
                        })
                      }
                    />
                    <CheckSquare size={16} />
                    Đã xác minh địa điểm
                  </label>
                  <label className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={verificationChecks.evidenceCollected}
                      onChange={(e) =>
                        setVerificationChecks({
                          ...verificationChecks,
                          evidenceCollected: e.target.checked,
                        })
                      }
                    />
                    <CheckSquare size={16} />
                    Đã thu thập minh chứng
                  </label>
                  <label className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={verificationChecks.witnessInterviewed}
                      onChange={(e) =>
                        setVerificationChecks({
                          ...verificationChecks,
                          witnessInterviewed: e.target.checked,
                        })
                      }
                    />
                    <CheckSquare size={16} />
                    Đã phỏng vấn người báo
                  </label>
                  <label className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={verificationChecks.documentsObtained}
                      onChange={(e) =>
                        setVerificationChecks({
                          ...verificationChecks,
                          documentsObtained: e.target.checked,
                        })
                      }
                    />
                    <CheckSquare size={16} />
                    Đã lấy hồ sơ liên quan
                  </label>
                </div>

                <div className={styles.uploadArea}>
                  <Upload size={24} />
                  <p>Tải lên minh chứng</p>
                  <small>Ảnh, video, tài liệu</small>
                </div>

                <button
                  className={styles.submitBtn}
                  onClick={() => handleStatusChange('in_progress')}
                  disabled={
                    !verificationChecks.locationVerified ||
                    !verificationChecks.evidenceCollected
                  }
                >
                  <Play size={16} />
                  Chuyển sang xử lý
                </button>
              </div>
            </div>
          )}

          {/* Status: IN_PROGRESS - Progress Panel */}
          {caseData.status === 'in_progress' && (
            <div className={styles.panel}>
              <div className={styles.panelHeader}>
                <Play size={20} />
                <h3>Đang xử lý</h3>
              </div>
              <div className={styles.panelBody}>
                <div className={styles.assigneeInfo}>
                  <div className={styles.infoRow}>
                    <User size={16} />
                    <div>
                      <div className={styles.infoLabel}>Người xử lý</div>
                      <div className={styles.infoValue}>Nguyễn Văn A</div>
                    </div>
                  </div>
                  <div className={styles.infoRow}>
                    <Calendar size={16} />
                    <div>
                      <div className={styles.infoLabel}>Hạn xử lý</div>
                      <div className={styles.infoValue}>
                        {new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN')}
                      </div>
                    </div>
                  </div>
                  <div className={styles.infoRow}>
                    <Clock size={16} />
                    <div>
                      <div className={styles.infoLabel}>Thời gian còn lại</div>
                      <div className={styles.infoValue}>2 ngày</div>
                    </div>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Cập nhật tiến độ</label>
                  <textarea
                    value={progressNotes}
                    onChange={(e) => setProgressNotes(e.target.value)}
                    placeholder="Nhập tiến độ xử lý hiện tại..."
                    rows={4}
                  />
                </div>

                <div className={styles.buttonGroup}>
                  <button
                    className={styles.submitBtn}
                    onClick={() => handleStatusChange('under_investigation')}
                  >
                    <Search size={16} />
                    Chuyển điều tra
                  </button>
                  <button className={styles.secondaryBtn}>
                    <Pause size={16} />
                    Tạm dừng
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Status: UNDER_INVESTIGATION - Investigation Panel */}
          {caseData.status === 'under_investigation' && (
            <div className={styles.panel}>
              <div className={styles.panelHeader}>
                <Search size={20} />
                <h3>Đang điều tra</h3>
              </div>
              <div className={styles.panelBody}>
                <p className={styles.panelHint}>
                  Case đang được điều tra chi tiết
                </p>

                <div className={styles.assigneeInfo}>
                  <div className={styles.infoRow}>
                    <User size={16} />
                    <div>
                      <div className={styles.infoLabel}>Điều tra viên</div>
                      <div className={styles.infoValue}>Trần Văn B</div>
                    </div>
                  </div>
                  <div className={styles.infoRow}>
                    <Building2 size={16} />
                    <div>
                      <div className={styles.infoLabel}>Đơn vị điều tra</div>
                      <div className={styles.infoValue}>Đội QLTT số 1</div>
                    </div>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Kết quả điều tra</label>
                  <textarea
                    value={investigationFindings}
                    onChange={(e) => setInvestigationFindings(e.target.value)}
                    placeholder="Nhập kết quả điều tra, phát hiện, bằng chứng..."
                    rows={5}
                  />
                </div>

                <button
                  className={styles.submitBtn}
                  onClick={() => handleStatusChange('resolved')}
                >
                  <CheckCircle2 size={16} />
                  Hoàn thành điều tra
                </button>
              </div>
            </div>
          )}

          {/* Status: RESOLVED - Resolution Panel */}
          {caseData.status === 'resolved' && (
            <div className={styles.panel}>
              <div className={styles.panelHeader}>
                <FileCheck size={20} />
                <h3>Đã xử lý</h3>
              </div>
              <div className={styles.panelBody}>
                <div className={styles.successMessage}>
                  <CheckCircle2 size={24} />
                  <p>Case đã được xử lý thành công</p>
                </div>

                <div className={styles.resultCard}>
                  <div className={styles.resultItem}>
                    <div className={styles.resultLabel}>Kết quả</div>
                    <div className={styles.resultValue}>Xử phạt vi phạm</div>
                  </div>
                  <div className={styles.resultItem}>
                    <div className={styles.resultLabel}>Hành động</div>
                    <div className={styles.resultValue}>
                      - Thu giữ hàng hóa vi phạm
                      <br />- Xử phạt hành chính 10.000.000 VNĐ
                    </div>
                  </div>
                  <div className={styles.resultItem}>
                    <div className={styles.resultLabel}>Người xử lý</div>
                    <div className={styles.resultValue}>Nguyễn Văn A</div>
                  </div>
                  <div className={styles.resultItem}>
                    <div className={styles.resultLabel}>Ngày hoàn thành</div>
                    <div className={styles.resultValue}>
                      {new Date(caseData.updated_at).toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                </div>

                <button
                  className={styles.submitBtn}
                  onClick={() => handleStatusChange('closed')}
                >
                  <XCircle size={16} />
                  Đóng case
                </button>
              </div>
            </div>
          )}

          {/* Status: CLOSED - Summary Panel */}
          {caseData.status === 'closed' && (
            <div className={styles.panel}>
              <div className={styles.panelHeader}>
                <FileCheck size={20} />
                <h3>Đã đóng</h3>
              </div>
              <div className={styles.panelBody}>
                <div className={styles.closedBadge}>
                  <CheckCircle2 size={32} />
                  <h4>Case đã đóng</h4>
                  <p>Không thể chỉnh sửa</p>
                </div>

                <div className={styles.summaryCard}>
                  <h4>Tổng kết</h4>
                  <div className={styles.summaryItem}>
                    <strong>Thời gian xử lý:</strong>
                    <span>
                      {Math.ceil(
                        (new Date(caseData.updated_at).getTime() -
                          new Date(caseData.created_at).getTime()) /
                          (1000 * 60 * 60 * 24)
                      )}{' '}
                      ngày
                    </span>
                  </div>
                  <div className={styles.summaryItem}>
                    <strong>Kết quả:</strong>
                    <span>Xử lý thành công</span>
                  </div>
                  <div className={styles.summaryItem}>
                    <strong>Tác động:</strong>
                    <span>Giảm 15 điểm risk score</span>
                  </div>
                </div>

                <button className={styles.secondaryBtn} onClick={() => navigate(-1)}>
                  <ArrowLeft size={16} />
                  Quay lại danh sách
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className={styles.main}>
          <div className={styles.section}>
            <h3>Mô tả chi tiết</h3>
            <p className={styles.description}>
              {caseData.description || 'Không có mô tả chi tiết'}
            </p>
          </div>

          <div className={styles.section}>
            <h3>Thông tin cơ sở</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <div className={styles.infoLabel}>Tên cơ sở</div>
                <div className={styles.infoValue}>{caseData.store_name}</div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoLabel}>Danh mục vi phạm</div>
                <div className={styles.infoValue}>{getCategoryLabel(caseData.category)}</div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoLabel}>Mức độ nghiêm trọng</div>
                <div className={styles.infoValue}>
                  <span className={styles[`severity-${caseData.severity}`]}>
                    {caseData.severity}
                  </span>
                </div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoLabel}>Nguồn</div>
                <div className={styles.infoValue}>{caseData.source || 'Hệ thống'}</div>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h3>Minh chứng</h3>
            <div className={styles.emptyState}>
              <ImageIcon size={48} />
              <p>Chưa có minh chứng được tải lên</p>
            </div>
          </div>

          <div className={styles.section}>
            <h3>Hoạt động gần đây</h3>
            <div className={styles.timeline}>
              <div className={styles.timelineItem}>
                <div className={styles.timelineDot} />
                <div className={styles.timelineContent}>
                  <div className={styles.timelineHeader}>
                    <strong>Case được tạo</strong>
                    <span className={styles.timelineDate}>
                      {new Date(caseData.created_at).toLocaleString('vi-VN')}
                    </span>
                  </div>
                  <p>Hệ thống tự động tạo case từ dữ liệu rủi ro</p>
                </div>
              </div>

              {caseData.status !== 'new' && (
                <div className={styles.timelineItem}>
                  <div className={styles.timelineDot} />
                  <div className={styles.timelineContent}>
                    <div className={styles.timelineHeader}>
                      <strong>Trạng thái cập nhật</strong>
                      <span className={styles.timelineDate}>
                        {new Date(caseData.updated_at).toLocaleString('vi-VN')}
                      </span>
                    </div>
                    <p>Case đã chuyển sang trạng thái: {getStatusLabel(caseData.status)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
