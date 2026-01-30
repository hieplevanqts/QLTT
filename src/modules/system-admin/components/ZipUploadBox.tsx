/**
 * Zip Upload Box Component
 */

import React, { useState, useRef } from 'react';
import { Upload, FileArchive, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import styles from './ZipUploadBox.module.css';

interface ZipUploadBoxProps {
  onFileSelect: (file: File) => void;
  acceptedFile?: File;
  onRemove?: () => void;
  disabled?: boolean;
}

export function ZipUploadBox({ onFileSelect, acceptedFile, onRemove, disabled = false }: ZipUploadBoxProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (disabled) return;
    
    const files = Array.from(e.dataTransfer.files);
    const zipFile = files.find(f => f.name.endsWith('.zip'));
    
    if (zipFile) {
      onFileSelect(zipFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  const handleClick = () => {
    if (!disabled && !acceptedFile) {
      fileInputRef.current?.click();
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div>
      <div
        className={`${styles.zipUploadBox} ${isDragging ? styles.dragOver : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        style={{ opacity: disabled ? 0.6 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}
      >
        <Upload className={styles.uploadIcon} />
        <div className={styles.uploadTitle}>
          {acceptedFile ? 'File đã chọn' : 'Kéo thả file .zip vào đây'}
        </div>
        <div className={styles.uploadHint}>
          {acceptedFile ? 'Click nút "Xóa" để chọn file khác' : 'hoặc click để chọn file từ máy tính'}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".zip"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          disabled={disabled}
        />
      </div>

      {acceptedFile && (
        <div className={styles.uploadedFile}>
          <div className={styles.fileInfo}>
            <FileArchive className="h-5 w-5 text-primary" />
            <div>
              <div className={styles.fileName}>{acceptedFile.name}</div>
              <div className={styles.fileSize}>{formatFileSize(acceptedFile.size)}</div>
            </div>
          </div>
          {onRemove && (
            <button
              className={styles.removeButton}
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              disabled={disabled}
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
