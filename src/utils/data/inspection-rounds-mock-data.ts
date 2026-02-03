/**
 * Mock data for Inspection Rounds (Đợt kiểm tra)
 */

export type InspectionRoundStatus = 
  | 'draft'              // Nháp
  | 'pending_approval'   // Chờ duyệt
  | 'approved'           // Đã duyệt
  | 'rejected'           // Từ chối duyệt
  | 'active'             // Đang triển khai
  | 'paused'             // Tạm dừng
  | 'in_progress'        // Đang kiểm tra
  | 'completed'          // Hoàn thành
  | 'cancelled';         // Đã hủy

export type InspectionType = 
  | 'routine'            // Định kỳ
  | 'targeted'           // Chuyên đề
  | 'sudden'             // Đột xuất
  | 'followup';          // Tái kiểm tra

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
  planCode?: string;
  planName?: string;
  quarter?: string;
  type: InspectionType;
  status: InspectionRoundStatus;
  provinceId?: string;
  wardId?: string;
  
  // Time
  startDate: string;
  endDate: string;
  actualStartDate?: string;
  actualEndDate?: string;
  
  // Team
  leadUnit: string; // Đơn vị chủ trì
  leadUnitId?: string;
  teamLeader?: string;
  team: InspectionTeamMember[];
  teamSize: number;
  
  // Targets / Stats
  totalTargets: number; // Tổng số cơ sở cần kiểm tra
  inspectedTargets: number; // Số cơ sở đã kiểm tra
  
  // Results
  passedCount?: number;
  warningCount?: number;
  violationCount?: number;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  
  // Metadata
  createdBy: string;
  createdAt: string;
  notes?: string;
  formTemplate?: string;
  scope?: string;
  scopeDetails?: {
    provinces: string[];
    districts: string[];
    wards: string[];
  };
  
  // Legacy/UI Stats helper
  stats?: {
    totalSessions: number;
    completedSessions: number;
    storesInspected: number;
    storesPlanned: number;
    violationsFound: number;
    violationRate: number;
    progress: number;
  };
}

