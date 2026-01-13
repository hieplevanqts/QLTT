import React, { useState, useRef } from 'react';
import { Upload, X, Download, FileSpreadsheet, Info, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../app/components/ui/dialog';
import { Button } from '../app/components/ui/button';
import styles from './StoreImportDialog.module.css';

interface StoreImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport?: (file: File) => Promise<void>;
  onDownloadTemplate?: () => void;
}

export function StoreImportDialog({
  open,
  onOpenChange,
  onImport,
  onDownloadTemplate,
}: StoreImportDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle drag events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  };

  // Validate file
  const validateAndSetFile = (selectedFile: File) => {
    const validTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(selectedFile.type)) {
      setError('Chỉ hỗ trợ file .xlsx và .xls');
      setFile(null);
      return;
    }

    if (selectedFile.size > maxSize) {
      setError('File không được vượt quá 10MB');
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setError(null);
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  // Handle click upload area
  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  // Handle import
  const handleImport = async () => {
    if (!file || uploading) return;

    setUploading(true);
    try {
      await onImport?.(file);
      // Don't close here - parent component will handle navigation
    } catch (error) {
      console.error('Import failed:', error);
      toast.error('Có lỗi xảy ra khi import file. Vui lòng thử lại.');
    } finally {
      setUploading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (!uploading) {
      setFile(null);
      setError(null);
      onOpenChange(false);
    }
  };

  // Handle download template
  const handleDownloadTemplate = () => {
    onDownloadTemplate?.();
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={styles.dialogWrapper}>
        {/* Header */}
        <DialogHeader className={styles.header}>
          <div className={styles.headerContent}>
            <DialogTitle className={styles.title}>Import danh sách cửa hàng từ Excel</DialogTitle>
            <DialogDescription className={styles.description}>
              Tải lên file Excel chứa thông tin cửa hàng. Sau khi import thành công, 
              tất cả cửa hàng sẽ ở trạng thái <strong>Chờ duyệt</strong>.
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className={styles.content}>
          {/* Download Template Section */}
          <div className={styles.templateSection}>
            <button
              className={styles.downloadButton}
              onClick={handleDownloadTemplate}
              disabled={uploading}
            >
              <Download size={18} />
              Tải file mẫu
            </button>
            <p className={styles.templateNote}>
              Chỉ áp dụng cho cửa hàng trong phạm vi quản lý
            </p>
          </div>

          {/* Upload Section */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              Chọn file Excel <span style={{ color: 'var(--color-danger)' }}>*</span>
            </h3>

            {!file ? (
              <div
                className={`${styles.uploadArea} ${dragActive ? styles.uploadAreaActive : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={handleClickUpload}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className={styles.hiddenInput}
                  accept=".xlsx,.xls"
                  onChange={handleFileChange}
                  disabled={uploading}
                />
                
                <div className={styles.uploadContent}>
                  <div className={styles.uploadIcon}>
                    <Upload size={32} />
                  </div>
                  <p className={styles.uploadText}>
                    <span className={styles.uploadTextHighlight}>Click để chọn file</span>
                    {' '}hoặc kéo thả vào đây
                  </p>
                  <p className={styles.uploadHint}>
                    Chỉ hỗ trợ file .xlsx và .xls
                  </p>
                </div>
              </div>
            ) : (
              <div className={styles.filePreview}>
                <div className={styles.fileInfo}>
                  <div className={styles.fileIconWrapper}>
                    <FileSpreadsheet size={20} />
                  </div>
                  <div className={styles.fileDetails}>
                    <p className={styles.fileName}>{file.name}</p>
                    <p className={styles.fileSize}>{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button
                  className={styles.removeButton}
                  onClick={() => setFile(null)}
                  disabled={uploading}
                  aria-label="Xóa file"
                >
                  <X size={20} />
                </button>
              </div>
            )}
          </div>

          {/* Error Alert */}
          {error && (
            <div className={styles.errorAlert}>
              <div className={styles.errorAlertIcon}>
                <AlertCircle size={20} />
              </div>
              <div className={styles.errorAlertContent}>
                <p className={styles.errorAlertTitle}>Không thể chọn file</p>
                <p className={styles.errorAlertMessage}>{error}</p>
              </div>
              <button
                className={styles.errorAlertClose}
                onClick={() => setError(null)}
                aria-label="Đóng thông báo"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Info Box */}
          <div className={styles.infoBox}>
            <Info size={18} className={styles.infoIcon} />
            <p className={styles.infoText}>
              Hệ thống sẽ kiểm tra và thông báo nếu có lỗi. 
              Bạn có thể xem trước và chỉnh sửa trước khi xác nhận import.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={uploading}
          >
            Hủy
          </Button>
          <Button
            onClick={handleImport}
            disabled={!file || uploading}
          >
            {uploading ? (
              <>
                <Loader2 size={16} className={styles.loadingSpinner} />
                Đang xử lý...
              </>
            ) : (
              'Nhập thông tin'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}