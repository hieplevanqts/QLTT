// WEB-03 Lead & Risk - Core Data Types

// ========================================
// LEAD STATUS & LIFECYCLE
// ========================================
export type LeadStatus =
  | 'new'                 // Mới
  | 'in_verification'     // Đang xác minh
  | 'in_progress'         // Đang xử lý
  | 'resolved'            // Đã xử lý
  | 'rejected'            // Đã từ chối
  | 'cancelled';          // Đã hủy

export type LeadUrgency = 'low' | 'medium' | 'high' | 'critical';
export type LeadConfidence = 'low' | 'medium' | 'high';
export type RiskScope = 'point' | 'store' | 'zone' | 'topic';

// ========================================
// LEAD SOURCE
// ========================================
export type LeadSource =
  | 'app'           // Từ mobile app
  | 'hotline'       // Hotline 1800
  | 'import'        // Import hàng loạt
  | 'field'         // Hiện trường
  | 'tip'           // Nguồn tin ẩn danh
  | 'system'        // Tự động phát hiện
  | 'social';       // Mạng xã hội

// ========================================
// LEAD CATEGORY
// ========================================
export type LeadCategory =
  | 'counterfeit'       // Hàng giả
  | 'smuggling'         // Buôn lậu
  | 'illegal_trading'   // Kinh doanh bất hợp pháp
  | 'food_safety'       // An toàn thực phẩm
  | 'price_fraud'       // Gian lận giá cả
  | 'unlicensed'        // Không giấy phép
  | 'other';            // Khác

// ========================================
// LEAD INTERFACE
// ========================================
export interface Lead {
  id: string;
  code: string;                    // LEAD-2025-0001
  title: string;
  description: string;
  status: LeadStatus;
  urgency?: LeadUrgency;           // Optional - không bắt buộc
  confidence: LeadConfidence;
  source: LeadSource | string;     // Allow custom string sources
  category: LeadCategory | string; // Allow custom categories
  riskScope: RiskScope;
  
  // Location
  location: {
    lat: number;
    lng: number;
    address: string;
    ward?: string;
    district?: string;
    province: string;
  };
  
  // Store info (if linked)
  storeId?: string;
  storeName?: string;
  storeAddress?: string;
  storeType?: string;
  
  // Reporter info (optional if anonymous)
  reporterName?: string;
  reporterPhone?: string;
  reporterEmail?: string;
  
  // Assignment
  assignedTo?: {
    userId: string;
    userName: string;
    teamName: string;
  };
  assignedAt?: Date;
  
  // SLA
  sla: {
    deadline: Date;
    remainingHours: number;
    isOverdue: boolean;
  };
  
  // Metadata
  reportedBy?: string;
  reportedAt: Date;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Counts
  evidenceCount: number;
  relatedLeadsCount: number;
  activityCount: number;
  
  // Flags
  isDuplicate: boolean;
  isWatched: boolean;
  hasAlert: boolean;
}

// ========================================
// TRIAGE DECISION
// ========================================
export interface TriageDecision {
  leadId: string;
  decision: 'approve' | 'reject' | 'escalate' | 'request_info';
  urgency: LeadUrgency;
  confidence: LeadConfidence;
  category: LeadCategory;
  reason: string;
  tags?: string[];
  decidedBy: string;
  decidedAt: Date;
}

// ========================================
// ASSIGNMENT
// ========================================
export interface Assignment {
  leadId: string;
  assignedTo: {
    userId: string;
    userName: string;
    teamId: string;
    teamName: string;
  };
  assignedBy: string;
  assignedAt: Date;
  deadline: Date;
  priority: LeadUrgency;
  instructions?: string;
  slaHours: number;
}

// ========================================
// RISK PROFILE
// ========================================
export interface RiskProfile {
  entityId: string;            // Store ID / Zone ID
  entityType: 'store' | 'zone';
  entityName: string;
  
  riskScore: number;           // 0-100
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  
  // Statistics
  totalLeads: number;
  activeLeads: number;
  resolvedLeads: number;
  rejectedLeads: number;
  
  // Recent activity
  lastLeadDate: Date;
  recentCategories: LeadCategory[];
  
  // Trends
  trendDirection: 'increasing' | 'stable' | 'decreasing';
  monthOverMonthChange: number; // Percentage
  
  // Flags
  isWatchlisted: boolean;
  hasActiveAlert: boolean;
}

// ========================================
// HOTSPOT
// ========================================
export interface Hotspot {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
    radius: number; // meters
  };
  district: string;
  province: string;
  
  // Risk metrics
  riskScore: number;
  leadCount: number;
  activeLeadCount: number;
  
  // Top issues
  topCategories: Array<{
    category: LeadCategory;
    count: number;
    percentage: number;
  }>;
  
  // Timeline
  detectedAt: Date;
  lastActivityAt: Date;
  
  // Status
  status: 'active' | 'monitoring' | 'resolved';
}

// ========================================
// ACTIVITY LOG
// ========================================
export interface LeadActivity {
  id: string;
  leadId: string;
  type: 'created' | 'triaged' | 'assigned' | 'status_changed' | 'commented' | 'evidence_added' | 'escalated';
  title: string;
  description?: string;
  metadata?: Record<string, unknown>;
  userId: string;
  userName: string;
  timestamp: Date;
}

// ========================================
// DASHBOARD METRICS
// ========================================
export interface DashboardMetrics {
  // Lead counts
  totalLeads: number;
  newLeads: number;
  inProgress: number;
  resolved: number;
  overdue: number;
  
  // By urgency
  critical: number;
  high: number;
  medium: number;
  low: number;
  
  // Performance
  avgResolutionTime: number; // hours
  slaComplianceRate: number; // percentage
  
  // Trends
  leadsThisWeek: number;
  leadsLastWeek: number;
  weekOverWeekChange: number; // percentage
  
  // By category
  categoryBreakdown: Array<{
    category: LeadCategory;
    count: number;
    percentage: number;
  }>;
}

// ========================================
// FILTER & SEARCH
// ========================================
export interface LeadFilters {
  status?: LeadStatus[];
  urgency?: LeadUrgency[];
  confidence?: LeadConfidence[];
  source?: LeadSource[];
  category?: LeadCategory[];
  province?: string[];
  assignedTo?: string[];
  dateRange?: {
    from: Date;
    to: Date;
  };
  isOverdue?: boolean;
  hasEvidence?: boolean;
}