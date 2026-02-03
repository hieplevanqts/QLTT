// Fake data cho 1000 cơ sở kinh doanh thuộc tất cả các ngành nghề tại Hà Nội

export interface CitizenReport {
  id: string;
  reporterName: string;
  reportDate: string;
  content: string;
  images: string[];
  videos?: string[];
  violationType: string;
}

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  type: string; // Loại hình kinh doanh
  businessType: string; // Alias for type for backward compatibility
  category: 'certified' | 'hotspot' | 'scheduled' | 'inspected'; // Phân loại mới
  categoryId?: string; // 🔥 Category ID from database (UUID for filtering)
  province: string; // Tỉnh/Thành phố
  district: string; // Phường/Xã
  ward: string; // Phường/Xã
  citizenReports?: CitizenReport[]; // Phản ánh của người dân (chỉ cho hotspot)
  nearbyPopulation?: number; // Số dân sinh sống trong bán kính 500m xung quanh điểm
  // Additional fields from database
  hotline?: string;
  logo?: string;
  images?: any; // jsonb
  reviewScore?: number;
  reviewCount?: number;
  openingHours?: any; // jsonb
  status?: number;
  statusName?: string; // 🔥 Tên trạng thái từ database (ví dụ: "Đạt chuẩn", "Điểm nóng")
  taxCode?: string; // 🔥 Mã số thuế (từ backend field tax_code)
}

// Tất cả các loại hình kinh doanh trong xã hội
const businessTypes = [
  // Ăn uống (20%)
  'Nhà hàng', 'Quán cà phê', 'Quán ăn nhanh', 'Quán phở', 'Quán bún', 'Buffet', 'Quán lẩu', 'Bánh mì',
  
  // Y tế (10%)
  'Bệnh viện', 'Phòng khám', 'Nhà thuốc', 'Phòng xét nghiệm',
  
  // Giáo dục (8%)
  'Trường học', 'Trung tâm đào tạo', 'Thư viện', 'Nhà trẻ',
  
  // Thương mại (15%)
  'Siêu thị', 'Cửa hàng tiện lợi', 'Shop thời trang', 'Cửa hàng điện tử', 'Chợ',
  
  // Dịch vụ cá nhân (12%)
  'Salon tóc', 'Spa & Massage', 'Giặt ủi', 'Thẩm mỹ viện',
  
  // Giải trí (10%)
  'Rạp phim', 'Karaoke', 'Phòng gym', 'Billiards', 'Game center',
  
  // Tài chính (8%)
  'Ngân hàng', 'ATM', 'Cửa hàng vàng', 'Bảo hiểm',
  
  // Công nghệ (7%)
  'Cửa hàng điện thoại', 'Sửa chữa máy tính', 'Cửa hàng máy ảnh',
  
  // Giao thông (5%)
  'Trạm xăng', 'Garage sửa xe', 'Rửa xe',
  
  // Khác (5%)
  'Khách sạn', 'Văn phòng cho thuê', 'Kho bãi', 'Bưu điện', 'In ấn'
];

