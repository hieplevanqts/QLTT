// Mock data cho module Kế hoạch tác nghiệp

export type PlanStatus = 'draft' | 'pending_approval' | 'approved' | 'rejected' | 'active' | 'paused' | 'completed' | 'cancelled';
export type PlanType = 'periodic' | 'thematic' | 'urgent';
export type TargetType = 'STORE' | 'LEAD' | 'RISK_ZONE' | 'POINT';
export type Priority = 'low' | 'medium' | 'high' | 'critical' | 'urgent';
export type TaskStatus = 'not_started' | 'in_progress' | 'completed' | 'closed';
export type SLAStatus = 'on_track' | 'at_risk' | 'overdue';

export interface Plan {
  id: string;
  code?: string;
  name: string;
  planType: PlanType;
  quarter: string;
  topic: string;
  scope: string;
  scopeLocation: string;
  responsibleUnit: string;
  coordinatingUnit?: string; // Đơn vị phối hợp
  region?: string; // For table display
  leadUnit?: string; // For table display
  objectives: string;
  status: PlanStatus;
  priority: Priority;
  startDate: string;
  endDate: string;
  createdBy: string;
  createdById?: string;
  createdAt: string;
  provinceId?: string;
  wardId?: string;
  // M03 - Quyết định giao quyền từ INS
  insDecisionM03?: {
    id: string;
    code: string;
    title: string;
    issueDate: string;
    signer: string;
  };
  // Metadata for status changes
  rejectionReason?: string; // Lý do từ chối
  rejectedBy?: string; // Người từ chối
  rejectedAt?: string; // Thời gian từ chối
  approvedBy?: string; // Người phê duyệt
  approvedAt?: string; // Thời gian phê duyệt
  deployedBy?: string; // Người triển khai
  deployedAt?: string; // Thời gian triển khai
  pausedReason?: string; // Lý do tạm dừng
  pausedBy?: string; // Người tạm dừng
  pausedAt?: string; // Thời gian tạm dừng
  cancelledReason?: string; // Lý do hủy
  cancelledBy?: string; // Người hủy
  cancelledAt?: string; // Thời gian hủy
  stats: {
    totalTargets: number;
    totalTasks: number;
    completedTasks: number;
    progress: number;
  };
  attachments?: any[];
}

export interface Target {
  id: string;
  planId: string;
  type: TargetType;
  name: string;
  priority: Priority;
  location: {
    address: string;
    district: string;
    lat: number;
    lng: number;
  };
  tags: string[];
  notes: string;
  converted: boolean;
}

export interface Task {
  id: string;
  planId: string;
  targetId?: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  assignee: {
    id: string;
    name: string;
    avatar?: string;
    team: string;
  };
  assignedBy: {
    id: string;
    name: string;
  };
  dueDate: string;
  sla: {
    status: SLAStatus;
    hoursRemaining: number;
    totalHours: number;
  };
  checklist: ChecklistItem[];
  evidence: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  required: boolean;
  completed: boolean;
  notes?: string;
}

