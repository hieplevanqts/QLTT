/**
 * Mock data for Inspection Tasks (Nhiệm vụ)
 */

export type TaskStatus = 
  | 'not_started'        // Chưa bắt đầu
  | 'in_progress'        // Đang thực hiện
  | 'pending_approval'   // Chờ duyệt
  | 'completed'          // Hoàn thành
  | 'cancelled'          // Đã hủy
  | 'closed';            // Đã đóng

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface TaskAssignee {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
}

export interface InspectionTask {
  id: string;
  code: string; // Mã nhiệm vụ
  roundId: string; // Liên kết với đợt kiểm tra
  roundName: string;
  planId?: string; // Liên kết với kế hoạch (optional)
  planName?: string;
  
  // Task info
  title: string;
  description: string;
  targetName: string; // Tên cơ sở/đối tượng kiểm tra
  targetCode?: string; // Mã cơ sở
  targetAddress: string;
  
  // Assignment
  assignee: TaskAssignee;
  assignedBy: TaskAssignee;
  assignedDate: string;
  
  // Status & Priority
  status: TaskStatus;
  priority: TaskPriority;
  reopenReason?: string; // Lý do mở lại (nếu có)
  reopenedAt?: string; // Thời gian mở lại
  reopenedBy?: TaskAssignee; // Người mở lại
  
  // Timeline
  dueDate: string;
  startDate?: string;
  completedDate?: string;
  
  // Progress
  progress: number; // 0-100
  checklistTotal: number;
  checklistCompleted: number;
  
  // Tags
  tags?: string[];
  
  // Metadata
  createdAt?: string;
  updatedAt?: string;
}

