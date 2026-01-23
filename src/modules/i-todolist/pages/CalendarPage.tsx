import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, List, Plus } from 'lucide-react';
import { TaskCalendar } from '../components/TaskCalendar';
import { TopicsPanel } from '../components/TopicsPanel';
import { ToastContainer } from '../components/Toast';
import { NotificationBanner } from '../components/NotificationBanner';
import { Button } from '../components/Button';
import { useNotifications } from '../hooks/useNotifications';
import { taskService } from '../services/taskService';
import {
  checkTasksForNotifications,
  getNotificationMessage,
} from '../utils/taskNotifications';
import type { Task, Topic } from '../types';
import styles from './CalendarPage.module.css';

export function CalendarPage() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [showNotificationBanner, setShowNotificationBanner] = useState(false);
  const [lastNotificationCheck, setLastNotificationCheck] = useState<Date | null>(null);

  const {
    toasts,
    notify,
    closeToast,
    requestNotificationPermission,
    browserNotificationsEnabled,
  } = useNotifications();

  useEffect(() => {
    loadData();
    
    // Check if we should show the notification banner
    if (!browserNotificationsEnabled && 'Notification' in window && Notification.permission === 'default') {
      const dismissed = localStorage.getItem('notification_banner_dismissed');
      if (!dismissed) {
        setShowNotificationBanner(true);
      }
    }
  }, [browserNotificationsEnabled]);

  useEffect(() => {
    if (tasks.length > 0) {
      loadTopics();
      checkForDueTasks();
    }
  }, [tasks]);

  // Check for due tasks every 10 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (tasks.length > 0) {
        checkForDueTasks();
      }
    }, 10 * 60 * 1000); // 10 minutes

    return () => clearInterval(interval);
  }, [tasks]);

  const checkForDueTasks = () => {
    const now = new Date();
    
    // Don't check too frequently (at least 5 minutes between checks)
    if (lastNotificationCheck) {
      const timeSinceLastCheck = now.getTime() - lastNotificationCheck.getTime();
      if (timeSinceLastCheck < 5 * 60 * 1000) {
        return;
      }
    }

    const notifications = checkTasksForNotifications(tasks);
    
    notifications.forEach((notification) => {
      const { title, message } = getNotificationMessage(notification);
      const type = notification.type === 'overdue' ? 'error' : 'warning';
      
      notify(type, title, message, {
        duration: 8000,
        browserNotification: true,
      });
    });

    setLastNotificationCheck(now);
  };

  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      setShowNotificationBanner(false);
      notify('success', 'Đã bật thông báo', 'Bạn sẽ nhận được cảnh báo khi công việc sắp hết hạn', {
        duration: 5000,
      });
      
      // Check for due tasks immediately after enabling
      checkForDueTasks();
    }
  };

  const handleDismissNotificationBanner = () => {
    setShowNotificationBanner(false);
    localStorage.setItem('notification_banner_dismissed', 'true');
  };

  const loadData = async () => {
    const allTasks = await taskService.getAllTasks();
    setTasks(Array.isArray(allTasks) ? allTasks : []);
  };

  const loadTopics = () => {
    const savedTopics = localStorage.getItem('todolist_topics');
    if (savedTopics) {
      const parsedTopics = JSON.parse(savedTopics);
      // Update task count for each topic
      const updatedTopics = parsedTopics.map((topic: Topic) => ({
        ...topic,
        taskCount: tasks.filter((t) => t.topicId === topic.id).length,
      }));
      setTopics(updatedTopics);
    } else {
      const defaultTopics: Topic[] = [
        {
          id: 'topic-1',
          name: 'Phiên làm việc - Báo cáo QL',
          color: '#3B82F6',
          taskCount: 0,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'topic-2',
          name: 'Chủ đề - Task cá nhân',
          color: '#10B981',
          taskCount: 0,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'topic-3',
          name: 'Dự án Website',
          color: '#F97316',
          taskCount: 0,
          createdAt: new Date().toISOString(),
        },
      ];
      // Update task count for default topics
      const topicsWithCount = defaultTopics.map((topic) => ({
        ...topic,
        taskCount: tasks.filter((t) => t.topicId === topic.id).length,
      }));
      setTopics(topicsWithCount);
      localStorage.setItem('todolist_topics', JSON.stringify(topicsWithCount));
    }
  };

  const filteredTasks = Array.isArray(tasks) && selectedTopicId
    ? tasks.filter((task) => task.topicId === selectedTopicId)
    : (Array.isArray(tasks) ? tasks : []);
  
  const handleTaskClick = (task: Task) => {
    navigate(`/todolist/${task.id}`);
  };

  const handleCreateTopic = () => {
    const name = prompt('Nhập tên chủ đề mới:');
    if (name) {
      const newTopic: Topic = {
        id: `topic-${Date.now()}`,
        name,
        color: '#' + Math.floor(Math.random() * 16777215).toString(16),
        taskCount: 0,
        createdAt: new Date().toISOString(),
      };
      const updatedTopics = [...topics, newTopic];
      setTopics(updatedTopics);
      localStorage.setItem('todolist_topics', JSON.stringify(updatedTopics));
    }
  };

  return (
    <div className={styles.page}>
      <TopicsPanel
        topics={topics}
        selectedTopicId={selectedTopicId}
        onTopicSelect={setSelectedTopicId}
        onCreateTopic={handleCreateTopic}
        totalTaskCount={tasks.length}
      />

      <div className={styles.mainContent}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>Nhật ký công việc</h1>
            <p className={styles.subtitle}>
              Quản lý {tasks.length} công việc • {filteredTasks.length} hiển thị
            </p>
          </div>
          <div className={styles.actions}>
            <Button variant="default" size="sm">
              <Calendar size={16} />
              Lịch
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/todolist/list')}
            >
              <List size={16} />
              Danh sách
            </Button>
            <Button variant="default" size="sm" onClick={() => navigate('/todolist/create')}>
              <Plus size={16} />
              Tạo mới
            </Button>
          </div>
        </div>

        <div className={styles.content}>
          {showNotificationBanner && (
            <NotificationBanner
              onEnable={handleEnableNotifications}
              onDismiss={handleDismissNotificationBanner}
            />
          )}
          <TaskCalendar tasks={filteredTasks} onTaskClick={handleTaskClick} />
        </div>
      </div>

      <ToastContainer toasts={toasts} onClose={closeToast} />
    </div>
  );
}