// Mock Plans
export const mockPlans: Plan[] = [
  // Demo Plan for Task Board
  {
    id: 'KH-2026-Q1-001',
    name: 'Kế hoạch kiểm tra nông sản Q1/2026 - Hà Nội',
    planType: 'thematic',
    quarter: 'Q1/2026',
    topic: 'Kiểm tra chất lượng nông sản',
    scope: 'Toàn thành phố',
    scopeLocation: 'Hà Nội',
    responsibleUnit: 'Chi cục QLTT Hà Nội',
    objectives: 'Kiểm tra nguồn gốc và chất lượng nông sản tại các chợ truyền thống và siêu thị',
    status: 'active',
    priority: 'high',
    startDate: '2026-01-01',
    endDate: '2026-03-31',
    createdBy: 'Nguyễn Văn A',
    createdAt: '2025-12-20',
    stats: {
      totalTargets: 4,
      totalTasks: 8,
      completedTasks: 2,
      progress: 25
    }
  },
  // Định kỳ (Năm) - 8 plans
  {
    id: 'KH-I/2025-HN',
    name: 'Kế hoạch kiểm tra định kỳ quý I/2025 - Hà Nội',
    planType: 'periodic',
    quarter: 'Q1/2025',
    topic: 'Kiểm tra định kỳ',
    scope: 'Toàn thành phố',
    scopeLocation: 'Hà Nội',
    responsibleUnit: 'Chi cục QLTT Hà Nội',
    objectives: 'Kiểm tra định kỳ các cơ sở kinh doanh trên địa bàn Hà Nội quý I/2025',
    status: 'active',
    priority: 'high',
    startDate: '2025-01-01',
    endDate: '2025-03-31',
    createdBy: 'Nguyễn Văn An',
    createdAt: '2024-12-15',
    stats: {
      totalTargets: 150,
      totalTasks: 120,
      completedTasks: 85,
      progress: 71
    }
  },
  {
    id: 'KH-I/2025-TPHCM',
    name: 'Kế hoạch kiểm tra định kỳ quý I/2025 - Hà Nội',
    planType: 'periodic',
    quarter: 'Q1/2025',
    topic: 'Kiểm tra định kỳ',
    scope: 'Toàn thành phố',
    scopeLocation: 'Hà Nội',
    responsibleUnit: 'Chi cục QLTT Hà Nội',
    objectives: 'Kiểm tra định kỳ các cơ sở kinh doanh trên địa bàn Hà Nội quý I/2025',
    status: 'completed',
    priority: 'high',
    startDate: '2025-01-01',
    endDate: '2025-03-31',
    createdBy: 'Phạm Minh',
    createdAt: '2024-12-18',
    stats: {
      totalTargets: 200,
      totalTasks: 180,
      completedTasks: 180,
      progress: 100
    }
  },
  {
    id: 'KH-II/2025-DN',
    name: 'Kế hoạch kiểm tra định kỳ quý II/2025 - Đà Nẵng',
    planType: 'periodic',
    quarter: 'Q2/2025',
    topic: 'Kiểm tra định kỳ',
    scope: 'Toàn thành phố',
    scopeLocation: 'Đà Nẵng',
    responsibleUnit: 'Chi cục QLTT Đà Nẵng',
    objectives: 'Kiểm tra định kỳ các cơ sở kinh doanh trên địa bàn Đà Nẵng quý II/2025',
    status: 'approved',
    priority: 'medium',
    startDate: '2025-04-01',
    endDate: '2025-06-30',
    createdBy: 'Võ Thị Lý',
    createdAt: '2025-03-20',
    stats: {
      totalTargets: 85,
      totalTasks: 0,
      completedTasks: 0,
      progress: 0
    }
  },
  {
    id: 'KH-II/2025-HP',
    name: 'Kế hoạch kiểm tra định kỳ quý II/2025 - Hải Phòng',
    planType: 'periodic',
    quarter: 'Q2/2025',
    topic: 'Kiểm tra định kỳ',
    scope: 'Toàn thành phố',
    scopeLocation: 'Hải Phòng',
    responsibleUnit: 'Chi cục QLTT Hải Phòng',
    objectives: 'Kiểm tra định kỳ các cơ sở kinh doanh trên địa bàn Hải Phòng quý II/2025',
    status: 'pending_approval',
    priority: 'medium',
    startDate: '2025-04-01',
    endDate: '2025-06-30',
    createdBy: 'Đặng Văn Cường',
    createdAt: '2025-03-25',
    stats: {
      totalTargets: 90,
      totalTasks: 0,
      completedTasks: 0,
      progress: 0
    }
  },
  {
    id: 'KH-III/2025-CT',
    name: 'Kế hoạch kiểm tra định kỳ quý III/2025 - Cần Thơ',
    planType: 'periodic',
    quarter: 'Q3/2025',
    topic: 'Kiểm tra định kỳ',
    scope: 'Toàn thành phố',
    scopeLocation: 'Cần Thơ',
    responsibleUnit: 'Chi cục QLTT Cần Thơ',
    objectives: 'Kiểm tra định kỳ các cơ sở kinh doanh trên địa bàn Cần Thơ quý III/2025',
    status: 'draft',
    priority: 'low',
    startDate: '2025-07-01',
    endDate: '2025-09-30',
    createdBy: 'Lý Thanh Hằng',
    createdAt: '2025-06-15',
    stats: {
      totalTargets: 70,
      totalTasks: 0,
      completedTasks: 0,
      progress: 0
    }
  },
  {
    id: 'KH-IV/2024-BD',
    name: 'Kế hoạch kiểm tra định kỳ quý IV/2024 - Bình Dương',
    planType: 'periodic',
    quarter: 'Q4/2024',
    topic: 'Kiểm tra định kỳ',
    scope: 'Toàn tỉnh',
    scopeLocation: 'Bình Dương',
    responsibleUnit: 'Chi cục QLTT Bình Dương',
    objectives: 'Kiểm tra định kỳ các cơ sở kinh doanh trên địa bàn Bình Dương quý IV/2024',
    status: 'completed',
    priority: 'high',
    startDate: '2024-10-01',
    endDate: '2024-12-31',
    createdBy: 'Hoàng Minh Đức',
    createdAt: '2024-09-20',
    stats: {
      totalTargets: 110,
      totalTasks: 95,
      completedTasks: 95,
      progress: 100
    }
  },
  {
    id: 'KH-III/2025-DN',
    name: 'Kế hoạch kiểm tra định kỳ quý III/2025 - Đồng Nai',
    planType: 'periodic',
    quarter: 'Q3/2025',
    topic: 'Kiểm tra định kỳ',
    scope: 'Toàn tỉnh',
    scopeLocation: 'Đồng Nai',
    responsibleUnit: 'Chi cục QLTT Đồng Nai',
    objectives: 'Kiểm tra định kỳ các cơ sở kinh doanh trên địa bàn Đồng Nai quý III/2025',
    status: 'draft',
    priority: 'low',
    startDate: '2025-09-01',
    endDate: '2025-11-30',
    createdBy: 'Võ Văn Hải',
    createdAt: '2025-08-10',
    stats: {
      totalTargets: 95,
      totalTasks: 0,
      completedTasks: 0,
      progress: 0
    }
  },
  {
    id: 'KH-IV/2025-VT',
    name: 'Kế hoạch kiểm tra định kỳ quý IV/2025 - Vũng Tàu',
    planType: 'periodic',
    quarter: 'Q4/2025',
    topic: 'Kiểm tra định kỳ',
    scope: 'Toàn tỉnh',
    scopeLocation: 'Bà Rịa - Vũng Tàu',
    responsibleUnit: 'Chi cục QLTT Bà Rịa - Vũng Tàu',
    objectives: 'Kiểm tra định kỳ các cơ sở kinh doanh trên địa bàn BR-VT quý IV/2025',
    status: 'draft',
    priority: 'low',
    startDate: '2025-04-01',
    endDate: '2025-06-30',
    createdBy: 'Lê Thị Hương',
    createdAt: '2025-03-15',
    stats: {
      totalTargets: 60,
      totalTasks: 0,
      completedTasks: 0,
      progress: 0
    }
  },

  // Chuyên đề - 7 plans
  {
    id: 'KH-CD-ATVSTP-2025',
    name: 'Chuyên đề An toàn vệ sinh thực phẩm Tết Nguyên Đán 2025',
    planType: 'thematic',
    quarter: 'Q1/2025',
    topic: 'An toàn vệ sinh thực phẩm',
    scope: '63 tỉnh thành',
    scopeLocation: 'Toàn quốc',
    responsibleUnit: 'Tổng cục QLTT',
    objectives: 'Chuyên đề kiểm tra ATVS thực phẩm dịp Tết Nguyên Đán 2025',
    status: 'active',
    priority: 'critical',
    startDate: '2025-01-15',
    endDate: '2025-02-15',
    createdBy: 'Bộ Công Thương',
    createdAt: '2024-12-01',
    stats: {
      totalTargets: 500,
      totalTasks: 420,
      completedTasks: 280,
      progress: 67
    }
  },
  {
    id: 'KH-CD-HG-2025',
    name: 'Chuyên đề Chống hàng giả năm 2025',
    planType: 'thematic',
    quarter: 'Q2/2025',
    topic: 'Chống hàng giả',
    scope: 'Khu vực miền Nam',
    scopeLocation: 'Hà Nội, Đồng Nai, Bình Dương',
    responsibleUnit: 'Chi cục QLTT Hà Nội',
    objectives: 'Tổng kiểm tra, xử lý hàng giả, hàng nhái mạo tại khu vực miền Nam',
    status: 'approved',
    priority: 'high',
    startDate: '2025-05-01',
    endDate: '2025-08-31',
    createdBy: 'Nguyễn Hoàng',
    createdAt: '2025-04-10',
    stats: {
      totalTargets: 300,
      totalTasks: 0,
      completedTasks: 0,
      progress: 0
    }
  },
  {
    id: 'KH-CD-BVTD-2024',
    name: 'Chuyên đề Bảo vệ người tiêu dùng Black Friday 2024',
    planType: 'thematic',
    quarter: 'Q4/2024',
    topic: 'Bảo vệ quyền lợi người tiêu dùng',
    scope: 'Khu vực miền Bắc',
    scopeLocation: 'Hà Nội, Hải Phòng, Quảng Ninh',
    responsibleUnit: 'Chi cục QLTT Hà Nội',
    objectives: 'Giám sát hoạt động khuyến mãi, giảm giá dịp Black Friday',
    status: 'completed',
    priority: 'high',
    startDate: '2024-11-15',
    endDate: '2024-11-30',
    createdBy: 'Trần Văn Đức',
    createdAt: '2024-11-01',
    stats: {
      totalTargets: 180,
      totalTasks: 160,
      completedTasks: 160,
      progress: 100
    }
  },
  {
    id: 'KH-CD-MP-2025',
    name: 'Chuyên đề Mỹ phẩm nhập lậu năm 2025',
    planType: 'thematic',
    quarter: 'Q3/2025',
    topic: 'Chống bun lậu',
    scope: 'Các tỉnh biên giới',
    scopeLocation: 'Lạng Sơn, Quảng Ninh, An Giang',
    responsibleUnit: 'Tổng cục QLTT',
    objectives: 'Kiểm tra, xử lý mỹ phẩm nhập lậu tại các tỉnh biên giới',
    status: 'approved',
    priority: 'high',
    startDate: '2025-07-01',
    endDate: '2025-09-30',
    createdBy: 'Lê Văn Toàn',
    createdAt: '2025-06-15',
    stats: {
      totalTargets: 250,
      totalTasks: 0,
      completedTasks: 0,
      progress: 0
    }
  },
  {
    id: 'KH-CD-XD-2025',
    name: 'Chuyên đề Vật liệu xây dựng kém chất lượng',
    planType: 'thematic',
    quarter: 'Q2/2025',
    topic: 'Kiểm tra chất lượng hàng hóa',
    scope: 'Khu vực miền Trung',
    scopeLocation: 'Đà Nẵng, Huế, Quảng Nam',
    responsibleUnit: 'Chi cục QLTT Đà Nẵng',
    objectives: 'Kiểm tra chất lượng vật liệu xây dựng tại khu vực miền Trung',
    status: 'pending_approval',
    priority: 'medium',
    startDate: '2025-04-15',
    endDate: '2025-07-15',
    createdBy: 'Nguyễn Thị Mai',
    createdAt: '2025-03-28',
    stats: {
      totalTargets: 120,
      totalTasks: 0,
      completedTasks: 0,
      progress: 0
    }
  },
  {
    id: 'KH-CD-TP-2025',
    name: 'Chuyên đề Thực phẩm chức năng giả mạo',
    planType: 'thematic',
    quarter: 'Q3/2025',
    topic: 'An toàn thực phẩm',
    scope: 'Toàn quốc',
    scopeLocation: 'Toàn quốc',
    responsibleUnit: 'Tổng cục QLTT',
    objectives: 'Kiểm tra, xử lý thực phẩm chức năng giả mạo, không rõ nguồn gốc',
    status: 'draft',
    priority: 'high',
    startDate: '2025-08-01',
    endDate: '2025-10-31',
    createdBy: 'Phạm Văn Hùng',
    createdAt: '2025-07-10',
    stats: {
      totalTargets: 400,
      totalTasks: 0,
      completedTasks: 0,
      progress: 0
    }
  },
  {
    id: 'KH-CD-DT-2025',
    name: 'Chuyên đề Điện thoại, thiết bị điện tử nhập lậu',
    planType: 'thematic',
    quarter: 'Q4/2025',
    topic: 'Chống buôn lậu',
    scope: 'Thành phố lớn',
    scopeLocation: 'Hà Nội, Hà Nội',
    responsibleUnit: 'Tổng cục QLTT',
    objectives: 'Kiểm tra thiết bị điện tử nhập lậu tại các thành phố lớn',
    status: 'draft',
    priority: 'medium',
    startDate: '2025-10-01',
    endDate: '2025-12-31',
    createdBy: 'Đinh Văn Thành',
    createdAt: '2025-09-05',
    stats: {
      totalTargets: 200,
      totalTasks: 0,
      completedTasks: 0,
      progress: 0
    }
  },

  // Đột xuất - 6 plans
  {
    id: 'KH-DX-COVID-VT',
    name: 'Kiểm tra đột xuất kit test Covid giả - Vũng Tàu',
    planType: 'urgent',
    quarter: 'N/A',
    topic: 'Chống hàng giả',
    scope: 'Vũng Tàu',
    scopeLocation: 'Bà Rịa - Vũng Tàu',
    responsibleUnit: 'Chi cục QLTT Bà Rịa - Vũng Tàu',
    objectives: 'Kiểm tra đột xuất sau phản ánh kit test Covid giả tại các nhà thuốc',
    status: 'active',
    priority: 'critical',
    startDate: '2025-01-20',
    endDate: '2025-01-25',
    createdBy: 'Lê Thị Hương',
    createdAt: '2025-01-20',
    stats: {
      totalTargets: 25,
      totalTasks: 18,
      completedTasks: 12,
      progress: 67
    }
  },
  {
    id: 'KH-DX-RUU-HN',
    name: 'Kiểm tra đột xuất rượu nghi giả tại Hà Nội',
    planType: 'urgent',
    quarter: 'N/A',
    topic: 'Chống hàng giả',
    scope: 'Hà Nội',
    scopeLocation: 'Hà Nội',
    responsibleUnit: 'Chi cục QLTT Hà Nội',
    objectives: 'Kiểm tra đột xuất các cơ sở kinh doanh rượu nghi giả sau phản ánh',
    status: 'completed',
    priority: 'high',
    startDate: '2025-01-10',
    endDate: '2025-01-12',
    createdBy: 'Nguyễn Văn An',
    createdAt: '2025-01-10',
    stats: {
      totalTargets: 15,
      totalTasks: 12,
      completedTasks: 12,
      progress: 100
    }
  },
  {
    id: 'KH-DX-SUATRE-DN',
    name: 'Kim tra đột xuất sữa trẻ em kém chất lượng - Đồng Nai',
    planType: 'urgent',
    quarter: 'N/A',
    topic: 'An toàn thực phẩm',
    scope: 'Đồng Nai',
    scopeLocation: 'Đồng Nai',
    responsibleUnit: 'Chi cục QLTT Đồng Nai',
    objectives: 'Kiểm tra đột xuất sữa trẻ em kém chất lượng tại các siêu thị, cửa hàng',
    status: 'cancelled',
    priority: 'high',
    startDate: '2024-12-15',
    endDate: '2024-12-18',
    createdBy: 'Võ Văn Hải',
    createdAt: '2024-12-15',
    stats: {
      totalTargets: 20,
      totalTasks: 8,
      completedTasks: 0,
      progress: 0
    }
  },
  {
    id: 'KH-DX-XUONGHEO-CT',
    name: 'Kiểm tra đột xuất xương heo nhiễm độc - Cần Thơ',
    planType: 'urgent',
    quarter: 'N/A',
    topic: 'An toàn thực phẩm',
    scope: 'Cần Thơ',
    scopeLocation: 'Cần Thơ',
    responsibleUnit: 'Chi cục QLTT Cần Thơ',
    objectives: 'Kiểm tra nguồn gốc xương heo nghi nhiễm độc tại chợ đầu mối',
    status: 'draft',
    priority: 'critical',
    startDate: '2025-01-22',
    endDate: '2025-01-24',
    createdBy: 'Lý Thanh Hằng',
    createdAt: '2025-01-22',
    stats: {
      totalTargets: 12,
      totalTasks: 0,
      completedTasks: 0,
      progress: 0
    }
  },
  {
    id: 'KH-DX-GIAYDEP-HP',
    name: 'Kiểm tra đột xuất giày dép nhái thương hiệu - Hải Phòng',
    planType: 'urgent',
    quarter: 'N/A',
    topic: 'Chống hàng giả',
    scope: 'Hải Phòng',
    scopeLocation: 'Hải Phòng',
    responsibleUnit: 'Chi cục QLTT Hải Phòng',
    objectives: 'Xử lý cơ sở sản xuất giày dép nhái thương hiệu nổi tiếng',
    status: 'draft',
    priority: 'medium',
    startDate: '2025-01-25',
    endDate: '2025-01-27',
    createdBy: 'Đặng Văn Cường',
    createdAt: '2025-01-24',
    stats: {
      totalTargets: 8,
      totalTasks: 0,
      completedTasks: 0,
      progress: 0
    }
  },
  {
    id: 'KH-DX-THUCPHAM-BD',
    name: 'Kiểm tra đột xuất thực phẩm hết hạn tại siêu thị - Bình Dương',
    planType: 'urgent',
    quarter: 'N/A',
    topic: 'An toàn thực phẩm',
    scope: 'Bình Dương',
    scopeLocation: 'Bình Dương',
    responsibleUnit: 'Chi cục QLTT Bình Dương',
    objectives: 'Kiểm tra đột xuất siêu thị bán thực phẩm hết hạn sử dụng',
    status: 'draft',
    priority: 'medium',
    startDate: '2025-01-26',
    endDate: '2025-01-28',
    createdBy: 'Hoàng Minh Đức',
    createdAt: '2025-01-25',
    stats: {
      totalTargets: 10,
      totalTasks: 0,
      completedTasks: 0,
      progress: 0
    }
  }
];

