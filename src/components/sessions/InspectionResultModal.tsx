import React, { useState } from 'react';
import { X, Info, ChevronRight, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import ChecklistItemModal from '../tasks/ChecklistItemModal';
import type { ChecklistItem, ChecklistItemData } from '../tasks/ChecklistItemModal';
import InspectionConclusionModal, { type InspectionSession, type ConclusionData } from '../tasks/InspectionConclusionModal';
import styles from './InspectionResultModal.module.css';

interface InspectionResultModalProps {
  session: Session | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: InspectionResultData) => void;
  onComplete: (data: InspectionResultData) => void;
}

interface Session {
  id: string;
  code: string;
  title: string;
  date: string;
}

export interface InspectionResultData {
  checklist: ChecklistItemWithData[];
  notes: string;
  conclusion?: ConclusionData;
}

interface ChecklistItemWithData extends ChecklistItem {
  data?: ChecklistItemData;
}

const INITIAL_CHECKLIST: ChecklistItemWithData[] = [
  { id: '1', title: 'Kiểm tra giấy phép kinh doanh', status: 'pending', attachments: 0 },
  { id: '2', title: 'Kiểm tra nguồn gốc hàng hóa', status: 'pending', attachments: 0 },
  { id: '3', title: 'Kiểm tra chất lượng sản phẩm', status: 'pending', attachments: 0 },
  { id: '4', title: 'Kiểm tra điều kiện bảo quản', status: 'pending', attachments: 0 },
  { id: '5', title: 'Kiểm tra hồ sơ nhập khẩu', status: 'pending', attachments: 0 },
  { id: '6', title: 'Chụp ảnh hiện trường', status: 'pending', attachments: 0 },
  { id: '7', title: 'Lập biên bản', status: 'pending', attachments: 0 },
];

