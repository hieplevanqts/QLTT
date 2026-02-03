// Dữ liệu địa giới hành chính Việt Nam - 63 tỉnh/thành phố
import { supabase } from '@/utils/supabaseHelpers';
import { hanoiWards } from './hanoiWards';

export interface Province {
  name: string;
  center: [number, number]; // [lat, lng]
  bounds: [[number, number], [number, number]]; // [[south, west], [north, east]]
  area?: number; // km² - diện tích
  officer?: string; // Cán bộ trực tiếp quản lý
}

export interface District {
  name: string;
  province: string;
  center: [number, number];
  bounds: [[number, number], [number, number]];
  area?: number; // km² - diện tích
  officer?: string; // Cán bộ trực tiếp quản lý
}

export interface Ward {
  name: string;
  district: string;
  province: string;
  area?: number; // km² - diện tích
  officer?: string; // Cán bộ trực tiếp quản lý
}

// 63 Tỉnh/Thành phố Việt Nam với tọa độ trung tâm thực tế
export const provinces: { [key: string]: Province } = {
  // Miền Bắc
  'Hà Nội': {
    name: 'Hà Nội',
    center: [21.0285, 105.8542],
    bounds: [[20.9000, 105.7000], [21.3000, 106.0000]],
    area: 3344.7, // km²
    officer: 'Nguyễn Văn Hùng'
  },
  'Hải Phòng': {
    name: 'Hải Phòng',
    center: [20.8449, 106.6881],
    bounds: [[20.6000, 106.5000], [21.1000, 107.1000]]
  },
  'Quảng Ninh': {
    name: 'Quảng Ninh',
    center: [21.0064, 107.2925],
    bounds: [[20.8000, 106.9000], [21.4000, 108.0000]]
  },
  'Hải Dương': {
    name: 'Hải Dương',
    center: [20.9373, 106.3148],
    bounds: [[20.7000, 106.0000], [21.1000, 106.7000]]
  },
  'Hưng Yên': {
    name: 'Hưng Yên',
    center: [20.6464, 106.0511],
    bounds: [[20.4500, 105.8500], [20.8500, 106.2500]]
  },
  'Bắc Ninh': {
    name: 'Bắc Ninh',
    center: [21.1214, 106.1110],
    bounds: [[20.9500, 105.9000], [21.2500, 106.3000]]
  },
  'Thái Nguyên': {
    name: 'Thái Nguyên',
    center: [21.5671, 105.8252],
    bounds: [[21.3000, 105.5000], [22.0000, 106.3000]]
  },
  'Bắc Giang': {
    name: 'Bắc Giang',
    center: [21.2819, 106.1975],
    bounds: [[21.0000, 105.9000], [21.6000, 106.7000]]
  },
  'Vĩnh Phúc': {
    name: 'Vĩnh Phúc',
    center: [21.3609, 105.5474],
    bounds: [[21.1000, 105.3000], [21.6000, 105.8000]]
  },
  'Phú Thọ': {
    name: 'Phú Thọ',
    center: [21.2680, 105.2045],
    bounds: [[21.0000, 104.8000], [21.6000, 105.5000]]
  },
  'Hòa Bình': {
    name: 'Hòa Bình',
    center: [20.6861, 105.3131],
    bounds: [[20.3000, 104.8000], [21.2000, 105.7000]]
  },
  'Hà Nam': {
    name: 'Hà Nam',
    center: [20.5835, 105.9230],
    bounds: [[20.4000, 105.7000], [20.8000, 106.1000]]
  },
  'Nam Định': {
    name: 'Nam Định',
    center: [20.4388, 106.1621],
    bounds: [[20.1000, 105.9000], [20.7000, 106.5000]]
  },
  'Thái Bình': {
    name: 'Thái Bình',
    center: [20.4464, 106.3365],
    bounds: [[20.2000, 106.1000], [20.7000, 106.6000]]
  },
  'Ninh Bình': {
    name: 'Ninh Bình',
    center: [20.2506, 105.9745],
    bounds: [[20.0000, 105.6000], [20.5000, 106.3000]]
  },

  // Tây Bắc
  'Sơn La': {
    name: 'Sơn La',
    center: [21.1022, 103.7289],
    bounds: [[20.7000, 103.2000], [21.8000, 104.5000]]
  },
  'Điện Biên': {
    name: 'Điện Biên',
    center: [21.3844, 103.0163],
    bounds: [[21.1000, 102.7000], [22.5000, 103.4000]]
  },
  'Lai Châu': {
    name: 'Lai Châu',
    center: [22.3864, 103.4702],
    bounds: [[21.9000, 103.1000], [22.8000, 103.9000]]
  },
  'Lào Cai': {
    name: 'Lào Cai',
    center: [22.4809, 103.9755],
    bounds: [[22.1000, 103.5000], [23.0000, 104.5000]]
  },
  'Yên Bái': {
    name: 'Yên Bái',
    center: [21.7167, 104.8986],
    bounds: [[21.4000, 104.3000], [22.2000, 105.3000]]
  },

  // Đông Bắc
  'Hà Giang': {
    name: 'Hà Giang',
    center: [22.8226, 104.9784],
    bounds: [[22.4000, 104.5000], [23.3000, 105.6000]]
  },
  'Cao Bằng': {
    name: 'Cao Bằng',
    center: [22.6359, 106.2522],
    bounds: [[22.2000, 105.8000], [23.1000, 106.8000]]
  },
  'Bắc Kạn': {
    name: 'Bắc Kạn',
    center: [22.3032, 105.8767],
    bounds: [[22.0000, 105.5000], [22.7000, 106.3000]]
  },
  'Tuyên Quang': {
    name: 'Tuyên Quang',
    center: [21.7767, 105.2280],
    bounds: [[21.5000, 104.9000], [22.3000, 105.6000]]
  },
  'Lạng Sơn': {
    name: 'Lạng Sơn',
    center: [21.8537, 106.7610],
    bounds: [[21.4000, 106.4000], [22.4000, 107.2000]]
  },

  // Bắc Trung Bộ
  'Thanh Hóa': {
    name: 'Thanh Hóa',
    center: [19.8067, 105.7851],
    bounds: [[19.3000, 104.8000], [20.4000, 106.2000]]
  },
  'Nghệ An': {
    name: 'Nghệ An',
    center: [19.2342, 104.9200],
    bounds: [[18.4000, 104.0000], [20.0000, 105.8000]]
  },
  'Hà Tĩnh': {
    name: 'Hà Tĩnh',
    center: [18.3559, 105.8878],
    bounds: [[18.0000, 105.4000], [18.8000, 106.3000]]
  },
  'Quảng Bình': {
    name: 'Quảng Bình',
    center: [17.6102, 106.3487],
    bounds: [[17.1000, 105.9000], [18.1000, 106.8000]]
  },
  'Quảng Trị': {
    name: 'Quảng Trị',
    center: [16.7404, 107.1854],
    bounds: [[16.4000, 106.8000], [17.2000, 107.6000]]
  },
  'Thừa Thiên Huế': {
    name: 'Thừa Thiên Huế',
    center: [16.4637, 107.5909],
    bounds: [[16.0000, 107.1000], [16.9000, 108.1000]]
  },

  // Duyên hải Nam Trung Bộ
  'Đà Nẵng': {
    name: 'Đà Nẵng',
    center: [16.0544, 108.2022],
    bounds: [[15.9000, 107.9000], [16.3000, 108.4000]]
  },
  'Quảng Nam': {
    name: 'Quảng Nam',
    center: [15.5394, 108.0191],
    bounds: [[14.9000, 107.2000], [16.1000, 108.9000]]
  },
  'Quảng Ngãi': {
    name: 'Quảng Ngãi',
    center: [15.1214, 108.8044],
    bounds: [[14.6000, 108.3000], [15.7000, 109.2000]]
  },
  'Bình Định': {
    name: 'Bình Định',
    center: [14.1665, 109.0076],
    bounds: [[13.5000, 108.5000], [14.8000, 109.5000]]
  },
  'Phú Yên': {
    name: 'Phú Yên',
    center: [13.0882, 109.0929],
    bounds: [[12.7000, 108.7000], [13.6000, 109.5000]]
  },
  'Khánh Hòa': {
    name: 'Khánh Hòa',
    center: [12.2388, 109.1967],
    bounds: [[11.6000, 108.8000], [12.9000, 109.6000]]
  },
  'Ninh Thuận': {
    name: 'Ninh Thuận',
    center: [11.6739, 108.8629],
    bounds: [[11.2000, 108.4000], [12.2000, 109.3000]]
  },
  'Bình Thuận': {
    name: 'Bình Thuận',
    center: [11.0904, 108.0720],
    bounds: [[10.5000, 107.4000], [11.7000, 108.8000]]
  },

  // Tây Nguyên
  'Kon Tum': {
    name: 'Kon Tum',
    center: [14.3497, 108.0005],
    bounds: [[13.9000, 107.5000], [15.3000, 108.6000]]
  },
  'Gia Lai': {
    name: 'Gia Lai',
    center: [13.8078, 108.1094],
    bounds: [[13.1000, 107.5000], [14.7000, 108.8000]]
  },
  'Đắk Lắk': {
    name: 'Đắk Lắk',
    center: [12.7100, 108.2378],
    bounds: [[12.1000, 107.5000], [13.3000, 108.9000]]
  },
  'Đắk Nông': {
    name: 'Đắk Nông',
    center: [12.2646, 107.6098],
    bounds: [[11.7000, 107.2000], [12.9000, 108.1000]]
  },
  'Lâm Đồng': {
    name: 'Lâm Đồng',
    center: [11.5753, 108.1429],
    bounds: [[10.9000, 107.4000], [12.3000, 108.8000]]
  },

  // Đông Nam Bộ
  'Hồ Chí Minh': {
    name: 'Hồ Chí Minh',
    center: [10.8231, 106.6297],
    bounds: [[10.3000, 106.3000], [11.2000, 107.0000]]
  },
  'Đồng Nai': {
    name: 'Đồng Nai',
    center: [10.9461, 107.1676],
    bounds: [[10.5000, 106.7000], [11.6000, 107.8000]]
  },
  'Bình Dương': {
    name: 'Bình Dương',
    center: [11.1653, 106.6401],
    bounds: [[10.9000, 106.3000], [11.5000, 106.9000]]
  },
  'Bình Phước': {
    name: 'Bình Phước',
    center: [11.7511, 106.7234],
    bounds: [[11.2000, 106.2000], [12.3000, 107.3000]]
  },
  'Tây Ninh': {
    name: 'Tây Ninh',
    center: [11.3351, 106.1098],
    bounds: [[10.9000, 105.6000], [11.8000, 106.6000]]
  },
  'Bà Rịa - Vũng Tàu': {
    name: 'Bà Rịa - Vũng Tàu',
    center: [10.5417, 107.2429],
    bounds: [[10.1000, 106.9000], [10.9000, 107.7000]]
  },

  // Đồng bằng sông Cửu Long
  'Long An': {
    name: 'Long An',
    center: [10.6956, 106.2431],
    bounds: [[10.3000, 105.8000], [11.2000, 106.7000]]
  },
  'Tiền Giang': {
    name: 'Tiền Giang',
    center: [10.4493, 106.3420],
    bounds: [[10.1000, 105.9000], [10.8000, 106.8000]]
  },
  'Bến Tre': {
    name: 'Bến Tre',
    center: [10.2433, 106.3755],
    bounds: [[9.9000, 106.0000], [10.6000, 106.8000]]
  },
  'Trà Vinh': {
    name: 'Trà Vinh',
    center: [9.8124, 106.2992],
    bounds: [[9.4000, 105.9000], [10.2000, 106.7000]]
  },
  'Vĩnh Long': {
    name: 'Vĩnh Long',
    center: [10.2399, 105.9722],
    bounds: [[9.9000, 105.5000], [10.6000, 106.4000]]
  },
  'Đồng Tháp': {
    name: 'Đồng Tháp',
    center: [10.4938, 105.6881],
    bounds: [[10.2000, 105.3000], [11.0000, 106.1000]]
  },
  'An Giang': {
    name: 'An Giang',
    center: [10.5216, 105.1258],
    bounds: [[10.1000, 104.7000], [11.0000, 105.6000]]
  },
  'Kiên Giang': {
    name: 'Kiên Giang',
    center: [9.8349, 105.1263],
    bounds: [[8.6000, 103.5000], [10.6000, 105.7000]]
  },
  'Cần Thơ': {
    name: 'Cần Thơ',
    center: [10.0452, 105.7469],
    bounds: [[9.8000, 105.4000], [10.3000, 106.1000]]
  },
  'Hậu Giang': {
    name: 'Hậu Giang',
    center: [9.7578, 105.6412],
    bounds: [[9.5000, 105.3000], [10.0000, 106.0000]]
  },
  'Sóc Trăng': {
    name: 'Sóc Trăng',
    center: [9.6024, 105.9739],
    bounds: [[9.2000, 105.6000], [10.0000, 106.4000]]
  },
  'Bạc Liêu': {
    name: 'Bạc Liêu',
    center: [9.2515, 105.7244],
    bounds: [[8.9000, 105.3000], [9.7000, 106.2000]]
  },
  'Cà Mau': {
    name: 'Cà Mau',
    center: [9.1527, 105.1960],
    bounds: [[8.5000, 104.7000], [9.7000, 105.7000]]
  }
};