// Mock Targets
export const mockTargets: Target[] = [
  {
    id: 'TG-001',
    planId: 'KH-2026-Q1-001',
    type: 'STORE',
    name: 'Chợ Bến Thành - Quầy rau củ A',
    priority: 'high',
    location: {
      address: 'Chợ Bến Thành, Lê Lợi, Phường Bến Thành',
      district: 'Phường 1',
      lat: 10.7719,
      lng: 106.6981
    },
    tags: ['Nông sản', 'Chợ truyền thống'],
    notes: 'Phát hiện nhiều rau không rõ nguồn gốc trong đợt kiểm tra trước',
    converted: true
  },
  {
    id: 'TG-002',
    planId: 'KH-2026-Q1-001',
    type: 'STORE',
    name: 'Siêu thị CoopMart Nguyễn Đình Chiểu',
    priority: 'medium',
    location: {
      address: '189B Nguyễn Đình Chiểu, Phường 6',
      district: 'Phường 3',
      lat: 10.7797,
      lng: 106.6919
    },
    tags: ['Siêu thị', 'Nông sản'],
    notes: '',
    converted: false
  },
  {
    id: 'TG-003',
    planId: 'KH-2026-Q1-001',
    type: 'LEAD',
    name: 'Cơ sở bán rau quả không rõ nguồn gốc',
    priority: 'critical',
    location: {
      address: '45 Nguyễn Trãi, Phường Nguyễn Cư Trinh',
      district: 'Phường 1',
      lat: 10.7629,
      lng: 106.6881
    },
    tags: ['Đầu mối nghi vấn', 'Rủi ro cao'],
    notes: 'Phản ánh từ người dân về nguồn gốc rau quả không rõ ràng',
    converted: false
  },
  {
    id: 'TG-004',
    planId: 'KH-2026-Q1-001',
    type: 'RISK_ZONE',
    name: 'Khu vực chợ đầu mối Hóc Môn',
    priority: 'high',
    location: {
      address: 'Khu vực chợ đầu mối, Xã Hóc Môn',
      district: 'Xã Hóc Môn',
      lat: 10.8821,
      lng: 106.5927
    },
    tags: ['Vùng rủi ro', 'Cần giám sát'],
    notes: 'Khu vực tập trung nhiều cơ sở buôn bán nông sản',
    converted: true
  }
];

