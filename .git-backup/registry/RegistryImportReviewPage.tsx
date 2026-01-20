import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle2,
  Download,
  ArrowLeft,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import PageHeader from '../../layouts/PageHeader';
import { Button } from '../../app/components/ui/button';
import { Card, CardContent } from '../../app/components/ui/card';
import DataTable, { Column } from '../../ui-kit/DataTable';
import TableFooter from '../../ui-kit/TableFooter';
import { ParseResult, ParsedStoreRow } from '../../utils/importTemplate';
import styles from './RegistryImportReviewPage.module.css';

export default function RegistryImportReviewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [importing, setImporting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [showAllErrors, setShowAllErrors] = useState(false);

  // Get import result from navigation state
  const importResult: ParseResult | null = location.state?.importResult || null;

  if (!importResult) {
    // Redirect back if no data
    navigate('/registry/stores');
    return null;
  }

  const { data, errors, summary } = importResult;

  // Pagination
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = data.slice(startIndex, startIndex + pageSize);
  const totalPages = Math.ceil(data.length / pageSize);

  // Handle confirm import
  const handleConfirmImport = async () => {
    if (summary.valid === 0) {
      toast.error('Không có dữ liệu hợp lệ để import');
      return;
    }

    setImporting(true);

    try {
      // Simulate API call to import data
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In production: Send data to backend
      // const response = await api.importStores(data);

      toast.success(
        `Import thành công ${summary.valid} cửa hàng`,
        {
          description: 'Tất cả cửa hàng đã được tạo ở trạng thái "Chờ duyệt"',
          duration: 5000,
        }
      );

      // Navigate back to store list
      navigate('/registry/stores');
    } catch (error) {
      console.error('Import failed:', error);
      toast.error('Có lỗi xảy ra khi import dữ liệu');
    } finally {
      setImporting(false);
    }
  };

  // Handle download error file
  const handleDownloadErrors = () => {
    if (errors.length === 0) return;

    // Group errors by row
    const errorsByRow = new Map<number, string[]>();
    errors.forEach((error) => {
      const existing = errorsByRow.get(error.row) || [];
      existing.push(`${error.field}: ${error.message}`);
      errorsByRow.set(error.row, existing);
    });

    // Create CSV content
    const csvLines = ['Dòng,Lỗi'];
    errorsByRow.forEach((messages, row) => {
      csvLines.push(`${row},"${messages.join('; ')}"`);
    });

    const csvContent = '\uFEFF' + csvLines.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `danh-sach-loi-import-${Date.now()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success('Đã tải file lỗi');
  };

  // Define table columns
  const columns: Column<ParsedStoreRow>[] = [
    {
      key: 'rowIndex',
      label: 'Dòng',
      sortable: false,
      width: '80px',
      render: (item) => (
        <span className={styles.rowNumber}>{item.rowIndex}</span>
      ),
    },
    {
      key: 'name',
      label: 'Tên cửa hàng',
      sortable: false,
      width: '250px',
      render: (item) => (
        <span className={styles.storeName}>{item.name}</span>
      ),
    },
    {
      key: 'ownerName',
      label: 'Chủ hộ',
      sortable: false,
      width: '200px',
      render: (item) => (
        <span className={styles.normalText}>{item.ownerName}</span>
      ),
    },
    {
      key: 'taxCode',
      label: 'Mã số thuế',
      sortable: false,
      width: '140px',
      render: (item) => (
        <span className={styles.monospaceText}>{item.taxCode}</span>
      ),
    },
    {
      key: 'phone',
      label: 'Số điện thoại',
      sortable: false,
      width: '140px',
      render: (item) => (
        <span className={styles.monospaceText}>{item.phone}</span>
      ),
    },
    {
      key: 'ward',
      label: 'Phường/Xã',
      sortable: false,
      width: '180px',
      render: (item) => (
        <span className={styles.normalText}>{item.ward}</span>
      ),
    },
    {
      key: 'industryName',
      label: 'Ngành hàng',
      sortable: false,
      width: '180px',
      render: (item) => (
        <span className={styles.normalText}>{item.industryName}</span>
      ),
    },
    {
      key: 'status',
      label: 'Trạng thái',
      sortable: false,
      width: '120px',
      render: (item) => {
        const hasError = errors.some((e) => e.row === item.rowIndex);
        return (
          <span className={`${styles.statusBadge} ${hasError ? styles.invalid : styles.valid}`}>
            {hasError ? (
              <>
                <AlertTriangle size={12} />
                Có lỗi
              </>
            ) : (
              <>
                <CheckCircle2 size={12} />
                Hợp lệ
              </>
            )}
          </span>
        );
      },
    },
  ];

  return (
    <div className={styles.pageContainer}>
      <PageHeader
        breadcrumbs={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Cơ sở & Địa bàn', href: '/registry/stores' },
          { label: 'Xem trước Import' },
        ]}
        title="Xem trước dữ liệu Import"
        actions={
          <Button variant="outline" size="sm" onClick={() => navigate('/registry/stores')}>
            <ArrowLeft size={16} />
            Quay lại
          </Button>
        }
      />

      {/* Summary Cards */}
      <div className={styles.summaryCards}>
        <div className={styles.summaryCard}>
          <p className={styles.summaryLabel}>Tổng số dòng</p>
          <p className={styles.summaryValue}>{summary.total}</p>
        </div>
        <div className={`${styles.summaryCard} ${styles.success}`}>
          <p className={styles.summaryLabel}>Dòng hợp lệ</p>
          <p className={styles.summaryValue}>{summary.valid}</p>
        </div>
        <div className={`${styles.summaryCard} ${styles.danger}`}>
          <p className={styles.summaryLabel}>Dòng có lỗi</p>
          <p className={styles.summaryValue}>{summary.invalid}</p>
        </div>
      </div>

      {/* Error Section */}
      {errors.length > 0 && (
        <div className={styles.errorSection}>
          <div className={styles.errorHeader}>
            <AlertTriangle size={24} className={styles.errorIcon} />
            <h2 className={styles.errorTitle}>
              Phát hiện {errors.length} lỗi trong file import
            </h2>
          </div>

          <div className={styles.errorList}>
            {errors.slice(0, showAllErrors ? errors.length : 10).map((error, index) => {
              // Group by row and field for better readability
              const rowLabel = `Dòng ${error.row}`;
              const fieldLabel = error.field;
              const message = error.message;
              
              return (
                <div key={index} className={styles.errorItem}>
                  <span className={styles.errorRow}>{rowLabel}:</span>
                  <strong>{fieldLabel}</strong> - {message}
                </div>
              );
            })}
          </div>

          <div className={styles.errorActions}>
            {errors.length > 10 && !showAllErrors && (
              <Button 
                variant="ghost" 
                onClick={() => setShowAllErrors(true)}
                className={styles.loadMoreButton}
              >
                Tải thêm {errors.length - 10} lỗi
              </Button>
            )}
            {showAllErrors && errors.length > 10 && (
              <Button 
                variant="ghost" 
                onClick={() => setShowAllErrors(false)}
                className={styles.loadMoreButton}
              >
                Thu gọn
              </Button>
            )}
            <Button variant="outline" onClick={handleDownloadErrors}>
              <Download size={16} />
              Tải file lỗi chi tiết ({errors.length} lỗi)
            </Button>
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <div className={styles.tableTitle}>
            <FileSpreadsheet size={20} />
            <span>Danh sách cửa hàng sẽ được import ({summary.valid}/{summary.total})</span>
          </div>
        </div>

        <Card>
          <CardContent style={{ padding: 0 }}>
            {data.length > 0 ? (
              <>
                <DataTable
                  columns={columns}
                  data={paginatedData}
                  selectable={false}
                  getRowId={(item) => item.rowIndex}
                  getRowClassName={(item) => {
                    const hasError = errors.some((e) => e.row === item.rowIndex);
                    return hasError ? styles.invalidRow : styles.validRow;
                  }}
                />

                <TableFooter
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalRecords={data.length}
                  pageSize={pageSize}
                  onPageChange={setCurrentPage}
                  onPageSizeChange={(size) => {
                    setPageSize(size);
                    setCurrentPage(1);
                  }}
                />
              </>
            ) : (
              <div className={styles.emptyState}>
                <FileSpreadsheet size={48} className={styles.emptyIcon} />
                <h3 className={styles.emptyTitle}>Không có dữ liệu</h3>
                <p className={styles.emptyDescription}>
                  File import không chứa dữ liệu hợp lệ nào
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className={styles.actionButtons}>
        <Button variant="outline" onClick={() => navigate('/registry/stores')} disabled={importing}>
          Hủy
        </Button>
        <Button onClick={handleConfirmImport} disabled={summary.valid === 0 || importing}>
          {importing ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Đang import...
            </>
          ) : (
            <>
              <CheckCircle2 size={16} />
              Xác nhận import {summary.valid} cửa hàng
            </>
          )}
        </Button>
      </div>
    </div>
  );
}