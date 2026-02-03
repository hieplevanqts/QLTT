export type LocationItem = {
  addressLine: string;
  ward: string;
  district: string;
  city: "Hà Nội";
};

export const LOCATION_POOL: LocationItem[] = [
  { addressLine: "Số 12 Hàng Bạc", ward: "Hàng Bạc", district: "Hoàn Kiếm", city: "Hà Nội" },
  { addressLine: "Số 85 Hàng Đào", ward: "Hàng Đào", district: "Hoàn Kiếm", city: "Hà Nội" },
  { addressLine: "Số 101 Tôn Đức Thắng", ward: "Hàng Bột", district: "Đống Đa", city: "Hà Nội" },
  { addressLine: "Số 22 Chùa Láng", ward: "Láng Thượng", district: "Đống Đa", city: "Hà Nội" },
  { addressLine: "Số 18 Xuân Thủy", ward: "Dịch Vọng Hậu", district: "Cầu Giấy", city: "Hà Nội" },
  { addressLine: "Số 50 Trần Duy Hưng", ward: "Trung Hòa", district: "Cầu Giấy", city: "Hà Nội" },
  { addressLine: "Số 9 Phan Văn Trường", ward: "Dịch Vọng", district: "Cầu Giấy", city: "Hà Nội" },
  { addressLine: "Số 120 Nguyễn Trãi", ward: "Thượng Đình", district: "Thanh Xuân", city: "Hà Nội" },
  { addressLine: "Số 35 Khương Đình", ward: "Khương Đình", district: "Thanh Xuân", city: "Hà Nội" },
  { addressLine: "Số 2A Đại Cồ Việt", ward: "Lê Đại Hành", district: "Hai Bà Trưng", city: "Hà Nội" },
  { addressLine: "Số 78 Minh Khai", ward: "Minh Khai", district: "Hai Bà Trưng", city: "Hà Nội" },
  { addressLine: "Số 15 Lạc Long Quân", ward: "Bưởi", district: "Tây Hồ", city: "Hà Nội" },
  { addressLine: "Số 40 Xuân La", ward: "Xuân La", district: "Tây Hồ", city: "Hà Nội" },
  { addressLine: "Số 10 Võ Chí Công", ward: "Phú Thượng", district: "Tây Hồ", city: "Hà Nội" },
  { addressLine: "Số 5 Cổ Linh", ward: "Long Biên", district: "Long Biên", city: "Hà Nội" },
  { addressLine: "Số 88 Nguyễn Văn Cừ", ward: "Bồ Đề", district: "Long Biên", city: "Hà Nội" },
  { addressLine: "Số 66 Ngô Gia Tự", ward: "Đức Giang", district: "Long Biên", city: "Hà Nội" },
  { addressLine: "Số 19 Tạ Quang Bửu", ward: "Bách Khoa", district: "Hai Bà Trưng", city: "Hà Nội" },
  { addressLine: "Số 7 Lý Thường Kiệt", ward: "Trần Hưng Đạo", district: "Hoàn Kiếm", city: "Hà Nội" },
  { addressLine: "Số 42 Phan Đình Phùng", ward: "Quán Thánh", district: "Ba Đình", city: "Hà Nội" },
  { addressLine: "Số 110 Kim Mã", ward: "Kim Mã", district: "Ba Đình", city: "Hà Nội" },
  { addressLine: "Số 23 Nguyễn Chí Thanh", ward: "Láng Hạ", district: "Đống Đa", city: "Hà Nội" },
  { addressLine: "Số 6 Thái Hà", ward: "Trung Liệt", district: "Đống Đa", city: "Hà Nội" },
  { addressLine: "Số 89 Nguyễn Khang", ward: "Yên Hòa", district: "Cầu Giấy", city: "Hà Nội" },
  { addressLine: "Số 14 Trần Quốc Hoàn", ward: "Dịch Vọng Hậu", district: "Cầu Giấy", city: "Hà Nội" },
  { addressLine: "Số 210 Lê Văn Lương", ward: "Nhân Chính", district: "Thanh Xuân", city: "Hà Nội" },
  { addressLine: "Số 1A Nguyễn Trường Tộ", ward: "Trúc Bạch", district: "Ba Đình", city: "Hà Nội" },
  { addressLine: "Số 68 Hàng Bông", ward: "Hàng Bông", district: "Hoàn Kiếm", city: "Hà Nội" },
];

export const formatLocationText = (loc: LocationItem) =>
  `${loc.addressLine}, Phường ${loc.ward}, Quận ${loc.district}, ${loc.city}`;

export const formatWardLabel = (loc: LocationItem) =>
  `Phường ${loc.ward}, Quận ${loc.district}, ${loc.city}`;
