import React, { useState } from 'react';
import { FileText, Upload, Eye, X, Download } from 'lucide-react';
import { toast } from 'sonner';
import type { InspectionTask } from '@/app/data/inspection-tasks-mock-data';
import { generateForm06Document } from '@/app/utils/docx-generator';
import styles from './Form06Modal.module.css';

interface Form06ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: InspectionTask | null;
}

export function Form06Modal({ open, onOpenChange, task }: Form06ModalProps) {
  if (!open || !task) return null;

  // Generate smart default values from task data
  const generateDefaultContent = () => {
    return `Tại thời điểm kiểm tra ngày ${new Date().toLocaleDateString('vi-VN')}, đoàn kiểm tra đã tiến hành kiểm tra tại ${task.targetName}, địa chỉ: ${task.targetAddress}.

Kết quả kiểm tra:
- Đối tượng kiểm tra: ${task.targetName}
- Thời gian kiểm tra: ${task.startDate ? new Date(task.startDate).toLocaleString('vi-VN') : new Date().toLocaleString('vi-VN')}
- Trưởng đoàn: ${task.assignee.name}

Nội dung kiểm tra được thực hiện theo đúng quy trình và phát hiện các vấn đề cần xử lý.`;
  };

  const [formNumber, setFormNumber] = useState(`${task.code}/BB-KT`);
  const [issueDate, setIssueDate] = useState(new Date().toLocaleDateString('vi-VN'));
  const [issuePlace, setIssuePlace] = useState('TP. Hồ Chí Minh');
  
  // Legal basis
  const [legalBasis, setLegalBasis] = useState('Luật An toàn thực phẩm 2010; Nghị định 115/2018/NĐ-CP');
  const [decisionNumber, setDecisionNumber] = useState('01/QĐ-KT');
  const [decisionDate, setDecisionDate] = useState('10/01/2026');
  
  // Facility info
  const [facilityName, setFacilityName] = useState(task.targetName);
  const [facilityAddress, setFacilityAddress] = useState(task.targetAddress);
  const [facilityRep, setFacilityRep] = useState('Nguyễn Văn A');
  const [facilityPosition, setFacilityPosition] = useState('Giám đốc');
  const [businessLicense, setBusinessLicense] = useState('0123456789');
  
  // Inspection team
  const [organization, setOrganization] = useState('Sở Công Thương TP.HCM');
  const [teamLeader, setTeamLeader] = useState(task.assignee.name);
  const [teamMembers, setTeamMembers] = useState('Trần Văn B - Thanh tra viên; Lê Thị C - Chuyên viên');
  
  // Timing
  const [startTime, setStartTime] = useState(
    task.startDate ? new Date(task.startDate).toLocaleString('vi-VN') : new Date().toLocaleString('vi-VN')
  );
  const [endTime, setEndTime] = useState(new Date().toLocaleString('vi-VN'));
  const [location, setLocation] = useState(task.targetAddress);
  
  // Content
  const [inspectionContent, setInspectionContent] = useState(generateDefaultContent());
  const [violations, setViolations] = useState('Không có giấy chứng nhận ATTP (Nghị định 115/2018/NĐ-CP, Điều 15)');
  const [subjectOpinion, setSubjectOpinion] = useState('Tôi xin nhận đầy đủ các vi phạm mà Đoàn kiểm tra đã chỉ ra. Cam kết khắc phục trong 15 ngày.');
  const [teamOpinion, setTeamOpinion] = useState('Yêu cầu cơ sở khắc phục ngay các vi phạm. Đoàn kiểm tra sẽ kiểm tra lại sau 15 ngày.');
  
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    onOpenChange(false);
  };

  const handlePreview = () => {
    if (!facilityName.trim() || !teamLeader.trim()) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }
    setShowPreview(true);
  };

  const handleDownload = async () => {
    if (!facilityName.trim() || !teamLeader.trim()) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    try {
      await generateForm06Document({
        formNumber,
        issueDate,
        issuePlace,
        organization,
        legalBasis: legalBasis.split(';').map(s => s.trim()),
        decisionNumber,
        decisionDate,
        facilityName,
        facilityAddress,
        facilityRep,
        facilityPosition,
        businessLicense,
        teamLeader,
        teamMembers: teamMembers.split(';').map(s => s.trim()),
        startTime,
        endTime,
        location,
        inspectionContent,
        violations,
        subjectOpinion,
        teamOpinion,
      });
      
      toast.success('Đã tải xuống biên bản kiểm tra');
    } catch (error) {
      toast.error('Không thể tải xuống biên bản');
      console.error('Error generating DOCX:', error);
    }
  };

  const handleSubmitToINS = async () => {
    if (!facilityName.trim() || !teamLeader.trim()) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Đã đẩy biên bản kiểm tra lên hệ thống INS thành công');
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
              <FileText size={24} />
              <div>
                <h2 className={styles.previewTitle}>Xem trước - Biên bản kiểm tra</h2>
                <p className={styles.previewSubtitle}>Mẫu số 06</p>
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
                  <p className={styles.docHeaderUnderline}>_______________</p>
                  <p className={styles.docHeaderNumber}>Số: {formNumber}</p>
                </div>
                <div className={styles.docHeaderRight}>
                  <p className={styles.docHeaderTitle}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
                  <p className={styles.docHeaderSubtitle}>Độc lập - Tự do - Hạnh phúc</p>
                  <p className={styles.docHeaderUnderline}>_______________</p>
                  <p className={styles.docHeaderDate}>{issuePlace}, {issueDate}</p>
                </div>
              </div>

              {/* Title */}
              <h1 className={styles.docTitle}>BIÊN BẢN KIỂM TRA</h1>
              <p className={styles.docSubtitle}>(Ban hành kèm theo Thông tư số 27/2018/TT-BCT)</p>

              {/* Content */}
              <div className={styles.docContent}>
                <p><strong>Căn cứ pháp lý:</strong> {legalBasis}</p>
                <p><strong>Quyết định kiểm tra số:</strong> {decisionNumber} ngày {decisionDate}</p>
                
                <p className={styles.docSection}><strong>I. THÔNG TIN CƠ SỞ KIỂM TRA</strong></p>
                <p>- Tên cơ sở: {facilityName}</p>
                <p>- Địa chỉ: {facilityAddress}</p>
                <p>- Người đại diện: {facilityRep} - Chức vụ: {facilityPosition}</p>
                <p>- Giấy phép kinh doanh số: {businessLicense}</p>

                <p className={styles.docSection}><strong>II. ĐOÀN KIỂM TRA</strong></p>
                <p>- Cơ quan: {organization}</p>
                <p>- Trưởng đoàn: {teamLeader}</p>
                <p>- Thành viên: {teamMembers}</p>

                <p className={styles.docSection}><strong>III. THỜI GIAN VÀ ĐỊA ĐIỂM</strong></p>
                <p>- Thời gian bắt đầu: {startTime}</p>
                <p>- Thời gian kết thúc: {endTime}</p>
                <p>- Địa điểm: {location}</p>

                <p className={styles.docSection}><strong>IV. NỘI DUNG KIỂM TRA</strong></p>
                <div className={styles.docParagraph}>{inspectionContent}</div>

                <p className={styles.docSection}><strong>V. VI PHẠT HIỆN</strong></p>
                <div className={styles.docParagraph}>{violations}</div>

                <p className={styles.docSection}><strong>VI. Ý KIẾN CỦA ĐỐI TƯỢNG KIỂM TRA</strong></p>
                <div className={styles.docParagraph}>{subjectOpinion}</div>

                <p className={styles.docSection}><strong>VII. Ý KIẾN CỦA ĐOÀN KIỂM TRA</strong></p>
                <div className={styles.docParagraph}>{teamOpinion}</div>
              </div>

              {/* Signature */}
              <div className={styles.docFooter}>
                <div className={styles.docFooterLeft}>
                  <p className={styles.docFooterTitle}>ĐẠI DIỆN CƠ SỞ</p>
                  <p className={styles.docFooterSubtitle}>(Ký và ghi rõ họ tên)</p>
                  <p className={styles.docFooterName}>{facilityRep}</p>
                </div>
                <div className={styles.docFooterRight}>
                  <p className={styles.docFooterTitle}>TRƯỞNG ĐOÀN KIỂM TRA</p>
                  <p className={styles.docFooterSubtitle}>(Ký và ghi rõ họ tên)</p>
                  <p className={styles.docFooterName}>{teamLeader}</p>
                </div>
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
            <FileText size={24} className={styles.headerIcon} />
            <div>
              <h2 className={styles.title}>Mẫu số 06. Biên bản kiểm tra</h2>
              <p className={styles.subtitle}>Lập biên bản kiểm tra theo mẫu chính thức</p>
            </div>
          </div>
          <button onClick={handleClose} className={styles.closeButton} aria-label="Đóng">
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
                  Số biên bản <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.input}
                  value={formNumber}
                  onChange={(e) => setFormNumber(e.target.value)}
                  placeholder="VD: NV-2025/001/BB-KT"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Ngày lập</label>
                <input
                  type="text"
                  className={styles.input}
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  placeholder="VD: 15/01/2025"
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Địa danh</label>
                <input
                  type="text"
                  className={styles.input}
                  value={issuePlace}
                  onChange={(e) => setIssuePlace(e.target.value)}
                  placeholder="VD: TP. Hồ Chí Minh"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Cơ quan</label>
                <input
                  type="text"
                  className={styles.input}
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="VD: Sở Công Thương TP.HCM"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Legal Basis */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Căn cứ pháp lý</h3>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Văn bản pháp lý (phân cách bằng dấu ;)</label>
              <textarea
                className={styles.textarea}
                value={legalBasis}
                onChange={(e) => setLegalBasis(e.target.value)}
                placeholder="VD: Luật An toàn thực phẩm 2010; Nghị định 115/2018/NĐ-CP"
                rows={2}
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Số quyết định kiểm tra</label>
                <input
                  type="text"
                  className={styles.input}
                  value={decisionNumber}
                  onChange={(e) => setDecisionNumber(e.target.value)}
                  placeholder="VD: 01/QĐ-KT"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Ngày quyết định</label>
                <input
                  type="text"
                  className={styles.input}
                  value={decisionDate}
                  onChange={(e) => setDecisionDate(e.target.value)}
                  placeholder="VD: 10/01/2026"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Facility Info */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Thông tin cơ sở kiểm tra</h3>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Tên cơ sở <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                className={styles.input}
                value={facilityName}
                onChange={(e) => setFacilityName(e.target.value)}
                placeholder="Tên cơ sở kiểm tra"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Địa chỉ</label>
              <input
                type="text"
                className={styles.input}
                value={facilityAddress}
                onChange={(e) => setFacilityAddress(e.target.value)}
                placeholder="Địa chỉ cơ sở"
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Người đại diện</label>
                <input
                  type="text"
                  className={styles.input}
                  value={facilityRep}
                  onChange={(e) => setFacilityRep(e.target.value)}
                  placeholder="Họ và tên"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Chức vụ</label>
                <input
                  type="text"
                  className={styles.input}
                  value={facilityPosition}
                  onChange={(e) => setFacilityPosition(e.target.value)}
                  placeholder="VD: Giám đốc"
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Giấy phép kinh doanh</label>
              <input
                type="text"
                className={styles.input}
                value={businessLicense}
                onChange={(e) => setBusinessLicense(e.target.value)}
                placeholder="Số giấy phép"
              />
            </div>
          </div>

          {/* Section 4: Inspection Team */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Đoàn kiểm tra</h3>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Trưởng đoàn <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                className={styles.input}
                value={teamLeader}
                onChange={(e) => setTeamLeader(e.target.value)}
                placeholder="Họ và tên trưởng đoàn"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Thành viên (phân cách bằng dấu ;)</label>
              <textarea
                className={styles.textarea}
                value={teamMembers}
                onChange={(e) => setTeamMembers(e.target.value)}
                placeholder="VD: Trần Văn B - Thanh tra viên; Lê Thị C - Chuyên viên"
                rows={2}
              />
            </div>
          </div>

          {/* Section 5: Timing */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Thời gian và địa điểm</h3>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Thời gian bắt đầu</label>
                <input
                  type="text"
                  className={styles.input}
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  placeholder="VD: 10/01/2025 08:00"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Thời gian kết thúc</label>
                <input
                  type="text"
                  className={styles.input}
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  placeholder="VD: 10/01/2025 12:00"
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Địa điểm</label>
              <input
                type="text"
                className={styles.input}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Địa điểm kiểm tra"
              />
            </div>
          </div>

          {/* Section 6: Content */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Nội dung kiểm tra</h3>
            <textarea
              className={styles.textarea}
              value={inspectionContent}
              onChange={(e) => setInspectionContent(e.target.value)}
              placeholder="Nhập nội dung kiểm tra chi tiết..."
              rows={6}
            />
          </div>

          {/* Section 7: Violations */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Vi phạm phát hiện</h3>
            <textarea
              className={styles.textarea}
              value={violations}
              onChange={(e) => setViolations(e.target.value)}
              placeholder="Mô tả các vi phạm (nếu có)..."
              rows={4}
            />
          </div>

          {/* Section 8: Opinions */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Ý kiến các bên</h3>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Ý kiến đối tượng kiểm tra</label>
              <textarea
                className={styles.textarea}
                value={subjectOpinion}
                onChange={(e) => setSubjectOpinion(e.target.value)}
                placeholder="Ý kiến của đại diện cơ sở..."
                rows={3}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Ý kiến đoàn kiểm tra</label>
              <textarea
                className={styles.textarea}
                value={teamOpinion}
                onChange={(e) => setTeamOpinion(e.target.value)}
                placeholder="Ý kiến và kết luận của đoàn kiểm tra..."
                rows={3}
              />
            </div>
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
            disabled={isSubmitting || !facilityName.trim() || !teamLeader.trim()}
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