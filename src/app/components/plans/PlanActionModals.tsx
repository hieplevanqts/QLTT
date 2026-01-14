import React, { useState } from 'react';
import { X, Send, CheckCircle2, XCircle, PlayCircle, PauseCircle, AlertTriangle, Trash2 } from 'lucide-react';
import styles from './PlanActionModals.module.css';
import type { Plan } from '../../data/kehoach-mock-data';

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
  plan: Plan;
  onConfirm: (note: string) => void;
}

export function SendForApprovalModal({ isOpen, onClose, plan, onConfirm }: SendForApprovalModalProps) {
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
          <h3 className={styles.modalTitle}>Gửi kế hoạch đi phê duyệt</h3>
          <p className={styles.modalSubtitle}>Kế hoạch: {plan.name}</p>
        </div>
        <button className={styles.closeButton} onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <div className={styles.modalBody}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Ghi chú (không bắt buộc)</label>
          <textarea
            className={styles.textarea}
            placeholder="Nhập ghi chú kèm theo..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={4}
          />
        </div>

        <div className={styles.infoBox}>
          <p>Kế hoạch sẽ được chuyển sang trạng thái <strong>"Chờ phê duyệt"</strong></p>
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

// 2. Phê duyệt Modal
interface ApproveModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: Plan;
  onConfirm: (note: string) => void;
}

export function ApproveModal({ isOpen, onClose, plan, onConfirm }: ApproveModalProps) {
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
          <CheckCircle2 size={24} color="white" />
        </div>
        <div className={styles.modalHeaderContent}>
          <h3 className={styles.modalTitle}>Phê duyệt kế hoạch</h3>
          <p className={styles.modalSubtitle}>Kế hoạch: {plan.name}</p>
        </div>
        <button className={styles.closeButton} onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <div className={styles.modalBody}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Ý kiến phê duyệt</label>
          <textarea
            className={styles.textarea}
            placeholder="Nhập ý kiến..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={4}
          />
        </div>

        <div className={styles.infoBox} style={{ background: '#10B98115', borderColor: '#10B981' }}>
          <p>Kế hoạch sẽ được chuyển sang trạng thái <strong>"Đã phê duyệt"</strong></p>
        </div>
      </div>

      <div className={styles.modalFooter}>
        <button className={styles.cancelButton} onClick={onClose}>
          Hủy
        </button>
        <button 
          className={styles.primaryButton} 
          onClick={handleSubmit}
          style={{ background: '#10B981' }}
        >
          <CheckCircle2 size={18} />
          Phê duyệt
        </button>
      </div>
    </Modal>
  );
}

// 3. Từ chối Modal
interface RejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: Plan;
  onConfirm: (reason: string) => void;
}

export function RejectModal({ isOpen, onClose, plan, onConfirm }: RejectModalProps) {
  const [reason, setReason] = useState('');

  const handleSubmit = () => {
    if (!reason.trim()) return;
    onConfirm(reason);
    setReason('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.modalHeader}>
        <div className={styles.modalIconWrapper} style={{ background: '#EF4444' }}>
          <XCircle size={24} color="white" />
        </div>
        <div className={styles.modalHeaderContent}>
          <h3 className={styles.modalTitle}>Từ chối kế hoạch</h3>
          <p className={styles.modalSubtitle}>Kế hoạch: {plan.name}</p>
        </div>
        <button className={styles.closeButton} onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <div className={styles.modalBody}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>
            Lý do từ chối <span className={styles.required}>*</span>
          </label>
          <textarea
            className={styles.textarea}
            placeholder="Nhập lý do từ chối..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={5}
          />
        </div>

        <div className={styles.warningBox}>
          <AlertTriangle size={20} />
          <p>Kế hoạch sẽ được chuyển về trạng thái <strong>"Nháp"</strong> để chỉnh sửa lại</p>
        </div>
      </div>

      <div className={styles.modalFooter}>
        <button className={styles.cancelButton} onClick={onClose}>
          Hủy
        </button>
        <button 
          className={styles.destructiveButton} 
          onClick={handleSubmit}
          disabled={!reason.trim()}
        >
          <XCircle size={18} />
          Từ chối
        </button>
      </div>
    </Modal>
  );
}

// 4. Thu hồi Modal
interface RecallModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: Plan;
  onConfirm: () => void;
}

