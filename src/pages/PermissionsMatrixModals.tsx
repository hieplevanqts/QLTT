/**
 * Modal Components for Permissions Matrix
 * Sử dụng design system từ theme.css với Inter font
 */

import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import styles from './PermissionsMatrixTab.module.css';

// ============================================
// TYPES
// ============================================

interface Module {
  id: number;
  code?: string;
  name: string;
  icon?: string;
  description: string | null;
  sort_order?: number;
  status?: number;
  created_at?: string;
  updated_at?: string;
}

interface Permission {
  id: number;
  name: string;
  code: string;
  module_id: number;
  description: string | null;
  is_default?: boolean;
  status?: number;
  created_at?: string;
  updated_at?: string;
}

// ============================================
// MODULE MODAL
// ============================================

interface ModuleModalProps {
  module: Module | null;
  onSave: (data: { name: string; description: string }) => void;
  onClose: () => void;
}

export const ModuleModal: React.FC<ModuleModalProps> = ({ module, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: module?.name || '',
    description: module?.description || '',
  });

  useEffect(() => {
    if (module) {
      setFormData({
        name: module.name || '',
        description: module.description || '',
      });
    }
  }, [module]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      return;
    }
    onSave(formData);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {module ? 'Chỉnh sửa Module' : 'Thêm Module mới'}
          </h2>
          <button className={styles.modalCloseButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="module-name">
                Tên module <span className={styles.required}>*</span>
              </label>
              <input
                id="module-name"
                type="text"
                className={styles.formInput}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nhập tên module..."
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="module-description">
                Mô tả
              </label>
              <textarea
                id="module-description"
                className={styles.formTextarea}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Nhập mô tả module..."
                rows={4}
              />
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button type="button" className={styles.btnSecondary} onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className={styles.btnPrimary}>
              <Save size={16} />
              {module ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============================================
// PERMISSION MODAL
// ============================================

interface PermissionModalProps {
  permission: Permission | null;
  selectedModule: number | '';
  modules: Module[];
  onSave: (data: { name: string; code: string; description: string; module: string }) => void;
  onClose: () => void;
}

export const PermissionModal: React.FC<PermissionModalProps> = ({
  permission,
  selectedModule,
  modules,
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    name: permission?.name || '',
    code: permission?.code || '',
    description: permission?.description || '',
    module: selectedModule ? String(selectedModule) : (permission?.module_id ? String(permission.module_id) : ''),
  });

  useEffect(() => {
    if (permission) {
      setFormData({
        name: permission.name || '',
        code: permission.code || '',
        description: permission.description || '',
        module: String(permission.module_id) || '',
      });
    } else if (selectedModule) {
      setFormData((prev) => ({ ...prev, module: String(selectedModule) }));
    }
  }, [permission, selectedModule]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim() || !formData.module) {
      return;
    }
    onSave(formData);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {permission ? 'Chỉnh sửa Quyền' : 'Thêm Quyền mới'}
          </h2>
          <button className={styles.modalCloseButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="permission-module">
                Module <span className={styles.required}>*</span>
              </label>
              <select
                id="permission-module"
                className={styles.formSelect}
                value={formData.module}
                onChange={(e) => setFormData({ ...formData, module: e.target.value })}
                required
              >
                <option value="">Chọn module...</option>
                {modules.map((mod) => (
                  <option key={mod.id} value={mod.id}>
                    {mod.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="permission-name">
                Tên quyền <span className={styles.required}>*</span>
              </label>
              <input
                id="permission-name"
                type="text"
                className={styles.formInput}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nhập tên quyền..."
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="permission-code">
                Mã quyền <span className={styles.required}>*</span>
              </label>
              <input
                id="permission-code"
                type="text"
                className={styles.formInput}
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="vd: user.view, user.create..."
                required
              />
              <span className={styles.formHint}>Định dạng: module.action (vd: user.view)</span>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="permission-description">
                Mô tả
              </label>
              <textarea
                id="permission-description"
                className={styles.formTextarea}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Nhập mô tả quyền..."
                rows={3}
              />
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button type="button" className={styles.btnSecondary} onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className={styles.btnPrimary}>
              <Save size={16} />
              {permission ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
