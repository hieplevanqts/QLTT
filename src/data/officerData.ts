// Mock data for Market Management Officers (Cán bộ quản lý thị trường)
// 20 wards from Hanoi districts

export interface Officer {
  id: string;
  fullName: string;
  position: string; // Chức vụ
  phone: string;
  email: string;
  ward: string;
  district: string;
  avatarUrl?: string;
  // Tiêu chí ngành
  criteria: {
    totalInspections: number; // Tổng số lần kiểm tra
    violationsCaught: number; // Số vụ vi phạm phát hiện
    finesIssued: number; // Số quyết định xử phạt
    totalFineAmount: number; // Tổng tiền phạt (VND)
    complaintsResolved: number; // Số khiếu nại đã giải quyết
    educationSessions: number; // Số buổi tuyên truyền
  };
  // Thông tin bổ sung
  yearsOfService: number; // Số năm công tác
  specialization: string[]; // Chuyên môn
}

// Mock officers data for 20 wards
export const officersData: Officer[] = [
  // ========== HOÀN KIẾM DISTRICT (6 officers) ==========
  
  {
    id: 'OFF001',
    fullName: 'Nguyễn Văn An',
    position: 'Trưởng phòng Quản lý thị trường',
    phone: '0912345678',
    email: 'nv.an@qltt.hanoi.gov.vn',
    ward: 'Phường Hàng Đào',
    district: 'Hoàn Kiếm',
    criteria: {
      totalInspections: 156,
      violationsCaught: 42,
      finesIssued: 38,
      totalFineAmount: 285000000,
      complaintsResolved: 15,
      educationSessions: 8,
    },
    yearsOfService: 12,
    specialization: ['An toàn thực phẩm', 'Hàng giả hàng nhái', 'Hàng hóa kém chất lượng'],
  },
  
  {
    id: 'OFF002',
    fullName: 'Trần Thị Bình',
    position: 'Phó trưởng phòng',
    phone: '0923456789',
    email: 'tt.binh@qltt.hanoi.gov.vn',
    ward: 'Phường Tràng Tiền',
    district: 'Hoàn Kiếm',
    criteria: {
      totalInspections: 143,
      violationsCaught: 38,
      finesIssued: 35,
      totalFineAmount: 265000000,
      complaintsResolved: 12,
      educationSessions: 9,
    },
    yearsOfService: 10,
    specialization: ['Nhãn mác hàng hóa', 'Sở hữu trí tuệ', 'Hàng cấm'],
  },
  
  {
    id: 'OFF003',
    fullName: 'Lê Minh Cường',
    position: 'Chuyên viên chính',
    phone: '0934567890',
    email: 'lm.cuong@qltt.hanoi.gov.vn',
    ward: 'Phường Phan Chu Trinh',
    district: 'Hoàn Kiếm',
    criteria: {
      totalInspections: 128,
      violationsCaught: 31,
      finesIssued: 28,
      totalFineAmount: 198000000,
      complaintsResolved: 10,
      educationSessions: 6,
    },
    yearsOfService: 8,
    specialization: ['Bảo vệ người tiêu dùng', 'Hàng hóa nhập lậu'],
  },
  
  {
    id: 'OFF004',
    fullName: 'Phạm Thu Hà',
    position: 'Chuyên viên',
    phone: '0945678901',
    email: 'pt.ha@qltt.hanoi.gov.vn',
    ward: 'Phường Đồng Xuân',
    district: 'Hoàn Kiếm',
    criteria: {
      totalInspections: 167,
      violationsCaught: 48,
      finesIssued: 44,
      totalFineAmount: 325000000,
      complaintsResolved: 18,
      educationSessions: 11,
    },
    yearsOfService: 9,
    specialization: ['Kiểm tra chợ truyền thống', 'Hàng giả', 'An toàn vệ sinh thực phẩm'],
  },
  
  {
    id: 'OFF005',
    fullName: 'Hoàng Văn Đức',
    position: 'Chuyên viên',
    phone: '0956789012',
    email: 'hv.duc@qltt.hanoi.gov.vn',
    ward: 'Phường Lý Thái Tổ',
    district: 'Hoàn Kiếm',
    criteria: {
      totalInspections: 135,
      violationsCaught: 35,
      finesIssued: 32,
      totalFineAmount: 245000000,
      complaintsResolved: 13,
      educationSessions: 7,
    },
    yearsOfService: 7,
    specialization: ['Quản lý giá', 'Hoạt động kinh doanh có điều kiện'],
  },
  
  {
    id: 'OFF006',
    fullName: 'Đỗ Thị Mai',
    position: 'Chuyên viên',
    phone: '0967890123',
    email: 'dt.mai@qltt.hanoi.gov.vn',
    ward: 'Phường Hàng Bạc',
    district: 'Hoàn Kiếm',
    criteria: {
      totalInspections: 149,
      violationsCaught: 40,
      finesIssued: 37,
      totalFineAmount: 278000000,
      complaintsResolved: 14,
      educationSessions: 10,
    },
    yearsOfService: 11,
    specialization: ['Trang sức vàng bạc', 'Hàng thủ công mỹ nghệ', 'Nguồn gốc xuất xứ'],
  },
  
  // ========== BA ĐÌNH DISTRICT (2 officers) ==========
  
  {
    id: 'OFF007',
    fullName: 'Vũ Quang Hải',
    position: 'Trưởng phòng Quản lý thị trường',
    phone: '0978901234',
    email: 'vq.hai@qltt.hanoi.gov.vn',
    ward: 'Phường Điện Biên',
    district: 'Ba Đình',
    criteria: {
      totalInspections: 172,
      violationsCaught: 45,
      finesIssued: 41,
      totalFineAmount: 312000000,
      complaintsResolved: 17,
      educationSessions: 12,
    },
    yearsOfService: 15,
    specialization: ['Thanh tra toàn diện', 'Xử lý vi phạm hành chính', 'Hàng cấm lưu thông'],
  },
  
  {
    id: 'OFF008',
    fullName: 'Ngô Thị Lan',
    position: 'Phó trưởng phòng',
    phone: '0989012345',
    email: 'nt.lan@qltt.hanoi.gov.vn',
    ward: 'Phường Quán Thánh',
    district: 'Ba Đình',
    criteria: {
      totalInspections: 158,
      violationsCaught: 41,
      finesIssued: 38,
      totalFineAmount: 289000000,
      complaintsResolved: 16,
      educationSessions: 9,
    },
    yearsOfService: 13,
    specialization: ['Du lịch và dịch vụ', 'Nhà hàng khách sạn', 'ATTP'],
  },
  
  // ========== ĐỐNG ĐA DISTRICT (1 officer) ==========
  
  {
    id: 'OFF009',
    fullName: 'Bùi Minh Tuấn',
    position: 'Trưởng phòng Quản lý thị trường',
    phone: '0990123456',
    email: 'bm.tuan@qltt.hanoi.gov.vn',
    ward: 'Phường Văn Miếu',
    district: 'Đống Đa',
    criteria: {
      totalInspections: 161,
      violationsCaught: 43,
      finesIssued: 39,
      totalFineAmount: 295000000,
      complaintsResolved: 15,
      educationSessions: 10,
    },
    yearsOfService: 14,
    specialization: ['Di tích lịch sử', 'Vé tham quan', 'Hàng lưu niệm'],
  },
  
  // ========== HAI BÀ TRƯNG DISTRICT (2 officers) ==========
  
  {
    id: 'OFF010',
    fullName: 'Đinh Văn Long',
    position: 'Trưởng phòng Quản lý thị trường',
    phone: '0901234567',
    email: 'dv.long@qltt.hanoi.gov.vn',
    ward: 'Phường Lê Đại Hành',
    district: 'Hai Bà Trưng',
    criteria: {
      totalInspections: 154,
      violationsCaught: 39,
      finesIssued: 36,
      totalFineAmount: 271000000,
      complaintsResolved: 14,
      educationSessions: 8,
    },
    yearsOfService: 11,
    specialization: ['Trung tâm thương mại', 'Siêu thị', 'Cửa hàng tiện lợi'],
  },
  
  {
    id: 'OFF011',
    fullName: 'Trịnh Thị Nga',
    position: 'Chuyên viên chính',
    phone: '0912345670',
    email: 'tt.nga@qltt.hanoi.gov.vn',
    ward: 'Phường Nguyễn Du',
    district: 'Hai Bà Trưng',
    criteria: {
      totalInspections: 146,
      violationsCaught: 37,
      finesIssued: 34,
      totalFineAmount: 258000000,
      complaintsResolved: 12,
      educationSessions: 9,
    },
    yearsOfService: 9,
    specialization: ['Thực phẩm tươi sống', 'Rau quả', 'Thủy hải sản'],
  },
  
  // ========== TÂY HỒ DISTRICT (2 officers) ==========
  
  {
    id: 'OFF012',
    fullName: 'Nguyễn Thị Hồng',
    position: 'Trưởng phòng Quản lý thị trường',
    phone: '0923456781',
    email: 'nt.hong@qltt.hanoi.gov.vn',
    ward: 'Phường Quảng An',
    district: 'Tây Hồ',
    criteria: {
      totalInspections: 168,
      violationsCaught: 44,
      finesIssued: 40,
      totalFineAmount: 305000000,
      complaintsResolved: 16,
      educationSessions: 11,
    },
    yearsOfService: 13,
    specialization: ['Nhà hàng cao cấp', 'Du lịch', 'ATTP'],
  },
  
  {
    id: 'OFF013',
    fullName: 'Phạm Văn Sơn',
    position: 'Chuyên viên chính',
    phone: '0934567892',
    email: 'pv.son@qltt.hanoi.gov.vn',
    ward: 'Phường Nhật Tân',
    district: 'Tây Hồ',
    criteria: {
      totalInspections: 142,
      violationsCaught: 36,
      finesIssued: 33,
      totalFineAmount: 248000000,
      complaintsResolved: 13,
      educationSessions: 8,
    },
    yearsOfService: 10,
    specialization: ['Nông sản', 'Hoa kiểng', 'Cây cảnh'],
  },
  
  // ========== CẦU GIẤY DISTRICT (2 officers) ==========
  
  {
    id: 'OFF014',
    fullName: 'Lê Quang Minh',
    position: 'Trưởng phòng Quản lý thị trường',
    phone: '0945678903',
    email: 'lq.minh@qltt.hanoi.gov.vn',
    ward: 'Phường Dịch Vọng Hậu',
    district: 'Cầu Giấy',
    criteria: {
      totalInspections: 175,
      violationsCaught: 47,
      finesIssued: 43,
      totalFineAmount: 328000000,
      complaintsResolved: 18,
      educationSessions: 13,
    },
    yearsOfService: 14,
    specialization: ['Công nghệ thông tin', 'Thiết bị điện tử', 'Phần mềm'],
  },
  
  {
    id: 'OFF015',
    fullName: 'Hoàng Thị Thu',
    position: 'Phó trưởng phòng',
    phone: '0956789014',
    email: 'ht.thu@qltt.hanoi.gov.vn',
    ward: 'Phường Trung Hòa',
    district: 'Cầu Giấy',
    criteria: {
      totalInspections: 159,
      violationsCaught: 42,
      finesIssued: 38,
      totalFineAmount: 292000000,
      complaintsResolved: 15,
      educationSessions: 10,
    },
    yearsOfService: 11,
    specialization: ['Khu đô thị', 'Dịch vụ cao cấp', 'Trung tâm thương mại'],
  },
  
  // ========== NAM TỪ LIÊM DISTRICT (1 officer) ==========
  
  {
    id: 'OFF016',
    fullName: 'Trần Đức Anh',
    position: 'Trưởng phòng Quản lý thị trường',
    phone: '0967890125',
    email: 'td.anh@qltt.hanoi.gov.vn',
    ward: 'Phường Mỹ Đình 1',
    district: 'Nam Từ Liêm',
    criteria: {
      totalInspections: 181,
      violationsCaught: 49,
      finesIssued: 45,
      totalFineAmount: 342000000,
      complaintsResolved: 19,
      educationSessions: 14,
    },
    yearsOfService: 15,
    specialization: ['Sự kiện thể thao', 'Hội chợ triển lãm', 'Kinh doanh vé'],
  },
  
  // ========== LONG BIÊN DISTRICT (2 officers) ==========
  
  {
    id: 'OFF017',
    fullName: 'Vũ Thị Lan Anh',
    position: 'Trưởng phòng Quản lý thị trường',
    phone: '0978901236',
    email: 'vtl.anh@qltt.hanoi.gov.vn',
    ward: 'Phường Ngọc Thụy',
    district: 'Long Biên',
    criteria: {
      totalInspections: 163,
      violationsCaught: 43,
      finesIssued: 39,
      totalFineAmount: 298000000,
      complaintsResolved: 16,
      educationSessions: 11,
    },
    yearsOfService: 12,
    specialization: ['Chợ đầu mối', 'Nông sản', 'Thực phẩm'],
  },
  
  {
    id: 'OFF018',
    fullName: 'Đặng Văn Hùng',
    position: 'Chuyên viên chính',
    phone: '0989012347',
    email: 'dv.hung@qltt.hanoi.gov.vn',
    ward: 'Phường Bồ Đề',
    district: 'Long Biên',
    criteria: {
      totalInspections: 151,
      violationsCaught: 39,
      finesIssued: 36,
      totalFineAmount: 275000000,
      complaintsResolved: 14,
      educationSessions: 9,
    },
    yearsOfService: 10,
    specialization: ['Thủy sản', 'Chợ truyền thống', 'ATTP'],
  },
  
  // ========== ĐỐNG ĐA DISTRICT (1 more officer) ==========
  
  {
    id: 'OFF019',
    fullName: 'Mai Thị Phương',
    position: 'Chuyên viên chính',
    phone: '0990123458',
    email: 'mt.phuong@qltt.hanoi.gov.vn',
    ward: 'Phường Láng Hạ',
    district: 'Đống Đa',
    criteria: {
      totalInspections: 157,
      violationsCaught: 41,
      finesIssued: 37,
      totalFineAmount: 282000000,
      complaintsResolved: 15,
      educationSessions: 10,
    },
    yearsOfService: 9,
    specialization: ['Rạp chiếu phim', 'Giải trí', 'Văn hóa nghệ thuật'],
  },
  
  // ========== BA ĐÌNH DISTRICT (1 more officer) ==========
  
  {
    id: 'OFF020',
    fullName: 'Nguyễn Hải Đăng',
    position: 'Chuyên viên',
    phone: '0901234568',
    email: 'nh.dang@qltt.hanoi.gov.vn',
    ward: 'Phường Kim Mã',
    district: 'Ba Đình',
    criteria: {
      totalInspections: 148,
      violationsCaught: 38,
      finesIssued: 35,
      totalFineAmount: 267000000,
      complaintsResolved: 13,
      educationSessions: 8,
    },
    yearsOfService: 8,
    specialization: ['Ngoại giao', 'Dịch vụ quốc tế', 'Khách sạn cao cấp'],
  },
  
  // ========== HOÀNG MAI DISTRICT (1 officer) ==========
  
  {
    id: 'OFF021',
    fullName: 'Phan Văn Tuấn',
    position: 'Trưởng phòng Quản lý thị trường',
    phone: '0912345681',
    email: 'pv.tuan@qltt.hanoi.gov.vn',
    ward: 'Phường Hoàng Liệt',
    district: 'Hoàng Mai',
    criteria: {
      totalInspections: 164,
      violationsCaught: 44,
      finesIssued: 40,
      totalFineAmount: 302000000,
      complaintsResolved: 17,
      educationSessions: 12,
    },
    yearsOfService: 13,
    specialization: ['Khu đô thị mới', 'Bất động sản', 'Dịch vụ cộng đồng'],
  },
  
  // ========== THANH XUÂN DISTRICT (2 officers) ==========
  
  {
    id: 'OFF022',
    fullName: 'Trương Thị Hương',
    position: 'Trưởng phòng Quản lý thị trường',
    phone: '0923456782',
    email: 'tt.huong@qltt.hanoi.gov.vn',
    ward: 'Phường Nhân Chính',
    district: 'Thanh Xuân',
    criteria: {
      totalInspections: 171,
      violationsCaught: 46,
      finesIssued: 42,
      totalFineAmount: 318000000,
      complaintsResolved: 17,
      educationSessions: 12,
    },
    yearsOfService: 14,
    specialization: ['Khu đô thị hiện đại', 'Trung tâm thương mại', 'Siêu thị'],
  },
  
  {
    id: 'OFF023',
    fullName: 'Đỗ Văn Nam',
    position: 'Phó trưởng phòng',
    phone: '0934567893',
    email: 'dv.nam@qltt.hanoi.gov.vn',
    ward: 'Phường Khương Trung',
    district: 'Thanh Xuân',
    criteria: {
      totalInspections: 156,
      violationsCaught: 40,
      finesIssued: 37,
      totalFineAmount: 285000000,
      complaintsResolved: 14,
      educationSessions: 9,
    },
    yearsOfService: 11,
    specialization: ['Chợ dân sinh', 'Thực phẩm tươi sống', 'ATTP'],
  },
  
  // ========== CẦU GIẤY DISTRICT (2 more officers) ==========
  
  {
    id: 'OFF024',
    fullName: 'Nguyễn Văn Thành',
    position: 'Chuyên viên chính',
    phone: '0945678904',
    email: 'nv.thanh@qltt.hanoi.gov.vn',
    ward: 'Phường Mai Dịch',
    district: 'Cầu Giấy',
    criteria: {
      totalInspections: 162,
      violationsCaught: 43,
      finesIssued: 39,
      totalFineAmount: 295000000,
      complaintsResolved: 15,
      educationSessions: 10,
    },
    yearsOfService: 10,
    specialization: ['Văn phòng phẩm', 'Thiết bị văn phòng', 'Dịch vụ in ấn'],
  },
  
  {
    id: 'OFF025',
    fullName: 'Lê Thị Ngọc',
    position: 'Chuyên viên',
    phone: '0956789015',
    email: 'lt.ngoc@qltt.hanoi.gov.vn',
    ward: 'Phường Yên Hòa',
    district: 'Cầu Giấy',
    criteria: {
      totalInspections: 153,
      violationsCaught: 39,
      finesIssued: 36,
      totalFineAmount: 272000000,
      complaintsResolved: 13,
      educationSessions: 8,
    },
    yearsOfService: 9,
    specialization: ['Nhà hàng', 'Quán cafe', 'Dịch vụ ăn uống'],
  },
  
  // ========== HÀ ĐÔNG DISTRICT (4 officers) ==========
  
  {
    id: 'OFF026',
    fullName: 'Phạm Đức Hải',
    position: 'Trưởng phòng Quản lý thị trường',
    phone: '0967890126',
    email: 'pd.hai@qltt.hanoi.gov.vn',
    ward: 'Phường Mộ Lao',
    district: 'Hà Đông',
    criteria: {
      totalInspections: 178,
      violationsCaught: 48,
      finesIssued: 44,
      totalFineAmount: 335000000,
      complaintsResolved: 18,
      educationSessions: 13,
    },
    yearsOfService: 15,
    specialization: ['Khu công nghiệp', 'Vật liệu xây dựng', 'Hóa chất'],
  },
  
  {
    id: 'OFF027',
    fullName: 'Vũ Thị Thanh',
    position: 'Phó trưởng phòng',
    phone: '0978901237',
    email: 'vt.thanh@qltt.hanoi.gov.vn',
    ward: 'Phường Văn Quán',
    district: 'Hà Đông',
    criteria: {
      totalInspections: 165,
      violationsCaught: 44,
      finesIssued: 40,
      totalFineAmount: 305000000,
      complaintsResolved: 16,
      educationSessions: 11,
    },
    yearsOfService: 12,
    specialization: ['Khu đô thị', 'Bất động sản', 'Dịch vụ tiện ích'],
  },
  
  {
    id: 'OFF028',
    fullName: 'Hoàng Minh Đức',
    position: 'Chuyên viên chính',
    phone: '0989012348',
    email: 'hm.duc@qltt.hanoi.gov.vn',
    ward: 'Phường La Khê',
    district: 'Hà Đông',
    criteria: {
      totalInspections: 169,
      violationsCaught: 45,
      finesIssued: 41,
      totalFineAmount: 312000000,
      complaintsResolved: 17,
      educationSessions: 12,
    },
    yearsOfService: 13,
    specialization: ['Chợ truyền thống', 'Thực phẩm', 'Rau quả sạch'],
  },
  
  {
    id: 'OFF029',
    fullName: 'Nguyễn Thị Hoa',
    position: 'Chuyên viên',
    phone: '0990123459',
    email: 'nt.hoa@qltt.hanoi.gov.vn',
    ward: 'Phường Phú Lương',
    district: 'Hà Đông',
    criteria: {
      totalInspections: 144,
      violationsCaught: 37,
      finesIssued: 34,
      totalFineAmount: 262000000,
      complaintsResolved: 12,
      educationSessions: 7,
    },
    yearsOfService: 8,
    specialization: ['Dược phẩm', 'Mỹ phẩm', 'Thiết bị y tế'],
  },
  
  // ========== BẮC TỪ LIÊM DISTRICT (2 officers) ==========
  
  {
    id: 'OFF030',
    fullName: 'Trần Quang Huy',
    position: 'Trưởng phòng Quản lý thị trường',
    phone: '0901234569',
    email: 'tq.huy@qltt.hanoi.gov.vn',
    ward: 'Phường Xuân Đỉnh',
    district: 'Bắc Từ Liêm',
    criteria: {
      totalInspections: 174,
      violationsCaught: 47,
      finesIssued: 43,
      totalFineAmount: 325000000,
      complaintsResolved: 18,
      educationSessions: 13,
    },
    yearsOfService: 14,
    specialization: ['Đô thị mới', 'Nhà hàng cao cấp', 'Dịch vụ du lịch'],
  },
  
  {
    id: 'OFF031',
    fullName: 'Mai Thị Lan',
    position: 'Phó trưởng phòng',
    phone: '0912345682',
    email: 'mt.lan@qltt.hanoi.gov.vn',
    ward: 'Phường Cổ Nhuế 1',
    district: 'Bắc Từ Liêm',
    criteria: {
      totalInspections: 158,
      violationsCaught: 41,
      finesIssued: 38,
      totalFineAmount: 288000000,
      complaintsResolved: 15,
      educationSessions: 10,
    },
    yearsOfService: 11,
    specialization: ['Siêu thị', 'Cửa hàng tiện lợi', 'Chuỗi bán lẻ'],
  },
];