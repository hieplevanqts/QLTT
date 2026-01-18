/**
 * Locality Modal - MAPPA Portal
 * Modal for CREATE/EDIT/VIEW địa bàn with conditional logic
 * Tuân thủ design tokens từ /src/styles/theme.css với Inter font
 */

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  MapPin, 
  Building2, 
  Users,
  ChevronDown,
} from 'lucide-react';
import styles from '../pages/AdminPage.module.css';
import { toast } from 'sonner';
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
  provinceId: string; // Changed to match TerritoryTabNew
}

interface Category {
  id: string;
  code: string;
  name: string;
  type?: string;
}

interface UserOption {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
}

interface LocalityModalProps {
  mode: 'add' | 'edit' | 'view';
  onClose: () => void;
  onSave: () => void;
}

export const LocalityModal: React.FC<LocalityModalProps> = ({
  mode,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    level: '', // '', 'province', 'ward'
    province_id: '',
    ward_id: '',
    category_id: '', // Changed from manager_id
    status: 1 as number, // 1 = hoạt động, 0 = tạm dừng
    description: '',
  });

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredWards, setFilteredWards] = useState<Ward[]>([]);
  
  const [loadingProvinces, setLoadingProvinces] = useState(true);
  const [loadingWards, setLoadingWards] = useState(true);
  
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProvinces();
    fetchWards();
    fetchCategories();
  }, []);

  useEffect(() => {
    // Filter wards based on selected province
    if (formData.province_id) {
      const filtered = wards.filter(w => w.provinceId === formData.province_id);
      setFilteredWards(filtered);
    } else {
      setFilteredWards([]);
    }
  }, [formData.province_id, wards]);

  const fetchProvinces = async () => {
    try {
      const { data, error } = await supabase
        .from('provinces')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('❌ Error fetching provinces:', error);
        throw error;
      }
      setProvinces(data || []);
      setLoadingProvinces(false);
    } catch (error) {
      console.error('❌ Error in fetchProvinces:', error);
      toast.error('Lỗi tải danh sách Tỉnh/TP');
    }
  };

  const fetchWards = async () => {
    try {
      const { data, error } = await supabase
        .from('wards')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('❌ Error fetching wards:', error);
        throw error;
      }
      setWards(data || []);
      setLoadingWards(false);
    } catch (error) {
      console.error('❌ Error in fetchWards:', error);
      toast.error('Lỗi tải danh sách Phường/Xã');
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.code.trim() || !formData.name.trim()) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    if (!formData.level) {
      toast.error('Vui lòng chọn cấp địa bàn');
      return;
    }

    if (formData.level === 'province' && !formData.province_id) {
      toast.error('Vui lòng chọn Tỉnh/Thành phố');
      return;
    }

    if (formData.level === 'ward' && (!formData.province_id || !formData.ward_id)) {
      toast.error('Vui lòng chọn đầy đủ Tỉnh/Thành phố và Xã/Phường');
      return;
    }

    try {
      setSaving(true);
      
      // Here you would save to your database
      // For now, just simulate success
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success(
        mode === 'add'
          ? 'Đã tạo địa bàn thành công'
          : 'Đã cập nhật địa bàn thành công'
      );

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
      <div 
        className={styles.modal} 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '800px', width: '100%' }}
      >
        {/* Header */}
        <div className={styles.modalHeader}>
          <MapPin size={20} style={{ color: 'var(--primary, #005cb6)', flexShrink: 0 }} />
          <h3>
            {mode === 'add' && 'Thêm địa bàn mới'}
            {mode === 'edit' && 'Chỉnh sửa địa bàn'}
            {mode === 'view' && 'Chi tiết địa bàn'}
          </h3>
          <button className={styles.closeBtn} onClick={onClose} type="button">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            {/* Grid Layout - 2 columns */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: 'var(--spacing-4, 16px)',
            }}>
              {/* Mã */}
              <div className={styles.formGroup}>
                <label>
                  Mã <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.input}
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="VD: DB001"
                  disabled={isViewMode}
                  required
                />
              </div>

              {/* Tên */}
              <div className={styles.formGroup}>
                <label>
                  Tên <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.input}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nhập tên địa bàn"
                  disabled={isViewMode}
                  required
                />
              </div>

              {/* Cấp */}
              <div className={styles.formGroup}>
                <label>
                  Cấp <span className={styles.required}>*</span>
                </label>
                <select
                  className={styles.select}
                  value={formData.level}
                  onChange={(e) => {
                    const newLevel = e.target.value;
                    setFormData({ 
                      ...formData, 
                      level: newLevel,
                      province_id: '',
                      ward_id: '',
                    });
                  }}
                  disabled={isViewMode}
                  required
                >
                  <option value="">-- Chọn cấp --</option>
                  <option value="province">Cấp Tỉnh/Thành ph��</option>
                  <option value="ward">Cấp Xã/Phường</option>
                </select>
              </div>

              {/* Trạng thái */}
              <div className={styles.formGroup}>
                <label>
                  Trạng thái <span className={styles.required}>*</span>
                </label>
                <select
                  className={styles.select}
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: parseInt(e.target.value) as number,
                    })
                  }
                  disabled={isViewMode}
                  required
                >
                  <option value="1">Hoạt động</option>
                  <option value="0">Tạm dừng</option>
                </select>
              </div>

              {/* Conditional: Chọn Tỉnh/Thành phố */}
              {(formData.level === 'province' || formData.level === 'ward') && (
                <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                  <label>
                    Chọn Tỉnh/Thành phố <span className={styles.required}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Building2
                      size={16}
                      style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--muted-foreground)',
                        pointerEvents: 'none',
                        zIndex: 1,
                      }}
                    />
                    <select
                      className={styles.select}
                      style={{ paddingLeft: '40px', width: '100%' }}
                      value={formData.province_id}
                      onChange={(e) => {
                        const provinceId = e.target.value;
                        setFormData({ ...formData, province_id: provinceId, ward_id: '' });
                      }}
                      disabled={isViewMode || loadingProvinces}
                      required
                    >
                      <option value="">
                        {loadingProvinces ? 'Đang tải...' : '-- Chọn Tỉnh/Thành phố --'}
                      </option>
                      {provinces.map((province) => (
                        <option key={province.id} value={province.id}>
                          {province.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown 
                      size={16} 
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--muted-foreground)',
                        pointerEvents: 'none',
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Conditional: Chọn Xã/Phường */}
              {formData.level === 'ward' && (
                <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                  <label>
                    Chọn Xã/Phường <span className={styles.required}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <MapPin
                      size={16}
                      style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--muted-foreground)',
                        pointerEvents: 'none',
                        zIndex: 1,
                      }}
                    />
                    <select
                      className={styles.select}
                      style={{ paddingLeft: '40px', width: '100%' }}
                      value={formData.ward_id}
                      onChange={(e) => setFormData({ ...formData, ward_id: e.target.value })}
                      disabled={isViewMode || !formData.province_id}
                      required
                    >
                      <option value="">-- Chọn Xã/Phường --</option>
                      {filteredWards.map((ward) => (
                        <option key={ward.id} value={ward.id}>
                          {ward.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown 
                      size={16} 
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--muted-foreground)',
                        pointerEvents: 'none',
                      }}
                    />
                  </div>
                  {!formData.province_id && (
                    <small style={{ color: 'var(--muted-foreground)', fontSize: '12px' }}>
                      Vui lòng chọn Tỉnh/Thành phố trước
                    </small>
                  )}
                  {formData.province_id && filteredWards.length === 0 && (
                    <small style={{ color: 'var(--destructive)', fontSize: '12px' }}>
                      ⚠️ Không có dữ liệu Phường/Xã cho tỉnh này
                    </small>
                  )}
                  {formData.province_id && filteredWards.length > 0 && (
                    <small style={{ color: 'var(--success, green)', fontSize: '12px' }}>
                       {filteredWards.length} Phường/Xã có sẵn
                    </small>
                  )}
                </div>
              )}

              {/* Đơn vị/Đội phụ trách */}
              <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                <label>Đơn vị/Đội phụ trách</label>
                <div style={{ position: 'relative' }}>
                  <Users
                    size={16}
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--muted-foreground)',
                      pointerEvents: 'none',
                      zIndex: 1,
                    }}
                  />
                  <select
                    className={styles.select}
                    style={{ paddingLeft: '40px', width: '100%' }}
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    disabled={isViewMode}
                  >
                    <option value="">-- Chọn đơn vị/đội --</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name} {category.code && `(${category.code})`}
                      </option>
                    ))}
                  </select>
                  <ChevronDown 
                    size={16} 
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--muted-foreground)',
                      pointerEvents: 'none',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Mô tả - Full width */}
            <div className={styles.formGroup} style={{ marginTop: 'var(--spacing-2, 8px)' }}>
              <label>Mô tả</label>
              <textarea
                className={styles.textarea}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Nhập mô tả địa bàn..."
                disabled={isViewMode}
                rows={4}
                style={{
                  resize: 'vertical',
                  minHeight: '100px',
                }}
              />
            </div>
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

export default LocalityModal;