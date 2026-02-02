
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
  code: string;
  campaign_code?: string;
  planId?: string;
  planCode?: string;
  planName?: string;
  quarter?: string;
  type: InspectionType;
  status: InspectionRoundStatus;
  provinceId?: string;
  wardId?: string;
  departmentId?: string;
  startDate: string;
  endDate: string;
  actualStartDate?: string;
  actualEndDate?: string;
  leadUnit: string;
  leadUnitId?: string;
  teamLeader?: string;
  team: InspectionTeamMember[];
  teamSize: number;
  totalTargets: number;
  inspectedTargets: number;
  passedCount?: number;
  warningCount?: number;
  violationCount?: number;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  createdBy: string;
  createdById?: string;
  createdAt: string;
  notes?: string;
  formTemplate?: string;
  scope?: string;
  scopeDetails?: {
    provinces: string[];
    districts: string[];
    wards: string[];
  };
  stats?: {
    totalSessions: number;
    completedSessions: number;
    storesInspected: number;
    storesPlanned: number;
    violationsFound: number;
    violationRate: number;
    progress: number;
  };
  attachments?: any[];
}
