import { useState, useEffect } from 'react';
import { X, Save, AlertCircle, Upload, User, UserX } from 'lucide-react';
import type { Lead, LeadStatus, LeadUrgency } from '@/utils/data/lead-risk/types';
import styles from './LeadFormModal.module.css';

// Mock data: Danh sách cửa hàng đã đăng ký
const REGISTERED_STORES = [
  { id: 'store-001', name: 'Cửa hàng tiện lợi Circle K - Nguyễn Huệ', address: '45 Nguyễn Huệ, Q.1, TP.HCM', type: 'retail' },
  { id: 'store-002', name: 'Siêu thị Vinmart - Lê Lợi', address: '123 Lê Lợi, Q.1, TP.HCM', type: 'supermarket' },
  { id: 'store-003', name: 'Nhà hàng Món Huế - Pasteur', address: '56 Pasteur, Q.1, TP.HCM', type: 'restaurant' },
  { id: 'store-004', name: 'Quán cafe The Coffee House - Đồng Khởi', address: '78 Đồng Khởi, Q.1, TP.HCM', type: 'cafe' },
  { id: 'store-005', name: 'Cửa hàng thực phẩm Bách Hóa Xanh - Hai Bà Trưng', address: '234 Hai Bà Trưng, Q.1, TP.HCM', type: 'grocery' },
  { id: 'store-006', name: 'Salon tóc Hair Salon - Trần Hưng Đạo', address: '89 Trần Hưng Đạo, Q.1, TP.HCM', type: 'service' },
  { id: 'store-007', name: 'Nhà thuốc Pharmacity - Võ Văn Tần', address: '167 Võ Văn Tần, Q.3, TP.HCM', type: 'pharmacy' },
  { id: 'store-008', name: 'Tiệm bánh Kinh Đô - Nguyễn Thị Minh Khai', address: '345 Nguyễn Thị Minh Khai, Q.3, TP.HCM', type: 'bakery' },
  { id: 'store-009', name: 'Cửa hàng điện máy Nguyễn Kim - Cách Mạng Tháng 8', address: '456 Cách Mạng Tháng 8, Q.10, TP.HCM', type: 'electronics' },
  { id: 'store-010', name: 'Chợ Bến Thành - Lê Lợi', address: 'Lê Lợi, Q.1, TP.HCM', type: 'market' },
  { id: 'store-other', name: '🔍 Cửa hàng khác (nhập tay)', address: '', type: '' },
];

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lead: Partial<Lead>) => void;
  lead?: Lead | null;
  mode: 'create' | 'edit';
}

