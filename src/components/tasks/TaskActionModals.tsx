import React from 'react';
import { X, PlayCircle, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import styles from './TaskActionModals.module.css';
import type { InspectionTask } from '@/utils/data/inspection-tasks-mock-data';

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

// Deploy/Start Task Modal
interface DeployTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: InspectionTask | null;
  onConfirm: () => void;
}

export function DeployTaskModal({ isOpen, onClose, task, onConfirm }: DeployTaskModalProps) {
  if (!task) return null;

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
          <h3 className={styles.modalTitle}>Triển khai phiên làm việc</h3>
          <p className={styles.modalSubtitle}>Phiên: {task.title}</p>
        </div>
        <button className={styles.closeButton} onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <div className={styles.modalBody}>
        <div className={styles.infoBox} style={{ background: '#10B98115', borderColor: '#10B981' }}>
          <p>Phiên làm việc sẽ được chuyển sang trạng thái <strong>"Đang thực hiện"</strong></p>
        </div>
        <p className="mt-4 text-sm text-balance text-muted-foreground">Bạn có chắc chắn muốn triển khai phiên làm việc này không?</p>
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
          Triển khai
        </button>
      </div>
    </Modal>
  );
}

// Complete Task Modal
interface CompleteTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: InspectionTask | null;
  onConfirm: () => void;
}

export function CompleteTaskModal({ isOpen, onClose, task, onConfirm }: CompleteTaskModalProps) {
  if (!task) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.modalHeader}>
        <div className={styles.modalIconWrapper} style={{ background: '#005cb6' }}>
          <CheckCircle size={24} color="white" />
        </div>
        <div className={styles.modalHeaderContent}>
          <h3 className={styles.modalTitle}>Xác nhận hoàn thành</h3>
          <p className={styles.modalSubtitle}>Phiên: {task.title}</p>
        </div>
        <button className={styles.closeButton} onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <div className={styles.modalBody}>
        <div className={styles.infoBox} style={{ background: '#005cb615', borderColor: '#005cb6', color: '#005cb6' }}>
          <p>Phiên làm việc sẽ được chuyển sang trạng thái <strong>"Đã hoàn thành"</strong>. Bạn sẽ có thể xuất biên bản kiểm tra và báo cáo tổng hợp.</p>
        </div>
        <p className="mt-4 text-sm text-balance text-muted-foreground" style={{ marginTop: '12px' }}>Bạn có chắc chắn muốn hoàn thành phiên làm việc này? Mọi thông tin sau khi hoàn thành sẽ được lưu trữ hồ sơ.</p>
      </div>

      <div className={styles.modalFooter}>
        <button className={styles.cancelButton} onClick={onClose}>
          Hủy
        </button>
        <button 
          className={styles.primaryButton} 
          onClick={() => {
            onConfirm();
            onClose();
          }}
          style={{ background: '#005cb6' }}
        >
          Hoàn thành
        </button>
      </div>
    </Modal>
  );
}

// Cancel Task Modal
interface CancelTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: InspectionTask | null;
  onConfirm: () => void;
}

export function CancelTaskModal({ isOpen, onClose, task, onConfirm }: CancelTaskModalProps) {
  if (!task) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.modalHeader}>
        <div className={styles.modalIconWrapper} style={{ background: '#DC2626' }}>
          <XCircle size={24} color="white" />
        </div>
        <div className={styles.modalHeaderContent}>
          <h3 className={styles.modalTitle}>Hủy phiên làm việc</h3>
          <p className={styles.modalSubtitle}>Phiên: {task.title}</p>
        </div>
        <button className={styles.closeButton} onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <div className={styles.modalBody}>
        <div className={styles.infoBox} style={{ background: '#DC262615', borderColor: '#DC2626', color: '#DC2626' }}>
          <p>Phiên làm việc sẽ được chuyển sang trạng thái <strong>"Đã hủy"</strong>.</p>
        </div>
        <p className="mt-4 text-sm text-balance text-muted-foreground" style={{ marginTop: '12px' }}>Bạn có chắc chắn muốn hủy phiên làm việc này không?</p>
      </div>

      <div className={styles.modalFooter}>
        <button className={styles.cancelButton} onClick={onClose}>
          Đóng
        </button>
        <button 
          className={styles.primaryButton} 
          onClick={() => {
            onConfirm();
            onClose();
          }}
          style={{ background: '#DC2626' }}
        >
          Xác nhận hủy
        </button>
      </div>
    </Modal>
  );
}

// Close Task Modal
interface CloseTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: InspectionTask | null;
  onConfirm: () => void;
}

export function CloseTaskModal({ isOpen, onClose, task, onConfirm }: CloseTaskModalProps) {
  if (!task) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.modalHeader}>
        <div className={styles.modalIconWrapper} style={{ background: '#64748B' }}>
          <XCircle size={24} color="white" />
        </div>
        <div className={styles.modalHeaderContent}>
          <h3 className={styles.modalTitle}>Đóng phiên làm việc</h3>
          <p className={styles.modalSubtitle}>Phiên: {task.title}</p>
        </div>
        <button className={styles.closeButton} onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <div className={styles.modalBody}>
        <div className={styles.infoBox} style={{ background: '#64748B15', borderColor: '#64748B', color: '#64748B' }}>
          <p>Phiên làm việc sẽ được chuyển sang trạng thái <strong>"Đã đóng"</strong>.</p>
        </div>
        <p className="mt-4 text-sm text-balance text-muted-foreground">Bạn có chắc chắn muốn đóng phiên làm việc này không? Hành động này sẽ kết thúc quy trình của phiên.</p>
      </div>

      <div className={styles.modalFooter}>
        <button className={styles.cancelButton} onClick={onClose}>
          Hủy
        </button>
        <button 
          className={styles.primaryButton} 
          onClick={() => {
            onConfirm();
            onClose();
          }}
          style={{ background: '#64748B' }}
        >
          Xác nhận đóng
        </button>
      </div>
    </Modal>
  );
}

// Delete Task Modal
interface DeleteTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: InspectionTask | null;
  onConfirm: () => void;
}

export function DeleteTaskModal({ isOpen, onClose, task, onConfirm }: DeleteTaskModalProps) {
  if (!task) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.modalHeader}>
        <div className={styles.modalIconWrapper} style={{ background: '#DC2626' }}>
          <Trash2 size={24} color="white" />
        </div>
        <div className={styles.modalHeaderContent}>
          <h3 className={styles.modalTitle}>Xóa phiên làm việc</h3>
          <p className={styles.modalSubtitle}>Phiên: {task.title}</p>
        </div>
        <button className={styles.closeButton} onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <div className={styles.modalBody}>
        <div className={styles.infoBox} style={{ background: '#DC262615', borderColor: '#DC2626', color: '#DC2626' }}>
          <p>Hành động này <strong>không thể hoàn tác</strong>. Dữ liệu của phiên làm việc sẽ bị xóa vĩnh viễn khỏi hệ thống.</p>
        </div>
        <p className="mt-4 text-sm text-balance text-muted-foreground">Bạn có chắc chắn muốn xóa phiên làm việc này không?</p>
      </div>

      <div className={styles.modalFooter}>
        <button className={styles.cancelButton} onClick={onClose}>
          Hủy
        </button>
        <button 
          className={styles.primaryButton} 
          onClick={() => {
            onConfirm();
            onClose();
          }}
          style={{ background: '#DC2626' }}
        >
          Xóa vĩnh viễn
        </button>
      </div>
    </Modal>
  );
}
