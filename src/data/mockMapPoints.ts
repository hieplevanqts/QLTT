/**
 * Mock Map Points Data - 500 records với coordinates Hà Nội
 * Phân bố: 40% certified, 30% hotspot, 20% scheduled, 10% inspected
 * Business types: 57 loại từ database categories
 */

import { Restaurant, CitizenReport } from './restaurantData';

// 57 business types từ Supabase categories table
const BUSINESS_TYPES = [
  'Tất cả', 'Ăn uống', 'Spa & Làm đẹp', 'Giải trí', 'Mua sắm', 'Cafe & Trà', 
  'Thể thao', 'Giáo dục & Đào tạo', 'Y tế & Sức khỏe', 'Thời trang & Phụ kiện', 
  'Điện tử & Công nghệ', 'Bất động sản', 'Vận tải & Chuyển phát', 'Du lịch & Khách sạn', 
  'Ô tô & Xe máy', 'Salon & Tóc', 'Siêu thị & Tạp hóa', 'Tài chính & Ngân hàng', 
  'Dịch vụ Pháp lý', 'Xây dựng & Kiến trúc', 'Thú cưng', 'Quay phim & Chụp ảnh', 
  'Dịch vụ Đám cưới', 'Nội thất & Trang trí', 'Dịch vụ Vệ sinh', 'An ninh & Bảo vệ', 
  'Kho bãi & Tiếp vận', 'Marketing & Quảng cáo', 'Nông nghiệp', 'Nhà thuốc', 
  'Sách & Văn phòng phẩm', 'Vàng bạc & Đá quý', 'Tiệm bánh', 'Bar & Pub', 
  'Rạp chiếu phim', 'Mẹ và Bé', 'Cửa hàng Đồ chơi', 'Văn phòng phẩm', 
  'Thủ công mỹ nghệ', 'Văn phòng chia sẻ', 'Giặt ủi', 'Sửa chữa điện máy', 
  'Bảo hiểm', 'Tổ chức sự kiện', 'Cửa hàng hoa', 'Nhạc cụ & Âm nhạc', 
  'Nghệ thuật & Triển lãm', 'Nha khoa', 'Phòng Gym & Yoga', 'Cắm trại & Dã ngoại', 
  'Phần mềm & Giải pháp IT', 'Tư vấn kinh doanh', 'Năng lượng mặt trời', 
  'Môi trường & Tái chế', 'Nhà may', 'Quà lưu niệm', 'Mắt kính'
];

// Danh sách tên tiếng Việt cho các cơ sở
const BUSINESS_NAMES = [
  'Nhà hàng Hương Sen', 'Café The Coffee House', 'Spa Luxury', 'Gym Center Fitness',
  'Siêu thị Mini Mart', 'Salon Tóc Đẹp', 'Nhà thuốc Long Châu', 'Trường Mầm non Hoa Hồng',
  'Quán Phở Bò', 'Tiệm Bánh Ngọt', 'Cửa hàng Điện tử FPT', 'Văn phòng Cho thuê',
  'Garage Ô tô', 'Khách sạn Hanoi', 'Ngân hàng Vietcombank', 'Rạp chiếu phim Galaxy',
  'Karaoke Luxury', 'Cửa hàng Thời trang H&M', 'Trung tâm Anh ngữ', 'Phòng khám Đa khoa',
  'Cửa hàng Mẹ và Bé', 'Thư viện Sách', 'Tiệm Giặt Là Nhanh', 'Cửa hàng Hoa Tươi',
  'Massage Truyền thống', 'Văn phòng Luật sư', 'Tiệm Vàng Bạc', 'Bar & Pub The Beer',
  'Cửa hàng Đồ chơi Trẻ em', 'Phòng Gym 24/7', 'Nhà hàng Lẩu', 'Café Highlands',
  'Spa Thư giãn', 'Siêu thị Vinmart', 'Salon Tóc Nam', 'Nhà thuốc An Khang',
  'Trường Tiểu học', 'Quán Bún Bò Huế', 'Tiệm Bánh Mì', 'Cửa hàng Laptop Dell',
  'Trung tâm Yoga', 'Garage Xe máy Honda', 'Khách sạn Pullman', 'Ngân hàng Techcombank',
  'Rạp CGV', 'Karaoke New Star', 'Shop Quần áo', 'Trung tâm Tin học',
  'Phòng khám Nha khoa', 'Cửa hàng Sữa', 'Nhà sách Fahasa', 'Giặt khô Express'
];

