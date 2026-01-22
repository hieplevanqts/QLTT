
export type PlanStatus = 'draft' | 'pending_approval' | 'approved' | 'rejected' | 'active' | 'paused' | 'completed' | 'cancelled';
export type PlanType = 'periodic' | 'thematic' | 'urgent';
export type TargetType = 'STORE' | 'LEAD' | 'RISK_ZONE' | 'POINT';
export type Priority = 'low' | 'medium' | 'high' | 'critical';
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
  region?: string;
  leadUnit?: string;
  provinceId?: string;
  wardId?: string;
  objectives: string;
  status: PlanStatus;
  priority: Priority;
  startDate: string;
  endDate: string;
  createdBy: string;
  createdById?: string;
  createdAt: string;
  insDecisionM03?: {
    id: string;
    code: string;
    title: string;
    issueDate: string;
    signer: string;
  };
  rejectionReason?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  deployedBy?: string;
  deployedAt?: string;
  pausedReason?: string;
  pausedBy?: string;
  pausedAt?: string;
  cancelledReason?: string;
  cancelledBy?: string;
  cancelledAt?: string;
  description?: string;
  hasAuthorization?: boolean;
  stats: {
    totalTargets: number;
    totalTasks: number;
    completedTasks: number;
    progress: number;
  };
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

export interface HistoryEvent {
  id: string;
  planId: string;
  eventType: 'created' | 'submitted' | 'approved' | 'rejected' | 'active' | 'paused' | 'completed' | 'cancelled';
  title: string;
  description: string;
  user: string;
  timestamp: string;
}