// Phường/Xã theo tỉnh (top cities)
export const districts: { [key: string]: District[] } = {
  'Hà Nội': [
    { name: 'Hoàn Kiếm', province: 'Hà Nội', center: [21.0285, 105.8542], bounds: [[21.0180, 105.8420], [21.0380, 105.8620]], area: 5.29, officer: 'Trần Thị Lan' },
    { name: 'Ba Đình', province: 'Hà Nội', center: [21.0333, 105.8198], bounds: [[21.0200, 105.8000], [21.0450, 105.8450]], area: 9.21, officer: 'Lê Văn Nam' },
    { name: 'Đống Đa', province: 'Hà Nội', center: [21.0145, 105.8262], bounds: [[21.0050, 105.8050], [21.0250, 105.8400]], area: 9.96, officer: 'Phạm Minh Tuấn' },
    { name: 'Hai Bà Trưng', province: 'Hà Nội', center: [21.0031, 105.8542], bounds: [[20.9900, 105.8350], [21.0200, 105.8750]], area: 10.09, officer: 'Ngô Thị Hương' },
    { name: 'Cầu Giấy', province: 'Hà Nội', center: [21.0333, 105.7941], bounds: [[21.0200, 105.7700], [21.0500, 105.8050]], area: 12.32, officer: 'Vũ Đức Anh' },
    { name: 'Tây Hồ', province: 'Hà Nội', center: [21.0583, 105.8233], bounds: [[21.0400, 105.8100], [21.0700, 105.8450]], area: 24.39, officer: 'Đặng Văn Minh' },
    { name: 'Thanh Xuân', province: 'Hà Nội', center: [20.9950, 105.8042], bounds: [[20.9700, 105.7900], [21.0100, 105.8300]], area: 9.09, officer: 'Hoàng Thị Mai' },
    { name: 'Long Biên', province: 'Hà Nội', center: [21.0364, 105.8875], bounds: [[21.0200, 105.8700], [21.0600, 105.9200]], area: 60.38, officer: 'Bùi Văn Thành' },
    { name: 'Nam Từ Liêm', province: 'Hà Nội', center: [21.0234, 105.7678], bounds: [[20.9750, 105.7400], [21.0450, 105.7850]], area: 32.19, officer: 'Nguyễn Văn Đạt' },
    { name: 'Bắc Từ Liêm', province: 'Hà Nội', center: [21.0589, 105.7734], bounds: [[21.0450, 105.7400], [21.0800, 105.7950]], area: 43.32, officer: 'Trương Thị Hằng' },
    { name: 'Hoàng Mai', province: 'Hà Nội', center: [20.9812, 105.8456], bounds: [[20.9600, 105.8300], [21.0000, 105.8800]], area: 40.31, officer: 'Phan Văn Kiên' },
    { name: 'Hà Đông', province: 'Hà Nội', center: [20.9723, 105.7734], bounds: [[20.9400, 105.7400], [21.0000, 105.7850]], area: 47.91, officer: 'Đinh Thị Thu' },
  ],
  'Hồ Chí Minh': [
    { name: 'Phường 1', province: 'Hồ Chí Minh', center: [10.7756, 106.7019], bounds: [[10.7600, 106.6800], [10.7900, 106.7200]] },
    { name: 'Phường 2', province: 'Hồ Chí Minh', center: [10.7896, 106.7474], bounds: [[10.7500, 106.7100], [10.8300, 106.8000]] },
    { name: 'Phường 3', province: 'Hồ Chí Minh', center: [10.7860, 106.6897], bounds: [[10.7700, 106.6700], [10.8000, 106.7100]] },
    { name: 'Phường 4', province: 'Hồ Chí Minh', center: [10.7546, 106.7025], bounds: [[10.7400, 106.6800], [10.7700, 106.7200]] },
    { name: 'Phường 5', province: 'Hồ Chí Minh', center: [10.7545, 106.6665], bounds: [[10.7400, 106.6500], [10.7700, 106.6900]] },
    { name: 'Phường 6', province: 'Hồ Chí Minh', center: [10.7478, 106.6345], bounds: [[10.7300, 106.6100], [10.7700, 106.6600]] },
    { name: 'Phường 7', province: 'Hồ Chí Minh', center: [10.7333, 106.7208], bounds: [[10.7100, 106.6900], [10.7600, 106.7500]] },
    { name: 'Phường 8', province: 'Hồ Chí Minh', center: [10.7423, 106.6291], bounds: [[10.7200, 106.6000], [10.7700, 106.6600]] },
    { name: 'Phường 9', province: 'Hồ Chí Minh', center: [10.8502, 106.7893], bounds: [[10.8000, 106.7400], [10.9000, 106.8400]] },
    { name: 'Phường 10', province: 'Hồ Chí Minh', center: [10.7726, 106.6700], bounds: [[10.7600, 106.6500], [10.7900, 106.6900]] },
    { name: 'Phường 11', province: 'Hồ Chí Minh', center: [10.7629, 106.6500], bounds: [[10.7500, 106.6300], [10.7800, 106.6700]] },
    { name: 'Phường 12', province: 'Hồ Chí Minh', center: [10.8662, 106.6702], bounds: [[10.8300, 106.6300], [10.9000, 106.7100]] },
    { name: 'Bình Thạnh', province: 'Hồ Chí Minh', center: [10.8081, 106.7123], bounds: [[10.7800, 106.6800], [10.8400, 106.7500]] },
    { name: 'Tân Bình', province: 'Hồ Chí Minh', center: [10.8006, 106.6536], bounds: [[10.7800, 106.6200], [10.8200, 106.6900]] },
    { name: 'Tân Phú', province: 'Hồ Chí Minh', center: [10.7879, 106.6286], bounds: [[10.7700, 106.6000], [10.8100, 106.6600]] },
    { name: 'Phú Nhuận', province: 'Hồ Chí Minh', center: [10.7979, 106.6832], bounds: [[10.7800, 106.6600], [10.8100, 106.7000]] },
    { name: 'Gò Vấp', province: 'Hồ Chí Minh', center: [10.8375, 106.6665], bounds: [[10.8100, 106.6400], [10.8700, 106.6900]] },
    { name: 'Bình Tân', province: 'Hồ Chí Minh', center: [10.7500, 106.6100], bounds: [[10.7200, 106.5700], [10.7800, 106.6500]] },
    { name: 'Thủ Đức', province: 'Hồ Chí Minh', center: [10.8504, 106.7632], bounds: [[10.8000, 106.7200], [10.9000, 106.8100]] },
  ],
  'Đà Nẵng': [
    { name: 'Hải Châu', province: 'Đà Nẵng', center: [16.0471, 108.2068], bounds: [[16.0300, 108.1900], [16.0650, 108.2250]] },
    { name: 'Thanh Khê', province: 'Đà Nẵng', center: [16.0617, 108.1914], bounds: [[16.0500, 108.1750], [16.0750, 108.2100]] },
    { name: 'Sơn Trà', province: 'Đà Nẵng', center: [16.0861, 108.2378], bounds: [[16.0500, 108.2000], [16.1200, 108.2750]] },
    { name: 'Ngũ Hành Sơn', province: 'Đà Nẵng', center: [16.0022, 108.2508], bounds: [[15.9700, 108.2200], [16.0350, 108.2800]] },
    { name: 'Liên Chiểu', province: 'Đà Nẵng', center: [16.0756, 108.1495], bounds: [[16.0400, 108.1100], [16.1100, 108.1900]] },
    { name: 'Cẩm Lệ', province: 'Đà Nẵng', center: [16.0273, 108.1786], bounds: [[16.0100, 108.1600], [16.0450, 108.2000]] },
  ],
  'Hải Phòng': [
    { name: 'Hồng Bàng', province: 'Hải Phòng', center: [20.8609, 106.6814], bounds: [[20.8450, 106.6650], [20.8750, 106.6980]] },
    { name: 'Ngô Quyền', province: 'Hải Phòng', center: [20.8574, 106.7009], bounds: [[20.8400, 106.6800], [20.8750, 106.7200]] },
    { name: 'Lê Chân', province: 'Hải Phòng', center: [20.8469, 106.6997], bounds: [[20.8300, 106.6800], [20.8650, 106.7200]] },
    { name: 'Hải An', province: 'Hải Phòng', center: [20.8825, 106.7275], bounds: [[20.8600, 106.7000], [20.9050, 106.7550]] },
    { name: 'Kiến An', province: 'Hải Phòng', center: [20.8075, 106.6397], bounds: [[20.7900, 106.6200], [20.8250, 106.6600]] },
    { name: 'Đồ Sơn', province: 'Hải Phòng', center: [20.7156, 106.7775], bounds: [[20.6950, 106.7550], [20.7350, 106.8000]] },
  ],
  'Cần Thơ': [
    { name: 'Ninh Kiều', province: 'Cần Thơ', center: [10.0340, 105.7725], bounds: [[10.0150, 105.7550], [10.0530, 105.7900]] },
    { name: 'Ô Môn', province: 'Cần Thơ', center: [10.1136, 105.6253], bounds: [[10.0900, 105.6000], [10.1370, 105.6500]] },
    { name: 'Bình Thuỷ', province: 'Cần Thơ', center: [10.0838, 105.7619], bounds: [[10.0650, 105.7400], [10.1030, 105.7850]] },
    { name: 'Cái Răng', province: 'Cần Thơ', center: [10.0174, 105.7853], bounds: [[9.9950, 105.7650], [10.0400, 105.8050]] },
    { name: 'Thốt Nốt', province: 'Cần Thơ', center: [10.2895, 105.5197], bounds: [[10.2600, 105.4900], [10.3200, 105.5500]] },
  ]
};

