import React, { useState, useRef } from 'react';
import { X, Upload, FileSpreadsheet, Trash2 } from 'lucide-react';
import styles from './UploadExcelModal.module.css';
import { toast } from 'sonner';

interface UploadExcelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UploadExcelModal: React.FC<UploadExcelModalProps> = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = (file: File) => {
    // Validate file type (Excel files)
    const validTypes = [
      'application/vnd.ms-excel', // .xls
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'text/csv' // .csv
    ];
    
    const isExcelFile = validTypes.includes(file.type) || 
                        file.name.endsWith('.xls') || 
                        file.name.endsWith('.xlsx') ||
                        file.name.endsWith('.csv');

    if (!isExcelFile) {
      toast.error('Vui lòng chọn file Excel (.xls, .xlsx) hoặc CSV');
      return;
    }

    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      toast.error('Vui lòng chọn file để upload');
      return;
    }

    // TODO: Implement actual upload logic here
    // For now, just show success toast
    toast.success(`Đã thêm điểm thành công từ file ${selectedFile.name}`);
    
    // Reset and close
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>Thêm điểm từ file Excel</h2>
          <button className={styles.closeButton} onClick={onClose} aria-label="Đóng">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className={styles.content}>
          <p className={styles.description}>
            Tải lên file Excel (.xls, .xlsx) hoặc CSV chứa dữ liệu điểm để thêm vào bản đồ.
          </p>

          {/* Upload Area */}
          <div
            className={`${styles.uploadArea} ${isDragActive ? styles.dragActive : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={handleUploadClick}
          >
            <Upload className={styles.uploadIcon} />
            <p className={styles.uploadText}>
              <span className={styles.highlight}>Nhấp để chọn file</span> hoặc kéo thả file vào đây
            </p>
            <p className={styles.uploadHint}>
              Hỗ trợ: .xls, .xlsx, .csv
            </p>
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            className={styles.fileInput}
            accept=".xls,.xlsx,.csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
            onChange={handleFileInputChange}
          />

          {/* Selected File Display */}
          {selectedFile && (
            <div className={styles.selectedFile}>
              <FileSpreadsheet className={styles.fileIcon} size={24} />
              <div className={styles.fileInfo}>
                <p className={styles.fileName}>{selectedFile.name}</p>
                <p className={styles.fileSize}>{formatFileSize(selectedFile.size)}</p>
              </div>
              <button
                className={styles.removeButton}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile();
                }}
                aria-label="Xóa file"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button className={styles.cancelButton} onClick={onClose}>
            Hủy
          </button>
          <button
            className={styles.uploadButton}
            onClick={handleUpload}
            disabled={!selectedFile}
          >
            <Upload size={16} />
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};
