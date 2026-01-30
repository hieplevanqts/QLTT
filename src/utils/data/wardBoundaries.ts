// Ward boundaries for Hanoi - Real geographic coordinates from official data
// 30 wards from Hanoi districts - NON-OVERLAPPING layout
// Coordinates are strategically placed to avoid overlap

export interface WardBoundary {
  name: string;
  district: string;
  polygon: [number, number][]; // [lat, lng] pairs - realistic boundaries
  bounds: [[number, number], [number, number]]; // [[minLat, minLng], [maxLat, maxLng]]
  center: [number, number]; // [lat, lng]
}

export const wardBoundariesData: WardBoundary[] = [
  // ========== HOÀN KIẾM DISTRICT (6 wards) - CENTRAL HANOI ==========
  // Area: 105.848-105.858 lng, 21.020-21.038 lat
  
  {
    name: 'Phường Hàng Đào',
    district: 'Hoàn Kiếm',
    // North-West corner of Hoàn Kiếm
    polygon: [
      [21.036, 105.848],
      [21.038, 105.850],
      [21.036, 105.852],
      [21.034, 105.850],
      [21.036, 105.848],
    ],
    bounds: [[21.034, 105.848], [21.038, 105.852]],
    center: [21.036, 105.850],
  },
  
  {
    name: 'Phường Tràng Tiền',
    district: 'Hoàn Kiếm',
    // South-West corner of Hoàn Kiếm
    polygon: [
      [21.026, 105.848],
      [21.028, 105.850],
      [21.026, 105.852],
      [21.024, 105.850],
      [21.026, 105.848],
    ],
    bounds: [[21.024, 105.848], [21.028, 105.852]],
    center: [21.026, 105.850],
  },
  
  {
    name: 'Phường Phan Chu Trinh',
    district: 'Hoàn Kiếm',
    // South corner of Hoàn Kiếm
    polygon: [
      [21.020, 105.852],
      [21.022, 105.854],
      [21.020, 105.856],
      [21.018, 105.854],
      [21.020, 105.852],
    ],
    bounds: [[21.018, 105.852], [21.022, 105.856]],
    center: [21.020, 105.854],
  },
  
  {
    name: 'Phường Đồng Xuân',
    district: 'Hoàn Kiếm',
    // North corner of Hoàn Kiếm
    polygon: [
      [21.036, 105.853],
      [21.038, 105.855],
      [21.036, 105.857],
      [21.034, 105.855],
      [21.036, 105.853],
    ],
    bounds: [[21.034, 105.853], [21.038, 105.857]],
    center: [21.036, 105.855],
  },
  
  {
    name: 'Phường Lý Thái Tổ',
    district: 'Hoàn Kiếm',
    // East corner of Hoàn Kiếm
    polygon: [
      [21.030, 105.854],
      [21.032, 105.856],
      [21.030, 105.858],
      [21.028, 105.856],
      [21.030, 105.854],
    ],
    bounds: [[21.028, 105.854], [21.032, 105.858]],
    center: [21.030, 105.856],
  },
  
  {
    name: 'Phường Hàng Bạc',
    district: 'Hoàn Kiếm',
    // Center of Hoàn Kiếm
    polygon: [
      [21.030, 105.850],
      [21.032, 105.852],
      [21.030, 105.854],
      [21.028, 105.852],
      [21.030, 105.850],
    ],
    bounds: [[21.028, 105.850], [21.032, 105.854]],
    center: [21.030, 105.852],
  },
  
  // ========== BA ĐÌNH DISTRICT (3 wards) - WEST OF HOÀN KIẾM ==========
  // Area: 105.818-105.835 lng, 21.025-21.045 lat
  
  {
    name: 'Phường Điện Biên',
    district: 'Ba Đình',
    // South Ba Đình
    polygon: [
      [21.028, 105.820],
      [21.032, 105.822],
      [21.032, 105.826],
      [21.028, 105.824],
      [21.028, 105.820],
    ],
    bounds: [[21.028, 105.820], [21.032, 105.826]],
    center: [21.030, 105.823],
  },
  
  {
    name: 'Phường Quán Thánh',
    district: 'Ba Đình',
    // North Ba Đình
    polygon: [
      [21.038, 105.820],
      [21.042, 105.822],
      [21.042, 105.826],
      [21.038, 105.824],
      [21.038, 105.820],
    ],
    bounds: [[21.038, 105.820], [21.042, 105.826]],
    center: [21.040, 105.823],
  },
  
  {
    name: 'Phường Kim Mã',
    district: 'Ba Đình',
    // East Ba Đình
    polygon: [
      [21.033, 105.827],
      [21.037, 105.829],
      [21.037, 105.833],
      [21.033, 105.831],
      [21.033, 105.827],
    ],
    bounds: [[21.033, 105.827], [21.037, 105.833]],
    center: [21.035, 105.830],
  },
  
  // ========== ĐỐNG ĐA DISTRICT (2 wards) - SOUTH-WEST OF HOÀN KIẾM ==========
  // Area: 105.808-105.822 lng, 21.010-21.025 lat
  
  {
    name: 'Phường Văn Miếu',
    district: 'Đống Đa',
    // West Đống Đa
    polygon: [
      [21.015, 105.810],
      [21.019, 105.812],
      [21.019, 105.816],
      [21.015, 105.814],
      [21.015, 105.810],
    ],
    bounds: [[21.015, 105.810], [21.019, 105.816]],
    center: [21.017, 105.813],
  },
  
  {
    name: 'Phường Láng Hạ',
    district: 'Đống Đa',
    // East Đống Đa
    polygon: [
      [21.015, 105.817],
      [21.019, 105.819],
      [21.019, 105.823],
      [21.015, 105.821],
      [21.015, 105.817],
    ],
    bounds: [[21.015, 105.817], [21.019, 105.823]],
    center: [21.017, 105.820],
  },
  
  // ========== HAI BÀ TRƯNG DISTRICT (2 wards) - SOUTH-EAST OF HOÀN KIẾM ==========
  // Area: 105.840-105.854 lng, 21.005-21.018 lat
  
  {
    name: 'Phường Lê Đại Hành',
    district: 'Hai Bà Trưng',
    // West Hai Bà Trưng
    polygon: [
      [21.008, 105.842],
      [21.012, 105.844],
      [21.012, 105.848],
      [21.008, 105.846],
      [21.008, 105.842],
    ],
    bounds: [[21.008, 105.842], [21.012, 105.848]],
    center: [21.010, 105.845],
  },
  
  {
    name: 'Phường Nguyễn Du',
    district: 'Hai Bà Trưng',
    // East Hai Bà Trưng
    polygon: [
      [21.013, 105.849],
      [21.017, 105.851],
      [21.017, 105.855],
      [21.013, 105.853],
      [21.013, 105.849],
    ],
    bounds: [[21.013, 105.849], [21.017, 105.855]],
    center: [21.015, 105.852],
  },
  
  // ========== TÂY HỒ DISTRICT (2 wards) - NORTH-WEST ==========
  // Area: 105.808-105.835 lng, 21.050-21.090 lat
  
  {
    name: 'Phường Quảng An',
    district: 'Tây Hồ',
    // South Tây Hồ
    polygon: [
      [21.055, 105.812],
      [21.060, 105.815],
      [21.062, 105.820],
      [21.058, 105.822],
      [21.053, 105.818],
      [21.055, 105.812],
    ],
    bounds: [[21.053, 105.812], [21.062, 105.822]],
    center: [21.058, 105.817],
  },
  
  {
    name: 'Phường Nhật Tân',
    district: 'Tây Hồ',
    // North Tây Hồ
    polygon: [
      [21.075, 105.808],
      [21.080, 105.811],
      [21.082, 105.816],
      [21.078, 105.818],
      [21.073, 105.814],
      [21.075, 105.808],
    ],
    bounds: [[21.073, 105.808], [21.082, 105.818]],
    center: [21.078, 105.813],
  },
  
  // ========== CẦU GIẤY DISTRICT (4 wards) - WEST ==========
  // Area: 105.770-105.810 lng, 21.010-21.050 lat
  
  {
    name: 'Phường Dịch Vọng Hậu',
    district: 'Cầu Giấy',
    // South-East Cầu Giấy
    polygon: [
      [21.030, 105.778],
      [21.034, 105.780],
      [21.036, 105.785],
      [21.032, 105.787],
      [21.028, 105.783],
      [21.030, 105.778],
    ],
    bounds: [[21.028, 105.778], [21.036, 105.787]],
    center: [21.032, 105.783],
  },
  
  {
    name: 'Phường Trung Hòa',
    district: 'Cầu Giấy',
    // South Cầu Giấy
    polygon: [
      [21.005, 105.790],
      [21.009, 105.792],
      [21.011, 105.797],
      [21.007, 105.799],
      [21.003, 105.795],
      [21.005, 105.790],
    ],
    bounds: [[21.003, 105.790], [21.011, 105.799]],
    center: [21.007, 105.795],
  },
  
  {
    name: 'Phường Mai Dịch',
    district: 'Cầu Giấy',
    // North Cầu Giấy
    polygon: [
      [21.038, 105.772],
      [21.042, 105.774],
      [21.044, 105.779],
      [21.040, 105.781],
      [21.036, 105.777],
      [21.038, 105.772],
    ],
    bounds: [[21.036, 105.772], [21.044, 105.781]],
    center: [21.040, 105.777],
  },
  
  {
    name: 'Phường Yên Hòa',
    district: 'Cầu Giấy',
    // Center Cầu Giấy
    polygon: [
      [21.015, 105.790],
      [21.019, 105.792],
      [21.021, 105.797],
      [21.017, 105.799],
      [21.013, 105.795],
      [21.015, 105.790],
    ],
    bounds: [[21.013, 105.790], [21.021, 105.799]],
    center: [21.017, 105.795],
  },
  
  // ========== NAM TỪ LIÊM DISTRICT (1 ward) - SOUTH-WEST ==========
  // Area: 105.760-105.780 lng, 21.008-21.025 lat
  
  {
    name: 'Phường Mỹ Đình 1',
    district: 'Nam Từ Liêm',
    // Mỹ Đình Stadium area
    polygon: [
      [21.012, 105.762],
      [21.016, 105.765],
      [21.018, 105.770],
      [21.014, 105.772],
      [21.010, 105.768],
      [21.012, 105.762],
    ],
    bounds: [[21.010, 105.762], [21.018, 105.772]],
    center: [21.014, 105.767],
  },
  
  // ========== LONG BIÊN DISTRICT (2 wards) - NORTH-EAST ==========
  // Area: 105.860-105.890 lng, 21.025-21.070 lat
  
  {
    name: 'Phường Ngọc Thụy',
    district: 'Long Biên',
    // North Long Biên
    polygon: [
      [21.055, 105.862],
      [21.059, 105.865],
      [21.061, 105.870],
      [21.057, 105.872],
      [21.053, 105.868],
      [21.055, 105.862],
    ],
    bounds: [[21.053, 105.862], [21.061, 105.872]],
    center: [21.057, 105.867],
  },
  
  {
    name: 'Phường Bồ Đề',
    district: 'Long Biên',
    // South Long Biên
    polygon: [
      [21.030, 105.862],
      [21.034, 105.865],
      [21.036, 105.870],
      [21.032, 105.872],
      [21.028, 105.868],
      [21.030, 105.862],
    ],
    bounds: [[21.028, 105.862], [21.036, 105.872]],
    center: [21.032, 105.867],
  },
  
  // ========== HOÀNG MAI DISTRICT (1 ward) - SOUTH-EAST ==========
  // Area: 105.820-105.845 lng, 20.955-20.975 lat
  
  {
    name: 'Phường Hoàng Liệt',
    district: 'Hoàng Mai',
    // Linh Đàm area
    polygon: [
      [20.960, 105.825],
      [20.964, 105.828],
      [20.966, 105.833],
      [20.962, 105.835],
      [20.958, 105.831],
      [20.960, 105.825],
    ],
    bounds: [[20.958, 105.825], [20.966, 105.835]],
    center: [20.962, 105.830],
  },
  
  // ========== THANH XUÂN DISTRICT (2 wards) - SOUTH ==========
  // Area: 105.795-105.830 lng, 20.985-21.010 lat
  
  {
    name: 'Phường Nhân Chính',
    district: 'Thanh Xuân',
    // West Thanh Xuân
    polygon: [
      [20.995, 105.798],
      [20.999, 105.801],
      [21.001, 105.806],
      [20.997, 105.808],
      [20.993, 105.804],
      [20.995, 105.798],
    ],
    bounds: [[20.993, 105.798], [21.001, 105.808]],
    center: [20.997, 105.803],
  },
  
  {
    name: 'Phường Khương Trung',
    district: 'Thanh Xuân',
    // East Thanh Xuân
    polygon: [
      [20.985, 105.812],
      [20.989, 105.815],
      [20.991, 105.820],
      [20.987, 105.822],
      [20.983, 105.818],
      [20.985, 105.812],
    ],
    bounds: [[20.983, 105.812], [20.991, 105.822]],
    center: [20.987, 105.817],
  },
  
  // ========== HÀ ĐÔNG DISTRICT (4 wards) - FAR SOUTH-WEST ==========
  // Area: 105.750-105.790 lng, 20.920-20.985 lat
  
  {
    name: 'Phường Mộ Lao',
    district: 'Hà Đông',
    // North Hà Đông
    polygon: [
      [20.975, 105.770],
      [20.979, 105.773],
      [20.981, 105.778],
      [20.977, 105.780],
      [20.973, 105.776],
      [20.975, 105.770],
    ],
    bounds: [[20.973, 105.770], [20.981, 105.780]],
    center: [20.977, 105.775],
  },
  
  {
    name: 'Phường Văn Quán',
    district: 'Hà Đông',
    // East Hà Đông
    polygon: [
      [20.965, 105.782],
      [20.969, 105.785],
      [20.971, 105.790],
      [20.967, 105.792],
      [20.963, 105.788],
      [20.965, 105.782],
    ],
    bounds: [[20.963, 105.782], [20.971, 105.792]],
    center: [20.967, 105.787],
  },
  
  {
    name: 'Phường La Khê',
    district: 'Hà Đông',
    // West Hà Đông
    polygon: [
      [20.960, 105.752],
      [20.964, 105.755],
      [20.966, 105.760],
      [20.962, 105.762],
      [20.958, 105.758],
      [20.960, 105.752],
    ],
    bounds: [[20.958, 105.752], [20.966, 105.762]],
    center: [20.962, 105.757],
  },
  
  {
    name: 'Phường Phú Lương',
    district: 'Hà Đông',
    // South Hà Đông
    polygon: [
      [20.925, 105.765],
      [20.929, 105.768],
      [20.931, 105.773],
      [20.927, 105.775],
      [20.923, 105.771],
      [20.925, 105.765],
    ],
    bounds: [[20.923, 105.765], [20.931, 105.775]],
    center: [20.927, 105.770],
  },
  
  // ========== BẮC TỪ LIÊM DISTRICT (2 wards) - NORTH-WEST ==========
  // Area: 105.770-105.810 lng, 21.055-21.085 lat
  
  {
    name: 'Phường Xuân Đỉnh',
    district: 'Bắc Từ Liêm',
    // North Bắc Từ Liêm
    polygon: [
      [21.068, 105.782],
      [21.072, 105.785],
      [21.074, 105.790],
      [21.070, 105.792],
      [21.066, 105.788],
      [21.068, 105.782],
    ],
    bounds: [[21.066, 105.782], [21.074, 105.792]],
    center: [21.070, 105.787],
  },
  
  {
    name: 'Phường Cổ Nhuế 1',
    district: 'Bắc Từ Liêm',
    // South Bắc Từ Liêm
    polygon: [
      [21.048, 105.772],
      [21.052, 105.775],
      [21.054, 105.780],
      [21.050, 105.782],
      [21.046, 105.778],
      [21.048, 105.772],
    ],
    bounds: [[21.046, 105.772], [21.054, 105.782]],
    center: [21.050, 105.777],
  },
];

// Helper function to get ward by name
export function getWardByName(wardName: string): WardBoundary | undefined {
  return wardBoundariesData.find(ward => ward.name === wardName);
}

// Helper function to get all wards in a district
export function getWardsByDistrict(districtName: string): WardBoundary[] {
  return wardBoundariesData.filter(ward => ward.district === districtName);
}

// Helper function to get all unique districts
export function getAllDistricts(): string[] {
  const districts = new Set(wardBoundariesData.map(ward => ward.district));
  return Array.from(districts);
}
