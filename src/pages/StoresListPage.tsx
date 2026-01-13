import React, { useState, useMemo, useEffect } from 'react';
import {
  Plus,
  Download,
  RefreshCw,
  Building2,
  CircleCheck,
  Clock,
  CirclePause,
  CircleX,
  Upload,
  History,
  FileText,
} from 'lucide-react';
import { toast } from 'sonner';
import PageHeader from '../layouts/PageHeader';
import EntityDrawer from '../patterns/EntityDrawer';
import EmptyState from '../ui-kit/EmptyState';
import DataTable, { Column } from '../ui-kit/DataTable';
import { SearchInput } from '../ui-kit/SearchInput';
import { Button } from '../app/components/ui/button';
import { Card, CardContent } from '../app/components/ui/card';
import { Badge } from '../app/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../app/components/ui/select';
import SummaryCard from '../patterns/SummaryCard';
import BulkActionBar, { BulkAction } from '../patterns/BulkActionBar';
import FilterActionBar from '../patterns/FilterActionBar';
import ActionColumn, { CommonActions, Action } from '../patterns/ActionColumn';
import FacilityStatusBadge, { FacilityStatus } from '../ui-kit/FacilityStatusBadge';
import TableFooter from '../ui-kit/TableFooter';
import { ConfirmDialog, ConfirmVariant } from '../ui-kit/ConfirmDialog';
import { RiskDialog, RiskLevel } from '../ui-kit/RiskDialog';
import { EditStoreDialog } from '../ui-kit/EditStoreDialog';
import { ImportDialog } from '../ui-kit/ImportDialog';
import { ExportDialog, ExportOptions } from '../ui-kit/ExportDialog';
import { AddStoreDialog, NewStoreData } from '../ui-kit/AddStoreDialog';
import { Store } from '../data/mockStores';
import { fetchMapPoints } from '../utils/api/mapPointsApi';
import styles from './StoresListPage.module.css';

