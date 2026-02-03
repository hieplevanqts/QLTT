import { useState } from 'react';
import { X, Download, FileSpreadsheet, FileText, AlertCircle, CheckCircle2, Table } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import styles from '../DynamicReports.module.css';

interface ExportReportModalProps {
  onClose: () => void;
  onExport: (format: 'excel' | 'pdf', filename: string) => void;
  dataset?: string;
  columnsCount?: number;
  rowsCount?: number;
  hasResults?: boolean;
}

export default function ExportReportModal({ 
  onClose, 
  onExport,
  dataset,
  columnsCount = 0,
  rowsCount = 0,
  hasResults = false
}: ExportReportModalProps) {
  const [format, setFormat] = useState<'excel' | 'pdf'>('excel');
  const [filename, setFilename] = useState(`bao-cao-${new Date().toISOString().split('T')[0]}`);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!filename.trim()) {
      toast.error('Vui lòng nhập tên file');
      return;
    }

    if (!hasResults) {
      toast.error('Vui lòng chạy báo cáo trước khi xuất');
      return;
    }

    setIsExporting(true);
    
    // Simulate async export
    setTimeout(() => {
      onExport(format, filename.trim());
      setIsExporting(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleExport();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.modalHeaderIcon}>
            <Download className="w-5 h-5" />
          </div>
          <div className={styles.modalHeaderText}>
            <h2 className={styles.modalTitle}>Xuất báo cáo</h2>
            <p className={styles.modalSubtitle}>
              Tải xuống báo cáo dưới định dạng Excel hoặc PDF
            </p>
          </div>
          <button className={styles.modalCloseBtn} onClick={onClose} disabled={isExporting}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className={styles.modalBody}>
          {/* Results Check */}
          {!hasResults ? (
            <div className={styles.alertWarning}>
              <AlertCircle className="w-5 h-5" />
              <div className={styles.alertContent}>
                <strong>Chưa có dữ liệu:</strong> Vui lòng chạy báo cáo trước khi xuất file.
              </div>
            </div>
          ) : (
            <>
              {/* Data Summary */}
              {dataset && (
                <div className={styles.infoCard}>
                  <div className={styles.infoCardHeader}>
                    <Table className="w-4 h-4" />
                    <span>Dữ liệu sẽ xuất</span>
                  </div>
                  <div className={styles.infoCardContent}>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Nguồn dữ liệu:</span>
                      <span className={styles.infoValue}>{dataset}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Số cột:</span>
                      <span className={styles.infoValue}>{columnsCount} cột</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Số bản ghi:</span>
                      <span className={styles.infoValue}>{rowsCount} bản ghi</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Format Selection */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Định dạng file <span className={styles.required}>*</span>
                </label>
                <div className={styles.radioGroup}>
                  <label className={`${styles.radioCard} ${format === 'excel' ? styles.radioCardActive : ''}`}>
                    <input
                      type="radio"
                      name="format"
                      value="excel"
                      checked={format === 'excel'}
                      onChange={() => setFormat('excel')}
                      disabled={isExporting}
                    />
                    <div className={styles.radioCardIcon}>
                      <FileSpreadsheet className="w-5 h-5" />
                    </div>
                    <div className={styles.radioCardContent}>
                      <div className={styles.radioCardTitle}>Excel (.xlsx)</div>
                      <div className={styles.radioCardDesc}>
                        Phù hợp để phân tích và chỉnh sửa dữ liệu
                      </div>
                    </div>
                    {format === 'excel' && (
                      <div className={styles.radioCardCheck}>
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                    )}
                  </label>

                  <label className={`${styles.radioCard} ${format === 'pdf' ? styles.radioCardActive : ''}`}>
                    <input
                      type="radio"
                      name="format"
                      value="pdf"
                      checked={format === 'pdf'}
                      onChange={() => setFormat('pdf')}
                      disabled={isExporting}
                    />
                    <div className={styles.radioCardIcon}>
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className={styles.radioCardContent}>
                      <div className={styles.radioCardTitle}>PDF (.pdf)</div>
                      <div className={styles.radioCardDesc}>
                        Phù hợp để in ấn và lưu trữ chính thức
                      </div>
                    </div>
                    {format === 'pdf' && (
                      <div className={styles.radioCardCheck}>
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Filename Input */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Tên file <span className={styles.required}>*</span>
                </label>
                <div className={styles.inputWithSuffix}>
                  <input
                    type="text"
                    className={styles.formInput}
                    placeholder="Nhập tên file..."
                    value={filename}
                    onChange={(e) => setFilename(e.target.value)}
                    onKeyDown={handleKeyDown}
                    maxLength={100}
                    disabled={isExporting}
                  />
                  <span className={styles.inputSuffix}>
                    .{format === 'excel' ? 'xlsx' : 'pdf'}
                  </span>
                </div>
                <div className={styles.inputHelp}>
                  File sẽ được lưu với tên: {filename || 'bao-cao'}.{format === 'excel' ? 'xlsx' : 'pdf'}
                </div>
              </div>

              {/* Export Options (Future enhancement) */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Tùy chọn xuất</label>
                <div className={styles.checkboxGroup}>
                  <label className={styles.checkboxItem}>
                    <input type="checkbox" defaultChecked disabled={isExporting} />
                    <span>Bao gồm tiêu đề cột</span>
                  </label>
                  <label className={styles.checkboxItem}>
                    <input type="checkbox" defaultChecked disabled={isExporting} />
                    <span>Bao gồm thông tin bộ lọc</span>
                  </label>
                  {format === 'excel' && (
                    <label className={styles.checkboxItem}>
                      <input type="checkbox" disabled={isExporting} />
                      <span>Định dạng bảng (Table format)</span>
                    </label>
                  )}
                </div>
              </div>

              {/* Info Alert */}
              <div className={styles.alertInfo}>
                <AlertCircle className="w-4 h-4" />
                <div className={styles.alertContent}>
                  <strong>Lưu ý:</strong> File sẽ được tải xuống ngay lập tức. 
                  Dữ liệu xuất là snapshot tại thời điểm hiện tại.
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className={styles.modalFooter}>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onClose}
            disabled={isExporting}
          >
            Hủy
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            onClick={handleExport}
            disabled={isExporting || !filename.trim() || !hasResults}
          >
            {isExporting ? (
              <>
                <div className={styles.buttonSpinner}></div>
                Đang xuất...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Xuất báo cáo
              </>
            )}
          </Button>
        </div>

        {/* Keyboard Shortcut Hint */}
        {hasResults && (
          <div className={styles.modalHint}>
            Nhấn <kbd>Ctrl</kbd> + <kbd>Enter</kbd> để xuất nhanh
          </div>
        )}
      </div>
    </div>
  );
}
