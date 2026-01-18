/**
 * Area Modal Component - MAPPA Portal
 * Modal để thêm/sửa/xem địa bàn
 * Tuân thủ design tokens từ /src/styles/theme.css với Inter font
 */

import React, { useState, useEffect } from 'react';
import { X, MapPin, Save, Info } from 'lucide-react';
import styles from './AreaModal.module.css';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { toast } from 'sonner';

interface Province {
  id: string;
  code: string;
  name: string;
}

interface Ward {
  id: string;
  code: string;
  name: string;
  provinceId: string;
}

interface Area {
  id?: string;
  code: string;
  name: string;
  level: string;
  provinceId?: string;
  wardId?: string;
  description?: string;
  status: number;
  // Support nested objects from backend
  province?: {
    id: string;
    code: string;
    name: string;
  };
  ward?: {
    id: string;
    code: string;
    name: string;
  };
}

interface AreaModalProps {
  isOpen: boolean;
  mode: 'add' | 'edit' | 'view';
  area?: Area | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const AreaModal: React.FC<AreaModalProps> = ({
  isOpen,
  mode,
  area,
  onClose,
  onSuccess,
}) => {
  const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-e994bb5d`;
  const isViewMode = mode === 'view';

  // 🎯 NEW: Provinces and Wards data
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [filteredWards, setFilteredWards] = useState<Ward[]>([]);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    level: '',
    provinceId: '',
    wardId: '',
    description: '',
    status: 1,
  });

  const [saving, setSaving] = useState(false);

  // 🎯 NEW: Fetch provinces and wards
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch(`${baseUrl}/provinces`, {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` },
        });
        const result = await response.json();
        if (response.ok && result.provinces) {
          setProvinces(result.provinces);
        }
      } catch (error) {
        console.error('Error fetching provinces:', error);
      }
    };

    const fetchWards = async () => {
      try {
        const response = await fetch(`${baseUrl}/wards`, {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` },
        });
        const result = await response.json();
        if (response.ok && result.wards) {
          setWards(result.wards);
        }
      } catch (error) {
        console.error('Error fetching wards:', error);
      }
    };

    if (isOpen) {
      fetchProvinces();
      fetchWards();
    }
  }, [isOpen]);

  // 🎯 NEW: Auto-generate code when province or ward changes
  useEffect(() => {
    if (mode === 'add') {
      const selectedProvince = provinces.find(p => p.id === formData.provinceId);
      const selectedWard = wards.find(w => w.id === formData.wardId);

      let generatedCode = 'DB';
      
      if (selectedProvince) {
        generatedCode += selectedProvince.code;
      }
      
      if (selectedWard) {
        generatedCode += selectedWard.code;
      }

      setFormData(prev => ({ ...prev, code: generatedCode }));
    }
  }, [formData.provinceId, formData.wardId, provinces, wards, mode]);

  // Filter wards based on selected province
  useEffect(() => {
    if (formData.provinceId) {
      setFilteredWards(wards.filter(w => w.provinceId === formData.provinceId));
    } else {
      setFilteredWards([]);
    }
  }, [formData.provinceId, wards]);

  // Load area data when editing/viewing
  useEffect(() => {
    if (isOpen && area && (mode === 'edit' || mode === 'view')) {
      setFormData({
        code: area.code || '',
        name: area.name || '',
        level: area.level || '',
        provinceId: area.provinceId || '',
        wardId: area.wardId || '',
        description: area.description || '',
        status: area.status ?? 1,
      });
    } else if (isOpen && mode === 'add') {
      // Reset form for add mode with initial code = 'DB'
      setFormData({
        code: 'DB',
        name: '',
        level: '',
        provinceId: '',
        wardId: '',
        description: '',
        status: 1,
      });
    }
  }, [isOpen, area, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Vui lòng nhập Tên địa bàn');
      return;
    }

    if (!formData.level) {
      toast.error('Vui lòng chọn Cấp địa bàn');
      return;
    }

    // Validate code for add mode - must select province or ward
    if (mode === 'add' && formData.code === 'DB') {
      toast.error('Vui lòng chọn Tỉnh/Thành phố hoặc Xã/Phường để tự động tạo mã');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        code: formData.code.trim(),
        name: formData.name.trim(),
        level: formData.level || null,
        provinceId: formData.provinceId || null,
        wardId: formData.wardId || null,
        description: formData.description.trim() || null,
        status: formData.status,
      };

      if (mode === 'add') {
        const response = await fetch(`${baseUrl}/areas`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Lỗi tạo địa bàn');
        }

        toast.success('✅ Địa bàn đã được thêm thành công');
      } else if (mode === 'edit' && area?.id) {
        const response = await fetch(`${baseUrl}/areas/${area.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Lỗi cập nhật địa bàn');
        }

        toast.success('✅ Địa bàn đã được cập nhật thành công');
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error saving area:', error);
      toast.error(`Lỗi: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <MapPin size={20} className={styles.headerIcon} />
            <h2 className={styles.title}>
              {mode === 'add' && 'Thêm địa bàn mới'}
              {mode === 'edit' && 'Chỉnh sửa địa bàn'}
              {mode === 'view' && 'Chi tiết địa bàn'}
            </h2>
          </div>
          <button className={styles.closeBtn} onClick={onClose} type="button">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className={styles.body}>
          <div className={styles.formFields}>
            {/* Field 1: Mã (auto-generated, read-only) */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Mã</label>
              <input
                type="text"
                className={styles.input}
                placeholder="DB + Mã Tỉnh + Mã Xã"
                value={formData.code}
                disabled
                readOnly
              />
              {mode === 'add' && (
                <div className={styles.helpText}>
                  <Info size={14} />
                  Mã tự động tạo khi chọn Tỉnh/Xã
                </div>
              )}
            </div>

            {/* Field 2: Tên địa bàn */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Tên địa bàn <span className={styles.required}>*</span>
              </label>
              {isViewMode ? (
                <div className={styles.viewValue}>{formData.name}</div>
              ) : (
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Nhập tên địa bàn"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  disabled={saving}
                />
              )}
            </div>

            {/* Field 3: Cấp */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Cấp <span className={styles.required}>*</span>
              </label>
              {isViewMode ? (
                <div className={styles.viewValue}>
                  {formData.level === 'province' ? 'Cấp Tỉnh/Thành phố' : formData.level === 'ward' ? 'Cấp Xã/Phường' : 'Chưa xác định'}
                </div>
              ) : (
                <select
                  className={styles.select}
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                  disabled={saving}
                  required
                >
                  <option value="">-- Chọn cấp --</option>
                  <option value="province">Cấp Tỉnh/Thành phố</option>
                  <option value="ward">Cấp Xã/Phường</option>
                </select>
              )}
            </div>

            {/* Field 4: Trạng thái */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Trạng thái <span className={styles.required}>*</span>
              </label>
              {isViewMode ? (
                <div className={styles.viewValue}>
                  <span className={formData.status === 1 ? styles.badgeActive : styles.badgeInactive}>
                    {formData.status === 1 ? 'Hoạt động' : 'Ngừng hoạt động'}
                  </span>
                </div>
              ) : (
                <select
                  className={styles.select}
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: parseInt(e.target.value) })}
                  disabled={saving}
                  required
                >
                  <option value={1}>Hoạt động</option>
                  <option value={0}>Ngừng hoạt động</option>
                </select>
              )}
            </div>

            {/* Field 5: Chọn Tỉnh/Thành phố */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Chọn Tỉnh/Thành phố</label>
              {isViewMode ? (
                <div className={styles.viewValue}>
                  {area?.provinceName || 'Không có'}
                </div>
              ) : (
                <>
                  <select
                    className={styles.select}
                    value={formData.provinceId}
                    onChange={(e) => {
                      const newProvinceId = e.target.value;
                      setFormData({ 
                        ...formData, 
                        provinceId: newProvinceId,
                        wardId: '', // Reset ward when province changes
                      });
                    }}
                    disabled={saving}
                  >
                    <option value="">-- Chọn Tỉnh/Thành phố --</option>
                    {provinces.map((province) => (
                      <option key={province.id} value={province.id}>
                        {province.name}
                      </option>
                    ))}
                  </select>
                  {provinces.length === 0 && (
                    <div className={styles.helpText}>
                      <Info size={14} />
                      Không có dữ liệu Tỉnh/TP. Vui lòng tạo dữ liệu mẫu từ menu "Nhập dữ liệu"
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Field 6: Chọn Xã/Phường */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Chọn Xã/Phường</label>
              {isViewMode ? (
                <div className={styles.viewValue}>
                  {area?.wardName || 'Không có'}
                </div>
              ) : (
                <>
                  <select
                    className={styles.select}
                    value={formData.wardId}
                    onChange={(e) => setFormData({ ...formData, wardId: e.target.value })}
                    disabled={saving || !formData.provinceId}
                  >
                    <option value="">-- Chọn Xã/Phường --</option>
                    {filteredWards.map((ward) => (
                      <option key={ward.id} value={ward.id}>
                        {ward.name}
                      </option>
                    ))}
                  </select>
                  {!formData.provinceId && (
                    <div className={styles.helpText}>
                      <Info size={14} />
                      Vui lòng chọn Tỉnh/Thành phố trước
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Field 7: Mô tả */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Mô tả</label>
              {isViewMode ? (
                <div className={styles.viewValue}>{formData.description || 'Không có mô tả'}</div>
              ) : (
                <textarea
                  className={styles.textarea}
                  placeholder="Nhập mô tả về địa bàn..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  disabled={saving}
                />
              )}
            </div>
          </div>

          {/* Footer */}
          <div className={styles.footer}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
              disabled={saving}
            >
              {isViewMode ? 'Đóng' : 'Hủy'}
            </button>
            {!isViewMode && (
              <button
                type="submit"
                className={styles.saveBtn}
                disabled={saving}
              >
                {saving ? 'Đang lưu...' : 'Lưu'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};