export function LeadFormModal({ isOpen, onClose, onSave, lead, mode }: LeadFormModalProps) {
  const [formData, setFormData] = useState({
    // [1] Thông tin chung
    source: '',
    timestamp: new Date().toISOString().slice(0, 16),
    urgency: 'medium' as LeadUrgency,

    // [2] Đối tượng / Cửa hàng
    storeName: '',
    storeAddress: '',
    storeType: '',

    // [3] Nội dung phản ánh
    category: 'Khác',
    description: '',
    incidentTime: '',

    // [4] Minh chứng
    attachments: '',
    evidenceNote: '',

    // [5] Người cung cấp
    isAnonymous: false,
    reporterName: '',
    reporterPhone: '',
    reporterEmail: '',

    // Legacy fields
    status: 'new' as LeadStatus,
    title: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isCustomStore, setIsCustomStore] = useState(false); // Track if "other store" is selected

  useEffect(() => {
    if (lead && mode === 'edit') {
      setFormData({
        source: lead.source || '',
        timestamp: lead.createdAt ? new Date(lead.createdAt).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
        urgency: lead.urgency || 'medium',
        storeName: lead.storeName || '',
        storeAddress: lead.storeAddress || '',
        storeType: lead.storeType || '',
        category: lead.category,
        description: lead.description,
        incidentTime: '',
        attachments: '',
        evidenceNote: '',
        isAnonymous: !lead.reporterName,
        reporterName: lead.reporterName || '',
        reporterPhone: lead.reporterPhone || '',
        reporterEmail: lead.reporterEmail || '',
        status: lead.status,
        title: lead.title,
      });
      setIsCustomStore(lead.storeName === '🔍 Cửa hàng khác (nhập tay)');
    } else if (mode === 'create') {
      // Reset form
      setFormData({
        source: '',
        timestamp: new Date().toISOString().slice(0, 16),
        urgency: 'medium',
        storeName: '',
        storeAddress: '',
        storeType: '',
        category: 'Khác',
        description: '',
        incidentTime: '',
        attachments: '',
        evidenceNote: '',
        isAnonymous: false,
        reporterName: '',
        reporterPhone: '',
        reporterEmail: '',
        status: 'new',
        title: '',
      });
      setIsCustomStore(false);
    }
    setErrors({});
  }, [lead, mode, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // [1] Thông tin chung
    if (!formData.source.trim()) {
      newErrors.source = 'Nguồn tin là bắt buộc';
    }
    if (!formData.timestamp) {
      newErrors.timestamp = 'Thời điểm là bắt buộc';
    }

    // [2] Đối tượng / Cửa hàng
    if (!formData.storeName.trim()) {
      newErrors.storeName = 'Cửa hàng là bắt buộc';
    }

    // [3] Nội dung phản ánh
    if (!formData.category) {
      newErrors.category = 'Loại vấn đề là bắt buộc';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Mô tả chi tiết là bắt buộc';
    }

    // [4] Minh chứng
    if (!formData.attachments.trim()) {
      newErrors.attachments = 'Hình ảnh/video minh chứng là bắt buộc';
    }

    // [5] Người cung cấp (chỉ validate khi không ẩn danh)
    if (!formData.isAnonymous) {
      if (!formData.reporterName.trim()) {
        newErrors.reporterName = 'Tên người cung cấp là bắt buộc';
      }
      if (!formData.reporterPhone.trim()) {
        newErrors.reporterPhone = 'Số điện thoại là bắt buộc';
      } else if (!/^[0-9]{10,11}$/.test(formData.reporterPhone.replace(/\s/g, ''))) {
        newErrors.reporterPhone = 'Số điện thoại không hợp lệ';
      }
      if (formData.reporterEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.reporterEmail)) {
        newErrors.reporterEmail = 'Email không hợp lệ';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Generate title from category and store name
    const categoryLabels: Record<string, string> = {
      food_safety: 'Vi phạm VSATTP',
      counterfeit: 'Hàng giả, hàng nhái',
      origin_unknown: 'Hàng không rõ nguồn gốc',
      expired: 'Hàng hết hạn',
      commercial_fraud: 'Gian lận thương mại',
      illegal_trading: 'Vi phạm quy định kinh doanh',
      price_fraud: 'Niêm yết giá không đúng',
      other: 'Khác',

      // Legacy
      unlicensed: 'Vi phạm quy định kinh doanh',
      smuggling: 'Hàng không rõ nguồn gốc',
    };

    const generatedTitle = `${displayCategory || 'Nguồn tin'} - ${formData.storeName}`;

    onSave({
      ...formData,
      title: generatedTitle,
      reporterName: formData.isAnonymous ? undefined : formData.reporterName,
      reporterPhone: formData.isAnonymous ? undefined : formData.reporterPhone,
      reporterEmail: formData.isAnonymous ? undefined : formData.reporterEmail,
    });
    onClose();
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>
            {mode === 'create' ? 'Tạo nguồn tin mới' : 'Chỉnh sửa nguồn tin'}
          </h2>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formBody}>
            {/* [1] Thông tin chung */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>1. Thông tin chung</h3>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Nguồn tin <span className={styles.required}>*</span>
                  </label>
                  <select
                    value={formData.source}
                    onChange={(e) => handleChange('source', e.target.value)}
                    className={`${styles.select} ${errors.source ? styles.inputError : ''}`}
                  >
                    <option value="">-- Chọn nguồn tin --</option>
                    <option value="hotline">Hotline 1800</option>
                    <option value="web">Website/Portal</option>
                    <option value="email">Email</option>
                    <option value="social">Mạng xã hội</option>
                    <option value="inspection">Kiểm tra trực tiếp</option>
                    <option value="police">Công an/Chính quyền</option>
                    <option value="partner">Đối tác</option>
                    <option value="other">Nguồn khác</option>
                  </select>
                  {errors.source && (
                    <span className={styles.errorText}>
                      <AlertCircle size={14} />
                      {errors.source}
                    </span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Thời điểm <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.timestamp}
                    onChange={(e) => handleChange('timestamp', e.target.value)}
                    className={`${styles.input} ${errors.timestamp ? styles.inputError : ''}`}
                  />
                  {errors.timestamp && (
                    <span className={styles.errorText}>
                      <AlertCircle size={14} />
                      {errors.timestamp}
                    </span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Độ khẩn <span className={styles.required}>*</span>
                  </label>
                  <select
                    value={formData.urgency}
                    onChange={(e) => handleChange('urgency', e.target.value as LeadUrgency)}
                    className={styles.select}
                  >
                    <option value="low">Thấp</option>
                    <option value="medium">Trung bình</option>
                    <option value="high">Cao</option>
                    <option value="critical">Nghiêm trọng</option>
                  </select>
                </div>
              </div>
            </div>

            {/* [2] Đối tượng / Cửa hàng */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>2. Đối tượng / Cửa hàng</h3>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Cửa hàng <span className={styles.required}>*</span>
                </label>
                <select
                  value={formData.storeName}
                  onChange={(e) => {
                    const selectedStoreName = e.target.value;
                    handleChange('storeName', selectedStoreName);

                    // Auto-fill address and type if a registered store is selected
                    const selectedStore = REGISTERED_STORES.find(s => s.name === selectedStoreName);
                    if (selectedStore && selectedStore.id !== 'store-other') {
                      handleChange('storeAddress', selectedStore.address);
                      handleChange('storeType', selectedStore.type);
                      setIsCustomStore(false);
                    } else if (selectedStoreName === '🔍 Cửa hàng khác (nhập tay)') {
                      // Clear fields for manual input
                      handleChange('storeName', '');
                      handleChange('storeAddress', '');
                      handleChange('storeType', '');
                      setIsCustomStore(true);
                    }
                  }}
                  className={`${styles.select} ${errors.storeName ? styles.inputError : ''}`}
                >
                  <option value="">-- Chọn cửa hàng --</option>
                  {REGISTERED_STORES.map(store => (
                    <option key={store.id} value={store.name}>
                      {store.name}
                    </option>
                  ))}
                </select>
                {errors.storeName && (
                  <span className={styles.errorText}>
                    <AlertCircle size={14} />
                    {errors.storeName}
                  </span>
                )}
              </div>

              {isCustomStore && (
                <>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Tên cửa hàng</label>
                      <input
                        type="text"
                        value={formData.storeName}
                        onChange={(e) => handleChange('storeName', e.target.value)}
                        className={styles.input}
                        placeholder="Tên cửa hàng"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>Địa chỉ</label>
                      <input
                        type="text"
                        value={formData.storeAddress}
                        onChange={(e) => handleChange('storeAddress', e.target.value)}
                        className={styles.input}
                        placeholder="Địa chỉ cụ thể"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>Loại hình</label>
                      <select
                        value={formData.storeType}
                        onChange={(e) => handleChange('storeType', e.target.value)}
                        className={styles.select}
                      >
                        <option value="">-- Chọn loại hình --</option>
                        <option value="restaurant">Nhà hàng</option>
                        <option value="food_stall">Quán ăn</option>
                        <option value="retail">Cửa hàng bán lẻ</option>
                        <option value="supermarket">Siêu thị</option>
                        <option value="pharmacy">Nhà thuốc</option>
                        <option value="cosmetics">Mỹ phẩm</option>
                        <option value="online">Kinh doanh online</option>
                        <option value="other">Khác</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {!isCustomStore && (
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Địa chỉ</label>
                    <input
                      type="text"
                      value={formData.storeAddress}
                      onChange={(e) => handleChange('storeAddress', e.target.value)}
                      className={styles.input}
                      placeholder="Địa chỉ cụ thể"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Loại hình</label>
                    <select
                      value={formData.storeType}
                      onChange={(e) => handleChange('storeType', e.target.value)}
                      className={styles.select}
                    >
                      <option value="">-- Chọn loại hình --</option>
                      <option value="restaurant">Nhà hàng</option>
                      <option value="food_stall">Quán ăn</option>
                      <option value="retail">Cửa hàng bán lẻ</option>
                      <option value="supermarket">Siêu thị</option>
                      <option value="pharmacy">Nhà thuốc</option>
                      <option value="cosmetics">Mỹ phẩm</option>
                      <option value="online">Kinh doanh online</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* [3] Nội dung phản ánh */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>3. Nội dung phản ánh</h3>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Loại vấn đề <span className={styles.required}>*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className={`${styles.select} ${errors.category ? styles.inputError : ''}`}
                >
                  <option value="Niêm yết giá không đúng">Niêm yết giá không đúng</option>
                  <option value="Vi phạm VSATTP">Vi phạm VSATTP</option>
                  <option value="Hàng giả, hàng nhái">Hàng giả, hàng nhái</option>
                  <option value="Hàng không rõ nguồn gốc">Hàng không rõ nguồn gốc</option>
                  <option value="Hàng hết hạn">Hàng hết hạn</option>
                  <option value="Gian lận thương mại">Gian lận thương mại</option>
                  <option value="Vi phạm quy định kinh doanh">Vi phạm quy định kinh doanh</option>
                  <option value="Khác">Khác</option>
                </select>
                {errors.category && (
                  <span className={styles.errorText}>
                    <AlertCircle size={14} />
                    {errors.category}
                  </span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Mô tả chi tiết <span className={styles.required}>*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className={`${styles.textarea} ${errors.description ? styles.inputError : ''}`}
                  placeholder="Mô tả chi tiết về vấn đề, tình trạng, mức độ ảnh hưởng..."
                  rows={4}
                />
                {errors.description && (
                  <span className={styles.errorText}>
                    <AlertCircle size={14} />
                    {errors.description}
                  </span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Thời gian xảy ra</label>
                <input
                  type="datetime-local"
                  value={formData.incidentTime}
                  onChange={(e) => handleChange('incidentTime', e.target.value)}
                  className={styles.input}
                />
              </div>
            </div>

            {/* [4] Minh chứng */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>4. Minh chứng</h3>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Hình ảnh / Video <span className={styles.required}>*</span>
                </label>
                <div className={styles.uploadArea}>
                  <Upload size={24} className={styles.uploadIcon} />
                  <input
                    type="text"
                    value={formData.attachments}
                    onChange={(e) => handleChange('attachments', e.target.value)}
                    className={`${styles.input} ${errors.attachments ? styles.inputError : ''}`}
                    placeholder="URL hình ảnh/video hoặc nhấn để tải lên"
                  />
                  <p className={styles.uploadHint}>
                    Hỗ trợ: JPG, PNG, MP4 - Tối đa 10MB
                  </p>
                </div>
                {errors.attachments && (
                  <span className={styles.errorText}>
                    <AlertCircle size={14} />
                    {errors.attachments}
                  </span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Ghi chú minh chứng</label>
                <textarea
                  value={formData.evidenceNote}
                  onChange={(e) => handleChange('evidenceNote', e.target.value)}
                  className={styles.textarea}
                  placeholder="Mô tả về hình ảnh/video đính kèm..."
                  rows={2}
                />
              </div>
            </div>

            {/* [5] Người cung cấp */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>5. Người cung cấp (tùy chọn)</h3>

              <div className={styles.formGroup}>
                <div className={styles.anonymousToggle}>
                  <label className={styles.toggleLabel}>
                    <input
                      type="checkbox"
                      checked={formData.isAnonymous}
                      onChange={(e) => handleChange('isAnonymous', e.target.checked)}
                      className={styles.checkbox}
                    />
                    <div className={styles.toggleButton}>
                      {formData.isAnonymous ? (
                        <>
                          <UserX size={16} />
                          <span>Ẩn danh</span>
                        </>
                      ) : (
                        <>
                          <User size={16} />
                          <span>Cung cấp thông tin liên hệ</span>
                        </>
                      )}
                    </div>
                  </label>
                </div>
              </div>

              {!formData.isAnonymous && (
                <>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Họ và tên <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.reporterName}
                        onChange={(e) => handleChange('reporterName', e.target.value)}
                        className={`${styles.input} ${errors.reporterName ? styles.inputError : ''}`}
                        placeholder="Họ và tên người cung cấp"
                      />
                      {errors.reporterName && (
                        <span className={styles.errorText}>
                          <AlertCircle size={14} />
                          {errors.reporterName}
                        </span>
                      )}
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Số điện thoại <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="tel"
                        value={formData.reporterPhone}
                        onChange={(e) => handleChange('reporterPhone', e.target.value)}
                        className={`${styles.input} ${errors.reporterPhone ? styles.inputError : ''}`}
                        placeholder="0xxxxxxxxx"
                      />
                      {errors.reporterPhone && (
                        <span className={styles.errorText}>
                          <AlertCircle size={14} />
                          {errors.reporterPhone}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Email</label>
                    <input
                      type="email"
                      value={formData.reporterEmail}
                      onChange={(e) => handleChange('reporterEmail', e.target.value)}
                      className={`${styles.input} ${errors.reporterEmail ? styles.inputError : ''}`}
                      placeholder="email@example.com"
                    />
                    {errors.reporterEmail && (
                      <span className={styles.errorText}>
                        <AlertCircle size={14} />
                        {errors.reporterEmail}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className={styles.footer}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className={styles.saveButton}>
              <Save size={18} />
              {mode === 'create' ? 'Tạo nguồn tin' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
