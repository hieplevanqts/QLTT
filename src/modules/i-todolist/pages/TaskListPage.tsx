import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Calendar, List, Eye, Edit2, Trash2, MoreVertical, Filter } from 'lucide-react';
import { taskService } from '../services/taskService';
import type { Task, Topic } from '../types';
import { TaskStatusBadge } from '../components/TaskStatusBadge';
import { PriorityIndicator } from '../components/PriorityIndicator';
import { TopicsPanel } from '../components/TopicsPanel';
import { Button } from '../components/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/DropdownMenu';

export function TaskListPage() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<Task['status'] | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<Task['priority'] | 'all'>('all');
  const [overdueFilter, setOverdueFilter] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      loadTopics();
    }
  }, [tasks]);

  useEffect(() => {
    applyFilters();
  }, [tasks, searchQuery, statusFilter, priorityFilter, selectedTopicId, overdueFilter, selectedTag]);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await taskService.getAllTasks();
      setTasks(data);
      
      // Extract all unique tags
      const tags = await taskService.getAllTags();
      setAllTags(tags);
    } finally {
      setLoading(false);
    }
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

  const applyFilters = () => {
    let result = [...tasks];

    // Filter by topic
    if (selectedTopicId !== null) {
      result = result.filter((t) => t.topicId === selectedTopicId);
    }

    if (statusFilter !== 'all') {
      result = result.filter((t) => t.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      result = result.filter((t) => t.priority === priorityFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query)
      );
    }

    if (overdueFilter) {
      result = result.filter(isOverdue);
    }

    if (selectedTag) {
      result = result.filter((t) => t.tags.includes(selectedTag));
    }

    // Sort by due date
    result.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

    setFilteredTasks(result);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa công việc này?')) return;
    await taskService.deleteTask(id);
    await loadTasks();
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const isOverdue = (task: Task) => {
    if (task.status === 'completed') return false;
    return new Date(task.dueDate) < new Date();
  };

  if (loading) {
    return (
      <div className="todolist-loading">
        <div className="todolist-spinner" />
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="todolist-container">
      <TopicsPanel
        topics={topics}
        selectedTopicId={selectedTopicId}
        onTopicSelect={setSelectedTopicId}
        onCreateTopic={handleCreateTopic}
        totalTaskCount={tasks.length}
      />

      <div className="todolist-main-content">
        {/* Page Header */}
        <div className="todolist-page-header">
          <div>
            <h1 className="todolist-page-title">Danh sách công việc</h1>
            <p className="todolist-page-subtitle">
              Quản lý {tasks.length} công việc • {filteredTasks.length} kết quả
            </p>
          </div>
          <div className="todolist-page-actions">
            <button
              className="todolist-tab-button"
              onClick={() => navigate('/todolist')}
            >
              <Calendar size={16} style={{ display: 'inline', marginRight: '6px' }} />
              Lịch
            </button>
            <button className="todolist-tab-button active">
              <List size={16} style={{ display: 'inline', marginRight: '6px' }} />
              Danh sách
            </button>
            <Button onClick={() => navigate('/todolist/create')}>
              <Plus className="h-4 w-4" />
              Tạo mới
            </Button>
          </div>
        </div>

        <div className="todolist-content-wrapper">
          {/* Filters & Search */}
          <div className="todolist-toolbar">
            <div className="todolist-search-box">
              <Search className="h-4 w-4" style={{ color: 'var(--muted-foreground)' }} />
              <input
                type="text"
                placeholder="Tìm kiếm công việc..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="todolist-search-input"
              />
            </div>

            <div className="todolist-filters">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4" />
                    Trạng thái
                    {statusFilter !== 'all' && <span className="todolist-filter-badge">1</span>}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                    Tất cả
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('not-started')}>
                    Chưa bắt đầu
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('in-progress')}>
                    Đang làm
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('completed')}>
                    Hoàn thành
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('paused')}>
                    Tạm dừng
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4" />
                    Ưu tiên
                    {priorityFilter !== 'all' && <span className="todolist-filter-badge">1</span>}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setPriorityFilter('all')}>
                    Tất cả
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPriorityFilter('urgent')}>
                    Khẩn cấp
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPriorityFilter('high')}>
                    Cao
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPriorityFilter('medium')}>
                    Trung bình
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPriorityFilter('low')}>
                    Thấp
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4" />
                    Hạn chót
                    {overdueFilter && <span className="todolist-filter-badge">1</span>}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setOverdueFilter(false)}>
                    Tất cả
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setOverdueFilter(true)}>
                    Quá hạn
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4" />
                    Thẻ
                    {selectedTag && <span className="todolist-filter-badge">1</span>}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSelectedTag(null)}>
                    Tất cả
                  </DropdownMenuItem>
                  {allTags.map((tag) => (
                    <DropdownMenuItem key={tag} onClick={() => setSelectedTag(tag)}>
                      {tag}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Task List */}
          <div className="todolist-task-list">
            {filteredTasks.length === 0 ? (
              <div className="todolist-empty">
                <p>Không tìm thấy công việc nào</p>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className={`todolist-task-card ${isOverdue(task) ? 'overdue' : ''}`}
                >
                  <div className="todolist-task-content">
                    <div className="todolist-task-header">
                      <PriorityIndicator priority={task.priority} size="md" />
                      <h3 className="todolist-task-title">{task.title}</h3>
                    </div>
                    <p className="todolist-task-description">{task.description}</p>
                    <div className="todolist-task-meta">
                      <TaskStatusBadge status={task.status} size="sm" />
                      <span className="todolist-meta-item">
                        <svg
                          className="h-3 w-3"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        {formatDate(task.dueDate)}
                      </span>
                      {task.tags.length > 0 && (
                        <div className="todolist-task-tags">
                          {task.tags.slice(0, 2).map((tag) => (
                            <span key={tag} className="todolist-task-tag">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="todolist-task-actions">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => navigate(`/todolist/${task.id}`)}
                      title="Xem chi tiết"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => navigate(`/todolist/create?edit=${task.id}`)}
                      title="Chỉnh sửa"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleDelete(task.id)}
                      title="Xóa"
                      style={{ color: 'var(--destructive)' }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}