export default function StoresListPage() {
  // State management
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>('overview'); // Track which tab to open
  const [searchValue, setSearchValue] = useState('');
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  
  // Filter states
  const [jurisdictionFilter, setJurisdictionFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Dialog states
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    variant: ConfirmVariant;
    onConfirm: () => void;
    requireDoubleConfirm?: boolean;
  }>({
    open: false,
    title: '',
    description: '',
    variant: 'default',
    onConfirm: () => {},
  });
  const [riskDialog, setRiskDialog] = useState<{
    open: boolean;
    storeId: number;
    storeName: string;
  }>({ open: false, storeId: 0, storeName: '' });
  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    store: Store | null;
  }>({ open: false, store: null });

  // New dialog states
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  // Data state - fetch from Postgres table map_points
  const [stores, setStores] = useState<Store[]>([]);

  // Fetch data from API on mount
  useEffect(() => {
    const loadStores = async () => {
      try {
        console.log('📋 StoresListPage: Fetching stores from Postgres...');
        setIsLoadingData(true);
        setDataError(null);
        
        const data = await fetchMapPoints();
        
        // Map Restaurant type to Store type
        const mappedStores: Store[] = data.map((restaurant: any, index: number) => ({
          id: restaurant.id ? (typeof restaurant.id === 'string' ? index + 1 : restaurant.id) : index + 1,
          name: restaurant.name || 'Unknown',
          address: restaurant.address || 'No address',
          type: restaurant.type || 'Restaurant',
          status: (restaurant.status || 'active') as FacilityStatus,
          riskLevel: (['high', 'medium', 'low'].includes(restaurant.category) 
            ? restaurant.category 
            : 'none') as 'low' | 'medium' | 'high' | 'none',
          lastInspection: restaurant.lastInspection || 'Chưa kiểm tra',
          jurisdiction: restaurant.district || restaurant.province || 'Unknown',
          managementUnit: restaurant.ward || 'Unknown'
        }));
        
        console.log(`✅ StoresListPage: Successfully loaded ${mappedStores.length} stores`);
        setStores(mappedStores);
      } catch (error: any) {
        console.error('❌ StoresListPage: Failed to fetch stores:', error);
        setDataError(error.message || 'Không thể tải dữ liệu cơ sở');
      } finally {
        setIsLoadingData(false);
      }
    };
    
    loadStores();
  }, []);

  // Action handlers
  const handleEdit = (store: Store) => {
    setEditDialog({ open: true, store });
  };

  const handleEditConfirm = (data: Partial<Store>) => {
    setStores(prev =>
      prev.map(s => (s.id === editDialog.store?.id ? { ...s, ...data } : s))
    );
    toast.success('Cập nhật cơ sở thành công');
  };

  const handleAssignRisk = (store: Store) => {
    setRiskDialog({ open: true, storeId: store.id, storeName: store.name });
  };

  const handleRiskConfirm = (data: {
    level: RiskLevel;
    reason: string;
    note: string;
  }) => {
    setStores(prev =>
      prev.map(s => (s.id === riskDialog.storeId ? { ...s, riskLevel: data.level } : s))
    );
    toast.success(
      `Gắn rủi ro mức độ ${data.level === 'high' ? 'Cao' : data.level === 'medium' ? 'Trung bình' : 'Thấp'} thành công`
    );
  };

  const handleSuspend = (store: Store) => {
    setConfirmDialog({
      open: true,
      title: 'Tạm ngưng hoạt động',
      description: `Bạn có chắc chắn muốn tạm ngưng hoạt động của cơ sở "${store.name}"?`,
      variant: 'warning',
      onConfirm: () => {
        setStores(prev =>
          prev.map(s => (s.id === store.id ? { ...s, status: 'suspended' as FacilityStatus } : s))
        );
        toast.success('Tạm ngưng cơ sở thành công');
      },
    });
  };

  const handleClose = (store: Store) => {
    setConfirmDialog({
      open: true,
      title: 'Ngừng hoạt động',
      description: `Bạn có chắc chắn muốn ngừng hoạt động vĩnh viễn cơ sở "${store.name}"? Hành động này không thể hoàn tác.`,
      variant: 'danger',
      requireDoubleConfirm: true,
      onConfirm: () => {
        setStores(prev =>
          prev.map(s => (s.id === store.id ? { ...s, status: 'closed' as FacilityStatus } : s))
        );
        toast.success('Ngừng hoạt động cơ sở thành công');
      },
    });
  };

  const handleResume = (store: Store) => {
    setConfirmDialog({
      open: true,
      title: 'Khôi phục hoạt động',
      description: `Bạn có chắc chắn muốn khôi phục hoạt động cơ sở "${store.name}"?`,
      variant: 'default',
      onConfirm: () => {
        setStores(prev =>
          prev.map(s => (s.id === store.id ? { ...s, status: 'active' as FacilityStatus } : s))
        );
        toast.success('Khôi phục cơ sở thành công');
      },
    });
  };

  const handleDelete = (store: Store) => {
    setConfirmDialog({
      open: true,
      title: 'Xóa cơ sở',
      description: `Bạn có chắc chắn muốn xóa cơ sở "${store.name}"? Hành động này không thể hoàn tác.`,
      variant: 'danger',
      onConfirm: () => {
        setStores(prev => prev.filter(s => s.id !== store.id));
        toast.success('Xóa cơ sở thành công');
      },
    });
  };

  // Calculate summary stats
  const stats = {
    total: stores.length,
    active: stores.filter(s => s.status === 'active').length,
    pending: stores.filter(s => s.status === 'pending').length,
    suspended: stores.filter(s => s.status === 'suspended').length,
    closed: stores.filter(s => s.status === 'closed').length,
    highRisk: stores.filter(s => s.riskLevel === 'high').length,
  };

  // Filter and paginate data
  const filteredData = useMemo(() => {
    let filtered = stores;

    // Apply filters
    if (jurisdictionFilter !== 'all') {
      filtered = filtered.filter(s => s.jurisdiction === jurisdictionFilter);
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter(s => s.status === statusFilter);
    }
    if (searchValue) {
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        s.address.toLowerCase().includes(searchValue.toLowerCase())
      );
    }
    if (activeFilter) {
      if (activeFilter === 'highRisk') {
        filtered = filtered.filter(s => s.riskLevel === 'high');
      } else {
        filtered = filtered.filter(s => s.status === activeFilter);
      }
    }

    return filtered;
  }, [stores, jurisdictionFilter, statusFilter, searchValue, activeFilter]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  // Bulk actions configuration
  const bulkActions: BulkAction[] = [
    {
      label: 'Xuất đã chọn',
      onClick: () => console.log('Export selected'),
      variant: 'secondary',
      icon: <Download size={16} />,
    },
  ];

  // Get actions for a store based on its status
  const getStoreActions = (store: Store): Action[] => {
    const actions: Action[] = [];

    switch (store.status) {
      case 'pending':
        // Chờ xác minh: Xem chi tiết, Chỉnh sửa, Xóa (3 actions - show all)
        actions.push(
          CommonActions.view(() => setSelectedStore(store)),
          CommonActions.edit(() => handleEdit(store)),
          CommonActions.delete(() => handleDelete(store))
        );
        break;
      
      case 'active':
        // Đang hoạt động: Full actions (6 actions - show top 3 + menu)
        actions.push(
          CommonActions.view(() => {
            setSelectedStore(store);
            setSelectedTab('overview');
          }),
          CommonActions.edit(() => handleEdit(store)),
          CommonActions.assignRisk(() => handleAssignRisk(store)),
          CommonActions.viewDocs(() => {
            setSelectedStore(store);
            setSelectedTab('files');
          }),
          CommonActions.viewHistory(() => {
            setSelectedStore(store);
            setSelectedTab('history');
          }),
          { ...CommonActions.pause(() => handleSuspend(store)), separator: true }
        );
        break;
      
      case 'underInspection':
        // Đang xử lý kiểm tra: Xem chi tiết, Lịch sử (2 actions - show all)
        actions.push(
          CommonActions.view(() => {
            setSelectedStore(store);
            setSelectedTab('overview');
          }),
          CommonActions.viewHistory(() => {
            setSelectedStore(store);
            setSelectedTab('history');
          })
        );
        break;
      
      case 'suspended':
        // Tạm ngưng: Xem chi tiết, Kích hoạt lại, Ngừng hoạt động (3 actions - show all)
        actions.push(
          CommonActions.view(() => {
            setSelectedStore(store);
            setSelectedTab('overview');
          }),
          CommonActions.resume(() => handleResume(store)),
          { ...CommonActions.delete(() => handleClose(store)), label: 'Ngừng hoạt động', separator: true }
        );
        break;
      
      case 'closed':
        // Ngừng hoạt động: Chỉ xem chi tiết và lịch sử (2 actions - show all)
        actions.push(
          CommonActions.view(() => {
            setSelectedStore(store);
            setSelectedTab('overview');
          }),
          CommonActions.viewHistory(() => {
            setSelectedStore(store);
            setSelectedTab('history');
          })
        );
        break;
    }

    return actions;
  };

  // Define table columns
  const columns: Column<Store>[] = [
    {
      key: 'name',
      label: 'Tên cơ sở',
      sortable: true,
      render: (store) => (
        <div>
          <div className={styles.storeName}>{store.name}</div>
          <div className={styles.storeType}>{store.type}</div>
        </div>
      ),
    },
    {
      key: 'address',
      label: 'Địa chỉ',
      sortable: true,
      render: (store) => store.address,
    },
    {
      key: 'jurisdiction',
      label: 'Địa bàn',
      sortable: true,
      render: (store) => store.jurisdiction,
    },
    {
      key: 'status',
      label: 'Trạng thái',
      render: (store) => <FacilityStatusBadge status={store.status} />,
    },
    {
      key: 'actions',
      label: 'Thao tác',
      render: (store) => (
        <ActionColumn
          actions={getStoreActions(store)}
        />
      ),
    },
  ];

  // Handle row selection
  const handleSelectRow = (id: number) => {
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
      setSelectedRows(new Set(paginatedData.map(s => s.id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [jurisdictionFilter, statusFilter, searchValue, activeFilter]);

  // Loading state
  if (isLoadingData) {
    return (
      <div className={styles.pageContainer}>
        <PageHeader
          breadcrumbs={[
            { label: 'Trang chủ', href: '/' },
            { label: 'Cơ sở & Địa bàn' }
          ]}
          title="Cơ sở & Địa bàn"
        />
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px',
          color: 'var(--color-text-secondary)',
          fontFamily: 'var(--font-family-base)',
          fontSize: 'var(--font-size-base)'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '48px',
              height: '48px',
              border: '4px solid var(--color-border)',
              borderTop: '4px solid var(--color-primary)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto var(--spacing-4)'
            }} />
            <div>Đang tải dữ liệu cơ sở...</div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (dataError) {
    return (
      <div className={styles.pageContainer}>
        <PageHeader
          breadcrumbs={[
            { label: 'Trang chủ', href: '/' },
            { label: 'Cơ sở & Địa bàn' }
          ]}
          title="Cơ sở & Địa bàn"
        />
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px',
          padding: 'var(--spacing-6)'
        }}>
          <div style={{
            maxWidth: '500px',
            padding: 'var(--spacing-6)',
            backgroundColor: 'var(--color-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
            textAlign: 'center',
            fontFamily: 'var(--font-family-base)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: 'var(--spacing-4)' }}>⚠️</div>
            <h3 style={{
              fontSize: 'var(--font-size-lg)',
              fontWeight: '600',
              marginBottom: 'var(--spacing-3)',
              color: 'var(--color-text)'
            }}>
              Không thể tải dữ liệu
            </h3>
            <p style={{
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-text-secondary)',
              marginBottom: 'var(--spacing-5)',
              lineHeight: 1.6
            }}>
              {dataError}
            </p>
            <Button onClick={() => window.location.reload()}>
              Thử lại
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <PageHeader
        breadcrumbs={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Cơ sở & Địa bàn' }
        ]}
        title="Tra cứu cơ sở"
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => {
              setSearchValue('');
              setJurisdictionFilter('all');
              setStatusFilter('all');
              setActiveFilter(null);
              toast.success('Đã tải lại dữ liệu');
            }}>
              <RefreshCw size={16} />
              Tải lại
            </Button>
            <Button variant="outline" size="sm" onClick={() => setImportDialogOpen(true)}>
              <Upload size={16} />
              Nhập dữ liệu
            </Button>
            <Button variant="outline" size="sm" onClick={() => {
              // Direct export to Excel
              console.log('Exporting to Excel...');
              toast.success('Xuất dữ liệu Excel thành công');
            }}>
              <Download size={16} />
              Xuất dữ liệu
            </Button>
            <Button size="sm" onClick={() => setAddDialogOpen(true)}>
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
            label="Tổng số cơ sở"
            value={stats.total}
            icon={Building2}
            variant="info"
            active={activeFilter === null}
            onClick={() => setActiveFilter(null)}
          />
          <SummaryCard
            label="Đang hoạt động"
            value={stats.active}
            icon={CircleCheck}
            variant="success"
            active={activeFilter === 'active'}
            onClick={() => setActiveFilter('active')}
          />
          <SummaryCard
            label="Chờ xác minh"
            value={stats.pending}
            icon={Clock}
            variant="warning"
            active={activeFilter === 'pending'}
            onClick={() => setActiveFilter('pending')}
          />
          <SummaryCard
            label="Tạm ngưng"
            value={stats.suspended}
            icon={CirclePause}
            variant="danger"
            active={activeFilter === 'suspended'}
            onClick={() => setActiveFilter('suspended')}
          />
          <SummaryCard
            label="Ngừng hoạt động"
            value={stats.closed}
            icon={CircleX}
            variant="neutral"
            active={activeFilter === 'closed'}
            onClick={() => setActiveFilter('closed')}
          />
        </div>

        {/* QLTT Standard: Filters and Actions on SAME ROW */}
        <FilterActionBar
          filters={
            <>
              <Select value={jurisdictionFilter} onValueChange={setJurisdictionFilter}>
                <SelectTrigger style={{ width: '200px' }}>
                  <SelectValue placeholder="-- Địa bàn --" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả địa bàn</SelectItem>
                  <SelectItem value="Quận 1">Quận 1</SelectItem>
                  <SelectItem value="Quận 3">Quận 3</SelectItem>
                  <SelectItem value="Quận 5">Quận 5</SelectItem>
                  <SelectItem value="Quận 10">Quận 10</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger style={{ width: '200px' }}>
                  <SelectValue placeholder="-- Trạng thái --" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="pending">Chờ xác minh</SelectItem>
                  <SelectItem value="active">Đang hoạt động</SelectItem>
                  <SelectItem value="underInspection">Đang xử lý kiểm tra</SelectItem>
                  <SelectItem value="suspended">Tạm ngưng</SelectItem>
                  <SelectItem value="closed">Ngừng hoạt động</SelectItem>
                </SelectContent>
              </Select>
            </>
          }
          searchInput={
            <SearchInput
              placeholder="Tên cơ sở"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              style={{ width: '666px' }}
            />
          }
        />
      </div>

      {/* Data Table */}
      <div className={styles.tableContainer}>
        <Card>
          <CardContent className={styles.tableCard}>
            {/* Bulk Action Bar - inline in table */}
            {selectedRows.size > 0 && (
              <BulkActionBar
                selectedCount={selectedRows.size}
                actions={bulkActions}
                onClear={() => setSelectedRows(new Set())}
              />
            )}
            
            <DataTable
              columns={columns}
              data={paginatedData}
              selectable={true}
              selectedRows={selectedRows}
              onSelectRow={handleSelectRow}
              onSelectAll={handleSelectAll}
              getRowId={(store) => store.id}
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
          </CardContent>
        </Card>
      </div>

      {/* Entity Drawer */}
      <EntityDrawer
        open={!!selectedStore}
        onClose={() => {
          setSelectedStore(null);
          setSelectedTab('overview');
        }}
        title={selectedStore?.name || ''}
        description={selectedStore?.address}
        size="md"
        defaultTab={selectedTab}
        tabs={[
          {
            value: 'overview',
            label: 'Tổng quan',
            content: selectedStore && (
              <div className={styles.drawerContent}>
                <div className={styles.drawerField}>
                  <label className={styles.drawerLabel}>Loại hình</label>
                  <p className={styles.drawerValue}>{selectedStore.type}</p>
                </div>
                <div className={styles.drawerField}>
                  <label className={styles.drawerLabel}>Địa chỉ</label>
                  <p className={styles.drawerValue}>{selectedStore.address}</p>
                </div>
                <div className={styles.drawerField}>
                  <label className={styles.drawerLabel}>Địa bàn quản lý</label>
                  <p className={styles.drawerValue}>{selectedStore.jurisdiction}</p>
                </div>
                <div className={styles.drawerField}>
                  <label className={styles.drawerLabel}>Đơn vị quản lý</label>
                  <p className={styles.drawerValue}>{selectedStore.managementUnit}</p>
                </div>
                <div className={styles.drawerField}>
                  <label className={styles.drawerLabel}>Trạng thái</label>
                  <div className={styles.drawerValue}>
                    <FacilityStatusBadge status={selectedStore.status} />
                  </div>
                </div>
                <div className={styles.drawerField}>
                  <label className={styles.drawerLabel}>Mức độ rủi ro</label>
                  <div className={styles.drawerValue}>
                    <Badge
                      variant={
                        selectedStore.riskLevel === 'high'
                          ? 'destructive'
                          : selectedStore.riskLevel === 'medium'
                          ? 'default'
                          : 'secondary'
                      }
                    >
                      {selectedStore.riskLevel === 'high'
                        ? 'Cao'
                        : selectedStore.riskLevel === 'medium'
                        ? 'Trung bình'
                        : selectedStore.riskLevel === 'low'
                        ? 'Thấp'
                        : 'Chưa đánh giá'}
                    </Badge>
                  </div>
                </div>
                <div className={styles.drawerField}>
                  <label className={styles.drawerLabel}>Kiểm tra gần nhất</label>
                  <p className={styles.drawerValue}>{selectedStore.lastInspection}</p>
                </div>
              </div>
            ),
          },
          {
            value: 'history',
            label: 'Lịch sử thay đổi',
            content: (
              <div className={styles.historyTimeline}>
                <div className={styles.historyItem}>
                  <div className={styles.historyDot} />
                  <div className={styles.historyContent}>
                    <div className={styles.historyTitle}>Thay đổi trạng thái</div>
                    <div className={styles.historyDetail}>
                      Từ "Chờ xác minh" → "Đang hoạt động"
                    </div>
                    <div className={styles.historyDetail}>
                      Bởi: Nguyễn Văn A • 15/12/2025 10:30
                    </div>
                  </div>
                </div>
                <div className={styles.historyItem}>
                  <div className={`${styles.historyDot} ${styles.historyDotMuted}`} />
                  <div className={styles.historyContent}>
                    <div className={styles.historyTitle}>Gắn rủi ro</div>
                    <div className={styles.historyDetail}>
                      Mức độ: Thấp • Lý do: Kiểm tra định kỳ đạt yêu cầu
                    </div>
                    <div className={styles.historyDetail}>
                      Bởi: Trần Thị B • 15/12/2025 14:20
                    </div>
                  </div>
                </div>
                <div className={styles.historyItem}>
                  <div className={`${styles.historyDot} ${styles.historyDotMuted}`} />
                  <div className={styles.historyContent}>
                    <div className={styles.historyTitle}>Tạo cơ sở</div>
                    <div className={styles.historyDetail}>
                      Bởi: Nguyễn Văn A • 10/12/2025 09:00
                    </div>
                  </div>
                </div>
              </div>
            ),
          },
          {
            value: 'inspections',
            label: 'Lịch sử kiểm tra',
            content: (
              <EmptyState
                type="empty"
                title="Chưa có lịch sử kiểm tra"
                description="Các hoạt động kiểm tra sẽ được hiển thị tại đây"
              />
            ),
          },
          {
            value: 'files',
            label: 'Hồ sơ pháp lý',
            content: (
              <EmptyState
                type="empty"
                title="Chưa có hồ sơ"
                description="Các giấy tờ, hình ảnh liên quan sẽ được lưu trữ tại đây"
                action={{
                  label: 'Tải lên tệp',
                  onClick: () => console.log('Upload file'),
                }}
              />
            ),
          },
        ]}
        footer={
          <div className={styles.drawerFooter}>
            <Button variant="outline" className={styles.drawerFooterButton} onClick={() => setSelectedStore(null)}>
              Đóng
            </Button>
            <Button className={styles.drawerFooterButton}>Chỉnh sửa</Button>
          </div>
        }
      />

      {/* Dialogs */}
      <ConfirmDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}
        title={confirmDialog.title}
        description={confirmDialog.description}
        variant={confirmDialog.variant}
        onConfirm={confirmDialog.onConfirm}
        requireDoubleConfirm={confirmDialog.requireDoubleConfirm}
      />

      <RiskDialog
        open={riskDialog.open}
        onOpenChange={(open) => setRiskDialog({ ...riskDialog, open })}
        storeName={riskDialog.storeName}
        onConfirm={handleRiskConfirm}
      />

      <EditStoreDialog
        open={editDialog.open}
        onOpenChange={(open) => setEditDialog({ ...editDialog, open })}
        store={editDialog.store}
        onConfirm={handleEditConfirm}
      />

      <ImportDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        onImport={async (file: File) => {
          // Mock import - in production, parse CSV/Excel and add to stores
          console.log('Importing file:', file.name);
          toast.success(`Nhập dữ liệu từ ${file.name} thành công`);
        }}
      />

      <ExportDialog
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
        totalRecords={stores.length}
        selectedCount={selectedRows.size}
        onExport={(options: ExportOptions) => {
          console.log('Export with options:', options);
          toast.success('Xuất dữ liệu thành công');
        }}
      />

      <AddStoreDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSubmit={(data: NewStoreData) => {
          const newStore: Store = {
            id: stores.length + 1,
            name: data.name,
            type: data.type,
            address: data.address,
            jurisdiction: data.jurisdiction,
            managementUnit: data.managementUnit,
            status: 'pending' as FacilityStatus,
            riskLevel: 'none',
            lastInspection: 'Chưa kiểm tra',
          };
          setStores(prev => [...prev, newStore]);
          toast.success('Thêm cơ sở thành công');
        }}
      />
    </div>
  );
}