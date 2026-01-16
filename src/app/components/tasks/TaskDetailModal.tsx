import React, { useState } from 'react';
import {
  X,
  Info,
  FileText,
  CheckSquare,
  Edit2,
  AlertTriangle,
  Upload,
  AlertCircle,
  Image as ImageIcon,
  ClipboardList,
  Check,
  Download,
} from 'lucide-react';
import { type InspectionTask, type TaskStatus } from '../../data/inspection-tasks-mock-data';
import { InspectionTaskStatusBadge } from './InspectionTaskStatusBadge';
import { toast } from 'sonner';
import styles from './TaskDetailModal.module.css';
import ViolationDetailModal, { type Violation } from './ViolationDetailModal';
import ChecklistItemModal from './ChecklistItemModal';
import type { ChecklistItem, ChecklistItemData } from './ChecklistItemModal';
import InspectionConclusionModal, { type InspectionSession, type ConclusionData } from './InspectionConclusionModal';
import { generateForm06PDF, createForm06DataFromTask } from '@/app/utils/generateForm06PDF';

interface TaskDetailModalProps {
  task: InspectionTask | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (task: InspectionTask) => void;
  onStatusChange?: (taskId: string, newStatus: TaskStatus) => void;
}

// Mock checklist forms data
const MOCK_FORMS = [
  {
    id: '1',
    code: 'M01',
    name: 'Biểu mẫu An toàn thực phẩm',
    totalItems: 8,
    completedItems: 5,
    items: [
      { id: '1-1', title: 'Giấy chứng nhận đủ điều kiện ATTP', status: 'failed', attachments: 0 },
      { id: '1-2', title: 'Giấy phép kinh doanh', status: 'passed', attachments: 1 },
      { id: '1-3', title: 'Kho vực chế quản thực phẩm', status: 'failed', attachments: 2 },
      { id: '1-4', title: 'Dụng cụ chế biến', status: 'passed', attachments: 0 },
      { id: '1-5', title: 'Nhân viên khám sức khỏe định kỳ', status: 'failed', attachments: 1 },
      { id: '1-6', title: 'Hóa đơn chứng từ hàng hóa', status: 'passed', attachments: 0 },
      { id: '1-7', title: 'Ghi nhãn sản phẩm đầy đủ', status: 'passed', attachments: 0 },
      { id: '1-8', title: 'Tẩm truy xuất nguồn gốc', status: 'passed', attachments: 0 },
    ],
  },
  {
    id: '2',
    code: 'M02',
    name: 'Biểu mẫu Kinh doanh chứng',
    totalItems: 4,
    completedItems: 4,
    items: [
      { id: '2-1', title: 'Giấy phép kinh doanh', status: 'passed', attachments: 2 },
      { id: '2-2', title: 'Hóa đơn nguồn gốc xuất xứ', status: 'passed', attachments: 0 },
      { id: '2-3', title: 'Nguồn gốc kiểm dịch thú y', status: 'passed', attachments: 1 },
      { id: '2-4', title: 'Kho lạnh bảo quản thực phẩm', status: 'passed', attachments: 0 },
    ],
  },
];

