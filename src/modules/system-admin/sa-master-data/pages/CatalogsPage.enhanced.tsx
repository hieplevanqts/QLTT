/**
 * CATALOGS PAGE - ENHANCED với Grid View & Group Badge
 * Full CRUD with mock service + Group filtering + View toggle
 */

import React, { useState, useEffect } from 'react';
import { Plus, List, Edit2, Power, Eye, FolderOpen, Layers, GitBranch, Grid, Lock } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Catalog } from '../types';
import type { CreateCatalogPayload, UpdateCatalogPayload } from '../../mocks/masterData.types';
import {
  listCatalogs,
  getCatalogByKey,
  createCatalog,
  updateCatalog,
  deleteCatalog
} from '../../mocks/masterData.service';

type FormMode = 'create' | 'edit' | null;
type GroupFilter = 'ALL' | 'COMMON' | 'DMS' | 'SYSTEM';
type ViewMode = 'table' | 'grid';

interface FormData {
  key: string;
  name: string;
  description: string;
  group: 'COMMON' | 'DMS' | 'SYSTEM';
  status: 'active' | 'inactive';
}

const initialFormData: FormData = {
  key: '',
  name: '',
  description: '',
  group: 'COMMON',
  status: 'active'
};

export default function CatalogsPageEnhanced() {
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get initial group filter from URL query params
  const urlGroup = searchParams.get('group');
  const normalizedGroup = urlGroup === 'DOMAIN' ? 'DMS' : urlGroup;
  const [activeTab, setActiveTab] = useState<GroupFilter>(
    normalizedGroup && ['COMMON', 'DMS', 'SYSTEM'].includes(normalizedGroup)
      ? (normalizedGroup as GroupFilter)
      : 'ALL'
  );
  
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formMode, setFormMode] = useState<FormMode>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; key: string | null; name: string }>(
{
      open: false,
      key: null,
      name: ''
    });

  const canCreate = hasPermission('sa.masterdata.catalog.create');
  const canUpdate = hasPermission('sa.masterdata.catalog.update');
  const canDelete = hasPermission('sa.masterdata.catalog.delete');

  useEffect(() => {
    loadCatalogs();
  }, [currentPage, searchQuery, activeTab]);

  const loadCatalogs = async () => {
    setLoading(true);
    try {
      const response = await listCatalogs({
        page: currentPage,
        pageSize,
        search: searchQuery,
        sort: { field: 'createdAt', order: 'desc' }
      });

      if (response.success && response.data) {
        // Filter by group if not "ALL"
        let filteredData = response.data.data;
        if (activeTab !== 'ALL') {
          filteredData = filteredData.filter(catalog => catalog.group === activeTab);
        }
        
        setCatalogs(filteredData);
        setTotalCount(filteredData.length);
        setTotalPages(Math.ceil(filteredData.length / pageSize));
      } else {
        toast.error(response.error || 'Lỗi khi tải dữ liệu');
      }
    } catch (error) {
      toast.error('Lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab: GroupFilter) => {
    setActiveTab(tab);
    setCurrentPage(1);
    
    // Update URL query params
    if (tab === 'ALL') {
      searchParams.delete('group');
    } else {
      searchParams.set('group', tab);
    }
    setSearchParams(searchParams);
  };

  const getGroupBadgeVariant = (group: Catalog['group']): 'active' | 'pending' | 'inactive' => {
    switch (group) {
      case 'COMMON': return 'active';
      case 'DMS': return 'pending';
      case 'SYSTEM': return 'inactive';
      default: return 'inactive';
    }
  };

  const getGroupLabel = (group: Catalog['group']): string => {
    switch (group) {
      case 'COMMON': return 'Dùng chung';
      case 'DMS': return 'Nghiệp vụ';
      case 'SYSTEM': return 'Kỹ thuật';
      default: return group;
    }
  };

  const handleOpenCreate = () => {
    setFormMode('create');
    setFormData(initialFormData);
    setFormErrors({});
    setEditingKey(null);
    setIsDirty(false);
  };

  const handleOpenEdit = async (key: string) => {
    setFormMode('edit');
    setEditingKey(key);
    setFormErrors({});
    setIsDirty(false);

    const response = await getCatalogByKey(key);
    if (response.success && response.data) {
      setFormData({
        key: response.data.key,
        name: response.data.name,
        description: response.data.description,
        group: response.data.group,
        status: response.data.status
      });
    }
  };

  const handleCloseForm = () => {
    if (isDirty && !submitting) {
      const confirmClose = window.confirm('Bạn có thay đổi chưa lưu. Bạn có chắc muốn đóng?');
      if (!confirmClose) return;
    }
    
    setFormMode(null);
    setFormData(initialFormData);
    setFormErrors({});
    setEditingKey(null);
    setIsDirty(false);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.key.trim()) {
      errors.key = 'Khóa danh mục là bắt buộc';
    } else if (!/^[a-z0-9-]+$/.test(formData.key)) {
      errors.key = 'Khóa chỉ chứa chữ thường, số và dấu gạch ngang';
    }

    if (!formData.name.trim()) {
      errors.name = 'Tên danh mục là bắt buộc';
    }

    if (!formData.description.trim()) {
      errors.description = 'Mô tả là bắt buộc';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSubmitting(true);

    try {
      const payload: CreateCatalogPayload | UpdateCatalogPayload = {
        key: formData.key,
        name: formData.name,
        description: formData.description,
        group: formData.group,
        status: formData.status
      };

      let response;
      if (formMode === 'create') {
        response = await createCatalog(payload as CreateCatalogPayload);
      } else if (formMode === 'edit' && editingKey) {
        response = await updateCatalog(editingKey, payload);
      }

      if (response && response.success) {
        toast.success(formMode === 'create' ? 'Tạo danh mục thành công' : 'Cập nhật danh mục thành công');
        handleCloseForm();
        loadCatalogs();
      } else {
        toast.error(response?.error || 'Có lỗi xảy ra');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenDelete = (key: string, name: string) => {
    setDeleteDialog({ open: true, key, name });
  };

  const handleConfirmDelete = async () => {
    if (!deleteDialog.key) return;

    setSubmitting(true);
    try {
      const response = await deleteCatalog(deleteDialog.key, false);
      if (response.success) {
        toast.success('Ngừng hoạt động danh mục thành công');
        setDeleteDialog({ open: false, key: null, name: '' });
        loadCatalogs();
      } else {
        toast.error(response.error || 'Có lỗi xảy ra');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra');
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewItems = (catalogKey: string) => {
    navigate(`/system-admin/master-data/catalogs/${catalogKey}/items`);
  };

  const handleFormChange = (updates: Partial<FormData>) => {
    setFormData({ ...formData, ...updates });
    setIsDirty(true);
  };

  // Table columns - include Group badge when showing "ALL"
  const columns = [
    {
      header: 'Khóa',
      render: (item: Catalog) => <span className={cellStyles.code}>{item.key}</span>,
      width: '180px'
    },
    {
      header: 'Tên danh mục',
      render: (item: Catalog) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className={cellStyles.name}>{item.name}</span>
          {item.isLocked && <Lock size={14} style={{ color: 'var(--muted-foreground)' }} />}
        </div>
      )
    },
    ...(activeTab === 'ALL' ? [{
      header: 'Nhóm',
      render: (item: Catalog) => (
        <StatusBadge variant={getGroupBadgeVariant(item.group)}>
          {getGroupLabel(item.group)}
        </StatusBadge>
      ),
      width: '120px'
    }] : []),
    {
      header: 'Mô tả',
      render: (item: Catalog) => <span className={cellStyles.muted}>{item.description}</span>
    },
    {
      header: 'Số mục',
      render: (item: Catalog) => <span>{item.itemCount}</span>,
      width: '100px'
    },
    {
      header: 'Trạng thái',
      render: (item: Catalog) => (
        <StatusBadge variant={item.status === 'active' ? 'active' : 'inactive'}>
          {item.status === 'active' ? 'Hoạt động' : 'Ngừng hoạt động'}
        </StatusBadge>
      ),
      width: '140px'
    },
    {
      header: 'Thao tác',
      render: (item: Catalog) => (
        <div className={cellStyles.actions}>
          <button className={cellStyles.actionButton} onClick={() => handleViewItems(item.key)}>
            <Eye size={14} style={{ marginRight: '4px' }} />
            Xem
          </button>
          <button className={cellStyles.actionButton} onClick={() => handleOpenEdit(item.key)} disabled={!canUpdate}>
            <Edit2 size={14} style={{ marginRight: '4px' }} />
            Sửa
          </button>
          {item.status === 'active' && !item.isLocked && (
            <button
              className={cellStyles.actionButtonDanger}
              onClick={() => handleOpenDelete(item.key, item.name)}
              disabled={!canDelete}
            >
              <Power size={14} style={{ marginRight: '4px' }} />
              Ngừng
            </button>
          )}
        </div>
      ),
      width: '240px'
    }
  ];

  // Grid view grouped by catalog group
  const renderGridView = () => {
    const groups = activeTab === 'ALL' 
      ? [
          { key: 'COMMON', label: 'Dùng chung', icon: FolderOpen, color: '#28C76F' },
          { key: 'DMS', label: 'Nghiệp vụ', icon: Layers, color: '#FF9F43' },
          { key: 'SYSTEM', label: 'Kỹ thuật', icon: GitBranch, color: '#9E9E9E' }
        ]
      : [{ 
          key: activeTab, 
          label: getGroupLabel(activeTab as any),
          icon: activeTab === 'COMMON' ? FolderOpen : activeTab === 'DMS' ? Layers : GitBranch,
          color: activeTab === 'COMMON' ? '#28C76F' : activeTab === 'DMS' ? '#FF9F43' : '#9E9E9E'
        }];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {groups.map(group => {
          const Icon = group.icon;
          const groupCatalogs = catalogs.filter(c => c.group === group.key);
          
          if (groupCatalogs.length === 0) return null;

          return (
            <div key={group.key}>
              {/* Group Header */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                marginBottom: '16px',
                paddingBottom: '12px',
                borderBottom: `2px solid ${group.color}`
              }}>
                <Icon size={24} style={{ color: group.color }} />
                <h3 style={{ 
                  margin: 0,
                  fontSize: 'var(--text-lg)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: group.color
                }}>
                  {group.label}
                </h3>
                <span style={{ 
                  fontSize: 'var(--text-sm)', 
                  color: 'var(--muted-foreground)',
                  marginLeft: '8px'
                }}>
                  ({groupCatalogs.length} danh mục)
                </span>
              </div>

              {/* Catalog Cards Grid */}
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '16px'
              }}>
                {groupCatalogs.map(catalog => (
                  <div 
                    key={catalog.key}
                    onClick={() => handleViewItems(catalog.key)}
                    style={{
                      background: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '20px',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = group.color;
                      e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <h4 style={{ 
                            margin: 0,
                            fontSize: 'var(--text-base)',
                            fontWeight: 'var(--font-weight-semibold)',
                            color: 'var(--foreground)'
                          }}>
                            {catalog.name}
                          </h4>
                          {catalog.isLocked && <Lock size={14} style={{ color: 'var(--muted-foreground)' }} />}
                        </div>
                        <div style={{ 
                          fontSize: 'var(--text-xs)',
                          color: 'var(--muted-foreground)',
                          fontFamily: 'var(--font-family-mono)'
                        }}>
                          {catalog.key}
                        </div>
                      </div>
                      <StatusBadge variant={catalog.status === 'active' ? 'active' : 'inactive'}>
                        {catalog.status === 'active' ? 'Hoạt động' : 'Ngừng'}
                      </StatusBadge>
                    </div>

                    <p style={{ 
                      margin: '0 0 16px 0',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--muted-foreground)',
                      lineHeight: 'var(--line-height-normal)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {catalog.description}
                    </p>

                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingTop: '12px',
                      borderTop: '1px solid var(--border)'
                    }}>
                      <div style={{ 
                        fontSize: 'var(--text-sm)',
                        color: 'var(--muted-foreground)'
                      }}>
                        <strong style={{ color: 'var(--foreground)' }}>{catalog.itemCount}</strong> mục
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          className={cellStyles.actionButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEdit(catalog.key);
                          }}
                          disabled={!canUpdate}
                          style={{ padding: '4px 8px', fontSize: 'var(--text-xs)' }}
                        >
                          <Edit2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <PermissionGate permission="sa.masterdata.catalog.read">
      <div style={{ padding: '24px' }}>
        <PageHeader
          breadcrumbs={[
            { label: 'Trang chủ', href: '/' },
            { label: 'Quản trị hệ thống', href: '/system-admin' },
            { label: 'Dữ liệu nền' },
            { label: 'Danh mục hệ thống' }
          ]}
          title="Quản lý Danh mục"
          subtitle="Quản lý các danh mục dùng chung trong hệ thống"
          actions={
            <Button size="sm" onClick={handleOpenCreate} disabled={!canCreate}>
              <Plus size={18} />
              Thêm danh mục
            </Button>
          }
        />

        <Card>
          <CardContent>
            {/* Tabs for group filtering */}
            <div style={{
              display: 'flex',
              gap: '8px',
              marginBottom: '24px',
              borderBottom: '1px solid var(--border)',
              paddingBottom: '0'
            }}>
              {[
                { key: 'ALL', label: 'Tất cả', icon: List },
                { key: 'COMMON', label: 'Dùng chung', icon: FolderOpen },
                { key: 'DMS', label: 'Nghiệp vụ', icon: Layers },
                { key: 'SYSTEM', label: 'Kỹ thuật', icon: GitBranch }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => handleTabChange(tab.key as GroupFilter)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '10px 16px',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: isActive ? '2px solid var(--primary)' : '2px solid transparent',
                      color: isActive ? 'var(--primary)' : 'var(--muted-foreground)',
                      fontWeight: isActive ? 'var(--font-weight-semibold)' : 'var(--font-weight-medium)',
                      fontSize: 'var(--text-sm)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Icon size={16} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Toolbar with View Toggle */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <DataToolbar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                searchPlaceholder="Tìm theo khóa, tên danh mục..."
                totalCount={totalCount}
                entityLabel="danh mục"
              />
              
              <div style={{ display: 'flex', gap: '4px', marginLeft: '16px' }}>
                <button
                  onClick={() => setViewMode('table')}
                  style={{
                    padding: '8px 12px',
                    background: viewMode === 'table' ? 'var(--primary)' : 'var(--bg-secondary)',
                    color: viewMode === 'table' ? 'var(--primary-foreground)' : 'var(--foreground)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <List size={16} />
                  Bảng
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  style={{
                    padding: '8px 12px',
                    background: viewMode === 'grid' ? 'var(--primary)' : 'var(--bg-secondary)',
                    color: viewMode === 'grid' ? 'var(--primary-foreground)' : 'var(--foreground)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <Grid size={16} />
                  Grid
                </button>
              </div>
            </div>

            {loading ? (
              <LoadingState message="Đang tải dữ liệu..." />
            ) : catalogs.length === 0 ? (
              <EmptyState
                icon={<List size={48} />}
                title="Chưa có danh mục"
                message="Chưa có danh mục nào trong hệ thống. Nhấn 'Thêm danh mục' để bắt đầu."
              />
            ) : (
              <>
                {viewMode === 'table' ? (
                  <>
                    <DataTable columns={columns} data={catalogs} keyExtractor={(item) => item.key} />
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                  </>
                ) : (
                  renderGridView()
                )}
              </>
            )}
          </CardContent>
        </Card>

        <FormDrawer
          open={formMode !== null}
          onClose={handleCloseForm}
          title={formMode === 'create' ? 'Thêm danh mục' : 'Chỉnh sửa danh mục'}
          subtitle={formMode === 'create' ? 'Tạo danh mục mới' : 'Cập nhật thông tin danh mục'}
          onSubmit={handleSubmit}
          loading={submitting}
          submitDisabled={!isDirty || Object.keys(formErrors).length > 0}
        >
          <FormGroup label="Khóa danh mục" required error={formErrors.key}>
            <input
              type="text"
              className={`${formStyles.input} ${formErrors.key ? formStyles.inputError : ''}`}
              value={formData.key}
              onChange={(e) => handleFormChange({ key: e.target.value })}
              placeholder="VD: violation-types"
              disabled={submitting || formMode === 'edit'}
            />
            {formMode === 'create' && (
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', marginTop: '4px' }}>
                Chỉ chứa chữ thường, số và dấu gạch ngang (-)
              </div>
            )}
          </FormGroup>

          <FormGroup label="Tên danh mục" required error={formErrors.name}>
            <input
              type="text"
              className={`${formStyles.input} ${formErrors.name ? formStyles.inputError : ''}`}
              value={formData.name}
              onChange={(e) => handleFormChange({ name: e.target.value })}
              placeholder="VD: Loại vi phạm"
              disabled={submitting}
            />
          </FormGroup>

          <FormGroup label="Mô tả" required error={formErrors.description}>
            <textarea
              className={`${formStyles.textarea} ${formErrors.description ? formStyles.inputError : ''}`}
              value={formData.description}
              onChange={(e) => handleFormChange({ description: e.target.value })}
              placeholder="Mô tả về danh mục..."
              disabled={submitting}
              rows={3}
            />
          </FormGroup>

          <FormGroup label="Nhóm" required>
            <select
              className={formStyles.select}
              value={formData.group}
              onChange={(e) => handleFormChange({ group: e.target.value as 'COMMON' | 'DMS' | 'SYSTEM' })}
              disabled={submitting}
            >
              <option value="COMMON">Dùng chung</option>
              <option value="DMS">Nghiệp vụ</option>
              <option value="SYSTEM">Kỹ thuật</option>
            </select>
          </FormGroup>

          <FormGroup label="Trạng thái" required>
            <select
              className={formStyles.select}
              value={formData.status}
              onChange={(e) => handleFormChange({ status: e.target.value as 'active' | 'inactive' })}
              disabled={submitting}
            >
              <option value="active">Hoạt động</option>
              <option value="inactive">Ngừng hoạt động</option>
            </select>
          </FormGroup>
        </FormDrawer>

        <ConfirmDialog
          open={deleteDialog.open}
          onClose={() => setDeleteDialog({ open: false, key: null, name: '' })}
          onConfirm={handleConfirmDelete}
          title="Ngừng hoạt động danh mục?"
          description={`Bạn có chắc muốn ngừng hoạt động danh mục "${deleteDialog.name}"?`}
          variant="warning"
          confirmLabel="Ngừng hoạt động"
          loading={submitting}
        />
      </div>
    </PermissionGate>
  );
}


