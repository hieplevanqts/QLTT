export type ComplaintSeverity = 'low' | 'medium' | 'high';
export type ComplaintStatus = 'resolved' | 'verifying' | 'received' | 'investigating';
export type ComplaintSource = 'hotline' | 'website' | 'app' | 'email' | 'in-person' | 'phone';

export interface ComplaintRecord {
  id: string;
  storeId: number;
  complaintNumber: string; // Mã phản ánh (e.g., "PA-2024-001")
  title: string; // Tiêu đề phản ánh
  description: string; // Mô tả ngắn
  date: string; // Format: YYYY-MM-DD
  displayDate: string; // Format: "15/11/2024"
  source: ComplaintSource;
  severity: ComplaintSeverity;
  assignedUnit: string; // Đơn vị xử lý
  status: ComplaintStatus;
  reporterName?: string; // Tên người phản ánh (tùy chọn)
}

// Mock complaints data
export const mockComplaints: ComplaintRecord[] = [
  // Store ID 1 - Multiple complaints
  {
    id: 'CMP001',
    storeId: 1,
    complaintNumber: 'PA-2024-156',
    title: 'Vệ sinh khu vực bếp không đảm bảo',
    description: 'Phát hiện khu vực chế biến thức ăn có côn trùng, dụng cụ không được vệ sinh sạch sẽ.',
    date: '2024-11-20',
    displayDate: '20/11/2024',
    source: 'hotline',
    severity: 'high',
    assignedUnit: 'Đội QLTT Phường 1',
    status: 'verifying',
    reporterName: 'Nguyễn Văn A',
  },
  {
    id: 'CMP002',
    storeId: 1,
    complaintNumber: 'PA-2024-134',
    title: 'Giá cả không niêm yết rõ ràng',
    description: 'Một số món ăn không có giá niêm yết, nhân viên báo giá không khớp với menu.',
    date: '2024-11-10',
    displayDate: '10/11/2024',
    source: 'website',
    severity: 'medium',
    assignedUnit: 'Đội QLTT Phường 1',
    status: 'resolved',
  },
  {
    id: 'CMP003',
    storeId: 1,
    complaintNumber: 'PA-2024-098',
    title: 'Thái độ phục vụ không tốt',
    description: 'Nhân viên phục vụ có thái độ khó chịu, không nhiệt tình với khách hàng.',
    date: '2024-10-25',
    displayDate: '25/10/2024',
    source: 'app',
    severity: 'low',
    assignedUnit: 'Đội QLTT Phường 1',
    status: 'resolved',
  },
  {
    id: 'CMP004',
    storeId: 1,
    complaintNumber: 'PA-2024-067',
    title: 'Nghi ngờ nguồn gốc thực phẩm',
    description: 'Thực phẩm có mùi vị lạ, nghi ngờ không rõ nguồn gốc xuất xứ.',
    date: '2024-10-05',
    displayDate: '05/10/2024',
    source: 'hotline',
    severity: 'high',
    assignedUnit: 'Chi cục QLTT Phường 1',
    status: 'resolved',
    reporterName: 'Trần Thị B',
  },

  // Store ID 2 - Multiple complaints
  {
    id: 'CMP005',
    storeId: 2,
    complaintNumber: 'PA-2024-178',
    title: 'Phát hiện thực phẩm hết hạn',
    description: 'Khách hàng phát hiện sản phẩm sữa đã hết hạn sử dụng 2 tuần vẫn được bán.',
    date: '2024-11-22',
    displayDate: '22/11/2024',
    source: 'in-person',
    severity: 'high',
    assignedUnit: 'Đội QLTT Phường 2',
    status: 'verifying',
    reporterName: 'Lê Văn C',
  },
  {
    id: 'CMP006',
    storeId: 2,
    complaintNumber: 'PA-2024-165',
    title: 'Ồn ào gây ảnh hưởng khu dân cư',
    description: 'Cửa hàng hoạt động đến quá 22h, tiếng ồn lớn ảnh hưởng người dân xung quanh.',
    date: '2024-11-15',
    displayDate: '15/11/2024',
    source: 'email',
    severity: 'medium',
    assignedUnit: 'Đội QLTT Phường 2',
    status: 'received',
  },
  {
    id: 'CMP007',
    storeId: 2,
    complaintNumber: 'PA-2024-142',
    title: 'Lấn chiếm vỉa hè',
    description: 'Cửa hàng đặt bàn ghế ra vỉa hè, chiếm hết lối đi bộ.',
    date: '2024-11-08',
    displayDate: '08/11/2024',
    source: 'website',
    severity: 'medium',
    assignedUnit: 'Đội QLTT Phường 2',
    status: 'verifying',
  },

  // Store ID 3 - Few complaints
  {
    id: 'CMP008',
    storeId: 3,
    complaintNumber: 'PA-2024-089',
    title: 'Chất lượng món ăn không như mô tả',
    description: 'Món ăn được quảng cáo có nguyên liệu cao cấp nhưng thực tế không đúng.',
    date: '2024-10-18',
    displayDate: '18/10/2024',
    source: 'app',
    severity: 'low',
    assignedUnit: 'Đội QLTT Phường 3',
    status: 'resolved',
  },

  // Store ID 4 - Multiple high-severity complaints
  {
    id: 'CMP009',
    storeId: 4,
    complaintNumber: 'PA-2024-201',
    title: 'Ngộ độc thực phẩm',
    description: 'Gia đình 4 người bị ngộ độc sau khi ăn tại cửa hàng, có 2 người phải nhập viện cấp cứu.',
    date: '2024-11-12',
    displayDate: '12/11/2024',
    source: 'phone',
    severity: 'high',
    assignedUnit: 'Chi cục QLTT Phường 4',
    status: 'verifying',
    reporterName: 'Trần Văn G',
  },
  {
    id: 'CMP010',
    storeId: 4,
    complaintNumber: 'PA-2024-189',
    title: 'Thực phẩm bẩn, mùi hôi',
    description: 'Phát hiện thịt, cá có mùi hôi thối, côn trùng nhiều trong khu bếp.',
    date: '2024-11-05',
    displayDate: '05/11/2024',
    source: 'in-person',
    severity: 'high',
    assignedUnit: 'Đội QLTT Phường 4',
    status: 'investigating',
    reporterName: 'Nguyễn Thị H',
  },
  {
    id: 'CMP011',
    storeId: 4,
    complaintNumber: 'PA-2024-175',
    title: 'Nhân viên phục vụ thái độ xấu',
    description: 'Nhân viên phục vụ có thái độ khi khách hàng phản ánh về chất lượng món ăn.',
    date: '2024-10-28',
    displayDate: '28/10/2024',
    source: 'website',
    severity: 'medium',
    assignedUnit: 'Đội QLTT Phường 4',
    status: 'resolved',
  },
  {
    id: 'CMP012',
    storeId: 4,
    complaintNumber: 'PA-2024-156',
    title: 'Tính tiền sai, gian lận khách hàng',
    description: 'Tính tiền cao hơn giá niêm yết, không xuất hóa đơn khi khách hàng yêu cầu.',
    date: '2024-10-15',
    displayDate: '15/10/2024',
    source: 'app',
    severity: 'medium',
    assignedUnit: 'Đội QLTT Phường 4',
    status: 'investigating',
    reporterName: 'Phạm Văn I',
  },
  {
    id: 'CMP013',
    storeId: 4,
    complaintNumber: 'PA-2024-138',
    title: 'Hoạt động gây ồn sau 22h',
    description: 'Quán karaoke ăn uống gây ồn ào vào ban đêm, ảnh hưởng khu dân cư.',
    date: '2024-09-20',
    displayDate: '20/09/2024',
    source: 'phone',
    severity: 'medium',
    assignedUnit: 'Đội QLTT Phường 4',
    status: 'resolved',
  },
];

