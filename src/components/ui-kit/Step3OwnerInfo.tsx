import React, { useState, useRef } from 'react';
import { User, Phone, Calendar, CreditCard, Info, AlertTriangle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import styles from './AddStoreDialog.module.css';

interface Step3Props {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  isValidPhone: (phone: string) => boolean;
}

export function Step3OwnerInfo({ formData, setFormData, isValidPhone }: Step3Props) {
  // Validate year of birth
  const isValidYear = (year: string) => {
    if (!year) return false;
    const yearNum = parseInt(year);
    const currentYear = new Date().getFullYear();
    return yearNum >= 1900 && yearNum <= currentYear;
  };

  return (
    <div className={styles.stepContent}>
      {/* Owner Information Section */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Thông tin chủ hộ kinh doanh</h3>
        <p className={styles.sectionDescription}>
          Thông tin đã được quét tự động hoặc bạn có thể nhập thủ công.
        </p>

        <div className={styles.formGrid}>
          {/* Tên chủ hộ kinh doanh */}
          <div className={styles.formGroup}>
            <Label htmlFor="owner-name">
              <User size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
              Tên chủ hộ kinh doanh <span className={styles.required}>*</span>
            </Label>
            <Input
              id="owner-name"
              placeholder="VD: Nguyễn Văn A"
              value={formData.ownerName || ''}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, ownerName: e.target.value }))}
            />
            {!formData.ownerName && (
              <span className={styles.fieldError}>Vui lòng nhập tên chủ hộ kinh doanh</span>
            )}
            <span className={styles.fieldHelper}>
              Họ tên đầy đủ của chủ hộ (người dùng nhập hoặc scan từ CCCD)
            </span>
          </div>

          {/* Năm sinh chủ hộ */}
          <div className={styles.formGroup}>
            <Label htmlFor="owner-birth-year">
              <Calendar size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
              Năm sinh chủ hộ <span className={styles.required}>*</span>
            </Label>
            <Input
              id="owner-birth-year"
              type="number"
              placeholder="VD: 1980"
              value={formData.ownerBirthYear || ''}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, ownerBirthYear: e.target.value }))}
              min="1900"
              max={new Date().getFullYear()}
            />
            {!formData.ownerBirthYear && (
              <span className={styles.fieldError}>Vui lòng nhập năm sinh</span>
            )}
            {formData.ownerBirthYear && !isValidYear(formData.ownerBirthYear) && (
              <span className={styles.fieldError}>Năm sinh không hợp lệ (1900 - {new Date().getFullYear()})</span>
            )}
            <span className={styles.fieldHelper}>
              Năm sinh của chủ hộ (4 chữ số, người dùng nhập hoặc scan từ CCCD)
            </span>
          </div>

          {/* Số CMTND / CCCD / ĐDCN */}
          <div className={styles.formGroup}>
            <Label htmlFor="owner-id-number">
              <CreditCard size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
              Số CMTND / CCCD / ĐDCN <span className={styles.required}>*</span>
            </Label>
            <Input
              id="owner-id-number"
              placeholder="VD: 001234567890"
              value={formData.ownerIdNumber || ''}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, ownerIdNumber: e.target.value }))}
            />
            {!formData.ownerIdNumber && (
              <span className={styles.fieldError}>Vui lòng nhập số giấy tờ định danh</span>
            )}
            <span className={styles.fieldHelper}>
              <strong>Bắt buộc duy nhất:</strong> Số CMTND/CCCD/ĐDCN (người dùng nhập hoặc scan từ CCCD)
            </span>
          </div>

          {/* Số điện thoại chủ hộ */}
          <div className={styles.formGroup}>
            <Label htmlFor="owner-phone">
              <Phone size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
              Số điện thoại chủ hộ <span className={styles.required}>*</span>
            </Label>
            <div className={styles.inputWithIcon}>
              <Phone size={18} className={styles.inputIcon} />
              <Input
                id="owner-phone"
                placeholder="VD: 0901234567"
                value={formData.ownerPhone || ''}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, ownerPhone: e.target.value }))}
                className={styles.inputPadded}
              />
            </div>
            {!formData.ownerPhone && (
              <span className={styles.fieldError}>Vui lòng nhập số điện thoại chủ hộ</span>
            )}
            {formData.ownerPhone && !isValidPhone(formData.ownerPhone) && (
              <span className={styles.fieldError}>Số điện thoại không hợp lệ</span>
            )}
            <span className={styles.fieldHelper}>
              Số điện thoại cá nhân của chủ hộ (có thể khác SĐT hộ kinh doanh)
            </span>
          </div>
        </div>

        {/* Validation Summary */}
        {(formData.ownerName || formData.ownerBirthYear || formData.ownerIdNumber || formData.ownerPhone) && 
         (!formData.ownerName || !formData.ownerBirthYear || !formData.ownerIdNumber || !formData.ownerPhone || 
          !isValidYear(formData.ownerBirthYear) || !isValidPhone(formData.ownerPhone)) && (
          <div className={styles.warningBox} style={{ marginTop: 'var(--spacing-6)' }}>
            <div className={styles.warningIcon}>
              <AlertTriangle size={20} />
            </div>
            <div className={styles.warningContent}>
              <div className={styles.warningTitle}>Thông tin chưa đầy đủ</div>
              <div className={styles.warningText}>
                Vui lòng điền đầy đủ các thông tin bắt buộc:
                <ul style={{ marginTop: 'var(--spacing-2)', paddingLeft: 'var(--spacing-5)' }}>
                  {!formData.ownerName && <li>Tên chủ hộ kinh doanh</li>}
                  {!formData.ownerBirthYear && <li>Năm sinh chủ hộ</li>}
                  {formData.ownerBirthYear && !isValidYear(formData.ownerBirthYear) && <li>Năm sinh không hợp lệ</li>}
                  {!formData.ownerIdNumber && <li>Số CMTND/CCCD/ĐDCN</li>}
                  {!formData.ownerPhone && <li>Số điện thoại chủ hộ</li>}
                  {formData.ownerPhone && !isValidPhone(formData.ownerPhone) && <li>Số điện thoại không hợp lệ</li>}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