// Mock evidence/attachment images
const MOCK_EVIDENCES = [
  { id: '1', url: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=400', name: 'Giấy phép ATTP' },
  { id: '2', url: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400', name: 'Kho bảo quản' },
  { id: '3', url: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400', name: 'Dụng cụ chế biến' },
  { id: '4', url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=400', name: 'Nhãn sản phẩm' },
];

// Mock violations data - Mỗi phiên chỉ có 0 hoặc 1 vi phạm
const MOCK_VIOLATION: Violation | null = {
  id: '1',
  code: 'PHIEN-000',
  sessionCode: 'PHIEN-000',
  title: 'Khu vực chế biến không đảm bảo vệ sinh',
  severity: 'medium',
  description: 'Khu vực chế biến thực phẩm không đảm bảo điều kiện vệ sinh: sàn nhà ẩm ướt, bẩn thỉu, bồn rửa không có nước chảy...',
  createdDate: '2024-01-24 18:45',
  targetName: 'Cửa hàng Thực phẩm sạch Organic',
  assetValue: 10000000,
  violatorOpinion: 'Chủ cơ sở cho biết do nhận viên về sinh việc đột xuất nên chưa kịp dọn dẹp.',
  witnessOpinion: 'Không có người chứng kiến',
  evidenceImages: [
    { id: '1', url: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400', name: 'Khu vực chế biến' },
    { id: '2', url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=400', name: 'Sàn nhà ẩm ướt' },
  ],
  attachedDocuments: [
    { id: '1', name: 'Tài liệu 01_.xlsx', size: '3.87 MB' },
  ],
  handlingDate: '2024-01-24 18:45',
  handlingMethod: 'Xử phạt hành chính, Truy cứu trách nhiệm hình sự',
  fineAmount: 10000000,
  receivingAgency: 'Công an Phường Phú Diễn',
  holdingDate: '10,000,000 VNĐ',
  holdingAmount: 10000000,
  additionalPenalty: 'Tiêu hủy 50 sản phẩm không rõ nguồn gốc',
  deadline: '10 ngày',
  notes: 'Cửa hàng đã cam kết khắc phục vi phạm trong vòng 3 ngày',
  attachedMinutes: [
    { id: '1', name: 'Tài liệu 01_.xlsx', size: '3.87 MB' },
  ],
  legalBasis: [
    'Nghị định 98/2020/NĐ-CP',
    'Nghị định 115/2018/NĐ-CP',
  ],
};

export function TaskDetailModal({ task, isOpen, onClose, onEdit, onStatusChange }: TaskDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'checklist' | 'evidence' | 'violations'>('info');
  const [isViolationDetailOpen, setIsViolationDetailOpen] = useState(false);
  const [isChecklistItemModalOpen, setIsChecklistItemModalOpen] = useState(false);
  const [isInspectionConclusionModalOpen, setIsInspectionConclusionModalOpen] = useState(false);
  const [selectedChecklistItem, setSelectedChecklistItem] = useState<ChecklistItem | null>(null);

  // Reset tab when modal opens
  React.useEffect(() => {
    if (isOpen && task) {
      setActiveTab('info');
    }
  }, [isOpen, task]);

  if (!isOpen) return null;
  if (!task) return null;

  const handleEdit = () => {
    if (onEdit) {
      onEdit(task);
    }
    onClose();
  };

  const handleUploadEvidence = () => {
    toast.info('Tính năng upload chứng cứ sẽ được triển khai');
  };

  const handleDownloadForm06 = () => {
    try {
      const pdfData = createForm06DataFromTask(task);
      const pdf = generateForm06PDF(pdfData);
      pdf.save(`Bien-ban-${task.code}.pdf`);
      toast.success('Đã tải xuống biên bản kiểm tra');
    } catch (error) {
      toast.error('Không thể tải xuống biên bản');
      console.error('Error generating PDF:', error);
    }
  };

  const handleViewViolationDetail = () => {
    setIsViolationDetailOpen(true);
  };

  const handleOpenChecklistItemModal = (item: { id: string; title: string; status: string; attachments: number }) => {
    const checklistItem: ChecklistItem = {
      id: item.id,
      title: item.title,
      status: (item.status as 'passed' | 'failed') || 'pending',
      attachments: item.attachments,
      evidenceImages: [],
      notes: '',
    };
    setSelectedChecklistItem(checklistItem);
    setIsChecklistItemModalOpen(true);
  };

  const handleSaveChecklistItem = (itemId: string, data: ChecklistItemData) => {
    console.log('Saved checklist item:', itemId, data);
    toast.success('Đã lưu kết quả kiểm tra');
  };

  const handleOpenInspectionConclusionModal = () => {
    setIsInspectionConclusionModalOpen(true);
  };

  const handleSaveInspectionConclusion = (conclusion: ConclusionData) => {
    console.log('Saved inspection conclusion:', conclusion);
    toast.success('Đã lưu kết luận kiểm tra');
  };

  const mockSession: InspectionSession = {
    code: task.code,
    startDate: new Date(task.dueDate).toLocaleDateString('vi-VN') + ' • 15:30',
    passedCount: 9,
    failedCount: 3,
    warnings: ['Phát hiện 3 hạng mục không đạt. Mỹ thông số kỹ thuật đang cần cao phản ảnh hoàn thành'],
  };

  return (
    <>
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerContent}>
              <div className={styles.headerIcon}>
                <FileText size={20} />
              </div>
              <div className={styles.headerText}>
                <h2 className={styles.title}>Chi tiết phiên làm việc</h2>
                <span className={styles.taskCode}>{task.code}</span>
              </div>
            </div>
            <button className={styles.closeButton} onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          {/* Tabs */}
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === 'info' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('info')}
            >
              <Info size={16} />
              Thông tin
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'checklist' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('checklist')}
            >
              <CheckSquare size={16} />
              Checklist
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'evidence' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('evidence')}
            >
              <ImageIcon size={16} />
              Chứng cứ
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'violations' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('violations')}
            >
              <AlertTriangle size={16} />
              Vi phạm
            </button>
          </div>

          {/* Content */}
          <div className={styles.content}>
            {/* Tab: Thông tin */}
            {activeTab === 'info' && (
              <div className={styles.infoTabContent}>
                {/* Basic Info Section */}
                <div className={styles.infoSection}>
                  <div className={styles.infoRow}>
                    <div className={styles.infoLabel}>Tên phiên</div>
                    <div className={styles.infoValue}>{task.title}</div>
                  </div>
                  <div className={styles.infoRow}>
                    <div className={styles.infoLabel}>Phiên #ID</div>
                    <div className={styles.infoValue}>{task.code}</div>
                  </div>
                  <div className={styles.infoRow}>
                    <div className={styles.infoLabel}>Trạng thái</div>
                    <div className={styles.infoValue}>
                      <InspectionTaskStatusBadge type="status" value={task.status} />
                    </div>
                  </div>
                  <div className={styles.infoRow}>
                    <div className={styles.infoLabel}>Cửa hàng</div>
                    <div className={styles.infoValue}>{task.targetName}</div>
                  </div>
                  <div className={styles.infoRow}>
                    <div className={styles.infoLabel}>Ngày kiểm tra</div>
                    <div className={styles.infoValue}>
                      {new Date(task.dueDate).toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                  <div className={styles.infoRow}>
                    <div className={styles.infoLabel}>Giới hạn địa điểm</div>
                    <div className={styles.infoValue}>18:00</div>
                  </div>
                  <div className={styles.infoRow}>
                    <div className={styles.infoLabel}>Trưởng đoàn</div>
                    <div className={styles.infoValue}>{task.assignee?.name || 'N/A'}</div>
                  </div>
                  <div className={styles.infoRow}>
                    <div className={styles.infoLabel}>Thành viên đoàn</div>
                    <div className={styles.infoValue}>
                      {task.teamMembers || 'Bùi Văn Khoa, Đặng Thị Mai'}
                    </div>
                  </div>
                  <div className={styles.infoRow}>
                    <div className={styles.infoLabel}>Ghi chú</div>
                    <div className={styles.infoValue}>
                      {task.description || 'Phiên kiểm tra thực phẩm sạch và organic. Cần chuẩn bị thiết bị test nhanh chất lượng.'}
                    </div>
                  </div>
                </div>

                {/* Results Section */}
                <div className={styles.resultsSection}>
                  <h3 className={styles.sectionTitle}>
                    <ClipboardList size={16} />
                    Kết quả kiểm tra
                  </h3>
                  <div className={styles.resultBox}>
                    <div className={styles.resultLabel}>Kết luận kiểm tra</div>
                    <div className={styles.resultValue}>
                      {task.status === 'completed' ? 'Không đạt' : 'Chưa có kết luận'}
                    </div>
                  </div>
                  <div className={styles.resultBox}>
                    <div className={styles.resultLabel}>Mô tả chi tiết</div>
                    <div className={styles.resultDesc}>
                      Tại thời điểm kiểm tra (18:00 ngày 24/01/2024), cơ sở đang hoạt động kinh doanh thực phẩm với quy mô 50m². Phát hiện nhiều vi phạm nghiêm trọng về an toàn thực phẩm:
                      <ul>
                        <li>Không có giấy chứng nhận đủ điều kiện ATTP hợp lệ (giấy đã hết hạn từ 15/12/2023)</li>
                        <li>Phát hiện 12 nhân viên sửa hết hạn sổ khám sức khỏe, vẫn đang bày bán</li>
                        <li>Khu vực chế biến không đảm bảo vệ sinh</li>
                        <li>Nhân viên không mặc đồng phục, không đeo khẩu trang</li>
                      </ul>
                      Đã yêu cầu cơ sở có giấy nghiêm tình trong vòng 15 ngày và khắc phục trong vòng 15 ngày.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Checklist */}
            {activeTab === 'checklist' && (
              <div className={styles.checklistTabContent}>
                {MOCK_FORMS.map((form) => (
                  <div key={form.id} className={styles.formSection}>
                    <div className={styles.formHeader}>
                      <div className={styles.formHeaderLeft}>
                        <FileText size={16} className={styles.formIcon} />
                        <div>
                          <div className={styles.formName}>{form.name}</div>
                          <div className={styles.formMeta}>
                            {form.completedItems} hạng mục đã • {form.totalItems} tổng
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={styles.formItems}>
                      {form.items.map((item) => (
                        <div key={item.id} className={styles.formItem}>
                          <div className={styles.formItemLeft}>
                            {item.status === 'passed' ? (
                              <div className={styles.checkboxPassed}>
                                <Check size={14} />
                              </div>
                            ) : (
                              <div className={styles.checkboxFailed}>
                                <X size={14} />
                              </div>
                            )}
                            <span className={styles.formItemTitle}>{item.title}</span>
                          </div>
                          <div className={styles.formItemRight}>
                            {item.attachments > 0 && (
                              <div className={styles.attachmentBadge}>
                                <FileText size={12} />
                                {item.attachments} tệp đính kèm
                              </div>
                            )}
                            <button className={styles.viewDetailButton} onClick={() => handleOpenChecklistItemModal(item)}>
                              Xem chi tiết
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab: Chứng cứ */}
            {activeTab === 'evidence' && (
              <div className={styles.evidenceTabContent}>
                <div className={styles.evidenceHeader}>
                  <button className={styles.uploadButton} onClick={handleUploadEvidence}>
                    <Upload size={16} />
                    Tải lên chứng cứ
                  </button>
                </div>
                <div className={styles.evidenceGrid}>
                  {MOCK_EVIDENCES.map((evidence) => (
                    <div key={evidence.id} className={styles.evidenceItem}>
                      <img src={evidence.url} alt={evidence.name} className={styles.evidenceImage} />
                      <div className={styles.evidenceName}>{evidence.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Vị phạm */}
            {activeTab === 'violations' && (
              <div className={styles.violationsTabContent}>
                {MOCK_VIOLATION ? (
                  <div className={styles.violationsList}>
                    <div key={MOCK_VIOLATION.id} className={styles.violationItem}>
                      <div className={styles.violationHeader}>
                        <div className={styles.violationHeaderLeft}>
                          <div className={`${styles.severityBadge} ${styles[`severity-${MOCK_VIOLATION.severity}`]}`}>
                            {MOCK_VIOLATION.severity === 'high' && '🔴 Nghiêm trọng'}
                            {MOCK_VIOLATION.severity === 'medium' && '🟠 Trung bình'}
                            {MOCK_VIOLATION.severity === 'low' && '🟡 Nhẹ'}
                          </div>
                          <span className={styles.violationCode}>{MOCK_VIOLATION.code}</span>
                        </div>
                      </div>
                      <div className={styles.violationTitle}>{MOCK_VIOLATION.title}</div>
                      <div className={styles.violationDesc}>{MOCK_VIOLATION.description}</div>
                      <div className={styles.violationMeta}>
                        <div className={styles.violationMetaRow}>
                          <span className={styles.violationMetaLabel}>Căn cứ pháp lý:</span>
                          <span>{MOCK_VIOLATION.regulation}</span>
                        </div>
                        <div className={styles.violationMetaRow}>
                          <span className={styles.violationMetaLabel}>Hướng xử lý:</span>
                          <span>{MOCK_VIOLATION.suggestedAction}</span>
                        </div>
                      </div>
                      <button className={styles.viewDetailButton} onClick={handleViewViolationDetail}>
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className={styles.emptyState}>
                    <AlertCircle size={48} />
                    <p>Chưa có vi phạm nào được ghi nhận</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className={styles.footer}>
            <button className={styles.cancelButton} onClick={onClose}>
              Đóng
            </button>
            {task.status === 'completed' && (
              <button className={styles.downloadButton} onClick={handleDownloadForm06}>
                <Download size={16} />
                Tải biên bản
              </button>
            )}
            <button className={styles.editButton} onClick={handleEdit}>
              <Edit2 size={16} />
              Chỉnh sửa
            </button>
          </div>
        </div>
      </div>
      {isViolationDetailOpen && (
        <ViolationDetailModal
          violation={MOCK_VIOLATION!}
          isOpen={isViolationDetailOpen}
          onClose={() => setIsViolationDetailOpen(false)}
        />
      )}
      {isChecklistItemModalOpen && selectedChecklistItem && (
        <ChecklistItemModal
          item={selectedChecklistItem}
          isOpen={isChecklistItemModalOpen}
          onClose={() => setIsChecklistItemModalOpen(false)}
          onSave={handleSaveChecklistItem}
          readOnly={true}
        />
      )}
      {isInspectionConclusionModalOpen && (
        <InspectionConclusionModal
          session={mockSession}
          isOpen={isInspectionConclusionModalOpen}
          onClose={() => setIsInspectionConclusionModalOpen(false)}
          onSave={handleSaveInspectionConclusion}
        />
      )}
    </>
  );
}

export default TaskDetailModal;