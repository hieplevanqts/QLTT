import { Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle, Table, TableRow, TableCell, WidthType, VerticalAlign } from 'docx';
import { saveAs } from 'file-saver';

// Helper function to create Times New Roman styled text
const createTNR = (text: string, options: { bold?: boolean; italic?: boolean; size?: number } = {}) => {
  return new TextRun({
    text,
    font: 'Times New Roman',
    size: (options.size || 13) * 2, // docx uses half-points
    bold: options.bold,
    italics: options.italic,
  });
};

// Generate M08 Report Document
export async function generateM08Document(data: {
  organizationName: string;
  reportNumber: string;
  location: string;
  date: { day: string; month: string; year: string };
  subject: string;
  recipientName: string;
  legalBasis: string;
  reporterName: string;
  reporterTitle: string;
  reporterUnit: string;
  reportContent: string;
  recommendations: string;
  recipientList: string[];
  signerName: string;
}) {
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440,
              right: 1080,
              bottom: 1440,
              left: 1080,
            },
          },
        },
        children: [
          // Header row - two columns
          new Paragraph({
            children: [
              createTNR(data.organizationName.toUpperCase() || '.............................(1).............................', { bold: true, size: 13 }),
              new TextRun({ text: '\t\t\t', font: 'Times New Roman' }),
              createTNR('CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM', { bold: true, size: 13 }),
            ],
            tabStops: [
              {
                type: 'right' as any,
                position: 9000,
              },
            ],
          }),
          new Paragraph({
            children: [
              createTNR(`Số: ${data.reportNumber || '......./BC-.....(3)......'}`, { italic: true, size: 13 }),
              new TextRun({ text: '\t\t\t', font: 'Times New Roman' }),
              createTNR('Độc lập - Tự do - Hạnh phúc', { bold: true, size: 13 }),
            ],
            border: {
              bottom: {
                color: '000000',
                space: 1,
                value: BorderStyle.SINGLE,
                size: 6,
              },
            },
            tabStops: [
              {
                type: 'right' as any,
                position: 9000,
              },
            ],
            spacing: { after: 100 },
          }),
          
          // Location and date
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [
              createTNR(`...(2)..., ngày ${data.date.day} tháng ${data.date.month} năm ${data.date.year}`, { italic: true, size: 13 }),
            ],
            spacing: { after: 200 },
          }),

          // Title
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              createTNR('BÁO CÁO*', { bold: true, size: 16 }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              createTNR(`Về việc ${data.subject || '........................(4)................................'}`, { italic: true, size: 14 }),
            ],
            spacing: { after: 200 },
          }),

          // Recipient
          new Paragraph({
            children: [
              createTNR(`Kính gửi: ${data.recipientName || '.........................(5)..................................'}`, { bold: true, size: 13 }),
            ],
            spacing: { after: 200 },
          }),

          // Legal Basis
          new Paragraph({
            children: [
              createTNR('Căn cứ Thông tư của Bộ trưởng Bộ Công Thương quy định về nội dung, trình tự, thủ tục hoạt động kiểm tra, xử lý vi phạm hành chính và thực hiện pháp luật nghiệp vụ của lực lượng Quản lý thị trường ...;', { size: 13 }),
            ],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 100 },
          }),
          
          new Paragraph({
            children: [
              createTNR(`Căn cứ: ${data.legalBasis || '..............................(6)..............................'}`, { size: 13 }),
            ],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 100 },
          }),
          
          new Paragraph({
            children: [
              createTNR(`Tôi là: ${data.reporterName || '..............................'}`, { size: 13 }),
            ],
            spacing: { after: 50 },
          }),
          
          new Paragraph({
            children: [
              createTNR(`Chức vụ: ${data.reporterTitle || '..............................'}  Đơn vị: ${data.reporterUnit || '..............................'}`, { size: 13 }),
            ],
            spacing: { after: 200 },
          }),

          // Report Content Section 1
          new Paragraph({
            children: [
              createTNR(`1. Báo cáo về việc ${data.subject || '............(4).............'} như sau:`, { bold: true, size: 13 }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              createTNR(data.reportContent || '...........................................................................................(7)..............................................................................................', { size: 13 }),
            ],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 200, line: 360 },
          }),
          
          // Recommendations Section 2
          new Paragraph({
            children: [
              createTNR('2. Đề xuất, kiến nghị (nếu có):', { bold: true, size: 13 }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              createTNR(data.recommendations || '..............................(8)..............................', { size: 13 }),
            ],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 200, line: 360 },
          }),
          
          // Request
          new Paragraph({
            children: [
              createTNR(`Kính đề nghị ${data.recipientName || '................(5)................'} xem xét, quyết định./`, { size: 13 }),
            ],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 400 },
          }),

          // Footer - Recipients and Signer
          new Paragraph({
            children: [
              createTNR('Nơi nhận:', { bold: true, size: 12 }),
              new TextRun({ text: '\t\t\t\t\t\t', font: 'Times New Roman' }),
              createTNR('NGƯỜI BÁO CÁO', { bold: true, size: 13 }),
            ],
            tabStops: [
              {
                type: 'right' as any,
                position: 9000,
              },
            ],
            spacing: { before: 200 },
          }),
          
          ...data.recipientList.map((recipient, index) => 
            new Paragraph({
              children: [
                createTNR(`- ${recipient};`, { size: 12 }),
                new TextRun({ text: '\t\t\t\t\t\t', font: 'Times New Roman' }),
                index === 0 ? createTNR('(Ký và ghi rõ họ tên)', { italic: true, size: 12 }) : createTNR('', { size: 12 }),
              ],
              tabStops: [
                {
                  type: 'right' as any,
                  position: 9000,
                },
              ],
            })
          ),
          
          // Signer name
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [
              createTNR(data.signerName || '', { bold: true, size: 13 }),
            ],
            spacing: { before: 800 },
          }),
          
          // Footnote
          new Paragraph({
            children: [
              createTNR('* Mẫu này được sử dụng để công chức Quản lý thị trường thực thi công vụ thực hiện báo cáo cơ quan, người có thẩm quyền. Nếu cần báo cáo văn thư thập, tiếp nhận và xử lý theo quy định tại Pháp lệnh Quản lý thị trường và Thông quy của Bộ trưởng Bộ Công Thương; thông quy về nội dung, trình tự, thủ tục hoạt động kiểm tra, xử lý vi phạm hành chính và thực hiện pháp luật nghiệp vụ của lực lượng Quản lý thị trường và Thông quy về ban hành văn bản của cơ quan trong hệ thống Bộ Công Thương; quy định tại Pháp lệnh Quản lý thị trường và Thông quy của Bộ trưởng Bộ Công Thương về các biện pháp nghiệp vụ theo quy định tại Pháp lệnh Quản lý thị trường và Thông quy về phạm hành chính và thực hiện pháp luật nghiệp vụ của lực lượng Quản lý thị trường.', 
              { italic: true, size: 11 }),
            ],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { before: 400 },
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `Mau08-BaoCao-${Date.now()}.docx`);
}

