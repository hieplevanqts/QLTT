import React, { useState } from 'react';
import { X, CheckCircle2, XCircle, Eye, TrendingUp, TrendingDown, Minus, AlertTriangle } from 'lucide-react';
import styles from './OutcomeModal.module.css';

type OutcomeType = 'true' | 'false' | 'monitoring';

interface OutcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  leadId: string;
  leadTitle: string;
}

export function OutcomeModal({ isOpen, onClose, onSubmit, leadId, leadTitle }: OutcomeModalProps) {
  const [outcome, setOutcome] = useState<OutcomeType>('true');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [riskImpact, setRiskImpact] = useState<'increase' | 'decrease' | 'maintain'>('maintain');
  const [updateRiskScore, setUpdateRiskScore] = useState(true);
  const [updateHotspot, setUpdateHotspot] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!reason.trim()) {
      alert('Vui lòng nhập lý do đóng lead');
      return;
    }
    if (!notes.trim()) {
      alert('Vui lòng nhập ghi chú chi tiết');
      return;
    }

    // Show confirmation
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    onSubmit({
      leadId,
      outcome,
      reason,
      notes,
      riskImpact,
      updateRiskScore,
      updateHotspot,
      closedAt: new Date().toISOString(),
    });
    setShowConfirmation(false);
    onClose();
  };

  if (showConfirmation) {
    return (
      <div className={styles.overlay} onClick={() => setShowConfirmation(false)}>
        <div className={styles.confirmModal} onClick={e => e.stopPropagation()}>
          <div className={styles.confirmHeader}>
            <AlertTriangle size={32} className={styles.warningIcon} />
            <h3>Xác nhận đóng Lead</h3>
          </div>
          <div className={styles.confirmBody}>
            <p><strong>Lead:</strong> {leadTitle}</p>
            <p><strong>Kết quả:</strong> {
              outcome === 'true' ? 'Dương tính thật (có vi phạm)' :
              outcome === 'false' ? 'Dương tính giả (không vi phạm)' :
              'Theo dõi tiếp'
            }</p>
            <p><strong>Lý do:</strong> {reason}</p>
            {outcome !== 'false' && (
              <div className={styles.riskUpdateInfo}>
                <p><strong>Tác động rủi ro:</strong> {
                  riskImpact === 'increase' ? '↑ Tăng nguy cơ' :
                  riskImpact === 'decrease' ? '↓ Giảm nguy cơ' :
                  '→ Giữ nguyên'
                }</p>
                <p><strong>Cập nhật:</strong></p>
                <ul>
                  {updateRiskScore && <li>✓ Điểm rủi ro của cơ sở</li>}
                  {updateHotspot && <li>✓ Điểm nóng liên quan</li>}
                  {!updateRiskScore && !updateHotspot && <li>Không cập nhật</li>}
                </ul>
              </div>
            )}
            <div className={styles.warningBox}>
              ⚠️ Hành động này không thể hoàn tác. Lead sẽ được đóng và ghi vào audit trail.
            </div>
          </div>
          <div className={styles.confirmActions}>
            <button className={styles.cancelBtn} onClick={() => setShowConfirmation(false)}>
              Hủy
            </button>
            <button className={styles.confirmBtn} onClick={handleConfirm}>
              Xác nhận đóng Lead
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.titleRow}>
            <div className={styles.iconTitle}>
              <CheckCircle2 size={20} />
              <h2>Đóng Lead & Ghi nhận Outcome</h2>
            </div>
            <button className={styles.closeBtn} onClick={onClose}>
              <X size={20} />
            </button>
          </div>
          <div className={styles.leadInfo}>
            <span className={styles.leadLabel}>Lead:</span>
            <span className={styles.leadName}>{leadTitle}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>
              Kết quả kiểm tra <span className={styles.required}>*</span>
            </label>
            <div className={styles.outcomeOptions}>
              <label className={`${styles.outcomeOption} ${outcome === 'true' ? styles.active : ''}`}>
                <input
                  type="radio"
                  name="outcome"
                  value="true"
                  checked={outcome === 'true'}
                  onChange={() => setOutcome('true')}
                />
                <CheckCircle2 size={20} />
                <div className={styles.optionContent}>
                  <div className={styles.optionTitle}>Dương tính thật</div>
                  <div className={styles.optionDesc}>Tín hiệu chính xác, có vi phạm</div>
                </div>
              </label>

              <label className={`${styles.outcomeOption} ${outcome === 'false' ? styles.active : ''}`}>
                <input
                  type="radio"
                  name="outcome"
                  value="false"
                  checked={outcome === 'false'}
                  onChange={() => setOutcome('false')}
                />
                <XCircle size={20} />
                <div className={styles.optionContent}>
                  <div className={styles.optionTitle}>Dương tính giả</div>
                  <div className={styles.optionDesc}>Tín hiệu sai, không có vi phạm</div>
                </div>
              </label>

              <label className={`${styles.outcomeOption} ${outcome === 'monitoring' ? styles.active : ''}`}>
                <input
                  type="radio"
                  name="outcome"
                  value="monitoring"
                  checked={outcome === 'monitoring'}
                  onChange={() => setOutcome('monitoring')}
                />
                <Eye size={20} />
                <div className={styles.optionContent}>
                  <div className={styles.optionTitle}>Theo dõi tiếp</div>
                  <div className={styles.optionDesc}>Cần giám sát dài hạn</div>
                </div>
              </label>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="reason">
              Lý do đóng lead <span className={styles.required}>*</span>
            </label>
            <input
              id="reason"
              type="text"
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Nhập lý do đóng lead (vd: Đã xác minh, đã xử lý, không đủ bằng chứng...)"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="notes">
              Ghi chú & Bằng chứng <span className={styles.required}>*</span>
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Mô tả chi tiết kết quả kiểm tra, hành động đã thực hiện, bằng chứng..."
              rows={4}
              required
            />
          </div>

          {outcome !== 'false' && (
            <div className={styles.riskSection}>
              <h4>Cập nhật hồ sơ rủi ro</h4>
              
              <div className={styles.formGroup}>
                <label>Ảnh hưởng đến điểm rủi ro</label>
                <div className={styles.impactOptions}>
                  <label className={styles.impactOption}>
                    <input
                      type="radio"
                      name="riskImpact"
                      value="increase"
                      checked={riskImpact === 'increase'}
                      onChange={() => setRiskImpact('increase')}
                    />
                    <TrendingUp size={16} />
                    Tăng nguy cơ
                  </label>
                  <label className={styles.impactOption}>
                    <input
                      type="radio"
                      name="riskImpact"
                      value="maintain"
                      checked={riskImpact === 'maintain'}
                      onChange={() => setRiskImpact('maintain')}
                    />
                    <Minus size={16} />
                    Giữ nguyên
                  </label>
                  <label className={styles.impactOption}>
                    <input
                      type="radio"
                      name="riskImpact"
                      value="decrease"
                      checked={riskImpact === 'decrease'}
                      onChange={() => setRiskImpact('decrease')}
                    />
                    <TrendingDown size={16} />
                    Giảm nguy cơ
                  </label>
                </div>
              </div>

              <div className={styles.checkboxGroup}>
                <label className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={updateRiskScore}
                    onChange={e => setUpdateRiskScore(e.target.checked)}
                  />
                  Cập nhật điểm rủi ro của cơ sở
                </label>
                <label className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={updateHotspot}
                    onChange={e => setUpdateHotspot(e.target.checked)}
                  />
                  Cập nhật điểm nóng liên quan
                </label>
              </div>
            </div>
          )}

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className={styles.submitBtn}>
              Đóng Lead & Lưu Outcome
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}