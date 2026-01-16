import React, { useState } from 'react';
import { X, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';
import { toast } from 'sonner';
import styles from './InspectionConclusionModal.module.css';

interface InspectionConclusionModalProps {
  session: InspectionSession | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (conclusion: ConclusionData) => void;
}

export interface InspectionSession {
  code: string;
  startDate: string;
  passedCount: number;
  failedCount: number;
  warnings?: string[];
}

export interface ConclusionData {
  conclusion: 'passed' | 'failed';
  description: string;
}

export function InspectionConclusionModal({ session, isOpen, onClose, onSave }: InspectionConclusionModalProps) {
  // Auto-generate conclusion based on passed/failed counts
  const autoConclusion = session && session.failedCount === 0 ? 'passed' : 'failed';
  
  const [conclusion, setConclusion] = useState<'passed' | 'failed' | undefined>(undefined);
  const [description, setDescription] = useState('');

  React.useEffect(() => {
    if (isOpen && session) {
      // Auto-set conclusion when modal opens
      setConclusion(autoConclusion);
      setDescription('');
    }
  }, [isOpen, session, autoConclusion]);

  if (!isOpen || !session) return null;

  const handleComplete = () => {
    if (!conclusion) {
      toast.error('Vui lòng chọn kết luận kiểm tra');
      return;
    }

    if (!description.trim()) {
      toast.error('Vui lòng nhập mô tả chi tiết');
      return;
    }

    onSave({ conclusion, description });
    toast.success('Đã hoàn thành kết luận kiểm tra');
    onClose();
  };

  const handleSaveDraft = () => {
    toast.success('Đã lưu bản nháp');
    onClose();
  };

  const charCount = description.length;
  const maxChars = 1000;
  const currentStep = 2;
  const totalSteps = 2;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <button className={styles.backButton} onClick={onClose}>
            <X size={20} />
          </button>
          <h2 className={styles.title}>Kết luận kiểm tra</h2>
          <div className={styles.stepIndicator}>
            <CheckCircle size={16} />
            <span>{currentStep}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${(currentStep / totalSteps) * 100}%` }} />
        </div>

        {/* Content */}
        <div className={styles.content}>
          {/* Session Info */}
          <div className={styles.infoBox}>
            <Info size={16} className={styles.infoIcon} />
            <div className={styles.infoContent}>
              <div className={styles.infoTitle}>Thông tin phiên kiểm tra</div>
              <div className={styles.infoDetail}>
                Mã phiên: <strong>{session.code}</strong>
              </div>
              <div className={styles.infoDetail}>
                Thời gian: <strong>{session.startDate}</strong>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className={styles.summarySection}>
            <div className={styles.summaryTitle}>Tổng quan kết quả</div>
            <div className={styles.summaryGrid}>
              <div className={styles.summaryCard}>
                <div className={styles.summaryCardHeader}>
                  <CheckCircle size={16} className={styles.summaryIconPassed} />
                  <span>Hạng mục đạt</span>
                </div>
                <div className={styles.summaryCount}>{session.passedCount}</div>
              </div>
              <div className={styles.summaryCard}>
                <div className={styles.summaryCardHeader}>
                  <XCircle size={16} className={styles.summaryIconFailed} />
                  <span>Hạng mục không đạt</span>
                </div>
                <div className={styles.summaryCount}>{session.failedCount}</div>
              </div>
            </div>
          </div>

          {/* Warnings */}
          {session.warnings && session.warnings.length > 0 && (
            <div className={styles.warningBox}>
              <div className={styles.warningHeader}>
                <AlertTriangle size={16} />
                <span>Lưu ý</span>
              </div>
              <div className={styles.warningContent}>
                {session.warnings.map((warning, index) => (
                  <div key={index} className={styles.warningItem}>
                    {warning}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Conclusion Selection */}
          <div className={styles.section}>
            <label className={styles.label}>
              Kết luận kiểm tra <span className={styles.required}>*</span>
            </label>
            <div className={styles.conclusionButtons}>
              <button
                className={`${styles.conclusionButton} ${conclusion === 'passed' ? styles.conclusionButtonPassed : ''}`}
                onClick={() => setConclusion('passed')}
              >
                <div className={styles.conclusionIconWrapper}>
                  <CheckCircle size={20} />
                </div>
                <div className={styles.conclusionText}>
                  <div className={styles.conclusionLabel}>Đạt</div>
                  <div className={styles.conclusionDesc}>Cơ sở đạt yêu cầu</div>
                </div>
                {conclusion === 'passed' && (
                  <div className={styles.conclusionCheck}>
                    <CheckCircle size={20} />
                  </div>
                )}
              </button>
              <button
                className={`${styles.conclusionButton} ${conclusion === 'failed' ? styles.conclusionButtonFailed : ''}`}
                onClick={() => setConclusion('failed')}
              >
                <div className={styles.conclusionIconWrapper}>
                  <XCircle size={20} />
                </div>
                <div className={styles.conclusionText}>
                  <div className={styles.conclusionLabel}>Không đạt</div>
                  <div className={styles.conclusionDesc}>Vi phạm nghiêm trọng, cần xử lý</div>
                </div>
                {conclusion === 'failed' && (
                  <div className={styles.conclusionCheck}>
                    <CheckCircle size={20} />
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Description */}
          <div className={styles.section}>
            <label className={styles.label}>
              Mô tả chi tiết <span className={styles.required}>*</span>
            </label>
            <textarea
              className={styles.textarea}
              placeholder="VD: Tại thời điểm kiểm tra, cơ sở đã tuân thủ đầy đủ các quy định về vệ sinh ATTP, nhân viên đã có đủ giấy khám sức khỏe hợp lệ..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={maxChars}
              rows={6}
            />
            <div className={styles.charCount}>
              {charCount} / {maxChars} ký tự
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button className={styles.saveButton} onClick={handleSaveDraft}>
            Lưu
          </button>
          <button className={styles.completeButton} onClick={handleComplete}>
            Hoàn thành
          </button>
        </div>
      </div>
    </div>
  );
}

export default InspectionConclusionModal;