// Generate mock tasks
export const mockInspectionTasks: InspectionTask[] = [
  // Tasks for ROUND-001 (Đợt kiểm tra định kỳ Q1/2025 - Hà Nội)
  {
    id: 'TASK-001',
    code: 'NV-2025/001',
    roundId: 'ROUND-001',
    roundName: 'Đợt kiểm tra định kỳ Q1/2025 - Hà Nội',
    planId: 'KH-I/2025-HN',
    planName: 'Kế hoạch kiểm tra định kỳ quý I/2025 - Hà Nội',
    title: 'Kiểm tra Cơ sở sản xuất mỹ phẩm ABC - 10/01/2025',
    description: 'Kiểm tra điều kiện sản xuất, nguồn gốc nguyên liệu, hồ sơ sản phẩm',
    targetName: 'Cơ sở sản xuất mỹ phẩm ABC',
    targetCode: 'CS-001',
    targetAddress: 'Số 10 Trần Đại Nghĩa, Hai Bà Trưng, Hà Nội',
    assignee: {
      id: 'U001',
      name: 'Nguyễn Văn An',
      role: 'Thanh tra viên'
    },
    assignedBy: {
      id: 'U100',
      name: 'Trần Thị Bình'
    },
    assignedDate: '2025-01-05',
    status: 'in_progress',
    priority: 'high',
    dueDate: '2025-01-28',
    startDate: '2025-01-10',
    progress: 65,
    checklistTotal: 12,
    checklistCompleted: 8,
    createdAt: '2025-01-05T08:00:00',
    updatedAt: '2025-01-20T14:30:00'
  },
  {
    id: 'TASK-002',
    code: 'NV-2025/002',
    roundId: 'ROUND-001',
    roundName: 'Đợt kiểm tra định kỳ Q1/2025 - Hà Nội',
    planId: 'KH-I/2025-HN',
    planName: 'Kế hoạch kiểm tra định kỳ quý I/2025 - Hà Nội',
    title: 'Kiểm tra Siêu thị BigC Thăng Long - 12/01/2025',
    description: 'Kiểm tra hàng hóa, giá cả, nguồn gốc xuất xứ',
    targetName: 'Siêu thị BigC Thăng Long',
    targetAddress: '222 Trần Duy Hưng, Cầu Giấy, Hà Nội',
    assignee: {
      id: 'U002',
      name: 'Lê Văn Cường',
      role: 'Thanh tra viên'
    },
    assignedBy: {
      id: 'U100',
      name: 'Trần Thị Bình'
    },
    assignedDate: '2025-01-06',
    status: 'completed',
    priority: 'medium',
    dueDate: '2025-01-25',
    startDate: '2025-01-12',
    completedDate: '2025-01-24',
    progress: 100,
    checklistTotal: 10,
    checklistCompleted: 10,
    createdAt: '2025-01-06T09:00:00',
    updatedAt: '2025-01-24T16:00:00'
  },
  {
    id: 'TASK-003',
    code: 'NV-2025/003',
    roundId: 'ROUND-001',
    roundName: 'Đợt kiểm tra định kỳ Q1/2025 - Hà Nội',
    planId: 'KH-I/2025-HN',
    planName: 'Kế hoạch kiểm tra định kỳ quý I/2025 - Hà Nội',
    title: 'Kiểm tra Cửa hàng thực phẩm XYZ - 15/01/2025',
    description: 'Kiểm tra ATVS thực phẩm, hạn sử dụng, nguồn gốc',
    targetName: 'Cửa hàng thực phẩm XYZ',
    targetAddress: '45 Láng Hạ, Đống Đa, Hà Nội',
    assignee: {
      id: 'U003',
      name: 'Phạm Thị Dung'
    },
    assignedBy: {
      id: 'U100',
      name: 'Trần Thị Bình'
    },
    assignedDate: '2025-01-07',
    status: 'completed',
    priority: 'high',
    dueDate: '2025-01-30',
    startDate: '2025-01-15',
    progress: 100,
    checklistTotal: 15,
    checklistCompleted: 15,
    createdAt: '2025-01-07T10:00:00',
    updatedAt: '2025-01-25T11:00:00'
  },
  {
    id: 'TASK-004',
    code: 'NV-2025/004',
    roundId: 'ROUND-001',
    roundName: 'Đợt kiểm tra định kỳ Q1/2025 - Hà Nội',
    planId: 'KH-I/2025-HN',
    planName: 'Kế hoạch kiểm tra định kỳ quý I/2025 - Hà Nội',
    title: 'Kiểm tra Nhà thuốc Hoàn Mỹ - 05/02/2025',
    description: 'Kiểm tra điều kiện bảo quản thuốc, nguồn gốc dược phẩm',
    targetName: 'Nhà thuốc Hoàn Mỹ',
    targetAddress: '78 Giải Phóng, Hai Bà Trưng, Hà Nội',
    assignee: {
      id: 'U004',
      name: 'Hoàng Văn Em'
    },
    assignedBy: {
      id: 'U100',
      name: 'Trần Thị Bình'
    },
    assignedDate: '2025-01-08',
    status: 'not_started',
    priority: 'medium',
    dueDate: '2025-02-05',
    progress: 0,
    checklistTotal: 8,
    checklistCompleted: 0,
    createdAt: '2025-01-08T08:30:00',
    updatedAt: '2025-01-08T08:30:00'
  },
  {
    id: 'TASK-005',
    code: 'NV-2025/005',
    roundId: 'ROUND-001',
    roundName: 'Đợt kiểm tra định kỳ Q1/2025 - Hà Nội',
    planId: 'KH-I/2025-HN',
    planName: 'Kế hoạch kiểm tra định kỳ quý I/2025 - Hà Nội',
    title: 'Kiểm tra Cửa hàng điện tử Mobile World - 18/01/2025',
    description: 'Kiểm tra nguồn gốc thiết bị, tem phiếu, bảo hành',
    targetName: 'Cửa hàng điện tử Mobile World',
    targetAddress: '123 Nguyễn Trãi, Thanh Xuân, Hà Nội',
    assignee: {
      id: 'U005',
      name: 'Vũ Thị Phương'
    },
    assignedBy: {
      id: 'U100',
      name: 'Trần Thị Bình'
    },
    assignedDate: '2025-01-10',
    status: 'in_progress',
    priority: 'urgent',
    dueDate: '2025-01-27',
    startDate: '2025-01-18',
    progress: 45,
    checklistTotal: 11,
    checklistCompleted: 5,
    createdAt: '2025-01-10T09:00:00',
    updatedAt: '2025-01-22T15:00:00'
  },

  // Tasks for ROUND-002 (Đợt kiểm tra thực phẩm Tết - TP.HCM)
  {
    id: 'TASK-006',
    code: 'NV-2025/006',
    roundId: 'ROUND-002',
    roundName: 'Đợt kiểm tra thực phẩm Tết - TP.HCM',
    planId: 'KH-CD-ATVSTP-2025',
    planName: 'Chuyên đề An toàn vệ sinh thực phẩm Tết Nguyên Đán 2025',
    title: 'Kiểm tra Chợ Bến Thành - 20/01/2025',
    description: 'Kiểm tra ATVS thực phẩm Tết tại chợ Bến Thành',
    targetName: 'Chợ Bến Thành',
    targetAddress: 'Lê Lợi, Phường Bến Thành, Quận 1, TP.HCM',
    assignee: {
      id: 'U006',
      name: 'Nguyễn Thị Hương'
    },
    assignedBy: {
      id: 'U101',
      name: 'Lê Văn Toàn'
    },
    assignedDate: '2025-01-12',
    status: 'in_progress',
    priority: 'urgent',
    dueDate: '2025-02-08',
    startDate: '2025-01-20',
    progress: 30,
    checklistTotal: 20,
    checklistCompleted: 6,
    createdAt: '2025-01-12T08:00:00',
    updatedAt: '2025-01-23T10:00:00'
  },
  {
    id: 'TASK-007',
    code: 'NV-2025/007',
    roundId: 'ROUND-002',
    roundName: 'Đợt kiểm tra thực phẩm Tết - TP.HCM',
    planId: 'KH-CD-ATVSTP-2025',
    planName: 'Chuyên đề An toàn vệ sinh thực phẩm Tết Nguyên Đán 2025',
    title: 'Kiểm tra Siêu thị CoopMart Nguyễn Đình Chiểu - 21/01/2025',
    description: 'Kiểm tra thực phẩm, bánh kẹo Tết',
    targetName: 'Siêu thị CoopMart Nguyễn Đình Chiểu',
    targetAddress: '189B Nguyễn Đình Chiểu, Quận 3, TP.HCM',
    assignee: {
      id: 'U007',
      name: 'Trần Văn Đức'
    },
    assignedBy: {
      id: 'U101',
      name: 'Lê Văn Toàn'
    },
    assignedDate: '2025-01-13',
    status: 'completed',
    priority: 'high',
    dueDate: '2025-02-05',
    startDate: '2025-01-21',
    completedDate: '2025-02-04',
    progress: 100,
    checklistTotal: 14,
    checklistCompleted: 14,
    createdAt: '2025-01-13T09:00:00',
    updatedAt: '2025-02-04T17:00:00'
  },

  // Tasks for ROUND-003 (Đợt kiểm tra mỹ phẩm - Đà Nẵng)
  {
    id: 'TASK-008',
    code: 'NV-2025/008',
    roundId: 'ROUND-003',
    roundName: 'Đợt kiểm tra mỹ phẩm - Đà Nẵng',
    planId: 'KH-CD-MP-2025',
    planName: 'Chuyên đề Mỹ phẩm nhập lậu năm 2025',
    title: 'Kiểm tra Cửa hàng mỹ phẩm Beauty Shop - 19/01/2025',
    description: 'Kiểm tra nguồn gốc mỹ phẩm, tem nhãn, hồ sơ nhập khẩu',
    targetName: 'Cửa hàng mỹ phẩm Beauty Shop',
    targetAddress: '45 Lê Duẩn, Hải Châu, Đà Nẵng',
    assignee: {
      id: 'U008',
      name: 'Võ Thị Lý'
    },
    assignedBy: {
      id: 'U102',
      name: 'Nguyễn Thị Mai'
    },
    assignedDate: '2025-01-14',
    status: 'in_progress',
    priority: 'high',
    dueDate: '2025-01-31',
    startDate: '2025-01-19',
    progress: 55,
    checklistTotal: 13,
    checklistCompleted: 7,
    createdAt: '2025-01-14T10:00:00',
    updatedAt: '2025-01-24T12:00:00'
  },

  // Tasks for ROUND-004 (Đợt kiểm tra đột xuất - Kit test Covid)
  {
    id: 'TASK-009',
    code: 'NV-2025/009',
    roundId: 'ROUND-004',
    roundName: 'Đợt kiểm tra đột xuất Kit test Covid - Vũng Tàu',
    planId: 'KH-DX-COVID-VT',
    planName: 'Kiểm tra đột xuất kit test Covid giả - Vũng Tàu',
    title: 'Kiểm tra Nhà thuốc Sài Gòn - 21/01/2025',
    description: 'Kiểm tra nguồn gốc kit test Covid, hóa đơn nhập hàng',
    targetName: 'Nhà thuốc Sài Gòn',
    targetAddress: '23 Trần Phú, Vũng Tàu',
    assignee: {
      id: 'U009',
      name: 'Lê Thị Hương'
    },
    assignedBy: {
      id: 'U103',
      name: 'Hoàng Minh Đức'
    },
    assignedDate: '2025-01-20',
    status: 'in_progress',
    priority: 'urgent',
    dueDate: '2025-01-25',
    startDate: '2025-01-21',
    progress: 70,
    checklistTotal: 6,
    checklistCompleted: 4,
    createdAt: '2025-01-20T08:00:00',
    updatedAt: '2025-01-23T16:00:00'
  },
  {
    id: 'TASK-010',
    code: 'NV-2025/010',
    roundId: 'ROUND-004',
    roundName: 'Đợt kiểm tra đột xuất Kit test Covid - Vũng Tàu',
    planId: 'KH-DX-COVID-VT',
    planName: 'Kiểm tra đột xuất kit test Covid giả - Vũng Tàu',
    title: 'Kiểm tra Nhà thuốc Long Châu - 21/01/2025',
    description: 'Kiểm tra đột xuất kit test Covid',
    targetName: 'Nhà thuốc Long Châu',
    targetAddress: '156 Lê Hồng Phong, Vũng Tàu',
    assignee: {
      id: 'U010',
      name: 'Đặng Văn Cường'
    },
    assignedBy: {
      id: 'U103',
      name: 'Hoàng Minh Đức'
    },
    assignedDate: '2025-01-20',
    status: 'completed',
    priority: 'urgent',
    dueDate: '2025-01-24',
    startDate: '2025-01-21',
    completedDate: '2025-01-23',
    progress: 100,
    checklistTotal: 6,
    checklistCompleted: 6,
    createdAt: '2025-01-20T09:00:00',
    updatedAt: '2025-01-23T18:00:00'
  },

  // Additional tasks for ROUND-005
  {
    id: 'TASK-011',
    code: 'NV-2025/011',
    roundId: 'ROUND-005',
    roundName: 'Đợt kiểm tra hàng giả - Bình Dương',
    title: 'Kiểm tra Cửa hàng giày dép ABC - 10/02/2025',
    description: 'Kiểm tra nguồn gốc giày dép, tem nhãn thương hiệu',
    targetName: 'Cửa hàng giày dép ABC',
    targetAddress: '89 Đại lộ Bình Dương, Thủ Dầu Một, Bình Dương',
    assignee: {
      id: 'U011',
      name: 'Phạm Văn Hùng'
    },
    assignedBy: {
      id: 'U104',
      name: 'Đinh Văn Thành'
    },
    assignedDate: '2025-01-15',
    status: 'not_started',
    priority: 'medium',
    dueDate: '2025-02-10',
    progress: 0,
    checklistTotal: 9,
    checklistCompleted: 0,
    createdAt: '2025-01-15T08:00:00',
    updatedAt: '2025-01-15T08:00:00'
  },
  {
    id: 'TASK-012',
    code: 'NV-2025/012',
    roundId: 'ROUND-005',
    roundName: 'Đợt kiểm tra hàng giả - Bình Dương',
    title: 'Kiểm tra Xưởng sản xuất túi xách XYZ - 22/01/2025',
    description: 'Kiểm tra cơ sở sản xuất túi xách nhái thương hiệu',
    targetName: 'Xưởng sản xuất túi xách XYZ',
    targetAddress: 'KCN Việt Nam Singapore, Bình Dương',
    assignee: {
      id: 'U012',
      name: 'Lý Thanh Hằng'
    },
    assignedBy: {
      id: 'U104',
      name: 'Đinh Văn Thành'
    },
    assignedDate: '2025-01-16',
    status: 'in_progress',
    priority: 'high',
    dueDate: '2025-02-08',
    startDate: '2025-01-22',
    progress: 25,
    checklistTotal: 16,
    checklistCompleted: 4,
    createdAt: '2025-01-16T09:00:00',
    updatedAt: '2025-01-24T11:00:00'
  },

  // Closed task
  {
    id: 'TASK-014',
    code: 'NV-2025/014',
    roundId: 'ROUND-002',
    roundName: 'Đợt kiểm tra thực phẩm Tết - TP.HCM',
    planId: 'KH-CD-ATVSTP-2025',
    planName: 'Chuyên đề An toàn vệ sinh thực phẩm Tết Nguyên Đán 2025',
    title: 'Kiểm tra Cửa hàng bánh kẹo Kinh Đô - 28/12/2024',
    description: 'Đã hoàn thành và đóng hồ sơ',
    targetName: 'Cửa hàng bánh kẹo Kinh Đô',
    targetAddress: '456 Nguyễn Văn Linh, Quận 7, TP.HCM',
    assignee: {
      id: 'U014',
      name: 'Trương Văn Khải'
    },
    assignedBy: {
      id: 'U101',
      name: 'Lê Văn Toàn'
    },
    assignedDate: '2024-12-20',
    status: 'closed',
    priority: 'low',
    dueDate: '2025-01-15',
    startDate: '2024-12-28',
    completedDate: '2025-01-10',
    progress: 100,
    checklistTotal: 12,
    checklistCompleted: 12,
    createdAt: '2024-12-20T08:00:00',
    updatedAt: '2025-01-12T16:00:00'
  },
];