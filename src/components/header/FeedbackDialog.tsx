import React, { useState } from 'react';
import { X, Send, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import styles from './FeedbackDialog.module.css';

interface FeedbackDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

type FeedbackType = 'bug' | 'feature' | 'improvement' | 'other';
type FeedbackPriority = 'low' | 'medium' | 'high';

export function FeedbackDialog({ isOpen, onClose }: FeedbackDialogProps) {
  const [type, setType] = useState<FeedbackType>('bug');
  const [priority, setPriority] = useState<FeedbackPriority>('medium');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Feedback submitted:', {
      type,
      priority,
      title,
      description,
      email,
      timestamp: new Date().toISOString(),
    });
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Auto close after 2 seconds
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  if (!isOpen) {
    return null;
  }

  if (isSubmitted) {
    return (
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
          <div className={styles.successState}>
            <div className={styles.successIcon}>
              <CheckCircle2 size={64} />
            </div>
            <h3 className={styles.successTitle}>Gửi phản hồi thành công!</h3>
            <p className={styles.successText}>
              Cảm ơn bạn đã gửi phản hồi. Chúng tôi sẽ xem xét và phản hồi sớm nhất có thể.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>Gửi phản hồi</h2>
          <button className={styles.closeButton} onClick={onClose} type="button">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.content}>
            {/* Info Banner */}
            <div className={styles.infoBanner}>
              <AlertCircle size={16} />
              <span>
                Phản hồi của bạn giúp chúng tôi cải thiện hệ thống MAPPA tốt hơn
              </span>
            </div>

            {/* Feedback Type */}
            <div className={styles.field}>
              <label className={styles.label}>Loại phản hồi *</label>
              <div className={styles.typeGrid}>
                <button
                  type="button"
                  className={`${styles.typeButton} ${type === 'bug' ? styles.typeButtonActive : ''}`}
                  onClick={() => setType('bug')}
                >
                  <span className={styles.typeEmoji}>🐛</span>
                  <span>Báo lỗi</span>
                </button>
                <button
                  type="button"
                  className={`${styles.typeButton} ${type === 'feature' ? styles.typeButtonActive : ''}`}
                  onClick={() => setType('feature')}
                >
                  <span className={styles.typeEmoji}>✨</span>
                  <span>Tính năng mới</span>
                </button>
                <button
                  type="button"
                  className={`${styles.typeButton} ${type === 'improvement' ? styles.typeButtonActive : ''}`}
                  onClick={() => setType('improvement')}
                >
                  <span className={styles.typeEmoji}>🚀</span>
                  <span>Cải thiện</span>
                </button>
                <button
                  type="button"
                  className={`${styles.typeButton} ${type === 'other' ? styles.typeButtonActive : ''}`}
                  onClick={() => setType('other')}
                >
                  <span className={styles.typeEmoji}>💬</span>
                  <span>Khác</span>
                </button>
              </div>
            </div>

            {/* Priority */}
            <div className={styles.field}>
              <label className={styles.label}>Mức độ ưu tiên *</label>
              <div className={styles.priorityGrid}>
                <button
                  type="button"
                  className={`${styles.priorityButton} ${priority === 'low' ? styles.priorityButtonActive : ''}`}
                  onClick={() => setPriority('low')}
                >
                  Thấp
                </button>
                <button
                  type="button"
                  className={`${styles.priorityButton} ${priority === 'medium' ? styles.priorityButtonActive : ''}`}
                  onClick={() => setPriority('medium')}
                >
                  Trung bình
                </button>
                <button
                  type="button"
                  className={`${styles.priorityButton} ${priority === 'high' ? styles.priorityButtonActive : ''}`}
                  onClick={() => setPriority('high')}
                >
                  Cao
                </button>
              </div>
            </div>

            {/* Title */}
            <div className={styles.field}>
              <label className={styles.label} htmlFor="feedback-title">
                Tiêu đề *
              </label>
              <input
                id="feedback-title"
                type="text"
                className={styles.input}
                placeholder="Tóm tắt ngắn gọn vấn đề hoặc đề xuất"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div className={styles.field}>
              <label className={styles.label} htmlFor="feedback-description">
                Mô tả chi tiết *
              </label>
              <textarea
                id="feedback-description"
                className={styles.textarea}
                placeholder="Mô tả chi tiết vấn đề bạn gặp phải hoặc tính năng bạn muốn đề xuất..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                required
              />
              <div className={styles.hint}>
                Vui lòng cung cấp càng nhiều thông tin càng tốt để chúng tôi hiểu rõ hơn
              </div>
            </div>

            {/* Email (optional) */}
            <div className={styles.field}>
              <label className={styles.label} htmlFor="feedback-email">
                Email liên hệ (tùy chọn)
              </label>
              <input
                id="feedback-email"
                type="email"
                className={styles.input}
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className={styles.hint}>
                Để lại email nếu bạn muốn nhận phản hồi từ chúng tôi
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className={styles.footer}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
              disabled={isSubmitting}
            >
              Hủy
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting || !title.trim() || !description.trim()}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className={styles.spinner} />
                  Đang gửi...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Gửi phản hồi
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
