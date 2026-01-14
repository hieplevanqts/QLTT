import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Plus, 
  Download, 
  RefreshCw, 
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  Edit,
  PlayCircle,
  PauseCircle,
  Trash2,
  AlertCircle,
  Filter
} from 'lucide-react';
import { toast } from 'sonner';
import PageHeader from '../../../layouts/PageHeader';
import EmptyState from '../../../ui-kit/EmptyState';
import DataTable, { Column } from '../../../ui-kit/DataTable';
import { SearchInput } from '../../../ui-kit/SearchInput';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import SummaryCard from '../../../patterns/SummaryCard';
import FilterActionBar from '../../../patterns/FilterActionBar';
import ActionColumn, { Action } from '../../../patterns/ActionColumn';
import TableFooter from '../../../ui-kit/TableFooter';
import { InspectionTaskStatusBadge } from '../../components/tasks/InspectionTaskStatusBadge';
import { mockInspectionTasks, type InspectionTask } from '../../data/inspection-tasks-mock-data';
import styles from './InspectionTasksList.module.css';

export function InspectionTasksList() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // State management
  const [searchValue, setSearchValue] = useState('');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [roundFilter, setRoundFilter] = useState<string>('all');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Calculate stats
  const stats = useMemo(() => {
    return {
      total: mockInspectionTasks.length,
      notStarted: mockInspectionTasks.filter(t => t.status === 'not_started').length,
      inProgress: mockInspectionTasks.filter(t => t.status === 'in_progress').length,
      pendingReview: mockInspectionTasks.filter(t => t.status === 'pending_review').length,
      completed: mockInspectionTasks.filter(t => t.status === 'completed').length,
      urgent: mockInspectionTasks.filter(t => t.priority === 'urgent').length,
    };
  }, []);

  // Apply filters
  const filteredData = useMemo(() => {
    return mockInspectionTasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchValue.toLowerCase()) ||
                           task.code.toLowerCase().includes(searchValue.toLowerCase()) ||
                           task.targetName.toLowerCase().includes(searchValue.toLowerCase()) ||
                           task.assignee.name.toLowerCase().includes(searchValue.toLowerCase());
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
      const matchesRound = roundFilter === 'all' || task.roundId === roundFilter;
      const matchesActiveFilter = activeFilter === null || task.status === activeFilter;
      
      return matchesSearch && matchesStatus && matchesPriority && matchesRound && matchesActiveFilter;
    });
  }, [searchValue, statusFilter, priorityFilter, roundFilter, activeFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize]);

  // Get unique rounds for filter
  const uniqueRounds = useMemo(() => {
    const rounds = Array.from(new Set(mockInspectionTasks.map(t => t.roundId)));
    return rounds.map(roundId => {
      const task = mockInspectionTasks.find(t => t.roundId === roundId);
      return { id: roundId, name: task?.roundName || roundId };
    });
  }, []);

  // Get actions for each task
  const getTaskActions = (task: InspectionTask): Action[] => {
    const actions: Action[] = [];

    switch (task.status) {
      case 'not_started':
        // Chưa bắt đầu: Chỉnh sửa, Bắt đầu, Xóa
        actions.push(
          {
            label: 'Chỉnh sửa',
            icon: <Edit size={16} />,
            onClick: () => {
              toast.info('Mở form chỉnh sửa nhiệm vụ');
              console.log('Edit task', task.id);
            },
            priority: 10,
          },
          {
            label: 'Bắt đầu nhiệm vụ',
            icon: <PlayCircle size={16} />,
            onClick: () => {
              toast.success('Đã chuyển sang trạng thái Đang thực hiện');
              console.log('Start task', task.id);
            },
            priority: 9,
          },
          {
            label: 'Xóa',
            icon: <Trash2 size={16} />,
            onClick: () => {
              if (confirm('Bạn có chắc chắn muốn xóa nhiệm vụ này?')) {
                toast.success('Đã xóa nhiệm vụ');
                console.log('Delete task', task.id);
              }
            },
            variant: 'destructive' as const,
            separator: true,
            priority: 1,
          }
        );
        break;

      case 'in_progress':
        // Đang thực hiện: Xem chi tiết, Cập nhật tiến độ, Tạm dừng, Hoàn thành
        actions.push(
          {
            label: 'Xem chi tiết',
            icon: <Eye size={16} />,
            onClick: () => navigate(`/tasks/${encodeURIComponent(task.id)}`),
            priority: 10,
          },
          {
            label: 'Cập nhật tiến độ',
            icon: <FileText size={16} />,
            onClick: () => {
              toast.info('Mở form cập nhật tiến độ');
              console.log('Update progress', task.id);
            },
            priority: 9,
          },
          {
            label: 'Tạm dừng',
            icon: <PauseCircle size={16} />,
            onClick: () => {
              toast.warning('Đã tạm dừng nhiệm vụ');
              console.log('Pause task', task.id);
            },
            priority: 8,
          },
          {
            label: 'Hoàn thành',
            icon: <CheckCircle2 size={16} />,
            onClick: () => {
              toast.success('Đã chuyển sang trạng thái Chờ kiểm tra');
              console.log('Complete task', task.id);
            },
            priority: 7,
          }
        );
        break;

      case 'pending_review':
        // Chờ kiểm tra: Xem chi tiết, Phê duyệt, Yêu cầu chỉnh sửa
        actions.push(
          {
            label: 'Xem chi tiết',
            icon: <Eye size={16} />,
            onClick: () => navigate(`/tasks/${encodeURIComponent(task.id)}`),
            priority: 10,
          },
          {
            label: 'Phê duyệt',
            icon: <CheckCircle2 size={16} />,
            onClick: () => {
              toast.success('Đã phê duyệt nhiệm vụ');
              console.log('Approve task', task.id);
            },
            priority: 9,
          },
          {
            label: 'Yêu cầu chỉnh sửa',
            icon: <AlertCircle size={16} />,
            onClick: () => {
              toast.warning('Đã gửi yêu cầu chỉnh sửa');
              console.log('Request changes', task.id);
            },
            priority: 8,
          }
        );
        break;

      case 'completed':
        // Hoàn thành: Xem chi tiết, Tải báo cáo
        actions.push(
          {
            label: 'Xem chi tiết',
            icon: <Eye size={16} />,
            onClick: () => navigate(`/tasks/${encodeURIComponent(task.id)}`),
            priority: 10,
          },
          {
            label: 'Tải báo cáo',
            icon: <Download size={16} />,
            onClick: () => {
              toast.success('Đang tải báo cáo...');
              console.log('Download report', task.id);
            },
            priority: 9,
          }
        );
        break;

      case 'cancelled':
        // Đã hủy: Xem chi tiết
        actions.push(
          {
            label: 'Xem chi tiết',
            icon: <Eye size={16} />,
            onClick: () => navigate(`/tasks/${encodeURIComponent(task.id)}`),
            priority: 10,
          }
        );
        break;

      default:
        actions.push(
          {
            label: 'Xem chi tiết',
            icon: <Eye size={16} />,
            onClick: () => navigate(`/tasks/${encodeURIComponent(task.id)}`),
            priority: 10,
          }
        );
    }

    return actions;
  };

  // Define table columns
  const columns: Column<InspectionTask>[] = [
    {
      key: 'code',
      label: 'Mã nhiệm vụ',
      sortable: true,
      render: (task) => (
        <div className={styles.taskCodeColumn}>
          <div className={styles.taskCode}>{task.code}</div>
          {task.priority === 'urgent' && (
            <span className={styles.urgentBadge}>⚡ Khẩn cấp</span>
          )}
        </div>
      ),
    },
    {
      key: 'title',
      label: 'Tên nhiệm vụ',
      sortable: true,
      render: (task) => (
        <div className={styles.taskTitleColumn}>
          <div className={styles.taskTitle}>{task.title}</div>
          <div className={styles.taskTarget}>{task.targetName}</div>
        </div>
      ),
    },
    {
      key: 'round',
      label: 'Đợt kiểm tra',
      sortable: true,
      render: (task) => (
        <div className={styles.roundColumn}>
          <div className={styles.roundName}>{task.roundName}</div>
          {task.planName && (
            <div className={styles.planName}>KH: {task.planName}</div>
          )}
        </div>
      ),
    },
    {
      key: 'assignee',
      label: 'Người thực hiện',
      sortable: true,
      render: (task) => {
        const initials = task.assignee.name
          .split(' ')
          .map(n => n[0])
          .join('')
          .substring(0, 2)
          .toUpperCase();
        
        return (
          <div className={styles.assigneeColumn}>
            <div className={styles.assigneeAvatar}>{initials}</div>
            <span className={styles.assignee}>{task.assignee.name}</span>
          </div>
        );
      },
    },
    {
      key: 'dueDate',
      label: 'Hạn hoàn thành',
      sortable: true,
      render: (task) => {
        const dueDate = new Date(task.dueDate);
        const isOverdue = dueDate < new Date() && task.status !== 'completed' && task.status !== 'cancelled';
        return (
          <div className={styles.dueDateContainer}>
            <span className={isOverdue ? styles.dueDateOverdue : styles.dueDate}>
              {dueDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
            </span>
            {isOverdue && <span className={styles.overdueLabel}>Quá hạn</span>}
          </div>
        );
      },
    },
    {
      key: 'progress',
      label: 'Tiến độ',
      sortable: true,
      render: (task) => (
        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{ width: `${task.progress}%` }}
            />
          </div>
          <span className={styles.progressText}>{task.progress}%</span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Trạng thái',
      render: (task) => <InspectionTaskStatusBadge type="status" value={task.status} size="sm" />,
    },
    {
      key: 'actions',
      label: 'Thao tác',
      sticky: 'right',
      render: (task) => (
        <ActionColumn actions={getTaskActions(task)} />
      ),
    },
  ];

  // Handle row selection
  const handleSelectRow = (id: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedRows(new Set(paginatedData.map(t => t.id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, priorityFilter, roundFilter, searchValue, activeFilter]);

  // Auto-filter by inspectionRound query parameter
  useEffect(() => {
    const inspectionRoundParam = searchParams.get('inspectionRound');
    if (inspectionRoundParam) {
      const decodedRound = decodeURIComponent(inspectionRoundParam);
      setRoundFilter(decodedRound);
      toast.info(`Đã lọc nhiệm vụ theo đợt kiểm tra: ${decodedRound}`);
    }
  }, [searchParams]);

  return (
    <div className={styles.pageContainer}>
      <PageHeader
        breadcrumbs={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Nhiệm vụ' }
        ]}
        title="Quản lý nhiệm vụ"
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => {
              setSearchValue('');
              setStatusFilter('all');
              setPriorityFilter('all');
              setRoundFilter('all');
              setActiveFilter(null);
              toast.success('Đã tải lại dữ liệu');
            }}>
              <RefreshCw size={16} />
              Tải lại
            </Button>
            <Button variant="outline" size="sm" onClick={() => {
              console.log('Exporting to Excel...');
              toast.success('Xuất dữ liệu Excel thành công');
            }}>
              <Download size={16} />
              Xuất dữ liệu
            </Button>
            <Button size="sm" onClick={() => navigate('/tasks/create')}>
              <Plus size={16} />
              Thêm mới
            </Button>
          </>
        }
      />

      {/* Summary Cards */}
      <div className={styles.summaryContainer}>
        <div className={styles.summaryGrid}>
          <SummaryCard
            label="Tổng số nhiệm vụ"
            value={stats.total}
            icon={FileText}
            variant="info"
            active={activeFilter === null}
            onClick={() => setActiveFilter(null)}
          />
          <SummaryCard
            label="Chưa bắt đầu"
            value={stats.notStarted}
            icon={Clock}
            variant="neutral"
            active={activeFilter === 'not_started'}
            onClick={() => setActiveFilter('not_started')}
          />
          <SummaryCard
            label="Đang thực hiện"
            value={stats.inProgress}
            icon={PlayCircle}
            variant="info"
            active={activeFilter === 'in_progress'}
            onClick={() => setActiveFilter('in_progress')}
          />
          <SummaryCard
            label="Chờ kiểm tra"
            value={stats.pendingReview}
            icon={AlertCircle}
            variant="warning"
            active={activeFilter === 'pending_review'}
            onClick={() => setActiveFilter('pending_review')}
          />
          <SummaryCard
            label="Hoàn thành"
            value={stats.completed}
            icon={CheckCircle2}
            variant="success"
            active={activeFilter === 'completed'}
            onClick={() => setActiveFilter('completed')}
          />
        </div>

        {/* QLTT Standard: Filters and Search on SAME ROW */}
        <FilterActionBar
          filters={
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                toast.info('Mở bộ lọc nâng cao');
                console.log('Open advanced filters');
              }}
            >
              <Filter size={16} />
              Bộ lọc
            </Button>
          }
          searchInput={
            <SearchInput
              placeholder="Tìm theo mã, tên nhiệm vụ, cơ sở hoặc người thực hiện"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              style={{ width: '450px' }}
            />
          }
        />
      </div>

      {/* Data Table */}
      <div className={styles.tableContainer}>
        <Card>
          <CardContent className={styles.tableCard}>
            {filteredData.length === 0 ? (
              <EmptyState
                icon={FileText}
                title="Không tìm thấy nhiệm vụ"
                description="Không có nhiệm vụ nào phù hợp với bộ lọc hiện tại"
              />
            ) : (
              <>
                <DataTable
                  columns={columns}
                  data={paginatedData}
                  selectable={true}
                  selectedRows={selectedRows}
                  onSelectRow={handleSelectRow}
                  onSelectAll={handleSelectAll}
                  getRowId={(task) => task.id}
                />
                
                {/* QLTT Standard: Footer with Pagination */}
                <TableFooter
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalRecords={filteredData.length}
                  pageSize={pageSize}
                  onPageChange={setCurrentPage}
                  onPageSizeChange={(size) => {
                    setPageSize(size);
                    setCurrentPage(1);
                  }}
                />
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}