// Phường/Xã theo Phường - Merge data từ Hà Nội comprehensive data và các TP khác
export const wards: { [key: string]: Ward[] } = {
  // Import tất cả phường Hà Nội từ hanoiWards.ts
  ...hanoiWards,

  // TP HCM - Phường 1
  'Phường 1': [
    { name: 'Phường Bến Nghé', district: 'Phường 1', province: 'Hồ Chí Minh' },
    { name: 'Phường Bến Thành', district: 'Phường 1', province: 'Hồ Chí Minh' },
    { name: 'Phường Cầu Kho', district: 'Phường 1', province: 'Hồ Chí Minh' },
    { name: 'Phường Cầu Ông Lãnh', district: 'Phường 1', province: 'Hồ Chí Minh' },
    { name: 'Phường Cô Giang', district: 'Phường 1', province: 'Hồ Chí Minh' },
    { name: 'Phường Đa Kao', district: 'Phường 1', province: 'Hồ Chí Minh' },
    { name: 'Phường Nguyễn Cư Trinh', district: 'Phường 1', province: 'Hồ Chí Minh' },
    { name: 'Phường Nguyễn Thái Bình', district: 'Phường 1', province: 'Hồ Chí Minh' },
    { name: 'Phường Phạm Ngũ Lão', district: 'Phường 1', province: 'Hồ Chí Minh' },
    { name: 'Phường Tân Định', district: 'Phường 1', province: 'Hồ Chí Minh' },
  ],

  // Đà Nẵng - Hải Châu
  'Hải Châu': [
    { name: 'Phường Hải Châu I', district: 'Hải Châu', province: 'Đà Nẵng' },
    { name: 'Phường Hải Châu II', district: 'Hải Châu', province: 'Đà Nẵng' },
    { name: 'Phường Phước Ninh', district: 'Hải Châu', province: 'Đà Nẵng' },
    { name: 'Phường Thạch Thang', district: 'Hải Châu', province: 'Đà Nẵng' },
    { name: 'Phường Thanh Bình', district: 'Hải Châu', province: 'Đà Nẵng' },
    { name: 'Phường Thuận Phước', district: 'Hải Châu', province: 'Đà Nẵng' },
  ]
};

