/**
 * DEPARTMENTS PAGE - Quản lý phòng ban
 * Full CRUD with mock service
 */

import React, { useState, useEffect } from 'react';
import { Plus, Briefcase, Edit2, Power } from 'lucide-react';
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
import type { Department, OrgUnit } from '../types';
import type { CreateDepartmentPayload, UpdateDepartmentPayload } from '../../mocks/masterData.types';
import {
  listDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  listOrgUnits
} from '../../mocks/masterData.service';

type FormMode = 'create' | 'edit' | null;

interface FormData {
  code: string;
  name: string;
  orgUnitId: string;
  description: string;
  status: 'active' | 'inactive';
}

const initialFormData: FormData = {
  code: '',
  name: '',
  orgUnitId: '',
  description: '',
  status: 'active'
};

export default function DepartmentsPage() {
  const { hasPermission } = usePermissions();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [orgUnits, setOrgUnits] = useState<OrgUnit[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formMode, setFormMode] = useState<FormMode>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<string | null>(null);

  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string | null; name: string }>({
    open: false,
    id: null,
    name: ''
  });

  const canCreate = hasPermission('sa.masterdata.department.create');
  const canUpdate = hasPermission('sa.masterdata.department.update');
  const canDelete = hasPermission('sa.masterdata.department.delete');

  useEffect(() => {
    loadDepartments();
    loadOrgUnits();
  }, [currentPage, searchQuery]);

  const loadDepartments = async () => {
    setLoading(true);
    try {
      const response = await listDepartments({
        page: currentPage,
        pageSize,
        search: searchQuery,
        sort: { field: 'createdAt', order: 'desc' }
      });

      if (response.success && response.data) {
        setDepartments(response.data.data);
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

  const loadOrgUnits = async () => {
    const response = await listOrgUnits({ pageSize: 100 });
    if (response.success && response.data) {
      setOrgUnits(response.data.data.filter(u => u.status === 'active'));
    }
  };

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

    const response = await getDepartmentById(id);
    if (response.success && response.data) {
      setFormData({
        code: response.data.code,
        name: response.data.name,
        orgUnitId: response.data.orgUnitId,
        description: '',
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
      errors.code = 'Mã phòng ban là bắt buộc';
    }

    if (!formData.name.trim()) {
      errors.name = 'Tên phòng ban là bắt buộc';
    }

    if (!formData.orgUnitId) {
      errors.orgUnitId = 'Đơn vị trực thuộc là bắt buộc';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSubmitting(true);

    try {
      const payload: CreateDepartmentPayload | UpdateDepartmentPayload = {
        code: formData.code,
        name: formData.name,
        orgUnitId: formData.orgUnitId,
        description: formData.description,
        status: formData.status
      };

      let response;
      if (formMode === 'create') {
        response = await createDepartment(payload as CreateDepartmentPayload);
      } else if (formMode === 'edit' && editingId) {
        response = await updateDepartment(editingId, payload);
      }

      if (response && response.success) {
        toast.success(formMode === 'create' ? 'Tạo phòng ban thành công' : 'Cập nhật phòng ban thành công');
        handleCloseForm();
        loadDepartments();
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
      const response = await deleteDepartment(deleteDialog.id, false);
      if (response.success) {
        toast.success('Ngừng hoạt động phòng ban thành công');
        setDeleteDialog({ open: false, id: null, name: '' });
        loadDepartments();
      } else {
        toast.error(response.error || 'Có lỗi xảy ra');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra');
    } finally {
      setSubmitting(false);
    }
  };

  const getOrgUnitName = (orgUnitId: string) => {
    const orgUnit = orgUnits.find(u => u.id === orgUnitId);
    return orgUnit ? orgUnit.name : 'N/A';
  };

  const columns = [
    {
      header: 'Mã phòng ban',
      render: (item: Department) => <span className={cellStyles.code}>{item.code}</span>,
      width: '140px'
    },
    {
      header: 'Tên phòng ban',
      render: (item: Department) => <span className={cellStyles.name}>{item.name}</span>
    },
    {
      header: 'Đơn vị trực thuộc',
      render: (item: Department) => <span className={cellStyles.muted}>{getOrgUnitName(item.orgUnitId)}</span>
    },
    {
      header: 'Trạng thái',
      render: (item: Department) => (
        <StatusBadge variant={item.status === 'active' ? 'active' : 'inactive'}>
          {item.status === 'active' ? 'Hoạt động' : 'Ngừng hoạt động'}
        </StatusBadge>
      ),
      width: '140px'
    },
    {
      header: 'Thao tác',
      render: (item: Department) => (
        <div className={cellStyles.actions}>
          <button className={cellStyles.actionButton} onClick={() => handleOpenEdit(item.id)} disabled={!canUpdate}>
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
    <PermissionGate permission="sa.masterdata.department.read">
      <div style={{ padding: '24px' }}>
        <PageHeader
          breadcrumbs={[
            { label: 'Trang chủ', href: '/' },
            { label: 'Quản trị hệ thống', href: '/system-admin' },
            { label: 'Dữ liệu nền' },
            { label: 'Phòng ban' }
          ]}
          title="Quản lý Phòng ban"
          subtitle="Quản lý phòng ban thuộc các đơn vị tổ chức"
          actions={
            <Button size="sm" onClick={handleOpenCreate} disabled={!canCreate}>
              <Plus size={18} />
              Thêm phòng ban
            </Button>
          }
        />

        <Card>
          <CardContent>
            <DataToolbar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              searchPlaceholder="Tìm theo mã, tên phòng ban..."
              totalCount={totalCount}
              entityLabel="phòng ban"
            />

            {loading ? (
              <LoadingState message="Đang tải dữ liệu..." />
            ) : departments.length === 0 ? (
              <EmptyState
                icon={<Briefcase size={48} />}
                title="Chưa có phòng ban"
                message="Chưa có phòng ban nào trong hệ thống. Nhấn 'Thêm phòng ban' để bắt đầu."
              />
            ) : (
              <>
                <DataTable columns={columns} data={departments} keyExtractor={(item) => item.id} />
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
              </>
            )}
          </CardContent>
        </Card>

        <FormDrawer
          open={formMode !== null}
          onClose={handleCloseForm}
          title={formMode === 'create' ? 'Thêm phòng ban' : 'Chỉnh sửa phòng ban'}
          subtitle={formMode === 'create' ? 'Tạo phòng ban mới' : 'Cập nhật thông tin phòng ban'}
          onSubmit={handleSubmit}
          loading={submitting}
        >
          <FormGroup label="Mã phòng ban" required error={formErrors.code}>
            <input
              type="text"
              className={`${formStyles.input} ${formErrors.code ? formStyles.inputError : ''}`}
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              placeholder="VD: PHONG-TCKT"
              disabled={submitting}
            />
          </FormGroup>

          <FormGroup label="Tên phòng ban" required error={formErrors.name}>
            <input
              type="text"
              className={`${formStyles.input} ${formErrors.name ? formStyles.inputError : ''}`}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="VD: Phòng Tổng hợp"
              disabled={submitting}
            />
          </FormGroup>

          <FormGroup label="Đơn vị trực thuộc" required error={formErrors.orgUnitId}>
            <select
              className={`${formStyles.select} ${formErrors.orgUnitId ? formStyles.inputError : ''}`}
              value={formData.orgUnitId}
              onChange={(e) => setFormData({ ...formData, orgUnitId: e.target.value })}
              disabled={submitting}
            >
              <option value="">-- Chọn đơn vị --</option>
              {orgUnits.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.name}
                </option>
              ))}
            </select>
          </FormGroup>

          <FormGroup label="Mô tả">
            <textarea
              className={formStyles.textarea}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Mô tả về phòng ban..."
              disabled={submitting}
              rows={3}
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
          title="Ngừng hoạt động phòng ban?"
          description={`Bạn có chắc muốn ngừng hoạt động phòng ban "${deleteDialog.name}"?`}
          variant="warning"
          confirmLabel="Ngừng hoạt động"
          loading={submitting}
        />
      </div>
    </PermissionGate>
  );
}