// Mock Tasks
export const mockTasks: Task[] = [
  {
    id: 'TASK-001',
    planId: 'KH-2026-Q1-001',
    targetId: 'TG-001',
    title: 'Kiểm tra nguồn gốc rau củ tại Chợ Bến Thành',
    description: 'Kiểm tra hồ sơ chứng từ, nguồn gốc xuất xứ của rau củ tại quầy A',
    status: 'in_progress',
    priority: 'high',
    assignee: {
      id: 'U001',
      name: 'Phạm Văn Minh',
      team: 'Đội 1 - Phường 1'
    },
    assignedBy: {
      id: 'U100',
      name: 'Nguyễn Văn A'
    },
    dueDate: '2026-01-25',
    sla: {
      status: 'on_track',
      hoursRemaining: 48,
      totalHours: 120
    },
    checklist: [
      { id: 'CL-001', label: 'Kiểm tra giấy phép kinh doanh', required: true, completed: true },
      { id: 'CL-002', label: 'Xác minh hóa đơn nhập hàng', required: true, completed: true },
      { id: 'CL-003', label: 'Lấy mẫu sản phẩm', required: false, completed: false },
      { id: 'CL-004', label: 'Chụp ảnh hiện trường', required: true, completed: true },
      { id: 'CL-005', label: 'Lập biên bản', required: true, completed: false }
    ],
    evidence: ['EV-2026-001', 'EV-2026-002'],
    createdAt: '2026-01-15T08:00:00',
    updatedAt: '2026-01-18T14:30:00'
  },
  {
    id: 'TASK-002',
    planId: 'KH-2026-Q1-001',
    targetId: 'TG-004',
    title: 'Giám sát khu vực chợ đầu mối Hóc Môn',
    description: 'Tuần tra và giám sát các hoạt động buôn bán tại khu vực chợ đầu mối',
    status: 'not_started',
    priority: 'medium',
    assignee: {
      id: 'U002',
      name: 'Trần Th Lan',
      team: 'Đội 2 - Hóc Môn'
    },
    assignedBy: {
      id: 'U100',
      name: 'Nguyễn Văn A'
    },
    dueDate: '2026-01-28',
    sla: {
      status: 'at_risk',
      hoursRemaining: 96,
      totalHours: 240
    },
    checklist: [
      { id: 'CL-006', label: 'Khảo sát khu vực', required: true, completed: false },
      { id: 'CL-007', label: 'Phỏng vấn tiểu thương', required: false, completed: false },
      { id: 'CL-008', label: 'Ghi nhận vi phạm (nếu có)', required: true, completed: false },
      { id: 'CL-009', label: 'Báo cáo tình hình', required: true, completed: false }
    ],
    evidence: [],
    createdAt: '2026-01-16T09:00:00',
    updatedAt: '2026-01-16T09:00:00'
  },
  {
    id: 'TASK-003',
    planId: 'KH-2026-Q1-001',
    targetId: 'TG-003',
    title: 'Xác minh đầu mối nghi vấn tại Nguyễn Trãi',
    description: 'Kiểm tra cơ sở bán rau quả có dấu hiệu vi phạm',
    status: 'in_progress',
    priority: 'critical',
    assignee: {
      id: 'U003',
      name: 'Lê Hoàng Nam',
      team: 'Đội 1 - Phường 1'
    },
    assignedBy: {
      id: 'U100',
      name: 'Nguyễn Văn A'
    },
    dueDate: '2026-01-20',
    sla: {
      status: 'overdue',
      hoursRemaining: -24,
      totalHours: 72
    },
    checklist: [
      { id: 'CL-010', label: 'Xác minh thông tin phản ánh', required: true, completed: true },
      { id: 'CL-011', label: 'Kiểm tra đột xuất', required: true, completed: false },
      { id: 'CL-012', label: 'Thu thập bằng chứng', required: true, completed: false }
    ],
    evidence: [],
    createdAt: '2026-01-12T10:00:00',
    updatedAt: '2026-01-18T16:00:00'
  },
  {
    id: 'TASK-004',
    planId: 'KH-2026-Q1-001',
    title: 'Kiểm tra định kỳ siêu thị CoopMart',
    description: 'Kiểm tra vệ sinh an toàn thực phẩm và nguồn gốc xuất xứ',
    status: 'completed',
    priority: 'medium',
    assignee: {
      id: 'U004',
      name: 'Võ Thị Mai',
      team: 'Đội 3 - Phường 3'
    },
    assignedBy: {
      id: 'U100',
      name: 'Nguyễn Văn A'
    },
    dueDate: '2026-01-18',
    sla: {
      status: 'on_track',
      hoursRemaining: 0,
      totalHours: 96
    },
    checklist: [
      { id: 'CL-013', label: 'Kiểm tra khu vực bán hàng', required: true, completed: true },
      { id: 'CL-014', label: 'Xem hồ sơ nhập hàng', required: true, completed: true },
      { id: 'CL-015', label: 'Lấy mẫu kiểm nghiệm', required: false, completed: true },
      { id: 'CL-016', label: 'Lập biên bản', required: true, completed: true }
    ],
    evidence: ['EV-2026-010', 'EV-2026-011', 'EV-2026-012'],
    createdAt: '2026-01-14T08:00:00',
    updatedAt: '2026-01-18T17:00:00'
  },
  {
    id: 'TASK-005',
    planId: 'KH-2026-Q1-001',
    title: 'Lấy mẫu kiểm nghiệm rau củ tại chợ',
    description: 'Lấy mẫu rau củ để kiểm nghiệm tồn dư hóa chất bảo vệ thực vật',
    status: 'completed',
    priority: 'high',
    assignee: {
      id: 'U005',
      name: 'Đặng Văn Hùng',
      team: 'Đội 1 - Phường 1'
    },
    assignedBy: {
      id: 'U100',
      name: 'Nguyễn Văn A'
    },
    dueDate: '2026-01-22',
    sla: {
      status: 'on_track',
      hoursRemaining: 72,
      totalHours: 120
    },
    checklist: [
      { id: 'CL-017', label: 'Chuẩn bị dụng cụ lấy mẫu', required: true, completed: true },
      { id: 'CL-018', label: 'Lấy mẫu theo quy trình', required: true, completed: true },
      { id: 'CL-019', label: 'Gửi mẫu kiểm nghiệm', required: true, completed: true },
      { id: 'CL-020', label: 'Nhận kết quả', required: true, completed: true }
    ],
    evidence: ['EV-2026-020', 'EV-2026-021'],
    createdAt: '2026-01-15T07:00:00',
    updatedAt: '2026-01-19T10:00:00'
  },
  {
    id: 'TASK-006',
    planId: 'KH-2026-Q1-001',
    title: 'Soát xét hồ sơ nhập khẩu trái cây',
    description: 'Kiểm tra hồ sơ xuất xứ và chất lượng trái cây nhập khẩu',
    status: 'closed',
    priority: 'low',
    assignee: {
      id: 'U006',
      name: 'Hoàng Thị Thu',
      team: 'Đội 2 - Hóc Môn'
    },
    assignedBy: {
      id: 'U100',
      name: 'Nguyễn Văn A'
    },
    dueDate: '2026-01-16',
    sla: {
      status: 'on_track',
      hoursRemaining: 0,
      totalHours: 96
    },
    checklist: [
      { id: 'CL-021', label: 'Thu thập hồ sơ', required: true, completed: true },
      { id: 'CL-022', label: 'Đối chiếu chứng từ', required: true, completed: true },
      { id: 'CL-023', label: 'Lập báo cáo', required: true, completed: true }
    ],
    evidence: ['EV-2026-030'],
    createdAt: '2026-01-12T09:00:00',
    updatedAt: '2026-01-16T16:00:00'
  },
  {
    id: 'TASK-007',
    planId: 'KH-2026-Q1-001',
    title: 'Giám sát hoạt động buôn bán rau quả',
    description: 'Tuần tra và ghi nhận tình hình buôn bán tại khu vực chợ đầu mối',
    status: 'in_progress',
    priority: 'medium',
    assignee: {
      id: 'U002',
      name: 'Trần Thị Lan',
      team: 'Đội 2 - Hóc Môn'
    },
    assignedBy: {
      id: 'U100',
      name: 'Nguyễn Văn A'
    },
    dueDate: '2026-01-26',
    sla: {
      status: 'on_track',
      hoursRemaining: 120,
      totalHours: 240
    },
    checklist: [
      { id: 'CL-024', label: 'Lập lộ trình tuần tra', required: true, completed: true },
      { id: 'CL-025', label: 'Thực hiện tuần tra', required: true, completed: false },
      { id: 'CL-026', label: 'Ghi nhận vi phạm', required: false, completed: false }
    ],
    evidence: [],
    createdAt: '2026-01-17T08:00:00',
    updatedAt: '2026-01-18T11:00:00'
  },
  {
    id: 'TASK-008',
    planId: 'KH-2026-Q1-001',
    title: 'Phối hợp với công an xử lý vi phạm',
    description: 'Phối hợp lực lượng công an xử lý cơ sở vi phạm nghiêm trọng',
    status: 'not_started',
    priority: 'critical',
    assignee: {
      id: 'U003',
      name: 'Lê Hoàng Nam',
      team: 'Đội 1 - Phường 1'
    },
    assignedBy: {
      id: 'U100',
      name: 'Nguyễn Văn A'
    },
    dueDate: '2026-01-30',
    sla: {
      status: 'at_risk',
      hoursRemaining: 168,
      totalHours: 240
    },
    checklist: [
      { id: 'CL-027', label: 'Liên hệ công an phường', required: true, completed: false },
      { id: 'CL-028', label: 'Lập kế hoạch kiểm tra', required: true, completed: false },
      { id: 'CL-029', label: 'Thực hiện kiểm tra', required: true, completed: false },
      { id: 'CL-030', label: 'Lập biên bản xử phạt', required: true, completed: false }
    ],
    evidence: [],
    createdAt: '2026-01-18T14:00:00',
    updatedAt: '2026-01-18T14:00:00'
  }
];

