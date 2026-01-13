/**
 * Bank Modal Component - MAPPA Portal
 * Modal cho thêm/sửa/xem ngân hàng
 * Tuân thủ design tokens từ /src/styles/theme.css với Inter font
 */

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import styles from './BankModal.module.css';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';

interface Bank {
  id: string;
  code: string;
  name: string;
  short_name: string;
  bin: string;
  logo_url: string;
  is_active: boolean;
  created_at: string;
}

interface BankModalProps {
  mode: 'add' | 'edit' | 'view';
  bank: Bank | null;
  onClose: () => void;
  onSave: () => void;
}

export const BankModal: React.FC<BankModalProps> = ({ mode, bank, onClose, onSave }) => {
  const isViewMode = mode === 'view';
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    short_name: '',
    bin: '',
    logo_url: '',
    is_active: true,
  });

  useEffect(() => {
    if (bank) {
      setFormData({
        code: bank.code,
        name: bank.name,
        short_name: bank.short_name,
        bin: bank.bin,
        logo_url: bank.logo_url || '',
        is_active: bank.is_active,
      });
    }
  }, [bank]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.code.trim() || !formData.name.trim() || !formData.short_name.trim() || !formData.bin.trim()) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    try {
      setSaving(true);
      console.log(`💾 ${mode === 'add' ? 'Creating' : 'Updating'} bank...`);

      const bankData = {
        code: formData.code.trim(),
        name: formData.name.trim(),
        short_name: formData.short_name.trim(),
        bin: formData.bin.trim(),
        logo_url: formData.logo_url.trim(),
        is_active: formData.is_active,
      };

      if (mode === 'add') {
        // Insert new bank
        const { data, error } = await supabase
          .from('banks')
          .insert([bankData])
          .select()
          .single();

        if (error) {
          console.error('❌ Error creating bank:', error);
          toast.error(`Lỗi tạo ngân hàng: ${error.message}`);
          return;
        }

        console.log('✅ Bank created:', data.id);
        toast.success('Đã tạo ngân hàng thành công');
      } else if (mode === 'edit' && bank) {
        // Update existing bank
        const { error } = await supabase
          .from('banks')
          .update(bankData)
          .eq('id', bank.id);

        if (error) {
          console.error('❌ Error updating bank:', error);
          toast.error(`Lỗi cập nhật ngân hàng: ${error.message}`);
          return;
        }

        console.log('✅ Bank updated');
        toast.success('Đã cập nhật ngân hàng thành công');
      }

      onSave();
    } catch (error) {
      console.error('❌ Error:', error);
      toast.error('Lỗi khi lưu ngân hàng');
    } finally {
      setSaving(false);
    }
  };

  const getModalTitle = () => {
    switch (mode) {
      case 'add':
        return 'Thêm ngân hàng mới';
      case 'edit':
        return 'Chỉnh sửa ngân hàng';
      case 'view':
        return 'Chi tiết ngân hàng';
      default:
        return '';
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>{getModalTitle()}</h3>
          <button onClick={onClose} className={styles.closeButton}>
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            {/* Row 1: Code & BIN */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {/* Code */}
              <div className={styles.formGroup}>
                <label>
                  Mã ngân hàng <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.input}
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="VD: VCB"
                  disabled={isViewMode}
                  required
                />
              </div>

              {/* BIN */}
              <div className={styles.formGroup}>
                <label>
                  BIN <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.input}
                  value={formData.bin}
                  onChange={(e) => setFormData({ ...formData, bin: e.target.value })}
                  placeholder="VD: 970436"
                  disabled={isViewMode}
                  required
                />
              </div>
            </div>

            {/* Name */}
            <div className={styles.formGroup}>
              <label>
                Tên ngân hàng <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                className={styles.input}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="VD: Ngân hàng TMCP Ngoại thương Việt Nam"
                disabled={isViewMode}
                required
              />
            </div>

            {/* Short Name */}
            <div className={styles.formGroup}>
              <label>
                Tên viết tắt <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                className={styles.input}
                value={formData.short_name}
                onChange={(e) => setFormData({ ...formData, short_name: e.target.value })}
                placeholder="VD: Vietcombank"
                disabled={isViewMode}
                required
              />
            </div>

            {/* Logo URL */}
            <div className={styles.formGroup}>
              <label>Logo URL</label>
              <input
                type="text"
                className={styles.input}
                value={formData.logo_url}
                onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                placeholder="VD: https://example.com/logo.png"
                disabled={isViewMode}
              />
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', marginTop: '6px' }}>
                URL của logo ngân hàng (không bắt buộc)
              </p>
            </div>

            {/* Status */}
            <div className={styles.formGroup}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  disabled={isViewMode}
                  style={{
                    width: '18px',
                    height: '18px',
                    cursor: isViewMode ? 'not-allowed' : 'pointer',
                  }}
                />
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)' }}>
                  Đang hoạt động
                </span>
              </label>
            </div>

            {/* View mode: Show created date */}
            {isViewMode && bank && (
              <div className={styles.formGroup}>
                <label>Ngày tạo</label>
                <input
                  type="text"
                  className={styles.input}
                  value={new Date(bank.created_at).toLocaleString('vi-VN')}
                  disabled
                />
              </div>
            )}
          </div>

          {/* Footer */}
          <div className={styles.modalFooter}>
            {!isViewMode ? (
              <>
                <button
                  type="button"
                  onClick={onClose}
                  className={styles.btnCancel}
                  disabled={saving}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className={styles.btnSave}
                  disabled={saving}
                >
                  {saving ? 'Đang lưu...' : 'Lưu'}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className={styles.btnCancel}
                style={{ marginLeft: 'auto' }}
              >
                Đóng
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default BankModal;