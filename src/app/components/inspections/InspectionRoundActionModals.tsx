import React, { useState } from 'react';
import { X, Send, CheckCircle2, XCircle, PlayCircle, AlertTriangle, Trash2 } from 'lucide-react';
import styles from './InspectionRoundActionModals.module.css';
import type { InspectionRound } from '../../data/inspection-rounds-mock-data';

// Modal Wrapper Component
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

// 1. Gửi duyệt Modal
interface SendForApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  round: InspectionRound | null;
  onConfirm: (note: string) => void;
}

export function SendForApprovalModal({ isOpen, onClose, round, onConfirm }: SendForApprovalModalProps) {
  if (!round) return null;
  
  const [note, setNote] = useState('');

  const handleSubmit = () => {
    onConfirm(note);
    setNote('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.modalHeader}>
        <div className={styles.modalIconWrapper} style={{ background: 'var(--primary)' }}>
          <Send size={24} color="white" />
        </div>
        <div className={styles.modalHeaderContent}>
          <h3 className={styles.modalTitle}>Gửi đợt kiểm tra đi phê duyệt</h3>
          <p className={styles.modalSubtitle}>Đợt kiểm tra: {round.name}</p>
        </div>
        <button className={styles.closeButton} onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <div className={styles.modalBody}>
        <p className={styles.modalDescription}>
          Đợt kiểm tra sẽ được gửi đến người phê duyệt. Bạn có thể thêm ghi chú để giải thích chi tiết.
        </p>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Ghi chú (không bắt buộc)</label>
          <textarea
            className={styles.textarea}
            placeholder="Nhập ghi chú cho người phê duyệt..."
            rows={4}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.modalFooter}>
        <button className={styles.cancelButton} onClick={onClose}>
          Hủy
        </button>
        <button className={styles.primaryButton} onClick={handleSubmit}>
          <Send size={18} />
          Gửi duyệt
        </button>
      </div>
    </Modal>
  );
}

// 2. Bắt đầu kiểm tra Modal
interface StartInspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  round: InspectionRound | null;
  onConfirm: (note: string) => void;
}

export function StartInspectionModal({ isOpen, onClose, round, onConfirm }: StartInspectionModalProps) {
  if (!round) return null;
  
  const [note, setNote] = useState('');

  const handleSubmit = () => {
    onConfirm(note);
    setNote('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.modalHeader}>
        <div className={styles.modalIconWrapper} style={{ background: '#10B981' }}>
          <PlayCircle size={24} color="white" />
        </div>
        <div className={styles.modalHeaderContent}>
          <h3 className={styles.modalTitle}>Bắt đầu kiểm tra</h3>
          <p className={styles.modalSubtitle}>Đợt kiểm tra: {round.name}</p>
        </div>
        <button className={styles.closeButton} onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <div className={styles.modalBody}>
        <div className={styles.infoBox} style={{ background: '#10B98115', borderColor: '#10B981' }}>
          <CheckCircle2 size={20} color="#10B981" />
          <p>Đợt kiểm tra sẽ chuyển sang trạng thái <strong>Đang kiểm tra</strong></p>
        </div>

        <p className={styles.modalDescription}>
          Xác nhận bắt đầu đợt kiểm tra này? Lực lượng kiểm tra sẽ được thông báo và có thể bắt đầu thực hiện nhiệm vụ.
        </p>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Ghi chú (không bắt buộc)</label>
          <textarea
            className={styles.textarea}
            placeholder="Nhập ghi chú về việc bắt đầu kiểm tra..."
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.modalFooter}>
        <button className={styles.cancelButton} onClick={onClose}>
          Hủy
        </button>
        <button className={styles.successButton} onClick={handleSubmit}>
          <PlayCircle size={18} />
          Bắt đầu kiểm tra
        </button>
      </div>
    </Modal>
  );
}

// 3. Hoàn thành kiểm tra Modal (in_progress → reporting)
interface CompleteInspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  round: InspectionRound | null;
  onConfirm: (summary: string) => void;
}

export function CompleteInspectionModal({ isOpen, onClose, round, onConfirm }: CompleteInspectionModalProps) {
  if (!round) return null;
  
  const [summary, setSummary] = useState('');

  const handleSubmit = () => {
    onConfirm(summary);
    setSummary('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.modalHeader}>
        <div className={styles.modalIconWrapper} style={{ background: '#10B981' }}>
          <CheckCircle2 size={24} color="white" />
        </div>
        <div className={styles.modalHeaderContent}>
          <h3 className={styles.modalTitle}>Hoàn thành kiểm tra</h3>
          <p className={styles.modalSubtitle}>Đợt kiểm tra: {round.name}</p>
        </div>
        <button className={styles.closeButton} onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <div className={styles.modalBody}>
        <div className={styles.infoBox} style={{ background: '#3B82F615', borderColor: '#3B82F6' }}>
          <CheckCircle2 size={20} color="#3B82F6" />
          <p>Đợt kiểm tra sẽ chuyển sang trạng thái <strong>Hoàn thành báo cáo</strong></p>
        </div>

        <p className={styles.modalDescription}>
          Công tác kiểm tra thực địa đã hoàn tất. Tiếp theo cần hoàn thiện báo cáo kết quả kiểm tra.
        </p>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>
            Tóm tắt kết quả <span className={styles.required}>*</span>
          </label>
          <textarea
            className={styles.textarea}
            placeholder="Nhập tóm tắt kết quả kiểm tra..."
            rows={4}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.modalFooter}>
        <button className={styles.cancelButton} onClick={onClose}>
          Hủy
        </button>
        <button 
          className={styles.successButton} 
          onClick={handleSubmit}
          disabled={!summary.trim()}
        >
          <CheckCircle2 size={18} />
          Hoàn thành kiểm tra
        </button>
      </div>
    </Modal>
  );
}