// Helper functions
export function getProvinceNames(): string[] {
  return Object.keys(provinces).sort();
}

/**
 * Lấy danh sách tất cả tỉnh/thành phố từ bảng provinces
 */
export async function getProvincesFromDb() {
  try {
    const { data, error } = await supabase
      .from('provinces')
      .select('_id, name')
      .order('name', { ascending: true });

    if (error) {
      console.error('❌ Lỗi lấy danh sách tỉnh:', error);
      return [];
    }
    console.log('data', data);
    return data || [];
  } catch (error) {
    console.error('❌ Lỗi kết nối database:', error);
    return [];
  }
}

// export function getDistrictsByProvince(provinceName: string): District[] {
//   return districts[provinceName] || [];
// }

// export function getWardsByDistrict(districtName: string): Ward[] {
//   return wards[districtName] || [];
// }

export function getWardsByProvince(provinceName: string): Ward[] {
  // Get all districts in this province
  const provinceDistricts = getDistrictsByProvince(provinceName);
  const districtNames = provinceDistricts.map(d => d.name);

  // Get all wards in those districts
  const allWards: Ward[] = [];
  districtNames.forEach(districtName => {
    const districtWards = wards[districtName] || [];
    allWards.push(...districtWards);
  });

  return allWards;
}

// Helper functions for code-based lookups (from phuc)
export const getProvinceByCode = (code: string): Province | undefined => {
  // Note: Current implementation uses name-based keys, not codes
  // This function may need adjustment based on actual data structure
  return undefined; // Placeholder - needs implementation based on actual data
};

