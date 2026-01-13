import React, { useState, useEffect } from 'react';
import { Plus, Edit, Eye, Trash2, UserCheck, Save, Check, X } from 'lucide-react';
import styles from './AdminPage.module.css';
import { supabase } from '../lib/supabase';

interface Province {
  id: string;
  code: string;
  name: string;
}

interface Ward {
  id: string;
  code: string;
  name: string;
}

interface PermissionSet {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
}

interface ModulePermission {
  module: string;
  permissions: PermissionSet;
}

interface UniversalModalProps {
  type: 'add' | 'edit' | 'view' | 'delete' | 'assign';
  item: any;
  subTab: string;
  onClose: () => void;
  onSave: (formData: any) => void;
  onDelete: () => void;
}

export const UniversalModal: React.FC<UniversalModalProps> = ({
  type,
  item,
  subTab,
  onClose,
  onSave,
  onDelete,
}) => {
  const [formData, setFormData] = useState<any>({});
  const [permissions, setPermissions] = useState<ModulePermission[]>([
    { module: 'Tổng quan', permissions: { view: false, create: false, edit: false, delete: false } },
    { module: 'Bản đồ', permissions: { view: false, create: false, edit: false, delete: false } },
    { module: 'Cơ sở & Địa bàn', permissions: { view: false, create: false, edit: false, delete: false } },
    { module: 'Nhiệm vụ', permissions: { view: false, create: false, edit: false, delete: false } },
    { module: 'Kiểm tra', permissions: { view: false, create: false, edit: false, delete: false } },
    { module: 'Báo cáo', permissions: { view: false, create: false, edit: false, delete: false } },
    { module: 'Quản trị hệ thống', permissions: { view: false, create: false, edit: false, delete: false } },
  ]);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Fetch provinces và wards khi cần
  useEffect(() => {
    if (subTab === 'territory') {
      fetchProvincesAndWards();
    }
  }, [subTab]);

  const fetchProvincesAndWards = async () => {
    try {
      setLoadingData(true);
      
      // Fetch provinces from provinces table
      const { data: provincesData, error: provincesError } = await supabase
        .from('provinces')
        .select('id, code, name')
        .order('name');
      
      if (provincesError) {
        console.error('Error fetching provinces:', provincesError);
      } else {
        setProvinces(provincesData || []);
      }

      // Fetch wards from wards table
      const { data: wardsData, error: wardsError } = await supabase
        .from('wards')
        .select('id, code, name')
        .order('name');
      
      if (wardsError) {
        console.error('Error fetching wards:', wardsError);
      } else {
        setWards(wardsData || []);
      }
    } catch (error) {
      console.error('Error in fetchProvincesAndWards:', error);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (item && (type === 'edit' || type === 'view')) {
      setFormData(item);
      
      // Load permissions for role edit
      if (subTab === 'roles') {
        // If item already has permissions, load them
        if (item.permissions && Array.isArray(item.permissions)) {
          // Deep clone to avoid reference issues
          const clonedPermissions = item.permissions.map(p => ({
            module: p.module,
            permissions: { ...p.permissions }
          }));
          setPermissions(clonedPermissions);
        } else if (item.code) {
          // Otherwise load based on role code
          loadRolePermissions(item.code);
        }
      }
    } else {
      // Reset for add mode
      setFormData({});
      if (subTab === 'roles') {
        setPermissions([
          { module: 'Tổng quan', permissions: { view: false, create: false, edit: false, delete: false } },
          { module: 'Bản đồ', permissions: { view: false, create: false, edit: false, delete: false } },
          { module: 'Cơ sở & Địa bàn', permissions: { view: false, create: false, edit: false, delete: false } },
          { module: 'Nhiệm vụ', permissions: { view: false, create: false, edit: false, delete: false } },
          { module: 'Kiểm tra', permissions: { view: false, create: false, edit: false, delete: false } },
          { module: 'Báo cáo', permissions: { view: false, create: false, edit: false, delete: false } },
          { module: 'Quản trị hệ thống', permissions: { view: false, create: false, edit: false, delete: false } },
        ]);
      }
    }
  }, [item, type, subTab]);

  const loadRolePermissions = (roleCode: string) => {
    // Mock logic - in real app, load from backend
    let loadedPermissions = [...permissions];
    
    switch (roleCode) {
      case 'ADMIN':
        loadedPermissions = loadedPermissions.map(p => ({
          ...p,
          permissions: { view: true, create: true, edit: true, delete: true }
        }));
        break;
      case 'MANAGER':
        loadedPermissions = loadedPermissions.map((p, i) => ({
          ...p,
          permissions: i <= 5 
            ? { view: true, create: i >= 2, edit: i >= 2, delete: false }
            : { view: false, create: false, edit: false, delete: false }
        }));
        break;
      case 'OFFICER':
        loadedPermissions = loadedPermissions.map((p, i) => ({
          ...p,
          permissions: i <= 4
            ? { view: true, create: i >= 2 && i <= 3, edit: i >= 2 && i <= 3, delete: false }
            : { view: false, create: false, edit: false, delete: false }
        }));
        break;
      case 'CITIZEN':
        loadedPermissions = loadedPermissions.map((p, i) => ({
          ...p,
          permissions: i <= 1
            ? { view: true, create: false, edit: false, delete: false }
            : { view: false, create: false, edit: false, delete: false }
        }));
        break;
    }
    
    setPermissions(loadedPermissions);
  };

  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handlePermissionChange = (moduleIndex: number, permissionType: keyof PermissionSet) => {
    const newPermissions = [...permissions];
    newPermissions[moduleIndex].permissions[permissionType] = !newPermissions[moduleIndex].permissions[permissionType];
    setPermissions(newPermissions);
  };

  const handleModuleToggle = (moduleIndex: number) => {
    const newPermissions = [...permissions];
    const currentPerms = newPermissions[moduleIndex].permissions;
    const hasAny = currentPerms.view || currentPerms.create || currentPerms.edit || currentPerms.delete;
    const newValue = !hasAny;
    
    newPermissions[moduleIndex].permissions = {
      view: newValue,
      create: newValue,
      edit: newValue,
      delete: newValue,
    };
    setPermissions(newPermissions);
  };

  const isModuleIndeterminate = (perms: PermissionSet) => {
    const values = [perms.view, perms.create, perms.edit, perms.delete];
    const trueCount = values.filter(v => v).length;
    return trueCount > 0 && trueCount < 4;
  };

  const isModuleChecked = (perms: PermissionSet) => {
    return perms.view && perms.create && perms.edit && perms.delete;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (type === 'delete') {
      onDelete();
    } else {
      const dataToSave = subTab === 'roles' 
        ? { ...formData, permissions } 
        : formData;
      onSave(dataToSave);
    }
  };

  const getModalTitle = () => {
    if (type === 'delete') return 'Xác nhận xóa';
    if (type === 'assign') return 'Gán quyền / phạm vi';
    if (type === 'view') return 'Xem chi tiết';
    if (type === 'edit') return 'Chỉnh sửa';
    return 'Thêm mới';
  };

  const getModalIcon = () => {
    if (type === 'delete') return <Trash2 size={24} style={{ color: '#ef4444' }} />;
    if (type === 'assign') return <UserCheck size={24} style={{ color: '#4F46E5' }} />;
    if (type === 'view') return <Eye size={24} style={{ color: '#4F46E5' }} />;
    if (type === 'edit') return <Edit size={24} style={{ color: '#4F46E5' }} />;
    return <Plus size={24} style={{ color: '#4F46E5' }} />;
  };

  const renderFormFields = () => {
    if (type === 'delete') {
      return (
        <div>
          <p>Bạn có chắc chắn muốn xóa mục này?</p>
          {item && (
            <div className={styles.deletePreview}>
              <strong>{item.name || item.fullName || item.code}</strong>
            </div>
          )}
          <div className={styles.formGroup}>
            <label>Lý do xóa <span className={styles.required}>*</span></label>
            <textarea className={styles.textarea} rows={3} placeholder="Nhập lý do xóa..." />
          </div>
        </div>
      );
    }

    if (type === 'assign') {
      return (
        <div>
          <div className={styles.formGroup}>
            <label>Vai trò / Quyền <span className={styles.required}>*</span></label>
            <select className={styles.select}>
              <option>-- Chọn vai trò --</option>
              <option>Công dân</option>
              <option>Cán bộ thực thi</option>
              <option>Quản lý cấp huyện</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Phạm vi / Địa bàn</label>
            <select className={styles.select}>
              <option>-- Chọn địa bàn --</option>
              <option>Hà Nội</option>
              <option>Quận Ba Đình</option>
              <option>Phường Ngọc Hà</option>
            </select>
          </div>
        </div>
      );
    }

    // Render form fields based on subTab
    const isReadOnly = type === 'view';

    return (
      <div className={styles.formGrid}>
        {/* Common fields */}
        <div className={styles.formGroup}>
          <label>Mã <span className={styles.required}>*</span></label>
          <input
            type="text"
            className={styles.input}
            value={formData.code || formData.username || ''}
            onChange={(e) => handleChange(formData.username !== undefined ? 'username' : 'code', e.target.value)}
            disabled={isReadOnly}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Tên <span className={styles.required}>*</span></label>
          <input
            type="text"
            className={styles.input}
            value={formData.name || formData.fullName || ''}
            onChange={(e) => handleChange(formData.fullName !== undefined ? 'fullName' : 'name', e.target.value)}
            disabled={isReadOnly}
          />
        </div>

        {/* User-specific fields */}
        {(subTab === 'user-list' || subTab === 'user-detail') && (
          <>
            <div className={styles.formGroup}>
              <label>Email <span className={styles.required}>*</span></label>
              <input
                type="email"
                className={styles.input}
                value={formData.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
                disabled={isReadOnly}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Điện thoại</label>
              <input
                type="tel"
                className={styles.input}
                value={formData.phone || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
                disabled={isReadOnly}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Vai trò</label>
              <select
                className={styles.select}
                value={formData.role || ''}
                onChange={(e) => handleChange('role', e.target.value)}
                disabled={isReadOnly}
              >
                <option>Công dân</option>
                <option>Cán bộ thực thi</option>
                <option>Quản lý cấp huyện</option>
                <option>Quản trị hệ thống</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Đơn vị</label>
              <input
                type="text"
                className={styles.input}
                value={formData.unit || ''}
                onChange={(e) => handleChange('unit', e.target.value)}
                disabled={isReadOnly}
              />
            </div>
          </>
        )}

        {/* Territory-specific fields */}
        {subTab === 'territory' && (
          <>
            <div className={styles.formGroup}>
              <label>Cấp <span className={styles.required}>*</span></label>
              <select
                className={styles.select}
                value={formData.level || ''}
                onChange={(e) => {
                  handleChange('level', e.target.value);
                  // Reset territory_id khi chuyển cấp
                  handleChange('territory_id', '');
                }}
                disabled={isReadOnly}
              >
                <option value="">-- Chọn cấp --</option>
                <option value="province">Tỉnh/TP</option>
                <option value="ward">Xã/Phường</option>
              </select>
            </div>

            {/* Select Tỉnh/TP khi chọn cấp Tỉnh/TP */}
            {formData.level === 'province' && (
              <div className={styles.formGroup}>
                <label>Tỉnh/Thành phố <span className={styles.required}>*</span></label>
                <select
                  className={styles.select}
                  value={formData.territory_id || ''}
                  onChange={(e) => handleChange('territory_id', e.target.value)}
                  disabled={isReadOnly || loadingData}
                >
                  <option value="">-- Chọn Tỉnh/TP --</option>
                  {loadingData ? (
                    <option disabled>Đang tải...</option>
                  ) : (
                    provinces.map((province) => (
                      <option key={province.id} value={province.id}>
                        {province.name}
                      </option>
                    ))
                  )}
                </select>
                {provinces.length === 0 && !loadingData && (
                  <small style={{ color: 'var(--muted-foreground)', fontSize: '12px' }}>
                    Không có dữ liệu Tỉnh/TP
                  </small>
                )}
              </div>
            )}

            {/* Select Xã/Phường khi chọn cấp Xã/Phường */}
            {formData.level === 'ward' && (
              <div className={styles.formGroup}>
                <label>Xã/Phường <span className={styles.required}>*</span></label>
                <select
                  className={styles.select}
                  value={formData.territory_id || ''}
                  onChange={(e) => handleChange('territory_id', e.target.value)}
                  disabled={isReadOnly || loadingData}
                >
                  <option value="">-- Chọn Xã/Phường --</option>
                  {loadingData ? (
                    <option disabled>Đang tải...</option>
                  ) : (
                    wards.map((ward) => (
                      <option key={ward.id} value={ward.id}>
                        {ward.name}
                      </option>
                    ))
                  )}
                </select>
                {wards.length === 0 && !loadingData && (
                  <small style={{ color: 'var(--muted-foreground)', fontSize: '12px' }}>
                    Không có dữ liệu Xã/Phường
                  </small>
                )}
              </div>
            )}
          </>
        )}

        {/* Team-specific fields */}
        {subTab === 'teams' && (
          <>
            <div className={styles.formGroup}>
              <label>Loại</label>
              <select
                className={styles.select}
                value={formData.type || 'team'}
                onChange={(e) => handleChange('type', e.target.value)}
                disabled={isReadOnly}
              >
                <option value="department">Phòng ban</option>
                <option value="team">Đội</option>
                <option value="group">Tổ</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Trưởng đơn vị</label>
              <input
                type="text"
                className={styles.input}
                value={formData.leader || ''}
                onChange={(e) => handleChange('leader', e.target.value)}
                disabled={isReadOnly}
              />
            </div>
          </>
        )}

        {/* Category-specific fields */}
        {subTab === 'category-management' && (
          <>
            <div className={styles.formGroup}>
              <label>Loại</label>
              <input
                type="text"
                className={styles.input}
                value={formData.type || 'Loại hình cơ sở'}
                onChange={(e) => handleChange('type', e.target.value)}
                disabled={isReadOnly}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Hiệu lực từ</label>
              <input
                type="date"
                className={styles.input}
                value={formData.effectiveFrom || ''}
                onChange={(e) => handleChange('effectiveFrom', e.target.value)}
                disabled={isReadOnly}
              />
            </div>
          </>
        )}

        {/* Risk Indicator-specific fields */}
        {subTab === 'risk-config' && (
          <>
            <div className={styles.formGroup}>
              <label>Loại rủi ro</label>
              <select
                className={styles.select}
                value={formData.type || 'low'}
                onChange={(e) => handleChange('type', e.target.value)}
                disabled={isReadOnly}
              >
                <option value="high">Cao</option>
                <option value="medium">Trung bình</option>
                <option value="low">Thấp</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Ngưỡng</label>
              <input
                type="number"
                className={styles.input}
                value={formData.threshold || ''}
                onChange={(e) => handleChange('threshold', e.target.value)}
                disabled={isReadOnly}
              />
            </div>
          </>
        )}

        {/* Checklist-specific fields */}
        {subTab === 'checklist' && (
          <>
            <div className={styles.formGroup}>
              <label>Chuyên đề</label>
              <input
                type="text"
                className={styles.input}
                value={formData.topic || ''}
                onChange={(e) => handleChange('topic', e.target.value)}
                disabled={isReadOnly}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Số mục</label>
              <input
                type="number"
                className={styles.input}
                value={formData.itemCount || ''}
                onChange={(e) => handleChange('itemCount', e.target.value)}
                disabled={isReadOnly}
              />
            </div>
          </>
        )}

        {/* Notification Rule-specific fields */}
        {subTab === 'notification-rules' && (
          <>
            <div className={styles.formGroup}>
              <label>Sự kiện</label>
              <input
                type="text"
                className={styles.input}
                value={formData.event || ''}
                onChange={(e) => handleChange('event', e.target.value)}
                disabled={isReadOnly}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Điều kiện</label>
              <input
                type="text"
                className={styles.input}
                value={formData.condition || ''}
                onChange={(e) => handleChange('condition', e.target.value)}
                disabled={isReadOnly}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Người nhận</label>
              <input
                type="text"
                className={styles.input}
                value={formData.recipients || ''}
                onChange={(e) => handleChange('recipients', e.target.value)}
                disabled={isReadOnly}
              />
            </div>
          </>
        )}

        {/* Status field for most entities */}
        <div className={styles.formGroup}>
          <label>Trạng thái</label>
          <select
            className={styles.select}
            value={formData.status || 'active'}
            onChange={(e) => handleChange('status', e.target.value)}
            disabled={isReadOnly}
          >
            <option value="active">Hoạt động</option>
            <option value="inactive">Không hoạt động</option>
            {(subTab === 'user-list' || subTab === 'user-detail') && (
              <>
                <option value="locked">Đã khóa</option>
                <option value="pending">Chờ duyệt</option>
              </>
            )}
          </select>
        </div>

        {/* Description field */}
        {!isReadOnly && (
          <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
            <label>Mô tả</label>
            <textarea
              className={styles.textarea}
              rows={3}
              value={formData.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Mô tả chi tiết..."
            />
          </div>
        )}

        {/* Role permissions */}
        {subTab === 'roles' && !isReadOnly && (
          <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
            <label>Quyền truy cập</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3, 12px)' }}>
              {permissions.map((perm, index) => {
                const moduleId = `module-${index}`;
                const isChecked = isModuleChecked(perm.permissions);
                const isIndeterminate = isModuleIndeterminate(perm.permissions);
                
                return (
                  <div key={index} className={styles.permissionTreeItem}>
                    <div className={styles.permissionTreeHeader}>
                      <input
                        ref={(el) => {
                          if (el) el.indeterminate = isIndeterminate;
                        }}
                        id={moduleId}
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleModuleToggle(index)}
                      />
                      <label htmlFor={moduleId}>{perm.module}</label>
                    </div>
                    <div className={styles.permissionTreeChildren}>
                      <div className={styles.permissionTreeChild}>
                        <input
                          type="checkbox"
                          id={`${moduleId}-view`}
                          checked={perm.permissions.view}
                          onChange={() => handlePermissionChange(index, 'view')}
                        />
                        <label htmlFor={`${moduleId}-view`}>Xem</label>
                      </div>
                      <div className={styles.permissionTreeChild}>
                        <input
                          type="checkbox"
                          id={`${moduleId}-create`}
                          checked={perm.permissions.create}
                          onChange={() => handlePermissionChange(index, 'create')}
                        />
                        <label htmlFor={`${moduleId}-create`}>Tạo mới</label>
                      </div>
                      <div className={styles.permissionTreeChild}>
                        <input
                          type="checkbox"
                          id={`${moduleId}-edit`}
                          checked={perm.permissions.edit}
                          onChange={() => handlePermissionChange(index, 'edit')}
                        />
                        <label htmlFor={`${moduleId}-edit`}>Chỉnh sửa</label>
                      </div>
                      <div className={styles.permissionTreeChild}>
                        <input
                          type="checkbox"
                          id={`${moduleId}-delete`}
                          checked={perm.permissions.delete}
                          onChange={() => handlePermissionChange(index, 'delete')}
                        />
                        <label htmlFor={`${moduleId}-delete`}>Xóa</label>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className={styles.modalHeader}>
            {getModalIcon()}
            <h3>{getModalTitle()}</h3>
            <button type="button" className={styles.closeBtn} onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          <div className={styles.modalBody}>
            {renderFormFields()}
          </div>

          <div className={styles.modalFooter}>
            <button type="button" className={styles.secondaryBtn} onClick={onClose}>
              {type === 'view' ? 'Đóng' : 'Hủy'}
            </button>
            {type !== 'view' && (
              <button type="submit" className={type === 'delete' ? styles.dangerBtn : styles.primaryBtn}>
                {type === 'add' && <><Save size={16} /> Tạo mới</>}
                {type === 'edit' && <><Save size={16} /> Lưu thay đổi</>}
                {type === 'delete' && <><Trash2 size={16} /> Xác nhận xóa</>}
                {type === 'assign' && <><Check size={16} /> Xác nhận gán</>}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};