// Mock Inspection Rounds
export const mockInspectionRounds: InspectionRound[] = [
  // Đang kiểm tra
  {
    id: 'DKT-2026-01-001',
    name: 'Kiểm tra cơ sở kinh doanh thực phẩm Phường 1',
    code: 'DKT-2026-01-001',
    planId: 'KH-2026-Q1-001',
    planName: 'Kế hoạch kiểm tra nông sản Q1/2026 - Hà Nội',
    type: 'routine',
    status: 'in_progress',
    startDate: '2026-01-06',
    endDate: '2026-01-10',
    actualStartDate: '2026-01-06',
    leadUnit: 'Chi cục QLTT Phường 1',
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
    priority: 'high',
    createdBy: 'Nguyễn Văn An',
    createdAt: '2026-01-02',
    notes: 'Tập trung kiểm tra các siêu thị và chợ truyền thống',
  },
  {
    id: 'DKT-2026-01-002',
    name: 'Kiểm tra đột xuất cơ sở bánh kẹo',
    code: 'DKT-2026-01-002',
    type: 'sudden',
    status: 'in_progress',
    startDate: '2026-01-07',
    endDate: '2026-01-09',
    actualStartDate: '2026-01-07',
    leadUnit: 'Chi cục QLTT Phường 3',
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
    priority: 'urgent',
    createdBy: 'Phạm Minh',
    createdAt: '2026-01-06',
  },
  
  // Chuẩn bị
  {
    id: 'DKT-2026-01-003',
    name: 'Kiểm tra chuỗi cửa hàng tiện lợi Phường 7',
    code: 'DKT-2026-01-003',
    planId: 'KH-2026-Q1-001',
    planName: 'Kế hoạch kiểm tra nông sản Q1/2026 - Hà Nội',
    type: 'routine',
    status: 'pending_approval',
    startDate: '2026-01-13',
    endDate: '2026-01-17',
    leadUnit: 'Chi cục QLTT Phường 7',
    team: [
      { id: 'U006', name: 'Đỗ Văn F', role: 'leader' },
      { id: 'U007', name: 'Bùi Thị G', role: 'member' },
      { id: 'U008', name: 'Võ Văn H', role: 'expert' },
    ],
    teamSize: 3,
    totalTargets: 30,
    inspectedTargets: 0,
    priority: 'medium',
    createdBy: 'Lê Minh',
    createdAt: '2026-01-05',
  },
  {
    id: 'DKT-2026-01-004',
    name: 'Tái kiểm tra cơ sở vi phạm tháng 12/2025',
    code: 'DKT-2026-01-004',
    type: 'followup',
    status: 'pending_approval',
    startDate: '2026-01-15',
    endDate: '2026-01-16',
    leadUnit: 'Chi cục QLTT Phường 5',
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
  
  // Hoàn thành
  {
    id: 'DKT-2025-12-010',
    name: 'Kiểm tra cơ sở vật liệu xây dựng Phường 12',
    code: 'DKT-2025-12-010',
    planId: 'KH-IV/2025-TPHCM',
    planName: 'Kế hoạch kiểm tra định kỳ quý IV/2025 - Hà Nội',
    type: 'routine',
    status: 'completed',
    startDate: '2025-12-10',
    endDate: '2025-12-20',
    actualStartDate: '2025-12-10',
    actualEndDate: '2025-12-20',
    leadUnit: 'Chi cục QLTT Phường 12',
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
    type: 'targeted',
    status: 'completed',
    startDate: '2025-12-15',
    endDate: '2025-12-15',
    actualStartDate: '2025-12-15',
    actualEndDate: '2025-12-15',
    leadUnit: 'Chi cục QLTT Phường 2',
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
    planName: 'Kế hoạch kiểm tra nông sản Q1/2026 - Hà Nội',
    type: 'routine',
    status: 'draft',
    startDate: '2026-01-20',
    endDate: '2026-01-25',
    leadUnit: 'Chi cục QLTT Phường 6',
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
    type: 'routine',
    status: 'draft',
    startDate: '2026-01-22',
    endDate: '2026-01-28',
    leadUnit: 'Chi cục QLTT Phường 10',
    team: [],
    teamSize: 0,
    totalTargets: 12,
    inspectedTargets: 0,
    createdBy: 'Trần Văn T',
    createdAt: '2026-01-08',
  },
  {
    id: 'DKT-2026-01-015',
    name: 'Kiểm tra cơ sở sản xuất đồ chơi trẻ em',
    code: 'DKT-2026-01-015',
    planId: 'KH-2026-Q1-002',
    planName: 'Kế hoạch kiểm tra chất lượng sản phẩm công nghiệp Q1/2026',
    type: 'targeted',
    status: 'draft',
    startDate: '2026-01-25',
    endDate: '2026-01-30',
    leadUnit: 'Chi cục QLTT Phường 4',
    team: [],
    teamSize: 0,
    totalTargets: 20,
    inspectedTargets: 0,
    createdBy: 'Lê Thị U',
    createdAt: '2026-01-10',
    notes: 'Cần kiểm tra chặt chẽ các sản phẩm đồ chơi trước Tết Nguyên Đán',
  },
  {
    id: 'DKT-2026-01-016',
    name: 'Kiểm tra đột xuất chuỗi nhà hàng ăn uống',
    code: 'DKT-2026-01-016',
    type: 'sudden',
    status: 'draft',
    startDate: '2026-01-18',
    endDate: '2026-01-20',
    leadUnit: 'Chi cục QLTT Phường 8',
    team: [],
    teamSize: 0,
    totalTargets: 8,
    inspectedTargets: 0,
    createdBy: 'Phan Văn V',
    createdAt: '2026-01-11',
    notes: 'Kiểm tra vệ sinh an toàn thực phẩm tại các nhà hàng có khiếu nại',
  },
  {
    id: 'DKT-2026-01-017',
    name: 'Kiểm tra cơ sở bán lẻ hóa mỹ phẩm',
    code: 'DKT-2026-01-017',
    planId: 'KH-2026-Q1-003',
    planName: 'Kế hoạch kiểm tra hóa mỹ phẩm Q1/2026 - Hà Nội',
    type: 'routine',
    status: 'draft',
    startDate: '2026-02-01',
    endDate: '2026-02-05',
    leadUnit: 'Chi cục QLTT Phường Hoàng Mai',
    team: [],
    teamSize: 0,
    totalTargets: 15,
    inspectedTargets: 0,
    createdBy: 'Đặng Minh W',
    createdAt: '2026-01-12',
  },
  
  // Đã duyệt
  {
    id: 'DKT-2026-01-011',
    name: 'Kiểm tra cơ sở sản xuất bánh kẹo Tết',
    code: 'DKT-2026-01-011',
    planId: 'KH-2026-Q1-001',
    planName: 'Kế hoạch kiểm tra nông sản Q1/2026 - Hà Nội',
    type: 'routine',
    status: 'approved',
    startDate: '2026-01-16',
    endDate: '2026-01-20',
    leadUnit: 'Chi cục QLTT Phường 8',
    team: [
      { id: 'U025', name: 'Phan Văn AA', role: 'leader' },
      { id: 'U026', name: 'Trịnh Thị BB', role: 'member' },
      { id: 'U027', name: 'Vũ Văn CC', role: 'member' },
    ],
    teamSize: 3,
    totalTargets: 15,
    inspectedTargets: 0,
    createdBy: 'Phan Văn AA',
    createdAt: '2026-01-10',
    notes: 'Đã được phê duyệt, sẵn sàng triển khai',
  },

  // Đang triển khai
  {
    id: 'DKT-2026-01-018',
    name: 'Kiểm tra cơ sở kinh doanh phân bón',
    code: 'DKT-2026-01-018',
    planId: 'KH-2026-Q1-004',
    planName: 'Kế hoạch kiểm tra phân bón Q1/2026 - Đồng Nai',
    type: 'routine',
    status: 'active',
    startDate: '2026-01-08',
    endDate: '2026-01-15',
    actualStartDate: '2026-01-08',
    leadUnit: 'Chi cục QLTT Biên Hòa',
    team: [
      { id: 'U030', name: 'Lương Văn FF', role: 'leader' },
      { id: 'U031', name: 'Mai Thị GG', role: 'member' },
      { id: 'U032', name: 'Nhâm Văn HH', role: 'member' },
    ],
    teamSize: 3,
    totalTargets: 22,
    inspectedTargets: 0,
    createdBy: 'Lương Văn FF',
    createdAt: '2026-01-03',
    notes: 'Đã triển khai nhưng chưa bắt đầu kiểm tra hiện trường',
  },
  {
    id: 'DKT-2026-01-019',
    name: 'Kiểm tra cơ sở kinh doanh xăng dầu',
    code: 'DKT-2026-01-019',
    planId: 'KH-2026-Q1-005',
    planName: 'Kế hoạch kiểm tra xăng dầu Q1/2026 - Hà Nội',
    type: 'targeted',
    status: 'active',
    startDate: '2026-01-10',
    endDate: '2026-01-20',
    actualStartDate: '2026-01-10',
    leadUnit: 'Chi cục QLTT Phường Tân Bình',
    team: [
      { id: 'U033', name: 'Ông Văn II', role: 'leader' },
      { id: 'U034', name: 'Phan Thị JJ', role: 'member' },
      { id: 'U035', name: 'Quách Văn KK', role: 'expert' },
      { id: 'U036', name: 'Rồng Thị LL', role: 'member' },
    ],
    teamSize: 4,
    totalTargets: 30,
    inspectedTargets: 0,
    createdBy: 'Ông Văn II',
    createdAt: '2026-01-04',
    notes: 'Đang trong giai đoạn chuẩn bị triển khai hiện trường',
  },

  // Tạm dừng
  {
    id: 'DKT-2026-01-020',
    name: 'Kiểm tra cơ sở sản xuất thức ăn chăn nuôi',
    code: 'DKT-2026-01-020',
    planId: 'KH-2026-Q1-001',
    planName: 'Kế hoạch kiểm tra nông sản Q1/2026 - Hà Nội',
    type: 'routine',
    status: 'paused',
    startDate: '2026-01-05',
    endDate: '2026-01-12',
    actualStartDate: '2026-01-05',
    leadUnit: 'Chi cục QLTT Hóc Môn',
    team: [
      { id: 'U037', name: 'Sơn Văn MM', role: 'leader' },
      { id: 'U038', name: 'Tạ Thị NN', role: 'member' },
    ],
    teamSize: 2,
    totalTargets: 12,
    inspectedTargets: 5,
    passedCount: 3,
    warningCount: 2,
    violationCount: 0,
    createdBy: 'Sơn Văn MM',
    createdAt: '2026-01-02',
    notes: 'Tạm dừng do thành viên đoàn bị ốm, chờ bổ sung nhân lực',
  },
  {
    id: 'DKT-2026-01-021',
    name: 'Kiểm tra cơ sở kinh doanh thiết bị y tế',
    code: 'DKT-2026-01-021',
    type: 'sudden',
    status: 'paused',
    startDate: '2026-01-08',
    endDate: '2026-01-11',
    actualStartDate: '2026-01-08',
    leadUnit: 'Chi cục QLTT Phường 11',
    team: [
      { id: 'U039', name: 'Uyên Thị OO', role: 'leader' },
      { id: 'U040', name: 'Vinh Văn PP', role: 'expert' },
    ],
    teamSize: 2,
    totalTargets: 6,
    inspectedTargets: 2,
    passedCount: 1,
    warningCount: 1,
    violationCount: 0,
    createdBy: 'Uyên Thị OO',
    createdAt: '2026-01-07',
    notes: 'Tạm dừng do cần xin thêm quyết định kiểm tra mở rộng',
  },
  
  // Từ chối duyệt
  {
    id: 'DKT-2026-01-012',
    name: 'Kiểm tra cơ sở sản xuất nước uống đóng chai',
    code: 'DKT-2026-01-012',
    type: 'routine',
    status: 'rejected',
    startDate: '2026-01-25',
    endDate: '2026-01-30',
    leadUnit: 'Chi cục QLTT Phường 9',
    team: [
      { id: 'U028', name: 'Ngô Văn DD', role: 'leader' },
      { id: 'U029', name: 'Đặng Thị EE', role: 'member' },
    ],
    teamSize: 2,
    totalTargets: 10,
    inspectedTargets: 0,
    createdBy: 'Ngô Văn DD',
    createdAt: '2026-01-09',
    notes: 'Từ chối do lực lượng chưa đầy đủ, cần bổ sung thành viên',
  },
  
  // Đã hủy
  {
    id: 'DKT-2025-12-008',
    name: 'Kiểm tra cơ sở may mặc Bình Tân',
    code: 'DKT-2025-12-008',
    type: 'routine',
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
    type: 'sudden',
    status: 'pending_approval',
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
    planName: 'Kế hoạch kiểm tra nông sản Q1/2026 - Hà Nội',
    type: 'routine',
    status: 'in_progress',
    startDate: '2026-01-05',
    endDate: '2026-01-12',
    actualStartDate: '2026-01-05',
    leadUnit: 'Chi cục QLTT Phường 4',
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
