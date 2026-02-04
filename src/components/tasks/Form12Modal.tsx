import React, { useState, useMemo } from 'react';
import { BookOpen, Upload, Eye, X, Download } from 'lucide-react';
import { toast } from 'sonner';
import type { InspectionTask } from '@/utils/data/inspection-tasks-mock-data';
import { mockInspectionTasks } from '@/utils/data/inspection-tasks-mock-data';
import styles from './Form12Modal.module.css';

interface Form12ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface DiaryEntry {
  id: string;
  date: string;
  documentNumber: string;
  documentDate: string;
  assignmentContent: string;
  assignerName: string;
  assignerPosition: string;
  officerName: string;
  officerCode: string;
  workContent: string;
  workTarget: string;
  workLocation: string;
  workTime: string;
  result: string;
  isAutoFilled: boolean;
  sourceForm?: string;
}

export function Form12Modal({ open, onOpenChange }: Form12ModalProps) {
  if (!open) return null;

  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [startDate, setStartDate] = useState('01/01/' + new Date().getFullYear());
  const [endDate, setEndDate] = useState('31/12/' + new Date().getFullYear());
  const [volumeNumber, setVolumeNumber] = useState('01');
  const [organization, setOrganization] = useState('Sở Công Thương TP. Hà Nội');
  const [department, setDepartment] = useState('Thanh tra Sở');

  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-generate entries from completed/closed tasks
  const entries = useMemo(() => {
    const completedTasks = mockInspectionTasks.filter(
      task => task.status === 'completed' || task.status === 'closed'
    );

    return completedTasks.map((task, index): DiaryEntry => ({
      id: task.id,
      date: new Date(task.startDate).toLocaleDateString('vi-VN'),
      documentNumber: task.code,
      documentDate: new Date(task.startDate).toLocaleDateString('vi-VN'),
      assignmentContent: `Kiểm tra cơ sở ${task.targetName}`,
      assignerName: 'Nguyễn Văn A',
      assignerPosition: 'Chánh Thanh tra',
      officerName: task.assignee.name,
      officerCode: 'TT-' + String(index + 1).padStart(3, '0'),
      workContent: `Kiểm tra việc chấp hành quy định về ${task.targetArea}`,
      workTarget: task.targetName,
      workLocation: task.targetAddress,
      workTime: '08:00 - 17:00',
      result: `Đã hoàn thành kiểm tra, lập biên bản ${task.code}/BB-KT`,
      isAutoFilled: true,
      sourceForm: 'Form06',
    }));
  }, []);

  const handleClose = () => {
    onOpenChange(false);
  };

  const handlePreview = () => {
    if (entries.length === 0) {
      toast.error('Chưa có nhật ký để xem trước');
      return;
    }
    setShowPreview(true);
  };

  const handleDownload = async () => {
    if (entries.length === 0) {
      toast.error('Chưa có nhật ký để tải xuống');
      return;
    }

    toast.success('Đã tải xuống sổ nhật ký (DOCX)');
  };

  const handleSubmitToINS = async () => {
    if (entries.length === 0) {
      toast.error('Chưa có nhật ký để gửi');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Đã đẩy sổ nhật ký lên hệ thống INS thành công');
      onOpenChange(false);
    }, 1500);
  };

  // Preview mode
  if (showPreview) {
    return (
      <div className={styles.overlay} onClick={() => setShowPreview(false)}>
        <div className={styles.previewModal} onClick={(e) => e.stopPropagation()}>
          <div className={styles.previewHeader}>
            <div className={styles.previewHeaderContent}>
              <BookOpen size={24} />
              <div>
                <h2 className={styles.previewTitle}>Xem trước - Sổ Nhật ký công tác</h2>
                <p className={styles.previewSubtitle}>Mẫu số 12</p>
              </div>
            </div>
            <button onClick={() => setShowPreview(false)} className={styles.closeButton}>
              <X size={20} />
            </button>
          </div>

          <div className={styles.previewContent}>
            <div className={styles.docPreview}>
              {/* Header */}
              <div className={styles.docHeader}>
                <div className={styles.docHeaderLeft}>
                  <p className={styles.docHeaderTitle}>{organization}</p>
                  <p className={styles.docHeaderTitle}>{department}</p>
                  <p className={styles.docHeaderUnderline}>_______________</p>
                </div>
                <div className={styles.docHeaderRight}>
                  <p className={styles.docHeaderTitle}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
                  <p className={styles.docHeaderSubtitle}>Độc lập - Tự do - Hạnh phúc</p>
                  <p className={styles.docHeaderUnderline}>_______________</p>
                </div>
              </div>

              {/* Title */}
              <h1 className={styles.docTitle}>SỔ NHẬT KÝ CÔNG TÁC*</h1>
              <p className={styles.docSubtitle}>Năm: {year}</p>
              <p className={styles.docSubtitle}>(Từ ngày {startDate} đến ngày {endDate})</p>
              <p className={styles.docSubtitle}>Quyển số: {volumeNumber}</p>

              {/* Content */}
              <div className={styles.docContent}>
                {/* Table */}
                <table className={styles.previewTable}>
                  <thead>
                    <tr>
                      <th rowSpan={2} style={{ width: '60px' }}>Ngày tháng</th>
                      <th colSpan={2}>Số, ký hiệu, ngày tháng năm ban hành, nội dung văn bản, quyết định phân công</th>
                      <th colSpan={2}>Họ tên và chức vụ người ký</th>
                      <th rowSpan={2} style={{ width: '200px' }}>Nội dung, đối tượng, địa điểm thực hiện công việc</th>
                      <th rowSpan={2} style={{ width: '80px' }}>Thời gian thực hiện công việc</th>
                      <th rowSpan={2} style={{ width: '150px' }}>Kết quả thực hiện công việc</th>
                      <th rowSpan={2} style={{ width: '80px' }}>Ký xác nhận của Lãnh đạo đơn vị</th>
                    </tr>
                    <tr>
                      <th style={{ width: '80px' }}>Số, ký hiệu</th>
                      <th style={{ width: '120px' }}>Nội dung</th>
                      <th style={{ width: '100px' }}>Họ tên</th>
                      <th style={{ width: '80px' }}>Chức vụ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map((entry) => (
                      <tr key={entry.id}>
                        <td style={{ textAlign: 'center' }}>{entry.date}</td>
                        <td>{entry.documentNumber}<br />{entry.documentDate}</td>
                        <td>{entry.assignmentContent}</td>
                        <td>{entry.assignerName}</td>
                        <td>{entry.assignerPosition}</td>
                        <td>
                          <strong>Nội dung:</strong> {entry.workContent}<br />
                          {entry.workTarget && <><strong>Đối tượng:</strong> {entry.workTarget}<br /></>}
                          {entry.workLocation && <><strong>Địa điểm:</strong> {entry.workLocation}</>}
                        </td>
                        <td>{entry.workTime}</td>
                        <td>{entry.result}</td>
                        <td></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className={styles.previewFooter}>
            <button onClick={() => setShowPreview(false)} className={styles.cancelButton}>
              Đóng
            </button>
            <button onClick={handleDownload} className={styles.downloadButton}>
              <Download size={16} />
              Tải về
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <BookOpen size={24} className={styles.headerIcon} />
            <div>
              <h2 className={styles.title}>Mẫu số 12. Sổ Nhật ký công tác</h2>
              <p className={styles.subtitle}>Tự động tổng hợp từ các phiên làm việc đã hoàn thành</p>
            </div>
          </div>
          <button onClick={handleClose} className={styles.closeButton} aria-label="Đóng">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {/* Section 1: Diary Information */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Thông tin sổ nhật ký</h3>

            <div className={styles.formRow4}>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Năm <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.input}
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="VD: 2026"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Từ ngày</label>
                <input
                  type="text"
                  className={styles.input}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  placeholder="VD: 01/01/2026"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Đến ngày</label>
                <input
                  type="text"
                  className={styles.input}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  placeholder="VD: 31/12/2026"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Quyển số</label>
                <input
                  type="text"
                  className={styles.input}
                  value={volumeNumber}
                  onChange={(e) => setVolumeNumber(e.target.value)}
                  placeholder="VD: 01"
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Cơ quan chủ quản <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.input}
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="VD: Sở Công Thương TP. Hà Nội"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Đơn vị sử dụng sổ <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.input}
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="VD: Thanh tra Sở"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Diary Entries */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>Danh sách nhật ký ({entries.length} hoạt động)</h3>
            </div>

            {/* Entries Table */}
            {entries.length > 0 ? (
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th style={{ width: '80px' }}>Ngày</th>
                      <th style={{ width: '100px' }}>Số VB</th>
                      <th>Nội dung phân công</th>
                      <th style={{ width: '150px' }}>Công chức</th>
                      <th>Nội dung công việc</th>
                      <th style={{ width: '100px' }}>Thời gian</th>
                      <th style={{ width: '80px' }}>Kết quả</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map((entry) => (
                      <tr key={entry.id}>
                        <td>{entry.date}</td>
                        <td>{entry.documentNumber || '-'}</td>
                        <td>{entry.assignmentContent || '-'}</td>
                        <td>
                          {entry.officerName}
                          {entry.officerCode && <><br /><small>({entry.officerCode})</small></>}
                        </td>
                        <td>
                          {entry.workContent}
                          {entry.workTarget && <><br /><small><strong>Đối tượng:</strong> {entry.workTarget}</small></>}
                        </td>
                        <td>{entry.workTime || '-'}</td>
                        <td>
                          <span style={{ 
                            fontSize: 'var(--font-size-xs)', 
                            color: 'white',
                            background: 'var(--primary)',
                            padding: '4px 8px',
                            borderRadius: 'var(--radius-sm)',
                            display: 'inline-block',
                          }}>
                            Hoàn thành
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className={styles.emptyState}>
                <BookOpen size={48} className={styles.emptyIcon} />
                <p className={styles.emptyText}>Chưa có nhật ký nào</p>
                <p className={styles.emptySubtext}>Nhật ký sẽ tự động tạo khi các phiên làm việc hoàn thành</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button type="button" onClick={handleClose} className={styles.cancelButton}>
            Hủy
          </button>
          <button type="button" onClick={handlePreview} className={styles.previewButton}>
            <Eye size={16} />
            Xem trước
          </button>
          <button type="button" onClick={handleDownload} className={styles.downloadButton}>
            <Download size={16} />
            Tải về
          </button>
          <button
            type="button"
            onClick={handleSubmitToINS}
            disabled={isSubmitting || entries.length === 0}
            className={styles.submitButton}
          >
            <Upload size={16} />
            {isSubmitting ? 'Đang gửi...' : 'Đẩy sang INS'}
          </button>
        </div>
      </div>
    </div>
  );
}
