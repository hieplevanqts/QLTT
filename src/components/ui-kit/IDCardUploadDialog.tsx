import React, { useState, useRef, useCallback, useEffect } from 'react';
import { X, Upload, FileText, AlertCircle, CheckCircle2, Loader2, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getDocumentTypeById } from '@/utils/data/documentTypes';
import styles from './IDCardUploadDialog.module.css';

export interface IDCardData {
  frontFile: File | null;
  backFile: File | null;
  frontFileUrl?: string;
  backFileUrl?: string;
  fields: Record<string, any>;
}

interface IDCardUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingData?: {
    frontFileUrl?: string;
    backFileUrl?: string;
    fields?: Record<string, any>;
  };
  editingDocument?: any;
  isSaving?: boolean;
  onSave: (data: IDCardData) => void;
}

export function IDCardUploadDialog({
  open,
  onOpenChange,
  existingData,
  editingDocument,
  isSaving,
  onSave,
}: IDCardUploadDialogProps) {
  const isEditing = !!editingDocument;

  const DEFAULT_CCCD_IMAGE = '/assets/images/cccd-placeholder.png';

  // File states
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [frontFilePreview, setFrontFilePreview] = useState<string | null>(
    existingData?.frontFileUrl || DEFAULT_CCCD_IMAGE
  );
  const [backFilePreview, setBackFilePreview] = useState<string | null>(
    existingData?.backFileUrl || DEFAULT_CCCD_IMAGE
  );

  // Form state
  const [formData, setFormData] = useState<Record<string, any>>(existingData?.fields || {});

  // UI states
  const [frontDragging, setFrontDragging] = useState(false);
  const [backDragging, setBackDragging] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionComplete, setExtractionComplete] = useState(false);
  const [errors, setErrors] = useState<{ front?: string; back?: string; form?: string }>({});

  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  // Get document type config
  const documentType = getDocumentTypeById('cccd');

  // Reset states when dialog opens/closes
  useEffect(() => {
    if (open && editingDocument) {
      // Load existing document data
      const existingFields: Record<string, any> = {};

      if (editingDocument.uploadedData) {
        Object.assign(existingFields, editingDocument.uploadedData);
      }

      // Map common fields
      if (editingDocument.documentNumber) {
        existingFields.idNumber = editingDocument.documentNumber;
      }

      // Convert dates
      const convertDateFormat = (dateStr: string): string => {
        if (!dateStr) return '';
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
        if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateStr)) {
          const [day, month, year] = dateStr.split('/');
          return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }
        return dateStr;
      };

      ['issueDate', 'dateOfBirth'].forEach((field) => {
        if (editingDocument[field]) {
          existingFields[field] = convertDateFormat(editingDocument[field]);
        }
      });

      ['fullName', 'issuePlace', 'issuingAuthority', 'address', 'notes'].forEach((field) => {
        if (editingDocument[field]) {
          existingFields[field] = editingDocument[field];
        }
      });

      setFormData(existingFields);

      // Load file previews
      if (editingDocument.fileUrl) {
        setFrontFilePreview(editingDocument.fileUrl);
      }
      if (editingDocument.backFileUrl) {
        setBackFilePreview(editingDocument.backFileUrl);
      }
    } else if (!open) {
      // Reset all states
      setFormData({});
      setFrontFile(null);
      setBackFile(null);
      setFrontFilePreview(DEFAULT_CCCD_IMAGE);
      setBackFilePreview(DEFAULT_CCCD_IMAGE);
      setErrors({});
      setIsExtracting(false);
      setExtractionComplete(false);
    }
  }, [open, editingDocument]);

  // Mock OCR extraction from both sides
  const mockExtractData = useCallback((_frontFile: File, _backFile?: File): Promise<Record<string, any>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          idNumber: '001234567890',
          fullName: 'Nguyễn Văn A',
          dateOfBirth: '1990-05-15',
          issueDate: '2023-01-10',
          issuePlace: 'Cục Cảnh sát ĐKQL cư trú và DLQG về dân cư',
          address: '123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM',
        });
      }, 1500);
    });
  }, []);

  // Handle file validation
  const validateFile = (file: File): string | null => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];

    if (!allowedTypes.includes(file.type)) {
      return 'Chỉ chấp nhận file JPG, PNG hoặc PDF';
    }

    if (file.size > maxSize) {
      return 'Kích thước file không được vượt quá 10MB';
    }

    return null;
  };

  // Handle front file change
  const handleFrontFileChange = async (file: File) => {
    const error = validateFile(file);
    if (error) {
      setErrors((prev) => ({ ...prev, front: error }));
      return;
    }

    setErrors((prev) => ({ ...prev, front: undefined }));
    setFrontFile(file);

    // Create preview
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFrontFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFrontFilePreview(null);
    }

    // Auto-extract if both files are present
    if (backFile || backFilePreview) {
      setIsExtracting(true);
      try {
        const extractedData = await mockExtractData(file, backFile || undefined);
        setFormData((prev) => ({ ...prev, ...extractedData }));
        setExtractionComplete(true);
        setTimeout(() => setExtractionComplete(false), 3000);
      } catch (err) {
        console.error('Extraction failed:', err);
      } finally {
        setIsExtracting(false);
      }
    }
  };

  // Handle back file change
  const handleBackFileChange = async (file: File) => {
    const error = validateFile(file);
    if (error) {
      setErrors((prev) => ({ ...prev, back: error }));
      return;
    }

    setErrors((prev) => ({ ...prev, back: undefined }));
    setBackFile(file);

    // Create preview
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBackFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setBackFilePreview(null);
    }

    // Auto-extract if both files are present
    if (frontFile || frontFilePreview) {
      setIsExtracting(true);
      try {
        const extractedData = await mockExtractData(frontFile || new File([], 'temp'), file);
        setFormData((prev) => ({ ...prev, ...extractedData }));
        setExtractionComplete(true);
        setTimeout(() => setExtractionComplete(false), 3000);
      } catch (err) {
        console.error('Extraction failed:', err);
      } finally {
        setIsExtracting(false);
      }
    }
  };

  // Drag and drop handlers for front
  const handleFrontDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setFrontDragging(true);
  };

  const handleFrontDragLeave = () => {
    setFrontDragging(false);
  };

  const handleFrontDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setFrontDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFrontFileChange(file);
  };

  // Drag and drop handlers for back
  const handleBackDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setBackDragging(true);
  };

  const handleBackDragLeave = () => {
    setBackDragging(false);
  };

  const handleBackDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setBackDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleBackFileChange(file);
  };

  // Form field change handler
  const handleFieldChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, form: undefined }));
  };

  // Validation before save
  const validateBeforeSave = (): boolean => {
    const newErrors: { front?: string; back?: string; form?: string } = {};

    // Check if both files are present (either new upload or existing)
    if (!frontFile && !frontFilePreview) {
      newErrors.front = 'Vui lòng upload mặt trước CCCD/CMND';
    }

    if (!backFile && !backFilePreview) {
      newErrors.back = 'Vui lòng upload mặt sau CCCD/CMND';
    }

    // Check required fields
    const requiredFields = documentType?.fields.filter((f) => f.required) || [];
    const missingFields = requiredFields.filter((f) => !formData[f.key]);

    if (missingFields.length > 0) {
      newErrors.form = `Vui lòng điền đầy đủ thông tin bắt buộc`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle save
  const handleSave = () => {
    if (!validateBeforeSave()) {
      return;
    }

    onSave({
      frontFile,
      backFile,
      frontFileUrl: frontFilePreview || undefined,
      backFileUrl: backFilePreview || undefined,
      fields: formData,
    });

    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={() => onOpenChange(false)}>
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>
              {isEditing ? 'Cập nhật' : 'Upload'} CCCD / CMND chủ hộ
            </h2>
            <p className={styles.subtitle}>
              Vui lòng upload đầy đủ cả 2 mặt: Mặt trước và Mặt sau
            </p>
          </div>
          <button
            className={styles.closeButton}
            onClick={() => onOpenChange(false)}
            aria-label="Đóng"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {/* Upload Areas - Side by Side */}
          <div className={styles.uploadGrid}>
            {/* Front Side */}
            <div className={styles.uploadColumn}>
              <label className={styles.uploadLabel}>
                Mặt trước <span className={styles.required}>*</span>
              </label>
              <div
                className={`${styles.uploadArea} ${frontDragging ? styles.dragging : ''} ${errors.front ? styles.error : ''
                  }`}
                onDragOver={handleFrontDragOver}
                onDragLeave={handleFrontDragLeave}
                onDrop={handleFrontDrop}
                onClick={() => frontInputRef.current?.click()}
              >
                <input
                  ref={frontInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,application/pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFrontFileChange(file);
                  }}
                  className={styles.fileInput}
                />

                {frontFile || frontFilePreview ? (
                  <div className={styles.filePreview}>
                    {frontFilePreview ? (
                      <img
                        src={frontFilePreview}
                        alt="Mặt trước CCCD"
                        className={styles.previewImage}
                      />
                    ) : (
                      <div className={styles.fileIcon}>
                        <FileText size={48} />
                        <p className={styles.fileName}>{frontFile?.name}</p>
                      </div>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className={styles.changeFileButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        frontInputRef.current?.click();
                      }}
                    >
                      Thay file khác
                    </Button>
                  </div>
                ) : (
                  <div className={styles.uploadPrompt}>
                    <ImageIcon size={48} className={styles.uploadIcon} />
                    <p className={styles.uploadText}>Upload mặt trước</p>
                    <p className={styles.uploadHint}>JPG, PNG, PDF (max 10MB)</p>
                  </div>
                )}
              </div>
              {errors.front && (
                <div className={styles.errorMessage}>
                  <AlertCircle size={14} />
                  {errors.front}
                </div>
              )}
            </div>

            {/* Back Side */}
            <div className={styles.uploadColumn}>
              <label className={styles.uploadLabel}>
                Mặt sau <span className={styles.required}>*</span>
              </label>
              <div
                className={`${styles.uploadArea} ${backDragging ? styles.dragging : ''} ${errors.back ? styles.error : ''
                  }`}
                onDragOver={handleBackDragOver}
                onDragLeave={handleBackDragLeave}
                onDrop={handleBackDrop}
                onClick={() => backInputRef.current?.click()}
              >
                <input
                  ref={backInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,application/pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleBackFileChange(file);
                  }}
                  className={styles.fileInput}
                />

                {backFile || backFilePreview ? (
                  <div className={styles.filePreview}>
                    {backFilePreview ? (
                      <img
                        src={backFilePreview}
                        alt="Mặt sau CCCD"
                        className={styles.previewImage}
                      />
                    ) : (
                      <div className={styles.fileIcon}>
                        <FileText size={48} />
                        <p className={styles.fileName}>{backFile?.name}</p>
                      </div>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className={styles.changeFileButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        backInputRef.current?.click();
                      }}
                    >
                      Thay file khác
                    </Button>
                  </div>
                ) : (
                  <div className={styles.uploadPrompt}>
                    <ImageIcon size={48} className={styles.uploadIcon} />
                    <p className={styles.uploadText}>Upload mặt sau</p>
                    <p className={styles.uploadHint}>JPG, PNG, PDF (max 10MB)</p>
                  </div>
                )}
              </div>
              {errors.back && (
                <div className={styles.errorMessage}>
                  <AlertCircle size={14} />
                  {errors.back}
                </div>
              )}
            </div>
          </div>

          {/* Extraction Status */}
          {isExtracting && (
            <div className={styles.extractionStatus}>
              <Loader2 size={16} className={styles.spinner} />
              <span>Đang trích xuất thông tin từ CCCD/CMND...</span>
            </div>
          )}

          {extractionComplete && (
            <div className={styles.extractionSuccess}>
              <CheckCircle2 size={16} />
              <span>Đã trích xuất thông tin thành công - vui lòng kiểm tra và chỉnh sửa nếu cần</span>
            </div>
          )}

          {/* Form Fields */}
          <div className={styles.formSection}>
            <h3 className={styles.formTitle}>Thông tin CCCD/CMND</h3>
            {errors.form && (
              <div className={styles.formErrorMessage}>
                <AlertCircle size={16} />
                {errors.form}
              </div>
            )}
            <div className={styles.formGrid}>
              {documentType?.fields.map((field) => (
                <div
                  key={field.key}
                  className={field.type === 'textarea' ? styles.formFieldFull : styles.formField}
                >
                  <label className={styles.label}>
                    {field.label}
                    {field.required && <span className={styles.required}>*</span>}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      className={styles.textarea}
                      value={formData[field.key] || ''}
                      onChange={(e) => handleFieldChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      rows={3}
                    />
                  ) : (
                    <input
                      type={field.type}
                      className={styles.input}
                      value={formData[field.key] || ''}
                      onChange={(e) => handleFieldChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button
            onClick={handleSave}
            disabled={
              (!frontFile && !frontFilePreview) ||
              (!backFile && !backFilePreview) ||
              isExtracting ||
              isSaving
            }
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang lưu...
              </>
            ) : (
              isEditing ? 'Cập nhật' : 'Lưu'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

