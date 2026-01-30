/**
 * Danh mục ngành nghề kinh doanh chuẩn
 * Standard business industry categories
 */

export interface Industry {
  id: string;
  code: string;
  name: string;
  category?: string;
}

/**
 * Danh sách ngành nghề kinh doanh theo phân loại
 */
export const INDUSTRIES: Industry[] = [
  // Thực phẩm & Đồ uống
  { id: '1', code: 'FOOD_01', name: 'Bán lẻ thực phẩm', category: 'Thực phẩm & Đồ uống' },
  { id: '2', code: 'FOOD_02', name: 'Bán lẻ đồ uống', category: 'Thực phẩm & Đồ uống' },
  { id: '3', code: 'FOOD_03', name: 'Nhà hàng, quán ăn', category: 'Thực phẩm & Đồ uống' },
  { id: '4', code: 'FOOD_04', name: 'Quán cà phê', category: 'Thực phẩm & Đồ uống' },
  { id: '5', code: 'FOOD_05', name: 'Siêu thị thực phẩm', category: 'Thực phẩm & Đồ uống' },
  { id: '6', code: 'FOOD_06', name: 'Cửa hàng tiện lợi', category: 'Thực phẩm & Đồ uống' },
  { id: '7', code: 'FOOD_07', name: 'Bán buôn thực phẩm', category: 'Thực phẩm & Đồ uống' },
  
  // Mỹ phẩm & Chăm sóc cá nhân
  { id: '8', code: 'COSM_01', name: 'Bán lẻ mỹ phẩm', category: 'Mỹ phẩm & Chăm sóc' },
  { id: '9', code: 'COSM_02', name: 'Spa & chăm sóc da', category: 'Mỹ phẩm & Chăm sóc' },
  { id: '10', code: 'COSM_03', name: 'Salon tóc & làm đẹp', category: 'Mỹ phẩm & Chăm sóc' },
  { id: '11', code: 'COSM_04', name: 'Bán buôn mỹ phẩm', category: 'Mỹ phẩm & Chăm sóc' },
  
  // Dược phẩm & Y tế
  { id: '12', code: 'PHAR_01', name: 'Nhà thuốc bán lẻ', category: 'Dược phẩm & Y tế' },
  { id: '13', code: 'PHAR_02', name: 'Quầy thuốc', category: 'Dược phẩm & Y tế' },
  { id: '14', code: 'PHAR_03', name: 'Phòng khám tư nhân', category: 'Dược phẩm & Y tế' },
  { id: '15', code: 'PHAR_04', name: 'Thiết bị y tế', category: 'Dược phẩm & Y tế' },
  { id: '16', code: 'PHAR_05', name: 'Bán buôn dược phẩm', category: 'Dược phẩm & Y tế' },
  
  // Thời trang & Phụ kiện
  { id: '17', code: 'FASH_01', name: 'Bán lẻ thời trang', category: 'Thời trang & Phụ kiện' },
  { id: '18', code: 'FASH_02', name: 'Giày dép', category: 'Thời trang & Phụ kiện' },
  { id: '19', code: 'FASH_03', name: 'Túi xách & phụ kiện', category: 'Thời trang & Phụ kiện' },
  { id: '20', code: 'FASH_04', name: 'Đồng hồ & trang sức', category: 'Thời trang & Phụ kiện' },
  { id: '21', code: 'FASH_05', name: 'Quần áo trẻ em', category: 'Thời trang & Phụ kiện' },
  { id: '22', code: 'FASH_06', name: 'Bán buôn thời trang', category: 'Thời trang & Phụ kiện' },
  
  // Điện tử & Công nghệ
  { id: '23', code: 'ELEC_01', name: 'Điện thoại & phụ kiện', category: 'Điện tử & Công nghệ' },
  { id: '24', code: 'ELEC_02', name: 'Máy tính & laptop', category: 'Điện tử & Công nghệ' },
  { id: '25', code: 'ELEC_03', name: 'Điện máy gia dụng', category: 'Điện tử & Công nghệ' },
  { id: '26', code: 'ELEC_04', name: 'Thiết bị âm thanh', category: 'Điện tử & Công nghệ' },
  { id: '27', code: 'ELEC_05', name: 'Camera & thiết bị giám sát', category: 'Điện tử & Công nghệ' },
  
  // Nội thất & Trang trí
  { id: '28', code: 'FURN_01', name: 'Nội thất gia đình', category: 'Nội thất & Trang trí' },
  { id: '29', code: 'FURN_02', name: 'Nội thất văn phòng', category: 'Nội thất & Trang trí' },
  { id: '30', code: 'FURN_03', name: 'Đồ trang trí', category: 'Nội thất & Trang trí' },
  { id: '31', code: 'FURN_04', name: 'Đồ gỗ & mây tre', category: 'Nội thất & Trang trí' },
  
  // Xây dựng & Vật liệu
  { id: '32', code: 'CONS_01', name: 'Vật liệu xây dựng', category: 'Xây dựng & Vật liệu' },
  { id: '33', code: 'CONS_02', name: 'Sắt thép', category: 'Xây dựng & Vật liệu' },
  { id: '34', code: 'CONS_03', name: 'Gạch men & gốm sứ', category: 'Xây dựng & Vật liệu' },
  { id: '35', code: 'CONS_04', name: 'Sơn & hóa chất xây dựng', category: 'Xây dựng & Vật liệu' },
  { id: '36', code: 'CONS_05', name: 'Thiết bị điện & chiếu sáng', category: 'Xây dựng & Vật liệu' },
  
  // Ô tô & Xe máy
  { id: '37', code: 'AUTO_01', name: 'Đại lý ô tô', category: 'Ô tô & Xe máy' },
  { id: '38', code: 'AUTO_02', name: 'Đại lý xe máy', category: 'Ô tô & Xe máy' },
  { id: '39', code: 'AUTO_03', name: 'Phụ tùng ô tô', category: 'Ô tô & Xe máy' },
  { id: '40', code: 'AUTO_04', name: 'Phụ tùng xe máy', category: 'Ô tô & Xe máy' },
  { id: '41', code: 'AUTO_05', name: 'Garage sửa chữa', category: 'Ô tô & Xe máy' },
  
  // Dịch vụ
  { id: '42', code: 'SERV_01', name: 'Giặt là & giặt khô', category: 'Dịch vụ' },
  { id: '43', code: 'SERV_02', name: 'Sửa chữa điện tử', category: 'Dịch vụ' },
  { id: '44', code: 'SERV_03', name: 'In ấn & photocopy', category: 'Dịch vụ' },
  { id: '45', code: 'SERV_04', name: 'Cho thuê xe', category: 'Dịch vụ' },
  { id: '46', code: 'SERV_05', name: 'Khách sạn & lưu trú', category: 'Dịch vụ' },
  { id: '47', code: 'SERV_06', name: 'Du lịch & lữ hành', category: 'Dịch vụ' },
  
  // Giáo dục & Đào tạo
  { id: '48', code: 'EDU_01', name: 'Trung tâm ngoại ngữ', category: 'Giáo dục & Đào tạo' },
  { id: '49', code: 'EDU_02', name: 'Trung tâm tin học', category: 'Giáo dục & Đào tạo' },
  { id: '50', code: 'EDU_03', name: 'Trung tâm kỹ năng', category: 'Giáo dục & Đào tạo' },
  { id: '51', code: 'EDU_04', name: 'Nhà sách & văn phòng phẩm', category: 'Giáo dục & Đào tạo' },
  
  // Thể thao & Giải trí
  { id: '52', code: 'SPOR_01', name: 'Phòng gym & fitness', category: 'Thể thao & Giải trí' },
  { id: '53', code: 'SPOR_02', name: 'Thiết bị thể thao', category: 'Thể thao & Giải trí' },
  { id: '54', code: 'SPOR_03', name: 'Game center', category: 'Thể thao & Giải trí' },
  { id: '55', code: 'SPOR_04', name: 'Karaoke', category: 'Thể thao & Giải trí' },
  
  // Khác
  { id: '56', code: 'MISC_01', name: 'Bán lẻ hàng hóa tổng hợp', category: 'Khác' },
  { id: '57', code: 'MISC_02', name: 'Bán buôn hàng hóa tổng hợp', category: 'Khác' },
  { id: '58', code: 'MISC_03', name: 'Kho bãi & logistics', category: 'Khác' },
  { id: '59', code: 'MISC_04', name: 'Đại lý & phân phối', category: 'Khác' },
  { id: '60', code: 'MISC_05', name: 'Thương mại điện tử', category: 'Khác' },
];

/**
 * Get industry by code
 */
export function getIndustryByCode(code: string): Industry | undefined {
  return INDUSTRIES.find(i => i.code === code);
}

/**
 * Get industry by name
 */
export function getIndustryByName(name: string): Industry | undefined {
  return INDUSTRIES.find(i => i.name === name);
}

/**
 * Get industries by category
 */
export function getIndustriesByCategory(category: string): Industry[] {
  return INDUSTRIES.filter(i => i.category === category);
}

/**
 * Get all unique categories
 */
export function getCategories(): string[] {
  const categories = new Set(INDUSTRIES.map(i => i.category).filter(Boolean) as string[]);
  return Array.from(categories);
}

/**
 * Search industries by keyword
 */
export function searchIndustries(keyword: string): Industry[] {
  const lowerKeyword = keyword.toLowerCase().trim();
  if (!lowerKeyword) return INDUSTRIES;
  
  return INDUSTRIES.filter(i => 
    i.name.toLowerCase().includes(lowerKeyword) ||
    i.code.toLowerCase().includes(lowerKeyword) ||
    (i.category && i.category.toLowerCase().includes(lowerKeyword))
  );
}
