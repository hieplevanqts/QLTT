import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useDrag, useDrop } from 'react-dnd';
import {
  Users,
  Calendar,
  Filter,
  Search,
  Plus,
  MoreVertical,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import PageHeader from '../../../layouts/PageHeader';
import styles from './PlanTaskBoard.module.css';
import { StatusBadge } from '../../components/common/StatusBadge';
import { mockPlans, mockTasks, type Task, type TaskStatus } from '../../data/kehoach-mock-data';

const TASK_COLUMNS: { id: TaskStatus; label: string; color: string; enabled: boolean; dropEnabled: boolean }[] = [
  { id: 'not_started', label: 'Chưa bắt đầu', color: 'rgba(208, 213, 221, 1)', enabled: true, dropEnabled: true },
  { id: 'in_progress', label: 'Đang thực hiện', color: 'rgba(0, 199, 242, 1)', enabled: true, dropEnabled: true },
  { id: 'completed', label: 'Hoàn thành', color: 'rgba(15, 202, 122, 1)', enabled: true, dropEnabled: true },
  { id: 'closed', label: 'Đã đóng', color: 'rgba(102, 112, 133, 1)', enabled: false, dropEnabled: false }, // Only admin can set
];

interface DraggableTaskCardProps {
  task: Task;
  onTaskClick: (taskId: string) => void;
}

function DraggableTaskCard({ task, onTaskClick }: DraggableTaskCardProps) {
  const [{ isDragging }, drag] = useDrag({
    type: 'TASK',
    item: { id: task.id, status: task.status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  const completedChecklist = task.checklist.filter((item) => item.completed).length;
  const totalChecklist = task.checklist.length;
  const checklistProgress = (completedChecklist / totalChecklist) * 100;

  return (
    <div
      ref={drag as any}
      className={`${styles.taskCard} ${isDragging ? styles.taskCardDragging : ''}`}
      onClick={() => onTaskClick(task.id)}
    >
      <div className={styles.taskCardHeader}>
        <StatusBadge type="priority" value={task.priority} size="sm" />
        <button className={styles.taskMenu} onClick={(e) => e.stopPropagation()}>
          <MoreVertical size={16} />
        </button>
      </div>

      <h4 className={styles.taskCardTitle}>{task.title}</h4>
      <p className={styles.taskCardDesc}>{task.description}</p>

      <div className={styles.taskCardMeta}>
        <div className={styles.taskCardMetaItem}>
          <Users size={14} />
          <span>{task.assignee.name.split(' ').slice(-1)[0]}</span>
        </div>
        <div className={styles.taskCardMetaItem}>
          <Calendar size={14} />
          <span>{new Date(task.dueDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}</span>
        </div>
      </div>

      {task.evidence.length > 0 && (
        <div className={styles.taskEvidenceTag}>
          {task.evidence.length} minh chứng
        </div>
      )}

      <div className={styles.checklistProgress}>
        <div className={styles.checklistProgressBar}>
          <div className={styles.checklistProgressFill} style={{ width: `${checklistProgress}%` }} />
        </div>
        <span className={styles.checklistProgressText}>
          {completedChecklist}/{totalChecklist}
        </span>
      </div>

      <div className={styles.taskCardFooter}>
        <StatusBadge type="sla" value={task.sla.status} size="sm" />
        {task.sla.status === 'overdue' && (
          <span className={styles.overdueLabel}>
            <Clock size={12} />
            Quá hạn {Math.abs(task.sla.hoursRemaining)}h
          </span>
        )}
      </div>
    </div>
  );
}

interface TaskColumnProps {
  column: typeof TASK_COLUMNS[0];
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
  onDropTask: (taskId: string, newStatus: TaskStatus) => void;
}

function TaskColumn({ column, tasks, onTaskClick, onDropTask }: TaskColumnProps) {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'TASK',
    canDrop: () => column.dropEnabled,
    drop: (item: { id: string; status: TaskStatus }) => {
      if (item.status !== column.id && column.dropEnabled) {
        onDropTask(item.id, column.id);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  });

  return (
    <div 
      ref={drop as any} 
      className={`${styles.column} ${isOver && canDrop ? styles.columnOver : ''} ${!column.dropEnabled ? styles.columnDisabled : ''}`}
    >
      <div className={styles.columnHeader} style={{ borderTopColor: column.color }}>
        <h3 className={styles.columnTitle}>
          {column.label}
          {!column.dropEnabled && <span className={styles.lockedBadge}>🔒</span>}
        </h3>
        <div className={styles.columnBadge}>{tasks.length}</div>
      </div>

      <div className={styles.columnContent}>
        {tasks.length === 0 ? (
          <div className={styles.columnEmpty}>
            <AlertCircle size={24} />
            <span>Không có phiên kiểm tra</span>
          </div>
        ) : (
          tasks.map((task) => (
            <DraggableTaskCard key={task.id} task={task} onTaskClick={onTaskClick} />
          ))
        )}
      </div>
    </div>
  );
}

export function PlanTaskBoard() {
  const navigate = useNavigate();
  const { planId } = useParams<{ planId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const decodedPlanId = planId ? decodeURIComponent(planId) : undefined;
  const plan = mockPlans.find((p) => p.id === decodedPlanId);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAssignee, setFilterAssignee] = useState<string>('all');
  const [tasks, setTasks] = useState(mockTasks.filter((t) => t.planId === decodedPlanId));

  useEffect(() => {
    const currentSearchTerm = searchParams.get('search');
    const currentFilterAssignee = searchParams.get('assignee');
    if (currentSearchTerm) {
      setSearchTerm(currentSearchTerm);
    }
    if (currentFilterAssignee) {
      setFilterAssignee(currentFilterAssignee);
    }
  }, [searchParams]);

  if (!plan) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <AlertCircle size={48} className={styles.emptyIcon} />
          <h3 className={styles.emptyTitle}>Không tìm thấy kế hoạch</h3>
        </div>
      </div>
    );
  }

  const handleDropTask = (taskId: string, newStatus: TaskStatus) => {
    const task = tasks.find(t => t.id === taskId);
    const statusLabel = TASK_COLUMNS.find(c => c.id === newStatus)?.label || newStatus;
    
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task))
    );
    
    toast.success(`Đã chuyển "${task?.title}" sang "${statusLabel}"`, {
      duration: 2000,
    });
  };

  const handleTaskClick = (taskId: string) => {
    navigate(`/plans/${planId}/tasks/${taskId}`);
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAssignee =
      filterAssignee === 'all' || task.assignee.id === filterAssignee;
    return matchesSearch && matchesAssignee;
  });

  const uniqueAssignees = Array.from(
    new Map(tasks.map((t) => [t.assignee.id, { id: t.assignee.id, name: t.assignee.name }])).values()
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setSearchParams({ search: value, assignee: filterAssignee });
  };

  const handleFilterAssigneeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFilterAssignee(value);
    setSearchParams({ search: searchTerm, assignee: value });
  };

  return (
    <div className={styles.container}>
      <PageHeader
        breadcrumbs={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Phiên kiểm tra' }
        ]}
        title="Bảng phiên kiểm tra"
        actions={
          <button className={styles.primaryButton} onClick={() => navigate(`/plans/${planId}/tasks/new`)}>
            <Plus size={18} />
            Tạo phiên kiểm tra mới
          </button>
        }
      />

      <div className={styles.planInfo}>
        <p className={styles.planName}>{plan.name}</p>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.searchBar}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Tìm kiếm phiên kiểm tra..."
            value={searchTerm}
            onChange={handleSearchChange}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filters}>
          <select
            value={filterAssignee}
            onChange={handleFilterAssigneeChange}
            className={styles.filterSelect}
          >
            <option value="all">Tất cả người thực hiện</option>
            {uniqueAssignees.map((assignee) => (
              <option key={assignee.id} value={assignee.id}>
                {assignee.name}
              </option>
            ))}
          </select>

          <button className={styles.filterButton}>
            <Filter size={18} />
            Bộ lọc
          </button>
        </div>
      </div>

      <div className={styles.board}>
        {TASK_COLUMNS.map((column) => (
          <TaskColumn
            key={column.id}
            column={column}
            tasks={filteredTasks.filter((t) => t.status === column.id)}
            onTaskClick={handleTaskClick}
            onDropTask={handleDropTask}
          />
        ))}
      </div>
    </div>
  );
}
