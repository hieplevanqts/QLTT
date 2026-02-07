import React from 'react';
import { X, Send, CheckCircle2, XCircle, PlayCircle, AlertTriangle, Trash2, PauseCircle } from 'lucide-react';
import styles from './InspectionRoundActionModals.module.css';
import type { InspectionRound } from '@/utils/data/inspection-rounds-mock-data';

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
  onConfirm: () => void;
}

export function SendForApprovalModal({ isOpen, onClose, round, onConfirm }: SendForApprovalModalProps) {
  if (!round) return null;
  
  const handleSubmit = () => {
    onConfirm();
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
          Đợt kiểm tra sẽ được gửi đến người phê duyệt. Bạn có chắc chắn muốn thực hiện hành động này?
        </p>
      </div>

      <div className={styles.modalFooter}>
        <button className={styles.cancelButton} onClick={onClose}>
          Hủy
        </button>
        <button className={styles.primaryButton} onClick={handleSubmit}>
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
  onConfirm: () => void;
}

export function StartInspectionModal({ isOpen, onClose, round, onConfirm }: StartInspectionModalProps) {
  if (!round) return null;
  
  // Determine if this is approval or start action based on current status
  const isApprovalAction = round.status === 'pending_approval';
  const title = isApprovalAction ? 'Phê duyệt đợt kiểm tra' : 'Bắt đầu kiểm tra';
  const statusText = isApprovalAction ? 'Đã duyệt' : 'Đang kiểm tra';
  const description = isApprovalAction 
    ? 'Xác nhận phê duyệt đợt kiểm tra này? Sau khi được duyệt, có thể bắt đầu thực hiện kiểm tra.'
    : 'Xác nhận bắt đầu đợt kiểm tra này? Lực lượng kiểm tra sẽ được thông báo và có thể bắt đầu thực hiện phiên làm việc.';
  const buttonText = isApprovalAction ? 'Phê duyệt' : 'Bắt đầu kiểm tra';
  const iconComponent = isApprovalAction ? <CheckCircle2 size={24} color="white" /> : <PlayCircle size={24} color="white" />;


  const handleSubmit = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.modalHeader}>
        <div className={styles.modalIconWrapper} style={{ background: '#10B981' }}>
          {iconComponent}
        </div>
        <div className={styles.modalHeaderContent}>
          <h3 className={styles.modalTitle}>{title}</h3>
          <p className={styles.modalSubtitle}>Đợt kiểm tra: {round.name}</p>
        </div>
        <button className={styles.closeButton} onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <div className={styles.modalBody}>
        <div className={styles.infoBox} style={{ background: '#10B98115', borderColor: '#10B981' }}>
          <CheckCircle2 size={20} color="#10B981" />
          <p>Đợt kiểm tra sẽ chuyển sang trạng thái <strong>{statusText}</strong></p>
        </div>

        <p className={styles.modalDescription}>
          {description}
        </p>
      </div>

      <div className={styles.modalFooter}>
        <button className={styles.cancelButton} onClick={onClose}>
          Hủy
        </button>
        <button className={styles.successButton} onClick={handleSubmit}>
          {buttonText}
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
  onConfirm: () => void;
}

export function CompleteInspectionModal({ isOpen, onClose, round, onConfirm }: CompleteInspectionModalProps) {
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
          Công tác kiểm tra thực địa đã hoàn tất. Bạn có chắc chắn muốn hoàn thành đợt kiểm tra này không?
        </p>
      </div>

      <div className={styles.modalFooter}>
        <button className={styles.cancelButton} onClick={onClose}>
          Hủy
        </button>
        <button 
          className={styles.successButton} 
          onClick={handleSubmit}
        >
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
  onConfirm: () => void;
}

export function CancelRoundModal({ isOpen, onClose, round, onConfirm }: CancelRoundModalProps) {
  if (!round) return null;
  
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
          Bạn có chắc chắn muốn hủy đợt kiểm tra này không?
        </p>
      </div>

      <div className={styles.modalFooter}>
        <button className={styles.cancelButton} onClick={onClose}>
          Hủy
        </button>
        <button 
          className={styles.warningButton} 
          onClick={handleSubmit}
        >
          Hủy đợt kiểm tra
        </button>
      </div>
    </Modal>
  );
}

// 5a. Từ chối duyệt Modal (NEW - for pending_approval status)
interface RejectRoundModalProps {
  isOpen: boolean;
  onClose: () => void;
  round: InspectionRound | null;
  onConfirm: () => void;
}

export function RejectRoundModal({ isOpen, onClose, round, onConfirm }: RejectRoundModalProps) {
  if (!round) return null;
  
  const handleSubmit = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.modalHeader}>
        <div className={styles.modalIconWrapper} style={{ background: '#EF4444' }}>
          <XCircle size={24} color="white" />
        </div>
        <div className={styles.modalHeaderContent}>
          <h3 className={styles.modalTitle}>Từ chối duyệt đợt kiểm tra</h3>
          <p className={styles.modalSubtitle}>Đợt kiểm tra: {round.name}</p>
        </div>
        <button className={styles.closeButton} onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <div className={styles.modalBody}>
        <div className={styles.warningBox} style={{ background: '#EF444415', borderColor: '#EF4444' }}>
          <AlertTriangle size={20} color="#EF4444" />
          <p><strong>Lưu ý:</strong> Đợt kiểm tra sẽ chuyển sang trạng thái "Từ chối duyệt"</p>
        </div>

        <p className={styles.modalDescription}>
          Bạn có chắc chắn muốn từ chối phê duyệt đợt kiểm tra này không?
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
          Từ chối duyệt
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
          Xóa vĩnh viễn
        </button>
      </div>
    </Modal>
  );
}

