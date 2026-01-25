/**
 * JURISDICTIONS PAGE (AREAS) - Danh mục hành chính
 * Full CRUD with mock service
 */

import React, { useState, useEffect } from 'react';
import { Plus, MapPin, Edit2, Power, Map } from 'lucide-react';
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
import type { CreateAreaPayload, UpdateAreaPayload, AreaType } from '../../mocks/masterData.types';
import type { Area } from '../../mocks/masterData.mock';
import {
  listAreas,
  getAreaById,
  createArea,
  updateArea,
  deleteArea
} from '../../mocks/masterData.service';

type FormMode = 'create' | 'edit' | null;

interface FormData {
  code: string;
  name: string;
  type: AreaType;
  parentId: string;
  provinceName: string;
  status: 'active' | 'inactive';
}

const initialFormData: FormData = {
  code: '',
  name: '',
  type: 'province',
  parentId: '',
  provinceName: '',
  status: 'active'
};

export default function JurisdictionsPage() {
  const { hasPermission } = usePermissions();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [areas, setAreas] = useState<Area[]>([]);
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

  const canCreate = hasPermission('sa.masterdata.jurisdiction.create');
  const canUpdate = hasPermission('sa.masterdata.jurisdiction.update');
  const canDelete = hasPermission('sa.masterdata.jurisdiction.delete');

  useEffect(() => {
    loadAreas();
  }, [currentPage, searchQuery]);

  const loadAreas = async () => {
    setLoading(true);
    try {
      const response = await listAreas({
        page: currentPage,
        pageSize,
        search: searchQuery,
        sort: { field: 'createdAt', order: 'desc' }
      });

      if (response.success && response.data) {
        setAreas(response.data.data);
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
    setFormData(initialFormData);
    setFormErrors({});
    setEditingId(null);
  };

  const handleOpenEdit = async (id: string) => {
    setFormMode('edit');
    setEditingId(id);
    setFormErrors({});

    const response = await getAreaById(id);
    if (response.success && response.data) {
      setFormData({
        code: response.data.code,
        name: response.data.name,
        type: response.data.type,
        parentId: response.data.parentId || '',
        provinceName: response.data.provinceName || '',
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
      errors.code = 'Mã địa bàn là bắt buộc';
    }

    if (!formData.name.trim()) {
      errors.name = 'Tên địa bàn là bắt buộc';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSubmitting(true);

    try {
      const payload: CreateAreaPayload | UpdateAreaPayload = {
        code: formData.code,
        name: formData.name,
        type: formData.type,
        parentId: formData.parentId || null,
        provinceName: formData.provinceName,
        status: formData.status
      };

      let response;
      if (formMode === 'create') {
        response = await createArea(payload as CreateAreaPayload);
      } else if (formMode === 'edit' && editingId) {
        response = await updateArea(editingId, payload);
      }

      if (response && response.success) {
        toast.success(formMode === 'create' ? 'Tạo địa bàn thành công' : 'Cập nhật địa bàn thành công');
        handleCloseForm();
        loadAreas();
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
      const response = await deleteArea(deleteDialog.id, false);
      if (response.success) {
        toast.success('Ngừng hoạt động địa bàn thành công');
        setDeleteDialog({ open: false, id: null, name: '' });
        loadAreas();
      } else {
        toast.error(response.error || 'Có lỗi xảy ra');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra');
    } finally {
      setSubmitting(false);
    }
  };

  const getTypeLabel = (type: AreaType) => {
    const map: Record<AreaType, string> = {
      province: 'Tỉnh/Thành phố',
      district: 'Quận/Huyện',
      ward: 'Phường/Xã'
    };
    return map[type];
  };

  const columns = [
    {
      header: 'Mã địa bàn',
      render: (item: Area) => <span className={cellStyles.code}>{item.code}</span>,
      width: '140px'
    },
    {
      header: 'Tên địa bàn',
      render: (item: Area) => <span className={cellStyles.name}>{item.name}</span>
    },
    {
      header: 'Loại',
      render: (item: Area) => (
        <StatusBadge variant="pending">{getTypeLabel(item.type)}</StatusBadge>
      ),
      width: '140px'
    },
    {
      header: 'Tỉnh/Thành',
      render: (item: Area) => <span className={cellStyles.muted}>{item.provinceName || '-'}</span>
    },
    {
      header: 'Trạng thái',
      render: (item: Area) => (
        <StatusBadge variant={item.status === 'active' ? 'active' : 'inactive'}>
          {item.status === 'active' ? 'Hoạt động' : 'Ngừng hoạt động'}
        </StatusBadge>
      ),
      width: '140px'
    },
    {
      header: 'Thao tác',
      render: (item: Area) => (
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
    <PermissionGate permission="sa.masterdata.jurisdiction.read">
      <div style={{ padding: '24px' }}>
        <PageHeader
          breadcrumbs={[
            { label: 'Trang chủ', href: '/' },
            { label: 'Quản trị hệ thống', href: '/system-admin' },
            { label: 'Dữ liệu nền' },
            { label: 'Danh mục hành chính' }
          ]}
          title="Danh mục hành chính"
          subtitle="Quản lý địa bàn theo cấp hành chính"
          actions={
            <Button size="sm" onClick={handleOpenCreate} disabled={!canCreate}>
              <Plus size={18} />
              Thêm địa bàn
            </Button>
          }
        />

        <Card>
          <CardContent>
            <DataToolbar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              searchPlaceholder="Tìm theo mã, tên địa bàn..."
              totalCount={totalCount}
              entityLabel="địa bàn"
            />

            {loading ? (
              <LoadingState message="Đang tải dữ liệu..." />
            ) : areas.length === 0 ? (
              <EmptyState
                icon={<MapPin size={48} />}
                title="Chưa có địa bàn"
                message="Chưa có địa bàn nào trong hệ thống. Nhấn 'Thêm địa bàn' để bắt đầu."
              />
            ) : (
              <>
                <DataTable columns={columns} data={areas} keyExtractor={(item) => item.id} />
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
              </>
            )}
          </CardContent>
        </Card>

        <FormDrawer
          open={formMode !== null}
          onClose={handleCloseForm}
          title={formMode === 'create' ? 'Thêm địa bàn' : 'Chỉnh sửa địa bàn'}
          subtitle={formMode === 'create' ? 'Tạo địa bàn mới' : 'Cập nhật thông tin địa bàn'}
          onSubmit={handleSubmit}
          loading={submitting}
        >
          <FormGroup label="Mã địa bàn" required error={formErrors.code}>
            <input
              type="text"
              className={`${formStyles.input} ${formErrors.code ? formStyles.inputError : ''}`}
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              placeholder="VD: HN"
              disabled={submitting}
            />
          </FormGroup>

          <FormGroup label="Tên địa bàn" required error={formErrors.name}>
            <input
              type="text"
              className={`${formStyles.input} ${formErrors.name ? formStyles.inputError : ''}`}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="VD: Hà Nội"
              disabled={submitting}
            />
          </FormGroup>

          <FormGroup label="Loại" required>
            <select
              className={formStyles.select}
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as AreaType })}
              disabled={submitting}
            >
              <option value="province">Tỉnh/Thành phố</option>
              <option value="district">Quận/Huyện</option>
              <option value="ward">Phường/Xã</option>
            </select>
          </FormGroup>

          <FormGroup label="Tỉnh/Thành phố">
            <input
              type="text"
              className={formStyles.input}
              value={formData.provinceName}
              onChange={(e) => setFormData({ ...formData, provinceName: e.target.value })}
              placeholder="VD: Hà Nội"
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
          title="Ngừng hoạt động địa bàn?"
          description={`Bạn có chắc muốn ngừng hoạt động địa bàn "${deleteDialog.name}"?`}
          variant="warning"
          confirmLabel="Ngừng hoạt động"
          loading={submitting}
        />
      </div>
    </PermissionGate>
  );
}