export function InspectionResultModal({ session, isOpen, onClose, onSave, onComplete }: InspectionResultModalProps) {
  const [checklist, setChecklist] = useState<ChecklistItemWithData[]>(INITIAL_CHECKLIST);
  const [notes, setNotes] = useState('');
  const [isChecklistItemModalOpen, setIsChecklistItemModalOpen] = useState(false);
  const [selectedChecklistItem, setSelectedChecklistItem] = useState<ChecklistItem | null>(null);
  const [isConclusionModalOpen, setIsConclusionModalOpen] = useState(false);

  React.useEffect(() => {
    if (isOpen && session) {
      setChecklist(INITIAL_CHECKLIST);
      setNotes('');
      setIsChecklistItemModalOpen(false);
      setSelectedChecklistItem(null);
      setIsConclusionModalOpen(false);
    }
  }, [isOpen, session]);

  if (!isOpen || !session) return null;

  const handleOpenChecklistItem = (item: ChecklistItemWithData) => {
    setSelectedChecklistItem(item);
    setIsChecklistItemModalOpen(true);
  };

  const handleSaveChecklistItem = (itemId: string, data: ChecklistItemData) => {
    setChecklist(prevList => 
      prevList.map(item => 
        item.id === itemId 
          ? { 
              ...item, 
              status: data.status,
              attachments: data.evidenceImages.length,
              data,
              evidenceImages: data.evidenceImages,
              notes: data.notes,
            } 
          : item
      )
    );
    setIsChecklistItemModalOpen(false);
  };

  const completedCount = checklist.filter(item => item.status === 'passed' || item.status === 'failed').length;
  const totalCount = checklist.length;
  const progress = Math.round((completedCount / totalCount) * 100);
  const isAllCompleted = completedCount === totalCount;

  const handleSave = () => {
    onSave({ checklist, notes });
    toast.success('Đã lưu kết quả kiểm tra');
  };

  const handleOpenConclusion = () => {
    if (!isAllCompleted) {
      toast.error('Vui lòng hoàn thành tất cả các mục kiểm tra');
      return;
    }
    setIsConclusionModalOpen(true);
  };

  const handleSaveConclusion = (conclusion: ConclusionData) => {
    const inspectionData = { checklist, notes, conclusion };
    onComplete(inspectionData);
    toast.success('Đã hoàn thành phiên kiểm tra');
    setIsConclusionModalOpen(false);
    onClose();
  };

  // Calculate statistics for conclusion modal
  const passedCount = checklist.filter(item => item.status === 'passed').length;
  const failedCount = checklist.filter(item => item.status === 'failed').length;

  const conclusionSession: InspectionSession = {
    code: session.code,
    startDate: session.date,
    passedCount,
    failedCount,
    warnings: failedCount > 0 ? [`Phát hiện ${failedCount} hạng mục không đạt. Hệ thống sẽ tự động tạo báo cáo chi tiết cần xử lý`] : undefined,
  };

  return (
    <>
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerContent}>
              <div className={styles.headerIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className={styles.headerText}>
                <h2 className={styles.title}>Nhập kết quả kiểm tra</h2>
                <div className={styles.subtitle}>{session.title} - {session.date}</div>
              </div>
            </div>
            <button className={styles.closeButton} onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          {/* Progress */}
          <div className={styles.progressSection}>
            <div className={styles.progressHeader}>
              <span className={styles.progressText}>Tiến độ: {completedCount}/{totalCount} mục</span>
              <span className={styles.progressPercent}>{progress}%</span>
            </div>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${progress}%` }} />
            </div>
          </div>

          {/* Content */}
          <div className={styles.content}>
            {/* Info Box */}
            <div className={styles.infoBox}>
              <Info size={16} className={styles.infoIcon} />
              <span className={styles.infoText}>
                Hoàn thành tất cả các mục kiểm tra để tiếp tục đến bước "Kết luận"
              </span>
            </div>

            {/* Checklist */}
            <div className={styles.checklistSection}>
              <h3 className={styles.sectionTitle}>Danh sách kiểm tra</h3>
              <div className={styles.checklistItems}>
                {checklist.map((item) => (
                  <button 
                    key={item.id} 
                    className={styles.checklistItem}
                    onClick={() => handleOpenChecklistItem(item)}
                  >
                    <div className={styles.checklistItemContent}>
                      {/* Checkbox indicator */}
                      <div className={`${styles.checkboxIndicator} ${item.status !== 'pending' ? styles.checkboxIndicatorCompleted : ''}`}>
                        {item.status !== 'pending' && <CheckCircle size={16} />}
                      </div>
                      
                      {/* Title */}
                      <span className={styles.checklistLabel}>{item.title}</span>
                      
                      {/* Status badge */}
                      {item.status !== 'pending' && (
                        <span className={`${styles.statusBadge} ${item.status === 'passed' ? styles.statusBadgePassed : styles.statusBadgeFailed}`}>
                          {item.status === 'passed' ? 'Đạt' : 'Không đạt'}
                        </span>
                      )}
                      
                      {/* Attachments count */}
                      {item.attachments > 0 && (
                        <span className={styles.attachmentCount}>
                          {item.attachments} ảnh
                        </span>
                      )}
                    </div>
                    
                    {/* Arrow icon */}
                    <ChevronRight size={20} className={styles.chevronIcon} />
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className={styles.notesSection}>
              <label className={styles.label}>Ghi chú chung</label>
              <textarea
                className={styles.textarea}
                placeholder="Nhập ghi chú..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          {/* Footer */}
          <div className={styles.footer}>
            <button className={styles.cancelButton} onClick={onClose}>
              Hủy
            </button>
            <button className={styles.saveButton} onClick={handleSave}>
              Lưu
            </button>
            <button 
              className={styles.completeButton} 
              onClick={handleOpenConclusion}
              disabled={!isAllCompleted}
            >
              Kết luận
            </button>
          </div>
        </div>
      </div>

      {/* Checklist Item Detail Modal */}
      <ChecklistItemModal
        item={selectedChecklistItem}
        isOpen={isChecklistItemModalOpen}
        onClose={() => setIsChecklistItemModalOpen(false)}
        onSave={handleSaveChecklistItem}
      />

      {/* Conclusion Modal */}
      {isConclusionModalOpen && (
        <InspectionConclusionModal
          session={conclusionSession}
          isOpen={isConclusionModalOpen}
          onClose={() => setIsConclusionModalOpen(false)}
          onSave={handleSaveConclusion}
        />
      )}
    </>
  );
}

export default InspectionResultModal;
