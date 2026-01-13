/**
 * Ward Modal - MAPPA Portal
 * Modal for CREATE/EDIT/VIEW ward with province selection
 * Tuân thủ design tokens từ /src/styles/theme.css với Inter font
 */

import React, { useState, useEffect } from 'react';
import { X, Save, MapPin } from 'lucide-react';
import styles from '../pages/AdminPage.module.css';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';

interface Ward {
  id: string;
  code: string;
  name: string;
  provinceId: string; // Changed to camelCase
  created_at: string;
  province?: {
    id: string;
    code: string;
    name: string;
  };
}

interface Province {
  id: string;
  code: string;
  name: string;
}

interface WardModalProps {
  mode: 'add' | 'edit' | 'view';
  ward: Ward | null;
  provinceId?: string; // Optional pre-selected province ID
  onClose: () => void;
  onSave: () => void;
}

export const WardModal: React.FC<WardModalProps> = ({
  mode,
  ward,
  provinceId,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    provinceid: '',
  });
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch provinces on mount
  useEffect(() => {
    fetchProvinces();
  }, []);

  useEffect(() => {
    if (ward) {
      setFormData({
        code: ward.code || '',
        name: ward.name || '',
        provinceid: ward.provinceId || '',
      });
    } else if (provinceId) {
      // Pre-select province when adding new ward
      setFormData(prev => ({
        ...prev,
        provinceid: provinceId,
      }));
    }
  }, [ward, provinceId]);

  const fetchProvinces = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('provinces')
        .select('id, code, name')
        .order('name');

      if (error) {
        console.error('❌ Error fetching provinces:', error);
        toast.error('Không thể tải danh sách tỉnh/thành phố');
      } else {
        setProvinces(data || []);
      }
    } catch (error) {
      console.error('❌ Error in fetchProvinces:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.code.trim() || !formData.name.trim() || !formData.provinceid) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    try {
      setSaving(true);
      console.log(`💾 ${mode === 'add' ? 'Creating' : 'Updating'} ward...`);

      const wardData = {
        code: formData.code.trim(),
        name: formData.name.trim(),
        provinceid: formData.provinceid,
      };

      if (mode === 'add') {
        const { error } = await supabase.from('wards').insert([wardData]);

        if (error) {
          console.error('❌ Error creating ward:', error);
          toast.error(`Lỗi tạo phường/xã: ${error.message}`);
          return;
        }

        console.log('✅ Ward created successfully');
        toast.success('Đã tạo phường/xã thành công');
      } else if (mode === 'edit' && ward) {
        const { error } = await supabase
          .from('wards')
          .update(wardData)
          .eq('id', ward.id);

        if (error) {
          console.error('❌ Error updating ward:', error);
          toast.error(`Lỗi cập nhật phường/xã: ${error.message}`);
          return;
        }

        console.log('✅ Ward updated successfully');
        toast.success('Đã cập nhật phường/xã thành công');
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
            <MapPin size={24} style={{ color: 'var(--primary, #005cb6)' }} />
            <div>
              <h2 className={styles.modalTitle}>
                {mode === 'add' && 'Thêm phường/xã mới'}
                {mode === 'edit' && 'Chỉnh sửa phường/xã'}
                {mode === 'view' && 'Chi tiết phường/xã'}
              </h2>
              <p className={styles.modalSubtitle}>
                {mode === 'add' && 'Nhập thông tin phường/xã'}
                {mode === 'edit' && 'Cập nhật thông tin phường/xã'}
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
            {/* Mã phường/xã */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Mã phường/xã <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                className={styles.input}
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="Ví dụ: 00001, 00002..."
                disabled={isViewMode}
                required
              />
            </div>

            {/* Tên phường/xã */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Tên phường/xã <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                className={styles.input}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ví dụ: Phường Hoàn Kiếm, Xã Đông Anh..."
                disabled={isViewMode}
                required
              />
            </div>

            {/* Tỉnh/Thành phố */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Tỉnh/Thành phố <span className={styles.required}>*</span>
              </label>
              {isViewMode ? (
                <input
                  type="text"
                  className={styles.input}
                  value={ward?.province?.name || ''}
                  disabled
                />
              ) : (
                <select
                  className={styles.select}
                  value={formData.provinceid}
                  onChange={(e) => setFormData({ ...formData, provinceid: e.target.value })}
                  required
                >
                  <option value="">-- Chọn tỉnh/thành phố --</option>
                  {provinces.map((province) => (
                    <option key={province.id} value={province.id}>
                      {province.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Created date (view mode only) */}
            {isViewMode && ward && (
              <div className={styles.formGroup}>
                <label className={styles.label}>Ngày tạo</label>
                <input
                  type="text"
                  className={styles.input}
                  value={new Date(ward.created_at).toLocaleString('vi-VN')}
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

export default WardModal;