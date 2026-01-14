import React, { useState } from 'react';
import { X, RotateCcw, AlertCircle } from 'lucide-react';
import styles from './ReopenTaskModal.module.css';

interface ReopenTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskTitle: string;
  taskId: string;
  onReopen: (reason: string) => void;
}

export function ReopenTaskModal({ 
  isOpen, 
  onClose, 
  taskTitle, 
  taskId,
  onReopen 
}: ReopenTaskModalProps) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reason.trim()) {
      setError('Vui lòng nhập lý do mở lại');
      return;
    }

    if (reason.trim().length < 10) {
      setError('Lý do phải có ít nhất 10 ký tự');
      return;
    }

    onReopen(reason.trim());
    handleClose();
  };

  const handleClose = () => {
    setReason('');
    setError('');
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.headerIcon}>
              <RotateCcw size={20} />
            </div>
            <div>
              <h2 className={styles.title}>Mở lại phiên làm việc</h2>
              <p className={styles.subtitle}>{taskTitle}</p>
            </div>
          </div>
          <button className={styles.closeButton} onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit}>
          <div className={styles.content}>
            {/* Warning Banner */}
            <div className={styles.warningBanner}>
              <AlertCircle size={16} />
              <div>
                <div className={styles.warningTitle}>Xác nhận mở lại phiên làm việc</div>
                <div className={styles.warningText}>
                  Phiên làm việc sẽ chuyển về trạng thái "Đang thực hiện". 
                  Vui lòng ghi rõ lý do để theo dõi và đánh giá.
                </div>
              </div>
            </div>

            {/* Reason Input */}
            <div className={styles.field}>
              <label className={styles.label} htmlFor="reason">
                Lý do mở lại <span className={styles.required}>*</span>
              </label>
              <textarea
                id="reason"
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  setError('');
                }}
                placeholder="Nhập lý do chi tiết vì sao cần mở lại phiên làm việc này...&#10;&#10;Ví dụ: Phát hiện sai sót trong kết quả kiểm tra, cần bổ sung thêm chứng cứ..."
                rows={6}
                className={`${styles.textarea} ${error ? styles.textareaError : ''}`}
              />
              {error && (
                <span className={styles.errorText}>
                  <AlertCircle size={14} /> {error}
                </span>
              )}
              <div className={styles.hint}>
                Lý do này sẽ được lưu lại và hiển thị kèm icon ⓘ trong danh sách phiên làm việc
              </div>
            </div>

            {/* Additional Info */}
            <div className={styles.infoBox}>
              <h4 className={styles.infoTitle}>Thông tin quan trọng</h4>
              <ul className={styles.infoList}>
                <li>Trạng thái sẽ chuyển từ "Hoàn thành" sang "Đang thực hiện"</li>
                <li>Lý do mở lại sẽ được ghi nhận vào lịch sử</li>
                <li>Icon ⓘ sẽ hiển thị bên cạnh tên phiên làm việc</li>
                <li>Có thể xem chi tiết lý do mở lại khi hover vào icon ⓘ</li>
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className={styles.footer}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={handleClose}
            >
              Hủy
            </button>
            <button
              type="submit"
              className={styles.submitButton}
            >
              <RotateCcw size={16} />
              Xác nhận mở lại
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReopenTaskModal;
