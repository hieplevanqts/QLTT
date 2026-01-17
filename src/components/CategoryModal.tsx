/**
 * Category Modal Component - MAPPA Portal
 * Modal để thêm/sửa/xem danh mục
 * Tuân thủ design tokens từ /src/styles/theme.css với Inter font
 */

import React, { useState, useEffect } from 'react';
import { X, Tag, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';
import styles from './BankModal.module.css';

interface Category {
  id: string;
  name: string;
  icon: string;
  created_at: string;
}

interface CategoryModalProps {
  mode: 'add' | 'edit' | 'view';
  category: Category | null;
  onClose: () => void;
  onSave: () => void;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  mode,
  category,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    icon: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        icon: category.icon,
      });
    }
  }, [category]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tên danh mục không được để trống';
    }
    if (!formData.icon.trim()) {
      newErrors.icon = 'Icon không được để trống';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Vui lòng kiểm tra lại thông tin');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'add') {

        const { error } = await supabase.from('categories').insert([
          {
            name: formData.name.trim(),
            icon: formData.icon.trim(),
          },
        ]);

        if (error) {
          console.error('❌ Error creating category:', error);
          toast.error(`Lỗi tạo danh mục: ${error.message}`);
          return;
        }

        toast.success('Đã tạo danh mục thành công');
      } else if (mode === 'edit' && category) {

        const { error } = await supabase
          .from('categories')
          .update({
            name: formData.name.trim(),
            icon: formData.icon.trim(),
          })
          .eq('id', category.id);

        if (error) {
          console.error('❌ Error updating category:', error);
          toast.error(`Lỗi cập nhật danh mục: ${error.message}`);
          return;
        }

        toast.success('Đã cập nhật danh mục thành công');
      }

      onSave();
    } catch (error) {
      console.error('❌ Error:', error);
      toast.error('Lỗi khi lưu danh mục');
    } finally {
      setLoading(false);
    }
  };

  const isViewMode = mode === 'view';

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className={styles.modalIconWrapper}>
              <Tag size={20} />
            </div>
            <div>
              <h2 className={styles.modalTitle}>
                {mode === 'add' && 'Thêm danh mục mới'}
                {mode === 'edit' && 'Chỉnh sửa danh mục'}
                {mode === 'view' && 'Chi tiết danh mục'}
              </h2>
              {isViewMode && (
                <p className={styles.modalSubtitle}>Thông tin chi tiết danh mục</p>
              )}
            </div>
          </div>
          <button onClick={onClose} className={styles.closeButton}>
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.modalBody}>
          <div className={styles.formGrid}>
            {/* Tên danh mục */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Tên danh mục <span style={{ color: 'var(--destructive)' }}>*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={styles.input}
                placeholder="VD: Danh mục A"
                disabled={isViewMode}
                style={errors.name ? { borderColor: 'var(--destructive)' } : {}}
              />
              {errors.name && (
                <div className={styles.errorMessage}>
                  <AlertCircle size={14} />
                  {errors.name}
                </div>
              )}
            </div>

            {/* Icon */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Icon <span style={{ color: 'var(--destructive)' }}>*</span>
              </label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className={styles.input}
                placeholder="VD: 📁 hoặc icon-name"
                disabled={isViewMode}
                style={errors.icon ? { borderColor: 'var(--destructive)' } : {}}
              />
              {errors.icon && (
                <div className={styles.errorMessage}>
                  <AlertCircle size={14} />
                  {errors.icon}
                </div>
              )}
              <p style={{ 
                marginTop: '6px', 
                fontSize: 'var(--text-xs)', 
                color: 'var(--muted-foreground)' 
              }}>
                Có thể dùng emoji hoặc tên icon
              </p>
            </div>
          </div>

          {/* View mode info */}
          {isViewMode && category && (
            <div
              style={{
                marginTop: '16px',
                padding: '12px 16px',
                backgroundColor: 'var(--muted)',
                borderRadius: '8px',
                fontSize: 'var(--text-sm)',
                color: 'var(--muted-foreground)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>ID:</span>
                <span style={{ fontFamily: 'JetBrains Mono, Courier New, monospace' }}>
                  {category.id}
                </span>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className={styles.modalFooter}>
            <button type="button" onClick={onClose} className={styles.btnSecondary}>
              {isViewMode ? 'Đóng' : 'Hủy'}
            </button>
            {!isViewMode && (
              <button type="submit" className={styles.btnPrimary} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 size={18} className={styles.spinner} />
                    Đang lưu...
                  </>
                ) : (
                  <>Lưu thay đổi</>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;