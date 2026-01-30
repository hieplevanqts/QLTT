import { useState, useEffect } from 'react';
import { X, Save, AlertCircle, Building2, MapPin, TrendingUp } from 'lucide-react';
import type { RiskProfile } from '../../../data/lead-risk/types';
import styles from './LeadFormModal.module.css'; // Reuse existing styles

// Mock data: Danh sách cửa hàng đã đăng ký
const REGISTERED_STORES = [
  { id: 'store-001', name: 'Cửa hàng tiện lợi Circle K - Nguyễn Huệ', address: '45 Nguyễn Huệ, Q.1, TP.HCM' },
  { id: 'store-002', name: 'Siêu thị Vinmart - Lê Lợi', address: '123 Lê Lợi, Q.1, TP.HCM' },
  { id: 'store-003', name: 'Nhà hàng Món Huế - Pasteur', address: '56 Pasteur, Q.1, TP.HCM' },
  { id: 'store-004', name: 'Quán cafe The Coffee House - Đồng Khởi', address: '78 Đồng Khởi, Q.1, TP.HCM' },
  { id: 'store-005', name: 'Cửa hàng thực phẩm Bách Hóa Xanh - Hai Bà Trưng', address: '234 Hai Bà Trưng, Q.1, TP.HCM' },
  { id: 'store-006', name: 'Salon tóc Hair Salon - Trần Hưng Đạo', address: '89 Trần Hưng Đạo, Q.1, TP.HCM' },
  { id: 'store-007', name: 'Nhà thuốc Pharmacity - Võ Văn Tần', address: '167 Võ Văn Tần, Q.3, TP.HCM' },
  { id: 'store-008', name: 'Tiệm bánh Kinh Đô - Nguyễn Thị Minh Khai', address: '345 Nguyễn Thị Minh Khai, Q.3, TP.HCM' },
  { id: 'store-009', name: 'Cửa hàng điện máy Nguyễn Kim - Cách Mạng Tháng 8', address: '456 Cách Mạng Tháng 8, Q.10, TP.HCM' },
  { id: 'store-010', name: 'Chợ Bến Thành - Lê Lợi', address: 'Lê Lợi, Q.1, TP.HCM' },
  { id: 'store-other', name: '🔍 Cửa hàng khác (nhập tay)', address: '' },
];

interface RiskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (risk: Partial<RiskProfile>) => void;
  risk?: RiskProfile | null;
  mode: 'create' | 'edit';
}

export function RiskFormModal({ isOpen, onClose, onSave, risk, mode }: RiskFormModalProps) {
  const [formData, setFormData] = useState({
    // Entity Information
    entityName: '',
    entityAddress: '',
    entityType: 'store' as 'store' | 'zone',
    
    // Risk Assessment
    riskLevel: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    riskScore: 50,
    
    // Monitoring
    isWatchlisted: false,
    hasActiveAlert: false,
    
    // Notes
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isCustomStore, setIsCustomStore] = useState(false);
  const [selectedStoreDropdown, setSelectedStoreDropdown] = useState('');

  useEffect(() => {
    if (risk && mode === 'edit') {
      setFormData({
        entityName: risk.entityName || '',
        entityAddress: '', // Not in RiskProfile type, but we can add it
        entityType: risk.entityType,
        riskLevel: risk.riskLevel,
        riskScore: risk.riskScore,
        isWatchlisted: risk.isWatchlisted,
        hasActiveAlert: risk.hasActiveAlert,
        notes: '',
      });
      setSelectedStoreDropdown('');
      setIsCustomStore(false);
    } else {
      // Reset form for create mode
      setFormData({
        entityName: '',
        entityAddress: '',
        entityType: 'store',
        riskLevel: 'medium',
        riskScore: 50,
        isWatchlisted: false,
        hasActiveAlert: false,
        notes: '',
      });
      setSelectedStoreDropdown('');
      setIsCustomStore(false);
    }
  }, [risk, mode, isOpen]);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate entity name
    if (!formData.entityName.trim()) {
      newErrors.entityName = 'Tên cơ sở là bắt buộc';
    }

    // Validate address if custom store
    if (isCustomStore && !formData.entityAddress.trim()) {
      newErrors.entityAddress = 'Địa chỉ là bắt buộc';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const riskData: Partial<RiskProfile> = {
      entityName: formData.entityName,
      entityType: formData.entityType,
      riskLevel: formData.riskLevel,
      riskScore: formData.riskScore,
      isWatchlisted: formData.isWatchlisted,
      hasActiveAlert: formData.hasActiveAlert,
      // Add default values for required fields
      totalLeads: 0,
      activeLeads: 0,
      resolvedLeads: 0,
      rejectedLeads: 0,
      trendDirection: 'stable',
      monthOverMonthChange: 0,
      recentCategories: [],
      lastLeadDate: new Date(),
    };

    onSave(riskData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.modalTitle}>
            <Building2 size={24} />
            <span>{mode === 'create' ? 'Thêm cơ sở giám sát mới' : 'Chỉnh sửa thông tin cơ sở'}</span>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.modalBody}>
          {/* [1] Thông tin cơ sở */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>1. Thông tin cơ sở</h3>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Loại đối tượng <span className={styles.required}>*</span>
              </label>
              <select
                value={formData.entityType}
                onChange={(e) => handleChange('entityType', e.target.value)}
                className={styles.select}
              >
                <option value="store">Cửa hàng / Cơ sở kinh doanh</option>
                <option value="zone">Khu vực / Vùng địa lý</option>
              </select>
            </div>

            {formData.entityType === 'store' && (
              <>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Cửa hàng <span className={styles.required}>*</span>
                  </label>
                  <select
                    value={selectedStoreDropdown}
                    onChange={(e) => {
                      const selectedValue = e.target.value;
                      setSelectedStoreDropdown(selectedValue);
                      
                      if (selectedValue === 'store-other') {
                        // User wants to enter custom store
                        setIsCustomStore(true);
                        handleChange('entityName', '');
                        handleChange('entityAddress', '');
                      } else if (selectedValue) {
                        // User selected a registered store
                        const selectedStore = REGISTERED_STORES.find(s => s.id === selectedValue);
                        if (selectedStore) {
                          setIsCustomStore(false);
                          handleChange('entityName', selectedStore.name);
                          handleChange('entityAddress', selectedStore.address);
                        }
                      } else {
                        // User selected default option "-- Chọn cửa hàng --"
                        setIsCustomStore(false);
                        handleChange('entityName', '');
                        handleChange('entityAddress', '');
                      }
                    }}
                    className={`${styles.select} ${errors.entityName && !isCustomStore ? styles.inputError : ''}`}
                  >
                    <option value="">-- Chọn cửa hàng --</option>
                    {REGISTERED_STORES.map(store => (
                      <option key={store.id} value={store.id}>
                        {store.name}
                      </option>
                    ))}
                  </select>
                  {errors.entityName && !isCustomStore && (
                    <span className={styles.errorText}>
                      <AlertCircle size={14} />
                      {errors.entityName}
                    </span>
                  )}
                </div>

                {isCustomStore && (
                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      Tên cửa hàng <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.entityName}
                      onChange={(e) => handleChange('entityName', e.target.value)}
                      className={`${styles.input} ${errors.entityName ? styles.inputError : ''}`}
                      placeholder="Nhập tên cửa hàng hoặc cơ sở kinh doanh"
                    />
                    {errors.entityName && (
                      <span className={styles.errorText}>
                        <AlertCircle size={14} />
                        {errors.entityName}
                      </span>
                    )}
                  </div>
                )}

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Địa chỉ {isCustomStore && <span className={styles.required}>*</span>}
                  </label>
                  <input
                    type="text"
                    value={formData.entityAddress}
                    onChange={(e) => handleChange('entityAddress', e.target.value)}
                    className={`${styles.input} ${errors.entityAddress ? styles.inputError : ''}`}
                    placeholder="Địa chỉ cụ thể"
                    readOnly={!isCustomStore}
                  />
                  {errors.entityAddress && (
                    <span className={styles.errorText}>
                      <AlertCircle size={14} />
                      {errors.entityAddress}
                    </span>
                  )}
                </div>
              </>
            )}

            {formData.entityType === 'zone' && (
              <>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Tên khu vực <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.entityName}
                    onChange={(e) => handleChange('entityName', e.target.value)}
                    className={`${styles.input} ${errors.entityName ? styles.inputError : ''}`}
                    placeholder="VD: Quận 1, Khu vực trung tâm TP.HCM"
                  />
                  {errors.entityName && (
                    <span className={styles.errorText}>
                      <AlertCircle size={14} />
                      {errors.entityName}
                    </span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Mô tả khu vực</label>
                  <input
                    type="text"
                    value={formData.entityAddress}
                    onChange={(e) => handleChange('entityAddress', e.target.value)}
                    className={styles.input}
                    placeholder="VD: Bao gồm các quận nội thành phía Đông"
                  />
                </div>
              </>
            )}
          </div>

          {/* [2] Đánh giá rủi ro */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>2. Đánh giá rủi ro</h3>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Mức độ rủi ro <span className={styles.required}>*</span>
                </label>
                <select
                  value={formData.riskLevel}
                  onChange={(e) => {
                    const level = e.target.value as 'low' | 'medium' | 'high' | 'critical';
                    handleChange('riskLevel', level);
                    // Auto-adjust risk score based on level
                    const scoreMap = {
                      low: 25,
                      medium: 50,
                      high: 75,
                      critical: 90,
                    };
                    handleChange('riskScore', scoreMap[level]);
                  }}
                  className={styles.select}
                >
                  <option value="low">Thấp (Low)</option>
                  <option value="medium">Trung bình (Medium)</option>
                  <option value="high">Cao (High)</option>
                  <option value="critical">Nghiêm trọng (Critical)</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Điểm rủi ro (0-100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.riskScore}
                  onChange={(e) => handleChange('riskScore', parseInt(e.target.value) || 0)}
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={formData.isWatchlisted}
                    onChange={(e) => handleChange('isWatchlisted', e.target.checked)}
                    className={styles.checkbox}
                  />
                  <span>Thêm vào danh sách theo dõi</span>
                </label>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={formData.hasActiveAlert}
                    onChange={(e) => handleChange('hasActiveAlert', e.target.checked)}
                    className={styles.checkbox}
                  />
                  <span>Cảnh báo hoạt động</span>
                </label>
              </div>
            </div>
          </div>

          {/* [3] Ghi chú */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>3. Ghi chú thêm</h3>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Ghi chú</label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                className={styles.textarea}
                rows={4}
                placeholder="Thông tin bổ sung về rủi ro, lịch sử vi phạm, v.v."
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className={styles.modalFooter}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className={styles.saveButton}>
              <Save size={16} />
              {mode === 'create' ? 'Tạo mới' : 'Cập nhật'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
