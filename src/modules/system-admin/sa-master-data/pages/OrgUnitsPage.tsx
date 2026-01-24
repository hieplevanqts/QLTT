/**
 * ORG UNITS PAGE - Quản lý đơn vị tổ chức
 * Full CRUD with mock service
 */

import React, { useState, useEffect } from 'react';
import { Plus, Building2, Edit2, Power } from 'lucide-react';
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
import type { OrgUnit } from '../types';
import type { CreateOrgUnitPayload, UpdateOrgUnitPayload } from '../../mocks/masterData.types';
import {
  listOrgUnits,
  getOrgUnitById,
  createOrgUnit,
  updateOrgUnit,
  deleteOrgUnit
} from '../../mocks/masterData.service';

type FormMode = 'create' | 'edit' | null;

interface FormData {
  code: string;
  name: string;
  shortName: string;
  type: 'central' | 'provincial' | 'team' | 'other';
  level: number;
  parentId: string;
  status: 'active' | 'inactive';
}

const initialFormData: FormData = {
  code: '',
  name: '',
  shortName: '',
  type: 'central',
  level: 1,
  parentId: '',
  status: 'active'
};

export default function OrgUnitsPage() {
  const { hasPermission } = usePermissions();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [orgUnits, setOrgUnits] = useState<OrgUnit[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formMode, setFormMode] = useState<FormMode>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<string | null>(null);

  // Dialog state
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string | null; name: string }>({
    open: false,
    id: null,
    name: ''
  });

  const canCreate = hasPermission('sa.masterdata.orgunit.create');
  const canUpdate = hasPermission('sa.masterdata.orgunit.update');
  const canDelete = hasPermission('sa.masterdata.orgunit.delete');

  // Load data
  useEffect(() => {
    loadOrgUnits();
  }, [currentPage, searchQuery]);

  const loadOrgUnits = async () => {
    setLoading(true);
    try {
      const response = await listOrgUnits({
        page: currentPage,
        pageSize,
        search: searchQuery,
        sort: { field: 'createdAt', order: 'desc' }
      });

      if (response.success && response.data) {
        setOrgUnits(response.data.data);
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

  // Form handlers
  const handleOpenCreate = () => {
    setFormMode('create');
    setFormData(initialFormData);
    setFormErrors({});
    setEditingId(null);
  };

  const handleOpenEdit = async (id: string) => {
    setFormMode('edit');
    setEditingId(id);
    setFormErrors({});

    const response = await getOrgUnitById(id);
    if (response.success && response.data) {
      setFormData({
        code: response.data.code,
        name: response.data.name,
        shortName: response.data.shortName,
        type: response.data.type,
        level: response.data.level,
        parentId: response.data.parentId || '',
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
      errors.code = 'Mã đơn vị là bắt buộc';
    }

    if (!formData.name.trim()) {
      errors.name = 'Tên đơn vị là bắt buộc';
    }

    if (!formData.shortName.trim()) {
      errors.shortName = 'Tên ngắn là bắt buộc';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      const payload: CreateOrgUnitPayload | UpdateOrgUnitPayload = {
        code: formData.code,
        name: formData.name,
        shortName: formData.shortName,
        type: formData.type,
        level: formData.level,
        parentId: formData.parentId || null,
        status: formData.status
      };

      let response;
      if (formMode === 'create') {
        response = await createOrgUnit(payload as CreateOrgUnitPayload);
      } else if (formMode === 'edit' && editingId) {
        response = await updateOrgUnit(editingId, payload);
      }

      if (response && response.success) {
        toast.success(formMode === 'create' ? 'Tạo đơn vị thành công' : 'Cập nhật đơn vị thành công');
        handleCloseForm();
        loadOrgUnits();
      } else {
        toast.error(response?.error || 'Có lỗi xảy ra');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete handlers
  const handleOpenDelete = (id: string, name: string) => {
    setDeleteDialog({ open: true, id, name });
  };

  const handleConfirmDelete = async () => {
    if (!deleteDialog.id) return;

    setSubmitting(true);
    try {
      const response = await deleteOrgUnit(deleteDialog.id, false); // Soft delete
      if (response.success) {
        toast.success('Ngừng hoạt động đơn vị thành công');
        setDeleteDialog({ open: false, id: null, name: '' });
        loadOrgUnits();
      } else {
        toast.error(response.error || 'Có lỗi xảy ra');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra');
    } finally {
      setSubmitting(false);
    }
  };

  const getTypeLabel = (type: OrgUnit['type']) => {
    const map: Record<OrgUnit['type'], string> = {
      central: 'Cục',
      provincial: 'Chi cục',
      team: 'Đội',
      other: 'Khác'
    };
    return map[type] || type;
  };

  // Table columns
  const columns = [
    {
      header: 'Mã đơn vị',
      render: (item: OrgUnit) => <span className={cellStyles.code}>{item.code}</span>,
      width: '140px'
    },
    {
      header: 'Tên đơn vị',
      render: (item: OrgUnit) => <span className={cellStyles.name}>{item.name}</span>
    },
    {
      header: 'Tên ngắn',
      accessor: 'shortName' as keyof OrgUnit
    },
    {
      header: 'Loại',
      render: (item: OrgUnit) => (
        <StatusBadge variant="pending">{getTypeLabel(item.type)}</StatusBadge>
      ),
      width: '120px'
    },
    {
      header: 'Cấp',
      render: (item: OrgUnit) => <span>Cấp {item.level}</span>,
      width: '80px'
    },
    {
      header: 'Trạng thái',
      render: (item: OrgUnit) => (
        <StatusBadge variant={item.status === 'active' ? 'active' : 'inactive'}>
          {item.status === 'active' ? 'Hoạt động' : 'Ngừng hoạt động'}
        </StatusBadge>
      ),
      width: '140px'
    },
    {
      header: 'Thao tác',
      render: (item: OrgUnit) => (
        <div className={cellStyles.actions}>
          <button
            className={cellStyles.actionButton}
            onClick={() => handleOpenEdit(item.id)}
            disabled={!canUpdate}
          >
            <Edit2 size={14} style={{ marginRight: '4px' }} />
            Sửa
          </button>
          {item.status === 'active' && (
            <button
              className={cellStyles.actionButtonDanger}
              onClick={() => handleOpenDelete(item.id, item.name)}
              disabled={!canDelete}
            >
              <Power size={14} style={{ marginRight: '4px' }} />
              Ngừng
            </button>
          )}
        </div>
      ),
      width: '180px'
    }
  ];

  return (
    <PermissionGate permission="sa.masterdata.orgunit.read">
      <div style={{ padding: '24px' }}>
        {/* Page Header */}
        <PageHeader
          breadcrumbs={[
            { label: 'Trang chủ', href: '/' },
            { label: 'Quản trị hệ thống', href: '/system-admin' },
            { label: 'Dữ liệu nền' },
            { label: 'Đơn vị tổ chức' }
          ]}
          title="Quản lý Đơn vị Tổ chức"
          subtitle="Quản lý cơ cấu tổ chức, phân cấp đơn vị"
          actions={
            <Button size="sm" onClick={handleOpenCreate} disabled={!canCreate}>
              <Plus size={18} />
              Thêm đơn vị
            </Button>
          }
        />

        {/* Main Card */}
        <Card>
          <CardContent>
            {/* Toolbar */}
            <DataToolbar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              searchPlaceholder="Tìm theo mã, tên đơn vị..."
              totalCount={totalCount}
              entityLabel="đơn vị"
            />

            {/* Content */}
            {loading ? (
              <LoadingState message="Đang tải dữ liệu..." />
            ) : orgUnits.length === 0 ? (
              <EmptyState
                icon={<Building2 size={48} />}
                title="Chưa có đơn vị"
                message="Chưa có đơn vị nào trong hệ thống. Nhấn 'Thêm đơn vị' để bắt đầu."
              />
            ) : (
              <>
                <DataTable columns={columns} data={orgUnits} keyExtractor={(item) => item.id} />
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
              </>
            )}
          </CardContent>
        </Card>

        {/* Form Drawer */}
        <FormDrawer
          open={formMode !== null}
          onClose={handleCloseForm}
          title={formMode === 'create' ? 'Thêm đơn vị tổ chức' : 'Chỉnh sửa đơn vị tổ chức'}
          subtitle={formMode === 'create' ? 'Tạo đơn vị tổ chức mới' : 'Cập nhật thông tin đơn vị'}
          onSubmit={handleSubmit}
          loading={submitting}
        >
          <FormGroup label="Mã đơn vị" required error={formErrors.code}>
            <input
              type="text"
              className={`${formStyles.input} ${formErrors.code ? formStyles.inputError : ''}`}
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              placeholder="VD: CUC-QLTT"
              disabled={submitting}
            />
          </FormGroup>

          <FormGroup label="Tên đơn vị" required error={formErrors.name}>
            <input
              type="text"
              className={`${formStyles.input} ${formErrors.name ? formStyles.inputError : ''}`}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="VD: Cục Quản lý thị trường"
              disabled={submitting}
            />
          </FormGroup>

          <FormGroup label="Tên ngắn" required error={formErrors.shortName}>
            <input
              type="text"
              className={`${formStyles.input} ${formErrors.shortName ? formStyles.inputError : ''}`}
              value={formData.shortName}
              onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
              placeholder="VD: Cục QLTT"
              disabled={submitting}
            />
          </FormGroup>

          <FormGroup label="Loại đơn vị" required>
            <select
              className={formStyles.select}
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as FormData['type'] })}
              disabled={submitting}
            >
              <option value="central">Cục</option>
              <option value="provincial">Chi cục</option>
              <option value="team">Đội</option>
              <option value="other">Khác</option>
            </select>
          </FormGroup>

          <FormGroup label="Cấp" required>
            <select
              className={formStyles.select}
              value={formData.level}
              onChange={(e) => setFormData({ ...formData, level: Number(e.target.value) })}
              disabled={submitting}
            >
              <option value={1}>Cấp 1</option>
              <option value={2}>Cấp 2</option>
              <option value={3}>Cấp 3</option>
            </select>
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

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          open={deleteDialog.open}
          onClose={() => setDeleteDialog({ open: false, id: null, name: '' })}
          onConfirm={handleConfirmDelete}
          title="Ngừng hoạt động đơn vị?"
          description={`Bạn có chắc muốn ngừng hoạt động đơn vị "${deleteDialog.name}"? Đơn vị sẽ chuyển sang trạng thái "Ngừng hoạt động".`}
          variant="warning"
          confirmLabel="Ngừng hoạt động"
          loading={submitting}
        />
      </div>
    </PermissionGate>
  );
}