// Provinces/Districts for scope selection
export const vietnamProvinces = [
  { code: '79', name: 'TP. Hồ Chí Minh' }
];

export const hcmDistricts = [
  { code: '760', name: 'Phường 1' },
  { code: '761', name: 'Phường 2' },
  { code: '762', name: 'Phường 3' },
  { code: '763', name: 'Phường 4' },
  { code: '764', name: 'Phường 5' },
  { code: '765', name: 'Phường 6' },
  { code: '766', name: 'Phường 7' },
  { code: '767', name: 'Phường 8' },
  { code: '768', name: 'Phường 9' },
  { code: '769', name: 'Phường 10' },
  { code: '770', name: 'Phường 11' },
  { code: '771', name: 'Phường 12' },
  { code: '772', name: 'Phường Bình Thạnh' },
  { code: '773', name: 'Phường Tân Bình' },
  { code: '774', name: 'Phường Phú Nhuận' },
  { code: '783', name: 'Xã Hóc Môn' },
  { code: '784', name: 'Xã Củ Chi' }
];

// Topics
export const planTopics = [
  'An toàn thực phẩm',
  'Chống hàng giả',
  'Kiểm tra thị trường nông sản',
  'Bảo vệ quyền lợi người tiêu dùng',
  'Quản lý giá cả',
  'Kiểm tra chất lượng hàng hóa',
  'Kiểm tra xuất xứ hàng hóa'
];

