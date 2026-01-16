import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import type { KeHoachTacNghiep } from '@/app/data/kehoach-mock-data';

export interface PlanReportData {
  planCode: string;
  planName: string;
  period: string;
  issueDate: string;
  issuePlace: string;
  
  summary: {
    totalTargets: number;
    completedTargets: number;
    totalViolations: number;
    totalFines: string;
  };
  
  targets: Array<{
    name: string;
    address: string;
    date: string;
    result: string;
    violations: number;
  }>;
  
  conclusions: string;
  recommendations: string;
}

export function generatePlanReportPDF(data: PlanReportData): jsPDF {
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
  doc.text('So: ' + data.planCode, leftMargin, yPos);
  
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
  const title1 = 'BAO CAO KET QUA THUC HIEN';
  doc.text(title1, centerX - doc.getTextWidth(title1) / 2, yPos);
  yPos += 6;
  doc.setFontSize(12);
  const title2 = data.planName;
  const title2Lines = doc.splitTextToSize(title2, 150);
  title2Lines.forEach((line: string) => {
    doc.text(line, centerX - doc.getTextWidth(line) / 2, yPos);
    yPos += 5;
  });
  
  // Content
  yPos += 5;
  doc.setFontSize(11);
  doc.setFont('times', 'normal');
  
  // Thời gian thực hiện
  doc.text('Thoi gian thuc hien: ' + data.period, leftMargin, yPos);
  yPos += 8;
  
  // I. Tổng quan
  doc.setFont('times', 'bold');
  doc.text('I. TONG QUAN', leftMargin, yPos);
  yPos += 6;
  
  doc.setFont('times', 'normal');
  doc.text('- Tong so doi tuong kiem tra: ' + data.summary.totalTargets, leftMargin + 5, yPos);
  yPos += 5;
  doc.text('- So doi tuong da kiem tra: ' + data.summary.completedTargets, leftMargin + 5, yPos);
  yPos += 5;
  doc.text('- Tong so vi pham phat hien: ' + data.summary.totalViolations, leftMargin + 5, yPos);
  yPos += 5;
  doc.text('- Tong muc phat du kien: ' + data.summary.totalFines, leftMargin + 5, yPos);
  yPos += 10;
  
  // II. Chi tiết kết quả
  if (yPos > 200) {
    doc.addPage();
    yPos = 20;
  }
  
  doc.setFont('times', 'bold');
  doc.text('II. CHI TIET KET QUA KIEM TRA', leftMargin, yPos);
  yPos += 8;
  
  // Table with targets
  const tableData = data.targets.map((target, index) => [
    (index + 1).toString(),
    target.name,
    target.address,
    target.date,
    target.result,
    target.violations.toString(),
  ]);
  
  (doc as any).autoTable({
    startY: yPos,
    head: [['STT', 'Ten co so', 'Dia chi', 'Ngay KT', 'Ket qua', 'Vi pham']],
    body: tableData,
    theme: 'grid',
    styles: {
      font: 'times',
      fontSize: 10,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [0, 92, 182],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center',
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 12 },
      1: { cellWidth: 45 },
      2: { cellWidth: 50 },
      3: { halign: 'center', cellWidth: 25 },
      4: { halign: 'center', cellWidth: 25 },
      5: { halign: 'center', cellWidth: 20 },
    },
    margin: { left: leftMargin, right: 25 },
  });
  
  yPos = (doc as any).lastAutoTable.finalY + 10;
  
  // III. Kết luận
  if (yPos > 230) {
    doc.addPage();
    yPos = 20;
  }
  
  doc.setFont('times', 'bold');
  doc.text('III. KET LUAN', leftMargin, yPos);
  yPos += 6;
  
  doc.setFont('times', 'normal');
  const conclusionLines = doc.splitTextToSize(data.conclusions, 160);
  conclusionLines.forEach((line: string) => {
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }
    doc.text(line, leftMargin + 5, yPos);
    yPos += 5;
  });
  
  yPos += 3;
  
  // IV. Kiến nghị
  if (yPos > 230) {
    doc.addPage();
    yPos = 20;
  }
  
  doc.setFont('times', 'bold');
  doc.text('IV. KIEN NGHI', leftMargin, yPos);
  yPos += 6;
  
  doc.setFont('times', 'normal');
  const recommendationLines = doc.splitTextToSize(data.recommendations, 160);
  recommendationLines.forEach((line: string) => {
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }
    doc.text(line, leftMargin + 5, yPos);
    yPos += 5;
  });
  
  // Signature section
  if (yPos > 230) {
    doc.addPage();
    yPos = 20;
  } else {
    yPos += 15;
  }
  
  doc.setFont('times', 'bold');
  doc.setFontSize(11);
  
  const sigX = 130;
  const sigText = 'GIAM DOC';
  doc.text(sigText, sigX - doc.getTextWidth(sigText) / 2, yPos);
  yPos += 5;
  doc.setFont('times', 'italic');
  doc.setFontSize(10);
  const sigText2 = '(Ky, ghi ro ho ten)';
  doc.text(sigText2, sigX - doc.getTextWidth(sigText2) / 2, yPos);
  
  return doc;
}

// Helper function to create PlanReportData from KeHoachTacNghiep
export function createPlanReportDataFromPlan(plan: KeHoachTacNghiep): PlanReportData {
  return {
    planCode: plan.code,
    planName: plan.name,
    period: `${new Date(plan.startDate).toLocaleDateString('vi-VN')} - ${new Date(plan.endDate).toLocaleDateString('vi-VN')}`,
    issueDate: new Date().toLocaleDateString('vi-VN'),
    issuePlace: 'TP. Ho Chi Minh',
    
    summary: {
      totalTargets: 25,
      completedTargets: 23,
      totalViolations: 12,
      totalFines: '150 - 300 trieu dong',
    },
    
    targets: [
      {
        name: 'Sieu thi BigC Thang Long',
        address: '222 Tran Duy Hung, Cau Giay, Ha Noi',
        date: '12/01/2025',
        result: 'Dat',
        violations: 0,
      },
      {
        name: 'Cua hang thuc pham XYZ',
        address: '45 Lang Ha, Dong Da, Ha Noi',
        date: '15/01/2025',
        result: 'Khong dat',
        violations: 3,
      },
      {
        name: 'Co so san xuat my pham ABC',
        address: '10 Tran Dai Nghia, Hai Ba Trung, Ha Noi',
        date: '10/01/2025',
        result: 'Khong dat',
        violations: 2,
      },
    ],
    
    conclusions: 'Qua ket qua kiem tra, phan lon cac co so da chap hanh tot cac quy dinh ve kinh doanh hang hoa, dich vu. Tuy nhien, van con mot so truong hop vi pham can xu ly nghiem theo quy dinh phap luat.',
    recommendations: 'De nghi tang cuong cong tac tuyen truyen, giao duc phap luat cho cac co so kinh doanh. Dong thoi, tang cuong kiem tra dinh ky va dot xuat de dam bao trat tu trong hoat dong kinh doanh tren dia ban.',
  };
}
