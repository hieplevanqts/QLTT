import React, { useState } from 'react';
import { X, Upload, File, FileText, Image, Trash2, AlertCircle } from 'lucide-react';
import styles from './AttachEvidenceModal.module.css';

interface AttachedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
}

interface AttachEvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskTitle: string;
  taskId: string;
  onSubmit: (files: AttachedFile[]) => void;
}

export function AttachEvidenceModal({ 
  isOpen, 
  onClose, 
  taskTitle,
  taskId,
  onSubmit 
}: AttachEvidenceModalProps) {
  const [files, setFiles] = useState<AttachedFile[]>([]);
  const [dragging, setDragging] = useState(false);

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      addFiles(Array.from(selectedFiles));
    }
  };

  const addFiles = (newFiles: File[]) => {
    const attachedFiles: AttachedFile[] = newFiles.map(file => ({
      id: `${Date.now()}-${Math.random()}`,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date(),
    }));
    setFiles(prev => [...prev, ...attachedFiles]);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles) {
      addFiles(Array.from(droppedFiles));
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image size={20} />;
    if (type.includes('pdf')) return <FileText size={20} />;
    return <File size={20} />;
  };

  const handleSubmit = () => {
    onSubmit(files);
    handleClose();
  };

  const handleClose = () => {
    setFiles([]);
    setDragging(false);
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.headerIcon}>
              <Upload size={20} />
            </div>
            <div>
              <h2 className={styles.title}>Đính kèm chứng cứ</h2>
              <p className={styles.subtitle}>{taskTitle}</p>
            </div>
          </div>
          <button className={styles.closeButton} onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {/* Info Banner */}
          <div className={styles.infoBanner}>
            <AlertCircle size={16} />
            <span>
              Đính kèm ảnh chụp, biên bản, và các tài liệu liên quan đến kết quả kiểm tra
            </span>
          </div>

          {/* Upload Area */}
          <div
            className={`${styles.uploadArea} ${dragging ? styles.uploadAreaDragging : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload size={40} className={styles.uploadIcon} />
            <div className={styles.uploadText}>
              <span className={styles.uploadTitle}>
                Kéo thả file vào đây hoặc{' '}
                <label htmlFor="file-input" className={styles.uploadLink}>
                  chọn file
                </label>
              </span>
              <span className={styles.uploadHint}>
                Hỗ trợ: PDF, Word, Excel, hình ảnh (JPG, PNG), tối đa 10MB/file
              </span>
            </div>
            <input
              id="file-input"
              type="file"
              multiple
              onChange={handleFileSelect}
              className={styles.fileInput}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
            />
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className={styles.fileList}>
              <div className={styles.fileListHeader}>
                <span className={styles.fileListTitle}>
                  Đã chọn {files.length} file
                </span>
              </div>
              <div className={styles.files}>
                {files.map(file => (
                  <div key={file.id} className={styles.fileItem}>
                    <div className={styles.fileIcon}>
                      {getFileIcon(file.type)}
                    </div>
                    <div className={styles.fileInfo}>
                      <div className={styles.fileName}>{file.name}</div>
                      <div className={styles.fileSize}>{formatFileSize(file.size)}</div>
                    </div>
                    <button
                      type="button"
                      className={styles.removeButton}
                      onClick={() => removeFile(file.id)}
                      title="Xóa file"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
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
            type="button"
            className={styles.submitButton}
            onClick={handleSubmit}
            disabled={files.length === 0}
          >
            <Upload size={16} />
            Đính kèm ({files.length})
          </button>
        </div>
      </div>
    </div>
  );
}

export default AttachEvidenceModal;
