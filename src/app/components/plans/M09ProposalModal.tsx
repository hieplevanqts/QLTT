import React, { useState } from 'react';
import { FileDown, Upload, Eye, X, Download } from 'lucide-react';
import { toast } from 'sonner';
import { type Plan } from '../../data/kehoach-mock-data';
import { generateM09Document } from '@/app/utils/docx-generator';
import styles from './M09ProposalModal.module.css';

interface M09ProposalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: Plan;
}

export function M09ProposalModal({ open, onOpenChange, plan }: M09ProposalModalProps) {
  // Generate smart defaults from plan data
  const generateTargetInfo = () => {
    return `Tên, địa chỉ của cá nhân, hộ kinh doanh, tổ chức hoặc cơ sở sản xuất, kinh doanh được kiểm tra tại phạm vi ${plan.scopeLocation} với tổng số ${plan.stats.totalTargets} đối tượng theo ${plan.name}.`;
  };

  const generateInspectionContent = () => {
    return `Kiểm tra việc chấp hành pháp luật trong hoạt động sản xuất, kinh doanh hàng hóa, dịch vụ tại ${plan.scopeLocation}. Nội dung kiểm tra: ${plan.topic}`;
  };

  const generateInspectionScope = () => {
    return `Phạm vi kiểm tra: ${plan.scopeLocation}. Nội dung: ${plan.objectives}`;
  };

  const generateInspectionTime = () => {
    const duration = Math.ceil((new Date(plan.endDate).getTime() - new Date(plan.startDate).getTime()) / (1000 * 60 * 60 * 24));
    return `Thời hạn kiểm tra: ${duration} ngày. Dự kiến tiến hành từ ${new Date(plan.startDate).toLocaleDateString('vi-VN')} đến ${new Date(plan.endDate).toLocaleDateString('vi-VN')}.`;
  };

  const generateLegalBasis = () => {
    if (plan.insDecisionM03) {
      return `Quyết định số ${plan.insDecisionM03.code} ngày ${new Date(plan.insDecisionM03.issueDate).toLocaleDateString('vi-VN')} về ${plan.insDecisionM03.title}`;
    }
    return 'Kế hoạch kiểm tra đã được phê duyệt';
  };

  // Form state
  const [organizationName, setOrganizationName] = useState(plan.responsibleUnit);
  const [proposalNumber, setProposalNumber] = useState('');
  const [location, setLocation] = useState(plan.scopeLocation || 'Hà Nội');
  const [date, setDate] = useState({
    day: new Date().getDate().toString(),
    month: (new Date().getMonth() + 1).toString(),
    year: new Date().getFullYear().toString(),
  });
  const [subject, setSubject] = useState(plan.topic || 'Kiểm tra đột xuất');
  const [recipient, setRecipient] = useState('Cục Quản lý thị trường');
  const [legalBasis, setLegalBasis] = useState(generateLegalBasis());
  const [proposerName, setProposerName] = useState(plan.createdBy || '');
  const [proposerPosition, setProposerPosition] = useState('');
  const [proposerUnit, setProposerUnit] = useState(plan.responsibleUnit);
  const [targetInfo, setTargetInfo] = useState(generateTargetInfo());
  const [inspectionLocation, setInspectionLocation] = useState(generateInspectionContent());
  const [inspectionScope, setInspectionScope] = useState(generateInspectionScope());
  const [inspectionTime, setInspectionTime] = useState(generateInspectionTime());
  const [expectedViolation, setExpectedViolation] = useState('');
  
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
    if (!targetInfo.trim()) {
      toast.error('Vui lòng nhập thông tin đối tượng kiểm tra');
      return;
    }
    if (!proposerName.trim()) {
      toast.error('Vui lòng nhập tên người đề xuất');
      return;
    }

    try {
      await generateM09Document({
        organizationName,
        proposalNumber,
        location: location || 'Hà Nội',
        date,
        subject,
        recipientName: recipient,
        legalBasis,
        proposerName,
        proposerTitle: proposerPosition || 'Người đề xuất',
        proposerUnit,
        targetInfo,
        inspectionLocation,
        inspectionScope,
        inspectionTime,
        expectedViolation,
      });
      
      toast.success('Tải xuống file Word thành công!');
    } catch (error) {
      console.error('Error generating document:', error);
      toast.error('Có lỗi khi tạo file Word');
    }
  };

  const handleSubmitToINS = async () => {
    if (!targetInfo.trim()) {
      toast.error('Vui lòng nhập thông tin đối tượng kiểm tra');
      return;
    }
    if (!proposerName.trim()) {
      toast.error('Vui lòng nhập tên người đề xuất');
      return;
    }

    setIsSubmitting(true);
    
    // Mock API call to INS
    setTimeout(() => {
      toast.success('Đã đẩy đề xuất M09 sang hệ thống INS!');
      setIsSubmitting(false);
      handleClose();
    }, 1500);
  };

  if (showPreview) {
    return (
      <div className={styles.overlay} onClick={() => setShowPreview(false)}>
        <div className={styles.previewModal} onClick={(e) => e.stopPropagation()}>
          <div className={styles.previewHeader}>
            <h2 className={styles.previewTitle}>Xem trước Đề xuất (M09)</h2>
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
                  <p className={styles.docNumber}>Số: {proposalNumber || '......./DX-.....(3)......'}</p>
                </div>
                <div className={styles.docHeaderRight}>
                  <p className={styles.docCountry}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
                  <p className={styles.docMotto}>Độc lập - Tự do - Hạnh phúc</p>
                  <p className={styles.docDate}>
                    {location}, ngày {date.day} tháng {date.month} năm {date.year}
                  </p>
                </div>
              </div>

              {/* Title */}
              <h1 className={styles.docTitle}>ĐỀ XUẤT</h1>
              <p className={styles.docSubject}>
                Kiểm tra đột xuất việc chấp hành pháp luật trong sản xuất, kinh doanh hàng hóa, 
                dịch vụ/Khám {subject || '....(4).....'} theo thủ tục hành chính*
              </p>
              
              {/* Recipient */}
              <p className={styles.docRecipient}>Kính gửi: {recipient || '.........................(5)..................................'}</p>

              {/* Legal Basis */}
              <p className={styles.docContent}>
                Căn cứ Thông tư số ... ngày ... tháng ... năm ... của Bộ trưởng Bộ Công Thương quy định về nội dung, trình tự, thủ tục hoạt động kiểm tra, xử lý vi phạm hành chính và thực hiện pháp luật nghiệp vụ của lực lượng Quản lý thị trường;
              </p>
              
              <p className={styles.docContent}>Căn cứ: {legalBasis || '..............................(6)..............................'}</p>
              
              <p className={styles.docContent}>Tôi là: {proposerName || '..............................'}</p>
              <p className={styles.docContent}>Chức vụ: {proposerPosition || '..............................'} Đơn vị: {proposerUnit || '..............................'}</p>
              
              {/* Proposal Content */}
              <p className={styles.docContent}>
                Đề xuất kiểm tra đột xuất việc chấp hành pháp luật trong sản xuất, kinh doanh hàng hóa, dịch vụ/Khám {subject || '....(4).....'} theo thủ tục hành chính với những nội dung sau:
              </p>

              <p className={styles.docSectionTitle}>
                1. Tên, địa chỉ của cá nhân, hộ kinh doanh, tổ chức hoặc cơ sở sản xuất, kinh doanh được kiểm tra/Người bị khám/Phương tiện liên quan đến việc kiểm tra:
              </p>
              <p className={styles.docContent}>
                {targetInfo || '..............................(7)..............................'}
              </p>

              <p className={styles.docSectionTitle}>
                2. Địa điểm đề xuất kiểm tra/ Nội dung việc khám:
              </p>
              <p className={styles.docContent}>
                {inspectionLocation || '..............................(8)..............................'}
              </p>

              <p className={styles.docSectionTitle}>
                3. Nội dung đề xuất kiểm tra/ Phạm vi khám:
              </p>
              <p className={styles.docContent}>
                {inspectionScope || '..............................(9)..............................'}
              </p>

              <p className={styles.docSectionTitle}>
                4. Thời hạn kiểm tra và thời điểm dự xuất tiến hành việc kiểm tra/Dự xuất thời gian và thời điểm bắt đầu thực hiện việc khám:
              </p>
              <p className={styles.docContent}>
                {inspectionTime || '..............................(10)..............................'}
              </p>

              <p className={styles.docSectionTitle}>
                5. Hành vi vi phạm hành chính dự kiến và tang vật, phương tiện vi phạm hành chính có liên quan/văn bản tuy quyền pháp luật được áp dụng:
              </p>
              <p className={styles.docContent}>
                {expectedViolation || '..............................(11)..............................'}
              </p>

              <p className={styles.docContent}>
                Kính đề nghị {recipient || '................(5)................'} xem xét, chỉ đạo./
              </p>

              {/* Footer */}
              <div className={styles.docFooter}>
                <div className={styles.docFooterLeft}></div>
                <div className={styles.docFooterRight}>
                  <p className={styles.docFooterTitle}>NGƯỜI ĐỀ XUẤT</p>
                  <p className={styles.docFooterSubtitle}>(Ký và ghi rõ họ tên)</p>
                  <p className={styles.docFooterName}>{proposerName}</p>
                </div>
              </div>

              {/* Footnote */}
              <p className={styles.docFootnote}>
                * Mẫu này được sử dụng để công chức Quản lý thị trường thực thi công vụ thực hiện đề xuất cơ quan, người có thẩm quyền theo quy định tại Pháp lệnh Quản lý thị trường và Thông tư của Bộ trưởng Bộ Công Thương quy định về nội dung, trình tự, thủ tục hoạt động kiểm tra, xử lý vi phạm hành chính và thực hiện pháp luật nghiệp vụ của lực lượng Quản lý thị trường trong trường hợp văn bản báo cáo của kết quả thực hiện biện pháp nghiệp vụ hoặc kết quả phản hành chính và thực hiện pháp luật nghiệp vụ của lực lượng Quản lý thị trường.
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
            <FileDown size={24} className={styles.headerIcon} />
            <div>
              <h2 className={styles.title}>Mẫu số 09. Đề xuất kiểm tra đột xuất</h2>
              <p className={styles.subtitle}>Đề xuất kiểm tra đột xuất việc chấp hành pháp luật theo mẫu chính thức</p>
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
                  value={proposalNumber}
                  onChange={(e) => setProposalNumber(e.target.value)}
                  placeholder="VD: 123/DX-QLTT"
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
                Chủ đề kiểm tra/Khám (4) <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                className={styles.input}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="VD: Kiểm tra an toàn thực phẩm"
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
              <label className={styles.label}>Căn cứ (6)</label>
              <textarea
                className={styles.textarea}
                value={legalBasis}
                onChange={(e) => setLegalBasis(e.target.value)}
                placeholder="Nhập căn cứ pháp lý (đã auto-fill từ M03 nếu có)"
                rows={2}
              />
            </div>
          </div>

          {/* Section 4: Proposer Info */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Thông tin người đề xuất</h3>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Tôi là <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                className={styles.input}
                value={proposerName}
                onChange={(e) => setProposerName(e.target.value)}
                placeholder="Họ và tên người đề xuất"
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Chức vụ</label>
                <input
                  type="text"
                  className={styles.input}
                  value={proposerPosition}
                  onChange={(e) => setProposerPosition(e.target.value)}
                  placeholder="VD: Trưởng phòng"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Đơn vị</label>
                <input
                  type="text"
                  className={styles.input}
                  value={proposerUnit}
                  onChange={(e) => setProposerUnit(e.target.value)}
                  placeholder="Tên đơn vị"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Inspection Details */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Nội dung đề xuất</h3>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>
                1. Tên, địa chỉ của đối tượng được kiểm tra (7) <span className={styles.required}>*</span>
              </label>
              <textarea
                className={styles.textarea}
                value={targetInfo}
                onChange={(e) => setTargetInfo(e.target.value)}
                placeholder="Nhập thông tin đối tượng kiểm tra..."
                rows={3}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                2. Địa điểm đề xuất kiểm tra/ Nội dung việc khám (8)
              </label>
              <textarea
                className={styles.textarea}
                value={inspectionLocation}
                onChange={(e) => setInspectionLocation(e.target.value)}
                placeholder="Nhập địa điểm và nội dung kiểm tra..."
                rows={2}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                3. Nội dung đề xuất kiểm tra/ Phạm vi khám (9)
              </label>
              <textarea
                className={styles.textarea}
                value={inspectionScope}
                onChange={(e) => setInspectionScope(e.target.value)}
                placeholder="Nhập phạm vi kiểm tra..."
                rows={2}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                4. Thời hạn kiểm tra và thời điểm dự xuất (10)
              </label>
              <textarea
                className={styles.textarea}
                value={inspectionTime}
                onChange={(e) => setInspectionTime(e.target.value)}
                placeholder="Nhập thời hạn và thời điểm kiểm tra..."
                rows={2}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                5. Hành vi vi phạm dự kiến và tang vật (11)
              </label>
              <textarea
                className={styles.textarea}
                value={expectedViolation}
                onChange={(e) => setExpectedViolation(e.target.value)}
                placeholder="Nhập hành vi vi phạm dự kiến (nếu có)..."
                rows={2}
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
            disabled={isSubmitting || !targetInfo.trim() || !proposerName.trim()}
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