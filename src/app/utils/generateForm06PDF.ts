import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import type { InspectionTask } from '../data/inspection-tasks-mock-data';

export interface Form06Data {
  formNumber: string;
  issueDate: string;
  issuePlace: string;
  legalBasis: string[];
  decisionNumber: string;
  decisionDate: string;
  
  facility: {
    name: string;
    address: string;
    representative: string;
    position: string;
    businessLicense: string;
  };
  
  inspectionTeam: {
    organization: string;
    leader: string;
    members: string[];
  };
  
  timing: {
    startTime: string;
    endTime: string;
    location: string;
  };
  
  checklistResults: Array<{
    title: string;
    status: 'passed' | 'failed';
    description: string;
  }>;
  
  violations: Array<{
    code: string;
    title: string;
    regulation: string;
    suggestedPenalty: string;
  }>;
  
  opinions: {
    subjectOpinion: string;
    teamOpinion: string;
  };
}

export function generateForm06PDF(data: Form06Data): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Set font
  doc.setFont('times');
  
  let yPos = 20;
  const leftMargin = 25;
  const rightMargin = 185;
  const pageWidth = 210;
  const centerX = pageWidth / 2;

  // Header - Two columns
  doc.setFontSize(11);
  doc.setFont('times', 'bold');
  
  // Left side
  doc.text('UY BAN NHAN DAN TP. HO CHI MINH', leftMargin, yPos);
  yPos += 5;
  doc.text('SO CONG THUONG TP.HCM', leftMargin, yPos);
  yPos += 3;
  doc.setFont('times', 'normal');
  doc.text('_________________', leftMargin, yPos);
  yPos += 5;
  doc.setFontSize(10);
  doc.text('So: ' + data.formNumber, leftMargin, yPos);
  
  // Right side
  yPos = 20;
  doc.setFontSize(11);
  doc.setFont('times', 'bold');
  const rightText1 = 'CONG HOA XA HOI CHU NGHIA VIET NAM';
  doc.text(rightText1, rightMargin - doc.getTextWidth(rightText1), yPos);
  yPos += 5;
  const rightText2 = 'Doc lap - Tu do - Hanh phuc';
  doc.text(rightText2, rightMargin - doc.getTextWidth(rightText2), yPos);
  yPos += 3;
  doc.setFont('times', 'normal');
  const rightText3 = '_________________';
  doc.text(rightText3, rightMargin - doc.getTextWidth(rightText3), yPos);
  yPos += 5;
  doc.setFontSize(10);
  const rightText4 = data.issuePlace + ', ' + data.issueDate;
  doc.text(rightText4, rightMargin - doc.getTextWidth(rightText4), yPos);
  
  // Title
  yPos = 55;
  doc.setFontSize(14);
  doc.setFont('times', 'bold');
  const title1 = 'BIEN BAN KIEM TRA';
  doc.text(title1, centerX - doc.getTextWidth(title1) / 2, yPos);
  yPos += 6;
  doc.setFontSize(11);
  const title2 = 'Viec chap hanh phap luat trong san xuat,';
  doc.text(title2, centerX - doc.getTextWidth(title2) / 2, yPos);
  yPos += 5;
  const title3 = 'kinh doanh hang hoa, dich vu';
  doc.text(title3, centerX - doc.getTextWidth(title3) / 2, yPos);
  
  // Content
  yPos += 10;
  doc.setFontSize(11);
  doc.setFont('times', 'normal');
  
  // Căn cứ pháp lý
  doc.text('Can cu:', leftMargin, yPos);
  yPos += 5;
  data.legalBasis.forEach((basis) => {
    doc.text('- ' + basis, leftMargin + 5, yPos);
    yPos += 5;
  });
  
  doc.text('- Quyet dinh so ' + data.decisionNumber + ' ngay ' + data.decisionDate, leftMargin + 5, yPos);
  yPos += 8;
  
  // Đối tượng kiểm tra
  doc.setFont('times', 'bold');
  doc.text('Doi tuong kiem tra:', leftMargin, yPos);
  yPos += 5;
  doc.setFont('times', 'normal');
  doc.text('- Ten co so: ' + data.facility.name, leftMargin + 5, yPos);
  yPos += 5;
  doc.text('- Dia chi: ' + data.facility.address, leftMargin + 5, yPos);
  yPos += 5;
  doc.text('- Dai dien: ' + data.facility.representative + ' - Chuc vu: ' + data.facility.position, leftMargin + 5, yPos);
  yPos += 5;
  doc.text('- So DKKD: ' + data.facility.businessLicense, leftMargin + 5, yPos);
  yPos += 8;
  
  // Đoàn kiểm tra
  doc.setFont('times', 'bold');
  doc.text('Thanh phan Doan kiem tra:', leftMargin, yPos);
  yPos += 5;
  doc.setFont('times', 'normal');
  doc.text('- Co quan: ' + data.inspectionTeam.organization, leftMargin + 5, yPos);
  yPos += 5;
  doc.text('- Truong doan: ' + data.inspectionTeam.leader, leftMargin + 5, yPos);
  yPos += 5;
  data.inspectionTeam.members.forEach((member) => {
    doc.text('- Thanh vien: ' + member, leftMargin + 5, yPos);
    yPos += 5;
  });
  yPos += 3;
  
  // Thời gian kiểm tra
  doc.setFont('times', 'bold');
  doc.text('Thoi gian va dia diem kiem tra:', leftMargin, yPos);
  yPos += 5;
  doc.setFont('times', 'normal');
  doc.text('- Bat dau: ' + data.timing.startTime, leftMargin + 5, yPos);
  yPos += 5;
  doc.text('- Ket thuc: ' + data.timing.endTime, leftMargin + 5, yPos);
  yPos += 5;
  doc.text('- Dia diem: ' + data.timing.location, leftMargin + 5, yPos);
  yPos += 8;
  
  // Check if need new page
  if (yPos > 250) {
    doc.addPage();
    yPos = 20;
  }
  
  // Nội dung kiểm tra
  doc.setFont('times', 'bold');
  doc.setFontSize(12);
  doc.text('NOI DUNG KIEM TRA', leftMargin, yPos);
  yPos += 6;
  
  doc.setFontSize(11);
  data.checklistResults.forEach((item, index) => {
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }
    
    const statusText = item.status === 'passed' ? 'DAT' : 'KHONG DAT';
    doc.setFont('times', 'bold');
    doc.text((index + 1) + '. ' + item.title, leftMargin, yPos);
    doc.setTextColor(item.status === 'passed' ? 0 : 255, 0, 0);
    doc.text(statusText, rightMargin - 30, yPos);
    doc.setTextColor(0, 0, 0);
    yPos += 5;
    
    doc.setFont('times', 'normal');
    const lines = doc.splitTextToSize(item.description, 150);
    lines.forEach((line: string) => {
      if (yPos > 280) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(line, leftMargin + 5, yPos);
      yPos += 5;
    });
    yPos += 2;
  });
  
  // Vi phạm phát hiện
  if (data.violations.length > 0) {
    yPos += 5;
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.setFont('times', 'bold');
    doc.setFontSize(12);
    doc.text('VI PHAM PHAT HIEN', leftMargin, yPos);
    yPos += 6;
    
    doc.setFontSize(11);
    data.violations.forEach((violation, index) => {
      if (yPos > 260) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFont('times', 'bold');
      doc.text('Vi pham ' + (index + 1) + ': ' + violation.code, leftMargin, yPos);
      yPos += 5;
      
      doc.setFont('times', 'normal');
      doc.text('- Hanh vi: ' + violation.title, leftMargin + 5, yPos);
      yPos += 5;
      doc.text('- Can cu: ' + violation.regulation, leftMargin + 5, yPos);
      yPos += 5;
      doc.text('- Muc phat: ' + violation.suggestedPenalty, leftMargin + 5, yPos);
      yPos += 7;
    });
  }
  
  // Ý kiến các bên
  if (yPos > 200) {
    doc.addPage();
    yPos = 20;
  }
  
  yPos += 5;
  doc.setFont('times', 'bold');
  doc.setFontSize(12);
  doc.text('Y KIEN CAC BEN', leftMargin, yPos);
  yPos += 6;
  
  doc.setFontSize(11);
  doc.text('Y kien cua doi tuong kiem tra:', leftMargin, yPos);
  yPos += 5;
  doc.setFont('times', 'italic');
  const subjectOpinionLines = doc.splitTextToSize(data.opinions.subjectOpinion || 'Khong co y kien', 150);
  subjectOpinionLines.forEach((line: string) => {
    doc.text(line, leftMargin + 5, yPos);
    yPos += 5;
  });
  
  yPos += 3;
  doc.setFont('times', 'bold');
  doc.text('Y kien cua Doan kiem tra:', leftMargin, yPos);
  yPos += 5;
  doc.setFont('times', 'italic');
  const teamOpinionLines = doc.splitTextToSize(data.opinions.teamOpinion || 'Khong co y kien', 150);
  teamOpinionLines.forEach((line: string) => {
    doc.text(line, leftMargin + 5, yPos);
    yPos += 5;
  });
  
  // Signature section
  if (yPos > 230) {
    doc.addPage();
    yPos = 20;
  } else {
    yPos += 10;
  }
  
  doc.setFont('times', 'bold');
  doc.setFontSize(11);
  
  // Two columns for signatures
  const col1X = 40;
  const col2X = 130;
  
  const sig1 = 'DAI DIEN CO SO';
  doc.text(sig1, col1X - doc.getTextWidth(sig1) / 2, yPos);
  const sig2 = 'TRUONG DOAN KIEM TRA';
  doc.text(sig2, col2X - doc.getTextWidth(sig2) / 2, yPos);
  yPos += 5;
  doc.setFont('times', 'italic');
  doc.setFontSize(10);
  const sig3 = '(Ky, ghi ro ho ten)';
  doc.text(sig3, col1X - doc.getTextWidth(sig3) / 2, yPos);
  const sig4 = '(Ky, ghi ro ho ten)';
  doc.text(sig4, col2X - doc.getTextWidth(sig4) / 2, yPos);
  
  yPos += 20;
  doc.setFont('times', 'normal');
  doc.setFontSize(11);
  const name1 = data.facility.representative;
  doc.text(name1, col1X - doc.getTextWidth(name1) / 2, yPos);
  const name2 = data.inspectionTeam.leader;
  doc.text(name2, col2X - doc.getTextWidth(name2) / 2, yPos);
  
  return doc;
}

