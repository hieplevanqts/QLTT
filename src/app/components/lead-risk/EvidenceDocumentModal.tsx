import { useState } from 'react';
import { X, FileText, Eye, Download, Send } from 'lucide-react';
import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel } from 'docx';
import styles from './EvidenceDocumentModal.module.css';

interface EvidenceDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadId: string;
  leadTitle: string;
}

interface FormData {
  // Header information
  organizationLeft: string;
  documentNumber: string;
  location: string;
  date: string;
  
  // Title
  meetingPurpose: string;
  meetingTime: string;
  meetingLocation: string;
  
  // Attendees
  requesterName: string;
  requesterPosition: string;
  requesterAgency: string;
  
  // Witness (if any)
  witnessName: string;
  witnessPosition: string;
  
  // Document references
  decisionNumber1: string;
  decisionDate1: string;
  decisionNumber2: string;
  decisionDate2: string;
  
  // Permission/License reference
  licenseReference: string;
  
  // Meeting content
  meetingReason: string;
  meetingResult: string;
  
  // Meeting conclusion
  meetingConclusion: string;
  
  // Signatories
  organizerName: string;
  organizerTitle: string;
  verifierName: string;
  verifierTitle: string;
  attendeeName: string;
  attendeeAgency: string;
  agencyRepName: string;
  agencyRepTitle: string;
}

