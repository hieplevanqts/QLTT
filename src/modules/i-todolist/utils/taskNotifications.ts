import type { Task } from '../types';

export interface TaskNotification {
  task: Task;
  type: 'due-soon' | 'overdue';
  hoursUntilDue?: number;
}

export function checkTasksForNotifications(tasks: Task[]): TaskNotification[] {
  const now = new Date();
  const notifications: TaskNotification[] = [];

  tasks.forEach((task) => {
    // Skip completed tasks
    if (task.status === 'completed') return;

    const dueDate = new Date(task.dueDate);
    const timeDiff = dueDate.getTime() - now.getTime();
    const hoursUntilDue = timeDiff / (1000 * 60 * 60);

    // Task is overdue
    if (timeDiff < 0) {
      notifications.push({
        task,
        type: 'overdue',
        hoursUntilDue: Math.abs(hoursUntilDue),
      });
    }
    // Task is due within 24 hours
    else if (hoursUntilDue <= 24 && hoursUntilDue > 0) {
      notifications.push({
        task,
        type: 'due-soon',
        hoursUntilDue,
      });
    }
  });

  return notifications;
}

export function formatDueTime(hoursUntilDue: number): string {
  if (hoursUntilDue < 1) {
    const minutes = Math.floor(hoursUntilDue * 60);
    return `${minutes} phút`;
  } else if (hoursUntilDue < 24) {
    const hours = Math.floor(hoursUntilDue);
    return `${hours} giờ`;
  } else {
    const days = Math.floor(hoursUntilDue / 24);
    return `${days} ngày`;
  }
}

export function getNotificationMessage(notification: TaskNotification): {
  title: string;
  message: string;
} {
  const { task, type, hoursUntilDue } = notification;

  if (type === 'overdue') {
    return {
      title: '⚠️ Công việc quá hạn',
      message: `"${task.title}" đã quá hạn ${hoursUntilDue ? formatDueTime(hoursUntilDue) : ''}`,
    };
  } else {
    return {
      title: '⏰ Công việc sắp hết hạn',
      message: `"${task.title}" sẽ hết hạn trong ${hoursUntilDue ? formatDueTime(hoursUntilDue) : ''}`,
    };
  }
}