// Địa chỉ thực tế với tọa độ chính xác tại Hà Nội
const realLocations = [
  // Hoàn Kiếm
  { street: 'Hàng Bài', district: 'Hoàn Kiếm', ward: 'Phường Hàng Bài', lat: 21.0245, lng: 105.8516 },
  { street: 'Hàng Gai', district: 'Hoàn Kiếm', ward: 'Phường Hàng Gai', lat: 21.0267, lng: 105.8527 },
  { street: 'Hàng Bạc', district: 'Hoàn Kiếm', ward: 'Phường Hàng Bạc', lat: 21.0332, lng: 105.8515 },
  { street: 'Hàng Đào', district: 'Hoàn Kiếm', ward: 'Phường Hàng Đào', lat: 21.0308, lng: 105.8502 },
  { street: 'Hàng Ngang', district: 'Hoàn Kiếm', ward: 'Phường Hàng Ngang', lat: 21.0301, lng: 105.8484 },
  { street: 'Lý Thái Tổ', district: 'Hoàn Kiếm', ward: 'Phường Lý Thái Tổ', lat: 21.0233, lng: 105.8542 },
  { street: 'Đinh Tiên Hoàng', district: 'Hoàn Kiếm', ward: 'Phường Đinh Tiên Hoàng', lat: 21.0251, lng: 105.8553 },
  { street: 'Lê Thái Tổ', district: 'Hoàn Kiếm', ward: 'Phường Lê Thái Tổ', lat: 21.0275, lng: 105.8498 },
  { street: 'Bà Triệu', district: 'Hoàn Kiếm', ward: 'Phường Bà Triệu', lat: 21.0213, lng: 105.8504 },
  { street: 'Tràng Tiền', district: 'Hoàn Kiếm', ward: 'Phường Tràng Tiền', lat: 21.0256, lng: 105.8531 },
  
  // Ba Đình
  { street: 'Ngọc Hà', district: 'Ba Đình', ward: 'Phường Ngọc Hà', lat: 21.0419, lng: 105.8274 },
  { street: 'Ngọc Khánh', district: 'Ba Đình', ward: 'Phường Ngọc Khánh', lat: 21.0303, lng: 105.8151 },
  { street: 'Kim Mã', district: 'Ba Đình', ward: 'Phường Kim Mã', lat: 21.0288, lng: 105.8189 },
  { street: 'Liễu Giai', district: 'Ba Đình', ward: 'Phường Liễu Giai', lat: 21.0274, lng: 105.8145 },
  { street: 'Núi Trúc', district: 'Ba Đình', ward: 'Phường Núi Trúc', lat: 21.0301, lng: 105.8207 },
  { street: 'Đội Cấn', district: 'Ba Đình', ward: 'Phường Đội Cấn', lat: 21.0318, lng: 105.8234 },
  { street: 'Giảng Võ', district: 'Ba Đình', ward: 'Phường Giảng Võ', lat: 21.0265, lng: 105.8173 },
  { street: 'Nguyễn Thái Học', district: 'Ba Đình', ward: 'Phường Nguyễn Thái Học', lat: 21.0344, lng: 105.8418 },
  { street: 'Hoàng Diệu', district: 'Ba Đình', ward: 'Phường Hoàng Diệu', lat: 21.0365, lng: 105.8392 },
  { street: 'Văn Cao', district: 'Ba Đình', ward: 'Phường Văn Cao', lat: 21.0398, lng: 105.8310 },
  
  // Đống Đa
  { street: 'Láng Hạ', district: 'Đống Đa', ward: 'Phường Láng Hạ', lat: 21.0183, lng: 105.8171 },
  { street: 'Xã Đàn', district: 'Đống Đa', ward: 'Phường Xã Đàn', lat: 21.0152, lng: 105.8305 },
  { street: 'Tôn Đức Thắng', district: 'Đống Đa', ward: 'Phường Tôn Đức Thắng', lat: 21.0125, lng: 105.8243 },
  { street: 'Ô Chợ Dừa', district: 'Đống Đa', ward: 'Phường Ô Chợ Dừa', lat: 21.0168, lng: 105.8268 },
  { street: 'Khâm Thiên', district: 'Đống Đa', ward: 'Phường Khâm Thiên', lat: 21.0197, lng: 105.8317 },
  { street: 'Thái Hà', district: 'Đống Đa', ward: 'Phường Thái Hà', lat: 21.0165, lng: 105.8201 },
  { street: 'Chùa Bộc', district: 'Đống Đa', ward: 'Phường Chùa Bộc', lat: 21.0134, lng: 105.8282 },
  { street: 'Trường Chinh', district: 'Đống Đa', ward: 'Phường Trường Chinh', lat: 21.0089, lng: 105.8357 },
  { street: 'Nguyễn Lương Bằng', district: 'Đống Đa', ward: 'Phường Nguyễn Lương Bằng', lat: 21.0109, lng: 105.8189 },
  { street: 'Láng', district: 'Đống Đa', ward: 'Phường Láng', lat: 21.0201, lng: 105.8097 },
  
  // Hai Bà Trưng
  { street: 'Bạch Mai', district: 'Hai Bà Trưng', ward: 'Phường Bạch Mai', lat: 21.0043, lng: 105.8458 },
  { street: 'Minh Khai', district: 'Hai Bà Trưng', ward: 'Phường Minh Khai', lat: 21.0098, lng: 105.8562 },
  { street: 'Nguyễn Đình Chiểu', district: 'Hai Bà Trưng', ward: 'Phường Nguyễn Đình Chiểu', lat: 21.0124, lng: 105.8478 },
  { street: 'Vĩnh Tuy', district: 'Hai Bà Trưng', ward: 'Phường Vĩnh Tuy', lat: 21.0067, lng: 105.8724 },
  { street: 'Thanh Nhàn', district: 'Hai Bà Trưng', ward: 'Phường Thanh Nhàn', lat: 21.0087, lng: 105.8515 },
  { street: 'Đại Cồ Việt', district: 'Hai Bà Trưng', ward: 'Phường Đại Cồ Việt', lat: 21.0072, lng: 105.8426 },
  { street: 'Lê Duẩn', district: 'Hai Bà Trưng', ward: 'Phường Lê Duẩn', lat: 21.0134, lng: 105.8401 },
  { street: 'Trần Khát Chân', district: 'Hai Bà Trưng', ward: 'Phường Trần Khát Chân', lat: 21.0056, lng: 105.8503 },
  { street: 'Phố Huế', district: 'Hai Bà Trưng', ward: 'Phường Phố Huế', lat: 21.0189, lng: 105.8441 },
  { street: 'Nguyễn Khoái', district: 'Hai Bà Trưng', ward: 'Phường Nguyễn Khoái', lat: 21.0029, lng: 105.8587 },
  
  // Cầu Giấy
  { street: 'Xuân Thủy', district: 'Cầu Giấy', ward: 'Phường Xuân Thủy', lat: 21.0378, lng: 105.7924 },
  { street: 'Trần Thái Tông', district: 'Cầu Giấy', ward: 'Phường Trần Thái Tông', lat: 21.0401, lng: 105.7871 },
  { street: 'Duy Tân', district: 'Cầu Giấy', ward: 'Phường Duy Tân', lat: 21.0289, lng: 105.7845 },
  { street: 'Hoàng Quốc Việt', district: 'Cầu Giấy', ward: 'Phường Hoàng Quốc Việt', lat: 21.0423, lng: 105.7813 },
  { street: 'Nghĩa Tân', district: 'Cầu Giấy', ward: 'Phường Nghĩa Tân', lat: 21.0362, lng: 105.7951 },
  { street: 'Phạm Hùng', district: 'Cầu Giấy', ward: 'Phường Phạm Hùng', lat: 21.0318, lng: 105.7734 },
  { street: 'Trần Cung', district: 'Cầu Giấy', ward: 'Phường Trần Cung', lat: 21.0465, lng: 105.7892 },
  { street: 'Nguyễn Khánh Toàn', district: 'Cầu Giấy', ward: 'Phường Nguyễn Khánh Toàn', lat: 21.0334, lng: 105.7968 },
  { street: 'Yên Hòa', district: 'Cầu Giấy', ward: 'Phường Yên Hòa', lat: 21.0298, lng: 105.7912 },
  { street: 'Cầu Giấy', district: 'Cầu Giấy', ward: 'Phường Cầu Giấy', lat: 21.0345, lng: 105.8023 },
  
  // Tây Hồ
  { street: 'Lạc Long Quân', district: 'Tây Hồ', ward: 'Phường Lạc Long Quân', lat: 21.0498, lng: 105.8156 },
  { street: 'Âu Cơ', district: 'Tây Hồ', ward: 'Phường Âu Cơ', lat: 21.0578, lng: 105.8189 },
  { street: 'Võ Chí Công', district: 'Tây Hồ', ward: 'Phường Võ Chí Công', lat: 21.0623, lng: 105.8234 },
  { street: 'Quảng An', district: 'Tây Hồ', ward: 'Phường Quảng An', lat: 21.0556, lng: 105.8267 },
  { street: 'Nghi Tàm', district: 'Tây Hồ', ward: 'Phường Nghi Tàm', lat: 21.0634, lng: 105.8412 },
  { street: 'Yên Phụ', district: 'Tây Hồ', ward: 'Phường Yên Phụ', lat: 21.0501, lng: 105.8389 },
  { street: 'Trích Sài', district: 'Tây Hồ', ward: 'Phường Trích Sài', lat: 21.0587, lng: 105.8301 },
  { street: 'Thụy Khuê', district: 'Tây Hồ', ward: 'Phường Thụy Khuê', lat: 21.0512, lng: 105.8278 },
  { street: 'Tứ Liên', district: 'Tây Hồ', ward: 'Phường Tứ Liên', lat: 21.0467, lng: 105.8201 },
  { street: 'Xuân Diệu', district: 'Tây Hồ', ward: 'Phường Xuân Diệu', lat: 21.0543, lng: 105.8312 },
  
  // Thanh Xuân
  { street: 'Nguyễn Trãi', district: 'Thanh Xuân', ward: 'Phường Nguyễn Trãi', lat: 20.9978, lng: 105.8134 },
  { street: 'Khuất Duy Tiến', district: 'Thanh Xuân', ward: 'Phường Khuất Duy Tiến', lat: 20.9923, lng: 105.8089 },
  { street: 'Phạm Văn Đồng', district: 'Thanh Xuân', ward: 'Phường Phạm Văn Đồng', lat: 21.0012, lng: 105.8267 },
  { street: 'Nguyễn Xiển', district: 'Thanh Xuân', ward: 'Phường Nguyễn Xiển', lat: 20.9867, lng: 105.8156 },
  { street: 'Kim Giang', district: 'Thanh Xuân', ward: 'Phường Kim Giang', lat: 20.9912, lng: 105.8234 },
  { street: 'Hạ Đình', district: 'Thanh Xuân', ward: 'Phường Hạ Đình', lat: 20.9956, lng: 105.8201 },
  { street: 'Lê Văn Lương', district: 'Thanh Xuân', ward: 'Phường Lê Văn Lương', lat: 20.9845, lng: 105.8067 },
  { street: 'Tố Hữu', district: 'Thanh Xuân', ward: 'Phường Tố Hữu', lat: 20.9734, lng: 105.7989 },
  { street: 'Vũ Trọng Phụng', district: 'Thanh Xuân', ward: 'Phường Vũ Trọng Phụng', lat: 20.9989, lng: 105.8178 },
  { street: 'Khương Đình', district: 'Thanh Xuân', ward: 'Phường Khương Đình', lat: 21.0001, lng: 105.8289 },
  
  // Long Biên
  { street: 'Nguyễn Văn Linh', district: 'Long Biên', ward: 'Phường Nguyễn Văn Linh', lat: 21.0412, lng: 105.8934 },
  { street: 'Ngọc Lâm', district: 'Long Biên', ward: 'Phường Ngọc Lâm', lat: 21.0389, lng: 105.8867 },
  { street: 'Phúc Đồng', district: 'Long Biên', ward: 'Phường Phúc Đồng', lat: 21.0434, lng: 105.9012 },
  { street: 'Gia Thụy', district: 'Long Biên', ward: 'Phường Gia Thụy', lat: 21.0356, lng: 105.8945 },
  { street: 'Cự Khối', district: 'Long Biên', ward: 'Phường Cự Khối', lat: 21.0298, lng: 105.8812 },
  { street: 'Bồ Đề', district: 'Long Biên', ward: 'Phường Bồ Đề', lat: 21.0467, lng: 105.9067 },
  { street: 'Sài Đồng', district: 'Long Biên', ward: 'Phường Sài Đồng', lat: 21.0523, lng: 105.9145 },
  { street: 'Đức Giang', district: 'Long Biên', ward: 'Phường Đức Giang', lat: 21.0389, lng: 105.8756 },
  { street: 'Việt Hưng', district: 'Long Biên', ward: 'Phường Việt Hưng', lat: 21.0278, lng: 105.8934 },
  { street: 'Ngọc Thụy', district: 'Long Biên', ward: 'Phường Ngọc Thụy', lat: 21.0501, lng: 105.9089 },
  
  // Nam Từ Liêm
  { street: 'Mễ Trì', district: 'Nam Từ Liêm', ward: 'Phường Mễ Trì', lat: 21.0234, lng: 105.7678 },
  { street: 'Mỹ Đình', district: 'Nam Từ Liêm', ward: 'Phường Mỹ Đình', lat: 21.0289, lng: 105.7567 },
  { street: 'Trần Đăng Ninh', district: 'Nam Từ Liêm', ward: 'Phường Trần Đăng Ninh', lat: 21.0156, lng: 105.7734 },
  { street: 'Lê Quang Đạo', district: 'Nam Từ Liêm', ward: 'Phường Lê Quang Đạo', lat: 21.0201, lng: 105.7645 },
  { street: 'Phạm Văn Đồng', district: 'Nam Từ Liêm', ward: 'Phường Phạm Văn Đồng', lat: 21.0312, lng: 105.7812 },
  { street: 'Tố Hữu', district: 'Nam Từ Liêm', ward: 'Phường Tố Hữu', lat: 20.9823, lng: 105.7589 },
  { street: 'Đại lộ Thăng Long', district: 'Nam Từ Liêm', ward: 'Phường Đại lộ Thăng Long', lat: 21.0267, lng: 105.7512 },
  { street: 'Lê Đức Thọ', district: 'Nam Từ Liêm', ward: 'Phường Lê Đức Thọ', lat: 21.0178, lng: 105.7789 },
  { street: 'Cầu Diễn', district: 'Nam Từ Liêm', ward: 'Phường Cầu Diễn', lat: 21.0423, lng: 105.7623 },
  { street: 'Xuân Phương', district: 'Nam Từ Liêm', ward: 'Phường Xuân Phương', lat: 21.0134, lng: 105.7456 },
  
  // Bắc Từ Liêm
  { street: 'Phạm Văn Đồng', district: 'Bắc Từ Liêm', ward: 'Phường Phạm Văn Đồng', lat: 21.0589, lng: 105.7734 },
  { street: 'Xuân Đỉnh', district: 'Bắc Từ Liêm', ward: 'Phường Xuân Đỉnh', lat: 21.0612, lng: 105.7623 },
  { street: 'Cổ Nhuế', district: 'Bắc Từ Liêm', ward: 'Phường Cổ Nhuế', lat: 21.0534, lng: 105.7812 },
  { street: 'Đông Ngạc', district: 'Bắc Từ Liêm', ward: 'Phường Đông Ngạc', lat: 21.0645, lng: 105.7889 },
  { street: 'Linh Đàm', district: 'Bắc Từ Liêm', ward: 'Phường Linh Đàm', lat: 21.0501, lng: 105.7678 },
  { street: 'Thượng Đình', district: 'Bắc Từ Liêm', ward: 'Phường Thượng Đình', lat: 21.0467, lng: 105.7756 },
  { street: 'Thụy Phương', district: 'Bắc Từ Liêm', ward: 'Phường Thụy Phương', lat: 21.0678, lng: 105.7567 },
  { street: 'Minh Khai', district: 'Bắc Từ Liêm', ward: 'Phường Minh Khai', lat: 21.0556, lng: 105.7845 },
  { street: 'Phú Diễn', district: 'Bắc Từ Liêm', ward: 'Phường Phú Diễn', lat: 21.0512, lng: 105.7589 },
  { street: 'Tây Tựu', district: 'Bắc Từ Liêm', ward: 'Phường Tây Tựu', lat: 21.0734, lng: 105.7456 },
  
  // Hoàng Mai
  { street: 'Giải Phóng', district: 'Hoàng Mai', ward: 'Phường Giải Phóng', lat: 20.9812, lng: 105.8456 },
  { street: 'Tam Trinh', district: 'Hoàng Mai', ward: 'Phường Tam Trinh', lat: 20.9734, lng: 105.8534 },
  { street: 'Yên Duyên', district: 'Hoàng Mai', ward: 'Phường Yên Duyên', lat: 20.9689, lng: 105.8612 },
  { street: 'Định Công', district: 'Hoàng Mai', ward: 'Phường Định Công', lat: 20.9867, lng: 105.8389 },
  { street: 'Vĩnh Hưng', district: 'Hoàng Mai', ward: 'Phường Vĩnh Hưng', lat: 20.9756, lng: 105.8678 },
  { street: 'Lĩnh Nam', district: 'Hoàng Mai', ward: 'Phường Lĩnh Nam', lat: 20.9645, lng: 105.8712 },
  { street: 'Mai Động', district: 'Hoàng Mai', ward: 'Phường Mai Động', lat: 20.9823, lng: 105.8567 },
  { street: 'Tân Mai', district: 'Hoàng Mai', ward: 'Phường Tân Mai', lat: 20.9701, lng: 105.8589 },
  { street: 'Hoàng Liệt', district: 'Hoàng Mai', ward: 'Phường Hoàng Liệt', lat: 20.9778, lng: 105.8634 },
  { street: 'Đại Kim', district: 'Hoàng Mai', ward: 'Phường Đại Kim', lat: 20.9612, lng: 105.8756 },
  
  // Hà Đông
  { street: 'Quang Trung', district: 'Hà Đông', ward: 'Phường Quang Trung', lat: 20.9723, lng: 105.7734 },
  { street: 'Lê Văn Lương', district: 'Hà Đông', ward: 'Phường Lê Văn Lương', lat: 20.9645, lng: 105.7812 },
  { street: 'Phúc La', district: 'Hà Đông', ward: 'Phường Phúc La', lat: 20.9567, lng: 105.7678 },
  { street: 'Dương Nội', district: 'Hà Đông', ward: 'Phường Dương Nội', lat: 20.9489, lng: 105.7589 },
  { street: 'La Khê', district: 'Hà Đông', ward: 'Phường La Khê', lat: 20.9534, lng: 105.7456 },
  { street: 'Văn Khê', district: 'Hà Đông', ward: 'Phường Văn Khê', lat: 20.9612, lng: 105.7567 },
  { street: 'Hà Cầu', district: 'Hà Đông', ward: 'Phường Hà Cầu', lat: 20.9801, lng: 105.7689 },
  { street: 'Mộ Lao', district: 'Hà Đông', ward: 'Phường Mộ Lao', lat: 20.9678, lng: 105.7623 },
  { street: 'Biên Giang', district: 'Hà Đông', ward: 'Phường Biên Giang', lat: 20.9756, lng: 105.7712 },
  { street: 'Yên Nghĩa', district: 'Hà Đông', ward: 'Phường Yên Nghĩa', lat: 20.9423, lng: 105.7534 },
];

