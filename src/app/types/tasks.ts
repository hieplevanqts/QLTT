
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
  code: string;
  roundId: string;
  roundName: string;
  planId?: string;
  planName?: string;
  title: string;
  description: string;
  targetName: string;
  targetCode?: string;
  targetAddress: string;
  assignee: TaskAssignee;
  assignedBy: TaskAssignee;
  assignedDate: string;
  status: TaskStatus;
  priority: TaskPriority;
  reopenReason?: string;
  reopenedAt?: string;
  reopenedBy?: TaskAssignee;
  dueDate: string;
  startDate?: string;
  completedDate?: string;
  progress: number;
  checklistTotal: number;
  checklistCompleted: number;
  tags?: string[];
  targetArea?: string;
  teamMembers?: string;
  createdAt?: string;
  updatedAt?: string;
}