// Teams/Units
export const teams = [
  { id: 'TEAM-Q1-01', name: 'Đội 1 - Phường 1', capacity: 5 },
  { id: 'TEAM-Q1-02', name: 'Đội 2 - Phường 1', capacity: 4 },
  { id: 'TEAM-Q3-01', name: 'Đội 1 - Phường 3', capacity: 6 },
  { id: 'TEAM-Q5-01', name: 'Đội 1 - Phường 5', capacity: 5 },
  { id: 'TEAM-HM-01', name: 'Đội 1 - Hóc Môn', capacity: 4 }
];

// SLA Policies
export const slaPolicies = [
  { id: 'SLA-STANDARD', name: 'Tiêu chuẩn (5 ngày làm việc)', hours: 120 },
  { id: 'SLA-URGENT', name: 'Khẩn cấp (3 ngày làm việc)', hours: 72 },
  { id: 'SLA-ROUTINE', name: 'Thường xuyên (10 ngày làm việc)', hours: 240 }
];

// Merchants (Đối tượng kiểm tra)
export interface Merchant {
  id: string;
  planId: string;
  name: string;
  taxCode: string;
  address: string;
  industry: string;
  estimatedDate: string;
}

// Generate merchants for all plans
const merchantNames = [
  'Merchant A', 'Merchant B', 'Merchant C', 'Merchant D', 'Merchant E',
  'Merchant F', 'Merchant G', 'Merchant H', 'Merchant I', 'Merchant J',
  'Merchant K', 'Merchant L', 'Merchant M', 'Merchant N', 'Merchant O',
  'Merchant P', 'Merchant Q', 'Merchant R', 'Merchant S', 'Merchant T'
];