function generateRestaurant(index: number, category: Restaurant['category']): Restaurant {
  const type = businessTypes[index % businessTypes.length];
  const baseName = type; // Sử dụng tên loại hình kinh doanh làm tên cơ sở
  const location = realLocations[index % realLocations.length];
  
  // Thêm random offset nhỏ (± 0.001 độ ≈ 100m) để tránh trùng lặp chính xác
  const latOffset = (Math.random() - 0.5) * 0.002;
  const lngOffset = (Math.random() - 0.5) * 0.002;
  
  // Tính dân số dựa trên Phường (nội thành vs ngoại thành)
  // Phường nội thành: Hoàn Kiếm, Ba Đình, Đống Đa, Hai Bà Trưng - mật độ cao (1500-3000 người/điểm)
  // Phường trung tâm mở rộng: Cầu Giấy, Tây Hồ, Thanh Xuân, Long Biên - mật độ trung bình (1000-2000 người/điểm)
  // Phường ngoại thành: Nam Từ Liêm, Bắc Từ Liêm, Hoàng Mai, Hà Đông - mật độ thấp (600-1500 người/điểm)
  const innerDistricts = ['Hoàn Kiếm', 'Ba Đình', 'Đống Đa', 'Hai Bà Trưng'];
  const middleDistricts = ['Cầu Giấy', 'Tây Hồ', 'Thanh Xuân', 'Long Biên'];
  
  let populationMin: number, populationMax: number;
  if (innerDistricts.includes(location.district)) {
    populationMin = 1500;
    populationMax = 3000;
  } else if (middleDistricts.includes(location.district)) {
    populationMin = 1000;
    populationMax = 2000;
  } else {
    populationMin = 600;
    populationMax = 1500;
  }
  
  const nearbyPopulation = Math.floor(Math.random() * (populationMax - populationMin + 1)) + populationMin;
  
  const restaurant: Restaurant = {
    id: `CS${String(index + 1).padStart(4, '0')}`,
    name: `${baseName} ${location.district}`,
    address: `${Math.floor(Math.random() * 300) + 1} ${location.street}, ${location.district}, Hà Nội`,
    lat: location.lat + latOffset,
    lng: location.lng + lngOffset,
    type,
    businessType: type,
    category,
    categoryId: 'UUID_' + Math.random().toString(36).substr(2, 9), // 🔥 Random UUID for filtering
    province: 'Hà Nội',
    district: location.district,
    ward: location.ward,
    nearbyPopulation, // Số dân sinh sống trong bán kính 500m
  };

  // Thêm citizen reports cho hotspot
  if (category === 'hotspot') {
    restaurant.citizenReports = generateCitizenReports(index);
  }

  return restaurant;
}

