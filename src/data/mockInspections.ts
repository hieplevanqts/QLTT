export type InspectionStatus = 'passed' | 'conditional' | 'failed';

export interface InspectionRecord {
  id: string;
  storeId: number;
  type: string; // Loại kiểm tra
  date: string; // Format: YYYY-MM-DD
  displayDate: string; // Format: "15 tháng 11, 2024"
  unit: string; // Đơn vị thực hiện kiểm tra
  inspector: string; // Tên thanh tra viên
  notes: string; // Ghi chú kết luận
  violationCount?: number; // Số vi phạm (nếu có)
  status: InspectionStatus; // Kết quả: passed, conditional, failed
}

// Mock inspection data - organized by storeId
export const mockInspections: InspectionRecord[] = [
  // Store ID 1
  {
    id: 'INS001',
    storeId: 1,
    type: 'Kiểm tra vệ sinh ATTP',
    date: '2024-11-15',
    displayDate: '15 tháng 11, 2024',
    unit: 'Đội QLTT Quận 1',
    inspector: 'Trần Văn B',
    notes: 'Cơ sở đảm bảo vệ sinh an toàn thực phẩm. Không phát hiện vi phạm.',
    status: 'passed',
  },
  {
    id: 'INS002',
    storeId: 1,
    type: 'Kiểm tra vệ sinh ATTP',
    date: '2024-08-20',
    displayDate: '20 tháng 8, 2024',
    unit: 'Đội QLTT Quận 1',
    inspector: 'Lê Thị C',
    notes: 'Phát hiện vi phạm nhỏ về quy trình bảo quản thực phẩm. Cơ sở đã cam kết khắc phục trong 7 ngày.',
    violationCount: 2,
    status: 'conditional',
  },
  {
    id: 'INS003',
    storeId: 1,
    type: 'Kiểm tra giá cả',
    date: '2024-05-10',
    displayDate: '10 tháng 5, 2024',
    unit: 'Đội QLTT Quận 1',
    inspector: 'Nguyễn Văn A',
    notes: 'Giá cả niêm yết đúng quy định, rõ ràng và đầy đủ.',
    status: 'passed',
  },
  {
    id: 'INS004',
    storeId: 1,
    type: 'Kiểm tra nguồn gốc hàng hóa',
    date: '2024-03-15',
    displayDate: '15 tháng 3, 2024',
    unit: 'Chi cục QLTT Quận 1',
    inspector: 'Phạm Văn D',
    notes: 'Hàng hóa có hóa đơn chứng từ đầy đủ, nguồn gốc xuất xứ rõ ràng.',
    status: 'passed',
  },
  
  // Store ID 2
  {
    id: 'INS005',
    storeId: 2,
    type: 'Kiểm tra vệ sinh ATTP',
    date: '2024-10-25',
    displayDate: '25 tháng 10, 2024',
    unit: 'Đội QLTT Quận 2',
    inspector: 'Hoàng Thị E',
    notes: 'Không đạt tiêu chuẩn vệ sinh. Yêu cầu cơ sở tạm dừng hoạt động để khắc phục ngay.',
    violationCount: 5,
    status: 'failed',
  },
  {
    id: 'INS006',
    storeId: 2,
    type: 'Kiểm tra giá cả',
    date: '2024-07-18',
    displayDate: '18 tháng 7, 2024',
    unit: 'Đội QLTT Quận 2',
    inspector: 'Trần Văn B',
    notes: 'Chưa niêm yết giá đầy đủ tại một số vị trí. Yêu cầu bổ sung trong 3 ngày.',
    violationCount: 1,
    status: 'conditional',
  },
  
  // Store ID 3
  {
    id: 'INS007',
    storeId: 3,
    type: 'Kiểm tra vệ sinh ATTP',
    date: '2024-09-12',
    displayDate: '12 tháng 9, 2024',
    unit: 'Đội QLTT Quận 3',
    inspector: 'Nguyễn Văn A',
    notes: 'Đảm bảo đầy đủ điều kiện an toàn thực phẩm theo quy định.',
    status: 'passed',
  },
  {
    id: 'INS008',
    storeId: 3,
    type: 'Kiểm tra định kỳ',
    date: '2024-06-20',
    displayDate: '20 tháng 6, 2024',
    unit: 'Chi cục QLTT Quận 3',
    inspector: 'Lê Thị C',
    notes: 'Cơ sở hoạt động tốt, tuân thủ đầy đủ quy định.',
    status: 'passed',
  },
  
  // Store ID 4 - Multiple inspections with violations
  {
    id: 'INS009',
    storeId: 4,
    type: 'Kiểm tra đột xuất',
    date: '2024-11-10',
    displayDate: '10 tháng 11, 2024',
    unit: 'Chi cục QLTT Quận 4',
    inspector: 'Hoàng Thị E',
    notes: 'Phát hiện nhiều vi phạm nghiêm trọng về vệ sinh ATTP, thực phẩm hết hạn. Yêu cầu tạm dừng hoạt động ngay lập tức.',
    violationCount: 3,
    status: 'failed',
  },
  {
    id: 'INS010',
    storeId: 4,
    type: 'Kiểm tra giấy phép',
    date: '2024-10-15',
    displayDate: '15 tháng 10, 2024',
    unit: 'Đội QLTT Quận 4',
    inspector: 'Trần Văn B',
    notes: 'Phát hiện kinh doanh không đúng ngành nghề đăng ký. Thiếu giấy chứng nhận PCCC.',
    violationCount: 2,
    status: 'failed',
  },
  {
    id: 'INS011',
    storeId: 4,
    type: 'Kiểm tra phòng cháy chữa cháy',
    date: '2024-09-08',
    displayDate: '8 tháng 9, 2024',
    unit: 'Cảnh sát PCCC - Chi cục QLTT Quận 4',
    inspector: 'Nguyễn Văn D',
    notes: 'Không đầy đủ thiết bị PCCC, lối thoát hiểm bị chặn. Yêu cầu khắc phục trong 7 ngày.',
    violationCount: 2,
    status: 'conditional',
  },
  {
    id: 'INS012',
    storeId: 4,
    type: 'Kiểm tra vệ sinh ATTP',
    date: '2024-08-05',
    displayDate: '5 tháng 8, 2024',
    unit: 'Đội QLTT Quận 4',
    inspector: 'Lê Văn F',
    notes: 'Phát hiện nguyên liệu không rõ nguồn gốc, bảo quản thực phẩm lẫn với hóa chất. Vi phạm nghiêm trọng.',
    violationCount: 2,
    status: 'failed',
  },
  {
    id: 'INS013',
    storeId: 4,
    type: 'Kiểm tra định kỳ',
    date: '2024-05-12',
    displayDate: '12 tháng 5, 2024',
    unit: 'Chi cục QLTT Quận 4',
    inspector: 'Hoàng Thị E',
    notes: 'Một số vi phạm nhỏ về niêm yết giá và giấy tờ. Yêu cầu khắc phục.',
    violationCount: 1,
    status: 'conditional',
  },
];

/**
 * Get inspection records for a specific store, sorted by date (newest first)
 */
export function getInspectionsByStoreId(storeId: number): InspectionRecord[] {
  return mockInspections
    .filter((inspection) => inspection.storeId === storeId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Get inspection status badge configuration
 */
export function getInspectionStatusInfo(status: InspectionStatus): {
  label: string;
  color: string;
  bgColor: string;
  iconColor: string;
} {
  switch (status) {
    case 'passed':
      return {
        label: 'Đạt',
        color: 'var(--success-text)',
        bgColor: 'var(--success-bg)',
        iconColor: 'var(--success)',
      };
    case 'conditional':
      return {
        label: 'Đạt có điều kiện',
        color: 'var(--warning-text)',
        bgColor: 'var(--warning-bg)',
        iconColor: 'var(--warning)',
      };
    case 'failed':
      return {
        label: 'Không đạt',
        color: 'var(--destructive)',
        bgColor: 'rgba(254, 226, 226, 1)',
        iconColor: 'var(--destructive)',
      };
    default:
      return {
        label: 'Không xác định',
        color: 'var(--text-secondary)',
        bgColor: 'var(--muted)',
        iconColor: 'var(--text-tertiary)',
      };
  }
}