/**
 * MAPPA - Comprehensive Mock Data
 * Covers ALL status combinations for complete UI testing
 * Ready to be replaced with API calls
 */

import type {
  Lead,
  Team,
  Inspector,
  Evidence,
  LeadStatistics,
  ActionLog,
  ViolationSubtype,
} from '../types/lead.types';
import {
  calculateSLADeadline,
  calculateSLAStatus,
  URGENCY_SLA_HOURS,
} from '../types/lead.types';

// ============================================================================
// MOCK TEAMS
// ============================================================================

export const mockTeams: Team[] = [
  {
    id: 'team-01',
    name: 'Đội 01 - QLTT số 1',
    organization: 'Chi cục Hà Nội',
    area: 'Hà Nội',
    members: ['inspector-001', 'inspector-002', 'inspector-003', 'inspector-004', 'inspector-005', 'inspector-006'],
    activeLeads: 12,
    completedLeads: 156,
    slaCompliance: 89.5,
  },
  {
    id: 'team-02',
    name: 'Đội 02 - QLTT số 2',
    organization: 'Chi cục Hà Nội',
    area: 'Hà Nội',
    members: ['inspector-007', 'inspector-008', 'inspector-009', 'inspector-010', 'inspector-011'],
    activeLeads: 8,
    completedLeads: 142,
    slaCompliance: 90.6,
  },
  {
    id: 'team-15',
    name: 'Đội 15 - Hà Nội số 3',
    organization: 'Chi cục Hà Nội',
    area: 'Hà Nội',
    members: ['inspector-012', 'inspector-013', 'inspector-014', 'inspector-015', 'inspector-016', 'inspector-017', 'inspector-018'],
    activeLeads: 15,
    completedLeads: 178,
    slaCompliance: 82.1,
  },
  {
    id: 'team-24',
    name: 'Đội 24 - Hà Nội số 4',
    organization: 'Chi cục Hà Nội',
    area: 'Hà Nội',
    members: ['inspector-019', 'inspector-020', 'inspector-021', 'inspector-022', 'inspector-023', 'inspector-024', 'inspector-025', 'inspector-026'],
    activeLeads: 18,
    completedLeads: 203,
    slaCompliance: 71.1,
  },
  {
    id: 'team-07',
    name: 'Đội 07 - Đà Nẵng số 1',
    organization: 'Chi cục Đà Nẵng',
    area: 'Đà Nẵng',
    members: ['inspector-027', 'inspector-028', 'inspector-029', 'inspector-030'],
    activeLeads: 6,
    completedLeads: 98,
    slaCompliance: 76.9,
  },
];

// ============================================================================
// MOCK INSPECTORS
// ============================================================================