// Generate citizen reports for hotspot locations
function generateCitizenReports(index: number): CitizenReport[] {
  const reportCount = Math.floor(Math.random() * 3) + 1; // 1-3 reports
  const reports: CitizenReport[] = [];

  const violationTypes = [
    'Vệ sinh cơ sở không đảm bảo',
    'Thực phẩm không rõ nguồn gốc',
    'Nhân viên không đeo khẩu trang',
    'Dụng cụ chế biến bẩn',
    'Khu vực chế biến không đảm bảo',
    'Thực phẩm để lộ thiên',
    'Xuất hiện côn trùng, ộng vật gây hại'
  ];

  const reporterNames = [
    'Nguyễn Văn A',
    'Trần Thị B',
    'Lê Văn C',
    'Phạm Thị D',
    'Hoàng Văn E',
    'Vũ Thị F',
    'Đặng Văn G',
    'Bùi Thị H'
  ];

  // Sử dụng picsum.photos cho ảnh placeholder hoạt động tốt
  const imagePool = [
    'https://picsum.photos/seed/food1/400/300',
    'https://picsum.photos/seed/kitchen1/400/300',
    'https://picsum.photos/seed/restaurant1/400/300',
    'https://picsum.photos/seed/food2/400/300',
    'https://picsum.photos/seed/kitchen2/400/300',
    'https://picsum.photos/seed/restaurant2/400/300',
    'https://picsum.photos/seed/food3/400/300',
    'https://picsum.photos/seed/kitchen3/400/300',
    'https://picsum.photos/seed/restaurant3/400/300',
    'https://picsum.photos/seed/food4/400/300',
    'https://picsum.photos/seed/kitchen4/400/300',
    'https://picsum.photos/seed/restaurant4/400/300',
    'https://picsum.photos/seed/food5/400/300',
    'https://picsum.photos/seed/kitchen5/400/300',
    'https://picsum.photos/seed/restaurant5/400/300',
    'https://picsum.photos/seed/hygiene1/400/300',
    'https://picsum.photos/seed/hygiene2/400/300',
    'https://picsum.photos/seed/safety1/400/300',
    'https://picsum.photos/seed/safety2/400/300',
    'https://picsum.photos/seed/violation1/400/300',
  ];

  for (let i = 0; i < reportCount; i++) {
    const daysAgo = Math.floor(Math.random() * 30) + 1;
    const reportDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
    
    const imageCount = Math.floor(Math.random() * 3) + 1; // 1-3 images
    const images: string[] = [];
    
    // Lấy random images từ pool
    const shuffled = [...imagePool].sort(() => Math.random() - 0.5);
    for (let j = 0; j < imageCount; j++) {
      images.push(shuffled[j]);
    }

    reports.push({
      id: `RP${String(index * 10 + i + 1).padStart(6, '0')}`,
      reporterName: reporterNames[Math.floor(Math.random() * reporterNames.length)],
      reportDate: reportDate.toISOString(),
      content: `Phát hiện ${violationTypes[Math.floor(Math.random() * violationTypes.length)].toLowerCase()} tại cơ sở này. Tình trạng đã kéo dài nhiều ngày và ảnh hưởng đến sức khỏe người tiêu dùng. Đề nghị cơ quan chức năng kiểm tra và xử lý nghiêm.`,
      images,
      violationType: violationTypes[Math.floor(Math.random() * violationTypes.length)]
    });
  }

  return reports.sort((a, b) => new Date(b.reportDate).getTime() - new Date(a.reportDate).getTime());
}

// Tạo 1000 cơ sở: 200 cho mỗi loại
const certified = Array.from({ length: 200 }, (_, i) => generateRestaurant(i, 'certified'));
const hotspot = Array.from({ length: 200 }, (_, i) => generateRestaurant(i + 200, 'hotspot'));
const scheduled = Array.from({ length: 200 }, (_, i) => generateRestaurant(i + 400, 'scheduled'));
const inspected = Array.from({ length: 200 }, (_, i) => generateRestaurant(i + 600, 'inspected'));

export const restaurants: Restaurant[] = [
  ...certified,
  ...hotspot,
  ...scheduled,
  ...inspected,
];
