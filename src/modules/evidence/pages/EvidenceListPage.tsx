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
import PageHeader from '@/layouts/PageHeader';
import DataTable, { Column } from '@/components/ui-kit/DataTable';
import { SearchInput } from '@/components/ui-kit/SearchInput';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import SummaryCard from '@/components/patterns/SummaryCard';
import BulkActionBar, { BulkAction } from '@/components/patterns/BulkActionBar';
import FilterActionBar from '@/components/patterns/FilterActionBar';
import ActionColumn, { CommonActions, Action } from '@/components/patterns/ActionColumn';
import TableFooter from '@/components/ui-kit/TableFooter';
import styles from './EvidenceListPage.module.css';
import { generateMockEvidenceItems } from '@/utils/data/evidence-mock-data';
import { EvidenceItem, getStatusLabel, getTypeLabel, getStatusColor } from '@/types/evidence.types';
import { EvidenceType, SensitivityLabel } from '@/types/evidence.types';
import { exportToCSV, exportToExcel, exportToJSON, getExportFilename } from '@/utils/exportUtils';

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

  // Upload state
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadingEvidence, setUploadingEvidence] = useState<EvidenceItem | null>(null);

  // Import state
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importProgress, setImportProgress] = useState(0);
  const [isImporting, setIsImporting] = useState(false);

  // Export state
  const [exportFormat, setExportFormat] = useState<'excel' | 'csv' | 'json'>('excel');
  const [exportScope, setExportScope] = useState<'all' | 'filtered' | 'selected'>('filtered');
  const [exportColumns, setExportColumns] = useState<string[]>([
    'evidenceId',
    'evidenceName',
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
    evidenceName: '',
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
      {
        label: 'Tải lên',
        icon: <Upload size={16} />,
        onClick: () => {
          setUploadingEvidence(evidence);
          setIsUploadDialogOpen(true);
        },
        priority: 8,
      },
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
      filtered = filtered.filter(e => {
        const firstFilename = e.files?.[0]?.filename || '';
        const evidenceName = e.evidenceName || '';
        return firstFilename.toLowerCase().includes(searchValue.toLowerCase()) ||
          e.evidenceId.toLowerCase().includes(searchValue.toLowerCase()) ||
          evidenceName.toLowerCase().includes(searchValue.toLowerCase());
      });
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
      label: 'Chuyển sang INS',
      onClick: () => {
        toast.success(`Đang chuyển ${selectedRows.size} chứng cứ sang INS...`);
        // TODO: Implement transfer to INS logic
        setTimeout(() => {
          toast.success('Đã chuyển chứng cứ sang INS thành công!');
          setSelectedRows(new Set());
        }, 1500);
      },
      variant: 'default',
      icon: <ClipboardList size={16} />,
    },
    {
      label: 'Xuất đã chọn',
      onClick: () => {
        if (selectedRows.size === 0) {
          toast.error('Vui lòng chọn ít nhất một bản ghi');
          return;
        }
        setExportScope('selected');
        setIsExportDialogOpen(true);
      },
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
      key: 'evidenceName',
      label: 'Tên chứng cứ',
      sortable: true,
      render: (evidence) => (
        <div style={{ 
          fontSize: 'var(--text-sm)', 
          fontWeight: 500,
          color: 'var(--text-primary)' 
        }}>
          {evidence.evidenceName || <span style={{ color: 'var(--text-tertiary)', fontStyle: 'italic' }}>Chưa đặt tên</span>}
        </div>
      ),
    },
    {
      key: 'file',
      label: 'Tên file',
      sortable: true,
      render: (evidence) => {
        const files = evidence.files || [];
        
        if (files.length === 0 || !files[0]) {
          return (
            <div>
              <div className={styles.evidenceName}>Chưa có file</div>
              <div className={styles.evidenceType}>{getTypeLabel(evidence.type)}</div>
            </div>
          );
        }
        
        if (files.length === 1) {
          return (
            <div>
              <div className={styles.evidenceName}>{files[0]?.filename || 'Chưa rõ tên'}</div>
              <div className={styles.evidenceType}>{getTypeLabel(evidence.type)}</div>
            </div>
          );
        }
        
        // Multiple files
        return (
          <div>
            <div className={styles.evidenceName}>{files[0]?.filename || 'Chưa rõ tên'}</div>
            <div className={styles.evidenceType}>
              {getTypeLabel(evidence.type)} • {files.length} file
            </div>
          </div>
        );
      },
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
        
        // Display entity IDs (e.g., CASE-2026-048, RISK-2026-001)
        const entityIds = links.map(link => link.entityId);
        
        // If more than 2 links, show first 2 + count
        if (entityIds.length > 2) {
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ 
                fontSize: 'var(--text-sm)', 
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-mono)',
              }}>
                {entityIds.slice(0, 2).join(', ')}
              </span>
              <span style={{ 
                fontSize: 'var(--text-xs)', 
                color: 'var(--text-tertiary)',
              }}>
                +{entityIds.length - 2} khác
              </span>
            </div>
          );
        }
        
        return (
          <span style={{ 
            fontSize: 'var(--text-sm)', 
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-mono)',
          }}>
            {entityIds.join(', ')}
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
      evidenceName: formData.evidenceName || undefined,
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
      evidenceName: '',
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

  const handleExportSubmit = async () => {
    try {
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

      if (exportData.length === 0) {
        toast.error('Không có dữ liệu để xuất');
        return;
      }

      if (exportColumns.length === 0) {
        toast.error('Vui lòng chọn ít nhất một cột để xuất');
        return;
      }

      toast.loading('Đang xuất dữ liệu...');

      // Generate filename with timestamp
      const filename = getExportFilename(
        exportFormat === 'excel' ? 'excel' : exportFormat === 'csv' ? 'csv' : 'json',
        'evidence-export'
      );

      // Export based on format
      switch (exportFormat) {
        case 'excel':
          exportToExcel(exportData, exportColumns, filename);
          break;
        case 'csv':
          exportToCSV(exportData, exportColumns, filename);
          break;
        default:
          exportToJSON(exportData, exportColumns, filename);
          break;
      }

      const formatName = exportFormat === 'excel' ? 'Excel' : exportFormat === 'csv' ? 'CSV' : 'JSON';
      toast.success(`Đã xuất ${exportCount} bản ghi sang ${formatName}`);
      setIsExportDialogOpen(false);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Lỗi khi xuất dữ liệu');
    }
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
      evidenceName: formData.evidenceName || undefined,
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
      files: (editingEvidence.files || []).map((f, idx) => 
        idx === 0 ? { ...f, filename: formData.filename } : f
      ),
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

  // Upload handlers
  const handleUploadFiles = (files: FileList | null) => {
    if (!files) return;
    
    const fileArray = Array.from(files);
    const validFiles: File[] = [];
    
    // Validate file types
    fileArray.forEach(file => {
      const validTypes = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'video/mp4', 'video/quicktime', 'video/x-msvideo',
        'audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/x-m4a',
        'application/pdf',
        'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/zip', 'application/x-zip-compressed'
      ];
      
      if (validTypes.includes(file.type) || file.name.match(/\.(jpg|jpeg|png|gif|webp|mp4|mov|avi|mp3|wav|m4a|pdf|doc|docx|zip)$/i)) {
        validFiles.push(file);
      } else {
        toast.error(`File không được hỗ trợ: ${file.name}`);
      }
    });
    
    setUploadFiles(prev => [...prev, ...validFiles]);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUploadFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleUploadFiles(e.target.files);
    }
  };

  const removeUploadFile = (index: number) => {
    setUploadFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileType = (file: File): EvidenceType => {
    if (file.type.startsWith('image/')) return 'PHOTO';
    if (file.type.startsWith('video/')) return 'VIDEO';
    if (file.type.startsWith('audio/')) return 'AUDIO';
    if (file.type === 'application/pdf') return 'PDF';
    if (file.type.includes('document') || file.type.includes('word')) return 'DOC';
    return 'OTHER';
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleUploadSubmit = () => {
    if (uploadFiles.length === 0) {
      toast.error('Vui lòng chọn file để tải lên');
      return;
    }

    if (!uploadingEvidence) {
      toast.error('Không tìm thấy bản ghi chứng cứ');
      return;
    }

    setIsUploading(true);
    
    // Support multiple files upload
    const totalFiles = uploadFiles.length;
    let completedFiles = 0;
    
    uploadFiles.forEach((file, index) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(prev => ({
          ...prev,
          [file.name]: progress
        }));
        
        if (progress >= 100) {
          clearInterval(interval);
          completedFiles++;
          
          // When all files are uploaded, update the evidence item
          if (completedFiles === totalFiles) {
            setTimeout(() => {
              // Create new file entries
              const newFiles = uploadFiles.map((f, idx) => ({
                storageKey: `storage/${Date.now()}-${idx}/${f.name}`,
                filename: f.name,
                mimeType: f.type,
                sizeBytes: f.size,
              }));
              
              const updatedEvidence: EvidenceItem = {
                ...uploadingEvidence,
                files: [...uploadingEvidence.files, ...newFiles],
                uploadedAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              };
              
              setEvidenceItems(evidenceItems.map(e => 
                e.evidenceId === uploadingEvidence.evidenceId ? updatedEvidence : e
              ));
              
              setIsUploading(false);
              setIsUploadDialogOpen(false);
              setUploadFiles([]);
              setUploadProgress({});
              setUploadingEvidence(null);
              toast.success(`Đã tải lên ${totalFiles} file thành công!`);
            }, 500);
          }
        }
      }, 100);
    });
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
      const firstFile = editingEvidence.files?.[0];
      setFormData({
        evidenceName: editingEvidence.evidenceName || '',
        filename: firstFile?.filename || 'Chưa có file',
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
                  <SelectItem value="Phường 1">Phường 1</SelectItem>
                  <SelectItem value="Phường 3">Phường 3</SelectItem>
                  <SelectItem value="Phường 5">Phường 5</SelectItem>
                  <SelectItem value="Phường 7">Phường 7</SelectItem>
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
                    <Label htmlFor="evidenceName">Tên chứng cứ</Label>
                    <Input
                      id="evidenceName"
                      value={formData.evidenceName}
                      onChange={(e) => setFormData({ ...formData, evidenceName: e.target.value })}
                      placeholder="Ví dụ: Vi phạm vệ sinh tại nhà hàng ABC"
                    />
                  </div>

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
                onValueChange={(value) => setExportFormat(value as 'excel' | 'csv' | 'json')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excel">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FileSpreadsheet size={16} />
                      Excel (.xls)
                    </div>
                  </SelectItem>
                  <SelectItem value="csv">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FileType size={16} />
                      CSV (.csv)
                    </div>
                  </SelectItem>
                  <SelectItem value="json">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <File size={16} />
                      JSON (.json)
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
                  { key: 'evidenceName', label: 'Tên chứng cứ' },
                  { key: 'filename', label: 'Tên file' },
                  { key: 'type', label: 'Loại' },
                  { key: 'status', label: 'Trạng thái' },
                  { key: 'scope', label: 'Địa bàn' },
                  { key: 'capturedAt', label: 'Ngày thu thập' },
                  { key: 'uploadedAt', label: 'Ngày tải lên' },
                  { key: 'sensitivityLabel', label: 'Độ bảo mật' },
                  { key: 'submitter', label: 'Người nộp' },
                  { key: 'source', label: 'Nguồn' },
                  { key: 'fileCount', label: 'Số lượng file' },
                  { key: 'totalSize', label: 'Dung lượng' },
                  { key: 'hash', label: 'Hash (SHA-256)' },
                  { key: 'location', label: 'Địa điểm' },
                  { key: 'linkedEntities', label: 'Liên kết' },
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
                    <Label htmlFor="evidenceName-edit">Tên chứng cứ</Label>
                    <Input
                      id="evidenceName-edit"
                      value={formData.evidenceName}
                      onChange={(e) => setFormData({ ...formData, evidenceName: e.target.value })}
                      placeholder="Ví dụ: Vi phạm vệ sinh tại nhà hàng ABC"
                    />
                  </div>

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
                      {deletingEvidence.files?.[0]?.filename || 'Chưa có file'}
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

      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="sm:max-w-[600px]" style={{ maxHeight: '90vh', overflow: 'auto' }}>
          <DialogHeader>
            <DialogTitle>Tải lên file</DialogTitle>
            <DialogDescription>
              Tải lên file mới cho bản ghi chứng cứ này. Có thể tải lên nhiều file cùng lúc.
            </DialogDescription>
          </DialogHeader>
          
          <div style={{ paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Current Evidence Info */}
            {uploadingEvidence && (
              <div style={{
                padding: '16px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
              }}>
                <div style={{
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  marginBottom: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}>
                  Bản ghi chứng cứ
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <FileText size={20} style={{ color: 'var(--color-primary)' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: '4px' }}>
                      {uploadingEvidence.evidenceId} • {getTypeLabel(uploadingEvidence.type)}
                    </div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                      {uploadingEvidence.files.length} file hiện có
                    </div>
                  </div>
                </div>
                
                {/* Show existing files */}
                <div style={{ 
                  fontSize: 'var(--text-xs)',
                  color: 'var(--text-tertiary)',
                  paddingTop: '8px',
                  borderTop: '1px solid var(--border)',
                }}>
                  {uploadingEvidence.files.slice(0, 3).map((f, idx) => (
                    <div key={idx} style={{ marginBottom: '4px' }}>• {f?.filename || 'Chưa rõ tên'}</div>
                  ))}
                  {uploadingEvidence.files.length > 3 && (
                    <div style={{ fontStyle: 'italic' }}>+{uploadingEvidence.files.length - 3} file khác...</div>
                  )}
                </div>
              </div>
            )}
            
            {/* Drag & Drop Zone */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              style={{
                border: `2px dashed ${dragActive ? 'var(--color-primary)' : 'var(--border)'}`,
                borderRadius: 'var(--radius-lg)',
                padding: '40px',
                textAlign: 'center',
                backgroundColor: dragActive ? 'var(--color-primary)10' : 'var(--bg-secondary)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onClick={() => document.getElementById('upload-file-input')?.click()}
            >
              <input
                id="upload-file-input"
                type="file"
                multiple
                onChange={handleFileInputChange}
                style={{ display: 'none' }}
                accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.zip"
                disabled={isUploading}
              />
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--color-primary)15',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Upload size={32} style={{ color: 'var(--color-primary)' }} />
                </div>
                
                <div>
                  <div style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: '8px' }}>
                    {dragActive ? 'Thả file tại đây' : 'Chọn file'}
                  </div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                    Hỗ trợ: Ảnh, Video, Audio, PDF, DOC, ZIP
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                    Có thể chọn nhiều file • Tối đa 100MB/file
                  </div>
                </div>
              </div>
            </div>

            {/* Selected File */}
            {uploadFiles.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: '8px',
                  borderBottom: '1px solid var(--border)',
                }}>
                  <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 600, margin: 0 }}>
                    File đã chọn ({uploadFiles.length})
                  </h3>
                  {!isUploading && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setUploadFiles([])}
                    >
                      Xóa tất cả
                    </Button>
                  )}
                </div>
                
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}>
                  {uploadFiles.map((file, index) => {
                    const progress = uploadProgress[file.name] || 0;
                    const isComplete = progress >= 100;
                    const fileType = getFileType(file);
                    
                    return (
                      <div
                        key={`${file.name}-${index}`}
                        style={{
                          padding: '12px',
                          border: '1px solid var(--border)',
                          borderRadius: 'var(--radius-md)',
                          background: 'var(--bg-primary)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          {/* File Icon */}
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: 'var(--radius-sm)',
                            background: isComplete ? 'var(--color-success)15' : 'var(--bg-secondary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}>
                            {isComplete ? (
                              <CheckCircle size={20} style={{ color: 'var(--color-success)' }} />
                            ) : fileType === 'PHOTO' ? (
                              <FileText size={20} style={{ color: 'var(--color-primary)' }} />
                            ) : fileType === 'VIDEO' ? (
                              <File size={20} style={{ color: 'var(--color-info)' }} />
                            ) : (
                              <FileText size={20} style={{ color: 'var(--text-secondary)' }} />
                            )}
                          </div>
                          
                          {/* File Info */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                              fontSize: 'var(--text-sm)',
                              fontWeight: 500,
                              marginBottom: '4px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}>
                              {file.name}
                            </div>
                            <div style={{
                              fontSize: 'var(--text-xs)',
                              color: 'var(--text-secondary)',
                              display: 'flex',
                              gap: '12px',
                            }}>
                              <span>{formatFileSize(file.size)}</span>
                              <span>•</span>
                              <span>{getTypeLabel(fileType)}</span>
                            </div>
                            
                            {/* Progress Bar */}
                            {isUploading && (
                              <div style={{ marginTop: '8px' }}>
                                <div style={{
                                  width: '100%',
                                  height: '4px',
                                  background: 'var(--border)',
                                  borderRadius: 'var(--radius-full)',
                                  overflow: 'hidden',
                                }}>
                                  <div
                                    style={{
                                      height: '100%',
                                      background: isComplete ? 'var(--color-success)' : 'var(--color-primary)',
                                      borderRadius: 'var(--radius-full)',
                                      transition: 'width 0.3s ease',
                                      width: `${progress}%`,
                                    }}
                                  />
                                </div>
                                <div style={{
                                  fontSize: 'var(--text-xs)',
                                  color: 'var(--text-tertiary)',
                                  marginTop: '4px',
                                }}>
                                  {isComplete ? 'Hoàn thành' : `Đang tải lên... ${progress}%`}
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {/* Remove Button */}
                          {!isUploading && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeUploadFile(index)}
                            >
                              <X size={16} />
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Info Message */}
            <div style={{
              padding: '12px 16px',
              background: '#f59e0b15',
              border: '1px solid #f59e0b30',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--text-sm)',
              color: 'var(--text-secondary)',
            }}>
              <div style={{ fontWeight: 600, marginBottom: '4px', color: '#f59e0b' }}>
                ⚠️ Lưu ý quan trọng
              </div>
              <ul style={{ margin: '4px 0 0 20px', padding: 0 }}>
                <li>File mới sẽ <strong>thay thế hoàn toàn</strong> file hiện tại</li>
                <li>Loại chứng cứ (EvidenceType) sẽ được cập nhật theo file mới</li>
                <li>Các thông tin khác (địa bàn, metadata) vẫn được giữ nguyên</li>
              </ul>
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
                onClick={() => {
                  setIsUploadDialogOpen(false);
                  setUploadFiles([]);
                  setUploadProgress({});
                  setUploadingEvidence(null);
                }}
                disabled={isUploading}
              >
                {isUploading ? 'Đóng' : 'Hủy bỏ'}
              </Button>
              <Button
                onClick={handleUploadSubmit}
                disabled={uploadFiles.length === 0 || isUploading}
              >
                <Upload size={16} />
                {isUploading ? 'Đang tải lên...' : 'Tải lên file mới'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}





