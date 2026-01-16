import React, { useState, useRef } from 'react';
import { FileText, Upload, Eye, X, Download, Paperclip, File, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { InspectionTask } from '@/app/data/inspection-tasks-mock-data';
import styles from './Form11Modal.module.css';

interface Form11ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: InspectionTask;
}

interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  file: File;
}

export function Form11Modal({ open, onOpenChange, task }: Form11ModalProps) {
  if (!open) return null;

  // Form state
  const [organization, setOrganization] = useState('Sở Công Thương TP.HCM');
  const [department, setDepartment] = useState('Thanh tra Sở');
  const [appendixNumber, setAppendixNumber] = useState('01/PL');
  const [attachedToDocNumber, setAttachedToDocNumber] = useState(task?.code || '');
  const [attachedToDocDate, setAttachedToDocDate] = useState(
    task ? new Date(task.startDate).toLocaleDateString('vi-VN') : ''
  );
  const [attachedToDocIssuer, setAttachedToDocIssuer] = useState('Chánh Thanh tra');
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    onOpenChange(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newAttachments: Attachment[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      newAttachments.push({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        file,
      });
    }

    setAttachments([...attachments, ...newAttachments]);
    toast.success(`Đã thêm ${newAttachments.length} tệp đính kèm`);
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(attachments.filter(att => att.id !== id));
    toast.success('Đã xóa tệp đính kèm');
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handlePreview = () => {
    if (!content.trim()) {
      toast.error('Vui lòng nhập nội dung phụ lục');
      return;
    }
    setShowPreview(true);
  };

  const handleDownload = async () => {
    if (!content.trim()) {
      toast.error('Vui lòng nhập nội dung phụ lục');
      return;
    }

    toast.success('Đã tải xuống phụ lục (DOCX)');
  };

  const handleSubmitToINS = async () => {
    if (!content.trim()) {
      toast.error('Vui lòng nhập nội dung phụ lục');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Đã đẩy phụ lục lên hệ thống INS thành công');
      onOpenChange(false);
    }, 1500);
  };

  // Preview mode
  if (showPreview) {
    return (
      <div className={styles.overlay} onClick={() => setShowPreview(false)}>
        <div className={styles.previewModal} onClick={(e) => e.stopPropagation()}>
          <div className={styles.previewHeader}>
            <div className={styles.previewHeaderContent}>
              <FileText size={24} />
              <div>
                <h2 className={styles.previewTitle}>Xem trước - Phụ lục</h2>
                <p className={styles.previewSubtitle}>Mẫu số 11</p>
              </div>
            </div>
            <button onClick={() => setShowPreview(false)} className={styles.closeButton}>
              <X size={20} />
            </button>
          </div>

          <div className={styles.previewContent}>
            <div className={styles.docPreview}>
              {/* Header */}
              <div className={styles.docHeader}>
                <div className={styles.docHeaderLeft}>
                  <p className={styles.docHeaderTitle}>{organization}</p>
                  <p className={styles.docHeaderTitle}>{department}</p>
                  <p className={styles.docHeaderUnderline}>_______________</p>
                  <p style={{ marginTop: '20px', fontSize: '13px' }}>
                    Số: {appendixNumber}
                  </p>
                </div>
                <div className={styles.docHeaderRight}>
                  <p className={styles.docHeaderTitle}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
                  <p className={styles.docHeaderSubtitle}>Độc lập - Tự do - Hạnh phúc</p>
                  <p className={styles.docHeaderUnderline}>_______________</p>
                  <p style={{ marginTop: '20px', fontSize: '13px', fontStyle: 'italic' }}>
                    ......, ngày ..... tháng ..... năm ......
                  </p>
                </div>
              </div>

              {/* Title */}
              <h1 className={styles.docTitle}>PHỤ LỤC</h1>
              <p className={styles.docSubtitle}>
                (Kèm theo {attachedToDocIssuer && `${attachedToDocIssuer.toLowerCase()}, `}
                số {attachedToDocNumber}, ngày {attachedToDocDate})
              </p>

              {/* Content */}
              <div className={styles.docContent}>{content}</div>

              {/* Attachments notice */}
              {attachments.length > 0 && (
                <div style={{ marginTop: '40px', fontSize: '13px', fontStyle: 'italic' }}>
                  <p><strong>Tệp đính kèm:</strong></p>
                  <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                    {attachments.map(att => (
                      <li key={att.id}>{att.name} ({formatFileSize(att.size)})</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Footer */}
              <div className={styles.docFooter}>
                NƠI KÝ TÊN CỦA CÁC BÊN
              </div>
            </div>
          </div>

          <div className={styles.previewFooter}>
            <button onClick={() => setShowPreview(false)} className={styles.cancelButton}>
              Đóng
            </button>
            <button onClick={handleDownload} className={styles.downloadButton}>
              <Download size={16} />
              Tải về
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <FileText size={24} className={styles.headerIcon} />
            <div>
              <h2 className={styles.title}>Mẫu số 11. Phụ lục</h2>
              <p className={styles.subtitle}>
                Bổ sung các nội dung giải trình, bản đồ, hình ảnh không thể đưa vào phần thân chính
              </p>
            </div>
          </div>
          <button onClick={handleClose} className={styles.closeButton} aria-label="Đóng">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {/* Section 1: Document Information */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Thông tin văn bản</h3>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Cơ quan chủ quản <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.input}
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="VD: Sở Công Thương TP.HCM"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Đơn vị ban hành <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.input}
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="VD: Thanh tra Sở"
                />
              </div>
            </div>

            <div className={styles.formRow3}>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Số phụ lục <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.input}
                  value={appendixNumber}
                  onChange={(e) => setAppendixNumber(e.target.value)}
                  placeholder="VD: 01/PL"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Số văn bản kèm theo <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.input}
                  value={attachedToDocNumber}
                  onChange={(e) => setAttachedToDocNumber(e.target.value)}
                  placeholder="VD: 01/QĐ-KT"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Ngày văn bản</label>
                <input
                  type="text"
                  className={styles.input}
                  value={attachedToDocDate}
                  onChange={(e) => setAttachedToDocDate(e.target.value)}
                  placeholder="VD: 15/01/2026"
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Người ký văn bản</label>
              <input
                type="text"
                className={styles.input}
                value={attachedToDocIssuer}
                onChange={(e) => setAttachedToDocIssuer(e.target.value)}
                placeholder="VD: Chánh Thanh tra"
              />
            </div>
          </div>

          {/* Section 2: Content */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Nội dung phụ lục</h3>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                Nội dung <span className={styles.required}>*</span>
              </label>
              <textarea
                className={styles.textarea}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Nhập nội dung phụ lục tại đây. Có thể bao gồm giải trình, mô tả bản đồ, hình ảnh, hoặc bất kỳ nội dung bổ sung nào..."
              />
            </div>
          </div>

          {/* Section 3: Attachments */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Tệp đính kèm</h3>

            <div
              className={styles.fileUpload}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className={styles.fileUploadIcon}>
                <Paperclip size={32} />
              </div>
              <p className={styles.fileUploadText}>
                Nhấp để chọn tệp hoặc kéo thả tệp vào đây
              </p>
              <p className={styles.fileUploadSubtext}>
                Hỗ trợ: PDF, DOCX, XLSX, JPG, PNG, ZIP (Tối đa 10MB mỗi tệp)
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              className={styles.fileInput}
              onChange={handleFileSelect}
              multiple
              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.zip"
            />

            {attachments.length > 0 && (
              <div className={styles.attachmentsList}>
                {attachments.map((attachment) => (
                  <div key={attachment.id} className={styles.attachmentItem}>
                    <File size={20} className={styles.attachmentIcon} />
                    <div className={styles.attachmentInfo}>
                      <div className={styles.attachmentName}>{attachment.name}</div>
                      <div className={styles.attachmentSize}>
                        {formatFileSize(attachment.size)}
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveAttachment(attachment.id)}
                      className={styles.removeButton}
                      title="Xóa"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button type="button" onClick={handleClose} className={styles.cancelButton}>
            Hủy
          </button>
          <button type="button" onClick={handlePreview} className={styles.previewButton}>
            <Eye size={16} />
            Xem trước
          </button>
          <button type="button" onClick={handleDownload} className={styles.downloadButton}>
            <Download size={16} />
            Tải về
          </button>
          <button
            type="button"
            onClick={handleSubmitToINS}
            disabled={isSubmitting || !content.trim()}
            className={styles.submitButton}
          >
            <Upload size={16} />
            {isSubmitting ? 'Đang gửi...' : 'Đẩy sang INS'}
          </button>
        </div>
      </div>
    </div>
  );
}
