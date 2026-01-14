/**
 * Mock data for Inspection Rounds (Đợt kiểm tra)
 */

export type InspectionRoundStatus = 
  | 'draft'              // Nháp
  | 'preparing'          // Chuẩn bị
  | 'in_progress'        // Đang kiểm tra
  | 'reporting'          // Hoàn thành báo cáo
  | 'completed'          // Hoàn thành
  | 'cancelled';         // Đã hủy

export type InspectionType = 
  | 'scheduled'          // Theo kế hoạch
  | 'unannounced'        // Đột xuất
  | 'followup'           // Tái kiểm tra
  | 'complaint';         // Theo khiếu nại

export interface InspectionTeamMember {
  id: string;
  name: string;
  role: 'leader' | 'member' | 'expert';
}

export interface InspectionTarget {
  id: number;
  name: string;
  address: string;
  inspected: boolean;
  result?: 'passed' | 'warning' | 'violation';
}

export interface InspectionRound {
  id: string;
  name: string;
  code: string; // Mã đợt kiểm tra
  planId?: string; // Liên kết với kế hoạch
  planName?: string;
  type: InspectionType;
  status: InspectionRoundStatus;
  
  // Time
  startDate: string;
  endDate: string;
  actualStartDate?: string;
  actualEndDate?: string;
  
  // Team
  leadUnit: string; // Đơn vị chủ trì
  team: InspectionTeamMember[];
  teamSize: number;
  
  // Targets
  totalTargets: number; // Tổng số cơ sở cần kiểm tra
  inspectedTargets: number; // Số cơ sở đã kiểm tra
  
  // Results
  passedCount?: number;
  warningCount?: number;
  violationCount?: number;
  
  // Metadata
  createdBy: string;
  createdAt: string;
  notes?: string;
}

