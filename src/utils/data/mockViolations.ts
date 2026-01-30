export type ViolationSeverity = 'minor' | 'moderate' | 'severe';
export type ViolationStatus = 'resolved' | 'fined' | 'processing';

export interface ViolationRecord {
  id: string;
  caseNumber: string; // Số vụ việc (mã hồ sơ)
  storeId: number;
  title: string; // Tiêu đề vi phạm
  description: string; // Mô tả ngắn
  detectedDate: string; // Ngày phát hiện (YYYY-MM-DD)
  displayDate: string; // Format: "15/11/2024"
  detectedBy: string; // Đơn vị phát hiện
  severity: ViolationSeverity; // Mức độ: minor/moderate/severe
  status: ViolationStatus; // Trạng thái xử lý
  fineAmount?: number; // Số tiền xử phạt (VND)
  decisionNumber?: string; // Mã quyết định xử phạt
}

// Mock violation data
export const mockViolations: ViolationRecord[] = [
  // Store ID 1
  {
    id: 'VIO001',
    caseNumber: 'VP-2024-001',
    storeId: 1,
    title: 'Vi phạm niêm yết giá',
    description: 'Không niêm yết giá bán tại 15 mặt hàng thực phẩm',
    detectedDate: '2024-09-15',
    displayDate: '15/09/2024',
    detectedBy: 'Đội QLTT Quận 1',
    severity: 'minor',
    status: 'resolved',
    fineAmount: 2000000,
    decisionNumber: 'QĐ-123/2024',
  },
  {
    id: 'VIO002',
    caseNumber: 'VP-2024-015',
    storeId: 1,
    title: 'Vi phạm điều kiện vệ sinh ATTP',
    description: 'Khu vực chế biến thực phẩm không đảm bảo vệ sinh, phát hiện côn trùng',
    detectedDate: '2024-08-20',
    displayDate: '20/08/2024',
    detectedBy: 'Chi cục QLTT Quận 1',
    severity: 'moderate',
    status: 'fined',
    fineAmount: 5000000,
    decisionNumber: 'QĐ-087/2024',
  },
  
  // Store ID 2
  {
    id: 'VIO003',
    caseNumber: 'VP-2024-042',
    storeId: 2,
    title: 'Kinh doanh hàng hóa không rõ nguồn gốc',
    description: 'Phát hiện 120kg thực phẩm không có hóa đơn chứng từ hợp pháp',
    detectedDate: '2024-10-25',
    displayDate: '25/10/2024',
    detectedBy: 'Đội QLTT Quận 2',
    severity: 'severe',
    status: 'processing',
    fineAmount: 15000000,
    decisionNumber: 'QĐ-156/2024',
  },
  {
    id: 'VIO004',
    caseNumber: 'VP-2024-038',
    storeId: 2,
    title: 'Vi phạm quy định về bảo quản thực phẩm',
    description: 'Bảo quản thực phẩm tươi sống không đúng nhiệt độ quy định',
    detectedDate: '2024-09-18',
    displayDate: '18/09/2024',
    detectedBy: 'Đội QLTT Quận 2',
    severity: 'moderate',
    status: 'fined',
    fineAmount: 4000000,
    decisionNumber: 'QĐ-142/2024',
  },
  {
    id: 'VIO005',
    caseNumber: 'VP-2024-029',
    storeId: 2,
    title: 'Niêm yết giá không đúng quy định',
    description: 'Giá niêm yết không khớp với giá bán thực tế tại quầy thu ngân',
    detectedDate: '2024-07-10',
    displayDate: '10/07/2024',
    detectedBy: 'Chi cục QLTT Quận 2',
    severity: 'minor',
    status: 'resolved',
    fineAmount: 1500000,
    decisionNumber: 'QĐ-098/2024',
  },
  
  // Store ID 3
  {
    id: 'VIO006',
    caseNumber: 'VP-2024-051',
    storeId: 3,
    title: 'Vi phạm quy định về bao bì nhãn mác',
    description: 'Bán sản phẩm có nhãn mác không đúng quy định, thiếu thông tin bắt buộc',
    detectedDate: '2024-11-05',
    displayDate: '05/11/2024',
    detectedBy: 'Đội QLTT Quận 3',
    severity: 'minor',
    status: 'processing',
  },
  
  // Store ID 4 - High violation history
  {
    id: 'VIO007',
    caseNumber: 'VP-2024-067',
    storeId: 4,
    title: 'Vi phạm nghiêm trọng về vệ sinh ATTP',
    description: 'Khu vực chế biến không đảm bảo điều kiện vệ sinh, phát hiện thực phẩm hết hạn',
    detectedDate: '2024-11-10',
    displayDate: '10/11/2024',
    detectedBy: 'Chi cục QLTT Quận 4',
    severity: 'severe',
    status: 'processing',
    fineAmount: 25000000,
    decisionNumber: 'QĐ-201/2024',
  },
  {
    id: 'VIO008',
    caseNumber: 'VP-2024-058',
    storeId: 4,
    title: 'Kinh doanh không đúng ngành nghề đăng ký',
    description: 'Kinh doanh thêm dịch vụ karaoke không có trong giấy phép',
    detectedDate: '2024-10-15',
    displayDate: '15/10/2024',
    detectedBy: 'Đội QLTT Quận 4',
    severity: 'severe',
    status: 'fined',
    fineAmount: 18000000,
    decisionNumber: 'QĐ-189/2024',
  },
  {
    id: 'VIO009',
    caseNumber: 'VP-2024-045',
    storeId: 4,
    title: 'Vi phạm quy định về phòng cháy chữa cháy',
    description: 'Không trang bị đầy đủ thiết bị PCCC theo quy định',
    detectedDate: '2024-09-08',
    displayDate: '08/09/2024',
    detectedBy: 'Cảnh sát PCCC - Chi cục QLTT Quận 4',
    severity: 'moderate',
    status: 'fined',
    fineAmount: 7000000,
    decisionNumber: 'QĐ-167/2024',
  },
  {
    id: 'VIO010',
    caseNumber: 'VP-2024-032',
    storeId: 4,
    title: 'Bảo quản và chế biến thực phẩm không đúng quy định',
    description: 'Sử dụng nguyên liệu không rõ nguồn gốc, bảo quản thực phẩm lẫn với hóa chất',
    detectedDate: '2024-08-05',
    displayDate: '05/08/2024',
    detectedBy: 'Đội QLTT Quận 4',
    severity: 'severe',
    status: 'fined',
    fineAmount: 20000000,
    decisionNumber: 'QĐ-145/2024',
  },
];

