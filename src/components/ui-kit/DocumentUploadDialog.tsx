import React, { useState, useRef, useCallback, useEffect } from 'react';
import { X, Upload, FileText, AlertCircle, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { getDocumentTypeById } from '@/utils/data/documentTypes';
import { extractDocumentData } from '@/utils/api/ocrApi';
import { 
  validateRequiredFields, 
  validateFieldTypes, 
  sanitizeLicenseData,
  getFieldLabel,
  DOCUMENT_TYPE_TO_KEY
} from '@/utils/licenseHelper';
import styles from './DocumentUploadDialog.module.css';

export interface DocumentField {
  key: string;
  label: string;
  type: 'text' | 'date' | 'number' | 'textarea';
  required?: boolean;
  placeholder?: string;
}

export interface DocumentType {
  id: string;
  name: string;
  description: string;
  fields: DocumentField[];
  acceptedFormats: string[];
  maxSizeMB: number;
}

interface DocumentUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentType: string | null;
  existingData?: Record<string, any>;
  existingFileUrl?: string;
  editingDocument?: any;
  isSaving?: boolean;
  onSave: (data: { file: File | null; fields: Record<string, any> }) => void;
}

export function DocumentUploadDialog({
  open,
  onOpenChange,
  documentType: documentTypeId,
  existingData,
  existingFileUrl,
  editingDocument,
  isSaving,
  onSave,
}: DocumentUploadDialogProps) {
  // Get document type config
  const documentType = documentTypeId ? getDocumentTypeById(documentTypeId) : null;
  const isEditing = !!editingDocument;

  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(existingFileUrl || null);
  const [formData, setFormData] = useState<Record<string, any>>(existingData || {});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isDragging, setIsDragging] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionComplete, setExtractionComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastExtractedFile, setLastExtractedFile] = useState<File | string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load editing document data when dialog opens
  useEffect(() => {
    if (open && editingDocument) {
      // Pre-fill form with existing document data
      const existingFields: Record<string, any> = {};

      // Extract all uploaded data fields and map snake_case to camelCase where needed
      if (editingDocument.uploadedData) {
        Object.assign(existingFields, editingDocument.uploadedData);

        // Explicit mapping for GPKD specialized fields
        if (editingDocument.uploadedData.business_name) existingFields.businessName = editingDocument.uploadedData.business_name;
        if (editingDocument.uploadedData.owner_name) existingFields.ownerName = editingDocument.uploadedData.owner_name;
        if (editingDocument.uploadedData.business_field) existingFields.businessScope = editingDocument.uploadedData.business_field;
        if (editingDocument.uploadedData.permanent_address) existingFields.address = editingDocument.uploadedData.permanent_address;

        // Parse notes JSON if present
        if (typeof editingDocument.uploadedData.notes === 'string') {
          try {
            const parsed = JSON.parse(editingDocument.uploadedData.notes);
            const notesFields = parsed?.fields || parsed;
            if (notesFields && typeof notesFields === 'object') {
              Object.assign(existingFields, notesFields);
            }
          } catch {
            // ignore non-JSON notes
          }
        }
      }

      // Map top-level fields to form field keys
      // Handle documentNumber -> licenseNumber/certificateNumber mapping
      if (editingDocument.documentNumber) {
        // Check which field key this document type uses
        const firstField = documentType?.fields[0];
        if (firstField?.key === 'licenseNumber' || firstField?.key === 'certificateNumber') {
          existingFields[firstField.key] = editingDocument.documentNumber;
        } else if (firstField?.key === 'idNumber') {
          existingFields.idNumber = editingDocument.documentNumber;
        } else if (firstField?.key === 'contractNumber') {
          existingFields.contractNumber = editingDocument.documentNumber;
        }
      }

      // Helper function to convert dd/mm/yyyy to yyyy-mm-dd for HTML date input
      const convertDateFormat = (dateStr: string): string => {
        if (!dateStr) return '';
        // Check if already in yyyy-mm-dd format
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
        // Convert dd/mm/yyyy to yyyy-mm-dd
        if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateStr)) {
          const [day, month, year] = dateStr.split('/');
          return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }
        return dateStr;
      };

      // Map common top-level fields with date conversion
      const dateFields = ['issueDate', 'expiryDate', 'dateOfBirth', 'startDate', 'endDate'];
      dateFields.forEach(field => {
        if (editingDocument[field]) {
          existingFields[field] = convertDateFormat(editingDocument[field]);
        }
      });

      // Map other common fields
      const commonFields = ['issuingAuthority', 'notes'];
      commonFields.forEach(field => {
        if (editingDocument[field]) {
          existingFields[field] = editingDocument[field];
        }
      });

      // Map other possible fields based on document type
      const allPossibleFields = [
        'fullName', 'issuePlace', 'address',
        'businessScope', 'scope',
        'businessName', 'ownerName',
        'lessor', 'lessee', 'monthlyRent',
        'inspectionResult'
      ];
      allPossibleFields.forEach(field => {
        if (editingDocument[field]) {
          existingFields[field] = editingDocument[field];
        }
      });

      setFormData(existingFields);

      // Set existing file preview if available
      if (editingDocument.fileUrl) {
        setFilePreview(editingDocument.fileUrl);
      }
    } else if (!open) {
      // Reset when dialog closes
      setFormData({});
      setFile(null);
      setFilePreview(null);
      setError(null);
      setIsExtracting(false);
      setExtractionComplete(false);
    }
  }, [open, editingDocument, documentType]);

  // Real OCR Integration
  const handleExtractData = async (fileToExtract: File | null) => {
    if (!fileToExtract) {
      toast.error('Vui lòng upload ảnh giấy phép kinh doanh trước khi trích xuất');
      return;
    }

    if (!documentType?.id) return;

    // Avoid redundant calls if the file hasn't changed
    if ((fileToExtract === lastExtractedFile) && extractionComplete) {
      toast.info('Thông tin đã được trích xuất cho ảnh này');
      return;
    }

    setIsExtracting(true);
    setExtractionComplete(false);

    try {
      const result = await extractDocumentData(fileToExtract, documentType.id);

      if (result.success && result.data) {
        // Map data: Merge and overwrite existing fields to align with CCCD logic
        setFormData((prev) => ({ ...prev, ...result.data }));
        setExtractionComplete(true);
        setLastExtractedFile(fileToExtract);
        toast.success(result.message || 'Đã trích xuất thông tin thành công');
      } else {
        toast.error(result.message || 'Không thể trích xuất thông tin từ giấy phép. Vui lòng kiểm tra ảnh rõ nét và thử lại.');
      }
    } catch (err) {
      console.error('Error invoking OCR API:', err);
      toast.error('Không thể kết nối đến dịch vụ trích xuất. Vui lòng thử lại sau.');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleFileChange = async (selectedFile: File) => {
    setError(null);

    // Validate file type
    const fileExtension = '.' + selectedFile.name.split('.').pop()?.toLowerCase();
    if (!documentType?.acceptedFormats.includes(fileExtension)) {
      setError(`Định dạng file không hợp lệ. Chỉ chấp nhận: ${documentType?.acceptedFormats.join(', ')}`);
      return;
    }

    // Validate file size
    const fileSizeMB = selectedFile.size / (1024 * 1024);
    if (fileSizeMB > documentType?.maxSizeMB) {
      setError(`Kích thước file vượt quá ${documentType?.maxSizeMB}MB`);
      return;
    }

    setFile(selectedFile);

    // Create preview
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setFilePreview(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileChange(droppedFile);
    }
  };

  const handleFieldChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    // Clear error for this field when user starts typing
    if (fieldErrors[key]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  const handleSave = () => {
    // Determine the license type key for validation
    const typeKey = DOCUMENT_TYPE_TO_KEY[documentType?.id || ''];
    
    // 1. Validate required fields using type-specific validation
    const missingFields = validateRequiredFields(typeKey, formData);
    if (missingFields.length > 0) {
      const missingLabels = missingFields.map(field => getFieldLabel(field));
      toast.error(`Thiếu thông tin bắt buộc: ${missingLabels.join(', ')}`);
      
      // Set field errors for UI highlighting
      const newErrors: Record<string, string> = {};
      documentType?.fields.forEach((field) => {
        if (!formData[field.key]) {
          newErrors[field.key] = `${field.label} là bắt buộc`;
        }
      });
      setFieldErrors(newErrors);
      return;
    }

    // 2. Validate field data types (dates, numbers)
    const typeValidation = validateFieldTypes(typeKey, formData);
    if (!typeValidation.isValid && typeValidation.errors) {
      toast.error(`Lỗi định dạng: ${typeValidation.errors.join('; ')}`);
      return;
    }

    // 3. Sanitize data before sending
    const sanitizedFormData = sanitizeLicenseData(typeKey, formData);

    onSave({ file, fields: sanitizedFormData });
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
              {isEditing ? 'Chỉnh sửa' : 'Tải lên'} {documentType?.name}
            </h2>
            <p className={styles.description}>{documentType?.description}</p>
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
          {/* Upload Area */}
          <div className={styles.uploadSection}>
            <div
              className={`${styles.uploadArea} ${isDragging ? styles.dragging : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept={documentType?.acceptedFormats.join(',')}
                onChange={(e) => {
                  const selectedFile = e.target.files?.[0];
                  if (selectedFile) handleFileChange(selectedFile);
                }}
                className={styles.fileInput}
              />

              {file || filePreview ? (
                <div className={styles.filePreview}>
                  {filePreview ? (
                    <img src={filePreview} alt="Preview" className={styles.previewImage} />
                  ) : (
                    <div className={styles.fileIcon}>
                      <FileText size={48} />
                      <p className={styles.fileName}>{file?.name}</p>
                    </div>
                  )}
                  <div className={styles.previewActions}>
                    <Button
                      variant="outline"
                      size="sm"
                      className={styles.changeFileButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                    >
                      Thay file khác
                    </Button>
                    <Button
                      variant="default" // Primary style
                      size="sm"
                      className={styles.extractButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExtractData(file);
                      }}
                      disabled={isExtracting || (!file && !filePreview)}
                    >
                      {isExtracting ? (
                        <>
                          <Loader2 size={14} className="animate-spin mr-1" />
                          <span>Đang trích xuất...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles size={14} className="mr-1" />
                          <span>Trích xuất AI</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className={styles.uploadPrompt}>
                  <Upload size={48} className={styles.uploadIcon} />
                  <p className={styles.uploadText}>
                    Kéo thả file vào đây hoặc click để chọn
                  </p>
                  <p className={styles.uploadHint}>
                    Hỗ trợ: {documentType?.acceptedFormats.join(', ')} (tối đa {documentType?.maxSizeMB}MB)
                  </p>
                </div>
              )}
            </div>

            {error && (
              <div className={styles.errorMessage}>
                <AlertCircle size={16} />
                {error}
              </div>
            )}
          </div>

          {/* Extraction Status */}
          {isExtracting && (
            <div className={styles.extractionStatus}>
              <Loader2 size={16} className={styles.spinner} />
              <span>Đang trích xuất thông tin giấy phép kinh doanh...</span>
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
            <h3 className={styles.formTitle}>Thông tin giấy tờ</h3>
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
                    <>
                      <textarea
                        className={`${styles.textarea} ${fieldErrors[field.key] ? 'border-red-500' : ''}`}
                        value={formData[field.key] || ''}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        rows={3}
                      />
                      {fieldErrors[field.key] && (
                        <p className="text-sm text-red-500 mt-1">{fieldErrors[field.key]}</p>
                      )}
                    </>
                  ) : (
                    <>
                      <input
                        type={field.type}
                        className={`${styles.input} ${fieldErrors[field.key] ? 'border-red-500' : ''}`}
                        value={formData[field.key] || ''}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                      />
                      {fieldErrors[field.key] && (
                        <p className="text-sm text-red-500 mt-1">{fieldErrors[field.key]}</p>
                      )}
                    </>
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
          <Button onClick={handleSave} disabled={isSaving}>
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