// Mock Inspection Rounds
export const mockInspectionRounds: InspectionRound[] = [
  // Đang kiểm tra
  {
    id: 'DKT-2026-01-001',
    name: 'Kiểm tra cơ sở kinh doanh thực phẩm Quận 1',
    code: 'DKT-2026-01-001',
    planId: 'KH-2026-Q1-001',
    planName: 'Kế hoạch kiểm tra nông sản Q1/2026 - TP.HCM',
    type: 'scheduled',
    status: 'in_progress',
    startDate: '2026-01-06',
    endDate: '2026-01-10',
    actualStartDate: '2026-01-06',
    leadUnit: 'Chi cục QLTT Quận 1',
    team: [
      { id: 'U001', name: 'Trần Văn A', role: 'leader' },
      { id: 'U002', name: 'Nguyễn Thị B', role: 'member' },
      { id: 'U003', name: 'Lê Văn C', role: 'member' },
    ],
    teamSize: 3,
    totalTargets: 25,
    inspectedTargets: 12,
    passedCount: 8,
    warningCount: 3,
    violationCount: 1,
    createdBy: 'Nguyễn Văn An',
    createdAt: '2026-01-02',
    notes: 'Tập trung kiểm tra các siêu thị và chợ truyền thống',
  },
  {
    id: 'DKT-2026-01-002',
    name: 'Kiểm tra đột xuất cơ sở bánh kẹo',
    code: 'DKT-2026-01-002',
    type: 'unannounced',
    status: 'in_progress',
    startDate: '2026-01-07',
    endDate: '2026-01-09',
    actualStartDate: '2026-01-07',
    leadUnit: 'Chi cục QLTT Quận 3',
    team: [
      { id: 'U004', name: 'Phạm Minh D', role: 'leader' },
      { id: 'U005', name: 'Hoàng Thị E', role: 'member' },
    ],
    teamSize: 2,
    totalTargets: 8,
    inspectedTargets: 3,
    passedCount: 2,
    warningCount: 1,
    violationCount: 0,
    createdBy: 'Phạm Minh',
    createdAt: '2026-01-06',
  },
  
  // Chuẩn bị
  {
    id: 'DKT-2026-01-003',
    name: 'Kiểm tra chuỗi cửa hàng tiện lợi Quận 7',
    code: 'DKT-2026-01-003',
    planId: 'KH-2026-Q1-001',
    planName: 'Kế hoạch kiểm tra nông sản Q1/2026 - TP.HCM',
    type: 'scheduled',
    status: 'preparing',
    startDate: '2026-01-13',
    endDate: '2026-01-17',
    leadUnit: 'Chi cục QLTT Quận 7',
    team: [
      { id: 'U006', name: 'Đỗ Văn F', role: 'leader' },
      { id: 'U007', name: 'Bùi Thị G', role: 'member' },
      { id: 'U008', name: 'Võ Văn H', role: 'expert' },
    ],
    teamSize: 3,
    totalTargets: 30,
    inspectedTargets: 0,
    createdBy: 'Lê Minh',
    createdAt: '2026-01-05',
  },
  {
    id: 'DKT-2026-01-004',
    name: 'Tái kiểm tra cơ sở vi phạm tháng 12/2025',
    code: 'DKT-2026-01-004',
    type: 'followup',
    status: 'preparing',
    startDate: '2026-01-15',
    endDate: '2026-01-16',
    leadUnit: 'Chi cục QLTT Quận 5',
    team: [
      { id: 'U009', name: 'Mai Thị I', role: 'leader' },
      { id: 'U010', name: 'Trương Văn K', role: 'member' },
    ],
    teamSize: 2,
    totalTargets: 5,
    inspectedTargets: 0,
    createdBy: 'Mai Thị I',
    createdAt: '2026-01-08',
    notes: 'Kiểm tra các cơ sở đã bị xử phạt để đảm bảo chấp hành khắc phục',
  },
  
  // Hoàn thành báo cáo
  {
    id: 'DKT-2026-01-005',
    name: 'Kiểm tra cơ sở mỹ phẩm Quận Tân Bình',
    code: 'DKT-2026-01-005',
    planId: 'KH-I/2025-TPHCM',
    planName: 'Kế hoạch kiểm tra định kỳ quý I/2025 - TP.HCM',
    type: 'scheduled',
    status: 'reporting',
    startDate: '2025-12-28',
    endDate: '2026-01-05',
    actualStartDate: '2025-12-28',
    actualEndDate: '2026-01-05',
    leadUnit: 'Chi cục QLTT Quận Tân Bình',
    team: [
      { id: 'U011', name: 'Lý Văn L', role: 'leader' },
      { id: 'U012', name: 'Phan Thị M', role: 'member' },
      { id: 'U013', name: 'Đinh Văn N', role: 'member' },
    ],
    teamSize: 3,
    totalTargets: 20,
    inspectedTargets: 20,
    passedCount: 15,
    warningCount: 4,
    violationCount: 1,
    createdBy: 'Lý Văn L',
    createdAt: '2025-12-20',
  },
  
  // Hoàn thành
  {
    id: 'DKT-2025-12-010',
    name: 'Kiểm tra cơ sở vật liệu xây dựng Quận 12',
    code: 'DKT-2025-12-010',
    planId: 'KH-IV/2025-TPHCM',
    planName: 'Kế hoạch kiểm tra định kỳ quý IV/2025 - TP.HCM',
    type: 'scheduled',
    status: 'completed',
    startDate: '2025-12-10',
    endDate: '2025-12-20',
    actualStartDate: '2025-12-10',
    actualEndDate: '2025-12-20',
    leadUnit: 'Chi cục QLTT Quận 12',
    team: [
      { id: 'U014', name: 'Hồ Văn O', role: 'leader' },
      { id: 'U015', name: 'Đặng Thị P', role: 'member' },
    ],
    teamSize: 2,
    totalTargets: 15,
    inspectedTargets: 15,
    passedCount: 10,
    warningCount: 3,
    violationCount: 2,
    createdBy: 'Hồ Văn O',
    createdAt: '2025-12-01',
  },
  {
    id: 'DKT-2025-12-009',
    name: 'Kiểm tra theo khiếu nại - Cửa hàng XYZ',
    code: 'DKT-2025-12-009',
    type: 'complaint',
    status: 'completed',
    startDate: '2025-12-15',
    endDate: '2025-12-15',
    actualStartDate: '2025-12-15',
    actualEndDate: '2025-12-15',
    leadUnit: 'Chi cục QLTT Quận 2',
    team: [
      { id: 'U016', name: 'Chu Văn Q', role: 'leader' },
      { id: 'U017', name: 'Lâm Thị R', role: 'expert' },
    ],
    teamSize: 2,
    totalTargets: 1,
    inspectedTargets: 1,
    passedCount: 0,
    warningCount: 0,
    violationCount: 1,
    createdBy: 'Chu Văn Q',
    createdAt: '2025-12-14',
    notes: 'Kiểm tra theo khiếu nại của người tiêu dùng về hàng giả',
  },
  
  // Nháp
  {
    id: 'DKT-2026-01-006',
    name: 'Kiểm tra cơ sở kinh doanh dược phẩm',
    code: 'DKT-2026-01-006',
    planId: 'KH-2026-Q1-001',
    planName: 'Kế hoạch kiểm tra nông sản Q1/2026 - TP.HCM',
    type: 'scheduled',
    status: 'draft',
    startDate: '2026-01-20',
    endDate: '2026-01-25',
    leadUnit: 'Chi cục QLTT Quận 6',
    team: [],
    teamSize: 0,
    totalTargets: 18,
    inspectedTargets: 0,
    createdBy: 'Nguyễn Thị S',
    createdAt: '2026-01-08',
  },
  {
    id: 'DKT-2026-01-007',
    name: 'Kiểm tra cơ sở kinh doanh điện tử',
    code: 'DKT-2026-01-007',
    type: 'scheduled',
    status: 'draft',
    startDate: '2026-01-22',
    endDate: '2026-01-28',
    leadUnit: 'Chi cục QLTT Quận 10',
    team: [],
    teamSize: 0,
    totalTargets: 12,
    inspectedTargets: 0,
    createdBy: 'Trần Văn T',
    createdAt: '2026-01-08',
  },
  
  // Đã hủy
  {
    id: 'DKT-2025-12-008',
    name: 'Kiểm tra cơ sở may mặc Bình Tân',
    code: 'DKT-2025-12-008',
    type: 'scheduled',
    status: 'cancelled',
    startDate: '2025-12-22',
    endDate: '2025-12-27',
    leadUnit: 'Chi cục QLTT Bình Tân',
    team: [],
    teamSize: 0,
    totalTargets: 10,
    inspectedTargets: 0,
    createdBy: 'Lê Văn U',
    createdAt: '2025-12-18',
    notes: 'Hủy do chuyển sang đợt kiểm tra tổng hợp tháng 1/2026',
  },

  // Additional rounds for more data
  {
    id: 'DKT-2026-01-008',
    name: 'Kiểm tra cơ sở kinh doanh ô tô cũ',
    code: 'DKT-2026-01-008',
    type: 'unannounced',
    status: 'preparing',
    startDate: '2026-01-18',
    endDate: '2026-01-22',
    leadUnit: 'Chi cục QLTT Thủ Đức',
    team: [
      { id: 'U018', name: 'Cao Văn V', role: 'leader' },
      { id: 'U019', name: 'Dương Thị W', role: 'member' },
      { id: 'U020', name: 'Giang Văn X', role: 'expert' },
    ],
    teamSize: 3,
    totalTargets: 8,
    inspectedTargets: 0,
    createdBy: 'Cao Văn V',
    createdAt: '2026-01-07',
  },
  {
    id: 'DKT-2026-01-009',
    name: 'Kiểm tra cơ sở kinh doanh hải sản',
    code: 'DKT-2026-01-009',
    planId: 'KH-2026-Q1-001',
    planName: 'Kế hoạch kiểm tra nông sản Q1/2026 - TP.HCM',
    type: 'scheduled',
    status: 'in_progress',
    startDate: '2026-01-05',
    endDate: '2026-01-12',
    actualStartDate: '2026-01-05',
    leadUnit: 'Chi cục QLTT Quận 4',
    team: [
      { id: 'U021', name: 'Huỳnh Văn Y', role: 'leader' },
      { id: 'U022', name: 'Kim Thị Z', role: 'member' },
    ],
    teamSize: 2,
    totalTargets: 18,
    inspectedTargets: 14,
    passedCount: 11,
    warningCount: 2,
    violationCount: 1,
    createdBy: 'Huỳnh Văn Y',
    createdAt: '2026-01-02',
  },
];