// 7. Tạm dừng đợt kiểm tra Modal
interface PauseRoundModalProps {
  isOpen: boolean;
  onClose: () => void;
  round: InspectionRound | null;
  onConfirm: () => void;
}

export function PauseRoundModal({ isOpen, onClose, round, onConfirm }: PauseRoundModalProps) {
  if (!round) return null;

  const handleSubmit = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.modalHeader}>
        <div className={styles.modalIconWrapper} style={{ background: '#F59E0B' }}>
          <PauseCircle size={24} color="white" />
        </div>
        <div className={styles.modalHeaderContent}>
          <h3 className={styles.modalTitle}>Tạm dừng đợt kiểm tra</h3>
          <p className={styles.modalSubtitle}>Đợt kiểm tra: {round.name}</p>
        </div>
        <button className={styles.closeButton} onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <div className={styles.modalBody}>
        <div className={styles.warningBox} style={{ background: '#F59E0B15', borderColor: '#F59E0B' }}>
          <AlertTriangle size={20} color="#F59E0B" />
          <p><strong>Cảnh báo:</strong> Đợt kiểm tra sẽ chuyển sang trạng thái "Tạm dừng"</p>
        </div>

        <p className={styles.modalDescription}>
          Bạn có chắc chắn muốn tạm dừng đợt kiểm tra này không? Đợt kiểm tra có thể được tiếp tục sau này.
        </p>
      </div>

      <div className={styles.modalFooter}>
        <button className={styles.cancelButton} onClick={onClose}>
          Hủy
        </button>
        <button 
          className={styles.warningButton} 
          onClick={handleSubmit}
        >
          Tạm dừng
        </button>
      </div>
    </Modal>
  );
}

// 8. Tiếp tục đợt kiểm tra Modal
interface ResumeRoundModalProps {
  isOpen: boolean;
  onClose: () => void;
  round: InspectionRound | null;
  onConfirm: () => void;
}

export function ResumeRoundModal({ isOpen, onClose, round, onConfirm }: ResumeRoundModalProps) {
  if (!round) return null;

  const handleSubmit = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.modalHeader}>
        <div className={styles.modalIconWrapper} style={{ background: '#10B981' }}>
          <PlayCircle size={24} color="white" />
        </div>
        <div className={styles.modalHeaderContent}>
          <h3 className={styles.modalTitle}>Tiếp tục đợt kiểm tra</h3>
          <p className={styles.modalSubtitle}>Đợt kiểm tra: {round.name}</p>
        </div>
        <button className={styles.closeButton} onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <div className={styles.modalBody}>
        <div className={styles.infoBox} style={{ background: '#10B98115', borderColor: '#10B981' }}>
          <PlayCircle size={20} color="#10B981" />
          <p>Đợt kiểm tra sẽ chuyển sang trạng thái <strong>Đang kiểm tra</strong></p>
        </div>

        <p className={styles.modalDescription}>
          Bạn có chắc chắn muốn tiếp tục đợt kiểm tra này không? Các hoạt động kiểm tra sẽ được triển khai trở lại.
        </p>
      </div>

      <div className={styles.modalFooter}>
        <button className={styles.cancelButton} onClick={onClose}>
          Hủy
        </button>
        <button 
          className={styles.successButton} 
          onClick={handleSubmit}
        >
          Tiếp tục
        </button>
      </div>
    </Modal>
  );
}

// 9. Triển khai đợt kiểm tra Modal (Approved -> Active)
interface DeployRoundModalProps {
  isOpen: boolean;
  onClose: () => void;
  round: InspectionRound | null;
  onConfirm: () => void;
}

export function DeployRoundModal({ isOpen, onClose, round, onConfirm }: DeployRoundModalProps) {
  if (!round) return null;

  const handleSubmit = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.modalHeader}>
        <div className={styles.modalIconWrapper} style={{ background: '#0EA5E9' }}>
          <PlayCircle size={24} color="white" />
        </div>
        <div className={styles.modalHeaderContent}>
          <h3 className={styles.modalTitle}>Triển khai đợt kiểm tra</h3>
          <p className={styles.modalSubtitle}>Đợt kiểm tra: {round.name}</p>
        </div>
        <button className={styles.closeButton} onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <div className={styles.modalBody}>
        <div className={styles.infoBox} style={{ background: '#0EA5E915', borderColor: '#0EA5E9' }}>
          <PlayCircle size={20} color="#0EA5E9" />
          <p>Đợt kiểm tra sẽ chuyển sang trạng thái <strong>Đang triển khai</strong></p>
        </div>

        <p className={styles.modalDescription}>
          Bạn có chắc chắn muốn triển khai đợt kiểm tra này không? Đợt kiểm tra sẽ bắt đầu được thực hiện theo kế hoạch.
        </p>
      </div>

      <div className={styles.modalFooter}>
        <button className={styles.cancelButton} onClick={onClose}>
          Hủy
        </button>
        <button 
          className={styles.primaryButton} 
          onClick={handleSubmit}
        >
          Triển khai
        </button>
      </div>
    </Modal>
  );
}