export function EvidenceDocumentModal({ isOpen, onClose, leadId, leadTitle }: EvidenceDocumentModalProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    // Header
    organizationLeft: 'Chi cục Quản lý thị trường Hà Nội',
    documentNumber: '01/BB-XMLV',
    location: 'Hà Nội',
    date: new Date().toISOString().split('T')[0],
    
    // Title
    meetingPurpose: 'Xác minh thông tin về vi phạm hành chính trong lĩnh vực QLTT',
    meetingTime: '8 giờ 30 phút, ngày 23 tháng 1 năm 2026',
    meetingLocation: 'Cửa hàng ABC, số 123 Đường XYZ, Quận Hoàn Kiếm, Hà Nội',
    
    // Attendees
    requesterName: 'Nguyễn Văn An',
    requesterPosition: 'Công chức',
    requesterAgency: 'Chi cục QLTT Hà Nội',
    
    // Witness
    witnessName: 'Trần Văn Bình',
    witnessPosition: 'Tổ trưởng',
    
    // Documents
    decisionNumber1: '123/QĐ-QLTT',
    decisionDate1: '15/01/2026',
    decisionNumber2: '456/QĐ-QLTT',
    decisionDate2: '18/01/2026',
    
    // License
    licenseReference: 'Giấy phép kinh doanh số 0123456789, cấp ngày 10/5/2024',
    
    // Content
    meetingReason: `Thực hiện nhiệm vụ kiểm tra, xác minh theo Quyết định số 123/QĐ-QLTT ngày 15/01/2026 của Chi cục trưởng Chi cục QLTT Hà Nội về việc kiểm tra hoạt động kinh doanh tại cửa hàng ABC.

Nội dung cần xác minh: Nguồn gốc, xuất xứ hàng hóa, việc chấp hành các quy định về ghi nhãn hàng hóa, niêm yết giá, và các quy định pháp luật khác trong lĩnh vực quản lý thị trường.`,
    
    meetingResult: `Qua quá trình làm việc, đoàn kiểm tra đã tiến hành:

1. Kiểm tra cơ sở vật chất, điều kiện kinh doanh tại cửa hàng
2. Kiểm tra hồ sơ, chứng từ liên quan đến hoạt động kinh doanh
3. Kiểm tra hàng hóa đang kinh doanh tại cửa hàng

Kết quả:
- Tổng số mặt hàng kiểm tra: 150 sản phẩm
- Phát hiện 25 sản phẩm không có hóa đơn, chứng từ chứng minh nguồn gốc hợp pháp
- Phát hiện 10 sản phẩm không ghi nhãn đầy đủ theo quy định
- Cơ sở chưa niêm yết giá đối với 30 sản phẩm

Chủ cơ sở đã giải trình và cung cấp một số thông tin, tài liệu liên quan.`,
    
    meetingConclusion: `Biên bản này được lập thành 04 bản có nội dung và giá trị như nhau; đã đọc lại cho những người có tên nêu trên cùng nghe, cùng nhận là đúng và ký tên dưới đây; 01 bản giao cho cá nhân/đại diện tổ chức xác minh/làm việc, 01 bản lưu hồ sơ vụ việc và 01 bản giao cho ...; ./.`,
    
    // Signatories
    organizerName: 'NGUYỄN VĂN AN',
    organizerTitle: 'Công chức Chi cục QLTT HN',
    verifierName: 'TRẦN VĂN BÌNH',
    verifierTitle: 'Tổ trưởng',
    attendeeName: 'LÊ THỊ HƯƠNG',
    attendeeAgency: 'Chủ cửa hàng ABC',
    agencyRepName: 'PHẠM VĂN CƯỜNG',
    agencyRepTitle: 'Phó Chi cục trưởng',
  });

  if (!isOpen) return null;

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  const generateDocumentContent = () => {
    // Parse date from YYYY-MM-DD format
    const dateParts = formData.date.split('-');
    const day = dateParts[2];
    const month = dateParts[1];
    const year = dateParts[0];
    
    return `.....................(1)...............                           CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
.......................................                                            Độc lập - Tự do - Hạnh phúc
                                                                                  _______________
Số: ${formData.documentNumber}                               ...(2)..., ngày ${day} tháng ${month} năm ${year}

                                        BIÊN BẢN XÁC MINH/LÀM VIỆC*

Căn cứ ��………………………………(3)……………………………………………,
Vào hồi ... giờ ..., phút, ngày ... tháng ... năm ......, tại ………(4)……………
Đại diện …………………………….(5)………………………………………………….:
- Ông (bà): …………………………                   Chức vụ: …………………………..
Đại diện cơ quan, đơn vị phối hợp (nếu có):
- Ông (bà): …………………………
Chức vụ: …………………………..                      Cơ quan/Đơn vị: ………………
Người chứng kiến (nếu có):
- Ong (bà): …………………………..
Địa chỉ/Đơn vị: …………………...……

Số CC/CCCD/ /GPLX/hộ chiếu: …………… cấp ngày …….. tại ……………
Tiến hành xác minh/làm việc với:
- Ông/(bà): ...........................................
Nghề nghiệp/chức vụ: .........................                     Cơ quan/Đơn vị: ........................
Địa chỉ/ quốc tịch: .................................................................................................
Số CC/CCCD/ GPLX/hộ chiếu: .................... cấp ngày........... tại: .................
Hoặc Đại diện tổ chức: .......................................................................................
theo Giấy ủy quyền/Giấy giới thiệu (nếu có) số: ...... ngày ..... tháng ..... năm ......
của ....................................................................................................................................

Lý do xác minh/làm việc: .....................(6).........................................................
Nội dung xác minh/làm việc xây 3 liên quan các bên có liên quan:
...................................................................(7)........................................................
            Buổi xác minh/làm việc kết thúc vào hồi ...... giờ ..... ngày ..... tháng .... năm ........

Biên bản này được lập thành .... bản có nội dung và giá trị như nhau; đã đọc lại cho những người có tên nêu trên cùng nghe, cùng nhận là đúng và ký tên dưới đây; 01 bản giao cho cá nhân/đại diện tổ chức xác minh/làm việc, 01 bản lưu hồ sơ vụ việc và .... bản giao cho ....; ./.

CÁ NHÂN/ĐAI              CÁ NHÂN/ĐẠI               NGƯỜI                    ĐẠI DIỆN                   ĐẠI DIỆN
DIỆN TỔ CHỨC           DIỆN TỔ CHỨC          CHỨNG KIẾN            CƠ QUAN               CƠ QUAN/ĐƠN VỊ
   LÀM VIỆC                  XÁC MINH            (Ký, ghi rõ họ, tên)      PHỐI HỢP          LY THỊ TRƯỞNG
(Ký, ghi rõ họ, tên)      (Ký, ghi rõ họ, tên)                                  (Ký, ghi rõ họ, tên)      (Ký, ghi rõ họ, tên)


${formData.attendeeName}         ${formData.verifierName}                                                                 ${formData.agencyRepName}
${formData.attendeeAgency}       ${formData.verifierTitle}                                                                ${formData.agencyRepTitle}


---
Tài liệu được tạo từ hệ thống MAPPA Portal
Lead ID: ${leadId}
`;
  };

  const handleDownload = async () => {
    // Parse date from YYYY-MM-DD format
    const dateParts = formData.date.split('-');
    const day = dateParts[2];
    const month = dateParts[1];
    const year = dateParts[0];

    // Generate Word document with exact format as preview
    const doc = new Document({
      sections: [{
        properties: {
          page: {
            margin: {
              top: 1440,    // 1 inch
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        children: [
          // Header line 1: Organization (left) and Vietnam header (right)
          new Paragraph({
            children: [
              new TextRun({
                text: '.....................(1)...............',
                size: 24,
              }),
              new TextRun({
                text: '                           CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM',
                bold: true,
                size: 26,
              }),
            ],
            spacing: { after: 60 },
          }),
          
          // Header line 2: Dots (left) and slogan (right)
          new Paragraph({
            children: [
              new TextRun({
                text: '.......................................',
                size: 24,
              }),
              new TextRun({
                text: '                                            Độc lập - Tự do - Hạnh phúc',
                size: 24,
              }),
            ],
            spacing: { after: 60 },
          }),

          // Underline
          new Paragraph({
            children: [
              new TextRun({
                text: '                                                                                  _______________',
                size: 24,
              }),
            ],
            spacing: { after: 120 },
          }),
          
          // Document number and date
          new Paragraph({
            children: [
              new TextRun({
                text: `Số: ${formData.documentNumber}`,
                size: 24,
              }),
              new TextRun({
                text: `                               ...(2)..., ngày ${day} tháng ${month} năm ${year}`,
                italics: true,
                size: 24,
              }),
            ],
            spacing: { after: 360 },
          }),
          
          // Title "BIÊN BẢN XÁC MINH/LÀM VIỆC*"
          new Paragraph({
            children: [
              new TextRun({
                text: 'BIÊN BẢN XÁC MINH/LÀM VIỆC*',
                bold: true,
                size: 32,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 360 },
          }),
          
          // Form content - all fields with proper formatting
          new Paragraph({
            children: [
              new TextRun({
                text: 'Căn cứ …………………………………(3)……………………………………………,',
                size: 24,
              }),
            ],
            spacing: { after: 120 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: 'Vào hồi ... giờ ..., phút, ngày ... tháng ... năm ......, tại ………(4)……………',
                size: 24,
              }),
            ],
            spacing: { after: 120 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: 'Đại diện …………………………….(5)………………………………………………….:',
                size: 24,
              }),
            ],
            spacing: { after: 120 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: '- Ông (bà): …………………………                   Chức vụ: …………………………..',
                size: 24,
              }),
            ],
            spacing: { after: 120 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: 'Đại diện cơ quan, đơn vị phối hợp (nếu có):',
                size: 24,
              }),
            ],
            spacing: { after: 60 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: '- Ông (bà): …………………………',
                size: 24,
              }),
            ],
            spacing: { after: 60 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: 'Chức vụ: …………………………..                      Cơ quan/Đơn vị: ………………',
                size: 24,
              }),
            ],
            spacing: { after: 120 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: 'Người chứng kiến (nếu có):',
                size: 24,
              }),
            ],
            spacing: { after: 60 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: '- Ong (bà): …………………………..',
                size: 24,
              }),
            ],
            spacing: { after: 60 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: 'Địa chỉ/Đơn vị: …………………...……',
                size: 24,
              }),
            ],
            spacing: { after: 120 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: 'Số CC/CCCD/ /GPLX/hộ chiếu: …………… cấp ngày …….. tại ……………',
                size: 24,
              }),
            ],
            spacing: { after: 120 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: 'Tiến hành xác minh/làm việc với:',
                size: 24,
              }),
            ],
            spacing: { after: 60 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: '- Ông/(bà): ...........................................',
                size: 24,
              }),
            ],
            spacing: { after: 60 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: 'Nghề nghiệp/chức vụ: .........................                     Cơ quan/Đơn vị: ........................',
                size: 24,
              }),
            ],
            spacing: { after: 60 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: 'Địa chỉ/ quốc tịch: .................................................................................................',
                size: 24,
              }),
            ],
            spacing: { after: 60 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: 'Số CC/CCCD/ GPLX/hộ chiếu: .................... cấp ngày........... tại: .................',
                size: 24,
              }),
            ],
            spacing: { after: 120 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: 'Hoặc Đại diện tổ chức: .......................................................................................',
                size: 24,
              }),
            ],
            spacing: { after: 60 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: 'theo Giấy ủy quyền/Giấy giới thiệu (nếu có) số: ...... ngày ..... tháng ..... năm ......',
                size: 24,
              }),
            ],
            spacing: { after: 60 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: 'của ....................................................................................................................................',
                size: 24,
              }),
            ],
            spacing: { after: 240 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: 'Lý do xác minh/làm việc: .....................(6).........................................................',
                size: 24,
              }),
            ],
            spacing: { after: 120 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: 'Nội dung xác minh/làm việc xây 3 liên quan các bên có liên quan:',
                size: 24,
              }),
            ],
            spacing: { after: 60 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: '...................................................................(7)........................................................',
                size: 24,
              }),
            ],
            spacing: { after: 120 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: '            Buổi xác minh/làm việc kết thúc vào hồi ...... giờ ..... ngày ..... tháng .... năm ........',
                size: 24,
              }),
            ],
            spacing: { after: 360 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: 'Biên bản này được lập thành .... bản có nội dung và giá trị như nhau; đã đọc lại cho những người có tên nêu trên cùng nghe, cùng nhận là đúng và ký tên dưới đây; 01 bản giao cho cá nhân/đại diện tổ chức xác minh/làm việc, 01 bản lưu hồ sơ vụ việc và .... bản giao cho ....; ./.',
                size: 24,
              }),
            ],
            spacing: { after: 360 },
          }),

          // Signature table
          new Paragraph({
            children: [
              new TextRun({
                text: 'CÁ NHÂN/ĐAI              CÁ NHÂN/ĐẠI               NGƯỜI                    ĐẠI DIỆN                   ĐẠI DIỆN',
                bold: true,
                size: 20,
              }),
            ],
            spacing: { after: 60 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: 'DIỆN TỔ CHỨC           DIỆN TỔ CHỨC          CHỨNG KIẾN            CƠ QUAN               CƠ QUAN/ĐƠN VỊ',
                bold: true,
                size: 20,
              }),
            ],
            spacing: { after: 60 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: '   LÀM VIỆC                  XÁC MINH            (Ký, ghi rõ họ, tên)      PHỐI HỢP          LY THỊ TRƯỞNG',
                bold: true,
                size: 20,
              }),
            ],
            spacing: { after: 60 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: '(Ký, ghi rõ họ, tên)      (Ký, ghi rõ họ, tên)                                  (Ký, ghi rõ họ, tên)      (Ký, ghi rõ họ, tên)',
                size: 18,
                italics: true,
              }),
            ],
            spacing: { after: 480 },
          }),

          // Signatory names
          new Paragraph({
            children: [
              new TextRun({
                text: `${formData.attendeeName}         ${formData.verifierName}                                                                 ${formData.agencyRepName}`,
                bold: true,
                size: 22,
              }),
            ],
            spacing: { after: 60 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: `${formData.attendeeAgency}       ${formData.verifierTitle}                                                                ${formData.agencyRepTitle}`,
                size: 20,
              }),
            ],
            spacing: { after: 360 },
          }),

          // Footer
          new Paragraph({
            children: [
              new TextRun({
                text: '---',
                size: 20,
              }),
            ],
            spacing: { after: 60 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: 'Tài liệu được tạo từ hệ thống MAPPA Portal',
                size: 18,
                italics: true,
              }),
            ],
            spacing: { after: 30 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: `Lead ID: ${leadId}`,
                size: 18,
                italics: true,
              }),
            ],
          }),
        ],
      }],
    });

    // Download the file
    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Bien-ban-xac-minh-${leadId}-${formData.date}.docx`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePushToINS = () => {
    alert('🚀 Đang đẩy biên bản sang hệ thống INS...');
    // TODO: Implement actual push to INS
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={showPreview ? styles.previewContainer : styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={showPreview ? styles.previewHeader : styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.iconWrapper}>
              <FileText className={styles.headerIcon} />
            </div>
            <div>
              <h2 className={styles.title}>Biên bản xác minh/làm việc</h2>
              <p className={styles.subtitle}>Lead: {leadTitle}</p>
            </div>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className={showPreview ? styles.previewBody : styles.body}>
          {!showPreview ? (
            <>
              {/* Section 1: Header Information */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>1. Thông tin tiêu đề</h3>
                
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Tên cơ quan (phía trái)</label>
                  <input
                    className={styles.input}
                    type="text"
                    value={formData.organizationLeft}
                    onChange={(e) => handleInputChange('organizationLeft', e.target.value)}
                    placeholder="Ví dụ: Chi cục Quản lý thị trường Hà Nội"
                  />
                </div>

                <div className={styles.row}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Số biên bản</label>
                    <input
                      className={styles.input}
                      type="text"
                      value={formData.documentNumber}
                      onChange={(e) => handleInputChange('documentNumber', e.target.value)}
                      placeholder="Ví dụ: 01/BB-XMLV"
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Địa điểm</label>
                    <input
                      className={styles.input}
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="Ví dụ: Hà Nội"
                    />
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Ngày lập biên bản</label>
                  <input
                    className={styles.input}
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                  />
                </div>
              </div>

              {/* Section 2: Meeting Details */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>2. Thông tin buổi làm việc</h3>
                
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Căn cứ (3)</label>
                  <textarea
                    className={styles.textarea}
                    value={formData.meetingPurpose}
                    onChange={(e) => handleInputChange('meetingPurpose', e.target.value)}
                    rows={2}
                    placeholder="Căn cứ pháp lý..."
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Thời gian làm việc</label>
                  <input
                    className={styles.input}
                    type="text"
                    value={formData.meetingTime}
                    onChange={(e) => handleInputChange('meetingTime', e.target.value)}
                    placeholder="8 giờ 30 phút, ngày 23 tháng 1 năm 2026"
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Địa điểm làm việc (4)</label>
                  <input
                    className={styles.input}
                    type="text"
                    value={formData.meetingLocation}
                    onChange={(e) => handleInputChange('meetingLocation', e.target.value)}
                    placeholder="Cửa hàng ABC, số 123..."
                  />
                </div>
              </div>

              {/* Section 3: Participants */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>3. Đại diện cơ quan (5)</h3>
                
                <div className={styles.row}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Họ và tên</label>
                    <input
                      className={styles.input}
                      type="text"
                      value={formData.requesterName}
                      onChange={(e) => handleInputChange('requesterName', e.target.value)}
                      placeholder="Nguyễn Văn An"
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Chức vụ</label>
                    <input
                      className={styles.input}
                      type="text"
                      value={formData.requesterPosition}
                      onChange={(e) => handleInputChange('requesterPosition', e.target.value)}
                      placeholder="Công chức"
                    />
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Cơ quan/Đơn vị</label>
                  <input
                    className={styles.input}
                    type="text"
                    value={formData.requesterAgency}
                    onChange={(e) => handleInputChange('requesterAgency', e.target.value)}
                    placeholder="Chi cục QLTT Hà Nội"
                  />
                </div>
              </div>

              {/* Section 4: Witness */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>4. Người chứng kiến (nếu có)</h3>
                
                <div className={styles.row}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Họ và tên</label>
                    <input
                      className={styles.input}
                      type="text"
                      value={formData.witnessName}
                      onChange={(e) => handleInputChange('witnessName', e.target.value)}
                      placeholder="Trần Văn Bình"
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Chức vụ/Đơn vị</label>
                    <input
                      className={styles.input}
                      type="text"
                      value={formData.witnessPosition}
                      onChange={(e) => handleInputChange('witnessPosition', e.target.value)}
                      placeholder="Tổ trưởng"
                    />
                  </div>
                </div>
              </div>

              {/* Section 5: Documents */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>5. Tài liệu tham chiếu</h3>
                
                <div className={styles.row}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Số quyết định 1</label>
                    <input
                      className={styles.input}
                      type="text"
                      value={formData.decisionNumber1}
                      onChange={(e) => handleInputChange('decisionNumber1', e.target.value)}
                      placeholder="123/QĐ-QLTT"
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Ngày cấp</label>
                    <input
                      className={styles.input}
                      type="text"
                      value={formData.decisionDate1}
                      onChange={(e) => handleInputChange('decisionDate1', e.target.value)}
                      placeholder="15/01/2026"
                    />
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Số quyết định 2 (nếu có)</label>
                    <input
                      className={styles.input}
                      type="text"
                      value={formData.decisionNumber2}
                      onChange={(e) => handleInputChange('decisionNumber2', e.target.value)}
                      placeholder="456/QĐ-QLTT"
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Ngày cấp</label>
                    <input
                      className={styles.input}
                      type="text"
                      value={formData.decisionDate2}
                      onChange={(e) => handleInputChange('decisionDate2', e.target.value)}
                      placeholder="18/01/2026"
                    />
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Giấy phép/Tài liệu tham chiếu</label>
                  <input
                    className={styles.input}
                    type="text"
                    value={formData.licenseReference}
                    onChange={(e) => handleInputChange('licenseReference', e.target.value)}
                    placeholder="Giấy phép kinh doanh số..."
                  />
                </div>
              </div>

              {/* Section 6: Content */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>6. Lý do xác minh/làm việc (6)</h3>
                
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Lý do và nội dung cần xác minh</label>
                  <textarea
                    className={styles.largeTextarea}
                    value={formData.meetingReason}
                    onChange={(e) => handleInputChange('meetingReason', e.target.value)}
                    rows={6}
                    placeholder="Mô tả lý do và nội dung cần xác minh..."
                  />
                </div>
              </div>

              {/* Section 7: Result */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>7. Nội dung xác minh/làm việc (7)</h3>
                
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Kết quả làm việc</label>
                  <textarea
                    className={styles.largeTextarea}
                    value={formData.meetingResult}
                    onChange={(e) => handleInputChange('meetingResult', e.target.value)}
                    rows={8}
                    placeholder="Mô tả chi tiết kết quả làm việc, các vấn đề phát hiện..."
                  />
                </div>
              </div>

              {/* Section 8: Conclusion */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>8. Kết luận biên bản</h3>
                
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Phần kết luận</label>
                  <textarea
                    className={styles.textarea}
                    value={formData.meetingConclusion}
                    onChange={(e) => handleInputChange('meetingConclusion', e.target.value)}
                    rows={4}
                    placeholder="Biên bản này được lập thành..."
                  />
                </div>
              </div>

              {/* Section 9: Signatories */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>9. Người ký</h3>
                
                <div className={styles.row}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Cá nhân/Đại diện tổ chức làm việc</label>
                    <input
                      className={styles.input}
                      type="text"
                      value={formData.attendeeName}
                      onChange={(e) => handleInputChange('attendeeName', e.target.value)}
                      placeholder="LÊ THỊ HƯƠNG"
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Chức vụ/Cơ quan</label>
                    <input
                      className={styles.input}
                      type="text"
                      value={formData.attendeeAgency}
                      onChange={(e) => handleInputChange('attendeeAgency', e.target.value)}
                      placeholder="Chủ cửa hàng ABC"
                    />
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Cá nhân/Đại diện tổ chức xác minh</label>
                    <input
                      className={styles.input}
                      type="text"
                      value={formData.verifierName}
                      onChange={(e) => handleInputChange('verifierName', e.target.value)}
                      placeholder="TRẦN VĂN BÌNH"
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Chức vụ</label>
                    <input
                      className={styles.input}
                      type="text"
                      value={formData.verifierTitle}
                      onChange={(e) => handleInputChange('verifierTitle', e.target.value)}
                      placeholder="Tổ trưởng"
                    />
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Đại diện cơ quan/đơn vị lý thị trưởng</label>
                    <input
                      className={styles.input}
                      type="text"
                      value={formData.agencyRepName}
                      onChange={(e) => handleInputChange('agencyRepName', e.target.value)}
                      placeholder="PHẠM VĂN CƯỜNG"
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Chức vụ</label>
                    <input
                      className={styles.input}
                      type="text"
                      value={formData.agencyRepTitle}
                      onChange={(e) => handleInputChange('agencyRepTitle', e.target.value)}
                      placeholder="Phó Chi cục trưởng"
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className={styles.documentPreview}>
              <pre className={styles.previewContent}>
                {generateDocumentContent()}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          {!showPreview ? (
            <>
              <button className={styles.buttonSecondary} onClick={onClose}>
                Hủy
              </button>
              <button className={styles.buttonPrimary} onClick={handlePreview}>
                <Eye size={18} />
                Xem trước
              </button>
            </>
          ) : (
            <>
              <button className={styles.buttonSecondary} onClick={() => setShowPreview(false)}>
                Quay lại
              </button>
              <button className={styles.buttonPrimary} onClick={handleDownload}>
                <Download size={18} />
                Tải về
              </button>
              <button className={styles.buttonPrimary} onClick={handlePushToINS}>
                <Send size={18} />
                Đẩy sang INS
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}