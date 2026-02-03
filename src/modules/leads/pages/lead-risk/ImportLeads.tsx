import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  FileText,
  CheckCircle,
  AlertTriangle,
  Download,
  X,
  ArrowRight,
  Info,
  FileSpreadsheet,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import styles from './ImportLeads.module.css';

type ImportStep = 'upload' | 'mapping' | 'validation' | 'staging';

interface ColumnMapping {
  sourceColumn: string;
  targetField: string;
  required: boolean;
}

interface ValidationResult {
  totalRows: number;
  validRows: number;
  errorRows: number;
  warnings: number;
  errors: Array<{
    row: number;
    column: string;
    message: string;
    severity: 'error' | 'warning';
  }>;
}

export default function ImportLeads() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<ImportStep>('upload');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Mock data for column mapping
  const [columnMappings, setColumnMappings] = useState<ColumnMapping[]>([
    { sourceColumn: 'Tiêu đề', targetField: 'title', required: true },
    { sourceColumn: 'Mô tả', targetField: 'description', required: true },
    { sourceColumn: 'Địa chỉ', targetField: 'address', required: true },
    { sourceColumn: 'Phường', targetField: 'district', required: true },
    { sourceColumn: 'Loại vi phạm', targetField: 'violation_type', required: true },
    { sourceColumn: 'Nguồn', targetField: 'source', required: false },
    { sourceColumn: 'Độ khẩn', targetField: 'urgency', required: false },
  ]);

  // Mock validation results
  const [validationResult, setValidationResult] = useState<ValidationResult>({
    totalRows: 150,
    validRows: 142,
    errorRows: 5,
    warnings: 3,
    errors: [
      {
        row: 12,
        column: 'address',
        message: 'Địa chỉ không hợp lệ hoặc thiếu',
        severity: 'error',
      },
      {
        row: 25,
        column: 'district',
        message: 'Phường không tồn tại trong hệ thống',
        severity: 'error',
      },
      {
        row: 48,
        column: 'urgency',
        message: 'Giá trị urgency không đúng định dạng (chỉ nhận: low, medium, high, critical)',
        severity: 'error',
      },
      {
        row: 67,
        column: 'source',
        message: 'Nguồn tin không có trong danh sách',
        severity: 'warning',
      },
      {
        row: 89,
        column: 'title',
        message: 'Tiêu đề quá ngắn (< 10 ký tự)',
        severity: 'warning',
      },
    ],
  });

  const targetFields = [
    { value: 'title', label: 'Tiêu đề *', required: true },
    { value: 'description', label: 'Mô tả *', required: true },
    { value: 'address', label: 'Địa chỉ *', required: true },
    { value: 'district', label: 'Phường/Xã *', required: true },
    { value: 'violation_type', label: 'Loại vi phạm *', required: true },
    { value: 'source', label: 'Nguồn tin', required: false },
    { value: 'urgency', label: 'Độ khẩn', required: false },
    { value: 'confidence', label: 'Độ tin cậy', required: false },
    { value: 'reporter_name', label: 'Người báo cáo', required: false },
    { value: 'reporter_phone', label: 'SĐT người báo', required: false },
  ];

  const handleFileSelect = (file: File) => {
    if (!file.name.match(/\.(xlsx|xls|csv)$/i)) {
      toast.error('Chỉ hỗ trợ file Excel (.xlsx, .xls) hoặc CSV');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Kích thước file không được vượt quá 10MB');
      return;
    }

    setUploadedFile(file);
    toast.success('Đã tải lên file thành công');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleNextStep = () => {
    if (currentStep === 'upload') {
      if (!uploadedFile) {
        toast.error('Vui lòng tải lên file trước');
        return;
      }
      setCurrentStep('mapping');
    } else if (currentStep === 'mapping') {
      setCurrentStep('validation');
    } else if (currentStep === 'validation') {
      if (validationResult.errorRows > 0) {
        if (confirm('Có lỗi trong dữ liệu. Bạn có muốn chuyển sang màn sửa lỗi?')) {
          navigate('/lead-risk/import-review');
        }
      } else {
        setCurrentStep('staging');
      }
    }
  };

  const handleMappingChange = (sourceColumn: string, targetField: string) => {
    setColumnMappings(
      columnMappings.map((m) =>
        m.sourceColumn === sourceColumn ? { ...m, targetField } : m
      )
    );
  };

  const handleCommitImport = () => {
    toast.success(
      `Đang nhập ${validationResult.validRows} leads vào hệ thống...`,
      { duration: 3000 }
    );
    setTimeout(() => {
      toast.success('Đã nhập thành công!');
      navigate('/lead-risk/inbox');
    }, 2000);
  };

  const downloadTemplate = () => {
    toast.info('Đang tải template...');
    // In real app: trigger download
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <h1 className={styles.title}>Nhập Lead hàng loạt</h1>
          <p className={styles.subtitle}>Upload và import dữ liệu từ file Excel/CSV</p>
        </div>

        <button className={styles.templateButton} onClick={downloadTemplate}>
          <Download size={16} />
          Tải template
        </button>
      </div>

      {/* Steps */}
      <div className={styles.steps}>
        <div className={`${styles.step} ${currentStep === 'upload' ? styles.stepActive : ''} ${uploadedFile ? styles.stepCompleted : ''}`}>
          <div className={styles.stepNumber}>
            {uploadedFile ? <CheckCircle size={20} /> : '1'}
          </div>
          <div className={styles.stepLabel}>Upload File</div>
        </div>

        <div className={styles.stepConnector}></div>

        <div
          className={`${styles.step} ${currentStep === 'mapping' ? styles.stepActive : ''} ${
            currentStep === 'validation' || currentStep === 'staging' ? styles.stepCompleted : ''
          }`}
        >
          <div className={styles.stepNumber}>
            {currentStep === 'validation' || currentStep === 'staging' ? (
              <CheckCircle size={20} />
            ) : (
              '2'
            )}
          </div>
          <div className={styles.stepLabel}>Mapping cột</div>
        </div>

        <div className={styles.stepConnector}></div>

        <div
          className={`${styles.step} ${currentStep === 'validation' ? styles.stepActive : ''} ${
            currentStep === 'staging' ? styles.stepCompleted : ''
          }`}
        >
          <div className={styles.stepNumber}>
            {currentStep === 'staging' ? <CheckCircle size={20} /> : '3'}
          </div>
          <div className={styles.stepLabel}>Kiểm tra</div>
        </div>

        <div className={styles.stepConnector}></div>

        <div className={`${styles.step} ${currentStep === 'staging' ? styles.stepActive : ''}`}>
          <div className={styles.stepNumber}>4</div>
          <div className={styles.stepLabel}>Xác nhận & Import</div>
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {/* Step 1: Upload */}
        {currentStep === 'upload' && (
          <div className={styles.uploadStep}>
            <div className={styles.infoBox}>
              <Info size={16} />
              <div>
                <div className={styles.infoTitle}>Hướng dẫn:</div>
                <ul className={styles.infoList}>
                  <li>Hỗ trợ file Excel (.xlsx, .xls) hoặc CSV</li>
                  <li>Kích thước tối đa: 10MB (~ 10,000 dòng)</li>
                  <li>Dòng đầu tiên phải là tên cột</li>
                  <li>Tải template mẫu để đảm bảo đúng định dạng</li>
                </ul>
              </div>
            </div>

            <div
              className={`${styles.dropZone} ${isDragging ? styles.dropZoneDragging : ''} ${
                uploadedFile ? styles.dropZoneUploaded : ''
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              {!uploadedFile ? (
                <>
                  <Upload size={48} />
                  <h3>Kéo thả file vào đây</h3>
                  <p>hoặc</p>
                  <label className={styles.browseButton}>
                    Chọn file từ máy
                    <input
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      onChange={handleFileInputChange}
                      style={{ display: 'none' }}
                    />
                  </label>
                </>
              ) : (
                <div className={styles.uploadedFile}>
                  <FileSpreadsheet size={48} />
                  <div className={styles.fileInfo}>
                    <div className={styles.fileName}>{uploadedFile.name}</div>
                    <div className={styles.fileSize}>
                      {(uploadedFile.size / 1024).toFixed(2)} KB
                    </div>
                  </div>
                  <button
                    className={styles.removeFileButton}
                    onClick={() => setUploadedFile(null)}
                  >
                    <X size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Column Mapping */}
        {currentStep === 'mapping' && (
          <div className={styles.mappingStep}>
            <div className={styles.infoBox}>
              <Info size={16} />
              <span>
                Ánh xạ các cột trong file Excel sang các trường trong hệ thống. Các trường có dấu
                * là bắt buộc.
              </span>
            </div>

            <div className={styles.mappingTable}>
              <div className={styles.mappingHeader}>
                <div className={styles.mappingCol}>Cột trong file</div>
                <div className={styles.mappingCol}>→</div>
                <div className={styles.mappingCol}>Trường hệ thống</div>
              </div>

              {columnMappings.map((mapping, index) => (
                <div key={index} className={styles.mappingRow}>
                  <div className={styles.sourceColumn}>
                    <FileText size={16} />
                    {mapping.sourceColumn}
                  </div>

                  <div className={styles.arrow}>
                    <ArrowRight size={16} />
                  </div>

                  <div className={styles.targetColumn}>
                    <select
                      value={mapping.targetField}
                      onChange={(e) => handleMappingChange(mapping.sourceColumn, e.target.value)}
                      className={styles.select}
                    >
                      <option value="">-- Chọn trường --</option>
                      {targetFields.map((field) => (
                        <option key={field.value} value={field.value}>
                          {field.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Validation */}
        {currentStep === 'validation' && (
          <div className={styles.validationStep}>
            <div className={styles.validationSummary}>
              <div className={styles.summaryCard}>
                <div className={styles.summaryIcon}>
                  <FileText size={32} />
                </div>
                <div className={styles.summaryContent}>
                  <div className={styles.summaryValue}>{validationResult.totalRows}</div>
                  <div className={styles.summaryLabel}>Tổng số dòng</div>
                </div>
              </div>

              <div className={`${styles.summaryCard} ${styles.summaryCardSuccess}`}>
                <div className={styles.summaryIcon}>
                  <CheckCircle size={32} />
                </div>
                <div className={styles.summaryContent}>
                  <div className={styles.summaryValue}>{validationResult.validRows}</div>
                  <div className={styles.summaryLabel}>Hợp lệ</div>
                </div>
              </div>

              <div className={`${styles.summaryCard} ${styles.summaryCardError}`}>
                <div className={styles.summaryIcon}>
                  <AlertCircle size={32} />
                </div>
                <div className={styles.summaryContent}>
                  <div className={styles.summaryValue}>{validationResult.errorRows}</div>
                  <div className={styles.summaryLabel}>Lỗi</div>
                </div>
              </div>

              <div className={`${styles.summaryCard} ${styles.summaryCardWarning}`}>
                <div className={styles.summaryIcon}>
                  <AlertTriangle size={32} />
                </div>
                <div className={styles.summaryContent}>
                  <div className={styles.summaryValue}>{validationResult.warnings}</div>
                  <div className={styles.summaryLabel}>Cảnh báo</div>
                </div>
              </div>
            </div>

            {validationResult.errors.length > 0 && (
              <div className={styles.errorsSection}>
                <h3 className={styles.sectionTitle}>Chi tiết lỗi & cảnh báo</h3>

                <div className={styles.errorsList}>
                  {validationResult.errors.map((error, index) => (
                    <div
                      key={index}
                      className={`${styles.errorItem} ${
                        error.severity === 'error' ? styles.errorItemError : styles.errorItemWarning
                      }`}
                    >
                      <div className={styles.errorIcon}>
                        {error.severity === 'error' ? (
                          <AlertCircle size={20} />
                        ) : (
                          <AlertTriangle size={20} />
                        )}
                      </div>
                      <div className={styles.errorContent}>
                        <div className={styles.errorRow}>Dòng {error.row}</div>
                        <div className={styles.errorColumn}>Cột: {error.column}</div>
                        <div className={styles.errorMessage}>{error.message}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {validationResult.errorRows > 0 && (
                  <button
                    className={styles.fixErrorsButton}
                    onClick={() => navigate('/lead-risk/import-review')}
                  >
                    Chuyển sang màn sửa lỗi
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Step 4: Staging */}
        {currentStep === 'staging' && (
          <div className={styles.stagingStep}>
            <div className={styles.successBox}>
              <CheckCircle size={48} />
              <h2>Dữ liệu đã sẵn sàng!</h2>
              <p>
                {validationResult.validRows} leads hợp lệ sẽ được import vào hệ thống
              </p>
            </div>

            <div className={styles.stagingInfo}>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>File:</span>
                <span className={styles.infoValue}>{uploadedFile?.name}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Tổng số dòng:</span>
                <span className={styles.infoValue}>{validationResult.totalRows}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Dòng hợp lệ:</span>
                <span className={styles.infoValue}>{validationResult.validRows}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Dòng lỗi:</span>
                <span className={styles.infoValue}>{validationResult.errorRows}</span>
              </div>
            </div>

            <div className={styles.warningBox}>
              <AlertTriangle size={20} />
              <span>
                Sau khi nhấn "Xác nhận Import", dữ liệu sẽ được thêm vào hệ thống và không thể
                hoàn tác.
              </span>
            </div>

            <button className={styles.commitButton} onClick={handleCommitImport}>
              <CheckCircle size={16} />
              Xác nhận Import
            </button>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      {currentStep !== 'staging' && (
        <div className={styles.footer}>
          <button
            className={styles.cancelButton}
            onClick={() => navigate('/lead-risk/inbox')}
          >
            Hủy
          </button>

          <button className={styles.nextButton} onClick={handleNextStep}>
            {currentStep === 'validation' ? 'Tiếp tục' : 'Tiếp theo'}
            <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