// Helper function to create Form06Data from InspectionTask
export function createForm06DataFromTask(task: InspectionTask): Form06Data {
  return {
    formNumber: `${task.id}/BB-KT`,
    issueDate: new Date().toLocaleDateString('vi-VN'),
    issuePlace: 'TP. Hồ Chí Minh',
    legalBasis: [
      'Luật An toàn thực phẩm 2010',
      'Nghị định 115/2018/NĐ-CP',
    ],
    decisionNumber: '01/QĐ-KT',
    decisionDate: '10/01/2026',
    
    facility: {
      name: task.targetName,
      address: task.targetAddress,
      representative: 'Nguyễn Văn A',
      position: 'Gi��m đốc',
      businessLicense: '0123456789',
    },
    
    inspectionTeam: {
      organization: 'Sở Công Thương TP.HCM',
      leader: task.assignee.name,
      members: ['Trần Văn B - Thanh tra viên', 'Lê Thị C - Chuyên viên'],
    },
    
    timing: {
      startTime: task.startDate ? new Date(task.startDate).toLocaleString('vi-VN') : new Date().toLocaleString('vi-VN'),
      endTime: new Date().toLocaleString('vi-VN'),
      location: task.targetAddress,
    },
    
    checklistResults: [
      {
        title: 'Giấy chứng nhận ATTP',
        status: 'failed',
        description: 'Tại thời điểm kiểm tra, cơ sở không xuất trình được Giấy chứng nhận ATTP. Theo giải trình của đại diện, giấy đã hết hạn từ ngày 15/12/2025.',
      },
      {
        title: 'Giấy phép kinh doanh',
        status: 'passed',
        description: 'Giấy phép ĐKKD số 0123456789 còn hiệu lực đến ngày 31/12/2027.',
      },
    ],
    
    violations: [
      {
        code: 'VP-001',
        title: 'Không có giấy chứng nhận ATTP',
        regulation: 'Nghị định 115/2018/NĐ-CP, Điều 15',
        suggestedPenalty: '10 - 20 triệu đồng',
      },
    ],
    
    opinions: {
      subjectOpinion: 'Tôi xin nhận đầy đủ các vi phạm mà Đoàn kiểm tra đã chỉ ra. Cam kết khắc phục trong 15 ngày.',
      teamOpinion: 'Yêu cầu cơ sở khắc phục ngay các vi phạm. Đoàn kiểm tra sẽ kiểm tra lại sau 15 ngày.',
    },
  };
}