export const mockInspectors: Inspector[] = [
  {
    id: 'inspector-001',
    name: 'Nguyễn Văn A',
    email: 'nva@qltt.gov.vn',
    phone: '0901234567',
    role: 'lead',
    teamId: 'team-01',
    activeLeads: 3,
    specializations: ['foodSafety', 'counterfeit'],
  },
  {
    id: 'inspector-002',
    name: 'Trần Thị B',
    email: 'ttb@qltt.gov.vn',
    phone: '0901234568',
    role: 'inspector',
    teamId: 'team-01',
    activeLeads: 2,
    specializations: ['unlicensed', 'priceManipulation'],
  },
  {
    id: 'inspector-020',
    name: 'Lê Văn T',
    email: 'lvt@qltt.gov.vn',
    phone: '0907654321',
    role: 'lead',
    teamId: 'team-24',
    activeLeads: 5,
    specializations: ['counterfeit', 'prohibitedGoods'],
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function createEvidence(
  type: Evidence['type'],
  description: string,
  uploadedBy: string
): Evidence {
  return {
    id: `ev-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    description,
    uploadedBy,
    uploadedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    fileUrl: `https://evidence.mappa.gov.vn/${type}/${Date.now()}.jpg`,
    fileName: `${type}_${Date.now()}.jpg`,
  };
}

function daysAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

function hoursAgo(hours: number): Date {
  const date = new Date();
  date.setHours(date.getHours() - hours);
  return date;
}

function hoursFromNow(hours: number): Date {
  const date = new Date();
  date.setHours(date.getHours() + hours);
  return date;
}

// ============================================================================
// COMPREHENSIVE MOCK LEADS - Covering ALL Status Combinations
// ============================================================================

export const mockLeads: Lead[] = [
  // ========== 1. NEW - CRITICAL - FOOD SAFETY ==========
  {
    id: 'LEAD-2025-0201',
    title: 'Cửa hàng bán thịt heo bốc mùi hôi thối - Chợ Bến Thành',
    description: 'Người dân phản ánh cửa hàng số 45 chợ Bến Thành bán thịt heo hôi thối, không niêm yết nguồn gốc. Nhiều người mua về ăn bị đau bụng.',
    status: 'new',
    statusHistory: [
      {
        status: 'new',
        changedBy: 'system',
        changedAt: hoursAgo(1),
      },
    ],
    urgency: 'critical',
    slaDeadline: hoursFromNow(3), // 4h SLA, created 1h ago
    slaStatus: 'onTrack',
    confidence: 'low',
    confidenceScore: 30,
    riskScope: 'store',
    sourceType: 'hotline',
    sourceReference: 'HL-1800-20250110-0845',
    reporterName: 'Nguyễn Thị Mai',
    reporterContact: '0912345678',
    violationTypes: ['foodSafety'],
    violationSubtypes: ['Hết hạn sử dụng', 'Không rõ nguồn gốc'],
    legalReferences: ['Nghị định 115/2018/NĐ-CP, Điều 7, Khoản 1'],
    actionStatus: 'pendingAssignment',
    actionHistory: [],
    evidences: [
      createEvidence('photo', 'Ảnh chụp thịt heo có màu sắc bất thường', 'Người dân'),
    ],
    location: {
      address: 'Quầy 45, Chợ Bến Thành',
      ward: 'Phường Bến Thành',
      district: 'Phường 1',
      city: 'Hà Nội',
      coordinates: { lat: 10.7729, lng: 106.6980 },
    },
    businessName: 'Gian hàng Thịt Tươi Ngon',
    createdAt: hoursAgo(1),
    updatedAt: hoursAgo(1),
    createdBy: 'Hotline System',
    organization: 'Chi cục Hà Nội',
    assigneeType: 'team',
  },

  // ========== 2. TRIAGED - HIGH - COUNTERFEIT ==========
  {
    id: 'LEAD-2025-0200',
    title: 'Cửa hàng bán giày Nike giả - Đường Lê Lợi',
    description: 'Cửa hàng giày dép số 156 đường Lê Lợi bán giày Nike, Adidas giả với giá rẻ bất thường. Khách hàng phát hiện logo sai, chất liệu kém.',
    status: 'triaged',
    statusHistory: [
      {
        status: 'new',
        changedBy: 'system',
        changedAt: hoursAgo(3),
      },
      {
        status: 'triaged',
        changedBy: 'inspector-001',
        changedAt: hoursAgo(2),
        reason: 'Đã phân loại: Vi phạm hàng giả, độ ưu tiên Cao',
      },
    ],
    urgency: 'high',
    slaDeadline: hoursFromNow(21), // 24h SLA, created 3h ago
    slaStatus: 'onTrack',
    confidence: 'medium',
    confidenceScore: 60,
    riskScope: 'store',
    sourceType: 'webPortal',
    sourceReference: 'WEB-20250110-0234',
    reporterName: 'Trần Văn Hùng',
    reporterContact: 'hung.tran@gmail.com',
    violationTypes: ['counterfeit', 'unlicensed'],
    violationSubtypes: ['Hàng giả mạo thương hiệu', 'Kinh doanh không phép'],
    legalReferences: ['Nghị định 98/2020/NĐ-CP, Điều 15, Khoản 3'],
    actionStatus: 'pendingAssignment',
    actionHistory: [],
    evidences: [
      createEvidence('photo', 'Ảnh giày Nike với logo sai', 'Trần Văn Hùng'),
      createEvidence('photo', 'Ảnh tem nhãn không có thông tin nhà sản xuất', 'Trần Văn Hùng'),
      createEvidence('document', 'Hóa đơn mua hàng', 'Trần Văn Hùng'),
    ],
    location: {
      address: 'Số 156 Lê Lợi',
      ward: 'Phường Bến Thành',
      district: 'Phường 1',
      city: 'Hà Nội',
      coordinates: { lat: 10.7756, lng: 106.7019 },
    },
    businessName: 'Cửa hàng Giày Dép Thời Trang',
    businessOwner: 'Lê Văn Thành',
    createdAt: hoursAgo(3),
    updatedAt: hoursAgo(2),
    createdBy: 'Web System',
    organization: 'Chi cục Hà Nội',
    assigneeType: 'team',
  },

  // ========== 3. PENDING INFO - MEDIUM - UNLICENSED ==========
  {
    id: 'LEAD-2025-0199',
    title: 'Quán cà phê hoạt động không phép - Khu vực Tây Hồ',
    description: 'Có quán cà phê mới mở gần hồ Tây, nghi ngờ không có giấy phép kinh doanh. Cần người báo cung cấp địa chỉ cụ thể.',
    status: 'pendingInfo',
    statusHistory: [
      {
        status: 'new',
        changedBy: 'system',
        changedAt: daysAgo(2),
      },
      {
        status: 'triaged',
        changedBy: 'inspector-001',
        changedAt: daysAgo(1),
      },
      {
        status: 'pendingInfo',
        changedBy: 'inspector-001',
        changedAt: hoursAgo(20),
        reason: 'Thiếu địa chỉ cụ thể, đã gửi email yêu cầu người báo bổ sung',
      },
    ],
    urgency: 'medium',
    slaDeadline: hoursFromNow(28), // 48h SLA, created 2 days ago but paused
    slaStatus: 'onTrack',
    confidence: 'low',
    confidenceScore: 25,
    riskScope: 'point',
    sourceType: 'email',
    sourceReference: 'EMAIL-20250108-0912',
    reporterName: 'Phạm Thị Lan',
    reporterContact: 'lan.pham@gmail.com',
    violationTypes: ['unlicensed'],
    actionStatus: 'pendingAssignment',
    actionHistory: [],
    evidences: [],
    location: {
      address: 'Gần hồ Tây (chưa rõ số nhà)',
      district: 'Phường Tây Hồ',
      city: 'Hà Nội',
    },
    createdAt: daysAgo(2),
    updatedAt: hoursAgo(20),
    createdBy: 'Email System',
    organization: 'Chi cục Hà Nội',
    assigneeType: 'individual',
  },

  // ========== 4. ASSIGNED - CRITICAL - OVERDUE ==========
  {
    id: 'LEAD-2025-0198',
    title: 'Nhà hàng sử dụng thực phẩm bẩn - Phường Hoàn Kiếm',
    description: 'Nhà hàng buffet ABC sử dụng thực phẩm không rõ nguồn gốc, rau không rửa sạch, có ruồi muỗi. Nhiều thực khách bị ngộ độc.',
    status: 'assigned',
    statusHistory: [
      {
        status: 'new',
        changedBy: 'system',
        changedAt: hoursAgo(6),
      },
      {
        status: 'triaged',
        changedBy: 'inspector-001',
        changedAt: hoursAgo(5),
      },
      {
        status: 'assigned',
        changedBy: 'inspector-001',
        changedAt: hoursAgo(4.5),
        reason: 'Giao cho Đội 01 xử lý khẩn cấp',
      },
    ],
    urgency: 'critical',
    slaDeadline: hoursAgo(2), // OVERDUE! 4h SLA, created 6h ago
    slaStatus: 'overdue',
    priorityOverrideReason: 'Có ca ngộ độc thực phẩm, ảnh hưởng sức khỏe cộng đồng',
    confidence: 'high',
    confidenceScore: 85,
    riskScope: 'store',
    sourceType: 'interAgency',
    sourceReference: 'POLICE-HN-20250110-0312',
    reporterName: 'Công an Phường Hàng Bạc',
    violationTypes: ['foodSafety', 'unlicensed'],
    violationSubtypes: ['Điều kiện bảo quản không đạt', 'Nhiễm khuẩn'],
    legalReferences: ['Nghị định 115/2018/NĐ-CP, Điều 7, Khoản 2'],
    actionStatus: 'pendingAssignment',
    actionHistory: [],
    evidences: [
      createEvidence('photo', 'Ảnh bếp có ruồi muỗi', 'Công an'),
      createEvidence('photo', 'Ảnh thực phẩm không rõ nguồn gốc', 'Công an'),
      createEvidence('witnessStatement', 'Lời khai của 3 thực khách bị ngộ độc', 'Công an'),
    ],
    assigneeType: 'team',
    assignedTo: 'team-01',
    assignedAt: hoursAgo(4.5),
    location: {
      address: 'Số 25 Hàng Bạc',
      ward: 'Phường Hàng Bạc',
      district: 'Phường Hoàn Kiếm',
      city: 'Hà Nội',
      coordinates: { lat: 21.0285, lng: 105.8542 },
    },
    businessName: 'Nhà hàng Buffet ABC',
    businessOwner: 'Nguyễn Văn Đức',
    businessPhone: '0243824567',
    createdAt: hoursAgo(6),
    updatedAt: hoursAgo(4.5),
    createdBy: 'Inter-Agency System',
    organization: 'Chi cục Hà Nội',
  },

  // ========== 5. IN PROGRESS - HIGH - AT RISK ==========
  {
    id: 'LEAD-2025-0197',
    title: 'Cửa hàng mỹ phẩm bán hàng nhái - Đường Nguyễn Huệ',
    description: 'Cửa hàng mỹ phẩm Hoa Lan bán kem dưỡng da nhái nhãn hiệu nổi tiếng, không có tem nhãn phụ tiếng Việt.',
    status: 'inProgress',
    statusHistory: [
      {
        status: 'new',
        changedBy: 'system',
        changedAt: hoursAgo(20),
      },
      {
        status: 'triaged',
        changedBy: 'inspector-020',
        changedAt: hoursAgo(19),
      },
      {
        status: 'assigned',
        changedBy: 'inspector-020',
        changedAt: hoursAgo(18),
      },
      {
        status: 'inProgress',
        changedBy: 'inspector-020',
        changedAt: hoursAgo(2),
        reason: 'Đội đã đến hiện trường, đang thu thập chứng cứ',
      },
    ],
    urgency: 'high',
    slaDeadline: hoursFromNow(4), // AT RISK! 24h SLA, 4h left
    slaStatus: 'atRisk',
    confidence: 'high',
    confidenceScore: 88,
    riskScope: 'chain',
    riskScopeDetails: 'Chuỗi 3 cửa hàng cùng chủ sở hữu',
    sourceType: 'inspector',
    sourceReference: 'INSP-24-20250109-0445',
    violationTypes: ['counterfeit', 'substandard'],
    violationSubtypes: ['Hàng nhái bao bì', 'Thiếu thông tin bắt buộc'],
    legalReferences: ['Nghị định 98/2020/NĐ-CP, Điều 12, Khoản 2'],
    actionStatus: 'onSite',
    actionHistory: [
      {
        action: 'travelToSite',
        performedBy: 'inspector-020',
        performedAt: hoursAgo(3),
        notes: 'Di chuyển từ văn phòng đến 156 Nguyễn Huệ',
      },
      {
        action: 'onSite',
        performedBy: 'inspector-020',
        performedAt: hoursAgo(2),
        location: { lat: 10.7756, lng: 106.7050 },
        notes: 'Đã đến hiện trường, đang kiểm tra kho hàng',
      },
    ],
    evidences: [
      createEvidence('photo', 'Ảnh mỹ phẩm không có tem nhãn phụ', 'inspector-020'),
      createEvidence('photo', 'Ảnh logo nhãn hiệu bị mờ', 'inspector-020'),
      createEvidence('gpsLocation', 'Vị trí GPS khi kiểm tra', 'inspector-020'),
    ],
    assigneeType: 'team',
    assignedTo: 'team-24',
    assignedAt: hoursAgo(18),
    location: {
      address: 'Số 156 Nguyễn Huệ',
      ward: 'Phường Bến Nghé',
      district: 'Phường 1',
      city: 'Hà Nội',
      coordinates: { lat: 10.7756, lng: 106.7050 },
    },
    businessName: 'Cửa hàng Mỹ Phẩm Hoa Lan',
    businessOwner: 'Trần Thị Hoa',
    businessPhone: '0283456789',
    businessLicense: 'ĐKKD-HCM-2023-12345',
    createdAt: hoursAgo(20),
    updatedAt: hoursAgo(2),
    createdBy: 'inspector-020',
    organization: 'Chi cục Hà Nội',
  },

  // ========== 6. IN VERIFICATION - MEDIUM - LAB TEST ==========
  {
    id: 'LEAD-2025-0196',
    title: 'Siêu thị bán mì gói hết hạn - Phường Đống Đa',
    description: 'Siêu thị Mini Mart ABC bán mì gói hết hạn sử dụng, đã lấy mẫu gửi lab kiểm định.',
    status: 'inVerification',
    statusHistory: [
      {
        status: 'new',
        changedBy: 'system',
        changedAt: daysAgo(5),
      },
      {
        status: 'triaged',
        changedBy: 'inspector-002',
        changedAt: daysAgo(4),
      },
      {
        status: 'assigned',
        changedBy: 'inspector-002',
        changedAt: daysAgo(4),
      },
      {
        status: 'inProgress',
        changedBy: 'inspector-002',
        changedAt: daysAgo(3),
      },
      {
        status: 'inVerification',
        changedBy: 'inspector-002',
        changedAt: daysAgo(1),
        reason: 'Đã lấy mẫu, đang chờ kết quả giám định từ lab',
      },
    ],
    urgency: 'medium',
    slaDeadline: hoursFromNow(19), // 48h SLA, on track
    slaStatus: 'onTrack',
    confidence: 'high',
    confidenceScore: 90,
    riskScope: 'store',
    sourceType: 'mobileApp',
    sourceReference: 'APP-20250105-0789',
    reporterName: 'Vũ Thị Hương',
    reporterContact: '0987654321',
    violationTypes: ['foodSafety', 'substandard'],
    violationSubtypes: ['Hết hạn sử dụng'],
    legalReferences: ['Nghị định 115/2018/NĐ-CP, Điều 9, Khoản 1'],
    actionStatus: 'sampleTaken',
    actionHistory: [
      {
        action: 'travelToSite',
        performedBy: 'inspector-002',
        performedAt: daysAgo(3),
      },
      {
        action: 'onSite',
        performedBy: 'inspector-002',
        performedAt: daysAgo(3),
        location: { lat: 21.0122, lng: 105.8256 },
      },
      {
        action: 'evidenceCollected',
        performedBy: 'inspector-002',
        performedAt: daysAgo(3),
      },
      {
        action: 'sampleTaken',
        performedBy: 'inspector-002',
        performedAt: daysAgo(3),
        notes: 'Đã lấy 5 gói mì hết hạn, gửi lab QLTT Trung ương',
      },
    ],
    evidences: [
      createEvidence('photo', 'Ảnh mì gói hết hạn trên kệ', 'inspector-002'),
      createEvidence('physicalSample', 'Mẫu 5 gói mì hết hạn - Mã lab: LAB-2025-0123', 'inspector-002'),
      createEvidence('document', 'Biên bản lấy mẫu', 'inspector-002'),
      createEvidence('witnessStatement', 'Lời khai chủ cửa hàng', 'inspector-002'),
    ],
    assigneeType: 'individual',
    assignedTo: 'inspector-002',
    assignedAt: daysAgo(4),
    location: {
      address: 'Số 78 Tôn Đức Thắng',
      ward: 'Phường Khương Thượng',
      district: 'Phường Đống Đa',
      city: 'Hà Nội',
      coordinates: { lat: 21.0122, lng: 105.8256 },
    },
    businessName: 'Siêu thị Mini Mart ABC',
    businessOwner: 'Đỗ Văn Minh',
    businessPhone: '0243567890',
    businessLicense: 'ĐKKD-HN-2022-45678',
    createdAt: daysAgo(5),
    updatedAt: daysAgo(1),
    createdBy: 'Mobile App System',
    organization: 'Chi cục Hà Nội',
  },

  // ========== 7. RESOLVED - HIGH - ADMIN FINE ==========
  {
    id: 'LEAD-2025-0195',
    title: 'Cửa hàng không niêm yết giá - Phường 3',
    description: 'Cửa hàng điện thoại XYZ không niêm yết giá, báo giá khác nhau cho từng khách.',
    status: 'resolved',
    statusHistory: [
      {
        status: 'new',
        changedBy: 'system',
        changedAt: daysAgo(10),
      },
      {
        status: 'triaged',
        changedBy: 'inspector-020',
        changedAt: daysAgo(10),
      },
      {
        status: 'assigned',
        changedBy: 'inspector-020',
        changedAt: daysAgo(9),
      },
      {
        status: 'inProgress',
        changedBy: 'inspector-020',
        changedAt: daysAgo(9),
      },
      {
        status: 'inVerification',
        changedBy: 'inspector-020',
        changedAt: daysAgo(8),
      },
      {
        status: 'resolved',
        changedBy: 'inspector-020',
        changedAt: daysAgo(7),
        reason: 'Đã xử phạt 5.000.000 VND, cơ sở cam kết khắc phục',
      },
    ],
    urgency: 'high',
    slaDeadline: daysAgo(8.5), // Met SLA
    slaStatus: 'onTrack',
    confidence: 'verified',
    confidenceScore: 100,
    riskScope: 'point',
    sourceType: 'socialMedia',
    sourceReference: 'FB-20250100-5678',
    reporterName: 'Nhóm người tiêu dùng Sài Gòn',
    violationTypes: ['priceManipulation'],
    violationSubtypes: ['Không niêm yết giá'],
    legalReferences: ['Nghị định 99/2011/NĐ-CP, Điều 8, Khoản 4'],
    actionStatus: 'penaltyIssued',
    actionHistory: [
      {
        action: 'travelToSite',
        performedBy: 'inspector-020',
        performedAt: daysAgo(9),
      },
      {
        action: 'onSite',
        performedBy: 'inspector-020',
        performedAt: daysAgo(9),
        location: { lat: 10.7880, lng: 106.7050 },
      },
      {
        action: 'evidenceCollected',
        performedBy: 'inspector-020',
        performedAt: daysAgo(9),
      },
      {
        action: 'inspectionComplete',
        performedBy: 'inspector-020',
        performedAt: daysAgo(8),
      },
      {
        action: 'reportDrafted',
        performedBy: 'inspector-020',
        performedAt: daysAgo(7),
      },
      {
        action: 'penaltyIssued',
        performedBy: 'inspector-020',
        performedAt: daysAgo(7),
        notes: 'Đã lập biên bản xử phạt 5.000.000 VND',
      },
    ],
    evidences: [
      createEvidence('photo', 'Ảnh cửa hàng không có bảng niêm yết giá', 'inspector-020'),
      createEvidence('video', 'Video nhân viên báo giá khác nhau', 'inspector-020'),
      createEvidence('witnessStatement', 'Lời khai nhân viên bán hàng', 'inspector-020'),
      createEvidence('inspectorReport', 'Biên bản xử phạt vi phạm hành chính', 'inspector-020'),
    ],
    resolutionType: 'adminFine',
    resolutionDetails: 'Phạt tiền 5.000.000 VND theo Nghị định 99/2011/NĐ-CP, yêu cầu niêm yết giá trong 3 ngày',
    penaltyAmount: 5000000,
    resolutionDocument: 'BB-XPVPHC-HCM-2025-0195.pdf',
    assigneeType: 'individual',
    assignedTo: 'inspector-020',
    assignedAt: daysAgo(9),
    location: {
      address: 'Số 234 Võ Văn Tần',
      ward: 'Phường 5',
      district: 'Phường 3',
      city: 'Hà Nội',
      coordinates: { lat: 10.7880, lng: 106.7050 },
    },
    businessName: 'Cửa hàng Điện Thoại XYZ',
    businessOwner: 'Phạm Văn Long',
    businessPhone: '0283456123',
    businessLicense: 'ĐKKD-HCM-2021-78901',
    createdAt: daysAgo(10),
    updatedAt: daysAgo(7),
    resolvedAt: daysAgo(7),
    createdBy: 'Social Media Monitor',
    organization: 'Chi cục Hà Nội',
  },

  // ========== 8. CLOSED - LOW - NO VIOLATION ==========
  {
    id: 'LEAD-2025-0194',
    title: 'Nghi ngờ cửa hàng tạp hóa bán hàng giả',
    description: 'Người dân nghi ngờ cửa hàng tạp hóa bán nước ngọt giả, sau khi kiểm tra không phát hiện vi phạm.',
    status: 'closed',
    statusHistory: [
      {
        status: 'new',
        changedBy: 'system',
        changedAt: daysAgo(15),
      },
      {
        status: 'triaged',
        changedBy: 'inspector-001',
        changedAt: daysAgo(14),
      },
      {
        status: 'assigned',
        changedBy: 'inspector-001',
        changedAt: daysAgo(14),
      },
      {
        status: 'inProgress',
        changedBy: 'inspector-001',
        changedAt: daysAgo(13),
      },
      {
        status: 'inVerification',
        changedBy: 'inspector-001',
        changedAt: daysAgo(13),
      },
      {
        status: 'resolved',
        changedBy: 'inspector-001',
        changedAt: daysAgo(12),
        reason: 'Không phát hiện vi phạm',
      },
      {
        status: 'closed',
        changedBy: 'inspector-001',
        changedAt: daysAgo(11),
      },
    ],
    urgency: 'low',
    slaDeadline: daysAgo(12), // Met SLA
    slaStatus: 'onTrack',
    confidence: 'verified',
    confidenceScore: 100,
    riskScope: 'point',
    sourceType: 'hotline',
    sourceReference: 'HL-1800-20241226-1234',
    reporterName: 'Ẩn danh',
    violationTypes: ['counterfeit'],
    actionStatus: 'completed',
    actionHistory: [
      {
        action: 'travelToSite',
        performedBy: 'inspector-001',
        performedAt: daysAgo(13),
      },
      {
        action: 'onSite',
        performedBy: 'inspector-001',
        performedAt: daysAgo(13),
        location: { lat: 21.0245, lng: 105.8412 },
      },
      {
        action: 'evidenceCollected',
        performedBy: 'inspector-001',
        performedAt: daysAgo(13),
      },
      {
        action: 'inspectionComplete',
        performedBy: 'inspector-001',
        performedAt: daysAgo(12),
      },
      {
        action: 'completed',
        performedBy: 'inspector-001',
        performedAt: daysAgo(11),
      },
    ],
    evidences: [
      createEvidence('photo', 'Ảnh nước ngọt có tem nhãn rõ ràng', 'inspector-001'),
      createEvidence('document', 'Hóa đơn nhập hàng từ đại lý chính hãng', 'inspector-001'),
      createEvidence('inspectorReport', 'Biên bản kiểm tra không phát hiện vi phạm', 'inspector-001'),
    ],
    resolutionType: 'noViolation',
    resolutionDetails: 'Đã kiểm tra toàn bộ hàng hóa, có đầy đủ hóa đơn chứng từ, không phát hiện vi phạm',
    assigneeType: 'individual',
    assignedTo: 'inspector-001',
    assignedAt: daysAgo(14),
    location: {
      address: 'Số 45 Nguyễn Thái Học',
      ward: 'Phường Điện Biên',
      district: 'Phường Ba Đình',
      city: 'Hà Nội',
      coordinates: { lat: 21.0245, lng: 105.8412 },
    },
    businessName: 'Tạp hóa Hương Lan',
    businessOwner: 'Nguyễn Thị Lan',
    businessPhone: '0243567123',
    createdAt: daysAgo(15),
    updatedAt: daysAgo(11),
    resolvedAt: daysAgo(12),
    closedAt: daysAgo(11),
    createdBy: 'Hotline System',
    organization: 'Chi cục Hà Nội',
  },

  // ========== 9. DUPLICATE ==========
  {
    id: 'LEAD-2025-0193',
    title: 'Cửa hàng bán giày Nike giả - Đường Lê Lợi (Trùng)',
    description: 'Trùng với LEAD-2025-0200',
    status: 'duplicate',
    statusHistory: [
      {
        status: 'new',
        changedBy: 'system',
        changedAt: hoursAgo(2),
      },
      {
        status: 'duplicate',
        changedBy: 'inspector-020',
        changedAt: hoursAgo(1),
        reason: 'Trùng với LEAD-2025-0200',
      },
    ],
    urgency: 'high',
    slaDeadline: hoursFromNow(22),
    slaStatus: 'onTrack',
    confidence: 'low',
    confidenceScore: 30,
    riskScope: 'store',
    sourceType: 'mobileApp',
    sourceReference: 'APP-20250110-0999',
    reporterName: 'Lê Thị Hà',
    violationTypes: ['counterfeit'],
    actionStatus: 'pendingAssignment',
    actionHistory: [],
    evidences: [],
    duplicateOf: 'LEAD-2025-0200',
    location: {
      address: 'Số 156 Lê Lợi',
      district: 'Phường 1',
      city: 'Hà Nội',
    },
    createdAt: hoursAgo(2),
    updatedAt: hoursAgo(1),
    createdBy: 'Mobile App System',
    organization: 'Chi cục Hà Nội',
    assigneeType: 'team',
  },

  // ========== 10. REJECTED ==========
  {
    id: 'LEAD-2025-0192',
    title: 'Cửa hàng bán hàng đắt',
    description: 'Cửa hàng bán giá cao hơn chỗ khác, người dân không hài lòng.',
    status: 'rejected',
    statusHistory: [
      {
        status: 'new',
        changedBy: 'system',
        changedAt: daysAgo(3),
      },
      {
        status: 'triaged',
        changedBy: 'inspector-002',
        changedAt: daysAgo(3),
      },
      {
        status: 'rejected',
        changedBy: 'inspector-002',
        changedAt: daysAgo(3),
        reason: 'Không thuộc thẩm quyền xử lý - giá cao không vi phạm nếu đã niêm yết',
      },
    ],
    urgency: 'low',
    slaDeadline: daysAgo(0.5),
    slaStatus: 'onTrack',
    confidence: 'low',
    confidenceScore: 20,
    riskScope: 'point',
    sourceType: 'hotline',
    sourceReference: 'HL-1800-20250107-5555',
    reporterName: 'Ẩn danh',
    violationTypes: ['priceManipulation'],
    actionStatus: 'pendingAssignment',
    actionHistory: [],
    evidences: [],
    location: {
      address: 'Chưa rõ',
      district: 'Phường Hai Bà Trưng',
      city: 'Hà Nội',
    },
    createdAt: daysAgo(3),
    updatedAt: daysAgo(3),
    createdBy: 'Hotline System',
    organization: 'Chi cục Hà Nội',
    assigneeType: 'individual',
  },

  // ========== 11. ESCALATED - CRITICAL - PROHIBITED GOODS ==========
  {
    id: 'LEAD-2025-0191',
    title: 'Kho chứa pháo nổ lậu quy mô lớn - Phường 12',
    description: 'Phát hiện kho chứa pháo nổ lậu với số lượng lớn, nguy hiểm cao, đã báo cáo Bộ Công an.',
    status: 'escalated',
    statusHistory: [
      {
        status: 'new',
        changedBy: 'system',
        changedAt: hoursAgo(8),
      },
      {
        status: 'triaged',
        changedBy: 'inspector-020',
        changedAt: hoursAgo(7),
      },
      {
        status: 'assigned',
        changedBy: 'inspector-020',
        changedAt: hoursAgo(7),
      },
      {
        status: 'escalated',
        changedBy: 'inspector-020',
        changedAt: hoursAgo(6),
        reason: 'Vượt thẩm quyền, báo cáo Bộ Công an để phối hợp xử lý',
      },
    ],
    urgency: 'critical',
    slaDeadline: hoursAgo(4), // OVERDUE but escalated
    slaStatus: 'overdue',
    confidence: 'verified',
    confidenceScore: 100,
    riskScope: 'supplier',
    riskScopeDetails: 'Kho tổng phân phối pháo lậu cho nhiều tỉnh',
    estimatedAffectedPeople: 10000,
    sourceType: 'inspector',
    sourceReference: 'INSP-24-20250110-0111',
    violationTypes: ['prohibitedGoods', 'unlicensed'],
    violationSubtypes: ['Pháo nổ lậu'],
    legalReferences: ['Luật An toàn PCCC, Điều 42', 'Nghị định 137/2020/NĐ-CP'],
    actionStatus: 'evidenceCollected',
    actionHistory: [
      {
        action: 'travelToSite',
        performedBy: 'inspector-020',
        performedAt: hoursAgo(7),
      },
      {
        action: 'onSite',
        performedBy: 'inspector-020',
        performedAt: hoursAgo(6.5),
        location: { lat: 10.8556, lng: 106.6353 },
      },
      {
        action: 'evidenceCollected',
        performedBy: 'inspector-020',
        performedAt: hoursAgo(6),
        notes: 'Đã chụp ảnh, video. KHÔNG lấy mẫu vì nguy hiểm',
      },
    ],
    evidences: [
      createEvidence('photo', 'Ảnh kho chứa pháo lậu', 'inspector-020'),
      createEvidence('video', 'Video quay toàn cảnh kho', 'inspector-020'),
      createEvidence('gpsLocation', 'Tọa độ GPS chính xác', 'inspector-020'),
    ],
    assigneeType: 'jointForce',
    assignedTo: ['team-24', 'police-hcm', 'fire-dept'],
    assignedAt: hoursAgo(7),
    location: {
      address: 'Kho số 12, Đường Tân Thới Nhì',
      ward: 'Phường Tân Thới Nhì',
      district: 'Phường 12',
      city: 'Hà Nội',
      coordinates: { lat: 10.8556, lng: 106.6353 },
    },
    businessName: 'Kho vật liệu xây dựng (ngụy trang)',
    createdAt: hoursAgo(8),
    updatedAt: hoursAgo(6),
    createdBy: 'inspector-020',
    organization: 'Chi cục Hà Nội',
    tags: ['nguy-hiểm', 'liên-ngành', 'ưu-tiên-cao'],
  },

  // ========== 12. ON HOLD - MEDIUM ==========
  {
    id: 'LEAD-2025-0190',
    title: 'Nhà máy sản xuất nước giải khát không phép - Bình Dương',
    description: 'Nhà máy sản xuất nước giải khát không rõ nguồn gốc, đang chờ kết quả giám định từ lab.',
    status: 'onHold',
    statusHistory: [
      {
        status: 'new',
        changedBy: 'system',
        changedAt: daysAgo(20),
      },
      {
        status: 'triaged',
        changedBy: 'inspector-020',
        changedAt: daysAgo(19),
      },
      {
        status: 'assigned',
        changedBy: 'inspector-020',
        changedAt: daysAgo(19),
      },
      {
        status: 'inProgress',
        changedBy: 'inspector-020',
        changedAt: daysAgo(18),
      },
      {
        status: 'inVerification',
        changedBy: 'inspector-020',
        changedAt: daysAgo(17),
      },
      {
        status: 'onHold',
        changedBy: 'inspector-020',
        changedAt: daysAgo(15),
        reason: 'Chờ kết quả giám định mẫu nước từ Viện Pasteur',
      },
    ],
    urgency: 'medium',
    slaDeadline: daysAgo(18), // Paused SLA
    slaStatus: 'onTrack',
    confidence: 'high',
    confidenceScore: 85,
    riskScope: 'supplier',
    riskScopeDetails: 'Nhà máy cung cấp cho 50+ cửa hàng',
    estimatedAffectedPeople: 5000,
    sourceType: 'interAgency',
    sourceReference: 'FOOD-SAFETY-BD-2024-9999',
    violationTypes: ['foodSafety', 'unlicensed'],
    violationSubtypes: ['Không rõ nguồn gốc', 'Kinh doanh ngành nghề cấm'],
    legalReferences: ['Nghị định 115/2018/NĐ-CP, Điều 11'],
    actionStatus: 'sampleTaken',
    actionHistory: [
      {
        action: 'travelToSite',
        performedBy: 'inspector-020',
        performedAt: daysAgo(18),
      },
      {
        action: 'onSite',
        performedBy: 'inspector-020',
        performedAt: daysAgo(18),
      },
      {
        action: 'evidenceCollected',
        performedBy: 'inspector-020',
        performedAt: daysAgo(17),
      },
      {
        action: 'sampleTaken',
        performedBy: 'inspector-020',
        performedAt: daysAgo(17),
        notes: 'Đã lấy 10 mẫu nước, gửi Viện Pasteur Hà Nội',
      },
    ],
    evidences: [
      createEvidence('photo', 'Ảnh dây chuyền sản xuất', 'inspector-020'),
      createEvidence('video', 'Video quy trình sản xuất', 'inspector-020'),
      createEvidence('physicalSample', 'Mẫu nước giải khát - Lab: PASTEUR-2025-456', 'inspector-020'),
      createEvidence('document', 'Biên bản lấy mẫu', 'inspector-020'),
    ],
    assigneeType: 'external',
    assignedTo: 'chi-cuc-binh-duong',
    assignedAt: daysAgo(19),
    location: {
      address: 'KCN Việt Hương, Thuận An',
      district: 'Thuận An',
      city: 'Bình Dương',
      coordinates: { lat: 10.9046, lng: 106.7219 },
    },
    businessName: 'Nhà máy nước giải khát ABC',
    businessOwner: 'Trần Văn X',
    createdAt: daysAgo(20),
    updatedAt: daysAgo(15),
    createdBy: 'Inter-Agency System',
    organization: 'Chi cục Hà Nội',
    tags: ['chờ-lab', 'liên-tỉnh'],
  },

  // ========== 13-20: MORE COMPREHENSIVE CASES ==========

  // FALSE ADVERTISING
  {
    id: 'LEAD-2025-0189',
    title: 'Quảng cáo thuốc chữa ung thư thần kỳ - Facebook',
    description: 'Fanpage quảng cáo viên uống chữa được mọi loại ung thư, sử dụng hình ảnh bác sĩ giả mạo.',
    status: 'inProgress',
    statusHistory: [
      { status: 'new', changedBy: 'system', changedAt: daysAgo(4) },
      { status: 'triaged', changedBy: 'inspector-001', changedAt: daysAgo(3) },
      { status: 'assigned', changedBy: 'inspector-001', changedAt: daysAgo(3) },
      { status: 'inProgress', changedBy: 'inspector-001', changedAt: daysAgo(2) },
    ],
    urgency: 'critical',
    slaDeadline: hoursFromNow(20),
    slaStatus: 'atRisk',
    confidence: 'high',
    confidenceScore: 80,
    riskScope: 'topic',
    riskScopeDetails: 'Quảng cáo sai sự thật về sản phẩm chức năng',
    estimatedAffectedPeople: 1000,
    sourceType: 'media',
    sourceReference: 'MEDIA-VTV-2025-0123',
    reporterName: 'VTV - Chương trình Chuyển động 24h',
    violationTypes: ['falseAdvertising', 'unlicensed'],
    violationSubtypes: ['Quảng cáo công dụng thần kỳ', 'Sử dụng hình ảnh người nổi tiếng không phép'],
    legalReferences: ['Luật Quảng cáo 2012, Điều 8', 'Nghị định 181/2013/NĐ-CP'],
    actionStatus: 'evidenceCollected',
    actionHistory: [
      {
        action: 'evidenceCollected',
        performedBy: 'inspector-001',
        performedAt: daysAgo(2),
        notes: 'Đã chụp lại các post quảng cáo, video clip',
      },
    ],
    evidences: [
      createEvidence('digitalEvidence', 'Screenshot các post quảng cáo sai sự thật', 'inspector-001'),
      createEvidence('video', 'Video clip quảng cáo trên Facebook', 'inspector-001'),
      createEvidence('document', 'Xác nhận từ bác sĩ: hình ảnh bị sử dụng trái phép', 'inspector-001'),
    ],
    assigneeType: 'team',
    assignedTo: 'team-01',
    assignedAt: daysAgo(3),
    location: {
      address: 'Online - Facebook',
      district: 'N/A',
      city: 'Toàn quốc',
    },
    businessName: 'Fanpage "Thuốc Thần Kỳ ABC"',
    createdAt: daysAgo(4),
    updatedAt: daysAgo(2),
    createdBy: 'Media Monitor',
    organization: 'Chi cục Hà Nội',
    tags: ['online', 'y-tế'],
  },

  // CONSUMER RIGHTS VIOLATION
  {
    id: 'LEAD-2025-0188',
    title: 'Cửa hàng điện máy từ chối bảo hành - Phường Tân Bình',
    description: 'Cửa hàng điện máy XYZ từ chối bảo hành tivi còn trong thời hạn, đổ lỗi cho khách hàng.',
    status: 'resolved',
    statusHistory: [
      { status: 'new', changedBy: 'system', changedAt: daysAgo(8) },
      { status: 'triaged', changedBy: 'inspector-020', changedAt: daysAgo(7) },
      { status: 'assigned', changedBy: 'inspector-020', changedAt: daysAgo(7) },
      { status: 'inProgress', changedBy: 'inspector-020', changedAt: daysAgo(6) },
      { status: 'inVerification', changedBy: 'inspector-020', changedAt: daysAgo(5) },
      { status: 'resolved', changedBy: 'inspector-020', changedAt: daysAgo(4), reason: 'Cửa hàng đã đồng ý bảo hành' },
    ],
    urgency: 'medium',
    slaDeadline: daysAgo(6),
    slaStatus: 'onTrack',
    confidence: 'verified',
    confidenceScore: 95,
    riskScope: 'store',
    sourceType: 'walkIn',
    sourceReference: 'WALKIN-HCM-20250102-001',
    reporterName: 'Phạm Thị Lan',
    reporterContact: '0909123456',
    violationTypes: ['consumerRights'],
    violationSubtypes: ['Từ chối bảo hành'],
    legalReferences: ['Luật Bảo vệ quyền lợi người tiêu dùng 2010, Điều 10'],
    actionStatus: 'completed',
    actionHistory: [
      { action: 'travelToSite', performedBy: 'inspector-020', performedAt: daysAgo(6) },
      { action: 'onSite', performedBy: 'inspector-020', performedAt: daysAgo(6) },
      { action: 'inspectionComplete', performedBy: 'inspector-020', performedAt: daysAgo(5) },
      { action: 'completed', performedBy: 'inspector-020', performedAt: daysAgo(4) },
    ],
    evidences: [
      createEvidence('document', 'Phiếu bảo hành còn hạn', 'Phạm Thị Lan'),
      createEvidence('document', 'Hóa đơn mua hàng', 'Phạm Thị Lan'),
      createEvidence('witnessStatement', 'Lời khai nhân viên bán hàng', 'inspector-020'),
      createEvidence('inspectorReport', 'Biên bản làm việc', 'inspector-020'),
    ],
    resolutionType: 'merchantResolved',
    resolutionDetails: 'Sau khi QLTT làm việc, cửa hàng đã đồng ý nhận bảo hành tivi cho khách hàng',
    assigneeType: 'individual',
    assignedTo: 'inspector-020',
    assignedAt: daysAgo(7),
    location: {
      address: 'Số 123 Cộng Hòa',
      ward: 'Phường 12',
      district: 'Phường Tân Bình',
      city: 'Hà Nội',
      coordinates: { lat: 10.7993, lng: 106.6415 },
    },
    businessName: 'Điện máy XYZ',
    businessOwner: 'Nguyễn Văn Tín',
    businessPhone: '0283567890',
    createdAt: daysAgo(8),
    updatedAt: daysAgo(4),
    resolvedAt: daysAgo(4),
    createdBy: 'Walk-in System',
    organization: 'Chi cục Hà Nội',
  },

  // CHAIN VIOLATION
  {
    id: 'LEAD-2025-0187',
    title: 'Chuỗi nhà thuốc bán thuốc không nguồn gốc - 5 chi nhánh',
    description: 'Phát hiện chuỗi nhà thuốc ABC (5 chi nhánh) bán thuốc không rõ nguồn gốc, nghi ngờ hàng lậu.',
    status: 'inVerification',
    statusHistory: [
      { status: 'new', changedBy: 'system', changedAt: daysAgo(7) },
      { status: 'triaged', changedBy: 'inspector-001', changedAt: daysAgo(6) },
      { status: 'assigned', changedBy: 'inspector-001', changedAt: daysAgo(6) },
      { status: 'inProgress', changedBy: 'inspector-001', changedAt: daysAgo(5) },
      { status: 'inVerification', changedBy: 'inspector-001', changedAt: daysAgo(3) },
    ],
    urgency: 'high',
    slaDeadline: hoursFromNow(17),
    slaStatus: 'onTrack',
    confidence: 'high',
    confidenceScore: 88,
    riskScope: 'chain',
    riskScopeDetails: '5 chi nhánh tại Hà Nội: Hoàn Kiếm, Ba Đình, Đống Đa, Cầu Giấy, Hai Bà Trưng',
    estimatedAffectedPeople: 2000,
    sourceType: 'whistleblower',
    sourceReference: 'WHISTLE-HN-2025-0078',
    reporterName: 'Nhân viên cũ (ẩn danh)',
    violationTypes: ['substandard', 'unlicensed'],
    violationSubtypes: ['Không rõ nguồn gốc', 'Nhập lậu'],
    legalReferences: ['Luật Dược 2016, Điều 123', 'Nghị định 54/2017/NĐ-CP'],
    actionStatus: 'sampleTaken',
    actionHistory: [
      { action: 'travelToSite', performedBy: 'team-01', performedAt: daysAgo(5) },
      { action: 'onSite', performedBy: 'team-01', performedAt: daysAgo(5) },
      { action: 'evidenceCollected', performedBy: 'team-01', performedAt: daysAgo(4) },
      { action: 'sampleTaken', performedBy: 'team-01', performedAt: daysAgo(3), notes: 'Lấy mẫu tại 5 chi nhánh' },
    ],
    evidences: [
      createEvidence('photo', 'Ảnh thuốc không tem nhãn phụ tiếng Việt', 'inspector-001'),
      createEvidence('physicalSample', 'Mẫu thuốc từ 5 chi nhánh - Lab: DRUG-2025-789', 'inspector-001'),
      createEvidence('document', 'Chứng từ nhập hàng không hợp lệ', 'inspector-001'),
      createEvidence('witnessStatement', 'Lời khai nhân viên cũ', 'inspector-001'),
    ],
    assigneeType: 'team',
    assignedTo: 'team-01',
    assignedAt: daysAgo(6),
    location: {
      address: '5 chi nhánh tại Hà Nội',
      district: 'Nhiều Phường',
      city: 'Hà Nội',
    },
    businessName: 'Chuỗi Nhà Thuốc ABC',
    businessOwner: 'Công ty TNHH Dược phẩm ABC',
    createdAt: daysAgo(7),
    updatedAt: daysAgo(3),
    createdBy: 'Whistleblower System',
    organization: 'Chi cục Hà Nội',
    tags: ['y-tế', 'đa-điểm', 'ưu-tiên'],
    relatedLeads: ['LEAD-2025-0187-1', 'LEAD-2025-0187-2', 'LEAD-2025-0187-3', 'LEAD-2025-0187-4', 'LEAD-2025-0187-5'],
  },

  // ROUTE VIOLATION
  {
    id: 'LEAD-2025-0186',
    title: 'Tuyến đường Nguyễn Trãi có nhiều quán ăn vi phạm ATTP',
    description: 'Phát hiện 8 quán ăn dọc đường Nguyễn Trãi (đoạn từ số 100-300) đều có vấn đề về ATTP.',
    status: 'assigned',
    statusHistory: [
      { status: 'new', changedBy: 'system', changedAt: hoursAgo(15) },
      { status: 'triaged', changedBy: 'inspector-020', changedAt: hoursAgo(14) },
      { status: 'assigned', changedBy: 'inspector-020', changedAt: hoursAgo(13) },
    ],
    urgency: 'high',
    slaDeadline: hoursFromNow(9),
    slaStatus: 'onTrack',
    confidence: 'medium',
    confidenceScore: 65,
    riskScope: 'route',
    riskScopeDetails: 'Tuyến đường Nguyễn Trãi, đoạn 100-300, Phường 1',
    estimatedAffectedPeople: 500,
    sourceType: 'inspector',
    sourceReference: 'INSP-24-PATROL-20250110-002',
    violationTypes: ['foodSafety'],
    violationSubtypes: ['Điều kiện bảo quản không đạt', 'Không rõ nguồn gốc'],
    legalReferences: ['Nghị định 115/2018/NĐ-CP, Điều 7'],
    actionStatus: 'pendingAssignment',
    actionHistory: [],
    evidences: [
      createEvidence('photo', 'Ảnh 8 quán ăn vi phạm', 'inspector-020'),
      createEvidence('gpsLocation', 'Tọa độ GPS các quán', 'inspector-020'),
    ],
    assigneeType: 'team',
    assignedTo: 'team-24',
    assignedAt: hoursAgo(13),
    location: {
      address: 'Đường Nguyễn Trãi, đoạn số 100-300',
      ward: 'Phường Phạm Ngũ Lão',
      district: 'Phường 1',
      city: 'Hà Nội',
      coordinates: { lat: 10.7650, lng: 106.6891 },
    },
    createdAt: hoursAgo(15),
    updatedAt: hoursAgo(13),
    createdBy: 'inspector-020',
    organization: 'Chi cục Hà Nội',
    tags: ['tuần-tra', 'đa-điểm'],
  },

  // ZONE VIOLATION
  {
    id: 'LEAD-2025-0185',
    title: 'Chợ Đồng Xuân có nhiều gian hàng bán hàng giả',
    description: 'Toàn bộ khu vực tầng 2 chợ Đồng Xuân (khoảng 30 gian) bán quần áo, giày dép hàng hiệu giả.',
    status: 'inProgress',
    statusHistory: [
      { status: 'new', changedBy: 'system', changedAt: daysAgo(2) },
      { status: 'triaged', changedBy: 'inspector-001', changedAt: daysAgo(1) },
      { status: 'assigned', changedBy: 'inspector-001', changedAt: daysAgo(1) },
      { status: 'inProgress', changedBy: 'inspector-001', changedAt: hoursAgo(6) },
    ],
    urgency: 'critical',
    slaDeadline: hoursFromNow(2),
    slaStatus: 'atRisk',
    confidence: 'verified',
    confidenceScore: 100,
    riskScope: 'zone',
    riskScopeDetails: 'Tầng 2 chợ Đồng Xuân, ~30 gian hàng',
    estimatedAffectedPeople: 10000,
    sourceType: 'inspector',
    sourceReference: 'INSP-01-PATROL-20250108-015',
    violationTypes: ['counterfeit'],
    violationSubtypes: ['Hàng giả mạo thương hiệu', 'Hàng nhái bao bì'],
    legalReferences: ['Nghị định 98/2020/NĐ-CP, Điều 15'],
    actionStatus: 'onSite',
    actionHistory: [
      { action: 'travelToSite', performedBy: 'team-01', performedAt: hoursAgo(7) },
      { action: 'onSite', performedBy: 'team-01', performedAt: hoursAgo(6), notes: '6 thanh tra đang kiểm tra từng gian' },
    ],
    evidences: [
      createEvidence('photo', 'Ảnh hàng giả Nike, Adidas, Gucci', 'inspector-001'),
      createEvidence('video', 'Video toàn cảnh tầng 2', 'inspector-001'),
    ],
    assigneeType: 'team',
    assignedTo: 'team-01',
    assignedAt: daysAgo(1),
    location: {
      address: 'Chợ Đồng Xuân, Tầng 2',
      ward: 'Phường Đồng Xuân',
      district: 'Phường Hoàn Kiếm',
      city: 'Hà Nội',
      coordinates: { lat: 21.0371, lng: 105.8495 },
    },
    createdAt: daysAgo(2),
    updatedAt: hoursAgo(6),
    createdBy: 'inspector-001',
    organization: 'Chi cục Hà Nội',
    tags: ['quy-mô-lớn', 'nhiều-đối-tượng'],
  },

  // EVENT VIOLATION
  {
    id: 'LEAD-2025-0184',
    title: 'Hội chợ Tết có gian hàng bán bánh kẹo hết hạn',
    description: 'Hội chợ Tết Nguyễn Đán 2025 tại Công viên Tao Đàn có 5 gian hàng bán bánh kẹo hết hạn sử dụng.',
    status: 'resolved',
    statusHistory: [
      { status: 'new', changedBy: 'system', changedAt: daysAgo(3) },
      { status: 'triaged', changedBy: 'inspector-020', changedAt: daysAgo(3) },
      { status: 'assigned', changedBy: 'inspector-020', changedAt: daysAgo(3) },
      { status: 'inProgress', changedBy: 'inspector-020', changedAt: daysAgo(2) },
      { status: 'resolved', changedBy: 'inspector-020', changedAt: daysAgo(1), reason: 'Đã tịch thu hàng, phạt 5 gian' },
    ],
    urgency: 'critical',
    slaDeadline: daysAgo(2.5),
    slaStatus: 'onTrack',
    confidence: 'verified',
    confidenceScore: 100,
    riskScope: 'event',
    riskScopeDetails: 'Hội chợ Tết Nguyễn Đán 2025, diễn ra từ 05/01-15/01/2025',
    estimatedAffectedPeople: 3000,
    sourceType: 'inspector',
    sourceReference: 'INSP-24-EVENT-20250107-001',
    violationTypes: ['foodSafety'],
    violationSubtypes: ['Hết hạn sử dụng'],
    legalReferences: ['Nghị định 115/2018/NĐ-CP, Điều 9'],
    actionStatus: 'penaltyIssued',
    actionHistory: [
      { action: 'onSite', performedBy: 'team-24', performedAt: daysAgo(2), notes: 'Kiểm tra đột xuất' },
      { action: 'evidenceCollected', performedBy: 'team-24', performedAt: daysAgo(2) },
      { action: 'inspectionComplete', performedBy: 'team-24', performedAt: daysAgo(1) },
      { action: 'penaltyIssued', performedBy: 'team-24', performedAt: daysAgo(1) },
    ],
    evidences: [
      createEvidence('photo', 'Ảnh bánh kẹo hết hạn', 'inspector-020'),
      createEvidence('physicalSample', 'Mẫu sản phẩm hết hạn', 'inspector-020'),
      createEvidence('inspectorReport', 'Biên bản xử phạt 5 gian hàng', 'inspector-020'),
    ],
    resolutionType: 'goodsConfiscation',
    resolutionDetails: 'Tịch thu toàn bộ hàng hết hạn (ước tính 500kg), phạt mỗi gian 3.000.000 VND',
    penaltyAmount: 15000000, // 5 gian x 3tr
    confiscatedValue: 25000000,
    resolutionDocument: 'BB-XPVPHC-HCM-2025-0184.pdf',
    assigneeType: 'team',
    assignedTo: 'team-24',
    assignedAt: daysAgo(3),
    location: {
      address: 'Hội chợ Tết, Công viên Tao Đàn',
      ward: 'Phường Bến Thành',
      district: 'Phường 1',
      city: 'Hà Nội',
      coordinates: { lat: 10.7823, lng: 106.6937 },
    },
    createdAt: daysAgo(3),
    updatedAt: daysAgo(1),
    resolvedAt: daysAgo(1),
    createdBy: 'inspector-020',
    organization: 'Chi cục Hà Nội',
    tags: ['sự-kiện', 'khẩn-cấp'],
  },

  // GOODS CONFISCATION + LICENSE SUSPENSION
  {
    id: 'LEAD-2025-0183',
    title: 'Cửa hàng tạp hóa bán thuốc lá lậu quy mô lớn',
    description: 'Cửa hàng tạp hóa Mai Lan bán thuốc lá lậu số lượng lớn (2000 bao), đã tịch thu và đình chỉ.',
    status: 'closed',
    statusHistory: [
      { status: 'new', changedBy: 'system', changedAt: daysAgo(12) },
      { status: 'triaged', changedBy: 'inspector-001', changedAt: daysAgo(11) },
      { status: 'assigned', changedBy: 'inspector-001', changedAt: daysAgo(11) },
      { status: 'inProgress', changedBy: 'inspector-001', changedAt: daysAgo(10) },
      { status: 'inVerification', changedBy: 'inspector-001', changedAt: daysAgo(9) },
      { status: 'resolved', changedBy: 'inspector-001', changedAt: daysAgo(8) },
      { status: 'closed', changedBy: 'inspector-001', changedAt: daysAgo(7) },
    ],
    urgency: 'critical',
    slaDeadline: daysAgo(11),
    slaStatus: 'onTrack',
    confidence: 'verified',
    confidenceScore: 100,
    riskScope: 'store',
    sourceType: 'interAgency',
    sourceReference: 'CUSTOMS-HN-2024-8888',
    reporterName: 'Hải quan Hà Nội',
    violationTypes: ['prohibitedGoods', 'unlicensed'],
    violationSubtypes: ['Thuốc lá lậu'],
    legalReferences: ['Luật Phòng chống tác hại thuốc lá 2012', 'Nghị định 67/2013/NĐ-CP'],
    actionStatus: 'completed',
    actionHistory: [
      { action: 'travelToSite', performedBy: 'team-01', performedAt: daysAgo(10) },
      { action: 'onSite', performedBy: 'team-01', performedAt: daysAgo(10) },
      { action: 'evidenceCollected', performedBy: 'team-01', performedAt: daysAgo(10) },
      { action: 'inspectionComplete', performedBy: 'team-01', performedAt: daysAgo(9) },
      { action: 'reportDrafted', performedBy: 'team-01', performedAt: daysAgo(8) },
      { action: 'penaltyIssued', performedBy: 'team-01', performedAt: daysAgo(8) },
      { action: 'completed', performedBy: 'team-01', performedAt: daysAgo(7) },
    ],
    evidences: [
      createEvidence('photo', 'Ảnh 2000 bao thuốc lá lậu', 'inspector-001'),
      createEvidence('video', 'Video kiểm kê hàng hóa', 'inspector-001'),
      createEvidence('physicalSample', 'Mẫu thuốc lá lậu', 'inspector-001'),
      createEvidence('document', 'Biên bản tịch thu', 'inspector-001'),
      createEvidence('inspectorReport', 'Quyết định đình chỉ kinh doanh', 'inspector-001'),
    ],
    resolutionType: 'licenseSuspension',
    resolutionDetails: 'Tịch thu 2000 bao thuốc lá lậu (trị giá ~100 triệu VND), phạt 50.000.000 VND, đình chỉ kinh doanh 6 tháng',
    penaltyAmount: 50000000,
    confiscatedValue: 100000000,
    resolutionDocument: 'QD-DINH-CHI-HN-2025-0183.pdf',
    assigneeType: 'jointForce',
    assignedTo: ['team-01', 'customs-hn'],
    assignedAt: daysAgo(11),
    location: {
      address: 'Số 56 Phố Huế',
      ward: 'Phường Minh Khai',
      district: 'Phường Hai Bà Trưng',
      city: 'Hà Nội',
      coordinates: { lat: 21.0089, lng: 105.8521 },
    },
    businessName: 'Tạp hóa Mai Lan',
    businessOwner: 'Phạm Thị Mai',
    businessLicense: 'ĐKKD-HN-2019-12345',
    createdAt: daysAgo(12),
    updatedAt: daysAgo(7),
    resolvedAt: daysAgo(8),
    closedAt: daysAgo(7),
    createdBy: 'Inter-Agency System',
    organization: 'Chi cục Hà Nội',
    tags: ['hàng-cấm', 'quy-mô-lớn', 'liên-ngành'],
  },

  // CRIMINAL REFERRAL
  {
    id: 'LEAD-2025-0182',
    title: 'Xưởng sản xuất rượu methanol giả - Hóc Môn',
    description: 'Phát hiện xưởng sản xuất rượu giả sử dụng methanol, cực kỳ nguy hiểm. Đã chuyển công an.',
    status: 'closed',
    statusHistory: [
      { status: 'new', changedBy: 'system', changedAt: daysAgo(30) },
      { status: 'triaged', changedBy: 'inspector-020', changedAt: daysAgo(30) },
      { status: 'assigned', changedBy: 'inspector-020', changedAt: daysAgo(29) },
      { status: 'inProgress', changedBy: 'inspector-020', changedAt: daysAgo(29) },
      { status: 'escalated', changedBy: 'inspector-020', changedAt: daysAgo(28), reason: 'Nguy hiểm, chuyển công an' },
      { status: 'resolved', changedBy: 'police-hcm', changedAt: daysAgo(20) },
      { status: 'closed', changedBy: 'inspector-020', changedAt: daysAgo(19) },
    ],
    urgency: 'critical',
    slaDeadline: daysAgo(29),
    slaStatus: 'onTrack',
    confidence: 'verified',
    confidenceScore: 100,
    riskScope: 'supplier',
    riskScopeDetails: 'Xưởng sản xuất cung cấp cho ~50 quán nhậu',
    estimatedAffectedPeople: 5000,
    sourceType: 'whistleblower',
    sourceReference: 'WHISTLE-HCM-2024-9999',
    reporterName: 'Nhân viên cũ (ẩn danh)',
    violationTypes: ['foodSafety', 'prohibitedGoods', 'unlicensed'],
    violationSubtypes: ['Nhiễm khuẩn', 'Hàng cấm'],
    legalReferences: ['Bộ luật Hình sự 2015, Điều 194', 'Nghị định 115/2018/NĐ-CP'],
    actionStatus: 'completed',
    actionHistory: [
      { action: 'travelToSite', performedBy: 'team-24', performedAt: daysAgo(29) },
      { action: 'onSite', performedBy: 'team-24', performedAt: daysAgo(29) },
      { action: 'evidenceCollected', performedBy: 'team-24', performedAt: daysAgo(28) },
      { action: 'completed', performedBy: 'police-hcm', performedAt: daysAgo(19) },
    ],
    evidences: [
      createEvidence('photo', 'Ảnh xưởng sản xuất bất hợp pháp', 'inspector-020'),
      createEvidence('video', 'Video quy trình sản xuất', 'inspector-020'),
      createEvidence('physicalSample', 'Mẫu rượu chứa methanol - Lab: TOXIC-2024-999', 'inspector-020'),
      createEvidence('labTestResult', 'Kết quả: methanol vượt ngưỡng 500 lần', 'Lab QLTT'),
      createEvidence('document', 'Hồ sơ chuyển công an', 'inspector-020'),
    ],
    resolutionType: 'criminalReferral',
    resolutionDetails: 'Đã chuyển hồ sơ sang Công an Hà Nội để xử lý hình sự. Chủ xưởng bị bắt giam, xưởng bị phong tỏa.',
    assigneeType: 'jointForce',
    assignedTo: ['team-24', 'police-hcm', 'health-dept'],
    assignedAt: daysAgo(29),
    location: {
      address: 'Ấp 3, Xã Bà Điểm',
      district: 'Xã Hóc Môn',
      city: 'Hà Nội',
      coordinates: { lat: 10.8824, lng: 106.5921 },
    },
    businessName: 'Xưởng rượu bất hợp pháp',
    createdAt: daysAgo(30),
    updatedAt: daysAgo(19),
    resolvedAt: daysAgo(20),
    closedAt: daysAgo(19),
    createdBy: 'Whistleblower System',
    organization: 'Chi cục Hà Nội',
    tags: ['hình-sự', 'nguy-hiểm-cao', 'liên-ngành'],
  },

  // TRANSFERRED
  {
    id: 'LEAD-2025-0181',
    title: 'Cửa hàng bán hàng giả - Thuộc thẩm quyền Đà Nẵng',
    description: 'Nguồn tin từ Hà Nội nhưng cửa hàng thực tế ở Đà Nẵng, đã chuyển cho Chi cục Đà Nẵng.',
    status: 'closed',
    statusHistory: [
      { status: 'new', changedBy: 'system', changedAt: daysAgo(5) },
      { status: 'triaged', changedBy: 'inspector-020', changedAt: daysAgo(5) },
      { status: 'resolved', changedBy: 'inspector-020', changedAt: daysAgo(4), reason: 'Chuyển Chi cục Đà Nẵng' },
      { status: 'closed', changedBy: 'inspector-020', changedAt: daysAgo(4) },
    ],
    urgency: 'medium',
    slaDeadline: daysAgo(3),
    slaStatus: 'onTrack',
    confidence: 'low',
    confidenceScore: 30,
    riskScope: 'point',
    sourceType: 'hotline',
    sourceReference: 'HL-1800-20250105-7777',
    reporterName: 'Ẩn danh',
    violationTypes: ['counterfeit'],
    actionStatus: 'completed',
    actionHistory: [],
    evidences: [],
    resolutionType: 'transferred',
    resolutionDetails: 'Đã chuyển hồ sơ cho Chi cục QLTT Đà Nẵng xử lý theo thẩm quyền',
    assigneeType: 'external',
    assignedTo: 'chi-cuc-da-nang',
    location: {
      address: 'Số 123 Đường 2/9',
      district: 'Phường Hải Châu',
      city: 'Đà Nẵng',
    },
    createdAt: daysAgo(5),
    updatedAt: daysAgo(4),
    resolvedAt: daysAgo(4),
    closedAt: daysAgo(4),
    createdBy: 'Hotline System',
    organization: 'Chi cục Hà Nội',
    tags: ['chuyển-đơn-vị'],
  },

  // CORRECTIONAL ACTION
  {
    id: 'LEAD-2025-0180',
    title: 'Siêu thị thiếu thông tin dinh dưỡng trên nhãn',
    description: 'Siêu thị BigC bán sản phẩm tự sản xuất (bánh mì, xúc xích) thiếu thông tin dinh dưỡng bắt buộc.',
    status: 'resolved',
    statusHistory: [
      { status: 'new', changedBy: 'system', changedAt: daysAgo(6) },
      { status: 'triaged', changedBy: 'inspector-020', changedAt: daysAgo(5) },
      { status: 'assigned', changedBy: 'inspector-020', changedAt: daysAgo(5) },
      { status: 'inProgress', changedBy: 'inspector-020', changedAt: daysAgo(4) },
      { status: 'resolved', changedBy: 'inspector-020', changedAt: daysAgo(3), reason: 'Siêu thị cam kết khắc phục trong 7 ngày' },
    ],
    urgency: 'low',
    slaDeadline: daysAgo(3.5),
    slaStatus: 'onTrack',
    confidence: 'verified',
    confidenceScore: 100,
    riskScope: 'store',
    sourceType: 'inspector',
    sourceReference: 'INSP-24-ROUTINE-20250104-003',
    violationTypes: ['substandard'],
    violationSubtypes: ['Thiếu thông tin bắt buộc'],
    legalReferences: ['Nghị định 43/2017/NĐ-CP, Điều 21'],
    actionStatus: 'followUpRequired',
    actionHistory: [
      { action: 'onSite', performedBy: 'inspector-020', performedAt: daysAgo(4) },
      { action: 'evidenceCollected', performedBy: 'inspector-020', performedAt: daysAgo(4) },
      { action: 'inspectionComplete', performedBy: 'inspector-020', performedAt: daysAgo(3) },
      { action: 'followUpRequired', performedBy: 'inspector-020', performedAt: daysAgo(3), notes: 'Kiểm tra lại sau 7 ngày' },
    ],
    evidences: [
      createEvidence('photo', 'Ảnh nhãn thiếu thông tin dinh dưỡng', 'inspector-020'),
      createEvidence('inspectorReport', 'Biên bản yêu cầu khắc phục', 'inspector-020'),
    ],
    resolutionType: 'correctiveAction',
    resolutionDetails: 'Yêu cầu siêu thị bổ sung thông tin dinh dưỡng đầy đủ trên nhãn trong 7 ngày, không phạt lần đầu',
    assigneeType: 'individual',
    assignedTo: 'inspector-020',
    assignedAt: daysAgo(5),
    location: {
      address: 'Siêu thị BigC, 97 Võ Văn Tần',
      ward: 'Phường 6',
      district: 'Phường 3',
      city: 'Hà Nội',
      coordinates: { lat: 10.7880, lng: 106.6920 },
    },
    businessName: 'Siêu thị BigC',
    businessOwner: 'Công ty CP BigC Việt Nam',
    createdAt: daysAgo(6),
    updatedAt: daysAgo(3),
    resolvedAt: daysAgo(3),
    createdBy: 'inspector-020',
    organization: 'Chi cục Hà Nội',
    tags: ['cảnh-cáo', 'theo-dõi'],
  },
];

// ============================================================================
// STATISTICS
// ============================================================================

export const mockStatistics: LeadStatistics = {
  total: mockLeads.length,
  byStatus: {
    new: mockLeads.filter(l => l.status === 'new').length,
    triaged: mockLeads.filter(l => l.status === 'triaged').length,
    pendingInfo: mockLeads.filter(l => l.status === 'pendingInfo').length,
    assigned: mockLeads.filter(l => l.status === 'assigned').length,
    inProgress: mockLeads.filter(l => l.status === 'inProgress').length,
    inVerification: mockLeads.filter(l => l.status === 'inVerification').length,
    resolved: mockLeads.filter(l => l.status === 'resolved').length,
    closed: mockLeads.filter(l => l.status === 'closed').length,
    duplicate: mockLeads.filter(l => l.status === 'duplicate').length,
    rejected: mockLeads.filter(l => l.status === 'rejected').length,
    escalated: mockLeads.filter(l => l.status === 'escalated').length,
    onHold: mockLeads.filter(l => l.status === 'onHold').length,
  },
  byUrgency: {
    low: mockLeads.filter(l => l.urgency === 'low').length,
    medium: mockLeads.filter(l => l.urgency === 'medium').length,
    high: mockLeads.filter(l => l.urgency === 'high').length,
    critical: mockLeads.filter(l => l.urgency === 'critical').length,
  },
  byViolationType: {
    foodSafety: mockLeads.filter(l => l.violationTypes.includes('foodSafety')).length,
    counterfeit: mockLeads.filter(l => l.violationTypes.includes('counterfeit')).length,
    substandard: mockLeads.filter(l => l.violationTypes.includes('substandard')).length,
    unlicensed: mockLeads.filter(l => l.violationTypes.includes('unlicensed')).length,
    priceManipulation: mockLeads.filter(l => l.violationTypes.includes('priceManipulation')).length,
    falseAdvertising: mockLeads.filter(l => l.violationTypes.includes('falseAdvertising')).length,
    consumerRights: mockLeads.filter(l => l.violationTypes.includes('consumerRights')).length,
    prohibitedGoods: mockLeads.filter(l => l.violationTypes.includes('prohibitedGoods')).length,
  },
  bySLA: {
    onTrack: mockLeads.filter(l => l.slaStatus === 'onTrack').length,
    atRisk: mockLeads.filter(l => l.slaStatus === 'atRisk').length,
    overdue: mockLeads.filter(l => l.slaStatus === 'overdue').length,
  },
  byResolution: {
    warning: mockLeads.filter(l => l.resolutionType === 'warning').length,
    adminFine: mockLeads.filter(l => l.resolutionType === 'adminFine').length,
    goodsConfiscation: mockLeads.filter(l => l.resolutionType === 'goodsConfiscation').length,
    licenseSuspension: mockLeads.filter(l => l.resolutionType === 'licenseSuspension').length,
    licenseRevocation: mockLeads.filter(l => l.resolutionType === 'licenseRevocation').length,
    criminalReferral: mockLeads.filter(l => l.resolutionType === 'criminalReferral').length,
    correctiveAction: mockLeads.filter(l => l.resolutionType === 'correctiveAction').length,
    noViolation: mockLeads.filter(l => l.resolutionType === 'noViolation').length,
    merchantResolved: mockLeads.filter(l => l.resolutionType === 'merchantResolved').length,
    transferred: mockLeads.filter(l => l.resolutionType === 'transferred').length,
  },
  avgResolutionTime: 52.3, // hours
  slaComplianceRate: 84.2, // percentage
};

// ============================================================================
// HELPER FUNCTIONS FOR API INTEGRATION
// ============================================================================

/**
 * Simulate API call - Replace with actual API endpoint
 */
export async function fetchLeads(filters?: any): Promise<Lead[]> {
  // TODO: Replace with actual API call
  // return await fetch('/api/leads', { method: 'POST', body: JSON.stringify(filters) })
  //   .then(res => res.json());

  // Mock delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Apply filters (simplified)
  let filtered = [...mockLeads];

  if (filters?.status) {
    filtered = filtered.filter(l => filters.status.includes(l.status));
  }

  if (filters?.urgency) {
    filtered = filtered.filter(l => filters.urgency.includes(l.urgency));
  }

  return filtered;
}

export async function fetchLeadById(id: string): Promise<Lead | null> {
  // TODO: Replace with actual API call
  // return await fetch(`/api/leads/${id}`).then(res => res.json());

  await new Promise(resolve => setTimeout(resolve, 300));
  return mockLeads.find(l => l.id === id) || null;
}

export async function createLead(lead: Partial<Lead>): Promise<Lead> {
  // TODO: Replace with actual API call
  // return await fetch('/api/leads', { method: 'POST', body: JSON.stringify(lead) })
  //   .then(res => res.json());

  await new Promise(resolve => setTimeout(resolve, 500));

  const newLead: Lead = {
    id: `LEAD-2025-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
    title: lead.title || '',
    description: lead.description || '',
    status: 'new',
    statusHistory: [
      {
        status: 'new',
        changedBy: 'system',
        changedAt: new Date(),
      },
    ],
    urgency: lead.urgency || 'medium',
    slaDeadline: calculateSLADeadline(new Date(), lead.urgency || 'medium'),
    slaStatus: 'onTrack',
    confidence: 'unverified',
    confidenceScore: 10,
    riskScope: lead.riskScope || 'point',
    sourceType: lead.sourceType || 'webPortal',
    sourceReference: `WEB-${Date.now()}`,
    violationTypes: lead.violationTypes || [],
    actionStatus: 'pendingAssignment',
    actionHistory: [],
    evidences: [],
    location: lead.location || {
      address: '',
      district: '',
      city: '',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'current-user',
    organization: lead.organization || 'Chi cục Hà Nội',
    assigneeType: 'team',
  };

  return newLead;
}

export async function updateLead(id: string, updates: Partial<Lead>): Promise<Lead> {
  // TODO: Replace with actual API call
  // return await fetch(`/api/leads/${id}`, { method: 'PATCH', body: JSON.stringify(updates) })
  //   .then(res => res.json());

  await new Promise(resolve => setTimeout(resolve, 500));

  const lead = mockLeads.find(l => l.id === id);
  if (!lead) throw new Error('Lead not found');

  return { ...lead, ...updates, updatedAt: new Date() };
}

export async function fetchStatistics(): Promise<LeadStatistics> {
  // TODO: Replace with actual API call
  // return await fetch('/api/leads/statistics').then(res => res.json());

  await new Promise(resolve => setTimeout(resolve, 300));
  return mockStatistics;
}
