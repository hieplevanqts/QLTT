export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'paused';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  dueDate: string; // ISO date string
  tags: string[];
  topicId?: string; // Link to topic/session
  notes: string;
  attachments: string[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  estimatedHours?: number;
  actualHours?: number;
  isOverdue?: boolean; // Auto-calculated
}

export interface TaskHistory {
  id: string;
  taskId: string;
  action: 'created' | 'status_changed' | 'updated' | 'commented';
  oldValue?: string;
  newValue?: string;
  description: string;
  createdAt: string;
  author: string;
}

export interface Comment {
  id: string;
  taskId: string;
  content: string;
  createdAt: string;
  author: string;
}

export interface TaskStatistics {
  total: number;
  completed: number;
  inProgress: number;
  notStarted: number;
  paused: number;
  overdue: number;
  completionRate: number;
  completedToday: number;
  completedThisWeek: number;
  completedThisMonth: number;
}

export interface Topic {
  id: string;
  name: string;
  color: string; // Hex color code
  icon?: 'folder' | 'briefcase' | 'target' | 'users';
  taskCount: number;
  createdAt: string;
}

export interface DashboardStats {
  overview: TaskStatistics;
  recentActivities: TaskHistory[];
  upcomingTasks: Task[];
  overdueCount: number;
  productivityTrend: { date: string; completed: number }[];
}
