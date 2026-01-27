/**
 * CATALOG ITEMS PAGE - Quản lý các mục trong danh mục
 * Full CRUD with mock service
 */

import React, { useState, useEffect } from 'react';
import { Plus, ListOrdered, Edit2, Trash2, ArrowLeft, List, Network } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { PermissionGate, EmptyState, LoadingState, usePermissions } from '../../_shared';
import {
  StatusBadge,
  DataToolbar,
  DataTable,
  Pagination,
  cellStyles,
  ConfirmDialog,
  FormDrawer,
  FormGroup,
  formStyles
} from '../../_shared';
import PageHeader from '@/layouts/PageHeader';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { TreeTable } from '../components/TreeTable';
import type { CatalogItem, Catalog } from '../types';
import type { CreateCatalogItemPayload, UpdateCatalogItemPayload } from '../../mocks/masterData.types';
import {
  listCatalogItems,
  getCatalogItemById,
  createCatalogItem,
  updateCatalogItem,
  deleteCatalogItem,
  getCatalogByKey
} from '../../mocks/masterData.service';

type FormMode = 'create' | 'edit' | null;
type ViewMode = 'list' | 'tree';

interface FormData {
  code: string;
  name: string;
  value: string;
  description: string;
  order: number;
  badgeColor: string;
  isDefault: boolean;
  status: 'active' | 'inactive';
}

const initialFormData: FormData = {
  code: '',
  name: '',
  value: '',
  description: '',
  order: 1,
  badgeColor: '',
  isDefault: false,
  status: 'active'
};