/**
 * Get complaints for a specific store, sorted by date (newest first)
 */
export function getComplaintsByStoreId(storeId: number): ComplaintRecord[] {
  return mockComplaints
    .filter((complaint) => complaint.storeId === storeId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Get complaint severity badge configuration
 */
export function getComplaintSeverityInfo(severity: ComplaintSeverity): {
  label: string;
  color: string;
  bgColor: string;
} {
  switch (severity) {
    case 'low':
      return {
        label: 'Thấp',
        color: 'var(--text-secondary)',
        bgColor: 'var(--muted)',
      };
    case 'medium':
      return {
        label: 'Trung bình',
        color: 'var(--warning-text)',
        bgColor: 'var(--warning-bg)',
      };
    case 'high':
      return {
        label: 'Cao',
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
 * Get complaint status badge configuration
 */
export function getComplaintStatusInfo(status: ComplaintStatus): {
  label: string;
  color: string;
  bgColor: string;
} {
  switch (status) {
    case 'resolved':
      return {
        label: 'Đã xử lý',
        color: 'var(--success-text)',
        bgColor: 'var(--success-bg)',
      };
    case 'verifying':
      return {
        label: 'Đang xác minh',
        color: 'var(--warning-text)',
        bgColor: 'var(--warning-bg)',
      };
    case 'received':
      return {
        label: 'Đang tiếp nhận',
        color: 'rgb(37, 99, 235)',
        bgColor: 'rgba(59, 130, 246, 0.1)',
      };
    case 'investigating':
      return {
        label: 'Đang điều tra',
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
 * Get complaint source display label
 */
export function getComplaintSourceLabel(source: ComplaintSource): string {
  switch (source) {
    case 'hotline':
      return 'Hotline';
    case 'website':
      return 'Website';
    case 'app':
      return 'App';
    case 'email':
      return 'Email';
    case 'in-person':
      return 'Trực tiếp';
    case 'phone':
      return 'Điện thoại';
    default:
      return 'Khác';
  }
}