const industries = ['Mỹ phẩm', 'Thực phẩm', 'Điện tử', 'Dược phẩm', 'Dân dụng'];
const addresses = [
  'Hà Nội - Phường Hàng Bài',
  'Hà Nội - Phường 1',
  'Đà Nẵng - Phường Hải Châu',
  'Hải Phòng - Phường Lê Chân',
  'Cần Thơ - Phường Ninh Kiều'
];

export const mockMerchants: Merchant[] = mockPlans.flatMap((plan, planIndex) => {
  const merchantCount = Math.floor(Math.random() * 3) + 3; // 3-5 merchants per plan
  return Array.from({ length: merchantCount }, (_, i) => {
    const globalIndex = planIndex * 5 + i;
    return {
      id: `MCH-${String(globalIndex + 1).padStart(4, '0')}`,
      planId: plan.id,
      name: merchantNames[globalIndex % merchantNames.length],
      taxCode: `${Math.floor(Math.random() * 900000000) + 100000000}`,
      address: addresses[globalIndex % addresses.length],
      industry: industries[globalIndex % industries.length],
      estimatedDate: `${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}/01/2025`
    };
  });
});

// Inspection Rounds (Đợt kiểm tra)
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

export interface InspectionRound {
  id: string;
  name: string;
  code: string; // Mã đợt kiểm tra
  planId: string; // Liên kết với kế hoạch
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
  description?: string;
}

const units = [
  'Chi cục QLTT Phường 1',
  'Chi cục QLTT Phường 3',
  'Chi cục QLTT Phường 5',
  'Chi cục QLTT Phường 7',
  'Chi cục QLTT Phường 10',
  'Chi cục QLTT Bình Thạnh',
  'Chi cục QLTT Tân Bình',
  'Chi cục QLTT Thủ Đức'
];

const inspectorNames = [
  'Trần Văn A', 'Nguyễn Thị B', 'Lê Văn C', 'Phạm Minh D',
  'Hoàng Thị E', 'Đỗ Văn F', 'Bùi Thị G', 'Võ Văn H',
  'Mai Thị I', 'Trương Văn K', 'Lý Văn L', 'Phan Thị M',
  'Đinh Văn N', 'Hồ Văn O', 'Đặng Thị P', 'Chu Văn Q'
];

const roundTemplates = [
  { name: 'Kiểm tra cơ sở kinh doanh thực phẩm', targets: 25 },
  { name: 'Kiểm tra chuỗi cửa hàng tiện lợi', targets: 30 },
  { name: 'Kiểm tra siêu thị và chợ truyền thống', targets: 20 },
  { name: 'Kiểm tra cơ sở sản xuất chế biến', targets: 15 },
  { name: 'Kiểm tra đột xuất theo khiếu nại', targets: 8 },
  { name: 'Tái kiểm tra cơ sở vi phạm', targets: 5 },
  { name: 'Kiểm tra cơ sở nhập khẩu', targets: 12 },
  { name: 'Kiểm tra cơ sở phân phối', targets: 18 }
];