export const getDistrictByName = (name: string, provinceCode: string): District | undefined => {
  // Find district by name within a province
  for (const [provinceName, provinceDistricts] of Object.entries(districts)) {
    const district = provinceDistricts.find(d => d.name === name);
    if (district) return district;
  }
  return undefined;
};

export const getWardByCode = (code: string): Ward | undefined => {
  // Note: Current implementation uses name-based keys, not codes
  // This function may need adjustment based on actual data structure
  for (const [, wardList] of Object.entries(wards)) {
    const ward = wardList.find(w => (w as any).code === code);
    if (ward) return ward;
  }
  return undefined;
};


// vietnamLocations.ts

/**
 * 🏔️ Lấy danh sách Phường/Xã dựa trên province_id (UUID) từ backend
 */
export async function getDistrictsByProvince(provinceId: string): Promise<District[]> {
  if (!provinceId) return [];

  try {
    const { data, error } = await supabase
      .from('districts')
      .select('*')
      .eq('province_id', provinceId)
      .order('name', { ascending: true });

    if (error) throw error;

    // Map dữ liệu từ DB sang interface District nếu cần
    return (data || []).map(d => ({
      _id: d._id || d.id, // Đảm bảo lấy đúng trường ID
      name: d.name,
      province: d.province_id,
      center: d.center || [0, 0],
      bounds: d.bounds || [[0, 0], [0, 0]]
    }));
  } catch (error) {
    console.error('❌ Error fetching districts:', error);
    return [];
  }
}

