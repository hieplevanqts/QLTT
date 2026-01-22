import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, List } from 'lucide-react';
import { TaskCalendar } from '../components/TaskCalendar';
import { TopicsPanel } from '../components/TopicsPanel';
import { taskService } from '../services/taskService';
import type { Task, Topic } from '../types';
import styles from './CalendarPage.module.css';

export function CalendarPage() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const allTasks = await taskService.getAllTasks();
    setTasks(Array.isArray(allTasks) ? allTasks : []);
    
    // Load topics from localStorage or use defaults
    const savedTopics = localStorage.getItem('todolist_topics');
    if (savedTopics) {
      setTopics(JSON.parse(savedTopics));
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
          taskCount: 1,
          createdAt: new Date().toISOString(),
        },
      ];
      setTopics(defaultTopics);
      localStorage.setItem('todolist_topics', JSON.stringify(defaultTopics));
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
    <div className={styles.container}>
      <TopicsPanel
        topics={topics}
        selectedTopicId={selectedTopicId}
        onTopicSelect={setSelectedTopicId}
        onCreateTopic={handleCreateTopic}
        totalTaskCount={tasks.length}
      />

      <div className={styles.mainContent}>
        <div className={styles.header}>
          <div className={styles.titleRow}>
            <h1 className={styles.title}>Nhật ký công việc</h1>
            <div className={styles.viewTabs}>
              <button className={`${styles.tabButton} ${styles.active}`}>
                <Calendar size={16} style={{ display: 'inline', marginRight: '6px' }} />
                Lịch
              </button>
              <button
                className={styles.tabButton}
                onClick={() => navigate('/todolist/list')}
              >
                <List size={16} style={{ display: 'inline', marginRight: '6px' }} />
                Danh sách
              </button>
            </div>
          </div>
        </div>

        <div className={styles.calendarWrapper}>
          <TaskCalendar tasks={filteredTasks} onTaskClick={handleTaskClick} />
        </div>
      </div>
    </div>
  );
}