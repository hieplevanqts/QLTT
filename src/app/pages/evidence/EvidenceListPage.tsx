import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Download,
  RefreshCw,
  Upload,
  FileText,
  Clock,
  AlertCircle,
  CheckCircle,
  Archive,
  X,
  FileSpreadsheet,
  File,
  FileType,
  CheckSquare,
  Edit,
  Trash2,
  Link as LinkIcon,
  Users,
  TriangleAlert,
  ClipboardList,
  Store,
} from 'lucide-react';
import { toast } from 'sonner';
import PageHeader from '../../../layouts/PageHeader';
import DataTable, { Column } from '../../../ui-kit/DataTable';
import { SearchInput } from '../../../ui-kit/SearchInput';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Checkbox } from '../../components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import SummaryCard from '../../../patterns/SummaryCard';
import BulkActionBar, { BulkAction } from '../../../patterns/BulkActionBar';
import FilterActionBar from '../../../patterns/FilterActionBar';
import ActionColumn, { CommonActions, Action } from '../../../patterns/ActionColumn';
import TableFooter from '../../../ui-kit/TableFooter';
import styles from './EvidenceListPage.module.css';
import { generateMockEvidenceItems } from '../../data/evidence-mock-data';
import { EvidenceItem, getStatusLabel, getTypeLabel, getStatusColor } from '../../types/evidence.types';
import { EvidenceType, SensitivityLabel } from '../../types/evidence.types';

