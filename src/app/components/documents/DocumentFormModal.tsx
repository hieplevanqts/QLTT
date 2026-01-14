import React, { useState } from 'react';
import { Upload, File, X, Save, FileText, Eye } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import styles from './DocumentFormModal.module.css';
import type { DocumentCode, DocumentStatus } from '../../../types/ins-documents';

export interface DocumentFormData {
  title: string;
  content: string;
  targetName?: string;
  targetAddress?: string;
  inspectionDate?: string;
  findings?: string;
  recommendations?: string;
  attachments?: File[];
}

export interface DocumentFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentCode: DocumentCode;
  documentName: string;
  mode: 'create' | 'edit';
  initialData?: Partial<DocumentFormData>;
  currentStatus?: DocumentStatus;
  onSave: (data: DocumentFormData, saveAsDraft: boolean) => void;
  onGeneratePdf?: () => void;
  onViewPdf?: () => void;
}

export function DocumentFormModal({
  open,
  onOpenChange,
  documentCode,
  documentName,
  mode,
  initialData,
  currentStatus,
  onSave,
  onGeneratePdf,
  onViewPdf,
}: DocumentFormModalProps) {
  const [formData, setFormData] = useState<DocumentFormData>({
    title: initialData?.title || '',
    content: initialData?.content || '',
    targetName: initialData?.targetName || '',
    targetAddress: initialData?.targetAddress || '',
    inspectionDate: initialData?.inspectionDate || '',
    findings: initialData?.findings || '',
    recommendations: initialData?.recommendations || '',
    attachments: initialData?.attachments || [],
  });

  const [files, setFiles] = useState<File[]>(initialData?.attachments || []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles([...files, ...newFiles]);
      setFormData({ ...formData, attachments: [...files, ...newFiles] });
    }
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    setFormData({ ...formData, attachments: newFiles });
  };

  const handleSaveDraft = () => {
    onSave(formData, true);
    onOpenChange(false);
  };

  const handleSaveComplete = () => {
    onSave(formData, false);
    onOpenChange(false);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Determine which fields to show based on document type
  const showInspectionFields = ['M06', 'M07'].includes(documentCode);
  const showAttachments = ['M10', 'M11'].includes(documentCode);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>
            {mode === 'create' ? 'Tạo mới' : 'Chỉnh sửa'} {documentName}
          </DialogTitle>
          <DialogDescription>
            Nhập thông tin chi tiết cho biểu mẫu. Có thể lưu nháp và tiếp tục sau.
          </DialogDescription>
        </DialogHeader>

        <div className={styles.formSection}>
          {/* Basic Information */}
          <div className={styles.formGroup}>
            <label className={`${styles.formLabel} ${styles.required}`}>
              Tiêu đề
            </label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Nhập tiêu đề biểu mẫu"
            />
          </div>

          {/* Content */}
          <div className={styles.formGroup}>
            <label className={`${styles.formLabel} ${styles.required}`}>
              Nội dung
            </label>
            <Textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Nhập nội dung chi tiết"
              rows={6}
            />
          </div>

          {/* Inspection-specific fields (M06, M07) */}
          {showInspectionFields && (
            <>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Tên cơ sở</label>
                  <Input
                    value={formData.targetName}
                    onChange={(e) => setFormData({ ...formData, targetName: e.target.value })}
                    placeholder="Tên cơ sở kiểm tra"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Ngày kiểm tra</label>
                  <Input
                    type="date"
                    value={formData.inspectionDate}
                    onChange={(e) => setFormData({ ...formData, inspectionDate: e.target.value })}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Địa chỉ</label>
                <Input
                  value={formData.targetAddress}
                  onChange={(e) => setFormData({ ...formData, targetAddress: e.target.value })}
                  placeholder="Địa chỉ cơ sở"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Kết quả kiểm tra</label>
                <Textarea
                  value={formData.findings}
                  onChange={(e) => setFormData({ ...formData, findings: e.target.value })}
                  placeholder="Ghi nhận kết quả, phát hiện vi phạm (nếu có)..."
                  rows={4}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Kiến nghị</label>
                <Textarea
                  value={formData.recommendations}
                  onChange={(e) => setFormData({ ...formData, recommendations: e.target.value })}
                  placeholder="Kiến nghị, đề xuất xử lý..."
                  rows={3}
                />
              </div>
            </>
          )}

          {/* Attachments (M10, M11) */}
          {showAttachments && (
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Tệp đính kèm</label>
              <div className={styles.formHint}>
                Đính kèm hình ảnh, bản đồ, giấy tờ liên quan
              </div>

              <label className={styles.uploadArea}>
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  accept="image/*,.pdf,.doc,.docx"
                />
                <Upload size={32} className={styles.uploadIcon} />
                <div className={styles.uploadText}>Chọn tệp để tải lên</div>
                <div className={styles.uploadHint}>
                  Hỗ trợ: Hình ảnh, PDF, Word (tối đa 10MB)
                </div>
              </label>

              {files.length > 0 && (
                <div className={styles.fileList}>
                  {files.map((file, index) => (
                    <div key={index} className={styles.fileItem}>
                      <File size={16} className={styles.fileIcon} />
                      <div className={styles.fileInfo}>
                        <div className={styles.fileName}>{file.name}</div>
                        <div className={styles.fileSize}>{formatFileSize(file.size)}</div>
                      </div>
                      <button
                        type="button"
                        className={styles.removeButton}
                        onClick={() => handleRemoveFile(index)}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <div className={styles.actionsLeft}>
            {currentStatus && (
              <div className={styles.statusInfo}>
                Trạng thái hiện tại: <strong>{currentStatus}</strong>
              </div>
            )}
          </div>
          <div className={styles.actionsRight}>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button variant="outline" onClick={handleSaveDraft}>
              <Save size={16} />
              Lưu nháp
            </Button>
            {onGeneratePdf && (
              <Button variant="outline" onClick={onGeneratePdf}>
                <FileText size={16} />
                Sinh PDF
              </Button>
            )}
            {onViewPdf && currentStatus && ['pdf_generated', 'signed', 'pushed_to_ins'].includes(currentStatus) && (
              <Button variant="outline" onClick={onViewPdf}>
                <Eye size={16} />
                Xem PDF
              </Button>
            )}
            <Button onClick={handleSaveComplete}>
              Lưu & Hoàn thiện
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
