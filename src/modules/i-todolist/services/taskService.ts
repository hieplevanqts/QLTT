import type { Task, Comment, TaskStatistics, TaskHistory, DashboardStats } from '../types';
import { MOCK_TASKS, MOCK_COMMENTS } from '../data/mock';

const STORAGE_KEY_TASKS = 'i-todolist-tasks';
const STORAGE_KEY_COMMENTS = 'i-todolist-comments';
const STORAGE_KEY_HISTORY = 'i-todolist-history';

// Initialize localStorage with mock data if empty
const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEY_TASKS)) {
    localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(MOCK_TASKS));
  }
  if (!localStorage.getItem(STORAGE_KEY_COMMENTS)) {
    localStorage.setItem(STORAGE_KEY_COMMENTS, JSON.stringify(MOCK_COMMENTS));
  }
  if (!localStorage.getItem(STORAGE_KEY_HISTORY)) {
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify([]));
  }
};

// Helper to check if task is overdue
const checkOverdue = (task: Task): boolean => {
  if (task.status === 'completed') return false;
  return new Date(task.dueDate) < new Date();
};

// Helper to add history entry
const addHistory = (
  taskId: string,
  action: TaskHistory['action'],
  description: string,
  oldValue?: string,
  newValue?: string
) => {
  const history = localStorage.getItem(STORAGE_KEY_HISTORY);
  const allHistory: TaskHistory[] = history ? JSON.parse(history) : [];
  
  const newEntry: TaskHistory = {
    id: `history-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    taskId,
    action,
    description,
    oldValue,
    newValue,
    createdAt: new Date().toISOString(),
    author: 'Người dùng',
  };
  
  allHistory.push(newEntry);
  localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(allHistory));
};

// Tasks CRUD operations
export const taskService = {
  // Get all tasks
  getAllTasks: async (): Promise<Task[]> => {
    initializeStorage();
    const tasks = localStorage.getItem(STORAGE_KEY_TASKS);
    return tasks ? JSON.parse(tasks) : [];
  },

  // Get task by ID
  getTaskById: async (id: string): Promise<Task | null> => {
    const tasks = await taskService.getAllTasks();
    return tasks.find((task) => task.id === id) || null;
  },

  // Create new task
  createTask: async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> => {
    const tasks = await taskService.getAllTasks();
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isOverdue: false,
    };
    tasks.push(newTask);
    localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
    
    // Add history
    addHistory(newTask.id, 'created', `Tạo nhiệm vụ: ${newTask.title}`);
    
    return newTask;
  },

  // Update task
  updateTask: async (id: string, updates: Partial<Task>): Promise<Task | null> => {
    const tasks = await taskService.getAllTasks();
    const index = tasks.findIndex((task) => task.id === id);
    if (index === -1) return null;

    const oldTask = tasks[index];
    const updatedTask = {
      ...oldTask,
      ...updates,
      updatedAt: new Date().toISOString(),
      isOverdue: checkOverdue({ ...oldTask, ...updates }),
    };

    // Track status changes
    if (updates.status && updates.status !== oldTask.status) {
      if (updates.status === 'completed') {
        updatedTask.completedAt = new Date().toISOString();
      }
      addHistory(
        id,
        'status_changed',
        `Thay đổi trạng thái từ "${oldTask.status}" sang "${updates.status}"`,
        oldTask.status,
        updates.status
      );
    }

    // Track other updates
    if (updates.title || updates.description || updates.dueDate || updates.priority) {
      addHistory(id, 'updated', `Cập nhật thông tin nhiệm vụ`);
    }

    tasks[index] = updatedTask;
    localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
    return updatedTask;
  },

  // Delete task
  deleteTask: async (id: string): Promise<boolean> => {
    const tasks = await taskService.getAllTasks();
    const filteredTasks = tasks.filter((task) => task.id !== id);
    if (filteredTasks.length === tasks.length) return false;
    localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(filteredTasks));
    return true;
  },

  // Get statistics
  getStatistics: async (): Promise<TaskStatistics> => {
    const tasks = await taskService.getAllTasks();
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const stats: TaskStatistics = {
      total: tasks.length,
      completed: tasks.filter((t) => t.status === 'completed').length,
      inProgress: tasks.filter((t) => t.status === 'in-progress').length,
      notStarted: tasks.filter((t) => t.status === 'not-started').length,
      paused: tasks.filter((t) => t.status === 'paused').length,
      overdue: tasks.filter((t) => checkOverdue(t)).length,
      completionRate: 0,
      completedToday: tasks.filter((t) => 
        t.status === 'completed' && 
        t.completedAt && 
        new Date(t.completedAt) >= today
      ).length,
      completedThisWeek: tasks.filter((t) => 
        t.status === 'completed' && 
        t.completedAt && 
        new Date(t.completedAt) >= weekStart
      ).length,
      completedThisMonth: tasks.filter((t) => 
        t.status === 'completed' && 
        t.completedAt && 
        new Date(t.completedAt) >= monthStart
      ).length,
    };

    stats.completionRate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

    return stats;
  },

  // Get overdue tasks
  getOverdueTasks: async (): Promise<Task[]> => {
    const tasks = await taskService.getAllTasks();
    return tasks.filter(checkOverdue);
  },

  // Get tasks by tag
  getTasksByTag: async (tag: string): Promise<Task[]> => {
    const tasks = await taskService.getAllTasks();
    return tasks.filter((t) => t.tags.includes(tag));
  },

  // Get all unique tags
  getAllTags: async (): Promise<string[]> => {
    const tasks = await taskService.getAllTasks();
    const tagsSet = new Set<string>();
    tasks.forEach((t) => t.tags.forEach((tag) => tagsSet.add(tag)));
    return Array.from(tagsSet);
  },

  // Get dashboard stats
  getDashboardStats: async (): Promise<DashboardStats> => {
    const tasks = await taskService.getAllTasks();
    const overview = await taskService.getStatistics();
    const recentActivities = await historyService.getRecentHistory(10);
    
    // Get upcoming tasks (next 7 days, not completed)
    const now = new Date();
    const next7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const upcomingTasks = tasks
      .filter((t) => 
        t.status !== 'completed' && 
        new Date(t.dueDate) >= now && 
        new Date(t.dueDate) <= next7Days
      )
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 5);

    // Calculate productivity trend for last 7 days
    const productivityTrend: { date: string; completed: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const nextDate = new Date(date);
      nextDate.setDate(date.getDate() + 1);
      
      const completed = tasks.filter((t) => 
        t.status === 'completed' && 
        t.completedAt && 
        new Date(t.completedAt) >= date && 
        new Date(t.completedAt) < nextDate
      ).length;
      
      productivityTrend.push({
        date: date.toISOString().split('T')[0],
        completed,
      });
    }

    return {
      overview,
      recentActivities,
      upcomingTasks,
      overdueCount: overview.overdue,
      productivityTrend,
    };
  },

  // Filter tasks
  filterTasks: async (filters: {
    status?: Task['status'];
    priority?: Task['priority'];
    search?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<Task[]> => {
    let tasks = await taskService.getAllTasks();

    if (filters.status) {
      tasks = tasks.filter((t) => t.status === filters.status);
    }

    if (filters.priority) {
      tasks = tasks.filter((t) => t.priority === filters.priority);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      tasks = tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(searchLower) ||
          t.description.toLowerCase().includes(searchLower)
      );
    }

    if (filters.dateFrom) {
      tasks = tasks.filter((t) => new Date(t.dueDate) >= new Date(filters.dateFrom!));
    }

    if (filters.dateTo) {
      tasks = tasks.filter((t) => new Date(t.dueDate) <= new Date(filters.dateTo!));
    }

    return tasks;
  },
};

// Comments operations
export const commentService = {
  // Get comments for a task
  getCommentsByTaskId: async (taskId: string): Promise<Comment[]> => {
    initializeStorage();
    const comments = localStorage.getItem(STORAGE_KEY_COMMENTS);
    const allComments: Comment[] = comments ? JSON.parse(comments) : [];
    return allComments.filter((c) => c.taskId === taskId);
  },

  // Add comment
  addComment: async (
    taskId: string,
    content: string,
    author: string = 'Người dùng'
  ): Promise<Comment> => {
    const comments = localStorage.getItem(STORAGE_KEY_COMMENTS);
    const allComments: Comment[] = comments ? JSON.parse(comments) : [];

    const newComment: Comment = {
      id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      taskId,
      content,
      createdAt: new Date().toISOString(),
      author,
    };

    allComments.push(newComment);
    localStorage.setItem(STORAGE_KEY_COMMENTS, JSON.stringify(allComments));
    return newComment;
  },

  // Delete comment
  deleteComment: async (id: string): Promise<boolean> => {
    const comments = localStorage.getItem(STORAGE_KEY_COMMENTS);
    const allComments: Comment[] = comments ? JSON.parse(comments) : [];
    const filteredComments = allComments.filter((c) => c.id !== id);
    if (filteredComments.length === allComments.length) return false;
    localStorage.setItem(STORAGE_KEY_COMMENTS, JSON.stringify(filteredComments));
    
    // Add history
    addHistory('', 'commented', 'Xóa bình luận');
    
    return true;
  },
};

// History operations
export const historyService = {
  // Get history for a task
  getTaskHistory: async (taskId: string): Promise<TaskHistory[]> => {
    initializeStorage();
    const history = localStorage.getItem(STORAGE_KEY_HISTORY);
    const allHistory: TaskHistory[] = history ? JSON.parse(history) : [];
    return allHistory
      .filter((h) => h.taskId === taskId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  // Get recent history (all tasks)
  getRecentHistory: async (limit: number = 10): Promise<TaskHistory[]> => {
    initializeStorage();
    const history = localStorage.getItem(STORAGE_KEY_HISTORY);
    const allHistory: TaskHistory[] = history ? JSON.parse(history) : [];
    return allHistory
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  },

  // Clear old history (keep last 100 entries)
  clearOldHistory: async (): Promise<void> => {
    const history = localStorage.getItem(STORAGE_KEY_HISTORY);
    const allHistory: TaskHistory[] = history ? JSON.parse(history) : [];
    const recentHistory = allHistory
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 100);
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(recentHistory));
  },
};