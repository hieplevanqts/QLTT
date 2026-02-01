/**
 * Form Templates Tab - MAPPA Portal
 * Quản lý Thiết lập biểu mẫu với CRUD operations
 * Tuân thủ design tokens từ /src/styles/theme.css với Inter font
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  AlertCircle,
  Loader2,
  FileDown,
  CheckCircle,
  XCircle,
  Upload,
  Download,
  ChevronDown,
  CheckSquare,
} from 'lucide-react';
import styles from './CategoriesTab.module.css'; // Reuse styles like BanksTab
import { toast } from 'sonner';
import { Pagination, usePagination } from '../components/Pagination';
import { FormCriteriaModal } from '../components/FormCriteriaModal';
import { FormTemplateModal } from '../components/FormTemplateModal';
import { ALL_FORM_TEMPLATES, FormTemplate } from '../data/formCriteriaTemplates';
import * as XLSX from 'xlsx';

interface FormTemplatesTabProps {
  onOpenModal?: (type: 'add' | 'edit' | 'view' | 'delete', item?: any, subTab?: string) => void;
}

export const FormTemplatesTab: React.FC<FormTemplatesTabProps> = ({ onOpenModal }) => {
  const [forms, setForms] = useState<FormTemplate[]>([]);
  const [filteredForms, setFilteredForms] = useState<FormTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Modal states
  const [showCriteriaModal, setShowCriteriaModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [formModalMode, setFormModalMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedTemplate, setSelectedTemplate] = useState<FormTemplate | null>(null);

  // Import dropdown state
  const [isImportDropdownOpen, setIsImportDropdownOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pagination
  const itemsPerPage = 10;
  const pagination = usePagination(filteredForms, itemsPerPage);
  const { currentPage, setCurrentPage, totalPages, currentItems } = pagination;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Fetch forms from data templates
  const fetchForms = async () => {
    try {
      setLoading(true);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      setForms(ALL_FORM_TEMPLATES);
      setFilteredForms(ALL_FORM_TEMPLATES);
    } catch (error) {
      console.error('❌ Error loading forms:', error);
      toast.error('Lỗi tải dữ liệu biểu mẫu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.importDropdown')) {
        setIsImportDropdownOpen(false);
      }
    };

    if (isImportDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isImportDropdownOpen]);

  // Filter forms
  useEffect(() => {
    let filtered = [...forms];

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (form) =>
          form.name.toLowerCase().includes(term) ||
          form.code.toLowerCase().includes(term) ||
          (form.description && form.description.toLowerCase().includes(term))
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((form) =>
        statusFilter === 'active' ? form.status === 'active' : form.status !== 'active'
      );
    }

    setFilteredForms(filtered);
  }, [searchTerm, statusFilter, forms]);

  // View Criteria
  const handleViewCriteria = (form: FormTemplate) => {
    setSelectedTemplate(form);
    setShowCriteriaModal(true);
  };

  // Open Add Form Modal
  const handleAddForm = () => {
    setSelectedTemplate(null);
    setFormModalMode('add');
    setShowFormModal(true);
  };

  // Open Edit Form Modal
  const handleEditForm = (form: FormTemplate) => {
    setSelectedTemplate(form);
    setFormModalMode('edit');
    setShowFormModal(true);
  };

  // Open View Form Modal
  const handleViewForm = (form: FormTemplate) => {
    setSelectedTemplate(form);
    setFormModalMode('view');
    setShowFormModal(true);
  };

  // Save form template
  const handleSaveForm = (data: Partial<FormTemplate>) => {
    if (formModalMode === 'add') {
      const newForm: FormTemplate = {
        id: `FORM_${Date.now()}`,
        code: data.code || '',
        name: data.name || '',
        description: data.description || '',
        status: data.status || 'active',
        criteria: data.criteria || [],
        createdAt: new Date().toISOString().split('T')[0],
        createdBy: 'Admin',
        version: '1.0',
      };
      setForms([...forms, newForm]);
      toast.success('Thêm biểu mẫu thành công');
    } else if (formModalMode === 'edit' && selectedTemplate) {
      setForms(
        forms.map((f) =>
          f.id === selectedTemplate.id ? { ...f, ...data } : f
        )
      );
      toast.success('Cập nhật biểu mẫu thành công');
    }
    setShowFormModal(false);
  };

  // Delete form template
  const handleDeleteForm = (form: FormTemplate) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa biểu mẫu "${form.name}"?`)) {
      setForms(forms.filter((f) => f.id !== form.id));
      toast.success('Xóa biểu mẫu thành công');
    }
  };

  // Export to Excel
  const handleExportExcel = () => {
    try {
      const exportData = filteredForms.map((form, index) => ({
        'STT': index + 1,
        'Mã biểu mẫu': form.code,
        'Tên biểu mẫu': form.name,
        'Mô tả': form.description || '',
        'Số tiêu chí': form.criteria.length,
        'Trạng thái': form.status === 'active' ? 'Hoạt động' : 'Không hoạt động',
        'Ngày tạo': form.createdAt,
        'Người tạo': form.createdBy,
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Biểu mẫu');

      // Auto-size columns
      const wscols = [
        { wch: 5 },  // STT
        { wch: 15 }, // Mã
        { wch: 40 }, // Tên
        { wch: 50 }, // Mô tả
        { wch: 12 }, // Số tiêu chí
        { wch: 15 }, // Trạng thái
        { wch: 12 }, // Ngày tạo
        { wch: 20 }, // Người tạo
      ];
      ws['!cols'] = wscols;

      XLSX.writeFile(wb, `Bieu_mau_${new Date().toISOString().split('T')[0]}.xlsx`);
      toast.success('Đã xuất file Excel thành công');
    } catch (error) {
      console.error('❌ Error exporting Excel:', error);
      toast.error('Lỗi xuất file Excel');
    }
  };

  // Download Template
  const handleDownloadTemplate = () => {
    setIsImportDropdownOpen(false);

    try {
      const templateData = [
        {
          'Mã biểu mẫu': 'KT-XXX-001',
          'Tên biểu mẫu': 'Tên biểu mẫu mẫu',
          'Mô tả': 'Mô tả chi tiết về biểu mẫu',
          'Trạng thái': 'Hoạt động',
        },
        {
          'Mã biểu mẫu': 'KT-XXX-002',
          'Tên biểu mẫu': 'Biểu mẫu kiểm tra mẫu',
          'Mô tả': 'Mô tả chi tiết',
          'Trạng thái': 'Hoạt động',
        },
      ];

      const ws = XLSX.utils.json_to_sheet(templateData);
      const wscols = [
        { wch: 15 },
        { wch: 50 },
        { wch: 50 },
        { wch: 15 },
      ];
      ws['!cols'] = wscols;

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Mẫu Biểu mẫu');

      // Instructions sheet
      const instructions = [
        { 'CỘT': 'Mã biểu mẫu', 'BẮT BUỘC': 'Có', 'ĐỊNH DẠNG': 'Text', 'GHI CHÚ': 'Mã biểu mẫu (VD: KT-HANG-001)' },
        { 'CỘT': 'Tên biểu mẫu', 'BẮT BUỘC': 'Có', 'ĐỊNH DẠNG': 'Text', 'GHI CHÚ': 'Tên đầy đủ của biểu mẫu' },
        { 'CỘT': 'Mô tả', 'BẮT BUỘC': 'Không', 'ĐỊNH DẠNG': 'Text', 'GHI CHÚ': 'Mô tả chi tiết về biểu mẫu' },
        { 'CỘT': 'Trạng thái', 'BẮT BUỘC': 'Không', 'ĐỊNH DẠNG': 'Text', 'GHI CHÚ': 'Ghi "Hoạt động" hoặc để trống' },
      ];

      const wsInstructions = XLSX.utils.json_to_sheet(instructions);
      const wsInstructionsCols = [
        { wch: 20 },
        { wch: 15 },
        { wch: 15 },
        { wch: 50 },
      ];
      wsInstructions['!cols'] = wsInstructionsCols;
      XLSX.utils.book_append_sheet(wb, wsInstructions, 'Hướng dẫn');

      XLSX.writeFile(wb, `Mau_Bieu_mau_${new Date().toISOString().split('T')[0]}.xlsx`);
      toast.success('Đã tải file mẫu thành công');
    } catch (error) {
      console.error('❌ Error generating template:', error);
      toast.error('Lỗi tải file mẫu');
    }
  };

  // Import Excel
  const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsImportDropdownOpen(false);

    const file = e.target.files?.[0];
    if (!file) return;

    try {
      toast.info('Đang xử lý file Excel...');

      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const data = event.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(sheet) as any[];


          let successCount = 0;
          let errorCount = 0;

          for (const row of jsonData) {
            try {
              // Validate required fields
              if (!row['Mã biểu mẫu'] || !row['Tên biểu mẫu']) {
                errorCount++;
                continue;
              }

              // TODO: Insert into database or local state
              successCount++;
            } catch (error) {
              console.error('❌ Error importing row:', { error, row });
              errorCount++;
            }
          }

          if (successCount > 0) {
            toast.success(`Đã nhập thành công ${successCount} biểu mẫu`);
            await fetchForms();
          }
          if (errorCount > 0) {
            toast.warning(`${errorCount} dòng bị lỗi hoặc bỏ qua`);
          }

        } catch (error) {
          console.error('❌ Parse error:', error);
          toast.error('Lỗi đọc file Excel');
        }
      };

      reader.readAsBinaryString(file);
    } catch (error) {
      console.error('❌ Import error:', error);
      toast.error('Lỗi nhập file Excel');
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <Loader2 size={32} className={styles.spinner} />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Filters Card */}
      <div className={styles.filtersCard}>
        <div className={styles.filtersRow}>
          {/* Search */}
          <div className={styles.searchWrapper}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã, tên, mô tả..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
            className={styles.searchInput}
            style={{ width: '180px', minWidth: 'unset' }}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Không hoạt động</option>
          </select>

          {/* Actions */}
          <div className={styles.actionsGroup}>
            <button onClick={fetchForms} className={styles.btnSecondary}>
              <RefreshCw size={18} />
              Làm mới
            </button>
            <button onClick={handleExportExcel} className={styles.btnSecondary}>
              <FileDown size={18} />
              Xuất Excel
            </button>

            {/* Import Dropdown */}
            <div className="importDropdown" style={{ position: 'relative', display: 'inline-block' }}>
              <button
                className={styles.btnSecondary}
                onClick={() => setIsImportDropdownOpen(!isImportDropdownOpen)}
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Upload size={18} />
                Nhập dữ liệu
                <ChevronDown size={16} />
              </button>

              {isImportDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 4px)',
                    right: 0,
                    minWidth: '200px',
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md, 8px)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    zIndex: 100,
                    overflow: 'hidden',
                  }}
                >
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 16px',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 'var(--text-sm, 14px)',
                      color: 'var(--foreground)',
                      background: 'transparent',
                      border: 'none',
                      width: '100%',
                      textAlign: 'left',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--muted)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <Upload size={16} style={{ color: 'var(--muted-foreground)' }} />
                    Từ file Excel
                  </button>
                  <button
                    onClick={handleDownloadTemplate}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 16px',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 'var(--text-sm, 14px)',
                      color: 'var(--foreground)',
                      background: 'transparent',
                      border: 'none',
                      width: '100%',
                      textAlign: 'left',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--muted)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <Download size={16} style={{ color: 'var(--muted-foreground)' }} />
                    Tải mẫu nhập liệu
                  </button>
                </div>
              )}
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleImportExcel}
              style={{ display: 'none' }}
            />

            <button
              onClick={handleAddForm}
              className={styles.btnPrimary}
            >
              <Plus size={18} />
              Thêm mới
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      {filteredForms.length === 0 ? (
        <div className={styles.emptyState}>
          <AlertCircle size={48} style={{ color: 'var(--muted-foreground)', marginBottom: '16px' }} />
          <p>Không tìm thấy biểu mẫu nào</p>
        </div>
      ) : (
        <>
          <div className={styles.tableCard}>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}>STT</th>
                    <th style={{ width: '130px' }}>Mã biểu mẫu</th>
                    <th>Tên biểu mẫu</th>
                    <th>Mô tả</th>
                    <th style={{ width: '110px' }}>Số tiêu chí</th>
                    <th style={{ width: '130px' }}>Trạng thái</th>
                    <th style={{ width: '200px' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((form, index) => (
                    <tr key={form.id}>
                      <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td>
                        <span className={styles.iconBadge}>{form.code}</span>
                      </td>
                      <td>
                        <div className={styles.nameCell}>
                          <span className={styles.nameText}>{form.name}</span>
                        </div>
                      </td>
                      <td>
                        <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' }}>
                          {form.description
                            ? form.description.length > 60
                              ? form.description.substring(0, 60) + '...'
                              : form.description
                            : '—'}
                        </span>
                      </td>
                      <td>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '4px 10px',
                            background: 'var(--muted)',
                            color: 'var(--primary)',
                            fontSize: 'var(--text-sm)',
                            fontWeight: 600,
                            borderRadius: 'var(--radius)',
                          }}
                        >
                          {form.criteria.length} tiêu chí
                        </span>
                      </td>
                      <td>
                        {form.status === 'active' ? (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '4px 10px',
                              background: 'var(--success-light, #e6f4ea)',
                              color: 'var(--success, #0f9d58)',
                              fontSize: 'var(--text-sm)',
                              fontWeight: 500,
                              borderRadius: 'var(--radius)',
                            }}
                          >
                            <CheckCircle size={14} />
                            Hoạt động
                          </span>
                        ) : (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '4px 10px',
                              background: 'var(--muted)',
                              color: 'var(--muted-foreground)',
                              fontSize: 'var(--text-sm)',
                              fontWeight: 500,
                              borderRadius: 'var(--radius)',
                            }}
                          >
                            <XCircle size={14} />
                            Không hoạt động
                          </span>
                        )}
                      </td>
                      <td>
                        <div className={styles.actionButtons}>
                          <button
                            className={styles.btnIcon}
                            onClick={() => handleViewCriteria(form)}
                            title="Xem tiêu chí"
                          >
                            <CheckSquare size={18} />
                          </button>
                          <button
                            className={styles.btnIcon}
                            onClick={() => handleViewForm(form)}
                            title="Xem chi tiết"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            className={styles.btnIcon}
                            onClick={() => handleEditForm(form)}
                            title="Chỉnh sửa"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            className={styles.btnIcon}
                            onClick={() => handleDeleteForm(form)}
                            title="Xóa"
                          >
                            <Trash2 size={18} className="text-destructive" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredForms.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {/* Criteria Modal */}
      {showCriteriaModal && selectedTemplate && (
        <FormCriteriaModal
          template={selectedTemplate}
          onClose={() => setShowCriteriaModal(false)}
        />
      )}

      {/* Form Template Modal */}
      {showFormModal && (
        <FormTemplateModal
          template={selectedTemplate}
          mode={formModalMode}
          onClose={() => setShowFormModal(false)}
          onSave={handleSaveForm}
        />
      )}
    </div>
  );
};