/**
 * Get violation records for a specific store
 */
export function getViolationsByStoreId(storeId: number): ViolationRecord[] {
  return mockViolations
    .filter((violation) => violation.storeId === storeId)
    .sort((a, b) => new Date(b.detectedDate).getTime() - new Date(a.detectedDate).getTime());
}

/**
 * Get severity badge configuration
 */
export function getViolationSeverityInfo(severity: ViolationSeverity): {
  label: string;
  color: string;
  bgColor: string;
} {
  switch (severity) {
    case 'minor':
      return {
        label: 'Nhẹ',
        color: 'var(--text-primary)',
        bgColor: 'var(--muted)',
      };
    case 'moderate':
      return {
        label: 'Trung bình',
        color: 'var(--warning-text)',
        bgColor: 'var(--warning-bg)',
      };
    case 'severe':
      return {
        label: 'Nặng',
        color: 'var(--destructive)',
        bgColor: 'rgba(254, 226, 226, 1)',
      };
    default:
      return {
        label: 'Không xác định',
        color: 'var(--text-secondary)',
        bgColor: 'var(--muted)',
      };
  }
}

/**
 * Get status badge configuration
 */
export function getViolationStatusInfo(status: ViolationStatus): {
  label: string;
  color: string;
  bgColor: string;
} {
  switch (status) {
    case 'resolved':
      return {
        label: 'Đã khắc phục',
        color: 'var(--success-text)',
        bgColor: 'var(--success-bg)',
      };
    case 'fined':
      return {
        label: 'Đã xử phạt',
        color: 'var(--primary-foreground)',
        bgColor: 'var(--primary)',
      };
    case 'processing':
      return {
        label: 'Đang xử lý',
        color: 'var(--warning-text)',
        bgColor: 'var(--warning-bg)',
      };
    default:
      return {
        label: 'Không xác định',
        color: 'var(--text-secondary)',
        bgColor: 'var(--muted)',
      };
  }
}

/**
 * Format currency (VND)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}
