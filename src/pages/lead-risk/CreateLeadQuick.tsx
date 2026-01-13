import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Save, 
  X, 
  MapPin, 
  Phone, 
  Globe, 
  User, 
  FileText,
  AlertCircle,
  Clock,
  ChevronDown
} from 'lucide-react';
import { toast } from 'sonner';
import styles from './CreateLeadQuick.module.css';

interface FormData {
  source: string;
  sourceDetail: string;
  description: string;
  urgency: 'critical' | 'high' | 'medium' | 'low';
  area: string;
  district: string;
  address: string;
  coordinates: string;
  contactName: string;
  contactPhone: string;
}

export default function CreateLeadQuick() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    source: '',
    sourceDetail: '',
    description: '',
    urgency: 'medium',
    area: '',
    district: '',
    address: '',
    coordinates: '',
    contactName: '',
    contactPhone: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sourceTypes = [
    { value: 'hotline', label: 'Hotline 1800', icon: Phone },
    { value: 'inspector', label: 'Thanh tra viên', icon: User },
    { value: 'website', label: 'Website', icon: Globe },
    { value: 'mobile', label: 'Mobile App', icon: Globe },
    { value: 'email', label: 'Email', icon: FileText },
  ];

  const urgencyLevels = [
    { value: 'critical', label: 'Khẩn cấp', color: 'rgba(239, 68, 68, 1)', description: 'Cần xử lý ngay' },
    { value: 'high', label: 'Cao', color: 'rgba(251, 146, 60, 1)', description: 'Trong 24h' },
    { value: 'medium', label: 'Trung bình', color: 'rgba(234, 179, 8, 1)', description: 'Trong 3 ngày' },
    { value: 'low', label: 'Thấp', color: 'rgba(148, 163, 184, 1)', description: 'Trong tuần' },
  ];

  const districts = [
    'Quận 1', 'Quận 2', 'Quận 3', 'Quận 4', 'Quận 5',
    'Quận 6', 'Quận 7', 'Quận 8', 'Quận 9', 'Quận 10',
    'Quận 11', 'Quận 12', 'Bình Thạnh', 'Tân Bình', 'Tân Phú',
    'Phú Nhuận', 'Gò Vấp', 'Bình Tân', 'Thủ Đức'
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.source) {
      newErrors.source = 'Vui lòng chọn nguồn tin';
    }

    if (!formData.description || formData.description.trim().length < 10) {
      newErrors.description = 'Mô tả phải có ít nhất 10 ký tự';
    }

    if (!formData.district) {
      newErrors.district = 'Vui lòng chọn địa bàn';
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

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      const newLeadId = `L-2024-${Math.floor(1000 + Math.random() * 9000)}`;
      
      toast.success(`Đã tạo lead ${newLeadId} thành công!`);
      navigate(`/lead-risk/lead/${newLeadId}`);
    } catch (error) {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (confirm('Bạn có chắc muốn hủy? Dữ liệu đã nhập sẽ bị mất.')) {
      navigate(-1);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <h1 className={styles.title}>Tạo Lead nhanh</h1>
          <p className={styles.subtitle}>Tạo nguồn tin trong 60 giây</p>
        </div>

        <div className={styles.timer}>
          <Clock size={16} />
          <span>Mục tiêu: &lt; 60s</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Main Card */}
        <div className={styles.card}>
          {/* Source Type */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              1. Nguồn tin <span className={styles.required}>*</span>
            </h2>
            
            <div className={styles.sourceGrid}>
              {sourceTypes.map((source) => {
                const IconComponent = source.icon;
                return (
                  <button
                    key={source.value}
                    type="button"
                    className={`${styles.sourceButton} ${
                      formData.source === source.value ? styles.sourceButtonActive : ''
                    }`}
                    onClick={() => setFormData({ ...formData, source: source.value })}
                  >
                    <IconComponent size={24} />
                    <span>{source.label}</span>
                  </button>
                );
              })}
            </div>
            {errors.source && (
              <div className={styles.error}>
                <AlertCircle size={14} />
                {errors.source}
              </div>
            )}

            {formData.source && (
              <div className={styles.inputGroup}>
                <label>Chi tiết nguồn (tùy chọn)</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Thanh tra viên Nguyễn Văn A, Hotline call ID 12345"
                  value={formData.sourceDetail}
                  onChange={(e) => setFormData({ ...formData, sourceDetail: e.target.value })}
                  className={styles.input}
                />
              </div>
            )}
          </div>

          {/* Description */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              2. Mô tả sự việc <span className={styles.required}>*</span>
            </h2>
            
            <div className={styles.inputGroup}>
              <textarea
                placeholder="Mô tả ngắn gọn về sự việc, vi phạm, khiếu nại..."
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className={`${styles.textarea} ${errors.description ? styles.inputError : ''}`}
              />
              <div className={styles.charCount}>
                {formData.description.length} / 500 ký tự
              </div>
              {errors.description && (
                <div className={styles.error}>
                  <AlertCircle size={14} />
                  {errors.description}
                </div>
              )}
            </div>
          </div>

          {/* Urgency */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              3. Mức độ khẩn cấp <span className={styles.required}>*</span>
            </h2>
            
            <div className={styles.urgencyGrid}>
              {urgencyLevels.map((level) => (
                <button
                  key={level.value}
                  type="button"
                  className={`${styles.urgencyButton} ${
                    formData.urgency === level.value ? styles.urgencyButtonActive : ''
                  }`}
                  onClick={() => setFormData({ ...formData, urgency: level.value as any })}
                  style={{
                    borderColor: formData.urgency === level.value ? level.color : 'var(--border)',
                  }}
                >
                  <div
                    className={styles.urgencyDot}
                    style={{ backgroundColor: level.color }}
                  ></div>
                  <div className={styles.urgencyContent}>
                    <div className={styles.urgencyLabel}>{level.label}</div>
                    <div className={styles.urgencyDescription}>{level.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              4. Địa điểm <span className={styles.required}>*</span>
            </h2>
            
            <div className={styles.locationGrid}>
              <div className={styles.inputGroup}>
                <label>Quận/Huyện</label>
                <div className={styles.selectWrapper}>
                  <select
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className={`${styles.select} ${errors.district ? styles.inputError : ''}`}
                  >
                    <option value="">Chọn quận/huyện</option>
                    {districts.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={16} className={styles.selectIcon} />
                </div>
                {errors.district && (
                  <div className={styles.error}>
                    <AlertCircle size={14} />
                    {errors.district}
                  </div>
                )}
              </div>

              <div className={styles.inputGroup}>
                <label>Địa chỉ cụ thể (tùy chọn)</label>
                <input
                  type="text"
                  placeholder="Số nhà, tên đường..."
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>Tọa độ GPS (tùy chọn)</label>
              <div className={styles.coordinatesInput}>
                <MapPin size={16} className={styles.inputIcon} />
                <input
                  type="text"
                  placeholder="10.7769, 106.7009"
                  value={formData.coordinates}
                  onChange={(e) => setFormData({ ...formData, coordinates: e.target.value })}
                  className={styles.input}
                />
                <button
                  type="button"
                  className={styles.getCurrentLocation}
                  onClick={() => {
                    navigator.geolocation.getCurrentPosition((pos) => {
                      setFormData({
                        ...formData,
                        coordinates: `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`,
                      });
                      toast.success('Đã lấy vị trí hiện tại');
                    });
                  }}
                >
                  Vị trí hiện tại
                </button>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>5. Thông tin liên hệ (tùy chọn)</h2>
            
            <div className={styles.contactGrid}>
              <div className={styles.inputGroup}>
                <label>Tên người báo cáo</label>
                <input
                  type="text"
                  placeholder="Họ và tên"
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Số điện thoại</label>
                <input
                  type="tel"
                  placeholder="0901234567"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  className={styles.input}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            <X size={16} />
            Hủy
          </button>

          <div className={styles.actionsSpacer}></div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className={styles.spinner}></div>
                Đang tạo...
              </>
            ) : (
              <>
                <Save size={16} />
                Tạo Lead
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