// Generate M09 Proposal Document
export async function generateM09Document(data: {
  organizationName: string;
  proposalNumber: string;
  location: string;
  date: { day: string; month: string; year: string };
  subject: string;
  recipientName: string;
  legalBasis: string;
  proposerName: string;
  proposerTitle: string;
  proposerUnit: string;
  targetInfo: string;
  inspectionLocation: string;
  inspectionScope: string;
  inspectionTime: string;
  expectedViolation: string;
}) {
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440,
              right: 1080,
              bottom: 1440,
              left: 1080,
            },
          },
        },
        children: [
          // Header row - two columns
          new Paragraph({
            children: [
              createTNR(data.organizationName.toUpperCase() || '.............................(1).............................', { bold: true, size: 13 }),
              new TextRun({ text: '\t\t\t', font: 'Times New Roman' }),
              createTNR('CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM', { bold: true, size: 13 }),
            ],
            tabStops: [
              {
                type: 'right' as any,
                position: 9000,
              },
            ],
          }),
          new Paragraph({
            children: [
              createTNR(`Số: ${data.proposalNumber || '......./ĐX-.....(3)......'}`, { italic: true, size: 13 }),
              new TextRun({ text: '\t\t\t', font: 'Times New Roman' }),
              createTNR('Độc lập - Tự do - Hạnh phúc', { bold: true, size: 13 }),
            ],
            border: {
              bottom: {
                color: '000000',
                space: 1,
                value: BorderStyle.SINGLE,
                size: 6,
              },
            },
            tabStops: [
              {
                type: 'right' as any,
                position: 9000,
              },
            ],
            spacing: { after: 100 },
          }),
          
          // Location and date
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [
              createTNR(`${data.location}, ngày ${data.date.day} tháng ${data.date.month} năm ${data.date.year}`, { italic: true, size: 13 }),
            ],
            spacing: { after: 200 },
          }),

          // Title
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              createTNR('ĐỀ XUẤT', { bold: true, size: 16 }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              createTNR(`Kiểm tra đột xuất việc chấp hành pháp luật trong sản xuất, kinh doanh hàng hóa, dịch v/Khám ${data.subject || '....(4).....'} theo thủ tục hành chính*`, { italic: true, size: 13 }),
            ],
            spacing: { after: 200 },
          }),

          // Recipient
          new Paragraph({
            children: [
              createTNR(`Kính gửi: ${data.recipientName || '.........................(5)..................................'}`, { bold: true, size: 13 }),
            ],
            spacing: { after: 200 },
          }),

          // Legal Basis
          new Paragraph({
            children: [
              createTNR('Căn cứ Thông tư số ... ngày ... tháng ... năm ... của Bộ trưởng Bộ Công Thương quy định về nội dung, trình tự, thủ tục hoạt động kiểm tra, xử lý vi phạm hành chính và thực hiện pháp luật nghiệp vụ của lực lượng Quản lý thị trường;', { size: 13 }),
            ],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 100 },
          }),
          
          new Paragraph({
            children: [
              createTNR(`Căn cứ: ${data.legalBasis || '..............................(6)..............................'}`, { size: 13 }),
            ],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 100 },
          }),
          
          new Paragraph({
            children: [
              createTNR(`Tôi là: ${data.proposerName || '..............................'}`, { size: 13 }),
            ],
            spacing: { after: 50 },
          }),
          
          new Paragraph({
            children: [
              createTNR(`Chức vụ: ${data.proposerTitle || '..............................'}  Đơn vị: ${data.proposerUnit || '..............................'}`, { size: 13 }),
            ],
            spacing: { after: 200 },
          }),

          // Proposal intro
          new Paragraph({
            children: [
              createTNR(`Đề xuất kiểm tra đột xuất việc chấp hành pháp luật trong sản xuất, kinh doanh hàng hóa, dịch vụ/Khám ${data.subject || '....(4).....'} theo thủ tục hành chính với những nội dung sau:`, { size: 13 }),
            ],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 200 },
          }),

          // Content sections
          new Paragraph({
            children: [
              createTNR('1. Tên, địa chỉ của cá nhân, hộ kinh doanh, tổ chức hoặc cơ sở sản xuất, kinh doanh được kiểm tra/Người bị khám/Phương tiện liên quan đến việc kiểm tra:', { bold: true, size: 13 }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              createTNR(data.targetInfo || '..............................(7)..............................', { size: 13 }),
            ],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 200, line: 360 },
          }),

          new Paragraph({
            children: [
              createTNR('2. Địa điểm đề xuất kiểm tra/ Nội dung việc khám:', { bold: true, size: 13 }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              createTNR(data.inspectionLocation || '..............................(8)..............................', { size: 13 }),
            ],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 200, line: 360 },
          }),

          new Paragraph({
            children: [
              createTNR('3. Nội dung đề xuất kiểm tra/ Phạm vi khám:', { bold: true, size: 13 }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              createTNR(data.inspectionScope || '..............................(9)..............................', { size: 13 }),
            ],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 200, line: 360 },
          }),

          new Paragraph({
            children: [
              createTNR('4. Thời hạn kiểm tra và thời điểm dự xuất tiến hành việc kiểm tra/Dự xuất thời gian và thời điểm bắt đầu thực hiện việc khám:', { bold: true, size: 13 }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              createTNR(data.inspectionTime || '..............................(10)..............................', { size: 13 }),
            ],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 200, line: 360 },
          }),

          new Paragraph({
            children: [
              createTNR('5. Hành vi vi phạm hành chính dự kiến và tang vật, phương tiện vi phạm hành chính có liên quan/văn bản tuy quyền pháp luật được áp dụng:', { bold: true, size: 13 }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              createTNR(data.expectedViolation || '..............................(11)..............................', { size: 13 }),
            ],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 200, line: 360 },
          }),

          // Request
          new Paragraph({
            children: [
              createTNR(`Kính đề nghị ${data.recipientName || '................(5)................'} xem xét, chỉ đạo./`, { size: 13 }),
            ],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 400 },
          }),

          // Signature
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [
              createTNR('NGƯỜI ĐỀ XUẤT', { bold: true, size: 13 }),
            ],
            spacing: { before: 200 },
          }),
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [
              createTNR('(Ký và ghi rõ họ tên)', { italic: true, size: 12 }),
            ],
            spacing: { after: 800 },
          }),
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [
              createTNR(data.proposerName || '', { bold: true, size: 13 }),
            ],
          }),

          // Footnote
          new Paragraph({
            children: [
              createTNR('* Mẫu này được sử dụng để công chức Quản lý thị trường thực thi công vụ thực hiện đề xuất cơ quan, người có thẩm quyền theo quy định tại Pháp lệnh Quản lý thị trường và Thông tư của Bộ trưởng Bộ Công Thương quy định về nội dung, trình tự, thủ tục hoạt động kiểm tra, xử lý vi phạm hành chính và thực hiện pháp luật nghiệp vụ của lực lượng Quản lý thị trường trong trường hợp văn bản báo cáo của kết quả thực hiện biện pháp nghiệp vụ hoặc kết quả phản hành chính và thực hiện pháp luật nghiệp vụ của lực lượng Quản lý thị trường.', 
              { italic: true, size: 11 }),
            ],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { before: 400 },
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `Mau09-DeXuat-${Date.now()}.docx`);
}

// Generate Form06 Inspection Report Document
export async function generateForm06Document(data: {
  formNumber: string;
  issueDate: string;
  issuePlace: string;
  organization: string;
  legalBasis: string[];
  decisionNumber: string;
  decisionDate: string;
  facilityName: string;
  facilityAddress: string;
  facilityRep: string;
  facilityPosition: string;
  businessLicense: string;
  teamLeader: string;
  teamMembers: string[];
  startTime: string;
  endTime: string;
  location: string;
  inspectionContent: string;
  violations: string;
  subjectOpinion: string;
  teamOpinion: string;
}) {
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440,
              right: 1080,
              bottom: 1440,
              left: 1080,
            },
          },
        },
        children: [
          // Header row - two columns
          new Paragraph({
            children: [
              createTNR(data.organization.toUpperCase(), { bold: true, size: 13 }),
              new TextRun({ text: '\t\t\t', font: 'Times New Roman' }),
              createTNR('CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM', { bold: true, size: 13 }),
            ],
            tabStops: [
              {
                type: 'right' as any,
                position: 9000,
              },
            ],
          }),
          
          // Underline and subtitle
          new Paragraph({
            children: [
              createTNR('_______________', { size: 13 }),
              new TextRun({ text: '\t\t\t', font: 'Times New Roman' }),
              createTNR('Độc lập - Tự do - Hạnh phúc', { bold: true, size: 13 }),
            ],
            tabStops: [
              {
                type: 'right' as any,
                position: 9000,
              },
            ],
          }),
          
          // Form number and date
          new Paragraph({
            children: [
              createTNR(`Số: ${data.formNumber}`, { bold: true, size: 13 }),
              new TextRun({ text: '\t\t\t', font: 'Times New Roman' }),
              createTNR(`${data.issuePlace}, ${data.issueDate}`, { italic: true, size: 13 }),
            ],
            tabStops: [
              {
                type: 'right' as any,
                position: 9000,
              },
            ],
            spacing: { after: 400 },
          }),
          
          // Title
          new Paragraph({
            children: [createTNR('BIÊN BẢN KIỂM TRA', { bold: true, size: 16 })],
            alignment: AlignmentType.CENTER,
            spacing: { before: 400, after: 200 },
          }),
          
          // Subtitle
          new Paragraph({
            children: [createTNR('(Ban hành kèm theo Thông tư số 27/2018/TT-BCT)', { italic: true, size: 12 })],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),
          
          // Legal basis
          new Paragraph({
            children: [
              createTNR('Căn cứ pháp lý: ', { bold: true, size: 13 }),
              createTNR(data.legalBasis.join('; '), { size: 13 }),
            ],
            spacing: { after: 200 },
          }),
          
          new Paragraph({
            children: [
              createTNR('Quyết định kiểm tra số: ', { bold: true, size: 13 }),
              createTNR(`${data.decisionNumber} ngày ${data.decisionDate}`, { size: 13 }),
            ],
            spacing: { after: 400 },
          }),
          
          // Section I: Facility Info
          new Paragraph({
            children: [createTNR('I. THÔNG TIN CƠ SỞ KIỂM TRA', { bold: true, size: 13 })],
            spacing: { before: 200, after: 200 },
          }),
          
          new Paragraph({
            children: [createTNR(`- Tên cơ sở: ${data.facilityName}`, { size: 13 })],
            spacing: { after: 100 },
          }),
          
          new Paragraph({
            children: [createTNR(`- Địa chỉ: ${data.facilityAddress}`, { size: 13 })],
            spacing: { after: 100 },
          }),
          
          new Paragraph({
            children: [createTNR(`- Người đại diện: ${data.facilityRep} - Chức vụ: ${data.facilityPosition}`, { size: 13 })],
            spacing: { after: 100 },
          }),
          
          new Paragraph({
            children: [createTNR(`- Giấy phép kinh doanh số: ${data.businessLicense}`, { size: 13 })],
            spacing: { after: 300 },
          }),
          
          // Section II: Inspection Team
          new Paragraph({
            children: [createTNR('II. ĐOÀN KIỂM TRA', { bold: true, size: 13 })],
            spacing: { before: 200, after: 200 },
          }),
          
          new Paragraph({
            children: [createTNR(`- Cơ quan: ${data.organization}`, { size: 13 })],
            spacing: { after: 100 },
          }),
          
          new Paragraph({
            children: [createTNR(`- Trưởng đoàn: ${data.teamLeader}`, { size: 13 })],
            spacing: { after: 100 },
          }),
          
          new Paragraph({
            children: [createTNR(`- Thành viên: ${data.teamMembers.join('; ')}`, { size: 13 })],
            spacing: { after: 300 },
          }),
          
          // Section III: Timing
          new Paragraph({
            children: [createTNR('III. THỜI GIAN VÀ ĐỊA ĐIỂM', { bold: true, size: 13 })],
            spacing: { before: 200, after: 200 },
          }),
          
          new Paragraph({
            children: [createTNR(`- Thời gian bắt đầu: ${data.startTime}`, { size: 13 })],
            spacing: { after: 100 },
          }),
          
          new Paragraph({
            children: [createTNR(`- Thời gian kết thúc: ${data.endTime}`, { size: 13 })],
            spacing: { after: 100 },
          }),
          
          new Paragraph({
            children: [createTNR(`- Địa điểm: ${data.location}`, { size: 13 })],
            spacing: { after: 300 },
          }),
          
          // Section IV: Content
          new Paragraph({
            children: [createTNR('IV. NỘI DUNG KIỂM TRA', { bold: true, size: 13 })],
            spacing: { before: 200, after: 200 },
          }),
          
          new Paragraph({
            children: [createTNR(data.inspectionContent, { size: 13 })],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 300, line: 360 },
          }),
          
          // Section V: Violations
          new Paragraph({
            children: [createTNR('V. VI PHẠT HIỆN', { bold: true, size: 13 })],
            spacing: { before: 200, after: 200 },
          }),
          
          new Paragraph({
            children: [createTNR(data.violations, { size: 13 })],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 300, line: 360 },
          }),
          
          // Section VI: Subject Opinion
          new Paragraph({
            children: [createTNR('VI. Ý KIẾN CỦA ĐỐI TƯỢNG KIỂM TRA', { bold: true, size: 13 })],
            spacing: { before: 200, after: 200 },
          }),
          
          new Paragraph({
            children: [createTNR(data.subjectOpinion, { size: 13 })],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 300, line: 360 },
          }),
          
          // Section VII: Team Opinion
          new Paragraph({
            children: [createTNR('VII. Ý KIẾN CỦA ĐOÀN KIỂM TRA', { bold: true, size: 13 })],
            spacing: { before: 200, after: 200 },
          }),
          
          new Paragraph({
            children: [createTNR(data.teamOpinion, { size: 13 })],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 600, line: 360 },
          }),
          
          // Signature section
          new Paragraph({
            children: [
              createTNR('ĐẠI DIỆN CƠ SỞ', { bold: true, size: 13 }),
              new TextRun({ text: '\t\t\t\t\t', font: 'Times New Roman' }),
              createTNR('TRƯỞNG ĐOÀN KIỂM TRA', { bold: true, size: 13 }),
            ],
            tabStops: [
              {
                type: 'right' as any,
                position: 9000,
              },
            ],
            spacing: { before: 400, after: 100 },
          }),
          
          new Paragraph({
            children: [
              createTNR('(Ký và ghi rõ họ tên)', { italic: true, size: 12 }),
              new TextRun({ text: '\t\t\t\t\t\t', font: 'Times New Roman' }),
              createTNR('(Ký và ghi rõ họ tên)', { italic: true, size: 12 }),
            ],
            tabStops: [
              {
                type: 'right' as any,
                position: 9000,
              },
            ],
            spacing: { after: 800 },
          }),
          
          // Signer names
          new Paragraph({
            children: [
              createTNR(data.facilityRep, { bold: true, size: 13 }),
              new TextRun({ text: '\t\t\t\t\t\t\t', font: 'Times New Roman' }),
              createTNR(data.teamLeader, { bold: true, size: 13 }),
            ],
            tabStops: [
              {
                type: 'right' as any,
                position: 9000,
              },
            ],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `Mau06-BienBan-${Date.now()}.docx`);
}

// Generate Form10 Inventory List Document
export async function generateForm10Document(data: {
  formNumber: string;
  issueDate: string;
  issuePlace: string;
  relatedForm06: string;
  organization: string;
  teamLeader: string;
  facilityName: string;
  facilityAddress: string;
  items: Array<{
    stt: string;
    name: string; // Tên tang vật/phương tiện/giấy tờ
    specifications: string; // Chủng loại, nhãn hiệu, xuất xứ, số đăng ký
    unit: string; // Đơn vị tính
    quantity: string; // Số lượng
    condition: string; // Tình trạng, đặc điểm
  }>;
}) {
  // Use static imports instead of dynamic import to avoid build warnings
  
  // Create table rows for items
  const itemRows = data.items.map(item => 
    new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph({
            children: [createTNR(item.stt, { size: 12 })],
            alignment: AlignmentType.CENTER,
          })],
          verticalAlign: VerticalAlign.CENTER,
          width: { size: 5, type: WidthType.PERCENTAGE },
        }),
        new TableCell({
          children: [new Paragraph({
            children: [createTNR(item.name, { size: 12 })],
          })],
          verticalAlign: VerticalAlign.CENTER,
          width: { size: 25, type: WidthType.PERCENTAGE },
        }),
        new TableCell({
          children: [new Paragraph({
            children: [createTNR(item.specifications, { size: 12 })],
          })],
          verticalAlign: VerticalAlign.CENTER,
          width: { size: 30, type: WidthType.PERCENTAGE },
        }),
        new TableCell({
          children: [new Paragraph({
            children: [createTNR(item.unit, { size: 12 })],
            alignment: AlignmentType.CENTER,
          })],
          verticalAlign: VerticalAlign.CENTER,
          width: { size: 10, type: WidthType.PERCENTAGE },
        }),
        new TableCell({
          children: [new Paragraph({
            children: [createTNR(item.quantity, { size: 12 })],
            alignment: AlignmentType.RIGHT,
          })],
          verticalAlign: VerticalAlign.CENTER,
          width: { size: 10, type: WidthType.PERCENTAGE },
        }),
        new TableCell({
          children: [new Paragraph({
            children: [createTNR(item.condition, { size: 12 })],
          })],
          verticalAlign: VerticalAlign.CENTER,
          width: { size: 20, type: WidthType.PERCENTAGE },
        }),
      ],
    })
  );

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440,
              right: 1080,
              bottom: 1440,
              left: 1080,
            },
          },
        },
        children: [
          // Header row - two columns
          new Paragraph({
            children: [
              createTNR(data.organization.toUpperCase(), { bold: true, size: 13 }),
              new TextRun({ text: '\t\t\t', font: 'Times New Roman' }),
              createTNR('CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM', { bold: true, size: 13 }),
            ],
            tabStops: [
              {
                type: 'right' as any,
                position: 9000,
              },
            ],
          }),
          
          // Underline and subtitle
          new Paragraph({
            children: [
              createTNR('_______________', { size: 13 }),
              new TextRun({ text: '\t\t\t', font: 'Times New Roman' }),
              createTNR('Độc lập - Tự do - Hạnh phúc', { bold: true, size: 13 }),
            ],
            tabStops: [
              {
                type: 'right' as any,
                position: 9000,
              },
            ],
          }),
          
          // Form number and date
          new Paragraph({
            children: [
              createTNR(`Số: ${data.formNumber}`, { bold: true, size: 13 }),
              new TextRun({ text: '\t\t\t', font: 'Times New Roman' }),
              createTNR(`${data.issuePlace}, ${data.issueDate}`, { italic: true, size: 13 }),
            ],
            tabStops: [
              {
                type: 'right' as any,
                position: 9000,
              },
            ],
            spacing: { after: 400 },
          }),
          
          // Title
          new Paragraph({
            children: [createTNR('BẢNG KÊ', { bold: true, size: 16 })],
            alignment: AlignmentType.CENTER,
            spacing: { before: 400, after: 100 },
          }),
          
          // Subtitle 1
          new Paragraph({
            children: [createTNR('Tang vật, phương tiện, hàng hóa, giấy tờ', { bold: true, size: 13 })],
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
          }),
          
          // Subtitle 2
          new Paragraph({
            children: [createTNR(`(Kèm theo Biên bản kiểm tra số: ${data.relatedForm06})`, { italic: true, size: 12 })],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),
          
          // Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              // Header row
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({
                      children: [createTNR('STT', { bold: true, size: 11 })],
                      alignment: AlignmentType.CENTER,
                    })],
                    verticalAlign: VerticalAlign.CENTER,
                    width: { size: 5, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [new Paragraph({
                      children: [createTNR('Tên tang vật/ phương tiện/giấy tờ', { bold: true, size: 11 })],
                      alignment: AlignmentType.CENTER,
                    })],
                    verticalAlign: VerticalAlign.CENTER,
                    width: { size: 25, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [new Paragraph({
                      children: [createTNR('Chủng loại, nhãn hiệu, xuất xứ, số đăng ký của tang vật/ phương tiện/giấy tờ', { bold: true, size: 11 })],
                      alignment: AlignmentType.CENTER,
                    })],
                    verticalAlign: VerticalAlign.CENTER,
                    width: { size: 30, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [new Paragraph({
                      children: [createTNR('Đơn vị tính', { bold: true, size: 11 })],
                      alignment: AlignmentType.CENTER,
                    })],
                    verticalAlign: VerticalAlign.CENTER,
                    width: { size: 10, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [new Paragraph({
                      children: [createTNR('Số lượng', { bold: true, size: 11 })],
                      alignment: AlignmentType.CENTER,
                    })],
                    verticalAlign: VerticalAlign.CENTER,
                    width: { size: 10, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [new Paragraph({
                      children: [createTNR('Tình trạng, đặc điểm', { bold: true, size: 11 })],
                      alignment: AlignmentType.CENTER,
                    })],
                    verticalAlign: VerticalAlign.CENTER,
                    width: { size: 20, type: WidthType.PERCENTAGE },
                  }),
                ],
              }),
              // Data rows
              ...itemRows,
            ],
          }),
          
          // Note
          new Paragraph({
            children: [createTNR('(NGỊ KÝ TÊN CỦA CÁC BÊN LIÊN QUAN)', { italic: true, size: 11 })],
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 400 },
          }),
          
          // Signature section
          new Paragraph({
            children: [
              createTNR('NGƯỜI LẬT BẢNG', { bold: true, size: 13 }),
              new TextRun({ text: '\t\t\t\t\t', font: 'Times New Roman' }),
              createTNR('TRƯỞNG ĐOÀN KIỂM TRA', { bold: true, size: 13 }),
            ],
            tabStops: [
              {
                type: 'right' as any,
                position: 9000,
              },
            ],
            spacing: { before: 400, after: 100 },
          }),
          
          new Paragraph({
            children: [
              createTNR('(Ký và ghi rõ họ tên)', { italic: true, size: 12 }),
              new TextRun({ text: '\t\t\t\t\t\t', font: 'Times New Roman' }),
              createTNR('(Ký và ghi rõ họ tên)', { italic: true, size: 12 }),
            ],
            tabStops: [
              {
                type: 'right' as any,
                position: 9000,
              },
            ],
            spacing: { after: 800 },
          }),
          
          // Signer names
          new Paragraph({
            children: [
              createTNR(data.teamLeader, { bold: true, size: 13 }),
              new TextRun({ text: '\t\t\t\t\t\t\t', font: 'Times New Roman' }),
              createTNR(data.teamLeader, { bold: true, size: 13 }),
            ],
            tabStops: [
              {
                type: 'right' as any,
                position: 9000,
              },
            ],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `Mau10-BangKe-${Date.now()}.docx`);
}