// 4. Hoàn thành đợt kiểm tra Modal (reporting → completed)
interface CompleteRoundModalProps {
  isOpen: boolean;
  onClose: () => void;
  round: InspectionRound | null;
  onConfirm: () => void;
}

export function CompleteRoundModal({ isOpen, onClose, round, onConfirm }: CompleteRoundModalProps) {
  if (!round) return null;

  const handleSubmit = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.modalHeader}>
        <div className={styles.modalIconWrapper} style={{ background: '#10B981' }}>
          <CheckCircle2 size={24} color="white" />
        </div>
        <div className={styles.modalHeaderContent}>
          <h3 className={styles.modalTitle}>Hoàn thành đợt kiểm tra</h3>
          <p className={styles.modalSubtitle}>Đợt kiểm tra: {round.name}</p>
        </div>
        <button className={styles.closeButton} onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <div className={styles.modalBody}>
        <div className={styles.infoBox} style={{ background: '#10B98115', borderColor: '#10B981' }}>
          <CheckCircle2 size={20} color="#10B981" />
          <p>Đợt kiểm tra sẽ chuyển sang trạng thái <strong>Hoàn thành</strong></p>
        </div>

        <p className={styles.modalDescription}>
          Xác nhận hoàn thành đợt kiểm tra này? Sau khi hoàn thành, báo cáo sẽ được lưu trữ và không thể chỉnh sửa.
        </p>
      </div>

      <div className={styles.modalFooter}>
        <button className={styles.cancelButton} onClick={onClose}>
          Hủy
        </button>
        <button className={styles.successButton} onClick={handleSubmit}>
          <CheckCircle2 size={18} />
          Hoàn thành
        </button>
      </div>
    </Modal>
  );
}

// 5. Hủy đợt kiểm tra Modal
interface CancelRoundModalProps {
  isOpen: boolean;
  onClose: () => void;
  round: InspectionRound | null;
  onConfirm: (reason: string) => void;
}

export function CancelRoundModal({ isOpen, onClose, round, onConfirm }: CancelRoundModalProps) {
  if (!round) return null;
  
  const [reason, setReason] = useState('');

  const handleSubmit = () => {
    onConfirm(reason);
    setReason('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.modalHeader}>
        <div className={styles.modalIconWrapper} style={{ background: '#F59E0B' }}>
          <XCircle size={24} color="white" />
        </div>
        <div className={styles.modalHeaderContent}>
          <h3 className={styles.modalTitle}>Hủy đợt kiểm tra</h3>
          <p className={styles.modalSubtitle}>Đợt kiểm tra: {round.name}</p>
        </div>
        <button className={styles.closeButton} onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <div className={styles.modalBody}>
        <div className={styles.warningBox} style={{ background: '#F59E0B15', borderColor: '#F59E0B' }}>
          <AlertTriangle size={20} color="#F59E0B" />
          <p><strong>Cảnh báo:</strong> Đợt kiểm tra sẽ bị hủy và không thể khôi phục!</p>
        </div>

        <p className={styles.modalDescription}>
          Bạn có chắc chắn muốn hủy đợt kiểm tra này? Vui lòng cung cấp lý do hủy.
        </p>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>
            Lý do hủy <span className={styles.required}>*</span>
          </label>
          <textarea
            className={styles.textarea}
            placeholder="Nhập lý do hủy đợt kiểm tra..."
            rows={4}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.modalFooter}>
        <button className={styles.cancelButton} onClick={onClose}>
          Hủy
        </button>
        <button 
          className={styles.warningButton} 
          onClick={handleSubmit}
          disabled={!reason.trim()}
        >
          <XCircle size={18} />
          Hủy đợt kiểm tra
        </button>
      </div>
    </Modal>
  );
}

// 6. Xóa đợt kiểm tra Modal
interface DeleteRoundModalProps {
  isOpen: boolean;
  onClose: () => void;
  round: InspectionRound | null;
  onConfirm: () => void;
}

export function DeleteRoundModal({ isOpen, onClose, round, onConfirm }: DeleteRoundModalProps) {
  if (!round) return null;

  const handleSubmit = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.modalHeader}>
        <div className={styles.modalIconWrapper} style={{ background: '#EF4444' }}>
          <Trash2 size={24} color="white" />
        </div>
        <div className={styles.modalHeaderContent}>
          <h3 className={styles.modalTitle}>Xóa đợt kiểm tra</h3>
          <p className={styles.modalSubtitle}>Đợt kiểm tra: {round.name}</p>
        </div>
        <button className={styles.closeButton} onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <div className={styles.modalBody}>
        <div className={styles.warningBox} style={{ background: '#EF444415', borderColor: '#EF4444' }}>
          <AlertTriangle size={20} color="#EF4444" />
          <p><strong>Cảnh báo:</strong> Hành động này không thể hoàn tác!</p>
        </div>

        <p className={styles.modalDescription}>
          Bạn có chắc chắn muốn xóa đợt kiểm tra này không? Tất cả dữ liệu liên quan sẽ bị xóa vĩnh viễn.
        </p>
      </div>

      <div className={styles.modalFooter}>
        <button className={styles.cancelButton} onClick={onClose}>
          Hủy
        </button>
        <button 
          className={styles.destructiveButton} 
          onClick={handleSubmit}
        >
          <Trash2 size={18} />
          Xóa vĩnh viễn
        </button>
      </div>
    </Modal>
  );
}
