import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
} from 'lucide-react';
import { mockLeads } from '../../data/lead-risk/mockLeads';
import { StatusBadge } from '../../app/components/lead-risk/StatusBadge';
import { UrgencyBadge } from '../../app/components/lead-risk/UrgencyBadge';
import { SLATimer } from '../../app/components/lead-risk/SLATimer';
import { OutcomeModal } from '../../app/components/OutcomeModal';
import { StoreRiskProfile } from '../../app/components/StoreRiskProfile';
import { EscalationPanel } from '../../app/components/EscalationPanel';
import { AuditTrail } from '../../app/components/AuditTrail';
import { Breadcrumb } from '../../app/components/Breadcrumb';
import type { LeadUrgency, LeadConfidence, LeadCategory } from '../../data/lead-risk/types';
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
  
  const lead = mockLeads.find(l => l.id === id);
  
  const [activeTab, setActiveTab] = useState<'details' | 'evidence' | 'activity' | 'related'>('details');
  const [showTriagePanel, setShowTriagePanel] = useState(lead?.status === 'in_verification');
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

  // Outcome tracking state
  const [showOutcomeModal, setShowOutcomeModal] = useState(false);
  
  if (!lead) {
    return (
      <div className={styles.notFound}>
        <AlertTriangle size={48} />
        <h2>Không tìm thấy lead</h2>
        <button onClick={() => navigate('/lead-risk/inbox')} className={styles.backButton}>
          <ArrowLeft size={16} />
          Quay lại Inbox
        </button>
      </div>
    );
  }
  
  const handleTriage = () => {
    console.log('Triage decision:', {
      leadId: lead.id,
      decision: triageDecision,
      urgency: triageUrgency,
      confidence: triageConfidence,
      category: triageCategory,
      reason: triageReason,
    });
    setShowTriagePanel(false);
    alert('Đã phân loại lead!');
  };
  
  const handleAssign = () => {
    console.log('Assignment:', {
      leadId: lead.id,
      assignTo,
      assignTeam,
      instructions: assignInstructions,
      priority: assignPriority,
    });
    setShowAssignPanel(false);
    alert('Đã phân công lead!');
  };

  const handleOutcomeSubmit = (data: any) => {
    console.log('Outcome submitted:', data);
    alert(`Lead đã đóng!\nKết quả: ${data.outcome}\nRisk impact: ${data.riskImpact}`);
    navigate('/lead-risk/inbox');
  };

  const handleEscalate = (data: any) => {
    console.log('Escalated:', data);
    alert(`Lead đã được escalate đến ${data.escalateTo}!`);
  };

  return (
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
          <div className={styles.headerActions}>
            {lead.status !== 'closed' && (
              <button 
                className={styles.closeLeadBtn} 
                onClick={() => setShowOutcomeModal(true)}
              >
                <CheckCircle2 size={16} />
                Đóng Lead
              </button>
            )}
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
          <div className={styles.titleRow}>
            <div>
              <div className={styles.code}>{lead.code}</div>
              <h1 className={styles.title}>{lead.title}</h1>
            </div>
            <SLATimer 
              deadline={lead.sla.deadline}
              remainingHours={lead.sla.remainingHours}
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
                      <label>Mức độ khẩn cấp</label>
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
          
          {/* Assignment Panel */}
          {!showTriagePanel && (
            <div className={styles.panel}>
              <div className={styles.panelHeader}>
                <UserPlus size={20} />
                <h3>Điều phối</h3>
              </div>
              
              {!showAssignPanel && !lead.assignedTo && (
                <div className={styles.panelBody}>
                  <p className={styles.panelHint}>Lead chưa được phân công</p>
                  <button 
                    className={styles.submitBtn}
                    onClick={() => setShowAssignPanel(true)}
                  >
                    <UserPlus size={16} />
                    Phân công ngay
                  </button>
                </div>
              )}
              
              {!showAssignPanel && lead.assignedTo && (
                <div className={styles.panelBody}>
                  <div className={styles.assignedInfo}>
                    <div className={styles.assignedItem}>
                      <User size={16} />
                      <div>
                        <div className={styles.assignedLabel}>Cán bộ</div>
                        <div className={styles.assignedValue}>{lead.assignedTo.userName}</div>
                      </div>
                    </div>
                    <div className={styles.assignedItem}>
                      <Building2 size={16} />
                      <div>
                        <div className={styles.assignedLabel}>Đội</div>
                        <div className={styles.assignedValue}>{lead.assignedTo.teamName}</div>
                      </div>
                    </div>
                    <div className={styles.assignedItem}>
                      <Calendar size={16} />
                      <div>
                        <div className={styles.assignedLabel}>Phân công lúc</div>
                        <div className={styles.assignedValue}>
                          {lead.assignedAt ? new Date(lead.assignedAt).toLocaleString('vi-VN') : 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>
                  <button 
                    className={styles.secondaryBtn}
                    onClick={() => setShowAssignPanel(true)}
                  >
                    Chuyển người khác
                  </button>
                </div>
              )}
              
              {showAssignPanel && (
                <div className={styles.panelBody}>
                  <div className={styles.formGroup}>
                    <label>Đội QLTT</label>
                    <select value={assignTeam} onChange={(e) => setAssignTeam(e.target.value)}>
                      <option value="">-- Chọn đội --</option>
                      <option value="team-01">Đội 01 - Quản lý thị trường số 1</option>
                      <option value="team-02">Đội 02 - Quản lý thị trường số 2</option>
                      <option value="team-03">Đội 03 - Quản lý thị trường số 3</option>
                      <option value="team-24">Đội 24 - TP.HCM số 4</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label>Cán bộ phụ trách</label>
                    <select value={assignTo} onChange={(e) => setAssignTo(e.target.value)}>
                      <option value="">-- Chọn cán bộ --</option>
                      <option value="user-01">Nguyễn Văn A</option>
                      <option value="user-02">Trần Văn B</option>
                      <option value="user-03">Lê Thị C</option>
                      <option value="user-04">Phạm Minh D</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label>Mức độ ưu tiên</label>
                    <select value={assignPriority} onChange={(e) => setAssignPriority(e.target.value as LeadUrgency)}>
                      <option value="low">Thấp</option>
                      <option value="medium">Trung bình</option>
                      <option value="high">Cao</option>
                      <option value="critical">Nghiêm trọng</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label>Hướng dẫn</label>
                    <textarea 
                      value={assignInstructions}
                      onChange={(e) => setAssignInstructions(e.target.value)}
                      placeholder="Nhập hướng dẫn cho cán bộ..."
                      rows={4}
                    />
                  </div>
                  
                  <div className={styles.buttonGroup}>
                    <button className={styles.submitBtn} onClick={handleAssign}>
                      <Send size={16} />
                      Phân công
                    </button>
                    <button 
                      className={styles.cancelBtn}
                      onClick={() => setShowAssignPanel(false)}
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Báo cáo lên */}
          {!showTriagePanel && lead.sla.remainingHours <= 4 && (
            <div style={{ marginTop: '16px' }}>
              <EscalationPanel
                leadId={lead.id}
                leadTitle={lead.title}
                currentUrgency={lead.urgency}
                slaRemaining={lead.sla.remainingHours}
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
                <section className={styles.section}>
                  <h3>Mô tả</h3>
                  <p className={styles.description}>{lead.description}</p>
                </section>
                
                <section className={styles.section}>
                  <h3>Thông tin người báo cáo</h3>
                  <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                      <div className={styles.infoLabel}>Tên người báo</div>
                      <div className={styles.infoValue}>
                        <User size={16} style={{ marginRight: '8px' }} />
                        {lead.reporterName || 'Ẩn danh'}
                      </div>
                    </div>
                    <div className={styles.infoItem}>
                      <div className={styles.infoLabel}>Số điện thoại</div>
                      <div className={styles.infoValue}>
                        <Phone size={16} style={{ marginRight: '8px' }} />
                        {lead.reporterPhone || '-'}
                      </div>
                    </div>
                    <div className={styles.infoItem}>
                      <div className={styles.infoLabel}>Thời gian báo cáo</div>
                      <div className={styles.infoValue}>
                        <Clock size={16} style={{ marginRight: '8px' }} />
                        {new Date(lead.reportedAt).toLocaleString('vi-VN')}
                      </div>
                    </div>
                  </div>
                </section>

                <section className={styles.section}>
                  <h3>Thông tin nguồn</h3>
                  <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                      <div className={styles.infoLabel}>Nguồn thu thập</div>
                      <div className={styles.infoValue}>{getSourceLabel(lead.source)}</div>
                    </div>
                    <div className={styles.infoItem}>
                      <div className={styles.infoLabel}>Danh mục</div>
                      <div className={styles.infoValue}>{getCategoryLabel(lead.category)}</div>
                    </div>
                    <div className={styles.infoItem}>
                      <div className={styles.infoLabel}>Độ tin cậy</div>
                      <div className={styles.infoValue}>{getConfidenceLabel(lead.confidence)}</div>
                    </div>
                  </div>
                </section>
                
                {/* Location & Store - Combined Section */}
                <section className={styles.section}>
                  <h3>Địa điểm & Cơ sở liên quan</h3>
                  <div className={styles.locationStoreGrid}>
                    {/* Location Card */}
                    <div className={styles.locationCard}>
                      <div className={styles.cardHeader}>
                        <MapPin size={18} />
                        <span className={styles.cardTitle}>Vị trí</span>
                      </div>
                      <div className={styles.cardBody}>
                        <div className={styles.address}>{lead.location.address}</div>
                        <div className={styles.addressDetail}>
                          {lead.location.ward && `${lead.location.ward}, `}
                          {lead.location.district}, {lead.location.province}
                        </div>
                        <div className={styles.coordinates}>
                          <span className={styles.coordLabel}>Tọa độ:</span> {lead.location.lat.toFixed(6)}, {lead.location.lng.toFixed(6)}
                        </div>
                      </div>
                    </div>

                    {/* Store Card */}
                    {lead.storeId && (
                      <div className={styles.storeCardNew}>
                        <div className={styles.cardHeader}>
                          <Building2 size={18} />
                          <span className={styles.cardTitle}>Cơ sở</span>
                        </div>
                        <div className={styles.cardBody}>
                          <div className={styles.storeName}>{lead.storeName}</div>
                          <div className={styles.storeId}>ID: {lead.storeId}</div>
                          <button className={styles.linkBtn}>
                            <LinkIcon size={14} />
                            Xem hồ sơ cơ sở
                          </button>
                        </div>
                      </div>
                    )}
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
                  ...(lead.sla.remainingHours <= 2 ? [{
                    id: '4',
                    action: 'escalated' as const,
                    userId: 'QT24_NGUYENVANA',
                    userName: 'Nguyễn Văn A',
                    timestamp: '2025-01-07T14:00:00Z',
                    details: {
                      escalateTo: 'Chi Cục Trưởng',
                      reason: 'SLA < 2h, cần hỗ trợ khẩn cấp'
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

      {/* Outcome Modal */}
      <OutcomeModal
        isOpen={showOutcomeModal}
        onClose={() => setShowOutcomeModal(false)}
        onSubmit={handleOutcomeSubmit}
        leadId={lead.id}
        leadTitle={lead.title}
      />
    </div>
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