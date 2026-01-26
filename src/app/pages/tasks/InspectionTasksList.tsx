import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { 
  Plus, 
  Download, 
  RefreshCw, 
  FileText,
  Eye,
  Edit,
  Filter,
  Calendar,
  User,
  MapPin
} from 'lucide-react';
import { toast } from 'sonner';
import PageHeader from '../../../layouts/PageHeader';
import EmptyState from '../../../ui-kit/EmptyState';
import DataTable, { Column } from '../../../ui-kit/DataTable';
import { SearchInput } from '../../../ui-kit/SearchInput';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import FilterActionBar from '../../../patterns/FilterActionBar';
import ActionColumn, { Action } from '../../../patterns/ActionColumn';
import TableFooter from '../../../ui-kit/TableFooter';
import { InspectionTaskStatusBadge } from '../../components/tasks/InspectionTaskStatusBadge';
import TaskDetailModal from '../../components/tasks/TaskDetailModal';
import { type InspectionTask } from '../../data/inspection-tasks-mock-data';
import { fetchInspectionSessionsApi, type InspectionSession } from '../../../utils/api/inspectionSessionsApi';
import styles from './InspectionTasksList.module.css';

export function InspectionTasksList() {
  const [searchParams] = useSearchParams();
  const { roundId } = useParams<{ roundId: string }>();
  
  // State management
  const [sessions, setSessions] = useState<InspectionSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  
  // Modal states
  const [selectedTask, setSelectedTask] = useState<InspectionTask | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const campaignId = roundId || searchParams.get('campaignId') || undefined;

  const loadSessions = async () => {
    try {
      setLoading(true);
      const data = await fetchInspectionSessionsApi(campaignId);
      setSessions(data);
    } catch (error) {
      toast.error('Không thể tải danh sách phiên làm việc');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, [campaignId]);

  // Apply filters
  const filteredData = useMemo(() => {
    return sessions.filter(session => {
      const matchesSearch = 
        (session.name?.toLowerCase().includes(searchValue.toLowerCase()) || '') ||
        (session.merchantName?.toLowerCase().includes(searchValue.toLowerCase()) || '') ||
        (session.userName?.toLowerCase().includes(searchValue.toLowerCase()) || '');
      
      const matchesActiveFilter = activeFilter === null || session.status === activeFilter;
      
      return matchesSearch && matchesActiveFilter;
    });
  }, [sessions, searchValue, activeFilter]);

  // Stats calculation
  const stats = useMemo(() => ({
    total: sessions.length,
    notStarted: sessions.filter(s => s.status === 'not_started').length,
    inProgress: sessions.filter(s => s.status === 'in_progress').length,
    completed: sessions.filter(s => s.status === 'completed').length,
    closed: sessions.filter(s => s.status === 'closed').length,
  }), [sessions]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize]);

  // Get actions for each session
  const getSessionActions = (session: InspectionSession): Action[] => {
    return [
      {
        label: 'Xem chi tiết',
        icon: <Eye size={16} />,
        onClick: () => {
          // Adapter to convert InspectionSession to InspectionTask format
          const task: any = {
            id: session.id,
            code: session.id,
            title: session.name,
            roundName: session.campaignName || 'Đợt kiểm tra',
            status: session.status,
            targetName: session.merchantName,
            targetAddress: session.merchantAddress,
            dueDate: session.deadlineTime,
            assignee: { name: session.userName },
            description: session.description || session.note,
          };
          setSelectedTask(task);
          setIsDetailModalOpen(true);
        },
        priority: 10,
      },
      {
        label: 'Chỉnh sửa',
        icon: <Edit size={16} />,
        onClick: () => toast.info('Chức năng đang phát triển'),
        priority: 9,
      }
    ];
  };

  // Define table columns based on the public.map_inspection_sessions structure
  const columns: Column<InspectionSession>[] = [
    {
      key: 'name',
      label: 'Phiên làm việc',
      sortable: true,
      render: (session) => (
        <div className={styles.taskTitleColumn}>
          <div className={styles.taskTitle}>{session.name || '--'}</div>
          <div className={styles.planName}>Đợt: {session.campaignName || '--'}</div>
        </div>
      ),
    },
    {
      key: 'merchant',
      label: 'Cơ sở / Đối tượng',
      sortable: true,
      render: (session) => (
        <div className={styles.taskTitleColumn}>
          <div className={styles.taskTitle}>{session.merchantName || '--'}</div>
          <div className={styles.taskTarget}>
            <MapPin size={12} /> {session.merchantAddress || '--'}
          </div>
        </div>
      ),
    },
    {
      key: 'user',
      label: 'Người thực hiện',
      sortable: true,
      render: (session) => (
        <div className={styles.assigneeColumn}>
          <div className={styles.assigneeAvatar}>
            <User size={14} />
          </div>
          <span className={styles.assignee}>{session.userName || '--'}</span>
        </div>
      ),
    },
    {
      key: 'time',
      label: 'Thời gian',
      sortable: true,
      render: (session) => (
        <div className={styles.dueDateContainer}>
          <div className={styles.dueDate}>
            <Calendar size={12} style={{ display: 'inline', marginRight: 4 }} />
            {session.startTime ? new Date(session.startTime).toLocaleDateString('vi-VN') : '--'}
          </div>
          <div className={styles.planName}>Hạn: {session.deadlineTime ? new Date(session.deadlineTime).toLocaleDateString('vi-VN') : '--'}</div>
        </div>
      ),
    },
    {
      key: 'result',
      label: 'Kết quả',
      render: (session) => (
        <div className={styles.taskTarget}>
          {session.resultText || '--'}
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Trạng thái',
      render: (session) => <InspectionTaskStatusBadge type="status" value={session.status} size="sm" />,
    },
    {
      key: 'actions',
      label: 'Thao tác',
      sticky: 'right',
      render: (session) => (
        <ActionColumn actions={getSessionActions(session)} />
      ),
    },
  ];

  const handleSelectRow = (id: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedRows(newSelected);
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) setSelectedRows(new Set(paginatedData.map(s => s.id)));
    else setSelectedRows(new Set());
  };

  return (
    <div className={styles.pageContainer}>
      <PageHeader
        breadcrumbs={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Phiên kiểm tra' }
        ]}
        title="Danh sách phiên kiểm tra"
        actions={
          <>
            <Button variant="outline" size="sm" onClick={loadSessions} disabled={loading}>
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              Tải lại
            </Button>
            <Button variant="outline" size="sm">
              <Download size={16} />
              Xuất dữ liệu
            </Button>
            <Button size="sm">
              <Plus size={16} />
              Thêm mới
            </Button>
          </>
        }
      />

      <div className={styles.summaryContainer}>
        <div className={styles.summaryGrid}>
          <div 
            className={`${styles.summaryCard} ${activeFilter === null ? styles.active : ''}`}
            onClick={() => setActiveFilter(null)}
          >
            <div className={styles.cardHeader}>Tổng số</div>
            <div className={styles.cardValue}>{stats.total}</div>
          </div>
          <div 
            className={`${styles.summaryCard} ${activeFilter === 'not_started' ? styles.active : ''}`}
            onClick={() => setActiveFilter('not_started')}
          >
            <div className={styles.cardHeader}>Chưa bắt đầu</div>
            <div className={styles.cardValue}>{stats.notStarted}</div>
          </div>
          <div 
            className={`${styles.summaryCard} ${activeFilter === 'in_progress' ? styles.active : ''}`}
            onClick={() => setActiveFilter('in_progress')}
          >
            <div className={styles.cardHeader}>Đang thực hiện</div>
            <div className={styles.cardValue}>{stats.inProgress}</div>
          </div>
          <div 
            className={`${styles.summaryCard} ${activeFilter === 'completed' ? styles.active : ''}`}
            onClick={() => setActiveFilter('completed')}
          >
            <div className={styles.cardHeader}>Hoàn thành</div>
            <div className={styles.cardValue}>{stats.completed}</div>
          </div>
        </div>

        <FilterActionBar
          filters={
            <Button variant="outline" size="sm">
              <Filter size={16} /> Bộ lọc
            </Button>
          }
          searchInput={
            <SearchInput
              placeholder="Tìm theo tên phiên, cơ sở hoặc người thực hiện..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              style={{ width: '450px' }}
            />
          }
        />
      </div>

      <div className={styles.tableContainer}>
        <Card>
          <CardContent className={styles.tableCard}>
            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center' }}>
                <RefreshCw className="animate-spin" size={32} style={{ margin: '0 auto 16px', color: 'var(--primary)' }} />
                <p>Đang tải dữ liệu...</p>
              </div>
            ) : filteredData.length === 0 ? (
              <EmptyState
                icon={FileText}
                title="Không tìm thấy phiên làm việc"
                description="Không có phiên làm việc nào phù hợp với bộ lọc hiện tại"
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
                  getRowId={(s) => s.id}
                />
                
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

      {isDetailModalOpen && (
        <TaskDetailModal
          task={selectedTask}
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
        />
      )}
    </div>
  );
}
