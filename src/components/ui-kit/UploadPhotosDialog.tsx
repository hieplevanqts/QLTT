import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ImageCategory, getCategoryLabel } from '@/utils/data/mockImages';
import styles from './UploadPhotosDialog.module.css';

interface UploadedFile {
  file: File;
  preview: string;
  category: Exclude<ImageCategory, 'all'>;
}

interface UploadPhotosDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (files: UploadedFile[]) => void;
  storeId: number;
}

export function UploadPhotosDialog({
  open,
  onOpenChange,
  onUpload,
  storeId,
}: UploadPhotosDialogProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [defaultCategory, setDefaultCategory] = useState<Exclude<ImageCategory, 'all'>>('storefront');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles: UploadedFile[] = [];
    
    Array.from(files).forEach((file) => {
      // Only accept images
      if (!file.type.startsWith('image/')) return;

      const preview = URL.createObjectURL(file);
      newFiles.push({
        file,
        preview,
        category: defaultCategory,
      });
    });

    setUploadedFiles((prev) => [...prev, ...newFiles]);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Remove file
  const handleRemoveFile = (index: number) => {
    setUploadedFiles((prev) => {
      const updated = [...prev];
      // Revoke URL to avoid memory leak
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

  // Update category for a single file
  const handleUpdateCategory = (index: number, category: Exclude<ImageCategory, 'all'>) => {
    setUploadedFiles((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], category };
      return updated;
    });
  };

  // Update category for all files
  const handleBulkUpdateCategory = (category: Exclude<ImageCategory, 'all'>) => {
    setUploadedFiles((prev) =>
      prev.map((file) => ({ ...file, category }))
    );
  };

  // Handle upload
  const handleUpload = async () => {
    if (uploadedFiles.length === 0) return;

    setLoading(true);

    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    onUpload(uploadedFiles);

    // Cleanup
    uploadedFiles.forEach((file) => URL.revokeObjectURL(file.preview));
    setUploadedFiles([]);
    setLoading(false);
    onOpenChange(false);
  };

  // Handle close
  const handleClose = () => {
    // Cleanup previews
    uploadedFiles.forEach((file) => URL.revokeObjectURL(file.preview));
    setUploadedFiles([]);
    onOpenChange(false);
  };

  const categories: Exclude<ImageCategory, 'all'>[] = [
    'storefront',
    'interior',
    'products',
    'kitchen',
    'documents',
    'other',
  ];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className={styles.dialog}>
        <DialogHeader>
          <DialogTitle>Tải ảnh lên</DialogTitle>
          <DialogDescription>
            Tải lên một hoặc nhiều ảnh cùng lúc. Bạn có thể chọn danh mục cho từng ảnh hoặc áp dụng danh mục cho tất cả.
          </DialogDescription>
        </DialogHeader>

        <div className={styles.content}>
          {/* Upload Area */}
          <div className={styles.uploadArea}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className={styles.fileInput}
              id="photo-upload"
            />
            <label htmlFor="photo-upload" className={styles.uploadLabel}>
              <div className={styles.uploadIcon}>
                <Upload size={28} />
              </div>
              <div className={styles.uploadText}>
                Nhấn để chọn ảnh hoặc kéo thả vào đây
              </div>
              <div className={styles.uploadHint}>
                Hỗ trợ: JPG, PNG, GIF (tối đa 10MB mỗi ảnh)
              </div>
            </label>
          </div>

          {/* Default Category Selection */}
          {uploadedFiles.length > 0 && (
            <>
              <div className={styles.bulkActions}>
                <Label className={styles.bulkLabel}>Danh mục mặc định cho ảnh mới</Label>
                <div className={styles.bulkActionsRow}>
                  <Select
                    value={defaultCategory}
                    onValueChange={(value) => setDefaultCategory(value as Exclude<ImageCategory, 'all'>)}
                  >
                    <SelectTrigger id="default-category" className={styles.categorySelect}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {getCategoryLabel(cat)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkUpdateCategory(defaultCategory)}
                    className={`${styles.applyButton} hover:!text-white`}
                  >
                    <Check size={16} />
                    Áp dụng cho tất cả ({uploadedFiles.length})
                  </Button>
                </div>
              </div>

              {/* File List */}
              <div className={styles.fileList}>
                <div className={styles.fileListHeader}>
                  {uploadedFiles.length} ảnh đã chọn
                </div>
                <div className={styles.fileGrid}>
                  {uploadedFiles.map((uploadedFile, index) => (
                    <div key={index} className={styles.fileCard}>
                      <div className={styles.filePreview}>
                        <img
                          src={uploadedFile.preview}
                          alt={uploadedFile.file.name}
                          className={styles.previewImage}
                        />
                        <button
                          type="button"
                          className={styles.removeButton}
                          onClick={() => handleRemoveFile(index)}
                          aria-label="Xóa ảnh"
                        >
                          <X size={14} />
                        </button>
                      </div>
                      <div className={styles.fileInfo}>
                        <div className={styles.fileName} title={uploadedFile.file.name}>
                          {uploadedFile.file.name}
                        </div>
                        <div className={styles.fileSize}>
                          {(uploadedFile.file.size / 1024).toFixed(1)} KB
                        </div>
                        <Select
                          value={uploadedFile.category}
                          onValueChange={(value) =>
                            handleUpdateCategory(index, value as Exclude<ImageCategory, 'all'>)
                          }
                        >
                          <SelectTrigger className={styles.fileCategorySelect}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat} value={cat}>
                                {getCategoryLabel(cat)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Empty State - Only show when no files */}
          {uploadedFiles.length === 0 && (
            <div className={styles.emptyState}>
              <ImageIcon size={40} className={styles.emptyIcon} />
              <p className={styles.emptyText}>Chưa có ảnh nào được chọn</p>
            </div>
          )}
        </div>

        <DialogFooter className={styles.footer}>
          <Button variant="outline" onClick={handleClose} disabled={loading} className='hover:!bg-red-800 hover:!text-white'>
            Hủy
          </Button>
          <Button
            onClick={handleUpload}
            disabled={uploadedFiles.length === 0 || loading}
            className='!text-white'
          >
            {loading ? 'Đang tải lên...' : `Tải lên ${uploadedFiles.length} ảnh`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
