type RiskLevel = 'low' | 'medium' | 'high';

export interface FacilityDetail {
  id: string;
  name: string;
  address: string;
  ward: string;
  type: string;
  riskLevel: RiskLevel;
  lastInspection: string;
  violations: number;
  legalStatus: string;
}

export const quan1FacilitiesData: FacilityDetail[] = [
  // Nhà hàng - High Risk (4)
  { id: 'TPHCM-NR-001', name: 'Nhà hàng Hương Việt', address: '123 Nguyễn Huệ', ward: 'Phường Bến Nghé', type: 'Nhà hàng', riskLevel: 'high', lastInspection: '15/01/2025', violations: 3, legalStatus: 'Đầy đủ' },
  { id: 'TPHCM-NR-002', name: 'Nhà hàng Seoul Garden', address: '45 Đồng Khởi', ward: 'Phường Bến Nghé', type: 'Nhà hàng', riskLevel: 'high', lastInspection: '14/01/2025', violations: 2, legalStatus: 'Đầy đủ' },
  { id: 'TPHCM-NR-003', name: 'Nhà hàng Phương Nam', address: '234 Lê Thánh Tôn', ward: 'Phường Bến Thành', type: 'Nhà hàng', riskLevel: 'high', lastInspection: '13/01/2025', violations: 4, legalStatus: 'Thiếu ATTP' },
  { id: 'TPHCM-NR-004', name: 'Nhà hàng Á Đông', address: '56 Mạc Thị Bưởi', ward: 'Phường Bến Nghé', type: 'Nhà hàng', riskLevel: 'high', lastInspection: '12/01/2025', violations: 2, legalStatus: 'Đầy đủ' },
  
  // Nhà hàng - Medium Risk (3)
  { id: 'TPHCM-NR-005', name: 'Nhà hàng Sài Gòn Xưa', address: '78 Nguyễn Du', ward: 'Phường Bến Thành', type: 'Nhà hàng', riskLevel: 'medium', lastInspection: '15/01/2025', violations: 1, legalStatus: 'Đầy đủ' },
  { id: 'TPHCM-NR-006', name: 'Nhà hàng Hoa Sen', address: '90 Hai Bà Trưng', ward: 'Phường Bến Nghé', type: 'Nhà hàng', riskLevel: 'medium', lastInspection: '14/01/2025', violations: 0, legalStatus: 'Đầy đủ' },
  { id: 'TPHCM-NR-007', name: 'Nhà hàng Mỹ Lan', address: '112 Lý Tự Trọng', ward: 'Phường Bến Thành', type: 'Nhà hàng', riskLevel: 'medium', lastInspection: '13/01/2025', violations: 1, legalStatus: 'Đầy đủ' },
  
  // Nhà hàng - Low Risk (2)
  { id: 'TPHCM-NR-008', name: 'Nhà hàng Bamboo', address: '145 Pasteur', ward: 'Phường Bến Nghé', type: 'Nhà hàng', riskLevel: 'low', lastInspection: '15/01/2025', violations: 0, legalStatus: 'Đầy đủ' },
  { id: 'TPHCM-NR-009', name: 'Nhà hàng Golden Dragon', address: '167 Trần Hưng Đạo', ward: 'Phường Cô Giang', type: 'Nhà hàng', riskLevel: 'low', lastInspection: '14/01/2025', violations: 0, legalStatus: 'Đầy đủ' },
  
  // Quán ăn - High Risk (1)
  { id: 'TPHCM-QA-002', name: 'Quán cơm Thanh Vân', address: '23 Nguyễn Thái Học', ward: 'Phường Cầu Ông Lãnh', type: 'Quán ăn', riskLevel: 'high', lastInspection: '13/01/2025', violations: 3, legalStatus: 'Thiếu ATTP' },
  
  // Quán ăn - Medium Risk (2)
  { id: 'TPHCM-QA-001', name: 'Quán ăn An Nhiên', address: '45 Lê Lợi', ward: 'Phường Bến Nghé', type: 'Quán ăn', riskLevel: 'medium', lastInspection: '14/01/2025', violations: 1, legalStatus: 'Đầy đủ' },
  { id: 'TPHCM-QA-003', name: 'Quán phở Hà Nội', address: '67 Võ Văn Tần', ward: 'Phường Võ Thị Sáu', type: 'Quán ăn', riskLevel: 'medium', lastInspection: '12/01/2025', violations: 0, legalStatus: 'Đầy đủ' },
  
  // Quán ăn - Low Risk (2)
  { id: 'TPHCM-QA-004', name: 'Quán bún bò Huế', address: '89 Trương Định', ward: 'Phường Bến Thành', type: 'Quán ăn', riskLevel: 'low', lastInspection: '15/01/2025', violations: 0, legalStatus: 'Đầy đủ' },
  { id: 'TPHCM-QA-005', name: 'Quán bún thịt nướng', address: '101 Lý Chính Thắng', ward: 'Phường Võ Thị Sáu', type: 'Quán ăn', riskLevel: 'low', lastInspection: '14/01/2025', violations: 0, legalStatus: 'Đầy đủ' },
  
  // Siêu thị - Low Risk (3)
  { id: 'TPHCM-ST-001', name: 'Siêu thị CoopMart', address: '78 Hai Bà Trưng', ward: 'Phường Bến Nghé', type: 'Siêu thị', riskLevel: 'low', lastInspection: '13/01/2025', violations: 0, legalStatus: 'Đầy đủ' },
  { id: 'TPHCM-ST-002', name: 'Siêu thị Lotte Mart', address: '469 Nguyễn Hữu Thọ', ward: 'Phường Tân Hưng', type: 'Siêu thị', riskLevel: 'low', lastInspection: '12/01/2025', violations: 0, legalStatus: 'Đầy đủ' },
  { id: 'TPHCM-ST-003', name: 'Siêu thị BigC', address: '123 Lê Lai', ward: 'Phường Bến Thành', type: 'Siêu thị', riskLevel: 'low', lastInspection: '15/01/2025', violations: 0, legalStatus: 'Đầy đủ' },
  
  // Cửa hàng thực phẩm - High Risk (1)
  { id: 'TPHCM-CH-001', name: 'Cửa hàng thực phẩm Tươi Ngon', address: '234 Điện Biên Phủ', ward: 'Phường Đa Kao', type: 'Cửa hàng', riskLevel: 'high', lastInspection: '12/01/2025', violations: 2, legalStatus: 'Đầy đủ' },
  
  // Cửa hàng thực phẩm - Medium Risk (1)
  { id: 'TPHCM-CH-002', name: 'Cửa hàng An Khang', address: '56 Calmette', ward: 'Phường Nguyễn Thái Bình', type: 'Cửa hàng', riskLevel: 'medium', lastInspection: '13/01/2025', violations: 1, legalStatus: 'Đầy đủ' },
  
  // Cửa hàng thực phẩm - Low Risk (2)
  { id: 'TPHCM-CH-003', name: 'Cửa hàng Organic', address: '78 Nam Kỳ Khởi Nghĩa', ward: 'Phường Bến Nghé', type: 'Cửa hàng', riskLevel: 'low', lastInspection: '14/01/2025', violations: 0, legalStatus: 'Đầy đủ' },
  { id: 'TPHCM-CH-004', name: 'Cửa hàng Thực phẩm sạch', address: '90 Phạm Ngọc Thạch', ward: 'Phường Bến Thành', type: 'Cửa hàng', riskLevel: 'low', lastInspection: '15/01/2025', violations: 0, legalStatus: 'Đầy đủ' },
  
  // Quán cà phê - Medium Risk (1)
  { id: 'TPHCM-CF-004', name: 'Cộng Cà Phê', address: '67 Nam Kỳ Khởi Nghĩa', ward: 'Phường Bến Nghé', type: 'Quán cà phê', riskLevel: 'medium', lastInspection: '12/01/2025', violations: 1, legalStatus: 'Đầy đủ' },
  
  // Quán cà phê - Low Risk (4)
  { id: 'TPHCM-CF-001', name: 'Quán cà phê The Coffee House', address: '56 Pasteur', ward: 'Phường Bến Nghé', type: 'Quán cà phê', riskLevel: 'low', lastInspection: '11/01/2025', violations: 0, legalStatus: 'Đầy đủ' },
  { id: 'TPHCM-CF-002', name: 'Starbucks Coffee', address: '123 Đồng Khởi', ward: 'Phường Bến Nghé', type: 'Quán cà phê', riskLevel: 'low', lastInspection: '14/01/2025', violations: 0, legalStatus: 'Đầy đủ' },
  { id: 'TPHCM-CF-003', name: 'Highlands Coffee', address: '45 Lê Thánh Tôn', ward: 'Phường Bến Nghé', type: 'Quán cà phê', riskLevel: 'low', lastInspection: '13/01/2025', violations: 0, legalStatus: 'Đầy đủ' },
  { id: 'TPHCM-CF-005', name: 'Trung Nguyên Legend', address: '89 Hai Bà Trưng', ward: 'Phường Bến Nghé', type: 'Quán cà phê', riskLevel: 'low', lastInspection: '15/01/2025', violations: 0, legalStatus: 'Đầy đủ' },
  
  // Cơ sở chế biến - High Risk (2)
  { id: 'TPHCM-CB-001', name: 'Xưởng chế biến thực phẩm Tân Phát', address: '234 Nguyễn Trãi', ward: 'Phường Phạm Ngũ Lão', type: 'Cơ sở chế biến', riskLevel: 'high', lastInspection: '10/01/2025', violations: 5, legalStatus: 'Thiếu ATTP' },
  { id: 'TPHCM-CB-002', name: 'Cơ sở chế biến hải sản Hương Biển', address: '156 Lê Thánh Tôn', ward: 'Phường Bến Thành', type: 'Cơ sở chế biến', riskLevel: 'high', lastInspection: '11/01/2025', violations: 3, legalStatus: 'Đầy đủ' },
  
  // Cơ sở chế biến - Medium Risk (1)
  { id: 'TPHCM-CB-003', name: 'Cơ sở sản xuất bánh kẹo An Phú', address: '78 Trần Quang Khải', ward: 'Phường Tân Định', type: 'Cơ sở chế biến', riskLevel: 'medium', lastInspection: '14/01/2025', violations: 1, legalStatus: 'Đầy đủ' },
];

// Summary: Total 32 facilities
// High Risk: 9 (28.1%)
// Medium Risk: 8 (25%)
// Low Risk: 15 (46.9%)