export default function EvidenceListPage() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [scopeFilter, setScopeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [evidenceItems, setEvidenceItems] = useState<EvidenceItem[]>(generateMockEvidenceItems(50));
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [entityTypeFilter, setEntityTypeFilter] = useState<'LEAD' | 'RISK' | 'TASK' | 'STORE' | null>(null);

  // Dialog states
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);

  // Edit state
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingEvidence, setEditingEvidence] = useState<EvidenceItem | null>(null);

  // Delete state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingEvidence, setDeletingEvidence] = useState<EvidenceItem | null>(null);

  // Import state
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importProgress, setImportProgress] = useState(0);
  const [isImporting, setIsImporting] = useState(false);

  // Export state
  const [exportFormat, setExportFormat] = useState<'excel' | 'csv' | 'pdf'>('excel');
  const [exportScope, setExportScope] = useState<'all' | 'filtered' | 'selected'>('filtered');
  const [exportColumns, setExportColumns] = useState<string[]>([
    'evidenceId',
    'filename',
    'type',
    'status',
    'scope',
    'capturedAt',
    'uploadedAt',
    'sensitivityLabel',
  ]);

  // Form state
  const [formData, setFormData] = useState({
    filename: '',
    type: 'PHOTO' as EvidenceType,
    capturedAt: new Date().toISOString().split('T')[0],
    province: '',
    ward: '',
    addressText: '',
    lat: '',
    lng: '',
    sensitivityLabel: 'Internal' as SensitivityLabel,
    notes: '',
    tags: '',
  });

  const stats = {
    total: evidenceItems.length,
    leadLinks: evidenceItems.reduce((sum, e) => sum + (e.links?.filter(l => l.entityType === 'LEAD').length || 0), 0),
    riskLinks: evidenceItems.reduce((sum, e) => sum + (e.links?.filter(l => l.entityType === 'RISK').length || 0), 0),
    taskLinks: evidenceItems.reduce((sum, e) => sum + (e.links?.filter(l => l.entityType === 'TASK').length || 0), 0),
    storeLinks: evidenceItems.reduce((sum, e) => sum + (e.links?.filter(l => l.entityType === 'STORE').length || 0), 0),
  };

  const getEvidenceActions = (evidence: EvidenceItem): Action[] => {
    const actions: Action[] = [];
    
    actions.push(
      CommonActions.view(() => navigate(`/evidence/${evidence.evidenceId}`)),
      CommonActions.edit(() => {
        setEditingEvidence(evidence);
        setIsEditDialogOpen(true);
      }),
      CommonActions.delete(() => {
        setDeletingEvidence(evidence);
        setIsDeleteDialogOpen(true);
      })
    );

    return actions;
  };

  const filteredData = useMemo(() => {
    let filtered = evidenceItems;

    if (scopeFilter !== 'all') {
      filtered = filtered.filter(e => 
        e.scope.ward === scopeFilter || e.scope.province === scopeFilter
      );
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter(e => e.status === statusFilter);
    }
    if (searchValue) {
      filtered = filtered.filter(e => 
        e.file.filename.toLowerCase().includes(searchValue.toLowerCase()) ||
        e.evidenceId.toLowerCase().includes(searchValue.toLowerCase())
      );
    }
    if (activeFilter) {
      filtered = filtered.filter(e => e.status === activeFilter);
    }
    if (entityTypeFilter) {
      filtered = filtered.filter(e => 
        e.links?.some(link => link.entityType === entityTypeFilter)
      );
    }

    return filtered;
  }, [scopeFilter, statusFilter, searchValue, activeFilter, entityTypeFilter, evidenceItems]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const bulkActions: BulkAction[] = [
    {
      label: 'Xuất đã chọn',
      onClick: () => console.log('Export selected'),
      variant: 'secondary',
      icon: <Download size={16} />,
    },
  ];

  const columns: Column<EvidenceItem>[] = [
    {
      key: 'evidenceId',
      label: 'Mã chứng cứ',
      sortable: true,
      render: (evidence) => evidence.evidenceId,
    },
    {
      key: 'file',
      label: 'Tên file',
      sortable: true,
      render: (evidence) => (
        <div>
          <div className={styles.evidenceName}>{evidence.file.filename}</div>
          <div className={styles.evidenceType}>{getTypeLabel(evidence.type)}</div>
        </div>
      ),
    },
    {
      key: 'scope',
      label: 'Địa bàn',
      sortable: true,
      render: (evidence) => evidence.scope.ward || evidence.scope.province || 'N/A',
    },
    {
      key: 'capturedAt',
      label: 'Ngày thu thập',
      sortable: true,
      render: (evidence) => new Date(evidence.capturedAt).toLocaleDateString('vi-VN'),
    },
    {
      key: 'status',
      label: 'Trạng thái',
      render: (evidence) => {
        const config = getStatusColor(evidence.status);
        return (
          <Badge 
            variant="outline"
            style={{
              borderColor: config.color,
              color: config.color,
              background: config.bg,
            }}
          >
            {getStatusLabel(evidence.status)}
          </Badge>
        );
      },
    },
    {
      key: 'links',
      label: 'Liên kết',
      render: (evidence) => {
        const links = evidence.links || [];
        if (links.length === 0) {
          return (
            <span style={{ 
              fontSize: 'var(--text-sm)', 
              color: 'var(--text-tertiary)' 
            }}>
              Chưa có
            </span>
          );
        }
        
        // Group by entity type and count
        const grouped = links.reduce((acc, link) => {
          acc[link.entityType] = (acc[link.entityType] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        // Format display text - mapping khớp với SummaryCard
        const displayText = Object.entries(grouped)
          .map(([type, count]) => {
            const typeLabels: Record<string, string> = {
              'LEAD': 'Nguồn tin',
              'RISK': 'Rủi ro',
              'TASK': 'Phiên kiểm tra',
              'STORE': 'Cửa hàng',
            };
            return `${count} ${typeLabels[type] || type}`;
          })
          .join(', ');
        
        return (
          <span style={{ 
            fontSize: 'var(--text-sm)', 
            color: 'var(--text-primary)',
          }}>
            {displayText}
          </span>
        );
      },
    },
    {
      key: 'actions',
      label: 'Thao tác',
      render: (evidence) => (
        <ActionColumn actions={getEvidenceActions(evidence)} />
      ),
    },
  ];

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
      setSelectedRows(new Set(paginatedData.map((evidence) => evidence.evidenceId)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.filename.trim()) {
      toast.error('Vui lòng nhập tên file chứng cứ');
      return;
    }
    if (!formData.addressText.trim()) {
      toast.error('Vui lòng nhập địa chỉ');
      return;
    }

    // Create new evidence item (simplified - in real app this would call API)
    const newEvidence: EvidenceItem = {
      evidenceId: `EV-${Date.now()}`,
      type: formData.type,
      status: 'Draft',
      scope: {
        province: formData.province || undefined,
        ward: formData.ward || undefined,
      },
      source: 'PortalUpload',
      capturedAt: new Date(formData.capturedAt).toISOString(),
      uploadedAt: new Date().toISOString(),
      location: {
        lat: parseFloat(formData.lat) || 10.8231,
        lng: parseFloat(formData.lng) || 106.6297,
        addressText: formData.addressText,
      },
      file: {
        storageKey: `storage/${Date.now()}`,
        filename: formData.filename,
        mimeType: 'application/octet-stream',
        sizeBytes: 0,
      },
      hashes: [],
      sensitivityLabel: formData.sensitivityLabel,
      submitter: {
        userId: 'current-user',
        unitId: 'unit-001',
      },
      review: {},
      links: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: formData.notes || undefined,
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : undefined,
    };

    setEvidenceItems([newEvidence, ...evidenceItems]);
    setIsAddDialogOpen(false);
    
    // Reset form
    setFormData({
      filename: '',
      type: 'PHOTO',
      capturedAt: new Date().toISOString().split('T')[0],
      province: '',
      ward: '',
      addressText: '',
      lat: '',
      lng: '',
      sensitivityLabel: 'Internal',
      notes: '',
      tags: '',
    });
    
    toast.success('Đã thêm chứng cứ mới thành công!');
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
      if (!validTypes.includes(file.type) && !file.name.endsWith('.csv') && !file.name.endsWith('.xlsx')) {
        toast.error('Vui lòng chọn file Excel (.xlsx) hoặc CSV (.csv)');
        return;
      }
      setImportFile(file);
    }
  };

  const handleImportSubmit = () => {
    if (!importFile) {
      toast.error('Vui lòng chọn file để nhập');
      return;
    }

    setIsImporting(true);
    setImportProgress(0);

    // Simulate import progress
    const interval = setInterval(() => {
      setImportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsImporting(false);
          setIsImportDialogOpen(false);
          setImportFile(null);
          setImportProgress(0);
          toast.success(`Đã nhập thành công ${importFile.name}`);
          // In real app, would parse file and add to evidenceItems
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleDownloadTemplate = () => {
    // In real app, would generate and download template file
    toast.success('Đã tải xuống file mẫu nhập liệu');
  };

  const handleExportSubmit = () => {
    let exportData: EvidenceItem[] = [];
    let exportCount = 0;

    switch (exportScope) {
      case 'all':
        exportData = evidenceItems;
        exportCount = evidenceItems.length;
        break;
      case 'filtered':
        exportData = filteredData;
        exportCount = filteredData.length;
        break;
      case 'selected':
        exportData = evidenceItems.filter(e => selectedRows.has(e.evidenceId));
        exportCount = selectedRows.size;
        break;
    }

    // In real app, would generate file with selected columns
    const formatName = exportFormat === 'excel' ? 'Excel' : exportFormat === 'csv' ? 'CSV' : 'PDF';
    toast.success(`Đã xuất ${exportCount} bản ghi sang ${formatName}`);
    setIsExportDialogOpen(false);
  };

  const toggleExportColumn = (column: string) => {
    setExportColumns(prev => 
      prev.includes(column) 
        ? prev.filter(c => c !== column)
        : [...prev, column]
    );
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingEvidence) return;

    // Validation
    if (!formData.filename.trim()) {
      toast.error('Vui lòng nhập tên file chứng cứ');
      return;
    }
    if (!formData.addressText.trim()) {
      toast.error('Vui lòng nhập địa chỉ');
      return;
    }

    // Update evidence item
    const updatedEvidence: EvidenceItem = {
      ...editingEvidence,
      type: formData.type,
      scope: {
        province: formData.province || undefined,
        ward: formData.ward || undefined,
      },
      location: {
        lat: parseFloat(formData.lat) || editingEvidence.location.lat,
        lng: parseFloat(formData.lng) || editingEvidence.location.lng,
        addressText: formData.addressText,
      },
      file: {
        ...editingEvidence.file,
        filename: formData.filename,
      },
      sensitivityLabel: formData.sensitivityLabel,
      capturedAt: new Date(formData.capturedAt).toISOString(),
      updatedAt: new Date().toISOString(),
      notes: formData.notes || undefined,
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : undefined,
    };

    setEvidenceItems(evidenceItems.map(e => 
      e.evidenceId === editingEvidence.evidenceId ? updatedEvidence : e
    ));
    
    setIsEditDialogOpen(false);
    setEditingEvidence(null);
    
    toast.success('Đã cập nhật chứng cứ thành công!');
  };

  const handleDeleteSubmit = () => {
    if (!deletingEvidence) return;

    // Remove evidence item
    setEvidenceItems(evidenceItems.filter(e => e.evidenceId !== deletingEvidence.evidenceId));
    
    setIsDeleteDialogOpen(false);
    setDeletingEvidence(null);
    
    toast.success('Đã xóa chứng cứ thành công!');
  };

  // Load data when opening edit dialog
  React.useEffect(() => {
    if (editingEvidence && isEditDialogOpen) {
      setFormData({
        filename: editingEvidence.file.filename,
        type: editingEvidence.type,
        capturedAt: new Date(editingEvidence.capturedAt).toISOString().split('T')[0],
        province: editingEvidence.scope.province || '',
        ward: editingEvidence.scope.ward || '',
        addressText: editingEvidence.location.addressText,
        lat: editingEvidence.location.lat.toString(),
        lng: editingEvidence.location.lng.toString(),
        sensitivityLabel: editingEvidence.sensitivityLabel,
        notes: editingEvidence.notes || '',
        tags: editingEvidence.tags?.join(', ') || '',
      });
    }
  }, [editingEvidence, isEditDialogOpen]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [scopeFilter, statusFilter, searchValue, activeFilter, entityTypeFilter]);

  return (
    <div className={styles.pageContainer}>
      <PageHeader
        breadcrumbs={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Kho chứng cứ' }
        ]}
        title="Kho chứng cứ"
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => {
              setSearchValue('');
              setScopeFilter('all');
              setStatusFilter('all');
              setActiveFilter(null);
              toast.success('Đã tải lại d liệu');
            }}>
              <RefreshCw size={16} />
              Tải lại
            </Button>
            <Button variant="outline" size="sm" onClick={() => {
              setIsImportDialogOpen(true);
            }}>
              <Upload size={16} />
              Nhập dữ liệu
            </Button>
            <Button variant="outline" size="sm" onClick={() => {
              setIsExportDialogOpen(true);
            }}>
              <Download size={16} />
              Xuất dữ liệu
            </Button>
            <Button size="sm" onClick={() => {
              setIsAddDialogOpen(true);
            }}>
              <Plus size={16} />
              Thêm mới
            </Button>
          </>
        }
      />

      <div className={styles.summaryContainer}>
        <div className={styles.summaryGrid}>
          <SummaryCard
            label="Nguồn tin"
            value={stats.leadLinks}
            icon={Users}
            variant="info"
            onClick={() => setEntityTypeFilter(entityTypeFilter === 'LEAD' ? null : 'LEAD')}
            active={entityTypeFilter === 'LEAD'}
          />
          <SummaryCard
            label="Rủi ro"
            value={stats.riskLinks}
            icon={TriangleAlert}
            variant="warning"
            onClick={() => setEntityTypeFilter(entityTypeFilter === 'RISK' ? null : 'RISK')}
            active={entityTypeFilter === 'RISK'}
          />
          <SummaryCard
            label="Phiên kiểm tra"
            value={stats.taskLinks}
            icon={ClipboardList}
            variant="success"
            onClick={() => setEntityTypeFilter(entityTypeFilter === 'TASK' ? null : 'TASK')}
            active={entityTypeFilter === 'TASK'}
          />
          <SummaryCard
            label="Cửa hàng"
            value={stats.storeLinks}
            icon={Store}
            variant="neutral"
            onClick={() => setEntityTypeFilter(entityTypeFilter === 'STORE' ? null : 'STORE')}
            active={entityTypeFilter === 'STORE'}
          />
        </div>

        <FilterActionBar
          filters={
            <>
              <Select value={scopeFilter} onValueChange={setScopeFilter}>
                <SelectTrigger style={{ width: '200px' }}>
                  <SelectValue placeholder="-- Địa bàn --" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả địa bàn</SelectItem>
                  <SelectItem value="Quận 1">Quận 1</SelectItem>
                  <SelectItem value="Quận 3">Quận 3</SelectItem>
                  <SelectItem value="Quận 5">Quận 5</SelectItem>
                  <SelectItem value="Quận 7">Quận 7</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger style={{ width: '200px' }}>
                  <SelectValue placeholder="-- Trạng thái --" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="Draft">Nháp</SelectItem>
                  <SelectItem value="Submitted">Đã nộp</SelectItem>
                  <SelectItem value="InReview">Đang xét duyệt</SelectItem>
                  <SelectItem value="Approved">Đã duyệt</SelectItem>
                  <SelectItem value="Rejected">Bị từ chối</SelectItem>
                  <SelectItem value="Sealed">Đã niêm phong</SelectItem>
                </SelectContent>
              </Select>
            </>
          }
          searchInput={
            <SearchInput
              placeholder="Tên chứng cứ"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              style={{ width: '666px' }}
            />
          }
        />
      </div>

      <div className={styles.tableContainer}>
        <Card>
          <CardContent className={styles.tableCard}>
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
              getRowId={(evidence) => evidence.evidenceId}
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
          </CardContent>
        </Card>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[700px]" style={{ maxHeight: '90vh', overflow: 'auto' }}>
          <DialogHeader>
            <DialogTitle>Thêm mới chứng cứ</DialogTitle>
            <DialogDescription>
              Điền thông tin chi tiết để tạo chứng cứ mới vào hệ thống
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} style={{ paddingTop: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Thông tin cơ bản */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ 
                  fontSize: 'var(--text-md)', 
                  fontWeight: 600,
                  margin: 0,
                  paddingBottom: '8px',
                  borderBottom: '1px solid var(--border)',
                }}>
                  Thông tin cơ bản
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <Label htmlFor="filename">Tên file chứng cứ <span style={{ color: '#ef4444' }}>*</span></Label>
                    <Input
                      id="filename"
                      value={formData.filename}
                      onChange={(e) => setFormData({ ...formData, filename: e.target.value })}
                      placeholder="Nhập tên file chứng cứ"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="type">Loại chứng cứ</Label>
                    <Select 
                      value={formData.type} 
                      onValueChange={(value) => setFormData({ ...formData, type: value as EvidenceType })}
                    >
                      <SelectTrigger id="type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PHOTO">Ảnh</SelectItem>
                        <SelectItem value="VIDEO">Video</SelectItem>
                        <SelectItem value="AUDIO">Âm thanh</SelectItem>
                        <SelectItem value="DOC">Tài liệu</SelectItem>
                        <SelectItem value="PDF">PDF</SelectItem>
                        <SelectItem value="OTHER">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="sensitivityLabel">Mức độ bảo mật</Label>
                    <Select 
                      value={formData.sensitivityLabel} 
                      onValueChange={(value) => setFormData({ ...formData, sensitivityLabel: value as SensitivityLabel })}
                    >
                      <SelectTrigger id="sensitivityLabel">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Public">Công khai</SelectItem>
                        <SelectItem value="Internal">Nội bộ</SelectItem>
                        <SelectItem value="Restricted">Hạn chế</SelectItem>
                        <SelectItem value="Secret-lite">Bảo mật</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div style={{ gridColumn: '1 / -1' }}>
                    <Label htmlFor="capturedAt">Ngày thu thập</Label>
                    <Input
                      id="capturedAt"
                      type="date"
                      value={formData.capturedAt}
                      onChange={(e) => setFormData({ ...formData, capturedAt: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Địa bàn */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ 
                  fontSize: 'var(--text-md)', 
                  fontWeight: 600,
                  margin: 0,
                  paddingBottom: '8px',
                  borderBottom: '1px solid var(--border)',
                }}>
                  Địa bàn quản lý
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                  <div>
                    <Label htmlFor="province">Tỉnh/Thành phố</Label>
                    <Input
                      id="province"
                      value={formData.province}
                      onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                      placeholder="TP. Hồ Chí Minh"
                    />
                  </div>

                  <div>
                    <Label htmlFor="ward">Phường/Xã</Label>
                    <Input
                      id="ward"
                      value={formData.ward}
                      onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                      placeholder="Phường Bến Nghé"
                    />
                  </div>
                </div>
              </div>

              {/* Vị trí */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ 
                  fontSize: 'var(--text-md)', 
                  fontWeight: 600,
                  margin: 0,
                  paddingBottom: '8px',
                  borderBottom: '1px solid var(--border)',
                }}>
                  Vị trí thu thập
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <Label htmlFor="addressText">Địa chỉ <span style={{ color: '#ef4444' }}>*</span></Label>
                    <Input
                      id="addressText"
                      value={formData.addressText}
                      onChange={(e) => setFormData({ ...formData, addressText: e.target.value })}
                      placeholder="Nhập địa chỉ cụ thể"
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <Label htmlFor="lat">Vĩ độ (Latitude)</Label>
                      <Input
                        id="lat"
                        type="number"
                        step="any"
                        value={formData.lat}
                        onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                        placeholder="10.7769"
                      />
                    </div>

                    <div>
                      <Label htmlFor="lng">Kinh độ (Longitude)</Label>
                      <Input
                        id="lng"
                        type="number"
                        step="any"
                        value={formData.lng}
                        onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                        placeholder="106.7009"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Thông tin bổ sung */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ 
                  fontSize: 'var(--text-md)', 
                  fontWeight: 600,
                  margin: 0,
                  paddingBottom: '8px',
                  borderBottom: '1px solid var(--border)',
                }}>
                  Thông tin bổ sung
                </h3>
                
                <div>
                  <Label htmlFor="notes">Ghi chú</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Nhập ghi chú, mô tả chi tiết về chứng cứ..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="tags">Thẻ (Tags)</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="Nhập các thẻ, phân cách bằng dấu phẩy (vd: vi phạm, ATTP, cơ sở A)"
                  />
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Sử dụng dấu phẩy để phân cách các thẻ
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div style={{ 
                display: 'flex', 
                gap: '12px', 
                justifyContent: 'flex-end',
                paddingTop: '8px',
                borderTop: '1px solid var(--border)',
              }}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Hủy bỏ
                </Button>
                <Button type="submit">
                  <Plus size={16} />
                  Tạo chứng cứ
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent className="sm:max-w-[540px]">
          <DialogHeader>
            <DialogTitle>Nhập dữ liệu chứng cứ</DialogTitle>
            <DialogDescription>
              Tải lên file Excel hoặc CSV chứa dữ liệu chứng cứ để nhập vào hệ thống
            </DialogDescription>
          </DialogHeader>
          
          <div style={{ paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Download template */}
            <div style={{
              padding: '16px',
              background: '#3b82f615',
              border: '1px solid #3b82f630',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}>
              <FileSpreadsheet size={24} style={{ color: '#3b82f6', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: '4px' }}>
                  Tải file mẫu
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                  Tải về file mẫu Excel để xem cấu trúc dữ liệu yêu cầu
                </div>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={handleDownloadTemplate}>
                <Download size={14} />
                Tải mẫu
              </Button>
            </div>

            {/* File upload */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Label htmlFor="importFile">Chọn file để nhập</Label>
              <Input
                id="importFile"
                type="file"
                onChange={handleImportFile}
                accept=".csv, .xlsx, .xls"
                disabled={isImporting}
              />
              {importFile && (
                <div style={{
                  padding: '12px',
                  background: 'var(--color-success)10',
                  border: '1px solid var(--color-success)30',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 'var(--text-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  <File size={16} style={{ color: 'var(--color-success)' }} />
                  <span style={{ flex: 1 }}>{importFile.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setImportFile(null)}
                    disabled={isImporting}
                  >
                    <X size={14} />
                  </Button>
                </div>
              )}
            </div>

            {/* Progress */}
            {isImporting && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)' }}>
                  <span>Đang nhập dữ liệu...</span>
                  <span style={{ fontWeight: 600 }}>{importProgress}%</span>
                </div>
                <div style={{
                  width: '100%',
                  height: '8px',
                  background: 'var(--border)',
                  borderRadius: 'var(--radius-full)',
                  overflow: 'hidden',
                }}>
                  <div
                    style={{
                      height: '100%',
                      background: 'var(--color-primary)',
                      borderRadius: 'var(--radius-full)',
                      transition: 'width 0.3s ease',
                      width: `${importProgress}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Actions */}
            <div style={{ 
              display: 'flex', 
              gap: '12px', 
              justifyContent: 'flex-end',
              paddingTop: '8px',
              borderTop: '1px solid var(--border)',
            }}>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsImportDialogOpen(false);
                  setImportFile(null);
                }}
                disabled={isImporting}
              >
                Hủy bỏ
              </Button>
              <Button 
                onClick={handleImportSubmit} 
                disabled={!importFile || isImporting}
              >
                <Upload size={16} />
                Bắt đầu nhập
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent className="sm:max-w-[540px]">
          <DialogHeader>
            <DialogTitle>Xuất dữ liệu chứng cứ</DialogTitle>
            <DialogDescription>
              Chọn định dạng, phạm vi và các cột dữ liệu cần xuất
            </DialogDescription>
          </DialogHeader>
          
          <div style={{ paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Export format */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ 
                fontSize: 'var(--text-md)', 
                fontWeight: 600,
                margin: 0,
                paddingBottom: '8px',
                borderBottom: '1px solid var(--border)',
              }}>
                Định dạng file
              </h3>
              
              <Select 
                value={exportFormat} 
                onValueChange={(value) => setExportFormat(value as 'excel' | 'csv' | 'pdf')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excel">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FileSpreadsheet size={16} />
                      Excel (.xlsx)
                    </div>
                  </SelectItem>
                  <SelectItem value="csv">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FileType size={16} />
                      CSV (.csv)
                    </div>
                  </SelectItem>
                  <SelectItem value="pdf">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <File size={16} />
                      PDF (.pdf)
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Export scope */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ 
                fontSize: 'var(--text-md)', 
                fontWeight: 600,
                margin: 0,
                paddingBottom: '8px',
                borderBottom: '1px solid var(--border)',
              }}>
                Phạm vi dữ liệu
              </h3>
              
              <Select 
                value={exportScope} 
                onValueChange={(value) => setExportScope(value as 'all' | 'filtered' | 'selected')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả bản ghi ({evidenceItems.length})</SelectItem>
                  <SelectItem value="filtered">Bản ghi đã lọc ({filteredData.length})</SelectItem>
                  <SelectItem value="selected">
                    Bản ghi đã chọn ({selectedRows.size})
                    {selectedRows.size === 0 && ' - Chưa chọn'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Export columns */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ 
                fontSize: 'var(--text-md)', 
                fontWeight: 600,
                margin: 0,
                paddingBottom: '8px',
                borderBottom: '1px solid var(--border)',
              }}>
                Cột dữ liệu xuất
              </h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                maxHeight: '200px',
                overflow: 'auto',
                padding: '4px',
              }}>
                {[
                  { key: 'evidenceId', label: 'Mã chứng cứ' },
                  { key: 'filename', label: 'Tên file' },
                  { key: 'type', label: 'Loại' },
                  { key: 'status', label: 'Trạng thái' },
                  { key: 'scope', label: 'Địa bàn' },
                  { key: 'capturedAt', label: 'Ngày thu thập' },
                  { key: 'uploadedAt', label: 'Ngày tải lên' },
                  { key: 'sensitivityLabel', label: 'Độ bảo mật' },
                ].map(column => (
                  <div key={column.key} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Checkbox
                      id={`export-col-${column.key}`}
                      checked={exportColumns.includes(column.key)}
                      onCheckedChange={() => toggleExportColumn(column.key)}
                    />
                    <Label htmlFor={`export-col-${column.key}`} style={{ cursor: 'pointer', margin: 0 }}>
                      {column.label}
                    </Label>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                Đã chọn {exportColumns.length} cột
              </div>
            </div>

            {/* Actions */}
            <div style={{ 
              display: 'flex', 
              gap: '12px', 
              justifyContent: 'flex-end',
              paddingTop: '8px',
              borderTop: '1px solid var(--border)',
            }}>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsExportDialogOpen(false)}
              >
                Hủy bỏ
              </Button>
              <Button onClick={handleExportSubmit}>
                <Download size={16} />
                Xuất dữ liệu
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[700px]" style={{ maxHeight: '90vh', overflow: 'auto' }}>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa chứng cứ</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin chi tiết của chứng cứ
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleEditSubmit} style={{ paddingTop: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Thông tin cơ bản */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ 
                  fontSize: 'var(--text-md)', 
                  fontWeight: 600,
                  margin: 0,
                  paddingBottom: '8px',
                  borderBottom: '1px solid var(--border)',
                }}>
                  Thông tin cơ bản
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <Label htmlFor="filename">Tên file chứng cứ <span style={{ color: '#ef4444' }}>*</span></Label>
                    <Input
                      id="filename"
                      value={formData.filename}
                      onChange={(e) => setFormData({ ...formData, filename: e.target.value })}
                      placeholder="Nhập tên file chứng cứ"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="type">Loại chứng cứ</Label>
                    <Select 
                      value={formData.type} 
                      onValueChange={(value) => setFormData({ ...formData, type: value as EvidenceType })}
                    >
                      <SelectTrigger id="type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PHOTO">Ảnh</SelectItem>
                        <SelectItem value="VIDEO">Video</SelectItem>
                        <SelectItem value="AUDIO">Âm thanh</SelectItem>
                        <SelectItem value="DOC">Tài liệu</SelectItem>
                        <SelectItem value="PDF">PDF</SelectItem>
                        <SelectItem value="OTHER">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="sensitivityLabel">Mức độ bảo mật</Label>
                    <Select 
                      value={formData.sensitivityLabel} 
                      onValueChange={(value) => setFormData({ ...formData, sensitivityLabel: value as SensitivityLabel })}
                    >
                      <SelectTrigger id="sensitivityLabel">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Public">Công khai</SelectItem>
                        <SelectItem value="Internal">Nội bộ</SelectItem>
                        <SelectItem value="Restricted">Hạn chế</SelectItem>
                        <SelectItem value="Secret-lite">Bảo mật</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div style={{ gridColumn: '1 / -1' }}>
                    <Label htmlFor="capturedAt">Ngày thu thập</Label>
                    <Input
                      id="capturedAt"
                      type="date"
                      value={formData.capturedAt}
                      onChange={(e) => setFormData({ ...formData, capturedAt: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Địa bàn */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ 
                  fontSize: 'var(--text-md)', 
                  fontWeight: 600,
                  margin: 0,
                  paddingBottom: '8px',
                  borderBottom: '1px solid var(--border)',
                }}>
                  Địa bàn quản lý
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                  <div>
                    <Label htmlFor="province">Tỉnh/Thành phố</Label>
                    <Input
                      id="province"
                      value={formData.province}
                      onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                      placeholder="TP. Hồ Chí Minh"
                    />
                  </div>

                  <div>
                    <Label htmlFor="ward">Phường/Xã</Label>
                    <Input
                      id="ward"
                      value={formData.ward}
                      onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                      placeholder="Phường Bến Nghé"
                    />
                  </div>
                </div>
              </div>

              {/* Vị trí */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ 
                  fontSize: 'var(--text-md)', 
                  fontWeight: 600,
                  margin: 0,
                  paddingBottom: '8px',
                  borderBottom: '1px solid var(--border)',
                }}>
                  Vị trí thu thập
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <Label htmlFor="addressText">Địa chỉ <span style={{ color: '#ef4444' }}>*</span></Label>
                    <Input
                      id="addressText"
                      value={formData.addressText}
                      onChange={(e) => setFormData({ ...formData, addressText: e.target.value })}
                      placeholder="Nhập địa chỉ cụ thể"
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <Label htmlFor="lat">Vĩ độ (Latitude)</Label>
                      <Input
                        id="lat"
                        type="number"
                        step="any"
                        value={formData.lat}
                        onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                        placeholder="10.7769"
                      />
                    </div>

                    <div>
                      <Label htmlFor="lng">Kinh độ (Longitude)</Label>
                      <Input
                        id="lng"
                        type="number"
                        step="any"
                        value={formData.lng}
                        onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                        placeholder="106.7009"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Thông tin bổ sung */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ 
                  fontSize: 'var(--text-md)', 
                  fontWeight: 600,
                  margin: 0,
                  paddingBottom: '8px',
                  borderBottom: '1px solid var(--border)',
                }}>
                  Thông tin bổ sung
                </h3>
                
                <div>
                  <Label htmlFor="notes">Ghi chú</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Nhập ghi chú, mô tả chi tiết về chứng cứ..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="tags">Thẻ (Tags)</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="Nhập các thẻ, phân cách bằng dấu phẩy (vd: vi phạm, ATTP, cơ sở A)"
                  />
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Sử dụng dấu phẩy để phân cách các thẻ
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div style={{ 
                display: 'flex', 
                gap: '12px', 
                justifyContent: 'flex-end',
                paddingTop: '8px',
                borderTop: '1px solid var(--border)',
              }}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Hủy bỏ
                </Button>
                <Button type="submit">
                  <Plus size={16} />
                  Cập nhật chứng cứ
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[540px]">
          <DialogHeader>
            <DialogTitle>Xóa chứng cứ</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa chứng cứ này không?
            </DialogDescription>
          </DialogHeader>
          
          <div style={{ paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Evidence details */}
            {deletingEvidence && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <File size={24} style={{ color: '#ef4444' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: '4px' }}>
                      {deletingEvidence.file.filename}
                    </div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                      {deletingEvidence.evidenceId}
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                  {deletingEvidence.location.addressText}
                </div>
              </div>
            )}

            {/* Actions */}
            <div style={{ 
              display: 'flex', 
              gap: '12px', 
              justifyContent: 'flex-end',
              paddingTop: '8px',
              borderTop: '1px solid var(--border)',
            }}>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsDeleteDialogOpen(false);
                  setDeletingEvidence(null);
                }}
              >
                Hủy bỏ
              </Button>
              <Button 
                onClick={handleDeleteSubmit} 
                variant="destructive"
              >
                <Trash2 size={16} />
                Xóa chứng cứ
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}