export const mockInspectionRounds: InspectionRound[] = mockPlans.flatMap((plan, planIndex) => {
  const roundCount = Math.floor(Math.random() * 4) + 3; // 3-6 rounds per plan
  const planYear = plan.id.includes('2026') ? 2026 : 2025;
  const planQuarter = plan.quarter.includes('Q1') ? 1 : plan.quarter.includes('Q2') ? 2 : plan.quarter.includes('Q3') ? 3 : 4;
  
  return Array.from({ length: roundCount }, (_, i) => {
    const template = roundTemplates[i % roundTemplates.length];
    const unit = units[i % units.length];
    const teamSize = Math.floor(Math.random() * 3) + 2; // 2-4 members
    const totalTargets = template.targets + Math.floor(Math.random() * 10) - 5;
    
    // Determine status based on round index
    let status: InspectionRoundStatus;
    let type: InspectionType;
    let inspectedTargets = 0;
    let passedCount, warningCount, violationCount;
    let actualStartDate, actualEndDate;
    
    if (i === 0) {
      status = 'in_progress';
      type = 'routine';
      inspectedTargets = Math.floor(totalTargets * 0.6);
      passedCount = Math.floor(inspectedTargets * 0.7);
      warningCount = Math.floor(inspectedTargets * 0.2);
      violationCount = inspectedTargets - passedCount - warningCount;
      actualStartDate = `${planYear}-${String(planQuarter * 3 - 2).padStart(2, '0')}-${String(5 + i * 2).padStart(2, '0')}`;
    } else if (i === 1) {
      status = 'approved';
      type = 'routine';
      inspectedTargets = 0;
    } else if (i === 2) {
      status = 'completed';
      type = 'routine';
      inspectedTargets = totalTargets;
      passedCount = Math.floor(totalTargets * 0.65);
      warningCount = Math.floor(totalTargets * 0.25);
      violationCount = totalTargets - passedCount - warningCount;
      actualStartDate = `${planYear}-${String(planQuarter * 3 - 2).padStart(2, '0')}-${String(5 + i * 2).padStart(2, '0')}`;
      actualEndDate = `${planYear}-${String(planQuarter * 3 - 2).padStart(2, '0')}-${String(10 + i * 2).padStart(2, '0')}`;
    } else if (i === 3) {
      status = 'active';
      type = 'routine';
      inspectedTargets = totalTargets;
      passedCount = Math.floor(totalTargets * 0.7);
      warningCount = Math.floor(totalTargets * 0.2);
      violationCount = totalTargets - passedCount - warningCount;
      actualStartDate = `${planYear}-${String(planQuarter * 3 - 2).padStart(2, '0')}-${String(8 + i * 2).padStart(2, '0')}`;
      actualEndDate = `${planYear}-${String(planQuarter * 3 - 2).padStart(2, '0')}-${String(13 + i * 2).padStart(2, '0')}`;
    } else if (i === 4) {
      status = 'draft';
      type = i % 2 === 0 ? 'sudden' : 'followup';
      inspectedTargets = 0;
    } else {
      status = 'cancelled';
      type = 'routine';
      inspectedTargets = 0;
    }
    
    const startMonth = planQuarter * 3 - 2;
    const startDay = 5 + i * 3;
    const endDay = startDay + 5;
    
    // Generate team members
    const team: InspectionTeamMember[] = Array.from({ length: teamSize }, (_, idx) => ({
      id: `U${String(planIndex * 10 + i * teamSize + idx + 1).padStart(3, '0')}`,
      name: inspectorNames[(planIndex * 10 + i * teamSize + idx) % inspectorNames.length],
      role: idx === 0 ? 'leader' as const : (idx === teamSize - 1 && teamSize > 2 ? 'expert' as const : 'member' as const)
    }));
    
    return {
      id: `DKT-${planYear}-${String(planQuarter * 3 - 2).padStart(2, '0')}-${String(planIndex * 10 + i + 1).padStart(3, '0')}`,
      code: `DKT-${planYear}-${String(planQuarter * 3 - 2).padStart(2, '0')}-${String(planIndex * 10 + i + 1).padStart(3, '0')}`,
      name: `${template.name} - ${unit.replace('Chi cục QLTT ', '')}`,
      description: `${plan.topic} - ${plan.quarter}`,
      planId: plan.id,
      type,
      status,
      startDate: `${planYear}-${String(startMonth).padStart(2, '0')}-${String(startDay).padStart(2, '0')}`,
      endDate: `${planYear}-${String(startMonth).padStart(2, '0')}-${String(endDay).padStart(2, '0')}`,
      actualStartDate,
      actualEndDate,
      leadUnit: unit,
      team: status === 'draft' ? [] : team,
      teamSize: status === 'draft' ? 0 : teamSize,
      totalTargets,
      inspectedTargets,
      passedCount,
      warningCount,
      violationCount,
      createdBy: inspectorNames[planIndex % inspectorNames.length],
      createdAt: `${planYear}-${String(startMonth).padStart(2, '0')}-${String(Math.max(1, startDay - 3)).padStart(2, '0')}`,
      notes: status === 'draft' ? 'Đang soạn thảo kế hoạch' : 
             status === 'cancelled' ? 'Hủy do điều chỉnh kế hoạch' :
             status === 'in_progress' ? 'Đang tiến hành kiểm tra theo kế hoạch' :
             undefined
    };
  });
});

// Inspection Sessions (Phiên kiểm tra)
export interface InspectionSession {
  id: string;
  planId: string;
  merchantName: string;
  location: string;
  inspector: string;
  inspectionDate: string;
  status: 'completed' | 'scheduled' | 'in_progress';
}

const statuses: ('completed' | 'scheduled' | 'in_progress')[] = ['completed', 'scheduled', 'in_progress'];
const inspectors = [
  'Thanh tra viên 1', 'Thanh tra viên 2', 'Thanh tra viên 3',
  'Thanh tra viên 4', 'Thanh tra viên 5', 'Thanh tra viên 6'
];

export const mockInspectionSessions: InspectionSession[] = mockPlans.flatMap((plan, planIndex) => {
  const sessionCount = Math.floor(Math.random() * 8) + 5; // 5-12 sessions per plan
  const planMerchants = mockMerchants.filter(m => m.planId === plan.id);
  
  return Array.from({ length: sessionCount }, (_, i) => {
    const globalIndex = planIndex * 10 + i;
    const merchant = planMerchants[i % planMerchants.length];
    
    return {
      id: `PT-2025/${String(globalIndex + 1).padStart(4, '0')}`,
      planId: plan.id,
      merchantName: merchant?.name || `Merchant ${i + 1}`,
      location: addresses[globalIndex % addresses.length].split(' - ')[0],
      inspector: inspectors[globalIndex % inspectors.length],
      inspectionDate: `${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}/01/2025`,
      status: statuses[globalIndex % statuses.length]
    };
  });
});

// History (Lịch sử)
export interface HistoryEvent {
  id: string;
  planId: string;
  eventType: 'created' | 'submitted' | 'approved';
  title: string;
  description: string;
  user: string;
  timestamp: string;
}

const users = [
  'Nguyễn Văn An', 'Trần Thị Bình', 'Lê Văn Cường',
  'Phạm Thị Dung', 'Hoàng Văn Em', 'Vũ Thị Phương'
];

export const mockHistoryEvents: HistoryEvent[] = mockPlans.flatMap((plan, planIndex) => {
  const baseDate = new Date('2024-12-15');
  baseDate.setDate(baseDate.getDate() + planIndex);
  
  return [
    {
      id: `HE-${String(planIndex * 3 + 1).padStart(3, '0')}`,
      planId: plan.id,
      eventType: 'created',
      title: 'Tạo kế hoạch',
      description: `Thời gian: ${plan.quarter}`,
      user: users[planIndex % users.length],
      timestamp: baseDate.toISOString()
    },
    {
      id: `HE-${String(planIndex * 3 + 2).padStart(3, '0')}`,
      planId: plan.id,
      eventType: 'submitted',
      title: 'Trình duyệt',
      description: 'Đã trình lãnh đạo',
      user: users[planIndex % users.length],
      timestamp: new Date(baseDate.getTime() + 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: `HE-${String(planIndex * 3 + 3).padStart(3, '0')}`,
      planId: plan.id,
      eventType: 'approved',
      title: 'Phê duyệt',
      description: 'Đã phê duyệt kế hoạch',
      user: users[(planIndex + 1) % users.length],
      timestamp: new Date(baseDate.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];
});
