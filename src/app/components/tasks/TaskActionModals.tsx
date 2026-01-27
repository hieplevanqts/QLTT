import React, { useState } from 'react';
import { X, PlayCircle } from 'lucide-react';
import styles from './TaskActionModals.module.css';
import type { InspectionTask } from '../../data/inspection-tasks-mock-data';

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
  onConfirm: (startDate: string) => void;
}

export function DeployTaskModal({ isOpen, onClose, task, onConfirm }: DeployTaskModalProps) {
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]); // Default to today

  if (!task) return null;

  const handleSubmit = () => {
    if (!startDate) return;
    onConfirm(startDate);
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
          <p>Phiên làm việc sẽ được chuyển sang trạng thái <strong>"Đang thực hiện"</strong></p>
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
