import React, { useState, useRef } from 'react';
import { Upload, X, FileText, Image as ImageIcon, Video, Check, MapPin, Tag as TagIcon, ChevronRight, ChevronLeft } from 'lucide-react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import styles from './AddEvidenceDialog.module.css';

interface AddEvidenceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const STEPS = [
  { id: 1, title: 'Upload File', icon: Upload },
  { id: 2, title: 'Thông tin', icon: FileText },
  { id: 3, title: 'Xác nhận', icon: Check }
];

export default function AddEvidenceDialog({ open, onOpenChange, onSuccess }: AddEvidenceDialogProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [formData, setFormData] = useState({
    fileName: '',
    fileType: '',
    location: '',
    tags: '',
    description: '',
    status: 'new'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File) => {
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        toast.error('Kích thước file vượt quá 100MB');
        return;
      }

      setSelectedFile(file);
      
      let fileType = '';
      if (file.type.startsWith('image/')) {
        fileType = 'image';
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else if (file.type.startsWith('video/')) {
        fileType = 'video';
        setFilePreview('');
      } else {
        fileType = 'document';
        setFilePreview('');
      }

      setFormData({
        ...formData,
        fileName: file.name,
        fileType: fileType
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileChange(file);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) handleFileChange(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFilePreview('');
    setFormData({ ...formData, fileName: '', fileType: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleNext = () => {
    if (currentStep === 1 && !selectedFile) {
      toast.error('Vui lòng chọn file');
      return;
    }
    if (currentStep === 2) {
      if (!formData.fileName.trim()) {
        toast.error('Vui lòng nhập tên file');
        return;
      }
      if (!formData.fileType) {
        toast.error('Vui lòng chọn loại file');
        return;
      }
    }
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    setTimeout(() => {
      toast.success(`Đã thêm chứng cứ "${formData.fileName}" thành công`);
      
      setSelectedFile(null);
      setFilePreview('');
      setFormData({
        fileName: '',
        fileType: '',
        location: '',
        tags: '',
        description: '',
        status: 'new'
      });
      setCurrentStep(1);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      setIsSubmitting(false);
      onOpenChange(false);
      onSuccess?.();
    }, 1500);
  };

  const getFileIcon = (size: number = 20) => {
    const iconProps = { size };
    switch (formData.fileType) {
      case 'image':
        return <ImageIcon {...iconProps} />;
      case 'video':
        return <Video {...iconProps} />;
      case 'document':
        return <FileText {...iconProps} />;
      default:
        return <FileText {...iconProps} />;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'new':
        return { label: 'Mới', color: '#3b82f6' };
      case 'pending':
        return { label: 'Chờ duyệt', color: '#f59e0b' };
      case 'approved':
        return { label: 'Đã duyệt', color: '#22c55e' };
      case 'flagged':
        return { label: 'Cần chú ý', color: '#ef4444' };
      default:
        return { label: status, color: '#6b7280' };
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={styles.dialogContent}>
        {/* Header with Steps */}
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <h2 className={styles.title}>Thêm chứng cứ mới</h2>
            <button 
              className={styles.closeBtn}
              onClick={() => onOpenChange(false)}
              type="button"
            >
              <X size={20} />
            </button>
          </div>
          <p className={styles.subtitle}>Tải lên file và cung cấp thông tin để lưu trữ chứng cứ vào hệ thống</p>
          
          {/* Steps Indicator */}
          <div className={styles.stepsContainer}>
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <React.Fragment key={step.id}>
                  <div className={`${styles.stepItem} ${isActive ? styles.stepActive : ''} ${isCompleted ? styles.stepCompleted : ''}`}>
                    <div className={styles.stepIconWrapper}>
                      {isCompleted ? (
                        <Check size={20} />
                      ) : (
                        <Icon size={20} />
                      )}
                    </div>
                    <div className={styles.stepText}>
                      <span className={styles.stepNumber}>Bước {step.id}</span>
                      <span className={styles.stepTitle}>{step.title}</span>
                    </div>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className={`${styles.stepConnector} ${isCompleted ? styles.stepConnectorCompleted : ''}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {/* Step 1: Upload */}
          {currentStep === 1 && (
            <div className={styles.stepContent}>
              {!selectedFile ? (
                <div
                  className={`${styles.uploadZone} ${isDragging ? styles.uploadZoneActive : ''}`}
                  onDragEnter={handleDragEnter}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*,.pdf,.doc,.docx"
                    onChange={handleInputChange}
                    className={styles.fileInput}
                  />
                  
                  <div className={styles.uploadIcon}>
                    <Upload size={48} />
                  </div>
                  
                  <h3 className={styles.uploadTitle}>
                    {isDragging ? 'Thả file vào đây' : 'Kéo thả file hoặc nhấp để chọn'}
                  </h3>
                  
                  <p className={styles.uploadSubtitle}>
                    Hỗ trợ: JPG, PNG, MP4, PDF, DOCX • Tối đa 100MB
                  </p>
                </div>
              ) : (
                <div className={styles.uploadedFile}>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className={styles.removeFileBtn}
                  >
                    <X size={20} />
                  </button>
                  
                  {filePreview ? (
                    <div className={styles.filePreview}>
                      <img src={filePreview} alt="Preview" className={styles.previewImage} />
                    </div>
                  ) : (
                    <div className={styles.filePlaceholder}>
                      {getFileIcon(64)}
                    </div>
                  )}
                  
                  <div className={styles.fileDetails}>
                    <div className={styles.fileDetailItem}>
                      <span className={styles.fileLabel}>Tên file</span>
                      <span className={styles.fileValue}>{selectedFile.name}</span>
                    </div>
                    <div className={styles.fileDetailItem}>
                      <span className={styles.fileLabel}>Kích thước</span>
                      <span className={styles.fileValue}>{formatFileSize(selectedFile.size)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Information */}
          {currentStep === 2 && (
            <div className={styles.stepContent}>
              <div className={styles.formFields}>
                <div className={styles.formRow}>
                  <div className={styles.formField}>
                    <Label htmlFor="fileName" className={styles.formLabel}>
                      Tên file <span className={styles.required}>*</span>
                    </Label>
                    <Input
                      id="fileName"
                      value={formData.fileName}
                      onChange={(e) => setFormData({ ...formData, fileName: e.target.value })}
                      placeholder="VD: vi_pham_ve_sinh_thuc_pham_Q1.jpg"
                      className={styles.formInput}
                    />
                  </div>

                  <div className={styles.formField}>
                    <Label htmlFor="fileType" className={styles.formLabel}>
                      Loại file <span className={styles.required}>*</span>
                    </Label>
                    <Select
                      value={formData.fileType}
                      onValueChange={(value) => setFormData({ ...formData, fileType: value })}
                    >
                      <SelectTrigger id="fileType" className={styles.formInput}>
                        <SelectValue placeholder="Chọn loại file" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="image">Hình ảnh</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="document">Tài liệu</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formField}>
                    <Label htmlFor="location" className={styles.formLabel}>
                      Vị trí thu thập
                    </Label>
                    <div className={styles.inputWithIcon}>
                      <MapPin size={18} className={styles.inputIcon} />
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="VD: Hà Nội, Quận Ba Đình"
                        className={styles.formInput}
                      />
                    </div>
                  </div>

                  <div className={styles.formField}>
                    <Label htmlFor="status" className={styles.formLabel}>
                      Trạng thái ban đầu
                    </Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData({ ...formData, status: value })}
                    >
                      <SelectTrigger id="status" className={styles.formInput}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {['new', 'pending', 'approved', 'flagged'].map((status) => {
                          const config = getStatusConfig(status);
                          return (
                            <SelectItem key={status} value={status}>
                              <div className={styles.statusOption}>
                                <div className={styles.statusDot} style={{ background: config.color }} />
                                <span>{config.label}</span>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className={styles.formField}>
                  <Label htmlFor="tags" className={styles.formLabel}>
                    Tags phân loại
                  </Label>
                  <div className={styles.inputWithIcon}>
                    <TagIcon size={18} className={styles.inputIcon} />
                    <Input
                      id="tags"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      placeholder="VD: vi phạm, kiểm tra, khẩn cấp (phân cách bằng dấu phẩy)"
                      className={styles.formInput}
                    />
                  </div>
                </div>

                <div className={styles.formField}>
                  <Label htmlFor="description" className={styles.formLabel}>
                    Mô tả chi tiết
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Mô tả chi tiết về chứng cứ: nội dung, ngày thu thập, người thu thập..."
                    rows={4}
                    className={styles.formTextarea}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {currentStep === 3 && (
            <div className={styles.stepContent}>
              <div className={styles.confirmationCard}>
                <div className={styles.confirmationHeader}>
                  <Check size={48} className={styles.confirmIcon} />
                  <h3 className={styles.confirmTitle}>Xác nhận thông tin</h3>
                  <p className={styles.confirmSubtitle}>Vui lòng kiểm tra lại thông tin trước khi thêm</p>
                </div>

                <div className={styles.confirmContent}>
                  <div className={styles.confirmSection}>
                    <h4 className={styles.confirmSectionTitle}>File đã chọn</h4>
                    <div className={styles.confirmFile}>
                      {filePreview ? (
                        <img src={filePreview} alt="Preview" className={styles.confirmPreview} />
                      ) : (
                        <div className={styles.confirmFilePlaceholder}>
                          {getFileIcon(32)}
                        </div>
                      )}
                      <div className={styles.confirmFileInfo}>
                        <p className={styles.confirmFileName}>{selectedFile?.name}</p>
                        <p className={styles.confirmFileSize}>{selectedFile && formatFileSize(selectedFile.size)}</p>
                      </div>
                    </div>
                  </div>

                  <div className={styles.confirmSection}>
                    <h4 className={styles.confirmSectionTitle}>Thông tin chứng cứ</h4>
                    <div className={styles.confirmInfo}>
                      <div className={styles.confirmInfoRow}>
                        <span className={styles.confirmLabel}>Tên file:</span>
                        <span className={styles.confirmValue}>{formData.fileName}</span>
                      </div>
                      <div className={styles.confirmInfoRow}>
                        <span className={styles.confirmLabel}>Loại file:</span>
                        <span className={styles.confirmValue}>
                          {formData.fileType === 'image' ? 'Hình ảnh' : 
                           formData.fileType === 'video' ? 'Video' : 'Tài liệu'}
                        </span>
                      </div>
                      {formData.location && (
                        <div className={styles.confirmInfoRow}>
                          <span className={styles.confirmLabel}>Vị trí:</span>
                          <span className={styles.confirmValue}>{formData.location}</span>
                        </div>
                      )}
                      <div className={styles.confirmInfoRow}>
                        <span className={styles.confirmLabel}>Trạng thái:</span>
                        <span className={styles.confirmValue}>{getStatusConfig(formData.status).label}</span>
                      </div>
                      {formData.tags && (
                        <div className={styles.confirmInfoRow}>
                          <span className={styles.confirmLabel}>Tags:</span>
                          <span className={styles.confirmValue}>{formData.tags}</span>
                        </div>
                      )}
                      {formData.description && (
                        <div className={styles.confirmInfoRow}>
                          <span className={styles.confirmLabel}>Mô tả:</span>
                          <span className={styles.confirmValue}>{formData.description}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <Button
            type="button"
            variant="outline"
            onClick={currentStep === 1 ? () => onOpenChange(false) : handleBack}
            disabled={isSubmitting}
            className={styles.btnSecondary}
          >
            {currentStep === 1 ? (
              <>
                <X size={18} />
                <span>Hủy</span>
              </>
            ) : (
              <>
                <ChevronLeft size={18} />
                <span>Quay lại</span>
              </>
            )}
          </Button>

          {currentStep < 3 ? (
            <Button
              type="button"
              onClick={handleNext}
              className={styles.btnPrimary}
            >
              <span>Tiếp theo</span>
              <ChevronRight size={18} />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={styles.btnPrimary}
            >
              {isSubmitting ? (
                <>
                  <div className={styles.spinner} />
                  <span>Đang xử lý...</span>
                </>
              ) : (
                <>
                  <Check size={18} />
                  <span>Xác nhận thêm</span>
                </>
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
