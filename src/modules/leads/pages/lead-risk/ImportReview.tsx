import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Save,
  RotateCcw,
  Trash2,
  Eye,
  EyeOff,
  Download,
} from 'lucide-react';
import { toast } from 'sonner';
import styles from './ImportReview.module.css';

interface ImportError {
  id: string;
  row: number;
  column: string;
  originalValue: string;
  error: string;
  severity: 'error' | 'warning';
  isFixed: boolean;
  fixedValue?: string;
}

export default function ImportReview() {
  const navigate = useNavigate();
  const [showOnlyErrors, setShowOnlyErrors] = useState(false);
  const [errors, setErrors] = useState<ImportError[]>([
    {
      id: '1',
      row: 12,
      column: 'address',
      originalValue: '',
      error: 'Địa chỉ không được để trống',
      severity: 'error',
      isFixed: false,
    },
    {
      id: '2',
      row: 25,
      column: 'district',
      originalValue: 'Q1',
      error: 'Quận không tồn tại. Gợi ý: Quận 1',
      severity: 'error',
      isFixed: false,
    },
    {
      id: '3',
      row: 48,
      column: 'urgency',
      originalValue: 'cao',
      error: 'Giá trị không hợp lệ. Chấp nhận: low, medium, high, critical',
      severity: 'error',
      isFixed: false,
    },
    {
      id: '4',
      row: 67,
      column: 'source',
      originalValue: 'Điện thoại',
      error: 'Nguồn tin không có trong danh sách. Gợi ý: Hotline 1800',
      severity: 'warning',
      isFixed: false,
    },
    {
      id: '5',
      row: 89,
      column: 'title',
      originalValue: 'Vi phạm',
      error: 'Tiêu đề quá ngắn (tối thiểu 10 ký tự)',
      severity: 'warning',
      isFixed: false,
    },
    {
      id: '6',
      row: 102,
      column: 'description',
      originalValue: '',
      error: 'Mô tả không được để trống',
      severity: 'error',
      isFixed: false,
    },
    {
      id: '7',
      row: 115,
      column: 'reporter_phone',
      originalValue: '123456',
      error: 'Số điện thoại không đúng định dạng (10 chữ số)',
      severity: 'warning',
      isFixed: false,
    },
    {
      id: '8',
      row: 128,
      column: 'violation_type',
      originalValue: 'Khác',
      error: 'Loại vi phạm không rõ ràng',
      severity: 'warning',
      isFixed: false,
    },
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const totalErrors = errors.length;
  const criticalErrors = errors.filter((e) => e.severity === 'error').length;
  const warnings = errors.filter((e) => e.severity === 'warning').length;
  const fixedCount = errors.filter((e) => e.isFixed).length;

  const handleEdit = (error: ImportError) => {
    setEditingId(error.id);
    setEditValue(error.fixedValue || error.originalValue);
  };

  const handleSaveFix = (id: string) => {
    setErrors(
      errors.map((e) =>
        e.id === id ? { ...e, isFixed: true, fixedValue: editValue } : e
      )
    );
    setEditingId(null);
    toast.success('Đã lưu sửa đổi');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  const handleDeleteRow = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa dòng này khỏi import?')) {
      setErrors(errors.filter((e) => e.id !== id));
      toast.success('Đã xóa dòng');
    }
  };

  const handleReValidate = () => {
    toast.info('Đang kiểm tra lại dữ liệu...');
    setTimeout(() => {
      const remainingErrors = errors.filter((e) => !e.isFixed);
      if (remainingErrors.length === 0) {
        toast.success('Tất cả lỗi đã được sửa!');
      } else {
        toast.warning(`Còn ${remainingErrors.length} lỗi cần sửa`);
      }
    }, 1500);
  };

  const handleCommit = () => {
    const remainingErrors = errors.filter(
      (e) => e.severity === 'error' && !e.isFixed
    );

    if (remainingErrors.length > 0) {
      toast.error(`Còn ${remainingErrors.length} lỗi nghiêm trọng chưa sửa`);
      return;
    }

    if (confirm('Xác nhận import dữ liệu đã sửa?')) {
      toast.success('Đang import dữ liệu...');
      setTimeout(() => {
        navigate('/lead-risk/inbox');
      }, 2000);
    }
  };

  const downloadErrorLog = () => {
    toast.info('Đang tải log lỗi...');
    // In real app: generate CSV/Excel with errors
  };

  const filteredErrors = showOnlyErrors
    ? errors.filter((e) => !e.isFixed)
    : errors;

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          <ArrowLeft size={16} />
        </button>

        <div className={styles.titleGroup}>
          <h1 className={styles.title}>Kiểm tra & Sửa lỗi Import</h1>
          <p className={styles.subtitle}>Làm sạch dữ liệu trước khi nhập hệ thống</p>
        </div>

        <button className={styles.downloadButton} onClick={downloadErrorLog}>
          <Download size={16} />
          Tải log lỗi
        </button>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{totalErrors}</div>
          <div className={styles.statLabel}>Tổng lỗi & cảnh báo</div>
        </div>

        <div className={`${styles.statCard} ${styles.statCardError}`}>
          <div className={styles.statValue}>{criticalErrors}</div>
          <div className={styles.statLabel}>Lỗi nghiêm trọng</div>
        </div>

        <div className={`${styles.statCard} ${styles.statCardWarning}`}>
          <div className={styles.statValue}>{warnings}</div>
          <div className={styles.statLabel}>Cảnh báo</div>
        </div>

        <div className={`${styles.statCard} ${styles.statCardSuccess}`}>
          <div className={styles.statValue}>{fixedCount}</div>
          <div className={styles.statLabel}>Đã sửa</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <button className={styles.toolbarButton} onClick={handleReValidate}>
          <RotateCcw size={16} />
          Kiểm tra lại
        </button>

        <label className={styles.toggleFilter}>
          <input
            type="checkbox"
            checked={showOnlyErrors}
            onChange={(e) => setShowOnlyErrors(e.target.checked)}
          />
          {showOnlyErrors ? <EyeOff size={16} /> : <Eye size={16} />}
          <span>Chỉ hiện lỗi chưa sửa</span>
        </label>

        <div className={styles.spacer}></div>

        <button className={styles.commitButton} onClick={handleCommit}>
          <CheckCircle size={16} />
          Xác nhận Import
        </button>
      </div>

      {/* Error Table */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Dòng</th>
              <th>Cột</th>
              <th>Giá trị gốc</th>
              <th>Lỗi</th>
              <th>Giá trị sửa</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredErrors.map((error) => (
              <tr
                key={error.id}
                className={`${
                  error.severity === 'error' ? styles.errorRow : styles.warningRow
                } ${error.isFixed ? styles.fixedRow : ''}`}
              >
                <td className={styles.rowNumber}>#{error.row}</td>
                <td className={styles.columnName}>{error.column}</td>
                <td className={styles.originalValue}>
                  {error.originalValue || (
                    <span className={styles.emptyValue}>(trống)</span>
                  )}
                </td>
                <td className={styles.errorMessage}>
                  <div className={styles.errorIcon}>
                    {error.severity === 'error' ? (
                      <AlertCircle size={16} />
                    ) : (
                      <AlertCircle size={16} />
                    )}
                  </div>
                  {error.error}
                </td>
                <td className={styles.fixedValue}>
                  {editingId === error.id ? (
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className={styles.input}
                      autoFocus
                    />
                  ) : error.isFixed ? (
                    <span className={styles.fixedValueText}>
                      {error.fixedValue}
                    </span>
                  ) : (
                    <span className={styles.notFixedText}>Chưa sửa</span>
                  )}
                </td>
                <td className={styles.status}>
                  {error.isFixed ? (
                    <span className={styles.statusFixed}>
                      <CheckCircle size={14} />
                      Đã sửa
                    </span>
                  ) : (
                    <span
                      className={
                        error.severity === 'error'
                          ? styles.statusError
                          : styles.statusWarning
                      }
                    >
                      {error.severity === 'error' ? 'Lỗi' : 'Cảnh báo'}
                    </span>
                  )}
                </td>
                <td className={styles.actions}>
                  {editingId === error.id ? (
                    <>
                      <button
                        className={styles.saveButton}
                        onClick={() => handleSaveFix(error.id)}
                      >
                        <Save size={14} />
                      </button>
                      <button className={styles.cancelButton} onClick={handleCancelEdit}>
                        <X size={14} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className={styles.editButton}
                        onClick={() => handleEdit(error)}
                      >
                        Sửa
                      </button>
                      <button
                        className={styles.deleteButton}
                        onClick={() => handleDeleteRow(error.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredErrors.length === 0 && (
          <div className={styles.emptyState}>
            <CheckCircle size={48} />
            <h3>Tất cả lỗi đã được sửa!</h3>
            <p>Bạn có thể tiếp tục import dữ liệu</p>
          </div>
        )}
      </div>

      {/* Log Section */}
      <div className={styles.logSection}>
        <h3 className={styles.logTitle}>Log hoạt động</h3>
        <div className={styles.logContent}>
          <div className={styles.logEntry}>
            <span className={styles.logTime}>14:32:15</span>
            <span className={styles.logMessage}>Bắt đầu kiểm tra dữ liệu import</span>
          </div>
          <div className={styles.logEntry}>
            <span className={styles.logTime}>14:32:18</span>
            <span className={styles.logMessage}>
              Phát hiện 8 lỗi và cảnh báo trong 150 dòng
            </span>
          </div>
          <div className={styles.logEntry}>
            <span className={styles.logTime}>14:35:22</span>
            <span className={styles.logMessage}>
              Người dùng đã sửa lỗi tại dòng 12, cột address
            </span>
          </div>
          <div className={styles.logEntry}>
            <span className={styles.logTime}>14:36:10</span>
            <span className={styles.logMessage}>
              Người dùng đã sửa lỗi tại dòng 25, cột district
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