// Địa chỉ Hà Nội với coordinates thực tế
const HANOI_LOCATIONS = [
  // Hoàn Kiếm (40 địa điểm)
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
  
  // Ba Đình (40 địa điểm)
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
  
  // Đống Đa (40 địa điểm)
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
  
  // Hai Bà Trưng (40 địa điểm)
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
  
  // Cầu Giấy (40 địa điểm)
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
  
  // Tây Hồ (40 địa điểm)
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
  
  // Thanh Xuân (40 địa điểm)
  { street: 'Nguyễn Trãi', district: 'Thanh Xuân', ward: 'Phường Nguyễn Trãi', lat: 20.9978, lng: 105.8134 },
  { street: 'Khuất Duy Tiến', district: 'Thanh Xuân', ward: 'Phường Khuất Duy Tiến', lat: 20.9923, lng: 105.8089 },
  { street: 'Phạm Văn Đồng', district: 'Thanh Xuân', ward: 'Phường Phạm Văn Đồng', lat: 21.0012, lng: 105.8267 },
  { street: 'Nguyễn Xiển', district: 'Thanh Xuân', ward: 'Phường Nguyễn Xiển', lat: 20.9867, lng: 105.8156 },
  { street: 'Khương Đình', district: 'Thanh Xuân', ward: 'Phường Khương Đình', lat: 20.9912, lng: 105.8234 },
  { street: 'Kim Giang', district: 'Thanh Xuân', ward: 'Phường Kim Giang', lat: 20.9845, lng: 105.8298 },
  { street: 'Hạ Đình', district: 'Thanh Xuân', ward: 'Phường Hạ Đình', lat: 20.9801, lng: 105.8189 },
  { street: 'Thanh Xuân Nam', district: 'Thanh Xuân', ward: 'Phường Thanh Xuân Nam', lat: 20.9934, lng: 105.8167 },
  { street: 'Thanh Xuân Bắc', district: 'Thanh Xuân', ward: 'Phường Thanh Xuân Bắc', lat: 21.0045, lng: 105.8198 },
  { street: 'Khương Trung', district: 'Thanh Xuân', ward: 'Phường Khương Trung', lat: 20.9989, lng: 105.8112 },
];

// Mock citizen reports cho hotspot
function generateCitizenReports(count: number): CitizenReport[] {
  const reports: CitizenReport[] = [];
  const violationTypes = [
    'Vệ sinh không đảm bảo',
    'Thực phẩm không rõ nguồn gốc',
    'Hết hạn sử dụng',
    'Gian lận thương mại',
    'Thiếu giấy phép kinh doanh'
  ];
  
  for (let i = 0; i < count; i++) {
    reports.push({
      id: `report-${Math.random().toString(36).substr(2, 9)}`,
      reporterName: `Người dân ${i + 1}`,
      reportDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      content: `Phản ánh về vấn đề ${violationTypes[Math.floor(Math.random() * violationTypes.length)].toLowerCase()}`,
      images: [],
      violationType: violationTypes[Math.floor(Math.random() * violationTypes.length)]
    });
  }
  
  return reports;
}

// Generate 500 mock map points
function generateMockMapPoints(): Restaurant[] {
  const points: Restaurant[] = [];
  const totalPoints = 500;
  
  // Distribution: 40% certified, 30% hotspot, 20% scheduled, 10% inspected
  const categories: Array<'certified' | 'hotspot' | 'scheduled' | 'inspected'> = [
    ...Array(Math.floor(totalPoints * 0.4)).fill('certified'),
    ...Array(Math.floor(totalPoints * 0.3)).fill('hotspot'),
    ...Array(Math.floor(totalPoints * 0.2)).fill('scheduled'),
    ...Array(Math.floor(totalPoints * 0.1)).fill('inspected'),
  ] as Array<'certified' | 'hotspot' | 'scheduled' | 'inspected'>;
  
  // Shuffle categories
  for (let i = categories.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [categories[i], categories[j]] = [categories[j], categories[i]];
  }
  
  for (let i = 0; i < totalPoints; i++) {
    const location = HANOI_LOCATIONS[i % HANOI_LOCATIONS.length];
    const businessType = BUSINESS_TYPES[Math.floor(Math.random() * BUSINESS_TYPES.length)];
    const businessName = BUSINESS_NAMES[Math.floor(Math.random() * BUSINESS_NAMES.length)];
    const category = categories[i];
    
    // Add small random offset to coordinates (within ~100m)
    const latOffset = (Math.random() - 0.5) * 0.002; // ~200m range
    const lngOffset = (Math.random() - 0.5) * 0.002;
    
    const point: Restaurant = {
      id: `mock-point-${i + 1}`,
      name: `${businessName} ${i + 1}`,
      address: `${Math.floor(Math.random() * 200) + 1} ${location.street}, ${location.ward}, ${location.district}, Hà Nội`,
      lat: location.lat + latOffset,
      lng: location.lng + lngOffset,
      type: businessType,
      businessType: businessType,
      category: category,
      categoryId: `mock-cat-${Math.floor(Math.random() * 57) + 1}`,
      province: 'Hà Nội',
      district: location.district,
      ward: location.ward,
      hotline: `024${Math.floor(Math.random() * 90000000) + 10000000}`,
      reviewScore: category === 'certified' ? Math.random() * 2 + 3 : Math.random() * 3 + 1, // 3-5 for certified, 1-4 for others
      reviewCount: Math.floor(Math.random() * 100) + 5,
      nearbyPopulation: Math.floor(Math.random() * 5000) + 1000,
      statusName: category === 'certified' ? 'Đạt Chuẩn' :
                  category === 'hotspot' ? 'Điểm Nóng' :
                  category === 'scheduled' ? 'Kế Hoạch' :
                  'Đã Thanh Tra',
      // Add citizen reports for hotspots
      citizenReports: category === 'hotspot' ? generateCitizenReports(Math.floor(Math.random() * 5) + 1) : undefined,
    };
    
    points.push(point);
  }
  
  return points;
}

// Export mock data
export const mockMapPoints = generateMockMapPoints();

// Log statistics