export function RecallModal({ isOpen, onClose, plan, onConfirm }: RecallModalProps) {
  const handleSubmit = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.modalHeader}>
        <div className={styles.modalIconWrapper} style={{ background: '#F59E0B' }}>
          <XCircle size={24} color="white" />
        </div>
        <div className={styles.modalHeaderContent}>
          <h3 className={styles.modalTitle}>Thu hồi kế hoạch</h3>
          <p className={styles.modalSubtitle}>Kế hoạch: {plan.name}</p>
        </div>
        <button className={styles.closeButton} onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <div className={styles.modalBody}>
        <div className={styles.warningBox}>
          <AlertTriangle size={20} />
          <p>Kế hoạch sẽ được chuyển về trạng thái <strong>"Nháp"</strong></p>
        </div>

        <p className={styles.modalDescription}>
          Bạn có chắc chắn muốn thu hồi kế hoạch này không? Sau khi thu hồi, 
          kế hoạch s quay về trạng thái nháp và bạn có thể chỉnh sửa lại.
        </p>
      </div>

      <div className={styles.modalFooter}>
        <button className={styles.cancelButton} onClick={onClose}>
          Hủy
        </button>
        <button className={styles.warningButton} onClick={handleSubmit}>
          <XCircle size={18} />
          Thu hồi
        </button>
      </div>
    </Modal>
  );
}

// 5. Triển khai Modal
interface DeployModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: Plan;
  onConfirm: (startDate: string) => void;
}

export function DeployModal({ isOpen, onClose, plan, onConfirm }: DeployModalProps) {
  const [startDate, setStartDate] = useState('');

  const handleSubmit = () => {
    if (!startDate) return;
    onConfirm(startDate);
    setStartDate('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.modalHeader}>
        <div className={styles.modalIconWrapper} style={{ background: '#10B981' }}>
          <PlayCircle size={24} color="white" />
        </div>
        <div className={styles.modalHeaderContent}>
          <h3 className={styles.modalTitle}>Triển khai kế hoạch</h3>
          <p className={styles.modalSubtitle}>Kế hoạch: {plan.name}</p>
        </div>
        <button className={styles.closeButton} onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <div className={styles.modalBody}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>
            Ngày bắt đầu thực hiện <span className={styles.required}>*</span>
          </label>
          <input
            type="date"
            className={styles.input}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className={styles.infoBox} style={{ background: '#10B98115', borderColor: '#10B981' }}>
          <p>Kế hoạch sẽ được chuyển sang trạng thái <strong>"Đang thực hiện"</strong></p>
        </div>
      </div>

      <div className={styles.modalFooter}>
        <button className={styles.cancelButton} onClick={onClose}>
          Hủy
        </button>
        <button 
          className={styles.primaryButton} 
          onClick={handleSubmit}
          disabled={!startDate}
          style={{ background: '#10B981' }}
        >
          <PlayCircle size={18} />
          Triển khai
        </button>
      </div>
    </Modal>
  );
}

// 6. Tạm dừng Modal
interface PauseModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: Plan;
  onConfirm: (reason: string) => void;
}

export function PauseModal({ isOpen, onClose, plan, onConfirm }: PauseModalProps) {
  const [reason, setReason] = useState('');

  const handleSubmit = () => {
    if (!reason.trim()) return;
    onConfirm(reason);
    setReason('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.modalHeader}>
        <div className={styles.modalIconWrapper} style={{ background: '#F59E0B' }}>
          <PauseCircle size={24} color="white" />
        </div>
        <div className={styles.modalHeaderContent}>
          <h3 className={styles.modalTitle}>Tạm dừng kế hoạch</h3>
          <p className={styles.modalSubtitle}>Kế hoạch: {plan.name}</p>
        </div>
        <button className={styles.closeButton} onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <div className={styles.modalBody}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>
            Lý do tạm dừng <span className={styles.required}>*</span>
          </label>
          <textarea
            className={styles.textarea}
            placeholder="Nhập lý do tạm dừng..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
          />
        </div>

        <div className={styles.warningBox}>
          <AlertTriangle size={20} />
          <p>Kế hoạch sẽ được tạm dừng và có thể tiếp tục sau</p>
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
          <PauseCircle size={18} />
          Tạm dừng
        </button>
      </div>
    </Modal>
  );
}

// 7. Xóa Modal
interface DeletePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: Plan | null;
  onConfirm: () => void;
}

export function DeletePlanModal({ isOpen, onClose, plan, onConfirm }: DeletePlanModalProps) {
  if (!plan) return null;

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
          <h3 className={styles.modalTitle}>Xóa kế hoạch</h3>
          <p className={styles.modalSubtitle}>Kế hoạch: {plan.name}</p>
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
          Bạn có chắc chắn muốn xóa kế hoạch này không? Tất cả dữ liệu liên quan sẽ bị xóa vĩnh viễn.
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