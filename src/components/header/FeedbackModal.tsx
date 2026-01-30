import React, { useState } from 'react';
import { X, Send, CheckCircle2, MessageSquare, Upload, Paperclip } from 'lucide-react';
import styles from './FeedbackModal.module.css';

interface FeedbackModalProps {
  onClose: () => void;
}

type FeedbackType = 'bug' | 'feature' | 'general';

interface FeedbackFormData {
  type: FeedbackType;
  subject: string;
  description: string;
  email: string;
  attachments: File[];
}

export function FeedbackModal({ onClose }: FeedbackModalProps) {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [formData, setFormData] = useState<FeedbackFormData>({
    type: 'bug',
    subject: '',
    description: '',
    email: '',
    attachments: [],
  });
  const [errors, setErrors] = useState<Partial<FeedbackFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const feedbackTypes = [
    {
      id: 'bug' as FeedbackType,
      label: 'Báo lỗi',
    },
    {
      id: 'feature' as FeedbackType,
      label: 'Đề xuất tính năng',
    },
    {
      id: 'general' as FeedbackType,
      label: 'Góp ý chung',
    },
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<FeedbackFormData> = {};

    if (!formData.subject.trim()) {
      newErrors.subject = 'Vui lòng nhập tiêu đề';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Vui lòng nhập nội dung phản hồi';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Nội dung phải có ít nhất 10 ký tự';
    }

    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // In production, send to backend API

    setIsSubmitting(false);
    setStep('success');
  };

  const handleClose = () => {
    if (step === 'success') {
      onClose();
      return;
    }

    // Simply close without confirmation
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setFormData({ ...formData, attachments: Array.from(files) });
    }
  };

  return (
    <div className={styles.overlay} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        {step === 'form' ? (
          <form onSubmit={handleSubmit} className={styles.formWrapper}>
            {/* Header */}
            <div className={styles.header}>
              <div className={styles.headerContent}>
                <div className={styles.headerIcon}>
                  <MessageSquare size={20} />
                </div>
                <div className={styles.headerText}>
                  <h2 className={styles.title}>Gửi phản hồi</h2>
                  <p className={styles.subtitle}>
                    Nhập thông tin cơ sở bạn muốn thêm vào hệ thống quản lý
                  </p>
                </div>
              </div>
              <button
                className={styles.closeButton}
                onClick={handleClose}
                type="button"
                aria-label="Đóng"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form Body */}
            <div className={styles.formBody}>
              {/* Feedback Type Selection */}
              <div className={styles.formSection}>
                <label className={styles.sectionLabel}>
                  Loại phản hồi <span className={styles.required}>*</span>
                </label>
                <div className={styles.radioGroup}>
                  {feedbackTypes.map((type) => (
                    <label
                      key={type.id}
                      className={`${styles.radioOption} ${
                        formData.type === type.id ? styles.radioOptionSelected : ''
                      }`}
                    >
                      <input
                        type="radio"
                        name="feedbackType"
                        value={type.id}
                        checked={formData.type === type.id}
                        onChange={() => setFormData({ ...formData, type: type.id })}
                        className={styles.radioInput}
                      />
                      <div className={styles.radioContent}>
                        <div className={styles.radioLabel}>{type.label}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Subject */}
              <div className={styles.formSection}>
                <label className={styles.sectionLabel} htmlFor="subject">
                  Tiêu đề <span className={styles.required}>*</span>
                </label>
                <input
                  id="subject"
                  type="text"
                  className={`${styles.input} ${errors.subject ? styles.inputError : ''}`}
                  placeholder="Nhập tiêu đề đơn giản gọn"
                  value={formData.subject}
                  onChange={(e) => {
                    setFormData({ ...formData, subject: e.target.value });
                    if (errors.subject) {
                      setErrors({ ...errors, subject: undefined });
                    }
                  }}
                  maxLength={100}
                />
                {errors.subject && (
                  <span className={styles.errorText}>{errors.subject}</span>
                )}
              </div>

              {/* Description */}
              <div className={styles.formSection}>
                <label className={styles.sectionLabel} htmlFor="description">
                  Nội dung chi tiết <span className={styles.required}>*</span>
                </label>
                <textarea
                  id="description"
                  className={`${styles.textarea} ${errors.description ? styles.inputError : ''}`}
                  placeholder="Mô tả chi tiết vấn đề hoặc kiến của bạn..."
                  value={formData.description}
                  onChange={(e) => {
                    setFormData({ ...formData, description: e.target.value });
                    if (errors.description) {
                      setErrors({ ...errors, description: undefined });
                    }
                  }}
                  rows={4}
                  maxLength={1000}
                />
                <div className={styles.textareaFooter}>
                  {errors.description ? (
                    <span className={styles.errorText}>{errors.description}</span>
                  ) : (
                    <span className={styles.charCount}>
                      {formData.description.length}/1000
                    </span>
                  )}
                </div>
              </div>

              {/* Email (Optional) */}
              <div className={styles.formSection}>
                <label className={styles.sectionLabel} htmlFor="email">
                  Email liên hệ (tùy chọn)
                </label>
                <input
                  id="email"
                  type="email"
                  className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) {
                      setErrors({ ...errors, email: undefined });
                    }
                  }}
                />
                {errors.email ? (
                  <span className={styles.errorText}>{errors.email}</span>
                ) : (
                  <span className={styles.helperText}>
                    Để lại email nếu bạn muốn nhận phản hồi từ chúng tôi
                  </span>
                )}
              </div>

              {/* Attachments (Optional) */}
              <div className={styles.formSection}>
                <label className={styles.sectionLabel} htmlFor="attachments">
                  Tệp đính kèm (tùy chọn)
                </label>
                <div className={styles.fileInputContainer}>
                  <input
                    id="attachments"
                    type="file"
                    className={styles.fileInput}
                    multiple
                    onChange={handleFileChange}
                  />
                  <label
                    htmlFor="attachments"
                    className={styles.fileInputLabel}
                  >
                    <Upload size={16} />
                    Tải lên tệp
                  </label>
                </div>
                {formData.attachments.length > 0 && (
                  <div className={styles.fileList}>
                    {formData.attachments.map((file, index) => (
                      <div key={index} className={styles.fileItem}>
                        <Paperclip size={16} />
                        {file.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className={styles.footer}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Hủy
              </button>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className={styles.spinner} />
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
        ) : (
          <div className={styles.successState}>
            <div className={styles.successIcon}>
              <CheckCircle2 size={64} />
            </div>
            <h3 className={styles.successTitle}>Cảm ơn phản hồi của bạn!</h3>
            <p className={styles.successMessage}>
              Chúng tôi đã nhận được phản hồi của bạn và sẽ xem xét trong thời gian sớm nhất.
              {formData.email && ' Nếu cần thiết, chúng tôi sẽ liên hệ qua email bạn đã cung cấp.'}
            </p>
            <button className={styles.doneButton} onClick={onClose}>
              Hoàn tất
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