export default function CatalogItemsPage() {
  const { catalogKey } = useParams<{ catalogKey: string }>();
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const [formMode, setFormMode] = useState<FormMode>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<string | null>(null);

  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string | null; name: string }>({
    open: false,
    id: null,
    name: ''
  });

  const canCreate = hasPermission('sa.masterdata.catalog.create');
  const canUpdate = hasPermission('sa.masterdata.catalog.update');
  const canDelete = hasPermission('sa.masterdata.catalog.delete');

  useEffect(() => {
    if (catalogKey) {
      loadCatalog();
      loadItems();
    }
  }, [catalogKey, currentPage, searchQuery]);

  const loadCatalog = async () => {
    if (!catalogKey) return;
    
    const response = await getCatalogByKey(catalogKey);
    if (response.success && response.data) {
      setCatalog(response.data);
    }
  };

  const loadItems = async () => {
    if (!catalogKey) return;

    setLoading(true);
    try {
      const response = await listCatalogItems(catalogKey, {
        page: currentPage,
        pageSize,
        search: searchQuery,
        sort: { field: 'order', order: 'asc' }
      });

      if (response.success && response.data) {
        setItems(response.data.data);
        setTotalCount(response.data.total);
        setTotalPages(response.data.totalPages);
      } else {
        toast.error(response.error || 'Lỗi khi tải dữ liệu');
      }
    } catch (error) {
      toast.error('Lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setFormMode('create');
    setFormData({ ...initialFormData, order: items.length + 1 });
    setFormErrors({});
    setEditingId(null);
  };

  const handleOpenEdit = async (id: string) => {
    setFormMode('edit');
    setEditingId(id);
    setFormErrors({});

    const response = await getCatalogItemById(id);
    if (response.success && response.data) {
      setFormData({
        code: response.data.code,
        name: response.data.name,
        value: response.data.value || '',
        description: response.data.description || '',
        order: response.data.order,
        badgeColor: response.data.badgeColor || '',
        isDefault: response.data.isDefault || false,
        status: response.data.status
      });
    }
  };

  const handleCloseForm = () => {
    if (!submitting) {
      setFormMode(null);
      setFormData(initialFormData);
      setFormErrors({});
      setEditingId(null);
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.code.trim()) {
      errors.code = 'Mã mục là bắt buộc';
    }

    if (!formData.name.trim()) {
      errors.name = 'Tên mục là bắt buộc';
    }

    if (formData.order < 1) {
      errors.order = 'Thứ tự phải lớn hơn 0';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !catalogKey) return;

    setSubmitting(true);

    try {
      const payload: CreateCatalogItemPayload | UpdateCatalogItemPayload = {
        catalogKey,
        code: formData.code,
        name: formData.name,
        value: formData.value,
        description: formData.description,
        order: formData.order,
        badgeColor: formData.badgeColor,
        isDefault: formData.isDefault,
        status: formData.status
      };

      let response;
      if (formMode === 'create') {
        response = await createCatalogItem(payload as CreateCatalogItemPayload);
      } else if (formMode === 'edit' && editingId) {
        response = await updateCatalogItem(editingId, payload);
      }

      if (response && response.success) {
        toast.success(formMode === 'create' ? 'Tạo mục thành công' : 'Cập nhật mục thành công');
        handleCloseForm();
        loadItems();
        loadCatalog(); // Refresh item count
      } else {
        toast.error(response?.error || 'Có lỗi xảy ra');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenDelete = (id: string, name: string) => {
    setDeleteDialog({ open: true, id, name });
  };

  const handleConfirmDelete = async () => {
    if (!deleteDialog.id) return;

    setSubmitting(true);
    try {
      const response = await deleteCatalogItem(deleteDialog.id, true); // Hard delete for items
      if (response.success) {
        toast.success('Xóa mục thành công');
        setDeleteDialog({ open: false, id: null, name: '' });
        loadItems();
        loadCatalog(); // Refresh item count
      } else {
        toast.error(response.error || 'Có lỗi xảy ra');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/system-admin/master-data/catalogs');
  };

  const handleToggleStatus = async (item: CatalogItem) => {
    if (!canUpdate || catalog?.isLocked) return;

    const newStatus = item.status === 'active' ? 'inactive' : 'active';
    const response = await updateCatalogItem(item.id, { status: newStatus });
    
    if (response.success) {
      toast.success('Cập nhật trạng thái thành công');
      loadItems();
    } else {
      toast.error(response.error || 'Có lỗi xảy ra');
    }
  };

  // Check if catalog has tree structure (has items with parentId)
  const hasTreeStructure = items.some(item => item.parentId !== null && item.parentId !== undefined);

  const columns = [
    {
      header: '#',
      render: (item: CatalogItem) => <span>{item.order}</span>,
      width: '60px'
    },
    {
      header: 'Mã',
      render: (item: CatalogItem) => <span className={cellStyles.code}>{item.code}</span>,
      width: '160px'
    },
    {
      header: 'Tên mục',
      render: (item: CatalogItem) => <span className={cellStyles.name}>{item.name}</span>
    },
    {
      header: 'Mô tả',
      render: (item: CatalogItem) => <span className={cellStyles.muted}>{item.description || '-'}</span>
    },
    {
      header: 'Trạng thái',
      render: (item: CatalogItem) => (
        <StatusBadge variant={item.status === 'active' ? 'active' : 'inactive'}>
          {item.status === 'active' ? 'Hoạt động' : 'Ngừng hoạt động'}
        </StatusBadge>
      ),
      width: '140px'
    },
    {
      header: 'Thao tác',
      render: (item: CatalogItem) => (
        <div className={cellStyles.actions}>
          <button className={cellStyles.actionButton} onClick={() => handleOpenEdit(item.id)} disabled={!canUpdate}>
            <Edit2 size={14} style={{ marginRight: '4px' }} />
            Sửa
          </button>
          <button
            className={cellStyles.actionButtonDanger}
            onClick={() => handleOpenDelete(item.id, item.name)}
            disabled={!canDelete}
          >
            <Trash2 size={14} style={{ marginRight: '4px' }} />
            Xóa
          </button>
        </div>
      ),
      width: '180px'
    }
  ];

  return (
    <PermissionGate permission="sa.masterdata.catalog.read">
      <div style={{ padding: '24px' }}>
        <PageHeader
          breadcrumbs={[
            { label: 'Trang chủ', href: '/' },
            { label: 'Quản trị hệ thống', href: '/system-admin' },
            { label: 'Dữ liệu nền' },
            { label: 'Danh mục hệ thống', href: '/system-admin/master-data/catalogs' },
            { label: catalog?.name || catalogKey || '' }
          ]}
          title={catalog?.name || 'Các mục trong danh mục'}
          subtitle={catalog?.description || ''}
          actions={
            <>
              <Button variant="outline" size="sm" onClick={handleBack}>
                <ArrowLeft size={18} />
                Quay lại
              </Button>
              <Button size="sm" onClick={handleOpenCreate} disabled={!canCreate}>
                <Plus size={18} />
                Thêm mục
              </Button>
            </>
          }
        />

        <Card>
          <CardContent>
            <DataToolbar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              searchPlaceholder="Tìm theo mã, tên mục..."
              totalCount={totalCount}
              entityLabel="mục"
            />

            {/* View Mode Toggle */}
            {hasTreeStructure && items.length > 0 && (
              <div style={{ 
                display: 'flex', 
                gap: 'var(--spacing-2)', 
                marginBottom: 'var(--spacing-4)',
                borderBottom: '1px solid var(--color-border)',
                paddingBottom: 'var(--spacing-2)'
              }}>
                <button
                  onClick={() => setViewMode('list')}
                  style={{
                    padding: 'var(--spacing-2) var(--spacing-4)',
                    background: viewMode === 'list' ? 'var(--color-primary)' : 'var(--color-surface)',
                    color: viewMode === 'list' ? 'white' : 'var(--color-text-primary)',
                    border: `1px solid ${viewMode === 'list' ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-2)',
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 500,
                    transition: 'all 0.2s'
                  }}
                >
                  <List size={16} />
                  Danh sách
                </button>
                <button
                  onClick={() => setViewMode('tree')}
                  style={{
                    padding: 'var(--spacing-2) var(--spacing-4)',
                    background: viewMode === 'tree' ? 'var(--color-primary)' : 'var(--color-surface)',
                    color: viewMode === 'tree' ? 'white' : 'var(--color-text-primary)',
                    border: `1px solid ${viewMode === 'tree' ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-2)',
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 500,
                    transition: 'all 0.2s'
                  }}
                >
                  <Network size={16} />
                  Cây phân cấp
                </button>
                {viewMode === 'tree' && (
                  <div style={{ 
                    marginLeft: 'auto',
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--color-text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    fontStyle: 'italic'
                  }}>
                    * Chế độ cây hiển thị toàn bộ dữ liệu
                  </div>
                )}
              </div>
            )}

            {loading ? (
              <LoadingState message="Đang tải dữ liệu..." />
            ) : items.length === 0 ? (
              <EmptyState
                icon={<ListOrdered size={48} />}
                title="Chưa có mục nào"
                message="Chưa có mục nào trong danh mục này. Nhấn 'Thêm mục' để bắt đầu."
              />
            ) : viewMode === 'tree' && hasTreeStructure ? (
              <TreeTable
                items={items}
                onEdit={canUpdate ? (item) => handleOpenEdit(item.id) : undefined}
                onDelete={canDelete ? (item) => handleOpenDelete(item.id, item.name) : undefined}
                onToggleStatus={canUpdate ? handleToggleStatus : undefined}
                isLocked={catalog?.isLocked}
              />
            ) : (
              <>
                <DataTable columns={columns} data={items} keyExtractor={(item) => item.id} />
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
              </>
            )}
          </CardContent>
        </Card>

        <FormDrawer
          open={formMode !== null}
          onClose={handleCloseForm}
          title={formMode === 'create' ? 'Thêm mục' : 'Chỉnh sửa mục'}
          subtitle={formMode === 'create' ? 'Tạo mục mới trong danh mục' : 'Cập nhật thông tin mục'}
          onSubmit={handleSubmit}
          loading={submitting}
        >
          <FormGroup label="Mã mục" required error={formErrors.code}>
            <input
              type="text"
              className={`${formStyles.input} ${formErrors.code ? formStyles.inputError : ''}`}
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              placeholder="VD: VP-001"
              disabled={submitting}
            />
          </FormGroup>

          <FormGroup label="Tên mục" required error={formErrors.name}>
            <input
              type="text"
              className={`${formStyles.input} ${formErrors.name ? formStyles.inputError : ''}`}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="VD: Vi phạm về giá"
              disabled={submitting}
            />
          </FormGroup>

          <FormGroup label="Giá trị">
            <input
              type="text"
              className={formStyles.input}
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              placeholder="Giá trị mục..."
              disabled={submitting}
            />
          </FormGroup>

          <FormGroup label="Mô tả">
            <textarea
              className={formStyles.textarea}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Mô tả về mục..."
              disabled={submitting}
              rows={3}
            />
          </FormGroup>

          <FormGroup label="Thứ tự" required error={formErrors.order}>
            <input
              type="number"
              className={`${formStyles.input} ${formErrors.order ? formStyles.inputError : ''}`}
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
              min={1}
              disabled={submitting}
            />
          </FormGroup>

          <FormGroup label="Màu badge">
            <input
              type="text"
              className={formStyles.input}
              value={formData.badgeColor}
              onChange={(e) => setFormData({ ...formData, badgeColor: e.target.value })}
              placeholder="Màu badge..."
              disabled={submitting}
            />
          </FormGroup>

          <FormGroup label="Mặc định">
            <input
              type="checkbox"
              className={formStyles.checkbox}
              checked={formData.isDefault}
              onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
              disabled={submitting}
            />
          </FormGroup>

          <FormGroup label="Trạng thái" required>
            <select
              className={formStyles.select}
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
              disabled={submitting}
            >
              <option value="active">Hoạt động</option>
              <option value="inactive">Ngừng hoạt động</option>
            </select>
          </FormGroup>
        </FormDrawer>

        <ConfirmDialog
          open={deleteDialog.open}
          onClose={() => setDeleteDialog({ open: false, id: null, name: '' })}
          onConfirm={handleConfirmDelete}
          title="Xóa mục?"
          description={`Bạn có chắc muốn xóa mục "${deleteDialog.name}"? Hành động này không thể hoàn tác.`}
          variant="danger"
          confirmLabel="Xóa"
          loading={submitting}
        />
      </div>
    </PermissionGate>
  );
}

