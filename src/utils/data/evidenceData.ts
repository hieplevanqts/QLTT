/**
 * Evidence Library Mock Data
 * Dữ liệu mẫu cho Kho chứng cứ
 */

export type EvidenceStatus = 'new' | 'pending' | 'approved' | 'flagged';
export type FileType = 'image' | 'video' | 'document';

export interface Evidence {
  id: string;
  fileName: string;
  fileType: FileType;
  thumbnail: string;
  status: EvidenceStatus;
  uploadedBy: string;
  uploadedDate: string;
  uploadedTime: string;
  fileSize: string;
  location?: string;
  tags?: string[];
  description?: string;
}

export const evidenceStatusLabels: Record<EvidenceStatus, string> = {
  new: 'Mới',
  pending: 'Chờ duyệt',
  approved: 'Đã duyệt',
  flagged: 'Bị gắn cờ',
};

export const fileTypeLabels: Record<FileType, string> = {
  image: 'Ảnh',
  video: 'Video',
  document: 'Tài liệu',
};

export const mockEvidenceData: Evidence[] = [
  {
    id: 'EV-2026-001',
    fileName: 'vi_pham_ve_sinh_thuc_pham_Q1.jpg',
    fileType: 'image',
    thumbnail: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&h=200&fit=crop',
    status: 'new',
    uploadedBy: 'Nguyễn Văn A',
    uploadedDate: '07/01/2026',
    uploadedTime: '09:30',
    fileSize: '2.4 MB',
    location: 'Quận 1, TP.HCM',
    tags: ['Vệ sinh', 'Vi phạm', 'Quận 1'],
    description: 'Hình ảnh vi phạm vệ sinh tại cơ sở Quận 1',
  },
  {
    id: 'EV-2026-002',
    fileName: 'bien_ban_kiem_tra_quan_an_456.pdf',
    fileType: 'document',
    thumbnail: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=200&h=200&fit=crop',
    status: 'pending',
    uploadedBy: 'Trần Thị B',
    uploadedDate: '07/01/2026',
    uploadedTime: '10:15',
    fileSize: '856 KB',
    location: 'Quận 3, TP.HCM',
    tags: ['Biên bản', 'Kiểm tra'],
    description: 'Biên bản kiểm tra quán ăn số 456',
  },
  {
    id: 'EV-2026-003',
    fileName: 'video_che_bien_thuc_pham.mp4',
    fileType: 'video',
    thumbnail: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=200&h=200&fit=crop',
    status: 'approved',
    uploadedBy: 'Lê Văn C',
    uploadedDate: '06/01/2026',
    uploadedTime: '14:20',
    fileSize: '45.2 MB',
    location: 'Quận 5, TP.HCM',
    tags: ['Video', 'Chế biến', 'ATTP'],
    description: 'Video quá trình chế biến thực phẩm tại nhà hàng',
  },
  {
    id: 'EV-2026-004',
    fileName: 'nguyen_lieu_het_han_su_dung.jpg',
    fileType: 'image',
    thumbnail: 'https://images.unsplash.com/photo-1516594798947-e65505dbb29d?w=200&h=200&fit=crop',
    status: 'flagged',
    uploadedBy: 'Phạm Thị D',
    uploadedDate: '06/01/2026',
    uploadedTime: '16:45',
    fileSize: '3.1 MB',
    location: 'Quận 7, TP.HCM',
    tags: ['Hết hạn', 'Nguy hiểm', 'Nguyên liệu'],
    description: 'Nguyên liệu hết hạn sử dụng phát hiện tại kho',
  },
  {
    id: 'EV-2026-005',
    fileName: 'giay_phep_atvstp.pdf',
    fileType: 'document',
    thumbnail: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=200&h=200&fit=crop',
    status: 'approved',
    uploadedBy: 'Hoàng Văn E',
    uploadedDate: '05/01/2026',
    uploadedTime: '08:00',
    fileSize: '1.2 MB',
    location: 'Quận 10, TP.HCM',
    tags: ['Giấy phép', 'ATTP', 'Hợp lệ'],
    description: 'Giấy phép ATTP',
  },
  {
    id: 'EV-2026-006',
    fileName: 'khu_vuc_bep_khong_dam_bao.jpg',
    fileType: 'image',
    thumbnail: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=200&h=200&fit=crop',
    status: 'new',
    uploadedBy: 'Vũ Thị F',
    uploadedDate: '05/01/2026',
    uploadedTime: '11:30',
    fileSize: '2.8 MB',
    location: 'Quận 2, TP.HCM',
    tags: ['Bếp', 'Vi phạm', 'Vệ sinh'],
    description: 'Khu vực bếp không đảm bảo vệ sinh',
  },
  {
    id: 'EV-2026-007',
    fileName: 'ket_qua_xet_nghiem_mau.pdf',
    fileType: 'document',
    thumbnail: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=200&h=200&fit=crop',
    status: 'pending',
    uploadedBy: 'Đặng Văn G',
    uploadedDate: '04/01/2026',
    uploadedTime: '13:15',
    fileSize: '645 KB',
    location: 'Quận 8, TP.HCM',
    tags: ['Xét nghiệm', 'Phân tích'],
    description: 'Kết quả xét nghiệm mẫu thực phẩm',
  },
  {
    id: 'EV-2026-008',
    fileName: 'quy_trinh_bao_quan_thuc_pham.mp4',
    fileType: 'video',
    thumbnail: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&h=200&fit=crop',
    status: 'approved',
    uploadedBy: 'Bùi Thị H',
    uploadedDate: '04/01/2026',
    uploadedTime: '15:45',
    fileSize: '38.7 MB',
    location: 'Quận 4, TP.HCM',
    tags: ['Video', 'Bảo quản', 'Đúng chuẩn'],
    description: 'Quy trình bảo quản thực phẩm đúng chuẩn',
  },
  {
    id: 'EV-2026-009',
    fileName: 'nhan_mac_khong_ro_nguon_goc.jpg',
    fileType: 'image',
    thumbnail: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=200&h=200&fit=crop',
    status: 'flagged',
    uploadedBy: 'Ngô Văn I',
    uploadedDate: '03/01/2026',
    uploadedTime: '10:20',
    fileSize: '1.9 MB',
    location: 'Quận 6, TP.HCM',
    tags: ['Nhãn mác', 'Nguồn gốc', 'Vi phạm'],
    description: 'Nhãn mác không rõ nguồn gốc xuất xứ',
  },
  {
    id: 'EV-2026-010',
    fileName: 'bien_ban_vi_pham_Q3.pdf',
    fileType: 'document',
    thumbnail: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=200&h=200&fit=crop',
    status: 'pending',
    uploadedBy: 'Trương Thị K',
    uploadedDate: '03/01/2026',
    uploadedTime: '12:00',
    fileSize: '920 KB',
    location: 'Quận 3, TP.HCM',
    tags: ['Biên bản', 'Vi phạm', 'Quận 3'],
    description: 'Biên bản vi phạm tại Quận 3',
  },
];
