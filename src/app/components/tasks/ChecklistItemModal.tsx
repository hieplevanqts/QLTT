import React, { useState, useRef } from 'react';
import { X, Camera, Upload, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import styles from './ChecklistItemModal.module.css';

interface ChecklistItemModalProps {
  item: ChecklistItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (itemId: string, data: ChecklistItemData) => void;
  readOnly?: boolean;
}

export interface ChecklistItem {
  id: string;
  title: string;
  status: 'passed' | 'failed' | 'pending';
  attachments: number;
  evidenceImages?: Array<{ id: string; url: string; name: string }>;
  notes?: string;
}

export interface ChecklistItemData {
  status: 'passed' | 'failed' | 'pending';
  evidenceImages: Array<{ id: string; url: string; name: string }>;
  notes: string;
}

// Convert mock data item to ChecklistItem
const convertToChecklistItem = (item: { id: string; title: string; status: string; attachments: number }): ChecklistItem => {
  return {
    id: item.id,
    title: item.title,
    status: (item.status as 'passed' | 'failed') || 'pending',
    attachments: item.attachments,
    evidenceImages: [],
    notes: '',
  };
};

export function ChecklistItemModal({ item, isOpen, onClose, onSave, readOnly }: ChecklistItemModalProps) {
  const [status, setStatus] = useState<'passed' | 'failed' | 'pending'>(item?.status || 'pending');
  const [evidenceImages, setEvidenceImages] = useState<Array<{ id: string; url: string; name: string }>>(
    item?.evidenceImages || []
  );
  const [notes, setNotes] = useState(item?.notes || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (item && isOpen) {
      setStatus(item.status);
      setEvidenceImages(item.evidenceImages || []);
      setNotes(item.notes || '');
    }
  }, [item, isOpen]);

  if (!isOpen || !item) return null;

  const handleUploadImage = () => {
    // Trigger file input
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach((file) => {
        // Create a URL for preview
        const imageUrl = URL.createObjectURL(file);
        const newImage = {
          id: `img-${Date.now()}-${Math.random()}`,
          url: imageUrl,
          name: file.name,
        };
        setEvidenceImages((prev) => [...prev, newImage]);
      });
      toast.success(`Đã tải lên ${files.length} ảnh`);
      // Reset input
      e.target.value = '';
    }
  };

  const handleRemoveImage = (imageId: string) => {
    setEvidenceImages(evidenceImages.filter((img) => img.id !== imageId));
    toast.success('Đã xóa ảnh');
  };

  const handleSave = () => {
    if (status === 'pending') {
      toast.error('Vui lòng chọn Đạt hoặc Không đạt');
      return;
    }
    if (evidenceImages.length === 0) {
      toast.warning('Chưa có ảnh minh chứng');
    }
    
    onSave(item.id, {
      status,
      evidenceImages,
      notes,
    });
    toast.success('Đã lưu kết quả kiểm tra');
    onClose();
  };

  const charCount = notes.length;
  const maxChars = 1000;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>{readOnly ? 'Chi tiết tiêu chí' : 'Nhập kết quả kiểm tra'}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {/* Item Title */}
          <div className={styles.itemTitle}>
            <div className={styles.itemTitleText}>{item.title}</div>
          </div>

          {/* Status Display (Read-only mode) or Controls (Edit mode) */}
          {readOnly ? (
            <div className={styles.statusDisplay}>
              <div className={styles.statusLabel}>Kết quả:</div>
              <div className={`${styles.statusBadge} ${status === 'passed' ? styles.statusBadgePassed : styles.statusBadgeFailed}`}>
                {status === 'passed' ? <CheckCircle size={16} /> : <XCircle size={16} />}
                {status === 'passed' ? 'Đạt' : 'Không đạt'}
              </div>
            </div>
          ) : (
            <div className={styles.statusControls}>
              <button
                className={`${styles.statusButton} ${status === 'passed' ? styles.statusButtonPassed : ''}`}
                onClick={() => setStatus('passed')}
              >
                <CheckCircle size={20} />
                Đạt
              </button>
              <button
                className={`${styles.statusButton} ${status === 'failed' ? styles.statusButtonFailed : ''}`}
                onClick={() => setStatus('failed')}
              >
                <XCircle size={20} />
                Không đạt
              </button>
            </div>
          )}

          {/* Evidence Images */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>Chứng cứ hình ảnh</h3>
              {!readOnly && (
                <>
                  <button className={styles.uploadButton} onClick={handleUploadImage}>
                    <Upload size={16} />
                    Tải lên
                  </button>
                  <input
                    type="file"
                    className={styles.fileInput}
                    multiple
                    accept="image/*"
                    onChange={handleFileInput}
                    ref={fileInputRef}
                  />
                </>
              )}
            </div>

            {evidenceImages.length === 0 ? (
              <div className={styles.emptyState}>
                <Camera size={32} className={styles.emptyIcon} />
                <p>Chưa có ảnh chứng cứ</p>
                {!readOnly && (
                  <button className={styles.uploadButtonLarge} onClick={handleUploadImage}>
                    <Camera size={16} />
                    Chụp/Tải ảnh lên
                  </button>
                )}
              </div>
            ) : (
              <div className={styles.evidenceGrid}>
                {evidenceImages.map((image) => (
                  <div key={image.id} className={styles.evidenceItem}>
                    <img src={image.url} alt={image.name} className={styles.evidenceImage} />
                    {!readOnly && (
                      <button
                        className={styles.removeImageButton}
                        onClick={() => handleRemoveImage(image.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
                {!readOnly && (
                  <button className={styles.addMoreButton} onClick={handleUploadImage}>
                    <Camera size={24} />
                    <span>Thêm ảnh</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Notes */}
          <div className={styles.section}>
            <label className={styles.label}>Mô tả chi tiết</label>
            {readOnly ? (
              <div className={styles.readOnlyText}>
                {notes || 'Không có ghi chú'}
              </div>
            ) : (
              <>
                <textarea
                  className={styles.textarea}
                  placeholder="VD: Tại thời điểm kiểm tra, cơ sở đã tuân thủ đầy đủ các quy định về vệ sinh ATTP, nhân viên đã có..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  maxLength={maxChars}
                  rows={6}
                />
                <div className={styles.charCount}>
                  {charCount} / {maxChars} ký tự
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button className={styles.cancelButton} onClick={onClose}>
            {readOnly ? 'Đóng' : 'Hủy'}
          </button>
          {!readOnly && (
            <button className={styles.saveButton} onClick={handleSave}>
              Kết luận
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChecklistItemModal;