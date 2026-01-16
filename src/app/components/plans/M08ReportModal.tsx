import React, { useState } from 'react';
import { FileText, Upload, Eye, X, Download } from 'lucide-react';
import { toast } from 'sonner';
import { type Plan } from '../../data/kehoach-mock-data';
import { generateM08Document } from '../../utils/docx-generator';
import styles from './M08ReportModal.module.css';

interface M08ReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: Plan;
}

export function M08ReportModal({ open, onOpenChange, plan }: M08ReportModalProps) {
  // Generate smart default values from plan data
  const generateDefaultReportContent = () => {
    const startDateStr = new Date(plan.startDate).toLocaleDateString('vi-VN');
    const endDateStr = new Date(plan.endDate).toLocaleDateString('vi-VN');
    const progress = plan.stats.progress;
    const completedTasks = plan.stats.completedTasks;
    const totalTasks = plan.stats.totalTasks;
    const totalTargets = plan.stats.totalTargets;
    
    return `Thực hiện kế hoạch "${plan.name}" trong thời gian từ ${startDateStr} đến ${endDateStr}, đơn vị chúng tôi đã triển khai kiểm tra tại phạm vi ${plan.scopeLocation}.

Mục tiêu: ${plan.objectives || 'Thực hiện kiểm tra theo kế hoạch đã được phê duyệt'}

Kết quả đạt được:
- Tổng số đối tượng kiểm tra: ${totalTargets} cơ sở/điểm
- Số nhiệm vụ đã hoàn thành: ${completedTasks}/${totalTasks} nhiệm vụ
- Tiến độ thực hiện: ${progress}%
- Phạm vi triển khai: ${plan.scopeLocation}

Qua quá trình kiểm tra, chúng tôi đã thu thập được các thông tin và dữ liệu liên quan đến ${plan.topic}.`;
  };

  const generateLegalBasis = () => {
    if (plan.insDecisionM03) {
      return `Quyết định số ${plan.insDecisionM03.code} ngày ${new Date(plan.insDecisionM03.issueDate).toLocaleDateString('vi-VN')} về ${plan.insDecisionM03.title}`;
    }
    return 'Kế hoạch kiểm tra đã được phê duyệt';
  };

  // Form state theo mẫu 08 - với auto-fill
  const [organizationName, setOrganizationName] = useState(plan.responsibleUnit);
  const [reportNumber, setReportNumber] = useState('');
  const [location, setLocation] = useState(plan.scopeLocation || 'Hà Nội');
  const [date, setDate] = useState({
    day: new Date().getDate().toString(),
    month: (new Date().getMonth() + 1).toString(),
    year: new Date().getFullYear().toString(),
  });
  const [subject, setSubject] = useState(`Báo cáo kết quả thực hiện ${plan.name}`);
  const [recipient, setRecipient] = useState('Cục Quản lý thị trường');
  const [legalBasis, setLegalBasis] = useState(generateLegalBasis());
  const [additionalBasis, setAdditionalBasis] = useState('');
  const [reporterName, setReporterName] = useState(plan.createdBy || '');
  const [reporterPosition, setReporterPosition] = useState('');
  const [reporterUnit, setReporterUnit] = useState(plan.responsibleUnit);
  const [reportContent, setReportContent] = useState(generateDefaultReportContent());
  const [recommendations, setRecommendations] = useState('');
  const [recipientRequest, setRecipientRequest] = useState(recipient);
  const [recipientList, setRecipientList] = useState(['Như tiểu mục', 'Lưu Hồ sơ vụ việc']);
  const [signerName, setSignerName] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  if (!open) return null;

  const handleClose = () => {
    onOpenChange(false);
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  const handleDownload = async () => {
    if (!reportContent.trim()) {
      toast.error('Vui lòng nhập nội dung báo cáo');
      return;
    }
    if (!reporterName.trim()) {
      toast.error('Vui lòng nhập tên người báo cáo');
      return;
    }

    try {
      await generateM08Document({
        organizationName,
        reportNumber,
        location: location || 'Hà Nội',
        date,
        subject,
        recipientName: recipient,
        legalBasis,
        reporterName,
        reporterTitle: reporterPosition || 'Người báo cáo',
        reporterUnit,
        reportContent,
        recommendations,
        recipientList,
        signerName,
      });
      
      toast.success('Tải xuống file Word thành công!');
    } catch (error) {
      console.error('Error generating document:', error);
      toast.error('Có lỗi khi tạo file Word');
    }
  };

  const handleSubmitToINS = async () => {
    if (!reportContent.trim()) {
      toast.error('Vui lòng nhập nội dung báo cáo');
      return;
    }
    if (!reporterName.trim()) {
      toast.error('Vui lòng nhập tên người báo cáo');
      return;
    }

    setIsSubmitting(true);
    
    // Mock API call to INS
    setTimeout(() => {
      toast.success('Đã đẩy báo cáo M08 sang hệ thống INS!');
      setIsSubmitting(false);
      handleClose();
    }, 1500);
  };

  if (showPreview) {
    return (
      <div className={styles.overlay} onClick={() => setShowPreview(false)}>
        <div className={styles.previewModal} onClick={(e) => e.stopPropagation()}>
          <div className={styles.previewHeader}>
            <h2 className={styles.previewTitle}>Xem trước Báo cáo (M08)</h2>
            <button onClick={() => setShowPreview(false)} className={styles.closeButton}>
              <X size={20} />
            </button>
          </div>
          <div className={styles.previewContent}>
            <div className={styles.officialDocument}>
              {/* Header Row */}
              <div className={styles.docHeader}>
                <div className={styles.docHeaderLeft}>
                  <p className={styles.docOrg}>{organizationName || '.............................(1).............................'}</p>
                  <p className={styles.docNumber}>Số: {reportNumber || '......./BC-.....(3)......'}</p>
                </div>
                <div className={styles.docHeaderRight}>
                  <p className={styles.docCountry}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
                  <p className={styles.docMotto}>Độc lập - Tự do - Hạnh phúc</p>
                  <p className={styles.docDate}>
                    ...(2)..., ngày {date.day} tháng {date.month} năm {date.year}
                  </p>
                </div>
              </div>

              {/* Title */}
              <h1 className={styles.docTitle}>BÁO CÁO*</h1>
              <p className={styles.docSubject}>Về việc {subject || '........................(4)................................'}</p>
              
              {/* Recipient */}
              <p className={styles.docRecipient}>Kính gửi: {recipient || '.........................(5)..................................'}</p>

              {/* Legal Basis */}
              <p className={styles.docContent}>
                Căn cứ Thông tư của Bộ trưởng Bộ Công Thương quy định về nội dung, trình tự, thủ tục hoạt động kiểm tra, xử lý vi phạm hành chính và thực hiện pháp luật nghiệp vụ của lực lượng Quản lý thị trường ...;
              </p>
              
              <p className={styles.docContent}>Căn cứ: {legalBasis || '..............................(6)..............................'}</p>
              
              <p className={styles.docContent}>Tôi là: {reporterName || '..............................'}</p>
              <p className={styles.docContent}>Chức vụ: {reporterPosition || '..............................'} Đơn vị: {reporterUnit || '..............................'}</p>
              
              {/* Report Content */}
              <p className={styles.docSectionTitle}>1. Báo cáo về việc {subject || '............(4).............'} như sau:</p>
              <p className={styles.docContent}>
                {reportContent || '...........................................................................................(7)..............................................................................................'}
              </p>
              
              {/* Recommendations */}
              <p className={styles.docSectionTitle}>2. Đề xuất, kiến nghị (nếu có):</p>
              <p className={styles.docContent}>
                {recommendations || '..............................(8)..............................'}
              </p>
              
              <p className={styles.docContent}>
                Kính đề nghị {recipientRequest || '................(5)................'} xem xét, quyết định./
              </p>

              {/* Footer */}
              <div className={styles.docFooter}>
                <div className={styles.docFooterLeft}>
                  <p className={styles.docFooterTitle}>Nơi nhận:</p>
                  {recipientList.map((item, index) => (
                    <p key={index} className={styles.docFooterItem}>- {item};</p>
                  ))}
                </div>
                <div className={styles.docFooterRight}>
                  <p className={styles.docFooterTitle}>NGƯỜI BÁO CÁO</p>
                  <p className={styles.docFooterSubtitle}>(Ký và ghi rõ họ tên)</p>
                  <p className={styles.docFooterName}>{signerName}</p>
                </div>
              </div>

              {/* Footnote */}
              <p className={styles.docFootnote}>
                * Mẫu này được sử dụng để công chức Quản lý thị trường thực thi công vụ thực hiện báo cáo cơ quan, người có thẩm quyền. Nếu cần báo cáo văn thư thập, tiếp nhận và xử lý theo quy định tại Pháp lệnh Quản lý thị trường và Thông quy của Bộ trưởng Bộ Công Thương; thông quy về nội dung, trình tự, thủ tục hoạt động kiểm tra, xử lý vi phạm hành chính và thực hiện pháp luật nghiệp vụ của lực lượng Quản lý thị trường và Thông quy về ban hành văn bản của cơ quan trong hệ thống Bộ Công Thương; quy định tại Pháp lệnh Quản lý thị trường và Thông quy của Bộ trưởng Bộ Công Thương về các biện pháp nghiệp vụ theo quy định tại Pháp lệnh Quản lý thị trường và Thông quy về phạm hành chính và thực hiện pháp luật nghiệp vụ của lực lượng Quản lý thị trường.
              </p>
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
            <FileText size={24} className={styles.headerIcon} />
            <div>
              <h2 className={styles.title}>Mẫu số 08. Báo cáo</h2>
              <p className={styles.subtitle}>Lập báo cáo kết quả thực hiện kế hoạch kiểm tra theo mẫu chính thức</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className={styles.closeButton}
            aria-label="Đóng"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {/* Section 1: Header Information */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Thông tin đầu trang</h3>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Tên cơ quan (1) <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.input}
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  placeholder="VD: Cục Quản lý thị trường Hà Nội"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Số văn bản (3) <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.input}
                  value={reportNumber}
                  onChange={(e) => setReportNumber(e.target.value)}
                  placeholder="VD: 123/BC-QLTT"
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Địa danh (2)</label>
                <input
                  type="text"
                  className={styles.input}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="VD: Hà Nội"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Ngày tháng năm</label>
                <div className={styles.dateRow}>
                  <input
                    type="number"
                    className={styles.dateInput}
                    value={date.day}
                    onChange={(e) => setDate({ ...date, day: e.target.value })}
                    placeholder="Ngày"
                    min="1"
                    max="31"
                  />
                  <input
                    type="number"
                    className={styles.dateInput}
                    value={date.month}
                    onChange={(e) => setDate({ ...date, month: e.target.value })}
                    placeholder="Tháng"
                    min="1"
                    max="12"
                  />
                  <input
                    type="number"
                    className={styles.dateInput}
                    value={date.year}
                    onChange={(e) => setDate({ ...date, year: e.target.value })}
                    placeholder="Năm"
                    min="2020"
                    max="2100"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Subject & Recipient */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Tiêu đề và người nhận</h3>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Về việc (4) <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                className={styles.input}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="VD: Báo cáo kết quả kiểm tra..."
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                Kính gửi (5) <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                className={styles.input}
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="VD: Cục Quản lý thị trường"
              />
            </div>
          </div>

          {/* Section 3: Legal Basis */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Căn cứ pháp lý</h3>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Căn cứ bổ sung (6)</label>
              <textarea
                className={styles.textarea}
                value={legalBasis}
                onChange={(e) => setLegalBasis(e.target.value)}
                placeholder="Nhập căn cứ pháp lý bổ sung (nếu có)"
                rows={2}
              />
            </div>
          </div>

          {/* Section 4: Reporter Info */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Thông tin người báo cáo</h3>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Tôi là <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                className={styles.input}
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                placeholder="Họ và tên người báo cáo"
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Chức vụ</label>
                <input
                  type="text"
                  className={styles.input}
                  value={reporterPosition}
                  onChange={(e) => setReporterPosition(e.target.value)}
                  placeholder="VD: Trưởng phòng"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Đơn vị</label>
                <input
                  type="text"
                  className={styles.input}
                  value={reporterUnit}
                  onChange={(e) => setReporterUnit(e.target.value)}
                  placeholder="Tên đơn vị"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Report Content */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              1. Báo cáo về việc... (7) <span className={styles.required}>*</span>
            </h3>
            <textarea
              className={styles.textarea}
              value={reportContent}
              onChange={(e) => setReportContent(e.target.value)}
              placeholder="Nhập nội dung báo cáo chi tiết..."
              rows={8}
            />
          </div>

          {/* Section 6: Recommendations */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>2. Đề xuất, kiến nghị (8)</h3>
            <textarea
              className={styles.textarea}
              value={recommendations}
              onChange={(e) => setRecommendations(e.target.value)}
              placeholder="Nhập các đề xuất, kiến nghị (nếu có)..."
              rows={4}
            />

            <div className={styles.formGroup} style={{ marginTop: 'var(--spacing-3)' }}>
              <label className={styles.label}>Kính đề nghị (5)</label>
              <input
                type="text"
                className={styles.input}
                value={recipientRequest}
                onChange={(e) => setRecipientRequest(e.target.value)}
                placeholder="VD: Cục Quản lý thị trường"
              />
            </div>
          </div>

          {/* Section 7: Signature */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Người ký</h3>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Họ và tên người ký <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                className={styles.input}
                value={signerName}
                onChange={(e) => setSignerName(e.target.value)}
                placeholder="Nhập họ và tên người ký"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button
            type="button"
            onClick={handleClose}
            className={styles.cancelButton}
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handlePreview}
            className={styles.previewButton}
          >
            <Eye size={16} />
            Xem trước
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className={styles.downloadButton}
          >
            <Download size={16} />
            Tải về
          </button>
          <button
            type="button"
            onClick={handleSubmitToINS}
            disabled={isSubmitting || !reportContent.trim() || !reporterName.trim()}
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