/**
 * 🏡 Lấy danh sách Xã/Phường dựa trên district_id (UUID) từ backend
 */
export async function getWardsByDistrict(districtId: string): Promise<Ward[]> {
  if (!districtId) return [];

  try {
    const { data, error } = await supabase
      .from('wards')
      .select('*')
      .eq('district_id', districtId)
      .order('name', { ascending: true });

    if (error) throw error;

    return (data || []).map(w => ({
      _id: w._id || w.id,
      name: w.name,
      district: w.district_id,
      province: w.province_id
    }));
  } catch (error) {
    console.error('❌ Error fetching wards:', error);
    return [];
  }
}


// vietnamLocations.ts

/**
 * 🏔️ Lấy danh sách Phường/Xã dựa trên province_id (UUID) từ backend
 */
export async function getDistrictsByProvinceFromDb(provinceId: string): Promise<District[]> {
  if (!provinceId) return [];

  try {
    const { data, error } = await supabase
      .from('districts')
      .select('*')
      .eq('province_id', provinceId)
      .order('name', { ascending: true });

    if (error) throw error;

    // Map dữ liệu từ DB sang interface District nếu cần
    return (data || []).map(d => ({
      _id: d._id || d.id, // Đảm bảo lấy đúng trường ID
      name: d.name,
      province: d.province_id,
      center: d.center || [0, 0],
      bounds: d.bounds || [[0, 0], [0, 0]]
    }));
  } catch (error) {
    console.error('❌ Error fetching districts:', error);
    return [];
  }
}

/**
 * 🏡 Lấy danh sách Xã/Phường dựa trên district_id (UUID) từ backend
 */
export async function getWardsByDistrictFromDb(districtId: string): Promise<Ward[]> {
  if (!districtId) return [];

  try {
    const { data, error } = await supabase
      .from('wards')
      .select('*')
      .eq('district_id', districtId)
      .order('name', { ascending: true });

    if (error) throw error;

    return (data || []).map(w => ({
      _id: w._id || w.id,
      name: w.name,
      district: w.district_id,
      province: w.province_id
    }));
  } catch (error) {
    console.error('❌ Error fetching wards:', error);
    return [];
  }
}


/**
 * 🏡 Lấy danh sách tất cả Xã/Phường của một Tỉnh dựa trên province_id (UUID)
 */
export async function getWardsByProvinceFromDb(provinceId: string) {
  if (!provinceId) return [];
  try {
    const { data, error } = await supabase
      .from('wards')
      .select('*')
      .eq('province_id', provinceId);
      
    if (error) throw error;
    return data || []; // Trả về mảng
  } catch (error) {
    console.error(error);
    return []; // Luôn trả về mảng để tránh lỗi .map
  }
}
