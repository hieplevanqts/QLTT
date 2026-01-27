/**
 * Province Modal - MAPPA Portal
 * Modal for CREATE/EDIT/VIEW province
 * Tuân thủ design tokens từ /src/styles/theme.css với Inter font
 */

import React, { useState, useEffect } from 'react';
import { X, Save, Building2 } from 'lucide-react';
import styles from '../pages/AdminPage.module.css';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';

interface Province {
  id: string;
  code: string;
  name: string;
  created_at: string;
}

interface ProvinceModalProps {
  mode: 'add' | 'edit' | 'view';
  province: Province | null;
  onClose: () => void;
  onSave: () => void;
}

export const ProvinceModal: React.FC<ProvinceModalProps> = ({
  mode,
  province,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (province) {
      setFormData({
        code: province.code || '',
        name: province.name || '',
      });
    }
  }, [province]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.code.trim() || !formData.name.trim()) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      setSaving(true);

      if (mode === 'add') {
        const { error } = await supabase.from('provinces').insert([
          {
            code: formData.code.trim(),
            name: formData.name.trim(),
          },
        ]);

        if (error) {
          console.error('❌ Error creating province:', error);
          toast.error(`Lỗi tạo tỉnh/thành phố: ${error.message}`);
          return;
        }

        toast.success('Đã tạo tỉnh/thành phố thành công');
      } else if (mode === 'edit' && province) {
        const { error } = await supabase
          .from('provinces')
          .update({
            code: formData.code.trim(),
            name: formData.name.trim(),
          })
          .eq('_id', province.id);

        if (error) {
          console.error('❌ Error updating province:', error);
          toast.error(`Lỗi cập nhật tỉnh/thành phố: ${error.message}`);
          return;
        }

        toast.success('Đã cập nhật tỉnh/thành phố thành công');
      }

      onSave();
      onClose();
    } catch (error) {
      console.error('❌ Error in handleSubmit:', error);
      toast.error('Lỗi lưu dữ liệu');
    } finally {
      setSaving(false);
    }
  };

  const isViewMode = mode === 'view';

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.modalHeaderLeft}>
            <Building2 size={24} style={{ color: 'var(--primary, #005cb6)' }} />
            <div>
              <h2 className={styles.modalTitle}>
                {mode === 'add' && 'Thêm tỉnh/thành phố mới'}
                {mode === 'edit' && 'Chỉnh sửa tỉnh/thành phố'}
                {mode === 'view' && 'Chi tiết tỉnh/thành phố'}
              </h2>
              <p className={styles.modalSubtitle}>
                {mode === 'add' && 'Nhập thông tin tỉnh/thành phố'}
                {mode === 'edit' && 'Cập nhật thông tin tỉnh/thành phố'}
                {mode === 'view' && 'Xem thông tin chi tiết'}
              </p>
            </div>
          </div>
          <button className={styles.modalCloseBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            {/* Mã tỉnh/TP */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Mã tỉnh/thành phố <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                className={styles.input}
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="Ví dụ: HN, HCM, DN..."
                disabled={isViewMode}
                required
              />
            </div>

            {/* Tên tỉnh/TP */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Tên tỉnh/thành phố <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                className={styles.input}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ví dụ: Hà Nội, Thành phố Hồ Chí Minh..."
                disabled={isViewMode}
                required
              />
            </div>

            {/* Created date (view mode only) */}
            {isViewMode && province && (
              <div className={styles.formGroup}>
                <label className={styles.label}>Ngày tạo</label>
                <input
                  type="text"
                  className={styles.input}
                  value={new Date(province.created_at).toLocaleString('vi-VN')}
                  disabled
                />
              </div>
            )}
          </div>

          {/* Footer */}
          <div className={styles.modalFooter}>
            <button type="button" className={styles.btnSecondary} onClick={onClose}>
              {isViewMode ? 'Đóng' : 'Hủy'}
            </button>
            {!isViewMode && (
              <button type="submit" className={styles.btnPrimary} disabled={saving}>
                <Save size={16} />
                {saving ? 'Đang lưu...' : 'Lưu'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProvinceModal;