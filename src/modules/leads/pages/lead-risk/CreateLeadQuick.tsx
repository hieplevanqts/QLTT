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
import { getSupabaseClient } from '@/utils/supabaseClient';
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
    'Phường 1', 'Phường 2', 'Phường 3', 'Phường 4', 'Phường 5',
    'Phường 6', 'Phường 7', 'Phường 8', 'Phường 9', 'Phường 10',
    'Phường 11', 'Phường 12', 'Bình Thạnh', 'Tân Bình', 'Tân Phú',
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
      const supabase = getSupabaseClient();

      // Generate Lead Code: LEAD-YYYYMM-XXXX
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const prefix = `LEAD-${year}${month}`;

      // Find the latest lead code with this prefix to increment
      const { data: latestLead } = await supabase
        .from('leads')
        .select('code')
        .ilike('code', `${prefix}-%`)
        .order('code', { ascending: false })
        .limit(1)
        .single();

      let sequence = 1;
      if (latestLead && latestLead.code) {
        const parts = latestLead.code.split('-');
        const lastSeq = parseInt(parts[2]); // LEAD-YYYYMM-XXXX -> parts[2] is XXXX
        if (!isNaN(lastSeq)) {
          sequence = lastSeq + 1;
        }
      }

      const generatedCode = `${prefix}-${String(sequence).padStart(4, '0')}`;

      // Parse coordinates
      let lat = 10.762622; // Default HCMC
      let lng = 106.660172;

      if (formData.coordinates) {
        const parts = formData.coordinates.split(',').map(p => p.trim());
        if (parts.length === 2) {
          const pLat = parseFloat(parts[0]);
          const pLng = parseFloat(parts[1]);
          if (!isNaN(pLat) && !isNaN(pLng)) {
            lat = pLat;
            lng = pLng;
          }
        }
      }

      // Prepare payload
      const payload = {
        code: generatedCode,
        title: formData.sourceDetail ? `${formData.source} - ${formData.sourceDetail}` : formData.source,
        description: formData.description,
        severity: formData.urgency,
        location: {
          province: 'TP. Hồ Chí Minh', // Default
          district: formData.district,
          ward: '', // Not in quick form
          address: formData.address || `${formData.district}, Hà Nội`,
          lat: lat,
          lng: lng
        },
        reporter_name: formData.contactName || 'Người dân',
        reporter_phone: formData.contactPhone || null,

        // Default fields for required columns
        status: 'new',
        category: 'other',
        occurred_at: new Date().toISOString(),
        created_by: 'admin', // Placeholder
        sla: {
          response_hours: 24,
          resolution_hours: 72
        }
      };

      // Insert into leads table
      // Note: trigger should handle lead code generation if configured, 
      // otherwise we might need the edge function if this fails on 'code' constraint.
      // Trying direct insert first as requested.
      const { data, error } = await supabase
        .from('leads')
        .insert([payload])
        .select()
        .single();

      if (error) {
        console.error('Error creating lead:', error);
        throw error;
      }

      const newLead = data;
      const newLeadId = newLead.code || newLead._id; // Fallback

      toast.success(`Đã tạo nhanh nguồn tin ${newLeadId} thành công!`);
      navigate(`/lead-risk/lead/${newLeadId}`); // Adjust route if needed, usually /lead-risk/leads/:id or similar.
      // Assuming route is /lead-risk/lead/:id based on previous simulated code.

    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Có lỗi xảy ra khi tạo nguồn tin. Vui lòng thử lại.');
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
          <h1 className={styles.title}>Tạo nhanh nguồn tin</h1>
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
                    className={`${styles.sourceButton} ${formData.source === source.value ? styles.sourceButtonActive : ''
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
                  className={`${styles.urgencyButton} ${formData.urgency === level.value ? styles.urgencyButtonActive : ''
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
                <label>Phường/Xã</label>
                <div className={styles.selectWrapper}>
                  <select
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className={`${styles.select} ${errors.district ? styles.inputError : ''}`}
                  >
                    <option value="">Chọn Phường/Xã</option>
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
